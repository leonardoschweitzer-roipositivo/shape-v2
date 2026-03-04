/**
 * Portal Data Service — Serviço central de dados do Portal do Atleta
 * 
 * Centraliza queries para as 4 tabs do portal:
 * - HOJE: treino do dia, dieta do dia, trackers
 * - COACH: mensagens de chat
 * - PROGRESSO: score, proporções, evolução, histórico
 * - PERFIL: dados pessoais, personal
 */

import { supabase } from '@/services/supabase';
import type { DiagnosticoDados } from '@/services/calculations/diagnostico';
import type { PlanoTreino } from '@/services/calculations/treino';
import type { PlanoDieta } from '@/services/calculations/dieta';
import type {
    TodayScreenData,
    WorkoutOfDay,
    DietOfDay,
    TrackerRapido,
    DicaCoach,
    ScoreGeral,
    GraficoEvolucaoData,
    ProporcaoResumo,
    ChatMessage,
    DadosBasicos,
    MeuPersonal,
} from '@/types/athlete-portal';

// ==========================================
// TIPOS AUXILIARES
// ==========================================

export interface PortalContext {
    atletaId: string;
    atletaNome: string;
    personalId: string;
    personalNome: string;
    ficha: any;
    diagnostico: DiagnosticoDados | null;
    planoTreino: PlanoTreino | null;
    planoDieta: PlanoDieta | null;
}

// ==========================================
// FUNÇÕES DE BUSCA
// ==========================================

/**
 * Carrega contexto completo do atleta — chamado uma vez ao entrar no portal
 * OTIMIZADO: todas as queries rodam em paralelo via Promise.all
 */
export async function carregarContextoPortal(atletaId: string): Promise<PortalContext | null> {
    try {
        // 1. Buscar atleta primeiro (precisa do personal_id)
        const { data: atleta } = await supabase
            .from('atletas')
            .select('*')
            .eq('id', atletaId)
            .single();
        if (!atleta) return null;

        // 2-6. Todas as queries restantes em PARALELO
        const [
            { data: personal },
            { data: ficha },
            { data: diag },
            { data: treino },
            { data: dieta },
        ] = await Promise.all([
            supabase
                .from('personais')
                .select('id, nome')
                .eq('id', (atleta as any).personal_id)
                .single(),
            supabase
                .from('fichas')
                .select('*')
                .eq('atleta_id', atletaId)
                .single(),
            supabase
                .from('diagnosticos')
                .select('dados')
                .eq('atleta_id', atletaId)
                .eq('status', 'confirmado')
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
            supabase
                .from('planos_treino')
                .select('dados')
                .eq('atleta_id', atletaId)
                .eq('status', 'ativo')
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
            supabase
                .from('planos_dieta')
                .select('dados')
                .eq('atleta_id', atletaId)
                .eq('status', 'ativo')
                .order('created_at', { ascending: false })
                .limit(1)
                .single(),
        ]);

        console.log('[PortalDataService] Diagnóstico:', diag ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        console.log('[PortalDataService] Plano Treino:', treino ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        console.log('[PortalDataService] Plano Dieta:', dieta ? 'ENCONTRADO' : 'NÃO ENCONTRADO');

        return {
            atletaId,
            atletaNome: (atleta as any).nome || 'Atleta',
            personalId: (personal as any)?.id || '',
            personalNome: (personal as any)?.nome || 'Personal',
            ficha: ficha || null,
            diagnostico: diag ? (diag as any).dados as DiagnosticoDados : null,
            planoTreino: treino ? (treino as any).dados as PlanoTreino : null,
            planoDieta: dieta ? (dieta as any).dados as PlanoDieta : null,
        };
    } catch (err) {
        console.error('[PortalDataService] Erro ao carregar contexto:', err);
        return null;
    }
}

// ==== Função Helper Auxiliar para pegar o Histórico ====
async function getUltimoTreinoIndex(atletaId: string): Promise<number> {
    const { data } = await supabase
        .from('registros_diarios')
        .select('dados, data')
        .eq('atleta_id', atletaId)
        .eq('tipo', 'treino')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(30);

    if (!data || data.length === 0) return -1;

    // Procura o último treino completo ou pulado
    for (const record of data) {
        const d = (record as any).dados;
        if (d && (d.status === 'completo' || d.status === 'pulado')) {
            if (typeof d.treinoIndex === 'number') {
                return d.treinoIndex;
            }
        }
    }
    return -1;
}

// ==========================================
// TELA HOJE
// ==========================================

/**
 * Deriva o treino do dia (o próximo treino pendente na sequência) a partir do PlanoTreino.
 * Pode receber `indiceFixo` para forçar a renderização de um treino específico (ex: o que o aluno acabou de fazer hoje).
 */
export function derivarTreinoDoDia(plano: PlanoTreino | null, lastCompletedIndex: number = -1, indiceFixo?: number): WorkoutOfDay & { indiceTreino?: number } {
    if (!plano) {
        return {
            id: 'no-plan',
            titulo: 'SEM PLANO',
            subtitulo: 'Peça ao seu Personal para gerar um plano de treino',
            diaAtual: 0,
            diasTotal: 0,
            status: 'descanso',
        };
    }

    const treinos = plano.treinos || [];
    const diasTreinados = treinos.length;

    if (diasTreinados === 0) {
        return {
            id: 'descanso',
            titulo: 'DIA DE DESCANSO',
            subtitulo: 'Curta o seu dia e relaxe para se recuperar!',
            diaAtual: 0,
            diasTotal: 0,
            status: 'descanso',
        };
    }

    // O próximo treino sempre será (último concluído + 1)
    let nextIndex = (lastCompletedIndex + 1) % diasTreinados;
    if (typeof indiceFixo === 'number' && indiceFixo >= 0) {
        nextIndex = indiceFixo % diasTreinados;
    }
    const treinoHoje = treinos[nextIndex];

    const grupoNomes = treinoHoje.blocos.map(b => b.nomeGrupo).join(' + ');
    const letra = (treinoHoje as any).letra || String.fromCharCode(65 + nextIndex);

    // Flatten exercícios de todos os blocos
    const todosExercicios = treinoHoje.blocos.flatMap((bloco, bIdx) =>
        bloco.exercicios.map((ex: any, i: number) => ({
            id: `ex-${bIdx}-${i}`,
            nome: ex.nome || ex.exercicio || '',
            series: ex.series || 0,
            repeticoes: ex.repeticoes || ex.reps || '',
            dica: ex.observacao || ex.dica || '',
            foco: bloco.nomeGrupo || '',
        }))
    );

    return {
        id: `treino-${letra}`,
        titulo: grupoNomes || treinoHoje.nome || 'TREINO',
        subtitulo: `Treino ${letra} — ${treinoHoje.nome || ''}`,
        diaAtual: nextIndex + 1,
        diasTotal: diasTreinados,
        status: 'pendente',
        exercicios: todosExercicios,
        indiceTreino: nextIndex,
    };
}

/**
 * Próximo treino interface
 */
export interface ProximoTreino {
    data: string; // ex: "Segunda, 03 Mar"
    letraLabel: string; // ex: "Treino B"
    grupoMuscular: string;
    nomeTreino: string;
    exercicios: Array<{
        id: string;
        nome: string;
        series: number;
        repeticoes: string;
        foco: string;
    }>;
}

/**
 * Deriva o próximo treino na sequência.
 */
export function derivarProximoTreino(plano: PlanoTreino | null, currentPendingIndex: number = 0): ProximoTreino | null {
    if (!plano) return null;

    const treinos = plano.treinos || [];
    if (treinos.length === 0) return null;

    // O próximo treino será (treino atual pendente + 1) modulo o total
    const proximoIndex = (currentPendingIndex + 1) % treinos.length;
    const treino = treinos[proximoIndex];
    if (!treino) return null;

    const amanhã = new Date();
    amanhã.setDate(amanhã.getDate() + 1);
    const diasSemanaLabels = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const grupoNomes = treino.blocos.map(b => b.nomeGrupo).join(' + ');
    const letra = (treino as any).letra || String.fromCharCode(65 + proximoIndex);

    const exercicios = treino.blocos.flatMap((bloco, bIdx) =>
        bloco.exercicios.map((ex: any, i: number) => ({
            id: `next-ex-${bIdx}-${i}`,
            nome: ex.nome || ex.exercicio || '',
            series: ex.series || 0,
            repeticoes: ex.repeticoes || ex.reps || '',
            foco: bloco.nomeGrupo || '',
        }))
    );

    return {
        data: `Amanhã / Pós-Treino`,
        letraLabel: `Treino ${letra}`,
        grupoMuscular: grupoNomes,
        nomeTreino: treino.nome || grupoNomes,
        exercicios,
    };
}
export function derivarDietaDoDia(plano: PlanoDieta | null, isTreinoDay: boolean = true): DietOfDay {
    if (!plano) {
        return {
            metaCalorias: 0, metaProteina: 0, metaCarbos: 0, metaGordura: 0,
            consumidoCalorias: 0, consumidoProteina: 0, consumidoCarbos: 0, consumidoGordura: 0,
            percentualCalorias: 0, percentualProteina: 0, percentualCarbos: 0, percentualGordura: 0,
        };
    }

    // Usar macros de treino ou descanso conforme o dia
    const macros = isTreinoDay ? plano.macrosTreino : plano.macrosDescanso;
    const metaCalorias = isTreinoDay ? plano.calDiasTreino : plano.calDiasDescanso;
    const metaProteina = macros?.proteina?.gramas || 0;
    const metaCarbos = macros?.carboidrato?.gramas || 0;
    const metaGordura = macros?.gordura?.gramas || 0;

    return {
        metaCalorias: metaCalorias || macros?.total || 0,
        metaProteina, metaCarbos, metaGordura,
        consumidoCalorias: 0, consumidoProteina: 0, consumidoCarbos: 0, consumidoGordura: 0,
        percentualCalorias: 0, percentualProteina: 0, percentualCarbos: 0, percentualGordura: 0,
    };
}

/**
 * Busca registros do dia para preencher trackers
 */
export async function buscarRegistrosDoDia(atletaId: string): Promise<TrackerRapido[]> {
    const hoje = new Date().toISOString().split('T')[0];

    const { data: registros } = await supabase
        .from('registros_diarios')
        .select('*')
        .eq('atleta_id', atletaId)
        .eq('data', hoje);

    const regs = registros || [];

    // Agregar água do dia
    const aguaRegs = regs.filter(r => (r as any).tipo === 'agua');
    const totalAgua = aguaRegs.reduce((acc, r) => acc + ((r as any).dados?.quantidade || 0), 0);

    // Último sono do dia
    const sonoReg = regs.find(r => (r as any).tipo === 'sono');
    const sonoHoras = (sonoReg as any)?.dados?.quantidade || null;

    // Último peso
    const pesoReg = regs.find(r => (r as any).tipo === 'peso');
    const peso = (pesoReg as any)?.dados?.quantidade || null;

    // Dor ativa
    const dorReg = regs.find(r => (r as any).tipo === 'dor');
    const dorIntensidade = (dorReg as any)?.dados?.quantidade || null;
    const dorLocal = (dorReg as any)?.dados?.local || null;

    return [
        {
            id: 'agua',
            icone: '💧',
            label: 'Água',
            valor: totalAgua > 0 ? (totalAgua / 1000).toFixed(1) : undefined,
            unidade: 'L',
            status: totalAgua > 0 ? 'registrado' : 'pendente',
        },
        {
            id: 'sono',
            icone: '😴',
            label: 'Sono',
            valor: sonoHoras || undefined,
            unidade: 'h',
            status: sonoHoras ? 'registrado' : 'pendente',
        },
        {
            id: 'peso',
            icone: '⚖️',
            label: 'Peso',
            valor: peso || undefined,
            unidade: 'kg',
            status: peso ? 'registrado' : 'pendente',
        },
        {
            id: 'dor',
            icone: '🤕',
            label: 'Dor',
            valor: dorIntensidade ? `${dorIntensidade}/10` : undefined,
            status: dorReg ? 'registrado' : 'pendente',
        },
    ];
}

/**
 * Gera dica contextual do coach baseada nos dados do dia
 */
export function gerarDicaCoach(
    dieta: DietOfDay,
    treino: WorkoutOfDay,
    trackers: TrackerRapido[]
): DicaCoach {
    // Prioridade: proteína baixa > treino pendente > água baixa > parabéns
    const proteinaPct = dieta.metaProteina > 0
        ? (dieta.consumidoProteina / dieta.metaProteina) * 100
        : 100;

    if (proteinaPct < 50 && dieta.metaProteina > 0) {
        const faltam = dieta.metaProteina - dieta.consumidoProteina;
        return {
            tipo: 'alerta',
            mensagem: `Faltam ${faltam}g de proteína hoje. Que tal um shake pós-treino com 2 scoops de whey?`,
        };
    }

    if (treino.status === 'pendente') {
        return {
            tipo: 'dica',
            mensagem: `Treino de ${treino.titulo} está pendente! Lembre-se: consistência é a chave para resultados.`,
        };
    }

    const agua = trackers.find(t => t.id === 'agua');
    if (agua?.status === 'pendente') {
        return {
            tipo: 'dica',
            mensagem: 'Não esqueça de registrar sua hidratação hoje! A água é fundamental para performance e recuperação.',
        };
    }

    return {
        tipo: 'elogio',
        mensagem: 'Excelente! Você está no caminho certo. Continue mantendo a consistência! 💪',
    };
}

/**
 * Monta dados completos da tela HOJE
 * OTIMIZADO: trackers e refeições carregam em paralelo
 */
export async function montarDadosHoje(ctx: PortalContext): Promise<TodayScreenData> {
    const lastCompletedIndex = await getUltimoTreinoIndex(ctx.atletaId);

    // Buscar trackers, refeições e status do treino hoje em PARALELO
    const hoje = new Date().toISOString().split('T')[0];
    const [trackers, { data: refeicoes }, { data: treinoReg }] = await Promise.all([
        buscarRegistrosDoDia(ctx.atletaId),
        supabase
            .from('registros_diarios')
            .select('dados')
            .eq('atleta_id', ctx.atletaId)
            .eq('data', hoje)
            .eq('tipo', 'refeicao'),
        supabase
            .from('registros_diarios')
            .select('dados')
            .eq('atleta_id', ctx.atletaId)
            .eq('data', hoje)
            .eq('tipo', 'treino')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
    ]);

    const dHoje = treinoReg ? (treinoReg as any).dados : null;
    const jaFezTreinoHoje = dHoje && (dHoje.status === 'completo' || dHoje.status === 'pulado');

    // Se ele já completou/pulou um treino HOJE, queremos renderizar exatamente esse treino
    // na tela (para mostrar o card verde de "COMPLETO" ou card laranja de "PULADO").
    // O índice dele normalmente está em `dHoje.treinoIndex` ou no próprio `lastCompletedIndex`.
    let indiceRender = undefined;
    if (jaFezTreinoHoje) {
        indiceRender = (typeof dHoje.treinoIndex === 'number') ? dHoje.treinoIndex : lastCompletedIndex;
    }

    const treinoResult = derivarTreinoDoDia(ctx.planoTreino, lastCompletedIndex, indiceRender);

    // Convert to strict WorkoutOfDay type
    const treino: WorkoutOfDay = {
        ...treinoResult,
    } as any;

    if (jaFezTreinoHoje) {
        treino.status = dHoje.status;
        if (dHoje.duracao) treino.duracao = dHoje.duracao;
        if (dHoje.intensidade) treino.intensidade = dHoje.intensidade;
    }

    const isTreinoDay = treino.status !== 'descanso';
    const dieta = derivarDietaDoDia(ctx.planoDieta, isTreinoDay);

    const dicaCoach = gerarDicaCoach(dieta, treino, trackers);

    if (refeicoes && refeicoes.length > 0) {
        for (const ref of refeicoes) {
            const d = (ref as any).dados;
            if (d) {
                dieta.consumidoCalorias += d.calorias || 0;
                dieta.consumidoProteina += d.proteina || 0;
                dieta.consumidoCarbos += d.carboidrato || 0;
                dieta.consumidoGordura += d.gordura || 0;
            }
        }
        // Recalcular percentuais
        dieta.percentualCalorias = dieta.metaCalorias > 0 ? Math.round((dieta.consumidoCalorias / dieta.metaCalorias) * 100) : 0;
        dieta.percentualProteina = dieta.metaProteina > 0 ? Math.round((dieta.consumidoProteina / dieta.metaProteina) * 100) : 0;
        dieta.percentualCarbos = dieta.metaCarbos > 0 ? Math.round((dieta.consumidoCarbos / dieta.metaCarbos) * 100) : 0;
        dieta.percentualGordura = dieta.metaGordura > 0 ? Math.round((dieta.consumidoGordura / dieta.metaGordura) * 100) : 0;
    }

    const hojeDate = new Date();
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    return {
        atleta: {
            nome: ctx.atletaNome,
            streak: 0, // TODO: calcular streak
        },
        treino,
        dieta,
        trackers,
        dicaCoach,
        dataFormatada: `${diasSemana[hojeDate.getDay()]}, ${hojeDate.getDate().toString().padStart(2, '0')} ${meses[hojeDate.getMonth()]}`,
    };
}

// ==========================================
// TELA PROGRESSO
// ==========================================

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

    const ultimo = assessments[0] as any;
    const anterior = assessments.length > 1 ? (assessments[1] as any) : null;
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

    const dados = (medidas || []).map((m: any) => ({
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

    const results = (assessment as any).results;
    const proporcoes = results?.proporcoes || results?.proportions || [];

    return proporcoes.slice(0, 5).map((p: any) => {
        const atual = p.ratio || p.atual || 0;
        const meta = p.idealRatio || p.meta || 1.618;
        const percentual = meta > 0 ? Math.round((atual / meta) * 100) : 0;
        let classificacao = 'CAMINHO';
        let emoji = '🏃';
        if (percentual >= 100) { classificacao = 'META'; emoji = '🎯'; }
        else if (percentual >= 90) { classificacao = 'QUASE LÁ'; emoji = '💪'; }
        else if (percentual >= 75) { classificacao = 'EVOLUINDO'; emoji = '📈'; }

        return {
            nome: p.name || p.nome || '',
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

    return (assessments || []).map((a: any) => ({
        id: a.id,
        data: new Date(a.date),
        score: a.score || 0,
        classificacao: a.results?.classificacao?.nivel || '',
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

    const a = assessment as any;
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

    const bf = compDetalhesSub?.bf?.valor || a.body_fat || 0;
    const scoreBF = compDetalhesSub?.bf?.score || 0;
    const ffmi = compDetalhesSub?.ffmi?.valor || 0;
    const scoreFFMI = compDetalhesSub?.ffmi?.score || 0;
    const pesoRelativoVal = compDetalhesSub?.pesoRelativo?.valor || 0;
    const scorePesoRelativo = compDetalhesSub?.pesoRelativo?.score || 0;
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

    const proporcoes = rawProporcoes.map((p: any) => {
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
            classificacao: {} as any,
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

    const membros = simetriaDetalhes.map((s: any) => {
        const diferencaPercentual = s.diferencaPercent || 0;
        let status = 'simetrico';
        let emoji = '✅';
        let label = 'Simétrico';
        if (diferencaPercentual > 10) { status = 'significativa'; emoji = '❌'; label = 'Assimetria significativa'; }
        else if (diferencaPercentual > 5) { status = 'moderada'; emoji = '🔶'; label = 'Assimetria moderada'; }
        else if (diferencaPercentual > 2) { status = 'leve'; emoji = '⚠️'; label = 'Leve assimetria'; }

        return {
            membro: GRUPO_LABELS[s.grupo] || s.grupo || '',
            ladoEsquerdo: s.esquerdo || 0,
            ladoDireito: s.direito || 0,
            diferencaCm: Math.round((s.diferenca || 0) * 10) / 10,
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
        penalizacoes,
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
function getClassificacaoLabel(score: number): string {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'AVANÇADO';
    if (score >= 70) return 'ATLÉTICO';
    if (score >= 60) return 'INTERMEDIÁRIO';
    if (score >= 50) return 'INICIANTE';
    return 'COMEÇANDO';
}

function getClassificacaoEmoji(score: number): string {
    if (score >= 90) return '👑';
    if (score >= 80) return '🥇';
    if (score >= 70) return '💪';
    if (score >= 60) return '🏃';
    if (score >= 50) return '🌱';
    return '🚀';
}

/** Return type for buscarDadosAvaliacao */
interface AvaliacaoDadosResult {
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
    proporcoes: any[];
    assimetria: {
        membros: any[];
        scoreGeral: number;
        classificacao: string;
        emoji: string;
    };
}

// ==========================================
// TELA COACH (CHAT)
// ==========================================

/**
 * Busca mensagens de chat do Supabase
 */
export async function buscarMensagensChat(atletaId: string): Promise<ChatMessage[]> {
    const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('atleta_id', atletaId)
        .order('created_at', { ascending: true })
        .limit(100);

    return (data || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
        status: 'sent' as const,
    }));
}

/**
 * Salva uma mensagem de chat
 */
export async function salvarMensagemChat(
    atletaId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<void> {
    await supabase
        .from('chat_messages')
        .insert({
            atleta_id: atletaId,
            role,
            content,
        } as any);
}

// ==========================================
// REGISTROS DIÁRIOS (TRACKERS)
// ==========================================

/**
 * Registra tracker diário (água, peso, sono, dor, treino)
 */
export async function registrarTracker(
    atletaId: string,
    tipo: 'agua' | 'sono' | 'peso' | 'treino' | 'dor' | 'refeicao',
    dados: Record<string, any>
): Promise<boolean> {
    const { error } = await supabase
        .from('registros_diarios')
        .insert({
            atleta_id: atletaId,
            data: new Date().toISOString().split('T')[0],
            tipo,
            dados,
        } as any);

    if (error) {
        console.error('[PortalDataService] Erro ao registrar tracker:', error);
        return false;
    }
    return true;
}

/**
 * Marca treino como completado
 */
export async function completarTreino(
    atletaId: string,
    dados: { intensidade: number; duracao: number; reportouDor: boolean; treinoIndex?: number }
): Promise<boolean> {
    return registrarTracker(atletaId, 'treino', {
        status: 'completo',
        ...dados,
    });
}

/**
 * Marca treino como pulado
 */
export async function pularTreino(atletaId: string, treinoIndex?: number): Promise<boolean> {
    return registrarTracker(atletaId, 'treino', {
        status: 'pulado',
        treinoIndex,
    });
}

// ==========================================
// TELA PERFIL
// ==========================================

/**
 * Busca dados básicos para a tela de perfil
 */
export function extrairDadosBasicos(ctx: PortalContext): DadosBasicos {
    const ficha = ctx.ficha || {};
    const hoje = new Date();
    const nascimento = ficha.data_nascimento ? new Date(ficha.data_nascimento) : null;
    const idade = nascimento
        ? Math.floor((hoje.getTime() - nascimento.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0;

    return {
        altura: ficha.altura || 0,
        idade,
        objetivo: ficha.objetivo || 'Não definido',
        categoria: 'Golden Ratio',
    };
}

/**
 * Extrai dados do personal para a tela de perfil
 */
export async function buscarDadosPersonal(personalId: string): Promise<MeuPersonal | null> {
    if (!personalId) return null;

    const { data } = await supabase
        .from('personais')
        .select('id, nome, email, telefone, cref')
        .eq('id', personalId)
        .single();

    if (!data) return null;

    return {
        id: (data as any).id,
        nome: (data as any).nome || 'Personal',
        cref: (data as any).cref || '',
        telefone: (data as any).telefone || '',
        email: (data as any).email || '',
    };
}
