/**
 * objetivos.ts — Sistema de Objetivos do Atleta (VITRÚVIO IA)
 *
 * Define os 6 objetivos disponíveis e a lógica de recomendação
 * baseada na análise do diagnóstico (BF%, FFMI, nível, proporções).
 *
 * @see docs/specs/objetivos-do-atleta.md
 */

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type ObjetivoVitruvio =
    | 'BULK'
    | 'CUT'
    | 'RECOMP'
    | 'GOLDEN_RATIO'
    | 'TRANSFORM'
    | 'MAINTAIN';

export interface ObjetivoMeta {
    codigo: ObjetivoVitruvio;
    label: string;
    emoji: string;
    descricao: string;
    cor: string;                // Tailwind color class for badge
    mensagemInicio: string;
}

export interface RecomendacaoObjetivo {
    objetivo: ObjetivoVitruvio;
    confianca: 'ALTA' | 'MEDIA' | 'BAIXA';
    justificativa: string;
    alternativa?: ObjetivoVitruvio;
}

// ═══════════════════════════════════════════════════════════
// METADADOS
// ═══════════════════════════════════════════════════════════

export const OBJETIVOS_META: Record<ObjetivoVitruvio, ObjetivoMeta> = {
    BULK: {
        codigo: 'BULK',
        label: 'Ganhar Massa',
        emoji: '🏋️',
        descricao: 'Foco em maximizar ganho de massa muscular com superávit calórico controlado.',
        cor: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
        mensagemInicio: 'Hora de construir! Vamos focar em ganho de massa com qualidade. Lembre-se: paciência é chave — ganhos sólidos levam tempo.',
    },
    CUT: {
        codigo: 'CUT',
        label: 'Emagrecer / Definir',
        emoji: '🔥',
        descricao: 'Perder gordura preservando ao máximo a massa muscular.',
        cor: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
        mensagemInicio: 'Vamos revelar o trabalho duro! Proteína alta, treino pesado, déficit moderado. Você vai se surpreender com o que está escondido.',
    },
    RECOMP: {
        codigo: 'RECOMP',
        label: 'Recomposição',
        emoji: '⚖️',
        descricao: 'Perder gordura e ganhar músculo simultaneamente, mantendo o peso estável.',
        cor: 'text-primary border-primary/30 bg-primary/10',
        mensagemInicio: 'A transformação silenciosa começa agora. A balança pode não mudar muito, mas o espelho vai contar outra história.',
    },
    GOLDEN_RATIO: {
        codigo: 'GOLDEN_RATIO',
        label: 'Físico Proporcional',
        emoji: '📐',
        descricao: 'Alcançar proporções corporais áureas — shape equilibrado, simétrico e esteticamente harmonioso.',
        cor: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
        mensagemInicio: 'Vamos esculpir proporções de estátua grega! Foco cirúrgico nos pontos que vão fazer a maior diferença no seu shape.',
    },
    TRANSFORM: {
        codigo: 'TRANSFORM',
        label: 'Transformação Completa',
        emoji: '🔄',
        descricao: 'Mudança radical de composição corporal em 12 meses, combinando fases estratégicas.',
        cor: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
        mensagemInicio: '12 meses para uma nova versão de você. Comprometimento total. Resultados extraordinários.',
    },
    MAINTAIN: {
        codigo: 'MAINTAIN',
        label: 'Manutenção',
        emoji: '✨',
        descricao: 'Manter o físico atual com mínimo esforço — foco em sustentabilidade e qualidade de vida.',
        cor: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
        mensagemInicio: 'Missão: manter os ganhos com eficiência. Treino inteligente, vida equilibrada.',
    },
};

// ═══════════════════════════════════════════════════════════
// ALGORITMO DE RECOMENDAÇÃO
// Baseado na Seção 19 da SPEC: docs/specs/objetivos-do-atleta.md
// ═══════════════════════════════════════════════════════════

export interface InputRecomendacao {
    bf: number;                 // % gordura corporal atual
    ffmi: number;               // Fat-Free Mass Index
    sexo: 'M' | 'F';
    score: number;              // Score geral vitrúvio (0-100)
    nivel: string;              // 'INICIANTE' | 'INTERMEDIÁRIO' | 'AVANÇADO' | 'ATLÉTICO' | 'ELITE'
    adonis?: number;            // Índice de Adônis (ombros/cintura), se disponível
}

export function recomendarObjetivo(input: InputRecomendacao): RecomendacaoObjetivo {
    const { bf, ffmi, sexo, score, nivel, adonis } = input;

    // Thresholds por sexo
    const bfAlto = sexo === 'M' ? 25 : 35;
    const bfModerado = sexo === 'M' ? 18 : 28;
    const bfBaixo = sexo === 'M' ? 12 : 20;
    const ffmiAlto = sexo === 'M' ? 22 : 18;
    const adonisIdeal = 1.618;
    // Adônis < 1.55 = ainda longe do ideal estético (ratio ombros÷cintura),
    // acima de 1.55 o atleta já tem bom V-taper e outras prioridades fazem mais sentido
    const adonisLimite = 1.55;

    // ─── Caso 1: BF muito alto — CUT obrigatório ───
    if (bf > bfAlto) {
        return {
            objetivo: 'CUT',
            confianca: 'ALTA',
            justificativa: `Seu percentual de gordura atual (${bf}%) está acima do ideal para qualquer outro objetivo. O foco deve ser reduzir a gordura primeiro para liberar o potencial total do treinamento.`,
            alternativa: 'TRANSFORM',
        };
    }

    // ─── Caso 2: BF moderado-alto — CUT ou TRANSFORM ───
    if (bf > bfModerado) {
        const isComprometido = nivel !== 'INICIANTE';
        if (isComprometido) {
            return {
                objetivo: 'TRANSFORM',
                confianca: 'MEDIA',
                justificativa: `Com ${bf}% de gordura e experiência de treino, você tem potencial para uma transformação completa: reduzir gordura e adicionar massa de forma estratégica nos próximos 12 meses.`,
                alternativa: 'CUT',
            };
        }
        return {
            objetivo: 'CUT',
            confianca: 'ALTA',
            justificativa: `Com ${bf}% de gordura corporal, a prioridade é reduzir gordura. Isso vai melhorar sua saúde, revelar sua musculatura e otimizar a sensibilidade à insulina para ganhos futuros.`,
        };
    }

    // ─── Caso 3: Proporções desbalanceadas — GOLDEN_RATIO ───
    if (adonis !== undefined && adonis < adonisLimite && bf <= bfModerado) {
        return {
            objetivo: 'GOLDEN_RATIO',
            confianca: 'ALTA',
            justificativa: `Seu índice de Adônis (${adonis.toFixed(2)}) indica desproporção significativa entre ombros e cintura. Com o físico já relativamente definido, o foco em proporções áureas vai gerar o maior impacto visual.`,
            alternativa: 'RECOMP',
        };
    }

    // ─── Caso 4: Score intermediário-alto + BF controlado — GOLDEN_RATIO ───
    // Atleta treinado com BF ok mas proporções ainda longe do ideal → GOLDEN_RATIO é o próximo nível
    if (score >= 65 && bf < bfModerado) {
        return {
            objetivo: 'GOLDEN_RATIO',
            confianca: score >= 75 ? 'ALTA' : 'MEDIA',
            justificativa: `Com score de ${score} e BF controlado (${bf}%), você já saiu da fase de composição básica. O próximo nível é escultural: refinar as proporções áureas — ombros, V-taper, Índice de Adônis — é o que vai fazer a diferença real no shape.`,
            alternativa: nivel === 'AVANÇADO' || nivel === 'ATLÉTICO' || nivel === 'ELITE' ? 'MAINTAIN' : 'RECOMP',
        };
    }

    // ─── Caso 5: BF baixo + FFMI baixo — BULK ───
    if (bf < bfBaixo && ffmi < ffmiAlto) {
        return {
            objetivo: 'BULK',
            confianca: 'ALTA',
            justificativa: `Você está magro (${bf}% BF) com FFMI de ${ffmi.toFixed(1)}, indicando potencial significativo de hipertrofia. O foco em ganho de massa muscular com lean bulk vai maximizar seus resultados.`,
        };
    }

    // ─── Caso 6: Iniciante com BF moderado — RECOMP ───
    if (nivel === 'INICIANTE' && bf >= bfBaixo && bf <= bfModerado) {
        return {
            objetivo: 'RECOMP',
            confianca: 'ALTA',
            justificativa: `Como ${nivel.toLowerCase()}, você tem alta capacidade de ganhar músculo e perder gordura simultaneamente — isso é o que chamamos de "muscle memory" e "newbie gains". A recomposição é a estratégia mais eficiente agora.`,
        };
    }

    // ─── Caso 7: FFMI alto / satisfeito — MAINTAIN ───
    if (ffmi >= ffmiAlto && bf < bfModerado) {
        return {
            objetivo: 'MAINTAIN',
            confianca: 'MEDIA',
            justificativa: `Com FFMI de ${ffmi.toFixed(1)} e composição corporal controlada (${bf}% BF), você atingiu um ótimo nível físico. Manter com eficiência pode ser a escolha mais inteligente no momento.`,
            alternativa: 'GOLDEN_RATIO',
        };
    }

    // ─── Default: RECOMP ───
    return {
        objetivo: 'RECOMP',
        confianca: 'MEDIA',
        justificativa: `Com seu perfil atual (${bf}% BF, FFMI ${ffmi.toFixed(1)}), a recomposição corporal oferece o melhor custo-benefício: perda moderada de gordura enquanto preserva e ganha massa magra.`,
    };
}

// ═══════════════════════════════════════════════════════════
// HELPERS UI
// ═══════════════════════════════════════════════════════════

export function getObjetivoMeta(objetivo: ObjetivoVitruvio): ObjetivoMeta {
    return OBJETIVOS_META[objetivo];
}

export function getObjetivoLabel(objetivo: ObjetivoVitruvio): string {
    return OBJETIVOS_META[objetivo]?.label ?? objetivo;
}

export function getObjetivoEmoji(objetivo: ObjetivoVitruvio): string {
    return OBJETIVOS_META[objetivo]?.emoji ?? '🎯';
}

/** Lista todos os objetivos disponíveis para seleção manual */
export const TODOS_OBJETIVOS: ObjetivoVitruvio[] = [
    'BULK', 'CUT', 'RECOMP', 'GOLDEN_RATIO', 'TRANSFORM', 'MAINTAIN'
];
