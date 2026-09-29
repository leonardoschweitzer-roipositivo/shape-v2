import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth';
import type { Personal, Atleta, Academia } from '@/lib/database.types';

interface Profile {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    avatar_url?: string;
}

/**
 * Dados da entidade do usuário logado.
 * Dependendo do role, apenas um será preenchido.
 */
interface EntityData {
    personal?: Personal | null;
    atleta?: Atleta | null;
    academia?: Academia | null;
}

interface AuthState {
    user: User | null;
    profile: Profile | null;
    entity: EntityData;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    signIn: (email: string, password: string) => Promise<{ error: unknown }>;
    signUp: (
        email: string,
        password: string,
        additionalData?: { fullName: string; role: UserRole }
    ) => Promise<{ error: unknown; needsConfirmation?: boolean }>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
    loadEntityData: (userId: string, role: UserRole) => Promise<void>;
    /** Recarrega a entidade (personal/atleta/academia) do usuário logado — ex.: após onboarding. */
    refreshEntity: () => Promise<void>;
    /** Envia e-mail de recuperação com link para /definir-senha. */
    resetPassword: (email: string) => Promise<{ error: unknown }>;
    /** Troca a senha exigindo a senha atual (reautenticação). */
    changePassword: (senhaAtual: string, novaSenha: string) => Promise<{ error: unknown }>;
    /** Registra um único listener de auth (logout em outra aba, recuperação de senha). Retorna o unsubscribe. */
    initAuthListener: () => () => void;
}

/**
 * Carrega dados da entidade baseado no role do usuário.
 * Se não encontrar, pode ser um usuário novo que ainda não tem registro.
 */
async function fetchEntityData(userId: string, role: UserRole): Promise<EntityData> {
    const entity: EntityData = {};

    try {
        console.info('[AuthStore] Buscando entidade para role:', role, 'userId:', userId);

        if (role === 'PERSONAL') {
            const { data, error } = await supabase
                .from('personais')
                .select('*')
                .eq('auth_user_id', userId)
                .maybeSingle();
            if (error) console.warn('[AuthStore] Erro ao buscar personal:', error.message);
            else console.info('[AuthStore] ✅ Personal encontrado:', data?.nome, 'id:', data?.id);
            entity.personal = data || null;
        } else if (role === 'ATLETA') {
            const { data, error } = await supabase
                .from('atletas')
                .select('*')
                .eq('auth_user_id', userId)
                .maybeSingle();
            if (error) console.warn('[AuthStore] Erro ao buscar atleta:', error.message);
            else console.info('[AuthStore] ✅ Atleta encontrado:', data?.nome);
            entity.atleta = data || null;
        } else if (role === 'ACADEMIA') {
            const { data, error } = await supabase
                .from('academias')
                .select('*')
                .eq('auth_user_id', userId)
                .maybeSingle();
            if (error) console.warn('[AuthStore] Erro ao buscar academia:', error.message);
            else console.info('[AuthStore] ✅ Academia encontrada:', data?.nome);
            entity.academia = data || null;
        }
    } catch (err) {
        console.error('[AuthStore] Exceção ao buscar entidade:', err);
    }

    console.info('[AuthStore] Entity final:', JSON.stringify(entity, null, 2));
    return entity;
}

/** Busca profile + entidade de um usuário autenticado. */
async function carregarEstadoUsuario(user: User): Promise<{ profile: Profile | null; entity: EntityData }> {
    const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (error) console.error('[AuthStore] Erro ao buscar profile:', error.message);

    const profile = (profileData as Profile | null) ?? null;
    const entity = profile?.role ? await fetchEntityData(user.id, profile.role) : {};
    return { profile, entity };
}

export const DEFINIR_SENHA_PATH = '/definir-senha';

const MARCA_RECUPERACAO = 'vitru-recuperacao-senha';

/** Lê e apaga a marca de "entrou por link de recuperação" (setada no evento PASSWORD_RECOVERY). */
export function consumirMarcaRecuperacao(): boolean {
    try {
        const marcado = sessionStorage.getItem(MARCA_RECUPERACAO) === '1';
        sessionStorage.removeItem(MARCA_RECUPERACAO);
        return marcado;
    } catch {
        return false;
    }
}

let authListenerAtivo = false;

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    entity: {},
    isAuthenticated: false,
    isLoading: true,
    error: null,

    signIn: async (email, password) => {
        set({ error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.user) {
                const { profile, entity } = await carregarEstadoUsuario(data.user);
                set({ user: data.user, profile, entity, isAuthenticated: true });
            }
            return { error: null };
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
            return { error: err };
        }
    },

    signUp: async (email, password, additionalData) => {
        set({ error: null });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        full_name: additionalData?.fullName,
                        role: additionalData?.role || 'ATLETA',
                    },
                },
            });

            if (error) throw error;

            // Profile + entidade são criados pelo trigger handle_new_user.
            // Com confirmação de e-mail desligada o Supabase já devolve a sessão → entra direto.
            if (data.session) {
                await get().checkSession();
                return { error: null, needsConfirmation: false };
            }
            return { error: null, needsConfirmation: true };
        } catch (err: unknown) {
            set({ error: err instanceof Error ? err.message : 'Erro desconhecido' });
            return { error: err };
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
        set({
            user: null,
            profile: null,
            entity: {},
            isAuthenticated: false,
            isLoading: false
        });
    },

    checkSession: async () => {
        set({ isLoading: true });
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const { profile, entity } = await carregarEstadoUsuario(session.user);
                set({ user: session.user, profile, entity, isAuthenticated: true });
            } else {
                set({ isAuthenticated: false, user: null, profile: null, entity: {} });
            }
        } catch (error) {
            console.error('Session check failed', error);
            set({ isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    },

    loadEntityData: async (userId, role) => {
        const entity = await fetchEntityData(userId, role);
        set({ entity });
    },

    refreshEntity: async () => {
        const { user, profile } = get();
        if (!user || !profile?.role) return;
        const entity = await fetchEntityData(user.id, profile.role);
        set({ entity });
    },

    resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo: `${window.location.origin}${DEFINIR_SENHA_PATH}`,
        });
        return { error };
    },

    changePassword: async (senhaAtual, novaSenha) => {
        const email = get().user?.email;
        if (!email) return { error: new Error('Sessão expirada. Entre novamente.') };

        // Reautentica antes de trocar (evita troca com sessão esquecida aberta)
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password: senhaAtual });
        if (authError) return { error: new Error('Senha atual incorreta.') };

        const { error } = await supabase.auth.updateUser({ password: novaSenha });
        return { error };
    },

    initAuthListener: () => {
        if (authListenerAtivo) return () => { };
        authListenerAtivo = true;

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            // Chamadas ao Supabase dentro do callback podem travar o client → adia para o próximo tick
            setTimeout(() => {
                if (event === 'SIGNED_OUT') {
                    set({ user: null, profile: null, entity: {}, isAuthenticated: false });
                } else if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                    if (session?.user) set({ user: session.user });
                } else if (event === 'PASSWORD_RECOVERY') {
                    try {
                        sessionStorage.setItem(MARCA_RECUPERACAO, '1');
                    } catch {
                        /* storage indisponível: a página ainda usa o hash da URL */
                    }
                    if (!window.location.pathname.startsWith(DEFINIR_SENHA_PATH)) {
                        window.location.replace(DEFINIR_SENHA_PATH);
                    }
                }
            }, 0);
        });

        return () => {
            data.subscription.unsubscribe();
            authListenerAtivo = false;
        };
    },
}));
