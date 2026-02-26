# SPEC: Escalas de Proporções Corporais

## Documento de Especificação Técnica v1.1

**Versão:** 1.1  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Sistema de Escalas Visuais  
**Aplica-se a:** Masculino e Feminino

---

## 1. PROBLEMA IDENTIFICADO

### 1.1 Situação Anterior (Incorreta)

A escala visual estava mapeando 0-100% do ideal para toda a barra, fazendo com que praticamente todos os usuários aparecessem nas zonas "ESTÉTICO" ou "FREAK".

```
ESCALA ANTERIOR (ERRADA):
├──────────────────────────────────────────────────────────────────────────┤
0%            25%            50%            75%           90%           100%
│             │              │              │             │              │
│   BLOCO     │    NORMAL    │   ATLÉTICO   │  ESTÉTICO   │    FREAK     │
│             │              │              │             ●              │
│             │              │              │           VOCÊ             │

Problema: Uma pessoa com 85% do ideal já aparece em 85% da barra!
Resultado: Quase todo mundo parece estar em ESTÉTICO/FREAK
```

### 1.2 Por que isso é errado?

1. **Ninguém está abaixo de 75%** - Mesmo uma pessoa sedentária tem proporções mínimas
2. **A escala visual não reflete a distribuição real** - A maioria deveria estar em NORMAL/ATLÉTICO
3. **Perde-se a capacidade de diferenciar níveis** - Todos parecem "bons"

---

## 2. SOLUÇÃO: ESCALA RELATIVA (75-110%)

### 2.1 Conceito

A barra visual deve mostrar apenas o **range relevante** (75-110% do ideal), não 0-100%.

**Por que 75%?**
- Ninguém realista terá índice abaixo de 75% do ideal
- Exemplo: V-Taper ideal = 1.618 → 75% = 1.21 (mínimo razoável)
- Exemplo: Braço ideal = 2.52 → 75% = 1.89 (mínimo razoável)

```
ESCALA CORRIGIDA (75-110%):
├──────────────────────────────────────────────────────────────────────────┤
75%           82%            90%            97%   100%  103%           110%
│             │              │              │      │     │              │
│   BLOCO     │    NORMAL    │   ATLÉTICO   │ EST. │  ★  │    FREAK     │
│             │              │              │      │     │              │
│  75-82%     │   82-90%     │   90-97%     │97-103│     │   > 103%     │
│  do ideal   │   do ideal   │   do ideal   │      │     │              │

Posição do GOLDEN (★): 71.4% da barra (representa 100% do ideal)
```

### 2.2 Mapeamento Visual

| % do Ideal | Posição na Barra | Classificação |
|:----------:|:----------------:|---------------|
| 75% | 0% | BLOCO (início) |
| 78% | 8.6% | BLOCO |
| 82% | 20% | NORMAL (início) |
| 86% | 31.4% | NORMAL |
| 90% | 42.9% | ATLÉTICO (início) |
| 93% | 51.4% | ATLÉTICO |
| 97% | 62.9% | ESTÉTICO (início) |
| 100% | **71.4%** | **GOLDEN ★** |
| 103% | 80% | FREAK (início) |
| 106% | 88.6% | FREAK |
| 110% | 100% | FREAK (fim) |

---

## 3. CLASSIFICAÇÕES

### 3.1 Faixas de Classificação (Universal)

Estas faixas se aplicam a **TODAS** as proporções, para **AMBOS** os gêneros.

A nomenclatura é baseada na **jornada de evolução** do atleta, sendo honesta sobre onde ele está.

```typescript
const CLASSIFICACOES_PROPORCAO = {
  INICIO: {
    id: 'INICIO',
    minPercent: 0,
    maxPercent: 82,
    label: 'Início',
    labelCurto: 'INÍCIO',
    cor: '#1E3A5F',           // Azul escuro
    corTexto: '#94A3B8',      // Cinza azulado
    descricao: 'Início da jornada - há muito a desenvolver',
    emoji: '🚀',
  },
  
  CAMINHO: {
    id: 'CAMINHO',
    minPercent: 82,
    maxPercent: 90,
    label: 'Caminho',
    labelCurto: 'CAMINHO',
    cor: '#2563EB',           // Azul
    corTexto: '#60A5FA',      // Azul claro
    descricao: 'No caminho certo - continue evoluindo',
    emoji: '🛤️',
  },
  
  QUASE_LA: {
    id: 'QUASE_LA',
    minPercent: 90,
    maxPercent: 97,
    label: 'Quase Lá',
    labelCurto: 'QUASE LÁ',
    cor: '#3B82F6',           // Azul médio
    corTexto: '#93C5FD',      // Azul muito claro
    descricao: 'Quase lá - falta pouco para a meta',
    emoji: '💪',
  },
  
  META: {
    id: 'META',
    minPercent: 97,
    maxPercent: 103,
    label: 'Meta',
    labelCurto: 'META',
    cor: '#8B5CF6',           // Roxo
    corTexto: '#C4B5FD',      // Roxo claro
    descricao: 'Meta atingida - proporção no padrão clássico',
    emoji: '🎯',
  },
  
  ELITE: {
    id: 'ELITE',
    minPercent: 103,
    maxPercent: 150,
    label: 'Elite',
    labelCurto: 'ELITE',
    cor: '#EAB308',           // Dourado
    corTexto: '#FDE047',      // Amarelo
    descricao: 'Elite - acima do padrão clássico',
    emoji: '👑',
  },
}
```

### 3.2 Distribuição das Faixas na Escala 75-110%

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  % DO IDEAL    75%      82%       90%       97%   100%  103%          110%  │
│                │        │         │         │      │     │             │    │
│  FAIXA         │ INÍCIO │ CAMINHO │QUASE LÁ │ META │  ★  │   ELITE     │    │
│                │        │         │         │      │     │             │    │
│  EMOJI         │  🚀    │   🛤️    │   💪    │  🎯  │     │    👑       │    │
│                │        │         │         │      │     │             │    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  POSIÇÃO       0%      20%       43%       63%   71%   80%           100%   │
│  NA BARRA                                         ★                         │
│                                                GOLDEN                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Labels Contextuais

Dependendo do % do ideal, mostramos labels diferentes:

```typescript
function getLabelContextual(percentualDoIdeal: number): string {
  if (percentualDoIdeal < 82) return 'INÍCIO DA JORNADA'
  if (percentualDoIdeal < 90) return `NO CAMINHO (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal < 97) return `QUASE LÁ (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal < 100) return `QUASE LÁ (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal >= 100 && percentualDoIdeal <= 103) return 'META ATINGIDA! 🎯'
  return `ELITE (${Math.round(percentualDoIdeal)}%)`
}

// Exemplos:
// 78% → "INÍCIO DA JORNADA"
// 85% → "NO CAMINHO (85%)"
// 93% → "QUASE LÁ (93%)"
// 98% → "QUASE LÁ (98%)"
// 100% → "META ATINGIDA! 🎯"
// 107% → "ELITE (107%)"
```

### 3.4 Labels para Proporções Inversas (Cintura, WHR)

Para proporções onde **menor é melhor**:

```typescript
function getLabelProporcaoInversa(percentualDoIdeal: number): string {
  // Para proporções inversas, estar ABAIXO do ideal é BOM
  // percentualDoIdeal aqui já foi invertido
  
  if (percentualDoIdeal >= 100) return 'DENTRO DA META 🎯'
  if (percentualDoIdeal >= 97) return `QUASE LÁ (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal >= 90) return `NO CAMINHO (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal >= 82) return 'PRECISA REDUZIR'
  return 'FORA DA META'
}
```

### 3.5 Comparação: Nomes Antigos vs Novos

| % do Ideal | Nome Antigo | Nome Novo | Por que é melhor? |
|:----------:|-------------|-----------|-------------------|
| < 82% | BLOCO | **INÍCIO** | Não julga, indica começo |
| 82-90% | NORMAL | **CAMINHO** | Mostra que está progredindo |
| 90-97% | ATLÉTICO | **QUASE LÁ** | Honesto: ainda falta algo |
| 97-103% | ESTÉTICO | **META** | Claro: é o objetivo |
| > 103% | FREAK | **ELITE** | Positivo: destaque real |

---

## 4. CONFIGURAÇÃO DA BARRA VISUAL

### 4.1 Constantes

```typescript
const ESCALA_VISUAL = {
  // Limites da visualização (% do ideal)
  INICIO: 75,                 // Barra começa em 75% do ideal
  FIM: 110,                   // Barra termina em 110% do ideal
  GOLDEN: 100,                // Posição do marcador Golden
  
  // Largura das faixas (% do ideal)
  FAIXAS: {
    INICIO: { inicio: 75, fim: 82 },
    CAMINHO: { inicio: 82, fim: 90 },
    QUASE_LA: { inicio: 90, fim: 97 },
    META: { inicio: 97, fim: 103 },
    ELITE: { inicio: 103, fim: 110 },
  },
  
  // Cores das faixas
  CORES: {
    INICIO: '#1E3A5F',      // Azul escuro
    CAMINHO: '#2563EB',     // Azul
    QUASE_LA: '#3B82F6',    // Azul médio
    META: '#8B5CF6',        // Roxo
    ELITE: '#EAB308',       // Dourado
  },
}
```

### 4.2 Funções de Cálculo

```typescript
/**
 * Converte % do ideal para posição na barra (0-100%)
 * 
 * Fórmula: ((percentual - 75) / (110 - 75)) × 100
 *        = ((percentual - 75) / 35) × 100
 */
function percentualParaPosicaoBarra(percentualDoIdeal: number): number {
  const { INICIO, FIM } = ESCALA_VISUAL
  
  // Limitar aos extremos
  const clamped = Math.max(INICIO, Math.min(FIM, percentualDoIdeal))
  
  // Mapear para 0-100% da barra
  return ((clamped - INICIO) / (FIM - INICIO)) * 100
}

/**
 * Calcula a posição do marcador GOLDEN na barra
 * 
 * GOLDEN = ((100 - 75) / 35) × 100 = 71.43%
 */
function getPosicaoGolden(): number {
  const { INICIO, FIM, GOLDEN } = ESCALA_VISUAL
  return ((GOLDEN - INICIO) / (FIM - INICIO)) * 100
  // = ((100 - 75) / (110 - 75)) * 100 = 71.43%
}

/**
 * Calcula os limites visuais de cada faixa na barra
 */
function getFaixasVisuais(): Record<string, { inicio: number, fim: number, largura: number }> {
  const { INICIO, FIM, FAIXAS } = ESCALA_VISUAL
  const range = FIM - INICIO  // 35
  
  const resultado = {}
  
  for (const [faixa, limites] of Object.entries(FAIXAS)) {
    const inicioPercent = ((limites.inicio - INICIO) / range) * 100
    const fimPercent = ((limites.fim - INICIO) / range) * 100
    
    resultado[faixa] = {
      inicio: inicioPercent,
      fim: fimPercent,
      largura: fimPercent - inicioPercent,
    }
  }
  
  return resultado
}

// RESULTADO:
// INICIO:   0.0% - 20.0%   (75-82% do ideal)  largura: 20%
// CAMINHO:  20.0% - 42.9%  (82-90% do ideal)  largura: 22.9%
// QUASE_LA: 42.9% - 62.9%  (90-97% do ideal)  largura: 20%
// META:     62.9% - 80.0%  (97-103% do ideal) largura: 17.1%
// ELITE:    80.0% - 100%   (103-110% do ideal) largura: 20%
// GOLDEN:   71.43%         (100% do ideal)
```

### 4.3 Determinar Classificação

```typescript
/**
 * Determina a classificação baseada no % do ideal
 */
function getClassificacao(percentualDoIdeal: number): ClassificacaoProporcao {
  if (percentualDoIdeal < 82) return CLASSIFICACOES_PROPORCAO.INICIO
  if (percentualDoIdeal < 90) return CLASSIFICACOES_PROPORCAO.CAMINHO
  if (percentualDoIdeal < 97) return CLASSIFICACOES_PROPORCAO.QUASE_LA
  if (percentualDoIdeal < 103) return CLASSIFICACOES_PROPORCAO.META
  return CLASSIFICACOES_PROPORCAO.ELITE
}
```

### 4.4 Tabela de Conversão Rápida

| % do Ideal | Posição na Barra | Classificação | Emoji |
|:----------:|:----------------:|---------------|:-----:|
| 75% | 0.0% | INÍCIO | 🚀 |
| 78% | 8.6% | INÍCIO | 🚀 |
| 80% | 14.3% | INÍCIO | 🚀 |
| 82% | **20.0%** | **CAMINHO** | 🛤️ |
| 85% | 28.6% | CAMINHO | 🛤️ |
| 88% | 37.1% | CAMINHO | 🛤️ |
| 90% | **42.9%** | **QUASE LÁ** | 💪 |
| 93% | 51.4% | QUASE LÁ | 💪 |
| 95% | 57.1% | QUASE LÁ | 💪 |
| 97% | **62.9%** | **META** | 🎯 |
| 98% | 65.7% | META | 🎯 |
| 99% | 68.6% | META | 🎯 |
| **100%** | **71.4%** | **★ GOLDEN** | 🎯 |
| 101% | 74.3% | META | 🎯 |
| 102% | 77.1% | META | 🎯 |
| 103% | **80.0%** | **ELITE** | 👑 |
| 105% | 85.7% | ELITE | 👑 |
| 108% | 94.3% | ELITE | 👑 |
| 110% | 100.0% | ELITE | 👑 |

---

## 5. PROPORÇÕES INVERSAS

### 5.1 Quais são Inversas?

Proporções onde **menor é melhor**:

| Gênero | Proporção | Fórmula | Ideal | Inversa? |
|--------|-----------|---------|:-----:|:--------:|
| **Masculino** | Cintura | Cintura ÷ Pelve | 0.86 | ✅ SIM |
| **Feminino** | WHR | Cintura ÷ Quadril | 0.70 | ✅ SIM |
| **Feminino** | Cintura | Cintura ÷ Altura | 0.42 | ✅ SIM |

### 5.2 Cálculo do Percentual para Inversas

```typescript
/**
 * Calcula o percentual do ideal para proporções INVERSAS
 * Onde estar ABAIXO do ideal é BOM
 */
function calcularPercentualInverso(
  indiceAtual: number,
  indiceIdeal: number
): number {
  // Se atual <= ideal, está bom (100% ou mais)
  if (indiceAtual <= indiceIdeal) {
    // Quanto mais abaixo, melhor (bônus proporcional)
    const bonus = ((indiceIdeal - indiceAtual) / indiceIdeal) * 100
    return Math.min(110, 100 + bonus * 0.5) // Bônus de até 5%
  }
  
  // Se atual > ideal, penalizar
  // Cada 1% acima do ideal = -1.5% no score
  const excesso = ((indiceAtual - indiceIdeal) / indiceIdeal) * 100
  
  return Math.max(75, 100 - excesso * 1.5)
}

// EXEMPLOS (Cintura masculina, ideal 0.86):

// Caso 1: Cintura 0.80 (7% ABAIXO do ideal - ÓTIMO!)
// → 100 + (7 * 0.5) = 103.5% → ESTÉTICO/FREAK

// Caso 2: Cintura 0.86 (EXATAMENTE no ideal)
// → 100% → ESTÉTICO

// Caso 3: Cintura 0.90 (4.7% ACIMA do ideal)
// → 100 - (4.7 * 1.5) = 93% → ATLÉTICO

// Caso 4: Cintura 0.95 (10.5% ACIMA)
// → 100 - (10.5 * 1.5) = 84.3% → NORMAL

// Caso 5: Cintura 1.00 (16.3% ACIMA)
// → 100 - (16.3 * 1.5) = 75.6% → BLOCO
```

### 5.3 Visualização na Barra (Inversas)

Para proporções inversas, a interpretação é **invertida**, mas a barra visual é a mesma:

```
PROPORÇÃO NORMAL (maior é melhor):
├──────────────────────────────────────────────────────────────────────────┤
│   BLOCO     │    NORMAL    │   ATLÉTICO   │  ESTÉTICO  │     FREAK      │
├──────────────────────────────────────────────────────────────────────────┤
75%           82%            90%            97%   100%  103%           110%
                                                   ★
                                             (quanto maior, melhor)

PROPORÇÃO INVERSA (menor é melhor):
├──────────────────────────────────────────────────────────────────────────┤
│   BLOCO     │    NORMAL    │   ATLÉTICO   │  ESTÉTICO  │     FREAK      │
├──────────────────────────────────────────────────────────────────────────┤
75%           82%            90%            97%   100%  103%           110%
                                                   ★
                                 (já convertido: quanto menor o índice
                                  original, maior o % e melhor a posição)

A diferença está no CÁLCULO do percentual, não na visualização.
```

---

## 6. APLICAÇÃO POR GÊNERO

### 6.1 Proporções Masculinas

| # | Proporção | Fórmula | Meta Golden | Tipo |
|---|-----------|---------|:-----------:|:----:|
| 1 | V-Taper (Shape-V) | Ombros ÷ Cintura | 1.618 | Normal |
| 2 | Peitoral | Peitoral ÷ Punho | 6.5 | Normal |
| 3 | Braço | Braço ÷ Punho | 2.52 | Normal |
| 4 | Antebraço | Antebraço ÷ Braço | 0.80 | Normal |
| 5 | Tríade | Harmonia Pesc/Braço/Pant | 100% | Especial |
| 6 | **Cintura** | Cintura ÷ Pelve | 0.86 | **INVERSA** |
| 7 | Coxa | Coxa ÷ Joelho | 1.75 | Normal |
| 8 | Coxa/Panturrilha | Coxa ÷ Panturrilha | 1.50 | Normal |
| 9 | Panturrilha | Panturrilha ÷ Tornozelo | 1.92 | Normal |
| 10 | Costas | Costas ÷ Cintura | 1.60 | Normal |

### 6.2 Proporções Femininas

| # | Proporção | Fórmula | Meta Golden | Tipo |
|---|-----------|---------|:-----------:|:----:|
| 1 | **WHR** | Cintura ÷ Quadril | 0.70 | **INVERSA** |
| 2 | Ombros | Ombros ÷ Quadril | 1.00 | Normal |
| 3 | Busto | Busto ÷ Cintura | 1.40 | Normal |
| 4 | **Cintura** | Cintura ÷ Altura | 0.42 | **INVERSA** |
| 5 | Quadril | Quadril ÷ Cintura | 1.42 | Normal |
| 6 | Glúteo | Desenvolvimento visual | - | Especial |
| 7 | Coxa | Coxa ÷ Cintura | 0.65 | Normal |
| 8 | Coxa/Panturrilha | Coxa ÷ Panturrilha | 1.40 | Normal |
| 9 | Panturrilha | Panturrilha ÷ Tornozelo | 1.80 | Normal |
| 10 | Braço | Braço ÷ Punho | 2.20 | Normal |

### 6.3 A Escala é Universal

```typescript
// A MESMA escala de classificação se aplica a ambos os gêneros
// A diferença está nos IDEAIS (metas), não na escala

function calcularProporcao(
  indiceAtual: number,
  indiceIdeal: number,
  ehInversa: boolean = false
): ResultadoProporcao {
  
  // Calcular percentual do ideal
  const percentualDoIdeal = ehInversa
    ? calcularPercentualInverso(indiceAtual, indiceIdeal)
    : Math.min(115, (indiceAtual / indiceIdeal) * 100)
  
  // Usar a mesma escala universal
  const classificacao = getClassificacao(percentualDoIdeal)
  const posicaoBarra = percentualParaPosicaoBarra(percentualDoIdeal)
  const label = ehInversa
    ? getLabelProporcaoInversa(percentualDoIdeal)
    : getLabelContextual(percentualDoIdeal)
  
  return {
    indiceAtual,
    indiceIdeal,
    percentualDoIdeal,
    classificacao,
    posicaoBarra,
    label,
    ehInversa,
  }
}
```

---

## 7. COMPONENTE REACT: ProportionBar

### 7.1 Interface

```typescript
interface ProportionBarProps {
  // Dados da proporção
  nome: string                    // "Shape-V", "Cintura", etc.
  categoria: string               // "ESCALA SHAPE-V", "LINHA DE CINTURA", etc.
  indiceAtual: number             // 1.58
  indiceMeta: number              // 1.62
  
  // Configuração
  ehInversa?: boolean             // true para Cintura, WHR
  mostrarGolden?: boolean         // Mostrar marcador ★ GOLDEN
  mostrarLabel?: boolean          // Mostrar label "QUASE LÁ (98%)"
  
  // Opcional
  descricao?: string              // Texto explicativo abaixo da barra
  formulaBase?: string            // "Ombros ÷ Cintura"
}
```

### 7.2 Implementação

```tsx
function ProportionBar({
  nome,
  categoria,
  indiceAtual,
  indiceMeta,
  ehInversa = false,
  mostrarGolden = true,
  mostrarLabel = true,
  descricao,
  formulaBase,
}: ProportionBarProps) {
  
  // Calcular resultado
  const resultado = calcularProporcao(indiceAtual, indiceMeta, ehInversa)
  
  // Posições das faixas
  const faixas = getFaixasVisuais()
  const posicaoGolden = getPosicaoGolden()
  
  return (
    <div className="proportion-bar-container">
      {/* Header */}
      <div className="proportion-header">
        <div className="proportion-info">
          <span className="proportion-categoria">{categoria}</span>
          <h3 className="proportion-nome">{nome}</h3>
          <div className="proportion-valores">
            <span className="ratio-atual">Ratio Atual: {indiceAtual.toFixed(2)}</span>
            <span className="ratio-meta">Meta: {indiceMeta.toFixed(2)}</span>
          </div>
          {formulaBase && (
            <span className="formula-base">BASE: {formulaBase}</span>
          )}
        </div>
        
        <div className="proportion-score">
          <span className="score-valor">{indiceAtual.toFixed(2)}</span>
          <span className="score-label">RATIO ATUAL</span>
        </div>
      </div>
      
      {/* Barra de Progresso */}
      <div className="proportion-bar">
        {/* Faixas coloridas */}
        {Object.entries(faixas).map(([faixa, limites]) => (
          <div
            key={faixa}
            className={`faixa faixa-${faixa.toLowerCase()}`}
            style={{
              left: `${limites.inicio}%`,
              width: `${limites.fim - limites.inicio}%`,
              backgroundColor: ESCALA_VISUAL.CORES[faixa],
            }}
          />
        ))}
        
        {/* Labels das faixas */}
        <div className="faixas-labels">
          <span style={{ left: '15%' }}>BLOCO</span>
          <span style={{ left: '42%' }}>NORMAL</span>
          <span style={{ left: '61%' }}>ATLÉTICO</span>
          <span style={{ left: '74%' }}>ESTÉTICO</span>
          <span style={{ left: '90%' }}>FREAK</span>
        </div>
        
        {/* Marcador GOLDEN */}
        {mostrarGolden && (
          <div
            className="golden-marker"
            style={{ left: `${posicaoGolden}%` }}
          >
            <span className="golden-icon">★</span>
            <span className="golden-label">GOLDEN</span>
          </div>
        )}
        
        {/* Indicador do usuário */}
        <div
          className="user-indicator"
          style={{ left: `${resultado.posicaoBarra}%` }}
        >
          <div className="indicator-dot" />
          <span className="indicator-label">VOCÊ</span>
        </div>
      </div>
      
      {/* Descrição */}
      {descricao && (
        <p className="proportion-descricao">{descricao}</p>
      )}
      
      {/* Label de classificação */}
      {mostrarLabel && (
        <button
          className={`classification-badge badge-${resultado.classificacao.id.toLowerCase()}`}
        >
          {resultado.label}
        </button>
      )}
    </div>
  )
}
```

### 7.3 Estilos CSS

```css
.proportion-bar {
  position: relative;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: visible;
  margin: 16px 0;
}

.faixa {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.3s ease;
}

.faixa-bloco { border-radius: 4px 0 0 4px; }
.faixa-freak { border-radius: 0 4px 4px 0; }

.faixas-labels {
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
  display: flex;
  font-size: 10px;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.faixas-labels span {
  position: absolute;
  transform: translateX(-50%);
}

.golden-marker {
  position: absolute;
  top: -24px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.golden-icon {
  color: #EAB308;
  font-size: 14px;
}

.golden-label {
  font-size: 8px;
  color: #EAB308;
  font-weight: 600;
}

.user-indicator {
  position: absolute;
  top: -28px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  border: 2px solid #14B8A6;
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.5);
}

.indicator-label {
  font-size: 8px;
  color: white;
  font-weight: 600;
  background: rgba(20, 184, 166, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.classification-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
  cursor: default;
}

.badge-bloco {
  background: rgba(30, 58, 95, 0.2);
  border-color: #1E3A5F;
  color: #94A3B8;
}

.badge-normal {
  background: rgba(37, 99, 235, 0.2);
  border-color: #2563EB;
  color: #60A5FA;
}

.badge-atletico {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3B82F6;
  color: #93C5FD;
}

.badge-estetico {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8B5CF6;
  color: #C4B5FD;
}

.badge-freak {
  background: rgba(234, 179, 8, 0.2);
  border-color: #EAB308;
  color: #FDE047;
}
```

---

## 8. EXEMPLOS DE USO

### 8.1 Exemplo Masculino: "Atleta Homem"

```typescript
// Dados do Atleta Homem (das imagens)
const proporcoesMasculinas = [
  {
    nome: 'Shape-V',
    categoria: 'ESCALA SHAPE-V',
    indiceAtual: 1.58,
    indiceMeta: 1.62,
    ehInversa: false,
    formulaBase: 'Ombros ÷ Cintura',
    // → percentual: 97.5%, classificação: ESTÉTICO, label: "QUASE LÁ (98%)"
  },
  {
    nome: 'Peitoral',
    categoria: 'PODER DE TRONCO',
    indiceAtual: 7.10,
    indiceMeta: 6.50,
    ehInversa: false,
    formulaBase: 'Peitoral ÷ Punho',
    // → percentual: 109.2%, classificação: FREAK, label: "IDEAL CLÁSSICO (100%)"
  },
  {
    nome: 'Cintura',
    categoria: 'LINHA DE CINTURA',
    indiceAtual: 0.82,
    indiceMeta: 0.86,
    ehInversa: true,  // INVERSA!
    formulaBase: 'Cintura ÷ Base Estrutural',
    // → percentual: 104.7% (está ABAIXO, que é BOM), classificação: FREAK, label: "DENTRO DA META"
  },
]
```

### 8.2 Exemplo Feminino: Categoria Bikini

```typescript
// Dados hipotéticos de atleta feminina
const proporcoesFemininas = [
  {
    nome: 'WHR',
    categoria: 'PROPORÇÃO CINTURA-QUADRIL',
    indiceAtual: 0.72,
    indiceMeta: 0.70,
    ehInversa: true,  // INVERSA!
    formulaBase: 'Cintura ÷ Quadril',
    // → Está 2.9% ACIMA do ideal (0.72 vs 0.70)
    // → percentual: 100 - (2.9 * 1.5) = 95.6%, classificação: ESTÉTICO
  },
  {
    nome: 'Busto',
    categoria: 'VOLUME SUPERIOR',
    indiceAtual: 1.35,
    indiceMeta: 1.40,
    ehInversa: false,
    formulaBase: 'Busto ÷ Cintura',
    // → percentual: 96.4%, classificação: ESTÉTICO
  },
]
```

---

## 9. ARQUIVOS QUE PRECISAM SER ATUALIZADOS

| Arquivo | Atualização Necessária |
|---------|------------------------|
| **SPEC_DASHBOARD.md** | Remover escala antiga do V-Taper, referenciar esta SPEC |
| **SPEC_PROPORCOES_CORPORAIS_v2.md** | Adicionar referência a esta SPEC para escalas |
| **SPEC_CODE_STYLE.md** | Adicionar tokens de cores das classificações |
| **Código do Componente** | Implementar ProportionBar conforme esta SPEC |

---

## 10. RESUMO

### 10.1 Tabela de Referência Rápida

| % do Ideal | Classificação | Emoji | Posição Barra | Label |
|:----------:|---------------|:-----:|:-------------:|-------|
| < 82% | **INÍCIO** | 🚀 | 0-20% | INÍCIO DA JORNADA |
| 82-90% | **CAMINHO** | 🛤️ | 20-43% | NO CAMINHO (X%) |
| 90-97% | **QUASE LÁ** | 💪 | 43-63% | QUASE LÁ (X%) |
| 97-100% | **META** | 🎯 | 63-71% | QUASE LÁ (X%) |
| **100%** | **GOLDEN ★** | 🎯 | **71.4%** | META ATINGIDA! |
| 100-103% | **META** | 🎯 | 71-80% | META ATINGIDA! |
| > 103% | **ELITE** | 👑 | 80-100% | ELITE (X%) |

### 10.2 Fórmula de Conversão

```
Posição na Barra = ((% do Ideal - 75) / (110 - 75)) × 100
                 = (% do Ideal - 75) / 0.35
```

### 10.3 Posição do GOLDEN ★

```
Posição GOLDEN = ((100 - 75) / 35) × 100 = 71.43%
```

### 10.4 Comparação: Nomes Antigos vs Novos

```
NOMES ANTIGOS (confusos):
├──────────────────────────────────────────────────────────────────────────┤
│   BLOCO    │   NORMAL   │  ATLÉTICO  │  ESTÉTICO  │      FREAK         │
│            │            │            │            │                    │
│  Problema: "ATLÉTICO" para 94% passa impressão de que está bom         │
│  Problema: "NORMAL" para 85% parece aceitável                          │

NOMES NOVOS (honestos):
├──────────────────────────────────────────────────────────────────────────┤
│   INÍCIO   │  CAMINHO   │  QUASE LÁ  │    META    │      ELITE         │
│     🚀     │    🛤️      │     💪     │     🎯     │       👑           │
│            │            │            │            │                    │
│  Claro: "QUASE LÁ" indica que ainda falta algo                         │
│  Claro: "CAMINHO" mostra que está progredindo mas não chegou           │
```

### 10.5 Exemplo: João Ogro

| Proporção | Valor | % Ideal | Nome Antigo | Nome Novo |
|-----------|:-----:|:-------:|-------------|-----------|
| Tríade | 94.3% | 94.3% | ATLÉTICO ❌ | **QUASE LÁ** ✅ |
| Cintura | 0.97 | ~83% | NORMAL ❌ | **CAMINHO** ✅ |

Agora fica claro que o João Ogro ainda tem trabalho a fazer!

---

## 11. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Escala 50-115% |
| 1.1 | Fev/2026 | Ajuste de escala para 75-110% |
| 1.2 | Fev/2026 | **Nova nomenclatura (Jornada):** INÍCIO → CAMINHO → QUASE LÁ → META → ELITE |

---

**VITRU IA - Escalas de Proporções v1.2**  
*Universal • Masculino • Feminino • Escala 75-110% • Nomenclatura Jornada*