-- Migration: Adicionar coluna 'objetivo_vitruvio' à tabela 'fichas'
-- Descrição: Armazena o objetivo Vitrúvio (BULK/CUT/RECOMP/GOLDEN_RATIO/TRANSFORM/MAINTAIN)
--            selecionado pelo personal no Diagnóstico. Usado como fonte da verdade
--            para o Plano de Treino e o Plano de Dieta.
-- Data: 2026-04-18
-- Tipo: Não-destrutiva (ADD COLUMN IF NOT EXISTS).

-- ============================================
-- EXECUTAR NO SUPABASE DASHBOARD > SQL EDITOR
-- ============================================

ALTER TABLE fichas
ADD COLUMN IF NOT EXISTS objetivo_vitruvio TEXT DEFAULT NULL;

-- Constraint de valores permitidos (só adiciona se ainda não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fichas_objetivo_vitruvio_check'
    ) THEN
        ALTER TABLE fichas
        ADD CONSTRAINT fichas_objetivo_vitruvio_check
        CHECK (
            objetivo_vitruvio IS NULL
            OR objetivo_vitruvio IN ('BULK', 'CUT', 'RECOMP', 'GOLDEN_RATIO', 'TRANSFORM', 'MAINTAIN')
        );
    END IF;
END $$;

COMMENT ON COLUMN fichas.objetivo_vitruvio IS 'Objetivo Vitrúvio selecionado no Diagnóstico (override manual possível pelo personal). Fonte da verdade para Treino e Dieta.';
