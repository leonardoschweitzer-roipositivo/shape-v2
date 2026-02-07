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
| 5 | **Pelvis/Quadril** | `pelvis` | cm | Parte mais larga da pelve/quadril |
| 6 | **Cabeça** | `cabeca` | cm | Circunferência acima das sobrancelhas |
| 7 | **Cintura** | `cintura` | cm | Parte mais estreita do abdômen (umbigo) |
| 8 | **Ombros** | `ombros` | cm | Ponto mais largo, braços relaxados ao lado |
| 9 | **Peito** | `peito` | cm | Na altura dos mamilos, respiração normal |
| 10 | **Braço** | `braco` | cm | Bíceps flexionado, ponto mais grosso |
| 11 | **Antebraço** | `antebraco` | cm | Ponto mais grosso, punho cerrado |
| 12 | **Coxa** | `coxa` | cm | Ponto mais grosso, perna relaxada |
| 13 | **Panturrilha** | `panturrilha` | cm | Ponto mais grosso, perna relaxada |
| 14 | **Pescoço** | `pescoco` | cm | Parte mais estreita, abaixo do pomo de Adão |

### 2.2 Classificação das Medidas

**Medidas Estruturais (não mudam com treino):**
- Altura, Punho, Tornozelo, Joelho, Pelvis, Cabeça

**Medidas Variáveis (mudam com treino/dieta):**
- Cintura, Ombros, Peito, Braço, Antebraço, Coxa, Panturrilha, Pescoço

---

## 3. QUADRO DE PROPORÇÕES: FÓRMULAS POR MÉTODO

### 3.1 Tabela Completa de Referência

| Medida Alvo | Partes Envolvidas | Golden Ratio (Clássico) | Classic Physique (CBum) | Men's Physique (Ryan Terry) |
|-------------|-------------------|-------------------------|-------------------------|----------------------------|
| **Ombros** | Ombros e Cintura | `1.618 × Cintura` | `1.70 × Cintura` | `1.55 × Cintura` |
| **Peito** | Peito e Punho | `6.5 × Punho` | `7.0 × Punho` | `6.2 × Punho` |
| **Braço** | Braço, Punho e Altura | `2.52 × Punho` | `(Altura/185) × 50cm` | `(Altura/178) × 43cm` |
| **Antebraço** | Antebraço e Peito | `0.29 × Peito Ideal` | Proporcional ao Braço | Estética do Punho |
| **Cintura** | Cintura, Pelvis e Altura | `0.86 × Pelvis` | `0.42 × Altura` | `0.455 × Altura` |
| **Coxa** | Coxa, Joelho e Cintura | `1.75 × Joelho` | `0.97 × Cintura` | N/A (Não julgada) |
| **Panturrilha** | Panturrilha, Tornozelo e Braço | `1.92 × Tornozelo` | `0.96 × Braço` | Estética Geral |
| **Pescoço** | Pescoço, Cabeça e Braço | `0.79 × Cabeça` | Igual ao Braço (Simetria) | Estética do Tronco |
| **Tríade** | Pescoço, Braço e Panturrilha | `1:1:1 (Igualdade)` | `~1:1:1 (Harmonia)` | N/A |

---

## 4. FÓRMULAS DETALHADAS - GOLDEN RATIO (CLÁSSICO)

### 4.1 Constantes

```javascript
const GOLDEN_RATIO = {
    PHI: 1.618,                    // Proporção Áurea
    PEITO_PUNHO: 6.5,              // Multiplicador peito
    BRACO_PUNHO: 2.52,             // Multiplicador braço
    ANTEBRACO_PEITO: 0.29,         // Proporção antebraço
    CINTURA_PELVIS: 0.86,          // Proporção cintura
    COXA_JOELHO: 1.75,             // Multiplicador coxa
    PANTURRILHA_TORNOZELO: 1.92,   // Multiplicador panturrilha
    PESCOCO_CABECA: 0.79           // Proporção pescoço
}
```

### 4.2 Funções de Cálculo

```javascript
function calcularIdeaisGoldenRatio(medidas) {
    const { cintura, punho, pelvis, joelho, tornozelo, cabeca } = medidas
    
    return {
        // 1. OMBROS: 1.618 × Cintura
        ombros: cintura * GOLDEN_RATIO.PHI,
        
        // 2. PEITO: 6.5 × Punho
        peito: punho * GOLDEN_RATIO.PEITO_PUNHO,
        
        // 3. BRAÇO: 2.52 × Punho
        braco: punho * GOLDEN_RATIO.BRACO_PUNHO,
        
        // 4. ANTEBRAÇO: 0.29 × Peito Ideal
        antebraco: (punho * GOLDEN_RATIO.PEITO_PUNHO) * GOLDEN_RATIO.ANTEBRACO_PEITO,
        
        // 5. CINTURA: 0.86 × Pelvis
        cintura: pelvis * GOLDEN_RATIO.CINTURA_PELVIS,
        
        // 6. COXA: 1.75 × Joelho
        coxa: joelho * GOLDEN_RATIO.COXA_JOELHO,
        
        // 7. PANTURRILHA: 1.92 × Tornozelo
        panturrilha: tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO,
        
        // 8. PESCOÇO: 0.79 × Cabeça
        pescoco: cabeca * GOLDEN_RATIO.PESCOCO_CABECA,
        
        // 9. TRÍADE: Braço = Panturrilha = Pescoço (1:1:1)
        triade: {
            valor_ideal: punho * GOLDEN_RATIO.BRACO_PUNHO, // Usa braço como referência
            regra: "Braço, Panturrilha e Pescoço devem ser iguais"
        }
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
        ombros: 20,      // V-taper é prioridade
        peito: 15,
        braco: 15,
        antebraco: 5,
        cintura: 15,     // Menor é melhor
        coxa: 10,
        panturrilha: 8,
        pescoco: 5,
        triade: 7        // Simetria
    }
    
    let scores = {}
    
    // Ombros (quanto maior, melhor até o ideal)
    scores.ombros = calcularScoreProporcional(atuais.ombros, ideais.ombros, pesos.ombros)
    
    // Peito
    scores.peito = calcularScoreProporcional(atuais.peito, ideais.peito, pesos.peito)
    
    // Braço
    scores.braco = calcularScoreProporcional(atuais.braco, ideais.braco, pesos.braco)
    
    // Antebraço
    scores.antebraco = calcularScoreProporcional(atuais.antebraco, ideais.antebraco, pesos.antebraco)
    
    // Cintura (INVERTIDO - menor é melhor)
    scores.cintura = calcularScoreInverso(atuais.cintura, ideais.cintura, pesos.cintura)
    
    // Coxa
    scores.coxa = calcularScoreProporcional(atuais.coxa, ideais.coxa, pesos.coxa)
    
    // Panturrilha
    scores.panturrilha = calcularScoreProporcional(atuais.panturrilha, ideais.panturrilha, pesos.panturrilha)
    
    // Pescoço
    scores.pescoco = calcularScoreProporcional(atuais.pescoco, ideais.pescoco, pesos.pescoco)
    
    // Tríade (simetria entre braço, panturrilha e pescoço)
    scores.triade = calcularScoreTriade(atuais.braco, atuais.panturrilha, atuais.pescoco, pesos.triade)
    
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

function calcularScoreTriade(braco, panturrilha, pescoco, peso) {
    // Média das medidas
    const media = (braco + panturrilha + pescoco) / 3
    
    // Desvio de cada medida em relação à média
    const desvios = [
        Math.abs(braco - media) / media,
        Math.abs(panturrilha - media) / media,
        Math.abs(pescoco - media) / media
    ]
    
    // Média dos desvios (0 = perfeito, 1 = muito desigual)
    const desvioMedio = desvios.reduce((a, b) => a + b, 0) / 3
    
    // Converter para score (100% se desvio = 0)
    const percentual = Math.max(0, (1 - desvioMedio) * 100)
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
    PEITO_PUNHO: 7.0,              // Peito maior
    CINTURA_ALTURA: 0.42,          // Cintura super apertada
    COXA_CINTURA: 0.97,            // Coxas proporcionais
    PANTURRILHA_BRACO: 0.96,       // Quase iguais
    
    // Referência CBum (185cm altura)
    CBUM_ALTURA: 185,
    CBUM_BRACO: 50,                // 50cm de braço reference
    
    // Regra: Pescoço = Braço (simetria)
    PESCOCO_BRACO: 1.0
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
    
    return {
        // 1. OMBROS: 1.70 × Cintura
        ombros: cintura * CLASSIC_PHYSIQUE.OMBROS_CINTURA,
        
        // 2. PEITO: 7.0 × Punho
        peito: punho * CLASSIC_PHYSIQUE.PEITO_PUNHO,
        
        // 3. BRAÇO: Fator Altura × 50cm (escalado do CBum)
        braco: fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO,
        
        // 4. ANTEBRAÇO: Proporcional ao Braço (~65% do braço)
        antebraco: (fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO) * 0.65,
        
        // 5. CINTURA: 0.42 × Altura (muito apertada!)
        cintura: altura * CLASSIC_PHYSIQUE.CINTURA_ALTURA,
        
        // 6. COXA: 0.97 × Cintura
        coxa: cintura * CLASSIC_PHYSIQUE.COXA_CINTURA,
        
        // 7. PANTURRILHA: 0.96 × Braço (quase igual)
        panturrilha: (fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO) * CLASSIC_PHYSIQUE.PANTURRILHA_BRACO,
        
        // 8. PESCOÇO: Igual ao Braço (simetria clássica)
        pescoco: fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO,
        
        // 9. TRÍADE: Harmonia ~1:1:1
        triade: {
            valor_ideal: fatorAltura * CLASSIC_PHYSIQUE.CBUM_BRACO,
            regra: "Braço ≈ Panturrilha ≈ Pescoço"
        },
        
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
        ombros: 20,
        peito: 15,
        braco: 18,
        antebraco: 4,
        cintura: 18,     // Muito importante no Classic
        coxa: 10,
        panturrilha: 7,
        pescoco: 3,
        triade: 5
    }
    
    let scores = {}
    
    scores.ombros = calcularScoreProporcional(atuais.ombros, ideais.ombros, pesos.ombros)
    scores.peito = calcularScoreProporcional(atuais.peito, ideais.peito, pesos.peito)
    scores.braco = calcularScoreProporcional(atuais.braco, ideais.braco, pesos.braco)
    scores.antebraco = calcularScoreProporcional(atuais.antebraco, ideais.antebraco, pesos.antebraco)
    scores.cintura = calcularScoreInverso(atuais.cintura, ideais.cintura, pesos.cintura)
    scores.coxa = calcularScoreProporcional(atuais.coxa, ideais.coxa, pesos.coxa)
    scores.panturrilha = calcularScoreProporcional(atuais.panturrilha, ideais.panturrilha, pesos.panturrilha)
    scores.pescoco = calcularScoreProporcional(atuais.pescoco, ideais.pescoco, pesos.pescoco)
    scores.triade = calcularScoreTriade(atuais.braco, atuais.panturrilha, atuais.pescoco, pesos.triade)
    
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
    PEITO_PUNHO: 6.2,              // Peito moderado
    CINTURA_ALTURA: 0.455,         // Cintura menos extrema
    
    // Referência Ryan Terry (178cm altura)
    RYAN_ALTURA: 178,
    RYAN_BRACO: 43,                // 43cm de braço reference
    
    // Notas: Coxa NÃO é julgada (usa board shorts)
    COXA_JULGADA: false,
    
    // Antebraço: Estética proporcional ao punho
    ANTEBRACO_PUNHO: 1.6,
    
    // Panturrilha e Pescoço: Estética geral, sem fórmula rígida
}
```

### 6.2 Funções de Cálculo

```javascript
function calcularIdeaisMensPhysique(medidas) {
    const { altura, punho, cintura } = medidas
    
    // Fator de escala baseado na altura vs Ryan Terry
    const fatorAltura = altura / MENS_PHYSIQUE.RYAN_ALTURA
    
    return {
        // 1. OMBROS: 1.55 × Cintura
        ombros: cintura * MENS_PHYSIQUE.OMBROS_CINTURA,
        
        // 2. PEITO: 6.2 × Punho
        peito: punho * MENS_PHYSIQUE.PEITO_PUNHO,
        
        // 3. BRAÇO: Fator Altura × 43cm (escalado do Ryan)
        braco: fatorAltura * MENS_PHYSIQUE.RYAN_BRACO,
        
        // 4. ANTEBRAÇO: Estética do Punho (~1.6x punho)
        antebraco: punho * MENS_PHYSIQUE.ANTEBRACO_PUNHO,
        
        // 5. CINTURA: 0.455 × Altura
        cintura: altura * MENS_PHYSIQUE.CINTURA_ALTURA,
        
        // 6. COXA: N/A - Não julgada (usa board shorts)
        coxa: null,
        coxa_nota: "Não julgada na categoria Men's Physique",
        
        // 7. PANTURRILHA: Estética Geral (proporcional ao tornozelo)
        panturrilha: medidas.tornozelo * 1.8, // Sugestão estética
        panturrilha_nota: "Estética geral, menos ênfase",
        
        // 8. PESCOÇO: Estética do Tronco (proporcional)
        pescoco: (fatorAltura * MENS_PHYSIQUE.RYAN_BRACO) * 0.9,
        pescoco_nota: "Proporcional ao visual do tronco",
        
        // 9. TRÍADE: N/A para Men's Physique
        triade: null
    }
}
```

### 6.3 Cálculo de Score Men's Physique

```javascript
function calcularScoreMensPhysique(medidas) {
    const ideais = calcularIdeaisMensPhysique(medidas)
    const atuais = medidas
    
    // Pesos para Men's Physique (foco em upper body e estética geral)
    // Nota: Coxa tem peso 0 pois não é julgada
    const pesos = {
        ombros: 25,      // Muito importante - deltoides são destaque
        peito: 20,
        braco: 25,       // Braços são destaque
        antebraco: 5,
        cintura: 15,
        coxa: 0,         // NÃO JULGADA
        panturrilha: 5,  // Estética geral
        pescoco: 5       // Estética geral
    }
    
    let scores = {}
    
    scores.ombros = calcularScoreProporcional(atuais.ombros, ideais.ombros, pesos.ombros)
    scores.peito = calcularScoreProporcional(atuais.peito, ideais.peito, pesos.peito)
    scores.braco = calcularScoreProporcional(atuais.braco, ideais.braco, pesos.braco)
    scores.antebraco = calcularScoreProporcional(atuais.antebraco, ideais.antebraco, pesos.antebraco)
    scores.cintura = calcularScoreInverso(atuais.cintura, ideais.cintura, pesos.cintura)
    scores.coxa = 0 // Não julgada
    scores.panturrilha = calcularScoreProporcional(atuais.panturrilha, ideais.panturrilha, pesos.panturrilha)
    scores.pescoco = calcularScoreProporcional(atuais.pescoco, ideais.pescoco, pesos.pescoco)
    
    const scoreTotal = Object.values(scores).reduce((a, b) => a + b, 0)
    
    return {
        scores_detalhados: scores,
        score_total: Math.round(scoreTotal * 100) / 100,
        ideais: ideais,
        diferencas: calcularDiferencas(atuais, ideais),
        notas: {
            coxa: "Não julgada - usa board shorts",
            panturrilha: "Estética geral, menos ênfase",
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
| **Ombros** | `Cintura × 1.618` | `Cintura × 1.70` | `Cintura × 1.55` |
| **Peito** | `Punho × 6.5` | `Punho × 7.0` | `Punho × 6.2` |
| **Braço** | `Punho × 2.52` | `(Altura/185) × 50` | `(Altura/178) × 43` |
| **Antebraço** | `Peito_ideal × 0.29` | `Braço × 0.65` | `Punho × 1.6` |
| **Cintura** | `Pelvis × 0.86` | `Altura × 0.42` | `Altura × 0.455` |
| **Coxa** | `Joelho × 1.75` | `Cintura × 0.97` | `N/A` |
| **Panturrilha** | `Tornozelo × 1.92` | `Braço × 0.96` | `Tornozelo × 1.8` |
| **Pescoço** | `Cabeça × 0.79` | `= Braço` | `Braço × 0.9` |
| **Tríade** | `Braço = Pant = Pesc` | `≈ 1:1:1` | `N/A` |

### 7.2 Medidas Necessárias por Método

| Medida Input | Golden Ratio | Classic Physique | Men's Physique |
|--------------|:------------:|:----------------:|:--------------:|
| Altura | ❌ | ✅ | ✅ |
| Punho | ✅ | ✅ | ✅ |
| Tornozelo | ✅ | ❌ | ✅ |
| Joelho | ✅ | ❌ | ❌ |
| Pelvis | ✅ | ❌ | ❌ |
| Cabeça | ✅ | ❌ | ❌ |
| Cintura | ✅ | ✅ | ✅ |
| Ombros | ✅ | ✅ | ✅ |
| Peito | ✅ | ✅ | ✅ |
| Braço | ✅ | ✅ | ✅ |
| Antebraço | ✅ | ✅ | ✅ |
| Coxa | ✅ | ✅ | ❌ |
| Panturrilha | ✅ | ✅ | ✅ |
| Pescoço | ✅ | ✅ | ✅ |

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
    pelvis: 98,         // cm
    cabeca: 58,         // cm
    
    // Medidas variáveis
    cintura: 82,        // cm
    ombros: 120,        // cm
    peito: 108,         // cm
    braco: 40,          // cm
    antebraco: 32,      // cm
    coxa: 60,           // cm
    panturrilha: 38,    // cm
    pescoco: 40         // cm
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
                ombros: 132.7,    // 82 × 1.618
                peito: 113.8,     // 17.5 × 6.5
                braco: 44.1,      // 17.5 × 2.52
                antebraco: 33.0,  // 113.8 × 0.29
                cintura: 84.3,    // 98 × 0.86
                coxa: 66.5,       // 38 × 1.75
                panturrilha: 44.2,// 23 × 1.92
                pescoco: 45.8     // 58 × 0.79
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
                ombros: 139.4,    // 82 × 1.70
                peito: 122.5,     // 17.5 × 7.0
                braco: 48.6,      // (180/185) × 50
                cintura: 75.6,    // 180 × 0.42
                coxa: 79.5,       // 82 × 0.97
                // ...
            },
            peso_maximo_categoria: 97.5  // kg para 180cm
        },
        
        mens_physique: {
            score_total: 85.1,
            ideais: {
                ombros: 127.1,    // 82 × 1.55
                peito: 108.5,     // 17.5 × 6.2
                braco: 43.5,      // (180/178) × 43
                cintura: 81.9,    // 180 × 0.455
                coxa: null,       // Não julgada
                // ...
            },
            notas: {
                coxa: "Não julgada - usa board shorts"
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
3. **Men's Physique** foca em upper body e não julga pernas
4. A **Tríade** (braço = panturrilha = pescoço) só se aplica ao Golden Ratio e Classic

### 10.2 Referências

- **Golden Ratio**: Eugen Sandow, Steve Reeves, John McCallum
- **Classic Physique**: Chris Bumstead (185cm, 104kg, 6x Olympia)
- **Men's Physique**: Ryan Terry (178cm, 93kg, 3x Olympia)
- **IFBB Pro League**: Tabelas oficiais de peso/altura 2024

---

**Versão 2.0 - Atualizado conforme quadro de proporções do app**
