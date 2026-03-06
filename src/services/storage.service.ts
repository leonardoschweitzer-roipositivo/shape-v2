import { supabase } from './supabase';

/**
 * Storage Service — Gerencia uploads de arquivos para o Supabase Storage.
 */
export const storageService = {
    /**
     * Faz upload de uma imagem para o bucket especificado.
     * 
     * @param bucket - Nome do bucket (ex: 'avatars')
     * @param path - Caminho/nome do arquivo (ex: 'atletas/ID_DO_ALUNO.jpg')
     * @param file - O arquivo propriamente dito
     * @returns A URL pública da imagem após o upload
     */
    async uploadImage(bucket: string, path: string, file: File): Promise<string> {
        // 1. Upload do arquivo
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                upsert: true, // Substitui se já existir
                cacheControl: '3600',
            });

        if (error) {
            console.error(`[StorageService] Erro no upload para ${bucket}/${path}:`, error.message);
            throw new Error(`Falha no upload: ${error.message}`);
        }

        // 2. Buscar a URL pública
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        // 3. Adicionar cache buster se necessário (opcional, para garantir refresh imediato)
        return `${publicUrl}?t=${Date.now()}`;
    }
};
