-- Criar função RPC para vincular usuário existente ao atleta
CREATE OR REPLACE FUNCTION public.link_existing_user_to_atleta(p_email TEXT, p_atleta_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_user_id UUID;
    v_atleta_nome TEXT;
BEGIN
    -- Obter o ID do usuário através do email (auth.users restrita para users comuns, mas a function tem SECURITY DEFINER)
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = p_email
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        -- Atualizar a tabela de atletas para vincular o UUID à ficha dele
        UPDATE public.atletas
        SET auth_user_id = v_user_id
        WHERE id = p_atleta_id;

        -- Obter o nome do atleta para o profile
        SELECT nome INTO v_atleta_nome
        FROM public.atletas
        WHERE id = p_atleta_id;

        -- Certificar-se que ele tem as credenciais da tabela profiles (caso o trigger não tenha pego antes)
        INSERT INTO public.profiles (id, role, full_name, email)
        VALUES (v_user_id, 'ATLETA', v_atleta_nome, p_email)
        ON CONFLICT (id) DO UPDATE 
        SET role = 'ATLETA', full_name = v_atleta_nome
        WHERE public.profiles.role IS NULL;

        RETURN v_user_id;
    END IF;

    RETURN NULL;
END;
$$;

-- Garantir permissões de execução apenas para usuários já autenticados (Personais logados)
GRANT EXECUTE ON FUNCTION public.link_existing_user_to_atleta(TEXT, UUID) TO authenticated;
