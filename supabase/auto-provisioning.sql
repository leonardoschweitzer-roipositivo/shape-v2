-- =============================================
-- VITRU IA - Auto-Provisioning Trigger
-- =============================================
-- Quando um novo usuário se cadastra, além do profile,
-- cria automaticamente o registro na tabela de domínio
-- (personais, atletas, ou academias) conforme o role.
-- =============================================

-- Substituir a função handle_new_user existente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role_value user_role;
  user_full_name text;
BEGIN
  -- Extract and validate role from metadata
  BEGIN
    user_role_value := COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role,
      'ATLETA'::user_role
    );
  EXCEPTION
    WHEN invalid_text_representation THEN
      user_role_value := 'ATLETA'::user_role;
      RAISE LOG 'Invalid role for user %, defaulting to ATLETA', NEW.id;
  END;

  -- Extract full name
  user_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    split_part(NEW.email, '@', 1),
    'Usuário'
  );

  -- 1. INSERT PROFILE
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    user_role_value,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

  RAISE LOG 'Profile created for user %', NEW.id;

  -- 2. AUTO-PROVISIONING: Criar entidade baseada no role
  IF user_role_value::TEXT = 'PERSONAL' THEN
    INSERT INTO public.personais (auth_user_id, nome, email, status)
    VALUES (NEW.id, user_full_name, NEW.email, 'ATIVO')
    ON CONFLICT DO NOTHING;
    RAISE LOG 'Personal created for user %', NEW.id;

  ELSIF user_role_value::TEXT = 'ACADEMIA' THEN
    INSERT INTO public.academias (auth_user_id, nome, email, status)
    VALUES (NEW.id, user_full_name, NEW.email, 'ATIVO')
    ON CONFLICT DO NOTHING;
    RAISE LOG 'Academia created for user %', NEW.id;

  -- ATLETA não cria automaticamente pois precisa de personal_id
  -- O vínculo é feito pelo Personal via convite
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

-- Recriar o trigger (idempotente)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PROVISIONAR USUÁRIOS EXISTENTES
-- =============================================
-- Para usuários que já se cadastraram ANTES deste trigger,
-- precisamos criar os registros retroativamente.

-- Provisionar PERSONAIS existentes que não têm registro
INSERT INTO public.personais (auth_user_id, nome, email, status)
SELECT 
    p.id,
    COALESCE(p.full_name, split_part(p.email, '@', 1)),
    p.email,
    'ATIVO'
FROM public.profiles p
WHERE p.role::TEXT = 'PERSONAL'
AND NOT EXISTS (
    SELECT 1 FROM public.personais pe WHERE pe.auth_user_id = p.id
);

-- Provisionar ACADEMIAS existentes que não têm registro
INSERT INTO public.academias (auth_user_id, nome, email, status)
SELECT 
    p.id,
    COALESCE(p.full_name, split_part(p.email, '@', 1)),
    p.email,
    'ATIVO'
FROM public.profiles p
WHERE p.role::TEXT = 'ACADEMIA'
AND NOT EXISTS (
    SELECT 1 FROM public.academias ac WHERE ac.auth_user_id = p.id
);

SELECT '✅ Auto-provisioning trigger criado! Usuários existentes provisionados.' AS status;
