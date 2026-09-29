-- =============================================
-- VITRU IA — FASE 3: Treinos (1 plano ativo por aluno, criação atômica, modelos)
-- =============================================
-- Rodar DEPOIS das Fases 0–2 (usa app_meu_personal_id). Idempotente.
--
-- ─── PRÉ-CHECK ──────────────────────────────────────────────────────────────
-- a) Estrutura da tabela (não está versionada no repo):
--    SELECT column_name, data_type FROM information_schema.columns
--    WHERE table_name = 'planos_treino' ORDER BY ordinal_position;
--    (precisa ter: id, atleta_id, personal_id, diagnostico_id, dados, status, created_at)
--
-- b) Alunos com mais de um plano ativo (serão corrigidos: fica o mais recente):
--    SELECT atleta_id, count(*) FROM planos_treino WHERE status = 'ativo'
--    GROUP BY 1 HAVING count(*) > 1;
-- =============================================


-- =============================================
-- 1. Um único plano de treino ativo por aluno
-- =============================================
-- Dedupe: mantém o ativo mais recente, os demais viram histórico (inativo)
UPDATE planos_treino p
SET status = 'inativo'
WHERE p.status = 'ativo'
  AND EXISTS (
      SELECT 1 FROM planos_treino q
      WHERE q.atleta_id = p.atleta_id AND q.status = 'ativo'
        AND (q.created_at > p.created_at OR (q.created_at = p.created_at AND q.id > p.id))
  );

CREATE UNIQUE INDEX IF NOT EXISTS planos_treino_um_ativo_por_atleta
    ON planos_treino (atleta_id) WHERE status = 'ativo';


-- =============================================
-- 2. RPC criar_plano_treino — desativa o ativo e insere o novo numa transação
-- =============================================
-- SECURITY INVOKER: vale a RLS de quem chama (personal dono do aluno, ou o próprio aluno
-- no onboarding VITRU IA). O plano antigo vira histórico (registros antigos continuam
-- apontando para ele).
CREATE OR REPLACE FUNCTION public.criar_plano_treino(
    p_atleta_id      uuid,
    p_dados          jsonb,
    p_diagnostico_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_personal uuid;
    v_id       uuid;
BEGIN
    IF p_dados IS NULL OR jsonb_typeof(p_dados -> 'treinos') IS DISTINCT FROM 'array' THEN
        RAISE EXCEPTION 'PLANO_INVALIDO';
    END IF;

    SELECT personal_id INTO v_personal FROM atletas WHERE id = p_atleta_id;
    IF v_personal IS NULL THEN
        RAISE EXCEPTION 'ATLETA_NAO_ENCONTRADO';
    END IF;

    UPDATE planos_treino SET status = 'inativo'
    WHERE atleta_id = p_atleta_id AND status = 'ativo';

    INSERT INTO planos_treino (atleta_id, personal_id, diagnostico_id, dados, status)
    VALUES (p_atleta_id, v_personal, p_diagnostico_id, p_dados, 'ativo')
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.criar_plano_treino(uuid, jsonb, uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.criar_plano_treino(uuid, jsonb, uuid) TO authenticated;


-- =============================================
-- 3. Modelos de treino do personal (reaproveitar entre alunos)
-- =============================================
CREATE TABLE IF NOT EXISTS public.treino_modelos (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_id uuid NOT NULL DEFAULT public.app_meu_personal_id() REFERENCES personais(id) ON DELETE CASCADE,
    nome        text NOT NULL CHECK (length(trim(nome)) >= 2),
    descricao   text,
    dados       jsonb NOT NULL,            -- { treinos: TreinoDetalhado[], observacoes?: {...} }
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS treino_modelos_personal_nome_uniq
    ON public.treino_modelos (personal_id, lower(nome));

ALTER TABLE public.treino_modelos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "treino_modelos_dono_select" ON public.treino_modelos;
DROP POLICY IF EXISTS "treino_modelos_dono_insert" ON public.treino_modelos;
DROP POLICY IF EXISTS "treino_modelos_dono_update" ON public.treino_modelos;
DROP POLICY IF EXISTS "treino_modelos_dono_delete" ON public.treino_modelos;

CREATE POLICY "treino_modelos_dono_select" ON public.treino_modelos FOR SELECT
    USING (personal_id = public.app_meu_personal_id());
CREATE POLICY "treino_modelos_dono_insert" ON public.treino_modelos FOR INSERT
    WITH CHECK (personal_id = public.app_meu_personal_id());
CREATE POLICY "treino_modelos_dono_update" ON public.treino_modelos FOR UPDATE
    USING (personal_id = public.app_meu_personal_id())
    WITH CHECK (personal_id = public.app_meu_personal_id());
CREATE POLICY "treino_modelos_dono_delete" ON public.treino_modelos FOR DELETE
    USING (personal_id = public.app_meu_personal_id());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.treino_modelos TO authenticated;

CREATE OR REPLACE FUNCTION public.trg_treino_modelos_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_treino_modelos_updated_at ON public.treino_modelos;
CREATE TRIGGER trg_treino_modelos_updated_at
    BEFORE UPDATE ON public.treino_modelos
    FOR EACH ROW EXECUTE FUNCTION public.trg_treino_modelos_updated_at();


SELECT '✅ Fase 3 aplicada: 1 plano ativo por aluno, criar_plano_treino, treino_modelos' AS status;
