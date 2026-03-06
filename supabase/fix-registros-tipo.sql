-- =============================================
-- VITRU IA - Update Registros Diários Tipo
-- =============================================
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Remove a restrição antiga que não permitia o tipo 'feedback'
ALTER TABLE registros_diarios DROP CONSTRAINT IF EXISTS registros_diarios_tipo_check;

-- 2. Adiciona a nova restrição contemplando todos os rastreamentos do Portal
ALTER TABLE registros_diarios ADD CONSTRAINT registros_diarios_tipo_check 
CHECK (tipo IN ('agua', 'sono', 'peso', 'treino', 'dor', 'refeicao', 'feedback'));

-- Fim.
