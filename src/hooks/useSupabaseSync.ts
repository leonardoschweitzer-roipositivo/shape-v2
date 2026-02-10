/**
 * Hook: useSupabaseSync
 * 
 * Sincroniza dados do Supabase quando o usuário está autenticado.
 * Deve ser chamado uma vez no App.tsx.
 * 
 * Fluxo:
 * 1. Usuário faz login → authStore carrega profile e entity
 * 2. useSupabaseSync detecta o entity.personal
 * 3. Chama dataStore.loadFromSupabase(personalId)
 * 4. Dados reais carregam (ou mantém mocks se banco vazio)
 */
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';

export function useSupabaseSync() {
    const { isAuthenticated, profile, entity } = useAuthStore();
    const { loadFromSupabase, dataSource } = useDataStore();
    const hasLoaded = useRef(false);

    useEffect(() => {
        // Só carrega uma vez por sessão
        if (!isAuthenticated || hasLoaded.current) return;

        const sync = async () => {
            try {
                if (profile?.role === 'PERSONAL' && entity.personal) {
                    console.info('[Sync] Carregando dados do personal:', entity.personal.nome);
                    await loadFromSupabase(entity.personal.id);
                    hasLoaded.current = true;
                } else if (profile?.role === 'ACADEMIA' && entity.academia) {
                    // Futuramente: carregar dados da academia
                    console.info('[Sync] Academia logada:', entity.academia.nome);
                    hasLoaded.current = true;
                } else if (profile?.role === 'ATLETA' && entity.atleta) {
                    // Futuramente: carregar dados do atleta
                    console.info('[Sync] Atleta logado:', entity.atleta.nome);
                    hasLoaded.current = true;
                } else {
                    console.info('[Sync] Entidade não encontrada, usando mocks');
                }
            } catch (err) {
                console.error('[Sync] Erro na sincronização:', err);
            }
        };

        sync();
    }, [isAuthenticated, profile?.role, entity.personal, entity.academia, entity.atleta]);

    // Reset quando deslogar
    useEffect(() => {
        if (!isAuthenticated) {
            hasLoaded.current = false;
        }
    }, [isAuthenticated]);

    return { dataSource };
}
