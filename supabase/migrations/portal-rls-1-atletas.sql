-- =================================================================
-- BLOCO 1: Policies para tabela ATLETAS
-- Execute este bloco primeiro, sozinho
-- =================================================================
DROP POLICY IF EXISTS "portal_select_atletas" ON atletas;
DROP POLICY IF EXISTS "portal_update_atletas" ON atletas;

CREATE POLICY "portal_select_atletas" ON atletas
    FOR SELECT
    USING (portal_token IS NOT NULL);

CREATE POLICY "portal_update_atletas" ON atletas
    FOR UPDATE
    USING (portal_token IS NOT NULL)
    WITH CHECK (portal_token IS NOT NULL);
