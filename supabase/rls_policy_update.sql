-- =============================================
-- VITRU IA - Ajuste RLS para Acesso Público à Biblioteca
-- =============================================
-- Este ajuste garante que o Portal do Aluno consiga ler os exercícios
-- mesmo sem estar logado no Supabase Auth padrão.
-- =============================================

-- Permitir que qualquer pessoa (incluindo 'anon') leia exercícios ativos
DROP POLICY IF EXISTS "exercicio_biblioteca_select" ON exercicios_biblioteca;
CREATE POLICY "exercicio_biblioteca_select_v2" ON exercicios_biblioteca FOR SELECT
    USING (ativo = TRUE);

-- Nota: As políticas de INSERT/UPDATE/DELETE para GOD (leonardo@schweitzer.ai) 
-- foram mantidas conforme configurado no arquivo god-rls-biblioteca.sql.
