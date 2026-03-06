-- =============================================
-- VITRU IA - RLS para Gestão GOD na Biblioteca
-- =============================================
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Remover policies antigas de INSERT e UPDATE (restrictivas demais)
DROP POLICY IF EXISTS "exercicio_biblioteca_insert" ON exercicios_biblioteca;
DROP POLICY IF EXISTS "exercicio_biblioteca_update" ON exercicios_biblioteca;

-- 2. Nova policy de UPDATE: permite para GOD (whitelist de emails)
CREATE POLICY "exercicio_biblioteca_update_god" ON exercicios_biblioteca FOR UPDATE
    USING (
        auth.role() = 'authenticated'
        AND (auth.jwt() ->> 'email') IN (
            'leonardo@schweitzer.ai',
            'admin@vitruia.com',
            'god@vitruia.com'
        )
    );

-- 3. Nova policy de INSERT: permite para GOD (whitelist de emails)
CREATE POLICY "exercicio_biblioteca_insert_god" ON exercicios_biblioteca FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated'
        AND (auth.jwt() ->> 'email') IN (
            'leonardo@schweitzer.ai',
            'admin@vitruia.com',
            'god@vitruia.com'
        )
    );

-- 4. Policy de DELETE: apenas GOD pode deletar (futuro)
CREATE POLICY "exercicio_biblioteca_delete_god" ON exercicios_biblioteca FOR DELETE
    USING (
        auth.role() = 'authenticated'
        AND (auth.jwt() ->> 'email') IN (
            'leonardo@schweitzer.ai',
            'admin@vitruia.com',
            'god@vitruia.com'
        )
    );

-- =============================================
-- PRONTO! Agora o GOD (leonardo@schweitzer.ai) pode:
-- ✅ Fazer upload de vídeos (UPDATE url_video)
-- ✅ Inserir novos exercícios (INSERT)
-- ✅ Deletar exercícios (DELETE)
-- ✅ Leitura continua aberta para todos autenticados
-- =============================================
