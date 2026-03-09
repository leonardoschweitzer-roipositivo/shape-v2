-- ============================================================
-- Migration: Suporte a Avaliação Corporal Virtual (IA Vision)
-- Data: 2026-03-09
-- Descrição: Expande registrado_por + cria medidas_ia_metadata + bucket
-- ============================================================

-- 1. Expandir registrado_por para aceitar 'IA_VISION'
-- (se for VARCHAR já funciona, se for enum precisa ALTER TYPE)
DO $$
BEGIN
  -- Tenta alterar o tipo para TEXT se for enum
  BEGIN
    ALTER TABLE medidas ALTER COLUMN registrado_por TYPE TEXT;
  EXCEPTION WHEN others THEN
    -- Já é TEXT/VARCHAR, ignora
    NULL;
  END;
END $$;

-- Adicionar constraint para valores válidos (se não existir)
ALTER TABLE medidas DROP CONSTRAINT IF EXISTS medidas_registrado_por_check;
ALTER TABLE medidas ADD CONSTRAINT medidas_registrado_por_check 
  CHECK (registrado_por IN ('PORTAL', 'COACH_IA', 'PERSONAL', 'APP', 'IA_VISION'));

-- 2. Tabela de metadados da análise IA
CREATE TABLE IF NOT EXISTS medidas_ia_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medida_id UUID NOT NULL REFERENCES medidas(id) ON DELETE CASCADE,
  atleta_id UUID NOT NULL,
  
  -- Paths das 4 imagens no Storage
  frontal_image_path TEXT NOT NULL,
  costas_image_path TEXT NOT NULL,
  lateral_esq_image_path TEXT NOT NULL,
  lateral_dir_image_path TEXT NOT NULL,
  
  -- Objeto de referência usado
  reference_object VARCHAR(20) NOT NULL,
  
  -- Qualidade e confiança
  overall_confidence VARCHAR(10) NOT NULL,
  image_quality_score INTEGER,
  analysis_notes TEXT[],
  
  -- Confiança por medida (JSON: {"ombros": "high", "cintura": "medium", ...})
  confidence_per_measurement JSONB,
  
  -- Metadata do processamento
  ai_model_used VARCHAR(50) DEFAULT 'gemini-2.0-flash',
  processing_time_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_ia_confidence CHECK (overall_confidence IN ('high', 'medium', 'low')),
  CONSTRAINT valid_reference_object CHECK (reference_object IN ('credit_card', 'a4_paper', 'tape_measure'))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ia_metadata_medida ON medidas_ia_metadata(medida_id);
CREATE INDEX IF NOT EXISTS idx_ia_metadata_atleta ON medidas_ia_metadata(atleta_id, created_at DESC);

-- 3. RLS para medidas_ia_metadata
ALTER TABLE medidas_ia_metadata ENABLE ROW LEVEL SECURITY;

-- Personal vê metadados dos seus alunos (via auth)
CREATE POLICY "personal_view_ia_metadata" ON medidas_ia_metadata
  FOR SELECT USING (
    atleta_id IN (
      SELECT a.id FROM atletas a
      JOIN personais p ON a.personal_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Atleta vê próprios metadados (via token do portal)
CREATE POLICY "atleta_view_own_ia_metadata" ON medidas_ia_metadata
  FOR SELECT USING (
    atleta_id IN (
      SELECT id FROM atletas 
      WHERE portal_token = coalesce(
        current_setting('request.headers', true)::json->>'x-portal-token',
        ''
      )
      AND portal_token IS NOT NULL
    )
  );

-- Service role pode inserir (Edge Function usa service role key)
CREATE POLICY "service_insert_ia_metadata" ON medidas_ia_metadata
  FOR INSERT WITH CHECK (true);

-- 4. Bucket de storage para fotos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'body-assessment-photos', 
  'body-assessment-photos', 
  false,
  5242880,  -- 5MB por arquivo
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: atleta acessa próprias fotos (via token)
CREATE POLICY "atleta_storage_own_photos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'body-assessment-photos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM atletas 
      WHERE portal_token = coalesce(
        current_setting('request.headers', true)::json->>'x-portal-token',
        ''
      )
      AND portal_token IS NOT NULL
    )
  );

-- Storage RLS: personal vê fotos dos alunos (via auth)
CREATE POLICY "personal_storage_view_photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'body-assessment-photos' AND
    (storage.foldername(name))[1] IN (
      SELECT a.id::text FROM atletas a
      JOIN personais p ON a.personal_id = p.id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Storage RLS: service role pode inserir (Edge Function)
CREATE POLICY "service_storage_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'body-assessment-photos'
  );
