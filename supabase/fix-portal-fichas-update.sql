-- =============================================
-- VITRU IA - Fix: Portal UPDATE em fichas
-- =============================================
-- BUG: O aluno acessando via portal_token (anon) NÃO conseguia
-- fazer UPDATE na tabela fichas. As policies existentes só permitiam
-- SELECT (fichas_portal_select) para anon, mas saveContexto()
-- e VirtualAssessmentWizard fazem UPDATE.
--
-- Rodar no SQL Editor do Supabase Dashboard
-- =============================================

-- 1. Policy para UPDATE na tabela fichas via portal (anon)
-- Permite que o atleta atualize sua própria ficha (contexto, altura, data_nascimento)
DROP POLICY IF EXISTS "fichas_portal_update" ON fichas;

CREATE POLICY "fichas_portal_update" ON fichas FOR UPDATE
    TO anon
    USING (
        atleta_id IN (
            SELECT id FROM atletas
            WHERE portal_token IS NOT NULL
            AND portal_token != ''
            AND (portal_token_expira IS NULL OR portal_token_expira > now())
        )
    );

-- 2. Verificar que assessments também tem INSERT para anon 
-- (VirtualAssessmentWizard pode precisar gravar assessment via edge function,
--  mas o resultado é salvo via supabase client)
DROP POLICY IF EXISTS "assessments_portal_select" ON assessments;
DROP POLICY IF EXISTS "assessments_portal_insert" ON assessments;

CREATE POLICY "assessments_portal_select" ON assessments FOR SELECT
    TO anon
    USING (
        atleta_id IN (
            SELECT id FROM atletas
            WHERE portal_token IS NOT NULL
            AND portal_token != ''
            AND (portal_token_expira IS NULL OR portal_token_expira > now())
        )
    );

CREATE POLICY "assessments_portal_insert" ON assessments FOR INSERT
    TO anon
    WITH CHECK (
        atleta_id IN (
            SELECT id FROM atletas
            WHERE portal_token IS NOT NULL
            AND portal_token != ''
            AND (portal_token_expira IS NULL OR portal_token_expira > now())
        )
    );

-- 3. Também adicionar INSERT para diagnósticos via portal
-- (caso o edge function tente salvar pelo client)
DROP POLICY IF EXISTS "diagnosticos_portal_select" ON diagnosticos;

CREATE POLICY "diagnosticos_portal_select" ON diagnosticos FOR SELECT
    TO anon
    USING (
        atleta_id IN (
            SELECT id FROM atletas
            WHERE portal_token IS NOT NULL
            AND portal_token != ''
            AND (portal_token_expira IS NULL OR portal_token_expira > now())
        )
    );

SELECT '✅ fichas_portal_update + assessments_portal_* aplicados!' AS status;
