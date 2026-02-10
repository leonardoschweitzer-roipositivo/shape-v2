import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types/auth';

interface Profile {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    avatar_url?: string;
}

interface AuthState {
    user: User | null;
    profile: Profile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, additionalData?: { fullName: string; role: UserRole }) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    profile: null,
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
                    // Fallback if profile doesn't exist yet (should exist via trigger, but just in case)
                }

                set({
                    user: data.user,
                    profile: profileData as Profile,
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

                set({
                    user: session.user,
                    profile: profileData as Profile,
                    isAuthenticated: true
                });
            } else {
                set({ isAuthenticated: false, user: null, profile: null });
            }
        } catch (error) {
            console.error('Session check failed', error);
            set({ isAuthenticated: false });
        } finally {
            set({ isLoading: false });
        }
    }
}));
