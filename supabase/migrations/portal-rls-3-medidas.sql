-- =================================================================
-- BLOCO 3: Policies para tabela MEDIDAS
-- Execute este bloco APÓS o bloco 2
-- =================================================================
DROP POLICY IF EXISTS "portal_select_medidas" ON medidas;
DROP POLICY IF EXISTS "portal_insert_medidas" ON medidas;

CREATE POLICY "portal_select_medidas" ON medidas
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = medidas.atleta_id
            AND atletas.portal_token IS NOT NULL
        )
    );

CREATE POLICY "portal_insert_medidas" ON medidas
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = medidas.atleta_id
            AND atletas.portal_token IS NOT NULL
            AND (atletas.portal_token_expira IS NULL OR atletas.portal_token_expira > now())
        )
    );
