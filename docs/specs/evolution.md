# SPEC: Evolution (Evolução) - SHAPE-V

## Documento de Especificação da Página de Evolução

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** SHAPE-V (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

A página de **Evolução** é onde o atleta acompanha seu progresso ao longo do tempo. É uma das páginas mais visitadas do app, pois visualizar o progresso é altamente motivador.

### 1.1 Objetivos da Página

| Objetivo | Descrição |
|----------|-----------|
| **Visualizar Progresso** | Mostrar claramente a evolução em gráficos |
| **Identificar Tendências** | Destacar o que está melhorando ou piorando |
| **Motivar** | Celebrar conquistas e marcos atingidos |
| **Orientar** | Dar insights sobre o que focar |
| **Detectar Problemas** | Alertar sobre assimetrias e regressões |

### 1.2 Princípios de Design

```
┌─────────────────────────────────────────────────────────────────┐
│                  PRINCÍPIOS DA PÁGINA EVOLUÇÃO                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 DADOS CLAROS      Gráficos fáceis de entender               │
│  🎯 CONTEXTO          Sempre comparar com ideal/meta            │
│  ⚡ RESUMO PRIMEIRO   KPIs antes dos detalhes                   │
│  🤖 INTELIGÊNCIA      IA interpreta os dados                    │
│  📱 INTERATIVO        Filtros, zoom, seleção                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. LAYOUT GERAL

### 2.1 Estrutura da Página

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  EVOLUÇÃO                               [Gráficos] [Lista]      │
│  Análise do progresso físico            [3M] [6M] [1A] [TOTAL]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 1. 📊 RESUMO DO PERÍODO (KPIs)                      [NOVO] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 2. 📈 ARQUITETURA ESTÉTICA                                  ││
│  │    Evolução Áurea (Gráfico principal)              [EXISTE] ││
│  │    + Multi-métricas                                 [NOVO] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 3. 🤖 INSIGHT DA IA                                 [NOVO] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 4. 🏋️ COMPOSIÇÃO CORPORAL                          [EXISTE] ││
│  │    [Evolução Peso]        [Gordura Corporal %]              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 5. 📏 MORFOLOGIA E SIMETRIA                        [EXISTE] ││
│  │    [Medidas Brutas]   [Scanner Assimetrias]        [MELHOR] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 6. 📸 COMPARATIVO VISUAL                            [NOVO] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Filtros Globais (Header)

```typescript
interface EvolutionFilters {
  // Modo de visualização
  viewMode: 'charts' | 'list'
  
  // Período
  period: '3M' | '6M' | '1A' | 'TOTAL' | 'CUSTOM'
  customRange?: {
    startDate: Date
    endDate: Date
  }
  
  // Método de proporção (para cálculos)
  method: 'GOLDEN_RATIO' | 'CLASSIC_PHYSIQUE' | 'MENS_PHYSIQUE'
}
```

**Layout do Header:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  SHAPE-V / EVOLUÇÃO                    [🔔] [REALIZAR AVAL.] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EVOLUÇÃO                                                       │
│  Análise detalhada do progresso físico e simetria               │
│                                                                 │
│  ┌──────────────┐                    ┌─────────────────────────┐│
│  │[GRÁFICOS]│Lista│                  │ 3M │[6M]│ 1A │ TOTAL   ││
│  └──────────────┘                    └─────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTES

### 3.1 📊 Resumo do Período (KPIs) - **NOVO**

**Objetivo:** Visão rápida das principais métricas de evolução do período selecionado.

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 RESUMO DO PERÍODO                                           │
│  Comparativo: Jan/2023 → Jun/2023 (6 meses)                     │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │ SHAPE-V     │ │ SCORE       │ │ MELHOR      │ │ ATENÇÃO     ││
│  │ RATIO       │ │ GERAL       │ │ EVOLUÇÃO    │ │             ││
│  │             │ │             │ │             │ │             ││
│  │   +0.12     │ │   +8        │ │   Ombros    │ │  Cintura    ││
│  │ 1.49→1.61   │ │  72→80      │ │ +5cm (4.3%) │ │ +1cm (1.2%) ││
│  │      🟢     │ │      🟢     │ │      🟢     │ │     🟡      ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Componente:**

```typescript
interface PeriodSummaryProps {
  period: {
    label: string           // "6 meses"
    startDate: Date
    endDate: Date
  }
  
  kpis: {
    ratio: {
      label: string         // "SHAPE-V RATIO"
      startValue: number    // 1.49
      endValue: number      // 1.61
      change: number        // +0.12
      changePercent: number // +8.05%
      status: 'positive' | 'negative' | 'neutral'
      icon: string          // "📐"
    }
    score: {
      label: string         // "SCORE GERAL"
      startValue: number    // 72
      endValue: number      // 80
      change: number        // +8
      status: 'positive' | 'negative' | 'neutral'
      icon: string          // "🎯"
    }
    bestEvolution: {
      label: string         // "MELHOR EVOLUÇÃO"
      metric: string        // "Ombros"
      change: number        // +5
      changePercent: number // +4.3%
      status: 'positive'
      icon: string          // "🚀"
    }
    attention: {
      label: string         // "ATENÇÃO"
      metric: string        // "Cintura"
      change: number        // +1
      changePercent: number // +1.2%
      status: 'warning' | 'negative'
      reason: string        // "Aumento indesejado"
      icon: string          // "⚠️"
    }
  }
}

function PeriodSummary({ period, kpis }: PeriodSummaryProps) {
  return (
    <section className="period-summary">
      <SectionHeader
        icon="📊"
        title="RESUMO DO PERÍODO"
        subtitle={`Comparativo: ${formatDate(period.startDate)} → ${formatDate(period.endDate)} (${period.label})`}
      />
      
      <div className="kpi-grid">
        <KPICard
          label={kpis.ratio.label}
          value={`+${kpis.ratio.change.toFixed(2)}`}
          subvalue={`${kpis.ratio.startValue}→${kpis.ratio.endValue}`}
          status={kpis.ratio.status}
        />
        
        <KPICard
          label={kpis.score.label}
          value={`+${kpis.score.change}`}
          subvalue={`${kpis.score.startValue}→${kpis.score.endValue}`}
          status={kpis.score.status}
        />
        
        <KPICard
          label={kpis.bestEvolution.label}
          value={kpis.bestEvolution.metric}
          subvalue={`+${kpis.bestEvolution.change}cm (${kpis.bestEvolution.changePercent}%)`}
          status="positive"
        />
        
        <KPICard
          label={kpis.attention.label}
          value={kpis.attention.metric}
          subvalue={`+${kpis.attention.change}cm (${kpis.attention.changePercent}%)`}
          status="warning"
        />
      </div>
    </section>
  )
}
```

**KPI Card Individual:**

```typescript
interface KPICardProps {
  label: string
  value: string | number
  subvalue: string
  status: 'positive' | 'negative' | 'warning' | 'neutral'
  onClick?: () => void
}

const STATUS_STYLES = {
  positive: { color: '#10B981', icon: '🟢', bg: 'rgba(16,185,129,0.1)' },
  negative: { color: '#EF4444', icon: '🔴', bg: 'rgba(239,68,68,0.1)' },
  warning: { color: '#F59E0B', icon: '🟡', bg: 'rgba(245,158,11,0.1)' },
  neutral: { color: '#6B7280', icon: '⚪', bg: 'rgba(107,114,128,0.1)' },
}

function KPICard({ label, value, subvalue, status, onClick }: KPICardProps) {
  const styles = STATUS_STYLES[status]
  
  return (
    <div 
      className="kpi-card"
      style={{ borderColor: styles.color, backgroundColor: styles.bg }}
      onClick={onClick}
    >
      <span className="kpi-label">{label}</span>
      <span className="kpi-value" style={{ color: styles.color }}>{value}</span>
      <span className="kpi-subvalue">{subvalue}</span>
      <span className="kpi-status">{styles.icon}</span>
    </div>
  )
}
```

**Cálculo dos KPIs:**

```typescript
function calculatePeriodKPIs(
  measurements: Measurement[],
  period: Period
): PeriodKPIs {
  const firstMeasurement = measurements[0]
  const lastMeasurement = measurements[measurements.length - 1]
  
  // Ratio
  const ratioChange = lastMeasurement.ratio - firstMeasurement.ratio
  
  // Score
  const scoreChange = lastMeasurement.scoreTotal - firstMeasurement.scoreTotal
  
  // Melhor evolução (maior % positivo)
  const evolutions = calculateAllEvolutions(firstMeasurement, lastMeasurement)
  const bestEvolution = evolutions
    .filter(e => e.isPositiveDirection)
    .sort((a, b) => b.changePercent - a.changePercent)[0]
  
  // Atenção (maior % negativo ou indesejado)
  const attention = evolutions
    .filter(e => !e.isPositiveDirection && e.change !== 0)
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))[0]
  
  return {
    ratio: {
      label: 'SHAPE-V RATIO',
      startValue: firstMeasurement.ratio,
      endValue: lastMeasurement.ratio,
      change: ratioChange,
      changePercent: (ratioChange / firstMeasurement.ratio) * 100,
      status: ratioChange > 0 ? 'positive' : ratioChange < 0 ? 'negative' : 'neutral',
    },
    score: { /* ... */ },
    bestEvolution: { /* ... */ },
    attention: { /* ... */ },
  }
}
```

---

### 3.2 📈 Arquitetura Estética - Evolução Áurea (EXISTENTE + MELHORADO)

**Mantém:** Gráfico de linha da evolução do ratio com linha do ideal.

**Adiciona:** Seletor de múltiplas métricas para comparar no mesmo gráfico.

```
┌─────────────────────────────────────────────────────────────────┐
│  📈 ARQUITETURA ESTÉTICA                                        │
│  Convergência para o ideal das proporções clássicas             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ EVOLUÇÃO ÁUREA                                      1.602   ││
│  │ Convergência para proporção ideal (1.618)     +0.04 vs mês  ││
│  │                                                             ││
│  │ Métricas: ┌─────────────────────────────────────────────┐   ││
│  │           │ Shape-V (Ombro/Cintura) ▼ │ + Comparar     │   ││
│  │           └─────────────────────────────────────────────┘   ││
│  │                                                             ││
│  │  1.618 ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ IDEAL   ││
│  │        │                                              ●     ││
│  │        │                                         ●          ││
│  │        │                                    ●                ││
│  │        │                              ●                      ││
│  │        │                        ●                            ││
│  │        │                  ●                                  ││
│  │        │            ●                                        ││
│  │        │      ●                                              ││
│  │        ●                                                     ││
│  │        │                                                     ││
│  │       JAN    FEV    MAR    ABR    MAI    JUN                 ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Métricas disponíveis para comparar:                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ Ratio  │ │ Score  │ │ Ombros │ │Cintura │ │ Braço  │ ...    │
│  │   ●    │ │   ○    │ │   ○    │ │   ○    │ │   ○    │        │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Componente com Multi-métricas:**

```typescript
interface EvolutionChartProps {
  // Dados
  data: MeasurementPoint[]
  
  // Métricas selecionadas (máx 3)
  selectedMetrics: MetricConfig[]
  availableMetrics: MetricConfig[]
  onMetricsChange: (metrics: MetricConfig[]) => void
  
  // Config
  showIdealLine: boolean
  idealValue?: number
  
  // Interação
  onPointClick?: (point: MeasurementPoint) => void
}

interface MetricConfig {
  id: string              // 'ratio', 'score', 'ombros', etc.
  label: string           // 'Shape-V Ratio'
  color: string           // '#00C9A7'
  unit: string            // '' ou 'cm' ou 'pts'
  idealValue?: number     // 1.618 para ratio
  yAxisId: 'left' | 'right'
}

interface MeasurementPoint {
  date: Date
  values: Record<string, number>  // { ratio: 1.56, score: 80, ombros: 120 }
}

const AVAILABLE_METRICS: MetricConfig[] = [
  { id: 'ratio', label: 'Shape-V Ratio', color: '#00C9A7', unit: '', idealValue: 1.618, yAxisId: 'left' },
  { id: 'score', label: 'Score Geral', color: '#7C3AED', unit: 'pts', idealValue: 100, yAxisId: 'right' },
  { id: 'ombros', label: 'Ombros', color: '#3B82F6', unit: 'cm', yAxisId: 'right' },
  { id: 'cintura', label: 'Cintura', color: '#F59E0B', unit: 'cm', yAxisId: 'right' },
  { id: 'braco', label: 'Braço', color: '#EC4899', unit: 'cm', yAxisId: 'right' },
  { id: 'peitoral', label: 'Peitoral', color: '#8B5CF6', unit: 'cm', yAxisId: 'right' },
  { id: 'coxa', label: 'Coxa', color: '#06B6D4', unit: 'cm', yAxisId: 'right' },
  { id: 'panturrilha', label: 'Panturrilha', color: '#84CC16', unit: 'cm', yAxisId: 'right' },
]

function EvolutionChart({
  data,
  selectedMetrics,
  availableMetrics,
  onMetricsChange,
  showIdealLine,
  idealValue,
  onPointClick,
}: EvolutionChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<MeasurementPoint | null>(null)
  
  const handleAddMetric = (metric: MetricConfig) => {
    if (selectedMetrics.length < 3) {
      onMetricsChange([...selectedMetrics, metric])
    }
  }
  
  const handleRemoveMetric = (metricId: string) => {
    onMetricsChange(selectedMetrics.filter(m => m.id !== metricId))
  }
  
  return (
    <div className="evolution-chart">
      {/* Header com valor atual */}
      <div className="chart-header">
        <div>
          <h3>EVOLUÇÃO ÁUREA</h3>
          <p>Convergência para proporção ideal (1.618)</p>
        </div>
        <div className="current-value">
          <span className="value">{data[data.length - 1]?.values.ratio.toFixed(3)}</span>
          <span className="change positive">+0.04 vs mês</span>
        </div>
      </div>
      
      {/* Seletor de métricas */}
      <div className="metric-selector">
        <span>Métricas:</span>
        <div className="selected-metrics">
          {selectedMetrics.map(metric => (
            <Chip
              key={metric.id}
              label={metric.label}
              color={metric.color}
              onRemove={() => handleRemoveMetric(metric.id)}
            />
          ))}
          {selectedMetrics.length < 3 && (
            <AddMetricDropdown
              available={availableMetrics.filter(m => !selectedMetrics.find(s => s.id === m.id))}
              onAdd={handleAddMetric}
            />
          )}
        </div>
      </div>
      
      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(date, 'MMM')}
            stroke="rgba(255,255,255,0.5)"
          />
          <YAxis yAxisId="left" stroke="rgba(255,255,255,0.5)" />
          {selectedMetrics.some(m => m.yAxisId === 'right') && (
            <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Linha do ideal */}
          {showIdealLine && idealValue && (
            <ReferenceLine
              y={idealValue}
              yAxisId="left"
              stroke="#FFD700"
              strokeDasharray="5 5"
              label={{ value: 'IDEAL', fill: '#FFD700', fontSize: 10 }}
            />
          )}
          
          {/* Linhas das métricas */}
          {selectedMetrics.map(metric => (
            <Line
              key={metric.id}
              type="monotone"
              dataKey={`values.${metric.id}`}
              stroke={metric.color}
              strokeWidth={2}
              dot={{ fill: metric.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              yAxisId={metric.yAxisId}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Pills de métricas disponíveis */}
      <div className="available-metrics">
        <span>Adicionar:</span>
        {availableMetrics
          .filter(m => !selectedMetrics.find(s => s.id === m.id))
          .slice(0, 6)
          .map(metric => (
            <MetricPill
              key={metric.id}
              metric={metric}
              selected={false}
              onClick={() => handleAddMetric(metric)}
            />
          ))}
      </div>
    </div>
  )
}
```

**Tooltip Customizado:**

```typescript
function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  
  return (
    <div className="chart-tooltip">
      <p className="tooltip-date">{format(label, 'dd MMM yyyy')}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: <strong>{entry.value.toFixed(2)}</strong> {entry.unit}
        </p>
      ))}
    </div>
  )
}
```

---

### 3.3 🤖 Insight da IA - **NOVO**

**Objetivo:** Análise inteligente do período com interpretação dos dados.

```
┌─────────────────────────────────────────────────────────────────┐
│  🤖 ANÁLISE DO COACH IA                                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  "Excelente progresso nos últimos 6 meses, João!            ││
│  │                                                             ││
│  │   📈 Destaques Positivos:                                   ││
│  │   • Seu V-taper melhorou significativamente (+0.12 ratio)   ││
│  │   • Ombros foram sua melhor evolução (+5cm, 4.3%)           ││
│  │   • Score geral subiu de 72 para 80 pontos                  ││
│  │                                                             ││
│  │   ⚠️ Pontos de Atenção:                                     ││
│  │   • Cintura aumentou levemente (+1cm). Considere revisar    ││
│  │     a dieta ou aumentar atividade cardiovascular.           ││
│  │                                                             ││
│  │   🎯 Projeção:                                              ││
│  │   Se mantiver este ritmo, você atinge o Golden Ratio        ││
│  │   ideal (1.618) em aproximadamente 4 meses!                 ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Ver análise completa →]              Gerado há 2 horas        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Componente:**

```typescript
interface EvolutionInsightProps {
  insight: {
    summary: string
    highlights: {
      positive: string[]
      attention: string[]
    }
    projection?: string
    generatedAt: Date
  }
  onViewFullAnalysis: () => void
}

function EvolutionInsight({ insight, onViewFullAnalysis }: EvolutionInsightProps) {
  return (
    <section className="evolution-insight">
      <SectionHeader icon="🤖" title="ANÁLISE DO COACH IA" />
      
      <div className="insight-card glass-panel">
        <p className="insight-intro">{insight.summary}</p>
        
        {insight.highlights.positive.length > 0 && (
          <div className="insight-section">
            <h4>📈 Destaques Positivos:</h4>
            <ul>
              {insight.highlights.positive.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {insight.highlights.attention.length > 0 && (
          <div className="insight-section attention">
            <h4>⚠️ Pontos de Atenção:</h4>
            <ul>
              {insight.highlights.attention.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {insight.projection && (
          <div className="insight-section projection">
            <h4>🎯 Projeção:</h4>
            <p>{insight.projection}</p>
          </div>
        )}
      </div>
      
      <div className="insight-footer">
        <TextButton onClick={onViewFullAnalysis}>
          Ver análise completa →
        </TextButton>
        <span className="generated-at">
          Gerado {formatDistanceToNow(insight.generatedAt, { locale: ptBR, addSuffix: true })}
        </span>
      </div>
    </section>
  )
}
```

**Geração do Insight (Backend/IA):**

```typescript
async function generateEvolutionInsight(
  userId: string,
  period: Period,
  measurements: Measurement[]
): Promise<EvolutionInsight> {
  const analysis = analyzeEvolution(measurements)
  
  const prompt = `
    Você é o Coach IA do SHAPE-V analisando a evolução do usuário.
    
    ## DADOS DO PERÍODO (${period.label})
    - Medições: ${measurements.length}
    - Ratio: ${analysis.ratio.start} → ${analysis.ratio.end} (${analysis.ratio.change > 0 ? '+' : ''}${analysis.ratio.change.toFixed(2)})
    - Score: ${analysis.score.start} → ${analysis.score.end} (${analysis.score.change > 0 ? '+' : ''}${analysis.score.change})
    
    ## EVOLUÇÃO POR MÉTRICA
    ${analysis.metrics.map(m => `- ${m.name}: ${m.start}→${m.end}cm (${m.changePercent > 0 ? '+' : ''}${m.changePercent.toFixed(1)}%)`).join('\n')}
    
    ## INSTRUÇÕES
    Gere uma análise motivadora em português brasileiro:
    1. Resumo geral (1-2 frases)
    2. 2-3 destaques positivos (bullet points)
    3. 1-2 pontos de atenção se houver (bullet points)
    4. Projeção de quando atingirá o ideal (se aplicável)
    
    ## FORMATO JSON
    {
      "summary": "string",
      "highlights": {
        "positive": ["string"],
        "attention": ["string"]
      },
      "projection": "string"
    }
  `
  
  const response = await callAI(prompt)
  return {
    ...JSON.parse(response),
    generatedAt: new Date(),
  }
}
```

---

### 3.4 🏋️ Composição Corporal (EXISTENTE - MANTÉM)

**Mantém como está:** Dois cards lado a lado.

```
┌─────────────────────────────────────────────────────────────────┐
│  🏋️ COMPOSIÇÃO CORPORAL                                         │
│  Análise de peso, massa magra e percentual de gordura           │
│                                                                 │
│  ┌─────────────────────────────┐ ┌─────────────────────────────┐│
│  │ EVOLUÇÃO PESO               │ │ GORDURA CORPORAL %          ││
│  │            Todos ▼          │ │            Marinha ▼        ││
│  │                             │ │                             ││
│  │ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │ │                      -1.2%  ││
│  │ ─────────────────────────── │ │ ████████████████░░░░        ││
│  │ ══════════════════════════  │ │                             ││
│  │                      88.5kg │ │ 10.5%         Meta: 8.0%    ││
│  │                             │ │                             ││
│  │ ● Total  ● Magro  ● Gordo  │ │                             ││
│  └─────────────────────────────┘ └─────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.5 📏 Morfologia e Simetria (EXISTENTE + MELHORADO)

#### 3.5.1 Medidas Brutas (MANTÉM)

```
┌─────────────────────────────────────────────────────────────────┐
│  MEDIDAS BRUTAS                              PEITORAL ▼         │
│                                                                 │
│  │                                                       108cm  │
│  │                                               ████████       │
│  │                                       ████████               │
│  │                               ████████                       │
│  │                       ████████                               │
│  │               ████████                                       │
│  │       ████████                                               │
│  │███████                                                       │
│  └──────────────────────────────────────────────────────────────│
│       JAN       MAR       MAI       JUL                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.5.2 Scanner de Assimetrias (MELHORADO) - **MELHORADO**

**Antes:** Apenas barras simples.

**Depois:** Visualização mais clara com tabela, barras comparativas e recomendação.

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚖️ SCANNER DE ASSIMETRIAS                                      │
│  Monitoramento de equilíbrio bilateral                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  MÚSCULO      ESQUERDO   DIREITO   DIFERENÇA    STATUS     ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │                                                             ││
│  │  Braço        41.0 cm    44.5 cm    +3.5 cm      🔴        ││
│  │               ████████████████      ████████████████████    ││
│  │                                           8.5% assimetria   ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │                                                             ││
│  │  Coxa         62.0 cm    63.0 cm    +1.0 cm      🟢        ││
│  │               ████████████████████  █████████████████████   ││
│  │                                           1.6% simétrico    ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │                                                             ││
│  │  Panturrilha  38.5 cm    39.0 cm    +0.5 cm      🟢        ││
│  │               █████████████████████ █████████████████████   ││
│  │                                           1.3% simétrico    ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  💡 RECOMENDAÇÃO                                            ││
│  │                                                             ││
│  │  Assimetria significativa detectada nos braços (8.5%).      ││
│  │  Recomendamos:                                              ││
│  │  • Iniciar exercícios pelo lado esquerdo (mais fraco)       ││
│  │  • Usar exercícios unilaterais: rosca concentrada,          ││
│  │    rosca scott unilateral                                   ││
│  │  • Manter mesmo peso e reps para ambos os lados             ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  HISTÓRICO DE ASSIMETRIA (BRAÇOS)                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │      │ ■        ■                                           ││
│  │      │      ■        ■   ■                                  ││
│  │  10% │                        ■                              ││
│  │      │                             ■                         ││
│  │   5% │                                  ■   ■                ││
│  │      │                                                       ││
│  │   0% └────────────────────────────────────────              ││
│  │       JAN  FEV  MAR  ABR  MAI  JUN                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Componente:**

```typescript
interface AsymmetryScannerProps {
  data: AsymmetryData[]
  history: AsymmetryHistory[]
  recommendation: AsymmetryRecommendation | null
}

interface AsymmetryData {
  muscle: string              // 'braço', 'coxa', 'panturrilha'
  muscleLabel: string         // 'Braço'
  left: number                // 41.0
  right: number               // 44.5
  difference: number          // 3.5
  differencePercent: number   // 8.5
  dominantSide: 'left' | 'right' | 'equal'
  status: 'symmetric' | 'moderate' | 'asymmetric'
}

interface AsymmetryRecommendation {
  muscle: string
  severity: 'low' | 'medium' | 'high'
  message: string
  tips: string[]
}

const STATUS_CONFIG = {
  symmetric: { 
    color: '#10B981', 
    icon: '🟢', 
    label: 'simétrico',
    threshold: 3 
  },
  moderate: { 
    color: '#F59E0B', 
    icon: '🟡', 
    label: 'moderado',
    threshold: 5 
  },
  asymmetric: { 
    color: '#EF4444', 
    icon: '🔴', 
    label: 'assimetria',
    threshold: Infinity 
  },
}

function AsymmetryScanner({ data, history, recommendation }: AsymmetryScannerProps) {
  const [selectedMuscle, setSelectedMuscle] = useState(data[0]?.muscle)
  
  const worstAsymmetry = data.reduce((worst, current) => 
    current.differencePercent > worst.differencePercent ? current : worst
  , data[0])
  
  return (
    <section className="asymmetry-scanner">
      <SectionHeader
        icon="⚖️"
        title="SCANNER DE ASSIMETRIAS"
        subtitle="Monitoramento de equilíbrio bilateral"
      />
      
      {/* Tabela de assimetrias */}
      <div className="asymmetry-table glass-panel">
        <div className="table-header">
          <span>MÚSCULO</span>
          <span>ESQUERDO</span>
          <span>DIREITO</span>
          <span>DIFERENÇA</span>
          <span>STATUS</span>
        </div>
        
        {data.map(item => {
          const status = STATUS_CONFIG[item.status]
          const maxValue = Math.max(item.left, item.right)
          
          return (
            <div 
              key={item.muscle} 
              className={`table-row ${selectedMuscle === item.muscle ? 'selected' : ''}`}
              onClick={() => setSelectedMuscle(item.muscle)}
            >
              <span className="muscle-name">{item.muscleLabel}</span>
              
              <div className="value-cell">
                <span>{item.left.toFixed(1)} cm</span>
                <div className="bar-container">
                  <div 
                    className="bar left" 
                    style={{ 
                      width: `${(item.left / maxValue) * 100}%`,
                      backgroundColor: item.dominantSide === 'left' ? status.color : '#4B5563'
                    }} 
                  />
                </div>
              </div>
              
              <div className="value-cell">
                <span>{item.right.toFixed(1)} cm</span>
                <div className="bar-container">
                  <div 
                    className="bar right" 
                    style={{ 
                      width: `${(item.right / maxValue) * 100}%`,
                      backgroundColor: item.dominantSide === 'right' ? status.color : '#4B5563'
                    }} 
                  />
                </div>
              </div>
              
              <span className="difference" style={{ color: status.color }}>
                {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)} cm
              </span>
              
              <span className="status">
                {status.icon}
                <small>{item.differencePercent.toFixed(1)}% {status.label}</small>
              </span>
            </div>
          )
        })}
      </div>
      
      {/* Recomendação */}
      {recommendation && (
        <div className="recommendation-card glass-panel">
          <h4>💡 RECOMENDAÇÃO</h4>
          <p>{recommendation.message}</p>
          <ul>
            {recommendation.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Histórico de assimetria */}
      <div className="asymmetry-history glass-panel">
        <h4>HISTÓRICO DE ASSIMETRIA ({data.find(d => d.muscle === selectedMuscle)?.muscleLabel})</h4>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={history.filter(h => h.muscle === selectedMuscle)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" tickFormatter={d => format(d, 'MMM')} />
            <YAxis domain={[0, 15]} tickFormatter={v => `${v}%`} />
            <Area
              type="monotone"
              dataKey="differencePercent"
              stroke="#F59E0B"
              fill="rgba(245,158,11,0.2)"
            />
            <ReferenceLine y={5} stroke="#EF4444" strokeDasharray="3 3" />
            <ReferenceLine y={3} stroke="#10B981" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
```

**Lógica de Recomendação:**

```typescript
function generateAsymmetryRecommendation(data: AsymmetryData[]): AsymmetryRecommendation | null {
  const worst = data.reduce((w, c) => c.differencePercent > w.differencePercent ? c : w, data[0])
  
  if (worst.differencePercent < 3) {
    return null // Não precisa de recomendação
  }
  
  const weakerSide = worst.dominantSide === 'right' ? 'esquerdo' : 'direito'
  const strongerSide = worst.dominantSide === 'right' ? 'direito' : 'esquerdo'
  
  const exercises = UNILATERAL_EXERCISES[worst.muscle] || []
  
  return {
    muscle: worst.muscle,
    severity: worst.differencePercent > 7 ? 'high' : worst.differencePercent > 5 ? 'medium' : 'low',
    message: `Assimetria ${worst.differencePercent > 5 ? 'significativa' : 'moderada'} detectada nos ${worst.muscleLabel.toLowerCase()} (${worst.differencePercent.toFixed(1)}%).`,
    tips: [
      `Iniciar exercícios pelo lado ${weakerSide} (mais fraco)`,
      `Usar exercícios unilaterais: ${exercises.join(', ')}`,
      `Manter mesmo peso e repetições para ambos os lados`,
      worst.differencePercent > 7 ? `Considere 1-2 séries extras para o lado ${weakerSide}` : null,
    ].filter(Boolean) as string[],
  }
}

const UNILATERAL_EXERCISES = {
  braco: ['rosca concentrada', 'rosca scott unilateral', 'rosca martelo alternada'],
  coxa: ['leg press unilateral', 'afundo', 'step up'],
  panturrilha: ['elevação de panturrilha unilateral', 'panturrilha no leg press unilateral'],
}
```

---

### 3.6 📸 Comparativo Visual - **NOVO**

**Objetivo:** Comparação lado a lado do início vs atual do período.

```
┌─────────────────────────────────────────────────────────────────┐
│  📸 COMPARATIVO VISUAL                                          │
│  Veja sua transformação no período                              │
│                                                                 │
│  ┌───────────────────────────┐  ┌───────────────────────────┐  │
│  │        JANEIRO 2023       │  │        JUNHO 2023         │  │
│  │                           │  │                           │  │
│  │    ┌─────────────────┐    │  │    ┌─────────────────┐    │  │
│  │    │                 │    │  │    │                 │    │  │
│  │    │    Silhueta     │    │  │    │    Silhueta     │    │  │
│  │    │     corpo       │    │  │    │     corpo       │    │  │
│  │    │    (outline)    │    │  │    │    (outline)    │    │  │
│  │    │                 │    │  │    │                 │    │  │
│  │    └─────────────────┘    │  │    └─────────────────┘    │  │
│  │                           │  │                           │  │
│  │  ┌─────────────────────┐  │  │  ┌─────────────────────┐  │  │
│  │  │ Ombros     115 cm   │  │  │  │ Ombros     120 cm ↑│  │  │
│  │  │ Cintura     84 cm   │  │  │  │ Cintura     82 cm ↓│  │  │
│  │  │ Braço       38 cm   │  │  │  │ Braço       42 cm ↑│  │  │
│  │  │ Coxa        58 cm   │  │  │  │ Coxa        62 cm ↑│  │  │
│  │  │ ─────────────────── │  │  │  │ ─────────────────── │  │  │
│  │  │ Ratio      1.37     │  │  │  │ Ratio      1.46  ↑ │  │  │
│  │  │ Score        68     │  │  │  │ Score        80  ↑ │  │  │
│  │  └─────────────────────┘  │  │  └─────────────────────┘  │  │
│  │                           │  │                           │  │
│  └───────────────────────────┘  └───────────────────────────┘  │
│                                                                 │
│             ◀ [━━━━━━━━━━━━━●━━━━━━━━━━━━] ▶                   │
│                       Arrastar para comparar                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    RESUMO DA TRANSFORMAÇÃO                  ││
│  │                                                             ││
│  │   📅 Período: 6 meses (Jan→Jun 2023)                        ││
│  │   📏 Maior ganho: Ombros +5cm                               ││
│  │   📐 Melhoria no Ratio: +0.09 (6.6%)                        ││
│  │   🎯 Melhoria no Score: +12 pontos (17.6%)                  ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [📤 Compartilhar transformação]                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Componente:**

```typescript
interface VisualComparisonProps {
  before: ComparisonSnapshot
  after: ComparisonSnapshot
  summary: TransformationSummary
  onShare: () => void
}

interface ComparisonSnapshot {
  date: Date
  label: string               // "Janeiro 2023"
  silhouetteUrl?: string      // URL da silhueta/foto (se tiver)
  measurements: {
    ombros: number
    cintura: number
    braco: number
    coxa: number
    panturrilha: number
    peitoral: number
  }
  ratio: number
  score: number
}

interface TransformationSummary {
  periodLabel: string         // "6 meses"
  biggestGain: {
    metric: string
    change: number
  }
  ratioImprovement: {
    change: number
    changePercent: number
  }
  scoreImprovement: {
    change: number
    changePercent: number
  }
}

function VisualComparison({ before, after, summary, onShare }: VisualComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  
  const metrics = ['ombros', 'cintura', 'braco', 'coxa'] as const
  
  const getChangeIndicator = (beforeVal: number, afterVal: number, metric: string) => {
    const change = afterVal - beforeVal
    const isPositive = metric === 'cintura' ? change < 0 : change > 0
    
    if (change === 0) return { icon: '−', color: '#6B7280' }
    return {
      icon: change > 0 ? '↑' : '↓',
      color: isPositive ? '#10B981' : '#EF4444'
    }
  }
  
  return (
    <section className="visual-comparison">
      <SectionHeader
        icon="📸"
        title="COMPARATIVO VISUAL"
        subtitle="Veja sua transformação no período"
      />
      
      <div className="comparison-container">
        {/* Card Antes */}
        <div className="comparison-card before">
          <h3>{before.label}</h3>
          
          <div className="silhouette-container">
            {before.silhouetteUrl ? (
              <img src={before.silhouetteUrl} alt="Silhueta antes" />
            ) : (
              <BodyOutline measurements={before.measurements} />
            )}
          </div>
          
          <div className="metrics-list">
            {metrics.map(metric => (
              <div key={metric} className="metric-row">
                <span className="metric-label">{capitalize(metric)}</span>
                <span className="metric-value">{before.measurements[metric]} cm</span>
              </div>
            ))}
            <div className="metric-divider" />
            <div className="metric-row">
              <span className="metric-label">Ratio</span>
              <span className="metric-value">{before.ratio.toFixed(2)}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Score</span>
              <span className="metric-value">{before.score}</span>
            </div>
          </div>
        </div>
        
        {/* Card Depois */}
        <div className="comparison-card after">
          <h3>{after.label}</h3>
          
          <div className="silhouette-container">
            {after.silhouetteUrl ? (
              <img src={after.silhouetteUrl} alt="Silhueta atual" />
            ) : (
              <BodyOutline measurements={after.measurements} />
            )}
          </div>
          
          <div className="metrics-list">
            {metrics.map(metric => {
              const change = getChangeIndicator(
                before.measurements[metric],
                after.measurements[metric],
                metric
              )
              return (
                <div key={metric} className="metric-row">
                  <span className="metric-label">{capitalize(metric)}</span>
                  <span className="metric-value">
                    {after.measurements[metric]} cm
                    <span className="change-indicator" style={{ color: change.color }}>
                      {change.icon}
                    </span>
                  </span>
                </div>
              )
            })}
            <div className="metric-divider" />
            <div className="metric-row">
              <span className="metric-label">Ratio</span>
              <span className="metric-value">
                {after.ratio.toFixed(2)}
                <span className="change-indicator" style={{ color: '#10B981' }}>↑</span>
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Score</span>
              <span className="metric-value">
                {after.score}
                <span className="change-indicator" style={{ color: '#10B981' }}>↑</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slider de comparação (se tiver fotos) */}
      {before.silhouetteUrl && after.silhouetteUrl && (
        <div className="comparison-slider">
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
          />
          <span>Arrastar para comparar</span>
        </div>
      )}
      
      {/* Resumo da transformação */}
      <div className="transformation-summary glass-panel">
        <h4>RESUMO DA TRANSFORMAÇÃO</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="icon">📅</span>
            <span>Período: {summary.periodLabel}</span>
          </div>
          <div className="summary-item">
            <span className="icon">📏</span>
            <span>Maior ganho: {summary.biggestGain.metric} +{summary.biggestGain.change}cm</span>
          </div>
          <div className="summary-item">
            <span className="icon">📐</span>
            <span>Melhoria no Ratio: +{summary.ratioImprovement.change.toFixed(2)} ({summary.ratioImprovement.changePercent.toFixed(1)}%)</span>
          </div>
          <div className="summary-item">
            <span className="icon">🎯</span>
            <span>Melhoria no Score: +{summary.scoreImprovement.change} pontos ({summary.scoreImprovement.changePercent.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
      
      {/* Botão de compartilhar */}
      <Button variant="secondary" onClick={onShare} icon={<Share />}>
        Compartilhar transformação
      </Button>
    </section>
  )
}
```

**Componente de Silhueta (se não tiver foto):**

```typescript
interface BodyOutlineProps {
  measurements: {
    ombros: number
    cintura: number
    coxa: number
  }
}

function BodyOutline({ measurements }: BodyOutlineProps) {
  // Calcula proporções relativas para desenhar silhueta
  const maxWidth = 120 // pixels
  const scale = maxWidth / Math.max(measurements.ombros, measurements.coxa)
  
  const shoulderWidth = measurements.ombros * scale
  const waistWidth = measurements.cintura * scale
  const hipWidth = measurements.coxa * scale * 1.1 // Ajuste visual
  
  return (
    <svg viewBox="0 0 150 200" className="body-outline">
      {/* Cabeça */}
      <ellipse cx="75" cy="25" rx="15" ry="18" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Pescoço */}
      <line x1="75" y1="43" x2="75" y2="55" stroke="currentColor" strokeWidth="2" />
      
      {/* Ombros */}
      <path
        d={`M ${75 - shoulderWidth/2} 60 
            Q 75 55 ${75 + shoulderWidth/2} 60`}
        fill="none"
        stroke="#00C9A7"
        strokeWidth="3"
      />
      
      {/* Torso */}
      <path
        d={`M ${75 - shoulderWidth/2} 60 
            L ${75 - waistWidth/2} 120 
            L ${75 - hipWidth/2} 140
            L ${75 + hipWidth/2} 140
            L ${75 + waistWidth/2} 120
            L ${75 + shoulderWidth/2} 60`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      
      {/* Cintura highlight */}
      <line 
        x1={75 - waistWidth/2} y1="120" 
        x2={75 + waistWidth/2} y2="120" 
        stroke="#F59E0B" 
        strokeWidth="3" 
      />
      
      {/* Pernas */}
      <path
        d={`M ${75 - hipWidth/2} 140 L ${75 - 20} 195
            M ${75 + hipWidth/2} 140 L ${75 + 20} 195`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}
```

---

## 4. DADOS E API

### 4.1 Endpoint: GET /evolution

```typescript
// Request
GET /api/v1/evolution?period=6M&method=GOLDEN_RATIO

// Response
interface EvolutionResponse {
  period: {
    label: string
    startDate: string
    endDate: string
  }
  
  summary: PeriodSummary
  
  measurements: MeasurementPoint[]
  
  insight: EvolutionInsight
  
  bodyComposition: {
    weight: ChartPoint[]
    fatPercent: ChartPoint[]
  }
  
  rawMeasurements: {
    [metric: string]: ChartPoint[]
  }
  
  asymmetry: {
    current: AsymmetryData[]
    history: AsymmetryHistory[]
    recommendation: AsymmetryRecommendation | null
  }
  
  comparison: {
    before: ComparisonSnapshot
    after: ComparisonSnapshot
    summary: TransformationSummary
  }
}
```

### 4.2 Query Hook

```typescript
// hooks/queries/useEvolution.ts

export function useEvolution(period: Period, method: ProportionMethod) {
  return useQuery({
    queryKey: queryKeys.evolution(period, method),
    queryFn: () => api.evolution.get({ period, method }),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useEvolutionInsight(period: Period) {
  return useQuery({
    queryKey: queryKeys.evolution.insight(period),
    queryFn: () => api.evolution.getInsight(period),
    staleTime: 60 * 60 * 1000, // 1 hora (insight não muda frequentemente)
  })
}
```

---

## 5. INTERAÇÕES

### 5.1 Mapa de Interações

| Elemento | Ação | Resultado |
|----------|------|-----------|
| Filtro período | Click | Recarrega dados do período |
| Toggle Gráficos/Lista | Click | Alterna visualização |
| KPI Card | Click | Scroll para seção relacionada |
| Ponto no gráfico | Hover/Touch | Tooltip com valores |
| Ponto no gráfico | Click | Modal com detalhes da medição |
| Chip de métrica | Click | Adiciona/remove do gráfico |
| Linha da tabela assimetria | Click | Seleciona para ver histórico |
| Botão compartilhar | Click | Abre modal de compartilhamento |
| Ver análise completa | Click | Navega para /ai/analysis |

### 5.2 Gestos Mobile

| Gesto | Ação |
|-------|------|
| Swipe horizontal | Navegar entre períodos |
| Pinch | Zoom no gráfico |
| Long press | Selecionar ponto para detalhes |

---

## 6. ESTADOS

### 6.1 Loading

```
┌─────────────────────────────────────────────────────────────────┐
│  EVOLUÇÃO                               [░░░░░░] [░░░░░░░░░░]   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Erro

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          ⚠️                                     │
│                                                                 │
│           Não foi possível carregar os dados.                   │
│                                                                 │
│                    [Tentar novamente]                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Sem Dados Suficientes

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          📊                                     │
│                                                                 │
│           Você ainda não tem medições suficientes               │
│           para visualizar a evolução.                           │
│                                                                 │
│           Registre pelo menos 2 medições para                   │
│           começar a acompanhar seu progresso.                   │
│                                                                 │
│                    [Registrar medição]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. RESPONSIVIDADE

### 7.1 Mobile Layout

```
┌─────────────────────────┐
│ EVOLUÇÃO                │
│ [Gráficos][Lista]       │
│ [3M][6M][1A][TOTAL]     │
├─────────────────────────┤
│ 📊 RESUMO               │
│ ┌─────┐ ┌─────┐         │
│ │Ratio│ │Score│         │
│ └─────┘ └─────┘         │
│ ┌─────┐ ┌─────┐         │
│ │Best │ │Aten.│         │
│ └─────┘ └─────┘         │
├─────────────────────────┤
│ 📈 EVOLUÇÃO ÁUREA       │
│ [Gráfico full width]    │
│ [Chips de métricas]     │
├─────────────────────────┤
│ 🤖 INSIGHT IA           │
│ [Card texto]            │
├─────────────────────────┤
│ 🏋️ COMPOSIÇÃO           │
│ [Peso - full width]     │
│ [Gordura - full width]  │
├─────────────────────────┤
│ ⚖️ ASSIMETRIAS          │
│ [Cards empilhados]      │
├─────────────────────────┤
│ 📸 COMPARATIVO          │
│ [Antes]                 │
│ [Depois]                │
│ [Resumo]                │
└─────────────────────────┘
```

### 7.2 Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 640px (Mobile) | 1 coluna, cards empilhados |
| 640-1024px (Tablet) | 2 colunas para KPIs e composição |
| > 1024px (Desktop) | Layout original do protótipo |

---

## 8. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial da página Evolução |

---

**SHAPE-V Evolution Page**  
*Progresso • Tendências • Insights • Motivação*
