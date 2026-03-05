/**
 * Gatilhos de Notificação — VITRU IA
 *
 * Funções que disparam notificações para o Personal
 * baseadas em eventos de treino, medidas e avaliações.
 */

import { notificacaoService } from './notificacao.service'
import type { CriarNotificacaoDTO, TipoNotificacao } from '@/types/notificacao.types'

// ===== Helpers =====

/**
 * Busca o personal_id a partir do atleta_id.
 * Necessário porque o atleta está vinculado ao personal.
 */
async function buscarPersonalDoAtleta(atletaId: string): Promise<string | null> {
    // Import dinâmico para evitar circular dependency
    const { supabase } = await import('./supabase')

    const { data, error } = await supabase
        .from('atletas')
        .select('personal_id')
        .eq('id', atletaId)
        .single()

    if (error || !data) {
        console.error('[notificacaoTriggers] Personal não encontrado para atleta:', atletaId)
        return null
    }

    return data.personal_id
}

/**
 * Busca nome do atleta para a mensagem.
 */
async function buscarNomeAtleta(atletaId: string): Promise<string> {
    const { supabase } = await import('./supabase')

    const { data } = await supabase
        .from('atletas')
        .select('nome')
        .eq('id', atletaId)
        .single()

    return data?.nome || 'Atleta'
}

/**
 * Cria notificação com verificação de personal.
 */
async function criarNotificacaoParaAtleta(
    atletaId: string,
    dados: Omit<CriarNotificacaoDTO, 'personal_id' | 'atleta_id'>
): Promise<void> {
    const personalId = await buscarPersonalDoAtleta(atletaId)
    if (!personalId) return

    await notificacaoService.criar({
        ...dados,
        personal_id: personalId,
        atleta_id: atletaId,
    })
}

// ===== GATILHOS DE TREINO =====

/**
 * Disparar quando aluno completa um treino.
 */
export async function onTreinoCompleto(
    atletaId: string,
    dados: { grupo?: string; duracao?: string }
): Promise<void> {
    const nome = await buscarNomeAtleta(atletaId)
    const grupo = dados.grupo || 'do dia'
    const duracao = dados.duracao ? ` (${dados.duracao})` : ''

    await criarNotificacaoParaAtleta(atletaId, {
        tipo: 'TREINO_COMPLETO',
        categoria: 'treino',
        prioridade: 'normal',
        titulo: `💪 <strong>${nome}</strong> completou o treino de ${grupo}${duracao}`,
        mensagem: `Treino de ${grupo} finalizado${duracao}`,
        dados: { grupo, duracao: dados.duracao },
        acao_url: `/athlete-details/${atletaId}`,
        acao_label: 'Ver perfil →',
        grupo_id: `treino-completo-${atletaId}-${new Date().toISOString().slice(0, 10)}`,
    })
}

/**
 * Disparar quando aluno pula treino.
 */
export async function onTreinoPulado(
    atletaId: string,
    dados?: { grupo?: string }
): Promise<void> {
    const nome = await buscarNomeAtleta(atletaId)
    const grupo = dados?.grupo || 'do dia'

    await criarNotificacaoParaAtleta(atletaId, {
        tipo: 'TREINO_PULADO',
        categoria: 'treino',
        prioridade: 'normal',
        titulo: `⏭️ <strong>${nome}</strong> pulou o treino de hoje (${grupo})`,
        mensagem: `Treino de ${grupo} foi pulado`,
        dados: { grupo },
        acao_url: `/athlete-details/${atletaId}`,
        acao_label: 'Ver perfil →',
        // Treinos pulados NÃO são agrupados - cada um é individual
    })
}

// ===== GATILHOS DE MEDIDAS & AVALIAÇÃO =====

/**
 * Disparar quando aluno registra medidas pelo Portal.
 */
export async function onNovaMedicaoPortal(atletaId: string): Promise<void> {
    const nome = await buscarNomeAtleta(atletaId)

    await criarNotificacaoParaAtleta(atletaId, {
        tipo: 'NOVA_MEDICAO_PORTAL',
        categoria: 'medidas',
        prioridade: 'normal',
        titulo: `📏 <strong>${nome}</strong> registrou novas medidas pelo Portal`,
        mensagem: 'Novas medidas disponíveis para avaliação',
        acao_url: `/athlete-details/${atletaId}`,
        acao_label: 'Ver medidas →',
        grupo_id: `nova-medicao-${atletaId}-${new Date().toISOString().slice(0, 10)}`,
    })
}

/**
 * Disparar após nova avaliação comparada com a anterior.
 * Gera múltiplas notificações conforme diferenças detectadas.
 */
export async function onNovaAvaliacao(
    atletaId: string,
    scoreAtual: number,
    scoreAnterior: number | null,
    dados: {
        classificacaoAtual?: string
        classificacaoAnterior?: string
        gorduraAtual?: number
        gorduraAnterior?: number
        scoreMeta?: number
        maxScoreHistorico?: number
    } = {}
): Promise<void> {
    const nome = await buscarNomeAtleta(atletaId)
    const personalId = await buscarPersonalDoAtleta(atletaId)
    if (!personalId) return

    const notificacoes: CriarNotificacaoDTO[] = []

    // 1. Score subiu / caiu
    if (scoreAnterior !== null) {
        const diff = scoreAtual - scoreAnterior
        const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)

        if (diff > 0) {
            notificacoes.push({
                personal_id: personalId,
                atleta_id: atletaId,
                tipo: 'SCORE_SUBIU',
                categoria: 'medidas',
                prioridade: 'destaque',
                titulo: `📈 <strong>${nome}</strong>: Score subiu de ${scoreAnterior.toFixed(1)} para ${scoreAtual.toFixed(1)} (${diffStr} pts)`,
                mensagem: `Evolução de ${diffStr} pontos no score geral`,
                dados: { scoreAtual, scoreAnterior, diff },
                acao_url: `/athlete-details/${atletaId}`,
                acao_label: 'Ver avaliação →',
            })
        } else if (diff < -1) {
            notificacoes.push({
                personal_id: personalId,
                atleta_id: atletaId,
                tipo: 'SCORE_CAIU',
                categoria: 'medidas',
                prioridade: 'alerta',
                titulo: `📉 <strong>${nome}</strong>: Score caiu de ${scoreAnterior.toFixed(1)} para ${scoreAtual.toFixed(1)} (${diffStr} pts)`,
                mensagem: `Regressão de ${Math.abs(diff).toFixed(1)} pontos no score geral`,
                dados: { scoreAtual, scoreAnterior, diff },
                acao_url: `/athlete-details/${atletaId}`,
                acao_label: 'Ver avaliação →',
            })
        }
    }

    // 2. Gordura
    if (dados.gorduraAtual !== undefined && dados.gorduraAnterior !== undefined) {
        const diffGordura = dados.gorduraAtual - dados.gorduraAnterior

        if (diffGordura < -0.5) {
            notificacoes.push({
                personal_id: personalId,
                atleta_id: atletaId,
                tipo: 'GORDURA_REDUZIDA',
                categoria: 'medidas',
                prioridade: 'destaque',
                titulo: `🔥 <strong>${nome}</strong> reduziu gordura de ${dados.gorduraAnterior.toFixed(1)}% para ${dados.gorduraAtual.toFixed(1)}% (${diffGordura.toFixed(1)}%)`,
                mensagem: `Redução de ${Math.abs(diffGordura).toFixed(1)}% de gordura corporal`,
                dados: { gorduraAtual: dados.gorduraAtual, gorduraAnterior: dados.gorduraAnterior, diff: diffGordura },
                acao_url: `/athlete-details/${atletaId}`,
                acao_label: 'Ver detalhes →',
            })
        } else if (diffGordura > 2) {
            notificacoes.push({
                personal_id: personalId,
                atleta_id: atletaId,
                tipo: 'GORDURA_AUMENTOU',
                categoria: 'medidas',
                prioridade: 'alerta',
                titulo: `⚠️ <strong>${nome}</strong>: Gordura subiu de ${dados.gorduraAnterior.toFixed(1)}% para ${dados.gorduraAtual.toFixed(1)}% (+${diffGordura.toFixed(1)}%)`,
                mensagem: `Aumento de ${diffGordura.toFixed(1)}% de gordura corporal`,
                dados: { gorduraAtual: dados.gorduraAtual, gorduraAnterior: dados.gorduraAnterior, diff: diffGordura },
                acao_url: `/athlete-details/${atletaId}`,
                acao_label: 'Ver detalhes →',
            })
        }
    }

    // 3. Meta atingida
    if (dados.scoreMeta && scoreAtual >= dados.scoreMeta) {
        notificacoes.push({
            personal_id: personalId,
            atleta_id: atletaId,
            tipo: 'META_ATINGIDA',
            categoria: 'conquistas',
            prioridade: 'destaque',
            titulo: `🏆 <strong>${nome}</strong> atingiu a meta de ${dados.scoreMeta.toFixed(0)} pts!`,
            mensagem: `Score atual: ${scoreAtual.toFixed(1)} pts. Hora de celebrar!`,
            dados: { scoreAtual, scoreMeta: dados.scoreMeta },
            acao_url: `/athlete-details/${atletaId}`,
            acao_label: 'Ver perfil →',
            grupo_id: `meta-atingida-${atletaId}`,
        })
    }

    // 4. Mudou classificação
    if (dados.classificacaoAtual && dados.classificacaoAnterior &&
        dados.classificacaoAtual !== dados.classificacaoAnterior) {
        notificacoes.push({
            personal_id: personalId,
            atleta_id: atletaId,
            tipo: 'MUDOU_CLASSIFICACAO',
            categoria: 'conquistas',
            prioridade: 'destaque',
            titulo: `⬆️ <strong>${nome}</strong> evoluiu de ${dados.classificacaoAnterior} para ${dados.classificacaoAtual}!`,
            mensagem: `Nova classificação: ${dados.classificacaoAtual}`,
            dados: { classificacaoAtual: dados.classificacaoAtual, classificacaoAnterior: dados.classificacaoAnterior },
            acao_url: `/athlete-details/${atletaId}`,
            acao_label: 'Ver evolução →',
        })
    }

    // 5. Recorde pessoal
    if (dados.maxScoreHistorico !== undefined && scoreAtual > dados.maxScoreHistorico) {
        notificacoes.push({
            personal_id: personalId,
            atleta_id: atletaId,
            tipo: 'RECORDE_PESSOAL',
            categoria: 'conquistas',
            prioridade: 'destaque',
            titulo: `🔥 <strong>${nome}</strong> bateu recorde pessoal: ${scoreAtual.toFixed(1)} pts!`,
            mensagem: `Recorde anterior: ${dados.maxScoreHistorico.toFixed(1)} pts`,
            dados: { scoreAtual, maxScoreHistorico: dados.maxScoreHistorico },
            acao_url: `/athlete-details/${atletaId}`,
            acao_label: 'Ver detalhes →',
        })
    }

    // Criar todas as notificações
    if (notificacoes.length > 0) {
        await notificacaoService.criarBatch(notificacoes)
        console.info(`[notificacaoTriggers] Criadas ${notificacoes.length} notificações para avaliação de ${nome}`)
    }
}

// ===== GATILHOS DE PORTAL =====

/**
 * Disparar quando aluno acessa portal pela primeira vez.
 */
export async function onPrimeiroAcessoPortal(atletaId: string): Promise<void> {
    const nome = await buscarNomeAtleta(atletaId)

    await criarNotificacaoParaAtleta(atletaId, {
        tipo: 'PRIMEIRO_ACESSO',
        categoria: 'portal',
        prioridade: 'destaque',
        titulo: `🎉 <strong>${nome}</strong> acessou o Portal pela primeira vez!`,
        mensagem: 'Seu aluno está conectado ao VITRU IA',
        acao_url: `/athlete-details/${atletaId}`,
        acao_label: 'Ver perfil →',
        grupo_id: `primeiro-acesso-${atletaId}`,
    })
}

/**
 * Disparar quando aluno reporta dor/desconforto.
 */
export async function onDorReportada(
    atletaId: string,
    dados: { local: string; intensidade: number }
): Promise<void> {
    const nome = await buscarNomeAtleta(atletaId)

    await criarNotificacaoParaAtleta(atletaId, {
        tipo: 'DOR_REPORTADA',
        categoria: 'portal',
        prioridade: 'urgente',
        titulo: `🩹 <strong>${nome}</strong> reportou dor em ${dados.local}`,
        mensagem: `Intensidade: ${dados.intensidade}/10. Requer atenção imediata.`,
        dados: { local: dados.local, intensidade: dados.intensidade },
        acao_url: `/athlete-details/${atletaId}`,
        acao_label: 'Ver detalhes →',
        // Dor NUNCA é deduplicada — cada reporte é individual
    })
}

/**
 * Disparar quando aluno preenche o formulário de contexto via Portal.
 */
export async function onContextoPreenchido(atletaId: string): Promise<void> {
    const nome = await buscarNomeAtleta(atletaId)

    await criarNotificacaoParaAtleta(atletaId, {
        tipo: 'CONTEXTO_PREENCHIDO',
        categoria: 'portal',
        prioridade: 'destaque',
        titulo: `📝 <strong>${nome}</strong> preencheu o formulário de contexto`,
        mensagem: 'Dados de saúde, lesões, rotina e histórico já disponíveis na ficha do atleta.',
        acao_url: `/athlete-details/${atletaId}`,
        acao_label: 'Ver contexto →',
        grupo_id: `contexto-preenchido-${atletaId}`,
    })
}
