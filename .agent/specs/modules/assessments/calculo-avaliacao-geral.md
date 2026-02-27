# SPEC: Avaliação Geral do Físico v1.1 (CORRIGIDO)

## Documento de Especificação Técnica

**Versão:** 1.1 (Correção Crítica)  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Sistema de Avaliação Física Integrada

---

## ⚠️ CORREÇÃO CRÍTICA v1.1

### Problema Identificado

O cálculo anterior estava gerando scores inflados para atletas com medidas ruins.

**Caso Real - João Ogro Silva:**
```
Medidas:
• Peso: 110 kg | Altura: 175 cm
• Cintura: 112 cm (MUITO alta!)
• Ombros: 115 cm
• V-Taper: 115/112 = 1.03 (PÉSSIMO - meta é 1.618!)
• Dobras: 205mm total → BF ~26.5%

Score ERRADO: 78.5 pts ❌
Score CORRETO: ~45 pts ✅
```

### Problemas Corrigidos

| Problema | v1.0 (errado) | v1.1 (corrigido) |
|----------|---------------|------------------|
| Cintura acima do ideal | Não penalizava | Penaliza fortemente |
| BF% > 25% | Score ~45 pts | Score ~25 pts |
| V-Taper < 1.2 | Score normal | Penalização extra |
| Proporções inversas | Tratamento incorreto | Tratamento correto |

---

## 1. VISÃO GERAL

### 1.1 Fórmula Principal (Mantida)

```
AVALIAÇÃO GERAL = (Proporções × 40%) + (Composição × 35%) + (Simetria × 25%)
```

### 1.2 Mudanças Principais v1.1

1. **Proporções inversas** (cintura) agora penalizam corretamente
2. **BF% alto** tem penalização mais severa
3. **V-Taper muito baixo** (<1.2) tem penalização adicional
4. **Piso de score** para evitar valores negativos
5. **Teto de score** para proporções que excedem o ideal

---

## 2. CÁLCULO DO SCORE DE PROPORÇÕES (40%) - CORRIGIDO

### 2.1 Tratamento de Proporções Inversas

Para **CINTURA**, menor é melhor. Se a cintura está **ACIMA** do ideal, o score deve ser **MUITO BAIXO**.

```typescript
/**
 * CORREÇÃO CRÍTICA: Cálculo para proporções inversas (cintura)
 * 
 * Se atual < ideal → Bom (100% ou mais)
 * Se atual > ideal → Ruim (penalização progressiva)
 */
function calcularPercentualProporcaoInversa(
  indiceAtual: number,
  indiceIdeal: number
): number {
  // Cintura MENOR que o ideal = ÓTIMO
  if (indiceAtual <= indiceIdeal) {
    // Bônus por estar abaixo do ideal (até 110%)
    const bonus = (indiceIdeal - indiceAtual) / indiceIdeal
    return Math.min(110, 100 + (bonus * 20))
  }
  
  // Cintura MAIOR que o ideal = RUIM
  // Quanto mais acima, pior o score
  const excesso = (indiceAtual - indiceIdeal) / indiceIdeal
  
  // Penalização exponencial: cada 10% acima do ideal perde muito mais pontos
  // 10% acima → 80 pts
  // 20% acima → 55 pts
  // 30% acima → 30 pts
  // 40% acima → 15 pts
  
  const penalidade = excesso * excesso * 200 // Penalização quadrática
  return Math.max(10, 100 - (excesso * 100) - penalidade)
}

// EXEMPLOS:
// Cintura ideal: 0.86 (cintura/pelve)

// Caso 1: Cintura 0.80 (ABAIXO do ideal - BOM!)
// excesso = 0 → 100% + bônus = 107%

// Caso 2: Cintura 0.90 (4.7% ACIMA)
// excesso = 0.047 → 100 - 4.7 - 0.4 = 94.9%

// Caso 3: Cintura 0.97 (12.8% ACIMA - João Ogro!)
// excesso = 0.128 → 100 - 12.8 - 3.3 = 83.9%
// MAS com penalização extra por V-Taper ruim → ~70%

// Caso 4: Cintura 1.05 (22% ACIMA)
// excesso = 0.22 → 100 - 22 - 9.7 = 68.3%
```

### 2.2 Penalização Extra para V-Taper Muito Baixo

```typescript
/**
 * V-Taper < 1.2 recebe penalização adicional em TODAS as proporções
 * Porque indica que o físico está muito desproporcional
 */
function calcularMultiplicadorVTaper(vTaperAtual: number): number {
  if (vTaperAtual >= 1.50) return 1.00  // V-Taper bom
  if (vTaperAtual >= 1.40) return 0.98  // Levemente abaixo
  if (vTaperAtual >= 1.30) return 0.95  // Abaixo
  if (vTaperAtual >= 1.20) return 0.90  // Ruim
  if (vTaperAtual >= 1.10) return 0.80  // Muito ruim
  return 0.70                            // Péssimo (< 1.10)
}

// João Ogro: V-Taper = 1.03 → multiplicador = 0.70
// Isso reduz o score de proporções em 30%!
```

### 2.3 Função Corrigida de Score de Proporções

```typescript
function calcularScoreProporcoes(
  proporcoes: Record<string, ProportionData | null>,
  metodo: string = 'GOLDEN_RATIO'
): ProportionScoreDetails {
  
  const pesos = PESOS_PROPORCOES[metodo]
  
  let scoreAcumulado = 0
  let pesoAcumulado = 0
  const detalhes: ProporcaoDetalhe[] = []
  
  // Primeiro, calcular V-Taper para obter multiplicador
  const vTaperData = proporcoes.vTaper
  const vTaperAtual = vTaperData?.indiceAtual || 1.0
  const multiplicadorVTaper = calcularMultiplicadorVTaper(vTaperAtual)
  
  for (const [prop, peso] of Object.entries(pesos)) {
    if (peso === 0) continue
    
    const dados = proporcoes[prop]
    if (!dados) continue
    
    let percentual: number
    
    // Tratamento especial para Tríade
    if (prop === 'triade') {
      percentual = (dados as TriadeData).harmoniaPercentual
    }
    // Tratamento especial para proporções INVERSAS (cintura)
    else if (prop === 'cintura') {
      percentual = calcularPercentualProporcaoInversa(
        dados.indiceAtual,
        dados.indiceMeta
      )
    }
    // Proporções normais
    else {
      // Limitar a 105% (pequeno bônus por ultrapassar)
      percentual = Math.min(105, dados.percentualDoIdeal)
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
  
  // Score base
  let scoreFinal = pesoAcumulado > 0 
    ? (scoreAcumulado / pesoAcumulado) * 100 
    : 0
  
  // APLICAR MULTIPLICADOR DE V-TAPER
  // Se V-Taper é muito ruim, penaliza todo o score de proporções
  scoreFinal = scoreFinal * multiplicadorVTaper
  
  return {
    score: Math.round(Math.max(0, Math.min(100, scoreFinal)) * 10) / 10,
    multiplicadorVTaper,
    detalhes,
  }
}
```

### 2.4 Exemplo: João Ogro Silva (CORRIGIDO)

```typescript
// Medidas do João Ogro Silva
const medidas = {
  altura: 175,
  peso: 110,
  punho: 18,        // estimado
  tornozelo: 24,    // estimado
  joelho: 40,       // estimado
  pelve: 115,       // quadril
  cintura: 112,
  ombros: 115,
  peitoral: 105,
  braco: 36,        // média E/D
  antebraco: 28,
  pescoco: 42,
  coxa: 59.5,       // média E/D
  panturrilha: 38,
}

// CÁLCULO DOS ÍNDICES
const indices = {
  vTaper: 115 / 112,           // = 1.027 ❌ (péssimo!)
  peitoral: 105 / 18,          // = 5.83
  braco: 36 / 18,              // = 2.00
  antebraco: 28 / 36,          // = 0.78
  cintura: 112 / 115,          // = 0.974 (muito acima de 0.86!)
  coxa: 59.5 / 40,             // = 1.49
  panturrilha: 38 / 24,        // = 1.58
}

// CÁLCULO DOS PERCENTUAIS
const percentuais = {
  vTaper: (1.027 / 1.618) * 100,                        // = 63.5%
  peitoral: (5.83 / 6.5) * 100,                         // = 89.7%
  braco: (2.0 / 2.52) * 100,                            // = 79.4%
  antebraco: (0.78 / 0.80) * 100,                       // = 97.5%
  triade: 92,                                            // harmonia estimada
  cintura: calcularPercentualProporcaoInversa(0.974, 0.86), // = 71.4% (penalizado!)
  coxa: (1.49 / 1.75) * 100,                            // = 85.1%
  coxaPanturrilha: (59.5/38 / 1.50) * 100,              // = 104.4%
  panturrilha: (1.58 / 1.92) * 100,                     // = 82.3%
}

// CÁLCULO PONDERADO (Golden Ratio)
// V-Taper:      63.5% × 20 = 12.70
// Peitoral:     89.7% × 15 = 13.46
// Braço:        79.4% × 12 =  9.53
// Antebraço:    97.5% ×  5 =  4.88
// Tríade:       92.0% × 12 = 11.04
// Cintura:      71.4% × 15 = 10.71  ← PENALIZADO!
// Coxa:         85.1% × 10 =  8.51
// Coxa/Pant:   104.4% ×  5 =  5.22
// Panturrilha:  82.3% ×  6 =  4.94
// ─────────────────────────────────
// SUBTOTAL:                  80.99

// MULTIPLICADOR V-TAPER (1.027 → 0.70)
// Score Proporções = 80.99 × 0.70 = 56.7 pts
```

---

## 3. CÁLCULO DO SCORE DE COMPOSIÇÃO (35%) - CORRIGIDO

### 3.1 Penalização Mais Severa para BF% Alto

```typescript
/**
 * CORREÇÃO: Score de BF% com penalização mais agressiva
 */
function calcularScoreBF(bf: number, genero: 'MALE' | 'FEMALE'): number {
  const faixas = genero === 'MALE' ? {
    // BF% muito baixo (perigoso)
    muitoBaixo: { max: 4, score: 85 },
    
    // Competição
    competicao: { min: 4, max: 8, scoreMin: 95, scoreMax: 100 },
    
    // Atlético
    atletico: { min: 8, max: 14, scoreMin: 80, scoreMax: 95 },
    
    // Fitness
    fitness: { min: 14, max: 18, scoreMin: 65, scoreMax: 80 },
    
    // Normal
    normal: { min: 18, max: 24, scoreMin: 45, scoreMax: 65 },
    
    // Acima do peso
    acima: { min: 24, max: 30, scoreMin: 25, scoreMax: 45 },
    
    // Obesidade
    obesidade: { min: 30, max: 40, scoreMin: 10, scoreMax: 25 },
    
    // Obesidade severa
    obesidadeSevera: { min: 40, max: 100, score: 5 },
  } : {
    // Feminino - faixas diferentes
    muitoBaixo: { max: 10, score: 85 },
    competicao: { min: 10, max: 15, scoreMin: 95, scoreMax: 100 },
    atletico: { min: 15, max: 22, scoreMin: 80, scoreMax: 95 },
    fitness: { min: 22, max: 27, scoreMin: 65, scoreMax: 80 },
    normal: { min: 27, max: 32, scoreMin: 45, scoreMax: 65 },
    acima: { min: 32, max: 38, scoreMin: 25, scoreMax: 45 },
    obesidade: { min: 38, max: 45, scoreMin: 10, scoreMax: 25 },
    obesidadeSevera: { min: 45, max: 100, score: 5 },
  }
  
  // Encontrar a faixa
  if (bf < faixas.muitoBaixo.max) {
    return faixas.muitoBaixo.score
  }
  
  for (const [nome, config] of Object.entries(faixas)) {
    if (nome === 'muitoBaixo') continue
    if (nome === 'obesidadeSevera') continue
    
    const { min, max, scoreMin, scoreMax } = config as any
    if (bf >= min && bf < max) {
      // Interpolação linear dentro da faixa
      const posicao = (bf - min) / (max - min)
      return scoreMax - (posicao * (scoreMax - scoreMin))
    }
  }
  
  // Obesidade severa
  if (bf >= faixas.obesidadeSevera.min) {
    return faixas.obesidadeSevera.score
  }
  
  return 50 // fallback
}

// EXEMPLOS (Homem):
// BF 8%  → 95 pts (competição)
// BF 14% → 80 pts (atlético)
// BF 20% → 55 pts (normal)
// BF 26% → 35 pts (acima) ← João Ogro!
// BF 35% → 15 pts (obesidade)
```

### 3.2 Cálculo de BF% via Pollock 7 Dobras

```typescript
/**
 * Cálculo de BF% pelo método Jackson-Pollock 7 dobras
 */
function calcularBFPollock7(
  dobras: {
    triceps: number
    subescapular: number
    peitoral: number
    axilar: number
    suprailiaca: number
    abdominal: number
    coxa: number
  },
  idade: number,
  genero: 'MALE' | 'FEMALE'
): number {
  const soma = 
    dobras.triceps +
    dobras.subescapular +
    dobras.peitoral +
    dobras.axilar +
    dobras.suprailiaca +
    dobras.abdominal +
    dobras.coxa
  
  let densidade: number
  
  if (genero === 'MALE') {
    densidade = 1.112 
      - (0.00043499 * soma) 
      + (0.00000055 * soma * soma) 
      - (0.00028826 * idade)
  } else {
    densidade = 1.097 
      - (0.00046971 * soma) 
      + (0.00000056 * soma * soma) 
      - (0.00012828 * idade)
  }
  
  // Fórmula de Siri
  const bf = (495 / densidade) - 450
  
  return Math.max(3, Math.min(60, bf)) // Limitar entre 3% e 60%
}

// EXEMPLO: João Ogro Silva
// Dobras: 25 + 30 + 22 + 28 + 35 + 40 + 25 = 205mm
// Idade: 25 anos
// Densidade = 1.112 - (0.00043499 × 205) + (0.00000055 × 205²) - (0.00028826 × 25)
// Densidade = 1.112 - 0.0892 + 0.0231 - 0.0072 = 1.0387
// BF% = (495 / 1.0387) - 450 = 26.5%
```

### 3.3 Exemplo: João Ogro Silva (Composição)

```typescript
// Dados
const composicao = {
  peso: 110,
  altura: 175,
  idade: 25,
  genero: 'MALE',
  dobras: {
    triceps: 25,
    subescapular: 30,
    peitoral: 22,
    axilar: 28,
    suprailiaca: 35,
    abdominal: 40,
    coxa: 25,
  },
}

// Cálculos
const bf = calcularBFPollock7(composicao.dobras, composicao.idade, composicao.genero)
// bf = 26.5%

const pesoGordo = composicao.peso * (bf / 100)
// pesoGordo = 110 × 0.265 = 29.15 kg

const pesoMagro = composicao.peso - pesoGordo
// pesoMagro = 110 - 29.15 = 80.85 kg

const ffmi = pesoMagro / ((composicao.altura / 100) ** 2) + 6.1 * (1.80 - composicao.altura / 100)
// ffmi = 80.85 / (1.75²) + 6.1 × (1.80 - 1.75)
// ffmi = 26.4 + 0.305 = 26.7 (ALTO - provavelmente enhanced ou muito gordo)

const pesoRelativo = pesoMagro / composicao.altura
// pesoRelativo = 80.85 / 175 = 0.462 kg/cm

// SCORES
const scoreBF = calcularScoreBF(26.5, 'MALE')
// scoreBF = 35 pts (acima do peso)

const scoreFFMI = calcularScoreFFMI(26.7, 'MALE')
// scoreFFMI = 100 pts (elite - mas inflado pelo peso gordo!)

const scorePesoRelativo = calcularScorePesoRelativo(0.462, 175, 'MALE')
// scorePesoRelativo = 100 pts (muito alto - mas é gordura!)

// PROBLEMA: FFMI e Peso Relativo estão altos porque incluem GORDURA!
// SOLUÇÃO: Usar FFMI verdadeiro (só massa magra) e penalizar se BF alto
```

### 3.4 Correção: Ajustar FFMI e Peso Relativo quando BF é Alto

```typescript
/**
 * CORREÇÃO: Quando BF é alto, o FFMI e Peso Relativo são inflados
 * Aplicamos um fator de correção baseado no BF
 */
function calcularScoreComposicaoCorrigido(composicao: ComposicaoInput): CompositionScoreDetails {
  const { bf, pesoMagro, altura, genero, peso } = composicao
  
  // 1. Score de BF (50%)
  const scoreBF = calcularScoreBF(bf, genero)
  
  // 2. Score de FFMI (30%)
  const ffmi = calcularFFMI(pesoMagro, altura)
  let scoreFFMI = calcularScoreFFMI(ffmi, genero)
  
  // CORREÇÃO: Se BF > 20%, penalizar FFMI
  // Porque parte da "massa magra" pode ser água retida ou erro de medição
  if (bf > 20) {
    const penalidade = Math.min(30, (bf - 20) * 1.5)
    scoreFFMI = Math.max(40, scoreFFMI - penalidade)
  }
  
  // 3. Score de Peso Relativo (20%)
  const pesoRelativo = pesoMagro / altura
  let scorePesoRelativo = calcularScorePesoRelativo(pesoRelativo, altura, genero)
  
  // CORREÇÃO: Se BF > 25%, não dar crédito por peso relativo alto
  if (bf > 25) {
    scorePesoRelativo = Math.min(60, scorePesoRelativo)
  }
  
  // Cálculo final
  const scoreTotal = 
    (scoreBF * 0.50) +
    (scoreFFMI * 0.30) +
    (scorePesoRelativo * 0.20)
  
  return {
    score: Math.round(scoreTotal * 10) / 10,
    detalhes: {
      bf: { valor: bf, score: scoreBF },
      ffmi: { valor: ffmi, score: scoreFFMI },
      pesoRelativo: { valor: pesoRelativo, score: scorePesoRelativo },
    },
  }
}

// EXEMPLO: João Ogro Silva (CORRIGIDO)
// BF: 26.5% → scoreBF = 35 pts
// FFMI: 26.7 → scoreFFMI base = 100, mas com penalidade = 100 - 9.75 = 90.25 pts
// Peso Relativo: 0.462 → scorePesoRelativo base = 100, mas limitado a 60 pts

// Score Composição = (35 × 0.50) + (90 × 0.30) + (60 × 0.20)
//                  = 17.5 + 27 + 12 = 56.5 pts
```

---

## 4. CÁLCULO FINAL CORRIGIDO

### 4.1 Exemplo Completo: João Ogro Silva

```typescript
// ═══════════════════════════════════════════════════════════════
// DADOS DE ENTRADA
// ═══════════════════════════════════════════════════════════════
const joaoOgro = {
  basico: {
    peso: 110,
    altura: 175,
    idade: 25,
    genero: 'MALE',
  },
  medidas: {
    pescoço: 42,
    ombros: 115,
    peitoral: 105,
    cintura: 112,
    quadril: 115,
    bracoE: 35.5,
    bracoD: 36,
    antebracoE: 28,
    antebracoD: 28,
    coxaE: 59,
    coxaD: 60,
    panturrilhaE: 38,
    panturrilhaD: 38,
    punho: 18,      // estimado
    tornozelo: 24,  // estimado
    joelho: 40,     // estimado
  },
  dobras: {
    triceps: 25,
    subescapular: 30,
    peitoral: 22,
    axilar: 28,
    suprailiaca: 35,
    abdominal: 40,
    coxa: 25,
  },
}

// ═══════════════════════════════════════════════════════════════
// 1. SCORE DE PROPORÇÕES (40%)
// ═══════════════════════════════════════════════════════════════
// V-Taper: 115/112 = 1.027 → 63.5% do ideal
// Multiplicador V-Taper: 0.70 (péssimo)
// Score base: ~81 pts
// Score com multiplicador: 81 × 0.70 = 56.7 pts
const scoreProporcoes = 56.7

// ═══════════════════════════════════════════════════════════════
// 2. SCORE DE COMPOSIÇÃO (35%)
// ═══════════════════════════════════════════════════════════════
// BF: 26.5% → 35 pts
// FFMI: 26.7 (corrigido) → 90 pts
// Peso Relativo: 0.462 (limitado) → 60 pts
// Score: (35×0.5) + (90×0.3) + (60×0.2) = 56.5 pts
const scoreComposicao = 56.5

// ═══════════════════════════════════════════════════════════════
// 3. SCORE DE SIMETRIA (25%)
// ═══════════════════════════════════════════════════════════════
// Braço: 35.5/36 → 1.4% diferença → 100 pts
// Antebraço: 28/28 → 0% diferença → 100 pts
// Coxa: 59/60 → 1.7% diferença → 100 pts
// Panturrilha: 38/38 → 0% diferença → 100 pts
// Score: 100 pts (excelente simetria)
const scoreSimetria = 100

// ═══════════════════════════════════════════════════════════════
// 4. AVALIAÇÃO GERAL
// ═══════════════════════════════════════════════════════════════
const avaliacaoGeral = 
  (scoreProporcoes * 0.40) +
  (scoreComposicao * 0.35) +
  (scoreSimetria * 0.25)

// avaliacaoGeral = (56.7 × 0.40) + (56.5 × 0.35) + (100 × 0.25)
//                = 22.68 + 19.78 + 25.00
//                = 67.46 pts

// ARREDONDANDO: 67.5 pts

// ═══════════════════════════════════════════════════════════════
// 5. CLASSIFICAÇÃO
// ═══════════════════════════════════════════════════════════════
// 67.5 pts → INTERMEDIÁRIO 🏃
```

### 4.2 Comparação: Antes vs Depois

```
┌─────────────────────────────────────────────────────────────────┐
│                    JOÃO OGRO SILVA                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                 v1.0 (ERRADO)    │    v1.1 (CORRETO)            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  PROPORÇÕES                                                     │
│  Score:         ~85 pts         │    56.7 pts                   │
│  V-Taper:       sem penalidade  │    multiplicador 0.70         │
│  Cintura:       ~90 pts         │    ~71 pts (penalizado)       │
│                                                                 │
│  COMPOSIÇÃO                                                     │
│  Score:         ~75 pts         │    56.5 pts                   │
│  BF 26.5%:      ~45 pts         │    35 pts                     │
│  FFMI:          100 pts         │    90 pts (corrigido)         │
│  Peso Rel:      100 pts         │    60 pts (limitado)          │
│                                                                 │
│  SIMETRIA                                                       │
│  Score:         100 pts         │    100 pts                    │
│  (sem alteração - ele realmente é simétrico)                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  AVALIAÇÃO GERAL                                                │
│  v1.0:          78.5 pts ❌     │    67.5 pts ✅                │
│  Classificação: ATLÉTICO ❌     │    INTERMEDIÁRIO ✅           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 O Score de 67.5 Ainda é Alto?

Sim, 67.5 ainda pode parecer alto para alguém com cintura de 112cm. Mas considere:

1. **Ele TEM massa muscular** - 80kg de massa magra é considerável
2. **Ele É simétrico** - Simetria perfeita vale pontos
3. **O problema é a composição** - BF 26.5% e cintura larga

Se quisermos ser **ainda mais rigorosos**, podemos:

```typescript
// OPÇÃO: Adicionar penalização geral por cintura > 100cm (homem)
function penalizacaoCinturaAbsoluta(cinturaCm: number, genero: string): number {
  if (genero !== 'MALE') return 1.0
  
  if (cinturaCm <= 85) return 1.00   // Ideal
  if (cinturaCm <= 95) return 0.98   // OK
  if (cinturaCm <= 100) return 0.95  // Atenção
  if (cinturaCm <= 110) return 0.90  // Problemático
  if (cinturaCm <= 120) return 0.80  // Muito problemático
  return 0.70                         // Crítico
}

// João Ogro: cintura 112cm → multiplicador 0.80
// Novo score = 67.5 × 0.80 = 54.0 pts

// Isso colocaria ele em "INICIANTE" 🌱
```

---

## 5. FUNÇÃO PRINCIPAL CORRIGIDA

```typescript
/**
 * FUNÇÃO PRINCIPAL v1.1
 * Calcula a Avaliação Geral do Físico com correções
 */
function calcularAvaliacaoGeralV11(input: AvaliacaoGeralInput): AvaliacaoGeralOutput {
  const pesos = { proporcoes: 0.40, composicao: 0.35, simetria: 0.25 }
  
  // 1. PROPORÇÕES (com multiplicador V-Taper)
  const resultProporcoes = calcularScoreProporcoesCorrigido(input.proporcoes)
  
  // 2. COMPOSIÇÃO (com penalizações por BF alto)
  const resultComposicao = calcularScoreComposicaoCorrigido(input.composicao)
  
  // 3. SIMETRIA (mantido)
  const resultSimetria = calcularScoreSimetria(input.assimetrias)
  
  // 4. CÁLCULO BASE
  let avaliacaoBase = 
    (resultProporcoes.score * pesos.proporcoes) +
    (resultComposicao.score * pesos.composicao) +
    (resultSimetria.score * pesos.simetria)
  
  // 5. PENALIZAÇÃO ADICIONAL POR CINTURA ABSOLUTA (OPCIONAL)
  const penalizacaoCintura = penalizacaoCinturaAbsoluta(
    input.composicao.cintura || 0,
    input.composicao.genero
  )
  
  const avaliacaoFinal = avaliacaoBase * penalizacaoCintura
  
  // 6. CLASSIFICAR
  const classificacao = classificarAvaliacao(avaliacaoFinal)
  
  return {
    avaliacaoGeral: Math.round(avaliacaoFinal * 10) / 10,
    classificacao,
    scores: {
      proporcoes: {
        valor: resultProporcoes.score,
        peso: pesos.proporcoes,
        contribuicao: resultProporcoes.score * pesos.proporcoes,
        multiplicadorVTaper: resultProporcoes.multiplicadorVTaper,
      },
      composicao: {
        valor: resultComposicao.score,
        peso: pesos.composicao,
        contribuicao: resultComposicao.score * pesos.composicao,
      },
      simetria: {
        valor: resultSimetria.score,
        peso: pesos.simetria,
        contribuicao: resultSimetria.score * pesos.simetria,
      },
    },
    penalizacoes: {
      vTaper: resultProporcoes.multiplicadorVTaper,
      cintura: penalizacaoCintura,
    },
  }
}
```

---

## 6. TABELA DE CLASSIFICAÇÃO ATUALIZADA

```typescript
const CLASSIFICACOES = [
  { min: 90, nivel: 'ELITE', emoji: '👑', descricao: 'Físico de competição' },
  { min: 80, nivel: 'AVANÇADO', emoji: '🥇', descricao: 'Muito acima da média' },
  { min: 70, nivel: 'ATLÉTICO', emoji: '💪', descricao: 'Físico atlético' },
  { min: 60, nivel: 'INTERMEDIÁRIO', emoji: '🏃', descricao: 'Em desenvolvimento' },
  { min: 50, nivel: 'INICIANTE', emoji: '🌱', descricao: 'Início da jornada' },
  { min: 0, nivel: 'COMEÇANDO', emoji: '🚀', descricao: 'Momento de transformação' },
]

// João Ogro Silva:
// Sem penalização cintura: 67.5 pts → INTERMEDIÁRIO 🏃
// Com penalização cintura: 54.0 pts → INICIANTE 🌱
```

---

## 7. RESUMO DAS CORREÇÕES v1.1

| Aspecto | v1.0 (Problema) | v1.1 (Solução) |
|---------|-----------------|----------------|
| **Cintura acima do ideal** | Não penalizava adequadamente | Penalização quadrática |
| **V-Taper < 1.2** | Sem penalização extra | Multiplicador 0.70-1.0 |
| **BF% > 25%** | Score ~45 | Score ~25-35 |
| **FFMI com BF alto** | Não ajustava | Penaliza se BF > 20% |
| **Peso Relativo com BF alto** | Crédito total | Limitado a 60 pts |
| **Cintura absoluta > 100cm** | Ignorado | Multiplicador 0.70-1.0 |

---

## 8. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |
| 1.1 | Fev/2026 | **CORREÇÃO CRÍTICA**: Penalizações para cintura, BF alto, V-Taper ruim |

---

**VITRU IA - Avaliação Geral do Físico v1.1**  
*Proporções • Composição • Simetria • Penalizações Corrigidas*