/**
 * Potencial do Atleta — Módulo Central do Pipeline VITRÚVIO IA
 *
 * Único ponto de verdade para:
 * - Nível do atleta (INICIANTE / INTERMEDIÁRIO / AVANÇADO)
 * - Fatores de volume e prioridade
 * - Delta de score realista em 12 meses (e por trimestre)
 * - Frequência e divisão de treino
 * - Alertas contextuais para personal e atleta
 *
 * Consumido por: diagnostico.ts → treino.ts → Views
 */

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type NivelAtleta = 'INICIANTE' | 'INTERMEDIÁRIO' | 'AVANÇADO';

/**
 * Contexto armazenado no banco — espelha o tipo de AthleteContextSection.tsx.
 * Campos snake_case, valores string simples.
 */
export interface ContextoAtleta {
    problemas_saude?: string;
    medicacoes?: string;
    dores_lesoes?: string;
    exames?: string;
    estilo_vida?: string;
    profissao?: string;
    historico_treino?: string;
    historico_dietas?: string;
    atualizado_em?: string;
    atualizado_por?: string;
}

export interface PotencialAtleta {
    /** Nível detectado a partir do score e histórico */
    nivel: NivelAtleta;
    /** Fator de recuperação (0.70–1.0) — reduzido por profissão física, lesões, meds */
    fatorRecuperacao: number;
    /** Fator que escala o volume base de séries semanais */
    fatorVolume: number;
    /** Multiplicador de séries para grupos ALTA prioridade */
    fatorPrioAlta: number;
    /** Multiplicador de séries para grupos MÉDIA prioridade */
    fatorPrioMedia: number;
    /** Ganho de score realista em 12 meses (ex: 8.3 para iniciante) */
    deltaPotencialScore12M: number;
    /** Distribuição do ganho por trimestre [T1, T2, T3, T4] somam deltaPotencialScore12M */
    deltaScorePorTrimestre: [number, number, number, number];
    /** Frequência semanal de treino recomendada */
    frequenciaSemanal: 3 | 4 | 5;
    /** Divisão de treino recomendada */
    divisao: 'ABC' | 'ABCD' | 'ABCDE';
    /** Alertas contextuais para personal e atleta (ex: medicações, lesões) */
    observacoesContexto: string[];
}

// ═══════════════════════════════════════════════════════════
// DETECÇÃO DE NÍVEL
// ═══════════════════════════════════════════════════════════

/**
 * Detecta o nível do atleta a partir da classificação estética e
 * do histórico textual de treino do contexto.
 * Sempre genérico — funciona para qualquer atleta.
 */
function detectarNivel(
    classificacaoAtual: string,
    historicoTreino: string,
    scoreAtual: number
): NivelAtleta {
    const texto = historicoTreino.toLowerCase();
    const classe = classificacaoAtual.toUpperCase().trim();

    // ── Prioridade 1: a própria classificação já diz o nível ──────────────
    if (classe === 'INICIANTE' || classe === 'INÍCIO' || classe === 'CAMINHO') {
        return 'INICIANTE';
    }
    if (classe === 'ELITE' || classe === 'AVANÇADO') {
        return 'AVANÇADO';
    }

    // ── Prioridade 2: texto do histórico de treino ─────────────────────────
    const indicadoresIniciante = [
        /\b1 ano\b/, /\bin[ií]cio\b/, /come[çc]ou/, /come[çc]ando/,
        /pouco tempo/, /nunca treinou/, /menos de 2 anos/, /recentemente/
    ];
    if (indicadoresIniciante.some(r => r.test(texto))) {
        return 'INICIANTE';
    }

    const indicadoresAvancado = [
        /\b[5-9] anos\b/, /\b\d{2} anos\b/, /alto n[ií]vel/, /competidor/,
        /federado/, /atleta profissional/
    ];
    if (indicadoresAvancado.some(r => r.test(texto))) {
        return 'AVANÇADO';
    }

    // ── Prioridade 3: fallback por score (segurança extra) ────────────────
    if (scoreAtual < 60) return 'INICIANTE';
    if (scoreAtual >= 80) return 'AVANÇADO';

    return 'INTERMEDIÁRIO';
}

// ═══════════════════════════════════════════════════════════
// DELTA DE SCORE POR NÍVEL
// ═══════════════════════════════════════════════════════════

/**
 * Calcula o ganho realista de score em 12 meses.
 *
 * Iniciantes: curva do novato — adaptação neuromuscular e
 * hipertrofia acelerada mesmo com volume menor.
 * Avançados: lei dos retornos decrescentes — precisam de mais
 * volume para obter menos progressão de score.
 */
function calcularDeltaScore(
    nivel: NivelAtleta,
    scoreAtual: number,
    ajustes: { anabolizante: boolean; glp1: boolean; lesoes: boolean }
): number {
    // Base por nível
    let delta = nivel === 'INICIANTE' ? 8.5
        : nivel === 'INTERMEDIÁRIO' ? 5.5
            : 3.0;

    // Ajustes por contexto
    if (ajustes.anabolizante) delta += 1.5;
    if (ajustes.glp1) delta += 0.5; // GLP-1 melhora composição corporal
    if (ajustes.lesoes) delta -= 1.5;

    // Cap: não ultrapassar 100
    const maxDelta = 100 - scoreAtual;
    return Math.min(Math.round(delta * 10) / 10, maxDelta);
}

/**
 * Distribui o delta de score pelos 4 trimestres.
 * Iniciantes: ganho mais concentrado no início (efeito novato T1/T2).
 * Avançados: progressão mais linear.
 */
function distribuirDeltaPorTrimestre(
    deltaTotal: number,
    nivel: NivelAtleta
): [number, number, number, number] {
    const pesos: [number, number, number, number] = nivel === 'INICIANTE'
        ? [0.40, 0.30, 0.20, 0.10]    // Efeito novato: ganho front-loaded
        : nivel === 'INTERMEDIÁRIO'
            ? [0.35, 0.30, 0.22, 0.13]    // Progressão levemente front-loaded
            : [0.28, 0.27, 0.25, 0.20];   // Avançado: distribuição mais linear

    return pesos.map(p =>
        Math.round(deltaTotal * p * 10) / 10
    ) as [number, number, number, number];
}

// ═══════════════════════════════════════════════════════════
// ALERTAS CONTEXTUAIS
// ═══════════════════════════════════════════════════════════

function gerarAlertas(contexto: ContextoAtleta | undefined): {
    alertas: string[];
    fatorRecuperacao: number;
    isAnabolizante: boolean;
    isGlp1: boolean;
    temLesoes: boolean;
} {
    if (!contexto) {
        return { alertas: [], fatorRecuperacao: 1.0, isAnabolizante: false, isGlp1: false, temLesoes: false };
    }

    const alertas: string[] = [];
    let fatorRecuperacao = 1.0;
    let isAnabolizante = false;
    let isGlp1 = false;
    let temLesoes = false;

    // Medicações (campo real: medicacoes)
    const meds = (contexto.medicacoes || '').toLowerCase();
    if (/tirzepatida|semaglutida|ozempic|wegovy|glp[-\s]?1/i.test(meds)) {
        isGlp1 = true;
        alertas.push('GLP-1 em uso: monitorar energia e apetite antes dos treinos. Hidratação redobrada.');
    }
    if (/testosterona|trt|anaboliz|durateston|enantato|cipionato/i.test(meds)) {
        isAnabolizante = true;
        alertas.push('Protocolo hormonal: potencial de recuperação aumentado. Monitorar marcadores de saúde.');
    }
    if (/ritalina|vyvanse|adderall|anfetamina/i.test(meds)) {
        alertas.push('Estimulante em uso: evitar treinos próximos ao horário de pico da medicação. Monitorar FC.');
        fatorRecuperacao -= 0.05;
    }

    // Lesões / dores (campo real: dores_lesoes)
    const lesoes = (contexto.dores_lesoes || '').toLowerCase();
    if (lesoes && !/não informado|nenhum|sem dor|sem lesão/i.test(lesoes)) {
        temLesoes = true;
        fatorRecuperacao -= 0.15;
        alertas.push(`Restrição física detectada: "${contexto.dores_lesoes}". Adaptar exercícios conforme orientação médica.`);
    }

    // Profissão física (campo real: profissao)
    const profissao = (contexto.profissao || '').toLowerCase();
    if (/obra|constru|pedreiro|encanador|eletricista|campo|operador|carregador|motorista|entregador|militar|policia|agr[ií]cola|mec[aâ]nico|bombeiro/i.test(profissao)) {
        fatorRecuperacao -= 0.10;
        alertas.push('Profissão com alta demanda física: priorizar recuperação. Considerar 48h de descanso entre treinos de membros inferiores.');
    }

    // Problemas de saúde (campo real: problemas_saude)
    const saude = (contexto.problemas_saude || '').toLowerCase();
    if (saude && !/não informado|nenhum/i.test(saude)) {
        if (/ferritina|anemia/i.test(saude)) {
            fatorRecuperacao -= 0.10;
            alertas.push('Ferritina baixa/anemia: monitorar disposição. Suplementação de ferro conforme orientação médica pode otimizar resultados.');
        } else {
            alertas.push(`Condição de saúde: "${contexto.problemas_saude}". Acompanhe com equipe médica.`);
        }
    }

    return {
        alertas,
        fatorRecuperacao: Math.max(0.60, Math.round(fatorRecuperacao * 100) / 100),
        isAnabolizante,
        isGlp1,
        temLesoes,
    };
}

// ═══════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════

/**
 * Calcula o Potencial do Atleta — ponto de entrada do pipeline VITRÚVIO IA.
 *
 * Deve ser chamado ANTES de gerarDiagnosticoCompleto e gerarPlanoTreino,
 * pois alimenta ambos com os fatores corretos para cada atleta.
 *
 * @param classificacaoAtual - Classificação estética atual (ex: 'CAMINHO', 'QUASE LÁ')
 * @param scoreAtual - Score atual do atleta (0–100)
 * @param contexto - Contexto do atleta (histórico, medicações, lesões, profissão...)
 * @returns PotencialAtleta — objeto consumido por diagnostico.ts e treino.ts
 */
export function calcularPotencialAtleta(
    classificacaoAtual: string,
    scoreAtual: number,
    contexto?: ContextoAtleta
): PotencialAtleta {
    const historicoTreino = contexto?.historico_treino || '';

    // 1. Detectar nível
    const nivel = detectarNivel(classificacaoAtual, historicoTreino, scoreAtual);

    // 2. Analisar contexto e gerar alertas
    const {
        alertas,
        fatorRecuperacao,
        isAnabolizante,
        isGlp1,
        temLesoes,
    } = gerarAlertas(contexto);

    // 3. Calcular delta de score realista
    const deltaPotencialScore12M = calcularDeltaScore(
        nivel,
        scoreAtual,
        { anabolizante: isAnabolizante, glp1: isGlp1, lesoes: temLesoes }
    );

    // 4. Distribuir delta pelos trimestres
    const deltaScorePorTrimestre = distribuirDeltaPorTrimestre(deltaPotencialScore12M, nivel);

    // 5. Fatores de volume e prioridade por nível
    const fatorVolume = nivel === 'INICIANTE' ? 0.70 : nivel === 'INTERMEDIÁRIO' ? 0.85 : 1.00;
    const fatorPrioAlta = nivel === 'INICIANTE' ? 1.35 : nivel === 'INTERMEDIÁRIO' ? 1.50 : 1.60;
    const fatorPrioMedia = nivel === 'INICIANTE' ? 1.15 : nivel === 'INTERMEDIÁRIO' ? 1.25 : 1.30;

    // 6. Frequência: extrai do texto do histórico ("4 vezes na semana" → 4), senão usa nível
    const _hist = (contexto?.historico_treino || '').toLowerCase();
    const _mFreq = _hist.match(/(\d+)\s*(?:vezes|dias|treinos)\s*(?:por|na)\s*semana/i)
        || _hist.match(/(\d+)\s*x\s*\/\s*semana/i)
        || _hist.match(/(\d+)\s*x\s*semana/i)
        || _hist.match(/treino\s*(\d+)\s*(?:x|vezes)/i);
    const _freqTexto = _mFreq ? parseInt(_mFreq[1], 10) : null;
    const freqDoTexto = (_freqTexto != null && _freqTexto >= 1 && _freqTexto <= 7) ? _freqTexto : null;
    const frequenciaSemanal = freqDoTexto ?? (nivel === 'INICIANTE' ? 3 : nivel === 'INTERMEDIÁRIO' ? 4 : 5);
    const divisao = frequenciaSemanal >= 5 ? 'ABCDE' : frequenciaSemanal >= 4 ? 'ABCD' : 'ABC';

    return {
        nivel,
        fatorRecuperacao,
        fatorVolume,
        fatorPrioAlta,
        fatorPrioMedia,
        deltaPotencialScore12M,
        deltaScorePorTrimestre,
        frequenciaSemanal: frequenciaSemanal as 3 | 4 | 5,
        divisao: divisao as 'ABC' | 'ABCD' | 'ABCDE',
        observacoesContexto: alertas,
    };
}

export type NivelAtividade = 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'ATIVO' | 'MUITO_ATIVO';

/**
 * Infere o nível de atividade diária (NEAT) a partir do contexto do atleta.
 * Usado como fallback em DiagnosticoInput.nivelAtividade quando o personal
 * não preencheu o campo explícito na ficha.
 *
 * Considera 4 sinais:
 *   1. Profissão (braçal vs em-pé vs escritório)
 *   2. Estilo de vida (marcadores de vida ativa ou sedentária)
 *   3. Histórico de treino (frequência extraída por regex)
 *   4. Frequência já conhecida do potencial (opcional — mais confiável que regex)
 *
 * @param contexto - dados textuais da ficha
 * @param options.frequenciaSemanal - frequência já calculada (`potencial.frequenciaSemanal`),
 *   usada quando a regex do histórico_treino não encontra padrão reconhecível.
 * @returns NivelAtividade (5 valores)
 */
export function inferirNivelAtividade(
    contexto?: ContextoAtleta,
    options: { frequenciaSemanal?: number } = {},
): NivelAtividade {
    const profissao = (contexto?.profissao || '').toLowerCase();
    const estilo = (contexto?.estilo_vida || '').toLowerCase();
    const historico = (contexto?.historico_treino || '').toLowerCase();

    // Profissão braçal: trabalho físico pesado
    const profissaoBracal = /obra|constru|pedreiro|encanador|eletricista|campo|operador|carregador|motorista|entregador|militar|policia|agr[ií]cola|mec[aâ]nico|bombeiro/i.test(profissao);
    // Profissão em pé: vendedor, enfermeiro, professor
    const profissaoEmPe = /vendedor|professor|enfermeiro|balconista|gar[cç]|comerci|varejo|supermercado|escola|hospital|loja|fisio|recepci/i.test(profissao);
    // Marcadores de vida ativa em texto livre
    const estiloAtivo = /muito ativo|ativa|anda bastante|caminha muito|corre|corrida|ciclismo|pedala|esporte|nata[cç][aã]o|futebol|crossfit/i.test(estilo);
    const estiloSedentario = /sedent[aá]ri|fica sentad|home office|pouco se movimenta|pouca atividade/i.test(estilo);

    // Frequência de treino: preferimos a passada (potencial já resolveu), cai em regex como fallback.
    const mFreq = historico.match(/(\d+)\s*(?:vezes|dias|treinos)\s*(?:por|na)\s*semana/i)
        || historico.match(/(\d+)\s*x\s*\/\s*semana/i)
        || historico.match(/(\d+)\s*x\s*semana/i)
        || historico.match(/treino\s*(\d+)\s*(?:x|vezes)/i);
    const freqRegex = mFreq ? parseInt(mFreq[1], 10) : 0;
    const freqTreino = options.frequenciaSemanal ?? freqRegex;

    // MUITO_ATIVO: trabalho físico pesado + treina ≥5x/semana OU treina 2x/dia
    if ((profissaoBracal && freqTreino >= 5) || /2x ao dia|duas vezes ao dia|dois treinos|bi-?di[aá]rio/i.test(historico)) {
        return 'MUITO_ATIVO';
    }

    // ATIVO: treina 5-7x/semana OU (profissão braçal E treina)
    // (5x/semana regular + atividades incidentais caracterizam rotina ATIVA em atletas)
    if (freqTreino >= 5 || (profissaoBracal && freqTreino >= 1)) {
        return 'ATIVO';
    }

    // MODERADO: trabalho braçal (sem treino declarado), treina 3-4x/semana, ou estilo ativo + treina
    if (profissaoBracal || (freqTreino >= 3 && freqTreino <= 4) || (estiloAtivo && freqTreino >= 2)) {
        return 'MODERADO';
    }

    // LEVE: em pé parte do dia, ou treina 1-2x/semana
    if (profissaoEmPe || (freqTreino >= 1 && freqTreino <= 2) || (estiloAtivo && !estiloSedentario)) {
        return 'LEVE';
    }

    // Default: sedentário
    return 'SEDENTARIO';
}
