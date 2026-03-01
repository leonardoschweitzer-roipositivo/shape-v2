-- =====================================================
-- FIX CORRETO: Políticas de DELETE para exclusão de atletas
-- A tabela atletas usa personal_id = personais.id (NÃO auth.uid())
-- Por isso as políticas precisam de JOIN com personais
-- Execute no Supabase → SQL Editor
-- =====================================================

-- =====================================================
-- OPÇÃO A (RECOMENDADA): Desabilitar RLS nas tabelas
-- de dados internos e confiar na segurança do app.
-- (Simples e funciona sem token service_role)
-- =====================================================

-- Se preferir desabilitar RLS para essas tabelas de dados:
-- ALTER TABLE atletas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE fichas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE medidas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE assessments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE diagnosticos DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE planos_treino DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE planos_dieta DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- OPÇÃO B: Políticas RLS corretas com JOIN em personais
-- (Usa auth.uid() → personais.auth_user_id → personais.id → atletas.personal_id)
-- =====================================================

-- Tabela: atletas
DROP POLICY IF EXISTS "personal pode deletar seus atletas" ON atletas;
CREATE POLICY "personal pode deletar seus atletas"
  ON atletas FOR DELETE
  USING (
    personal_id IN (
      SELECT id FROM personais WHERE auth_user_id = auth.uid()
    )
  );

-- Tabela: fichas
DROP POLICY IF EXISTS "personal pode deletar fichas de seus atletas" ON fichas;
CREATE POLICY "personal pode deletar fichas de seus atletas"
  ON fichas FOR DELETE
  USING (
    atleta_id IN (
      SELECT a.id FROM atletas a
      INNER JOIN personais p ON p.id = a.personal_id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Tabela: medidas
DROP POLICY IF EXISTS "personal pode deletar medidas de seus atletas" ON medidas;
CREATE POLICY "personal pode deletar medidas de seus atletas"
  ON medidas FOR DELETE
  USING (
    atleta_id IN (
      SELECT a.id FROM atletas a
      INNER JOIN personais p ON p.id = a.personal_id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Tabela: assessments
DROP POLICY IF EXISTS "personal pode deletar assessments de seus atletas" ON assessments;
CREATE POLICY "personal pode deletar assessments de seus atletas"
  ON assessments FOR DELETE
  USING (
    atleta_id IN (
      SELECT a.id FROM atletas a
      INNER JOIN personais p ON p.id = a.personal_id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Tabela: diagnosticos
DROP POLICY IF EXISTS "personal pode deletar diagnosticos de seus atletas" ON diagnosticos;
CREATE POLICY "personal pode deletar diagnosticos de seus atletas"
  ON diagnosticos FOR DELETE
  USING (
    atleta_id IN (
      SELECT a.id FROM atletas a
      INNER JOIN personais p ON p.id = a.personal_id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Tabela: planos_treino
DROP POLICY IF EXISTS "personal pode deletar planos_treino de seus atletas" ON planos_treino;
CREATE POLICY "personal pode deletar planos_treino de seus atletas"
  ON planos_treino FOR DELETE
  USING (
    atleta_id IN (
      SELECT a.id FROM atletas a
      INNER JOIN personais p ON p.id = a.personal_id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- Tabela: planos_dieta
DROP POLICY IF EXISTS "personal pode deletar planos_dieta de seus atletas" ON planos_dieta;
CREATE POLICY "personal pode deletar planos_dieta de seus atletas"
  ON planos_dieta FOR DELETE
  USING (
    atleta_id IN (
      SELECT a.id FROM atletas a
      INNER JOIN personais p ON p.id = a.personal_id
      WHERE p.auth_user_id = auth.uid()
    )
  );

-- =====================================================
-- Verificação: listar políticas DELETE criadas
-- =====================================================
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('atletas','fichas','medidas','assessments','diagnosticos','planos_treino','planos_dieta')
  AND cmd = 'DELETE'
ORDER BY tablename;
