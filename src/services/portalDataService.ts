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

// ==========================================
// TELA HOJE
// ==========================================

/**
 * Deriva o treino do dia a partir do PlanoTreino salvo
 */
export function derivarTreinoDoDia(plano: PlanoTreino | null): WorkoutOfDay {
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

    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0=Dom, 1=Seg, ...

    // Mapear treinos da semana
    const treinos = plano.treinos || [];
    const diasTreinados = treinos.length;

    // Domingo ou mais dias que treinos → descanso
    if (diaSemana === 0 || diaSemana > diasTreinados) {
        return {
            id: 'descanso',
            titulo: 'DIA DE DESCANSO',
            subtitulo: 'Recuperação é essencial para os ganhos!',
            diaAtual: 0,
            diasTotal: diasTreinados,
            status: 'descanso',
        };
    }

    // Selecionar treino pela posição na sequência de letras
    // diaSemana 1(Seg)→treinos[0](A), 2(Ter)→treinos[1](B), etc.
    const treinoHoje = treinos[diaSemana - 1];
    if (!treinoHoje) {
        return {
            id: 'descanso',
            titulo: 'DIA DE DESCANSO',
            subtitulo: 'Recuperação é essencial para os ganhos!',
            diaAtual: 0,
            diasTotal: diasTreinados,
            status: 'descanso',
        };
    }

    // Extrair grupos do nome do treino
    const grupoNomes = treinoHoje.blocos.map(b => b.nomeGrupo).join(' + ');
    const letra = (treinoHoje as any).letra || String.fromCharCode(65 + (diaSemana - 1));

    // Flatten exercícios de todos os blocos
    const todosExercicios = treinoHoje.blocos.flatMap(bloco =>
        bloco.exercicios.map((ex: any, i: number) => ({
            id: `ex-${i}`,
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
        diaAtual: diaSemana,
        diasTotal: diasTreinados,
        status: 'pendente',
        exercicios: todosExercicios,
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
 * Deriva o próximo treino a partir do PlanoTreino salvo
 */
export function derivarProximoTreino(plano: PlanoTreino | null): ProximoTreino | null {
    if (!plano) return null;

    const treinos = plano.treinos || [];
    if (treinos.length === 0) return null;

    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0=Dom, 1=Seg, ...
    const diasSemanaLabels = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Procurar o próximo dia com treino
    for (let offset = 1; offset <= 7; offset++) {
        const futuroDiaSemana = (diaSemana + offset) % 7;
        // Treinos são mapeados: 1=Seg → treinos[0], 2=Ter → treinos[1], etc.
        if (futuroDiaSemana === 0 || futuroDiaSemana > treinos.length) continue;

        const treinoIndex = futuroDiaSemana - 1;
        const treino = treinos[treinoIndex];
        if (!treino) continue;

        // Calcular data
        const futuraData = new Date(hoje);
        futuraData.setDate(futuraData.getDate() + offset);

        const grupoNomes = treino.blocos.map(b => b.nomeGrupo).join(' + ');
        const letra = (treino as any).letra || String.fromCharCode(65 + treinoIndex);

        const exercicios = treino.blocos.flatMap(bloco =>
            bloco.exercicios.map((ex: any, i: number) => ({
                id: `next-ex-${i}`,
                nome: ex.nome || ex.exercicio || '',
                series: ex.series || 0,
                repeticoes: ex.repeticoes || ex.reps || '',
                foco: bloco.nomeGrupo || '',
            }))
        );

        return {
            data: `${diasSemanaLabels[futuroDiaSemana]}, ${futuraData.getDate().toString().padStart(2, '0')} ${meses[futuraData.getMonth()]}`,
            letraLabel: `Treino ${letra}`,
            grupoMuscular: grupoNomes,
            nomeTreino: treino.nome || grupoNomes,
            exercicios,
        };
    }

    return null;
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
    const treino = derivarTreinoDoDia(ctx.planoTreino);
    const isTreinoDay = treino.status !== 'descanso';
    const dieta = derivarDietaDoDia(ctx.planoDieta, isTreinoDay);

    // Buscar trackers e refeições em PARALELO
    const hoje = new Date().toISOString().split('T')[0];
    const [trackers, { data: refeicoes }] = await Promise.all([
        buscarRegistrosDoDia(ctx.atletaId),
        supabase
            .from('registros_diarios')
            .select('dados')
            .eq('atleta_id', ctx.atletaId)
            .eq('data', hoje)
            .eq('tipo', 'refeicao'),
    ]);

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
 * Extrai diagnóstico, proporções detalhadas e assimetrias do campo `results`
 */
export async function buscarDadosAvaliacao(atletaId: string): Promise<AvaliacaoDadosResult | null> {
    const { data: assessment } = await supabase
        .from('assessments')
        .select('id, date, score, results')
        .eq('atleta_id', atletaId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

    if (!assessment) return null;

    const a = assessment as any;
    const results = a.results || {};
    const score = a.score || 0;

    // Classificação geral
    let classificacaoGeral = 'INICIANDO';
    let emojiGeral = '🏃';
    if (score >= 90) { classificacaoGeral = 'ELITE'; emojiGeral = '👑'; }
    else if (score >= 80) { classificacaoGeral = 'AVANÇADO'; emojiGeral = '🔥'; }
    else if (score >= 70) { classificacaoGeral = 'ATLÉTICO'; emojiGeral = '💪'; }
    else if (score >= 60) { classificacaoGeral = 'INTERMEDIÁRIO'; emojiGeral = '🏃'; }
    else if (score >= 50) { classificacaoGeral = 'INICIANTE'; emojiGeral = '🌱'; }

    // === DIAGNÓSTICO ESTÉTICO ===
    const comp = results?.composicao || results?.composition || {};
    const bf = comp?.bf || comp?.bodyFat || 0;
    const ffmi = comp?.ffmi || 0;
    const massaMagra = comp?.massaMagra || comp?.leanMass || 0;
    const massaGorda = comp?.massaGorda || comp?.fatMass || 0;
    const scoreBF = comp?.scoreBF || comp?.bfScore || 0;
    const scoreFFMI = comp?.scoreFFMI || comp?.ffmiScore || 0;
    const scorePR = comp?.scorePesoRelativo || 0;
    const scoreComp = comp?.score || comp?.scoreTotal || 0;

    let classComp = 'NORMAL';
    let emojiComp = '🏃';
    if (scoreComp >= 80) { classComp = 'ATLÉTICO'; emojiComp = '🔥'; }
    else if (scoreComp >= 60) { classComp = 'FITNESS'; emojiComp = '💪'; }
    else if (scoreComp >= 40) { classComp = 'NORMAL'; emojiComp = '🏃'; }
    else { classComp = 'ACIMA DO PESO'; emojiComp = '⚠️'; }

    const diagnostico = {
        bf,
        scoreBF,
        ffmi,
        scoreFFMI,
        massaMagra,
        massaGorda,
        pesoRelativo: comp?.pesoRelativo || 0,
        scorePesoRelativo: scorePR,
        scoreTotal: scoreComp,
        classificacao: classComp,
        emoji: emojiComp,
    };

    // === PROPORÇÕES ÁUREAS ===
    const rawProporcoes = results?.proporcoes || results?.proportions || [];
    const proporcoes = rawProporcoes.map((p: any) => {
        const atual = p.ratio || p.indiceAtual || p.atual || 0;
        const meta = p.idealRatio || p.indiceMeta || p.meta || 1.618;
        const ehInversa = p.ehInversa || p.isInverse || false;

        let percentualDoIdeal: number;
        if (ehInversa) {
            // Proporção inversa (cintura): menor é melhor
            if (atual <= meta) {
                const bonus = ((meta - atual) / meta) * 100;
                percentualDoIdeal = Math.min(110, 100 + bonus * 0.5);
            } else {
                const excesso = ((atual - meta) / meta) * 100;
                percentualDoIdeal = Math.max(75, 100 - excesso * 1.5);
            }
        } else {
            percentualDoIdeal = meta > 0 ? Math.min(115, (atual / meta) * 100) : 0;
        }

        return {
            nome: p.name || p.nome || '',
            categoria: p.categoria || '',
            indiceAtual: parseFloat(atual.toFixed(3)),
            indiceMeta: parseFloat(meta.toFixed(3)),
            percentualDoIdeal: Math.round(percentualDoIdeal * 10) / 10,
            ehInversa,
            formulaBase: p.formulaBase || p.formula || '',
            medidaAtual: p.medidaAtual || undefined,
            medidaMeta: p.medidaMeta || undefined,
            diferencaCm: p.diferencaCm || undefined,
            // classificacao e posicaoBarra serão calculados no componente
            classificacao: {} as any,
            posicaoBarra: 0,
        };
    });

    // === ASSIMETRIA ===
    const rawAssimetria = results?.assimetria || results?.asymmetry || {};
    const assimetriaMembros = rawAssimetria?.membros || rawAssimetria?.members || [];
    const membros = assimetriaMembros.map((m: any) => {
        const esq = m.ladoEsquerdo || m.left || 0;
        const dir = m.ladoDireito || m.right || 0;
        const maior = Math.max(esq, dir);
        const menor = Math.min(esq, dir);
        const diffCm = Math.abs(esq - dir);
        const diffPct = maior > 0 ? ((maior - menor) / maior) * 100 : 0;

        let status = 'simetrico';
        let emoji = '✅';
        let label = 'Simétrico';
        if (diffPct > 10) { status = 'significativa'; emoji = '❌'; label = 'Assimetria significativa'; }
        else if (diffPct > 5) { status = 'moderada'; emoji = '🔶'; label = 'Assimetria moderada'; }
        else if (diffPct > 2) { status = 'leve'; emoji = '⚠️'; label = 'Leve assimetria'; }

        return {
            membro: m.membro || m.name || '',
            ladoEsquerdo: esq,
            ladoDireito: dir,
            diferencaCm: Math.round(diffCm * 10) / 10,
            diferencaPercentual: Math.round(diffPct * 10) / 10,
            status,
            emoji,
            label,
        };
    });

    const scoresSimetria = membros.map((m: any) =>
        Math.max(50, 100 - m.diferencaPercentual * 5)
    );
    const scoreSimetria = membros.length > 0
        ? Math.round(scoresSimetria.reduce((a: number, b: number) => a + b, 0) / scoresSimetria.length)
        : 100;

    let classSimetria = 'EXCELENTE';
    let emojiSimetria = '✅';
    if (scoreSimetria < 70) { classSimetria = 'PRECISA MELHORAR'; emojiSimetria = '❌'; }
    else if (scoreSimetria < 85) { classSimetria = 'BOM'; emojiSimetria = '⚠️'; }
    else if (scoreSimetria < 95) { classSimetria = 'MUITO BOM'; emojiSimetria = '💪'; }

    // === SCORES DOS 3 PILARES ===
    const scoreProporcoes = results?.scoreProporcoes || results?.proportionScore || score * 0.4;
    const scoreComposicao = scoreComp || score * 0.35;

    return {
        id: a.id,
        data: new Date(a.date),
        scoreGeral: score,
        classificacaoGeral,
        emojiGeral,
        scores: {
            proporcoes: { valor: scoreProporcoes, peso: 0.40, contribuicao: scoreProporcoes * 0.40 },
            composicao: { valor: scoreComposicao, peso: 0.35, contribuicao: scoreComposicao * 0.35 },
            simetria: { valor: scoreSimetria, peso: 0.25, contribuicao: scoreSimetria * 0.25 },
        },
        diagnostico,
        proporcoes,
        assimetria: {
            membros,
            scoreGeral: scoreSimetria,
            classificacao: classSimetria,
            emoji: emojiSimetria,
        },
    };
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
    dados: { intensidade: number; duracao: number; reportouDor: boolean }
): Promise<boolean> {
    return registrarTracker(atletaId, 'treino', {
        status: 'completo',
        ...dados,
    });
}

/**
 * Marca treino como pulado
 */
export async function pularTreino(atletaId: string): Promise<boolean> {
    return registrarTracker(atletaId, 'treino', { status: 'pulado' });
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
