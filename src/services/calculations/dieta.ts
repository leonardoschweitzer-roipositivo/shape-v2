/**
 * dieta.ts — Módulo de Cálculo do Plano de Dieta
 * 
 * Etapa 3 do Pipeline VITRÚVIO IA:
 * Potencial → Diagnóstico → Treino → Dieta
 *
 * Consome DiagnosticoDados + PotencialAtleta para gerar
 * um plano alimentar personalizado, determinístico e sem hardcode.
 */

import { type DiagnosticoDados } from './diagnostico';
import { type PotencialAtleta } from './potencial';
import { supabase } from '@/services/supabase';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type FaseDieta = 'CUTTING' | 'RECOMPOSICAO' | 'BULKING' | 'MANUTENCAO';

export interface MacroSet {
    proteina: { gramas: number; gKg: number; kcal: number; pct: number };
    carboidrato: { gramas: number; gKg: number; kcal: number; pct: number };
    gordura: { gramas: number; gKg: number; kcal: number; pct: number };
    total: number;
}

export interface RefeicaoEstrutura {
    numero: number;
    nome: string;
    emoji: string;
    horario: string;
    proteina: number;
    carboidrato: number;
    gordura: number;
    kcal: number;
    observacao?: string;
}

export interface CardapioOpcao {
    letra: string;
    itens: string[];
}

export interface CardapioRefeicao {
    nome: string;
    macros: string;          // Ex: "40P / 50C / 15G"
    opcoes: CardapioOpcao[];
}

export interface CheckpointSemana {
    semana: number | 'Início';
    label: string;
    pesoEsperado: number;
    tolerancia: number;
    acao: string;
}

export interface RegraAjuste {
    cenario: string;
    ajuste: string;
    tipo: 'ok' | 'warning' | 'danger';
}

export interface PlanoDieta {
    atletaId: string;
    nomeAtleta: string;
    frequenciaSemanal: number;      // campo conveniência para UI

    // Estratégia calórica
    fase: FaseDieta;
    faseLabel: string;
    tdee: number;
    deficit: number;          // positivo = déficit, negativo = superávit
    deficitPct: number;          // % do TDEE
    calDiasTreino: number;
    calDiasDescanso: number;
    calMediaSemanal: number;
    deficitSemanal: number;
    projecaoMensal: {
        perdaGorduraKg: number;
        pesoInicial: number;
        pesoFinal: number;
        bfInicial: number;
        bfFinal: number;
    };

    // Macros
    macrosTreino: MacroSet;
    macrosDescanso: MacroSet;
    justificativaMacros: {
        proteina: string;
        carboidrato: string;
        gordura: string;
    };

    // Refeições
    refeicoesTreino: RefeicaoEstrutura[];
    refeicoesDescanso: RefeicaoEstrutura[];
    refeicaoLivreOrientacoes: string[];

    // Cardápio
    cardapio: CardapioRefeicao[];
    alimentosSugeridos: {
        proteinas: string[];
        carboidratos: string[];
        gorduras: string[];
    };

    // Checkpoints
    checkpoints: CheckpointSemana[];
    comoPesar: { fazer: string[]; naoFazer: string[] };
    regrasAjuste: RegraAjuste[];
    outrosIndicadores: { indicador: string; frequencia: string; esperado: string }[];

    // Considerações finais
    estrategiaPrincipal: string;
    pontosAtencao: { titulo: string; descricao: string }[];
    contextoConsiderado: string[];
    proximosPassos: string[];
    mensagemFinal: string;
    observacoesContexto: string[];  // alertas do potencial

    geradoEm: string;
}

// ═══════════════════════════════════════════════════════════
// HELPERS INTERNOS
// ═══════════════════════════════════════════════════════════

function detectarFase(bfAtual: number, bfMeta: number, sexo: 'M' | 'F'): FaseDieta {
    const diff = bfAtual - bfMeta;
    if (diff > 3) return 'CUTTING';
    if (diff > -1) return 'RECOMPOSICAO';
    return 'BULKING';
}

function calcularDeficit(
    tdee: number,
    fase: FaseDieta,
    nivel: string,
    isGlp1: boolean,
    isAnabolizante: boolean,
    pesoAtual: number
): number {
    let pct: number;
    if (isGlp1) {
        // GLP-1 já suprime apetite — déficit conservador
        pct = fase === 'CUTTING' ? 0.12 : 0.10;
    } else if (isAnabolizante) {
        pct = fase === 'CUTTING' ? 0.20 : 0.15;
    } else if (nivel === 'INICIANTE') {
        pct = fase === 'CUTTING' ? 0.15 : 0.10;
    } else if (nivel === 'INTERMEDIÁRIO') {
        pct = fase === 'CUTTING' ? 0.20 : 0.15;
    } else {
        // AVANÇADO
        pct = fase === 'CUTTING' ? 0.25 : 0.20;
    }

    if (fase === 'BULKING') return -Math.round(tdee * 0.10); // superávit 10%
    if (fase === 'MANUTENCAO') return 0;

    const deficit = Math.round(tdee * pct);
    // Segurança: calorias mínimas = 22 kcal/kg
    const minCal = pesoAtual * 22;
    const calResult = tdee - deficit;
    return calResult < minCal ? Math.round(tdee - minCal) : deficit;
}

function calcularMacroSet(
    calorias: number,
    peso: number,
    protGKg: number,
    gordGKg: number
): MacroSet {
    const protG = Math.round(peso * protGKg);
    const protKcal = protG * 4;
    const gordG = Math.round(peso * gordGKg);
    const gordKcal = gordG * 9;
    const carbKcal = Math.max(0, calorias - protKcal - gordKcal);
    const carbG = Math.round(carbKcal / 4);
    const carbGKg = Math.round((carbG / peso) * 10) / 10;
    const total = protKcal + gordKcal + carbKcal;
    return {
        proteina: { gramas: protG, gKg: protGKg, kcal: protKcal, pct: Math.round(protKcal / total * 100) },
        carboidrato: { gramas: carbG, gKg: carbGKg, kcal: carbKcal, pct: Math.round(carbKcal / total * 100) },
        gordura: { gramas: gordG, gKg: gordGKg, kcal: gordKcal, pct: Math.round(gordKcal / total * 100) },
        total,
    };
}

function distribuirRefeicoesTreino(m: MacroSet): RefeicaoEstrutura[] {
    // Distribuição: Café 22% / Lanche Manhã 13% / Almoço 28% / Pré-Treino 15% / Pós-Treino 16% / Jantar 6%
    const pesos = [0.22, 0.13, 0.28, 0.15, 0.16, 0.06];
    const nomes = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Pré-Treino', 'Pós-Treino', 'Jantar'];
    const emojis = ['☀️', '🥪', '🍛', '⚡', '💪', '🌙'];
    const horarios = ['07:00', '10:00', '13:00', '16:00', '18:30', '20:30'];
    const obs = ['', '', '', '1h antes do treino', 'Até 1h após treino', 'Mais leve'];

    return pesos.map((p, i) => {
        const kcal = Math.round(m.total * p);
        // Pré e pós: menos gordura, mais carb; jantar: mais prot, menos carb
        const gordPct = i === 3 || i === 4 ? 0.08 : i === 5 ? 0.12 : 0.22;
        const gordG = Math.round((kcal * gordPct) / 9);
        const protG = Math.round((kcal * 0.33) / 4);
        const carbKcal = Math.max(0, kcal - protG * 4 - gordG * 9);
        const carbG = Math.round(carbKcal / 4);
        return {
            numero: i + 1, nome: nomes[i], emoji: emojis[i], horario: horarios[i],
            proteina: protG, carboidrato: carbG, gordura: gordG, kcal, observacao: obs[i] || undefined
        };
    });
}

function distribuirRefeicoesDescanso(m: MacroSet): RefeicaoEstrutura[] {
    const pesos = [0.22, 0.18, 0.28, 0.17, 0.15];
    const nomes = ['Café da Manhã', 'Lanche da Manhã', 'Almoço', 'Lanche da Tarde', 'Jantar'];
    const emojis = ['☀️', '🥪', '🍛', '🥗', '🌙'];
    const horarios = ['08:00', '11:00', '14:00', '17:00', '20:00'];

    return pesos.map((p, i) => {
        const kcal = Math.round(m.total * p);
        const gordG = Math.round((kcal * 0.22) / 9);
        const protG = Math.round((kcal * 0.36) / 4);
        const carbG = Math.round(Math.max(0, kcal - protG * 4 - gordG * 9) / 4);
        return {
            numero: i + 1, nome: nomes[i], emoji: emojis[i], horario: horarios[i],
            proteina: protG, carboidrato: carbG, gordura: gordG, kcal
        };
    });
}

// ═══════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function gerarPlanoDieta(
    atletaId: string,
    nomeAtleta: string,
    diagnostico: DiagnosticoDados,
    potencial: PotencialAtleta
): PlanoDieta {
    const { composicaoAtual, metasComposicao, taxas } = diagnostico;
    const tdee = taxas.tdee;
    const peso = composicaoAtual.peso;
    const bfAtual = composicaoAtual.gorduraPct;
    const bfMeta = metasComposicao.gorduraPctMeta;
    const nivel = potencial.nivel;
    const freq = potencial.frequenciaSemanal;

    // Detectar flags do contexto via observações
    const obsTexto = potencial.observacoesContexto.join(' ').toLowerCase();
    const isGlp1 = /glp-1|tirzepatida|semaglutida|ozempic/i.test(obsTexto);
    const isAnabolizante = /protocolo hormonal|anaboliz|trt/i.test(obsTexto);

    // 1. Fase
    const fase = detectarFase(bfAtual, bfMeta, 'M');
    const faseLabels: Record<FaseDieta, string> = {
        CUTTING: 'CUTTING — Perda de Gordura',
        RECOMPOSICAO: 'RECOMPOSIÇÃO CORPORAL',
        BULKING: 'BULKING — Ganho de Massa',
        MANUTENCAO: 'MANUTENÇÃO',
    };

    // 2. Déficit/Superávit
    const deficit = calcularDeficit(tdee, fase, nivel, isGlp1, isAnabolizante, peso);
    const deficitPct = Math.round((deficit / tdee) * 100);
    const calMedia = tdee - deficit;

    // Dias treino = mais carbs (+50 kcal por dia treino); dias descanso = menos carbs
    const diasTreino = freq;
    const diasDescanso = 7 - diasTreino;
    const offsetTreino = Math.round(diasDescanso * 50 / 7); // redistribuição
    const offsetDescanso = Math.round(diasTreino * 50 / 7);
    const calDiasTreino = calMedia + offsetTreino;
    const calDiasDescanso = calMedia - offsetDescanso;
    const calMediaSemanal = Math.round((calDiasTreino * diasTreino + calDiasDescanso * diasDescanso) / 7);
    const deficitSemanal = Math.round((tdee - calMediaSemanal) * 7);

    // 3. Macros
    const protGKg = isAnabolizante ? 2.2 : fase === 'CUTTING' ? 2.0 : 1.9;
    const gordGKg = 0.8;

    const macrosTreino = calcularMacroSet(calDiasTreino, peso, protGKg, gordGKg);
    const macrosDescanso = calcularMacroSet(calDiasDescanso, peso, protGKg, gordGKg);

    // 4. Projeção mensal
    const perdaGorduraKcal = deficitSemanal * 4;
    const perdaGorduraKg = Math.round((perdaGorduraKcal / 7700) * 10) / 10;
    const pesoFinal = Math.round((peso - perdaGorduraKg) * 10) / 10;
    const massaMagra = composicaoAtual.massaMagra;
    const bfFinal = Math.round(((peso - massaMagra - perdaGorduraKg) / pesoFinal) * 100 * 10) / 10;

    // 5. Refeições
    const refeicoesTreino = distribuirRefeicoesTreino(macrosTreino);
    const refeicoesDescanso = distribuirRefeicoesDescanso(macrosDescanso);

    // 6. Cardápio (genérico, baseado nos macros)
    const cardapio: CardapioRefeicao[] = [
        {
            nome: 'Café da Manhã',
            macros: `${refeicoesTreino[0].proteina}P / ${refeicoesTreino[0].carboidrato}C / ${refeicoesTreino[0].gordura}G`,
            opcoes: [
                { letra: 'A', itens: ['4 ovos inteiros mexidos', '2 fatias de pão integral', '1 banana média', 'Café sem açúcar'] },
                { letra: 'B', itens: ['150g de peito de frango', '80g de tapioca', '1 fruta média', '200ml de suco natural'] },
                { letra: 'C', itens: ['80g de aveia', '1 scoop whey (30g)', '1 banana', '20g de castanhas'] },
            ],
        },
        {
            nome: 'Almoço',
            macros: `${refeicoesTreino[2].proteina}P / ${refeicoesTreino[2].carboidrato}C / ${refeicoesTreino[2].gordura}G`,
            opcoes: [
                { letra: 'A', itens: ['180g de frango grelhado', '150g de arroz branco', '80g de feijão', 'Salada à vontade', '1 col. azeite'] },
                { letra: 'B', itens: ['180g de patinho moído', '150g de batata doce', '80g de feijão', 'Salada à vontade', '1 col. azeite'] },
                { letra: 'C', itens: ['200g de tilápia', '180g de arroz integral', 'Legumes refogados', '1 col. azeite'] },
            ],
        },
        {
            nome: 'Pré-Treino',
            macros: `${refeicoesTreino[3].proteina}P / ${refeicoesTreino[3].carboidrato}C / ${refeicoesTreino[3].gordura}G`,
            opcoes: [
                { letra: 'A', itens: ['1 scoop whey', '1 banana grande', '30g de aveia', 'Água'] },
                { letra: 'B', itens: ['150g de frango desfiado', '2 fatias pão integral', '1 fruta'] },
            ],
        },
        {
            nome: 'Pós-Treino',
            macros: `${refeicoesTreino[4].proteina}P / ${refeicoesTreino[4].carboidrato}C / ${refeicoesTreino[4].gordura}G`,
            opcoes: [
                { letra: 'A', itens: ['1 scoop whey', '2 bananas ou 60g maltodextrina', '200ml de água'] },
                { letra: 'B', itens: ['150g de frango grelhado', '150g de arroz branco', 'Pouco azeite'] },
            ],
        },
    ];

    // 7. Checkpoints
    const pesoSem1 = Math.round((peso - perdaGorduraKg * 0.25) * 10) / 10;
    const pesoSem2 = Math.round((peso - perdaGorduraKg * 0.50) * 10) / 10;
    const pesoSem3 = Math.round((peso - perdaGorduraKg * 0.75) * 10) / 10;

    const checkpoints: CheckpointSemana[] = [
        { semana: 'Início', label: 'Peso inicial', pesoEsperado: peso, tolerancia: 0, acao: 'Registrar peso base (média de 3 dias consecutivos)' },
        { semana: 1, label: 'Adaptação', pesoEsperado: pesoSem1, tolerancia: 0.3, acao: 'Pode haver retenção hídrica. Não ajustar ainda.' },
        { semana: 2, label: '1ª avaliação', pesoEsperado: pesoSem2, tolerancia: 0.2, acao: 'Verificar tendência. Ajustar se muito fora da curva.' },
        { semana: 3, label: 'Ajuste', pesoEsperado: pesoSem3, tolerancia: 0.2, acao: 'Aplicar regra de ajuste se necessário.' },
        { semana: 4, label: 'Fechamento', pesoEsperado: pesoFinal, tolerancia: 0.2, acao: 'Preparar próximo ciclo. Renovar plano de dieta.' },
    ];

    const regrasAjuste: RegraAjuste[] = [
        { cenario: 'Perda de 0.3–0.5 kg/semana (dentro do esperado)', ajuste: 'Manter tudo. Está funcionando! ✅', tipo: 'ok' },
        { cenario: 'Perda > 0.7 kg/semana (muito rápido)', ajuste: 'Aumentar 100 kcal (nos carboidratos dos dias de treino)', tipo: 'warning' },
        { cenario: 'Peso estagnado por 2+ semanas', ajuste: 'Reduzir 100 kcal OU adicionar 20min de cardio por dia', tipo: 'warning' },
        { cenario: 'Peso subindo', ajuste: 'Revisar aderência. Se ok, reduzir 150 kcal nos carbs.', tipo: 'danger' },
    ];

    // 8. Considerações
    const contextoConsiderado: string[] = [];
    if (isGlp1) contextoConsiderado.push('GLP-1 em uso → déficit conservador calculado; apetite naturalmente reduzido já auxilia o déficit');
    if (isAnabolizante) contextoConsiderado.push('Protocolo hormonal → proteína 2.2 g/kg para aproveitar maior síntese proteica');
    if (nivel === 'INICIANTE') contextoConsiderado.push('Atleta iniciante → déficit conservador para preservar performance e motivação na fase inicial');
    if (freq <= 3) contextoConsiderado.push(`Frequência de ${freq}x/semana → ciclagem de carbs suave para não faltar energia nos treinos`);
    if (freq >= 4) contextoConsiderado.push(`Frequência de ${freq}x/semana → dias de treino com carboidratos maiores para sustentar volume e recuperação`);
    potencial.observacoesContexto.filter(a => /profissão|obra|constru/i.test(a)).forEach(a =>
        contextoConsiderado.push(`${a} → carboidratos ajustados para cobrir alto NEAT além do treino`)
    );

    const pontosAtencao = [
        { titulo: 'CONSISTÊNCIA > PERFEIÇÃO', descricao: 'Seguir 80-90% do plano consistentemente > 100% por 3 dias e abandonar. Se errar, volte na próxima refeição.' },
        { titulo: 'HIDRATAÇÃO', descricao: 'Mínimo 3 litros de água/dia. Mais em dias de treino e calor. Ajuda no metabolismo e saciedade.' },
        { titulo: 'TIMING PÓS-TREINO', descricao: 'Janela pós-treino é real mas não mágica. Ideal: comer em até 2h. Priorizar proteína + carboidrato.' },
        { titulo: 'FLEXIBILIDADE COM CONTROLE', descricao: 'A refeição livre semanal é importante psicologicamente. Se o peso estagnar por 2+ semanas, avaliar reduzir para quinzenal.' },
    ];

    const mensagemFinal = `${nomeAtleta.split(' ')[0]}, seu plano completo está pronto! Com o déficit de ${deficit > 0 ? deficit : Math.abs(deficit)} kcal/dia e a ciclagem de carboidratos, a meta é perder ${perdaGorduraKg} kg de gordura neste mês, evoluindo de ${bfAtual}% para ~${bfFinal}% de BF. Com consistência, em 12 meses você estará na classificação ${diagnostico.analiseEstetica.scoreMeta12M >= 80 ? 'AVANÇADO' : 'ATLÉTICO'}. Vamos juntos nessa jornada!`;

    const estrategiaPrincipal = `Fase de ${faseLabels[fase]}: ${deficit > 0 ? `déficit de ${deficit} kcal (${deficitPct}% do TDEE)` : `superávit de ${Math.abs(deficit)} kcal`}, preservando massa magra com alto consumo proteico (${protGKg} g/kg) e ciclagem de carboidratos entre dias de treino e descanso.`;

    return {
        atletaId,
        nomeAtleta,
        frequenciaSemanal: freq,
        fase,
        faseLabel: faseLabels[fase],
        tdee,
        deficit,
        deficitPct,
        calDiasTreino,
        calDiasDescanso,
        calMediaSemanal,
        deficitSemanal,
        projecaoMensal: { perdaGorduraKg, pesoInicial: peso, pesoFinal, bfInicial: bfAtual, bfFinal },
        macrosTreino,
        macrosDescanso,
        justificativaMacros: {
            proteina: `${protGKg} g/kg (${macrosTreino.proteina.gramas}g) — ${isAnabolizante ? 'Alta para aproveitar síntese aumentada pelo protocolo hormonal.' : 'Alta para preservar massa magra em déficit calórico.'}`,
            carboidrato: `Ciclagem: ${macrosTreino.carboidrato.gKg} g/kg nos treinos / ${macrosDescanso.carboidrato.gKg} g/kg no descanso — para energia no treino e oxidação de gordura no descanso.`,
            gordura: `${gordGKg} g/kg (${macrosTreino.gordura.gramas}g) — mínimo saudável para suporte hormonal e absorção de vitaminas lipossolúveis.`,
        },
        refeicoesTreino,
        refeicoesDescanso,
        refeicaoLivreOrientacoes: [
            'Frequência: 1x por semana (preferencialmente sábado)',
            'Substituir UMA refeição — não o dia todo',
            'Comer até satisfação, não até passar mal',
            'Manter proteína adequada nas outras refeições do dia',
            'Não compensar com jejum no dia seguinte — faz parte do processo',
            perdaGorduraKg < 0.3 ? 'Atenção: peso estagnando — avaliar reduzir para quinzenal' : '',
        ].filter(Boolean),
        cardapio,
        alimentosSugeridos: {
            proteinas: ['Frango grelhado', 'Patinho moído', 'Tilápia', 'Atum', 'Ovos', 'Whey protein', 'Carne vermelha magra', 'Queijo cottage'],
            carboidratos: ['Arroz branco', 'Arroz integral', 'Batata doce', 'Batata inglesa', 'Aveia', 'Pão integral', 'Macarrão', 'Frutas', 'Tapioca'],
            gorduras: ['Azeite de oliva', 'Castanhas', 'Amendoim', 'Abacate', 'Gema de ovo', 'Pasta de amendoim', 'Salmão'],
        },
        checkpoints,
        comoPesar: {
            fazer: ['Pesar todos os dias pela manhã, após ir ao banheiro', 'Usar média de 7 dias — não o peso diário isolado', 'Sempre na mesma balança', 'Sem roupa ou sempre com a mesma'],
            naoFazer: ['Entrar em pânico com variação diária (normal até ±1 kg)', 'Pesar após refeição livre', 'Comparar peso pela manhã com peso à noite', 'Ajustar dieta baseado em apenas 1 dia'],
        },
        regrasAjuste,
        outrosIndicadores: [
            { indicador: 'Peso (média 7 dias)', frequencia: 'Semanal', esperado: '-0.3 a -0.5 kg/sem' },
            { indicador: 'Medida de cintura', frequencia: 'Quinzenal', esperado: 'Reduzindo gradualmente' },
            { indicador: 'Fotos comparativas', frequencia: 'Mensal', esperado: 'Mudança visual perceptível' },
            { indicador: 'Energia no treino', frequencia: 'Diário', esperado: 'Boa e estável' },
            { indicador: 'Fome', frequencia: 'Diário', esperado: 'Controlável (não insuportável)' },
            { indicador: 'Qualidade do sono', frequencia: 'Diário', esperado: '7-8h, acorda disposto' },
        ],
        estrategiaPrincipal,
        pontosAtencao,
        contextoConsiderado,
        proximosPassos: [
            'Iniciar execução na próxima segunda-feira',
            'Registrar peso diariamente pela manhã',
            'Dar feedback semanal ao personal para ajustes finos',
            'Nova avaliação de medidas em 30 dias',
            'Renovar plano de dieta mensalmente',
        ],
        mensagemFinal,
        observacoesContexto: potencial.observacoesContexto,
        geradoEm: new Date().toISOString(),
    };
}

// ═══════════════════════════════════════════════════════════
// PERSISTÊNCIA - SUPABASE
// ═══════════════════════════════════════════════════════════

/**
 * Salva plano de dieta no Supabase (tabela planos_dieta).
 * Cada chamada insere um novo registro (histórico) — nunca sobrescreve.
 */
export async function salvarPlanoDieta(
    atletaId: string,
    personalId: string | null,
    dados: PlanoDieta
): Promise<{ id: string } | null> {
    try {
        const safeDados = JSON.parse(JSON.stringify(dados,
            (_, v) => typeof v === 'number' && !isFinite(v) ? 0 : v
        ));

        const { data, error } = await supabase
            .from('planos_dieta')
            .insert({
                atleta_id: atletaId,
                personal_id: personalId,
                dados: safeDados,
                status: 'ativo',
            } as any)
            .select('id')
            .single();

        if (error) {
            console.error('[Dieta] Erro ao salvar:', error.message);
            return null;
        }
        return data as { id: string };
    } catch (err) {
        console.error('[Dieta] Exceção ao salvar:', err);
        return null;
    }
}

/**
 * Busca o último plano de dieta ativo de um atleta.
 */
export async function buscarPlanoDieta(atletaId: string): Promise<PlanoDieta | null> {
    try {
        const { data, error } = await supabase
            .from('planos_dieta')
            .select('dados')
            .eq('atleta_id', atletaId)
            .eq('status', 'ativo')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error || !data) return null;
        return data.dados as PlanoDieta;
    } catch {
        return null;
    }
}
