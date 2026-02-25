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
 * 4. Dados reais carregam (ou lista vazia se banco vazio — NUNCA usa mocks)
 */
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';

export function useSupabaseSync() {
    const { isAuthenticated, profile, entity } = useAuthStore();
    const { loadFromSupabase, dataSource } = useDataStore();
    const loadedPersonalId = useRef<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const sync = async () => {
            try {
                if (profile?.role === 'PERSONAL' && entity.personal) {
                    // Recarrega se o personal mudou (nova sessão ou troca de conta)
                    if (loadedPersonalId.current === entity.personal.id) return;
                    console.info('[Sync] Carregando dados do personal:', entity.personal.nome);
                    await loadFromSupabase(entity.personal.id);
                    loadedPersonalId.current = entity.personal.id;
                } else if (profile?.role === 'ACADEMIA' && entity.academia) {
                    console.info('[Sync] Academia logada:', entity.academia.nome);
                } else if (profile?.role === 'ATLETA' && entity.atleta) {
                    console.info('[Sync] Atleta logado:', entity.atleta.nome);
                } else {
                    console.info('[Sync] Entidade não encontrada (usuário novo ou sem dados no banco).');
                }
            } catch (err) {
                console.error('[Sync] Erro na sincronização:', err);
            }
        };

        sync();
    }, [isAuthenticated, profile?.role, entity.personal?.id, entity.academia?.id, entity.atleta?.id]);

    // Reset quando deslogar
    useEffect(() => {
        if (!isAuthenticated) {
            loadedPersonalId.current = null;
        }
    }, [isAuthenticated]);

    return { dataSource };
}
