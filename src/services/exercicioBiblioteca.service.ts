/**
 * exercicioBiblioteca.service.ts
 *
 * CRUD e busca da Biblioteca de Exercícios do VITRÚVIO.
 */

import { supabase } from './supabase'
import type { ExercicioBiblioteca, FiltroBiblioteca } from '@/types/exercicio-biblioteca'

export const exercicioBibliotecaService = {

    /**
     * Busca todos os exercícios com filtros opcionais.
     */
    async buscar(filtro: FiltroBiblioteca = {}): Promise<ExercicioBiblioteca[]> {
        let query = supabase
            .from('exercicios_biblioteca')
            .select('*')
            .eq('ativo', true)
            .order('grupo_muscular', { ascending: true })
            .order('nome', { ascending: true })

        if (filtro.grupo) {
            query = query.eq('grupo_muscular', filtro.grupo)
        }

        if (filtro.nivel) {
            query = query.eq('nivel', filtro.nivel)
        }

        if (filtro.equipamento) {
            query = query.eq('equipamento', filtro.equipamento)
        }

        if (filtro.busca && filtro.busca.trim()) {
            query = query.ilike('nome', `%${filtro.busca.trim()}%`)
        }

        if (filtro.emBreve !== undefined) {
            query = query.eq('em_breve', filtro.emBreve)
        }

        const { data, error } = await query

        if (error) {
            console.error('[exercicioBibliotecaService] Erro ao buscar:', error.message)
            return []
        }

        return (data || []) as ExercicioBiblioteca[]
    },

    /**
     * Busca um exercício por ID.
     */
    async buscarPorId(id: string): Promise<ExercicioBiblioteca | null> {
        const { data, error } = await supabase
            .from('exercicios_biblioteca')
            .select('*')
            .eq('id', id)
            .eq('ativo', true)
            .single()

        if (error) {
            console.error('[exercicioBibliotecaService] Erro ao buscar por ID:', error.message)
            return null
        }

        return data as ExercicioBiblioteca
    },

    /**
     * Busca exercícios por grupo muscular.
     */
    async buscarPorGrupo(grupo: string): Promise<ExercicioBiblioteca[]> {
        const { data, error } = await supabase
            .from('exercicios_biblioteca')
            .select('*')
            .eq('grupo_muscular', grupo)
            .eq('ativo', true)
            .order('nivel', { ascending: true })
            .order('nome', { ascending: true })

        if (error) {
            console.error('[exercicioBibliotecaService] Erro ao buscar por grupo:', error.message)
            return []
        }

        return (data || []) as ExercicioBiblioteca[]
    },

    /**
     * Busca exercícios por nome similar (para vincular ao plano).
     * Retorna o melhor match para um nome de exercício do plano.
     */
    async buscarPorNomeSimilar(nome: string): Promise<ExercicioBiblioteca | null> {
        const { data, error } = await supabase
            .from('exercicios_biblioteca')
            .select('*')
            .ilike('nome', `%${nome}%`)
            .eq('ativo', true)
            .limit(1)
            .single()

        if (error) return null
        return data as ExercicioBiblioteca
    },

    /**
     * Retorna estatísticas da biblioteca.
     */
    async stats(): Promise<{ total: number; comVideo: number; emBreve: number }> {
        const { count: total } = await supabase
            .from('exercicios_biblioteca')
            .select('id', { count: 'exact', head: true })
            .eq('ativo', true)

        const { count: emBreve } = await supabase
            .from('exercicios_biblioteca')
            .select('id', { count: 'exact', head: true })
            .eq('em_breve', true)
            .eq('ativo', true)

        return {
            total: total || 0,
            comVideo: (total || 0) - (emBreve || 0),
            emBreve: emBreve || 0,
        }
    },

    // ═══════════════════════════════════════════════════════════
    // GESTÃO (GOD) — CRUD completo
    // ═══════════════════════════════════════════════════════════

    /**
     * Atualiza o vídeo (URL do YouTube) de um exercício.
     * Também marca em_breve = false quando há vídeo.
     */
    async atualizarVideo(
        exercicioId: string,
        urlVideo: string | null,
        duracaoSeg?: number
    ): Promise<boolean> {
        const { error } = await supabase
            .from('exercicios_biblioteca')
            .update({
                url_video: urlVideo,
                duracao_video_seg: duracaoSeg || null,
                em_breve: !urlVideo,
                updated_at: new Date().toISOString(),
            })
            .eq('id', exercicioId)

        if (error) {
            console.error('[exercicioBibliotecaService] Erro ao atualizar vídeo:', error.message)
            return false
        }

        return true
    },

    /**
     * Atualiza os dados textuais de um exercício (instruções, dicas, erros).
     */
    async atualizarConteudo(
        exercicioId: string,
        dados: {
            instrucoes?: string[]
            dicas?: string[]
            erros_comuns?: string[]
            descricao?: string
        }
    ): Promise<boolean> {
        const { error } = await supabase
            .from('exercicios_biblioteca')
            .update({
                ...dados,
                updated_at: new Date().toISOString(),
            })
            .eq('id', exercicioId)

        if (error) {
            console.error('[exercicioBibliotecaService] Erro ao atualizar conteúdo:', error.message)
            return false
        }

        return true
    },

    /**
     * Remove o vídeo de um exercício (volta para em_breve = true).
     */
    async removerVideo(exercicioId: string): Promise<boolean> {
        return this.atualizarVideo(exercicioId, null)
    },
}
