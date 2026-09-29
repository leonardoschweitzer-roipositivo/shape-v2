-- =============================================
-- VITRU IA — FASE 0 (parte A): Blindagem de auth / papéis
-- =============================================
-- Rodar no Supabase Dashboard → SQL Editor (idempotente: pode rodar 2x).
-- Ordem: ESTE arquivo primeiro, depois 20260930_fase0b_portal_rls_self.sql.
--
-- O que fecha:
--   1. Cadastro com role arbitrária (GOD etc.) via raw_user_meta_data
--   2. Usuário trocando o próprio profiles.role
--   3. Personal alterando o próprio plano / limite / status / vínculo
--   4. Personal inserindo linhas extras em personais
--   5. RPC link_existing_user_to_atleta sem checagem de dono (sequestro de aluno)
--   6. Erro silencioso no handle_new_user (gerava conta "órfã" sem profile)
--
-- NÃO quebra o fluxo atual de cadastro de aluno (senha padrão) — isso sai na Fase 2.
-- =============================================
--
-- ─── PRÉ-CHECK (rode antes e guarde o resultado) ───────────────────────────
--
-- a) personais duplicados por login (precisa voltar vazio para criar o UNIQUE):
--    SELECT auth_user_id, count(*), array_agg(id) FROM personais
--    WHERE auth_user_id IS NOT NULL GROUP BY 1 HAVING count(*) > 1;
--
-- b) atletas duplicados por login (precisa voltar vazio para o índice único):
--    SELECT auth_user_id, count(*), array_agg(id) FROM atletas
--    WHERE auth_user_id IS NOT NULL GROUP BY 1 HAVING count(*) > 1;
--
-- c) contas órfãs (login sem profile):
--    SELECT u.id, u.email, u.raw_user_meta_data->>'role' AS role
--    FROM auth.users u LEFT JOIN profiles p ON p.id = u.id WHERE p.id IS NULL;
--
-- d) policies atuais (guarde para comparar / reverter):
--    SELECT tablename, policyname, cmd, roles, qual, with_check
--    FROM pg_policies WHERE schemaname = 'public' ORDER BY 1, 2;
--
-- Se (a) ou (b) retornarem linhas: o script NÃO falha, mas pula a constraint
-- correspondente e avisa (WARNING). Resolva os duplicados e rode de novo.
-- =============================================


-- =============================================
-- 1. FUNÇÕES AUXILIARES (SECURITY DEFINER → evitam recursão de RLS)
-- =============================================

CREATE OR REPLACE FUNCTION public.app_is_god()
RETURNS boolean
LANGUAGE sql STABLE
AS $$
    SELECT coalesce(auth.jwt() ->> 'email', '') IN (
        'leonardo@schweitzer.ai',
        'admin@vitruia.com',
        'god@vitruia.com'
    );
$$;

-- "Contexto administrativo": SQL Editor (sem JWT), service_role (Edge Functions) ou GOD.
CREATE OR REPLACE FUNCTION public.app_is_admin_ctx()
RETURNS boolean
LANGUAGE sql STABLE
AS $$
    SELECT coalesce(auth.role(), '') NOT IN ('authenticated', 'anon')
        OR public.app_is_god();
$$;

CREATE OR REPLACE FUNCTION public.app_meu_personal_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM personais WHERE auth_user_id = auth.uid() ORDER BY created_at LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.app_meu_atleta_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT id FROM atletas WHERE auth_user_id = auth.uid() ORDER BY created_at LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.app_personal_do_atleta()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT personal_id FROM atletas WHERE auth_user_id = auth.uid() ORDER BY created_at LIMIT 1;
$$;

-- O atleta pertence ao personal logado?
CREATE OR REPLACE FUNCTION public.app_atleta_eh_meu(p_atleta_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM atletas a
        JOIN personais p ON p.id = a.personal_id
        WHERE a.id = p_atleta_id AND p.auth_user_id = auth.uid()
    );
$$;

GRANT EXECUTE ON FUNCTION public.app_is_god()               TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.app_is_admin_ctx()         TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.app_meu_personal_id()      TO authenticated;
GRANT EXECUTE ON FUNCTION public.app_meu_atleta_id()        TO authenticated;
GRANT EXECUTE ON FUNCTION public.app_personal_do_atleta()   TO authenticated;
GRANT EXECUTE ON FUNCTION public.app_atleta_eh_meu(uuid)    TO authenticated;


-- =============================================
-- 2. CONSTRAINTS DE UNICIDADE (1 login = 1 personal / 1 atleta)
-- =============================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM personais WHERE auth_user_id IS NOT NULL
        GROUP BY auth_user_id HAVING count(*) > 1
    ) THEN
        RAISE WARNING '⚠️ personais com auth_user_id duplicado — UNIQUE NÃO criado. Veja PRÉ-CHECK (a).';
    ELSIF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'personais_auth_user_id_key'
    ) THEN
        ALTER TABLE personais ADD CONSTRAINT personais_auth_user_id_key UNIQUE (auth_user_id);
    END IF;

    IF EXISTS (
        SELECT 1 FROM atletas WHERE auth_user_id IS NOT NULL
        GROUP BY auth_user_id HAVING count(*) > 1
    ) THEN
        RAISE WARNING '⚠️ atletas com auth_user_id duplicado — índice único NÃO criado. Veja PRÉ-CHECK (b).';
    ELSE
        CREATE UNIQUE INDEX IF NOT EXISTS atletas_auth_user_id_uniq
            ON atletas(auth_user_id) WHERE auth_user_id IS NOT NULL;
    END IF;
END $$;


-- =============================================
-- 3. handle_new_user — endurecido
-- =============================================
-- • Só aceita PERSONAL | ACADEMIA | ATLETA vindos do cliente (qualquer outra coisa → ATLETA)
-- • Nunca sobrescreve profiles.role de um profile existente
-- • Sem EXCEPTION WHEN OTHERS: erro de cadastro aparece, em vez de gerar conta órfã
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_role_txt  text := upper(coalesce(NEW.raw_user_meta_data ->> 'role', ''));
    v_role      user_role;
    v_nome      text;
BEGIN
    v_role := CASE
        WHEN v_role_txt IN ('PERSONAL', 'ACADEMIA', 'ATLETA') THEN v_role_txt::user_role
        ELSE 'ATLETA'::user_role
    END;

    v_nome := coalesce(
        nullif(trim(NEW.raw_user_meta_data ->> 'full_name'), ''),
        split_part(NEW.email, '@', 1),
        'Usuário'
    );

    INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (NEW.id, NEW.email, v_nome, v_role, now(), now())
    ON CONFLICT (id) DO UPDATE
        SET email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            updated_at = now();          -- role NUNCA é alterada aqui

    IF v_role = 'PERSONAL' THEN
        IF NOT EXISTS (SELECT 1 FROM public.personais WHERE auth_user_id = NEW.id) THEN
            INSERT INTO public.personais (auth_user_id, nome, email, status, plano, limite_atletas)
            VALUES (NEW.id, v_nome, NEW.email, 'ATIVO', 'FREE', 10);
        END IF;
    ELSIF v_role = 'ACADEMIA' THEN
        IF NOT EXISTS (SELECT 1 FROM public.academias WHERE auth_user_id = NEW.id) THEN
            INSERT INTO public.academias (auth_user_id, nome, email, status)
            VALUES (NEW.id, v_nome, NEW.email, 'ATIVO');
        END IF;
    END IF;
    -- ATLETA: a linha em atletas é criada pelo personal (precisa de personal_id)

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- =============================================
-- 4. BACKFILL de contas órfãs (login sem profile / personal sem linha)
-- =============================================
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT
    u.id,
    u.email,
    coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1)),
    CASE
        WHEN upper(coalesce(u.raw_user_meta_data ->> 'role', '')) IN ('PERSONAL', 'ACADEMIA', 'ATLETA')
            THEN upper(u.raw_user_meta_data ->> 'role')::user_role
        ELSE 'ATLETA'::user_role
    END,
    now(), now()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

INSERT INTO public.personais (auth_user_id, nome, email, status, plano, limite_atletas)
SELECT p.id, coalesce(p.full_name, split_part(p.email, '@', 1)), p.email, 'ATIVO', 'FREE', 10
FROM public.profiles p
WHERE p.role = 'PERSONAL'
  AND NOT EXISTS (SELECT 1 FROM public.personais x WHERE x.auth_user_id = p.id);

INSERT INTO public.academias (auth_user_id, nome, email, status)
SELECT p.id, coalesce(p.full_name, split_part(p.email, '@', 1)), p.email, 'ATIVO'
FROM public.profiles p
WHERE p.role = 'ACADEMIA'
  AND NOT EXISTS (SELECT 1 FROM public.academias x WHERE x.auth_user_id = p.id);


-- =============================================
-- 5. PROFILES — sem INSERT/DELETE pelo cliente, role imutável
-- =============================================
DROP POLICY IF EXISTS "profiles_own" ON profiles;
DROP POLICY IF EXISTS "Enable all access for authenticated users on profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.trg_profiles_bloquear_role()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.app_is_admin_ctx() THEN
        RAISE EXCEPTION 'ROLE_IMUTAVEL: o papel do usuário só pode ser alterado pelo administrador';
    END IF;
    IF NEW.id IS DISTINCT FROM OLD.id THEN
        RAISE EXCEPTION 'ID_IMUTAVEL';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_bloquear_role ON profiles;
CREATE TRIGGER trg_profiles_bloquear_role
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION public.trg_profiles_bloquear_role();


-- =============================================
-- 6. PERSONAIS — sem INSERT pelo cliente, campos administrativos protegidos
-- =============================================
DROP POLICY IF EXISTS "personal_own" ON personais;
DROP POLICY IF EXISTS "personal_select_own" ON personais;
DROP POLICY IF EXISTS "personal_update_own" ON personais;
DROP POLICY IF EXISTS "personais_atleta_select" ON personais;
DROP POLICY IF EXISTS "personais_god_select" ON personais;

CREATE POLICY "personal_select_own" ON personais FOR SELECT
    USING (auth_user_id = auth.uid());

CREATE POLICY "personal_update_own" ON personais FOR UPDATE
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- Aluno logado enxerga o próprio personal (nome, CREF, contato no portal)
CREATE POLICY "personais_atleta_select" ON personais FOR SELECT
    USING (id = public.app_personal_do_atleta());

-- GOD enxerga todos (dashboard GOD)
CREATE POLICY "personais_god_select" ON personais FOR SELECT
    USING (public.app_is_god());

CREATE OR REPLACE FUNCTION public.trg_personais_proteger_campos()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF public.app_is_admin_ctx() THEN
        RETURN NEW;
    END IF;
    IF NEW.plano          IS DISTINCT FROM OLD.plano
    OR NEW.limite_atletas IS DISTINCT FROM OLD.limite_atletas
    OR NEW.status         IS DISTINCT FROM OLD.status
    OR NEW.auth_user_id   IS DISTINCT FROM OLD.auth_user_id
    OR NEW.academia_id    IS DISTINCT FROM OLD.academia_id THEN
        RAISE EXCEPTION 'CAMPO_ADMINISTRATIVO: plano, limite, status e vínculos só podem ser alterados pelo administrador';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_personais_proteger_campos ON personais;
CREATE TRIGGER trg_personais_proteger_campos
    BEFORE UPDATE ON personais
    FOR EACH ROW EXECUTE FUNCTION public.trg_personais_proteger_campos();


-- =============================================
-- 7. ACADEMIAS / ATLETAS — leitura GOD (dashboard GOD)
-- =============================================
DROP POLICY IF EXISTS "academias_god_select" ON academias;
CREATE POLICY "academias_god_select" ON academias FOR SELECT
    USING (public.app_is_god());

DROP POLICY IF EXISTS "atletas_god_select" ON atletas;
CREATE POLICY "atletas_god_select" ON atletas FOR SELECT
    USING (public.app_is_god());


-- =============================================
-- 8. link_existing_user_to_atleta — com checagem de dono
-- =============================================
-- Temporária: some na Fase 2 (convite server-side). Até lá o fluxo atual continua.
CREATE OR REPLACE FUNCTION public.link_existing_user_to_atleta(p_email TEXT, p_atleta_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_user_id   uuid;
    v_role      user_role;
    v_atual     uuid;
BEGIN
    -- 1. O atleta precisa ser do personal logado
    IF NOT public.app_atleta_eh_meu(p_atleta_id) THEN
        RAISE EXCEPTION 'ATLETA_NAO_PERTENCE_AO_PERSONAL';
    END IF;

    SELECT auth_user_id INTO v_atual FROM public.atletas WHERE id = p_atleta_id;

    SELECT id INTO v_user_id
    FROM auth.users
    WHERE lower(email) = lower(trim(p_email))
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RETURN NULL;
    END IF;

    -- Já vinculado a este mesmo usuário → nada a fazer
    IF v_atual = v_user_id THEN
        RETURN v_user_id;
    END IF;

    -- 2. Atleta já vinculado a OUTRO login → não troca
    IF v_atual IS NOT NULL THEN
        RAISE EXCEPTION 'ATLETA_JA_VINCULADO';
    END IF;

    -- 3. O login-alvo precisa ser de ATLETA e não pode estar ligado a outro aluno
    SELECT role INTO v_role FROM public.profiles WHERE id = v_user_id;
    IF v_role IS NOT NULL AND v_role <> 'ATLETA' THEN
        RAISE EXCEPTION 'EMAIL_DE_OUTRO_TIPO_DE_CONTA';
    END IF;
    IF EXISTS (SELECT 1 FROM public.atletas WHERE auth_user_id = v_user_id) THEN
        RAISE EXCEPTION 'EMAIL_JA_VINCULADO_A_OUTRO_ALUNO';
    END IF;

    UPDATE public.atletas
    SET auth_user_id = v_user_id
    WHERE id = p_atleta_id AND auth_user_id IS NULL;

    INSERT INTO public.profiles (id, role, full_name, email)
    SELECT v_user_id, 'ATLETA', a.nome, lower(trim(p_email))
    FROM public.atletas a WHERE a.id = p_atleta_id
    ON CONFLICT (id) DO NOTHING;

    RETURN v_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.link_existing_user_to_atleta(TEXT, UUID) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.link_existing_user_to_atleta(TEXT, UUID) TO authenticated;


SELECT '✅ Fase 0A aplicada: auth/papéis blindados' AS status;
