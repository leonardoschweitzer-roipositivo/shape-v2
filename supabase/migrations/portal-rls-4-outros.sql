-- =================================================================
-- BLOCO 4: Policies para ASSESSMENTS, DIAGNOSTICOS e PERSONAIS
-- Execute este bloco APÓS o bloco 3
-- =================================================================

-- Assessments
DROP POLICY IF EXISTS "portal_select_assessments" ON assessments;
CREATE POLICY "portal_select_assessments" ON assessments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = assessments.atleta_id
            AND atletas.portal_token IS NOT NULL
        )
    );

-- Diagnosticos
DROP POLICY IF EXISTS "portal_select_diagnosticos" ON diagnosticos;
CREATE POLICY "portal_select_diagnosticos" ON diagnosticos
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = diagnosticos.atleta_id
            AND atletas.portal_token IS NOT NULL
        )
    );

-- Personais
DROP POLICY IF EXISTS "portal_select_personais" ON personais;
CREATE POLICY "portal_select_personais" ON personais
    FOR SELECT
    USING (true);
