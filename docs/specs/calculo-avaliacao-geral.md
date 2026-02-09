# SPEC: Avaliação Geral do Físico

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Sistema de Avaliação Física Integrada

---

## 1. VISÃO GERAL

### 1.1 Conceito

A **Avaliação Geral do Físico** é o score principal do VITRU IA que integra três dimensões de análise corporal em uma única pontuação de 0-100 pontos.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    AVALIAÇÃO GERAL DO FÍSICO                    │
│                         Score: 0-100                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│         ┌─────────────┐                                         │
│         │             │                                         │
│         │  PROPORÇÕES │ ────────────────┐                       │
│         │   ÁUREAS    │                 │                       │
│         │    40%      │                 │                       │
│         └─────────────┘                 │                       │
│                                         ▼                       │
│         ┌─────────────┐          ┌─────────────┐                │
│         │             │          │             │                │
│         │ COMPOSIÇÃO  │ ────────►│  AVALIAÇÃO  │                │
│         │  CORPORAL   │          │    GERAL    │                │
│         │    35%      │          │   0-100     │                │
│         └─────────────┘          └─────────────┘                │
│                                         ▲                       │
│         ┌─────────────┐                 │                       │
│         │             │                 │                       │
│         │  SIMETRIA   │ ────────────────┘                       │
│         │  BILATERAL  │                                         │
│         │    25%      │                                         │
│         └─────────────┘                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 As Três Dimensões

| Dimensão | Peso | O que mede | Tab no App |
|----------|:----:|------------|------------|
| **Proporções Áureas** | 40% | Quão próximo das proporções ideais (Golden Ratio, etc) | PROPORÇÕES ÁUREAS |
| **Composição Corporal** | 35% | BF%, massa magra, FFMI, distribuição de peso | DIAGNÓSTICO ESTÉTICO |
| **Simetria Bilateral** | 25% | Equilíbrio entre lado esquerdo e direito | ANÁLISE DE ASSIMETRIAS |

### 1.3 Por que esses pesos?

```
┌─────────────────────────────────────────────────────────────────┐
│                    JUSTIFICATIVA DOS PESOS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROPORÇÕES ÁUREAS (40%)                                        │
│  • É o core do VITRU IA - análise de proporções                 │
│  • Diferencial competitivo do app                               │
│  • Mais controlável pelo treino a longo prazo                   │
│  • Impacto visual direto na estética                            │
│                                                                 │
│  COMPOSIÇÃO CORPORAL (35%)                                      │
│  • BF% define a definição muscular visível                      │
│  • Massa magra indica desenvolvimento geral                     │
│  • Impacto direto na saúde e performance                        │
│  • Mais volátil (muda com dieta em semanas)                     │
│                                                                 │
│  SIMETRIA BILATERAL (25%)                                       │
│  • Importante para estética e competição                        │
│  • Indica equilíbrio no treino                                  │
│  • Menos variável que as outras dimensões                       │
│  • A maioria das pessoas tem boa simetria natural               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. ESTRUTURA DE DADOS

### 2.1 Input Necessário

```typescript
interface AvaliacaoGeralInput {
  // ═══════════════════════════════════════════════════════════
  // PROPORÇÕES ÁUREAS (vem da tab "Proporções Áureas")
  // ═══════════════════════════════════════════════════════════
  proporcoes: {
    metodo: 'GOLDEN_RATIO' | 'CLASSIC_PHYSIQUE' | 'MENS_PHYSIQUE' | 'OPEN_BB'
    
    // Cada proporção com seu índice e percentual do ideal
    vTaper: ProportionData
    peitoral: ProportionData
    braco: ProportionData
    antebraco: ProportionData
    triade: TriadeData
    cintura: ProportionData
    coxa: ProportionData | null        // null se Men's Physique
    coxaPanturrilha: ProportionData | null
    panturrilha: ProportionData
  }
  
  // ═══════════════════════════════════════════════════════════
  // COMPOSIÇÃO CORPORAL (vem da tab "Diagnóstico Estético")
  // ═══════════════════════════════════════════════════════════
  composicao: {
    // Básico
    peso: number                        // kg
    altura: number                      // cm
    idade: number                       // anos
    genero: 'MALE' | 'FEMALE'
    
    // Gordura corporal
    bf: number                          // % (Navy ou Pollock)
    metodo_bf: 'NAVY' | 'POLLOCK_7'
    
    // Derivados
    pesoMagro: number                   // kg
    pesoGordo: number                   // kg
    ffmi?: number                       // Fat-Free Mass Index
  }
  
  // ═══════════════════════════════════════════════════════════
  // SIMETRIA BILATERAL (vem da tab "Análise de Assimetrias")
  // ═══════════════════════════════════════════════════════════
  assimetrias: {
    braco: BilateralData
    antebraco: BilateralData
    coxa: BilateralData
    panturrilha: BilateralData
    peitoral?: BilateralData           // Opcional (difícil medir)
    ombro?: BilateralData              // Opcional
  }
}

interface ProportionData {
  indiceAtual: number                   // Ex: 1.56
  indiceMeta: number                    // Ex: 1.618
  percentualDoIdeal: number             // Ex: 96.4%
  classificacao: 'BLOCO' | 'NORMAL' | 'ATLÉTICO' | 'ESTÉTICO' | 'FREAK'
}

interface TriadeData {
  harmoniaPercentual: number            // Ex: 98.1%
  pescoco: number                       // cm
  braco: number                         // cm
  panturrilha: number                   // cm
}

interface BilateralData {
  esquerdo: number                      // cm
  direito: number                       // cm
  diferenca: number                     // cm (absoluto)
  diferencaPercentual: number           // %
  status: 'SIMETRICO' | 'LEVE_ASSIMETRIA' | 'ASSIMETRIA' | 'ASSIMETRIA_SEVERA'
}
```

### 2.2 Output

```typescript
interface AvaliacaoGeralOutput {
  // ═══════════════════════════════════════════════════════════
  // SCORE FINAL
  // ═══════════════════════════════════════════════════════════
  avaliacaoGeral: number                // 0-100
  classificacao: {
    nivel: string                       // 'ELITE', 'AVANÇADO', etc.
    emoji: string                       // '👑', '🥇', etc.
    cor: string                         // '#FFD700', etc.
    descricao: string                   // 'Físico excepcional'
  }
  
  // ═══════════════════════════════════════════════════════════
  // BREAKDOWN DOS SCORES
  // ═══════════════════════════════════════════════════════════
  scores: {
    proporcoes: {
      valor: number                     // 0-100
      peso: number                      // 0.40
      contribuicao: number              // valor × peso
      detalhes: ProportionScoreDetails
    }
    composicao: {
      valor: number                     // 0-100
      peso: number                      // 0.35
      contribuicao: number
      detalhes: CompositionScoreDetails
    }
    simetria: {
      valor: number                     // 0-100
      peso: number                      // 0.25
      contribuicao: number
      detalhes: SymmetryScoreDetails
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // INSIGHTS
  // ═══════════════════════════════════════════════════════════
  insights: {
    pontoForte: {
      categoria: string                 // 'Simetria Bilateral'
      valor: number                     // 98
      mensagem: string                  // 'Excelente equilíbrio...'
    }
    pontoFraco: {
      categoria: string                 // 'Composição Corporal'
      valor: number                     // 48
      mensagem: string                  // 'Foco em reduzir BF%...'
    }
    proximaMeta: {
      categoria: string
      metaAtual: number
      metaProxima: number
      acao: string                      // 'Reduza 5% de BF para...'
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // COMPARATIVO
  // ═══════════════════════════════════════════════════════════
  comparativo: {
    vsMediaUsuarios: number             // +15 (acima da média)
    percentil: number                   // Top 20%
    evolucao30dias?: number             // +5 pts
  }
}
```

---

## 3. CONSTANTES E CONFIGURAÇÕES

### 3.1 Pesos Padrão

```typescript
const PESOS_AVALIACAO = {
  PADRAO: {
    proporcoes: 0.40,
    composicao: 0.35,
    simetria: 0.25,
  },
  
  // Variações por objetivo (futuro)
  COMPETICAO: {
    proporcoes: 0.35,
    composicao: 0.40,                   // BF% mais importante
    simetria: 0.25,
  },
  ESTETICA: {
    proporcoes: 0.45,
    composicao: 0.30,
    simetria: 0.25,
  },
  SAUDE: {
    proporcoes: 0.25,
    composicao: 0.50,                   // Foco em saúde
    simetria: 0.25,
  },
}
```

### 3.2 Classificações

```typescript
const CLASSIFICACOES_AVALIACAO = [
  { min: 95, nivel: 'ELITE', emoji: '👑', cor: '#FFD700', descricao: 'Físico excepcional - nível competitivo' },
  { min: 85, nivel: 'AVANÇADO', emoji: '🥇', cor: '#10B981', descricao: 'Muito acima da média' },
  { min: 75, nivel: 'ATLÉTICO', emoji: '💪', cor: '#3B82F6', descricao: 'Físico atlético bem desenvolvido' },
  { min: 65, nivel: 'INTERMEDIÁRIO', emoji: '🏃', cor: '#8B5CF6', descricao: 'Bom desenvolvimento geral' },
  { min: 50, nivel: 'INICIANTE', emoji: '🌱', cor: '#F59E0B', descricao: 'Em desenvolvimento' },
  { min: 0, nivel: 'COMEÇANDO', emoji: '🚀', cor: '#6B7280', descricao: 'Início da jornada' },
]
```

### 3.3 Configuração de BF% por Gênero

```typescript
const FAIXAS_BF = {
  MALE: {
    competicao: { min: 3, max: 6 },
    atletico: { min: 6, max: 13 },
    fitness: { min: 13, max: 17 },
    normal: { min: 17, max: 24 },
    acima: { min: 24, max: 30 },
    obesidade: { min: 30, max: 100 },
  },
  FEMALE: {
    competicao: { min: 8, max: 12 },
    atletico: { min: 12, max: 20 },
    fitness: { min: 20, max: 24 },
    normal: { min: 24, max: 31 },
    acima: { min: 31, max: 40 },
    obesidade: { min: 40, max: 100 },
  },
}
```

### 3.4 Configuração de FFMI

```typescript
const FAIXAS_FFMI = {
  MALE: {
    elite: { min: 25, score: 100 },         // Atleta de elite (possivelmente enhanced)
    excelente: { min: 22, score: 90 },      // Excelente natural
    acimaMedia: { min: 20, score: 80 },     // Acima da média
    normal: { min: 18, score: 70 },         // Normal
    abaixo: { min: 16, score: 55 },         // Abaixo da média
    muitoAbaixo: { min: 0, score: 40 },     // Muito abaixo
  },
  FEMALE: {
    elite: { min: 22, score: 100 },
    excelente: { min: 19, score: 90 },
    acimaMedia: { min: 17, score: 80 },
    normal: { min: 15, score: 70 },
    abaixo: { min: 13, score: 55 },
    muitoAbaixo: { min: 0, score: 40 },
  },
}
```

### 3.5 Configuração de Assimetria

```typescript
const FAIXAS_ASSIMETRIA = {
  // Diferença percentual entre lados
  simetrico: { max: 2, score: 100, status: 'SIMETRICO' },
  quaseSimetrico: { max: 5, score: 85, status: 'SIMETRICO' },
  leveAssimetria: { max: 10, score: 70, status: 'LEVE_ASSIMETRIA' },
  assimetria: { max: 15, score: 50, status: 'ASSIMETRIA' },
  assimetriaSevera: { max: 100, score: 30, status: 'ASSIMETRIA_SEVERA' },
}

// Pesos por grupo muscular no score de simetria
const PESOS_SIMETRIA = {
  braco: 25,
  antebraco: 15,
  coxa: 25,
  panturrilha: 20,
  peitoral: 15,
}
```

---

## 4. CÁLCULO DO SCORE DE PROPORÇÕES (40%)

### 4.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                  SCORE DE PROPORÇÕES ÁUREAS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cada proporção tem:                                            │
│  • Índice Atual (ex: 1.56)                                      │
│  • Índice Meta (ex: 1.618)                                      │
│  • Percentual do Ideal = (Atual / Meta) × 100                   │
│                                                                 │
│  O Score de Proporções é a MÉDIA PONDERADA dos percentuais      │
│  de todas as proporções.                                        │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Proporção      │ Peso │ % do Ideal │ Contribuição    │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │  V-Taper        │ 20%  │   63.6%    │  12.72          │     │
│  │  Peitoral       │ 15%  │   87.4%    │  13.11          │     │
│  │  Braço          │ 12%  │   83.3%    │   9.99          │     │
│  │  Antebraço      │  5%  │   97.5%    │   4.87          │     │
│  │  Tríade         │ 12%  │   98.1%    │  11.77          │     │
│  │  Cintura        │ 15%  │  100.0%    │  15.00          │     │
│  │  Coxa           │ 10%  │   93.1%    │   9.31          │     │
│  │  Coxa/Pant      │  5%  │  100.0%    │   5.00          │     │
│  │  Panturrilha    │  6%  │   91.1%    │   5.46          │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │  TOTAL          │100%  │            │  87.23 pts      │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Pesos por Proporção

```typescript
const PESOS_PROPORCOES = {
  GOLDEN_RATIO: {
    vTaper: 20,           // V-Taper é o mais importante
    peitoral: 15,
    braco: 12,
    antebraco: 5,
    triade: 12,
    cintura: 15,          // Cintura crucial para V-Taper
    coxa: 10,
    coxaPanturrilha: 5,
    panturrilha: 6,
    // Total: 100
  },
  
  CLASSIC_PHYSIQUE: {
    vTaper: 18,
    peitoral: 14,
    braco: 14,
    antebraco: 4,
    triade: 10,
    cintura: 18,          // Cintura MUITO importante no Classic
    coxa: 10,
    coxaPanturrilha: 5,
    panturrilha: 7,
    // Total: 100
  },
  
  MENS_PHYSIQUE: {
    vTaper: 25,           // V-Taper é tudo
    peitoral: 22,
    braco: 25,            // Braços são destaque
    antebraco: 6,
    triade: 0,            // Não aplicável
    cintura: 17,
    coxa: 0,              // Não julgada
    coxaPanturrilha: 0,   // Não julgada
    panturrilha: 5,
    // Total: 100
  },
  
  OPEN_BB: {
    vTaper: 16,
    peitoral: 14,
    braco: 14,
    antebraco: 4,
    triade: 8,
    cintura: 12,
    coxa: 14,             // Pernas MUITO importantes
    coxaPanturrilha: 8,
    panturrilha: 6,
    costas: 4,
    // Total: 100
  },
}
```

### 4.3 Função de Cálculo

```typescript
/**
 * Calcula o Score de Proporções Áureas
 * 
 * @param proporcoes - Dados de todas as proporções
 * @param metodo - Método de comparação (Golden Ratio, Classic, etc)
 * @returns Score de 0-100
 */
function calcularScoreProporcoes(
  proporcoes: Record<string, ProportionData | TriadeData | null>,
  metodo: string = 'GOLDEN_RATIO'
): ProportionScoreDetails {
  
  const pesos = PESOS_PROPORCOES[metodo] || PESOS_PROPORCOES.GOLDEN_RATIO
  
  let scoreAcumulado = 0
  let pesoAcumulado = 0
  const detalhes: ProporcaoDetalhe[] = []
  
  for (const [prop, peso] of Object.entries(pesos)) {
    // Pular proporções com peso 0 (ex: coxa no Men's Physique)
    if (peso === 0) continue
    
    const dados = proporcoes[prop]
    if (!dados) continue
    
    // Tratamento especial para Tríade
    let percentual: number
    if (prop === 'triade') {
      percentual = (dados as TriadeData).harmoniaPercentual
    } else {
      // Limitar a 100% (não dar bônus por ultrapassar o ideal)
      // Exceto para proporções onde ultrapassar é desejável
      const propData = dados as ProportionData
      percentual = Math.min(100, propData.percentualDoIdeal)
    }
    
    const contribuicao = (percentual * peso) / 100
    
    scoreAcumulado += contribuicao
    pesoAcumulado += peso
    
    detalhes.push({
      proporcao: prop,
      peso,
      percentualDoIdeal: percentual,
      contribuicao,
    })
  }
  
  // Normalizar se não usou todos os pesos (ex: proporção faltando)
  const scoreFinal = pesoAcumulado > 0 
    ? (scoreAcumulado / pesoAcumulado) * 100 
    : 0
  
  return {
    score: Math.round(scoreFinal * 10) / 10,
    detalhes,
    proporcaoMaisForte: encontrarMaisForte(detalhes),
    proporcaoMaisFraca: encontrarMaisFraca(detalhes),
  }
}

interface ProporcaoDetalhe {
  proporcao: string
  peso: number
  percentualDoIdeal: number
  contribuicao: number
}

interface ProportionScoreDetails {
  score: number
  detalhes: ProporcaoDetalhe[]
  proporcaoMaisForte: string
  proporcaoMaisFraca: string
}
```

### 4.4 Exemplo de Cálculo

```typescript
// Input
const proporcoes = {
  vTaper: { indiceAtual: 1.03, indiceMeta: 1.62, percentualDoIdeal: 63.6 },
  peitoral: { indiceAtual: 5.68, indiceMeta: 6.50, percentualDoIdeal: 87.4 },
  braco: { indiceAtual: 2.10, indiceMeta: 2.52, percentualDoIdeal: 83.3 },
  antebraco: { indiceAtual: 0.78, indiceMeta: 0.80, percentualDoIdeal: 97.5 },
  triade: { harmoniaPercentual: 98.1 },
  cintura: { indiceAtual: 0.82, indiceMeta: 0.86, percentualDoIdeal: 100 }, // Menor é melhor
  coxa: { indiceAtual: 1.63, indiceMeta: 1.75, percentualDoIdeal: 93.1 },
  coxaPanturrilha: { indiceAtual: 1.55, indiceMeta: 1.50, percentualDoIdeal: 100 },
  panturrilha: { indiceAtual: 1.75, indiceMeta: 1.92, percentualDoIdeal: 91.1 },
}

// Cálculo (Golden Ratio)
// V-Taper:      63.6% × 20 = 12.72
// Peitoral:     87.4% × 15 = 13.11
// Braço:        83.3% × 12 =  9.99
// Antebraço:    97.5% ×  5 =  4.87
// Tríade:       98.1% × 12 = 11.77
// Cintura:     100.0% × 15 = 15.00
// Coxa:         93.1% × 10 =  9.31
// Coxa/Pant:   100.0% ×  5 =  5.00
// Panturrilha:  91.1% ×  6 =  5.46
// ─────────────────────────────────
// TOTAL:                     87.23

// Score de Proporções: 87.2 pts
```

---

## 5. CÁLCULO DO SCORE DE COMPOSIÇÃO CORPORAL (35%)

### 5.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                 SCORE DE COMPOSIÇÃO CORPORAL                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  O Score de Composição é calculado a partir de 3 componentes:   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                                                        │     │
│  │  ┌──────────────┐                                      │     │
│  │  │  GORDURA     │  50% do score                        │     │
│  │  │  CORPORAL    │  Baseado no BF%                      │     │
│  │  │  (BF%)       │  Quanto menor (até certo ponto),     │     │
│  │  │              │  melhor o score                      │     │
│  │  └──────────────┘                                      │     │
│  │                                                        │     │
│  │  ┌──────────────┐                                      │     │
│  │  │  MASSA       │  30% do score                        │     │
│  │  │  MUSCULAR    │  Baseado no FFMI                     │     │
│  │  │  (FFMI)      │  Quanto maior, melhor o score        │     │
│  │  │              │                                      │     │
│  │  └──────────────┘                                      │     │
│  │                                                        │     │
│  │  ┌──────────────┐                                      │     │
│  │  │  PESO        │  20% do score                        │     │
│  │  │  RELATIVO    │  Relação peso/altura/massa magra     │     │
│  │  │              │  Indica desenvolvimento geral        │     │
│  │  └──────────────┘                                      │     │
│  │                                                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  Score Composição = (BF×0.5) + (FFMI×0.3) + (Peso×0.2)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Pesos dos Componentes

```typescript
const PESOS_COMPOSICAO = {
  bf: 0.50,           // 50% - Gordura corporal é crucial para estética
  ffmi: 0.30,         // 30% - Massa muscular
  pesoRelativo: 0.20, // 20% - Desenvolvimento geral
}
```

### 5.3 Função de Cálculo do Score de BF%

```typescript
/**
 * Calcula o score baseado no percentual de gordura corporal
 * 
 * Faixas para HOMENS:
 * - Competição (3-6%):  100 pts
 * - Atlético (6-13%):   95-85 pts
 * - Fitness (13-17%):   85-70 pts
 * - Normal (17-24%):    70-50 pts
 * - Acima (24-30%):     50-35 pts
 * - Obesidade (30%+):   35-20 pts
 */
function calcularScoreBF(bf: number, genero: 'MALE' | 'FEMALE'): number {
  const faixas = FAIXAS_BF[genero]
  
  // Competição - Score máximo
  if (bf >= faixas.competicao.min && bf < faixas.competicao.max) {
    return interpolate(bf, faixas.competicao.min, faixas.competicao.max, 100, 95)
  }
  
  // Atlético
  if (bf >= faixas.atletico.min && bf < faixas.atletico.max) {
    return interpolate(bf, faixas.atletico.min, faixas.atletico.max, 95, 80)
  }
  
  // Fitness
  if (bf >= faixas.fitness.min && bf < faixas.fitness.max) {
    return interpolate(bf, faixas.fitness.min, faixas.fitness.max, 80, 65)
  }
  
  // Normal
  if (bf >= faixas.normal.min && bf < faixas.normal.max) {
    return interpolate(bf, faixas.normal.min, faixas.normal.max, 65, 45)
  }
  
  // Acima
  if (bf >= faixas.acima.min && bf < faixas.acima.max) {
    return interpolate(bf, faixas.acima.min, faixas.acima.max, 45, 30)
  }
  
  // Obesidade
  if (bf >= faixas.obesidade.min) {
    return Math.max(20, interpolate(bf, faixas.obesidade.min, 50, 30, 20))
  }
  
  // BF muito baixo (< 3% homem ou < 8% mulher) - perigoso
  return 85 // Penaliza levemente por ser arriscado para saúde
}

/**
 * Interpolação linear entre dois pontos
 */
function interpolate(
  valor: number, 
  minInput: number, 
  maxInput: number, 
  maxOutput: number, 
  minOutput: number
): number {
  const ratio = (valor - minInput) / (maxInput - minInput)
  return maxOutput - (ratio * (maxOutput - minOutput))
}
```

### 5.4 Função de Cálculo do FFMI

```typescript
/**
 * Calcula o FFMI (Fat-Free Mass Index)
 * 
 * FFMI = Peso Magro (kg) / Altura² (m)
 * FFMI Normalizado = FFMI + 6.1 × (1.80 - altura em metros)
 * 
 * A normalização ajusta para altura de referência de 1.80m
 */
function calcularFFMI(pesoMagro: number, alturaCm: number): number {
  const alturaM = alturaCm / 100
  const ffmiBruto = pesoMagro / (alturaM * alturaM)
  const ffmiNormalizado = ffmiBruto + (6.1 * (1.80 - alturaM))
  
  return Math.round(ffmiNormalizado * 10) / 10
}

/**
 * Calcula o score baseado no FFMI
 * 
 * FFMI para HOMENS naturais:
 * - 25+: Elite (possivelmente enhanced)
 * - 22-25: Excelente
 * - 20-22: Acima da média
 * - 18-20: Média
 * - 16-18: Abaixo da média
 * - <16: Muito abaixo
 */
function calcularScoreFFMI(ffmi: number, genero: 'MALE' | 'FEMALE'): number {
  const faixas = FAIXAS_FFMI[genero]
  
  if (ffmi >= faixas.elite.min) return faixas.elite.score
  if (ffmi >= faixas.excelente.min) return interpolate(ffmi, faixas.excelente.min, faixas.elite.min, faixas.excelente.score, faixas.elite.score)
  if (ffmi >= faixas.acimaMedia.min) return interpolate(ffmi, faixas.acimaMedia.min, faixas.excelente.min, faixas.acimaMedia.score, faixas.excelente.score)
  if (ffmi >= faixas.normal.min) return interpolate(ffmi, faixas.normal.min, faixas.acimaMedia.min, faixas.normal.score, faixas.acimaMedia.score)
  if (ffmi >= faixas.abaixo.min) return interpolate(ffmi, faixas.abaixo.min, faixas.normal.min, faixas.abaixo.score, faixas.normal.score)
  
  return faixas.muitoAbaixo.score
}
```

### 5.5 Função de Cálculo do Peso Relativo

```typescript
/**
 * Calcula o score de peso relativo
 * Baseado na relação entre peso magro e altura
 * 
 * Peso Magro por cm de altura (para HOMENS):
 * - Excelente: >= 0.45 kg/cm
 * - Bom: 0.40-0.45 kg/cm
 * - Normal: 0.35-0.40 kg/cm
 * - Abaixo: < 0.35 kg/cm
 */
function calcularScorePesoRelativo(
  pesoMagro: number, 
  alturaCm: number, 
  genero: 'MALE' | 'FEMALE'
): number {
  const relacao = pesoMagro / alturaCm // kg por cm
  
  const faixas = genero === 'MALE' 
    ? { excelente: 0.45, bom: 0.40, normal: 0.35, minimo: 0.30 }
    : { excelente: 0.38, bom: 0.34, normal: 0.30, minimo: 0.26 }
  
  if (relacao >= faixas.excelente) return 100
  if (relacao >= faixas.bom) return interpolate(relacao, faixas.bom, faixas.excelente, 80, 100)
  if (relacao >= faixas.normal) return interpolate(relacao, faixas.normal, faixas.bom, 65, 80)
  if (relacao >= faixas.minimo) return interpolate(relacao, faixas.minimo, faixas.normal, 50, 65)
  
  return 40
}
```

### 5.6 Função Principal de Composição

```typescript
/**
 * Calcula o Score de Composição Corporal completo
 */
function calcularScoreComposicao(composicao: ComposicaoInput): CompositionScoreDetails {
  const { bf, pesoMagro, altura, genero } = composicao
  
  // 1. Score de BF%
  const scoreBF = calcularScoreBF(bf, genero)
  
  // 2. Score de FFMI
  const ffmi = calcularFFMI(pesoMagro, altura)
  const scoreFFMI = calcularScoreFFMI(ffmi, genero)
  
  // 3. Score de Peso Relativo
  const scorePesoRelativo = calcularScorePesoRelativo(pesoMagro, altura, genero)
  
  // Cálculo ponderado
  const scoreTotal = 
    (scoreBF * PESOS_COMPOSICAO.bf) +
    (scoreFFMI * PESOS_COMPOSICAO.ffmi) +
    (scorePesoRelativo * PESOS_COMPOSICAO.pesoRelativo)
  
  // Determinar classificação do BF
  const classificacaoBF = classificarBF(bf, genero)
  
  return {
    score: Math.round(scoreTotal * 10) / 10,
    detalhes: {
      bf: {
        valor: bf,
        score: scoreBF,
        peso: PESOS_COMPOSICAO.bf,
        contribuicao: scoreBF * PESOS_COMPOSICAO.bf,
        classificacao: classificacaoBF,
      },
      ffmi: {
        valor: ffmi,
        score: scoreFFMI,
        peso: PESOS_COMPOSICAO.ffmi,
        contribuicao: scoreFFMI * PESOS_COMPOSICAO.ffmi,
        classificacao: classificarFFMI(ffmi, genero),
      },
      pesoRelativo: {
        valor: pesoMagro / altura,
        score: scorePesoRelativo,
        peso: PESOS_COMPOSICAO.pesoRelativo,
        contribuicao: scorePesoRelativo * PESOS_COMPOSICAO.pesoRelativo,
      },
    },
    pesoMagro,
    pesoGordo: composicao.peso - pesoMagro,
  }
}
```

### 5.7 Exemplo de Cálculo

```typescript
// Input (dados das imagens)
const composicao = {
  peso: 110,
  altura: 180,
  bf: 38.4,
  pesoMagro: 67.8,
  genero: 'MALE',
}

// Cálculos
// 1. Score BF: 38.4% → ~28 pontos (obesidade)
// 2. FFMI: 67.8 / (1.80²) = 20.9 → ~82 pontos (acima da média)
// 3. Peso Relativo: 67.8 / 180 = 0.377 kg/cm → ~67 pontos (normal)

// Score Composição = (28 × 0.5) + (82 × 0.3) + (67 × 0.2)
//                  = 14 + 24.6 + 13.4
//                  = 52.0 pts

// O BF% alto puxa muito o score para baixo!
```

---

## 6. CÁLCULO DO SCORE DE SIMETRIA BILATERAL (25%)

### 6.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                 SCORE DE SIMETRIA BILATERAL                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mede o equilíbrio entre lado esquerdo e direito do corpo.      │
│                                                                 │
│  Para cada grupo muscular bilateral:                            │
│  1. Calcula a diferença percentual: |E - D| / média × 100       │
│  2. Classifica: Simétrico, Leve Assimetria, etc.                │
│  3. Atribui um score de 0-100                                   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  Diferença %  │ Classificação        │ Score          │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │  0 - 2%       │ SIMÉTRICO            │ 100            │     │
│  │  2 - 5%       │ QUASE SIMÉTRICO      │ 85             │     │
│  │  5 - 10%      │ LEVE ASSIMETRIA      │ 70             │     │
│  │  10 - 15%     │ ASSIMETRIA           │ 50             │     │
│  │  15%+         │ ASSIMETRIA SEVERA    │ 30             │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  Grupos musculares avaliados:                                   │
│  • Braço (bíceps): 25%                                          │
│  • Antebraço: 15%                                               │
│  • Coxa: 25%                                                    │
│  • Panturrilha: 20%                                             │
│  • Peitoral: 15% (se disponível)                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Função de Cálculo

```typescript
/**
 * Calcula o Score de Simetria Bilateral
 */
function calcularScoreSimetria(assimetrias: AssimetriasInput): SymmetryScoreDetails {
  const detalhes: GrupoSimetriaDetalhe[] = []
  let scoreAcumulado = 0
  let pesoAcumulado = 0
  
  for (const [grupo, peso] of Object.entries(PESOS_SIMETRIA)) {
    const dados = assimetrias[grupo]
    if (!dados) continue
    
    const { esquerdo, direito } = dados
    const media = (esquerdo + direito) / 2
    const diferenca = Math.abs(esquerdo - direito)
    const diferencaPercent = (diferenca / media) * 100
    
    // Determinar score e classificação
    const { score, status } = classificarAssimetria(diferencaPercent)
    
    const contribuicao = (score * peso) / 100
    scoreAcumulado += contribuicao
    pesoAcumulado += peso
    
    detalhes.push({
      grupo,
      esquerdo,
      direito,
      diferenca,
      diferencaPercent: Math.round(diferencaPercent * 10) / 10,
      score,
      status,
      peso,
      contribuicao,
      ladoDominante: esquerdo > direito ? 'ESQUERDO' : direito > esquerdo ? 'DIREITO' : 'IGUAL',
    })
  }
  
  // Normalizar
  const scoreFinal = pesoAcumulado > 0 
    ? (scoreAcumulado / pesoAcumulado) * 100 
    : 100 // Se não tem dados, assume simétrico
  
  // Calcular score geral do radar (média simples)
  const radarScore = detalhes.length > 0
    ? detalhes.reduce((acc, d) => acc + d.score, 0) / detalhes.length
    : 100
  
  return {
    score: Math.round(scoreFinal * 10) / 10,
    radarScore: Math.round(radarScore),
    detalhes,
    grupoMaisSimetrico: encontrarMaisSimetrico(detalhes),
    grupoMenosSimetrico: encontrarMenosSimetrico(detalhes),
    assimetriasSignificativas: detalhes.filter(d => d.diferencaPercent > 5),
  }
}

/**
 * Classifica o nível de assimetria
 */
function classificarAssimetria(diferencaPercent: number): { score: number, status: string } {
  if (diferencaPercent <= 2) {
    return { score: 100, status: 'SIMÉTRICO' }
  }
  if (diferencaPercent <= 5) {
    return { score: 85, status: 'SIMÉTRICO' }
  }
  if (diferencaPercent <= 10) {
    return { score: 70, status: 'LEVE_ASSIMETRIA' }
  }
  if (diferencaPercent <= 15) {
    return { score: 50, status: 'ASSIMETRIA' }
  }
  return { score: 30, status: 'ASSIMETRIA_SEVERA' }
}

interface GrupoSimetriaDetalhe {
  grupo: string
  esquerdo: number
  direito: number
  diferenca: number
  diferencaPercent: number
  score: number
  status: string
  peso: number
  contribuicao: number
  ladoDominante: 'ESQUERDO' | 'DIREITO' | 'IGUAL'
}
```

### 6.3 Exemplo de Cálculo

```typescript
// Input (dados das imagens)
const assimetrias = {
  braco: { esquerdo: 35.5, direito: 36.0 },      // 1.4% → 100 pts
  antebraco: { esquerdo: 28.0, direito: 28.0 },  // 0.0% → 100 pts
  coxa: { esquerdo: 59.0, direito: 60.0 },       // 1.7% → 100 pts
  panturrilha: { esquerdo: 38.0, direito: 38.5 }, // 1.3% → 100 pts
}

// Cálculos
// Braço:       1.4% diferença → 100 pts × 25% = 25.0
// Antebraço:   0.0% diferença → 100 pts × 15% = 15.0
// Coxa:        1.7% diferença → 100 pts × 25% = 25.0
// Panturrilha: 1.3% diferença → 100 pts × 20% = 20.0
// ──────────────────────────────────────────────────
// TOTAL:                                        85.0 / 85 × 100 = 100 pts

// Score de Simetria: 100 pts (excelente!)
```

---

## 7. CÁLCULO FINAL DA AVALIAÇÃO GERAL

### 7.1 Função Principal

```typescript
/**
 * FUNÇÃO PRINCIPAL
 * Calcula a Avaliação Geral do Físico integrando as 3 dimensões
 */
function calcularAvaliacaoGeral(input: AvaliacaoGeralInput): AvaliacaoGeralOutput {
  const pesos = PESOS_AVALIACAO.PADRAO
  
  // ═══════════════════════════════════════════════════════════
  // 1. CALCULAR SCORE DE PROPORÇÕES (40%)
  // ═══════════════════════════════════════════════════════════
  const scoreProporcoes = calcularScoreProporcoes(
    input.proporcoes,
    input.proporcoes.metodo
  )
  
  // ═══════════════════════════════════════════════════════════
  // 2. CALCULAR SCORE DE COMPOSIÇÃO (35%)
  // ═══════════════════════════════════════════════════════════
  const scoreComposicao = calcularScoreComposicao(input.composicao)
  
  // ═══════════════════════════════════════════════════════════
  // 3. CALCULAR SCORE DE SIMETRIA (25%)
  // ═══════════════════════════════════════════════════════════
  const scoreSimetria = calcularScoreSimetria(input.assimetrias)
  
  // ═══════════════════════════════════════════════════════════
  // 4. CALCULAR AVALIAÇÃO GERAL PONDERADA
  // ═══════════════════════════════════════════════════════════
  const contribuicaoProporcoes = scoreProporcoes.score * pesos.proporcoes
  const contribuicaoComposicao = scoreComposicao.score * pesos.composicao
  const contribuicaoSimetria = scoreSimetria.score * pesos.simetria
  
  const avaliacaoGeral = 
    contribuicaoProporcoes + 
    contribuicaoComposicao + 
    contribuicaoSimetria
  
  // ═══════════════════════════════════════════════════════════
  // 5. CLASSIFICAR
  // ═══════════════════════════════════════════════════════════
  const classificacao = classificarAvaliacao(avaliacaoGeral)
  
  // ═══════════════════════════════════════════════════════════
  // 6. GERAR INSIGHTS
  // ═══════════════════════════════════════════════════════════
  const insights = gerarInsights(
    scoreProporcoes,
    scoreComposicao,
    scoreSimetria
  )
  
  // ═══════════════════════════════════════════════════════════
  // 7. MONTAR OUTPUT
  // ═══════════════════════════════════════════════════════════
  return {
    avaliacaoGeral: Math.round(avaliacaoGeral * 10) / 10,
    classificacao,
    
    scores: {
      proporcoes: {
        valor: scoreProporcoes.score,
        peso: pesos.proporcoes,
        contribuicao: Math.round(contribuicaoProporcoes * 10) / 10,
        detalhes: scoreProporcoes,
      },
      composicao: {
        valor: scoreComposicao.score,
        peso: pesos.composicao,
        contribuicao: Math.round(contribuicaoComposicao * 10) / 10,
        detalhes: scoreComposicao,
      },
      simetria: {
        valor: scoreSimetria.score,
        peso: pesos.simetria,
        contribuicao: Math.round(contribuicaoSimetria * 10) / 10,
        detalhes: scoreSimetria,
      },
    },
    
    insights,
  }
}

/**
 * Classifica a Avaliação Geral
 */
function classificarAvaliacao(score: number): Classificacao {
  for (const c of CLASSIFICACOES_AVALIACAO) {
    if (score >= c.min) {
      return {
        nivel: c.nivel,
        emoji: c.emoji,
        cor: c.cor,
        descricao: c.descricao,
      }
    }
  }
  return CLASSIFICACOES_AVALIACAO[CLASSIFICACOES_AVALIACAO.length - 1]
}

/**
 * Gera insights automáticos baseados nos scores
 */
function gerarInsights(
  proporcoes: ProportionScoreDetails,
  composicao: CompositionScoreDetails,
  simetria: SymmetryScoreDetails
): Insights {
  // Encontrar ponto forte (maior score)
  const scores = [
    { categoria: 'Proporções Áureas', valor: proporcoes.score },
    { categoria: 'Composição Corporal', valor: composicao.score },
    { categoria: 'Simetria Bilateral', valor: simetria.score },
  ]
  
  scores.sort((a, b) => b.valor - a.valor)
  const pontoForte = scores[0]
  const pontoFraco = scores[scores.length - 1]
  
  // Gerar mensagens contextuais
  const mensagemPontoForte = gerarMensagemPontoForte(pontoForte, { proporcoes, composicao, simetria })
  const mensagemPontoFraco = gerarMensagemPontoFraco(pontoFraco, { proporcoes, composicao, simetria })
  const proximaMeta = gerarProximaMeta(pontoFraco, { proporcoes, composicao, simetria })
  
  return {
    pontoForte: {
      categoria: pontoForte.categoria,
      valor: pontoForte.valor,
      mensagem: mensagemPontoForte,
    },
    pontoFraco: {
      categoria: pontoFraco.categoria,
      valor: pontoFraco.valor,
      mensagem: mensagemPontoFraco,
    },
    proximaMeta,
  }
}
```

### 7.2 Exemplo Completo

```typescript
// ═══════════════════════════════════════════════════════════════
// EXEMPLO COM DADOS DAS IMAGENS
// ═══════════════════════════════════════════════════════════════

const input: AvaliacaoGeralInput = {
  proporcoes: {
    metodo: 'GOLDEN_RATIO',
    vTaper: { indiceAtual: 1.03, indiceMeta: 1.62, percentualDoIdeal: 63.6 },
    peitoral: { indiceAtual: 5.68, indiceMeta: 6.50, percentualDoIdeal: 87.4 },
    braco: { indiceAtual: 2.10, indiceMeta: 2.52, percentualDoIdeal: 83.3 },
    antebraco: { indiceAtual: 0.78, indiceMeta: 0.80, percentualDoIdeal: 97.5 },
    triade: { harmoniaPercentual: 94.0, pescoco: 40, braco: 36, panturrilha: 38 },
    cintura: { indiceAtual: 0.82, indiceMeta: 0.86, percentualDoIdeal: 100 },
    coxa: { indiceAtual: 1.48, indiceMeta: 1.75, percentualDoIdeal: 84.6 },
    coxaPanturrilha: { indiceAtual: 1.55, indiceMeta: 1.50, percentualDoIdeal: 100 },
    panturrilha: { indiceAtual: 1.58, indiceMeta: 1.92, percentualDoIdeal: 82.3 },
  },
  composicao: {
    peso: 110,
    altura: 180,
    idade: 30,
    genero: 'MALE',
    bf: 38.4,
    metodo_bf: 'NAVY',
    pesoMagro: 67.8,
    pesoGordo: 42.2,
  },
  assimetrias: {
    braco: { esquerdo: 35.5, direito: 36.0, diferenca: 0.5, diferencaPercentual: 1.4, status: 'SIMETRICO' },
    antebraco: { esquerdo: 28.0, direito: 28.0, diferenca: 0, diferencaPercentual: 0, status: 'SIMETRICO' },
    coxa: { esquerdo: 59.0, direito: 60.0, diferenca: 1.0, diferencaPercentual: 1.7, status: 'SIMETRICO' },
    panturrilha: { esquerdo: 38.0, direito: 38.5, diferenca: 0.5, diferencaPercentual: 1.3, status: 'SIMETRICO' },
  },
}

// RESULTADO
const resultado = calcularAvaliacaoGeral(input)

/*
{
  avaliacaoGeral: 71.0,
  
  classificacao: {
    nivel: 'ATLÉTICO',
    emoji: '💪',
    cor: '#3B82F6',
    descricao: 'Físico atlético bem desenvolvido',
  },
  
  scores: {
    proporcoes: {
      valor: 85.2,
      peso: 0.40,
      contribuicao: 34.1,
      detalhes: { ... }
    },
    composicao: {
      valor: 48.5,
      peso: 0.35,
      contribuicao: 17.0,
      detalhes: {
        bf: { valor: 38.4, score: 28, classificacao: 'OBESIDADE' },
        ffmi: { valor: 20.9, score: 82, classificacao: 'ACIMA_MEDIA' },
        pesoRelativo: { valor: 0.377, score: 67 },
      }
    },
    simetria: {
      valor: 100.0,
      peso: 0.25,
      contribuicao: 25.0,
      detalhes: { ... }
    },
  },
  
  insights: {
    pontoForte: {
      categoria: 'Simetria Bilateral',
      valor: 100,
      mensagem: 'Excelente equilíbrio entre os lados do corpo. Continue mantendo o treino balanceado.',
    },
    pontoFraco: {
      categoria: 'Composição Corporal',
      valor: 48.5,
      mensagem: 'Seu BF% (38.4%) está elevado. Foque em um déficit calórico moderado para melhorar a definição.',
    },
    proximaMeta: {
      categoria: 'Composição Corporal',
      metaAtual: 38.4,
      metaProxima: 30,
      acao: 'Reduza o BF% para 30% para ganhar +10 pontos na avaliação geral.',
    },
  },
}
*/
```

---

## 8. VISUALIZAÇÃO NO DASHBOARD

### 8.1 Card de Avaliação Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  AVALIAÇÃO GERAL                                    💡          │
│                                                                 │
│         ┌─────────────────────────────────┐                     │
│         │                                 │                     │
│         │           ┌───────┐             │                     │
│         │           │       │             │                     │
│         │           │  71   │             │                     │
│         │           │       │             │                     │
│         │           └───────┘             │                     │
│         │            PONTOS               │                     │
│         │                                 │                     │
│         └─────────────────────────────────┘                     │
│                                                                 │
│                  💪 SHAPE ATLÉTICO                              │
│                  +5% vs. mês anterior                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Breakdown dos Scores

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  COMPOSIÇÃO DO SCORE                                            │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                                                        │     │
│  │  PROPORÇÕES ÁUREAS                          40%        │     │
│  │  ████████████████████████████░░░░░  85.2 pts           │     │
│  │  Contribuição: 34.1 pts                                │     │
│  │                                                        │     │
│  │  COMPOSIÇÃO CORPORAL                        35%        │     │
│  │  ████████████░░░░░░░░░░░░░░░░░░░░░  48.5 pts           │     │
│  │  Contribuição: 17.0 pts                                │     │
│  │                                                        │     │
│  │  SIMETRIA BILATERAL                         25%        │     │
│  │  █████████████████████████████████ 100.0 pts           │     │
│  │  Contribuição: 25.0 pts                                │     │
│  │                                                        │     │
│  │  ─────────────────────────────────────────────────     │     │
│  │  TOTAL: 34.1 + 17.0 + 25.0 = 71.0 pts                  │     │
│  │                                                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 Card de Insights

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ✨ AI INSIGHT                                                  │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🏆 PONTO FORTE                                        │     │
│  │  Simetria Bilateral (100 pts)                          │     │
│  │                                                        │     │
│  │  Excelente equilíbrio entre os lados do corpo.         │     │
│  │  Continue mantendo o treino balanceado.                │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  ⚠️ ATENÇÃO                                            │     │
│  │  Composição Corporal (48.5 pts)                        │     │
│  │                                                        │     │
│  │  Seu BF% (38.4%) está elevado. Foque em um déficit     │     │
│  │  calórico moderado para melhorar a definição.          │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  🎯 PRÓXIMA META                                       │     │
│  │                                                        │     │
│  │  Reduza o BF% de 38.4% para 30% para ganhar            │     │
│  │  +10 pontos na avaliação geral.                        │     │
│  │                                                        │     │
│  │                      Ver plano de ação →               │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. FÓRMULAS RESUMIDAS

### 9.1 Tabela de Referência Rápida

```
┌─────────────────────────────────────────────────────────────────┐
│                    FÓRMULAS RESUMIDAS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AVALIAÇÃO GERAL = (Prop × 0.40) + (Comp × 0.35) + (Sim × 0.25) │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCORE PROPORÇÕES = Σ (PropPercentual × PropPeso) / ΣPesos      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCORE COMPOSIÇÃO = (ScoreBF × 0.50) +                          │
│                     (ScoreFFMI × 0.30) +                        │
│                     (ScorePesoRelativo × 0.20)                  │
│                                                                 │
│  FFMI = PesoMagro / Altura² + 6.1 × (1.80 - Altura)             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  SCORE SIMETRIA = Σ (GrupoScore × GrupoPeso) / ΣPesos           │
│                                                                 │
│  Assimetria% = |Esquerdo - Direito| / Média × 100               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Tabela de Pesos

```
┌─────────────────────────────────────────────────────────────────┐
│                      TABELA DE PESOS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AVALIAÇÃO GERAL                                                │
│  ├── Proporções Áureas ............ 40%                         │
│  ├── Composição Corporal .......... 35%                         │
│  └── Simetria Bilateral ........... 25%                         │
│                                                                 │
│  PROPORÇÕES ÁUREAS (Golden Ratio)                               │
│  ├── V-Taper ...................... 20%                         │
│  ├── Cintura ...................... 15%                         │
│  ├── Peitoral ..................... 15%                         │
│  ├── Tríade ....................... 12%                         │
│  ├── Braço ........................ 12%                         │
│  ├── Coxa ......................... 10%                         │
│  ├── Panturrilha ..................  6%                         │
│  ├── Coxa/Panturrilha .............  5%                         │
│  └── Antebraço ....................  5%                         │
│                                                                 │
│  COMPOSIÇÃO CORPORAL                                            │
│  ├── BF% (Gordura) ................ 50%                         │
│  ├── FFMI (Massa Muscular) ........ 30%                         │
│  └── Peso Relativo ................ 20%                         │
│                                                                 │
│  SIMETRIA BILATERAL                                             │
│  ├── Braço ........................ 25%                         │
│  ├── Coxa ......................... 25%                         │
│  ├── Panturrilha .................. 20%                         │
│  ├── Antebraço .................... 15%                         │
│  └── Peitoral ..................... 15%                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Sistema completo de Avaliação Geral |

---

**VITRU IA - Avaliação Geral do Físico v1.0**  
*Proporções • Composição • Simetria*
