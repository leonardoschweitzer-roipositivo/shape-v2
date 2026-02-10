/**
 * Profile Service
 * 
 * Gerencia dados do perfil do usuário na tabela 'profiles'.
 * Esta tabela é criada automaticamente pelo trigger do Supabase Auth.
 * 
 * Fluxo: Component → Hook → ProfileService → Supabase
 */
import { supabase } from '@/services/supabase';
import type { UserRole } from '@/types/auth';

// ===== TYPES =====

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileUpdate {
    full_name?: string;
    role?: UserRole;
    avatar_url?: string;
}

// ===== SERVICE =====

export const profileService = {
    /**
     * Buscar perfil pelo ID do usuário autenticado
     */
    async buscarPorId(userId: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('[ProfileService] Erro ao buscar perfil:', error.message);
            return null;
        }

        return data as Profile;
    },

    /**
     * Atualizar dados do perfil
     */
    async atualizar(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('[ProfileService] Erro ao atualizar perfil:', error.message);
            return null;
        }

        return data as Profile;
    },

    /**
     * Buscar tipo de usuário
     */
    async buscarTipoUsuario(userId: string): Promise<UserRole | null> {
        const profile = await profileService.buscarPorId(userId);
        return profile?.role || null;
    }
};
