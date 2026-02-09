# SPEC: Escalas de Proporções Corporais

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
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

1. **Ninguém está abaixo de 50%** - Mesmo uma pessoa sedentária tem V-Taper > 1.0
2. **A escala visual não reflete a distribuição real** - A maioria deveria estar em NORMAL/ATLÉTICO
3. **Perde-se a capacidade de diferenciar níveis** - Todos parecem "bons"

---

## 2. SOLUÇÃO: ESCALA RELATIVA

### 2.1 Conceito

A barra visual deve mostrar apenas o **range relevante** (50-115% do ideal), não 0-100%.

```
ESCALA CORRIGIDA:
├──────────────────────────────────────────────────────────────────────────┤
50%           70%            85%            95%   100% 102%            115%
│             │              │              │      │    │               │
│   BLOCO     │    NORMAL    │   ATLÉTICO   │ EST. │★│ FREAK          │
│             │              │              │      │    │               │
│   < 70%     │   70-85%     │   85-95%     │95-102│    │  > 102%      │
│   do ideal  │   do ideal   │   do ideal   │      │    │               │

Posição do GOLDEN (★): 77% da barra (representa 100% do ideal)
```

### 2.2 Mapeamento Visual

| % do Ideal | Posição na Barra | Classificação |
|:----------:|:----------------:|---------------|
| 50% | 0% | BLOCO |
| 60% | 15.4% | BLOCO |
| 70% | 30.8% | NORMAL (início) |
| 80% | 46.2% | NORMAL |
| 85% | 53.8% | ATLÉTICO (início) |
| 90% | 61.5% | ATLÉTICO |
| 95% | 69.2% | ESTÉTICO (início) |
| 100% | **76.9%** | **GOLDEN ★** |
| 102% | 80% | FREAK (início) |
| 110% | 92.3% | FREAK |
| 115% | 100% | FREAK (fim) |

---

## 3. CLASSIFICAÇÕES

### 3.1 Faixas de Classificação (Universal)

Estas faixas se aplicam a **TODAS** as proporções, para **AMBOS** os gêneros.

```typescript
const CLASSIFICACOES_PROPORCAO = {
  BLOCO: {
    id: 'BLOCO',
    minPercent: 0,
    maxPercent: 70,
    label: 'Em Construção',
    labelCurto: 'BLOCO',
    cor: '#1E3A5F',           // Azul escuro
    corTexto: '#94A3B8',      // Cinza azulado
    descricao: 'Proporção precisa de desenvolvimento significativo',
    emoji: '🧱',
  },
  
  NORMAL: {
    id: 'NORMAL',
    minPercent: 70,
    maxPercent: 85,
    label: 'Desenvolvendo',
    labelCurto: 'NORMAL',
    cor: '#2563EB',           // Azul
    corTexto: '#60A5FA',      // Azul claro
    descricao: 'Proporção na média da população geral',
    emoji: '📊',
  },
  
  ATLETICO: {
    id: 'ATLETICO',
    minPercent: 85,
    maxPercent: 95,
    label: 'Quase Lá',
    labelCurto: 'ATLÉTICO',
    cor: '#3B82F6',           // Azul médio
    corTexto: '#93C5FD',      // Azul muito claro
    descricao: 'Proporção de praticante dedicado',
    emoji: '💪',
  },
  
  ESTETICO: {
    id: 'ESTETICO',
    minPercent: 95,
    maxPercent: 102,
    label: 'Ideal Clássico',
    labelCurto: 'ESTÉTICO',
    cor: '#8B5CF6',           // Roxo
    corTexto: '#C4B5FD',      // Roxo claro
    descricao: 'Proporção no padrão clássico de estética',
    emoji: '✨',
  },
  
  FREAK: {
    id: 'FREAK',
    minPercent: 102,
    maxPercent: 150,
    label: 'Além do Ideal',
    labelCurto: 'FREAK',
    cor: '#EAB308',           // Dourado
    corTexto: '#FDE047',      // Amarelo
    descricao: 'Proporção acima do padrão clássico',
    emoji: '👑',
  },
}
```

### 3.2 Labels Contextuais

Dependendo do % do ideal, mostramos labels diferentes:

```typescript
function getLabelContextual(percentualDoIdeal: number): string {
  if (percentualDoIdeal < 70) return 'EM CONSTRUÇÃO'
  if (percentualDoIdeal < 85) return 'DESENVOLVENDO'
  if (percentualDoIdeal < 95) return 'QUASE LÁ'
  if (percentualDoIdeal < 98) return `QUASE LÁ (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal < 100) return `QUASE LÁ (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal >= 100 && percentualDoIdeal <= 102) return 'IDEAL CLÁSSICO (100%)'
  if (percentualDoIdeal > 102 && percentualDoIdeal <= 105) return `IDEAL CLÁSSICO (${Math.round(percentualDoIdeal)}%)`
  return `ALÉM DO IDEAL (${Math.round(percentualDoIdeal)}%)`
}

// Exemplos:
// 65% → "EM CONSTRUÇÃO"
// 78% → "DESENVOLVENDO"
// 91% → "QUASE LÁ"
// 97% → "QUASE LÁ (97%)"
// 100% → "IDEAL CLÁSSICO (100%)"
// 109% → "ALÉM DO IDEAL (109%)"
```

### 3.3 Labels para Proporções Inversas (Cintura, WHR)

Para proporções onde **menor é melhor**:

```typescript
function getLabelProporcaoInversa(percentualDoIdeal: number): string {
  // Para proporções inversas, estar ABAIXO do ideal é BOM
  // percentualDoIdeal aqui já foi invertido: 100 + (ideal - atual) / ideal * 100
  
  if (percentualDoIdeal >= 100) return 'DENTRO DA META'
  if (percentualDoIdeal >= 95) return `QUASE LÁ (${Math.round(percentualDoIdeal)}%)`
  if (percentualDoIdeal >= 85) return 'ATENÇÃO'
  return 'PRECISA REDUZIR'
}
```

---

## 4. CONFIGURAÇÃO DA BARRA VISUAL

### 4.1 Constantes

```typescript
const ESCALA_VISUAL = {
  // Limites da visualização (% do ideal)
  INICIO: 50,                 // Barra começa em 50% do ideal
  FIM: 115,                   // Barra termina em 115% do ideal
  GOLDEN: 100,                // Posição do marcador Golden
  
  // Largura das faixas (% do ideal)
  FAIXAS: {
    BLOCO: { inicio: 50, fim: 70 },
    NORMAL: { inicio: 70, fim: 85 },
    ATLETICO: { inicio: 85, fim: 95 },
    ESTETICO: { inicio: 95, fim: 102 },
    FREAK: { inicio: 102, fim: 115 },
  },
  
  // Cores das faixas
  CORES: {
    BLOCO: '#1E3A5F',
    NORMAL: '#2563EB',
    ATLETICO: '#3B82F6',
    ESTETICO: '#8B5CF6',
    FREAK: '#EAB308',
  },
}
```

### 4.2 Funções de Cálculo

```typescript
/**
 * Converte % do ideal para posição na barra (0-100%)
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
 */
function getPosicaoGolden(): number {
  const { INICIO, FIM, GOLDEN } = ESCALA_VISUAL
  return ((GOLDEN - INICIO) / (FIM - INICIO)) * 100
  // = ((100 - 50) / (115 - 50)) * 100 = 76.92%
}

/**
 * Calcula os limites visuais de cada faixa na barra
 */
function getFaixasVisuais(): Record<string, { inicio: number, fim: number }> {
  const { INICIO, FIM, FAIXAS } = ESCALA_VISUAL
  const range = FIM - INICIO
  
  const resultado = {}
  
  for (const [faixa, limites] of Object.entries(FAIXAS)) {
    resultado[faixa] = {
      inicio: ((limites.inicio - INICIO) / range) * 100,
      fim: ((limites.fim - INICIO) / range) * 100,
    }
  }
  
  return resultado
}

// RESULTADO:
// BLOCO:    0.0% - 30.8%   (50-70% do ideal)
// NORMAL:   30.8% - 53.8%  (70-85% do ideal)
// ATLETICO: 53.8% - 69.2%  (85-95% do ideal)
// ESTETICO: 69.2% - 80.0%  (95-102% do ideal)
// FREAK:    80.0% - 100%   (102-115% do ideal)
```

### 4.3 Determinar Classificação

```typescript
/**
 * Determina a classificação baseada no % do ideal
 */
function getClassificacao(percentualDoIdeal: number): ClassificacaoProporcao {
  const { FAIXAS } = ESCALA_VISUAL
  
  for (const [faixa, limites] of Object.entries(FAIXAS)) {
    if (percentualDoIdeal >= limites.inicio && percentualDoIdeal < limites.fim) {
      return CLASSIFICACOES_PROPORCAO[faixa]
    }
  }
  
  // Se passou de 115%, ainda é FREAK
  if (percentualDoIdeal >= FAIXAS.FREAK.fim) {
    return CLASSIFICACOES_PROPORCAO.FREAK
  }
  
  // Se abaixo de 50%, é BLOCO
  return CLASSIFICACOES_PROPORCAO.BLOCO
}
```

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
    // Quanto mais abaixo, melhor (até um limite)
    const bonus = ((indiceIdeal - indiceAtual) / indiceIdeal) * 100
    return Math.min(115, 100 + bonus * 0.5) // Bônus de até 7.5%
  }
  
  // Se atual > ideal, penalizar
  const excesso = ((indiceAtual - indiceIdeal) / indiceIdeal) * 100
  
  // Penalização progressiva
  // 10% acima → 85% do ideal
  // 20% acima → 65% do ideal
  // 30% acima → 45% do ideal
  
  return Math.max(30, 100 - excesso * 1.5)
}

// EXEMPLOS (Cintura masculina, ideal 0.86):

// Caso 1: Cintura 0.80 (6.9% ABAIXO do ideal - ÓTIMO!)
// → 100 + (6.9 * 0.5) = 103.5%

// Caso 2: Cintura 0.86 (EXATAMENTE no ideal)
// → 100%

// Caso 3: Cintura 0.92 (7% ACIMA do ideal)
// → 100 - (7 * 1.5) = 89.5%

// Caso 4: Cintura 0.97 (12.8% ACIMA - João Ogro!)
// → 100 - (12.8 * 1.5) = 80.8%

// Caso 5: Cintura 1.05 (22% ACIMA)
// → 100 - (22 * 1.5) = 67%
```

### 5.3 Visualização na Barra (Inversas)

Para proporções inversas, a barra é **espelhada**:

```
PROPORÇÃO NORMAL (maior é melhor):
├──────────────────────────────────────────────────────────────────────────┤
│   BLOCO     │    NORMAL    │   ATLÉTICO   │  ESTÉTICO  │     FREAK      │
├──────────────────────────────────────────────────────────────────────────┤
50%           70%            85%            95%   100%  102%            115%
                                                   ★

PROPORÇÃO INVERSA (menor é melhor):
├──────────────────────────────────────────────────────────────────────────┤
│     FREAK   │  ESTÉTICO  │   ATLÉTICO   │    NORMAL    │     BLOCO      │
├──────────────────────────────────────────────────────────────────────────┤
115%        102%  100%   95%            85%            70%              50%
                   ★

Nota: Para inversas, o GOLDEN (★) ainda fica em 100%, mas a escala é invertida.
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

| % do Ideal | Classificação | Posição Barra | Label |
|:----------:|---------------|:-------------:|-------|
| < 70% | BLOCO | 0-31% | EM CONSTRUÇÃO |
| 70-85% | NORMAL | 31-54% | DESENVOLVENDO |
| 85-95% | ATLÉTICO | 54-69% | QUASE LÁ |
| 95-100% | ESTÉTICO | 69-77% | QUASE LÁ (X%) |
| 100% | ESTÉTICO | **77%** | IDEAL CLÁSSICO ★ |
| 100-102% | ESTÉTICO | 77-80% | IDEAL CLÁSSICO (X%) |
| > 102% | FREAK | 80-100% | ALÉM DO IDEAL |

### 10.2 Fórmula de Conversão

```
Posição na Barra = ((% do Ideal - 50) / (115 - 50)) × 100
                 = (% do Ideal - 50) / 0.65
```

### 10.3 Posição do GOLDEN ★

```
Posição GOLDEN = ((100 - 50) / 65) × 100 = 76.92%
```

---

## 11. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Escala universal para M/F |

---

**VITRU IA - Escalas de Proporções v1.0**  
*Universal • Masculino • Feminino*
