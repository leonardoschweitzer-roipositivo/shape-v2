# SPEC: Calculadora de Proporções Corporais

## Documento de Especificação Técnica v2.0

**Versão:** 2.0  
**Data:** Fevereiro 2026  
**Aplicação:** App de Análise de Físico e Proporções Corporais

---

## 1. VISÃO GERAL

Este documento especifica os cálculos e fórmulas para uma calculadora de proporções corporais com três métodos de comparação:

1. **Golden Ratio (Clássico)** - Proporções áureas baseadas em Eugen Sandow e Steve Reeves
2. **Classic Physique (CBum)** - Baseado em Chris Bumstead, 6x Mr. Olympia Classic Physique
3. **Men's Physique (Ryan Terry)** - Baseado em Ryan Terry, 3x Mr. Olympia Men's Physique

---

## 2. MEDIDAS NECESSÁRIAS (INPUT DO USUÁRIO)

### 2.1 Lista Completa de Medidas Obrigatórias

Para calcular TODAS as proporções nos 3 métodos, o usuário deve fornecer:

| # | Medida | Código | Unidade | Como Medir |
|---|--------|--------|---------|------------|
| 1 | **Altura** | `altura` | cm | Descalço, coluna ereta contra parede |
| 2 | **Punho** | `punho` | cm | Circunferência no osso proeminente (mão dominante) |
| 3 | **Tornozelo** | `tornozelo` | cm | Parte mais fina, acima do osso |
| 4 | **Joelho** | `joelho` | cm | Centro da patela, perna estendida e relaxada |
| 5 | **Pelve/Quadril** | `pelve` | cm | Parte mais larga da pelve/quadril |
| 6 | **Cintura** | `cintura` | cm | Parte mais estreita do abdômen (umbigo) |
| 7 | **Ombros** | `ombros` | cm | Ponto mais largo, braços relaxados ao lado |
| 8 | **Peitoral** | `peitoral` | cm | Na altura dos mamilos, respiração normal |
| 9 | **Braço** | `braco` | cm | Bíceps flexionado, ponto mais grosso |
| 10 | **Antebraço** | `antebraco` | cm | Ponto mais grosso, punho cerrado |
| 11 | **Pescoço** | `pescoco` | cm | Parte mais estreita, abaixo do pomo de Adão |
| 12 | **Coxa** | `coxa` | cm | Ponto mais grosso, perna relaxada |
| 13 | **Panturrilha** | `panturrilha` | cm | Ponto mais grosso, perna relaxada |

### 2.2 Classificação das Medidas

**Medidas Estruturais (não mudam com treino):**
- Altura, Punho, Tornozelo, Joelho, Pelve

**Medidas Variáveis (mudam com treino/dieta):**
- Cintura, Ombros, Peitoral, Braço, Antebraço, Pescoço, Coxa, Panturrilha

---

## 3. QUADRO DE PROPORÇÕES: FÓRMULAS POR MÉTODO

### 3.1 Tabela Completa de Referência

| # | Proporção | Partes Envolvidas | Golden Ratio (Clássico) | Classic Physique (CBum) | Men's Physique (Ryan Terry) |
|---|-----------|-------------------|-------------------------|-------------------------|----------------------------|
| 1 | **Ombros** | Ombro + Cintura | `1.618 × Cintura` | `1.70 × Cintura` | `1.55 × Cintura` |
| 2 | **Peitoral** | Peitoral + Punho | `6.5 × Punho` | `7.0 × Punho` | `6.2 × Punho` |
| 3 | **Antebraço** | Antebraço + Braço | `0.80 × Braço` | `0.80 × Braço` | `0.80 × Braço` |
| 4 | **Tríade** | Pescoço + Braço + Panturrilha | `1:1:1 (Igualdade)` | `~1:1:1 (Harmonia)` | N/A |
| 5 | **Cintura** | Cintura + Pelve | `0.86 × Pelve` | `0.42 × Altura` | `0.455 × Altura` |
| 6 | **Coxa/Panturrilha** | Coxa + Panturrilha | `Coxa = 1.5 × Panturrilha` | `Coxa = 1.5 × Panturrilha` | N/A (Não julgada) |
| 7 | **Panturrilha** | Panturrilha + Tornozelo | `1.92 × Tornozelo` | `0.96 × Braço` | Estética Geral |

---

## 4. FÓRMULAS DETALHADAS - GOLDEN RATIO (CLÁSSICO)

### 4.1 Constantes

```javascript
const GOLDEN_RATIO = {
    PHI: 1.618,                    // Proporção Áurea
    PEITO_PUNHO: 6.5,              // Multiplicador peitoral
    BRACO_PUNHO: 2.52,             // Multiplicador braço
    ANTEBRACO_BRACO: 0.80,         // Proporção antebraço/braço (80%)
    CINTURA_PELVE: 0.86,           // Proporção cintura
    COXA_JOELHO: 1.75,             // Multiplicador coxa
    COXA_PANTURRILHA: 1.5,         // Proporção coxa/panturrilha
    PANTURRILHA_TORNOZELO: 1.92    // Multiplicador panturrilha
}
```

### 4.2 Funções de Cálculo

```javascript
function calcularIdeaisGoldenRatio(medidas) {
    const { cintura, punho, pelve, joelho, tornozelo } = medidas
    
    // Calcular braço ideal primeiro (usado em outras proporções)
    const braco_ideal = punho * GOLDEN_RATIO.BRACO_PUNHO
    
    // Calcular panturrilha ideal (usado na proporção coxa/panturrilha)
    const panturrilha_ideal = tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO
    
    return {
        // 1. OMBROS: 1.618 × Cintura
        ombros: cintura * GOLDEN_RATIO.PHI,
        
        // 2. PEITORAL: 6.5 × Punho
        peitoral: punho * GOLDEN_RATIO.PEITO_PUNHO,
        
        // 3. BRAÇO: 2.52 × Punho
        braco: braco_ideal,
        
        // 4. ANTEBRAÇO: 0.80 × Braço (80% do braço)
        antebraco: braco_ideal * GOLDEN_RATIO.ANTEBRACO_BRACO,
        
        // 5. TRÍADE: Braço = Panturrilha = Pescoço (1:1:1)
        triade: {
            valor_ideal: braco_ideal,
            pescoço: braco_ideal,
            panturrilha: braco_ideal,
            regra: "Pescoço, Braço e Panturrilha devem ser iguais"
        },
        
        // 6. CINTURA: 0.86 × Pelve
        cintura: pelve * GOLDEN_RATIO.CINTURA_PELVE,
        
        // 7. COXA: 1.75 × Joelho
        coxa: joelho * GOLDEN_RATIO.COXA_JOELHO,
        
        // 8. COXA/PANTURRILHA: Coxa = 1.5 × Panturrilha
        coxa_panturrilha: {
            coxa_ideal: panturrilha_ideal * GOLDEN_RATIO.COXA_PANTURRILHA,
            panturrilha_ref: panturrilha_ideal,
            regra: "Coxa deve ser 1.5× a Panturrilha"
        },
        
        // 9. PANTURRILHA: 1.92 × Tornozelo
        panturrilha: panturrilha_ideal
    }
}
```

### 4.3 Cálculo de Score Golden Ratio

```javascript
function calcularScoreGoldenRatio(medidas) {
    const ideais = calcularIdeaisGoldenRatio(medidas)
    const atuais = medidas
    
    // Pesos de cada proporção (total = 100)
    const pesos = {
        ombros: 18,           // 1. Ombro + Cintura (V-taper prioridade)
        peitoral: 14,         // 2. Peitoral + Punho
        braco: 14,            // 3. Braço + Punho
        antebraco: 5,         // 4. Antebraço + Braço
        triade: 10,           // 5. Pescoço + Braço + Panturrilha (simetria)
        cintura: 12,          // 6. Cintura + Pelve (menor é melhor)
        coxa: 10,             // 7. Coxa + Joelho + Cintura
        coxa_panturrilha: 8,  // 8. Coxa + Panturrilha
        panturrilha: 9        // 9. Panturrilha + Tornozelo
    }
    
    let scores = {}
    
    // 1. Ombros (quanto maior até o ideal, melhor)
    scores.ombros = calcularScoreProporcional(atuais.ombros, ideais.ombros, pesos.ombros)
    
    // 2. Peitoral
    scores.peitoral = calcularScoreProporcional(atuais.peitoral, ideais.peitoral, pesos.peitoral)
    
    // 3. Braço
    scores.braco = calcularScoreProporcional(atuais.braco, ideais.braco, pesos.braco)
    
    // 4. Antebraço
    scores.antebraco = calcularScoreProporcional(atuais.antebraco, ideais.antebraco, pesos.antebraco)
    
    // 5. Tríade (simetria entre pescoço, braço e panturrilha)
    scores.triade = calcularScoreTriade(atuais.pescoco, atuais.braco, atuais.panturrilha, pesos.triade)
    
    // 6. Cintura (INVERTIDO - menor é melhor)
    scores.cintura = calcularScoreInverso(atuais.cintura, ideais.cintura, pesos.cintura)
    
    // 7. Coxa
    scores.coxa = calcularScoreProporcional(atuais.coxa, ideais.coxa, pesos.coxa)
    
    // 8. Coxa/Panturrilha (proporção entre as duas)
    scores.coxa_panturrilha = calcularScoreCoxaPanturrilha(atuais.coxa, atuais.panturrilha, GOLDEN_RATIO.COXA_PANTURRILHA, pesos.coxa_panturrilha)
    
    // 9. Panturrilha
    scores.panturrilha = calcularScoreProporcional(atuais.panturrilha, ideais.panturrilha, pesos.panturrilha)
    
    const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
    
    return {
        scores_detalhados: scores,
        score_total: Math.round(scoreTotal * 100) / 100,
        ideais: ideais,
        diferencas: calcularDiferencas(atuais, ideais)
    }
}

// Funções auxiliares
function calcularScoreProporcional(atual, ideal, peso) {
    const percentual = Math.min(100, (atual / ideal) * 100)
    return percentual * (peso / 100)
}

function calcularScoreInverso(atual, ideal, peso) {
    if (atual <= ideal) return peso // 100% se igual ou menor
    const percentual = (ideal / atual) * 100
    return percentual * (peso / 100)
}

function calcularScoreTriade(pescoco, braco, panturrilha, peso) {
    // Média das medidas
    const media = (pescoco + braco + panturrilha) / 3
    
    // Desvio de cada medida em relação à média
    const desvios = [
        Math.abs(pescoco - media) / media,
        Math.abs(braco - media) / media,
        Math.abs(panturrilha - media) / media
    ]
    
    // Média dos desvios (0 = perfeito, 1 = muito desigual)
    const desvioMedio = desvios.reduce((a, b) => a + b, 0) / 3
    
    // Converter para score (100% se desvio = 0)
    const percentual = Math.max(0, (1 - desvioMedio) * 100)
    return percentual * (peso / 100)
}

function calcularScoreCoxaPanturrilha(coxa, panturrilha, ratioIdeal, peso) {
    // Proporção atual
    const ratioAtual = coxa / panturrilha
    
    // Score baseado em quão perto está do ideal (1.5)
    const percentual = Math.min(100, Math.max(0, (1 - Math.abs(ratioAtual - ratioIdeal) / ratioIdeal) * 100))
    return percentual * (peso / 100)
}

function calcularDiferencas(atuais, ideais) {
    const diffs = {}
    for (const [key, ideal] of Object.entries(ideais)) {
        if (typeof ideal === 'number' && atuais[key]) {
            diffs[key] = {
                diferenca: Math.round((ideal - atuais[key]) * 10) / 10,
                necessario: ideal > atuais[key] ? 'aumentar' : 'diminuir'
            }
        }
    }
    return diffs
}
```

---

## 5. FÓRMULAS DETALHADAS - CLASSIC PHYSIQUE (CBUM)

### 5.1 Constantes e Referências

```javascript
const CLASSIC_PHYSIQUE = {
    // Proporções baseadas em Chris Bumstead
    OMBROS_CINTURA: 1.70,          // V-taper mais agressivo
    PEITO_PUNHO: 7.0,              // Peitoral maior
    CINTURA_ALTURA: 0.42,          // Cintura super apertada
    COXA_CINTURA: 0.97,            // Coxas proporcionais à cintura
    COXA_PANTURRILHA: 1.5,         // Proporção coxa/panturrilha
    PANTURRILHA_BRACO: 0.96,       // Quase iguais
    ANTEBRACO_BRACO: 0.80,         // 80% do braço
    
    // Referência CBum (185cm altura)
    CBUM_ALTURA: 185,
    CBUM_BRACO: 50,                // 50cm de braço reference
    
    // Regra Tríade: Pescoço ≈ Braço ≈ Panturrilha
    TRIADE_HARMONIA: true
}

// Tabela de peso máximo IFBB Pro Classic Physique
const CLASSIC_WEIGHT_LIMITS = {
    // altura_cm: peso_max_kg
    162.6: 80.3,   // 5'4"
    165.1: 82.6,   // 5'5"
    167.6: 84.8,   // 5'6"
    170.2: 87.1,   // 5'7"
    172.7: 89.4,   // 5'8"
    175.3: 91.6,   // 5'9"
    177.8: 93.9,   // 5'10"
    180.3: 97.5,   // 5'11"
    182.9: 100.7,  // 6'0"
    185.4: 104.3,  // 6'1"
    188.0: 108.9,  // 6'2"
    190.5: 112.0,  // 6'3"
    193.0: 115.2   // 6'4"
}
```

### 5.2 Funções de Cálculo

```javascript
function calcularIdeaisClassicPhysique(medidas) {
    const { altura, punho, cintura } = medidas
    
    // Fator de escala baseado na altura vs CBum
    const fatorAltura = altura / CLASSIC_PHYSIQUE.CBUM_ALTURA
    
    // Calcular braço ideal primeiro (usado em outras proporções)
    const braco_ideal = fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO
    
    // Calcular panturrilha ideal (baseada no braço)
    const panturrilha_ideal = braco_ideal * CLASSIC_PHYSIQUE.PANTURRILHA_BRACO
    
    return {
        // 1. OMBROS: 1.70 × Cintura
        ombros: cintura * CLASSIC_PHYSIQUE.OMBROS_CINTURA,
        
        // 2. PEITORAL: 7.0 × Punho
        peitoral: punho * CLASSIC_PHYSIQUE.PEITO_PUNHO,
        
        // 3. BRAÇO: Fator Altura × 50cm (escalado do CBum)
        braco: braco_ideal,
        
        // 4. ANTEBRAÇO: 0.80 × Braço (80% do braço)
        antebraco: braco_ideal * CLASSIC_PHYSIQUE.ANTEBRACO_BRACO,
        
        // 5. TRÍADE: Pescoço ≈ Braço ≈ Panturrilha (harmonia)
        triade: {
            valor_ideal: braco_ideal,
            pescoco: braco_ideal,
            panturrilha: panturrilha_ideal,
            regra: "Pescoço ≈ Braço ≈ Panturrilha (harmonia)"
        },
        
        // 6. CINTURA: 0.42 × Altura (muito apertada!)
        cintura: altura * CLASSIC_PHYSIQUE.CINTURA_ALTURA,
        
        // 7. COXA: 0.97 × Cintura
        coxa: cintura * CLASSIC_PHYSIQUE.COXA_CINTURA,
        
        // 8. COXA/PANTURRILHA: Coxa = 1.5 × Panturrilha
        coxa_panturrilha: {
            coxa_ideal: panturrilha_ideal * CLASSIC_PHYSIQUE.COXA_PANTURRILHA,
            panturrilha_ref: panturrilha_ideal,
            regra: "Coxa deve ser 1.5× a Panturrilha"
        },
        
        // 9. PANTURRILHA: 0.96 × Braço (quase igual)
        panturrilha: panturrilha_ideal,
        
        // Peso máximo da categoria
        peso_maximo: getPesoMaximoClassic(altura)
    }
}

function getPesoMaximoClassic(altura_cm) {
    const alturas = Object.keys(CLASSIC_WEIGHT_LIMITS).map(Number).sort((a, b) => a - b)
    
    // Se altura menor que mínimo ou maior que máximo
    if (altura_cm <= alturas[0]) return CLASSIC_WEIGHT_LIMITS[alturas[0]]
    if (altura_cm >= alturas[alturas.length - 1]) return CLASSIC_WEIGHT_LIMITS[alturas[alturas.length - 1]]
    
    // Encontrar intervalo e interpolar
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

### 5.3 Cálculo de Score Classic Physique

```javascript
function calcularScoreClassicPhysique(medidas) {
    const ideais = calcularIdeaisClassicPhysique(medidas)
    const atuais = medidas
    
    // Pesos ajustados para Classic (ênfase em V-taper e cintura apertada)
    const pesos = {
        ombros: 18,           // 1. Ombro + Cintura
        peitoral: 14,         // 2. Peitoral + Punho
        braco: 16,            // 3. Braço + Punho
        antebraco: 4,         // 4. Antebraço + Braço
        triade: 8,            // 5. Pescoço + Braço + Panturrilha
        cintura: 16,          // 6. Cintura + Pelve (muito importante no Classic)
        coxa: 10,             // 7. Coxa + Joelho + Cintura
        coxa_panturrilha: 6,  // 8. Coxa + Panturrilha
        panturrilha: 8        // 9. Panturrilha + Tornozelo
    }
    
    let scores = {}
    
    // 1. Ombros
    scores.ombros = calcularScoreProporcional(atuais.ombros, ideais.ombros, pesos.ombros)
    
    // 2. Peitoral
    scores.peitoral = calcularScoreProporcional(atuais.peitoral, ideais.peitoral, pesos.peitoral)
    
    // 3. Braço
    scores.braco = calcularScoreProporcional(atuais.braco, ideais.braco, pesos.braco)
    
    // 4. Antebraço
    scores.antebraco = calcularScoreProporcional(atuais.antebraco, ideais.antebraco, pesos.antebraco)
    
    // 5. Tríade (simetria entre pescoço, braço e panturrilha)
    scores.triade = calcularScoreTriade(atuais.pescoco, atuais.braco, atuais.panturrilha, pesos.triade)
    
    // 6. Cintura (INVERTIDO - menor é melhor)
    scores.cintura = calcularScoreInverso(atuais.cintura, ideais.cintura, pesos.cintura)
    
    // 7. Coxa
    scores.coxa = calcularScoreProporcional(atuais.coxa, ideais.coxa, pesos.coxa)
    
    // 8. Coxa/Panturrilha
    scores.coxa_panturrilha = calcularScoreCoxaPanturrilha(atuais.coxa, atuais.panturrilha, CLASSIC_PHYSIQUE.COXA_PANTURRILHA, pesos.coxa_panturrilha)
    
    // 9. Panturrilha
    scores.panturrilha = calcularScoreProporcional(atuais.panturrilha, ideais.panturrilha, pesos.panturrilha)
    
    const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
    
    return {
        scores_detalhados: scores,
        score_total: Math.round(scoreTotal * 100) / 100,
        ideais: ideais,
        diferencas: calcularDiferencas(atuais, ideais),
        peso_maximo_categoria: ideais.peso_maximo
    }
}
```

---

## 6. FÓRMULAS DETALHADAS - MEN'S PHYSIQUE (RYAN TERRY)

### 6.1 Constantes e Referências

```javascript
const MENS_PHYSIQUE = {
    // Proporções baseadas em Ryan Terry
    OMBROS_CINTURA: 1.55,          // V-taper mais suave
    PEITO_PUNHO: 6.2,              // Peitoral moderado
    CINTURA_ALTURA: 0.455,         // Cintura menos extrema
    ANTEBRACO_BRACO: 0.80,         // 80% do braço
    
    // Referência Ryan Terry (178cm altura)
    RYAN_ALTURA: 178,
    RYAN_BRACO: 43,                // 43cm de braço reference
    
    // Notas: Coxa e Panturrilha NÃO são julgadas (usa board shorts)
    PERNAS_JULGADAS: false
}
```

### 6.2 Funções de Cálculo

```javascript
function calcularIdeaisMensPhysique(medidas) {
    const { altura, punho, cintura, tornozelo } = medidas
    
    // Fator de escala baseado na altura vs Ryan Terry
    const fatorAltura = altura / MENS_PHYSIQUE.RYAN_ALTURA
    
    // Calcular braço ideal primeiro
    const braco_ideal = fatorAltura * MENS_PHYSIQUE.RYAN_BRACO
    
    return {
        // 1. OMBROS: 1.55 × Cintura
        ombros: cintura * MENS_PHYSIQUE.OMBROS_CINTURA,
        
        // 2. PEITORAL: 6.2 × Punho
        peitoral: punho * MENS_PHYSIQUE.PEITO_PUNHO,
        
        // 3. BRAÇO: Fator Altura × 43cm (escalado do Ryan)
        braco: braco_ideal,
        
        // 4. ANTEBRAÇO: 0.80 × Braço (80% do braço)
        antebraco: braco_ideal * MENS_PHYSIQUE.ANTEBRACO_BRACO,
        
        // 5. TRÍADE: N/A para Men's Physique
        triade: null,
        triade_nota: "Não aplicável - foco em upper body",
        
        // 6. CINTURA: 0.455 × Altura
        cintura: altura * MENS_PHYSIQUE.CINTURA_ALTURA,
        
        // 7. COXA: N/A - Não julgada (usa board shorts)
        coxa: null,
        coxa_nota: "Não julgada na categoria Men's Physique",
        
        // 8. COXA/PANTURRILHA: N/A - Não julgada
        coxa_panturrilha: null,
        coxa_panturrilha_nota: "Não julgada - usa board shorts",
        
        // 9. PANTURRILHA: Estética Geral (referência suave)
        panturrilha: tornozelo * 1.8,
        panturrilha_nota: "Estética geral, menos ênfase"
    }
}
```

### 6.3 Cálculo de Score Men's Physique

```javascript
function calcularScoreMensPhysique(medidas) {
    const ideais = calcularIdeaisMensPhysique(medidas)
    const atuais = medidas
    
    // Pesos para Men's Physique (foco em upper body e estética geral)
    // Nota: Coxa, Coxa/Panturrilha e Tríade não são julgadas
    const pesos = {
        ombros: 25,           // 1. Muito importante - deltoides são destaque
        peitoral: 22,         // 2. Peitoral + Punho
        braco: 25,            // 3. Braços são destaque
        antebraco: 6,         // 4. Antebraço + Braço
        triade: 0,            // 5. NÃO JULGADA
        cintura: 17,          // 6. Cintura + Pelve
        coxa: 0,              // 7. NÃO JULGADA
        coxa_panturrilha: 0,  // 8. NÃO JULGADA
        panturrilha: 5        // 9. Estética geral
    }
    
    let scores = {}
    
    // 1. Ombros
    scores.ombros = calcularScoreProporcional(atuais.ombros, ideais.ombros, pesos.ombros)
    
    // 2. Peitoral
    scores.peitoral = calcularScoreProporcional(atuais.peitoral, ideais.peitoral, pesos.peitoral)
    
    // 3. Braço
    scores.braco = calcularScoreProporcional(atuais.braco, ideais.braco, pesos.braco)
    
    // 4. Antebraço
    scores.antebraco = calcularScoreProporcional(atuais.antebraco, ideais.antebraco, pesos.antebraco)
    
    // 5. Tríade - Não julgada
    scores.triade = 0
    
    // 6. Cintura (INVERTIDO - menor é melhor)
    scores.cintura = calcularScoreInverso(atuais.cintura, ideais.cintura, pesos.cintura)
    
    // 7. Coxa - Não julgada
    scores.coxa = 0
    
    // 8. Coxa/Panturrilha - Não julgada
    scores.coxa_panturrilha = 0
    
    // 9. Panturrilha (estética geral)
    scores.panturrilha = calcularScoreProporcional(atuais.panturrilha, ideais.panturrilha, pesos.panturrilha)
    
    const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
    
    return {
        scores_detalhados: scores,
        score_total: Math.round(scoreTotal * 100) / 100,
        ideais: ideais,
        diferencas: calcularDiferencas(atuais, ideais),
        notas: {
            coxa: "Não julgada - usa board shorts",
            coxa_panturrilha: "Não julgada - usa board shorts",
            triade: "Não aplicável nesta categoria",
            foco: "Deltoides, braços e V-taper moderado"
        }
    }
}
```

---

## 7. RESUMO DAS FÓRMULAS - TABELA RÁPIDA

### 7.1 Fórmulas de Cálculo por Medida

| Medida | Golden Ratio | Classic Physique | Men's Physique |
|--------|--------------|------------------|----------------|
| # | Proporção | Golden Ratio | Classic Physique | Men's Physique |
|---|-----------|--------------|------------------|----------------|
| 1 | **Ombros** | `Cintura × 1.618` | `Cintura × 1.70` | `Cintura × 1.55` |
| 2 | **Peitoral** | `Punho × 6.5` | `Punho × 7.0` | `Punho × 6.2` |
| 3 | **Antebraço** | `Braço × 0.80` | `Braço × 0.80` | `Braço × 0.80` |
| 4 | **Tríade** | `Pesc = Braço = Pant` | `≈ 1:1:1` | `N/A` |
| 5 | **Cintura** | `Pelve × 0.86` | `Altura × 0.42` | `Altura × 0.455` |
| 6 | **Coxa/Pant** | `Coxa = Pant × 1.5` | `Coxa = Pant × 1.5` | `N/A` |
| 7 | **Panturrilha** | `Tornozelo × 1.92` | `Braço × 0.96` | Estética |

### 7.2 Medidas Necessárias por Método

| Medida Input | Golden Ratio | Classic Physique | Men's Physique |
|--------------|:------------:|:----------------:|:--------------:|
| Altura | ✅ | ✅ | ✅ |
| Punho | ✅ | ✅ | ✅ |
| Tornozelo | ✅ | ✅ | ✅ |
| Joelho | ✅ | ❌ | ❌ |
| Pelve | ✅ | ❌ | ❌ |
| Cintura | ✅ | ✅ | ✅ |
| Ombros | ✅ | ✅ | ✅ |
| Peitoral | ✅ | ✅ | ✅ |
| Braço | ✅ | ✅ | ✅ |
| Antebraço | ✅ | ✅ | ✅ |
| Pescoço | ✅ | ✅ | ❌ |
| Coxa | ✅ | ✅ | ❌ |
| Panturrilha | ✅ | ✅ | ✅ |

**Legenda:** ✅ = Obrigatório | ❌ = Não necessário para cálculo

---

## 8. FUNÇÃO PRINCIPAL - CÁLCULO COMPLETO

```javascript
function calcularTodasProporcoes(medidas) {
    // Validar medidas obrigatórias
    const validacao = validarMedidas(medidas)
    if (!validacao.valido) {
        return { erro: true, mensagem: validacao.erros }
    }
    
    // Calcular para os 3 métodos
    const goldenRatio = calcularScoreGoldenRatio(medidas)
    const classicPhysique = calcularScoreClassicPhysique(medidas)
    const mensPhysique = calcularScoreMensPhysique(medidas)
    
    // Determinar melhor categoria
    const categorias = [
        { nome: 'Golden Ratio', score: goldenRatio.score_total },
        { nome: 'Classic Physique', score: classicPhysique.score_total },
        { nome: "Men's Physique", score: mensPhysique.score_total }
    ].sort((a, b) => b.score - a.score)
    
    return {
        medidas_input: medidas,
        
        resultados: {
            golden_ratio: goldenRatio,
            classic_physique: classicPhysique,
            mens_physique: mensPhysique
        },
        
        recomendacao: {
            melhor_categoria: categorias[0].nome,
            score: categorias[0].score,
            ranking: categorias
        },
        
        classificacao: getClassificacao(categorias[0].score)
    }
}

function getClassificacao(score) {
    if (score >= 95) return { nivel: 'ELITE', emoji: '🏆', descricao: 'Proporções excepcionais' }
    if (score >= 85) return { nivel: 'AVANÇADO', emoji: '🥇', descricao: 'Muito acima da média' }
    if (score >= 75) return { nivel: 'INTERMEDIÁRIO', emoji: '🥈', descricao: 'Boas proporções' }
    if (score >= 60) return { nivel: 'INICIANTE', emoji: '💪', descricao: 'Em desenvolvimento' }
    return { nivel: 'INICIANTE', emoji: '🚀', descricao: 'Início da jornada' }
}

function validarMedidas(medidas) {
    const obrigatorias = ['altura', 'punho', 'cintura', 'ombros', 'peito', 'braco']
    const erros = []
    
    for (const campo of obrigatorias) {
        if (!medidas[campo] || medidas[campo] <= 0) {
            erros.push(`${campo} é obrigatório`)
        }
    }
    
    // Validar ranges
    const limites = {
        altura: [150, 220],
        punho: [14, 22],
        cintura: [60, 130],
        ombros: [90, 170],
        peito: [80, 160],
        braco: [25, 60]
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

## 9. EXEMPLO DE USO COMPLETO

### 9.1 Input do Usuário

```javascript
const medidasUsuario = {
    // Medidas estruturais
    altura: 180,        // cm
    punho: 17.5,        // cm
    tornozelo: 23,      // cm
    joelho: 38,         // cm
    pelve: 98,          // cm
    
    // Medidas variáveis
    cintura: 82,        // cm
    ombros: 120,        // cm
    peitoral: 108,      // cm
    braco: 40,          // cm
    antebraco: 32,      // cm
    pescoco: 40,        // cm
    coxa: 60,           // cm
    panturrilha: 38     // cm
}
```

### 9.2 Output Esperado

```javascript
{
    medidas_input: { /* medidasUsuario */ },
    
    resultados: {
        golden_ratio: {
            score_total: 82.5,
            ideais: {
                // 1. Ombros: Cintura × 1.618
                ombros: 132.7,
                // 2. Peitoral: Punho × 6.5
                peitoral: 113.8,
                // 3. Braço: Punho × 2.52
                braco: 44.1,
                // 4. Antebraço: Braço × 0.80
                antebraco: 35.3,
                // 5. Tríade: Pescoço = Braço = Panturrilha
                triade: { valor_ideal: 44.1 },
                // 6. Cintura: Pelve × 0.86
                cintura: 84.3,
                // 7. Coxa: Joelho × 1.75
                coxa: 66.5,
                // 8. Coxa/Panturrilha: Coxa = Pant × 1.5
                coxa_panturrilha: { coxa_ideal: 66.3 },
                // 9. Panturrilha: Tornozelo × 1.92
                panturrilha: 44.2
            },
            diferencas: {
                ombros: { diferenca: 12.7, necessario: 'aumentar' },
                braco: { diferenca: 4.1, necessario: 'aumentar' },
                cintura: { diferenca: 2.3, necessario: 'diminuir' }
                // ...
            }
        },
        
        classic_physique: {
            score_total: 78.3,
            ideais: {
                // 1. Ombros: Cintura × 1.70
                ombros: 139.4,
                // 2. Peitoral: Punho × 7.0
                peitoral: 122.5,
                // 3. Braço: (Altura/185) × 50
                braco: 48.6,
                // 4. Antebraço: Braço × 0.80
                antebraco: 38.9,
                // 5. Tríade: ~1:1:1
                triade: { valor_ideal: 48.6 },
                // 6. Cintura: Altura × 0.42
                cintura: 75.6,
                // 7. Coxa: Cintura × 0.97
                coxa: 79.5,
                // 8. Coxa/Panturrilha: Coxa = Pant × 1.5
                coxa_panturrilha: { coxa_ideal: 70.0 },
                // 9. Panturrilha: Braço × 0.96
                panturrilha: 46.7
            },
            peso_maximo_categoria: 97.5  // kg para 180cm
        },
        
        mens_physique: {
            score_total: 85.1,
            ideais: {
                // 1. Ombros: Cintura × 1.55
                ombros: 127.1,
                // 2. Peitoral: Punho × 6.2
                peitoral: 108.5,
                // 3. Braço: (Altura/178) × 43
                braco: 43.5,
                // 4. Antebraço: Braço × 0.80
                antebraco: 34.8,
                // 5. Tríade: N/A
                triade: null,
                // 6. Cintura: Altura × 0.455
                cintura: 81.9,
                // 7. Coxa: N/A
                coxa: null,
                // 8. Coxa/Panturrilha: N/A
                coxa_panturrilha: null,
                // 9. Panturrilha: Estética
                panturrilha: 41.4
            },
            notas: {
                coxa: "Não julgada - usa board shorts",
                coxa_panturrilha: "Não julgada - usa board shorts",
                triade: "Não aplicável nesta categoria"
            }
        }
    },
    
    recomendacao: {
        melhor_categoria: "Men's Physique",
        score: 85.1,
        ranking: [
            { nome: "Men's Physique", score: 85.1 },
            { nome: "Golden Ratio", score: 82.5 },
            { nome: "Classic Physique", score: 78.3 }
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

## 10. CONSIDERAÇÕES FINAIS

### 10.1 Observações Importantes

1. **Golden Ratio** é o padrão clássico de estética universal
2. **Classic Physique** exige cintura MUITO apertada e mais massa muscular
3. **Men's Physique** foca em upper body e não julga pernas (coxa, coxa/panturrilha)
4. A **Tríade** (pescoço = braço = panturrilha) só se aplica ao Golden Ratio e Classic
5. A proporção **Coxa/Panturrilha** (1.5:1) é nova e importante para simetria de pernas

### 10.2 Referências

- **Golden Ratio**: Eugen Sandow, Steve Reeves, John McCallum
- **Classic Physique**: Chris Bumstead (185cm, 104kg, 6x Olympia)
- **Men's Physique**: Ryan Terry (178cm, 93kg, 3x Olympia)
- **IFBB Pro League**: Tabelas oficiais de peso/altura 2024

---

**Versão 2.0 - Atualizado conforme quadro de proporções do app**