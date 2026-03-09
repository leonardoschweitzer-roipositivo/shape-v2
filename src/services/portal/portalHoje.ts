/**
 * Portal HOJE — Dados da tela "Hoje" do Portal do Atleta
 */
import { supabase } from '@/services/supabase';
import type { WorkoutStatus } from '@/types/athlete-portal';
import type {
    TodayScreenData, WorkoutOfDay, DietOfDay,
    TrackerRapido, DicaCoach,
} from '@/types/athlete-portal';
import type { PlanoTreino } from '@/services/calculations/treino';
import type { PlanoDieta } from '@/services/calculations/dieta';
import type { SupaRegistroDiario, PortalContext } from './portalTypes';
import { getUltimoTreinoIndex } from './portalContext';
import { getHojeLocal } from './dateUtils';

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
    const letra = (treinoHoje as unknown as Record<string, unknown>).letra as string || String.fromCharCode(65 + nextIndex);

    // Flatten exercícios de todos os blocos
    const todosExercicios = treinoHoje.blocos.flatMap((bloco, bIdx) =>
        bloco.exercicios.map((ex, i: number) => {
            const raw = ex as unknown as Record<string, unknown>;
            return {
                id: `ex-${bIdx}-${i}`,
                nome: ex.nome || (raw.exercicio as string) || '',
                series: ex.series || 0,
                repeticoes: ex.repeticoes || (raw.reps as string) || '',
                dica: ex.observacao || (raw.dica as string) || '',
                videoUrl: ex.urlVideo || (raw.urlVideo as string) || undefined,
                bibliotecaId: ex.bibliotecaId || (raw.bibliotecaId as string) || undefined,
                foco: bloco.nomeGrupo || '',
            };
        })
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
    const letra = (treino as unknown as Record<string, unknown>).letra as string || String.fromCharCode(65 + proximoIndex);

    const exercicios = treino.blocos.flatMap((bloco, bIdx) =>
        bloco.exercicios.map((ex, i: number) => {
            const raw = ex as unknown as Record<string, unknown>;
            return {
                id: `next-ex-${bIdx}-${i}`,
                nome: ex.nome || (raw.exercicio as string) || '',
                series: ex.series || 0,
                repeticoes: ex.repeticoes || (raw.reps as string) || '',
                foco: bloco.nomeGrupo || '',
            };
        })
    );

    return {
        data: `Amanhã / Pós-Treino`,
        letraLabel: `Treino ${letra}`,
        grupoMuscular: grupoNomes,
        nomeTreino: treino.nome || grupoNomes,
        exercicios,
    };
}

/**
 * Deriva a lista de próximos treinos na sequência (excluindo o atual).
 */
export function derivarProximosTreinos(plano: PlanoTreino | null, currentPendingIndex: number = 0): ProximoTreino[] {
    if (!plano) return [];

    const treinos = plano.treinos || [];
    if (treinos.length <= 1) return [];

    const proximos: ProximoTreino[] = [];
    const totalTreinos = treinos.length;

    // Começamos do próximo (index + 1) e pegamos o resto da sequência (até dar a volta ou acabar)
    // Se o plano tem 5 treinos (A, B, C, D, E) e o atual é C (index 2):
    // Queremos mostrar D (index 3), E (index 4), A (index 0), B (index 1).
    for (let i = 1; i < totalTreinos; i++) {
        const nextIndex = (currentPendingIndex + i) % totalTreinos;
        const treino = treinos[nextIndex];
        if (!treino) continue;

        const grupoNomes = treino.blocos.map(b => b.nomeGrupo).join(' + ');
        const letra = (treino as unknown as Record<string, unknown>).letra as string || String.fromCharCode(65 + nextIndex);

        const exercicios = treino.blocos.flatMap((bloco, bIdx) =>
            bloco.exercicios.map((ex, iEx: number) => {
                const raw = ex as unknown as Record<string, unknown>;
                return {
                    id: `next-${nextIndex}-ex-${bIdx}-${iEx}`,
                    nome: ex.nome || (raw.exercicio as string) || '',
                    series: ex.series || 0,
                    repeticoes: ex.repeticoes || (raw.reps as string) || '',
                    foco: bloco.nomeGrupo || '',
                };
            })
        );

        proximos.push({
            data: `Sequência ${nextIndex + 1}/${totalTreinos}`,
            letraLabel: `Treino ${letra}`,
            grupoMuscular: grupoNomes,
            nomeTreino: treino.nome || grupoNomes,
            exercicios,
        });
    }

    return proximos;
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
    const d = new Date();
    const hoje = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const { data: registros } = await supabase
        .from('registros_diarios')
        .select('*')
        .eq('atleta_id', atletaId)
        .eq('data', hoje);

    const regs = (registros || []) as unknown as SupaRegistroDiario[];

    // Agregar água do dia
    const aguaRegs = regs.filter(r => r.tipo === 'agua');
    const totalAgua = aguaRegs.reduce((acc, r) => acc + (Number(r.dados?.quantidade) || 0), 0);

    // Último sono do dia
    const sonoReg = regs.find(r => r.tipo === 'sono');
    const sonoHoras = sonoReg?.dados?.quantidade ?? null;

    // Último peso
    const pesoReg = regs.find(r => r.tipo === 'peso');
    const peso = pesoReg?.dados?.quantidade ?? null;

    // Dor ativa
    const dorReg = regs.find(r => r.tipo === 'dor');
    const dorIntensidade = dorReg?.dados?.quantidade ?? null;
    const dorLocal = dorReg?.dados?.local ?? null;

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
            valor: sonoHoras != null ? String(sonoHoras) : undefined,
            unidade: 'h',
            status: sonoHoras ? 'registrado' : 'pendente',
        },
        {
            id: 'peso',
            icone: '⚖️',
            label: 'Peso',
            valor: peso != null ? String(peso) : undefined,
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
 * 
 * OTIMIZADO v2: Usa apenas 2 queries ao Supabase:
 *  1) registros_diarios de TREINO dos últimos 60 dias (streak + lastIndex + status hoje)
 *  2) registros_diarios de HOJE (todos os tipos: agua, sono, peso, dor, refeicao)
 *
 * Antes: 7 queries separadas (getUltimoTreinoIndex, calcularStreak, 
 *        buscarRegistrosDoDia, refeicoes, treinoReg)
 */
export async function montarDadosHoje(ctx: PortalContext): Promise<TodayScreenData> {
    const hoje = getHojeLocal();

    // ── 2 queries em paralelo (antes eram 7) ──
    const [{ data: treinoHistory }, { data: registrosHoje }] = await Promise.all([
        // Query 1: Histórico de treinos para streak + lastIndex (último 60 dias)
        supabase
            .from('registros_diarios')
            .select('data, dados')
            .eq('atleta_id', ctx.atletaId)
            .eq('tipo', 'treino')
            .order('data', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(60),
        // Query 2: TODOS os registros de HOJE (agua, sono, peso, dor, refeicao, treino)
        supabase
            .from('registros_diarios')
            .select('tipo, dados')
            .eq('atleta_id', ctx.atletaId)
            .eq('data', hoje),
    ]);

    const histRegs = (treinoHistory || []) as unknown as SupaRegistroDiario[];

    // ── Derivar lastCompletedIndex (antes: getUltimoTreinoIndex) ──
    let lastCompletedIndex = -1;
    for (const rec of histRegs) {
        const d = rec.dados;
        if (d && (d.status === 'completo' || d.status === 'pulado')) {
            if (typeof d.treinoIndex === 'number') {
                lastCompletedIndex = d.treinoIndex;
                break;
            }
            if (rec.data) {
                const parts = rec.data.split('-');
                if (parts.length === 3) {
                    const dataRecordLocal = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                    let tsIndex = dataRecordLocal.getDay() - 1;
                    if (tsIndex < 0) tsIndex = 0;
                    lastCompletedIndex = tsIndex;
                    break;
                }
            }
        }
    }

    // ── Calcular streak in-memory (antes: calcularStreak com query própria) ──
    let streak = 0;
    {
        const checkinsSet = new Set<string>();
        for (const rec of histRegs) {
            if (rec.dados?.status === 'completo') {
                checkinsSet.add(rec.data);
            }
        }
        const hojeDt = new Date();
        hojeDt.setHours(0, 0, 0, 0);
        const hojeKey = `${hojeDt.getFullYear()}-${String(hojeDt.getMonth() + 1).padStart(2, '0')}-${String(hojeDt.getDate()).padStart(2, '0')}`;
        const startDt = new Date(hojeDt);
        if (!checkinsSet.has(hojeKey)) {
            startDt.setDate(startDt.getDate() - 1);
        }
        while (true) {
            const key = `${startDt.getFullYear()}-${String(startDt.getMonth() + 1).padStart(2, '0')}-${String(startDt.getDate()).padStart(2, '0')}`;
            if (checkinsSet.has(key)) {
                streak++;
                startDt.setDate(startDt.getDate() - 1);
            } else {
                break;
            }
        }
    }

    // ── Processar registrosHoje em memória (antes: buscarRegistrosDoDia + 2 queries extras) ──
    const regsHoje = (registrosHoje || []) as unknown as SupaRegistroDiario[];

    // Trackers
    const aguaRegs = regsHoje.filter(r => r.tipo === 'agua');
    const totalAgua = aguaRegs.reduce((acc, r) => acc + (Number(r.dados?.quantidade) || 0), 0);
    const sonoReg = regsHoje.find(r => r.tipo === 'sono');
    const sonoHoras = sonoReg?.dados?.quantidade ?? null;
    const pesoReg = regsHoje.find(r => r.tipo === 'peso');
    const peso = pesoReg?.dados?.quantidade ?? null;
    const dorReg = regsHoje.find(r => r.tipo === 'dor');
    const dorIntensidade = dorReg?.dados?.quantidade ?? null;

    const trackers: TrackerRapido[] = [
        {
            id: 'agua', icone: '💧', label: 'Água',
            valor: totalAgua > 0 ? (totalAgua / 1000).toFixed(1) : undefined,
            unidade: 'L', status: totalAgua > 0 ? 'registrado' : 'pendente',
        },
        {
            id: 'sono', icone: '😴', label: 'Sono',
            valor: sonoHoras != null ? String(sonoHoras) : undefined,
            unidade: 'h', status: sonoHoras ? 'registrado' : 'pendente',
        },
        {
            id: 'peso', icone: '⚖️', label: 'Peso',
            valor: peso != null ? String(peso) : undefined,
            unidade: 'kg', status: peso ? 'registrado' : 'pendente',
        },
        {
            id: 'dor', icone: '🤕', label: 'Dor',
            valor: dorIntensidade ? `${dorIntensidade}/10` : undefined,
            status: dorReg ? 'registrado' : 'pendente',
        },
    ];

    // Refeições de hoje (filtrado em memória)
    const refeicoes = regsHoje.filter(r => r.tipo === 'refeicao');

    // Status do treino de hoje (filtrado em memória — pegar o mais recente)
    const treinoRegsHoje = regsHoje.filter(r => r.tipo === 'treino');
    // O mais recente (já vem em ordem de created_at descendente? Não... veio sem order)  
    // Vamos pegar o último (mais recente por posição na array retornada)
    const treinoRegHoje = treinoRegsHoje.length > 0 ? treinoRegsHoje[treinoRegsHoje.length - 1] : null;

    const dHoje = treinoRegHoje?.dados ?? null;
    const jaFezTreinoHoje = dHoje && (dHoje.status === 'completo' || (dHoje.status === 'pulado' && dHoje.continuarHoje !== true));

    // Se ele já completou/pulou um treino HOJE, queremos renderizar exatamente esse treino
    // na tela (para mostrar o card verde de "COMPLETO" ou card laranja de "PULADO").
    let indiceRender: number | undefined = undefined;
    if (jaFezTreinoHoje) {
        indiceRender = (typeof dHoje.treinoIndex === 'number') ? dHoje.treinoIndex : lastCompletedIndex;
    }

    const treinoResult = derivarTreinoDoDia(ctx.planoTreino, lastCompletedIndex, indiceRender);

    // Convert to strict WorkoutOfDay type
    const treino: WorkoutOfDay = {
        ...treinoResult,
    } as WorkoutOfDay;

    if (jaFezTreinoHoje && dHoje) {
        treino.status = dHoje.status as WorkoutStatus;
        if (dHoje.duracao) treino.duracao = dHoje.duracao as number;
        if (dHoje.intensidade) treino.intensidade = dHoje.intensidade as 1 | 2 | 3 | 4;
    }

    const isTreinoDay = treino.status !== 'descanso';
    const dieta = derivarDietaDoDia(ctx.planoDieta, isTreinoDay);

    const dicaCoach = gerarDicaCoach(dieta, treino, trackers);

    if (refeicoes.length > 0) {
        for (const ref of refeicoes) {
            const d = ref.dados;
            if (d) {
                dieta.consumidoCalorias += Number(d.calorias) || 0;
                dieta.consumidoProteina += Number(d.proteina) || 0;
                dieta.consumidoCarbos += Number(d.carboidrato) || 0;
                dieta.consumidoGordura += Number(d.gordura) || 0;
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
            streak,
        },
        treino,
        dieta,
        trackers,
        dicaCoach,
        dataFormatada: `${diasSemana[hojeDate.getDay()]}, ${hojeDate.getDate().toString().padStart(2, '0')} ${meses[hojeDate.getMonth()]}`,
    };
}

