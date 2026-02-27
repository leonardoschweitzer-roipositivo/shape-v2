# SPEC: Dashboard - VITRU IA

## Documento de Especificação do Dashboard

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

Este documento especifica o Dashboard principal do atleta/aluno no VITRU IA, definindo widgets, hierarquia visual, dados necessários e interações.

### 1.1 Objetivos do Dashboard

| Objetivo | Descrição | Prioridade |
|----------|-----------|------------|
| **Mostrar Progresso** | Evolução ao longo do tempo, não só estado atual | Alta |
| **Direcionar Ação** | O que o atleta deve fazer AGORA? | Alta |
| **Motivar** | Destacar vitórias, conquistas, streaks | Alta |
| **Personalizar** | Cada dashboard deve parecer único | Média |
| **Simplificar** | Não sobrecarregar com dados | Média |

### 1.2 Princípios de Design

```
┌─────────────────────────────────────────────────────────────┐
│  "O dashboard responde 3 perguntas em 5 segundos:"          │
│                                                             │
│  1. Como estou? (Score atual)                               │
│  2. Estou melhorando? (Evolução)                            │
│  3. O que devo fazer agora? (Próxima ação)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. LAYOUT E HIERARQUIA

### 2.1 Grid System

```
┌─────────────────────────────────────────────────────────────────┐
│                        HEADER (fixo)                            │
│  Logo    Breadcrumb                    Notif    CTA Principal   │
├─────────────────────────────────────────────────────────────────┤
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│  SIDE  │  │ 1. HERO CARD (Foco + CTA)                       │  │
│  BAR   │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│  Menu  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│        │  │ 2. KPI      │ │ 2. KPI      │ │ 2. KPI      │      │
│        │  │ Ratio       │ │ Score       │ │ Evolução    │      │
│        │  └─────────────┘ └─────────────┘ └─────────────┘      │
│        │                                                        │
│        │  ┌───────────────────────┐ ┌───────────────────────┐  │
│        │  │ 3. SILHUETA           │ │ 3. BREAKDOWN          │  │
│        │  │ Heatmap Corporal      │ │ Score por Proporção   │  │
│        │  └───────────────────────┘ └───────────────────────┘  │
│        │                                                        │
│        │  ┌─────────────────────────────────────────────────┐  │
│        │  │ 4. MÉTRICAS PRINCIPAIS (6 cards)                │  │
│        │  └─────────────────────────────────────────────────┘  │
│        │                                                        │
│        │  ┌───────────────────────┐ ┌───────────────────────┐  │
│        │  │ 5. INSIGHT IA         │ │ 5. CONQUISTAS         │  │
│        │  │ Coach Tip             │ │ Próximos Marcos       │  │
│        │  └───────────────────────┘ └───────────────────────┘  │
│        │                                                        │
└────────┴────────────────────────────────────────────────────────┘
```

### 2.2 Breakpoints Responsivos

| Breakpoint | Layout | Colunas |
|------------|--------|---------|
| Mobile (<768px) | Stack vertical | 1 coluna |
| Tablet (768-1023px) | 2 colunas | KPIs 3, resto 2 |
| Desktop (1024px+) | Layout completo | Como diagrama acima |

---

## 3. COMPONENTES DO DASHBOARD

### 3.1 Hero Card (Banner Principal)

**Objetivo:** Comunicar o status atual e destacar insights da IA com visual impactante.

> ⚠️ **NOTA:** Este componente já está excelente no protótipo atual. A spec abaixo documenta o design existente e adiciona apenas variações opcionais.

#### Design Atual (Manter)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────┐                                           │
│  │ RELATÓRIO SEMANAL│  📅 12 Out, 2023                          │
│  └──────────────────┘                                           │
│                                                    ┌──────────┐ │
│  SIMETRIA DO                                       │          │ │
│  FÍSICO PERFEITO                                   │  Imagem  │ │
│                                                    │    do    │ │
│  Sua análise de Proporção Áurea indica uma         │  Atleta  │ │
│  evolução de 2.4% no deltóide lateral,             │          │ │
│  aproximando-se do Golden Ratio ideal.             │          │ │
│                                                    └──────────┘ │
│  Ver análise detalhada →                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Props do Componente

```typescript
interface HeroCardProps {
  // Badge superior
  badge: {
    label: string           // "RELATÓRIO SEMANAL"
    variant: 'primary' | 'secondary' | 'warning'
  }
  
  // Data
  date: Date                // 12 Out, 2023
  
  // Conteúdo principal
  title: string             // "SIMETRIA DO FÍSICO PERFEITO"
  description: string       // "Sua análise de Proporção Áurea indica..."
  
  // Call to action
  cta: {
    label: string           // "Ver análise detalhada"
    href: string            // "/ai/analysis"
    icon?: React.ReactNode  // Arrow icon
  }
  
  // Imagem de fundo/lateral
  image?: {
    src: string             // URL da imagem
    alt: string
    position: 'right' | 'background'
  }
  
  // Visual
  gradient?: boolean        // Gradient overlay (default: true)
}
```

#### Variações de Conteúdo (Dinâmico)

O título e descrição mudam baseado no **contexto do usuário**:

| Contexto | Badge | Título | Descrição |
|----------|-------|--------|-----------|
| **Relatório semanal** | RELATÓRIO SEMANAL | "SIMETRIA DO FÍSICO PERFEITO" | Insight principal da semana |
| **Nova conquista** | CONQUISTA DESBLOQUEADA | "VOCÊ ATINGIU O RATIO 1.5!" | Descrição da conquista |
| **Alerta** | ATENÇÃO | "SUA CINTURA AUMENTOU" | Descrição do alerta |
| **Progresso** | EVOLUÇÃO | "SEU V-TAPER MELHOROU 8%" | Detalhes do progresso |
| **Primeira vez** | BEM-VINDO | "COMECE SUA JORNADA" | Instruções iniciais |

#### Lógica de Seleção do Conteúdo

```typescript
function getHeroContent(userData: UserData): HeroContent {
  const { insights, achievements, alerts, weeklyReport } = userData
  
  // Prioridade 1: Conquista recente (últimas 24h)
  const recentAchievement = achievements.find(a => 
    isWithinLast24Hours(a.unlockedAt)
  )
  if (recentAchievement) {
    return {
      badge: { label: 'CONQUISTA DESBLOQUEADA', variant: 'secondary' },
      title: recentAchievement.title,
      description: recentAchievement.description,
      cta: { label: 'Ver conquistas', href: '/achievements' }
    }
  }
  
  // Prioridade 2: Alerta importante
  const criticalAlert = alerts.find(a => a.priority === 'high')
  if (criticalAlert) {
    return {
      badge: { label: 'ATENÇÃO', variant: 'warning' },
      title: criticalAlert.title,
      description: criticalAlert.message,
      cta: { label: 'Ver detalhes', href: criticalAlert.href }
    }
  }
  
  // Prioridade 3: Relatório semanal (padrão)
  return {
    badge: { label: 'RELATÓRIO SEMANAL', variant: 'primary' },
    title: weeklyReport.title,
    description: weeklyReport.summary,
    cta: { label: 'Ver análise detalhada', href: '/ai/analysis' }
  }
}
```

#### Exemplos de Títulos Gerados pela IA

```typescript
const heroTitles = {
  // Positivos
  progress: [
    "SIMETRIA DO FÍSICO PERFEITO",
    "SEU V-TAPER ESTÁ EVOLUINDO",
    "PROPORÇÕES EM HARMONIA",
    "RUMO AO GOLDEN RATIO",
    "EVOLUÇÃO CONSISTENTE",
  ],
  
  // Conquistas
  achievement: [
    "VOCÊ ATINGIU O RATIO 1.5!",
    "BRAÇOS NO IDEAL!",
    "ELITE ALCANÇADA!",
    "STREAK DE 30 DIAS!",
  ],
  
  // Alertas
  warning: [
    "ATENÇÃO À CINTURA",
    "ASSIMETRIA DETECTADA",
    "HORA DE MEDIR",
  ],
  
  // Motivacionais
  motivation: [
    "CONTINUE ASSIM",
    "FALTA POUCO",
    "QUASE LÁ",
  ]
}
```

#### Responsividade

| Breakpoint | Layout |
|------------|--------|
| Desktop | Imagem à direita, texto à esquerda |
| Tablet | Imagem menor, mesmo layout |
| Mobile | Imagem como background com overlay, texto centralizado |

#### Estilos CSS (Referência)

```css
.hero-card {
  background: linear-gradient(135deg, rgba(0,201,167,0.1) 0%, rgba(124,58,237,0.1) 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  overflow: hidden;
}

.hero-badge {
  background: var(--primary);
  color: var(--background-dark);
  font-size: 10px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  color: white;
  margin: 16px 0;
}

.hero-description {
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 500px;
}

.hero-cta {
  color: white;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.hero-image {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 40%;
  object-fit: cover;
  mask-image: linear-gradient(to left, black 60%, transparent 100%);
}
```

---

### 3.2 KPI Cards (3 cards)

**Objetivo:** Visão rápida das métricas mais importantes.

#### 3.2.1 Shape-V Ratio Card

```typescript
interface RatioCardProps {
  currentRatio: number      // 1.56
  targetRatio: number       // 1.618 (Golden)
  previousRatio?: number    // 1.52 (para mostrar evolução)
  classification: 'BLOCO' | 'NORMAL' | 'ATLÉTICO' | 'ESTÉTICO' | 'FREAK'
  distanceToTarget: number  // 0.058
}
```

**Layout:**

```
┌─────────────────────────────────────────┐
│  VITRU IA RATIO                     📊   │
│                                         │
│  1.56  / 1.618                          │
│  ═══════════════════                    │
│                                         │
│  ┌─────┬─────┬─────┬─────┬─────┐       │
│  │BLOCO│NORM │ATLÉT│ESTÉT│FREAK│       │
│  └─────┴─────┴─────┴──▲──┴─────┘       │
│                       │                 │
│  Você está a 0.058 do índice perfeito   │
│                                         │
│  ↑ +0.04 vs mês anterior          🟢    │
└─────────────────────────────────────────┘
```

**Escalas do Ratio:**

| Classificação | Range | Cor |
|---------------|-------|-----|
| BLOCO | < 1.20 | Cinza |
| NORMAL | 1.20 - 1.35 | Azul |
| ATLÉTICO | 1.35 - 1.50 | Verde |
| ESTÉTICO | 1.50 - 1.618 | Teal (primary) |
| FREAK | > 1.618 | Dourado |

---

#### 3.2.2 Avaliação Geral Card (Score + IA)

Este é um dos widgets mais importantes do dashboard. Ele combina o **score numérico** com uma **avaliação holística da IA** que analisa:

- ✅ Medidas corporais atuais
- ✅ Proporções vs ideais
- ✅ Diagnóstico estético
- ✅ Simetria bilateral
- ✅ Evolução temporal

```typescript
interface AvaliacaoGeralCardProps {
  // Score principal
  score: number             // 80
  maxScore: number          // 100
  change: number            // +5 (vs período anterior)
  changePeriod: string      // "vs mês anterior"
  
  // Grades por categoria (avaliadas pela IA)
  grades: {
    simetria: Grade         // Análise de assimetrias bilaterais
    proporcao: Grade        // Aderência às proporções ideais
    estetica: Grade         // Diagnóstico estético geral
    evolucao: Grade         // Tendência de progresso
  }
  
  // Classificação geral
  classification: ScoreClassification
  
  // Resumo da IA (texto curto)
  aiSummary?: string        // "Físico atlético com excelente V-taper..."
  
  // Link para análise completa
  detailsLink: string       // "/ai/analysis"
}

type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'E'
```

**O que cada Grade avalia:**

| Grade | Categoria | O que a IA analisa |
|-------|-----------|-------------------|
| **Simetria** | Bilateral | Diferença E/D em braços, coxas, panturrilhas. A+ = <2% diff |
| **Proporção** | Golden Ratio | Aderência às 9 proporções ideais. A+ = score >95 |
| **Estética** | Diagnóstico | V-taper, cintura, harmonia visual geral |
| **Evolução** | Tendência | Progresso nos últimos 30-90 dias |

**Layout:**

```
┌─────────────────────────────────────────┐
│  AVALIAÇÃO GERAL          +5% vs mês 🟢 │
│                                         │
│           ╭───────────╮                 │
│          ╱     ██      ╲                │
│         │    ████      │                │
│         │      80      │                │
│         │    PONTOS    │                │
│          ╲             ╱                │
│           ╰───────────╯                 │
│                                         │
│  ┌───────────┐  ┌───────────┐           │
│  │ SIMETRIA  │  │ PROPORÇÃO │           │
│  │    A+     │  │     B     │           │
│  └───────────┘  └───────────┘           │
│                                         │
│  [Ver análise completa da IA →]         │
└─────────────────────────────────────────┘
```

**Versão Expandida (ao clicar ou em página dedicada):**

```
┌─────────────────────────────────────────────────────────────────┐
│  AVALIAÇÃO GERAL COMPLETA                          +5% vs mês 🟢│
│                                                                 │
│  ╭───────────────╮                                              │
│  │               │    🤖 DIAGNÓSTICO DA IA                      │
│  │      80       │                                              │
│  │    PONTOS     │    "Físico atlético com excelente V-taper.   │
│  │               │     Seus ombros estão 90% do ideal Golden    │
│  ╰───────────────╯     Ratio. Foco recomendado: braços e        │
│                        panturrilhas para equilibrar a tríade."  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  SIMETRIA     PROPORÇÃO    ESTÉTICA     EVOLUÇÃO            ││
│  │     A+            B           A            B+                ││
│  │                                                             ││
│  │  Excelente    Boa, foco    V-taper      Progresso          ││
│  │  bilateral    em braços    definido     consistente         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  PONTOS FORTES                    PONTOS DE ATENÇÃO             │
│  ✅ Relação ombro/cintura 1.56    ⚠️ Braços abaixo do ideal     │
│  ✅ Cintura dentro da meta        ⚠️ Tríade desbalanceada       │
│  ✅ Simetria bilateral 98%        ⚠️ Panturrilha < Pescoço      │
│                                                                 │
│  [Gerar relatório PDF]     [Compartilhar]     [Histórico]       │
└─────────────────────────────────────────────────────────────────┘
```

**Lógica de Cálculo das Grades:**

```typescript
function calculateGrades(userData: UserData): Grades {
  const { measurements, scores, symmetry, history } = userData
  
  // SIMETRIA - baseado nas diferenças bilaterais
  const symmetryScore = calculateSymmetryScore(symmetry)
  const simetriaGrade = scoreToGrade(symmetryScore)
  // A+ = <2% diff, A = 2-3%, B = 3-5%, C = 5-7%, D = 7-10%, E = >10%
  
  // PROPORÇÃO - baseado no score total do método preferido
  const proporcaoGrade = scoreToGrade(scores.scoreTotal)
  // A+ = 95-100, A = 90-94, B+ = 85-89, B = 80-84, C = 70-79, D = 60-69, E = <60
  
  // ESTÉTICA - análise combinada de V-taper, cintura, harmonia
  const esteticaScore = calculateAestheticScore(measurements, scores)
  const esteticaGrade = scoreToGrade(esteticaScore)
  
  // EVOLUÇÃO - tendência dos últimos 30-90 dias
  const evolutionScore = calculateEvolutionScore(history)
  const evolucaoGrade = scoreToGrade(evolutionScore)
  
  return { simetria: simetriaGrade, proporcao: proporcaoGrade, estetica: esteticaGrade, evolucao: evolucaoGrade }
}

function scoreToGrade(score: number): Grade {
  if (score >= 97) return 'A+'
  if (score >= 93) return 'A'
  if (score >= 88) return 'B+'
  if (score >= 83) return 'B'
  if (score >= 75) return 'C+'
  if (score >= 68) return 'C'
  if (score >= 60) return 'D'
  return 'E'
}
```

---

#### 3.2.3 Evolution Card

```typescript
interface EvolutionCardProps {
  period: '7d' | '30d' | '90d'
  metrics: Array<{
    name: string
    previous: number
    current: number
    change: number
    changePercent: number
    status: 'up' | 'down' | 'stable'
    isPositive: boolean   // up pode ser negativo (ex: cintura)
  }>
  overallTrend: 'improving' | 'stable' | 'declining'
}
```

**Layout:**

```
┌─────────────────────────────────────────┐
│  📈 EVOLUÇÃO (últimos 30 dias)          │
│                                         │
│  Ombros    118 → 120    +2cm       🟢   │
│  Cintura    84 → 82     -2cm       🟢   │
│  Braço      40 → 42     +2cm       🟢   │
│  Ratio    1.40 → 1.56   +0.16      🟢   │
│                                         │
│  ────────────────────────────────       │
│  Tendência geral: MELHORANDO ↗️         │
│                                         │
│  [Ver evolução completa →]              │
└─────────────────────────────────────────┘
```

---

### 3.3 Silhueta / Heatmap Corporal

**Objetivo:** Visualização intuitiva de onde está bom e onde precisa melhorar.

```typescript
interface BodyHeatmapProps {
  // Dados por região corporal
  regions: {
    ombros: RegionData
    peitoral: RegionData
    bracos: RegionData
    antebracos: RegionData
    cintura: RegionData
    coxas: RegionData
    panturrilhas: RegionData
    pescoco: RegionData
  }
  
  // Modo de visualização
  mode: 'score' | 'evolution' | 'asymmetry'
  
  // Highlight de região específica
  highlightRegion?: string
  
  // Callback ao clicar em região
  onRegionClick?: (region: string) => void
}

interface RegionData {
  score: number           // 0-100
  atual: number          // medida atual em cm
  ideal: number          // medida ideal em cm
  diferenca: number      // diferença em cm
  evolution?: number     // mudança vs período anterior
  status: 'excellent' | 'good' | 'attention' | 'critical'
}
```

**Cores por Status:**

| Status | Score | Cor | Hex |
|--------|-------|-----|-----|
| Excellent | 90-100% | Verde | `#10B981` |
| Good | 75-89% | Teal | `#00C9A7` |
| Attention | 60-74% | Amarelo | `#F59E0B` |
| Critical | <60% | Vermelho | `#EF4444` |

**Layout:**

```
┌─────────────────────────────────────────┐
│  MAPA DE CALOR CORPORAL                 │
│                                         │
│              ┌───────┐                  │
│              │ Pesc  │                  │
│              └───┬───┘                  │
│         ┌───────┴───────┐               │
│  ┌──────┤    Ombros     ├──────┐        │
│  │Braço │   +2cm 🟢     │Braço │        │
│  │      ├───────────────┤      │        │
│  │      │   Peitoral    │      │        │
│  │      ├───────────────┤      │        │
│  │      │    Cintura    │      │        │
│  │      │   -1cm 🟢     │      │        │
│  └──────┼───────────────┼──────┘        │
│         │     Coxas     │               │
│         ├───────────────┤               │
│         │  Panturrilha  │               │
│         └───────────────┘               │
│                                         │
│  Clique em uma região para detalhes     │
└─────────────────────────────────────────┘
```

---

### 3.4 Score Breakdown Card

**Objetivo:** Mostrar exatamente onde está ganhando e perdendo pontos.

```typescript
interface ScoreBreakdownProps {
  method: ProportionMethod
  totalScore: number
  proportions: Array<{
    id: string
    nome: string
    score: number
    maxScore: number      // peso desta proporção
    percentage: number    // score/maxScore * 100
    status: 'excellent' | 'good' | 'attention' | 'critical'
    trend?: 'up' | 'down' | 'stable'
  }>
}
```

**Layout:**

```
┌─────────────────────────────────────────┐
│  📊 BREAKDOWN DO SCORE                  │
│  Método: Golden Ratio                   │
│                                         │
│  1. Ombros (V-Taper)                    │
│     █████████████████░░░  92%      🟢   │
│                                         │
│  2. Peitoral                            │
│     ████████████████░░░░  85%      🟢   │
│                                         │
│  3. Braços                              │
│     ██████████████░░░░░░  78%      🟡   │
│                                         │
│  4. Tríade (Simetria)                   │
│     ████████████░░░░░░░░  72%      🟡   │
│                                         │
│  5. Cintura                             │
│     █████████████████░░░  90%      🟢   │
│                                         │
│  6. Pernas                              │
│     ██████████░░░░░░░░░░  65%      🔴   │
│                                         │
│  ─────────────────────────────────      │
│  SCORE TOTAL                  80/100    │
│                                         │
│  💡 Foque em Pernas para maior ganho    │
└─────────────────────────────────────────┘
```

---

### 3.5 Métricas Principais (6 cards)

**Objetivo:** Valores atuais das medidas mais importantes com indicação de meta.

```typescript
interface MetricCardProps {
  metric: string          // 'peitoral', 'bracos', etc.
  label: string           // 'PEITORAL'
  value: number           // 112
  unit: string            // 'cm'
  ideal?: number          // 115
  status: 'onTarget' | 'close' | 'far'
  statusLabel: string     // 'Meta: 115cm' ou 'Na Meta' ou 'Faltam: 3cm'
  icon: React.ReactNode
  trend?: {
    value: number         // +2
    period: string        // '30d'
  }
}
```

**Layout de Card Individual:**

```
┌─────────────────────┐
│  PEITORAL       💪  │
│                     │
│  112 cm             │
│                     │
│  Meta: 115cm   🟡   │
│  ↑ +2cm (30d)       │
└─────────────────────┘
```

**Métricas Padrão (6):**

| # | Métrica | Ícone | Prioridade |
|---|---------|-------|------------|
| 1 | Peitoral | 💪 | Alta |
| 2 | Braços | 💪 | Alta |
| 3 | Cintura | 📏 | Alta |
| 4 | Coxas | 🦵 | Média |
| 5 | Panturrilha | 🦵 | Média |
| 6 | Ombros | 📐 | Alta |

**Status Colors:**

| Status | Condição | Cor | Label |
|--------|----------|-----|-------|
| onTarget | atual >= ideal | Verde | "Na Meta ✓" |
| close | falta <= 5% | Amarelo | "Faltam: Xcm" |
| far | falta > 5% | Cinza | "Meta: Xcm" |

---

### 3.6 Insight Card (Coach IA)

**Objetivo:** Dica personalizada e acionável da IA.

```typescript
interface InsightCardProps {
  type: 'tip' | 'warning' | 'achievement' | 'analysis'
  title: string
  message: string
  priority: 'high' | 'medium' | 'low'
  icon: string
  action?: {
    label: string
    href: string
  }
  isPro: boolean          // Se requer PRO para ver completo
  createdAt: Date
}
```

**Tipos de Insight:**

| Tipo | Ícone | Cor | Exemplo |
|------|-------|-----|---------|
| tip | 💡 | Teal | "Foque em deltóide lateral esta semana" |
| warning | ⚠️ | Amarelo | "Sua cintura aumentou 1cm" |
| achievement | 🏆 | Dourado | "Você atingiu ratio 1.5!" |
| analysis | 📊 | Roxo | "Seu V-taper melhorou 8% este mês" |

**Layout:**

```
┌─────────────────────────────────────────┐
│  🤖 INSIGHT DO COACH IA            PRO  │
│                                         │
│  💡 Dica da Semana                      │
│                                         │
│  "Seu V-taper melhorou 8% este mês!     │
│   Continue focando em deltóide lateral  │
│   e mantenha o vacuum abdominal para    │
│   maximizar a proporção ombro/cintura." │
│                                         │
│  [Ver análise completa →]               │
│                                         │
│  Gerado há 2 horas                      │
└─────────────────────────────────────────┘
```

**Lógica de Geração de Insights:**

```typescript
function generateDailyInsight(userData: UserData): Insight {
  const { measurements, scores, goals } = userData
  
  // Prioridade de insights
  const insights = []
  
  // 1. Alerta de medida preocupante
  const worryingMetrics = findWorryingTrends(measurements)
  if (worryingMetrics.length > 0) {
    insights.push({
      type: 'warning',
      priority: 'high',
      title: 'Atenção',
      message: `Sua ${worryingMetrics[0].metric} ${worryingMetrics[0].trend} ${worryingMetrics[0].value}cm nas últimas semanas.`
    })
  }
  
  // 2. Conquista recente
  const recentAchievement = findRecentMilestone(scores)
  if (recentAchievement) {
    insights.push({
      type: 'achievement',
      priority: 'high',
      title: 'Parabéns!',
      message: recentAchievement.message
    })
  }
  
  // 3. Dica de treino baseada no maior gap
  const biggestGap = findBiggestGap(scores)
  insights.push({
    type: 'tip',
    priority: 'medium',
    title: 'Dica da Semana',
    message: generateTrainingTip(biggestGap)
  })
  
  // Retornar insight de maior prioridade
  return insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])[0]
}
```

---

### 3.7 Conquistas Card (Gamificação)

**Objetivo:** Mostrar progresso em direção a conquistas e motivar consistência.

```typescript
interface AchievementsCardProps {
  // Próximas conquistas (mais perto de desbloquear)
  upcoming: Array<{
    id: string
    name: string
    icon: string
    progress: number      // 0-100
    requirement: string   // "Ratio 1.60"
  }>
  
  // Streak atual
  streak: {
    current: number       // dias consecutivos
    best: number          // recorde
    isActive: boolean     // mediu hoje?
  }
  
  // XP e nível
  gamification: {
    level: number
    currentXp: number
    nextLevelXp: number
    totalXp: number
  }
}
```

**Layout:**

```
┌─────────────────────────────────────────┐
│  🏆 CONQUISTAS                          │
│                                         │
│  Próximos Marcos:                       │
│                                         │
│  ⭐ Ratio 1.60                          │
│     ████████████░░░░  80%               │
│                                         │
│  💪 Braço 45cm                          │
│     ████████░░░░░░░░  55%               │
│                                         │
│  🎯 Score 85                            │
│     ██████████████░░  90%               │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  🔥 STREAK: 12 dias     Recorde: 21     │
│                                         │
│  [Ver todas conquistas →]               │
└─────────────────────────────────────────┘
```

---

### 3.8 Alerta de Última Medição

**Objetivo:** Incentivar consistência de registro.

```typescript
interface LastMeasurementAlertProps {
  lastMeasurementDate: Date
  daysSince: number
  recommendedFrequency: number  // dias (ex: 7)
  status: 'recent' | 'due' | 'overdue'
}
```

**Layout por Status:**

```
// recent (< 7 dias) - Sutil, não intrusivo
┌─────────────────────────────────────────┐
│  ✓ Última medição: há 3 dias            │
└─────────────────────────────────────────┘

// due (7-14 dias) - Lembrete amigável
┌─────────────────────────────────────────┐
│  📏 Hora de medir! Última: há 8 dias    │
│  [+ Registrar medidas]                  │
└─────────────────────────────────────────┘

// overdue (> 14 dias) - Destaque urgente
┌─────────────────────────────────────────┐
│  ⚠️ Já se passaram 18 dias desde sua    │
│     última medição. Mantenha o ritmo!   │
│                                         │
│  [+ REGISTRAR MEDIDAS AGORA]            │
└─────────────────────────────────────────┘
```

---

### 3.9 Widget de Simetria Bilateral

**Objetivo:** Mostrar diferenças entre lado esquerdo e direito.

```typescript
interface SymmetryWidgetProps {
  measurements: Array<{
    muscle: string
    left: number
    right: number
    diff: number
    diffPercent: number
    status: 'symmetric' | 'moderate' | 'asymmetric'
  }>
  overallSymmetry: number  // 0-100
}
```

**Thresholds de Simetria:**

| Status | Diferença | Cor |
|--------|-----------|-----|
| symmetric | < 3% | Verde |
| moderate | 3-5% | Amarelo |
| asymmetric | > 5% | Vermelho |

**Layout:**

```
┌─────────────────────────────────────────┐
│  ⚖️ SIMETRIA BILATERAL                  │
│                                         │
│           E        D       DIFF         │
│  Braço   41.0    44.5    +3.5cm    🔴   │
│  Coxa    62.0    63.0    +1.0cm    🟢   │
│  Pant    38.5    39.0    +0.5cm    🟢   │
│                                         │
│  ─────────────────────────────────      │
│  Simetria Geral: 87%              🟡    │
│                                         │
│  [Ver análise completa →]               │
└─────────────────────────────────────────┘
```

---

## 4. ESTADOS DO DASHBOARD

### 4.1 Estado: Primeiro Acesso (Onboarding)

Quando o usuário ainda não tem medidas:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     👋 BEM-VINDO AO VITRU IA                     │
│                                                                 │
│          Vamos configurar seu perfil para calcular              │
│              suas proporções ideais personalizadas              │
│                                                                 │
│                                                                 │
│               ┌─────────────────────────────┐                   │
│               │                             │                   │
│               │   1. Dados básicos    ✓     │                   │
│               │   2. Medidas estruturais    │ ←                 │
│               │   3. Primeira medição       │                   │
│               │   4. Ver resultados         │                   │
│               │                             │                   │
│               └─────────────────────────────┘                   │
│                                                                 │
│                    [Continuar Setup →]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Estado: Perfil Incompleto

Quando faltam medidas estruturais:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ PERFIL INCOMPLETO                                           │
│                                                                 │
│  Para calcular suas proporções ideais, precisamos de:           │
│                                                                 │
│  ✓ Altura                                                       │
│  ✓ Circunferência do punho                                      │
│  ✗ Circunferência do tornozelo                                  │
│  ✗ Circunferência do joelho                                     │
│  ✗ Circunferência da pelve                                      │
│                                                                 │
│  [Completar perfil →]                                           │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Estado: Loading

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         ⏳                                       │
│                                                                 │
│                Carregando seu dashboard...                      │
│                                                                 │
│            [Skeleton loading dos componentes]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Estado: Erro

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         ❌                                       │
│                                                                 │
│           Ops! Não conseguimos carregar seus dados              │
│                                                                 │
│                    [Tentar novamente]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. DADOS NECESSÁRIOS (API)

### 5.1 Endpoint: GET /dashboard

```typescript
// Response
interface DashboardResponse {
  user: {
    id: string
    name: string
    isPro: boolean
    hasCompleteProfile: boolean
  }
  
  // Última medição
  latestMeasurement: Measurement | null
  lastMeasurementDate: Date | null
  daysSinceLastMeasurement: number
  
  // Scores atuais (do método preferido)
  currentScores: {
    method: ProportionMethod
    scoreTotal: number
    ratio: number
    classification: ScoreClassification
    ratioClassification: RatioClassification
    breakdown: ScoreBreakdown
    ideals: Ideals
  }
  
  // Evolução
  evolution: {
    period: '30d'
    metrics: EvolutionMetric[]
    scoreChange: number
    ratioChange: number
    trend: 'improving' | 'stable' | 'declining'
  }
  
  // Simetria bilateral (se disponível)
  symmetry: SymmetryData | null
  
  // Gamificação
  gamification: {
    level: number
    xp: number
    nextLevelXp: number
    streak: number
    bestStreak: number
    upcomingAchievements: Achievement[]
  }
  
  // Insights da IA
  insights: Insight[]
  
  // Foco da semana (calculado)
  weeklyFocus: WeeklyFocus
}
```

### 5.2 Query Hook

```typescript
// hooks/queries/useDashboard.ts

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => api.dashboard.get(),
    staleTime: 2 * 60 * 1000,  // 2 minutos
    refetchOnWindowFocus: true,
  })
}
```

---

## 6. INTERAÇÕES E NAVEGAÇÃO

### 6.1 Ações Principais

| Elemento | Ação | Destino |
|----------|------|---------|
| CTA Header "Realizar Avaliação IA" | Click | `/assessment/new` |
| Hero Card CTA | Click | `/measurements/new` |
| "Ver evolução completa" | Click | `/evolution` |
| "Ver todas medidas" | Click | `/measurements` |
| "Ver análise completa" (IA) | Click | `/ai/analysis` |
| "Ver todas conquistas" | Click | `/achievements` |
| Região do Heatmap | Click | Modal com detalhes |
| Métrica individual | Click | `/measurements?metric=X` |

### 6.2 Refresh e Atualização

```typescript
// Pull-to-refresh no mobile
// Botão de refresh discreto no desktop
// Auto-refresh a cada 5 minutos se a aba estiver ativa
```

---

## 7. PERFORMANCE

### 7.1 Otimizações

| Técnica | Aplicação |
|---------|-----------|
| Skeleton Loading | Todos os cards durante load |
| Lazy Loading | Charts e componentes pesados |
| Memoization | Cards que não mudam frequentemente |
| Virtualization | Lista de métricas se > 10 |
| Prefetch | Dados de páginas linkadas |

### 7.2 Métricas Alvo

| Métrica | Alvo |
|---------|------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Largest Contentful Paint | < 2.5s |

---

## 8. ACESSIBILIDADE

### 8.1 Requisitos

- Contraste WCAG AA em todos os textos
- Labels em todos os elementos interativos
- Navegação por teclado completa
- Screen reader friendly (aria-labels)
- Indicadores visuais além de cor

### 8.2 Cores e Daltonismo

Além das cores, usar:
- Ícones (✓, ⚠, ✗)
- Padrões (linhas sólidas vs tracejadas)
- Labels textuais

---

## 9. VARIAÇÕES

### 9.1 Dashboard Free vs PRO

| Elemento | Free | PRO |
|----------|------|-----|
| Hero Card | ✓ | ✓ |
| KPI Cards | ✓ | ✓ |
| Heatmap | Simplificado | Completo + interativo |
| Score Breakdown | Top 3 | Todas 9 proporções |
| Métricas | 6 básicas | Personalizáveis |
| Insight IA | 1 básico | Múltiplos + análise |
| Simetria | ✗ | ✓ |
| Conquistas | Básicas | Todas + exclusivas |

### 9.2 Dashboard Mobile

- Layout em 1 coluna
- Hero Card mais compacto
- KPIs em carousel horizontal
- Métricas em grid 2x3
- Bottom sheet para detalhes

---

## 10. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do Dashboard |

---

**VITRU IA Dashboard Specification**  
*Focado em Progresso • Ação • Motivação*
