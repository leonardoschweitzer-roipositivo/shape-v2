# SPEC: Calculadora de Proporções Corporais Masculinas

## Documento de Especificação Técnica v3.0

**Versão:** 3.0  
**Data:** Fevereiro 2026  
**Aplicação:** VITRU IA - Análise de Físico e Proporções Corporais Masculinas

---

## 1. VISÃO GERAL

Este documento especifica os cálculos e fórmulas para a calculadora de proporções corporais **masculinas** com quatro métodos de comparação:

1. **🏛️ Golden Ratio (Clássico)** - Proporções áureas baseadas em Eugen Sandow e Steve Reeves
2. **🏆 Classic Physique** - Baseado em Chris Bumstead (6x Mr. Olympia Classic Physique)
3. **🏖️ Men's Physique** - Baseado em Ryan Terry (3x Mr. Olympia Men's Physique)
4. **👑 Open Bodybuilding** - Baseado em Derek Lunsford (Mr. Olympia 2024) **NOVO**

---

## 2. ESPECTRO DE CATEGORIAS MASCULINAS

### 2.1 Comparativo Visual

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ESPECTRO DE CATEGORIAS MASCULINAS                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ← MENOS MUSCULAR                                    MAIS MUSCULAR →         │
│                                                                              │
│  🏖️ Men's      🏛️ Golden      🏆 Classic       👑 Open                       │
│   Physique      Ratio          Physique        Bodybuilding                  │
│                                                                              │
│  V-Taper: 1.55  V-Taper: 1.618 V-Taper: 1.70   V-Taper: 1.75+               │
│  BF: 5-8%       BF: 8-12%      BF: 3-6%        BF: 2-5%                      │
│                                                                              │
│  Foco:          Foco:          Foco:           Foco:                         │
│  Upper body     Proporção      Proporção +     TAMANHO                       │
│  Estética       Perfeita       Tamanho         MÁXIMO +                      │
│  Beach look     Clássica       Clássico        Simetria                      │
│                                                                              │
│  Ref:           Ref:           Ref:            Ref:                          │
│  Ryan Terry     Steve Reeves   Chris Bumstead  Derek Lunsford                │
│  178cm/93kg     185cm/95kg     185cm/104kg     166cm/104kg                   │
│                                                                              │
│  Pernas:        Pernas:        Pernas:         Pernas:                       │
│  NÃO JULGADAS   Proporcionais  Muito import.   ESSENCIAIS                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Quando Usar Cada Categoria

| Categoria | Perfil do Usuário | Objetivo |
|-----------|-------------------|----------|
| **🏖️ Men's Physique** | Busca estética de praia, não quer pernas grandes | "Beach body" com V-Taper |
| **🏛️ Golden Ratio** | Busca proporções naturais e harmoniosas | Físico clássico atemporal |
| **🏆 Classic Physique** | Quer competir ou ter físico de era de ouro moderno | Volume + Proporções clássicas |
| **👑 Open Bodybuilding** | Busca máximo desenvolvimento muscular | Tamanho extremo + Simetria |

---

## 3. MEDIDAS NECESSÁRIAS (INPUT DO USUÁRIO)

### 3.1 Lista Completa de Medidas

| # | Medida | Código | Unidade | Como Medir | Tipo |
|---|--------|--------|---------|------------|------|
| 1 | **Altura** | `altura` | cm | Descalço, coluna ereta contra parede | Estrutural |
| 2 | **Peso** | `peso` | kg | Pela manhã, em jejum | Variável |
| 3 | **Punho** | `punho` | cm | Circunferência no osso proeminente | Estrutural |
| 4 | **Tornozelo** | `tornozelo` | cm | Parte mais fina, acima do osso | Estrutural |
| 5 | **Joelho** | `joelho` | cm | Centro da patela, perna estendida | Estrutural |
| 6 | **Pelve/Quadril** | `pelve` | cm | Parte mais larga da pelve | Estrutural |
| 7 | **Cintura** | `cintura` | cm | Parte mais estreita (umbigo) | Variável |
| 8 | **Ombros** | `ombros` | cm | Ponto mais largo, braços relaxados | Variável |
| 9 | **Peitoral** | `peitoral` | cm | Na altura dos mamilos | Variável |
| 10 | **Costas** | `costas` | cm | Largura de lat a lat (wingspan) | Variável |
| 11 | **Braço** | `braco` | cm | Bíceps flexionado, ponto mais grosso | Variável |
| 12 | **Antebraço** | `antebraco` | cm | Ponto mais grosso, punho cerrado | Variável |
| 13 | **Pescoço** | `pescoco` | cm | Parte mais estreita | Variável |
| 14 | **Coxa** | `coxa` | cm | Ponto mais grosso, perna relaxada | Variável |
| 15 | **Panturrilha** | `panturrilha` | cm | Ponto mais grosso | Variável |

### 3.2 Classificação das Medidas

**Medidas Estruturais (genética - não mudam com treino):**
- Altura, Punho, Tornozelo, Joelho, Pelve

**Medidas Variáveis (mudam com treino/dieta):**
- Peso, Cintura, Ombros, Peitoral, Costas, Braço, Antebraço, Pescoço, Coxa, Panturrilha

### 3.3 Medidas por Categoria

| Medida | Golden Ratio | Classic | Men's Physique | Open BB |
|--------|:------------:|:-------:|:--------------:|:-------:|
| Altura | ✅ | ✅ | ✅ | ✅ |
| Peso | ✅ | ✅ | ✅ | ✅ |
| Punho | ✅ | ✅ | ✅ | ✅ |
| Tornozelo | ✅ | ✅ | ✅ | ✅ |
| Joelho | ✅ | ⚪ | ❌ | ✅ |
| Pelve | ✅ | ⚪ | ❌ | ⚪ |
| Cintura | ✅ | ✅ | ✅ | ✅ |
| Ombros | ✅ | ✅ | ✅ | ✅ |
| Peitoral | ✅ | ✅ | ✅ | ✅ |
| Costas | ⚪ | ✅ | ✅ | ✅ |
| Braço | ✅ | ✅ | ✅ | ✅ |
| Antebraço | ✅ | ✅ | ✅ | ✅ |
| Pescoço | ✅ | ✅ | ❌ | ✅ |
| Coxa | ✅ | ✅ | ❌ | ✅ |
| Panturrilha | ✅ | ✅ | ⚪ | ✅ |

**Legenda:** ✅ Obrigatório | ⚪ Opcional | ❌ Não usado

---

## 4. QUADRO DE PROPORÇÕES: FÓRMULAS POR MÉTODO

### 4.1 Tabela Completa de Referência

| # | Proporção | Golden Ratio 🏛️ | Classic 🏆 | Men's Physique 🏖️ | Open BB 👑 |
|---|-----------|-----------------|------------|-------------------|-----------|
| 1 | **V-Taper (SWR)** | `1.618 × Cintura` | `1.70 × Cintura` | `1.55 × Cintura` | `1.75 × Cintura` |
| 2 | **Peitoral** | `6.5 × Punho` | `7.0 × Punho` | `6.2 × Punho` | `7.5 × Punho` |
| 3 | **Braço** | `2.52 × Punho` | `(Alt/185)×50` | `(Alt/178)×43` | `(Alt/166)×56` |
| 4 | **Antebraço** | `0.80 × Braço` | `0.80 × Braço` | `0.80 × Braço` | `0.78 × Braço` |
| 5 | **Tríade** | `1:1:1` | `~1:1:1` | N/A | `~1:1:1` |
| 6 | **Cintura** | `0.86 × Pelve` | `0.42 × Altura` | `0.455 × Altura` | `0.44 × Altura` |
| 7 | **Coxa** | `1.75 × Joelho` | `0.97 × Cintura` | N/A | `1.85 × Joelho` |
| 8 | **Coxa/Pant** | `1.5:1` | `1.5:1` | N/A | `1.55:1` |
| 9 | **Panturrilha** | `1.92 × Tornozelo` | `0.96 × Braço` | Estética | `0.98 × Braço` |
| 10 | **Costas** | N/A | `1.6 × Cintura` | `1.5 × Cintura` | `1.7 × Cintura` |

### 4.2 Pesos do Score por Categoria

| Proporção | Golden Ratio | Classic | Men's Physique | Open BB |
|-----------|:------------:|:-------:|:--------------:|:-------:|
| Ombros/V-Taper | 18% | 18% | 25% | 16% |
| Peitoral | 14% | 14% | 22% | 14% |
| Braço | 14% | 16% | 25% | 14% |
| Antebraço | 5% | 4% | 6% | 4% |
| Tríade | 10% | 8% | 0% | 6% |
| Cintura | 12% | 16% | 17% | 12% |
| Coxa | 10% | 10% | 0% | 14% |
| Coxa/Panturrilha | 8% | 6% | 0% | 8% |
| Panturrilha | 9% | 8% | 5% | 8% |
| Costas | 0% | 0% | 0% | 4% |
| **Total** | 100% | 100% | 100% | 100% |

---

## 5. FÓRMULAS DETALHADAS - GOLDEN RATIO (CLÁSSICO) 🏛️

### 5.1 Referência Histórica

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOLDEN RATIO - REFERÊNCIAS                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EUGEN SANDOW (1867-1925)                                       │
│  "Pai do Bodybuilding Moderno"                                  │
│  • Altura: 175 cm                                               │
│  • Peso: 88 kg                                                  │
│  • Braço: 45 cm                                                 │
│  • Peitoral: 122 cm                                             │
│  • Cintura: 74 cm                                               │
│  • Coxa: 66 cm                                                  │
│                                                                 │
│  STEVE REEVES (1926-2000)                                       │
│  "O Físico Perfeito da Era de Ouro"                             │
│  • Altura: 185 cm                                               │
│  • Peso: 95 kg (competição)                                     │
│  • Braço: 47 cm                                                 │
│  • Peitoral: 132 cm                                             │
│  • Cintura: 74 cm                                               │
│  • Coxa: 66 cm                                                  │
│  • Panturrilha: 47 cm (igual ao braço!)                         │
│                                                                 │
│  PROPORÇÃO ÁUREA (PHI = 1.618)                                  │
│  • Ombros = Cintura × 1.618                                     │
│  • Pescoço = Braço = Panturrilha (Tríade Clássica)              │
│  • Harmonia matemática perfeita                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Constantes

```javascript
const GOLDEN_RATIO = {
  // Identificação
  name: 'Golden Ratio',
  icon: '🏛️',
  
  // Constante matemática
  PHI: 1.618,
  
  // Proporções
  OMBROS_CINTURA: 1.618,       // V-Taper áureo
  PEITO_PUNHO: 6.5,            // Multiplicador peitoral
  BRACO_PUNHO: 2.52,           // Multiplicador braço
  ANTEBRACO_BRACO: 0.80,       // 80% do braço
  CINTURA_PELVE: 0.86,         // Proporção cintura
  COXA_JOELHO: 1.75,           // Multiplicador coxa
  COXA_PANTURRILHA: 1.5,       // Proporção coxa/panturrilha
  PANTURRILHA_TORNOZELO: 1.92, // Multiplicador panturrilha
  
  // Tríade Clássica
  TRIADE: {
    enabled: true,
    descricao: 'Pescoço = Braço = Panturrilha',
  },
  
  // Gordura corporal ideal
  BF_MIN: 8,
  BF_MAX: 12,
  BF_IDEAL: 10,
  
  // Referências históricas
  referencias: [
    { nome: 'Eugen Sandow', altura: 175, peso: 88 },
    { nome: 'Steve Reeves', altura: 185, peso: 95 },
    { nome: 'John Grimek', altura: 175, peso: 88 },
  ],
}
```

### 5.3 Funções de Cálculo

```javascript
function calcularIdeaisGoldenRatio(medidas) {
  const { cintura, punho, pelve, joelho, tornozelo } = medidas
  
  // Calcular braço ideal primeiro (usado em outras proporções)
  const braco_ideal = punho * GOLDEN_RATIO.BRACO_PUNHO
  
  // Calcular panturrilha ideal
  const panturrilha_ideal = tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO
  
  return {
    // 1. OMBROS: PHI × Cintura (V-Taper áureo)
    ombros: cintura * GOLDEN_RATIO.PHI,
    
    // 2. PEITORAL: 6.5 × Punho
    peitoral: punho * GOLDEN_RATIO.PEITO_PUNHO,
    
    // 3. BRAÇO: 2.52 × Punho
    braco: braco_ideal,
    
    // 4. ANTEBRAÇO: 80% do Braço
    antebraco: braco_ideal * GOLDEN_RATIO.ANTEBRACO_BRACO,
    
    // 5. TRÍADE: Pescoço = Braço = Panturrilha
    triade: {
      valor_ideal: braco_ideal,
      pescoco: braco_ideal,
      braco: braco_ideal,
      panturrilha: braco_ideal,
      regra: 'Pescoço = Braço = Panturrilha',
    },
    
    // 6. CINTURA: 0.86 × Pelve
    cintura: pelve * GOLDEN_RATIO.CINTURA_PELVE,
    
    // 7. COXA: 1.75 × Joelho
    coxa: joelho * GOLDEN_RATIO.COXA_JOELHO,
    
    // 8. COXA/PANTURRILHA: Coxa = 1.5 × Panturrilha
    coxa_panturrilha: {
      coxa_ideal: panturrilha_ideal * GOLDEN_RATIO.COXA_PANTURRILHA,
      panturrilha_ref: panturrilha_ideal,
      ratio: GOLDEN_RATIO.COXA_PANTURRILHA,
      regra: 'Coxa deve ser 1.5× a Panturrilha',
    },
    
    // 9. PANTURRILHA: 1.92 × Tornozelo
    panturrilha: panturrilha_ideal,
  }
}
```

### 5.4 Cálculo de Score

```javascript
function calcularScoreGoldenRatio(medidas) {
  const ideais = calcularIdeaisGoldenRatio(medidas)
  
  // Pesos (total = 100)
  const pesos = {
    ombros: 18,           // V-Taper é prioridade
    peitoral: 14,
    braco: 14,
    antebraco: 5,
    triade: 10,           // Simetria clássica
    cintura: 12,          // INVERTIDO - menor é melhor
    coxa: 10,
    coxa_panturrilha: 8,
    panturrilha: 9,
  }
  
  const scores = {}
  
  // Calcular cada score
  scores.ombros = calcularScoreProporcional(medidas.ombros, ideais.ombros, pesos.ombros)
  scores.peitoral = calcularScoreProporcional(medidas.peitoral, ideais.peitoral, pesos.peitoral)
  scores.braco = calcularScoreProporcional(medidas.braco, ideais.braco, pesos.braco)
  scores.antebraco = calcularScoreProporcional(medidas.antebraco, ideais.antebraco, pesos.antebraco)
  scores.triade = calcularScoreTriade(medidas.pescoco, medidas.braco, medidas.panturrilha, pesos.triade)
  scores.cintura = calcularScoreInverso(medidas.cintura, ideais.cintura, pesos.cintura)
  scores.coxa = calcularScoreProporcional(medidas.coxa, ideais.coxa, pesos.coxa)
  scores.coxa_panturrilha = calcularScoreRatio(medidas.coxa, medidas.panturrilha, 1.5, pesos.coxa_panturrilha)
  scores.panturrilha = calcularScoreProporcional(medidas.panturrilha, ideais.panturrilha, pesos.panturrilha)
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    categoria: 'Golden Ratio',
    icon: '🏛️',
    scores_detalhados: scores,
    score_total: Math.round(scoreTotal * 100) / 100,
    ideais,
    diferencas: calcularDiferencas(medidas, ideais),
  }
}
```

---

## 6. FÓRMULAS DETALHADAS - CLASSIC PHYSIQUE 🏆

### 6.1 Referência

```
┌─────────────────────────────────────────────────────────────────┐
│                CLASSIC PHYSIQUE - REFERÊNCIA                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CHRIS BUMSTEAD                                                 │
│  "CBum" - 6x Mr. Olympia Classic Physique (2019-2024)           │
│  Aposentado após o 6º título consecutivo                        │
│                                                                 │
│  MEDIDAS (competição):                                          │
│  • Altura: 185 cm (6'1")                                        │
│  • Peso: 104 kg (230 lbs) - stage                               │
│  • Peso off-season: ~120 kg (265 lbs)                           │
│  • Peitoral: ~132 cm (52")                                      │
│  • Cintura: ~76 cm (30") - MUITO apertada                       │
│  • Braço: ~51 cm (20")                                          │
│  • Coxa: ~76 cm (30")                                           │
│  • Panturrilha: ~48 cm (19")                                    │
│  • BF% stage: 3-4%                                              │
│                                                                 │
│  CARACTERÍSTICAS:                                               │
│  • V-Taper extremamente pronunciado                             │
│  • Cintura "vacuum" possível                                    │
│  • Linhas clássicas da Era de Ouro                              │
│  • Desenvolvimento muscular completo                            │
│  • Limite de peso por altura (tabela IFBB)                      │
│                                                                 │
│  V-TAPER: Ombros/Cintura = 1.70                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Constantes

```javascript
const CLASSIC_PHYSIQUE = {
  // Identificação
  name: 'Classic Physique',
  icon: '🏆',
  
  // Referência
  reference: {
    nome: 'Chris Bumstead',
    titulos: '6x Mr. Olympia Classic Physique',
    altura: 185,
    peso_stage: 104,
    peso_off: 120,
    braco: 51,
    cintura: 76,
    coxa: 76,
  },
  
  // Proporções
  OMBROS_CINTURA: 1.70,        // V-Taper mais agressivo que Golden
  PEITO_PUNHO: 7.0,            // Peitoral maior
  CINTURA_ALTURA: 0.42,        // Cintura SUPER apertada
  COXA_CINTURA: 0.97,          // Coxas proporcionais
  COXA_PANTURRILHA: 1.5,       // Proporção pernas
  PANTURRILHA_BRACO: 0.96,     // Panturrilha quase igual ao braço
  ANTEBRACO_BRACO: 0.80,
  
  // Referência para escalar braço
  CBUM_ALTURA: 185,
  CBUM_BRACO: 50,              // 50cm reference
  
  // Tríade
  TRIADE: {
    enabled: true,
    descricao: 'Pescoço ≈ Braço ≈ Panturrilha (harmonia)',
  },
  
  // Gordura corporal
  BF_MIN: 3,
  BF_MAX: 6,
  BF_IDEAL: 4,
}

// Tabela de peso máximo IFBB Pro Classic Physique 2024
const CLASSIC_WEIGHT_LIMITS = {
  162.6: 80.3,   // 5'4"
  165.1: 82.6,   // 5'5"
  167.6: 84.8,   // 5'6"
  170.2: 87.1,   // 5'7"
  172.7: 89.4,   // 5'8"
  175.3: 91.6,   // 5'9"
  177.8: 93.9,   // 5'10"
  180.3: 97.5,   // 5'11"
  182.9: 100.7,  // 6'0"
  185.4: 104.3,  // 6'1" (CBum)
  188.0: 108.9,  // 6'2"
  190.5: 112.0,  // 6'3"
  193.0: 115.2,  // 6'4"
}
```

### 6.3 Funções de Cálculo

```javascript
function calcularIdeaisClassicPhysique(medidas) {
  const { altura, punho, cintura, tornozelo } = medidas
  
  // Fator de escala baseado na altura vs CBum
  const fatorAltura = altura / CLASSIC_PHYSIQUE.CBUM_ALTURA
  
  // Braço ideal escalado
  const braco_ideal = fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO
  
  // Panturrilha baseada no braço
  const panturrilha_ideal = braco_ideal * CLASSIC_PHYSIQUE.PANTURRILHA_BRACO
  
  return {
    // 1. OMBROS: 1.70 × Cintura
    ombros: cintura * CLASSIC_PHYSIQUE.OMBROS_CINTURA,
    
    // 2. PEITORAL: 7.0 × Punho
    peitoral: punho * CLASSIC_PHYSIQUE.PEITO_PUNHO,
    
    // 3. BRAÇO: Escalado do CBum
    braco: braco_ideal,
    
    // 4. ANTEBRAÇO: 80% do Braço
    antebraco: braco_ideal * CLASSIC_PHYSIQUE.ANTEBRACO_BRACO,
    
    // 5. TRÍADE: Harmonia (não exata)
    triade: {
      valor_ideal: braco_ideal,
      pescoco: braco_ideal,
      panturrilha: panturrilha_ideal,
      regra: 'Pescoço ≈ Braço ≈ Panturrilha',
    },
    
    // 6. CINTURA: 0.42 × Altura (MUITO apertada)
    cintura: altura * CLASSIC_PHYSIQUE.CINTURA_ALTURA,
    
    // 7. COXA: 0.97 × Cintura ideal
    coxa: (altura * CLASSIC_PHYSIQUE.CINTURA_ALTURA) * CLASSIC_PHYSIQUE.COXA_CINTURA,
    
    // 8. COXA/PANTURRILHA: 1.5:1
    coxa_panturrilha: {
      coxa_ideal: panturrilha_ideal * CLASSIC_PHYSIQUE.COXA_PANTURRILHA,
      panturrilha_ref: panturrilha_ideal,
      ratio: CLASSIC_PHYSIQUE.COXA_PANTURRILHA,
    },
    
    // 9. PANTURRILHA: 0.96 × Braço
    panturrilha: panturrilha_ideal,
    
    // 10. COSTAS: 1.6 × Cintura
    costas: cintura * 1.6,
    
    // Peso máximo da categoria
    peso_maximo: getPesoMaximoClassic(altura),
  }
}

function getPesoMaximoClassic(altura_cm) {
  const alturas = Object.keys(CLASSIC_WEIGHT_LIMITS).map(Number).sort((a, b) => a - b)
  
  if (altura_cm <= alturas[0]) return CLASSIC_WEIGHT_LIMITS[alturas[0]]
  if (altura_cm >= alturas[alturas.length - 1]) return CLASSIC_WEIGHT_LIMITS[alturas[alturas.length - 1]]
  
  // Interpolação linear
  for (let i = 0; i < alturas.length - 1; i++) {
    if (altura_cm >= alturas[i] && altura_cm < alturas[i + 1]) {
      const h1 = alturas[i], h2 = alturas[i + 1]
      const w1 = CLASSIC_WEIGHT_LIMITS[h1], w2 = CLASSIC_WEIGHT_LIMITS[h2]
      const fator = (altura_cm - h1) / (h2 - h1)
      return Math.round((w1 + (w2 - w1) * fator) * 10) / 10
    }
  }
}
```

### 6.4 Cálculo de Score

```javascript
function calcularScoreClassicPhysique(medidas) {
  const ideais = calcularIdeaisClassicPhysique(medidas)
  
  // Pesos ajustados (cintura MUITO importante)
  const pesos = {
    ombros: 18,
    peitoral: 14,
    braco: 16,
    antebraco: 4,
    triade: 8,
    cintura: 16,          // Cintura é crucial no Classic
    coxa: 10,
    coxa_panturrilha: 6,
    panturrilha: 8,
  }
  
  const scores = {}
  
  scores.ombros = calcularScoreProporcional(medidas.ombros, ideais.ombros, pesos.ombros)
  scores.peitoral = calcularScoreProporcional(medidas.peitoral, ideais.peitoral, pesos.peitoral)
  scores.braco = calcularScoreProporcional(medidas.braco, ideais.braco, pesos.braco)
  scores.antebraco = calcularScoreProporcional(medidas.antebraco, ideais.antebraco, pesos.antebraco)
  scores.triade = calcularScoreTriade(medidas.pescoco, medidas.braco, medidas.panturrilha, pesos.triade)
  scores.cintura = calcularScoreInverso(medidas.cintura, ideais.cintura, pesos.cintura)
  scores.coxa = calcularScoreProporcional(medidas.coxa, ideais.coxa, pesos.coxa)
  scores.coxa_panturrilha = calcularScoreRatio(medidas.coxa, medidas.panturrilha, 1.5, pesos.coxa_panturrilha)
  scores.panturrilha = calcularScoreProporcional(medidas.panturrilha, ideais.panturrilha, pesos.panturrilha)
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    categoria: 'Classic Physique',
    icon: '🏆',
    referencia: CLASSIC_PHYSIQUE.reference.nome,
    scores_detalhados: scores,
    score_total: Math.round(scoreTotal * 100) / 100,
    ideais,
    diferencas: calcularDiferencas(medidas, ideais),
    peso_maximo_categoria: ideais.peso_maximo,
    peso_atual: medidas.peso,
    dentro_do_limite: medidas.peso <= ideais.peso_maximo,
  }
}
```

---

## 7. FÓRMULAS DETALHADAS - MEN'S PHYSIQUE 🏖️

### 7.1 Referência

```
┌─────────────────────────────────────────────────────────────────┐
│                  MEN'S PHYSIQUE - REFERÊNCIA                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RYAN TERRY                                                     │
│  3x Mr. Olympia Men's Physique (2023, 2024, 2025)               │
│                                                                 │
│  MEDIDAS (aproximadas):                                         │
│  • Altura: 178 cm (5'10")                                       │
│  • Peso: 88-93 kg (195-205 lbs) - stage                         │
│  • Cintura: ~81 cm (32")                                        │
│  • Braço: ~43 cm (17")                                          │
│  • BF% stage: 5-7%                                              │
│                                                                 │
│  CARACTERÍSTICAS:                                               │
│  • V-Taper SUAVE (não extremo)                                  │
│  • Deltóides 3D (caps arredondados)                             │
│  • Cintura fina mas não "vacuum"                                │
│  • Pernas NÃO JULGADAS (usa board shorts)                       │
│  • Foco em estética "beach body"                                │
│  • Sem poses obrigatórias de pernas                             │
│                                                                 │
│  V-TAPER: Ombros/Cintura = 1.55                                 │
│                                                                 │
│  NOTA: Categoria mais popular do IFBB                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Constantes

```javascript
const MENS_PHYSIQUE = {
  // Identificação
  name: "Men's Physique",
  icon: '🏖️',
  
  // Referência
  reference: {
    nome: 'Ryan Terry',
    titulos: "3x Mr. Olympia Men's Physique",
    altura: 178,
    peso_stage: 93,
    braco: 43,
  },
  
  // Proporções
  OMBROS_CINTURA: 1.55,        // V-Taper mais suave
  PEITO_PUNHO: 6.2,            // Peitoral moderado
  CINTURA_ALTURA: 0.455,       // Cintura menos extrema
  ANTEBRACO_BRACO: 0.80,
  
  // Referência para escalar braço
  RYAN_ALTURA: 178,
  RYAN_BRACO: 43,
  
  // Pernas NÃO são julgadas
  PERNAS_JULGADAS: false,
  
  // Tríade não aplicável
  TRIADE: {
    enabled: false,
    descricao: 'N/A - Foco em upper body',
  },
  
  // Gordura corporal
  BF_MIN: 5,
  BF_MAX: 8,
  BF_IDEAL: 6,
}
```

### 7.3 Funções de Cálculo

```javascript
function calcularIdeaisMensPhysique(medidas) {
  const { altura, punho, cintura, tornozelo } = medidas
  
  // Fator de escala
  const fatorAltura = altura / MENS_PHYSIQUE.RYAN_ALTURA
  
  // Braço ideal escalado
  const braco_ideal = fatorAltura * MENS_PHYSIQUE.RYAN_BRACO
  
  return {
    // 1. OMBROS: 1.55 × Cintura
    ombros: cintura * MENS_PHYSIQUE.OMBROS_CINTURA,
    
    // 2. PEITORAL: 6.2 × Punho
    peitoral: punho * MENS_PHYSIQUE.PEITO_PUNHO,
    
    // 3. BRAÇO: Escalado do Ryan
    braco: braco_ideal,
    
    // 4. ANTEBRAÇO: 80% do Braço
    antebraco: braco_ideal * MENS_PHYSIQUE.ANTEBRACO_BRACO,
    
    // 5. TRÍADE: N/A
    triade: null,
    triade_nota: 'Não aplicável - foco em upper body',
    
    // 6. CINTURA: 0.455 × Altura
    cintura: altura * MENS_PHYSIQUE.CINTURA_ALTURA,
    
    // 7. COXA: N/A - Não julgada
    coxa: null,
    coxa_nota: 'Não julgada - usa board shorts',
    
    // 8. COXA/PANTURRILHA: N/A
    coxa_panturrilha: null,
    
    // 9. PANTURRILHA: Estética geral (opcional)
    panturrilha: tornozelo * 1.8,
    panturrilha_nota: 'Estética geral, pouco peso no score',
    
    // 10. COSTAS: 1.5 × Cintura
    costas: cintura * 1.5,
  }
}
```

### 7.4 Cálculo de Score

```javascript
function calcularScoreMensPhysique(medidas) {
  const ideais = calcularIdeaisMensPhysique(medidas)
  
  // Pesos (foco em upper body - coxa e tríade = 0)
  const pesos = {
    ombros: 25,           // Deltóides são destaque
    peitoral: 22,
    braco: 25,            // Braços são destaque
    antebraco: 6,
    triade: 0,            // NÃO JULGADA
    cintura: 17,
    coxa: 0,              // NÃO JULGADA
    coxa_panturrilha: 0,  // NÃO JULGADA
    panturrilha: 5,       // Estética geral
  }
  
  const scores = {}
  
  scores.ombros = calcularScoreProporcional(medidas.ombros, ideais.ombros, pesos.ombros)
  scores.peitoral = calcularScoreProporcional(medidas.peitoral, ideais.peitoral, pesos.peitoral)
  scores.braco = calcularScoreProporcional(medidas.braco, ideais.braco, pesos.braco)
  scores.antebraco = calcularScoreProporcional(medidas.antebraco, ideais.antebraco, pesos.antebraco)
  scores.triade = 0
  scores.cintura = calcularScoreInverso(medidas.cintura, ideais.cintura, pesos.cintura)
  scores.coxa = 0
  scores.coxa_panturrilha = 0
  scores.panturrilha = calcularScoreProporcional(medidas.panturrilha, ideais.panturrilha, pesos.panturrilha)
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    categoria: "Men's Physique",
    icon: '🏖️',
    referencia: MENS_PHYSIQUE.reference.nome,
    scores_detalhados: scores,
    score_total: Math.round(scoreTotal * 100) / 100,
    ideais,
    diferencas: calcularDiferencas(medidas, ideais),
    notas: {
      coxa: 'Não julgada - usa board shorts',
      coxa_panturrilha: 'Não julgada',
      triade: 'Não aplicável nesta categoria',
      foco: 'Deltóides 3D, braços, V-taper moderado, aparência de praia',
    },
  }
}
```

---

## 8. FÓRMULAS DETALHADAS - OPEN BODYBUILDING 👑 (NOVO)

### 8.1 Referência

```
┌─────────────────────────────────────────────────────────────────┐
│                 OPEN BODYBUILDING - REFERÊNCIA                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  DEREK LUNSFORD                                                 │
│  Mr. Olympia 2024 (Open Bodybuilding)                           │
│  Também foi campeão 212 Olympia 2021                            │
│                                                                 │
│  MEDIDAS (competição):                                          │
│  • Altura: 166 cm (5'5") - relativamente baixo                  │
│  • Peso: 104+ kg (230+ lbs) - stage                             │
│  • Peso off-season: ~125 kg (275 lbs)                           │
│  • Peitoral: ~140+ cm (55"+)                                    │
│  • Cintura: ~73 cm (29") - muito apertada para o tamanho        │
│  • Braço: ~56 cm (22")                                          │
│  • Coxa: ~79 cm (31")                                           │
│  • Panturrilha: ~51 cm (20")                                    │
│  • BF% stage: 2-4%                                              │
│                                                                 │
│  CARACTERÍSTICAS:                                               │
│  • Massa muscular MÁXIMA                                        │
│  • Simetria e proporções mesmo com tamanho extremo              │
│  • Condicionamento extremo (veins, striations)                  │
│  • Cintura relativamente pequena para o tamanho                 │
│  • Pernas MUITO desenvolvidas                                   │
│  • Poses obrigatórias completas (front/back lat spread, etc)    │
│                                                                 │
│  V-TAPER: Ombros/Cintura = 1.75+                                │
│                                                                 │
│  NOTA: Categoria de maior prestígio do bodybuilding             │
│                                                                 │
│  OUTROS CAMPEÕES RECENTES:                                      │
│  • Hadi Choopan (2023) - 170cm, 102kg                           │
│  • Big Ramy (2020, 2021) - 180cm, 136kg                         │
│  • Brandon Curry (2019) - 175cm, 114kg                          │
│  • Shawn Rhoden (2018) - 178cm, 113kg                           │
│  • Phil Heath (7x) - 175cm, 111kg                               │
│  • Ronnie Coleman (8x) - 180cm, 136kg                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Constantes

```javascript
const OPEN_BODYBUILDING = {
  // Identificação
  name: 'Open Bodybuilding',
  icon: '👑',
  
  // Referência principal (atual campeão)
  reference: {
    nome: 'Derek Lunsford',
    titulos: 'Mr. Olympia 2024',
    altura: 166,
    peso_stage: 104,
    peso_off: 125,
    braco: 56,
    cintura: 73,
    coxa: 79,
    panturrilha: 51,
    peitoral: 140,
  },
  
  // Referências históricas (para escalar)
  referencias_historicas: [
    { nome: 'Ronnie Coleman', altura: 180, peso: 136, braco: 61 },
    { nome: 'Phil Heath', altura: 175, peso: 111, braco: 58 },
    { nome: 'Big Ramy', altura: 180, peso: 136, braco: 60 },
    { nome: 'Dorian Yates', altura: 178, peso: 121, braco: 54 },
    { nome: 'Arnold Schwarzenegger', altura: 188, peso: 107, braco: 56 },
  ],
  
  // Proporções (MAIS AGRESSIVAS que Classic)
  OMBROS_CINTURA: 1.75,        // V-Taper mais extremo
  PEITO_PUNHO: 7.5,            // Peitoral MUITO desenvolvido
  CINTURA_ALTURA: 0.44,        // Cintura apertada (mas aceita maior que Classic)
  COXA_JOELHO: 1.85,           // Coxas MUITO desenvolvidas
  COXA_PANTURRILHA: 1.55,      // Proporção pernas
  PANTURRILHA_BRACO: 0.98,     // Panturrilha quase igual ao braço
  ANTEBRACO_BRACO: 0.78,       // Antebraço ligeiramente menor (braços enormes)
  COSTAS_CINTURA: 1.70,        // Costas muito largas
  
  // Referência para escalar braço
  DEREK_ALTURA: 166,
  DEREK_BRACO: 56,             // 56cm de braço!
  
  // Tríade
  TRIADE: {
    enabled: true,
    descricao: 'Pescoço ≈ Braço ≈ Panturrilha (menos rígido)',
  },
  
  // Gordura corporal (EXTREMAMENTE baixa)
  BF_MIN: 2,
  BF_MAX: 5,
  BF_IDEAL: 3,
  
  // Sem limite de peso (diferente do Classic)
  PESO_LIMITE: null,
}
```

### 8.3 Funções de Cálculo

```javascript
function calcularIdeaisOpenBodybuilding(medidas) {
  const { altura, punho, cintura, tornozelo, joelho } = medidas
  
  // Fator de escala baseado na altura vs Derek Lunsford
  const fatorAltura = altura / OPEN_BODYBUILDING.DEREK_ALTURA
  
  // Braço ideal escalado (MUITO grande)
  const braco_ideal = fatorAltura * OPEN_BODYBUILDING.DEREK_BRACO
  
  // Panturrilha baseada no braço
  const panturrilha_ideal = braco_ideal * OPEN_BODYBUILDING.PANTURRILHA_BRACO
  
  // Cintura ideal
  const cintura_ideal = altura * OPEN_BODYBUILDING.CINTURA_ALTURA
  
  return {
    // 1. OMBROS: 1.75 × Cintura (V-Taper extremo)
    ombros: cintura * OPEN_BODYBUILDING.OMBROS_CINTURA,
    
    // 2. PEITORAL: 7.5 × Punho (muito desenvolvido)
    peitoral: punho * OPEN_BODYBUILDING.PEITO_PUNHO,
    
    // 3. BRAÇO: Escalado do Derek (MUITO grande)
    braco: braco_ideal,
    
    // 4. ANTEBRAÇO: 78% do Braço
    antebraco: braco_ideal * OPEN_BODYBUILDING.ANTEBRACO_BRACO,
    
    // 5. TRÍADE: Harmonia (menos rígido que Golden)
    triade: {
      valor_ideal: braco_ideal,
      pescoco: braco_ideal * 0.95, // Pescoço pode ser ligeiramente menor
      panturrilha: panturrilha_ideal,
      regra: 'Pescoço ≈ Braço ≈ Panturrilha',
    },
    
    // 6. CINTURA: 0.44 × Altura
    cintura: cintura_ideal,
    
    // 7. COXA: 1.85 × Joelho (MUITO desenvolvida)
    coxa: joelho * OPEN_BODYBUILDING.COXA_JOELHO,
    
    // 8. COXA/PANTURRILHA: 1.55:1
    coxa_panturrilha: {
      coxa_ideal: panturrilha_ideal * OPEN_BODYBUILDING.COXA_PANTURRILHA,
      panturrilha_ref: panturrilha_ideal,
      ratio: OPEN_BODYBUILDING.COXA_PANTURRILHA,
    },
    
    // 9. PANTURRILHA: 0.98 × Braço
    panturrilha: panturrilha_ideal,
    
    // 10. COSTAS: 1.7 × Cintura (muito largas)
    costas: cintura * OPEN_BODYBUILDING.COSTAS_CINTURA,
    
    // Sem limite de peso
    peso_maximo: null,
    peso_nota: 'Sem limite - categoria Open',
  }
}
```

### 8.4 Cálculo de Score

```javascript
function calcularScoreOpenBodybuilding(medidas) {
  const ideais = calcularIdeaisOpenBodybuilding(medidas)
  
  // Pesos (FOCO EM TAMANHO + PROPORÇÃO)
  // Pernas são MUITO importantes no Open
  const pesos = {
    ombros: 16,
    peitoral: 14,
    braco: 14,
    antebraco: 4,
    triade: 6,
    cintura: 12,
    coxa: 14,             // Pernas MUITO importantes
    coxa_panturrilha: 8,
    panturrilha: 8,
    costas: 4,
  }
  
  const scores = {}
  
  scores.ombros = calcularScoreProporcional(medidas.ombros, ideais.ombros, pesos.ombros)
  scores.peitoral = calcularScoreProporcional(medidas.peitoral, ideais.peitoral, pesos.peitoral)
  scores.braco = calcularScoreProporcional(medidas.braco, ideais.braco, pesos.braco)
  scores.antebraco = calcularScoreProporcional(medidas.antebraco, ideais.antebraco, pesos.antebraco)
  scores.triade = calcularScoreTriade(medidas.pescoco, medidas.braco, medidas.panturrilha, pesos.triade)
  scores.cintura = calcularScoreInverso(medidas.cintura, ideais.cintura, pesos.cintura)
  scores.coxa = calcularScoreProporcional(medidas.coxa, ideais.coxa, pesos.coxa)
  scores.coxa_panturrilha = calcularScoreRatio(medidas.coxa, medidas.panturrilha, 1.55, pesos.coxa_panturrilha)
  scores.panturrilha = calcularScoreProporcional(medidas.panturrilha, ideais.panturrilha, pesos.panturrilha)
  scores.costas = calcularScoreProporcional(medidas.costas || medidas.ombros * 0.95, ideais.costas, pesos.costas)
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    categoria: 'Open Bodybuilding',
    icon: '👑',
    referencia: OPEN_BODYBUILDING.reference.nome,
    scores_detalhados: scores,
    score_total: Math.round(scoreTotal * 100) / 100,
    ideais,
    diferencas: calcularDiferencas(medidas, ideais),
    notas: {
      peso: 'Sem limite de peso - categoria Open',
      foco: 'Massa muscular máxima + simetria + condicionamento extremo',
      pernas: 'Pernas são ESSENCIAIS - maior peso no score que outras categorias',
      condicionamento: 'BF% esperado: 2-5% em competição',
    },
  }
}
```

---

## 9. FUNÇÕES AUXILIARES

### 9.1 Cálculo de Score Proporcional

```javascript
/**
 * Score proporcional: quanto mais próximo do ideal, melhor
 * 100% = igual ou maior que o ideal
 */
function calcularScoreProporcional(atual, ideal, peso) {
  if (!atual || !ideal || ideal === 0) return 0
  const percentual = Math.min(100, (atual / ideal) * 100)
  return percentual * (peso / 100)
}
```

### 9.2 Cálculo de Score Inverso (Cintura)

```javascript
/**
 * Score inverso: menor é melhor (usado para cintura)
 * 100% se igual ou menor que o ideal
 */
function calcularScoreInverso(atual, ideal, peso) {
  if (!atual || !ideal) return 0
  if (atual <= ideal) return peso // 100% se igual ou menor
  const percentual = (ideal / atual) * 100
  return percentual * (peso / 100)
}
```

### 9.3 Cálculo de Score da Tríade

```javascript
/**
 * Tríade Clássica: Pescoço = Braço = Panturrilha
 * Score baseado na simetria entre as três medidas
 */
function calcularScoreTriade(pescoco, braco, panturrilha, peso) {
  if (!pescoco || !braco || !panturrilha) return 0
  
  // Média das medidas
  const media = (pescoco + braco + panturrilha) / 3
  
  // Desvio de cada medida em relação à média
  const desvios = [
    Math.abs(pescoco - media) / media,
    Math.abs(braco - media) / media,
    Math.abs(panturrilha - media) / media,
  ]
  
  // Média dos desvios (0 = perfeito)
  const desvioMedio = desvios.reduce((a, b) => a + b, 0) / 3
  
  // Converter para score (100% se desvio = 0)
  const percentual = Math.max(0, (1 - desvioMedio) * 100)
  return percentual * (peso / 100)
}
```

### 9.4 Cálculo de Score de Razão

```javascript
/**
 * Score de razão: quão próximo está da razão ideal
 * Usado para Coxa/Panturrilha
 */
function calcularScoreRatio(medida1, medida2, ratioIdeal, peso) {
  if (!medida1 || !medida2 || medida2 === 0) return 0
  
  const ratioAtual = medida1 / medida2
  const diff = Math.abs(ratioAtual - ratioIdeal) / ratioIdeal
  const percentual = Math.max(0, (1 - diff) * 100)
  
  return percentual * (peso / 100)
}
```

### 9.5 Cálculo de Diferenças

```javascript
/**
 * Calcula diferença entre medidas atuais e ideais
 */
function calcularDiferencas(atuais, ideais) {
  const diffs = {}
  
  for (const [key, ideal] of Object.entries(ideais)) {
    if (typeof ideal === 'number' && atuais[key]) {
      const diferenca = Math.round((ideal - atuais[key]) * 10) / 10
      diffs[key] = {
        atual: atuais[key],
        ideal: ideal,
        diferenca: Math.abs(diferenca),
        necessario: diferenca > 0 ? 'aumentar' : diferenca < 0 ? 'diminuir' : 'manter',
        percentual: Math.round((atuais[key] / ideal) * 100),
      }
    }
  }
  
  return diffs
}
```

---

## 10. CÁLCULO DE GORDURA CORPORAL

### 10.1 Método Navy (US Navy)

```javascript
/**
 * Fórmula Navy para HOMENS
 */
function calcularBFNavyMasculino(altura, cintura, pescoco) {
  // BF% = 86.010 × log10(cintura - pescoço) - 70.041 × log10(altura) + 36.76
  const bf = 86.010 * Math.log10(cintura - pescoco) 
             - 70.041 * Math.log10(altura) 
             + 36.76
  
  return Math.max(0, Math.min(50, Math.round(bf * 10) / 10))
}
```

### 10.2 Método Pollock 7 Dobras

```javascript
/**
 * Fórmula Jackson-Pollock para HOMENS (7 dobras)
 */
function calcularBFPollock7Masculino(dobras, idade) {
  const { triceps, subescapular, peitoral, axilar, suprailíaca, abdominal, coxa } = dobras
  
  // Soma das 7 dobras
  const soma = triceps + subescapular + peitoral + axilar + suprailíaca + abdominal + coxa
  
  // Densidade corporal (fórmula para homens)
  const densidade = 1.112 
                    - (0.00043499 * soma) 
                    + (0.00000055 * soma * soma) 
                    - (0.00028826 * idade)
  
  // Percentual de gordura (Siri equation)
  const bf = (495 / densidade) - 450
  
  return Math.max(0, Math.min(50, Math.round(bf * 10) / 10))
}
```

### 10.3 Classificação de BF% Masculino

```javascript
// Categorias baseadas no padrão ACE (American Council on Exercise)
// Atualizado em 2026-02-27 para corrigir limiar do Fitness (era <18, agora <17)
const CLASSIFICACAO_BF_MASCULINO = {
  essencial: { min: 0, max: 6, label: 'Essencial', descricao: 'Gordura essencial para funções vitais' },
  atletico: { min: 6, max: 13, label: 'Atleta', descricao: 'Físico atlético / competição' },
  fitness: { min: 13, max: 17, label: 'Fitness', descricao: 'Fitness / Saudável' },
  aceitavel: { min: 17, max: 25, label: 'Aceitável', descricao: 'Faixa aceitável' },
  acima: { min: 25, max: 30, label: 'Acima', descricao: 'Acima do recomendado' },
  obesidade: { min: 30, max: 100, label: 'Obesidade', descricao: 'Obesidade' },
}

const CLASSIFICACAO_BF_FEMININO = {
  essencial: { min: 0, max: 14, label: 'Essencial', descricao: 'Gordura essencial para funções vitais' },
  atletico: { min: 14, max: 21, label: 'Atleta', descricao: 'Físico atlético / competição' },
  fitness: { min: 21, max: 25, label: 'Fitness', descricao: 'Fitness / Saudável' },
  aceitavel: { min: 25, max: 32, label: 'Aceitável', descricao: 'Faixa aceitável' },
  acima: { min: 32, max: 39, label: 'Acima', descricao: 'Acima do recomendado' },
  obesidade: { min: 39, max: 100, label: 'Obesidade', descricao: 'Obesidade' },
}

function classificarBF(bf, categorias) {
  for (const [nivel, range] of Object.entries(categorias)) {
    if (bf >= range.min && bf < range.max) {
      return { nivel, label: range.label, descricao: range.descricao, faixa: `${range.min}-${range.max}%` }
    }
  }
  return { nivel: 'indefinido', label: 'Indefinido', descricao: 'Valor fora do range' }
}
```

---

## 11. CALCULADORA COMPLETA

### 11.1 Função Principal

```javascript
function calcularTodasProporcoesMasculino(medidas) {
  // Validar medidas
  const validacao = validarMedidas(medidas)
  if (!validacao.valido) {
    return { erro: true, mensagem: validacao.erros }
  }
  
  // Calcular para as 4 categorias
  const goldenRatio = calcularScoreGoldenRatio(medidas)
  const classicPhysique = calcularScoreClassicPhysique(medidas)
  const mensPhysique = calcularScoreMensPhysique(medidas)
  const openBodybuilding = calcularScoreOpenBodybuilding(medidas)
  
  // Ranking de categorias
  const categorias = [
    { nome: 'Golden Ratio', icon: '🏛️', score: goldenRatio.score_total },
    { nome: 'Classic Physique', icon: '🏆', score: classicPhysique.score_total },
    { nome: "Men's Physique", icon: '🏖️', score: mensPhysique.score_total },
    { nome: 'Open Bodybuilding', icon: '👑', score: openBodybuilding.score_total },
  ].sort((a, b) => b.score - a.score)
  
  // Calcular gordura corporal
  const bf_navy = medidas.pescoco 
    ? calcularBFNavyMasculino(medidas.altura, medidas.cintura, medidas.pescoco)
    : null
  
  // Calcular V-Taper atual
  const vTaper = medidas.ombros / medidas.cintura
  
  return {
    medidas_input: medidas,
    genero: 'masculino',
    
    metricas_principais: {
      vTaper: {
        atual: Math.round(vTaper * 1000) / 1000,
        classificacao: classificarVTaper(vTaper),
      },
      peso: medidas.peso,
      altura: medidas.altura,
    },
    
    gordura_corporal: bf_navy ? {
      navy: bf_navy,
      classificacao: classificarBFMasculino(bf_navy),
    } : null,
    
    resultados: {
      golden_ratio: goldenRatio,
      classic_physique: classicPhysique,
      mens_physique: mensPhysique,
      open_bodybuilding: openBodybuilding,
    },
    
    recomendacao: {
      melhor_categoria: categorias[0].nome,
      icon: categorias[0].icon,
      score: categorias[0].score,
      ranking: categorias,
    },
    
    classificacao: getClassificacao(categorias[0].score),
  }
}
```

### 11.2 Classificação de V-Taper

```javascript
function classificarVTaper(ratio) {
  if (ratio >= 1.70) return { nivel: 'ELITE', emoji: '👑', descricao: 'V-Taper excepcional' }
  if (ratio >= 1.618) return { nivel: 'GOLDEN', emoji: '🏛️', descricao: 'Proporção áurea' }
  if (ratio >= 1.55) return { nivel: 'ATLÉTICO', emoji: '💪', descricao: 'V-Taper atlético' }
  if (ratio >= 1.45) return { nivel: 'BOM', emoji: '👍', descricao: 'Boa proporção' }
  if (ratio >= 1.35) return { nivel: 'NORMAL', emoji: '📊', descricao: 'Proporção normal' }
  return { nivel: 'BLOCO', emoji: '🧱', descricao: 'Pouco V-Taper' }
}
```

### 11.3 Classificação Geral

```javascript
function getClassificacao(score) {
  if (score >= 95) return { nivel: 'ELITE', emoji: '👑', descricao: 'Proporções excepcionais' }
  if (score >= 85) return { nivel: 'AVANÇADO', emoji: '🥇', descricao: 'Muito acima da média' }
  if (score >= 75) return { nivel: 'INTERMEDIÁRIO', emoji: '🥈', descricao: 'Boas proporções' }
  if (score >= 60) return { nivel: 'INICIANTE', emoji: '💪', descricao: 'Em desenvolvimento' }
  return { nivel: 'INICIANTE', emoji: '🚀', descricao: 'Início da jornada' }
}
```

### 11.4 Validação de Medidas

```javascript
function validarMedidas(medidas) {
  const obrigatorias = ['altura', 'punho', 'cintura', 'ombros', 'peitoral', 'braco']
  const erros = []
  
  for (const campo of obrigatorias) {
    if (!medidas[campo] || medidas[campo] <= 0) {
      erros.push(`${campo} é obrigatório`)
    }
  }
  
  // Validar ranges masculinos
  const limites = {
    altura: [150, 220],
    punho: [14, 22],
    tornozelo: [18, 30],
    cintura: [60, 130],
    ombros: [90, 170],
    peitoral: [80, 160],
    braco: [25, 65],
    antebraco: [20, 50],
    pescoco: [30, 55],
    coxa: [40, 90],
    panturrilha: [30, 60],
  }
  
  for (const [campo, [min, max]] of Object.entries(limites)) {
    if (medidas[campo] && (medidas[campo] < min || medidas[campo] > max)) {
      erros.push(`${campo} deve estar entre ${min} e ${max} cm`)
    }
  }
  
  return { valido: erros.length === 0, erros }
}
```

---

## 12. EXEMPLO DE USO COMPLETO

### 12.1 Input do Usuário

```javascript
const medidasUsuario = {
  // Dados básicos
  altura: 180,        // cm
  peso: 95,           // kg
  idade: 30,          // anos
  
  // Medidas estruturais
  punho: 17.5,        // cm
  tornozelo: 23,      // cm
  joelho: 38,         // cm
  pelve: 98,          // cm
  
  // Medidas variáveis
  cintura: 80,        // cm
  ombros: 125,        // cm
  peitoral: 115,      // cm
  costas: 125,        // cm
  braco: 42,          // cm
  antebraco: 34,      // cm
  pescoco: 41,        // cm
  coxa: 62,           // cm
  panturrilha: 40,    // cm
}
```

### 12.2 Output Esperado

```javascript
{
  medidas_input: { /* medidasUsuario */ },
  genero: 'masculino',
  
  metricas_principais: {
    vTaper: {
      atual: 1.563,
      classificacao: {
        nivel: 'ATLÉTICO',
        emoji: '💪',
        descricao: 'V-Taper atlético'
      }
    },
    peso: 95,
    altura: 180
  },
  
  gordura_corporal: {
    navy: 14.2,
    classificacao: {
      nivel: 'fitness',
      descricao: 'Fitness/Saudável',
      faixa: '13-17%'
    }
  },
  
  resultados: {
    golden_ratio: {
      categoria: 'Golden Ratio',
      icon: '🏛️',
      score_total: 84.2,
      ideais: {
        ombros: 129.4,    // 80 × 1.618
        peitoral: 113.8,  // 17.5 × 6.5
        braco: 44.1,      // 17.5 × 2.52
        // ...
      }
    },
    
    classic_physique: {
      categoria: 'Classic Physique',
      icon: '🏆',
      score_total: 79.5,
      peso_maximo_categoria: 97.5,
      dentro_do_limite: true,
      // ...
    },
    
    mens_physique: {
      categoria: "Men's Physique",
      icon: '🏖️',
      score_total: 88.3,
      notas: {
        coxa: 'Não julgada - usa board shorts',
        foco: 'Deltóides 3D, braços, V-taper moderado'
      },
      // ...
    },
    
    open_bodybuilding: {
      categoria: 'Open Bodybuilding',
      icon: '👑',
      score_total: 71.2,
      notas: {
        foco: 'Massa muscular máxima + simetria',
        pernas: 'Pernas precisam de mais desenvolvimento'
      },
      // ...
    }
  },
  
  recomendacao: {
    melhor_categoria: "Men's Physique",
    icon: '🏖️',
    score: 88.3,
    ranking: [
      { nome: "Men's Physique", icon: '🏖️', score: 88.3 },
      { nome: "Golden Ratio", icon: '🏛️', score: 84.2 },
      { nome: "Classic Physique", icon: '🏆', score: 79.5 },
      { nome: "Open Bodybuilding", icon: '👑', score: 71.2 }
    ]
  },
  
  classificacao: {
    nivel: 'AVANÇADO',
    emoji: '🥇',
    descricao: 'Muito acima da média'
  }
}
```

---

## 13. RESUMO COMPARATIVO DAS CATEGORIAS

### 13.1 Tabela de V-Taper Ideais

| Categoria | V-Taper (SWR) | Descrição |
|-----------|:-------------:|-----------|
| Men's Physique | 1.55 | Suave, estética de praia |
| Golden Ratio | 1.618 | Proporção áurea clássica |
| Classic Physique | 1.70 | Pronunciado, era de ouro moderna |
| Open Bodybuilding | 1.75+ | Extremo, massa máxima |

### 13.2 Tabela de BF% por Categoria

| Categoria | BF% Stage | BF% Off-Season |
|-----------|:---------:|:--------------:|
| Men's Physique | 5-8% | 10-15% |
| Golden Ratio | 8-12% | 12-18% |
| Classic Physique | 3-6% | 10-15% |
| Open Bodybuilding | 2-5% | 12-18% |

### 13.3 Características Distintivas

| Categoria | Característica Principal | Pernas | Cintura |
|-----------|-------------------------|:------:|:-------:|
| Men's Physique | Beach body, deltóides 3D | ❌ Não julgadas | Moderada |
| Golden Ratio | Harmonia matemática | ✅ Proporcionais | Proporcional |
| Classic Physique | Era de ouro moderna | ✅ Importantes | MUITO fina |
| Open Bodybuilding | Massa máxima | ✅ ESSENCIAIS | Fina (relativa) |

---

## 14. CONSIDERAÇÕES FINAIS

### 14.1 Observações Importantes

1. **Golden Ratio** é o padrão clássico de estética universal - ideal para quem busca proporções naturais
2. **Classic Physique** exige cintura MUITO apertada (0.42 × altura) e limite de peso
3. **Men's Physique** NÃO julga pernas (coxa e coxa/panturrilha têm peso 0 no score)
4. **Open Bodybuilding** é sobre TAMANHO máximo + simetria - pernas são essenciais
5. A **Tríade** (pescoço = braço = panturrilha) se aplica a todas exceto Men's Physique
6. **V-Taper** é a métrica mais visual - quanto maior, mais "estético"

### 14.2 Referências

| Categoria | Referência Principal | Stats |
|-----------|---------------------|-------|
| Golden Ratio | Steve Reeves | 185cm, 95kg |
| Classic Physique | Chris Bumstead | 185cm, 104kg, 6x Olympia |
| Men's Physique | Ryan Terry | 178cm, 93kg, 3x Olympia |
| Open Bodybuilding | Derek Lunsford | 166cm, 104kg, Mr. Olympia 2024 |

### 14.3 Histórico de Campeões Mr. Olympia (Open)

| Ano | Campeão | Altura | Peso Stage |
|-----|---------|:------:|:----------:|
| 2024 | Derek Lunsford | 166cm | 104kg |
| 2023 | Hadi Choopan | 170cm | 102kg |
| 2020-21 | Big Ramy | 180cm | 136kg |
| 2019 | Brandon Curry | 175cm | 114kg |
| 2011-18 | Phil Heath (7x) | 175cm | 111kg |
| 2006-07 | Jay Cutler | 175cm | 121kg |
| 1998-05 | Ronnie Coleman (8x) | 180cm | 136kg |
| 1992-97 | Dorian Yates (6x) | 178cm | 121kg |
| 1984-91 | Lee Haney (8x) | 180cm | 113kg |
| 1970-80 | Arnold (7x) | 188cm | 107kg |

---

## 15. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Jan/2026 | Versão inicial (Golden, Classic, Men's) |
| 2.0 | Fev/2026 | Revisão de fórmulas e constantes |
| 3.0 | Fev/2026 | Adição da categoria Open Bodybuilding (Derek Lunsford), revisão completa, funções auxiliares, exemplos detalhados |

---

**VITRU IA - Proporções Corporais Masculinas v3.0**  
*Golden Ratio • Classic Physique • Men's Physique • Open Bodybuilding*
