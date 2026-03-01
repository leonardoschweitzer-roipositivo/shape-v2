/**
 * Vitruvius Context Builder
 *
 * Monta o payload de contexto completo do atleta para enviar ao Gemini.
 * Inclui: dados básicos, medidas, contexto, avaliação, dados calculados, fontes científicas.
 */

import { type ContextoAtleta } from './calculations/potencial';
import { type DiagnosticoDados } from './calculations/diagnostico';
import { type PlanoTreino } from './calculations/treino';
import { type PlanoDieta } from './calculations/dieta';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface PerfilAtletaIA {
    nome: string;
    sexo: 'M' | 'F';
    idade: number;
    altura: number;
    peso: number;
    gorduraPct: number;
    score: number;
    classificacao: string;
    medidas: Record<string, number>;
    contexto?: ContextoAtleta;
}

// ═══════════════════════════════════════════════════════════
// PERFIL DO ATLETA → TEXTO
// ═══════════════════════════════════════════════════════════

/**
 * Converte o perfil do atleta para texto formatado (consumido pelo prompt).
 */
export function perfilParaTexto(perfil: PerfilAtletaIA): string {
    const linhas: string[] = [
        `Nome: ${perfil.nome}`,
        `Sexo: ${perfil.sexo === 'M' ? 'Masculino' : 'Feminino'}`,
        `Idade: ${perfil.idade} anos`,
        `Altura: ${perfil.altura} cm`,
        `Peso: ${perfil.peso} kg`,
        `Gordura Corporal: ${perfil.gorduraPct}%`,
        `Score Vitrúvio: ${perfil.score}/100`,
        `Classificação: ${perfil.classificacao}`,
    ];

    // Medidas
    linhas.push('', '### Medidas Corporais');
    for (const [key, val] of Object.entries(perfil.medidas)) {
        if (val && val > 0) {
            linhas.push(`- ${key}: ${val} cm`);
        }
    }

    // Contexto
    if (perfil.contexto) {
        linhas.push('', '### Contexto do Atleta');
        if (perfil.contexto.problemas_saude) linhas.push(`- Problemas de saúde: ${perfil.contexto.problemas_saude}`);
        if (perfil.contexto.medicacoes) linhas.push(`- Medicações em uso: ${perfil.contexto.medicacoes}`);
        if (perfil.contexto.dores_lesoes) linhas.push(`- Dores/Lesões: ${perfil.contexto.dores_lesoes}`);
        if (perfil.contexto.exames) linhas.push(`- Exames recentes: ${perfil.contexto.exames}`);
        if (perfil.contexto.estilo_vida) linhas.push(`- Estilo de vida: ${perfil.contexto.estilo_vida}`);
        if (perfil.contexto.profissao) linhas.push(`- Profissão: ${perfil.contexto.profissao}`);
        if (perfil.contexto.historico_treino) linhas.push(`- Histórico de treino: ${perfil.contexto.historico_treino}`);
        if (perfil.contexto.historico_dietas) linhas.push(`- Histórico de dietas: ${perfil.contexto.historico_dietas}`);
    }

    return linhas.join('\n');
}

// ═══════════════════════════════════════════════════════════
// DADOS CALCULADOS → TEXTO
// ═══════════════════════════════════════════════════════════

/**
 * Converte dados do diagnóstico para texto (consumido pelo prompt).
 */
export function diagnosticoParaTexto(diag: DiagnosticoDados): string {
    const linhas: string[] = [
        '### Taxas Metabólicas',
        `- TMB: ${diag.taxas.tmb} kcal/dia`,
        `- TMB Ajustada: ${diag.taxas.tmbAjustada} kcal/dia`,
        `- NEAT: ${diag.taxas.neat} kcal/dia`,
        `- EAT: ${diag.taxas.eat} kcal/dia`,
        `- TDEE: ${diag.taxas.tdee} kcal/dia`,
        '',
        '### Composição Corporal Atual',
        `- Peso: ${diag.composicaoAtual.peso} kg`,
        `- Gordura: ${diag.composicaoAtual.gorduraPct}%`,
        `- Massa Magra: ${diag.composicaoAtual.massaMagra} kg`,
        `- Massa Gorda: ${diag.composicaoAtual.massaGorda} kg`,
        '',
        '### Metas de Composição (12 meses)',
        `- Peso Meta 12M: ${diag.metasComposicao.peso12Meses} kg`,
        `- Gordura Meta 12M: ${diag.metasComposicao.gordura12Meses}%`,
        '',
        '### Análise Estética',
        `- Score Atual: ${diag.analiseEstetica.scoreAtual}`,
        `- Classificação: ${diag.analiseEstetica.classificacaoAtual}`,
        `- Score Meta 6M: ${diag.analiseEstetica.scoreMeta6M}`,
        `- Score Meta 12M: ${diag.analiseEstetica.scoreMeta12M}`,
        '',
        '### Proporções',
        ...diag.analiseEstetica.proporcoes.map(p =>
            `- ${p.grupo}: ${p.atual} / ${p.ideal} (${p.pct}% → ${p.status})`
        ),
        '',
        '### Prioridades',
        ...diag.prioridades.map(p =>
            `- ${p.grupo}: ${p.nivel} (${p.pctAtual}%)`
        ),
    ];
    return linhas.join('\n');
}

/**
 * Converte dados do treino para texto (consumido pelo prompt).
 */
export function treinoParaTexto(treino: PlanoTreino): string {
    const linhas: string[] = [
        `### Divisão: ${treino.divisao.tipo} (${treino.divisao.frequenciaSemanal}x/semana)`,
        '',
        '### Volume por Grupo',
        ...treino.trimestreAtual.volumePorGrupo.map(v =>
            `- ${v.grupo}: ${v.seriesPlano} séries/semana (${v.prioridade})`
        ),
        '',
        '### Treinos',
        ...treino.treinos.map(t => {
            const blocos = t.blocos.map(b =>
                `  ${b.nomeGrupo}: ${b.seriesTotal} séries (${b.isPrioridade ? 'PRIORIDADE' : 'normal'})`
            ).join('\n');
            return `Treino ${(t as any).letra || t.id}:\n${blocos}`;
        }),
    ];
    return linhas.join('\n');
}

/**
 * Converte dados da dieta para texto (consumido pelo prompt).
 */
export function dietaParaTexto(dieta: PlanoDieta): string {
    const linhas: string[] = [
        `### Fase: ${dieta.faseLabel}`,
        `- TDEE: ${dieta.tdee} kcal`,
        `- Déficit: ${dieta.deficit} kcal (${dieta.deficitPct}%)`,
        `- Calorias dia treino: ${dieta.calDiasTreino} kcal`,
        `- Calorias dia descanso: ${dieta.calDiasDescanso} kcal`,
        '',
        '### Macros (Treino)',
        `- Proteína: ${dieta.macrosTreino.proteina.gramas}g (${dieta.macrosTreino.proteina.gKg}g/kg)`,
        `- Carboidrato: ${dieta.macrosTreino.carboidrato.gramas}g (${dieta.macrosTreino.carboidrato.gKg}g/kg)`,
        `- Gordura: ${dieta.macrosTreino.gordura.gramas}g (${dieta.macrosTreino.gordura.gKg}g/kg)`,
        '',
        '### Macros (Descanso)',
        `- Proteína: ${dieta.macrosDescanso.proteina.gramas}g`,
        `- Carboidrato: ${dieta.macrosDescanso.carboidrato.gramas}g`,
        `- Gordura: ${dieta.macrosDescanso.gordura.gramas}g`,
        '',
        '### Estrutura de Refeições (Treino)',
        ...dieta.refeicoesTreino.map(r =>
            `- ${r.emoji} ${r.nome} (${r.horario}): P${r.proteina}g C${r.carboidrato}g G${r.gordura}g = ${r.kcal}kcal`
        ),
    ];
    return linhas.join('\n');
}

// ═══════════════════════════════════════════════════════════
// FONTES CIENTÍFICAS
// ═══════════════════════════════════════════════════════════

/**
 * Resumos pré-compilados das fontes científicas mais relevantes por processo.
 * Esses resumos são enviados ao Gemini para embasar suas análises.
 * 
 * Os resumos são estáticos (hardcoded) para evitar leitura de arquivos em runtime.
 * Baseados nos 15 arquivos de docs/specs/fontes-cientificas/.
 */
const FONTES_POR_PROCESSO: Record<string, string> = {
    diagnostico: `
**Metabolismo (Mifflin-St Jeor, 1990)**: TMB = (10×peso) + (6.25×altura) − (5×idade) + 5 (♂) ou −161 (♀). Precisão ±10% para não-obesos.
**Composição Corporal**: FFMI (Fat-Free Mass Index) é o melhor indicador de desenvolvimento muscular. FFMI > 25 é raro natural. BF% atlético: 6-13% ♂, 14-20% ♀.
**Proporções Áureas (Vitrúvio/Da Vinci)**: Razão ombros/cintura ideal = φ (1.618). Braço/punho = 2.52. Peito/punho = 6.5. Cintura/pelvis = 0.86.
**Hormônios**: TRT aumenta TMB em ~10%. GLP-1 agonistas reduzem apetite em ~30% mas podem acelerar perda de massa magra em até 40% da perda total se proteína < 1.6g/kg.
**Recuperação**: Sono < 7h reduz síntese proteica em ~25%. Estresse crônico eleva cortisol e prejudica recuperação.`,

    treino: `
**Volume de Treino (Schoenfeld, 2017)**: 10-20 séries/grupo/semana para hipertrofia. Iniciantes: 10-12. Avançados: 15-20+.
**Periodização (Bompa, 2015)**: Periodização ondulatória superior a linear para hipertrofia. Mesociclos de 4 semanas com deload na 4ª.
**Frequência (Schoenfeld, 2016)**: 2x/semana por grupo é superior a 1x para hipertrofia. 3x pode ser superior para iniciantes.
**Recuperação**: 48-72h entre sessões do mesmo grupo. Grupos pequenos (braços): 48h. Grupos grandes (pernas): 72h.
**Seleção de Exercícios**: Compostos multiarticulares devem compor 60-70% do volume. Isolados para grupos deficientes.
**RPE e Progressão**: RPE 7-8 ideal para hipertrofia a longo prazo. Evitar falha muscular constante (RIR 1-3).`,

    dieta: `
**Proteína (Morton, 2018)**: 1.6-2.2g/kg/dia para maximizar hipertrofia. Em déficit: 2.0-2.4g/kg para preservar massa magra.
**Carboidratos**: 3-5g/kg/dia para treino moderado. 5-7g/kg para volume alto. Timing: 60-90min pré-treino e até 2h pós.
**Gorduras**: Mínimo 0.5g/kg/dia para saúde hormonal. Ideal: 0.7-1.0g/kg. Deficiência < 0.5g/kg prejudica testosterona.
**Déficit/Superávit**: Déficit recomendado: 300-500 kcal/dia (0.5-1% peso/semana). Déficits > 750 kcal aumentam perda muscular.
**Distribuição**: 4-6 refeições/dia com 20-40g proteína cada para maximizar síntese proteica muscular (SPM).
**Hidratação**: 35-40ml/kg/dia. Desidratação de 2% reduz performance em 10-20%.
**Suplementação**: Creatina (3-5g/dia) é o suplemento com maior evidência. Whey protein é conveniente mas não superior a alimentação.`,

    avaliacao: `
**Proporções Áureas (Vitrúvio/Da Vinci)**: O número áureo φ (1.618) aparece naturalmente em proporções corporais ideais. Razão ombros/cintura φ = V-Taper ideal.
**Simetria Bilateral**: Diferença > 3% entre lados pode indicar risco de lesão. Diferença < 1% é excelente.
**Composição Corporal**: Score de 90+ geralmente requer BF% < 12% (♂) ou < 20% (♀) combinado com desenvolvimento muscular significativo.
**Classificação**: Elite (95+), Meta (85-94), Quase Lá (70-84), Caminho (50-69), Início (<50).`,
};

export function getFontesCientificas(processo: 'diagnostico' | 'treino' | 'dieta' | 'avaliacao'): string {
    return FONTES_POR_PROCESSO[processo] || '';
}
