/**
 * Plano de Treino - Serviço de Cálculos (Etapa 2 do Plano de Evolução)
 * 
 * Responsável por:
 * - Gerar visão anual de 4 trimestres
 * - Calcular volume semanal por grupo baseado no diagnóstico
 * - Definir divisão de treino (ABC, ABCD, ABCDE, PPL)
 * - Gerar lista de exercícios detalhada
 */

import { DiagnosticoDados } from './diagnostico';
import { PotencialAtleta } from './potencial';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface VisaoAnual {
    trimestres: {
        numero: 1 | 2 | 3 | 4;
        semanas: [number, number];
        foco: string[];
        volume: 'ALTO' | 'MODERADO' | 'BAIXO';
        scoreEsperado: number;
    }[];
}

export interface Mesociclo {
    numero: 1 | 2 | 3;
    nome: string;
    descricao: string;
    semanas: [number, number];
    volumeRelativo: number;
    intensidadeRelativa: number;
    rpeAlvo: [number, number];
}

export interface VolumePorGrupo {
    grupo: string;
    seriesPadrao: number;
    seriesPlano: number;
    prioridade: 'ALTA' | 'MEDIA' | 'NORMAL';
    observacao: string;
}

export interface TrimestreAtual {
    numero: number;
    focoPrincipal: string;
    mesociclos: Mesociclo[];
    volumePorGrupo: VolumePorGrupo[];
}

export interface EstruturaSemanal {
    dia: string;
    treino: string;
    grupos: string[];
    duracaoMinutos: number;
}

export interface DivisaoTreino {
    tipo: string;
    frequenciaSemanal: number;
    estruturaSemanal: EstruturaSemanal[];
}

export interface Exercicio {
    ordem: number;
    nome: string;
    series: number;
    repeticoes: string;
    descansoSegundos: number;
    tecnica?: string;
    observacao?: string;
}

export interface BlocoTreino {
    nomeGrupo: string;
    seriesTotal: number;
    isPrioridade: boolean;
    exercicios: Exercicio[];
}

export interface TreinoDetalhado {
    id: string;
    nome: string;
    diaSemana: string;
    duracaoMinutos: number;
    blocos: BlocoTreino[];
}

export interface ObservacoesTreino {
    resumo: string;
    pontosAtencao: string[];
    alinhamentoMetodologia: boolean;
    sugestaoForaMetodologia?: string;
    mensagemFinal: string;
}

export interface PlanoTreino {
    id: string;
    planoEvolucaoId: string;
    atletaId: string;
    visaoAnual: VisaoAnual;
    trimestreAtual: TrimestreAtual;
    divisao: DivisaoTreino;
    treinos: TreinoDetalhado[];
    observacoes: ObservacoesTreino;
    geradoEm: string;
}

// ═══════════════════════════════════════════════════════════
// CÁLCULOS E GERAÇÃO
// ═══════════════════════════════════════════════════════════

/**
 * Gera o plano de treino completo.
 * Consome PotencialAtleta como fonte única de verdade para nível, volumes e scores.
 */
export const gerarPlanoTreino = (
    atletaId: string,
    nomeAtleta: string,
    diagnostico: DiagnosticoDados,
    potencial: PotencialAtleta
): PlanoTreino => {
    const dataRef = new Date().toISOString();

    // ═══════════════════════════════════════════════════════
    // FATORES DO POTENCIAL — fonte única de verdade
    // ═══════════════════════════════════════════════════════
    const { nivel, fatorVolume, fatorPrioAlta, fatorPrioMedia, frequenciaSemanal, divisao: tipoDivisao } = potencial;
    const isIniciante = nivel === 'INICIANTE';
    const isIntermediario = nivel === 'INTERMEDIÁRIO';
    const labelNivel = nivel;
    const freq = frequenciaSemanal;

    // Scores trimestrais do potencial (alinhados com o diagnóstico reanalisado)
    const scoreAtual = diagnostico.analiseEstetica.scoreAtual;
    const [dT1, dT2, dT3, dT4] = potencial.deltaScorePorTrimestre;
    const scoreT1 = Math.round((scoreAtual + dT1) * 10) / 10;
    const scoreT2 = Math.round((scoreAtual + dT1 + dT2) * 10) / 10;
    const scoreT3 = Math.round((scoreAtual + dT1 + dT2 + dT3) * 10) / 10;
    const scoreT4 = Math.round((scoreAtual + dT1 + dT2 + dT3 + dT4) * 10) / 10;

    const priosAltas = diagnostico.prioridades.filter(p => p.nivel === 'ALTA').map(p => p.grupo);
    const priosMedias = diagnostico.prioridades.filter(p => p.nivel === 'MEDIA').map(p => p.grupo);

    const visaoAnual: VisaoAnual = {
        trimestres: [
            {
                numero: 1,
                semanas: [1, 12],
                foco: [...priosAltas, 'Base Geral'],
                volume: 'ALTO',
                scoreEsperado: scoreT1
            },
            {
                numero: 2,
                semanas: [13, 24],
                foco: ['Consolidação', ...(priosMedias.length > 0 ? priosMedias.slice(0, 2) : ['Novas Prioridades'])],
                volume: 'ALTO',
                scoreEsperado: scoreT2
            },
            {
                numero: 3,
                semanas: [25, 36],
                foco: ['Refinamento', 'Simetria'],
                volume: 'MODERADO',
                scoreEsperado: scoreT3
            },
            {
                numero: 4,
                semanas: [37, 48],
                foco: ['Manutenção', 'Pico'],
                volume: 'BAIXO',
                scoreEsperado: scoreT4
            }
        ]
    };

    // 2. Mesociclos adaptados ao nível do atleta
    const mesociclos: Mesociclo[] = isIniciante ? [
        { numero: 1, nome: 'Adaptação', descricao: 'Sua prioridade é aprender o movimento com técnica perfeita. Cargas leves, foco no controle — essa fase constrói a base para tudo que vem depois.', semanas: [1, 4], volumeRelativo: 65, intensidadeRelativa: 55, rpeAlvo: [5, 6] },
        { numero: 2, nome: 'Progressão', descricao: 'Aumento gradual de carga e volume. Continue priorizando a técnica — iniciantes crescem muito com pouco estímulo nessa fase.', semanas: [5, 8], volumeRelativo: 80, intensidadeRelativa: 65, rpeAlvo: [6, 7] },
        { numero: 3, nome: 'Consolidação', descricao: 'Consolide os movimentos e aumente o esforço com segurança. O corpo já se adaptou — agora é hora de crescer de verdade.', semanas: [9, 12], volumeRelativo: 90, intensidadeRelativa: 75, rpeAlvo: [7, 8] }
    ] as Mesociclo[] : isIntermediario ? [
        { numero: 1, nome: 'Adaptação', descricao: 'Fase de preparação: técnica perfeita, condicionamento articular. Volume moderado antes do pico.', semanas: [1, 4], volumeRelativo: 75, intensidadeRelativa: 65, rpeAlvo: [6, 7] },
        { numero: 2, nome: 'Acumulação', descricao: 'Pico de volume com cargas moderadas-altas. Aqui acontece a maior parte da hipertrofia — cada série conta.', semanas: [5, 8], volumeRelativo: 100, intensidadeRelativa: 78, rpeAlvo: [7, 8] },
        { numero: 3, nome: 'Intensificação', descricao: 'Reduz volume, aumenta carga. O corpo consolida os ganhos e se prepara para o próximo ciclo.', semanas: [9, 12], volumeRelativo: 88, intensidadeRelativa: 88, rpeAlvo: [8, 9] }
    ] as Mesociclo[] : [
        { numero: 1, nome: 'Adaptação', descricao: 'Fase de preparação: técnica perfeita, condicionamento articular e aprendizado motor. Volume moderado com cargas leves — o corpo se prepara para o trabalho pesado.', semanas: [1, 4], volumeRelativo: 80, intensidadeRelativa: 70, rpeAlvo: [6, 7] },
        { numero: 2, nome: 'Acumulação', descricao: 'Fase de crescimento máximo: pico de volume semanal com cargas moderadas-altas. Aqui acontece a maior parte da hipertrofia — cada série conta.', semanas: [5, 8], volumeRelativo: 100, intensidadeRelativa: 80, rpeAlvo: [7, 8] },
        { numero: 3, nome: 'Intensificação', descricao: 'Fase de força e consolidação: reduz volume e aumenta carga. O corpo consolida os ganhos musculares e desenvolve força para o próximo ciclo.', semanas: [9, 12], volumeRelativo: 90, intensidadeRelativa: 90, rpeAlvo: [8, 9] }
    ] as Mesociclo[];

    // 3. Volume por Grupo (Baseado no diagnóstico)
    // Mapa: nome da proporção no diagnóstico → grupo(s) muscular(es) que devem receber prioridade
    const ALIAS_DIAGNOSTICO_PARA_TREINO: Record<string, string[]> = {
        'Shape-V': ['Deltóide Lat.'],
        'Costas': ['Costas'],
        'Peitoral': ['Peitoral'],
        'Braço': ['Bíceps', 'Tríceps'],
        'Antebraço': [],
        'Coxa': ['Quadríceps', 'Posterior'],
        'Coxa vs Pantur.': ['Quadríceps'],
        'Panturrilha': ['Panturrilha'],
        'Tríade': [],
        'Cintura': [],
        'Upper vs Lower': [],
    };

    // Construir mapa: grupoMuscular → melhor prioridade encontrada
    const prioridadesPorGrupoTreino = new Map<string, 'ALTA' | 'MEDIA' | 'BAIXA'>();
    for (const prio of diagnostico.prioridades) {
        const gruposTreino = ALIAS_DIAGNOSTICO_PARA_TREINO[prio.grupo] || [];
        for (const gt of gruposTreino) {
            const atual = prioridadesPorGrupoTreino.get(gt);
            // Manter a prioridade mais alta
            if (!atual || (prio.nivel === 'ALTA') || (prio.nivel === 'MEDIA' && atual === 'BAIXA')) {
                prioridadesPorGrupoTreino.set(gt, prio.nivel);
            }
        }
    }

    // Bases de séries escaladas pelo nível
    const gruposBase = [
        { grupo: 'Peitoral', base: Math.round(14 * fatorVolume) },
        { grupo: 'Costas', base: Math.round(16 * fatorVolume) },
        { grupo: 'Deltóide Lat.', base: Math.round(12 * fatorVolume) },
        { grupo: 'Quadríceps', base: Math.round(14 * fatorVolume) },
        { grupo: 'Posterior', base: Math.round(12 * fatorVolume) },
        { grupo: 'Bíceps', base: Math.round(10 * fatorVolume) },
        { grupo: 'Tríceps', base: Math.round(10 * fatorVolume) },
        { grupo: 'Panturrilha', base: Math.round(10 * fatorVolume) }
    ];

    const volumePorGrupo: VolumePorGrupo[] = gruposBase.map(g => {
        const nivel = prioridadesPorGrupoTreino.get(g.grupo) || 'NORMAL';
        let seriesPlano = g.base;
        let obs = 'Manutenção';

        if (nivel === 'ALTA') {
            seriesPlano = Math.round(g.base * fatorPrioAlta);
            obs = `Prioridade máxima (${labelNivel}). +${Math.round((fatorPrioAlta - 1) * 100)}% volume.`;
        } else if (nivel === 'MEDIA') {
            seriesPlano = Math.round(g.base * fatorPrioMedia);
            obs = `Foco moderado (${labelNivel}). +${Math.round((fatorPrioMedia - 1) * 100)}% volume.`;
        }

        return {
            grupo: g.grupo,
            seriesPadrao: g.base,
            seriesPlano,
            prioridade: nivel === 'BAIXA' ? 'NORMAL' as const : nivel as 'ALTA' | 'MEDIA' | 'NORMAL',
            observacao: obs
        };
    });


    const estruturaSemanal: EstruturaSemanal[] = isIniciante ? [
        { dia: 'Segunda', treino: 'A', grupos: ['Peito', 'Ombros', 'Tríceps'], duracaoMinutos: 60 },
        { dia: 'Terça', treino: 'OFF', grupos: ['Descanso Ativo'], duracaoMinutos: 0 },
        { dia: 'Quarta', treino: 'B', grupos: ['Costas', 'Bíceps', 'Panturrilha'], duracaoMinutos: 60 },
        { dia: 'Quinta', treino: 'OFF', grupos: ['Descanso Ativo'], duracaoMinutos: 0 },
        { dia: 'Sexta', treino: 'C', grupos: ['Pernas', 'Panturrilha'], duracaoMinutos: 65 },
        { dia: 'Sábado', treino: 'OFF', grupos: ['Descanso'], duracaoMinutos: 0 },
    ] : isIntermediario ? [
        { dia: 'Segunda', treino: 'A', grupos: ['Peito', 'Tríceps'], duracaoMinutos: 60 },
        { dia: 'Terça', treino: 'B', grupos: ['Costas', 'Bíceps'], duracaoMinutos: 60 },
        { dia: 'Quarta', treino: 'OFF', grupos: ['Descanso Ativo'], duracaoMinutos: 0 },
        { dia: 'Quinta', treino: 'C', grupos: ['Ombros', 'Panturrilha'], duracaoMinutos: 60 },
        { dia: 'Sexta', treino: 'D', grupos: ['Pernas', 'Panturrilha'], duracaoMinutos: 65 },
        { dia: 'Sábado', treino: 'OFF', grupos: ['Descanso'], duracaoMinutos: 0 },
    ] : [
        { dia: 'Segunda', treino: 'A', grupos: ['Peito', 'Tríceps'], duracaoMinutos: 60 },
        { dia: 'Terça', treino: 'B', grupos: ['Costas', 'Bíceps'], duracaoMinutos: 60 },
        { dia: 'Quarta', treino: 'C', grupos: ['Ombros', 'Panturrilha'], duracaoMinutos: 65 },
        { dia: 'Quinta', treino: 'D', grupos: ['Pernas', 'Panturrilha'], duracaoMinutos: 70 },
        { dia: 'Sexta', treino: 'E', grupos: ['Braços', 'Panturrilha'], duracaoMinutos: 55 },
        { dia: 'Sábado', treino: 'OFF', grupos: ['Descanso'], duracaoMinutos: 0 },
    ];

    // 5. Treinos Detalhados — séries alinhadas com o Checkmate
    // Helpers para buscar volume e prioridade dinâmicos
    const getSeries = (grupoCheckmate: string): number => {
        return volumePorGrupo.find(v => v.grupo === grupoCheckmate)?.seriesPlano ?? 12;
    };
    const getIsPrio = (grupoCheckmate: string): boolean => {
        const p = volumePorGrupo.find(v => v.grupo === grupoCheckmate)?.prioridade;
        return p === 'ALTA' || p === 'MEDIA';
    };
    // Distribui séries proporcionalmente entre exercícios
    const distribuirSeries = (totalSeries: number, numExercicios: number): number[] => {
        const base = Math.floor(totalSeries / numExercicios);
        const resto = totalSeries % numExercicios;
        return Array.from({ length: numExercicios }, (_, i) => base + (i < resto ? 1 : 0));
    };

    // --- Peitoral ---
    const seriesPeito = getSeries('Peitoral');
    const dPeito = distribuirSeries(seriesPeito, 4);
    // --- Triceps (aparece no A e E) ---
    const seriesTotalTri = getSeries('Tríceps');
    const seriesTriA = Math.ceil(seriesTotalTri * 0.6); // 60% no treino principal
    const seriesTriE = seriesTotalTri - seriesTriA;     // 40% no treino de braços
    const dTriA = distribuirSeries(seriesTriA, 3);
    const dTriE = distribuirSeries(seriesTriE, 2);
    // --- Costas ---
    const seriesCostas = getSeries('Costas');
    const dCostas = distribuirSeries(seriesCostas, 4);
    // --- Bíceps (aparece no B e E) ---
    const seriesTotalBi = getSeries('Bíceps');
    const seriesBiB = Math.ceil(seriesTotalBi * 0.6);
    const seriesBiE = seriesTotalBi - seriesBiB;
    const dBiB = distribuirSeries(seriesBiB, 3);
    const dBiE = distribuirSeries(seriesBiE, 2);
    // --- Deltóide Lat. ---
    const seriesOmbros = getSeries('Deltóide Lat.');
    const dOmbros = distribuirSeries(seriesOmbros, 4);
    // --- Quadríceps ---
    const seriesQuad = getSeries('Quadríceps');
    const dQuad = distribuirSeries(seriesQuad, 4);
    // --- Posterior ---
    const seriesPost = getSeries('Posterior');
    const dPost = distribuirSeries(seriesPost, 3);
    // --- Panturrilha (aparece em C, D, E) ---
    const seriesTotalPant = getSeries('Panturrilha');
    const seriesPantC = Math.ceil(seriesTotalPant * 0.4);
    const seriesPantD = Math.ceil(seriesTotalPant * 0.35);
    const seriesPantE = seriesTotalPant - seriesPantC - seriesPantD;
    const dPantC = distribuirSeries(seriesPantC, 2);
    const dPantD = distribuirSeries(seriesPantD, 2);
    const dPantE = distribuirSeries(seriesPantE, 2);

    const treinos: TreinoDetalhado[] = [
        {
            id: 'treino-a',
            nome: 'Treino A - Peito e Tríceps',
            diaSemana: 'Segunda-feira',
            duracaoMinutos: 55 + Math.round(seriesPeito * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Peitoral',
                    seriesTotal: seriesPeito,
                    isPrioridade: getIsPrio('Peitoral'),
                    exercicios: [
                        { ordem: 1, nome: 'Supino Reto Barra', series: dPeito[0], repeticoes: '6-8', descansoSegundos: 120 },
                        { ordem: 2, nome: 'Supino Inclinado Halt.', series: dPeito[1], repeticoes: '8-10', descansoSegundos: 90 },
                        { ordem: 3, nome: 'Crucifixo Inclinado', series: dPeito[2], repeticoes: '10-12', descansoSegundos: 60 },
                        { ordem: 4, nome: 'Crossover', series: dPeito[3], repeticoes: '12-15', descansoSegundos: 60, tecnica: 'Drop-set na última' }
                    ]
                },
                {
                    nomeGrupo: 'Tríceps',
                    seriesTotal: seriesTriA,
                    isPrioridade: getIsPrio('Tríceps'),
                    exercicios: [
                        { ordem: 5, nome: 'Tríceps Pulley Corda', series: dTriA[0], repeticoes: '10-12', descansoSegundos: 60 },
                        { ordem: 6, nome: 'Tríceps Testa', series: dTriA[1], repeticoes: '10-12', descansoSegundos: 60 },
                        { ordem: 7, nome: 'Mergulho Banco', series: dTriA[2], repeticoes: 'AMRAP', descansoSegundos: 60 }
                    ]
                }
            ]
        },
        {
            id: 'treino-b',
            nome: 'Treino B - Costas e Bíceps',
            diaSemana: 'Terça-feira',
            duracaoMinutos: 55 + Math.round(seriesCostas * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Costas',
                    seriesTotal: seriesCostas,
                    isPrioridade: getIsPrio('Costas'),
                    exercicios: [
                        { ordem: 1, nome: 'Barra Fixa', series: dCostas[0], repeticoes: '6-8', descansoSegundos: 120 },
                        { ordem: 2, nome: 'Remada Curvada', series: dCostas[1], repeticoes: '8-10', descansoSegundos: 90 },
                        { ordem: 3, nome: 'Puxada Frontal', series: dCostas[2], repeticoes: '10-12', descansoSegundos: 60 },
                        { ordem: 4, nome: 'Remada Unilateral', series: dCostas[3], repeticoes: '10-12', descansoSegundos: 60 }
                    ]
                },
                {
                    nomeGrupo: 'Bíceps',
                    seriesTotal: seriesBiB,
                    isPrioridade: getIsPrio('Bíceps'),
                    exercicios: [
                        { ordem: 5, nome: 'Rosca Direta Barra', series: dBiB[0], repeticoes: '8-10', descansoSegundos: 60 },
                        { ordem: 6, nome: 'Rosca Inclinada H.', series: dBiB[1], repeticoes: '10-12', descansoSegundos: 60 },
                        { ordem: 7, nome: 'Rosca Martelo', series: dBiB[2], repeticoes: '10-12', descansoSegundos: 60 }
                    ]
                }
            ]
        },
        {
            id: 'treino-c',
            nome: 'Treino C - Ombros e Panturrilha',
            diaSemana: 'Quarta-feira',
            duracaoMinutos: 55 + Math.round(seriesOmbros * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Deltóide Lat.',
                    seriesTotal: seriesOmbros,
                    isPrioridade: getIsPrio('Deltóide Lat.'),
                    exercicios: [
                        { ordem: 1, nome: 'Desenvolvimento Halt.', series: dOmbros[0], repeticoes: '6-8', descansoSegundos: 120 },
                        { ordem: 2, nome: 'Elevação Lateral Halt.', series: dOmbros[1], repeticoes: '10-12', descansoSegundos: 60 },
                        { ordem: 3, nome: 'Elevação Lateral Cabo', series: dOmbros[2], repeticoes: '12-15', descansoSegundos: 45, tecnica: 'Drop-set' },
                        { ordem: 4, nome: 'Face Pull', series: dOmbros[3], repeticoes: '15-20', descansoSegundos: 45 }
                    ]
                },
                {
                    nomeGrupo: 'Panturrilha',
                    seriesTotal: seriesPantC,
                    isPrioridade: getIsPrio('Panturrilha'),
                    exercicios: [
                        { ordem: 5, nome: 'Panturrilha Sentado', series: dPantC[0], repeticoes: '12-15', descansoSegundos: 45, observacao: 'Pausa 2s no topo' },
                        { ordem: 6, nome: 'Panturrilha Em Pé', series: dPantC[1], repeticoes: '10-12', descansoSegundos: 45, observacao: 'Pausa 2s no topo' }
                    ]
                }
            ]
        },
        {
            id: 'treino-d',
            nome: 'Treino D - Pernas e Panturrilha',
            diaSemana: 'Quinta-feira',
            duracaoMinutos: 60 + Math.round(seriesQuad * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Quadríceps',
                    seriesTotal: seriesQuad,
                    isPrioridade: getIsPrio('Quadríceps'),
                    exercicios: [
                        { ordem: 1, nome: 'Agachamento Livre', series: dQuad[0], repeticoes: '6-8', descansoSegundos: 180 },
                        { ordem: 2, nome: 'Leg Press', series: dQuad[1], repeticoes: '10-12', descansoSegundos: 90 },
                        { ordem: 3, nome: 'Cadeira Extensora', series: dQuad[2], repeticoes: '12-15', descansoSegundos: 60 },
                        { ordem: 4, nome: 'Avanço', series: dQuad[3], repeticoes: '10-12', descansoSegundos: 60 }
                    ]
                },
                {
                    nomeGrupo: 'Posterior',
                    seriesTotal: seriesPost,
                    isPrioridade: getIsPrio('Posterior'),
                    exercicios: [
                        { ordem: 5, nome: 'Stiff', series: dPost[0], repeticoes: '8-10', descansoSegundos: 90 },
                        { ordem: 6, nome: 'Mesa Flexora', series: dPost[1], repeticoes: '10-12', descansoSegundos: 60 },
                        { ordem: 7, nome: 'Cadeira Flexora', series: dPost[2], repeticoes: '12-15', descansoSegundos: 60 }
                    ]
                },
                {
                    nomeGrupo: 'Panturrilha',
                    seriesTotal: seriesPantD,
                    isPrioridade: getIsPrio('Panturrilha'),
                    exercicios: [
                        { ordem: 8, nome: 'Panturrilha Leg Press', series: dPantD[0], repeticoes: '15-20', descansoSegundos: 30 },
                        { ordem: 9, nome: 'Panturrilha Unilateral', series: dPantD[1], repeticoes: '12-15', descansoSegundos: 30 }
                    ]
                }
            ]
        },
        {
            id: 'treino-e',
            nome: 'Treino E - Braços e Panturrilha',
            diaSemana: 'Sexta-feira',
            duracaoMinutos: 50 + Math.round((seriesBiE + seriesTriE) * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Bíceps',
                    seriesTotal: seriesBiE,
                    isPrioridade: getIsPrio('Bíceps'),
                    exercicios: [
                        { ordem: 1, nome: 'Rosca Barra W', series: dBiE[0], repeticoes: '8-10', descansoSegundos: 60 },
                        { ordem: 2, nome: 'Rosca Direta Unilat.', series: dBiE[1], repeticoes: '10-12', descansoSegundos: 45 }
                    ]
                },
                {
                    nomeGrupo: 'Tríceps',
                    seriesTotal: seriesTriE,
                    isPrioridade: getIsPrio('Tríceps'),
                    exercicios: [
                        { ordem: 3, nome: 'Tríceps Barra', series: dTriE[0], repeticoes: '8-10', descansoSegundos: 60 },
                        { ordem: 4, nome: 'Tríceps Corda', series: dTriE[1], repeticoes: '12-15', descansoSegundos: 45, tecnica: 'Drop-set' }
                    ]
                },
                {
                    nomeGrupo: 'Panturrilha',
                    seriesTotal: seriesPantE,
                    isPrioridade: getIsPrio('Panturrilha'),
                    exercicios: [
                        { ordem: 5, nome: 'Panturrilha Sentado', series: dPantE[0], repeticoes: '15-20', descansoSegundos: 30 },
                        { ordem: 6, nome: 'Panturrilha Em Pé', series: dPantE[1], repeticoes: '15-20', descansoSegundos: 30 }
                    ]
                }
            ]
        }
    ];

    // 6. Observações — inclui alertas do contexto (potencial.observacoesContexto)
    const alertasContexto = potencial.observacoesContexto;
    const observacoes: ObservacoesTreino = {
        resumo: `Plano ${labelNivel} desenhado com foco em ${diagnostico.prioridades.filter(p => p.nivel === 'ALTA').map(p => p.grupo).join(', ')}. Divisão ${tipoDivisao} (${freq}x/semana) calibrada para o seu nível e recuperação (fator: ${(potencial.fatorRecuperacao * 100).toFixed(0)}%).`,
        pontosAtencao: [
            'Respeitar a pausa de 2s no topo da panturrilha para máximo estímulo.',
            'Iniciar o treino sempre pelos grupos prioritários.',
            'Deload na semana 4 de cada mesociclo é obrigatório.',
            ...alertasContexto
        ],
        alinhamentoMetodologia: true,
        sugestaoForaMetodologia: potencial.fatorRecuperacao < 0.90
            ? `Recuperação reduzida detectada (${(potencial.fatorRecuperacao * 100).toFixed(0)}%). Priorize sono e nutrição pós-treino.`
            : undefined,
        mensagemFinal: `Vamos pra cima, ${nomeAtleta}! Este plano foi calibrado para o seu perfil de ${labelNivel} e vai te levar do score ${scoreAtual} para ${scoreT4}. Consistência é o segredo.`
    };

    return {
        id: `treino-${Date.now()}`,
        planoEvolucaoId: `evol-${Date.now()}`,
        atletaId,
        visaoAnual,
        trimestreAtual: {
            numero: 1,
            focoPrincipal: visaoAnual.trimestres[0].foco.join(' + '),
            mesociclos,
            volumePorGrupo
        },
        divisao: {
            tipo: tipoDivisao,
            frequenciaSemanal: freq,
            estruturaSemanal
        },
        treinos,
        observacoes,
        geradoEm: dataRef
    };
};
