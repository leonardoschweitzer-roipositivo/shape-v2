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
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, additionalData?: { fullName: string; role: UserRole }) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
    loadEntityData: (userId: string, role: UserRole) => Promise<void>;
}

/**
 * Carrega dados da entidade baseado no role do usuário.
 * Se não encontrar, pode ser um usuário novo que ainda não tem registro.
 */
async function fetchEntityData(userId: string, role: UserRole): Promise<EntityData> {
    const entity: EntityData = {};

    try {
        if (role === 'PERSONAL') {
            const { data } = await supabase
                .from('personais')
                .select('*')
                .eq('auth_user_id', userId)
                .single();
            entity.personal = data || null;
        } else if (role === 'ATLETA') {
            const { data } = await supabase
                .from('atletas')
                .select('*')
                .eq('auth_user_id', userId)
                .single();
            entity.atleta = data || null;
        } else if (role === 'ACADEMIA') {
            const { data } = await supabase
                .from('academias')
                .select('*')
                .eq('auth_user_id', userId)
                .single();
            entity.academia = data || null;
        }
    } catch (err) {
        console.warn('[AuthStore] Entidade não encontrada para o role:', role);
    }

    return entity;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
    entity: {},
    isAuthenticated: false,
    isLoading: true,
    error: null,

    signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Fetch profile data
            if (data.user) {
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                }

                const profile = profileData as Profile;

                // Carregar dados da entidade
                const entity = profile?.role
                    ? await fetchEntityData(data.user.id, profile.role)
                    : {};

                set({
                    user: data.user,
                    profile,
                    entity,
                    isAuthenticated: true,
                    isLoading: false
                });
            }
            return { error: null };
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            return { error: err };
        }
    },

    signUp: async (email, password, additionalData) => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: additionalData?.fullName,
                        role: additionalData?.role || 'ATLETA',
                    },
                },
            });

            if (error) throw error;

            // Note: Profile creation is handled by Supabase Trigger (handle_new_user)

            set({ isLoading: false });
            return { error: null };
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
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
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                const profile = profileData as Profile;

                // Carregar dados da entidade
                const entity = profile?.role
                    ? await fetchEntityData(session.user.id, profile.role)
                    : {};

                set({
                    user: session.user,
                    profile,
                    entity,
                    isAuthenticated: true
                });
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
    }
}));
