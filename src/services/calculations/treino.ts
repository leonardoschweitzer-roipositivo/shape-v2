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
import { supabase } from '@/services/supabase';
import { type ObjetivoVitruvio, getObjetivoMeta } from './objetivos';
import { gerarConteudoIA } from '@/services/vitruviusAI';
import { type PerfilAtletaIA, perfilParaTexto, treinoParaTexto, getFontesCientificas } from '@/services/vitruviusContext';
import { buildTreinoPrompt } from '@/services/vitruviusPrompts';

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
    letra: string;
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
    letra: string;
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
    objetivo: ObjetivoVitruvio;
    visaoAnual: VisaoAnual;
    trimestreAtual: TrimestreAtual;
    divisao: DivisaoTreino;
    treinos: TreinoDetalhado[];
    observacoes: ObservacoesTreino;
    insightsPorSecao?: {
        resumoDiagnostico?: string;
        observacoesResumo?: string;
    };
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
    potencial: PotencialAtleta,
    objetivo: ObjetivoVitruvio = 'RECOMP',
    contexto?: import('./potencial').ContextoAtleta
): PlanoTreino => {
    const dataRef = new Date().toISOString();

    // ═══════════════════════════════════════════════════════
    // G2 — RESTRIÇÕES FÍSICAS (dores_lesoes)
    // ═══════════════════════════════════════════════════════
    const lesaoTexto = (contexto?.dores_lesoes || '').toLowerCase();
    const temLesaoOmbro = /ombro|manguito|rotat[oó]r|impingement|burs[ie]te|manguito rotador/i.test(lesaoTexto);

    // ═══════════════════════════════════════════════════════
    // FATORES DO POTENCIAL — fonte única de verdade
    // ═══════════════════════════════════════════════════════
    const { nivel, fatorVolume, fatorPrioAlta, fatorPrioMedia, frequenciaSemanal, divisao: tipoDivisao } = potencial;
    const isIniciante = nivel === 'INICIANTE';
    const isIntermediario = nivel === 'INTERMEDIÁRIO';
    const labelNivel = nivel;
    const freq = frequenciaSemanal;

    // ═══════════════════════════════════════════════════════
    // CONFIG POR OBJETIVO — rep ranges, descanso, volume
    // ═══════════════════════════════════════════════════════
    const objetivoConfig = {
        BULK: { repComposto: '5-7', repIsolado: '8-10', repFinalizador: '10-12', descComposto: 120, descIsolado: 75, descFinalizador: 60, volMult: 1.05, splitFoco: 'Ganho de Massa' },
        CUT: { repComposto: '10-12', repIsolado: '12-15', repFinalizador: '15-20', descComposto: 75, descIsolado: 50, descFinalizador: 40, volMult: 0.90, splitFoco: 'Preservação Muscular' },
        RECOMP: { repComposto: '8-10', repIsolado: '10-12', repFinalizador: '12-15', descComposto: 90, descIsolado: 60, descFinalizador: 50, volMult: 1.00, splitFoco: 'Recomposição Corporal' },
        GOLDEN_RATIO: { repComposto: '8-10', repIsolado: '10-12', repFinalizador: '12-15', descComposto: 90, descIsolado: 60, descFinalizador: 50, volMult: 1.00, splitFoco: 'Proporções Áureas' },
        TRANSFORM: { repComposto: '8-10', repIsolado: '10-12', repFinalizador: '12-15', descComposto: 90, descIsolado: 60, descFinalizador: 50, volMult: 0.95, splitFoco: 'Transformação Completa' },
        MAINTAIN: { repComposto: '10-12', repIsolado: '12-15', repFinalizador: '15-20', descComposto: 75, descIsolado: 50, descFinalizador: 40, volMult: 0.75, splitFoco: 'Manutenção' },
    } as const;
    const cfg = objetivoConfig[objetivo];
    const metaObj = getObjetivoMeta(objetivo);

    // Multiplicar fatorVolume pelo multiplicador do objetivo
    const fatorVolumeEfetivo = fatorVolume * cfg.volMult;

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
                foco: [...priosAltas, cfg.splitFoco],
                volume: objetivo === 'MAINTAIN' ? 'BAIXO' : 'ALTO',
                scoreEsperado: scoreT1
            },
            {
                numero: 2,
                semanas: [13, 24],
                foco: ['Consolidação', ...(priosMedias.length > 0 ? priosMedias.slice(0, 2) : ['Novas Prioridades'])],
                volume: objetivo === 'MAINTAIN' ? 'BAIXO' : 'ALTO',
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

    // 2. Mesociclos — framing adaptado ao objetivo
    const mesocicloDesc = {
        BULK: ['Adaptação com foco em técnica pesada — aprendizado dos compostos multiarticulares com cargas progressivas.', 'Acumulação: pico de volume e carga. Aqui acontece o maior crescimento muscular — cada repet conta.', 'Intensificação: carga máxima, volume reduzido. O corpo consolida os ganhos e prepara o próximo ciclo.'],
        CUT: ['Adaptação: manutenção do estímulo com volume levemente reduzido — preservar massa é a prioridade.', 'Acumulação de volume moderado com descansos curtos para manter músculo e criar déficit calórico.', 'Intensificação: manter força máxima para sinalizar ao corpo que a massa magra deve ser preservada.'],
        RECOMP: ['Adaptação: volume e carga balanceados — estímulo suficiente para crescer e queimar gordura simultaneamente.', 'Acumulação mista: estimulo anabólico + gasto calórico. A recomposição acontece aqui gradualmente.', 'Intensificação: aumentar carga progressivamente consolidando força e perfil hormonal favorável.'],
        GOLDEN_RATIO: ['Adaptação focada em prioridades estéticas — técnica refinada nos grupos que mais impactam suas proporções.', 'Acumulação: volume extra nos grupos prioritários identificados no diagnóstico. Cada milímetro é ganho aqui.', 'Intensificação: esculpir e lapidar as proporções. Técnicas avançadas como drop-sets e rest-pause.'],
        TRANSFORM: ['Adaptação: base técnica sólida — o ponto de partida para uma transformação sustentável de 12 meses.', 'Acumulação: combina estímulo máximo com controle calórico. Fase de maior transformação visual.', 'Intensificação e pedágio: força + composição corporal. A transformação se consolida aqui.'],
        MAINTAIN: ['Manutenção ativa: volume mínimo efetivo para preservar força e massa muscular com praticidade.', 'Consolidação: treino inteligente que respeita a vida fora da academia sem perder o que foi conquistado.', 'Manutenção avançada: variedade de estímulo para evitar adaptação e manter o shape.'],
    } as const;
    const descMeso = mesocicloDesc[objetivo];

    const mesociclos: Mesociclo[] = isIniciante ? [
        { numero: 1, nome: 'Adaptação', descricao: descMeso[0], semanas: [1, 4], volumeRelativo: 65, intensidadeRelativa: 55, rpeAlvo: [5, 6] },
        { numero: 2, nome: 'Progressão', descricao: descMeso[1], semanas: [5, 8], volumeRelativo: 80, intensidadeRelativa: 65, rpeAlvo: [6, 7] },
        { numero: 3, nome: 'Consolidação', descricao: descMeso[2], semanas: [9, 12], volumeRelativo: 90, intensidadeRelativa: 75, rpeAlvo: [7, 8] }
    ] as Mesociclo[] : isIntermediario ? [
        { numero: 1, nome: 'Adaptação', descricao: descMeso[0], semanas: [1, 4], volumeRelativo: 75, intensidadeRelativa: 65, rpeAlvo: [6, 7] },
        { numero: 2, nome: 'Acumulação', descricao: descMeso[1], semanas: [5, 8], volumeRelativo: 100, intensidadeRelativa: 78, rpeAlvo: [7, 8] },
        { numero: 3, nome: 'Intensificação', descricao: descMeso[2], semanas: [9, 12], volumeRelativo: 88, intensidadeRelativa: 88, rpeAlvo: [8, 9] }
    ] as Mesociclo[] : [
        { numero: 1, nome: 'Adaptação', descricao: descMeso[0], semanas: [1, 4], volumeRelativo: 80, intensidadeRelativa: 70, rpeAlvo: [6, 7] },
        { numero: 2, nome: 'Acumulação', descricao: descMeso[1], semanas: [5, 8], volumeRelativo: 100, intensidadeRelativa: 80, rpeAlvo: [7, 8] },
        { numero: 3, nome: 'Intensificação', descricao: descMeso[2], semanas: [9, 12], volumeRelativo: 90, intensidadeRelativa: 90, rpeAlvo: [8, 9] }
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

    // Bases de séries escaladas pelo nível E pelo objetivo
    const gruposBase = [
        { grupo: 'Peitoral', base: Math.round(14 * fatorVolumeEfetivo) },
        { grupo: 'Costas', base: Math.round(16 * fatorVolumeEfetivo) },
        { grupo: 'Deltóide Lat.', base: Math.round(12 * fatorVolumeEfetivo) },
        { grupo: 'Quadríceps', base: Math.round(14 * fatorVolumeEfetivo) },
        { grupo: 'Posterior', base: Math.round(12 * fatorVolumeEfetivo) },
        { grupo: 'Bíceps', base: Math.round(10 * fatorVolumeEfetivo) },
        { grupo: 'Tríceps', base: Math.round(10 * fatorVolumeEfetivo) },
        { grupo: 'Panturrilha', base: Math.round(10 * fatorVolumeEfetivo) }
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
        { letra: 'A', grupos: ['Peito', 'Ombros', 'Tríceps'], duracaoMinutos: 60 },
        { letra: 'B', grupos: ['Costas', 'Bíceps', 'Panturrilha'], duracaoMinutos: 60 },
        { letra: 'C', grupos: ['Pernas', 'Panturrilha'], duracaoMinutos: 65 },
    ] : isIntermediario ? [
        { letra: 'A', grupos: ['Peito', 'Tríceps'], duracaoMinutos: 60 },
        { letra: 'B', grupos: ['Costas', 'Bíceps'], duracaoMinutos: 60 },
        { letra: 'C', grupos: ['Ombros', 'Panturrilha'], duracaoMinutos: 60 },
        { letra: 'D', grupos: ['Pernas', 'Panturrilha'], duracaoMinutos: 65 },
    ] : [
        { letra: 'A', grupos: ['Peito', 'Tríceps'], duracaoMinutos: 60 },
        { letra: 'B', grupos: ['Costas', 'Bíceps'], duracaoMinutos: 60 },
        { letra: 'C', grupos: ['Ombros', 'Panturrilha'], duracaoMinutos: 65 },
        { letra: 'D', grupos: ['Pernas', 'Panturrilha'], duracaoMinutos: 70 },
        { letra: 'E', grupos: ['Braços', 'Panturrilha'], duracaoMinutos: 55 },
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

    // Rep ranges e descanso variam pelo objetivo
    const rC = cfg.repComposto;
    const rI = cfg.repIsolado;
    const rF = cfg.repFinalizador;
    const dC = cfg.descComposto;
    const dI = cfg.descIsolado;
    const dF = cfg.descFinalizador;

    const treinos: TreinoDetalhado[] = [
        {
            id: 'treino-a',
            nome: 'Treino A - Peito e Tríceps',
            letra: 'A',
            duracaoMinutos: 55 + Math.round(seriesPeito * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Peitoral',
                    seriesTotal: seriesPeito,
                    isPrioridade: getIsPrio('Peitoral'),
                    exercicios: [
                        { ordem: 1, nome: 'Supino Reto Barra', series: dPeito[0], repeticoes: rC, descansoSegundos: dC },
                        { ordem: 2, nome: 'Supino Inclinado Halt.', series: dPeito[1], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 3, nome: 'Crucifixo Inclinado', series: dPeito[2], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 4, nome: 'Crossover', series: dPeito[3], repeticoes: rF, descansoSegundos: dF, tecnica: 'Drop-set na última' }
                    ]
                },
                {
                    nomeGrupo: 'Tríceps',
                    seriesTotal: seriesTriA,
                    isPrioridade: getIsPrio('Tríceps'),
                    exercicios: [
                        { ordem: 5, nome: 'Tríceps Pulley Corda', series: dTriA[0], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 6, nome: 'Tríceps Testa', series: dTriA[1], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 7, nome: 'Mergulho Banco', series: dTriA[2], repeticoes: 'AMRAP', descansoSegundos: dF }
                    ]
                }
            ]
        },
        {
            id: 'treino-b',
            nome: 'Treino B - Costas e Bíceps',
            letra: 'B',
            duracaoMinutos: 55 + Math.round(seriesCostas * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Costas',
                    seriesTotal: seriesCostas,
                    isPrioridade: getIsPrio('Costas'),
                    exercicios: [
                        { ordem: 1, nome: 'Barra Fixa', series: dCostas[0], repeticoes: rC, descansoSegundos: dC },
                        { ordem: 2, nome: 'Remada Curvada', series: dCostas[1], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 3, nome: 'Puxada Frontal', series: dCostas[2], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 4, nome: 'Remada Unilateral', series: dCostas[3], repeticoes: rI, descansoSegundos: dF }
                    ]
                },
                {
                    nomeGrupo: 'Bíceps',
                    seriesTotal: seriesBiB,
                    isPrioridade: getIsPrio('Bíceps'),
                    exercicios: [
                        { ordem: 5, nome: 'Rosca Direta Barra', series: dBiB[0], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 6, nome: 'Rosca Inclinada H.', series: dBiB[1], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 7, nome: 'Rosca Martelo', series: dBiB[2], repeticoes: rF, descansoSegundos: dF }
                    ]
                }
            ]
        },
        {
            id: 'treino-c',
            nome: 'Treino C - Ombros e Panturrilha',
            letra: 'C',
            duracaoMinutos: 55 + Math.round(seriesOmbros * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Deltóide Lat.',
                    seriesTotal: seriesOmbros,
                    isPrioridade: getIsPrio('Deltóide Lat.'),
                    exercicios: temLesaoOmbro ? [
                        { ordem: 1, nome: 'Desenvolvimento Neutro Halt.', series: dOmbros[0], repeticoes: rC, descansoSegundos: dC, observacao: 'Substituído por neutro (restrição de ombro/manguito)' },
                        { ordem: 2, nome: 'Elevação Lateral Cabo (unilateral)', series: dOmbros[1], repeticoes: rI, descansoSegundos: dI, observacao: 'Cabo reduz impacto articular — amplitude controlada' },
                        { ordem: 3, nome: 'Face Pull com corda', series: dOmbros[2], repeticoes: rF, descansoSegundos: dF, observacao: 'Fortalece manguito rotador — fundamental na reabilitação' },
                        { ordem: 4, nome: 'Abdução Cabo (baixo para cima)', series: dOmbros[3], repeticoes: rF, descansoSegundos: dF, observacao: 'Isola deltóide lateral sem risco de impingement' }
                    ] : [
                        { ordem: 1, nome: 'Desenvolvimento Halt.', series: dOmbros[0], repeticoes: rC, descansoSegundos: dC },
                        { ordem: 2, nome: 'Elevação Lateral Halt.', series: dOmbros[1], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 3, nome: 'Elevação Lateral Cabo', series: dOmbros[2], repeticoes: rF, descansoSegundos: dF, tecnica: 'Drop-set' },
                        { ordem: 4, nome: 'Face Pull', series: dOmbros[3], repeticoes: rF, descansoSegundos: dF }
                    ]
                },
                {
                    nomeGrupo: 'Panturrilha',
                    seriesTotal: seriesPantC,
                    isPrioridade: getIsPrio('Panturrilha'),
                    exercicios: [
                        { ordem: 5, nome: 'Panturrilha Sentado', series: dPantC[0], repeticoes: rF, descansoSegundos: dF, observacao: 'Pausa 2s no topo' },
                        { ordem: 6, nome: 'Panturrilha Em Pé', series: dPantC[1], repeticoes: rI, descansoSegundos: dF, observacao: 'Pausa 2s no topo' }
                    ]
                }
            ]
        },
        {
            id: 'treino-d',
            nome: 'Treino D - Pernas e Panturrilha',
            letra: 'D',
            duracaoMinutos: 60 + Math.round(seriesQuad * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Quadríceps',
                    seriesTotal: seriesQuad,
                    isPrioridade: getIsPrio('Quadríceps'),
                    exercicios: [
                        { ordem: 1, nome: 'Agachamento Livre', series: dQuad[0], repeticoes: rC, descansoSegundos: 180 },
                        { ordem: 2, nome: 'Leg Press', series: dQuad[1], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 3, nome: 'Cadeira Extensora', series: dQuad[2], repeticoes: rF, descansoSegundos: dI },
                        { ordem: 4, nome: 'Avanço', series: dQuad[3], repeticoes: rI, descansoSegundos: dF }
                    ]
                },
                {
                    nomeGrupo: 'Posterior',
                    seriesTotal: seriesPost,
                    isPrioridade: getIsPrio('Posterior'),
                    exercicios: [
                        { ordem: 5, nome: 'Stiff', series: dPost[0], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 6, nome: 'Mesa Flexora', series: dPost[1], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 7, nome: 'Cadeira Flexora', series: dPost[2], repeticoes: rF, descansoSegundos: dF }
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
            letra: 'E',
            duracaoMinutos: 50 + Math.round((seriesBiE + seriesTriE) * 0.5),
            blocos: [
                {
                    nomeGrupo: 'Bíceps',
                    seriesTotal: seriesBiE,
                    isPrioridade: getIsPrio('Bíceps'),
                    exercicios: [
                        { ordem: 1, nome: 'Rosca Barra W', series: dBiE[0], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 2, nome: 'Rosca Direta Unilat.', series: dBiE[1], repeticoes: rF, descansoSegundos: dF }
                    ]
                },
                {
                    nomeGrupo: 'Tríceps',
                    seriesTotal: seriesTriE,
                    isPrioridade: getIsPrio('Tríceps'),
                    exercicios: [
                        { ordem: 3, nome: 'Tríceps Barra', series: dTriE[0], repeticoes: rI, descansoSegundos: dI },
                        { ordem: 4, nome: 'Tríceps Corda', series: dTriE[1], repeticoes: rF, descansoSegundos: dF, tecnica: 'Drop-set' }
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

    // 6. Observações — alinhadas com o objetivo
    const alertasContexto = potencial.observacoesContexto;
    const observacoes: ObservacoesTreino = {
        resumo: `Plano ${metaObj.emoji} ${metaObj.label} — ${labelNivel} — foco em ${cfg.splitFoco}. ${diagnostico.prioridades.filter(p => p.nivel === 'ALTA').length > 0 ? `Prioridades: ${diagnostico.prioridades.filter(p => p.nivel === 'ALTA').map(p => p.grupo).join(', ')}.` : ''} Divisão ${tipoDivisao} (${freq}x/sem), rep range ${cfg.repComposto}→${cfg.repFinalizador}, descanso ${cfg.descComposto}→${cfg.descFinalizador}s.${temLesaoOmbro ? ' ⚠️ Treino C adaptado: exercícios de ombro substituídos por variações seguras para manguito rotador.' : ''}`,
        pontosAtencao: [
            objetivo === 'BULK' ? 'BULK: priorize carga progressiva e descanso completo — o crescimento acontece na recuperação.' :
                objetivo === 'CUT' ? 'CUT: mantenha a intensidade alta mesmo em déficit — o treino pesado sinaliza ao corpo para preservar músculo.' :
                    objetivo === 'RECOMP' ? 'RECOMP: equilíbrio entre carga e volume — não economize no esforço, mas respeite a recuperação.' :
                        objetivo === 'GOLDEN_RATIO' ? 'GOLDEN RATIO: grupos prioritários do diagnóstico recebem volume extra — consistência nas proporções cria o shape.' :
                            objetivo === 'MAINTAIN' ? 'MAINTAIN: volume mínimo efetivo — menos é mais, mas a intensidade não pode cair.' :
                                'TRANSFORM: cada fase tem um propósito — respeite a periodização para a transformação ser completa.',
            'Respeitar a pausa de 2s no topo da panturrilha para máximo estímulo.',
            'Iniciar o treino sempre pelos grupos prioritários.',
            'Deload na semana 4 de cada mesociclo é obrigatório.',
            ...(temLesaoOmbro ? ['⚠️ RESTRIÇÃO DE OMBRO/MANGUITO: Evitar press militar pronado e elevações frontais. Treino C adaptado com variações neutras e de cabo. Aumentar progressão de carga gradualmente e interromper se houver dor aguda.'] : []),
            ...alertasContexto
        ],
        alinhamentoMetodologia: true,
        sugestaoForaMetodologia: potencial.fatorRecuperacao < 0.90
            ? `Recuperação reduzida detectada (${(potencial.fatorRecuperacao * 100).toFixed(0)}%). Priorize sono e nutrição pós-treino.`
            : undefined,
        mensagemFinal: `${metaObj.mensagemInicio} Este plano foi calibrado para o seu perfil de ${labelNivel} com objetivo ${metaObj.label} — do score ${scoreAtual} para ${scoreT4} em 12 meses.`
    };

    return {
        id: `treino-${Date.now()}`,
        planoEvolucaoId: `evol-${Date.now()}`,
        atletaId,
        objetivo,
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

/**
 * Enriquece o plano de treino com IA (Gemini).
 * Substitui exercícios hardcoded, técnicas e observações por geração personalizada.
 * Fallback: mantém os exercícios atuais se IA falhar.
 */
export async function enriquecerTreinoComIA(
    plano: PlanoTreino,
    perfil: PerfilAtletaIA,
    diretrizesAdicionais?: string
): Promise<PlanoTreino> {
    try {
        const perfilTexto = perfilParaTexto(perfil);
        const dadosTexto = treinoParaTexto(plano);
        const fontesTexto = getFontesCientificas('treino');

        const prompt = buildTreinoPrompt(perfilTexto, dadosTexto, fontesTexto, diretrizesAdicionais);
        const resultado = await gerarConteudoIA<{
            exerciciosPorBloco: Record<string, Array<{
                blocoGrupo: string;
                exercicios: Array<{
                    ordem: number;
                    nome: string;
                    series: number;
                    repeticoes: string;
                    descansoSegundos: number;
                    tecnica?: string;
                    observacao?: string;
                }>;
            }>>;
            observacoes: {
                resumo: string;
                pontosAtencao: string[];
                mensagemFinal: string;
            };
            descricoesMesociclos: string[];
            insightsPorSecao?: {
                resumoDiagnostico?: string;
                observacoesResumo?: string;
            };
        }>(prompt);

        if (resultado) {
            const planoEnriquecido = { ...plano };

            // Atualizar exercícios se a IA retornou
            if (resultado.exerciciosPorBloco) {
                for (const treino of planoEnriquecido.treinos) {
                    const blocoIA = resultado.exerciciosPorBloco[treino.id];
                    if (blocoIA && blocoIA.length > 0) {
                        treino.blocos = blocoIA.map(bIA => {
                            const original = treino.blocos.find(b => b.nomeGrupo === bIA.blocoGrupo);
                            const exerciciosValidos = bIA.exercicios || [];
                            return {
                                nomeGrupo: bIA.blocoGrupo,
                                isPrioridade: original?.isPrioridade || false,
                                seriesTotal: exerciciosValidos.reduce((acc, ex) => acc + ex.series, 0),
                                exercicios: exerciciosValidos
                            };
                        }).filter(b => b.exercicios.length > 0);
                    }
                }
            }

            // Atualizar observações
            if (resultado.observacoes) {
                planoEnriquecido.observacoes = {
                    ...planoEnriquecido.observacoes,
                    resumo: resultado.observacoes.resumo || planoEnriquecido.observacoes.resumo,
                    pontosAtencao: resultado.observacoes.pontosAtencao?.length
                        ? resultado.observacoes.pontosAtencao
                        : planoEnriquecido.observacoes.pontosAtencao,
                    mensagemFinal: resultado.observacoes.mensagemFinal || planoEnriquecido.observacoes.mensagemFinal,
                };
            }

            // Atualizar descrições dos mesociclos
            if (resultado.descricoesMesociclos?.length === 3) {
                for (let i = 0; i < 3; i++) {
                    if (planoEnriquecido.trimestreAtual.mesociclos[i]) {
                        planoEnriquecido.trimestreAtual.mesociclos[i].descricao =
                            resultado.descricoesMesociclos[i];
                    }
                }
            }

            // Atualizar insights por seção
            if (resultado.insightsPorSecao) {
                planoEnriquecido.insightsPorSecao = resultado.insightsPorSecao;
            }

            return planoEnriquecido;
        }
    } catch (error) {
        console.error('[Treino] Erro ao enriquecer com IA:', error);
    }

    return plano;
}

// ═══════════════════════════════════════════════════════════
// PERSISTÊNCIA - SUPABASE
// ═══════════════════════════════════════════════════════════

/**
 * Salva plano de treino no Supabase (tabela planos_treino).
 * Cada chamada insere um novo registro (histórico) — nunca sobrescreve.
 */
export async function salvarPlanoTreino(
    atletaId: string,
    personalId: string | null,
    dados: PlanoTreino,
    diagnosticoId?: string
): Promise<{ id: string } | null> {
    try {
        const safeDados = JSON.parse(JSON.stringify(dados,
            (_, v) => typeof v === 'number' && !isFinite(v) ? 0 : v
        ));

        const { data, error } = await supabase
            .from('planos_treino')
            .insert({
                atleta_id: atletaId,
                personal_id: personalId,
                diagnostico_id: diagnosticoId ?? null,
                dados: safeDados,
                status: 'ativo',
            } as any)
            .select('id')
            .single();

        if (error) {
            console.error('[Treino] Erro ao salvar:', error.message);
            return null;
        }
        return data as { id: string };
    } catch (err) {
        console.error('[Treino] Exceção ao salvar:', err);
        return null;
    }
}

/**
 * Busca o último plano de treino ativo de um atleta.
 */
export async function buscarPlanoTreino(atletaId: string): Promise<PlanoTreino | null> {
    try {
        const { data, error } = await supabase
            .from('planos_treino')
            .select('dados')
            .eq('atleta_id', atletaId)
            .eq('status', 'ativo')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) return null;
        return data.dados as PlanoTreino;
    } catch {
        return null;
    }
}
