# SPEC: Calculadora de Proporções Corporais Femininas

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Aplicação:** VITRU IA - Análise de Físico e Proporções Corporais Femininas

---

## 1. VISÃO GERAL

Este documento especifica os cálculos e fórmulas para a calculadora de proporções corporais **femininas** com seis métodos de comparação:

1. **Golden Ratio Feminino (Padrão)** - Proporções áureas femininas naturais (WHR 0.70)
2. **Bikini** - Baseado em Lauralie Chapados (3x Olympia Bikini)
3. **Wellness** - Baseado em Francielle Mattos (2x Olympia Wellness)
4. **Figure** - Baseado em Cydney Gillon (5x Olympia Figure)
5. **Women's Physique** - Baseado em Sarah Villegas (2x Olympia WP)
6. **Women's Bodybuilding** - Baseado em Andrea Shaw (4x Ms. Olympia)

---

## 2. DIFERENÇAS FUNDAMENTAIS: MASCULINO VS FEMININO

### 2.1 Comparativo de Ideais

```
┌─────────────────────────────────────────────────────────────────┐
│            MASCULINO (V-Shape)    vs    FEMININO (X-Shape)      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OBJETIVO PRINCIPAL                                             │
│  ♂️ V-Taper: Ombros >>> Cintura                                  │
│  ♀️ Hourglass: Busto ≈ Quadril, Cintura fina                     │
│                                                                 │
│  MÉTRICA PRINCIPAL                                              │
│  ♂️ SWR (Shoulder-to-Waist): 1.618                               │
│  ♀️ WHR (Waist-to-Hip): 0.70                                     │
│                                                                 │
│  FOCO DE DESENVOLVIMENTO                                        │
│  ♂️ Ombros, Costas, Peito, Braços                                │
│  ♀️ Glúteos, Quadril, Cintura, Pernas                            │
│                                                                 │
│  FORMA IDEAL                                                    │
│  ♂️      ████████                  ♀️     ██████████              │
│       ██████████                       ████████████             │
│      ████████████                     ██████████████            │
│         ████                              ████                  │
│         ████                              ████                  │
│        ██████                          ████████████             │
│       ████████                        ██████████████            │
│      ██████████                      ████████████████           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Métricas Exclusivas Femininas

| Métrica | Sigla | Fórmula | Ideal | Descrição |
|---------|-------|---------|-------|-----------|
| **Waist-to-Hip Ratio** | WHR | Cintura ÷ Quadril | **0.70** | A proporção MAIS importante |
| **Waist-to-Chest Ratio** | WCR | Cintura ÷ Busto | **0.70** | Equilíbrio superior |
| **Shoulder-to-Hip Ratio** | SHR | Ombros ÷ Quadril | **0.90-1.0** | Diferente do masculino |
| **Hourglass Index** | HGI | (Busto + Quadril) ÷ (2 × Cintura) | **1.40-1.50** | Índice de ampulheta |
| **Thigh-to-Waist Ratio** | TWR | Coxa ÷ Cintura | **1.0-1.05** | Para Wellness |
| **Glute-to-Waist Ratio** | GWR | Glúteo ÷ Cintura | **1.60-1.70** | Proporção glúteo |

### 2.3 A Ciência do WHR 0.70

```typescript
/**
 * O WHR (Waist-to-Hip Ratio) de 0.70 é considerado universalmente 
 * atraente em estudos científicos cross-culturais.
 * 
 * Estudos de Referência:
 * - Singh (1993) - Evolutionary psychology
 * - Streeter & McBurney (2003) - Cross-cultural studies  
 * - Platek & Singh (2010) - Neuroimaging studies
 * 
 * Por que 0.70?
 * - Indica fertilidade e saúde hormonal
 * - Associado a níveis ideais de estrogênio
 * - Menor risco de doenças cardiovasculares
 * - Preferência cross-cultural consistente
 * 
 * Exemplos de celebridades com WHR ~0.70:
 * - Marilyn Monroe: 0.69
 * - Scarlett Johansson: 0.70
 * - Jessica Alba: 0.71
 * - Beyoncé: 0.69
 */
```

---

## 3. MEDIDAS NECESSÁRIAS (INPUT DA USUÁRIA)

### 3.1 Lista Completa de Medidas Obrigatórias

| # | Medida | Código | Unidade | Como Medir |
|---|--------|--------|---------|------------|
| 1 | **Altura** | `altura` | cm | Descalça, coluna ereta contra parede |
| 2 | **Peso** | `peso` | kg | Em jejum, pela manhã |
| 3 | **Busto** | `busto` | cm | Parte mais larga do peito, na altura dos mamilos |
| 4 | **Abaixo do Busto** | `abaixo_busto` | cm | Logo abaixo dos seios (para calcular busto real) |
| 5 | **Cintura** | `cintura` | cm | Parte mais estreita do abdômen (acima do umbigo) |
| 6 | **Quadril** | `quadril` | cm | Parte mais larga do quadril/glúteos |
| 7 | **Ombros** | `ombros` | cm | Ponto mais largo, braços relaxados |
| 8 | **Braço** | `braco` | cm | Bíceps relaxado, ponto mais grosso |
| 9 | **Antebraço** | `antebraco` | cm | Ponto mais grosso |
| 10 | **Punho** | `punho` | cm | Circunferência no osso proeminente |
| 11 | **Coxa** | `coxa` | cm | Ponto mais grosso, perna relaxada |
| 12 | **Joelho** | `joelho` | cm | Centro da patela, perna estendida |
| 13 | **Panturrilha** | `panturrilha` | cm | Ponto mais grosso |
| 14 | **Tornozelo** | `tornozelo` | cm | Parte mais fina, acima do osso |
| 15 | **Glúteo (Dobra)** | `gluteo_dobra` | cm | Circunferência na dobra do glúteo (para Wellness) |

### 3.2 Classificação das Medidas

**Medidas Estruturais (não mudam com treino):**
- Altura, Punho, Tornozelo, Joelho, Abaixo do Busto

**Medidas Variáveis (mudam com treino/dieta):**
- Peso, Busto, Cintura, Quadril, Ombros, Braço, Antebraço, Coxa, Panturrilha, Glúteo

### 3.3 Medidas Opcionais (7 Dobras Cutâneas)

| Dobra | Código | Unidade | Local |
|-------|--------|---------|-------|
| Tricipital | `dc_triceps` | mm | Parte posterior do braço |
| Subescapular | `dc_subescapular` | mm | Abaixo da escápula |
| Suprailíaca | `dc_suprailíaca` | mm | Acima do osso do quadril |
| Abdominal | `dc_abdominal` | mm | Ao lado do umbigo |
| Coxa | `dc_coxa` | mm | Parte frontal da coxa |
| Peitoral | `dc_peitoral` | mm | Diagonal entre axila e mamilo |
| Axilar Média | `dc_axilar` | mm | Linha vertical da axila |

---

## 4. QUADRO DE PROPORÇÕES: FÓRMULAS POR MÉTODO

### 4.1 Tabela Completa de Referência

| # | Proporção | Golden Ratio ♀️ | Bikini 🩱 | Wellness 🏃 | Figure 👙 | W. Physique 💪 |
|---|-----------|----------------|-----------|-------------|-----------|----------------|
| 1 | **WHR** | 0.70 | 0.68 | 0.62 | 0.70 | 0.72 |
| 2 | **WCR** | 0.70 | 0.70 | 0.72 | 0.70 | 0.72 |
| 3 | **SHR** | 0.95 | 0.95 | 0.85 | 1.00 | 1.05 |
| 4 | **SWR** | 1.40 | 1.45 | 1.35 | 1.50 | 1.55 |
| 5 | **Hourglass** | 1.45 | 1.45 | 1.55 | 1.40 | 1.35 |
| 6 | **TWR** | 0.95 | 0.93 | 1.05 | 0.95 | 0.92 |
| 7 | **GWR** | 1.60 | 1.55 | 1.70 | 1.55 | 1.50 |
| 8 | **BF% Ideal** | 18-23% | 12-16% | 14-18% | 10-14% | 8-12% |

### 4.2 Comparativo Visual das Categorias

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ESPECTRO DE CATEGORIAS FEMININAS                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ← MENOS MUSCULAR                                    MAIS MUSCULAR →         │
│                                                                              │
│  🩱 Bikini    🏃 Wellness    👙 Figure    💪 W.Physique    🏆 W.BB          │
│                                                                              │
│  WHR: 0.68     WHR: 0.62      WHR: 0.70    WHR: 0.72       WHR: N/A         │
│  BF: 12-16%    BF: 14-18%     BF: 10-14%   BF: 8-12%       BF: 6-10%        │
│                                                                              │
│  Foco:         Foco:          Foco:        Foco:           Foco:            │
│  Forma geral   Lower body     Simetria     Músculo +       Tamanho          │
│  Glúteos       Glúteos/Coxas  V-Taper      Feminilidade    máximo           │
│  Aparência     Cintura fina   Definição    Definição       Definição        │
│                                                                              │
│  POPULARIDADE: ★★★★★   ★★★★☆   ★★★☆☆   ★★☆☆☆   ★☆☆☆☆                       │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. FÓRMULAS DETALHADAS - GOLDEN RATIO FEMININO

### 5.1 Constantes

```javascript
const FEMALE_GOLDEN_RATIO = {
  // Razões principais
  WHR: 0.70,                    // Waist-to-Hip (MAIS IMPORTANTE)
  WCR: 0.70,                    // Waist-to-Chest  
  SHR: 0.95,                    // Shoulder-to-Hip
  SWR: 1.40,                    // Shoulder-to-Waist
  HOURGLASS_INDEX: 1.45,        // (Busto + Quadril) / (2 × Cintura)
  
  // Proporções de membros
  COXA_JOELHO: 1.60,            // Multiplicador coxa (menor que masculino)
  PANTURRILHA_TORNOZELO: 1.80,  // Multiplicador panturrilha
  BRACO_PUNHO: 2.20,            // Multiplicador braço (menor que masculino)
  ANTEBRACO_BRACO: 0.78,        // Proporção antebraço/braço
  
  // Proporções corporais
  BUSTO_QUADRIL: 0.97,          // Busto quase igual ao quadril
  OMBROS_QUADRIL: 0.95,         // Ombros levemente menores que quadril
  CINTURA_ALTURA: 0.38,         // Cintura ideal = 38% da altura
  
  // Gordura corporal
  BF_MIN: 18,
  BF_MAX: 23,
  BF_IDEAL: 20,
}
```

### 5.2 Funções de Cálculo

```javascript
function calcularIdeaisFemininoGoldenRatio(medidas) {
  const { altura, quadril, punho, tornozelo, joelho, abaixo_busto } = medidas
  
  // Calcular cintura ideal baseada no quadril
  const cintura_ideal = quadril * FEMALE_GOLDEN_RATIO.WHR
  
  // Calcular busto ideal (similar ao quadril para forma ampulheta)
  const busto_ideal = quadril * FEMALE_GOLDEN_RATIO.BUSTO_QUADRIL
  
  // Calcular ombros ideais (não muito largos)
  const ombros_ideal = quadril * FEMALE_GOLDEN_RATIO.OMBROS_QUADRIL
  
  // Calcular membros
  const braco_ideal = punho * FEMALE_GOLDEN_RATIO.BRACO_PUNHO
  const antebraco_ideal = braco_ideal * FEMALE_GOLDEN_RATIO.ANTEBRACO_BRACO
  const panturrilha_ideal = tornozelo * FEMALE_GOLDEN_RATIO.PANTURRILHA_TORNOZELO
  const coxa_ideal = joelho * FEMALE_GOLDEN_RATIO.COXA_JOELHO
  
  return {
    // Proporções principais
    cintura: cintura_ideal,
    busto: busto_ideal,
    ombros: ombros_ideal,
    
    // Razões calculadas
    whr_ideal: FEMALE_GOLDEN_RATIO.WHR,
    wcr_ideal: FEMALE_GOLDEN_RATIO.WCR,
    shr_ideal: FEMALE_GOLDEN_RATIO.SHR,
    hourglass_ideal: FEMALE_GOLDEN_RATIO.HOURGLASS_INDEX,
    
    // Membros
    braco: braco_ideal,
    antebraco: antebraco_ideal,
    coxa: coxa_ideal,
    panturrilha: panturrilha_ideal,
    
    // Composição corporal
    bf_ideal: {
      min: FEMALE_GOLDEN_RATIO.BF_MIN,
      max: FEMALE_GOLDEN_RATIO.BF_MAX,
      ideal: FEMALE_GOLDEN_RATIO.BF_IDEAL,
    },
  }
}
```

### 5.3 Cálculo de Score Golden Ratio Feminino

```javascript
function calcularScoreFemininoGoldenRatio(medidas) {
  const { busto, cintura, quadril, ombros, coxa, panturrilha } = medidas
  const ideais = calcularIdeaisFemininoGoldenRatio(medidas)
  
  // Calcular razões atuais
  const whr_atual = cintura / quadril
  const wcr_atual = cintura / busto
  const shr_atual = ombros / quadril
  const hourglass_atual = (busto + quadril) / (2 * cintura)
  
  // Pesos de cada proporção (total = 100)
  const pesos = {
    whr: 25,              // WHR é a métrica MAIS importante
    hourglass: 20,        // Índice ampulheta
    wcr: 15,              // Equilíbrio cintura-busto
    shr: 10,              // Ombros-quadril
    coxa: 12,             // Proporção de coxa
    panturrilha: 8,       // Proporção de panturrilha
    braco: 5,             // Braços (menos importante)
    simetria: 5,          // Simetria bilateral
  }
  
  let scores = {}
  
  // 1. WHR (quanto mais próximo de 0.70, melhor)
  scores.whr = calcularScoreProximidade(whr_atual, FEMALE_GOLDEN_RATIO.WHR, 0.10, pesos.whr)
  
  // 2. Hourglass Index (quanto mais próximo de 1.45, melhor)
  scores.hourglass = calcularScoreProximidade(hourglass_atual, FEMALE_GOLDEN_RATIO.HOURGLASS_INDEX, 0.15, pesos.hourglass)
  
  // 3. WCR (quanto mais próximo de 0.70, melhor)
  scores.wcr = calcularScoreProximidade(wcr_atual, FEMALE_GOLDEN_RATIO.WCR, 0.10, pesos.wcr)
  
  // 4. SHR (quanto mais próximo de 0.95, melhor)
  scores.shr = calcularScoreProximidade(shr_atual, FEMALE_GOLDEN_RATIO.SHR, 0.10, pesos.shr)
  
  // 5. Coxa
  scores.coxa = calcularScoreProporcional(coxa, ideais.coxa, pesos.coxa)
  
  // 6. Panturrilha
  scores.panturrilha = calcularScoreProporcional(panturrilha, ideais.panturrilha, pesos.panturrilha)
  
  // 7. Braço
  scores.braco = calcularScoreProporcional(medidas.braco, ideais.braco, pesos.braco)
  
  // 8. Simetria bilateral
  scores.simetria = calcularScoreSimetria(medidas, pesos.simetria)
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    scores_detalhados: scores,
    score_total: Math.round(scoreTotal * 100) / 100,
    ideais: ideais,
    razoes_atuais: {
      whr: whr_atual,
      wcr: wcr_atual,
      shr: shr_atual,
      hourglass: hourglass_atual,
    },
    diferencas: calcularDiferencasFeminino(medidas, ideais),
  }
}

// Função auxiliar: Score de proximidade (para razões)
function calcularScoreProximidade(atual, ideal, tolerancia, peso) {
  const diff = Math.abs(atual - ideal)
  const maxDiff = ideal * tolerancia
  
  let percentual
  if (diff <= maxDiff * 0.25) percentual = 100
  else if (diff <= maxDiff * 0.50) percentual = 90
  else if (diff <= maxDiff * 0.75) percentual = 75
  else if (diff <= maxDiff) percentual = 60
  else percentual = Math.max(0, 50 - (diff - maxDiff) * 200)
  
  return percentual * (peso / 100)
}

// Função auxiliar: Score proporcional (para medidas absolutas)
function calcularScoreProporcional(atual, ideal, peso) {
  const percentual = Math.min(100, (atual / ideal) * 100)
  return percentual * (peso / 100)
}
```

---

## 6. FÓRMULAS DETALHADAS - BIKINI 🩱

### 6.1 Constantes e Referência

```javascript
/**
 * REFERÊNCIA: Lauralie Chapados
 * - 3x Olympia Bikini Champion (2022, 2023, 2024)
 * - Altura: 163 cm
 * - Peso (stage): ~52-54 kg
 * - Conhecida por: Glúteos arredondados, cintura tiny, ombros com caps
 */

const BIKINI_CONSTANTS = {
  name: 'Bikini',
  icon: '🩱',
  reference: {
    name: 'Lauralie Chapados',
    titles: '3x Olympia Bikini',
    height: 163,
    weight_stage: 53,
    measurements: {
      busto: 86,
      cintura: 58,
      quadril: 88,
    },
  },
  
  // Razões alvo
  WHR_TARGET: 0.68,           // Cintura/Quadril (mais apertada)
  WCR_TARGET: 0.70,           // Cintura/Busto
  SHR_TARGET: 0.95,           // Ombros/Quadril (quase iguais)
  SWR_TARGET: 1.45,           // Ombros/Cintura
  HOURGLASS_TARGET: 1.47,     // (Busto+Quadril)/(2×Cintura)
  
  // Gordura corporal
  BF_MIN: 12,
  BF_MAX: 16,
  BF_IDEAL: 14,
  
  // Áreas de foco (julgamento)
  focusAreas: [
    'glutes',         // Glúteos arredondados e cheios
    'shoulders',      // Caps de deltóide
    'waist',          // Cintura fina
    'overall_shape',  // Forma geral (S-curve)
    'skin',           // Condição da pele
    'presentation',   // Apresentação/Pose
  ],
  
  // Critérios de julgamento IFBB
  judgingCriteria: {
    balance_symmetry: 25,     // Equilíbrio e simetria
    shape: 25,                // Forma (S-curve, ampulheta)
    skin_tone: 20,            // Condição da pele
    presentation: 15,         // Apresentação de palco
    muscle_tone: 15,          // Tônus muscular (não excessivo)
  },
  
  // Pesos do score VITRU IA
  weights: {
    whr: 0.25,                // WHR é crucial
    hourglass: 0.20,          // Forma ampulheta
    shoulders: 0.15,          // Caps arredondados
    glutes: 0.20,             // Glúteos arredondados
    legs: 0.10,               // Pernas proporcionais
    conditioning: 0.10,       // Condicionamento (não muito seco)
  },
}
```

### 6.2 Funções de Cálculo Bikini

```javascript
function calcularIdeaisBikini(medidas) {
  const { altura, quadril, punho, tornozelo, joelho } = medidas
  
  // Escalar baseado na referência
  const fator_escala = altura / BIKINI_CONSTANTS.reference.height
  
  // Cintura ideal (WHR de 0.68)
  const cintura_ideal = quadril * BIKINI_CONSTANTS.WHR_TARGET
  
  // Busto ideal (hourglass index)
  // (Busto + Quadril) / (2 × Cintura) = 1.47
  // Busto = (1.47 × 2 × Cintura) - Quadril
  const busto_ideal = (BIKINI_CONSTANTS.HOURGLASS_TARGET * 2 * cintura_ideal) - quadril
  
  // Ombros ideais
  const ombros_ideal = quadril * BIKINI_CONSTANTS.SHR_TARGET
  
  // Membros (proporcionais, não volumosos)
  const braco_ideal = punho * 2.15  // Menor que Golden Ratio
  const coxa_ideal = joelho * 1.55
  const panturrilha_ideal = tornozelo * 1.75
  
  // Glúteo ideal (proeminente)
  const gluteo_ideal = cintura_ideal * 1.55
  
  return {
    cintura: cintura_ideal,
    busto: busto_ideal,
    ombros: ombros_ideal,
    braco: braco_ideal,
    coxa: coxa_ideal,
    panturrilha: panturrilha_ideal,
    gluteo: gluteo_ideal,
    
    razoes: {
      whr: BIKINI_CONSTANTS.WHR_TARGET,
      wcr: BIKINI_CONSTANTS.WCR_TARGET,
      shr: BIKINI_CONSTANTS.SHR_TARGET,
      hourglass: BIKINI_CONSTANTS.HOURGLASS_TARGET,
    },
    
    bf: {
      min: BIKINI_CONSTANTS.BF_MIN,
      max: BIKINI_CONSTANTS.BF_MAX,
      ideal: BIKINI_CONSTANTS.BF_IDEAL,
    },
    
    peso_ideal: {
      min: Math.round((altura - 100) * 0.75),
      max: Math.round((altura - 100) * 0.85),
    },
  }
}

function calcularScoreBikini(medidas) {
  const ideais = calcularIdeaisBikini(medidas)
  const { busto, cintura, quadril, ombros, coxa, panturrilha, braco } = medidas
  
  // Razões atuais
  const whr = cintura / quadril
  const wcr = cintura / busto
  const shr = ombros / quadril
  const hourglass = (busto + quadril) / (2 * cintura)
  
  // Scores individuais
  const scores = {
    whr: calcularScoreProximidade(whr, BIKINI_CONSTANTS.WHR_TARGET, 0.08, 25),
    hourglass: calcularScoreProximidade(hourglass, BIKINI_CONSTANTS.HOURGLASS_TARGET, 0.12, 20),
    shoulders: calcularScoreProximidade(shr, BIKINI_CONSTANTS.SHR_TARGET, 0.10, 15),
    glutes: calcularScoreProporcional(medidas.gluteo_dobra || quadril * 0.7, ideais.gluteo, 20),
    legs: (calcularScoreProporcional(coxa, ideais.coxa, 5) + 
           calcularScoreProporcional(panturrilha, ideais.panturrilha, 5)),
    conditioning: 10, // Avaliado separadamente
  }
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    categoria: 'Bikini',
    icon: '🩱',
    referencia: BIKINI_CONSTANTS.reference.name,
    score_total: Math.round(scoreTotal * 100) / 100,
    scores_detalhados: scores,
    ideais: ideais,
    razoes_atuais: { whr, wcr, shr, hourglass },
    diferencas: calcularDiferencasBikini(medidas, ideais),
    recomendacoes: gerarRecomendacoesBikini(medidas, ideais),
  }
}
```

---

## 7. FÓRMULAS DETALHADAS - WELLNESS 🏃

### 7.1 Constantes e Referência

```javascript
/**
 * REFERÊNCIA: Francielle Mattos
 * - 2x Olympia Wellness Champion (2022, 2023)
 * - Altura: 158 cm
 * - Peso (stage): ~58-60 kg
 * - Conhecida por: Lower body extremamente desenvolvido, glúteos enormes
 * 
 * A categoria Wellness foi criada para mulheres com lower body naturalmente
 * mais desenvolvido. É a categoria que mais cresce no Brasil.
 */

const WELLNESS_CONSTANTS = {
  name: 'Wellness',
  icon: '🏃',
  reference: {
    name: 'Francielle Mattos',
    titles: '2x Olympia Wellness',
    height: 158,
    weight_stage: 59,
    measurements: {
      cintura: 60,
      quadril: 100,
      coxa: 63,
    },
  },
  
  // Razões alvo (WHR mais baixo = quadril maior)
  WHR_TARGET: 0.62,           // Cintura/Quadril MENOR (quadril dominante)
  WCR_TARGET: 0.72,           // Cintura/Busto
  SHR_TARGET: 0.85,           // Ombros/Quadril (ombros menores que quadril)
  SWR_TARGET: 1.35,           // Ombros/Cintura (V-Taper suave)
  HOURGLASS_TARGET: 1.55,     // Índice ampulheta MAIOR
  TWR_TARGET: 1.05,           // Coxa/Cintura (Coxa MAIOR que cintura)
  GWR_TARGET: 1.70,           // Glúteo/Cintura
  
  // Gordura corporal (um pouco maior - não muito seco)
  BF_MIN: 14,
  BF_MAX: 18,
  BF_IDEAL: 16,
  
  // Áreas de foco (julgamento) - 70% lower body!
  focusAreas: [
    'glutes',         // PRINCIPAL: Glúteos grandes e arredondados
    'thighs',         // Coxas desenvolvidas
    'hamstrings',     // Posterior de coxa
    'waist',          // Cintura fina (contraste)
    'lower_back',     // Lower back (lombares)
  ],
  
  // Critérios de julgamento IFBB
  judgingCriteria: {
    lower_body: 40,           // Lower body é 40%!
    glutes: 25,               // Glúteos especificamente
    waist: 15,                // Cintura fina
    upper_body: 10,           // Upper body (não deve ser grande)
    presentation: 10,         // Apresentação
  },
  
  // Pesos do score VITRU IA
  weights: {
    whr: 0.15,                // WHR importante mas não principal
    lowerBody: 0.40,          // MAIOR PESO - Lower body é o foco
    glutes: 0.20,             // Glúteos especificamente
    thighs: 0.15,             // Coxas
    waist: 0.10,              // Cintura fina
  },
}
```

### 7.2 Funções de Cálculo Wellness

```javascript
function calcularIdeaisWellness(medidas) {
  const { altura, quadril, punho, tornozelo, joelho, cintura } = medidas
  
  // Escalar baseado na referência
  const fator_escala = altura / WELLNESS_CONSTANTS.reference.height
  
  // Cintura ideal (WHR de 0.62 - quadril dominante)
  const cintura_ideal = quadril * WELLNESS_CONSTANTS.WHR_TARGET
  
  // Coxa ideal (MAIOR que cintura - diferencial da categoria)
  const coxa_ideal = cintura_ideal * WELLNESS_CONSTANTS.TWR_TARGET
  
  // Glúteo ideal (muito desenvolvido)
  const gluteo_ideal = cintura_ideal * WELLNESS_CONSTANTS.GWR_TARGET
  
  // Ombros ideais (menores que quadril)
  const ombros_ideal = quadril * WELLNESS_CONSTANTS.SHR_TARGET
  
  // Busto (proporcional, não é foco)
  const busto_ideal = cintura_ideal / WELLNESS_CONSTANTS.WCR_TARGET
  
  // Membros superiores (proporcionais, não volumosos)
  const braco_ideal = punho * 2.10
  
  // Panturrilha (proporcional às coxas desenvolvidas)
  const panturrilha_ideal = coxa_ideal * 0.65
  
  return {
    cintura: cintura_ideal,
    busto: busto_ideal,
    ombros: ombros_ideal,
    coxa: coxa_ideal,
    gluteo: gluteo_ideal,
    panturrilha: panturrilha_ideal,
    braco: braco_ideal,
    
    razoes: {
      whr: WELLNESS_CONSTANTS.WHR_TARGET,
      twr: WELLNESS_CONSTANTS.TWR_TARGET,
      gwr: WELLNESS_CONSTANTS.GWR_TARGET,
      shr: WELLNESS_CONSTANTS.SHR_TARGET,
      hourglass: WELLNESS_CONSTANTS.HOURGLASS_TARGET,
    },
    
    bf: {
      min: WELLNESS_CONSTANTS.BF_MIN,
      max: WELLNESS_CONSTANTS.BF_MAX,
      ideal: WELLNESS_CONSTANTS.BF_IDEAL,
    },
  }
}

function calcularScoreWellness(medidas) {
  const ideais = calcularIdeaisWellness(medidas)
  const { busto, cintura, quadril, ombros, coxa, panturrilha } = medidas
  const gluteo = medidas.gluteo_dobra || quadril * 0.70
  
  // Razões atuais
  const whr = cintura / quadril
  const twr = coxa / cintura        // Coxa/Cintura - DIFERENCIAL
  const gwr = gluteo / cintura      // Glúteo/Cintura
  const shr = ombros / quadril
  const hourglass = (busto + quadril) / (2 * cintura)
  
  // Scores - FOCO EM LOWER BODY
  const scores = {
    // WHR (quadril grande = bom)
    whr: calcularScoreProximidade(whr, WELLNESS_CONSTANTS.WHR_TARGET, 0.08, 15),
    
    // Lower body (40% do score!)
    lowerBody: (
      calcularScoreProximidade(twr, WELLNESS_CONSTANTS.TWR_TARGET, 0.10, 20) +
      calcularScoreProporcional(coxa, ideais.coxa, 12) +
      calcularScoreProporcional(panturrilha, ideais.panturrilha, 8)
    ),
    
    // Glúteos (20%)
    glutes: calcularScoreProximidade(gwr, WELLNESS_CONSTANTS.GWR_TARGET, 0.12, 20),
    
    // Coxas (15%)
    thighs: calcularScoreProporcional(coxa, ideais.coxa, 15),
    
    // Cintura fina (10%) - INVERTIDO (menor é melhor)
    waist: calcularScoreInverso(cintura, ideais.cintura, 10),
  }
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    categoria: 'Wellness',
    icon: '🏃',
    referencia: WELLNESS_CONSTANTS.reference.name,
    score_total: Math.round(scoreTotal * 100) / 100,
    scores_detalhados: scores,
    ideais: ideais,
    razoes_atuais: { whr, twr, gwr, shr, hourglass },
    diferencas: calcularDiferencasWellness(medidas, ideais),
    recomendacoes: gerarRecomendacoesWellness(medidas, ideais),
  }
}
```

---

## 8. FÓRMULAS DETALHADAS - FIGURE 👙

### 8.1 Constantes e Referência

```javascript
/**
 * REFERÊNCIA: Cydney Gillon
 * - 5x Olympia Figure Champion (2019-2023)
 * - Altura: 165 cm
 * - Peso (stage): ~55-58 kg
 * - Conhecida por: Simetria perfeita, V-Taper moderado, condicionamento
 */

const FIGURE_CONSTANTS = {
  name: 'Figure',
  icon: '👙',
  reference: {
    name: 'Cydney Gillon',
    titles: '5x Olympia Figure',
    height: 165,
    weight_stage: 56,
  },
  
  // Razões alvo
  WHR_TARGET: 0.70,           // WHR clássico
  WCR_TARGET: 0.70,           // Cintura/Busto
  SHR_TARGET: 1.00,           // Ombros = Quadril (simetria)
  SWR_TARGET: 1.50,           // V-Taper mais pronunciado
  HOURGLASS_TARGET: 1.40,     // Índice ampulheta
  
  // Gordura corporal (mais seco que Bikini)
  BF_MIN: 10,
  BF_MAX: 14,
  BF_IDEAL: 12,
  
  // Áreas de foco
  focusAreas: [
    'shoulders',      // Caps de deltóide arredondados
    'back',           // Largura e detalhamento
    'waist',          // Cintura fina
    'legs',           // Pernas desenvolvidas e simétricas
    'symmetry',       // Simetria é CRUCIAL
    'conditioning',   // Condicionamento/Definição
  ],
  
  // Pesos do score
  weights: {
    vTaper: 0.20,
    symmetry: 0.25,           // Simetria é muito importante
    shoulders: 0.15,
    back: 0.15,
    legs: 0.15,
    conditioning: 0.10,
  },
}
```

### 8.2 Funções de Cálculo Figure

```javascript
function calcularIdeaisFigure(medidas) {
  const { altura, quadril, punho, tornozelo, joelho } = medidas
  
  const fator_escala = altura / FIGURE_CONSTANTS.reference.height
  
  // Cintura ideal (WHR de 0.70)
  const cintura_ideal = quadril * FIGURE_CONSTANTS.WHR_TARGET
  
  // Ombros ideais (iguais ao quadril para simetria)
  const ombros_ideal = quadril * FIGURE_CONSTANTS.SHR_TARGET
  
  // Busto ideal
  const busto_ideal = cintura_ideal / FIGURE_CONSTANTS.WCR_TARGET
  
  // Membros (mais desenvolvidos que Bikini)
  const braco_ideal = punho * 2.30
  const coxa_ideal = joelho * 1.65
  const panturrilha_ideal = tornozelo * 1.85
  
  return {
    cintura: cintura_ideal,
    busto: busto_ideal,
    ombros: ombros_ideal,
    braco: braco_ideal,
    coxa: coxa_ideal,
    panturrilha: panturrilha_ideal,
    
    razoes: {
      whr: FIGURE_CONSTANTS.WHR_TARGET,
      shr: FIGURE_CONSTANTS.SHR_TARGET,
      swr: FIGURE_CONSTANTS.SWR_TARGET,
      hourglass: FIGURE_CONSTANTS.HOURGLASS_TARGET,
    },
    
    bf: {
      min: FIGURE_CONSTANTS.BF_MIN,
      max: FIGURE_CONSTANTS.BF_MAX,
      ideal: FIGURE_CONSTANTS.BF_IDEAL,
    },
  }
}

function calcularScoreFigure(medidas) {
  const ideais = calcularIdeaisFigure(medidas)
  const { busto, cintura, quadril, ombros, coxa, panturrilha, braco } = medidas
  
  // Razões atuais
  const whr = cintura / quadril
  const shr = ombros / quadril
  const swr = ombros / cintura
  const hourglass = (busto + quadril) / (2 * cintura)
  
  // V-Taper Score
  const vTaperScore = calcularScoreProximidade(swr, FIGURE_CONSTANTS.SWR_TARGET, 0.12, 20)
  
  // Symmetry Score (diferença entre lados)
  const symmetryScore = calcularScoreSimetriaBilateral(medidas, 25)
  
  // Outros scores
  const scores = {
    vTaper: vTaperScore,
    symmetry: symmetryScore,
    shoulders: calcularScoreProporcional(ombros, ideais.ombros, 15),
    back: 15, // Avaliado visualmente
    legs: (calcularScoreProporcional(coxa, ideais.coxa, 8) +
           calcularScoreProporcional(panturrilha, ideais.panturrilha, 7)),
    conditioning: 10, // Avaliado separadamente
  }
  
  const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
  
  return {
    categoria: 'Figure',
    icon: '👙',
    referencia: FIGURE_CONSTANTS.reference.name,
    score_total: Math.round(scoreTotal * 100) / 100,
    scores_detalhados: scores,
    ideais: ideais,
    razoes_atuais: { whr, shr, swr, hourglass },
  }
}
```

---

## 9. FÓRMULAS DETALHADAS - WOMEN'S PHYSIQUE 💪

### 9.1 Constantes e Referência

```javascript
/**
 * REFERÊNCIA: Sarah Villegas
 * - 2x Olympia Women's Physique Champion (2022, 2023)
 * - Altura: 163 cm
 * - Peso (stage): ~60-65 kg
 * - Conhecida por: Muscularidade + feminilidade, condicionamento extremo
 */

const WOMENS_PHYSIQUE_CONSTANTS = {
  name: "Women's Physique",
  icon: '💪',
  reference: {
    name: 'Sarah Villegas',
    titles: "2x Olympia Women's Physique",
    height: 163,
    weight_stage: 62,
  },
  
  // Razões alvo (mais muscular)
  WHR_TARGET: 0.72,           // WHR maior (mais músculo no core)
  SWR_TARGET: 1.55,           // V-Taper mais agressivo
  SHR_TARGET: 1.05,           // Ombros > Quadril
  HOURGLASS_TARGET: 1.35,     // Menos ampulheta, mais V
  
  // Gordura corporal (muito seco)
  BF_MIN: 8,
  BF_MAX: 12,
  BF_IDEAL: 10,
  
  // Áreas de foco
  focusAreas: [
    'muscle_mass',    // Desenvolvimento muscular significativo
    'v_taper',        // V-Taper pronunciado
    'conditioning',   // Condicionamento/Definição extrema
    'symmetry',       // Simetria
    'posing',         // Poses de fisiculturismo (front/back)
  ],
  
  // Pesos do score
  weights: {
    muscleMass: 0.25,
    vTaper: 0.20,
    symmetry: 0.20,
    conditioning: 0.20,
    posing: 0.15,
  },
}
```

### 9.2 Funções de Cálculo Women's Physique

```javascript
function calcularIdeaisWomensPhysique(medidas) {
  const { altura, quadril, punho, tornozelo, joelho } = medidas
  
  const fator_escala = altura / WOMENS_PHYSIQUE_CONSTANTS.reference.height
  
  // Cintura ideal
  const cintura_ideal = quadril * WOMENS_PHYSIQUE_CONSTANTS.WHR_TARGET
  
  // Ombros ideais (maiores que quadril)
  const ombros_ideal = quadril * WOMENS_PHYSIQUE_CONSTANTS.SHR_TARGET
  
  // Membros (mais desenvolvidos)
  const braco_ideal = punho * 2.45  // Braços mais volumosos
  const coxa_ideal = joelho * 1.70
  const panturrilha_ideal = tornozelo * 1.90
  
  return {
    cintura: cintura_ideal,
    ombros: ombros_ideal,
    braco: braco_ideal,
    coxa: coxa_ideal,
    panturrilha: panturrilha_ideal,
    
    razoes: {
      whr: WOMENS_PHYSIQUE_CONSTANTS.WHR_TARGET,
      shr: WOMENS_PHYSIQUE_CONSTANTS.SHR_TARGET,
      swr: WOMENS_PHYSIQUE_CONSTANTS.SWR_TARGET,
    },
    
    bf: {
      min: WOMENS_PHYSIQUE_CONSTANTS.BF_MIN,
      max: WOMENS_PHYSIQUE_CONSTANTS.BF_MAX,
      ideal: WOMENS_PHYSIQUE_CONSTANTS.BF_IDEAL,
    },
  }
}
```

---

## 10. FÓRMULAS DETALHADAS - WOMEN'S BODYBUILDING 🏆

### 10.1 Constantes e Referência

```javascript
/**
 * REFERÊNCIA: Andrea Shaw
 * - 4x Ms. Olympia (2020-2023)
 * - Altura: 173 cm
 * - Peso (stage): ~77-80 kg
 * - Conhecida por: Tamanho muscular extremo mantendo feminilidade
 */

const WOMENS_BODYBUILDING_CONSTANTS = {
  name: "Women's Bodybuilding",
  icon: '🏆',
  reference: {
    name: 'Andrea Shaw',
    titles: '4x Ms. Olympia',
    height: 173,
    weight_stage: 78,
  },
  
  // Razões alvo (similar ao masculino)
  SWR_TARGET: 1.60,           // V-Taper extremo
  SYMMETRY_TARGET: 1.0,       // Simetria perfeita
  
  // Gordura corporal (extremamente seco)
  BF_MIN: 6,
  BF_MAX: 10,
  BF_IDEAL: 8,
  
  // Áreas de foco
  focusAreas: [
    'muscle_mass',    // Tamanho muscular máximo
    'definition',     // Definição extrema
    'symmetry',       // Simetria
    'posing',         // Poses obrigatórias e livres
  ],
  
  // Pesos do score
  weights: {
    muscleMass: 0.30,
    symmetry: 0.25,
    conditioning: 0.25,
    posing: 0.20,
  },
}
```

---

## 11. CÁLCULO DE GORDURA CORPORAL FEMININO

### 11.1 Método Navy (US Navy)

```javascript
/**
 * Fórmula Navy para MULHERES
 * Diferente da masculina - usa quadril além de cintura e pescoço
 */
function calcularBFNavyFeminino(altura, cintura, quadril, pescoco) {
  // Fórmula: BF% = 163.205 × log10(cintura + quadril - pescoço) - 97.684 × log10(altura) - 78.387
  const bf = 163.205 * Math.log10(cintura + quadril - pescoco) 
             - 97.684 * Math.log10(altura) 
             - 78.387
  
  return Math.max(0, Math.min(50, Math.round(bf * 10) / 10))
}
```

### 11.2 Método Pollock 7 Dobras (Jackson-Pollock para Mulheres)

```javascript
/**
 * Fórmula Jackson-Pollock para MULHERES (7 dobras)
 */
function calcularBFPollock7Feminino(dobras, idade) {
  const {
    triceps, subescapular, suprailíaca, abdominal, 
    coxa, peitoral, axilar
  } = dobras
  
  // Soma das 7 dobras
  const soma = triceps + subescapular + suprailíaca + abdominal + coxa + peitoral + axilar
  
  // Densidade corporal (fórmula para mulheres)
  const densidade = 1.097 
                    - (0.00046971 * soma) 
                    + (0.00000056 * soma * soma) 
                    - (0.00012828 * idade)
  
  // Percentual de gordura (Siri equation)
  const bf = (495 / densidade) - 450
  
  return Math.max(0, Math.min(50, Math.round(bf * 10) / 10))
}
```

### 11.3 Classificação de BF% Feminino

```javascript
const CLASSIFICACAO_BF_FEMININO = {
  // Atletas de competição
  competicao: { min: 8, max: 14, descricao: 'Nível de competição' },
  
  // Atletas (treino regular)
  atletico: { min: 14, max: 20, descricao: 'Físico atlético' },
  
  // Fitness (saudável e ativo)
  fitness: { min: 20, max: 24, descricao: 'Fitness/Saudável' },
  
  // Normal
  normal: { min: 24, max: 31, descricao: 'Normal' },
  
  // Acima do ideal
  acima: { min: 31, max: 40, descricao: 'Acima do recomendado' },
  
  // Obesidade
  obesidade: { min: 40, max: 100, descricao: 'Obesidade' },
}

function classificarBFFeminino(bf) {
  for (const [nivel, range] of Object.entries(CLASSIFICACAO_BF_FEMININO)) {
    if (bf >= range.min && bf < range.max) {
      return {
        nivel,
        descricao: range.descricao,
        faixa: `${range.min}-${range.max}%`,
      }
    }
  }
  return { nivel: 'indefinido', descricao: 'Valor fora do range' }
}
```

---

## 12. CALCULADORA COMPLETA FEMININA

### 12.1 Função Principal

```javascript
function calcularProporcoesFeminino(medidas, preferencia = 'golden_ratio') {
  // Validar medidas
  const validacao = validarMedidasFeminino(medidas)
  if (!validacao.valido) {
    return { erro: true, mensagem: validacao.erros }
  }
  
  // Calcular todas as categorias
  const goldenRatio = calcularScoreFemininoGoldenRatio(medidas)
  const bikini = calcularScoreBikini(medidas)
  const wellness = calcularScoreWellness(medidas)
  const figure = calcularScoreFigure(medidas)
  const womensPhysique = calcularScoreWomensPhysique(medidas)
  
  // Ranking de categorias
  const categorias = [
    { nome: 'Golden Ratio', icon: '🏛️', score: goldenRatio.score_total },
    { nome: 'Bikini', icon: '🩱', score: bikini.score_total },
    { nome: 'Wellness', icon: '🏃', score: wellness.score_total },
    { nome: 'Figure', icon: '👙', score: figure.score_total },
    { nome: "Women's Physique", icon: '💪', score: womensPhysique.score_total },
  ].sort((a, b) => b.score - a.score)
  
  // Calcular gordura corporal
  const bf_navy = calcularBFNavyFeminino(
    medidas.altura, medidas.cintura, medidas.quadril, medidas.pescoco || medidas.cintura * 0.4
  )
  
  // Calcular razões principais
  const razoes = {
    whr: medidas.cintura / medidas.quadril,
    wcr: medidas.cintura / medidas.busto,
    shr: medidas.ombros / medidas.quadril,
    hourglass: (medidas.busto + medidas.quadril) / (2 * medidas.cintura),
  }
  
  return {
    medidas_input: medidas,
    genero: 'feminino',
    
    razoes_atuais: razoes,
    
    gordura_corporal: {
      navy: bf_navy,
      classificacao: classificarBFFeminino(bf_navy),
    },
    
    resultados: {
      golden_ratio: goldenRatio,
      bikini: bikini,
      wellness: wellness,
      figure: figure,
      womens_physique: womensPhysique,
    },
    
    recomendacao: {
      melhor_categoria: categorias[0].nome,
      icon: categorias[0].icon,
      score: categorias[0].score,
      ranking: categorias,
    },
    
    classificacao: getClassificacaoFeminino(categorias[0].score),
  }
}

function getClassificacaoFeminino(score) {
  if (score >= 95) return { nivel: 'ELITE', emoji: '👑', descricao: 'Proporções excepcionais' }
  if (score >= 85) return { nivel: 'AVANÇADO', emoji: '🥇', descricao: 'Muito acima da média' }
  if (score >= 75) return { nivel: 'INTERMEDIÁRIO', emoji: '🥈', descricao: 'Boas proporções' }
  if (score >= 60) return { nivel: 'INICIANTE', emoji: '💪', descricao: 'Em desenvolvimento' }
  return { nivel: 'INICIANTE', emoji: '🚀', descricao: 'Início da jornada' }
}
```

### 12.2 Validação de Medidas Femininas

```javascript
function validarMedidasFeminino(medidas) {
  const obrigatorias = ['altura', 'busto', 'cintura', 'quadril', 'ombros']
  const erros = []
  
  for (const campo of obrigatorias) {
    if (!medidas[campo] || medidas[campo] <= 0) {
      erros.push(`${campo} é obrigatório`)
    }
  }
  
  // Validar ranges femininos
  const limites = {
    altura: [145, 195],
    busto: [70, 130],
    cintura: [50, 100],
    quadril: [70, 140],
    ombros: [80, 130],
    peso: [40, 120],
    coxa: [40, 80],
    braco: [20, 45],
  }
  
  for (const [campo, [min, max]] of Object.entries(limites)) {
    if (medidas[campo] && (medidas[campo] < min || medidas[campo] > max)) {
      erros.push(`${campo} deve estar entre ${min} e ${max} cm`)
    }
  }
  
  // Validar lógica (cintura deve ser menor que quadril e busto)
  if (medidas.cintura >= medidas.quadril) {
    erros.push('Cintura deve ser menor que quadril')
  }
  if (medidas.cintura >= medidas.busto) {
    erros.push('Cintura deve ser menor que busto')
  }
  
  return { valido: erros.length === 0, erros }
}
```

---

## 13. EXEMPLO DE USO COMPLETO

### 13.1 Input da Usuária

```javascript
const medidasUsuaria = {
  // Dados básicos
  altura: 165,        // cm
  peso: 58,           // kg
  idade: 28,          // anos
  
  // Medidas estruturais
  punho: 15,          // cm
  tornozelo: 21,      // cm
  joelho: 35,         // cm
  abaixo_busto: 75,   // cm
  
  // Medidas variáveis
  busto: 88,          // cm
  cintura: 64,        // cm
  quadril: 94,        // cm
  ombros: 96,         // cm
  braco: 28,          // cm
  antebraco: 23,      // cm
  coxa: 56,           // cm
  panturrilha: 35,    // cm
  gluteo_dobra: 98,   // cm (opcional, para Wellness)
}
```

### 13.2 Output Esperado

```javascript
{
  medidas_input: { /* medidasUsuaria */ },
  genero: 'feminino',
  
  razoes_atuais: {
    whr: 0.68,        // 64/94 = 0.68 ✓ Excelente!
    wcr: 0.73,        // 64/88 = 0.73
    shr: 1.02,        // 96/94 = 1.02
    hourglass: 1.42,  // (88+94)/(2×64) = 1.42
  },
  
  gordura_corporal: {
    navy: 22.5,
    classificacao: {
      nivel: 'fitness',
      descricao: 'Fitness/Saudável',
      faixa: '20-24%',
    },
  },
  
  resultados: {
    golden_ratio: {
      score_total: 87.3,
      ideais: {
        cintura: 65.8,   // 94 × 0.70
        busto: 91.2,     // 94 × 0.97
        ombros: 89.3,    // 94 × 0.95
      },
      razoes_ideais: {
        whr: 0.70,
        hourglass: 1.45,
      },
    },
    
    bikini: {
      score_total: 91.2,   // MELHOR MATCH!
      ideais: {
        cintura: 63.9,     // 94 × 0.68
        // ...
      },
    },
    
    wellness: {
      score_total: 78.5,
      // Coxa/Cintura está abaixo do ideal (precisa mais lower body)
    },
    
    figure: {
      score_total: 84.1,
    },
    
    womens_physique: {
      score_total: 72.3,
      // Precisa mais massa muscular
    },
  },
  
  recomendacao: {
    melhor_categoria: 'Bikini',
    icon: '🩱',
    score: 91.2,
    ranking: [
      { nome: 'Bikini', icon: '🩱', score: 91.2 },
      { nome: 'Golden Ratio', icon: '🏛️', score: 87.3 },
      { nome: 'Figure', icon: '👙', score: 84.1 },
      { nome: 'Wellness', icon: '🏃', score: 78.5 },
      { nome: "Women's Physique", icon: '💪', score: 72.3 },
    ],
  },
  
  classificacao: {
    nivel: 'AVANÇADO',
    emoji: '🥇',
    descricao: 'Muito acima da média',
  },
}
```

---

## 14. INTEGRAÇÃO COM VITRU IA

### 14.1 Mudanças no Data Model

```typescript
// Adicionar ao modelo de usuário
interface User {
  // ... campos existentes
  gender: 'male' | 'female'
}

// Adicionar às preferências
interface UserPreferences {
  // ... campos existentes
  
  // Para mulheres
  femaleCategory?: FemaleCategory
}

type FemaleCategory = 
  | 'golden_ratio'
  | 'bikini'
  | 'wellness'
  | 'figure'
  | 'womens_physique'
  | 'womens_bodybuilding'

// Adicionar medidas específicas femininas
interface FemaleMeasurements extends BaseMeasurements {
  bust: number
  underbust: number
  hip: number
  gluteFold?: number
}
```

### 14.2 Mudanças no Onboarding

```typescript
// Adicionar step de gênero no onboarding
const ONBOARDING_STEPS_FEMALE = [
  'welcome',
  'gender',              // NOVO: Seleção de gênero
  'category',            // Seleção de categoria (muda baseado no gênero)
  'structural',          // Medidas estruturais (diferentes para mulheres)
  'goals',
  'experience',
  'complete',
]
```

### 14.3 Mudanças no Coach IA (VITRÚVIO)

```typescript
// Contexto adicional para VITRÚVIO quando usuária é mulher
const FEMALE_COACH_CONTEXT = `
Você está analisando uma MULHER. As proporções ideais femininas são DIFERENTES das masculinas:

PRINCIPAL MÉTRICA FEMININA: WHR (Waist-to-Hip Ratio)
- Ideal: 0.70 (cintura = 70% do quadril)
- Isso cria a forma "ampulheta" desejada

NÃO foque em V-Taper extremo como para homens.
Foque em:
- Cintura fina
- Quadril/Glúteos desenvolvidos
- Forma de ampulheta
- Pernas proporcionais
- Ombros arredondados (não excessivamente largos)

Categorias de referência:
- Golden Ratio: WHR 0.70, forma natural
- Bikini: WHR 0.68, glúteos arredondados, caps de ombro
- Wellness: WHR 0.62, lower body MUITO desenvolvido
- Figure: WHR 0.70, mais muscular, V-Taper moderado
- Women's Physique: WHR 0.72, muscularidade significativa
`
```

---

## 15. CONSIDERAÇÕES FINAIS

### 15.1 Resumo das Diferenças Masculino vs Feminino

| Aspecto | Masculino | Feminino |
|---------|-----------|----------|
| **Métrica Principal** | SWR (V-Taper) | WHR (Ampulheta) |
| **Ideal da Métrica** | 1.618 | 0.70 |
| **Foco** | Ombros, Costas | Quadril, Glúteos |
| **Forma** | V-Shape | X-Shape / Hourglass |
| **BF% Competição** | 3-8% | 8-18% |
| **Categorias** | 3 (Golden, Classic, MP) | 5 (Golden, Bikini, Wellness, Figure, WP) |

### 15.2 Referências

- **Golden Ratio Feminino**: Estudos de Singh, Platek (WHR 0.70)
- **Bikini**: Lauralie Chapados (3x Olympia)
- **Wellness**: Francielle Mattos (2x Olympia)
- **Figure**: Cydney Gillon (5x Olympia)
- **Women's Physique**: Sarah Villegas (2x Olympia)
- **Women's Bodybuilding**: Andrea Shaw (4x Ms. Olympia)
- **IFBB Pro League**: Critérios oficiais de julgamento 2024

### 15.3 Observações Importantes

1. **WHR é a métrica mais importante** para estética feminina (não V-Taper)
2. **Wellness** é a categoria que mais cresce, especialmente no Brasil
3. **Bikini** é a categoria mais popular globalmente
4. **BF% feminino** é naturalmente maior que masculino (essencial para saúde hormonal)
5. A **forma ampulheta** (hourglass) é o ideal estético universal feminino

---

## 16. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Proporções Femininas completas |

---

**VITRU IA - Proporções Corporais Femininas v1.0**  
*WHR • Hourglass • Bikini • Wellness • Figure • Women's Physique*
