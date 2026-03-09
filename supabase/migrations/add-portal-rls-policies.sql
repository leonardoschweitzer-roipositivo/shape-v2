-- Migration: add-portal-rls-policies.sql
-- Descrição: Adiciona RLS policies para permitir que atletas
-- via portal token (anon key) possam INSERT medidas e UPDATE fichas
-- =================================================================

-- 1. Policy para INSERT de medidas via portal (anon key)
DROP POLICY IF EXISTS "portal_insert_medidas" ON medidas;
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

-- 2. Policy para SELECT de medidas via portal  
DROP POLICY IF EXISTS "portal_select_medidas" ON medidas;
CREATE POLICY "portal_select_medidas" ON medidas
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = medidas.atleta_id
            AND atletas.portal_token IS NOT NULL
        )
    );

-- 3. Policy para UPDATE de fichas via portal (para salvar contexto e altura)
DROP POLICY IF EXISTS "portal_update_fichas" ON fichas;
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

-- 4. Policy para SELECT de fichas via portal
DROP POLICY IF EXISTS "portal_select_fichas" ON fichas;
CREATE POLICY "portal_select_fichas" ON fichas
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM atletas
            WHERE atletas.id = fichas.atleta_id
            AND atletas.portal_token IS NOT NULL
        )
    );

-- 5. Policy para SELECT e UPDATE de atletas via portal
DROP POLICY IF EXISTS "portal_select_atletas" ON atletas;
CREATE POLICY "portal_select_atletas" ON atletas
    FOR SELECT
    USING (portal_token IS NOT NULL);

DROP POLICY IF EXISTS "portal_update_atletas" ON atletas;
CREATE POLICY "portal_update_atletas" ON atletas
    FOR UPDATE
    USING (portal_token IS NOT NULL)
    WITH CHECK (portal_token IS NOT NULL);

-- 6. Policy para SELECT de assessments via portal
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

-- 7. Policy para SELECT de diagnosticos via portal
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

-- 8. Policy para SELECT de personais via portal (nome do personal)
DROP POLICY IF EXISTS "portal_select_personais" ON personais;
CREATE POLICY "portal_select_personais" ON personais
    FOR SELECT
    USING (true);
