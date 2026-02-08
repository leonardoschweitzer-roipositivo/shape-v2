# SPEC: Code Style Guide - VITRU IA

## Documento de Convenções de Código

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

Este documento define as convenções de código para o VITRU IA. Focamos em criar um sistema modular através de **Tokenização Visual**, **Separação de Responsabilidades (SoC)** e o princípio **DRY**, garantindo que o software seja escalável e fácil de manter.

### 1.1 Princípios Fundamentais

| Princípio | Descrição | Benefício |
|-----------|-----------|-----------|
| **Tokenização Visual** | Design system com tokens reutilizáveis | Consistência visual em toda a aplicação |
| **SoC (Separation of Concerns)** | Cada módulo tem uma única responsabilidade | Facilita testes e manutenção |
| **DRY (Don't Repeat Yourself)** | Evitar duplicação de código e lógica | Reduz bugs e facilita atualizações |

---

## 2. TOKENIZAÇÃO VISUAL (DESIGN TOKENS)

### 2.1 Orientação Geral

**SEMPRE** utilize Design Tokens para armazenar valores de design — como cores, fontes, espaçamentos e sombras — no sistema de design. Eles atuam como a menor "fonte de verdade" compartilhada entre design e código, garantindo consistência visual (tokens de referência, sistemas e componentes) e permitindo atualizações automáticas em tempo real em todas as plataformas.

### 2.2 Estrutura de Tokens

```
/tokens
  ├── colors.ts          # Paleta de cores
  ├── typography.ts      # Fontes e tamanhos
  ├── spacing.ts         # Espaçamentos
  ├── borders.ts         # Bordas e raios
  ├── shadows.ts         # Sombras
  ├── animations.ts      # Animações e transições
  └── index.ts           # Exportação centralizada
```

### 2.3 Tokens de Cores

```typescript
// tokens/colors.ts

export const colors = {
  // === BRAND ===
  brand: {
    primary: '#6366F1',      // Indigo - ação principal
    secondary: '#8B5CF6',    // Violet - ação secundária
    accent: '#F59E0B',       // Amber - destaques
  },

  // === SEMANTIC ===
  semantic: {
    success: '#10B981',      // Verde - sucesso/positivo
    warning: '#F59E0B',      // Amarelo - atenção
    error: '#EF4444',        // Vermelho - erro/negativo
    info: '#3B82F6',         // Azul - informação
  },

  // === PROPORTIONS (específico VITRU IA) ===
  proportions: {
    golden: '#FFD700',       // Dourado - Golden Ratio
    classic: '#8B5CF6',      // Roxo - Classic Physique
    physique: '#3B82F6',     // Azul - Men's Physique
  },

  // === SCORE LEVELS ===
  score: {
    elite: '#FFD700',        // 95-100%
    advanced: '#10B981',     // 85-94%
    intermediate: '#3B82F6', // 75-84%
    beginner: '#F59E0B',     // 60-74%
    developing: '#6B7280',   // 0-59%
  },

  // === NEUTRALS ===
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },

  // === BACKGROUND ===
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    dark: '#111827',
  },

  // === TEXT ===
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#6366F1',
  },
} as const

// Type inference
export type Colors = typeof colors
export type ColorKey = keyof typeof colors
```

### 2.4 Tokens de Tipografia

```typescript
// tokens/typography.ts

export const typography = {
  // === FONT FAMILIES ===
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
  },

  // === FONT SIZES ===
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },

  // === FONT WEIGHTS ===
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // === LINE HEIGHTS ===
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // === LETTER SPACING ===
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const

// === TEXT STYLES COMPOSTOS ===
export const textStyles = {
  // Headings
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },
  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug,
  },

  // Body
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },

  // Labels
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.none,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },

  // Numbers (para medidas)
  number: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.mono,
  },
  numberSmall: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.mono,
  },
} as const
```

### 2.5 Tokens de Espaçamento

```typescript
// tokens/spacing.ts

export const spacing = {
  // === BASE SCALE (4px) ===
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px

  // === SEMANTIC SPACING ===
  section: '4rem',       // Entre seções
  card: '1.5rem',        // Padding de cards
  input: '0.75rem',      // Padding de inputs
  button: '0.75rem 1.5rem', // Padding de botões
  
  // === GAPS ===
  gap: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
} as const
```

### 2.6 Tokens de Bordas e Sombras

```typescript
// tokens/borders.ts

export const borders = {
  // === BORDER RADIUS ===
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',   // Círculo
  },

  // === BORDER WIDTH ===
  width: {
    0: '0',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
} as const

// tokens/shadows.ts

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // === COLORED SHADOWS (para cards de score) ===
  colored: {
    golden: '0 4px 14px 0 rgb(255 215 0 / 0.3)',
    success: '0 4px 14px 0 rgb(16 185 129 / 0.3)',
    warning: '0 4px 14px 0 rgb(245 158 11 / 0.3)',
    error: '0 4px 14px 0 rgb(239 68 68 / 0.3)',
  },
} as const
```

### 2.7 Tokens de Animação

```typescript
// tokens/animations.ts

export const animations = {
  // === DURATIONS ===
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },

  // === EASING ===
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // === TRANSITIONS COMPOSTAS ===
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // === KEYFRAMES ===
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    scoreReveal: {
      from: { transform: 'scale(0.8)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
  },
} as const
```

### 2.8 Exportação Centralizada

```typescript
// tokens/index.ts

export { colors } from './colors'
export { typography, textStyles } from './typography'
export { spacing } from './spacing'
export { borders, shadows } from './borders'
export { animations } from './animations'

// Re-export types
export type { Colors, ColorKey } from './colors'
```

---

## 3. SEPARAÇÃO DE RESPONSABILIDADES (SoC)

### 3.1 Arquitetura de Pastas

```
/src
  ├── /components        # Componentes de UI (Presentational)
  │   ├── /atoms         # Componentes básicos
  │   ├── /molecules     # Composição de atoms
  │   ├── /organisms     # Composição de molecules
  │   └── /templates     # Layouts de página
  │
  ├── /features          # Features por domínio
  │   ├── /measurements  # Tudo relacionado a medidas
  │   ├── /proportions   # Cálculos de proporções
  │   ├── /comparison    # Comparação entre métodos
  │   └── /history       # Histórico do usuário
  │
  ├── /hooks             # Custom hooks
  │   ├── /queries       # React Query hooks
  │   └── /mutations     # Mutations hooks
  │
  ├── /services          # Lógica de negócio
  │   ├── /calculations  # Cálculos puros
  │   └── /api           # Chamadas de API
  │
  ├── /stores            # Estado global (Zustand)
  │
  ├── /tokens            # Design tokens
  │
  ├── /types             # TypeScript types
  │
  └── /utils             # Funções utilitárias
```

### 3.2 Regras de Separação

#### Componentes (components/)

```typescript
// ✅ CORRETO: Componente apenas renderiza
// components/atoms/Button/Button.tsx

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function Button({ variant, size, children, onClick, disabled }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

// ❌ ERRADO: Lógica de negócio no componente
export function Button({ onClick }) {
  const calculateScore = () => { /* ... */ }  // ❌ Não pertence aqui
  const saveToDatabase = () => { /* ... */ }  // ❌ Não pertence aqui
  
  return <button onClick={() => { calculateScore(); saveToDatabase() }}>Save</button>
}
```

#### Features (features/)

```typescript
// features/proportions/
//   ├── components/       # Componentes específicos desta feature
//   │   ├── ProportionCard.tsx
//   │   ├── ProportionChart.tsx
//   │   └── index.ts
//   ├── hooks/            # Hooks específicos
//   │   ├── useProportions.ts
//   │   └── index.ts
//   ├── types.ts          # Types específicos
//   └── index.ts          # Exportação pública

// features/proportions/hooks/useProportions.ts
import { useMemo } from 'react'
import { calculateGoldenRatio } from '@/services/calculations'
import type { Measurements, ProportionResult } from '../types'

export function useProportions(measurements: Measurements) {
  const goldenRatio = useMemo(
    () => calculateGoldenRatio(measurements),
    [measurements]
  )
  
  return { goldenRatio }
}
```

#### Services (services/)

```typescript
// services/calculations/goldenRatio.ts

import { GOLDEN_RATIO } from './constants'
import type { Measurements, IdealMeasurements } from '@/types'

/**
 * Calcula as medidas ideais baseado no Golden Ratio
 * @pure - Função pura, sem side effects
 */
export function calculateGoldenRatioIdeals(measurements: Measurements): IdealMeasurements {
  const { cintura, punho, pelve, joelho, tornozelo } = measurements
  
  const bracoIdeal = punho * GOLDEN_RATIO.BRACO_PUNHO
  const panturrilhaIdeal = tornozelo * GOLDEN_RATIO.PANTURRILHA_TORNOZELO
  
  return {
    ombros: cintura * GOLDEN_RATIO.PHI,
    peitoral: punho * GOLDEN_RATIO.PEITO_PUNHO,
    braco: bracoIdeal,
    antebraco: bracoIdeal * GOLDEN_RATIO.ANTEBRACO_BRACO,
    cintura: pelve * GOLDEN_RATIO.CINTURA_PELVE,
    coxa: joelho * GOLDEN_RATIO.COXA_JOELHO,
    panturrilha: panturrilhaIdeal,
    coxaPanturrilha: panturrilhaIdeal * GOLDEN_RATIO.COXA_PANTURRILHA,
  }
}

// ✅ Função pura - fácil de testar
// ✅ Sem dependências de UI
// ✅ Sem side effects
```

### 3.3 Fluxo de Dados

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│    Hook     │────▶│   Service   │
│   (View)    │     │  (Logic)    │     │  (Pure Fn)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
   Renderiza          Gerencia            Calcula
   UI apenas          Estado              Dados
```

---

## 4. PRINCÍPIO DRY (Don't Repeat Yourself)

### 4.1 Constantes Centralizadas

```typescript
// services/calculations/constants.ts

/**
 * Constantes do Golden Ratio
 * Fonte: Steve Reeves, John McCallum
 */
export const GOLDEN_RATIO = {
  PHI: 1.618,
  PEITO_PUNHO: 6.5,
  BRACO_PUNHO: 2.52,
  ANTEBRACO_BRACO: 0.80,
  CINTURA_PELVE: 0.86,
  COXA_JOELHO: 1.75,
  COXA_PANTURRILHA: 1.5,
  PANTURRILHA_TORNOZELO: 1.92,
} as const

/**
 * Constantes do Classic Physique (CBum)
 * Fonte: Chris Bumstead, IFBB Pro League
 */
export const CLASSIC_PHYSIQUE = {
  OMBROS_CINTURA: 1.70,
  PEITO_PUNHO: 7.0,
  CINTURA_ALTURA: 0.42,
  COXA_CINTURA: 0.97,
  COXA_PANTURRILHA: 1.5,
  PANTURRILHA_BRACO: 0.96,
  ANTEBRACO_BRACO: 0.80,
  CBUM_ALTURA: 185,
  CBUM_BRACO: 50,
} as const

/**
 * Constantes do Men's Physique (Ryan Terry)
 * Fonte: Ryan Terry, IFBB Pro League
 */
export const MENS_PHYSIQUE = {
  OMBROS_CINTURA: 1.55,
  PEITO_PUNHO: 6.2,
  CINTURA_ALTURA: 0.455,
  ANTEBRACO_BRACO: 0.80,
  RYAN_ALTURA: 178,
  RYAN_BRACO: 43,
} as const

/**
 * Limites de peso IFBB Pro Classic Physique
 */
export const CLASSIC_WEIGHT_LIMITS: Record<number, number> = {
  162.6: 80.3,
  165.1: 82.6,
  167.6: 84.8,
  170.2: 87.1,
  172.7: 89.4,
  175.3: 91.6,
  177.8: 93.9,
  180.3: 97.5,
  182.9: 100.7,
  185.4: 104.3,
  188.0: 108.9,
  190.5: 112.0,
  193.0: 115.2,
} as const
```

### 4.2 Funções Utilitárias Reutilizáveis

```typescript
// utils/calculations.ts

/**
 * Calcula score proporcional (quanto maior até o ideal, melhor)
 * @reusable - Usado em todos os métodos de cálculo
 */
export function calculateProportionalScore(
  atual: number,
  ideal: number,
  peso: number
): number {
  const percentual = Math.min(100, (atual / ideal) * 100)
  return percentual * (peso / 100)
}

/**
 * Calcula score inverso (quanto menor, melhor - ex: cintura)
 * @reusable - Usado para cintura em todos os métodos
 */
export function calculateInverseScore(
  atual: number,
  ideal: number,
  peso: number
): number {
  if (atual <= ideal) return peso
  const percentual = (ideal / atual) * 100
  return percentual * (peso / 100)
}

/**
 * Calcula score da tríade (simetria entre 3 medidas)
 * @reusable - Usado no Golden Ratio e Classic Physique
 */
export function calculateTriadScore(
  medida1: number,
  medida2: number,
  medida3: number,
  peso: number
): number {
  const media = (medida1 + medida2 + medida3) / 3
  const desvios = [medida1, medida2, medida3].map(m => Math.abs(m - media) / media)
  const desvioMedio = desvios.reduce((a, b) => a + b, 0) / 3
  const percentual = Math.max(0, (1 - desvioMedio) * 100)
  return percentual * (peso / 100)
}

/**
 * Interpola valor entre dois pontos
 * @reusable - Usado para calcular peso máximo por altura
 */
export function interpolate(
  x: number,
  x1: number,
  x2: number,
  y1: number,
  y2: number
): number {
  const fator = (x - x1) / (x2 - x1)
  return y1 + (y2 - y1) * fator
}
```

### 4.3 Componentes Reutilizáveis

```typescript
// components/molecules/ScoreCard/ScoreCard.tsx

interface ScoreCardProps {
  title: string
  score: number
  ideal: number
  atual: number
  unit?: string
  colorScheme?: 'golden' | 'classic' | 'physique'
}

/**
 * Card de score reutilizável para todas as proporções
 * @reusable - Usado em Golden Ratio, Classic e Men's Physique
 */
export function ScoreCard({
  title,
  score,
  ideal,
  atual,
  unit = 'cm',
  colorScheme = 'golden'
}: ScoreCardProps) {
  const diferenca = ideal - atual
  const status = diferenca > 0 ? 'increase' : diferenca < 0 ? 'decrease' : 'perfect'
  
  return (
    <Card colorScheme={colorScheme}>
      <CardHeader>
        <Text style={textStyles.label}>{title}</Text>
      </CardHeader>
      <CardBody>
        <ScoreGauge value={score} />
        <MeasurementComparison
          atual={atual}
          ideal={ideal}
          unit={unit}
          status={status}
        />
      </CardBody>
    </Card>
  )
}
```

### 4.4 Types Compartilhados

```typescript
// types/measurements.ts

/**
 * Medidas de entrada do usuário
 * @shared - Usado em todos os cálculos
 */
export interface Measurements {
  // Estruturais
  altura: number
  punho: number
  tornozelo: number
  joelho: number
  pelve: number
  
  // Variáveis
  cintura: number
  ombros: number
  peitoral: number
  braco: number
  antebraco: number
  pescoco: number
  coxa: number
  panturrilha: number
}

/**
 * Resultado de proporção individual
 * @shared - Usado em todos os métodos
 */
export interface ProportionResult {
  nome: string
  atual: number
  ideal: number
  score: number
  diferenca: number
  status: 'increase' | 'decrease' | 'perfect'
}

/**
 * Resultado completo de um método
 * @shared - Estrutura padrão para Golden, Classic e Physique
 */
export interface MethodResult {
  metodo: 'golden_ratio' | 'classic_physique' | 'mens_physique'
  scoreTotal: number
  proporcoes: ProportionResult[]
  classificacao: Classification
}

/**
 * Classificação de nível
 * @shared - Usado em todos os métodos
 */
export interface Classification {
  nivel: 'ELITE' | 'AVANÇADO' | 'INTERMEDIÁRIO' | 'INICIANTE' | 'EM DESENVOLVIMENTO'
  emoji: string
  descricao: string
  cor: string
}
```

---

## 5. CONVENÇÕES DE NOMENCLATURA

### 5.1 Arquivos e Pastas

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `ScoreCard.tsx` |
| Hooks | camelCase com `use` | `useProportions.ts` |
| Utils/Services | camelCase | `calculateScore.ts` |
| Types | camelCase | `measurements.ts` |
| Constantes | UPPER_SNAKE_CASE | `GOLDEN_RATIO` |
| Pastas | kebab-case | `score-card/` |

### 5.2 Código

```typescript
// === VARIÁVEIS ===
const userName = 'John'              // camelCase
const MAX_SCORE = 100                // UPPER_SNAKE_CASE para constantes

// === FUNÇÕES ===
function calculateScore() {}         // camelCase, verbo no início
function getUserData() {}            // get para buscar dados
function setUserData() {}            // set para definir dados
function handleClick() {}            // handle para eventos

// === COMPONENTES ===
function ScoreCard() {}              // PascalCase
function ProportionChart() {}        // PascalCase

// === INTERFACES/TYPES ===
interface UserMeasurements {}        // PascalCase
type ProportionMethod = '...'        // PascalCase

// === HOOKS ===
function useProportions() {}         // camelCase com use
function useMeasurements() {}        // camelCase com use

// === ENUMS ===
enum ProportionType {                // PascalCase
  GOLDEN_RATIO = 'golden_ratio',     // UPPER_SNAKE_CASE
  CLASSIC = 'classic',
}
```

### 5.3 Comentários e Documentação

```typescript
/**
 * Calcula as proporções ideais baseado no Golden Ratio
 * 
 * @param measurements - Medidas do usuário
 * @returns Objeto com medidas ideais calculadas
 * 
 * @example
 * const ideals = calculateGoldenRatioIdeals({
 *   punho: 17.5,
 *   cintura: 82,
 *   // ...
 * })
 */
export function calculateGoldenRatioIdeals(
  measurements: Measurements
): IdealMeasurements {
  // 1. Calcular braço ideal (usado como referência)
  const bracoIdeal = measurements.punho * GOLDEN_RATIO.BRACO_PUNHO
  
  // 2. Calcular demais proporções
  return {
    // ...
  }
}
```

---

## 6. PADRÕES DE COMPONENTES

### 6.1 Estrutura de Componente

```typescript
// components/molecules/ProportionCard/ProportionCard.tsx

import { memo } from 'react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardBody } from '@/components/atoms'
import { ScoreGauge } from '@/components/molecules'
import { colors, textStyles } from '@/tokens'
import type { ProportionResult } from '@/types'
import styles from './ProportionCard.module.css'

// === TYPES ===
interface ProportionCardProps {
  proportion: ProportionResult
  colorScheme?: 'golden' | 'classic' | 'physique'
  className?: string
}

// === COMPONENT ===
function ProportionCardComponent({
  proportion,
  colorScheme = 'golden',
  className,
}: ProportionCardProps) {
  const { nome, atual, ideal, score, diferenca, status } = proportion
  
  return (
    <Card className={cn(styles.card, className)}>
      <CardHeader>
        <span style={textStyles.label}>{nome}</span>
      </CardHeader>
      <CardBody>
        <ScoreGauge value={score} color={colors.proportions[colorScheme]} />
        <div className={styles.values}>
          <Value label="Atual" value={atual} />
          <Value label="Ideal" value={ideal} />
          <Difference value={diferenca} status={status} />
        </div>
      </CardBody>
    </Card>
  )
}

// === SUBCOMPONENTS ===
function Value({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.value}>
      <span style={textStyles.caption}>{label}</span>
      <span style={textStyles.numberSmall}>{value.toFixed(1)} cm</span>
    </div>
  )
}

function Difference({ value, status }: { value: number; status: string }) {
  const color = status === 'increase' ? colors.semantic.success 
              : status === 'decrease' ? colors.semantic.error 
              : colors.semantic.info
  
  return (
    <span style={{ ...textStyles.bodySmall, color }}>
      {value > 0 ? '+' : ''}{value.toFixed(1)} cm
    </span>
  )
}

// === EXPORT ===
export const ProportionCard = memo(ProportionCardComponent)
```

### 6.2 Estrutura de Pasta de Componente

```
/components/molecules/ProportionCard/
  ├── ProportionCard.tsx        # Componente principal
  ├── ProportionCard.module.css # Estilos (se necessário)
  ├── ProportionCard.test.tsx   # Testes
  ├── ProportionCard.stories.tsx # Storybook
  └── index.ts                  # Exportação
```

```typescript
// index.ts
export { ProportionCard } from './ProportionCard'
export type { ProportionCardProps } from './ProportionCard'
```

---

## 7. TESTES

### 7.1 Estrutura de Testes

```typescript
// services/calculations/__tests__/goldenRatio.test.ts

import { describe, it, expect } from 'vitest'
import { calculateGoldenRatioIdeals, calculateGoldenRatioScore } from '../goldenRatio'

describe('Golden Ratio Calculations', () => {
  // === SETUP ===
  const mockMeasurements = {
    altura: 180,
    punho: 17.5,
    tornozelo: 23,
    joelho: 38,
    pelve: 98,
    cintura: 82,
    ombros: 120,
    peitoral: 108,
    braco: 40,
    antebraco: 32,
    pescoco: 40,
    coxa: 60,
    panturrilha: 38,
  }

  // === TESTS ===
  describe('calculateGoldenRatioIdeals', () => {
    it('should calculate correct shoulder ideal (cintura × 1.618)', () => {
      const result = calculateGoldenRatioIdeals(mockMeasurements)
      expect(result.ombros).toBeCloseTo(132.68, 1)
    })

    it('should calculate correct chest ideal (punho × 6.5)', () => {
      const result = calculateGoldenRatioIdeals(mockMeasurements)
      expect(result.peitoral).toBeCloseTo(113.75, 1)
    })

    it('should calculate correct arm ideal (punho × 2.52)', () => {
      const result = calculateGoldenRatioIdeals(mockMeasurements)
      expect(result.braco).toBeCloseTo(44.1, 1)
    })
  })

  describe('calculateGoldenRatioScore', () => {
    it('should return score between 0 and 100', () => {
      const result = calculateGoldenRatioScore(mockMeasurements)
      expect(result.scoreTotal).toBeGreaterThanOrEqual(0)
      expect(result.scoreTotal).toBeLessThanOrEqual(100)
    })

    it('should return 9 proportions', () => {
      const result = calculateGoldenRatioScore(mockMeasurements)
      expect(result.proporcoes).toHaveLength(9)
    })
  })
})
```

### 7.2 Cobertura Mínima

| Tipo | Cobertura Mínima |
|------|------------------|
| Services/Calculations | 90% |
| Hooks | 80% |
| Utils | 90% |
| Components | 70% |

---

## 8. CHECKLIST DE CODE REVIEW

### 8.1 Tokenização Visual

- [ ] Usa cores do design token (`colors.`)
- [ ] Usa tipografia do design token (`textStyles.`)
- [ ] Usa espaçamento do design token (`spacing.`)
- [ ] Não usa valores hardcoded de cor, fonte ou espaçamento

### 8.2 Separação de Responsabilidades

- [ ] Componente não contém lógica de negócio
- [ ] Cálculos estão em `services/`
- [ ] Estado está gerenciado por hooks
- [ ] Types estão em arquivos separados

### 8.3 DRY

- [ ] Não há código duplicado
- [ ] Usa constantes de `constants.ts`
- [ ] Usa funções utilitárias existentes
- [ ] Componentes são reutilizáveis

### 8.4 Nomenclatura

- [ ] Segue convenções de nomenclatura
- [ ] Nomes são descritivos
- [ ] Funções começam com verbo
- [ ] Componentes são PascalCase

### 8.5 Documentação

- [ ] Funções complexas têm JSDoc
- [ ] Props têm tipos definidos
- [ ] Código não óbvio tem comentários

---

## 9. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do Code Style Guide |

---

**VITRU IA Code Style Guide**  
*Tokenização Visual • Separação de Responsabilidades • DRY*
