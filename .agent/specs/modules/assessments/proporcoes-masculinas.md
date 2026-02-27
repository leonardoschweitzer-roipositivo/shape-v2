# SPEC: Calculadora de Proporções Corporais Masculinas

## Documento de Especificação Técnica v3.1 (CORRIGIDO)

**Versão:** 3.1  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Análise de Proporções Corporais  
**Correção:** Diferenciação entre ÍNDICES e VALORES IDEAIS

---

## 1. CONCEITO FUNDAMENTAL: ÍNDICES vs VALORES

### 1.1 A Diferença Crítica

```
┌─────────────────────────────────────────────────────────────────┐
│                   ÍNDICE vs VALOR IDEAL                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 ÍNDICE (RATIO)                                              │
│  ─────────────────                                              │
│  • É uma PROPORÇÃO entre duas medidas                           │
│  • Resultado é um NÚMERO DECIMAL (ex: 1.59, 2.52, 0.80)         │
│  • NÃO tem unidade de medida (não é cm, kg, etc)                │
│  • É o que deve ser EXIBIDO na UI principal                     │
│  • Permite comparar pessoas de tamanhos diferentes              │
│                                                                 │
│  Exemplo: V-Taper = Ombros ÷ Cintura = 125 ÷ 80 = 1.56          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📏 VALOR IDEAL (em cm)                                         │
│  ──────────────────────                                         │
│  • É o valor ABSOLUTO que a medida deveria ter                  │
│  • Resultado em CENTÍMETROS                                     │
│  • Calculado multiplicando índice × medida base                 │
│  • Usado para dizer "você precisa ganhar X cm"                  │
│  • É um dado SECUNDÁRIO, não o principal                        │
│                                                                 │
│  Exemplo: Ombros ideal = Cintura × 1.618 = 80 × 1.618 = 129.4cm │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Regra de Ouro para Exibição

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGRA DE EXIBIÇÃO                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NA UI PRINCIPAL (card de proporção):                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ESCALA SHAPE-V                              1.59       │    │
│  │  Shape-V                                  RATIO ATUAL   │    │
│  │  ──────────────────────────────────────────────────     │    │
│  │  Ratio Atual: 1.59    Meta: 1.62                        │    │
│  │  BASE: Ombros ÷ Cintura                                 │    │
│  │                                                         │    │
│  │  [====BLOCO====|==NORMAL==|==ATLÉTICO==|ESTÉTICO|FREAK] │    │
│  │                                              ●          │    │
│  │                                           VOCÊ  GOLDEN  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ✅ CORRETO: Mostrar ÍNDICE (1.59) como valor principal         │
│  ❌ ERRADO: Mostrar "Golden Ratio: 129.4cm"                     │
│                                                                 │
│  O valor em cm pode aparecer em um tooltip ou detalhe:          │
│  "Para atingir o índice 1.618, seus ombros precisam ter 129cm"  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. TABELA MESTRE DE PROPORÇÕES

### 2.1 Todas as Proporções com Fórmulas de ÍNDICE

| # | Proporção | Fórmula do ÍNDICE | Meta Golden | Como Calcular ÍNDICE ATUAL | Como Calcular VALOR IDEAL (cm) |
|---|-----------|-------------------|-------------|---------------------------|-------------------------------|
| 1 | **V-Taper (Shape-V)** | Ombros ÷ Cintura | **1.618** | `ombros / cintura` | `cintura × 1.618` |
| 2 | **Peitoral** | Peitoral ÷ Punho | **6.5** | `peitoral / punho` | `punho × 6.5` |
| 3 | **Braço** | Braço ÷ Punho | **2.52** | `braco / punho` | `punho × 2.52` |
| 4 | **Antebraço** | Antebraço ÷ Braço | **0.80** | `antebraco / braco` | `braco × 0.80` |
| 5 | **Tríade** | Harmonia entre Pesc/Braço/Pant | **100%** | Cálculo especial | N/A |
| 6 | **Cintura** | Cintura ÷ Pelve | **0.86** | `cintura / pelve` | `pelve × 0.86` |
| 7 | **Coxa** | Coxa ÷ Joelho | **1.75** | `coxa / joelho` | `joelho × 1.75` |
| 8 | **Coxa/Panturrilha** | Coxa ÷ Panturrilha | **1.50** | `coxa / panturrilha` | `panturrilha × 1.50` |
| 9 | **Panturrilha** | Panturrilha ÷ Tornozelo | **1.92** | `panturrilha / tornozelo` | `tornozelo × 1.92` |

### 2.2 Exemplo Completo de Cálculo

```javascript
// Medidas do usuário
const medidas = {
  altura: 180,
  punho: 18,
  tornozelo: 24,
  joelho: 40,
  pelve: 100,
  cintura: 82,
  ombros: 128,
  peitoral: 112,
  braco: 45,
  antebraco: 35,
  pescoco: 42,
  coxa: 65,
  panturrilha: 42,
}

// CÁLCULO DOS ÍNDICES ATUAIS (o que mostramos na UI)
const indicesAtuais = {
  vTaper: medidas.ombros / medidas.cintura,           // 128/82 = 1.56
  peitoral: medidas.peitoral / medidas.punho,         // 112/18 = 6.22
  braco: medidas.braco / medidas.punho,               // 45/18 = 2.50
  antebraco: medidas.antebraco / medidas.braco,       // 35/45 = 0.78
  cintura: medidas.cintura / medidas.pelve,           // 82/100 = 0.82
  coxa: medidas.coxa / medidas.joelho,                // 65/40 = 1.63
  coxaPanturrilha: medidas.coxa / medidas.panturrilha, // 65/42 = 1.55
  panturrilha: medidas.panturrilha / medidas.tornozelo, // 42/24 = 1.75
}

// ÍNDICES IDEAIS (Golden Ratio)
const indicesIdeais = {
  vTaper: 1.618,
  peitoral: 6.5,
  braco: 2.52,
  antebraco: 0.80,
  cintura: 0.86,
  coxa: 1.75,
  coxaPanturrilha: 1.50,
  panturrilha: 1.92,
}

// VALORES IDEAIS EM CM (secundário, para referência)
const valoresIdeaisCm = {
  ombros: medidas.cintura * indicesIdeais.vTaper,     // 82 × 1.618 = 132.7cm
  peitoral: medidas.punho * indicesIdeais.peitoral,   // 18 × 6.5 = 117.0cm
  braco: medidas.punho * indicesIdeais.braco,         // 18 × 2.52 = 45.4cm
  antebraco: medidas.braco * indicesIdeais.antebraco, // 45 × 0.80 = 36.0cm
  cintura: medidas.pelve * indicesIdeais.cintura,     // 100 × 0.86 = 86.0cm
  coxa: medidas.joelho * indicesIdeais.coxa,          // 40 × 1.75 = 70.0cm
  panturrilha: medidas.tornozelo * indicesIdeais.panturrilha, // 24 × 1.92 = 46.1cm
}
```

---

## 3. ESTRUTURA DE DADOS CORRIGIDA

### 3.1 Interface TypeScript

```typescript
/**
 * Resultado de uma proporção individual
 */
interface ProportionResult {
  // Identificação
  id: string                    // 'vTaper', 'peitoral', 'braco', etc.
  nome: string                  // 'Shape-V', 'Peitoral', 'Braço', etc.
  categoria: string             // 'ESCALA SHAPE-V', 'VOLUME MUSCULAR', etc.
  
  // === ÍNDICES (PRINCIPAL - mostrar na UI) ===
  indiceAtual: number           // Ex: 1.56 (ombros/cintura)
  indiceMeta: number            // Ex: 1.618 (Golden Ratio)
  
  // Base do cálculo (para exibir "BASE: Ombros ÷ Cintura")
  formulaBase: string           // 'Ombros ÷ Cintura'
  medidaNumerador: string       // 'ombros'
  medidaDenominador: string     // 'cintura'
  
  // === VALORES EM CM (SECUNDÁRIO - para detalhes) ===
  valorAtualCm: number          // Ex: 128 (ombros atual)
  valorIdealCm: number          // Ex: 132.7 (ombros ideal)
  diferencaCm: number           // Ex: 4.7 (quanto falta)
  
  // === PERCENTUAIS (para score e barra de progresso) ===
  percentualDoIdeal: number     // Ex: 96.4% (1.56/1.618)
  score: number                 // Contribuição para score total
  
  // === CLASSIFICAÇÃO ===
  classificacao: 'BLOCO' | 'NORMAL' | 'ATLÉTICO' | 'ESTÉTICO' | 'FREAK'
  dentroDaMeta: boolean
  
  // === DIREÇÃO (para cintura, menor é melhor) ===
  inversao: boolean             // true para cintura (menor = melhor)
}

/**
 * Resultado completo de todas as proporções
 */
interface ProportionsResult {
  // Dados do usuário
  medidas: UserMeasurements
  metodo: 'GOLDEN_RATIO' | 'CLASSIC_PHYSIQUE' | 'MENS_PHYSIQUE' | 'OPEN_BB'
  
  // Resultados por proporção
  proporcoes: {
    vTaper: ProportionResult
    peitoral: ProportionResult
    braco: ProportionResult
    antebraco: ProportionResult
    triade: TriadeResult        // Especial
    cintura: ProportionResult
    coxa: ProportionResult
    coxaPanturrilha: ProportionResult
    panturrilha: ProportionResult
  }
  
  // Score total
  scoreTotal: number            // 0-100
  classificacaoGeral: string
}
```

### 3.2 Interface da Tríade (Caso Especial)

```typescript
/**
 * A Tríade é especial porque mede HARMONIA entre 3 medidas,
 * não uma proporção simples entre 2 medidas.
 */
interface TriadeResult {
  id: 'triade'
  nome: 'Tríade'
  categoria: 'A TRINDADE'
  
  // Valores das 3 medidas
  pescoco: number               // cm
  braco: number                 // cm
  panturrilha: number           // cm
  
  // Média das 3 medidas
  media: number                 // cm
  
  // Desvio de cada uma em relação à média
  desvioPescoco: number         // Ex: -2cm (2cm abaixo da média)
  desvioBraco: number           // Ex: +1cm
  desvioPanturrilha: number     // Ex: +1cm
  
  // Percentual de harmonia (100% = todas iguais)
  harmoniaPercentual: number    // Ex: 98.1%
  
  // Meta
  meta: '100% Harmonia'
  
  // Classificação
  classificacao: string
  dentroDaMeta: boolean
}
```

---

## 4. FÓRMULAS DE CÁLCULO CORRIGIDAS

### 4.1 Função Principal: Calcular Índice

```javascript
/**
 * Calcula o ÍNDICE de uma proporção
 * ÍNDICE = medida1 / medida2
 * 
 * @param medidaNumerador - Medida no numerador (ex: ombros)
 * @param medidaDenominador - Medida no denominador (ex: cintura)
 * @returns Índice decimal (ex: 1.56)
 */
function calcularIndice(medidaNumerador, medidaDenominador) {
  if (!medidaDenominador || medidaDenominador === 0) return 0
  return medidaNumerador / medidaDenominador
}

// Exemplos de uso:
const indiceVTaper = calcularIndice(ombros, cintura)           // 128/82 = 1.56
const indicePeitoral = calcularIndice(peitoral, punho)         // 112/18 = 6.22
const indiceBraco = calcularIndice(braco, punho)               // 45/18 = 2.50
const indiceAntebraco = calcularIndice(antebraco, braco)       // 35/45 = 0.78
const indiceCintura = calcularIndice(cintura, pelve)           // 82/100 = 0.82
const indiceCoxa = calcularIndice(coxa, joelho)                // 65/40 = 1.63
const indiceCoxaPant = calcularIndice(coxa, panturrilha)       // 65/42 = 1.55
const indicePanturrilha = calcularIndice(panturrilha, tornozelo) // 42/24 = 1.75
```

### 4.2 Função: Calcular Valor Ideal em CM

```javascript
/**
 * Calcula o VALOR IDEAL em centímetros
 * VALOR_IDEAL = medidaBase × índiceIdeal
 * 
 * @param medidaBase - Medida base (denominador da fórmula)
 * @param indiceIdeal - Índice alvo (ex: 1.618 para Golden Ratio)
 * @returns Valor ideal em cm
 */
function calcularValorIdealCm(medidaBase, indiceIdeal) {
  return medidaBase * indiceIdeal
}

// Exemplos de uso:
const ombrosIdealCm = calcularValorIdealCm(cintura, 1.618)     // 82 × 1.618 = 132.7cm
const peitoralIdealCm = calcularValorIdealCm(punho, 6.5)       // 18 × 6.5 = 117.0cm
const bracoIdealCm = calcularValorIdealCm(punho, 2.52)         // 18 × 2.52 = 45.4cm
const antebracoIdealCm = calcularValorIdealCm(braco, 0.80)     // 45 × 0.80 = 36.0cm
```

### 4.3 Função: Calcular Diferença

```javascript
/**
 * Calcula a diferença entre valor atual e ideal
 * Positivo = precisa aumentar, Negativo = precisa diminuir
 */
function calcularDiferenca(valorAtual, valorIdeal, inverso = false) {
  const diff = valorIdeal - valorAtual
  
  return {
    diferenca: Math.abs(diff),
    direcao: inverso 
      ? (diff < 0 ? 'diminuir' : 'manter')  // Para cintura
      : (diff > 0 ? 'aumentar' : 'manter'), // Para outras
  }
}
```

### 4.4 Função: Calcular Percentual do Ideal

```javascript
/**
 * Calcula qual percentual do índice ideal foi atingido
 * 
 * Para proporções normais: indiceAtual / indiceIdeal
 * Para cintura (inverso): indiceIdeal / indiceAtual (menor é melhor)
 */
function calcularPercentualDoIdeal(indiceAtual, indiceIdeal, inverso = false) {
  if (inverso) {
    // Cintura: menor é melhor
    if (indiceAtual <= indiceIdeal) return 100
    return (indiceIdeal / indiceAtual) * 100
  }
  
  // Outras proporções: maior é melhor (até o ideal)
  return Math.min(100, (indiceAtual / indiceIdeal) * 100)
}
```

### 4.5 Função: Calcular Tríade (Caso Especial)

```javascript
/**
 * Calcula a harmonia da Tríade (Pescoço = Braço = Panturrilha)
 * Retorna percentual de 0-100% onde 100% = perfeita harmonia
 */
function calcularTriade(pescoco, braco, panturrilha) {
  // Média das 3 medidas
  const media = (pescoco + braco + panturrilha) / 3
  
  // Desvio de cada medida em relação à média
  const desvios = [
    Math.abs(pescoco - media) / media,
    Math.abs(braco - media) / media,
    Math.abs(panturrilha - media) / media,
  ]
  
  // Média dos desvios (0 = perfeito)
  const desvioMedio = desvios.reduce((a, b) => a + b, 0) / 3
  
  // Converter para percentual de harmonia (100% = perfeito)
  const harmonia = Math.max(0, (1 - desvioMedio) * 100)
  
  return {
    pescoco,
    braco,
    panturrilha,
    media: Math.round(media * 10) / 10,
    desvioPescoco: Math.round((pescoco - media) * 10) / 10,
    desvioBraco: Math.round((braco - media) * 10) / 10,
    desvioPanturrilha: Math.round((panturrilha - media) * 10) / 10,
    harmoniaPercentual: Math.round(harmonia * 10) / 10,
  }
}

// Exemplo:
// pescoco: 42cm, braco: 45cm, panturrilha: 42cm
// média: 43cm
// desvios: |42-43|/43 = 2.3%, |45-43|/43 = 4.6%, |42-43|/43 = 2.3%
// desvio médio: 3.1%
// harmonia: 96.9%
```

---

## 5. CONSTANTES DE ÍNDICES POR MÉTODO

### 5.1 Golden Ratio (Clássico)

```javascript
const GOLDEN_RATIO_INDICES = {
  // Identificação
  id: 'GOLDEN_RATIO',
  nome: 'Golden Ratio',
  icon: '🏛️',
  descricao: 'Proporções áureas baseadas em Eugen Sandow e Steve Reeves',
  
  // ÍNDICES IDEAIS (não valores em cm!)
  indices: {
    vTaper: {
      ideal: 1.618,             // Ombros ÷ Cintura
      formula: 'ombros / cintura',
      nome: 'Shape-V',
      categoria: 'ESCALA SHAPE-V',
      descricao: 'V-Taper Index: A proporção estética entre ombros e cintura',
    },
    peitoral: {
      ideal: 6.5,               // Peitoral ÷ Punho
      formula: 'peitoral / punho',
      nome: 'Peitoral',
      categoria: 'PODER DE TRONCO',
      descricao: 'Volume e densidade torácica em relação à estrutura óssea',
    },
    braco: {
      ideal: 2.52,              // Braço ÷ Punho
      formula: 'braco / punho',
      nome: 'Braço',
      categoria: 'VOLUME MUSCULAR',
      descricao: 'Braço ideal baseado na estrutura do punho',
    },
    antebraco: {
      ideal: 0.80,              // Antebraço ÷ Braço
      formula: 'antebraco / braco',
      nome: 'Antebraço',
      categoria: 'PROPORÇÃO #4',
      descricao: 'Proporção ideal: 80% do braço',
    },
    triade: {
      ideal: 100,               // Percentual de harmonia
      formula: 'harmonia(pescoco, braco, panturrilha)',
      nome: 'Tríade',
      categoria: 'A TRINDADE',
      descricao: 'Equilíbrio absoluto entre Pescoço, Braço e Panturrilha',
    },
    cintura: {
      ideal: 0.86,              // Cintura ÷ Pelve
      formula: 'cintura / pelve',
      nome: 'Cintura',
      categoria: 'LINHA DE CINTURA',
      descricao: 'A base do V-Taper. Quanto mais estreita, mais larga parece a dorsal',
      inverso: true,            // Menor é melhor
    },
    coxa: {
      ideal: 1.75,              // Coxa ÷ Joelho
      formula: 'coxa / joelho',
      nome: 'Coxa',
      categoria: 'POTÊNCIA DE PERNAS',
      descricao: 'Desenvolvimento do quadríceps e isquiotibiais',
    },
    coxaPanturrilha: {
      ideal: 1.50,              // Coxa ÷ Panturrilha
      formula: 'coxa / panturrilha',
      nome: 'Coxa vs Panturrilha',
      categoria: 'SIMETRIA INFERIOR',
      descricao: 'Proporção clássica de pernas',
    },
    panturrilha: {
      ideal: 1.92,              // Panturrilha ÷ Tornozelo
      formula: 'panturrilha / tornozelo',
      nome: 'Panturrilha',
      categoria: 'DETALHAMENTO',
      descricao: 'Desenvolvimento da panturrilha em relação à estrutura óssea',
    },
  },
  
  // Pesos para cálculo do score total
  pesos: {
    vTaper: 18,
    peitoral: 14,
    braco: 14,
    antebraco: 5,
    triade: 10,
    cintura: 12,
    coxa: 10,
    coxaPanturrilha: 8,
    panturrilha: 9,
  },
}
```

### 5.2 Classic Physique (CBum)

```javascript
const CLASSIC_PHYSIQUE_INDICES = {
  id: 'CLASSIC_PHYSIQUE',
  nome: 'Classic Physique',
  icon: '🏆',
  descricao: 'Baseado em Chris Bumstead, 6x Mr. Olympia Classic Physique',
  
  indices: {
    vTaper: {
      ideal: 1.70,              // V-Taper mais agressivo
      formula: 'ombros / cintura',
    },
    peitoral: {
      ideal: 7.0,               // Peitoral maior
      formula: 'peitoral / punho',
    },
    braco: {
      ideal: 2.70,              // Braços maiores (~50cm para 18.5cm punho)
      formula: 'braco / punho',
    },
    antebraco: {
      ideal: 0.80,
      formula: 'antebraco / braco',
    },
    triade: {
      ideal: 100,
      formula: 'harmonia(pescoco, braco, panturrilha)',
    },
    cintura: {
      ideal: 0.42,              // % da altura (muito apertada)
      formula: 'cintura / altura',
      usaAltura: true,          // Flag especial
      inverso: true,
    },
    coxa: {
      ideal: 1.85,              // Coxas mais desenvolvidas
      formula: 'coxa / joelho',
    },
    coxaPanturrilha: {
      ideal: 1.50,
      formula: 'coxa / panturrilha',
    },
    panturrilha: {
      ideal: 0.96,              // Relativo ao braço
      formula: 'panturrilha / braco',
      usaBraco: true,           // Flag especial
    },
  },
  
  pesos: {
    vTaper: 18,
    peitoral: 14,
    braco: 16,
    antebraco: 4,
    triade: 8,
    cintura: 16,                // Mais importante no Classic
    coxa: 10,
    coxaPanturrilha: 6,
    panturrilha: 8,
  },
}
```

### 5.3 Men's Physique (Ryan Terry)

```javascript
const MENS_PHYSIQUE_INDICES = {
  id: 'MENS_PHYSIQUE',
  nome: "Men's Physique",
  icon: '🏖️',
  descricao: 'Baseado em Ryan Terry, 3x Mr. Olympia Men\'s Physique',
  
  indices: {
    vTaper: {
      ideal: 1.55,              // V-Taper mais suave
      formula: 'ombros / cintura',
    },
    peitoral: {
      ideal: 6.2,               // Peitoral moderado
      formula: 'peitoral / punho',
    },
    braco: {
      ideal: 2.40,              // Braços moderados
      formula: 'braco / punho',
    },
    antebraco: {
      ideal: 0.80,
      formula: 'antebraco / braco',
    },
    triade: null,               // Não aplicável
    cintura: {
      ideal: 0.455,             // % da altura
      formula: 'cintura / altura',
      usaAltura: true,
      inverso: true,
    },
    coxa: null,                 // Não julgada
    coxaPanturrilha: null,      // Não julgada
    panturrilha: {
      ideal: 1.80,              // Estética geral
      formula: 'panturrilha / tornozelo',
    },
  },
  
  pesos: {
    vTaper: 25,                 // Ombros são destaque
    peitoral: 22,
    braco: 25,                  // Braços são destaque
    antebraco: 6,
    triade: 0,                  // Não julgada
    cintura: 17,
    coxa: 0,                    // Não julgada
    coxaPanturrilha: 0,         // Não julgada
    panturrilha: 5,
  },
}
```

### 5.4 Open Bodybuilding (Derek Lunsford)

```javascript
const OPEN_BODYBUILDING_INDICES = {
  id: 'OPEN_BODYBUILDING',
  nome: 'Open Bodybuilding',
  icon: '👑',
  descricao: 'Baseado em Derek Lunsford, Mr. Olympia 2024',
  
  indices: {
    vTaper: {
      ideal: 1.75,              // V-Taper extremo
      formula: 'ombros / cintura',
    },
    peitoral: {
      ideal: 7.5,               // Peitoral muito desenvolvido
      formula: 'peitoral / punho',
    },
    braco: {
      ideal: 3.11,              // Braços enormes (~56cm para 18cm punho)
      formula: 'braco / punho',
    },
    antebraco: {
      ideal: 0.78,
      formula: 'antebraco / braco',
    },
    triade: {
      ideal: 100,
      formula: 'harmonia(pescoco, braco, panturrilha)',
    },
    cintura: {
      ideal: 0.44,              // % da altura
      formula: 'cintura / altura',
      usaAltura: true,
      inverso: true,
    },
    coxa: {
      ideal: 1.85,              // Coxas muito desenvolvidas
      formula: 'coxa / joelho',
    },
    coxaPanturrilha: {
      ideal: 1.55,
      formula: 'coxa / panturrilha',
    },
    panturrilha: {
      ideal: 0.98,              // Quase igual ao braço
      formula: 'panturrilha / braco',
      usaBraco: true,
    },
  },
  
  pesos: {
    vTaper: 16,
    peitoral: 14,
    braco: 14,
    antebraco: 4,
    triade: 6,
    cintura: 12,
    coxa: 14,                   // Pernas muito importantes
    coxaPanturrilha: 8,
    panturrilha: 8,
    costas: 4,
  },
}
```

---

## 6. FUNÇÃO DE CÁLCULO COMPLETA

### 6.1 Calcular Todas as Proporções

```javascript
/**
 * Calcula todas as proporções para um método específico
 */
function calcularProporcoes(medidas, metodo = 'GOLDEN_RATIO') {
  const config = getConfigByMethod(metodo)
  const resultados = {}
  
  for (const [propKey, propConfig] of Object.entries(config.indices)) {
    if (!propConfig) {
      resultados[propKey] = null
      continue
    }
    
    // Caso especial: Tríade
    if (propKey === 'triade') {
      resultados.triade = calcularTriade(
        medidas.pescoco,
        medidas.braco,
        medidas.panturrilha
      )
      continue
    }
    
    // Determinar medidas para o cálculo
    const { numerador, denominador } = parseFormula(propConfig.formula, medidas)
    
    // Calcular índice atual
    const indiceAtual = calcularIndice(numerador, denominador)
    
    // Calcular valor ideal em cm
    const valorIdealCm = calcularValorIdealCm(denominador, propConfig.ideal)
    
    // Calcular percentual do ideal
    const percentual = calcularPercentualDoIdeal(
      indiceAtual,
      propConfig.ideal,
      propConfig.inverso
    )
    
    // Classificar
    const classificacao = classificarProporcao(percentual)
    
    resultados[propKey] = {
      id: propKey,
      nome: propConfig.nome,
      categoria: propConfig.categoria,
      
      // ÍNDICES (mostrar na UI)
      indiceAtual: Math.round(indiceAtual * 100) / 100,
      indiceMeta: propConfig.ideal,
      
      // Base do cálculo
      formulaBase: formatarFormula(propConfig.formula),
      
      // Valores em CM (secundário)
      valorAtualCm: Math.round(numerador * 10) / 10,
      valorIdealCm: Math.round(valorIdealCm * 10) / 10,
      diferencaCm: Math.round((valorIdealCm - numerador) * 10) / 10,
      
      // Percentuais
      percentualDoIdeal: Math.round(percentual * 10) / 10,
      
      // Classificação
      classificacao,
      dentroDaMeta: percentual >= 95,
      inverso: propConfig.inverso || false,
    }
  }
  
  // Calcular score total
  const scoreTotal = calcularScoreTotal(resultados, config.pesos)
  
  return {
    metodo,
    proporcoes: resultados,
    scoreTotal,
    classificacaoGeral: classificarScore(scoreTotal),
  }
}
```

### 6.2 Funções Auxiliares

```javascript
/**
 * Formata a fórmula para exibição
 */
function formatarFormula(formula) {
  return formula
    .replace('ombros / cintura', 'Ombros ÷ Cintura')
    .replace('peitoral / punho', 'Peitoral ÷ Punho')
    .replace('braco / punho', 'Braço ÷ Punho')
    .replace('antebraco / braco', 'Antebraço ÷ Braço')
    .replace('cintura / pelve', 'Cintura ÷ Pélvis')
    .replace('cintura / altura', 'Cintura ÷ Altura')
    .replace('coxa / joelho', 'Coxa ÷ Joelho')
    .replace('coxa / panturrilha', 'Coxa ÷ Panturrilha')
    .replace('panturrilha / tornozelo', 'Panturrilha ÷ Tornozelo')
    .replace('panturrilha / braco', 'Panturrilha ÷ Braço')
}

/**
 * Classificação baseada no percentual do ideal
 */
function classificarProporcao(percentual) {
  if (percentual >= 100) return 'FREAK'
  if (percentual >= 90) return 'ESTÉTICO'
  if (percentual >= 75) return 'ATLÉTICO'
  if (percentual >= 60) return 'NORMAL'
  return 'BLOCO'
}

/**
 * Classificação do score total
 */
function classificarScore(score) {
  if (score >= 95) return { nivel: 'ELITE', emoji: '👑' }
  if (score >= 85) return { nivel: 'AVANÇADO', emoji: '🥇' }
  if (score >= 75) return { nivel: 'INTERMEDIÁRIO', emoji: '🥈' }
  if (score >= 60) return { nivel: 'INICIANTE', emoji: '💪' }
  return { nivel: 'INICIANTE', emoji: '🚀' }
}
```

---

## 7. EXEMPLO DE OUTPUT CORRETO

### 7.1 Dados de Entrada

```javascript
const medidas = {
  altura: 180,
  punho: 18,
  tornozelo: 24,
  joelho: 40,
  pelve: 100,
  cintura: 82,
  ombros: 128,
  peitoral: 112,
  braco: 45,
  antebraco: 35,
  pescoco: 42,
  coxa: 65,
  panturrilha: 42,
}
```

### 7.2 Output Correto (ÍNDICES)

```javascript
{
  metodo: 'GOLDEN_RATIO',
  
  proporcoes: {
    vTaper: {
      nome: 'Shape-V',
      categoria: 'ESCALA SHAPE-V',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 1.56,          // 128/82
      indiceMeta: 1.618,
      
      formulaBase: 'Ombros ÷ Cintura',
      
      // Valores em cm (secundário)
      valorAtualCm: 128,
      valorIdealCm: 132.7,
      diferencaCm: 4.7,
      
      percentualDoIdeal: 96.4,
      classificacao: 'ESTÉTICO',
      dentroDaMeta: true,
    },
    
    peitoral: {
      nome: 'Peitoral',
      categoria: 'PODER DE TRONCO',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 6.22,          // 112/18
      indiceMeta: 6.5,
      
      formulaBase: 'Peitoral ÷ Punho',
      
      // Valores em cm (secundário)
      valorAtualCm: 112,
      valorIdealCm: 117,
      diferencaCm: 5,
      
      percentualDoIdeal: 95.7,
      classificacao: 'ESTÉTICO',
    },
    
    braco: {
      nome: 'Braço',
      categoria: 'VOLUME MUSCULAR',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 2.50,          // 45/18
      indiceMeta: 2.52,
      
      formulaBase: 'Braço ÷ Punho',
      
      valorAtualCm: 45,
      valorIdealCm: 45.4,
      diferencaCm: 0.4,
      
      percentualDoIdeal: 99.2,
      classificacao: 'ESTÉTICO',
    },
    
    antebraco: {
      nome: 'Antebraço',
      categoria: 'PROPORÇÃO #4',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 0.78,          // 35/45
      indiceMeta: 0.80,
      
      formulaBase: 'Antebraço ÷ Braço',
      
      valorAtualCm: 35,
      valorIdealCm: 36,
      diferencaCm: 1,
      
      percentualDoIdeal: 97.5,
      classificacao: 'ESTÉTICO',
    },
    
    triade: {
      nome: 'Tríade',
      categoria: 'A TRINDADE',
      
      // ✅ CORRETO: Mostra PERCENTUAL de harmonia
      harmoniaPercentual: 96.5,   // Não é índice, é % de harmonia
      meta: '100% Harmonia',
      
      pescoco: 42,
      braco: 45,
      panturrilha: 42,
      media: 43,
      
      classificacao: 'ESTÉTICO',
    },
    
    cintura: {
      nome: 'Cintura',
      categoria: 'LINHA DE CINTURA',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 0.82,          // 82/100
      indiceMeta: 0.86,
      
      formulaBase: 'Cintura ÷ Pélvis',
      
      valorAtualCm: 82,
      valorIdealCm: 86,
      
      // Para cintura, estar ABAIXO é bom!
      percentualDoIdeal: 100,     // Já está melhor que o ideal
      classificacao: 'ESTÉTICO',
      dentroDaMeta: true,
      inverso: true,
    },
    
    coxa: {
      nome: 'Coxa',
      categoria: 'POTÊNCIA DE PERNAS',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 1.63,          // 65/40
      indiceMeta: 1.75,
      
      formulaBase: 'Coxa ÷ Joelho',
      
      valorAtualCm: 65,
      valorIdealCm: 70,
      diferencaCm: 5,
      
      percentualDoIdeal: 93.1,
      classificacao: 'ESTÉTICO',
    },
    
    coxaPanturrilha: {
      nome: 'Coxa vs Panturrilha',
      categoria: 'SIMETRIA INFERIOR',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 1.55,          // 65/42
      indiceMeta: 1.50,
      
      formulaBase: 'Coxa ÷ Panturrilha',
      
      percentualDoIdeal: 100,     // Acima do ideal
      classificacao: 'FREAK',
    },
    
    panturrilha: {
      nome: 'Panturrilha',
      categoria: 'DETALHAMENTO',
      
      // ✅ CORRETO: Mostra ÍNDICE
      indiceAtual: 1.75,          // 42/24
      indiceMeta: 1.92,
      
      formulaBase: 'Panturrilha ÷ Tornozelo',
      
      valorAtualCm: 42,
      valorIdealCm: 46.1,
      diferencaCm: 4.1,
      
      percentualDoIdeal: 91.1,
      classificacao: 'ESTÉTICO',
    },
  },
  
  scoreTotal: 89.5,
  classificacaoGeral: { nivel: 'AVANÇADO', emoji: '🥇' },
}
```

---

## 8. COMO EXIBIR NA UI

### 8.1 Card de Proporção (Correto)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ESCALA SHAPE-V                                     1.56       │
│  Shape-V                                         RATIO ATUAL   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Ratio Atual: 1.56    Meta: 1.62                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  BASE: Ombros ÷ Cintura                                        │
│                                                                 │
│  [====BLOCO====|===NORMAL===|==ATLÉTICO==|ESTÉTICO|==FREAK==]  │
│                                                    ●    │      │
│                                                  VOCÊ GOLDEN   │
│                                                                 │
│  V-Taper Index: A proporção estética entre ombros e cintura.   │
│  No modo Golden Ratio, a meta é 1.618.                         │
│                                                                 │
│                                         ┌────────────────────┐ │
│                                         │ IDEAL CLÁSSICO(96%)│ │
│                                         └────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Tooltip com Detalhes em CM

```
┌─────────────────────────────────────────────────────────────────┐
│  💡 Detalhes                                                    │
│                                                                 │
│  Seu índice atual: 1.56                                         │
│  Índice ideal (Golden): 1.618                                   │
│                                                                 │
│  Para atingir o índice ideal:                                   │
│  • Seus ombros precisam ter 132.7cm (atual: 128cm)              │
│  • Você precisa ganhar +4.7cm nos ombros                        │
│  • OU reduzir a cintura de 82cm para 79cm                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. RESUMO DAS CORREÇÕES

### 9.1 O Que Estava Errado

| Proporção | ❌ ERRADO (antes) | ✅ CORRETO (agora) |
|-----------|-------------------|---------------------|
| Peitoral | "Golden Ratio: 117.0cm" | **indiceAtual: 6.22** / indiceMeta: 6.5 |
| Braço | "Golden Ratio: 45.4cm" | **indiceAtual: 2.50** / indiceMeta: 2.52 |
| Antebraço | "Golden Ratio: 36.3cm" | **indiceAtual: 0.78** / indiceMeta: 0.80 |
| Cintura | "Golden Ratio: 93.7cm" | **indiceAtual: 0.82** / indiceMeta: 0.86 |
| Coxa | "Golden Ratio: 42.0cm" | **indiceAtual: 1.63** / indiceMeta: 1.75 |
| Panturrilha | "Golden Ratio: 34.6cm" | **indiceAtual: 1.75** / indiceMeta: 1.92 |

### 9.2 O Que Já Estava Certo

| Proporção | Exibição Correta |
|-----------|------------------|
| Shape-V (V-Taper) | Ratio Atual: **1.59** / Meta: 1.62 ✅ |
| Tríade | **98.1%** (percentual de harmonia) ✅ |
| Coxa vs Panturrilha | Ratio Atual: **1.63** / Meta: 1.50 ✅ |

### 9.3 Regra Simples

```
SEMPRE mostrar na UI principal:
• ÍNDICE (número decimal) para proporções
• PERCENTUAL (%) para Tríade

NUNCA mostrar na UI principal:
• "Golden Ratio: XXcm" (valor em cm é secundário)
```

---

## 10. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 3.0 | Fev/2026 | Versão inicial com 4 categorias |
| 3.1 | Fev/2026 | **CORREÇÃO CRÍTICA**: Diferenciação entre ÍNDICES e VALORES em CM. Todas as proporções agora mostram ÍNDICE na UI principal. |

---

**VITRU IA - Proporções Corporais Masculinas v3.1**  
*Índices • Ratios • Golden Ratio • Classic • Men's Physique • Open BB*