/**
 * Conversational Input Service
 * 
 * Processamento de linguagem natural para input conversacional
 */

import type { ConversationalInput, TrackerType } from '../../types/daily-tracking'

/**
 * Processa input do usuário e identifica intenção
 */
export function processarInput(texto: string): ConversationalInput {
    const textoLower = texto.toLowerCase()

    // Padrões de REFEIÇÃO
    const padroesRefeicao = [
        /comi (.+)/i,
        /almocei (.+)/i,
        /jantei (.+)/i,
        /tomei caf[eé] (.+)/i,
        /lanche (.+)/i,
        /(\d+)g de (.+)/i,
    ]

    // Padrões de TREINO
    const padroesTreino = [
        /treinei (.+)/i,
        /fiz (.+) hoje/i,
        /treino de (.+)/i,
        /academia (.+)/i,
        /malhar (.+)/i,
    ]

    // Padrões de ÁGUA
    const padroesAgua = [
        /bebi (\d+)\s?(ml|l|litros?)/i,
        /tomei (\d+)\s?(ml|l|litros?) de [aá]gua/i,
        /[aá]gua (\d+)/i,
    ]

    // Padrões de SONO
    const padroesSono = [
        /dormi (\d+)h/i,
        /dormi (\d+) horas/i,
        /acordei [àa]s (\d+)/i,
        /sono (.+)/i,
    ]

    // Padrões de DOR
    const padroesDor = [
        /dor (no|na|em) (.+)/i,
        /t[oô] com dor/i,
        /machucado/i,
        /les[ãa]o/i,
        /incomodando/i,
        /sentindo dor/i,
    ]

    // Padrões de CONSULTA
    const padroesConsulta = [
        /quanto (.+) (comi|bebi|treinei)/i,
        /como (est[aá]|t[aá]) (meu|minha) (.+)/i,
        /qual meu (.+)/i,
        /meu progresso/i,
        /resumo/i,
    ]

    // Identificar REFEIÇÃO
    for (const padrao of padroesRefeicao) {
        const match = texto.match(padrao)
        if (match) {
            return {
                texto,
                tipo: 'registro',
                entidade: 'refeicao',
                dados: { descricao: match[1] || match[2] },
            }
        }
    }

    // Identificar TREINO
    for (const padrao of padroesTreino) {
        const match = texto.match(padrao)
        if (match) {
            return {
                texto,
                tipo: 'registro',
                entidade: 'treino',
                dados: { descricao: match[1] },
            }
        }
    }

    // Identificar ÁGUA
    for (const padrao of padroesAgua) {
        const match = texto.match(padrao)
        if (match) {
            let quantidade = parseInt(match[1])
            const unidade = match[2]?.toLowerCase()

            // Converter para ml
            if (unidade && (unidade === 'l' || unidade.includes('litro'))) {
                quantidade = quantidade * 1000
            }

            return {
                texto,
                tipo: 'registro',
                entidade: 'agua',
                dados: { quantidade },
            }
        }
    }

    // Identificar SONO
    for (const padrao of padroesSono) {
        const match = texto.match(padrao)
        if (match) {
            return {
                texto,
                tipo: 'registro',
                entidade: 'sono',
                dados: { horas: match[1] },
            }
        }
    }

    // Identificar DOR
    for (const padrao of padroesDor) {
        const match = texto.match(padrao)
        if (match) {
            return {
                texto,
                tipo: 'registro',
                entidade: 'dor',
                dados: { regiao: match[2] },
            }
        }
    }

    // Identificar CONSULTA
    for (const padrao of padroesConsulta) {
        const match = texto.match(padrao)
        if (match) {
            return {
                texto,
                tipo: 'consulta',
                dados: { query: match[0] },
            }
        }
    }

    // Fallback: enviar para IA processar
    return {
        texto,
        tipo: 'consulta',
    }
}

/**
 * Gera resposta para consulta
 */
export function gerarRespostaConsulta(input: ConversationalInput): string {
    const textoLower = input.texto.toLowerCase()

    // Proteína
    if (textoLower.includes('proteína') || textoLower.includes('proteina')) {
        return '📊 Para ver seus macros de hoje, confira o resumo nutricional acima!'
    }

    // Progresso
    if (textoLower.includes('progresso') || textoLower.includes('evolução') || textoLower.includes('evoluçao')) {
        return '📈 Acesse a seção "Evolução" no menu lateral para ver gráficos do seu progresso!'
    }

    // Treino
    if (textoLower.includes('treino') && (textoLower.includes('qual') || textoLower.includes('amanhã') || textoLower.includes('amanha'))) {
        return '🏋️ Consulte a seção "Estratégia" do Coach IA para ver seu plano de treino personalizado!'
    }

    // Default
    return '💬 Desculpe, não entendi sua pergunta. Tente ser mais específico ou clique em um dos trackers acima para registrar!'
}

/**
 * Exemplos de interações para testes
 */
export const EXEMPLOS_INTERACAO = [
    // REFEIÇÕES
    {
        input: "comi 200g de frango com arroz",
        esperado: { tipo: 'registro', entidade: 'refeicao' },
    },
    {
        input: "almocei um prato feito",
        esperado: { tipo: 'registro', entidade: 'refeicao' },
    },
    {
        input: "tomei café com pão integral",
        esperado: { tipo: 'registro', entidade: 'refeicao' },
    },

    // TREINO
    {
        input: "treinei peito hoje, 1h30",
        esperado: { tipo: 'registro', entidade: 'treino' },
    },
    {
        input: "fiz costas hoje",
        esperado: { tipo: 'registro', entidade: 'treino' },
    },

    // ÁGUA
    {
        input: "bebi 500ml de água",
        esperado: { tipo: 'registro', entidade: 'agua' },
    },
    {
        input: "tomei 1l de água",
        esperado: { tipo: 'registro', entidade: 'agua' },
    },

    // SONO
    {
        input: "dormi 7h",
        esperado: { tipo: 'registro', entidade: 'sono' },
    },
    {
        input: "dormi mal, só 5 horas",
        esperado: { tipo: 'registro', entidade: 'sono' },
    },

    // DOR
    {
        input: "tô com dor no ombro direito",
        esperado: { tipo: 'registro', entidade: 'dor' },
    },
    {
        input: "sentindo dor na lombar",
        esperado: { tipo: 'registro', entidade: 'dor' },
    },

    // CONSULTAS
    {
        input: "quanto de proteína comi hoje?",
        esperado: { tipo: 'consulta' },
    },
    {
        input: "qual meu treino de amanhã?",
        esperado: { tipo: 'consulta' },
    },
    {
        input: "como está meu progresso essa semana?",
        esperado: { tipo: 'consulta' },
    },
]
