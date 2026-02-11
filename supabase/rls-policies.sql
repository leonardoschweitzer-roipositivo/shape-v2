-- =============================================
-- VITRU IA - Row Level Security Policies
-- =============================================
-- Arquivo consolidado com todas as policies RLS.
-- Rodar este script recria todas as policies do zero.
--
-- IMPORTANTE: NÃO usar referências a auth.users nas policies,
-- pois o role 'authenticated' não tem permissão de leitura nessa tabela.
-- =============================================

-- =============================================
-- PROFILES
-- =============================================
DROP POLICY IF EXISTS "profiles_own" ON profiles;
DROP POLICY IF EXISTS "Enable all access for authenticated users on profiles" ON profiles;

CREATE POLICY "profiles_own" ON profiles FOR ALL
    USING (auth.uid() = id);

-- =============================================
-- ACADEMIAS
-- =============================================
DROP POLICY IF EXISTS "academia_own" ON academias;
DROP POLICY IF EXISTS "academias_admin_all" ON academias;  -- ⚠️ TÓXICA: acessava auth.users
DROP POLICY IF EXISTS "academias_self_select" ON academias;
DROP POLICY IF EXISTS "academias_self_update" ON academias;

CREATE POLICY "academia_own" ON academias FOR ALL
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- =============================================
-- PERSONAIS
-- =============================================
DROP POLICY IF EXISTS "personal_own" ON personais;
DROP POLICY IF EXISTS "personais_self_select" ON personais;
DROP POLICY IF EXISTS "personais_self_update" ON personais;
DROP POLICY IF EXISTS "personais_academia_select" ON personais;
DROP POLICY IF EXISTS "personais_academia_update" ON personais;
DROP POLICY IF EXISTS "personais_academia_insert" ON personais;

-- Personal pode ver/editar seus próprios dados
CREATE POLICY "personal_own" ON personais FOR ALL
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- Academia pode ver/editar seus personais
CREATE POLICY "personais_academia_select" ON personais FOR SELECT
    USING (
        academia_id IN (
            SELECT id FROM academias WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "personais_academia_update" ON personais FOR UPDATE
    USING (
        academia_id IN (
            SELECT id FROM academias WHERE auth_user_id = auth.uid()
        )
    );

-- =============================================
-- ATLETAS
-- =============================================
DROP POLICY IF EXISTS "atleta_personal" ON atletas;
DROP POLICY IF EXISTS "atletas_personal_select" ON atletas;
DROP POLICY IF EXISTS "atletas_personal_update" ON atletas;
DROP POLICY IF EXISTS "atletas_personal_delete" ON atletas;
DROP POLICY IF EXISTS "atletas_personal_insert" ON atletas;
DROP POLICY IF EXISTS "atletas_academia_select" ON atletas;
DROP POLICY IF EXISTS "atletas_self_select" ON atletas;

-- Personal pode gerenciar seus atletas
CREATE POLICY "atleta_personal" ON atletas FOR ALL
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

-- Atleta pode ver seus próprios dados
CREATE POLICY "atletas_self_select" ON atletas FOR SELECT
    USING (auth_user_id = auth.uid());

-- Academia pode ver atletas dos seus personais
CREATE POLICY "atletas_academia_select" ON atletas FOR SELECT
    USING (
        academia_id IN (
            SELECT id FROM academias WHERE auth_user_id = auth.uid()
        )
    );

-- =============================================
-- FICHAS
-- =============================================
DROP POLICY IF EXISTS "ficha_via_personal" ON fichas;
DROP POLICY IF EXISTS "fichas_personal_select" ON fichas;
DROP POLICY IF EXISTS "fichas_personal_update" ON fichas;
DROP POLICY IF EXISTS "fichas_atleta_select" ON fichas;
DROP POLICY IF EXISTS "fichas_academia_select" ON fichas;

-- Personal pode gerenciar fichas dos seus atletas
CREATE POLICY "ficha_via_personal" ON fichas FOR ALL
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            JOIN personais p ON a.personal_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- Atleta pode ver sua própria ficha
CREATE POLICY "fichas_atleta_select" ON fichas FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- Academia pode ver fichas dos atletas dos seus personais
CREATE POLICY "fichas_academia_select" ON fichas FOR SELECT
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            WHERE a.academia_id IN (
                SELECT id FROM academias WHERE auth_user_id = auth.uid()
            )
        )
    );

-- =============================================
-- MEDIDAS
-- =============================================
DROP POLICY IF EXISTS "medida_via_personal" ON medidas;
DROP POLICY IF EXISTS "medidas_personal_select" ON medidas;
DROP POLICY IF EXISTS "medidas_personal_insert" ON medidas;
DROP POLICY IF EXISTS "medidas_atleta_select" ON medidas;
DROP POLICY IF EXISTS "medidas_academia_select" ON medidas;

-- Personal pode gerenciar medidas dos seus atletas
CREATE POLICY "medida_via_personal" ON medidas FOR ALL
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            JOIN personais p ON a.personal_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- Atleta pode ver suas próprias medidas
CREATE POLICY "medidas_atleta_select" ON medidas FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- Academia pode ver medidas dos atletas dos seus personais
CREATE POLICY "medidas_academia_select" ON medidas FOR SELECT
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            WHERE a.academia_id IN (
                SELECT id FROM academias WHERE auth_user_id = auth.uid()
            )
        )
    );

-- =============================================
-- AVALIACOES
-- =============================================
DROP POLICY IF EXISTS "avaliacao_via_personal" ON avaliacoes;
DROP POLICY IF EXISTS "avaliacoes_personal_select" ON avaliacoes;
DROP POLICY IF EXISTS "avaliacoes_personal_insert" ON avaliacoes;
DROP POLICY IF EXISTS "avaliacoes_atleta_select" ON avaliacoes;
DROP POLICY IF EXISTS "avaliacoes_academia_select" ON avaliacoes;
DROP POLICY IF EXISTS "avaliacao_atleta" ON avaliacoes;

-- Personal pode gerenciar avaliações dos seus atletas
CREATE POLICY "avaliacao_via_personal" ON avaliacoes FOR ALL
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            JOIN personais p ON a.personal_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- Atleta pode ver suas próprias avaliações
CREATE POLICY "avaliacoes_atleta_select" ON avaliacoes FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- Academia pode ver avaliações dos atletas dos seus personais
CREATE POLICY "avaliacoes_academia_select" ON avaliacoes FOR SELECT
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            WHERE a.academia_id IN (
                SELECT id FROM academias WHERE auth_user_id = auth.uid()
            )
        )
    );

-- =============================================
-- REGISTROS
-- =============================================
DROP POLICY IF EXISTS "registro_atleta" ON registros;
DROP POLICY IF EXISTS "registros_atleta_select" ON registros;
DROP POLICY IF EXISTS "registros_atleta_insert" ON registros;
DROP POLICY IF EXISTS "registros_personal_select" ON registros;

CREATE POLICY "registros_atleta_select" ON registros FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "registros_atleta_insert" ON registros FOR INSERT
    WITH CHECK (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "registros_personal_select" ON registros FOR SELECT
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            JOIN personais p ON a.personal_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- =============================================
-- CONSULTORIAS
-- =============================================
DROP POLICY IF EXISTS "consultoria_atleta" ON consultorias;
DROP POLICY IF EXISTS "consultorias_atleta_select" ON consultorias;
DROP POLICY IF EXISTS "consultorias_atleta_insert" ON consultorias;
DROP POLICY IF EXISTS "consultorias_personal_select" ON consultorias;
DROP POLICY IF EXISTS "consultorias_personal_insert" ON consultorias;

CREATE POLICY "consultorias_atleta_select" ON consultorias FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "consultorias_personal_select" ON consultorias FOR SELECT
    USING (
        atleta_id IN (
            SELECT a.id FROM atletas a
            JOIN personais p ON a.personal_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================
-- Confirmar que nenhuma policy acessa auth.users
DO $$
DECLARE
    toxic_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO toxic_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND qual::text LIKE '%auth.users%';
    
    IF toxic_count > 0 THEN
        RAISE WARNING '⚠️ Ainda existem % policies que acessam auth.users!', toxic_count;
    ELSE
        RAISE NOTICE '✅ Nenhuma policy tóxica encontrada. RLS seguro!';
    END IF;
END $$;

SELECT '✅ Políticas RLS aplicadas com sucesso!' AS status;
