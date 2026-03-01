# SPEC: Card de Consistência (Heatmap + Streak + Badges)

## Documento de Especificação Técnica

**Versão:** 2.0  
**Data:** Março 2026  
**Projeto:** VITRÚVIO IA - Portal do Atleta  
**Componente:** Card de Consistência na HOME do Atleta

---

## 1. OBJETIVO

Card que mostra o **heatmap de check-ins de treino** do atleta, o **streak atual** (dias consecutivos), o **recorde pessoal** e o **próximo badge** a conquistar — tudo calculado em tempo real a partir dos registros existentes.

---

## 2. LOCALIZAÇÃO NA HOME

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                     │
│  CARD PERSONAL                                              │
│  CARD SCORE + META                                          │
│  CARDS DE MEDIDAS                                           │
│  CTA: VER TREINO DE HOJE                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         📍 CARD DE CONSISTÊNCIA (aqui)              │   │
│  └─────────────────────────────────────────────────────┘   │
│  HALL DOS DEUSES                                            │
│  AÇÕES RÁPIDAS                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. LAYOUT DO CARD

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🔥 CONSISTÊNCIA                              📅 Anual     │
│                                                             │
│  🔥 12 dias seguidos             🏆 Recorde: 24 dias       │
│  ⏳ Faltam 2 dias para: 🔥🔥 Duas Semanas                 │
│                                                             │
│     Jan    Fev    Mar    Abr    Mai                        │
│     ██░░   ████   ███▪   ░░░░   ░░░░                       │
│     ██░█   ████   ████   ░░░░   ░░░░                       │
│     ████   ██░█   ██▪▪   ░░░░   ░░░░                       │
│     ░███   ████   ▪▪▪▪   ░░░░   ░░░░                       │
│                     ↑                                       │
│                   Hoje                                      │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │     135     │  │     64%     │  │   115h40m   │         │
│  │   Treinos   │  │ Consistência│  │ Tempo Total │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. COMPONENTES

### 4.1 Heatmap

```typescript
interface HeatmapProps {
  ano: number
  checkins: Date[]  // Dias que treinou
}

// Cores dos quadrados
const CORES = {
  treinou: '#3B82F6',      // Azul - treinou
  naoTreinou: '#374151',   // Cinza escuro - não treinou
  hoje: '#22C55E',         // Verde - hoje (se treinou)
  hojePendente: '#F59E0B', // Amarelo - hoje (ainda não treinou)
  futuro: '#1F2937',       // Fundo - dias futuros
}
```

### 4.2 Streak + Recorde

```typescript
interface StreakProps {
  streakAtual: number       // 12 dias
  recorde: number           // 24 dias
}

// Emoji baseado no streak
function getEmojiStreak(dias: number): string {
  if (dias >= 30) return '🔥🔥🔥'
  if (dias >= 14) return '🔥🔥'
  if (dias >= 7) return '🔥'
  if (dias >= 3) return '✨'
  return '💪'
}
```

### 4.3 Badges (Marcos de Streak)

```typescript
const BADGES = [
  { dias: 3,   nome: 'Primeiros Passos', emoji: '🌱' },
  { dias: 7,   nome: 'Uma Semana',       emoji: '🔥' },
  { dias: 14,  nome: 'Duas Semanas',     emoji: '🔥🔥' },
  { dias: 30,  nome: 'Um Mês',           emoji: '💪' },
  { dias: 60,  nome: 'Dois Meses',       emoji: '⚡' },
  { dias: 90,  nome: 'Trimestre',        emoji: '🏆' },
  { dias: 180, nome: 'Semestre',         emoji: '👑' },
  { dias: 365, nome: 'Lendário',         emoji: '🏅' },
]

// Próximo badge = primeiro badge com dias > streakAtual
```

### 4.4 Métricas

```typescript
interface MetricasProps {
  totalTreinos: number        // 135
  consistencia: number        // 64 (%)
  tempoTotal: string          // "115h40m"
}
```

---

## 5. INTERFACE

```typescript
interface CardConsistenciaProps {
  ano: number
  checkins: Date[]
  streakAtual: number
  recorde: number
  proximoBadge: { nome: string; emoji: string; diasFaltando: number } | null
  totalTreinos: number
  consistencia: number
  tempoTotalMinutos: number
}
```

---

## 6. CÁLCULOS

```typescript
// Streak = dias consecutivos treinados até hoje (contando de trás pra frente)
// Recorde = maior streak consecutivo de todo o histórico
// Consistência = dias treinados / dias passados no ano × 100
// Tempo Total = soma das durações de todos os treinos

function formatarTempo(minutos: number): string {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return `${h}h${m.toString().padStart(2, '0')}m`
}
```

---

**VITRÚVIO IA - Card de Consistência**