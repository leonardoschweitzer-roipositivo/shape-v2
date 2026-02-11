-- =============================================
-- VITRU IA - Portal RLS Fix v2
-- =============================================
-- Corrige recursividade infinita nas policies RLS
-- usando security definer functions
-- Rodar no SQL Editor do Supabase Dashboard
-- =============================================

-- 1. Criar função auxiliar que busca atleta IDs com token válido
-- (security definer bypassa RLS, quebrando o ciclo de recursão)
CREATE OR REPLACE FUNCTION public.get_portal_atleta_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT id FROM public.atletas
    WHERE portal_token IS NOT NULL
    AND portal_token != ''
    AND (portal_token_expira IS NULL OR portal_token_expira > now());
$$;

-- 2. Criar função que retorna personal_ids com atletas tokenizados
CREATE OR REPLACE FUNCTION public.get_portal_personal_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT DISTINCT personal_id FROM public.atletas
    WHERE portal_token IS NOT NULL
    AND portal_token != ''
    AND (portal_token_expira IS NULL OR portal_token_expira > now());
$$;

-- =============================================
-- 3. Recriar policies ATLETAS para anon
-- =============================================
DROP POLICY IF EXISTS "atletas_portal_select" ON atletas;
DROP POLICY IF EXISTS "atletas_portal_update" ON atletas;

-- Leitura: direta (sem subquery, sem recursão)
CREATE POLICY "atletas_portal_select" ON atletas FOR SELECT
    TO anon
    USING (
        portal_token IS NOT NULL
        AND portal_token != ''
        AND (portal_token_expira IS NULL OR portal_token_expira > now())
    );

-- Update: contadores de acesso
CREATE POLICY "atletas_portal_update" ON atletas FOR UPDATE
    TO anon
    USING (
        portal_token IS NOT NULL
        AND portal_token != ''
        AND (portal_token_expira IS NULL OR portal_token_expira > now())
    );

-- =============================================
-- 4. Recriar policies PERSONAIS para anon
-- =============================================
DROP POLICY IF EXISTS "personais_portal_select" ON personais;

-- Usa security definer function para evitar recursão
CREATE POLICY "personais_portal_select" ON personais FOR SELECT
    TO anon
    USING (id IN (SELECT public.get_portal_personal_ids()));

-- =============================================
-- 5. Recriar policies FICHAS para anon
-- =============================================
DROP POLICY IF EXISTS "fichas_portal_select" ON fichas;

CREATE POLICY "fichas_portal_select" ON fichas FOR SELECT
    TO anon
    USING (atleta_id IN (SELECT public.get_portal_atleta_ids()));

-- =============================================
-- 6. Recriar policies MEDIDAS para anon
-- =============================================
DROP POLICY IF EXISTS "medidas_portal_select" ON medidas;
DROP POLICY IF EXISTS "medidas_portal_insert" ON medidas;

CREATE POLICY "medidas_portal_select" ON medidas FOR SELECT
    TO anon
    USING (atleta_id IN (SELECT public.get_portal_atleta_ids()));

CREATE POLICY "medidas_portal_insert" ON medidas FOR INSERT
    TO anon
    WITH CHECK (atleta_id IN (SELECT public.get_portal_atleta_ids()));

-- =============================================
-- 7. Recriar policies AVALIACOES para anon
-- =============================================
DROP POLICY IF EXISTS "avaliacoes_portal_select" ON avaliacoes;

CREATE POLICY "avaliacoes_portal_select" ON avaliacoes FOR SELECT
    TO anon
    USING (atleta_id IN (SELECT public.get_portal_atleta_ids()));

SELECT '✅ Portal RLS v2 aplicado — sem recursão!' AS status;
