# SPEC: AI Coach - VITRU IA

## Documento de Especificação do Coach IA

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

O **Coach IA** é o diferencial competitivo do VITRU IA. Não somos apenas uma calculadora de proporções - somos um **coach virtual inteligente** que analisa, orienta e motiva o atleta em sua jornada para o físico ideal.

### 1.1 Missão do Coach IA

> "Transformar dados em insights acionáveis que ajudem o atleta a entender seu corpo, acompanhar seu progresso e tomar decisões informadas sobre treino e dieta."

### 1.2 Princípios do Coach IA

| Princípio | Descrição |
|-----------|-----------|
| **Personalizado** | Cada análise é única para o usuário |
| **Acionável** | Sempre termina com "o que fazer agora" |
| **Motivador** | Celebra vitórias, mesmo pequenas |
| **Honesto** | Aponta problemas sem ser desmotivador |
| **Educativo** | Explica o "porquê" das recomendações |
| **Contextual** | Considera histórico, metas e preferências |

### 1.3 Capacidades do Coach IA

```
┌─────────────────────────────────────────────────────────────────┐
│                        COACH IA VITRU IA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 ANÁLISE           📈 EVOLUÇÃO          🎯 RECOMENDAÇÕES     │
│  • Proporções         • Tendências         • Treino            │
│  • Simetria           • Comparativos       • Dieta             │
│  • Estética           • Projeções          • Prioridades       │
│  • Diagnóstico        • Marcos             • Metas             │
│                                                                 │
│  💬 COMUNICAÇÃO       🏆 MOTIVAÇÃO         ⚠️ ALERTAS          │
│  • Insights diários   • Conquistas         • Assimetrias       │
│  • Relatórios         • Streaks            • Regressões        │
│  • Respostas          • Celebrações        • Inconsistências   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Pipeline de Processamento

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   DADOS DO   │────▶│  ANÁLISE E   │────▶│   GERAÇÃO    │
│   USUÁRIO    │     │  CÁLCULOS    │     │  DE TEXTO    │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
  • Medidas            • Scores            • Templates
  • Histórico          • Tendências        • LLM (GPT-4)
  • Metas              • Gaps              • Personalização
  • Preferências       • Alertas           • Tom de voz
```

### 2.2 Componentes

```typescript
// Estrutura do sistema de IA

interface AICoachSystem {
  // Analisadores
  analyzers: {
    proportions: ProportionAnalyzer      // Analisa proporções vs ideais
    symmetry: SymmetryAnalyzer           // Analisa simetria bilateral
    evolution: EvolutionAnalyzer         // Analisa tendências temporais
    aesthetic: AestheticAnalyzer         // Diagnóstico estético geral
  }
  
  // Geradores de conteúdo
  generators: {
    insights: InsightGenerator           // Gera insights diários
    reports: ReportGenerator             // Gera relatórios semanais
    recommendations: RecommendationGenerator  // Gera recomendações
    alerts: AlertGenerator               // Gera alertas
  }
  
  // Personalizador
  personalizer: {
    tone: ToneAdapter                    // Adapta tom de voz
    context: ContextBuilder              // Constrói contexto
    history: HistoryManager              // Gerencia histórico
  }
}
```

---

## 3. TIPOS DE ANÁLISE

### 3.1 Análise de Proporções

**Objetivo:** Avaliar quão próximo o usuário está das proporções ideais.

```typescript
interface ProportionAnalysis {
  method: ProportionMethod              // Golden Ratio, Classic, Men's
  
  // Score geral
  overallScore: number                  // 0-100
  classification: ScoreClassification   // ELITE, AVANÇADO, etc.
  
  // Por proporção (as 9)
  proportions: Array<{
    id: string                          // 'ombros', 'peitoral', etc.
    nome: string                        // 'Ombros (V-Taper)'
    atual: number                       // 120 cm
    ideal: number                       // 132.7 cm
    score: number                       // 0-100
    gap: number                         // -12.7 cm
    gapPercent: number                  // -9.6%
    status: 'excellent' | 'good' | 'attention' | 'critical'
    priority: number                    // 1-9 (prioridade de foco)
  }>
  
  // Insights gerados
  insights: {
    strengths: string[]                 // Pontos fortes
    weaknesses: string[]                // Pontos a melhorar
    focus: string                       // Foco recomendado
  }
}
```

**Prompt Template para Análise de Proporções:**

```typescript
const PROPORTION_ANALYSIS_PROMPT = `
Você é o Coach IA do VITRU IA, especialista em análise de proporções corporais.

## CONTEXTO DO USUÁRIO
- Nome: {{userName}}
- Método preferido: {{preferredMethod}}
- Objetivo: {{userGoal}}
- Nível: {{userLevel}}

## MEDIDAS ATUAIS
{{currentMeasurements}}

## PROPORÇÕES CALCULADAS
{{proportionScores}}

## HISTÓRICO (últimos 3 meses)
{{measurementHistory}}

## INSTRUÇÕES
Analise as proporções do usuário e gere:

1. **DIAGNÓSTICO GERAL** (2-3 frases)
   - Status atual vs ideal
   - Principal destaque positivo
   - Principal ponto de atenção

2. **PONTOS FORTES** (lista de 2-3 itens)
   - Quais proporções estão boas ou excelentes
   - Por que isso é positivo

3. **PONTOS DE ATENÇÃO** (lista de 2-3 itens)
   - Quais proporções precisam de foco
   - Quanto falta para o ideal

4. **RECOMENDAÇÃO PRINCIPAL** (1 frase acionável)
   - O que o usuário deve focar AGORA
   - Seja específico (ex: "deltóide lateral" não apenas "ombros")

## TOM DE VOZ
- Motivador mas honesto
- Técnico mas acessível
- Personalizado (use o nome do usuário)
- Sempre termine com encorajamento

## FORMATO
Responda em JSON:
{
  "diagnostico": "string",
  "pontosFortes": ["string"],
  "pontosAtencao": ["string"],
  "recomendacao": "string",
  "motivacao": "string"
}
`
```

---

### 3.2 Análise de Simetria

**Objetivo:** Identificar e quantificar assimetrias bilaterais.

```typescript
interface SymmetryAnalysis {
  // Score geral de simetria
  overallScore: number                  // 0-100 (100 = perfeitamente simétrico)
  grade: Grade                          // A+, A, B, C, D, E
  
  // Por grupo muscular
  muscles: Array<{
    muscle: string                      // 'braço', 'coxa', 'panturrilha'
    left: number                        // 41.0 cm
    right: number                       // 44.5 cm
    difference: number                  // 3.5 cm
    differencePercent: number           // 8.5%
    dominantSide: 'left' | 'right' | 'equal'
    status: 'symmetric' | 'moderate' | 'asymmetric'
    concern: boolean                    // true se > 5%
  }>
  
  // Análise
  analysis: {
    worstAsymmetry: string              // Qual músculo tem maior assimetria
    pattern: string                     // "Dominância direita consistente"
    possibleCauses: string[]            // Possíveis causas
    recommendations: string[]           // Recomendações específicas
  }
}
```

**Thresholds de Simetria:**

| Status | Diferença | Ação Recomendada |
|--------|-----------|------------------|
| symmetric | < 3% | Manter equilíbrio |
| moderate | 3-5% | Monitorar, ajustes leves |
| asymmetric | > 5% | Foco em correção, exercícios unilaterais |

**Prompt Template para Análise de Simetria:**

```typescript
const SYMMETRY_ANALYSIS_PROMPT = `
Você é o Coach IA do VITRU IA, especialista em simetria corporal.

## DADOS DE SIMETRIA
{{symmetryData}}

## HISTÓRICO DE SIMETRIA
{{symmetryHistory}}

## INSTRUÇÕES
Analise a simetria bilateral do usuário:

1. **STATUS GERAL**
   - Classificação (Excelente/Boa/Moderada/Preocupante)
   - Padrão observado (ex: dominância direita)

2. **ASSIMETRIAS IDENTIFICADAS**
   - Liste cada assimetria > 3%
   - Indique o lado dominante
   - Classifique a severidade

3. **POSSÍVEIS CAUSAS**
   - Sugira causas comuns (trabalho, esporte, lesão antiga)

4. **PLANO DE CORREÇÃO**
   - Exercícios unilaterais recomendados
   - Qual lado iniciar o exercício
   - Frequência sugerida

## TOM
- Não alarmista
- Educativo
- Prático

## FORMATO JSON
{
  "statusGeral": "string",
  "padrao": "string",
  "assimetrias": [{"musculo": "string", "diferenca": "string", "severidade": "string"}],
  "causasPossiveis": ["string"],
  "planoCorrecao": ["string"]
}
`
```

---

### 3.3 Análise de Evolução

**Objetivo:** Identificar tendências e projetar progresso futuro.

```typescript
interface EvolutionAnalysis {
  period: '7d' | '30d' | '90d' | '180d' | '1y'
  
  // Tendência geral
  trend: 'improving' | 'stable' | 'declining'
  trendScore: number                    // -100 a +100
  
  // Por métrica
  metrics: Array<{
    metric: string                      // 'ombros', 'cintura', 'scoreTotal'
    startValue: number
    endValue: number
    change: number
    changePercent: number
    trend: 'up' | 'down' | 'stable'
    isPositive: boolean                 // up é bom para ombros, ruim para cintura
    velocity: number                    // cm/mês ou pontos/mês
    projection30d: number               // projeção para 30 dias
  }>
  
  // Marcos atingidos
  milestones: Array<{
    date: Date
    description: string                 // "Atingiu ratio 1.5"
    type: 'proportion' | 'measurement' | 'score' | 'consistency'
  }>
  
  // Análise
  analysis: {
    bestProgress: string                // Métrica com melhor evolução
    needsAttention: string              // Métrica estagnada ou regredindo
    consistency: number                 // 0-100 (frequência de medições)
    projectedGoalDate: Date | null      // Quando atingirá a meta
  }
}
```

**Prompt Template para Análise de Evolução:**

```typescript
const EVOLUTION_ANALYSIS_PROMPT = `
Você é o Coach IA do VITRU IA, especialista em análise de progresso.

## DADOS DE EVOLUÇÃO ({{period}})
{{evolutionData}}

## METAS DO USUÁRIO
{{userGoals}}

## FREQUÊNCIA DE MEDIÇÕES
{{measurementFrequency}}

## INSTRUÇÕES
Analise a evolução do usuário:

1. **RESUMO DO PERÍODO**
   - Tendência geral (melhorando/estável/regredindo)
   - Principal conquista do período
   - Principal desafio

2. **DESTAQUES POSITIVOS**
   - Métricas que mais evoluíram
   - Celebre o progresso (mesmo pequeno)

3. **PONTOS DE ATENÇÃO**
   - Métricas estagnadas ou regredindo
   - Possíveis causas

4. **PROJEÇÃO**
   - Se mantiver o ritmo, quando atingirá a meta?
   - O que pode acelerar o progresso?

5. **CONSISTÊNCIA**
   - Avalie a frequência de medições
   - Sugira melhorias se necessário

## TOM
- Celebratório para conquistas
- Construtivo para desafios
- Baseado em dados, não achismos

## FORMATO JSON
{
  "resumo": "string",
  "tendencia": "improving|stable|declining",
  "destaquesPositivos": ["string"],
  "pontosAtencao": ["string"],
  "projecao": "string",
  "consistencia": "string",
  "motivacao": "string"
}
`
```

---

### 3.4 Diagnóstico Estético

**Objetivo:** Avaliação visual geral do físico do atleta.

```typescript
interface AestheticDiagnosis {
  // Classificação geral
  bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | 'mixed'
  aestheticScore: number                // 0-100
  grade: Grade
  
  // Avaliações específicas
  assessments: {
    vTaper: {
      score: number
      ratio: number                     // ombro/cintura
      classification: 'narrow' | 'moderate' | 'wide' | 'extreme'
      description: string
    }
    
    waist: {
      score: number
      ratio: number                     // cintura/altura
      classification: 'tight' | 'athletic' | 'average' | 'wide'
      description: string
    }
    
    armBalance: {
      score: number
      ratio: number                     // bíceps/antebraço
      classification: 'balanced' | 'bicep_dominant' | 'forearm_dominant'
      description: string
    }
    
    legBalance: {
      score: number
      ratio: number                     // coxa/panturrilha
      classification: 'balanced' | 'quad_dominant' | 'calf_dominant'
      description: string
    }
    
    triad: {
      score: number
      values: { neck: number, arm: number, calf: number }
      classification: 'harmonious' | 'imbalanced'
      description: string
    }
  }
  
  // Diagnóstico textual
  diagnosis: {
    summary: string                     // Resumo em 2-3 frases
    strengths: string[]                 // Pontos fortes estéticos
    improvements: string[]              // O que melhorar
    bodyTypeAdvice: string              // Conselho baseado no biotipo
    competitionCategory: string         // Categoria sugerida (se aplicável)
  }
}
```

**Prompt Template para Diagnóstico Estético:**

```typescript
const AESTHETIC_DIAGNOSIS_PROMPT = `
Você é o Coach IA do VITRU IA, especialista em estética corporal e fisiculturismo.

## DADOS DO USUÁRIO
- Altura: {{altura}} cm
- Peso: {{peso}} kg
- Gordura corporal: {{gordura}}%

## PROPORÇÕES ATUAIS
{{proportions}}

## RATIOS CALCULADOS
- V-Taper (ombro/cintura): {{vTaperRatio}}
- Cintura/Altura: {{waistHeightRatio}}
- Tríade: Pescoço {{neck}} / Braço {{arm}} / Panturrilha {{calf}}

## MÉTODO PREFERIDO
{{preferredMethod}}

## INSTRUÇÕES
Faça um diagnóstico estético completo:

1. **BIOTIPO**
   - Classifique o biotipo (ecto/meso/endo/misto)
   - Explique as características observadas

2. **V-TAPER**
   - Avalie a proporção ombro/cintura
   - Compare com o ideal do método escolhido
   - Dê nota e classificação

3. **HARMONIA GERAL**
   - Avalie o equilíbrio entre partes superiores e inferiores
   - Identifique grupos dominantes ou deficientes

4. **TRÍADE (Pescoço/Braço/Panturrilha)**
   - Avalie a harmonia entre os três
   - Identifique qual está defasado

5. **CATEGORIA SUGERIDA**
   - Baseado no físico, qual categoria de competição seria ideal?
   - Golden Ratio / Classic Physique / Men's Physique

6. **PLANO DE AÇÃO**
   - Top 3 prioridades para melhorar a estética

## TOM
- Técnico e preciso
- Objetivo mas encorajador
- Use termos de fisiculturismo quando apropriado

## FORMATO JSON
{
  "biotipo": "string",
  "biotipoDescricao": "string",
  "vTaper": {"nota": number, "classificacao": "string", "analise": "string"},
  "harmonia": "string",
  "triade": {"nota": number, "analise": "string"},
  "categoriaSugerida": "string",
  "categoriaJustificativa": "string",
  "prioridades": ["string", "string", "string"],
  "resumoFinal": "string"
}
`
```

---

## 4. GERAÇÃO DE INSIGHTS

### 4.1 Tipos de Insights

```typescript
type InsightType = 
  | 'progress'          // Progresso positivo
  | 'achievement'       // Conquista/marco atingido
  | 'warning'           // Alerta de regressão ou problema
  | 'tip'               // Dica de treino/dieta
  | 'motivation'        // Mensagem motivacional
  | 'reminder'          // Lembrete (medir, etc.)
  | 'comparison'        // Comparativo (vs mês passado, vs ideal)
  | 'projection'        // Projeção de quando atingirá meta
  | 'education'         // Conteúdo educativo

interface Insight {
  id: string
  type: InsightType
  priority: 'high' | 'medium' | 'low'
  
  // Conteúdo
  title: string                         // "Seus ombros estão evoluindo!"
  message: string                       // Texto completo
  shortMessage?: string                 // Versão curta para cards
  
  // Metadata
  metric?: string                       // Métrica relacionada
  value?: number                        // Valor relacionado
  change?: number                       // Mudança relacionada
  
  // Visual
  icon: string                          // Emoji ou ícone
  color: string                         // Cor do card
  
  // Ação
  action?: {
    label: string                       // "Ver detalhes"
    href: string                        // "/evolution/ombros"
  }
  
  // Controle
  dismissible: boolean
  expiresAt?: Date
  createdAt: Date
}
```

### 4.2 Engine de Geração de Insights

```typescript
class InsightGenerator {
  
  async generateDailyInsights(userId: string): Promise<Insight[]> {
    const userData = await this.getUserData(userId)
    const insights: Insight[] = []
    
    // 1. CONQUISTAS (prioridade máxima)
    const achievements = this.checkAchievements(userData)
    insights.push(...achievements.map(a => this.createAchievementInsight(a)))
    
    // 2. ALERTAS (prioridade alta)
    const alerts = this.checkAlerts(userData)
    insights.push(...alerts.map(a => this.createAlertInsight(a)))
    
    // 3. PROGRESSO (prioridade média)
    const progress = this.analyzeProgress(userData)
    if (progress.hasSignificantProgress) {
      insights.push(this.createProgressInsight(progress))
    }
    
    // 4. DICAS (prioridade média)
    const tip = await this.generatePersonalizedTip(userData)
    insights.push(tip)
    
    // 5. LEMBRETES (prioridade baixa)
    const reminders = this.checkReminders(userData)
    insights.push(...reminders)
    
    // 6. MOTIVAÇÃO (sempre incluir pelo menos uma)
    if (!insights.some(i => i.type === 'motivation')) {
      insights.push(await this.generateMotivation(userData))
    }
    
    // Ordenar por prioridade e limitar
    return this.prioritizeAndLimit(insights, userData.isPro ? 10 : 3)
  }
  
  private checkAchievements(userData: UserData): Achievement[] {
    const { latestMeasurement, previousMeasurement, scores } = userData
    const achievements: Achievement[] = []
    
    // Verificar marcos de ratio
    const ratioMilestones = [1.3, 1.4, 1.5, 1.55, 1.6, 1.618]
    for (const milestone of ratioMilestones) {
      if (scores.ratio >= milestone && 
          (!previousMeasurement || previousMeasurement.ratio < milestone)) {
        achievements.push({
          type: 'ratio_milestone',
          value: milestone,
          message: `Você atingiu o ratio ${milestone}!`
        })
      }
    }
    
    // Verificar marcos de score
    const scoreMilestones = [60, 70, 80, 85, 90, 95]
    for (const milestone of scoreMilestones) {
      if (scores.scoreTotal >= milestone &&
          (!previousMeasurement || previousMeasurement.scoreTotal < milestone)) {
        achievements.push({
          type: 'score_milestone',
          value: milestone,
          message: `Você atingiu ${milestone} pontos!`
        })
      }
    }
    
    // Verificar medidas no ideal
    for (const prop of scores.proportions) {
      if (prop.score >= 95 && prop.previousScore < 95) {
        achievements.push({
          type: 'proportion_ideal',
          metric: prop.id,
          message: `Seu ${prop.nome} atingiu o ideal!`
        })
      }
    }
    
    return achievements
  }
  
  private checkAlerts(userData: UserData): Alert[] {
    const alerts: Alert[] = []
    const { latestMeasurement, previousMeasurement, daysSinceLastMeasurement } = userData
    
    // Alerta de medição atrasada
    if (daysSinceLastMeasurement > 14) {
      alerts.push({
        type: 'measurement_overdue',
        priority: 'high',
        message: `Já se passaram ${daysSinceLastMeasurement} dias desde sua última medição.`
      })
    }
    
    // Alerta de regressão
    if (previousMeasurement) {
      const regressions = this.findRegressions(latestMeasurement, previousMeasurement)
      for (const regression of regressions) {
        if (regression.changePercent < -5) {
          alerts.push({
            type: 'regression',
            priority: 'medium',
            metric: regression.metric,
            message: `Sua ${regression.metric} diminuiu ${Math.abs(regression.change)}cm.`
          })
        }
      }
    }
    
    // Alerta de assimetria
    const asymmetries = this.findAsymmetries(latestMeasurement)
    for (const asymmetry of asymmetries) {
      if (asymmetry.differencePercent > 7) {
        alerts.push({
          type: 'asymmetry',
          priority: 'medium',
          metric: asymmetry.muscle,
          message: `Assimetria de ${asymmetry.differencePercent.toFixed(1)}% detectada nos ${asymmetry.muscle}.`
        })
      }
    }
    
    return alerts
  }
}
```

### 4.3 Templates de Insights por Tipo

```typescript
const INSIGHT_TEMPLATES = {
  // PROGRESSO
  progress: {
    significant: [
      "🚀 {{metric}} em alta! +{{change}}cm no último mês.",
      "📈 Seu {{metric}} cresceu {{changePercent}}%! Continue assim!",
      "💪 Evolução consistente: {{metric}} de {{previous}} para {{current}}cm.",
    ],
    moderate: [
      "👍 Progresso estável em {{metric}}: +{{change}}cm.",
      "📊 {{metric}} evoluindo gradualmente. Paciência!",
    ],
  },
  
  // CONQUISTAS
  achievement: {
    ratio: [
      "🏆 MARCO ATINGIDO! Seu ratio chegou a {{value}}!",
      "⭐ Parabéns! Você desbloqueou o ratio {{value}}!",
      "🎯 Ratio {{value}} conquistado! Rumo ao Golden!",
    ],
    score: [
      "🥇 Você atingiu {{value}} pontos! Nível {{classification}}!",
      "🌟 Score {{value}}! Você está no top!",
    ],
    proportion: [
      "✨ Seu {{metric}} atingiu a proporção ideal!",
      "🎉 {{metric}} perfeito! Proporção Golden alcançada!",
    ],
  },
  
  // ALERTAS
  warning: {
    regression: [
      "⚠️ Atenção: {{metric}} diminuiu {{change}}cm.",
      "📉 {{metric}} em queda. Vamos reverter isso!",
    ],
    asymmetry: [
      "⚖️ Assimetria detectada: {{muscle}} com {{difference}}cm de diferença.",
      "🔍 Lado {{dominantSide}} dominante em {{muscle}}. Considere exercícios unilaterais.",
    ],
    overdue: [
      "📏 Hora de medir! Última medição há {{days}} dias.",
      "⏰ Não perca o ritmo! Registre suas medidas.",
    ],
  },
  
  // DICAS
  tip: {
    training: [
      "💡 Dica: Para melhorar {{metric}}, foque em {{exercise}}.",
      "🏋️ Sugestão: {{exercise}} 3x por semana para {{metric}}.",
    ],
    diet: [
      "🥗 Para definir {{metric}}, mantenha déficit calórico leve.",
      "💧 Hidratação ajuda na definição muscular!",
    ],
    general: [
      "📝 Medir sempre no mesmo horário aumenta a precisão.",
      "😴 Descanso é parte do treino. 7-9h de sono por noite.",
    ],
  },
  
  // MOTIVAÇÃO
  motivation: {
    general: [
      "🔥 Você está no caminho certo! Continue!",
      "💪 Consistência é a chave. Você está indo bem!",
      "🌟 Cada medição é um passo rumo ao seu objetivo!",
      "🎯 Foco no processo, os resultados virão!",
    ],
    specific: [
      "🏆 Faltam apenas {{gap}}cm nos {{metric}} para o ideal!",
      "📈 No ritmo atual, você atinge sua meta em {{days}} dias!",
      "⭐ Seu {{metric}} já está melhor que {{percentile}}% dos usuários!",
    ],
  },
  
  // EDUCATIVO
  education: {
    proportion: [
      "📚 Você sabia? A proporção áurea (1.618) aparece na natureza e na arte.",
      "🧠 O V-taper ideal é quando os ombros são 1.618x a cintura.",
    ],
    training: [
      "📖 Dica de treino: Exercícios compostos constroem mais massa.",
      "💡 Progressão de carga: aumente 2-5% por semana.",
    ],
  },
}
```

---

## 5. RELATÓRIOS

### 5.1 Relatório Semanal

```typescript
interface WeeklyReport {
  // Período
  weekStart: Date
  weekEnd: Date
  
  // Resumo executivo
  summary: {
    title: string                       // "SIMETRIA DO FÍSICO PERFEITO"
    headline: string                    // Frase de destaque
    overallTrend: 'improving' | 'stable' | 'declining'
  }
  
  // Métricas da semana
  metrics: {
    measurementsTaken: number           // Quantas medições
    scoreChange: number                 // Mudança no score
    ratioChange: number                 // Mudança no ratio
    bestImprovement: { metric: string, change: number }
    needsAttention: { metric: string, reason: string }
  }
  
  // Análise da IA
  aiAnalysis: {
    strengths: string[]                 // O que está bom
    improvements: string[]              // O que melhorar
    focus: string                       // Foco da próxima semana
    prediction: string                  // Projeção
  }
  
  // Conquistas da semana
  achievements: Achievement[]
  
  // Plano para próxima semana
  nextWeekPlan: {
    priority1: string
    priority2: string
    priority3: string
    reminder: string
  }
}
```

**Prompt para Relatório Semanal:**

```typescript
const WEEKLY_REPORT_PROMPT = `
Você é o Coach IA do VITRU IA gerando o relatório semanal.

## DADOS DA SEMANA
- Período: {{weekStart}} a {{weekEnd}}
- Medições realizadas: {{measurementCount}}
- Score inicial: {{scoreStart}} → Score final: {{scoreEnd}}
- Ratio inicial: {{ratioStart}} → Ratio final: {{ratioEnd}}

## EVOLUÇÃO POR MÉTRICA
{{metricsEvolution}}

## METAS DO USUÁRIO
{{userGoals}}

## CONQUISTAS DA SEMANA
{{achievements}}

## INSTRUÇÕES
Gere um relatório semanal motivador e acionável:

1. **TÍTULO IMPACTANTE**
   - Uma frase que resuma a semana
   - Positivo se houve progresso
   - Construtivo se houve desafios

2. **RESUMO EXECUTIVO** (2-3 frases)
   - O que aconteceu de mais importante
   - Número-chave da semana

3. **DESTAQUES POSITIVOS** (2-3 itens)
   - Celebre as vitórias
   - Seja específico com números

4. **PONTOS DE ATENÇÃO** (1-2 itens)
   - O que precisa de foco
   - Sem ser alarmista

5. **PLANO PARA PRÓXIMA SEMANA**
   - 3 prioridades claras e acionáveis
   - Específicas, não genéricas

6. **MENSAGEM FINAL**
   - Motivação personalizada
   - Encorajamento para continuar

## TOM
- Celebratório mas realista
- Coach de elite conversando com atleta
- Usa dados para embasar

## FORMATO JSON
{
  "titulo": "string",
  "resumo": "string",
  "destaquesPositivos": ["string"],
  "pontosAtencao": ["string"],
  "planoProximaSemana": {
    "prioridade1": "string",
    "prioridade2": "string",
    "prioridade3": "string"
  },
  "mensagemFinal": "string"
}
`
```

### 5.2 Relatório Mensal (PRO)

```typescript
interface MonthlyReport {
  // Período
  month: string                         // "Janeiro 2026"
  
  // Métricas do mês
  summary: {
    measurementsTaken: number
    averageScore: number
    scoreChange: number
    ratioChange: number
    consistencyScore: number            // 0-100
  }
  
  // Gráficos de evolução
  charts: {
    scoreEvolution: ChartData
    ratioEvolution: ChartData
    measurementsEvolution: ChartData
    bodyComposition: ChartData
  }
  
  // Comparativo
  comparison: {
    vsLastMonth: ComparisonData
    vsThreeMonthsAgo: ComparisonData
    vsBestMonth: ComparisonData
  }
  
  // Análise profunda
  deepAnalysis: {
    bodyTypeAnalysis: string
    proportionAnalysis: string
    symmetryAnalysis: string
    progressionRate: string
    plateauRisk: string
  }
  
  // Projeções
  projections: {
    nextMonthPrediction: string
    goalAchievementDate: Date | null
    recommendedAdjustments: string[]
  }
}
```

---

## 6. RECOMENDAÇÕES PERSONALIZADAS

### 6.1 Sistema de Recomendações

```typescript
interface RecommendationEngine {
  // Gera recomendações baseadas no contexto
  generateRecommendations(context: UserContext): Recommendation[]
}

interface Recommendation {
  id: string
  type: 'training' | 'diet' | 'recovery' | 'measurement' | 'goal'
  priority: 'high' | 'medium' | 'low'
  
  // Conteúdo
  title: string
  description: string
  rationale: string                     // Por que esta recomendação
  
  // Detalhes (para treino)
  training?: {
    muscleGroup: string
    exercises: string[]
    sets: string
    reps: string
    frequency: string
  }
  
  // Detalhes (para dieta)
  diet?: {
    focus: 'bulk' | 'cut' | 'maintain'
    calorieAdjustment: string
    macroFocus: string
    tips: string[]
  }
  
  // Ação
  action?: {
    label: string
    href: string
  }
}
```

### 6.2 Lógica de Recomendações

```typescript
function generateTrainingRecommendations(
  userData: UserData
): TrainingRecommendation[] {
  const recommendations: TrainingRecommendation[] = []
  const { scores, symmetry, goals } = userData
  
  // 1. Baseado no maior gap de proporção
  const biggestGap = findBiggestGap(scores.proportions)
  recommendations.push({
    priority: 'high',
    title: `Foco em ${biggestGap.nome}`,
    description: `Seu ${biggestGap.nome} está ${biggestGap.gapPercent}% abaixo do ideal.`,
    training: getTrainingPlan(biggestGap.id),
  })
  
  // 2. Baseado em assimetria
  const worstAsymmetry = findWorstAsymmetry(symmetry)
  if (worstAsymmetry && worstAsymmetry.differencePercent > 5) {
    recommendations.push({
      priority: 'high',
      title: `Corrigir assimetria em ${worstAsymmetry.muscle}`,
      description: `Diferença de ${worstAsymmetry.difference}cm entre lados.`,
      training: getUnilateralPlan(worstAsymmetry.muscle, worstAsymmetry.dominantSide),
    })
  }
  
  // 3. Baseado na meta ativa
  const activeGoal = goals.find(g => g.status === 'IN_PROGRESS')
  if (activeGoal) {
    recommendations.push({
      priority: 'medium',
      title: `Acelerar progresso em ${activeGoal.targetMetric}`,
      description: `Faltam ${activeGoal.targetValue - activeGoal.currentValue}cm para sua meta.`,
      training: getIntensifiedPlan(activeGoal.targetMetric),
    })
  }
  
  return recommendations
}

// Mapeamento de exercícios por grupo muscular
const EXERCISE_DATABASE = {
  ombros: {
    primary: ['Desenvolvimento militar', 'Elevação lateral', 'Elevação frontal'],
    secondary: ['Face pull', 'Remada alta'],
    tips: ['Foque na porção lateral para aumentar largura', 'Use drop sets nas elevações laterais'],
  },
  peitoral: {
    primary: ['Supino reto', 'Supino inclinado', 'Crucifixo'],
    secondary: ['Crossover', 'Flexão'],
    tips: ['Varie os ângulos para desenvolvimento completo', 'Foque na contração no pico do movimento'],
  },
  braco: {
    primary: ['Rosca direta', 'Rosca martelo', 'Rosca concentrada'],
    secondary: ['Rosca scott', 'Rosca inversa'],
    tips: ['Controle a fase excêntrica', 'Não use impulso'],
  },
  // ... outros grupos
}
```

---

## 7. PERSONALIZAÇÃO

### 7.1 Perfil de Personalização

```typescript
interface PersonalizationProfile {
  // Tom de voz
  tonePreference: 'motivacional' | 'tecnico' | 'amigavel' | 'direto'
  
  // Nível de detalhe
  detailLevel: 'resumido' | 'moderado' | 'detalhado'
  
  // Frequência de comunicação
  communicationFrequency: 'diaria' | 'semanal' | 'quando_relevante'
  
  // Preferências de conteúdo
  contentPreferences: {
    wantsTips: boolean
    wantsMotivation: boolean
    wantsEducation: boolean
    wantsComparisons: boolean
  }
  
  // Contexto
  trainingExperience: 'iniciante' | 'intermediario' | 'avancado'
  primaryGoal: 'estetica' | 'competicao' | 'saude' | 'forca'
  
  // Histórico de interação
  dismissedInsightTypes: InsightType[]
  preferredInsightTypes: InsightType[]
}
```

### 7.2 Adaptação de Tom

```typescript
const TONE_ADAPTERS = {
  motivacional: {
    prefix: ['Incrível!', 'Fantástico!', 'Você está arrasando!', 'Parabéns!'],
    suffix: ['Continue assim!', 'Você consegue!', 'Rumo ao topo!', 'Nada pode te parar!'],
    emoji: true,
    exclamation: true,
  },
  
  tecnico: {
    prefix: ['Análise:', 'Dados indicam:', 'Observação:', 'Resultado:'],
    suffix: ['', 'Ajuste conforme necessário.', 'Monitore nas próximas semanas.'],
    emoji: false,
    exclamation: false,
  },
  
  amigavel: {
    prefix: ['E aí!', 'Olha só,', 'Boas notícias:', 'Ei,'],
    suffix: ['Tamo junto!', 'Qualquer coisa, estou aqui.', 'Bora!'],
    emoji: true,
    exclamation: false,
  },
  
  direto: {
    prefix: ['', '', '', ''],
    suffix: ['', '', ''],
    emoji: false,
    exclamation: false,
  },
}

function adaptTone(message: string, tone: TonePreference): string {
  const adapter = TONE_ADAPTERS[tone]
  
  let adapted = message
  
  // Adicionar prefixo aleatório
  if (adapter.prefix.length > 0) {
    const prefix = adapter.prefix[Math.floor(Math.random() * adapter.prefix.length)]
    if (prefix) adapted = `${prefix} ${adapted}`
  }
  
  // Adicionar sufixo aleatório
  if (adapter.suffix.length > 0) {
    const suffix = adapter.suffix[Math.floor(Math.random() * adapter.suffix.length)]
    if (suffix) adapted = `${adapted} ${suffix}`
  }
  
  // Remover emojis se necessário
  if (!adapter.emoji) {
    adapted = adapted.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
  }
  
  // Ajustar exclamações
  if (!adapter.exclamation) {
    adapted = adapted.replace(/!/g, '.')
  }
  
  return adapted.trim()
}
```

---

## 8. LIMITES FREE vs PRO

### 8.1 Tabela de Features

| Feature | Free | PRO |
|---------|------|-----|
| **Insights diários** | 3 | Ilimitados |
| **Tipos de insight** | progress, tip, reminder | Todos os tipos |
| **Relatório semanal** | Resumido | Completo |
| **Relatório mensal** | ❌ | ✅ |
| **Análise de proporções** | Score geral | Breakdown completo |
| **Análise de simetria** | Básica (2 músculos) | Completa (todos) |
| **Análise de evolução** | 30 dias | Histórico completo |
| **Diagnóstico estético** | ❌ | ✅ |
| **Recomendações de treino** | Genéricas | Personalizadas |
| **Projeções** | ❌ | ✅ |
| **Chat com Coach IA** | ❌ | ✅ |
| **Exportar relatórios** | ❌ | ✅ (PDF) |

### 8.2 Implementação de Limites

```typescript
function getInsightsForUser(userId: string): Promise<Insight[]> {
  const user = await getUser(userId)
  const allInsights = await generateAllInsights(userId)
  
  if (user.isPro) {
    return allInsights
  }
  
  // Free: limitar quantidade e tipos
  const freeAllowedTypes: InsightType[] = ['progress', 'tip', 'reminder', 'motivation']
  
  return allInsights
    .filter(i => freeAllowedTypes.includes(i.type))
    .slice(0, 3)
}

function getWeeklyReport(userId: string): Promise<WeeklyReport> {
  const user = await getUser(userId)
  const fullReport = await generateWeeklyReport(userId)
  
  if (user.isPro) {
    return fullReport
  }
  
  // Free: retornar versão resumida
  return {
    ...fullReport,
    aiAnalysis: {
      strengths: fullReport.aiAnalysis.strengths.slice(0, 1),
      improvements: fullReport.aiAnalysis.improvements.slice(0, 1),
      focus: fullReport.aiAnalysis.focus,
      prediction: '🔒 Disponível no PRO',
    },
    nextWeekPlan: {
      priority1: fullReport.nextWeekPlan.priority1,
      priority2: '🔒 Disponível no PRO',
      priority3: '🔒 Disponível no PRO',
      reminder: fullReport.nextWeekPlan.reminder,
    },
  }
}
```

### 8.3 Upsell Points

```typescript
const UPSELL_TRIGGERS = {
  // Quando mostrar upsell para PRO
  triggers: [
    {
      condition: 'user_tries_blocked_feature',
      message: 'Desbloqueie análises avançadas com o VITRU IA PRO',
      feature: 'Diagnóstico estético completo',
    },
    {
      condition: 'user_has_10_measurements',
      message: 'Você tem dados suficientes para projeções! Upgrade para ver.',
      feature: 'Projeções de progresso',
    },
    {
      condition: 'user_score_above_80',
      message: 'Seu físico está avançado! Desbloqueie análises de competição.',
      feature: 'Análise de categoria',
    },
    {
      condition: 'high_asymmetry_detected',
      message: 'Detectamos assimetrias. Veja análise completa no PRO.',
      feature: 'Análise de simetria completa',
    },
  ],
}
```

---

## 9. INTEGRAÇÃO COM LLM

### 9.1 Configuração

```typescript
interface LLMConfig {
  provider: 'openai' | 'anthropic'
  model: string                         // 'gpt-4-turbo' ou 'claude-3-opus'
  temperature: number                   // 0.7 para criatividade moderada
  maxTokens: number                     // Limite de resposta
  systemPrompt: string                  // Prompt do sistema
}

const AI_COACH_CONFIG: LLMConfig = {
  provider: 'openai',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 1000,
  systemPrompt: `
    Você é o Coach IA do VITRU IA, um assistente especializado em 
    análise de proporções corporais e fisiculturismo estético.
    
    Sua personalidade:
    - Motivador mas realista
    - Técnico mas acessível
    - Sempre baseado em dados
    - Encorajador mas honesto
    
    Você conhece profundamente:
    - Proporção Áurea (Golden Ratio) - 1.618
    - Métodos: Golden Ratio, Classic Physique, Men's Physique
    - Anatomia e grupos musculares
    - Treinamento de hipertrofia
    - Nutrição esportiva básica
    
    Sempre responda em português brasileiro.
    Sempre formate respostas em JSON quando solicitado.
  `,
}
```

### 9.2 Chamada ao LLM

```typescript
async function callCoachAI(
  prompt: string,
  context: UserContext
): Promise<AIResponse> {
  const fullPrompt = buildPromptWithContext(prompt, context)
  
  const response = await openai.chat.completions.create({
    model: AI_COACH_CONFIG.model,
    temperature: AI_COACH_CONFIG.temperature,
    max_tokens: AI_COACH_CONFIG.maxTokens,
    messages: [
      { role: 'system', content: AI_COACH_CONFIG.systemPrompt },
      { role: 'user', content: fullPrompt },
    ],
  })
  
  const content = response.choices[0].message.content
  
  // Parse JSON se necessário
  try {
    return JSON.parse(content)
  } catch {
    return { text: content }
  }
}
```

### 9.3 Cache e Otimização

```typescript
// Cache de respostas da IA para economizar chamadas
const AI_CACHE_CONFIG = {
  // Insights diários: cache por 6 horas
  dailyInsights: { ttl: 6 * 60 * 60 * 1000 },
  
  // Relatório semanal: cache por 24 horas
  weeklyReport: { ttl: 24 * 60 * 60 * 1000 },
  
  // Análise de proporções: invalidar quando houver nova medição
  proportionAnalysis: { ttl: null, invalidateOn: 'new_measurement' },
  
  // Dicas genéricas: cache por 7 dias
  genericTips: { ttl: 7 * 24 * 60 * 60 * 1000 },
}
```

---

## 10. MÉTRICAS E MONITORAMENTO

### 10.1 KPIs do Coach IA

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Insight Click Rate | % de insights clicados | > 30% |
| Report Open Rate | % de relatórios abertos | > 60% |
| Recommendation Follow Rate | % de recomendações seguidas | > 20% |
| User Satisfaction | NPS do Coach IA | > 50 |
| Retention Impact | Retenção de usuários que usam IA vs não | +20% |

### 10.2 Logging

```typescript
interface AICoachLog {
  userId: string
  timestamp: Date
  action: 'insight_generated' | 'insight_viewed' | 'insight_clicked' | 
          'report_generated' | 'report_viewed' |
          'recommendation_generated' | 'recommendation_followed'
  insightId?: string
  insightType?: InsightType
  metadata?: Record<string, unknown>
}
```

---

## 11. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do AI Coach |

---

**VITRU IA AI Coach**  
*Análise • Insights • Motivação • Personalização*
