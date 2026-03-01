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
 */
export async function carregarContextoPortal(atletaId: string): Promise<PortalContext | null> {
    try {
        // 1. Dados do atleta
        const { data: atleta } = await supabase
            .from('atletas')
            .select('*')
            .eq('id', atletaId)
            .single();
        if (!atleta) return null;

        // 2. Personal
        const { data: personal } = await supabase
            .from('personais')
            .select('id, nome')
            .eq('id', (atleta as any).personal_id)
            .single();

        // 3. Ficha
        const { data: ficha } = await supabase
            .from('fichas')
            .select('*')
            .eq('atleta_id', atletaId)
            .single();

        // 4. Último diagnóstico confirmado
        const { data: diag } = await supabase
            .from('diagnosticos')
            .select('dados')
            .eq('atleta_id', atletaId)
            .eq('status', 'confirmado')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        // 5. Último plano de treino ativo
        const { data: treino } = await supabase
            .from('planos_treino')
            .select('dados')
            .eq('atleta_id', atletaId)
            .eq('status', 'ativo')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        // 6. Último plano de dieta ativo
        const { data: dieta } = await supabase
            .from('planos_dieta')
            .select('dados')
            .eq('atleta_id', atletaId)
            .eq('status', 'ativo')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        console.log('[PortalDataService] Diagnóstico:', diag ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        console.log('[PortalDataService] Plano Treino:', treino ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        console.log('[PortalDataService] Plano Dieta:', dieta ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        if (dieta) {
            const d = (dieta as any).dados;
            console.log('[PortalDataService] Dieta keys:', Object.keys(d || {}));
            console.log('[PortalDataService] calDiasTreino:', d?.calDiasTreino);
            console.log('[PortalDataService] macrosTreino:', d?.macrosTreino);
        }

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

    // Encontrar treino por dia da semana (1=Seg → Treino A, 2=Ter → Treino B, etc.)
    // Se dia de descanso (dom ou dias sem treino), mostrar descanso
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

    // Extrair grupos do nome do treino (ex: "Treino A - Peito + Tríceps")
    const grupoNomes = treinoHoje.blocos.map(b => b.nomeGrupo).join(' + ');

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
        id: `treino-${diaSemana}`,
        titulo: grupoNomes || treinoHoje.nome || 'TREINO',
        subtitulo: treinoHoje.nome || '',
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
    diaSemanaLabel: string;
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
            diaSemanaLabel: diasSemanaLabels[futuroDiaSemana],
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

    // Primeiro sono do dia
    const sonoReg = regs.find(r => (r as any).tipo === 'sono');
    const sonoHoras = (sonoReg as any)?.dados?.horas || null;

    // Último peso
    const pesoReg = regs.find(r => (r as any).tipo === 'peso');
    const peso = (pesoReg as any)?.dados?.valor || null;

    // Dor ativa
    const dorReg = regs.find(r => (r as any).tipo === 'dor');

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
 */
export async function montarDadosHoje(ctx: PortalContext): Promise<TodayScreenData> {
    const treino = derivarTreinoDoDia(ctx.planoTreino);
    const isTreinoDay = treino.status !== 'descanso';
    const dieta = derivarDietaDoDia(ctx.planoDieta, isTreinoDay);
    const trackers = await buscarRegistrosDoDia(ctx.atletaId);
    const dicaCoach = gerarDicaCoach(dieta, treino, trackers);

    const hoje = new Date();
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
        dataFormatada: `${diasSemana[hoje.getDay()]}, ${hoje.getDate().toString().padStart(2, '0')} ${meses[hoje.getMonth()]}`,
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
