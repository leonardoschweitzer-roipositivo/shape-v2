# SPEC: Ranking de Personais - VITRU IA

## Documento de Especificação da Tela de Ranking de Personais

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (A Matemática do Físico Perfeito)

---

## 1. VISÃO GERAL

### 1.1 Conceito

O **Ranking de Personais** é uma funcionalidade que classifica os Personal Trainers com base no **desempenho real dos seus atletas**. Não é um ranking de popularidade ou quantidade de alunos, mas sim de **resultados comprovados**.

> "Os melhores personais são aqueles que transformam seus atletas."

### 1.2 Objetivos

| Objetivo | Benefício |
|----------|-----------|
| **Gamificação para Personais** | Motivar personais a acompanhar e evoluir seus atletas |
| **Descoberta para Atletas** | Ajudar atletas a encontrar bons profissionais |
| **Credibilidade** | Criar um sistema meritocrático baseado em dados |
| **Engajamento** | Aumentar uso da plataforma por personais |
| **Marketing** | Personais bem rankeados podem usar como prova social |

### 1.3 Filosofia do Ranking

```
┌─────────────────────────────────────────────────────────────────┐
│                  FILOSOFIA DO RANKING                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ❌ NÃO É baseado em:                                           │
│     • Quantidade de atletas                                     │
│     • Tempo na plataforma                                       │
│     • Popularidade/seguidores                                   │
│     • Autoavaliação                                             │
│                                                                 │
│  ✅ É BASEADO em:                                               │
│     • Evolução REAL dos atletas (medidas)                       │
│     • Consistência de resultados                                │
│     • Retenção de atletas                                       │
│     • Frequência de acompanhamento                              │
│     • Correção de assimetrias                                   │
│                                                                 │
│  🎯 PRINCÍPIO: Resultados falam mais que promessas              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. MÉTRICAS DO RANKING

### 2.1 Score Composto (Personal Score)

O **Personal Score** é calculado com base em múltiplas métricas ponderadas:

```typescript
interface PersonalScore {
  // Score final (0-100)
  totalScore: number
  
  // Componentes do score
  components: {
    // 40% - Evolução dos atletas
    athleteEvolution: {
      score: number           // 0-100
      weight: 0.40
      metrics: {
        avgScoreImprovement: number    // Melhoria média de score
        athletesImproved: number       // % de atletas que melhoraram
        topImprovement: number         // Maior melhoria individual
      }
    }
    
    // 25% - Consistência
    consistency: {
      score: number
      weight: 0.25
      metrics: {
        measurementFrequency: number   // Frequência de medições
        athleteRetention: number       // % de retenção (6+ meses)
        activeMonitoring: number       // % atletas com medição recente
      }
    }
    
    // 20% - Correção de assimetrias
    symmetryCorrection: {
      score: number
      weight: 0.20
      metrics: {
        asymmetriesFixed: number       // Assimetrias corrigidas
        avgSymmetryImprovement: number // Melhoria média de simetria
      }
    }
    
    // 15% - Engajamento
    engagement: {
      score: number
      weight: 0.15
      metrics: {
        avgAthleteSessions: number     // Média de medições por atleta
        responseRate: number           // Taxa de acompanhamento
        platformUsage: number          // Uso ativo da plataforma
      }
    }
  }
  
  // Metadata
  calculatedAt: Date
  athleteCount: number        // Mínimo 3 para aparecer no ranking
  monthsActive: number        // Mínimo 3 meses
}
```

### 2.2 Cálculo Detalhado

#### Evolução dos Atletas (40%)

```typescript
function calculateEvolutionScore(personal: Personal): number {
  const athletes = personal.athletes.filter(a => a.measurementCount >= 2)
  
  if (athletes.length < 3) return 0 // Mínimo 3 atletas com histórico
  
  // Melhoria média de score
  const improvements = athletes.map(a => {
    const firstScore = a.measurements[0].score
    const lastScore = a.measurements[a.measurements.length - 1].score
    return lastScore - firstScore
  })
  
  const avgImprovement = average(improvements)
  const improvedCount = improvements.filter(i => i > 0).length
  const improvementRate = improvedCount / athletes.length
  
  // Normalizar para 0-100
  // Melhoria de +10 pontos = score 100
  const improvementScore = Math.min(100, (avgImprovement / 10) * 100)
  
  // Bonus por taxa de sucesso
  const successBonus = improvementRate * 20
  
  return Math.min(100, improvementScore + successBonus)
}
```

#### Consistência (25%)

```typescript
function calculateConsistencyScore(personal: Personal): number {
  const athletes = personal.athletes
  
  // Frequência de medições (ideal: mensal)
  const avgMeasurementsPerMonth = calculateAvgMeasurementsPerMonth(athletes)
  const frequencyScore = Math.min(100, avgMeasurementsPerMonth * 100)
  
  // Retenção (atletas há 6+ meses)
  const retainedAthletes = athletes.filter(a => 
    monthsSince(a.joinedAt) >= 6
  ).length
  const retentionRate = retainedAthletes / athletes.length
  const retentionScore = retentionRate * 100
  
  // Monitoramento ativo (medição nos últimos 30 dias)
  const activeAthletes = athletes.filter(a =>
    daysSince(a.lastMeasurement) <= 30
  ).length
  const activeRate = activeAthletes / athletes.length
  const activeScore = activeRate * 100
  
  return (frequencyScore * 0.4) + (retentionScore * 0.3) + (activeScore * 0.3)
}
```

#### Correção de Assimetrias (20%)

```typescript
function calculateSymmetryScore(personal: Personal): number {
  const athletesWithAsymmetry = personal.athletes.filter(a =>
    a.initialAsymmetries.length > 0
  )
  
  if (athletesWithAsymmetry.length === 0) return 50 // Neutro se não tinha assimetrias
  
  let totalFixed = 0
  let totalImproved = 0
  
  athletesWithAsymmetry.forEach(athlete => {
    athlete.initialAsymmetries.forEach(asymmetry => {
      const current = getCurrentAsymmetry(athlete, asymmetry.muscle)
      
      if (current <= 2) { // Considerado corrigido (< 2%)
        totalFixed++
      } else if (current < asymmetry.initialValue) {
        totalImproved++
      }
    })
  })
  
  const totalAsymmetries = athletesWithAsymmetry.reduce(
    (sum, a) => sum + a.initialAsymmetries.length, 0
  )
  
  const fixedRate = totalFixed / totalAsymmetries
  const improvedRate = (totalFixed + totalImproved) / totalAsymmetries
  
  return (fixedRate * 70) + (improvedRate * 30)
}
```

### 2.3 Requisitos Mínimos para Ranking

| Requisito | Valor Mínimo | Motivo |
|-----------|--------------|--------|
| Atletas ativos | 3 | Evitar outliers |
| Meses na plataforma | 3 | Tempo para demonstrar resultados |
| Medições por atleta | 2 | Precisar ter histórico |
| Atletas com evolução | 2 | Demonstrar padrão |

---

## 3. CATEGORIAS DO RANKING

### 3.1 Ranking Geral

Todos os personais que atendem os requisitos mínimos.

### 3.2 Rankings por Especialidade

```typescript
type RankingCategory = 
  | 'geral'
  | 'hipertrofia'
  | 'emagrecimento'
  | 'forca'
  | 'fisiculturismo'
  | 'funcional'
  | 'reabilitacao'
```

### 3.3 Rankings por Região

```typescript
type RegionFilter =
  | 'nacional'
  | 'regiao'      // Norte, Nordeste, Sul, Sudeste, Centro-Oeste
  | 'estado'
  | 'cidade'
```

### 3.4 Rankings Temporais

| Período | Descrição |
|---------|-----------|
| **All-time** | Desde o início |
| **Ano atual** | Janeiro até agora |
| **Últimos 6 meses** | Rolling 6 months |
| **Últimos 3 meses** | Rolling 3 months |
| **Mês atual** | Mês corrente |

---

## 4. INTERFACE DA TELA

### 4.1 Layout Geral

```
┌─────────────────────────────────────────────────────────────────┐
│  ◇ VITRU IA                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RANKING PERSONAIS                                    [BADGE]   │
│  Os melhores profissionais baseado em resultados reais          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🔍 Buscar personal...                                  │    │
│  │                                                         │    │
│  │  Categoria: [Geral ▼]   Região: [Nacional ▼]            │    │
│  │  Período: [Últimos 6 meses ▼]   Especialidade: [Todas ▼]│    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      🏆 TOP 3                            │    │
│  │                                                         │    │
│  │       🥈              🥇              🥉                │    │
│  │      [Foto]         [Foto]         [Foto]              │    │
│  │    Maria Silva    João Carlos    Pedro Santos          │    │
│  │    Score: 94.2    Score: 96.8    Score: 91.5           │    │
│  │    +12.3 pts avg  +15.1 pts avg  +10.8 pts avg         │    │
│  │    32 atletas     28 atletas     45 atletas            │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  RANKING COMPLETO                                       │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │                                                         │    │
│  │  #   Personal           Score  Evolução  Atletas  Loc   │    │
│  │  ──────────────────────────────────────────────────────  │    │
│  │  1   🥇 João Carlos     96.8   +15.1     28       SP    │    │
│  │  2   🥈 Maria Silva     94.2   +12.3     32       RJ    │    │
│  │  3   🥉 Pedro Santos    91.5   +10.8     45       MG    │    │
│  │  4   Ana Costa          89.3   +9.5      18       SP    │    │
│  │  5   Lucas Oliveira     87.1   +8.9      22       PR    │    │
│  │  6   Carla Souza        85.4   +8.2      15       RS    │    │
│  │  7   Rafael Lima        83.9   +7.8      31       BA    │    │
│  │  8   Fernanda Alves     82.1   +7.4      12       SC    │    │
│  │  9   Marcos Pereira     80.5   +7.1      27       SP    │    │
│  │  10  Julia Mendes       79.8   +6.9      19       RJ    │    │
│  │                                                         │    │
│  │  [Carregar mais...]                                     │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📊 ESTATÍSTICAS DO RANKING                             │    │
│  │                                                         │    │
│  │  Total de personais: 1,234                              │    │
│  │  Média de evolução: +6.2 pontos                         │    │
│  │  Top especialidade: Hipertrofia                         │    │
│  │  Região com mais personais: Sudeste                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Card do Personal (Expandido)

```
┌─────────────────────────────────────────────────────────────────┐
│  #1 🥇                                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  ┌────────┐   João Carlos Silva                          │   │
│  │  │        │   @joao.personal                             │   │
│  │  │  Foto  │   CREF: 012345-G/SP ✓                        │   │
│  │  │        │   São Paulo, SP                              │   │
│  │  └────────┘                                              │   │
│  │                                                          │   │
│  │  ────────────────────────────────────────────────────    │   │
│  │                                                          │   │
│  │  PERSONAL SCORE                                          │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │                    96.8                            │  │   │
│  │  │  ████████████████████████████████████████████████░ │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │                                                          │   │
│  │  📊 MÉTRICAS                                             │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │   │
│  │  │  Evolução    │ │  Consistência│ │  Simetria    │      │   │
│  │  │  +15.1 pts   │ │  94%         │ │  87%         │      │   │
│  │  │  média       │ │  retenção    │ │  corrigidas  │      │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘      │   │
│  │                                                          │   │
│  │  🏷️ ESPECIALIDADES                                       │   │
│  │  [Hipertrofia] [Fisiculturismo] [Emagrecimento]          │   │
│  │                                                          │   │
│  │  📈 DESTAQUES                                            │   │
│  │  • 28 atletas ativos                                     │   │
│  │  • 92% dos atletas melhoraram                            │   │
│  │  • Melhor evolução: +23 pontos (em 6 meses)              │   │
│  │  • 18 assimetrias corrigidas                             │   │
│  │                                                          │   │
│  │  💬 "Personal trainer especializado em hipertrofia e     │   │
│  │      preparação para competições de fisiculturismo..."   │   │
│  │                                                          │   │
│  │  [Ver perfil completo]    [📷 Instagram]                 │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Perfil Público do Personal

Quando clica em "Ver perfil completo":

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  PERFIL DO PERSONAL                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  ┌────────────┐                                         │    │
│  │  │            │   João Carlos Silva                     │    │
│  │  │   FOTO     │   🥇 #1 no Ranking Nacional             │    │
│  │  │            │                                         │    │
│  │  └────────────┘   📍 São Paulo, SP                      │    │
│  │                   📋 CREF: 012345-G/SP ✓                │    │
│  │                   ⏱️ 5+ anos de experiência             │    │
│  │                                                         │    │
│  │  [📷 @joao.personal]  [🌐 Site]                         │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📊 SCORE DETALHADO                         96.8/100    │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │                                                         │    │
│  │  Evolução dos Atletas      ████████████████████░  98    │    │
│  │  Consistência              ███████████████████░░  94    │    │
│  │  Correção de Assimetrias   █████████████████░░░░  87    │    │
│  │  Engajamento               ████████████████████░  96    │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🏆 CONQUISTAS                                          │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │                                                         │    │
│  │  🥇 #1 Nacional       🔥 10+ atletas     ⭐ Elite       │    │
│  │     6 meses              melhoraram         Score 95+   │    │
│  │                                                         │    │
│  │  🎯 Corretor de      📈 Consistente      💪 Veterano    │    │
│  │     Assimetrias         12 meses            50+ atletas │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📈 RESULTADOS DOS ATLETAS                              │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │                                                         │    │
│  │  28 atletas ativos                                      │    │
│  │                                                         │    │
│  │  Evolução média: +15.1 pontos                           │    │
│  │  ████████████████████████████████░░░░░░  92% melhoraram │    │
│  │                                                         │    │
│  │  Distribuição de evolução:                              │    │
│  │  +20 ou mais  ██████████  5 atletas                     │    │
│  │  +15 a +20    ████████████████  8 atletas               │    │
│  │  +10 a +15    ██████████████  7 atletas                 │    │
│  │  +5 a +10     ██████  4 atletas                         │    │
│  │  0 a +5       ████  2 atletas                           │    │
│  │  Sem melhoria ██  2 atletas                             │    │
│  │                                                         │    │
│  │  Melhor caso: Atleta X (+23 pontos em 6 meses)          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🎯 ESPECIALIDADES                                      │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │                                                         │    │
│  │  [Hipertrofia]  [Fisiculturismo]  [Emagrecimento]       │    │
│  │                                                         │    │
│  │  Público-alvo: Intermediários a Avançados               │    │
│  │  Metodologia: Sobrecarga progressiva, Alto volume       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  💬 SOBRE                                               │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │                                                         │    │
│  │  "Personal trainer especializado em hipertrofia e       │    │
│  │  preparação de atletas para competições de              │    │
│  │  fisiculturismo. 5 anos de experiência com mais de      │    │
│  │  100 alunos atendidos. Formado em Educação Física       │    │
│  │  pela USP com especialização em fisiologia do           │    │
│  │  exercício."                                            │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │  Interessado em treinar com João Carlos?                │    │
│  │                                                         │    │
│  │  [📱 Entrar em contato via WhatsApp]                    │    │
│  │                                                         │    │
│  │  ⓘ O VITRU IA não intermedia contratações.             │    │
│  │    Este é apenas um perfil público do profissional.     │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. BADGES E CONQUISTAS

### 5.1 Badges de Ranking

```typescript
const RANKING_BADGES = {
  // Posição
  'rank_1': { icon: '🥇', name: 'Campeão', description: '#1 no ranking' },
  'rank_2': { icon: '🥈', name: 'Vice-campeão', description: '#2 no ranking' },
  'rank_3': { icon: '🥉', name: 'Bronze', description: '#3 no ranking' },
  'top_10': { icon: '🏆', name: 'Top 10', description: 'Entre os 10 melhores' },
  'top_50': { icon: '⭐', name: 'Top 50', description: 'Entre os 50 melhores' },
  'top_100': { icon: '✨', name: 'Top 100', description: 'Entre os 100 melhores' },
  
  // Score
  'elite': { icon: '💎', name: 'Elite', description: 'Score 95+' },
  'expert': { icon: '🔷', name: 'Expert', description: 'Score 85+' },
  'professional': { icon: '🔹', name: 'Profissional', description: 'Score 75+' },
  
  // Evolução
  'transformer': { icon: '🔥', name: 'Transformador', description: '10+ atletas com +10 pontos' },
  'consistent': { icon: '📈', name: 'Consistente', description: '12 meses no top 100' },
  'rising_star': { icon: '🌟', name: 'Revelação', description: 'Maior subida do mês' },
  
  // Assimetria
  'symmetry_master': { icon: '⚖️', name: 'Mestre da Simetria', description: '20+ assimetrias corrigidas' },
  
  // Volume
  'veteran': { icon: '💪', name: 'Veterano', description: '50+ atletas totais' },
  'mentor': { icon: '👨‍🏫', name: 'Mentor', description: '100+ atletas totais' },
}
```

### 5.2 Sistema de Tiers

```
┌─────────────────────────────────────────────────────────────────┐
│                      TIERS DE PERSONAL                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💎 ELITE (Score 95-100)                                        │
│     • Badge especial no perfil                                  │
│     • Destaque no ranking                                       │
│     • Perfil verificado prioritário                             │
│                                                                 │
│  🔷 EXPERT (Score 85-94)                                        │
│     • Badge no perfil                                           │
│     • Visibilidade aumentada                                    │
│                                                                 │
│  🔹 PROFISSIONAL (Score 75-84)                                  │
│     • Badge básico                                              │
│     • Aparece no ranking                                        │
│                                                                 │
│  ⚪ INICIANTE (Score < 75 ou requisitos não atendidos)          │
│     • Sem badge                                                 │
│     • Não aparece no ranking público                            │
│     • Pode ver própria posição estimada                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. VISÕES POR PERFIL

### 6.1 Visão do Atleta

**O que vê:**
- Ranking completo de personais
- Filtros por região, especialidade
- Perfil público dos personais
- Métricas de resultados
- Contato via WhatsApp/Instagram

**O que NÃO vê:**
- Nomes dos atletas do personal
- Dados individuais dos atletas

### 6.2 Visão do Personal

**O que vê:**
- Tudo que o atleta vê
- SUA posição no ranking (mesmo se não estiver no top)
- Breakdown do seu score
- Comparativo com média
- Dicas para melhorar posição
- Histórico da sua posição

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 SUA POSIÇÃO NO RANKING                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Você está em #47 de 1,234 personais                    │    │
│  │  ████████████████████████░░░░░░░░░░  Top 4%             │    │
│  │                                                         │    │
│  │  Seu score: 81.3                                        │    │
│  │  Para subir para #40: +2.1 pontos                       │    │
│  │  Para entrar no Top 10: +6.8 pontos                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📈 BREAKDOWN DO SEU SCORE                              │    │
│  │                                                         │    │
│  │  Componente              Seu    Média    Top 10         │    │
│  │  ─────────────────────────────────────────────────────  │    │
│  │  Evolução dos Atletas    78     65       92             │    │
│  │  Consistência            85     70       95             │    │
│  │  Correção Assimetrias    72     58       88             │    │
│  │  Engajamento             90     72       94             │    │
│  │                                                         │    │
│  │  💡 Dica: Foque em melhorar a evolução média dos seus   │    │
│  │     atletas para subir no ranking.                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📅 HISTÓRICO DE POSIÇÃO                                │    │
│  │                                                         │    │
│  │  Posição                                                │    │
│  │  #30 ─                                      ╱           │    │
│  │  #40 ─                              ╱──────╱            │    │
│  │  #50 ─              ╱──────────────╱                    │    │
│  │  #60 ─      ╱──────╱                                    │    │
│  │  #70 ─ ────╱                                            │    │
│  │       Set  Out  Nov  Dez  Jan  Fev                      │    │
│  │                                                         │    │
│  │  📈 Subiu 23 posições nos últimos 6 meses               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Visão da Academia

**O que vê:**
- Ranking geral
- Ranking dos SEUS personais (comparativo interno)
- Performance agregada da academia
- Identificar personais de destaque para parceria

---

## 7. PRIVACIDADE E OPT-OUT

### 7.1 Configurações do Personal

```typescript
interface RankingPrivacySettings {
  // Aparecer no ranking público
  appearInPublicRanking: boolean  // default: true
  
  // O que mostrar no perfil público
  showPhone: boolean              // default: false
  showInstagram: boolean          // default: true
  showEmail: boolean              // default: false
  showAthleteCount: boolean       // default: true
  showDetailedMetrics: boolean    // default: true
  
  // Permitir contato
  allowContact: boolean           // default: true
  contactMethod: 'whatsapp' | 'instagram' | 'email' | 'none'
}
```

### 7.2 Opt-out

- Personal pode escolher NÃO aparecer no ranking público
- Ainda pode ver sua própria posição
- Seus atletas não são afetados

---

## 8. API ENDPOINTS

### 8.1 Ranking

```typescript
// GET /api/ranking/personals
// Query params: category, region, state, city, specialty, period, page, limit
// Response: { personals: PersonalRankingItem[], total: number, filters: FilterOptions }

// GET /api/ranking/personals/:id
// Response: PersonalPublicProfile

// GET /api/ranking/personals/me (Personal autenticado)
// Response: { position: number, score: PersonalScore, history: PositionHistory[] }

// GET /api/ranking/stats
// Response: { totalPersonals, avgScore, topSpecialty, topRegion }
```

### 8.2 Tipos

```typescript
interface PersonalRankingItem {
  position: number
  personalId: string
  name: string
  avatarUrl: string | null
  cref: string | null
  crefVerified: boolean
  city: string
  state: string
  score: number
  avgEvolution: number
  athleteCount: number
  specialties: string[]
  badges: string[]
  tier: 'elite' | 'expert' | 'professional' | 'iniciante'
}

interface PersonalPublicProfile extends PersonalRankingItem {
  bio: string | null
  instagram: string | null
  website: string | null
  phone: string | null  // Se allowContact
  yearsExperience: string
  scoreBreakdown: PersonalScore['components']
  achievements: Achievement[]
  evolutionDistribution: { range: string, count: number }[]
  methodology: {
    approach: string[]
    targetAudience: string[]
  }
}
```

---

## 9. ATUALIZAÇÃO DO RANKING

### 9.1 Frequência

| Componente | Frequência de Atualização |
|------------|---------------------------|
| Score total | Diária (00:00 UTC) |
| Posição | Diária (00:00 UTC) |
| Métricas detalhadas | A cada nova medição |
| Badges | Semanal |

### 9.2 Histórico

- Posição histórica mantida por 12 meses
- Snapshots mensais para comparação

---

## 10. ANTI-GAMING

### 10.1 Prevenção de Manipulação

```typescript
const ANTI_GAMING_RULES = {
  // Mínimo de atletas para ranking
  minAthletes: 3,
  
  // Mínimo de meses ativos
  minMonthsActive: 3,
  
  // Mínimo de medições por atleta
  minMeasurementsPerAthlete: 2,
  
  // Intervalo mínimo entre medições (evitar spam)
  minDaysBetweenMeasurements: 7,
  
  // Detecção de anomalias
  maxScoreJumpPerMonth: 15,  // Alerta se subir mais que isso
  
  // Validação de medidas
  measurementValidation: true,  // Usa ranges realistas
  
  // Atletas fantasmas
  requireRealEmail: true,
  requireMinActivity: true,  // Atleta precisa ter feito login
}
```

### 10.2 Revisão Manual

- Subidas muito rápidas são revisadas
- Denúncias de atletas investigadas
- Penalização por manipulação: remoção do ranking

---

## 11. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Ranking de Personais |

---

**VITRU IA Ranking de Personais v1.0**  
*Meritocracia • Resultados Reais • Gamificação • Descoberta*
