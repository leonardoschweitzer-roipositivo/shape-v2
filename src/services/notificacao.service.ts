/**
 * Serviço de Notificações do Personal — VITRU IA
 *
 * CRUD de notificações + configurações via Supabase.
 */

import { supabase } from './supabase'
import type {
    Notificacao,
    CriarNotificacaoDTO,
    FiltroNotificacao,
    ConfigNotificacoesPersonal,
} from '@/types/notificacao.types'

// ===== Configuração padrão =====

const CONFIG_PADRAO: ConfigNotificacoesPersonal = {
    treino: { ativo: true, agrupar: true, alertarPulados: true, alertarInatividade: true },
    medidas: { ativo: true, alertarRegressao: true, alertarInatividade: true },
    conquistas: { ativo: true },
    portal: { ativo: true, alertarInatividade: true, notificarDor: true },
    resumos: { diario: false, semanal: true, mensal: true },
    horarioInicio: '08:00',
    horarioFim: '21:00',
    canalPrincipal: 'in_app',
}

// ===== Helpers de data para filtros =====

function getInicioHoje(): string {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
}

function getInicioSemana(): string {
    const d = new Date()
    d.setDate(d.getDate() - d.getDay())
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
}

function getInicioMes(): string {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
}

// ===== Service =====

export const notificacaoService = {
    /**
     * Busca notificações do personal com filtros e paginação.
     */
    async buscar(
        personalId: string,
        filtro: FiltroNotificacao = {}
    ): Promise<{ data: Notificacao[]; total: number }> {
        let query = supabase
            .from('notificacoes')
            .select('*, atletas!notificacoes_atleta_id_fkey(nome, foto_url)', { count: 'exact' })
            .eq('personal_id', personalId)
            .order('created_at', { ascending: false })

        // Filtro por categoria
        if (filtro.categoria) {
            query = query.eq('categoria', filtro.categoria)
        }

        // Filtro por prioridade
        if (filtro.prioridade) {
            query = query.eq('prioridade', filtro.prioridade)
        }

        // Filtro por status lida
        if (filtro.lida !== undefined) {
            query = query.eq('lida', filtro.lida)
        }

        // Filtro por aluno
        if (filtro.atletaId) {
            query = query.eq('atleta_id', filtro.atletaId)
        }

        // Filtro por período
        if (filtro.periodo && filtro.periodo !== 'tudo') {
            const dataInicio =
                filtro.periodo === 'hoje'
                    ? getInicioHoje()
                    : filtro.periodo === 'semana'
                        ? getInicioSemana()
                        : getInicioMes()
            query = query.gte('created_at', dataInicio)
        }

        // Busca textual no título/mensagem
        if (filtro.busca) {
            query = query.or(
                `titulo.ilike.%${filtro.busca}%,mensagem.ilike.%${filtro.busca}%`
            )
        }

        // Paginação
        const limit = filtro.limit || 20
        const offset = filtro.offset || 0
        query = query.range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) {
            console.error('[notificacaoService] Erro ao buscar notificações:', error.message)
            return { data: [], total: 0 }
        }

        // Mapear dados do join para campos planos
        const notificacoes: Notificacao[] = (data || []).map((row: Record<string, unknown>) => {
            const atleta = row.atletas as { nome?: string; foto_url?: string } | null
            const { atletas: _, ...rest } = row
            return {
                ...rest,
                atleta_nome: atleta?.nome || undefined,
                atleta_foto: atleta?.foto_url || undefined,
            } as Notificacao
        })

        return { data: notificacoes, total: count || 0 }
    },

    /**
     * Conta notificações não lidas.
     */
    async contarNaoLidas(personalId: string): Promise<number> {
        const { count, error } = await supabase
            .from('notificacoes')
            .select('id', { count: 'exact', head: true })
            .eq('personal_id', personalId)
            .eq('lida', false)

        if (error) {
            console.error('[notificacaoService] Erro ao contar não lidas:', error.message)
            return 0
        }

        return count || 0
    },

    /**
     * Marca uma notificação como lida.
     */
    async marcarComoLida(id: string): Promise<void> {
        const { error } = await supabase
            .from('notificacoes')
            .update({ lida: true, lida_em: new Date().toISOString() })
            .eq('id', id)

        if (error) {
            console.error('[notificacaoService] Erro ao marcar como lida:', error.message)
        }
    },

    /**
     * Marca todas as notificações do personal como lidas.
     */
    async marcarTodasComoLidas(personalId: string): Promise<void> {
        const { error } = await supabase
            .from('notificacoes')
            .update({ lida: true, lida_em: new Date().toISOString() })
            .eq('personal_id', personalId)
            .eq('lida', false)

        if (error) {
            console.error('[notificacaoService] Erro ao marcar todas como lidas:', error.message)
        }
    },

    /**
     * Cria uma nova notificação.
     * Verifica deduplicação por grupo_id.
     */
    async criar(dto: CriarNotificacaoDTO): Promise<Notificacao | null> {
        // Deduplicação: se tem grupo_id, verifica se já existe hoje
        if (dto.grupo_id) {
            const { count } = await supabase
                .from('notificacoes')
                .select('id', { count: 'exact', head: true })
                .eq('personal_id', dto.personal_id)
                .eq('grupo_id', dto.grupo_id)
                .gte('created_at', getInicioHoje())

            if (count && count > 0) {
                console.info('[notificacaoService] Notificação duplicada ignorada:', dto.grupo_id)
                return null
            }
        }

        const { data, error } = await supabase
            .from('notificacoes')
            .insert(dto)
            .select()
            .single()

        if (error) {
            console.error('[notificacaoService] Erro ao criar notificação:', error.message)
            return null
        }

        return data as Notificacao
    },

    /**
     * Cria múltiplas notificações (batch).
     */
    async criarBatch(dtos: CriarNotificacaoDTO[]): Promise<number> {
        if (dtos.length === 0) return 0

        const { data, error } = await supabase
            .from('notificacoes')
            .insert(dtos)
            .select('id')

        if (error) {
            console.error('[notificacaoService] Erro ao criar batch:', error.message)
            return 0
        }

        return data?.length || 0
    },

    /**
     * Remove notificações expiradas (> 90 dias).
     */
    async limparExpiradas(personalId: string): Promise<number> {
        const { data, error } = await supabase
            .from('notificacoes')
            .delete()
            .eq('personal_id', personalId)
            .lt('expires_at', new Date().toISOString())
            .select('id')

        if (error) {
            console.error('[notificacaoService] Erro ao limpar expiradas:', error.message)
            return 0
        }

        return data?.length || 0
    },

    // ===== Configurações =====

    /**
     * Busca configurações do personal (cria se não existir).
     */
    async buscarConfig(personalId: string): Promise<ConfigNotificacoesPersonal> {
        const { data, error } = await supabase
            .from('notificacao_config')
            .select('config')
            .eq('personal_id', personalId)
            .single()

        if (error || !data) {
            // Criar config padrão
            await supabase
                .from('notificacao_config')
                .insert({ personal_id: personalId, config: CONFIG_PADRAO })

            return CONFIG_PADRAO
        }

        return data.config as ConfigNotificacoesPersonal
    },

    /**
     * Atualiza configurações do personal.
     */
    async atualizarConfig(
        personalId: string,
        config: Partial<ConfigNotificacoesPersonal>
    ): Promise<void> {
        // Busca config atual
        const configAtual = await this.buscarConfig(personalId)
        const novaConfig = { ...configAtual, ...config }

        const { error } = await supabase
            .from('notificacao_config')
            .upsert({
                personal_id: personalId,
                config: novaConfig,
            })

        if (error) {
            console.error('[notificacaoService] Erro ao atualizar config:', error.message)
        }
    },
}
