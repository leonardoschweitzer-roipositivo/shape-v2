/**
 * Portal Trackers — Registros diários (água, sono, peso, treino)
 */
import { supabase } from '@/services/supabase';
import type { SupaRegistroDiario } from './portalTypes';
import type { SetExecutado, ExercicioTreino } from '@/types/athlete-portal';
import type { PlanoTreino, BlocoTreino, Exercicio } from '@/services/calculations/treino';
import { getHojeLocal } from './dateUtils';

/**
 * Registra tracker diário (água, peso, sono, dor, treino)
 */
export async function registrarTracker(
    atletaId: string,
    tipo: 'agua' | 'sono' | 'peso' | 'treino' | 'dor' | 'refeicao' | 'feedback',
    dados: Record<string, unknown>,
    dataOverride?: string // 'YYYY-MM-DD' — para registros retroativos (ex: ontem)
): Promise<boolean> {
    const { error } = await supabase
        .from('registros_diarios')
        .insert({
            atleta_id: atletaId,
            data: dataOverride || getHojeLocal(),
            tipo,
            dados,
        } as Record<string, unknown>);

    if (error) {
        console.error('[PortalDataService] Erro ao registrar tracker:', error);
        return false;
    }
    return true;
}

/**
 * Exercício realizado em um treino concluído (snapshot da lista final, com sets detalhados).
 */
export interface ExercicioRealizado {
    id: string;
    nome: string;
    series?: number;              // prescrito (contagem original do plano)
    repeticoes?: string;          // prescrito (range "10-12")
    sets?: SetExecutado[];        // realizados — um objeto por série, com carga + reps
    concluido?: boolean;          // se o aluno marcou o checkbox do exercício
}

/**
 * Marca treino como completado
 */
export async function completarTreino(
    atletaId: string,
    dados: {
        intensidade: number;
        duracao: number;
        reportouDor: boolean;
        treinoIndex?: number;
        exercicios?: ExercicioRealizado[]; // snapshot da lista final (após edições do aluno)
    },
    dataOverride?: string, // 'YYYY-MM-DD' — para registros retroativos
    personalId?: string    // ID do personal para notificação direta
): Promise<boolean> {
    const result = await registrarTracker(atletaId, 'treino', {
        status: 'completo',
        ...dados,
    }, dataOverride);

    // Disparar notificação para o Personal (await garante execução no mobile)
    if (result) {
        try {
            const { onTreinoCompleto } = await import('../notificacaoTriggers')
            await onTreinoCompleto(atletaId, {
                duracao: dados.duracao ? `${dados.duracao}min` : undefined,
                personalId
            })
        } catch (err) {
            console.warn('[completarTreino] Erro ao notificar:', err)
        }
    }

    return result;
}

/**
 * Marca treino como pulado
 */
export async function pularTreino(
    atletaId: string,
    treinoIndex?: number,
    continuarHoje: boolean = false,
    personalId?: string
): Promise<boolean> {
    const result = await registrarTracker(atletaId, 'treino', {
        status: 'pulado',
        treinoIndex,
        continuarHoje,
    });

    // Disparar notificação para o Personal (await garante execução no mobile)
    if (result) {
        try {
            const { onTreinoPulado } = await import('../notificacaoTriggers')
            await onTreinoPulado(atletaId, { personalId, continuarHoje })
        } catch (err) {
            console.warn('[pularTreino] Erro ao notificar:', err)
        }
    }

    return result;
}

/**
 * Persiste as modificações de exercícios feitas pelo aluno de volta ao plano de treino.
 * Atualiza a tabela `planos_treino` para que o treino modificado persista para sempre,
 * não apenas no registro do dia.
 *
 * Regras:
 * - Exercícios com ID `ex-{bIdx}-{eIdx}` → mapeados para o bloco/posição original
 * - Exercícios removidos (não aparecem na lista) → excluídos do bloco
 * - Exercícios com ID `custom-ex-*` (adicionados pelo aluno) → appendados no último bloco
 * - Blocos que ficarem sem exercícios são removidos
 */
export async function atualizarExerciciosNoPlano(
    atletaId: string,
    treinoIndex: number,
    exerciciosModificados: ExercicioTreino[]
): Promise<boolean> {
    // 1. Carrega o plano ativo
    const { data: planoRow, error: fetchError } = await supabase
        .from('planos_treino')
        .select('id, dados')
        .eq('atleta_id', atletaId)
        .eq('status', 'ativo')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (fetchError || !planoRow) {
        console.error('[atualizarExerciciosNoPlano] Plano não encontrado:', fetchError);
        return false;
    }

    const plano = planoRow.dados as PlanoTreino;
    if (!plano?.treinos?.[treinoIndex]) {
        console.error('[atualizarExerciciosNoPlano] treinoIndex inválido:', treinoIndex);
        return false;
    }

    const treino = plano.treinos[treinoIndex];
    const blocosOriginais = treino.blocos;

    // 2. Agrupa exercícios modificados por bloco de origem
    const porBloco = new Map<number, { origIdx: number; ex: ExercicioTreino }[]>();
    const customExs: ExercicioTreino[] = [];

    for (const ex of exerciciosModificados) {
        const m = ex.id.match(/^ex-(\d+)-(\d+)$/);
        if (m) {
            const bIdx = parseInt(m[1]);
            const eIdx = parseInt(m[2]);
            if (!porBloco.has(bIdx)) porBloco.set(bIdx, []);
            porBloco.get(bIdx)!.push({ origIdx: eIdx, ex });
        } else {
            // custom-ex-* ou qualquer outro ID não-posicional
            customExs.push(ex);
        }
    }

    // 3. Reconstrói os blocos preservando metadados originais (descanso, técnica, etc.)
    const novosBlocos: BlocoTreino[] = [];

    for (let bIdx = 0; bIdx < blocosOriginais.length; bIdx++) {
        const bloco = blocosOriginais[bIdx];
        const exsNesseBloco = porBloco.get(bIdx) ?? [];

        if (exsNesseBloco.length === 0) continue; // bloco inteiro removido

        const novosExercicios: Exercicio[] = exsNesseBloco.map(({ origIdx, ex }) => {
            const original: Partial<Exercicio> = bloco.exercicios[origIdx] ?? {};
            return {
                ordem: original.ordem ?? origIdx,
                descansoSegundos: original.descansoSegundos ?? 60,
                tecnica: original.tecnica,
                observacao: original.observacao ?? ex.dica,
                bibliotecaId: original.bibliotecaId ?? ex.bibliotecaId,
                urlVideo: original.urlVideo ?? ex.videoUrl,
                nome: ex.nome,
                series: ex.series,
                repeticoes: ex.repeticoes,
            } as Exercicio;
        });

        novosBlocos.push({ ...bloco, exercicios: novosExercicios });
    }

    // 4. Exercícios customizados vão para o último bloco (ou criam um novo)
    if (customExs.length > 0) {
        const customExercicios: Exercicio[] = customExs.map((ex, i) => ({
            ordem: 99 + i,
            nome: ex.nome,
            series: ex.series,
            repeticoes: ex.repeticoes,
            descansoSegundos: 60,
            bibliotecaId: ex.bibliotecaId,
            urlVideo: ex.videoUrl,
        } as Exercicio));

        if (novosBlocos.length > 0) {
            novosBlocos[novosBlocos.length - 1].exercicios.push(...customExercicios);
        } else {
            novosBlocos.push({
                nomeGrupo: 'Exercícios',
                seriesTotal: customExs.reduce((s, e) => s + e.series, 0),
                isPrioridade: false,
                exercicios: customExercicios,
            });
        }
    }

    // 5. Atualiza o plano com os novos blocos
    const novoPlano: PlanoTreino = {
        ...plano,
        treinos: plano.treinos.map((t, i) =>
            i === treinoIndex ? { ...t, blocos: novosBlocos } : t
        ),
    };

    const { error: updateError } = await supabase
        .from('planos_treino')
        .update({ dados: novoPlano })
        .eq('id', planoRow.id);

    if (updateError) {
        console.error('[atualizarExerciciosNoPlano] Erro ao salvar:', updateError);
        return false;
    }

    return true;
}
