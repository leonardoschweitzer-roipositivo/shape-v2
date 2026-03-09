-- =================================================================
-- BLOCO 2: Policies para tabela FICHAS
-- Execute este bloco APÓS o bloco 1
-- =================================================================
DROP POLICY IF EXISTS "portal_select_fichas" ON fichas;
DROP POLICY IF EXISTS "portal_update_fichas" ON fichas;

CREATE POLICY "portal_select_fichas" ON fichas
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = fichas.atleta_id
            AND atletas.portal_token IS NOT NULL
        )
    );

CREATE POLICY "portal_update_fichas" ON fichas
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = fichas.atleta_id
            AND atletas.portal_token IS NOT NULL
            AND (atletas.portal_token_expira IS NULL OR atletas.portal_token_expira > now())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = fichas.atleta_id
            AND atletas.portal_token IS NOT NULL
            AND (atletas.portal_token_expira IS NULL OR atletas.portal_token_expira > now())
        )
    );
