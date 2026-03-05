/**
 * Verificador de Inatividade — VITRU IA
 *
 * Roda no login do Personal para detectar alunos
 * que não treinam ou não acessam o portal há X dias.
 * Gera notificações agrupadas por tipo.
 */

import { supabase } from './supabase'
import { notificacaoService } from './notificacao.service'
import type { CriarNotificacaoDTO } from '@/types/notificacao.types'

const DIAS_INATIVO_TREINO_3 = 3
const DIAS_INATIVO_TREINO_7 = 7
const DIAS_INATIVO_PORTAL_7 = 7
const DIAS_INATIVO_PORTAL_30 = 30
const DIAS_SEM_MEDICAO_14 = 14
const DIAS_SEM_MEDICAO_30 = 30

/**
 * Verifica inatividade de todos os alunos do personal.
 * Deve ser chamada uma vez por sessão (no login ou ao abrir o app).
 */
export async function verificarInatividade(personalId: string): Promise<number> {
    // Buscar alunos ativos do personal
    const { data: atletas, error } = await supabase
        .from('atletas')
        .select('id, nome, portal_ultimo_acesso, portal_acessos')
        .eq('personal_id', personalId)
        .eq('ativo', true)

    if (error || !atletas || atletas.length === 0) {
        return 0
    }

    const agora = new Date()
    const hoje = agora.toISOString().slice(0, 10)
    const notificacoes: CriarNotificacaoDTO[] = []

    for (const atleta of atletas) {
        const a = atleta as Record<string, unknown>
        const atletaId = a.id as string
        const nome = a.nome as string || 'Atleta'

        // 1. Verificar último treino
        const { data: ultimoTreino } = await supabase
            .from('registros_diarios')
            .select('data')
            .eq('atleta_id', atletaId)
            .eq('tipo', 'treino')
            .order('data', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (ultimoTreino) {
            const dataUltimoTreino = new Date((ultimoTreino as Record<string, unknown>).data as string)
            const diasSemTreino = Math.floor((agora.getTime() - dataUltimoTreino.getTime()) / 86_400_000)

            if (diasSemTreino >= DIAS_INATIVO_TREINO_7) {
                notificacoes.push({
                    personal_id: personalId,
                    atleta_id: atletaId,
                    tipo: 'SEM_TREINO_7D',
                    categoria: 'treino',
                    prioridade: 'alerta',
                    titulo: `🚨 <strong>${nome}</strong> não treina há ${diasSemTreino} dias`,
                    mensagem: `Último treino: ${dataUltimoTreino.toLocaleDateString('pt-BR')}. Considere entrar em contato.`,
                    dados: { diasSemTreino, ultimoTreino: (ultimoTreino as Record<string, unknown>).data },
                    acao_url: `/athlete-details/${atletaId}`,
                    acao_label: 'Ver perfil →',
                    grupo_id: `inativo-treino-7d-${atletaId}-${hoje}`,
                })
            } else if (diasSemTreino >= DIAS_INATIVO_TREINO_3) {
                notificacoes.push({
                    personal_id: personalId,
                    atleta_id: atletaId,
                    tipo: 'SEM_TREINO_3D',
                    categoria: 'treino',
                    prioridade: 'normal',
                    titulo: `⏰ <strong>${nome}</strong> não treina há ${diasSemTreino} dias`,
                    mensagem: `Último treino: ${dataUltimoTreino.toLocaleDateString('pt-BR')}.`,
                    dados: { diasSemTreino, ultimoTreino: (ultimoTreino as Record<string, unknown>).data },
                    acao_url: `/athlete-details/${atletaId}`,
                    acao_label: 'Ver perfil →',
                    grupo_id: `inativo-treino-3d-${atletaId}-${hoje}`,
                })
            }
        }

        // 2. Verificar último acesso ao portal
        const ultimoAcesso = a.portal_ultimo_acesso as string | null
        if (ultimoAcesso && (a.portal_acessos as number) > 0) {
            const dataUltimoAcesso = new Date(ultimoAcesso)
            const diasSemAcesso = Math.floor((agora.getTime() - dataUltimoAcesso.getTime()) / 86_400_000)

            if (diasSemAcesso >= DIAS_INATIVO_PORTAL_30) {
                notificacoes.push({
                    personal_id: personalId,
                    atleta_id: atletaId,
                    tipo: 'PORTAL_INATIVO_30D',
                    categoria: 'portal',
                    prioridade: 'alerta',
                    titulo: `👻 <strong>${nome}</strong> não acessa o Portal há ${diasSemAcesso} dias`,
                    mensagem: `Último acesso: ${dataUltimoAcesso.toLocaleDateString('pt-BR')}. Aluno pode estar desmotivado.`,
                    dados: { diasSemAcesso, ultimoAcesso },
                    acao_url: `/athlete-details/${atletaId}`,
                    acao_label: 'Ver perfil →',
                    grupo_id: `inativo-portal-30d-${atletaId}-${hoje}`,
                })
            } else if (diasSemAcesso >= DIAS_INATIVO_PORTAL_7) {
                notificacoes.push({
                    personal_id: personalId,
                    atleta_id: atletaId,
                    tipo: 'PORTAL_INATIVO_7D',
                    categoria: 'portal',
                    prioridade: 'normal',
                    titulo: `📱 <strong>${nome}</strong> não acessa o Portal há ${diasSemAcesso} dias`,
                    mensagem: `Último acesso: ${dataUltimoAcesso.toLocaleDateString('pt-BR')}.`,
                    dados: { diasSemAcesso, ultimoAcesso },
                    acao_url: `/athlete-details/${atletaId}`,
                    acao_label: 'Ver perfil →',
                    grupo_id: `inativo-portal-7d-${atletaId}-${hoje}`,
                })
            }
        }

        // 3. Verificar última medição
        const { data: ultimaMedicao } = await supabase
            .from('medidas')
            .select('data')
            .eq('atleta_id', atletaId)
            .order('data', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (ultimaMedicao) {
            const dataUltimaMedicao = new Date((ultimaMedicao as Record<string, unknown>).data as string)
            const diasSemMedicao = Math.floor((agora.getTime() - dataUltimaMedicao.getTime()) / 86_400_000)

            if (diasSemMedicao >= DIAS_SEM_MEDICAO_30) {
                notificacoes.push({
                    personal_id: personalId,
                    atleta_id: atletaId,
                    tipo: 'SEM_MEDICAO_30D',
                    categoria: 'medidas',
                    prioridade: 'alerta',
                    titulo: `📏 <strong>${nome}</strong> sem medição há ${diasSemMedicao} dias`,
                    mensagem: `Última medição: ${dataUltimaMedicao.toLocaleDateString('pt-BR')}. Hora de medir novamente!`,
                    dados: { diasSemMedicao, ultimaMedicao: (ultimaMedicao as Record<string, unknown>).data },
                    acao_url: `/athlete-details/${atletaId}`,
                    acao_label: 'Ver perfil →',
                    grupo_id: `sem-medicao-30d-${atletaId}-${hoje}`,
                })
            } else if (diasSemMedicao >= DIAS_SEM_MEDICAO_14) {
                notificacoes.push({
                    personal_id: personalId,
                    atleta_id: atletaId,
                    tipo: 'SEM_MEDICAO_14D',
                    categoria: 'medidas',
                    prioridade: 'normal',
                    titulo: `📏 <strong>${nome}</strong> sem medição há ${diasSemMedicao} dias`,
                    mensagem: `Última medição: ${dataUltimaMedicao.toLocaleDateString('pt-BR')}.`,
                    dados: { diasSemMedicao, ultimaMedicao: (ultimaMedicao as Record<string, unknown>).data },
                    acao_url: `/athlete-details/${atletaId}`,
                    acao_label: 'Ver perfil →',
                    grupo_id: `sem-medicao-14d-${atletaId}-${hoje}`,
                })
            }
        }
    }

    // Criar todas as notificações de inatividade (com deduplicação via grupo_id)
    let criadas = 0
    for (const notif of notificacoes) {
        const result = await notificacaoService.criar(notif)
        if (result) criadas++
    }

    if (criadas > 0) {
        console.info(`[verificarInatividade] ${criadas} notificações de inatividade criadas para ${notificacoes.length} verificações`)
    }

    return criadas
}
