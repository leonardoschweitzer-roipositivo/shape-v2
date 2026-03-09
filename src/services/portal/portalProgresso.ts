/**
 * Portal PROGRESSO — Score, proporções, gráfico de evolução, avaliação
 */
import { supabase } from '@/services/supabase';
import type {
    ScoreGeral, GraficoEvolucaoData, ProporcaoResumo,
} from '@/types/athlete-portal';
import type { SupaAssessment, SupaMedida, AssessmentResults } from './portalTypes';

/**
 * Monta dados de score geral a partir do último assessment
 */
export async function buscarScoreGeral(atletaId: string): Promise<ScoreGeral> {
    const { data: assessments } = await supabase
        .from('assessments')
        .select('score, results, date')
        .eq('atleta_id', atletaId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(2);

    if (!assessments || assessments.length === 0) {
        return { score: 0, classificacao: 'SEM AVALIAÇÃO', emoji: '📊', variacaoVsMes: 0 };
    }

    const ultimo = assessments[0] as unknown as SupaAssessment;
    const anterior = assessments.length > 1 ? (assessments[1] as unknown as SupaAssessment) : null;
    const score = ultimo.score || 0;
    const variacao = anterior ? score - (anterior.score || 0) : 0;

    // Classificação
    let classificacao = 'INICIANDO';
    let emoji = '🏃';
    if (score >= 90) { classificacao = 'DIVINO'; emoji = '⚡'; }
    else if (score >= 80) { classificacao = 'ATLÉTICO'; emoji = '🔥'; }
    else if (score >= 70) { classificacao = 'QUASE LÁ'; emoji = '💪'; }
    else if (score >= 60) { classificacao = 'EVOLUINDO'; emoji = '📈'; }
    else if (score >= 50) { classificacao = 'CAMINHO'; emoji = '🏃'; }

    return { score, classificacao, emoji, variacaoVsMes: variacao };
}

/**
 * Monta dados do gráfico de evolução
 */
export async function buscarGraficoEvolucao(atletaId: string): Promise<GraficoEvolucaoData> {
    const { data: medidas } = await supabase
        .from('medidas')
        .select('data, peso')
        .eq('atleta_id', atletaId)
        .order('data', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(50);

    const dados = ((medidas || []) as unknown as SupaMedida[]).map(m => ({
        data: new Date(m.data),
        valor: m.peso || 0,
    })).filter(d => d.valor > 0);

    return {
        metrica: 'peso',
        periodo: '3m',
        dados,
    };
}

/**
 * Busca proporções do último assessment
 */
export async function buscarProporcoes(atletaId: string): Promise<ProporcaoResumo[]> {
    const { data: assessment } = await supabase
        .from('assessments')
        .select('results')
        .eq('atleta_id', atletaId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (!assessment) return [];

    const a = assessment as unknown as SupaAssessment;
    const results = a.results || {};
    const proporcoes = (results?.proporcoes || results?.proportions || []) as Record<string, unknown>[];

    return proporcoes.slice(0, 5).map((p) => {
        const atual = Number(p.ratio || p.atual) || 0;
        const meta = Number(p.idealRatio || p.meta) || 1.618;
        const percentual = meta > 0 ? Math.round((atual / meta) * 100) : 0;
        let classificacao = 'CAMINHO';
        let emoji = '🏃';
        if (percentual >= 100) { classificacao = 'META'; emoji = '🎯'; }
        else if (percentual >= 90) { classificacao = 'QUASE LÁ'; emoji = '💪'; }
        else if (percentual >= 75) { classificacao = 'EVOLUINDO'; emoji = '📈'; }

        return {
            nome: String(p.name || p.nome || ''),
            atual: parseFloat(atual.toFixed(2)),
            meta: parseFloat(meta.toFixed(2)),
            percentual,
            classificacao,
            emoji,
        };
    });
}

/**
 * Busca histórico de avaliações
 */
export async function buscarHistoricoAvaliacoes(atletaId: string) {
    const { data: assessments } = await supabase
        .from('assessments')
        .select('id, date, score, results')
        .eq('atleta_id', atletaId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

    return ((assessments || []) as unknown as SupaAssessment[]).map(a => ({
        id: a.id,
        data: new Date(a.date),
        score: a.score || 0,
        classificacao: (a.results?.classificacao as Record<string, unknown>)?.nivel as string || '',
    }));
}

/**
 * Busca dados completos da última avaliação para a tela AVALIAÇÃO
 * 
 * Estrutura real do campo `results` salvo por dataStore.ts > addAssessment:
 * {
 *   avaliacaoGeral: number,
 *   classificacao: { nivel, emoji, cor, descricao },
 *   scores: {
 *     proporcoes: { valor, peso, contribuicao, detalhes: { score, detalhes: [{proporcao,peso,percentualDoIdeal,contribuicao,valor}] } },
 *     composicao: { valor, peso, contribuicao, detalhes: { score, detalhes: { bf:{valor,score}, ffmi:{valor,score}, pesoRelativo:{valor,score} }, pesoMagro, pesoGordo } },
 *     simetria:   { valor, peso, contribuicao, detalhes: { score, detalhes: [{grupo,esquerdo,direito,diferenca,diferencaPercent,score,status,ladoDominante}] } }
 *   },
 *   penalizacoes: { vTaper, cintura },
 *   insights: { pontoForte, pontoFraco, proximaMeta },
 *   proporcoes_aureas: [{ nome, atual, ideal, pct, status }]
 * }
 */
export async function buscarDadosAvaliacao(atletaId: string): Promise<AvaliacaoDadosResult | null> {
    const { data: assessment } = await supabase
        .from('assessments')
        .select('id, date, score, results, body_fat, measurements')
        .eq('atleta_id', atletaId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (!assessment) return null;

    const a = assessment as unknown as SupaAssessment;
    const results = a.results || {};
    const score = a.score || 0;

    // === CLASSIFICAÇÃO GERAL (do campo results.classificacao) ===
    const classFromDB = results?.classificacao;
    const classificacaoGeral = classFromDB?.nivel || getClassificacaoLabel(score);
    const emojiGeral = classFromDB?.emoji || getClassificacaoEmoji(score);

    // === SCORES DOS 3 PILARES (do campo results.scores) ===
    const scoresDB = results?.scores || {};
    const scoreProporcoes = scoresDB?.proporcoes?.valor || 0;
    const scoreComposicao = scoresDB?.composicao?.valor || 0;
    const scoreSimetria = scoresDB?.simetria?.valor || 100;

    // === DIAGNÓSTICO ESTÉTICO (do campo results.scores.composicao.detalhes) ===
    const compDetalhes = scoresDB?.composicao?.detalhes || {};
    const compDetalhesSub = compDetalhes?.detalhes || {};

    const bf = Number(compDetalhesSub?.bf?.valor) || a.body_fat || 0;
    const scoreBF = Number(compDetalhesSub?.bf?.score) || 0;
    const ffmi = Number(compDetalhesSub?.ffmi?.valor) || 0;
    const scoreFFMI = Number(compDetalhesSub?.ffmi?.score) || 0;
    const pesoRelativoVal = Number(compDetalhesSub?.pesoRelativo?.valor) || 0;
    const scorePesoRelativo = Number(compDetalhesSub?.pesoRelativo?.score) || 0;
    const pesoMagro = compDetalhes?.pesoMagro || 0;
    const pesoGordo = compDetalhes?.pesoGordo || 0;

    // Helper local para classificação BF% (Padrão ACE)
    const genero = a.measurements?.genero || a.measurements?.gender || 'MALE';
    let classComp = 'ACEITÁVEL';
    let emojiComp = '🏃';

    if (genero === 'MALE' || genero === 'male' || genero === 'M') {
        if (bf < 6) { classComp = 'ESSENCIAL'; emojiComp = '💎'; }
        else if (bf < 13) { classComp = 'ATLETA'; emojiComp = '🥇'; }
        else if (bf < 17) { classComp = 'FITNESS'; emojiComp = '💪'; }
        else if (bf < 25) { classComp = 'ACEITÁVEL'; emojiComp = '🏃'; }
        else if (bf < 30) { classComp = 'ACIMA'; emojiComp = '⚠️'; }
        else { classComp = 'OBESIDADE'; emojiComp = '❌'; }
    } else {
        if (bf < 14) { classComp = 'ESSENCIAL'; emojiComp = '💎'; }
        else if (bf < 21) { classComp = 'ATLETA'; emojiComp = '🥇'; }
        else if (bf < 25) { classComp = 'FITNESS'; emojiComp = '💪'; }
        else if (bf < 32) { classComp = 'ACEITÁVEL'; emojiComp = '🏃'; }
        else if (bf < 39) { classComp = 'ACIMA'; emojiComp = '⚠️'; }
        else { classComp = 'OBESIDADE'; emojiComp = '❌'; }
    }

    const diagnostico = {
        bf,
        scoreBF,
        ffmi,
        scoreFFMI,
        massaMagra: pesoMagro,
        massaGorda: pesoGordo,
        pesoRelativo: pesoRelativoVal,
        scorePesoRelativo,
        scoreTotal: scoreComposicao,
        classificacao: classComp,
        emoji: emojiComp,
    };

    // === PROPORÇÕES ÁUREAS (do campo results.proporcoes_aureas) ===
    // Formato: [{ nome, atual, ideal, pct, status }]
    const rawProporcoes = results?.proporcoes_aureas || [];

    // Nomes de proporções inversas — cintura e upper vs lower
    const INVERSAS = ['Cintura', 'Upper vs Lower'];

    // Fórmulas base por nome de proporção
    const FORMULAS: Record<string, string> = {
        'Shape-V': 'Ombros ÷ Cintura',
        'Costas': 'Costas ÷ Cintura',
        'Peitoral': 'Peitoral ÷ Punho',
        'Braço': 'Braço ÷ Punho',
        'Antebraço': 'Antebraço ÷ Braço',
        'Tríade': 'Pescoço ≈ Braço ≈ Panturrilha',
        'Cintura': 'Cintura ÷ Pélvis',
        'Coxa': 'Coxa ÷ Joelho',
        'Coxa vs Pantur.': 'Coxa ÷ Panturrilha',
        'Panturrilha': 'Panturrilha ÷ Tornozelo',
        'Upper vs Lower': 'Braço+Ante. ÷ Coxa+Pant.',
    };

    const proporcoes = (rawProporcoes || []).map((p) => {
        const ehInversa = INVERSAS.includes(p.nome);
        return {
            nome: p.nome || '',
            categoria: '',
            indiceAtual: parseFloat((p.atual || 0).toFixed(3)),
            indiceMeta: parseFloat((p.ideal || 1.618).toFixed(3)),
            percentualDoIdeal: p.pct || 0,
            ehInversa,
            formulaBase: FORMULAS[p.nome] || '',
            medidaAtual: undefined,
            medidaMeta: undefined,
            diferencaCm: undefined,
            classificacao: {} as Record<string, unknown>,
            posicaoBarra: 0,
        };
    });

    // === ASSIMETRIA (do campo results.scores.simetria.detalhes.detalhes) ===
    // Formato: [{ grupo, esquerdo, direito, diferenca, diferencaPercent, score, status, ladoDominante }]
    const simetriaDetalhes = scoresDB?.simetria?.detalhes?.detalhes || [];

    // Mapeamento de nomes internos para labels amigáveis
    const GRUPO_LABELS: Record<string, string> = {
        braco: 'Braço',
        antebraco: 'Antebraço',
        coxa: 'Coxa',
        panturrilha: 'Panturrilha',
        peitoral: 'Peitoral',
    };

    const membros = (simetriaDetalhes as Record<string, unknown>[]).map((s) => {
        const diferencaPercentual = Number(s.diferencaPercent) || 0;
        let status = 'simetrico';
        let emoji = '✅';
        let label = 'Simétrico';
        if (diferencaPercentual > 10) { status = 'significativa'; emoji = '❌'; label = 'Assimetria significativa'; }
        else if (diferencaPercentual > 5) { status = 'moderada'; emoji = '🔶'; label = 'Assimetria moderada'; }
        else if (diferencaPercentual > 2) { status = 'leve'; emoji = '⚠️'; label = 'Leve assimetria'; }

        return {
            membro: GRUPO_LABELS[s.grupo as string] || String(s.grupo) || '',
            ladoEsquerdo: Number(s.esquerdo) || 0,
            ladoDireito: Number(s.direito) || 0,
            diferencaCm: Math.round((Number(s.diferenca) || 0) * 10) / 10,
            diferencaPercentual: Math.round(diferencaPercentual * 10) / 10,
            status,
            emoji,
            label,
        };
    });

    let classSimetria = 'EXCELENTE';
    let emojiSimetria = '✅';
    if (scoreSimetria < 70) { classSimetria = 'PRECISA MELHORAR'; emojiSimetria = '❌'; }
    else if (scoreSimetria < 85) { classSimetria = 'BOM'; emojiSimetria = '⚠️'; }
    else if (scoreSimetria < 95) { classSimetria = 'MUITO BOM'; emojiSimetria = '💪'; }

    const penalizacoes = results?.penalizacoes || { vTaper: 1.0, cintura: 1.0 };

    return {
        id: a.id,
        data: new Date(a.date),
        scoreGeral: score,
        classificacaoGeral,
        emojiGeral,
        scores: {
            proporcoes: { valor: scoreProporcoes, peso: 0.40, contribuicao: (scoresDB?.proporcoes?.contribuicao || scoreProporcoes * 0.40) },
            composicao: { valor: scoreComposicao, peso: 0.35, contribuicao: (scoresDB?.composicao?.contribuicao || scoreComposicao * 0.35) },
            simetria: { valor: scoreSimetria, peso: 0.25, contribuicao: (scoresDB?.simetria?.contribuicao || scoreSimetria * 0.25) },
        },
        penalizacoes: penalizacoes || { vTaper: 1.0, cintura: 1.0 },
        diagnostico,
        proporcoes,
        assimetria: {
            membros,
            scoreGeral: Math.round(scoreSimetria),
            classificacao: classSimetria,
            emoji: emojiSimetria,
        },
    };
}

/** Helpers para classificação quando não existe results.classificacao */
export function getClassificacaoLabel(score: number): string {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'AVANÇADO';
    if (score >= 70) return 'ATLÉTICO';
    if (score >= 60) return 'INTERMEDIÁRIO';
    if (score >= 50) return 'INICIANTE';
    return 'COMEÇANDO';
}

export function getClassificacaoEmoji(score: number): string {
    if (score >= 90) return '👑';
    if (score >= 80) return '🥇';
    if (score >= 70) return '💪';
    if (score >= 60) return '🏃';
    if (score >= 50) return '🌱';
    return '🚀';
}

/** Return type for buscarDadosAvaliacao */
export interface AvaliacaoDadosResult {
    id: string;
    data: Date;
    scoreGeral: number;
    classificacaoGeral: string;
    emojiGeral: string;
    scores: {
        proporcoes: { valor: number; peso: number; contribuicao: number };
        composicao: { valor: number; peso: number; contribuicao: number };
        simetria: { valor: number; peso: number; contribuicao: number };
    };
    penalizacoes: { vTaper: number; cintura: number };
    diagnostico: {
        bf: number;
        scoreBF: number;
        ffmi: number;
        scoreFFMI: number;
        massaMagra: number;
        massaGorda: number;
        pesoRelativo: number;
        scorePesoRelativo: number;
        scoreTotal: number;
        classificacao: string;
        emoji: string;
    };
    proporcoes: Record<string, unknown>[];
    assimetria: {
        membros: Record<string, unknown>[];
        scoreGeral: number;
        classificacao: string;
        emoji: string;
    };
}

/**
 * ══════════════════════════════════════════════════════════════
 * buscarTodosDadosSecundarios — OTIMIZADO v2
 *
 * Substitui 7 queries separadas (buscarScoreGeral, buscarGraficoEvolucao,
 * buscarProporcoes, buscarHistoricoAvaliacoes, buscarDadosAvaliacao,
 * buscarDadosPersonal, buscarMensagensChat) por apenas 3 queries:
 *   1) assessments (limit 10 — cobre score, proporcoes, historico, avaliacao)
 *   2) medidas (para gráfico evolução)
 *   3) chat messages
 *
 * Personal data é extraído do contexto (já carregado na Phase 1).
 * ══════════════════════════════════════════════════════════════
 */
export interface DadosSecundarios {
    score: ScoreGeral;
    grafico: GraficoEvolucaoData;
    proporcoes: ProporcaoResumo[];
    historico: Record<string, unknown>[];
    avaliacao: AvaliacaoDadosResult | null;
}

export async function buscarTodosDadosSecundarios(atletaId: string): Promise<DadosSecundarios> {
    // ── 2 queries em paralelo (antes eram 5 separadas só para assessments + medidas) ──
    const [{ data: rawAssessments }, { data: rawMedidas }] = await Promise.all([
        supabase
            .from('assessments')
            .select('id, date, score, results, body_fat, measurements')
            .eq('atleta_id', atletaId)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(10),
        supabase
            .from('medidas')
            .select('data, peso')
            .eq('atleta_id', atletaId)
            .order('data', { ascending: true })
            .order('created_at', { ascending: true })
            .limit(50),
    ]);

    const assessments = (rawAssessments || []) as unknown as SupaAssessment[];

    // ── Score Geral (derivado em memória) ──
    let score: ScoreGeral;
    if (assessments.length === 0) {
        score = { score: 0, classificacao: 'SEM AVALIAÇÃO', emoji: '📊', variacaoVsMes: 0 };
    } else {
        const ultimo = assessments[0];
        const anterior = assessments.length > 1 ? assessments[1] : null;
        const s = ultimo.score || 0;
        const variacao = anterior ? s - (anterior.score || 0) : 0;
        let classificacao = 'INICIANDO';
        let emoji = '🏃';
        if (s >= 90) { classificacao = 'DIVINO'; emoji = '⚡'; }
        else if (s >= 80) { classificacao = 'ATLÉTICO'; emoji = '🔥'; }
        else if (s >= 70) { classificacao = 'QUASE LÁ'; emoji = '💪'; }
        else if (s >= 60) { classificacao = 'EVOLUINDO'; emoji = '📈'; }
        else if (s >= 50) { classificacao = 'CAMINHO'; emoji = '🏃'; }
        score = { score: s, classificacao, emoji, variacaoVsMes: variacao };
    }

    // ── Gráfico Evolução (medidas) ──
    const dadosGrafico = ((rawMedidas || []) as unknown as SupaMedida[]).map(m => ({
        data: new Date(m.data),
        valor: m.peso || 0,
    })).filter(d => d.valor > 0);
    const grafico: GraficoEvolucaoData = { metrica: 'peso', periodo: '3m', dados: dadosGrafico };

    // ── Proporções (do último assessment — já temos em memória) ──
    let proporcoes: ProporcaoResumo[] = [];
    if (assessments.length > 0) {
        const results = assessments[0].results || {};
        const rawProps = (results?.proporcoes || results?.proportions || []) as Record<string, unknown>[];
        proporcoes = rawProps.slice(0, 5).map((p) => {
            const atual = Number(p.ratio || p.atual) || 0;
            const meta = Number(p.idealRatio || p.meta) || 1.618;
            const percentual = meta > 0 ? Math.round((atual / meta) * 100) : 0;
            let classificacao = 'CAMINHO';
            let emoji = '🏃';
            if (percentual >= 100) { classificacao = 'META'; emoji = '🎯'; }
            else if (percentual >= 90) { classificacao = 'QUASE LÁ'; emoji = '💪'; }
            else if (percentual >= 75) { classificacao = 'EVOLUINDO'; emoji = '📈'; }
            return {
                nome: String(p.name || p.nome || ''),
                atual: parseFloat(atual.toFixed(2)),
                meta: parseFloat(meta.toFixed(2)),
                percentual,
                classificacao,
                emoji,
            };
        });
    }

    // ── Histórico Avaliações (já temos em memória) ──
    const historico = assessments.map(a => ({
        id: a.id,
        data: new Date(a.date),
        score: a.score || 0,
        classificacao: (a.results?.classificacao as Record<string, unknown>)?.nivel as string || '',
    }));

    // ── Avaliação Detalhada (do último assessment — já temos em memória) ──
    let avaliacao: AvaliacaoDadosResult | null = null;
    if (assessments.length > 0) {
        avaliacao = _derivarAvaliacaoDetalhada(assessments[0]);
    }

    return { score, grafico, proporcoes, historico, avaliacao };
}

/** Helper interno: deriva avaliação detalhada a partir de um SupaAssessment já carregado */
function _derivarAvaliacaoDetalhada(a: SupaAssessment): AvaliacaoDadosResult {
    const results = a.results || {};
    const scoreVal = a.score || 0;

    const classFromDB = results?.classificacao;
    const classificacaoGeral = classFromDB?.nivel || getClassificacaoLabel(scoreVal);
    const emojiGeral = classFromDB?.emoji || getClassificacaoEmoji(scoreVal);

    const scoresDB = results?.scores || {};
    const scoreProporcoes = scoresDB?.proporcoes?.valor || 0;
    const scoreComposicao = scoresDB?.composicao?.valor || 0;
    const scoreSimetria = scoresDB?.simetria?.valor || 100;

    const compDetalhes = scoresDB?.composicao?.detalhes || {};
    const compDetalhesSub = compDetalhes?.detalhes || {};

    const bf = Number(compDetalhesSub?.bf?.valor) || a.body_fat || 0;
    const scoreBF = Number(compDetalhesSub?.bf?.score) || 0;
    const ffmi = Number(compDetalhesSub?.ffmi?.valor) || 0;
    const scoreFFMI = Number(compDetalhesSub?.ffmi?.score) || 0;
    const pesoRelativoVal = Number(compDetalhesSub?.pesoRelativo?.valor) || 0;
    const scorePesoRelativo = Number(compDetalhesSub?.pesoRelativo?.score) || 0;
    const pesoMagro = compDetalhes?.pesoMagro || 0;
    const pesoGordo = compDetalhes?.pesoGordo || 0;

    const genero = a.measurements?.genero || a.measurements?.gender || 'MALE';
    let classComp = 'ACEITÁVEL';
    let emojiComp = '🏃';

    if (genero === 'MALE' || genero === 'male' || genero === 'M') {
        if (bf < 6) { classComp = 'ESSENCIAL'; emojiComp = '💎'; }
        else if (bf < 13) { classComp = 'ATLETA'; emojiComp = '🥇'; }
        else if (bf < 17) { classComp = 'FITNESS'; emojiComp = '💪'; }
        else if (bf < 25) { classComp = 'ACEITÁVEL'; emojiComp = '🏃'; }
        else if (bf < 30) { classComp = 'ACIMA'; emojiComp = '⚠️'; }
        else { classComp = 'OBESIDADE'; emojiComp = '❌'; }
    } else {
        if (bf < 14) { classComp = 'ESSENCIAL'; emojiComp = '💎'; }
        else if (bf < 21) { classComp = 'ATLETA'; emojiComp = '🥇'; }
        else if (bf < 25) { classComp = 'FITNESS'; emojiComp = '💪'; }
        else if (bf < 32) { classComp = 'ACEITÁVEL'; emojiComp = '🏃'; }
        else if (bf < 39) { classComp = 'ACIMA'; emojiComp = '⚠️'; }
        else { classComp = 'OBESIDADE'; emojiComp = '❌'; }
    }

    const diagnostico = {
        bf, scoreBF, ffmi, scoreFFMI,
        massaMagra: pesoMagro, massaGorda: pesoGordo,
        pesoRelativo: pesoRelativoVal, scorePesoRelativo,
        scoreTotal: scoreComposicao,
        classificacao: classComp, emoji: emojiComp,
    };

    const rawProporcoes = results?.proporcoes_aureas || [];
    const INVERSAS = ['Cintura', 'Upper vs Lower'];
    const FORMULAS: Record<string, string> = {
        'Shape-V': 'Ombros ÷ Cintura', 'Costas': 'Costas ÷ Cintura',
        'Peitoral': 'Peitoral ÷ Punho', 'Braço': 'Braço ÷ Punho',
        'Antebraço': 'Antebraço ÷ Braço', 'Tríade': 'Pescoço ≈ Braço ≈ Panturrilha',
        'Cintura': 'Cintura ÷ Pélvis', 'Coxa': 'Coxa ÷ Joelho',
        'Coxa vs Pantur.': 'Coxa ÷ Panturrilha', 'Panturrilha': 'Panturrilha ÷ Tornozelo',
        'Upper vs Lower': 'Braço+Ante. ÷ Coxa+Pant.',
    };

    const propsAureas = (rawProporcoes || []).map((p: Record<string, unknown>) => ({
        nome: p.nome || '', categoria: '',
        indiceAtual: parseFloat(((p.atual as number) || 0).toFixed(3)),
        indiceMeta: parseFloat(((p.ideal as number) || 1.618).toFixed(3)),
        percentualDoIdeal: p.pct || 0,
        ehInversa: INVERSAS.includes(p.nome as string),
        formulaBase: FORMULAS[p.nome as string] || '',
        medidaAtual: undefined, medidaMeta: undefined, diferencaCm: undefined,
        classificacao: {} as Record<string, unknown>, posicaoBarra: 0,
    }));

    const simetriaDetalhes = scoresDB?.simetria?.detalhes?.detalhes || [];
    const GRUPO_LABELS: Record<string, string> = {
        braco: 'Braço', antebraco: 'Antebraço', coxa: 'Coxa',
        panturrilha: 'Panturrilha', peitoral: 'Peitoral',
    };

    const membros = (simetriaDetalhes as Record<string, unknown>[]).map((s) => {
        const diferencaPercentual = Number(s.diferencaPercent) || 0;
        let status = 'simetrico'; let emoji = '✅'; let label = 'Simétrico';
        if (diferencaPercentual > 10) { status = 'significativa'; emoji = '❌'; label = 'Assimetria significativa'; }
        else if (diferencaPercentual > 5) { status = 'moderada'; emoji = '🔶'; label = 'Assimetria moderada'; }
        else if (diferencaPercentual > 2) { status = 'leve'; emoji = '⚠️'; label = 'Leve assimetria'; }
        return {
            membro: GRUPO_LABELS[s.grupo as string] || String(s.grupo) || '',
            ladoEsquerdo: Number(s.esquerdo) || 0, ladoDireito: Number(s.direito) || 0,
            diferencaCm: Math.round((Number(s.diferenca) || 0) * 10) / 10,
            diferencaPercentual: Math.round(diferencaPercentual * 10) / 10,
            status, emoji, label,
        };
    });

    let classSimetria = 'EXCELENTE'; let emojiSimetria = '✅';
    if (scoreSimetria < 70) { classSimetria = 'PRECISA MELHORAR'; emojiSimetria = '❌'; }
    else if (scoreSimetria < 85) { classSimetria = 'BOM'; emojiSimetria = '⚠️'; }
    else if (scoreSimetria < 95) { classSimetria = 'MUITO BOM'; emojiSimetria = '💪'; }

    const penalizacoes = results?.penalizacoes || { vTaper: 1.0, cintura: 1.0 };

    return {
        id: a.id, data: new Date(a.date), scoreGeral: scoreVal,
        classificacaoGeral, emojiGeral,
        scores: {
            proporcoes: { valor: scoreProporcoes, peso: 0.40, contribuicao: (scoresDB?.proporcoes?.contribuicao || scoreProporcoes * 0.40) },
            composicao: { valor: scoreComposicao, peso: 0.35, contribuicao: (scoresDB?.composicao?.contribuicao || scoreComposicao * 0.35) },
            simetria: { valor: scoreSimetria, peso: 0.25, contribuicao: (scoresDB?.simetria?.contribuicao || scoreSimetria * 0.25) },
        },
        penalizacoes: penalizacoes || { vTaper: 1.0, cintura: 1.0 },
        diagnostico, proporcoes: propsAureas,
        assimetria: { membros, scoreGeral: Math.round(scoreSimetria), classificacao: classSimetria, emoji: emojiSimetria },
    };
}

