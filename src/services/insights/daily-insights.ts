/**
 * Daily Insights Service
 * 
 * Geração de insights inteligentes baseados nos dados diários do atleta
 */

import type { Insight, ResumoDiario, TreinoDiario } from '../../types/daily-tracking'
import { FRASES_MOTIVACIONAIS } from '../../config/tracker-config'

/**
 * Gera o insight mais relevante para o momento atual
 */
export function gerarInsightPrincipal(dados: ResumoDiario): Insight {
    const insights: Insight[] = []

    // ALERTA: Déficit proteico crítico
    if (dados.nutricao.totalProteina < dados.nutricao.metaProteina * 0.3) {
        insights.push({
            tipo: 'alerta',
            prioridade: 1,
            icone: '⚠️',
            mensagem: `Proteína crítica: apenas ${dados.nutricao.totalProteina}g de ${dados.nutricao.metaProteina}g. Você pode perder massa muscular!`,
            acao: {
                label: 'Ver sugestões',
                callback: () => console.log('Mostrar sugestões de proteína'),
            },
        })
    }

    // ALERTA: Treino pendente (passou do horário)
    const agora = new Date()
    if (!dados.treino.realizado && dados.treino.planejado && agora.getHours() > 16) {
        insights.push({
            tipo: 'lembrete',
            prioridade: 2,
            icone: '🏋️',
            mensagem: `Treino de ${dados.treino.tipo || 'hoje'} ainda pendente. Vai conseguir treinar?`,
            acao: {
                label: 'Registrar',
                callback: () => console.log('Abrir modal de treino'),
            },
        })
    }

    // ALERTA: Sono ruim + treino pesado
    if (dados.sono.horas < 6 && dados.treino.planejado) {
        insights.push({
            tipo: 'dica',
            prioridade: 2,
            icone: '💡',
            mensagem: `Você dormiu apenas ${dados.sono.horas}h. Sugiro reduzir a intensidade do treino hoje para evitar lesões.`,
            acao: {
                label: 'Ajustar treino',
                callback: () => console.log('Ajustar intensidade'),
            },
        })
    }

    // ALERTA: Dor reportada
    if (dados.doresAtivas > 0) {
        insights.push({
            tipo: 'alerta',
            prioridade: 1,
            icone: '🤕',
            mensagem: `Você tem ${dados.doresAtivas} dor(es) ativa(s). Evite exercícios que possam agravar a lesão.`,
        })
    }

    // ELOGIO: Streak alto
    if (dados.streakAtual >= 7 && dados.streakAtual % 7 === 0) {
        insights.push({
            tipo: 'elogio',
            prioridade: 4,
            icone: '🔥',
            mensagem: `Incrível! ${dados.streakAtual} dias consecutivos usando o app! Sua consistência é inspiradora!`,
        })
    }

    // ELOGIO: Bateu meta de proteína antes das 18h
    if (dados.nutricao.totalProteina >= dados.nutricao.metaProteina && agora.getHours() < 18) {
        insights.push({
            tipo: 'elogio',
            prioridade: 3,
            icone: '🎯',
            mensagem: `Meta de proteína batida antes das 18h! Excelente planejamento!`,
        })
    }

    // ELOGIO: Dieta perfeita
    if (dados.nutricao.aderenciaPercentual >= 95) {
        insights.push({
            tipo: 'elogio',
            prioridade: 3,
            icone: '🎯',
            mensagem: `Aderência de ${dados.nutricao.aderenciaPercentual}%! Você está no caminho certo!`,
        })
    }

    // DICA: Hidratação baixa
    if (dados.hidratacao.aderenciaPercentual < 50) {
        insights.push({
            tipo: 'dica',
            prioridade: 3,
            icone: '💧',
            mensagem: `Hidratação em ${Math.round(dados.hidratacao.aderenciaPercentual)}%. Beba água para melhorar performance e recuperação.`,
            acao: {
                label: '+500ml',
                callback: () => console.log('Adicionar 500ml'),
            },
        })
    }

    // DICA: Déficit proteico moderado (hora do jantar)
    if (
        dados.nutricao.totalProteina < dados.nutricao.metaProteina * 0.7 &&
        agora.getHours() >= 18
    ) {
        const faltam = dados.nutricao.metaProteina - dados.nutricao.totalProteina
        insights.push({
            tipo: 'dica',
            prioridade: 2,
            icone: '💡',
            mensagem: `Faltam ${Math.round(faltam)}g de proteína. Que tal um shake pós-treino com 2 scoops de whey?`,
        })
    }

    // DEFAULT: Dica motivacional
    if (insights.length === 0) {
        insights.push({
            tipo: 'dica',
            prioridade: 5,
            icone: '💪',
            mensagem: getMotivacionalAleatorio(),
        })
    }

    // Retornar insight de maior prioridade
    return insights.sort((a, b) => a.prioridade - b.prioridade)[0]
}

/**
 * Retorna frase motivacional aleatória
 */
export function getMotivacionalAleatorio(): string {
    return FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)]
}

/**
 * Gera insight específico para déficit proteico
 */
export function gerarInsightDeficitProteico(
    atual: number,
    meta: number
): Insight {
    const faltam = meta - atual
    const percentual = (atual / meta) * 100

    if (percentual < 30) {
        return {
            tipo: 'alerta',
            prioridade: 1,
            icone: '⚠️',
            mensagem: `Proteína crítica! Faltam ${Math.round(faltam)}g para sua meta. Priorize proteína agora!`,
        }
    } else if (percentual < 70) {
        return {
            tipo: 'dica',
            prioridade: 2,
            icone: '💡',
            mensagem: `Faltam ${Math.round(faltam)}g de proteína. Sugestão: ${getSugestaoProteinaParaQuantidade(faltam)}`,
        }
    } else {
        return {
            tipo: 'dica',
            prioridade: 3,
            icone: '💪',
            mensagem: `Faltam apenas ${Math.round(faltam)}g de proteína. Você está quase lá!`,
        }
    }
}

/**
 * Sugere fonte de proteína baseada na quantidade faltante
 */
function getSugestaoProteinaParaQuantidade(gramas: number): string {
    if (gramas <= 25) {
        return 'Shake com 1 scoop de whey'
    } else if (gramas <= 50) {
        return 'Shake com 2 scoops de whey + 200ml de leite'
    } else if (gramas <= 80) {
        return '200g de frango grelhado + shake de whey'
    } else {
        return 'Refeição completa com 250g de proteína (frango/peixe/carne) + shake'
    }
}

/**
 * Gera insight sobre hidratação
 */
export function gerarInsightHidratacao(
    atualMl: number,
    metaMl: number,
    horaTreino?: string
): Insight {
    const percentual = (atualMl / metaMl) * 100

    if (percentual < 30) {
        return {
            tipo: 'alerta',
            prioridade: 2,
            icone: '💧',
            mensagem: `Hidratação muito baixa! Você está em apenas ${Math.round(percentual)}% da meta.`,
            acao: {
                label: '+500ml',
                callback: () => console.log('Adicionar água'),
            },
        }
    } else if (percentual < 60 && horaTreino) {
        return {
            tipo: 'dica',
            prioridade: 2,
            icone: '💧',
            mensagem: `Você treina às ${horaTreino}. Beba pelo menos 500ml antes do treino!`,
            acao: {
                label: '+500ml',
                callback: () => console.log('Adicionar água'),
            },
        }
    } else if (percentual >= 100) {
        return {
            tipo: 'elogio',
            prioridade: 4,
            icone: '💧',
            mensagem: `Meta de hidratação atingida! Parabéns pela disciplina!`,
        }
    } else {
        return {
            tipo: 'dica',
            prioridade: 3,
            icone: '💧',
            mensagem: `${Math.round(percentual)}% da meta de água. Continue bebendo ao longo do dia!`,
        }
    }
}

/**
 * Gera insight sobre sono e energia
 */
export function gerarInsightSono(
    horasSono: number,
    qualidade: number,
    energia: number
): Insight {
    if (horasSono < 6) {
        return {
            tipo: 'alerta',
            prioridade: 2,
            icone: '😴',
            mensagem: `Apenas ${horasSono}h de sono! Isso pode comprometer sua recuperação e ganhos.`,
        }
    } else if (horasSono >= 8 && qualidade >= 4) {
        return {
            tipo: 'elogio',
            prioridade: 4,
            icone: '😴',
            mensagem: `${horasSono}h de sono de qualidade! Recuperação perfeita!`,
        }
    } else if (energia < 5 && horasSono < 8) {
        return {
            tipo: 'dica',
            prioridade: 2,
            icone: '💡',
            mensagem: `Energia baixa com ${horasSono}h de sono. Tente dormir 1-2h mais cedo hoje.`,
        }
    } else {
        return {
            tipo: 'dica',
            prioridade: 3,
            icone: '😴',
            mensagem: `${horasSono}h de sono é bom, mas você pode melhorar a qualidade.`,
        }
    }
}

/**
 * Gera insight sobre treino
 */
export function gerarInsightTreino(
    treino: Partial<TreinoDiario>,
    horarioAtual: Date
): Insight | null {
    if (!treino) return null

    const hora = horarioAtual.getHours()

    // Treino pendente à tarde
    if (!treino.status || treino.status === 'pendente') {
        if (hora >= 16) {
            return {
                tipo: 'lembrete',
                prioridade: 2,
                icone: '🏋️',
                mensagem: `Treino de ${treino.grupamento || 'hoje'} ainda pendente. Vai conseguir treinar?`,
                acao: {
                    label: 'Registrar',
                    callback: () => console.log('Abrir modal treino'),
                },
            }
        }
    }

    // Treino completo
    if (treino.status === 'completo') {
        return {
            tipo: 'elogio',
            prioridade: 4,
            icone: '💪',
            mensagem: `Treino de ${treino.grupamento} concluído! Mais um passo rumo ao físico ideal!`,
        }
    }

    return null
}

/**
 * Gera insights para dashboard do Personal
 */
export function gerarInsightsPersonal(
    atletaId: string,
    dados: ResumoDiario
): string[] {
    const insights: string[] = []

    // Déficit nutricional
    if (dados.nutricao.aderenciaPercentual < 50) {
        insights.push(`Aderência de dieta baixa (${Math.round(dados.nutricao.aderenciaPercentual)}%)`)
    }

    // Treino não realizado
    if (dados.treino.planejado && !dados.treino.realizado) {
        insights.push('Treino pendente')
    }

    // Sono ruim por dias consecutivos
    if (dados.sono.horas < 6) {
        insights.push(`Sono ruim (${dados.sono.horas}h)`)
    }

    // Energia baixa
    if (dados.sono.energiaResultante < 5) {
        insights.push(`Energia baixa (${dados.sono.energiaResultante}/10)`)
    }

    // Dor ativa
    if (dados.doresAtivas > 0) {
        insights.push(`${dados.doresAtivas} dor(es) ativa(s)`)
    }

    return insights
}
