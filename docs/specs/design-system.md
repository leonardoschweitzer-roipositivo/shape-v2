# SHAPE-V — Design System Specification

**Versão:** 1.1  
**Data:** 07/02/2026  
**Referência:** PRD v1.0

---

## 1. Visão Geral

O Design System do SHAPE-V foi projetado para uma interface **dark-first**, otimizada para uso em ambientes de academia e treino. Prioriza alta legibilidade em fundo escuro, contraste vibrante e efeitos de glassmorphism que transmitem modernidade e sofisticação.

---

## 2. Paleta de Cores

### 2.1 Brand Colors

| Nome | Hex | CSS Variable | Uso |
|------|-----|--------------|-----|
| **Primary Teal** | `#00C9A7` | `--primary` | Ações principais, CTAs, destaques positivos, progresso |
| **Secondary Purple** | `#7C3AED` | `--secondary` | Gradientes, acentos secundários, badges PRO |

### 2.2 Background Colors

| Nome | Hex | CSS Variable | Uso |
|------|-----|--------------|-----|
| **Background Dark** | `#0A0F1C` | `--background-dark` | Fundo principal da aplicação |
| **Background Card** | `#131B2C` | `--background-card` | Painéis, cards, elementos elevados |

### 2.3 Semantic Colors

| Status | Cor | Tailwind Class | Uso |
|--------|-----|----------------|-----|
| **Success** | Verde | `green-500` / `green-400` | Métricas positivas, progresso, ganhos |
| **Error** | Vermelho | `red-400` | Alertas, métricas negativas, assimetria alta |
| **Warning** | Amarelo/Laranja | `yellow-400` / `orange-400` | Avisos, assimetria moderada, atenção |
| **Info** | Azul | `blue-400` / `blue-500` | Informativos, status neutro |

### 2.4 Text Colors

| Tipo | Tailwind Class | Uso |
|------|----------------|-----|
| **Primary Text** | `text-white` | Títulos, valores principais |
| **Secondary Text** | `text-gray-300` | Texto de corpo, parágrafos |
| **Muted Text** | `text-gray-400` | Legendas, descrições secundárias |
| **Disabled Text** | `text-gray-500` | Labels, informações de suporte |

---

## 3. Tipografia

### 3.1 Font Family

| Fonte | Uso |
|-------|-----|
| **Space Grotesk** | Fonte principal para títulos e corpo |
| **Mono (System)** | Números, valores, códigos |

### 3.2 Escala Tipográfica

| Elemento | Size | Weight | Classes Tailwind |
|----------|------|--------|------------------|
| Display H1 | 48px | Bold | `text-5xl font-bold tracking-tight` |
| Heading H2 | 36px | Bold | `text-4xl font-bold tracking-tight` |
| Heading H3 | 24px | Bold | `text-2xl font-bold` |
| Heading H4 | 18px | Bold | `text-lg font-bold` |
| Body Regular | 16px | Regular | `text-base text-gray-300 leading-relaxed` |
| Body Small | 14px | Medium | `text-sm text-gray-400` |
| Label / Overline | 12px | Bold | `text-xs font-bold uppercase tracking-widest` |
| Caption | 10px | Bold | `text-[10px] font-bold` |

### 3.3 Números

- **Sans-serif**: Para exibição de métricas (`text-3xl font-bold text-white`)
- **Mono**: Para valores exatos/técnicos (`text-3xl font-mono text-primary`)

---

## 4. Componentes Base

### 4.1 GlassPanel

Container principal com efeito glassmorphism.

```typescript
// Uso
<GlassPanel className="p-8 rounded-2xl">
  {children}
</GlassPanel>
```

**Características:**
- Background semi-transparente
- Border sutil (`border-white/10`)
- Efeito de blur (backdrop-blur)
- Sombra suave

### 4.2 Botões

| Variante | Classes | Uso |
|----------|---------|-----|
| **Primary** | `bg-primary hover:bg-primary/90 text-[#0A0F1C] font-bold shadow-[0_0_15px_rgba(0,201,167,0.3)]` | Ações principais, CTAs |
| **Secondary** | `bg-white/5 hover:bg-white/10 border border-white/10 text-white` | Ações secundárias |
| **Ghost** | `text-gray-400 hover:text-white hover:bg-white/5` | Ícones, links |
| **Status** | `border border-blue-500/30 text-blue-400 hover:bg-blue-500/10` | Ações de status |

### 4.3 InputField

Campo de entrada padronizado.

```typescript
<InputField 
  label="Metric Input" 
  unit="cm" 
  placeholder="00.0" 
/>
```

**Props:**
- `label`: Label do campo
- `unit`: Unidade de medida (opcional)
- `placeholder`: Placeholder text

### 4.4 Tags & Badges

| Variante | Classes | Uso |
|----------|---------|-----|
| **Growth Badge** | `bg-green-500/10 text-green-400 border-green-500/20` | Indicador de crescimento |
| **Label Filled** | `bg-primary text-[#0A0F1C]` | Labels de método (NAVY, POLLOCK) |
| **Outline** | `bg-white/5 border-white/10 text-primary` | Badges informativos |
| **Warning** | `bg-orange-400/10 text-orange-400 border-orange-400/30` | Alertas de assimetria |
| **Pro Badge** | `bg-secondary/20 text-secondary border-secondary/20` | Features premium |

### 4.5 ProfileSelector

Seletor de perfil (Academia, Personal, Atleta) com ícones e estados de seleção.

```typescript
<ProfileSelector
  selected={selectedProfile}
  onSelect={setSelectedProfile}
/>
```

**Opções:**
- Academia (Building2)
- Personal (User)
- Atleta (Dumbbell)

---

## 5. Dashboard Widgets

### 5.1 HeroCard

Banner principal do dashboard com título, tagline e CTA.

**Elementos:**
- Background gradient (primary → secondary em 45°)
- Título principal com tagline
- Botão de ação primário

### 5.2 KPI Cards

#### RatioCard
Exibe o Shape-V Ratio com barra de escala visual.

**Escalas:**
- BLOCO (< 1.20)
- NORMAL (1.20-1.35)
- ATLÉTICO (1.35-1.50)
- ESTÉTICO (1.50-1.618)
- FREAK (> 1.618)

#### HeatmapCard
Exibe simetria corporal em formato de heatmap com silhueta.

#### ScoreCard
Avaliação geral com gráfico circular (gauge) e grade (A-E).

### 5.3 MetricsGrid

Grid de métricas-chave com valores, trends e variações.

**Métricas típicas:**
- Altura, Peso, Gordura, Shape-V
- Cada card com valor principal, variação (trend) e unidade

---

## 6. Visualização de Dados (Charts)

### 6.1 Biblioteca

**Recharts** — Biblioteca principal de gráficos.

### 6.2 Tipos de Gráfico

| Componente | Tipo | Uso |
|------------|------|-----|
| **RadarChart** | Radar/Spider | Simetria corporal, proporções |
| **BodyFatGauge** | Gauge semicircular | Percentual de gordura corporal |
| **AsymmetryRadar** | Radar overlay | Comparativo esquerdo vs direito |
| **GoldenEvolutionChart** | Line | Evolução do ratio ao longo do tempo |
| **MeasuresChart** | Line | Evolução de medidas brutas |
| **WeightChart** | Area stacked | Peso total, magro, gordo |
| **BodyFatChart** | Sparkline/Area | Evolução da gordura corporal |
| **AsymmetryScannerChart** | Bar grouped | Scanner de assimetrias bilaterais |

### 6.3 Cores de Dados

| Variável | Cor | Uso |
|----------|-----|-----|
| Primário | `#00C9A7` (teal) | Linha principal, valores atuais |
| Secundário | `#7C3AED` (purple) | Linha secundária, comparativos |
| Peso Magro | `#22c55e` (green) | Massa magra |
| Peso Gordo | `#ef4444` (red) | Massa gorda |
| Target | Linha tracejada | Golden Ratio target (1.618) |

---

## 7. Assessment Cards

### 7.1 MassCard

Card de massa corporal (peso, massa magra, gordura).

```typescript
<MassCard 
  label="Peso Exemplo" 
  value={80.5} 
  unit="kg" 
  trend={1.2}    // positivo = verde, negativo = vermelho
  color="green"  // "green" | "purple" | "red"
/>
```

### 7.2 AsymmetryCard

Card de análise de assimetria bilateral.

```typescript
<AsymmetryCard
  icon={<Accessibility size={20} />}
  title="BRAÇO"
  subtitle="DIFERENCIAL BILATERAL"
  leftVal="41,0"
  rightVal="44,5"
  diff="+3,5"
  status="high"  // "symmetrical" | "moderate" | "high"
/>
```

**Status Colors:**
- `symmetrical`: Verde (< 3%)
- `moderate`: Amarelo (3-5%)
- `high`: Vermelho (> 5%)

### 7.3 ProportionCard

Card complexo de proporção áurea com overlay visual.

```typescript
<ProportionCard
  title="Shape-V"
  badge="ESCALA SHAPE-V"
  metrics={[
    { label: 'Ombros', value: '133cm' }, 
    { label: 'Cintura', value: '85cm' }
  ]}
  currentValue="1.56"
  valueLabel="RATIO ATUAL"
  description="Descrição da proporção."
  statusLabel="QUASE LÁ"
  userPosition={78}   // posição do usuário na barra (0-100)
  goalPosition={88}   // posição do goal na barra (0-100)
  image="/path/to/image.jpg"
  overlayStyle="v-taper"  // tipo de overlay visual
/>
```

---

## 8. AI & Insights Widgets

### 8.1 ScoreWidget

Widget de pontuação geral com gráfico circular.

```typescript
<ScoreWidget 
  score={85} 
  label="Pontuação" 
  change="+3.5%" 
/>
```

### 8.2 AiInsightCard

Card de insight da IA com título e descrição.

```typescript
<AiInsightCard
  title="Dica Rápida"
  description="Seu progresso de ombro está excelente."
  type="Coach Tip"  // "Coach Tip" | "Assimetria" | "Alerta"
/>
```

### 8.3 ProportionAiAnalysisCard

Card de análise de proporção com pontos fortes, fracos e sugestão.

```typescript
<ProportionAiAnalysisCard
  strength="Seus Ombros Largos são seu ponto forte genético."
  weakness="A largura da cintura aumentou levemente este mês."
  suggestion="Inclua vacuum abdominal na sua rotina matinal."
/>
```

### 8.4 AiAnalysisWidget

Widget de análise completa da IA em largura total.

```typescript
<AiAnalysisWidget
  title="RELATÓRIO SEMANAL DO COACH IA"
  analysis={<span>Conteúdo da análise...</span>}
/>
```

---

## 9. Listas & Tabelas

### 9.1 AssessmentList

Lista de avaliações físicas com histórico, scores e status de assimetria.

```typescript
<AssessmentList assessments={assessmentsData} />
```

**Colunas:**
- Data da Avaliação (com indicador visual)
- Peso (kg)
- Gordura (%)
- Shape-V Score (com color coding)
- Assimetria Média (%)
- Ações (Visualizar, Editar, Excluir)

---

## 10. Efeitos Visuais

### 10.1 Shadows

| Nome | CSS | Uso |
|------|-----|-----|
| **Glow Primary** | `shadow-[0_0_15px_rgba(0,201,167,0.3)]` | Botões primários, destaques |
| **Glow Secondary** | `shadow-[0_0_20px_rgba(124,58,237,0.3)]` | Elementos purple |
| **Glow Success** | `shadow-[0_0_10px_rgba(74,222,128,0.1)]` | Badges de sucesso |

### 10.2 Glassmorphism

- Background: `rgba(255, 255, 255, 0.05)` ou `bg-white/5`
- Border: `border border-white/10`
- Backdrop: `backdrop-blur-md`

### 10.3 Transições

- Default: `transition-all` ou `transition-colors`
- Hovers: Levantar opacidade, adicionar glow

---

## 11. Ícones

### 11.1 Biblioteca

**Lucide React** — Biblioteca de ícones.

### 11.2 Ícones Principais

| Categoria | Ícones |
|-----------|--------|
| **Navegação** | `ArrowRight`, `ChevronDown` |
| **Ações** | `Camera`, `Download`, `Share2` |
| **Notificações** | `Bell`, `Sparkles` |
| **Métricas** | `Activity`, `Ruler`, `Dumbbell`, `Utensils` |
| **Corpo** | `Accessibility`, `Footprints`, `Hand` |

### 11.3 Tamanhos

| Size | Pixels | Uso |
|------|--------|-----|
| Small | 14-16px | Botões inline, tags |
| Medium | 18-20px | Botões principais, cards |
| Large | 24-28px | Headers, destaques |

---

## 12. Responsividade

### 12.1 Breakpoints

| Nome | Largura | Prefixo Tailwind |
|------|---------|------------------|
| Mobile | < 768px | (default) |
| Tablet | 768px+ | `md:` |
| Desktop | 1024px+ | `lg:` |
| Wide | 1280px+ | `xl:` |

### 12.2 Grid System

- **1 coluna**: Mobile
- **2 colunas**: `md:grid-cols-2`
- **3 colunas**: `lg:grid-cols-3`
- **4 colunas**: `xl:grid-cols-4`

### 12.3 Container

```html
<div className="max-w-7xl mx-auto px-4 md:px-8">
```

---

## 13. Componentes Disponíveis

### 13.1 Lista de Componentes

| Arquivo | Componentes Exportados |
|---------|------------------------|
| `GlassPanel.tsx` | `GlassPanel` |
| `InputField.tsx` | `InputField` |
| `KpiCard.tsx` | `RatioCard`, `HeatmapCard`, `ScoreCard` |
| `HeroCard.tsx` | `HeroCard` |
| `MetricsGrid.tsx` | `MetricsGrid` |
| `AssessmentCharts.tsx` | `RadarChart`, `BodyFatGauge`, `AsymmetryRadar` |
| `AssessmentCards.tsx` | `MassCard`, `ProportionCard`, `AsymmetryCard`, `ScoreWidget`, `AiAnalysisWidget`, `ProportionAiAnalysisCard`, `AiInsightCard` |
| `EvolutionCharts.tsx` | `GoldenEvolutionChart`, `MeasuresChart`, `WeightChart`, `BodyFatChart`, `AsymmetryScannerChart` |
| `AssessmentList.tsx` | `AssessmentList` |
| `ProfileSelector.tsx` | `ProfileSelector` |

---

## 14. Boas Práticas

### 14.1 Acessibilidade

- Contraste mínimo WCAG AA para texto sobre fundos escuros
- Labels em todos os inputs
- Focus states visíveis

### 14.2 Performance

- Ícones Lucide são tree-shakeable
- Charts Recharts com lazy loading quando possível
- Imagens com lazy loading nativo

### 14.3 Consistência

- Usar sempre as CSS variables definidas
- Manter espaçamentos consistentes (múltiplos de 4px)
- Bordas arredondadas: `rounded-lg` (8px) ou `rounded-2xl` (16px)

---

**Versão 1.1 — Baseado em `components/DesignSystem.tsx`**
