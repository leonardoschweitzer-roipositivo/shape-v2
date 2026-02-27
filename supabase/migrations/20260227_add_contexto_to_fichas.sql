-- Migration: Adicionar campo 'contexto' JSONB à tabela 'fichas'
-- Descrição: Campo para armazenar contexto geral do atleta (saúde, medicações, lesões, 
--            estilo de vida, profissão, histórico de treino e dietas).
-- Data: 2026-02-27
-- Tipo: Não-destrutiva (adiciona coluna, sem perda de dados)

-- ============================================
-- EXECUTAR NO SUPABASE DASHBOARD > SQL EDITOR
-- ============================================

ALTER TABLE fichas
ADD COLUMN IF NOT EXISTS contexto JSONB DEFAULT NULL;

COMMENT ON COLUMN fichas.contexto IS 'Contexto geral do atleta: problemas de saúde, medicações, dores/lesões, exames, estilo de vida, profissão, histórico de treino e dietas. Armazenado como JSONB flexível.';

-- Estrutura esperada do JSON:
-- {
--   "problemas_saude": "Diabetes tipo 2, Hipertensão",
--   "medicacoes": "Tirzepatida 5mg/semana, TRT 200mg/semana",
--   "dores_lesoes": "Dor no ombro esquerdo ao elevar acima de 90°",
--   "exames": "Hemograma 01/2026 - tudo normal",
--   "estilo_vida": "Sedentário, dorme 6h/noite",
--   "profissao": "Programador, home office",
--   "historico_treino": "Treina há 3 anos, parou 6 meses",
--   "historico_dietas": "Fez low carb 3 meses, perdeu 5kg mas não sustentou",
--   "atualizado_em": "2026-02-27T14:30:00.000Z",
--   "atualizado_por": "personal-id-xxx"
-- }
