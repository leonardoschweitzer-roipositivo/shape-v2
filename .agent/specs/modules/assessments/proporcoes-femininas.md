# SPEC: Proporções Corporais Femininas

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Sistema de Análise de Proporções Femininas

---

## 1. VISÃO GERAL

### 1.1 Objetivo

Definir as fórmulas de cálculo para as **8 proporções corporais femininas** baseadas em:
- **Golden Ratio** (proporção áurea clássica)
- **Bikini** (foco em curvas e feminilidade)
- **Wellness** (foco em glúteos e coxas)
- **Figure** (foco em musculatura definida)
- **Women's Physique** (foco em massa muscular)
- **Women's Bodybuilding** (foco em massa extrema)

### 1.2 Categorias e Características

| Categoria | Característica Principal | BF% Típico | Referência |
|-----------|-------------------------|:----------:|------------|
| **Golden Ratio** | Proporção áurea clássica | 18-22% | Padrão estético universal |
| **Bikini** | Curvas femininas, glúteos arredondados | 15-18% | Lauralie Chapados |
| **Wellness** | Coxas e glúteos volumosos | 14-17% | Francielle Mattos |
| **Figure** | Musculatura definida, ombros largos | 12-15% | Cydney Gillon |
| **Women's Physique** | Massa muscular visível | 10-13% | Natalia Abraham Coelho |
| **Women's Bodybuilding** | Massa muscular extrema | 8-12% | Andrea Shaw |

### 1.3 As 8 Proporções

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                         8 PROPORÇÕES FEMININAS                             │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │     1. WHR (Waist-Hip Ratio)        Cintura ÷ Quadril               │   │
│  │     2. Ampulheta                    Busto : Cintura : Quadril       │   │
│  │     3. Shoulder-Hip Ratio           Ombros ÷ Quadril                │   │
│  │     4. Proporção de Braço           Antebraço ÷ Braço               │   │
│  │     5. Hip-Thigh Ratio              Coxa ÷ Quadril                  │   │
│  │     6. Desenvolvimento de Coxa      Coxa ÷ Joelho                   │   │
│  │     7. Proporção de Perna           Coxa ÷ Panturrilha              │   │
│  │     8. Desenvolvimento de Pant.     Panturrilha ÷ Tornozelo         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. MEDIDAS NECESSÁRIAS (INPUT)

### 2.1 Medidas Estruturais (Fixas)

```typescript
interface MedidasEstruturaisFemininas {
  altura: number          // cm - altura total
  punho: number           // cm - circunferência do punho
  tornozelo: number       // cm - circunferência do tornozelo
  joelho: number          // cm - circunferência do joelho
}
```

### 2.2 Medidas Variáveis (Mudam com treino/dieta)

```typescript
interface MedidasVariaveisFemininas {
  // Tronco
  busto: number           // cm - circunferência do busto (na linha do mamilo)
  cintura: number         // cm - menor circunferência (umbigo ou acima)
  quadril: number         // cm - maior circunferência dos glúteos
  ombros: number          // cm - largura dos ombros (deltoides)
  
  // Braços (média E/D)
  braco: number           // cm - bíceps contraído
  antebraco: number       // cm - maior circunferência
  
  // Pernas (média E/D)
  coxa: number            // cm - maior circunferência
  panturrilha: number     // cm - maior circunferência
}
```

### 2.3 Medidas para Simetria Bilateral

```typescript
interface MedidasBilateraisFemininas {
  bracoEsquerdo: number
  bracoDireito: number
  antebracoEsquerdo: number
  antebracoDireito: number
  coxaEsquerda: number
  coxaDireita: number
  panturrilhaEsquerda: number
  panturrilhaDireita: number
}
```

---

## 3. PROPORÇÃO 1: WHR (WAIST-HIP RATIO)

### 3.1 Descrição

O **WHR** (Waist-Hip Ratio) ou **Relação Cintura-Quadril** é a proporção mais importante para estética feminina. Mede a "ampulheta" do corpo.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    WHR = Cintura ÷ Quadril                      │
│                                                                 │
│                         ┌─────────┐                             │
│                         │         │                             │
│                      ←──│ CINTURA │──→                          │
│                         │         │                             │
│                         └─────────┘                             │
│                                                                 │
│                      ┌─────────────┐                            │
│                      │             │                            │
│                   ←──│   QUADRIL   │──→                         │
│                      │             │                            │
│                      └─────────────┘                            │
│                                                                 │
│  Quanto MENOR o WHR, mais acentuada a curva (melhor)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Fórmula

```typescript
function calcularWHR(cintura: number, quadril: number): ProportionResult {
  const indiceAtual = cintura / quadril
  
  return {
    nome: 'WHR (Waist-Hip Ratio)',
    categoria: 'LINHA DE CINTURA',
    indiceAtual,
    descricao: 'Relação cintura-quadril. Quanto menor, mais curvilínea.',
    ehInversa: true,  // Menor é melhor
  }
}
```

### 3.3 Metas por Categoria

| Categoria | Meta WHR | Interpretação |
|-----------|:--------:|---------------|
| **Golden Ratio** | **0.70** | Proporção áurea clássica |
| **Bikini** | **0.68** | Curvas acentuadas |
| **Wellness** | **0.65** | Quadril muito desenvolvido |
| **Figure** | **0.72** | Menos ênfase em curvas |
| **Women's Physique** | **0.75** | Cintura menos marcada |
| **Women's Bodybuilding** | **0.78** | Musculatura abdominal visível |

### 3.4 Faixas de Classificação (WHR)

```typescript
const WHR_CLASSIFICACAO = {
  EXCELENTE: { max: 0.70, label: 'Excelente', cor: '#10B981' },
  BOM: { min: 0.70, max: 0.75, label: 'Bom', cor: '#3B82F6' },
  MEDIO: { min: 0.75, max: 0.80, label: 'Médio', cor: '#F59E0B' },
  ALTO: { min: 0.80, max: 0.85, label: 'Alto', cor: '#EF4444' },
  MUITO_ALTO: { min: 0.85, label: 'Muito Alto', cor: '#DC2626' },
}
```

---

## 4. PROPORÇÃO 2: AMPULHETA (BUSTO:CINTURA:QUADRIL)

### 3.1 Descrição

A proporção **Ampulheta** mede a harmonia entre busto, cintura e quadril. O ideal clássico é que busto e quadril tenham medidas similares, com cintura bem menor.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│            AMPULHETA = Busto : Cintura : Quadril                │
│                                                                 │
│                      ┌─────────────┐                            │
│                   ←──│    BUSTO    │──→    (ex: 90cm)           │
│                      └─────────────┘                            │
│                                                                 │
│                         ┌───────┐                               │
│                      ←──│CINTURA│──→       (ex: 65cm)           │
│                         └───────┘                               │
│                                                                 │
│                      ┌─────────────┐                            │
│                   ←──│   QUADRIL   │──→    (ex: 95cm)           │
│                      └─────────────┘                            │
│                                                                 │
│  Ideal: Busto ≈ Quadril, Cintura = ~70% do Quadril              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Fórmulas

```typescript
interface AmpulhetaResult {
  // Índices individuais
  bustoCinturaRatio: number       // Busto ÷ Cintura (ideal: 1.40)
  quadrilCinturaRatio: number     // Quadril ÷ Cintura (ideal: 1.42)
  bustoQuadrilRatio: number       // Busto ÷ Quadril (ideal: 0.95-1.00)
  
  // Score de harmonia (0-100%)
  harmoniaPercentual: number
}

function calcularAmpulheta(
  busto: number,
  cintura: number,
  quadril: number
): AmpulhetaResult {
  
  const bustoCinturaRatio = busto / cintura
  const quadrilCinturaRatio = quadril / cintura
  const bustoQuadrilRatio = busto / quadril
  
  // Ideais Golden Ratio
  const idealBustoCintura = 1.40
  const idealQuadrilCintura = 1.42
  const idealBustoQuadril = 0.97  // Busto ligeiramente menor que quadril
  
  // Calcular desvios
  const desvioBustoCintura = Math.abs(bustoCinturaRatio - idealBustoCintura) / idealBustoCintura
  const desvioQuadrilCintura = Math.abs(quadrilCinturaRatio - idealQuadrilCintura) / idealQuadrilCintura
  const desvioBustoQuadril = Math.abs(bustoQuadrilRatio - idealBustoQuadril) / idealBustoQuadril
  
  // Média ponderada dos desvios
  const desvioMedio = (desvioBustoCintura * 0.3) + (desvioQuadrilCintura * 0.4) + (desvioBustoQuadril * 0.3)
  
  // Converter para percentual de harmonia (100% = perfeito)
  const harmoniaPercentual = Math.max(0, Math.min(100, (1 - desvioMedio) * 100))
  
  return {
    bustoCinturaRatio,
    quadrilCinturaRatio,
    bustoQuadrilRatio,
    harmoniaPercentual,
  }
}
```

### 4.3 Metas por Categoria

| Categoria | Busto:Cintura | Quadril:Cintura | Busto:Quadril |
|-----------|:-------------:|:---------------:|:-------------:|
| **Golden Ratio** | **1.40** | **1.42** | **0.97** |
| **Bikini** | 1.35 | 1.50 | 0.90 |
| **Wellness** | 1.30 | 1.55 | 0.84 |
| **Figure** | 1.38 | 1.38 | 1.00 |
| **Women's Physique** | 1.35 | 1.35 | 1.00 |
| **Women's Bodybuilding** | 1.30 | 1.30 | 1.00 |

---

## 5. PROPORÇÃO 3: SHOULDER-HIP RATIO (OMBROS ÷ QUADRIL)

### 5.1 Descrição

A proporção **Ombros-Quadril** define o equilíbrio entre parte superior e inferior. Nas categorias femininas, o ideal é que quadril seja igual ou maior que ombros.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│          SHOULDER-HIP = Ombros ÷ Quadril                        │
│                                                                 │
│                   ┌───────────────────┐                         │
│                ←──│      OMBROS       │──→                      │
│                   └───────────────────┘                         │
│                                                                 │
│                      ┌─────────────┐                            │
│                   ←──│   QUADRIL   │──→                         │
│                      └─────────────┘                            │
│                                                                 │
│  Bikini/Wellness: Ombros < Quadril (ratio < 1.0)                │
│  Figure/Physique: Ombros ≈ Quadril (ratio ≈ 1.0)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Fórmula

```typescript
function calcularShoulderHipRatio(
  ombros: number,
  quadril: number
): ProportionResult {
  
  const indiceAtual = ombros / quadril
  
  return {
    nome: 'Shoulder-Hip Ratio',
    categoria: 'EQUILÍBRIO SUPERIOR-INFERIOR',
    indiceAtual,
    descricao: 'Proporção entre ombros e quadril. Define o "shape" geral.',
    ehInversa: false,  // Depende da categoria
  }
}
```

### 5.3 Metas por Categoria

| Categoria | Meta Ratio | Interpretação |
|-----------|:----------:|---------------|
| **Golden Ratio** | **1.00** | Ombros = Quadril |
| **Bikini** | **0.95** | Quadril ligeiramente maior |
| **Wellness** | **0.90** | Quadril visivelmente maior |
| **Figure** | **1.05** | Ombros ligeiramente maiores |
| **Women's Physique** | **1.10** | Ombros visivelmente maiores |
| **Women's Bodybuilding** | **1.15** | V-Taper feminino |

---

## 6. PROPORÇÃO 4: BRAÇO ÷ ANTEBRAÇO

### 6.1 Descrição

A proporção **Braço-Antebraço** mede o desenvolvimento harmônico dos membros superiores.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│          BRAÇO-ANTEBRAÇO = Antebraço ÷ Braço                    │
│                                                                 │
│                    ┌─────────┐                                  │
│                 ←──│  BRAÇO  │──→   (bíceps contraído)          │
│                    └─────────┘                                  │
│                         │                                       │
│                    ┌────┴────┐                                  │
│                 ←──│ANTEBRAÇO│──→   (maior circunferência)      │
│                    └─────────┘                                  │
│                                                                 │
│  Ideal: Antebraço = 75-80% do Braço                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Fórmula

```typescript
function calcularBracoAntebraco(
  braco: number,
  antebraco: number
): ProportionResult {
  
  const indiceAtual = antebraco / braco
  
  return {
    nome: 'Proporção Braço-Antebraço',
    categoria: 'DESENVOLVIMENTO DE BRAÇO',
    indiceAtual,
    descricao: 'Proporção entre antebraço e braço. Ideal: 0.75-0.80.',
    ehInversa: false,
  }
}
```

### 6.3 Metas por Categoria

| Categoria | Meta Ratio | Interpretação |
|-----------|:----------:|---------------|
| **Golden Ratio** | **0.78** | Proporção clássica |
| **Bikini** | **0.75** | Braços mais finos |
| **Wellness** | **0.76** | Similar ao Bikini |
| **Figure** | **0.78** | Desenvolvimento proporcional |
| **Women's Physique** | **0.80** | Antebraços mais desenvolvidos |
| **Women's Bodybuilding** | **0.82** | Máximo desenvolvimento |

---

## 7. PROPORÇÃO 5: HIP-THIGH RATIO (COXA ÷ QUADRIL)

### 7.1 Descrição

A proporção **Quadril-Coxa** mede o desenvolvimento das coxas em relação ao quadril. Muito importante para Wellness!

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│            HIP-THIGH = Coxa ÷ Quadril                           │
│                                                                 │
│                      ┌─────────────┐                            │
│                   ←──│   QUADRIL   │──→                         │
│                      └─────────────┘                            │
│                             │                                   │
│                      ┌──────┴──────┐                            │
│                   ←──│    COXA     │──→                         │
│                      └─────────────┘                            │
│                                                                 │
│  Wellness: Coxas bem desenvolvidas (ratio alto)                 │
│  Bikini: Coxas proporcionais (ratio moderado)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Fórmula

```typescript
function calcularHipThighRatio(
  coxa: number,
  quadril: number
): ProportionResult {
  
  const indiceAtual = coxa / quadril
  
  return {
    nome: 'Hip-Thigh Ratio',
    categoria: 'DESENVOLVIMENTO DE COXA',
    indiceAtual,
    descricao: 'Proporção entre coxa e quadril. Wellness enfatiza coxas grandes.',
    ehInversa: false,
  }
}
```

### 7.3 Metas por Categoria

| Categoria | Meta Ratio | Interpretação |
|-----------|:----------:|---------------|
| **Golden Ratio** | **0.58** | Proporção clássica |
| **Bikini** | **0.56** | Coxas proporcionais |
| **Wellness** | **0.65** | Coxas muito desenvolvidas! |
| **Figure** | **0.60** | Bom desenvolvimento |
| **Women's Physique** | **0.62** | Desenvolvimento muscular |
| **Women's Bodybuilding** | **0.65** | Máximo desenvolvimento |

---

## 8. PROPORÇÃO 6: COXA ÷ JOELHO

### 8.1 Descrição

A proporção **Coxa-Joelho** mede o desenvolvimento muscular da coxa em relação à estrutura óssea (joelho).

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│            COXA-JOELHO = Coxa ÷ Joelho                          │
│                                                                 │
│                      ┌─────────────┐                            │
│                   ←──│    COXA     │──→  (maior circunferência) │
│                      └─────────────┘                            │
│                             │                                   │
│                         ┌───┴───┐                               │
│                      ←──│JOELHO │──→    (estrutura óssea)       │
│                         └───────┘                               │
│                                                                 │
│  Quanto maior o ratio, mais desenvolvida a coxa                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Fórmula

```typescript
function calcularCoxaJoelho(
  coxa: number,
  joelho: number
): ProportionResult {
  
  const indiceAtual = coxa / joelho
  
  return {
    nome: 'Proporção Coxa-Joelho',
    categoria: 'POTÊNCIA DE PERNAS',
    indiceAtual,
    descricao: 'Desenvolvimento muscular da coxa relativo à estrutura óssea.',
    ehInversa: false,
  }
}
```

### 8.3 Metas por Categoria

| Categoria | Meta Ratio | Interpretação |
|-----------|:----------:|---------------|
| **Golden Ratio** | **1.60** | Proporção clássica |
| **Bikini** | **1.55** | Pernas tonificadas |
| **Wellness** | **1.75** | Coxas muito volumosas! |
| **Figure** | **1.65** | Bom desenvolvimento |
| **Women's Physique** | **1.70** | Desenvolvimento muscular |
| **Women's Bodybuilding** | **1.80** | Máximo desenvolvimento |

---

## 9. PROPORÇÃO 7: COXA ÷ PANTURRILHA

### 9.1 Descrição

A proporção **Coxa-Panturrilha** mede o equilíbrio entre membros inferiores superior e inferior.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│        COXA-PANTURRILHA = Coxa ÷ Panturrilha                    │
│                                                                 │
│                      ┌─────────────┐                            │
│                   ←──│    COXA     │──→                         │
│                      └─────────────┘                            │
│                             │                                   │
│                         ┌───┴───┐                               │
│                      ←──│ PANT. │──→                            │
│                         └───────┘                               │
│                                                                 │
│  Ideal: Proporção equilibrada entre coxa e panturrilha          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Fórmula

```typescript
function calcularCoxaPanturrilha(
  coxa: number,
  panturrilha: number
): ProportionResult {
  
  const indiceAtual = coxa / panturrilha
  
  return {
    nome: 'Proporção Coxa-Panturrilha',
    categoria: 'SIMETRIA INFERIOR',
    indiceAtual,
    descricao: 'Equilíbrio entre coxa e panturrilha.',
    ehInversa: false,
  }
}
```

### 9.3 Metas por Categoria

| Categoria | Meta Ratio | Interpretação |
|-----------|:----------:|---------------|
| **Golden Ratio** | **1.40** | Proporção clássica |
| **Bikini** | **1.45** | Coxas ligeiramente maiores |
| **Wellness** | **1.55** | Coxas muito maiores que panturrilhas |
| **Figure** | **1.45** | Equilíbrio |
| **Women's Physique** | **1.50** | Desenvolvimento proporcional |
| **Women's Bodybuilding** | **1.50** | Desenvolvimento proporcional |

---

## 10. PROPORÇÃO 8: PANTURRILHA ÷ TORNOZELO

### 10.1 Descrição

A proporção **Panturrilha-Tornozelo** mede o desenvolvimento muscular da panturrilha em relação à estrutura óssea.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│      PANTURRILHA-TORNOZELO = Panturrilha ÷ Tornozelo            │
│                                                                 │
│                         ┌───────┐                               │
│                      ←──│ PANT. │──→  (maior circunferência)    │
│                         └───────┘                               │
│                             │                                   │
│                         ┌───┴───┐                               │
│                      ←──│TORNOZ.│──→  (estrutura óssea)         │
│                         └───────┘                               │
│                                                                 │
│  Quanto maior o ratio, mais desenvolvida a panturrilha          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Fórmula

```typescript
function calcularPanturrilhaTornozelo(
  panturrilha: number,
  tornozelo: number
): ProportionResult {
  
  const indiceAtual = panturrilha / tornozelo
  
  return {
    nome: 'Proporção Panturrilha-Tornozelo',
    categoria: 'DETALHAMENTO',
    indiceAtual,
    descricao: 'Desenvolvimento muscular da panturrilha relativo à estrutura óssea.',
    ehInversa: false,
  }
}
```

### 10.3 Metas por Categoria

| Categoria | Meta Ratio | Interpretação |
|-----------|:----------:|---------------|
| **Golden Ratio** | **1.80** | Proporção clássica |
| **Bikini** | **1.70** | Panturrilhas proporcionais |
| **Wellness** | **1.75** | Desenvolvimento moderado |
| **Figure** | **1.85** | Bom desenvolvimento |
| **Women's Physique** | **1.90** | Desenvolvimento muscular |
| **Women's Bodybuilding** | **1.95** | Máximo desenvolvimento |

---

## 11. TABELA COMPLETA DE METAS

### 11.1 Todas as Proporções por Categoria

```typescript
const METAS_FEMININAS = {
  // Proporção 1: WHR (Cintura ÷ Quadril) - INVERSA
  whr: {
    golden_ratio: 0.70,
    bikini: 0.68,
    wellness: 0.65,
    figure: 0.72,
    womens_physique: 0.75,
    womens_bodybuilding: 0.78,
  },
  
  // Proporção 2: Busto ÷ Cintura
  bustoCintura: {
    golden_ratio: 1.40,
    bikini: 1.35,
    wellness: 1.30,
    figure: 1.38,
    womens_physique: 1.35,
    womens_bodybuilding: 1.30,
  },
  
  // Proporção 2b: Quadril ÷ Cintura
  quadrilCintura: {
    golden_ratio: 1.42,
    bikini: 1.50,
    wellness: 1.55,
    figure: 1.38,
    womens_physique: 1.35,
    womens_bodybuilding: 1.30,
  },
  
  // Proporção 2c: Busto ÷ Quadril
  bustoQuadril: {
    golden_ratio: 0.97,
    bikini: 0.90,
    wellness: 0.84,
    figure: 1.00,
    womens_physique: 1.00,
    womens_bodybuilding: 1.00,
  },
  
  // Proporção 3: Ombros ÷ Quadril
  ombrosQuadril: {
    golden_ratio: 1.00,
    bikini: 0.95,
    wellness: 0.90,
    figure: 1.05,
    womens_physique: 1.10,
    womens_bodybuilding: 1.15,
  },
  
  // Proporção 4: Antebraço ÷ Braço
  antebracoBraco: {
    golden_ratio: 0.78,
    bikini: 0.75,
    wellness: 0.76,
    figure: 0.78,
    womens_physique: 0.80,
    womens_bodybuilding: 0.82,
  },
  
  // Proporção 5: Coxa ÷ Quadril
  coxaQuadril: {
    golden_ratio: 0.58,
    bikini: 0.56,
    wellness: 0.65,
    figure: 0.60,
    womens_physique: 0.62,
    womens_bodybuilding: 0.65,
  },
  
  // Proporção 6: Coxa ÷ Joelho
  coxaJoelho: {
    golden_ratio: 1.60,
    bikini: 1.55,
    wellness: 1.75,
    figure: 1.65,
    womens_physique: 1.70,
    womens_bodybuilding: 1.80,
  },
  
  // Proporção 7: Coxa ÷ Panturrilha
  coxaPanturrilha: {
    golden_ratio: 1.40,
    bikini: 1.45,
    wellness: 1.55,
    figure: 1.45,
    womens_physique: 1.50,
    womens_bodybuilding: 1.50,
  },
  
  // Proporção 8: Panturrilha ÷ Tornozelo
  panturrilhaTornozelo: {
    golden_ratio: 1.80,
    bikini: 1.70,
    wellness: 1.75,
    figure: 1.85,
    womens_physique: 1.90,
    womens_bodybuilding: 1.95,
  },
}
```

### 11.2 Tabela Visual Completa

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                              METAS POR PROPORÇÃO E CATEGORIA                                 │
├────────────────────────┬────────┬────────┬──────────┬────────┬───────────┬───────────────────┤
│ PROPORÇÃO              │ GOLDEN │ BIKINI │ WELLNESS │ FIGURE │ W.PHYSIQUE│ W.BODYBUILDING    │
├────────────────────────┼────────┼────────┼──────────┼────────┼───────────┼───────────────────┤
│ 1. WHR (Cint÷Quad) ↓   │  0.70  │  0.68  │   0.65   │  0.72  │   0.75    │      0.78         │
│ 2a. Busto÷Cintura      │  1.40  │  1.35  │   1.30   │  1.38  │   1.35    │      1.30         │
│ 2b. Quadril÷Cintura    │  1.42  │  1.50  │   1.55   │  1.38  │   1.35    │      1.30         │
│ 2c. Busto÷Quadril      │  0.97  │  0.90  │   0.84   │  1.00  │   1.00    │      1.00         │
│ 3. Ombros÷Quadril      │  1.00  │  0.95  │   0.90   │  1.05  │   1.10    │      1.15         │
│ 4. Anteb.÷Braço        │  0.78  │  0.75  │   0.76   │  0.78  │   0.80    │      0.82         │
│ 5. Coxa÷Quadril        │  0.58  │  0.56  │   0.65   │  0.60  │   0.62    │      0.65         │
│ 6. Coxa÷Joelho         │  1.60  │  1.55  │   1.75   │  1.65  │   1.70    │      1.80         │
│ 7. Coxa÷Panturrilha    │  1.40  │  1.45  │   1.55   │  1.45  │   1.50    │      1.50         │
│ 8. Pant.÷Tornozelo     │  1.80  │  1.70  │   1.75   │  1.85  │   1.90    │      1.95         │
├────────────────────────┴────────┴────────┴──────────┴────────┴───────────┴───────────────────┤
│ ↓ = Proporção INVERSA (menor é melhor)                                                       │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. PESOS POR CATEGORIA

### 12.1 Importância de Cada Proporção por Categoria

```typescript
const PESOS_POR_CATEGORIA = {
  golden_ratio: {
    whr: 20,                    // WHR muito importante
    ampulheta: 18,              // Harmonia busto/cintura/quadril
    ombrosQuadril: 12,          // Equilíbrio
    antebracoBraco: 5,          // Menor importância
    coxaQuadril: 12,            // Desenvolvimento de pernas
    coxaJoelho: 10,             // Desenvolvimento muscular
    coxaPanturrilha: 10,        // Equilíbrio inferior
    panturrilhaTornozelo: 8,    // Detalhamento
    // Simetria: 5% implícito
  },
  
  bikini: {
    whr: 25,                    // WHR MUITO importante!
    ampulheta: 20,              // Curvas são essenciais
    ombrosQuadril: 10,          // Quadril > ombros
    antebracoBraco: 3,          // Pouca importância
    coxaQuadril: 15,            // Coxas proporcionais
    coxaJoelho: 8,              // Tonificação
    coxaPanturrilha: 10,        // Equilíbrio
    panturrilhaTornozelo: 5,    // Menor foco
    // Glúteos têm peso extra via coxaQuadril e WHR
  },
  
  wellness: {
    whr: 18,                    // Importante mas quadril é maior
    ampulheta: 12,              // Menos foco em cintura fina
    ombrosQuadril: 8,           // Quadril domina
    antebracoBraco: 3,          // Pouca importância
    coxaQuadril: 25,            // COXAS são o foco!
    coxaJoelho: 15,             // Desenvolvimento de coxa
    coxaPanturrilha: 12,        // Coxas > panturrilhas
    panturrilhaTornozelo: 5,    // Menor foco
  },
  
  figure: {
    whr: 15,                    // Importante mas menos que bikini
    ampulheta: 15,              // Simetria geral
    ombrosQuadril: 18,          // Ombros desenvolvidos!
    antebracoBraco: 8,          // Braços definidos
    coxaQuadril: 12,            // Pernas desenvolvidas
    coxaJoelho: 12,             // Desenvolvimento muscular
    coxaPanturrilha: 10,        // Equilíbrio
    panturrilhaTornozelo: 8,    // Detalhamento
  },
  
  womens_physique: {
    whr: 10,                    // Menos ênfase em curvas
    ampulheta: 10,              // Menos ênfase
    ombrosQuadril: 20,          // V-Taper importante!
    antebracoBraco: 12,         // Braços desenvolvidos
    coxaQuadril: 15,            // Pernas musculosas
    coxaJoelho: 12,             // Desenvolvimento
    coxaPanturrilha: 10,        // Equilíbrio
    panturrilhaTornozelo: 10,   // Detalhamento
  },
  
  womens_bodybuilding: {
    whr: 5,                     // Mínima ênfase em curvas
    ampulheta: 5,               // Mínima ênfase
    ombrosQuadril: 20,          // V-Taper máximo
    antebracoBraco: 15,         // Braços muito desenvolvidos
    coxaQuadril: 18,            // Pernas enormes
    coxaJoelho: 15,             // Máximo desenvolvimento
    coxaPanturrilha: 12,        // Equilíbrio
    panturrilhaTornozelo: 10,   // Detalhamento
  },
}
```

---

## 13. FUNÇÕES DE CÁLCULO COMPLETAS

### 13.1 Calcular Ideais para uma Atleta

```typescript
interface IdeaisFemininos {
  whr: number
  bustoCintura: number
  quadrilCintura: number
  bustoQuadril: number
  ombrosQuadril: number
  antebracoBraco: number
  coxaQuadril: number
  coxaJoelho: number
  coxaPanturrilha: number
  panturrilhaTornozelo: number
}

function calcularIdeaisFemininos(
  metodo: 'GOLDEN_RATIO' | 'BIKINI' | 'WELLNESS' | 'FIGURE' | 'WOMENS_PHYSIQUE' | 'WOMENS_BODYBUILDING'
): IdeaisFemininos {
  
  const chaveMetodo = metodo.toLowerCase().replace('_', '_')
  
  return {
    whr: METAS_FEMININAS.whr[chaveMetodo],
    bustoCintura: METAS_FEMININAS.bustoCintura[chaveMetodo],
    quadrilCintura: METAS_FEMININAS.quadrilCintura[chaveMetodo],
    bustoQuadril: METAS_FEMININAS.bustoQuadril[chaveMetodo],
    ombrosQuadril: METAS_FEMININAS.ombrosQuadril[chaveMetodo],
    antebracoBraco: METAS_FEMININAS.antebracoBraco[chaveMetodo],
    coxaQuadril: METAS_FEMININAS.coxaQuadril[chaveMetodo],
    coxaJoelho: METAS_FEMININAS.coxaJoelho[chaveMetodo],
    coxaPanturrilha: METAS_FEMININAS.coxaPanturrilha[chaveMetodo],
    panturrilhaTornozelo: METAS_FEMININAS.panturrilhaTornozelo[chaveMetodo],
  }
}
```

### 13.2 Calcular Proporções Atuais

```typescript
interface ProporcoesAtuaisFemininas {
  whr: ProportionResult
  bustoCintura: ProportionResult
  quadrilCintura: ProportionResult
  bustoQuadril: ProportionResult
  ombrosQuadril: ProportionResult
  antebracoBraco: ProportionResult
  coxaQuadril: ProportionResult
  coxaJoelho: ProportionResult
  coxaPanturrilha: ProportionResult
  panturrilhaTornozelo: ProportionResult
  ampulheta: AmpulhetaResult
}

function calcularProporcoesAtuais(
  medidas: MedidasVariaveisFemininas & MedidasEstruturaisFemininas
): ProporcoesAtuaisFemininas {
  
  return {
    // 1. WHR
    whr: calcularWHR(medidas.cintura, medidas.quadril),
    
    // 2. Ampulheta (3 sub-proporções)
    bustoCintura: {
      nome: 'Busto ÷ Cintura',
      indiceAtual: medidas.busto / medidas.cintura,
      ehInversa: false,
    },
    quadrilCintura: {
      nome: 'Quadril ÷ Cintura',
      indiceAtual: medidas.quadril / medidas.cintura,
      ehInversa: false,
    },
    bustoQuadril: {
      nome: 'Busto ÷ Quadril',
      indiceAtual: medidas.busto / medidas.quadril,
      ehInversa: false,
    },
    ampulheta: calcularAmpulheta(medidas.busto, medidas.cintura, medidas.quadril),
    
    // 3. Ombros ÷ Quadril
    ombrosQuadril: calcularShoulderHipRatio(medidas.ombros, medidas.quadril),
    
    // 4. Antebraço ÷ Braço
    antebracoBraco: calcularBracoAntebraco(medidas.braco, medidas.antebraco),
    
    // 5. Coxa ÷ Quadril
    coxaQuadril: calcularHipThighRatio(medidas.coxa, medidas.quadril),
    
    // 6. Coxa ÷ Joelho
    coxaJoelho: calcularCoxaJoelho(medidas.coxa, medidas.joelho),
    
    // 7. Coxa ÷ Panturrilha
    coxaPanturrilha: calcularCoxaPanturrilha(medidas.coxa, medidas.panturrilha),
    
    // 8. Panturrilha ÷ Tornozelo
    panturrilhaTornozelo: calcularPanturrilhaTornozelo(medidas.panturrilha, medidas.tornozelo),
  }
}
```

### 13.3 Calcular Score Total

```typescript
interface ScoreFemininoResult {
  scoreTotal: number
  classificacao: ClassificacaoNivel
  scoresDetalhados: {
    proporcao: string
    indiceAtual: number
    indiceMeta: number
    percentualDoIdeal: number
    peso: number
    contribuicao: number
  }[]
  recomendacaoCategoria: {
    categoria: string
    score: number
    aderencia: number
  }[]
}

function calcularScoreFeminino(
  medidas: MedidasVariaveisFemininas & MedidasEstruturaisFemininas,
  metodo: string = 'GOLDEN_RATIO'
): ScoreFemininoResult {
  
  const proporcoes = calcularProporcoesAtuais(medidas)
  const ideais = calcularIdeaisFemininos(metodo)
  const pesos = PESOS_POR_CATEGORIA[metodo.toLowerCase()]
  
  let scoreAcumulado = 0
  const scoresDetalhados = []
  
  // Lista de proporções para calcular
  const propList = [
    { key: 'whr', nome: 'WHR', ehInversa: true },
    { key: 'bustoCintura', nome: 'Busto ÷ Cintura', ehInversa: false },
    { key: 'quadrilCintura', nome: 'Quadril ÷ Cintura', ehInversa: false },
    { key: 'ombrosQuadril', nome: 'Ombros ÷ Quadril', ehInversa: false },
    { key: 'antebracoBraco', nome: 'Antebraço ÷ Braço', ehInversa: false },
    { key: 'coxaQuadril', nome: 'Coxa ÷ Quadril', ehInversa: false },
    { key: 'coxaJoelho', nome: 'Coxa ÷ Joelho', ehInversa: false },
    { key: 'coxaPanturrilha', nome: 'Coxa ÷ Panturrilha', ehInversa: false },
    { key: 'panturrilhaTornozelo', nome: 'Panturrilha ÷ Tornozelo', ehInversa: false },
  ]
  
  for (const prop of propList) {
    const atual = proporcoes[prop.key]?.indiceAtual || proporcoes[prop.key]
    const meta = ideais[prop.key]
    const peso = pesos[prop.key] || 0
    
    if (!atual || !meta || !peso) continue
    
    let percentualDoIdeal: number
    
    if (prop.ehInversa) {
      // WHR: menor é melhor
      percentualDoIdeal = calcularPercentualInverso(atual, meta)
    } else {
      percentualDoIdeal = Math.min(110, (atual / meta) * 100)
    }
    
    const contribuicao = (percentualDoIdeal * peso) / 100
    scoreAcumulado += contribuicao
    
    scoresDetalhados.push({
      proporcao: prop.nome,
      indiceAtual: atual,
      indiceMeta: meta,
      percentualDoIdeal,
      peso,
      contribuicao,
    })
  }
  
  // Adicionar ampulheta (harmonia)
  const harmoniaAmpulheta = proporcoes.ampulheta.harmoniaPercentual
  const pesoAmpulheta = pesos.ampulheta || 15
  const contribuicaoAmpulheta = (harmoniaAmpulheta * pesoAmpulheta) / 100
  scoreAcumulado += contribuicaoAmpulheta
  
  scoresDetalhados.push({
    proporcao: 'Harmonia Ampulheta',
    indiceAtual: harmoniaAmpulheta,
    indiceMeta: 100,
    percentualDoIdeal: harmoniaAmpulheta,
    peso: pesoAmpulheta,
    contribuicao: contribuicaoAmpulheta,
  })
  
  // Score final (normalizado para 100)
  const pesoTotal = Object.values(pesos).reduce((a, b) => a + b, 0)
  const scoreTotal = Math.round((scoreAcumulado / pesoTotal) * 100 * 10) / 10
  
  // Calcular recomendação de categoria
  const recomendacaoCategoria = calcularRecomendacaoCategoria(medidas)
  
  return {
    scoreTotal,
    classificacao: classificarScore(scoreTotal),
    scoresDetalhados,
    recomendacaoCategoria,
  }
}
```

### 13.4 Recomendar Melhor Categoria

```typescript
function calcularRecomendacaoCategoria(
  medidas: MedidasVariaveisFemininas & MedidasEstruturaisFemininas
): { categoria: string; score: number; aderencia: number }[] {
  
  const categorias = [
    'GOLDEN_RATIO',
    'BIKINI',
    'WELLNESS',
    'FIGURE',
    'WOMENS_PHYSIQUE',
    'WOMENS_BODYBUILDING',
  ]
  
  const resultados = categorias.map(categoria => {
    const resultado = calcularScoreFeminino(medidas, categoria)
    return {
      categoria: categoria.replace(/_/g, ' '),
      score: resultado.scoreTotal,
      aderencia: resultado.scoreTotal, // Simplificado
    }
  })
  
  // Ordenar por score descendente
  return resultados.sort((a, b) => b.score - a.score)
}
```

---

## 14. EXEMPLO DE CÁLCULO

### 14.1 Dados de Entrada (Atleta Exemplo)

```typescript
const atletaExemplo = {
  // Estruturais
  altura: 165,
  punho: 15,
  tornozelo: 20,
  joelho: 35,
  
  // Variáveis
  busto: 90,
  cintura: 65,
  quadril: 98,
  ombros: 95,
  braco: 28,
  antebraco: 22,
  coxa: 58,
  panturrilha: 36,
}
```

### 14.2 Cálculo das Proporções

```typescript
// 1. WHR
const whr = 65 / 98  // = 0.663 ✅ Excelente!

// 2a. Busto ÷ Cintura
const bustoCintura = 90 / 65  // = 1.385

// 2b. Quadril ÷ Cintura
const quadrilCintura = 98 / 65  // = 1.508

// 2c. Busto ÷ Quadril
const bustoQuadril = 90 / 98  // = 0.918

// 3. Ombros ÷ Quadril
const ombrosQuadril = 95 / 98  // = 0.969

// 4. Antebraço ÷ Braço
const antebracoBraco = 22 / 28  // = 0.786

// 5. Coxa ÷ Quadril
const coxaQuadril = 58 / 98  // = 0.592

// 6. Coxa ÷ Joelho
const coxaJoelho = 58 / 35  // = 1.657

// 7. Coxa ÷ Panturrilha
const coxaPanturrilha = 58 / 36  // = 1.611

// 8. Panturrilha ÷ Tornozelo
const panturrilhaTornozelo = 36 / 20  // = 1.800
```

### 14.3 Comparação com Metas (Golden Ratio)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     RESULTADO - ATLETA EXEMPLO                               │
│                        Método: GOLDEN RATIO                                  │
├─────────────────────────┬──────────┬──────────┬──────────────┬──────────────┤
│ PROPORÇÃO               │  ATUAL   │   META   │  % DO IDEAL  │    STATUS    │
├─────────────────────────┼──────────┼──────────┼──────────────┼──────────────┤
│ 1. WHR (↓)              │   0.663  │   0.70   │    105%      │ ✅ ELITE     │
│ 2a. Busto ÷ Cintura     │   1.385  │   1.40   │    99%       │ ✅ META      │
│ 2b. Quadril ÷ Cintura   │   1.508  │   1.42   │    106%      │ ✅ ELITE     │
│ 2c. Busto ÷ Quadril     │   0.918  │   0.97   │    95%       │ 💪 QUASE LÁ │
│ 3. Ombros ÷ Quadril     │   0.969  │   1.00   │    97%       │ ✅ META      │
│ 4. Antebraço ÷ Braço    │   0.786  │   0.78   │    101%      │ ✅ META      │
│ 5. Coxa ÷ Quadril       │   0.592  │   0.58   │    102%      │ ✅ ELITE     │
│ 6. Coxa ÷ Joelho        │   1.657  │   1.60   │    104%      │ ✅ ELITE     │
│ 7. Coxa ÷ Panturrilha   │   1.611  │   1.40   │    115%      │ 👑 ELITE    │
│ 8. Pant. ÷ Tornozelo    │   1.800  │   1.80   │    100%      │ ✅ META      │
├─────────────────────────┴──────────┴──────────┴──────────────┴──────────────┤
│                                                                              │
│  SCORE TOTAL: 92.5 pts                    CLASSIFICAÇÃO: AVANÇADO 🥇        │
│                                                                              │
│  MELHOR CATEGORIA: WELLNESS (Score: 95.2)                                   │
│  Motivo: Quadril e coxas muito desenvolvidos!                               │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. CLASSIFICAÇÕES

### 15.1 Escala de Classificação (mesma do masculino)

```typescript
const CLASSIFICACOES_FEMININAS = {
  INICIO: { min: 0, max: 82, label: 'Início', emoji: '🚀' },
  CAMINHO: { min: 82, max: 90, label: 'Caminho', emoji: '🛤️' },
  QUASE_LA: { min: 90, max: 97, label: 'Quase Lá', emoji: '💪' },
  META: { min: 97, max: 103, label: 'Meta', emoji: '🎯' },
  ELITE: { min: 103, max: 150, label: 'Elite', emoji: '👑' },
}
```

---

## 16. REFERÊNCIAS DE ATLETAS

### 16.1 Atletas de Referência por Categoria

| Categoria | Atleta | Medidas Estimadas |
|-----------|--------|-------------------|
| **Bikini** | Lauralie Chapados | WHR: 0.66, Busto:Cintura 1.38 |
| **Wellness** | Francielle Mattos | Coxa÷Joelho: 1.80, Coxa÷Quadril: 0.68 |
| **Figure** | Cydney Gillon | Ombros÷Quadril: 1.08, Definição muscular |
| **W. Physique** | Natalia Abraham Coelho | V-Taper feminino, massa muscular |
| **W. Bodybuilding** | Andrea Shaw | Máxima massa, V-Taper extremo |

---

## 17. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - 8 proporções femininas |

---

**VITRU IA - Proporções Corporais Femininas v1.0**  
*Golden Ratio • Bikini • Wellness • Figure • Women's Physique • Women's Bodybuilding*