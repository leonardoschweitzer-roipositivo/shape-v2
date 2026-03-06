# SPEC: Acompanhamento Diário do Coach IA

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Coach IA Acompanhamento Diário  
**Autor:** Especificação Técnica

---

## 1. VISÃO GERAL

### 1.1 Objetivo

O **Acompanhamento Diário** é uma nova seção do Coach IA que permite ao atleta registrar sua rotina diária (refeições, treinos, sono, hidratação, dores) de forma rápida e conversacional, gerando insights personalizados baseados no histórico e objetivos.

### 1.2 Problema que Resolve

| Problema | Solução |
|----------|---------|
| Atleta só usa app em avaliações mensais | Engajamento diário com registros rápidos |
| Personal não sabe o que atleta fez no dia | Dashboard com visão completa |
| Feedback tardio sobre dieta/treino | Insights em tempo real |
| Atleta esquece de registrar | Notificações inteligentes |
| Dados fragmentados | Tudo centralizado no Coach IA |

### 1.3 Benefícios

**Para o Atleta:**
- Feedback instantâneo sobre alimentação e treino
- Lembretes personalizados
- Histórico completo para consulta
- Conexão direta com o Personal via IA

**Para o Personal:**
- Visão em tempo real dos atletas
- Alertas de problemas (lesões, déficit nutricional)
- Dados para ajustar protocolos
- Menos tempo cobrando, mais tempo orientando

---

## 2. ARQUITETURA DA TELA

### 2.1 Estrutura Completa da Página Coach IA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  COACH IA                                                                   │
│  Consultoria inteligente baseada no seu histórico e objetivos               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SEÇÃO 1: ACOMPANHAMENTO DIÁRIO (NOVO!)                             │   │
│  │  Card fixo no topo com trackers e input conversacional              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SEÇÃO 2: HERO BANNER (existente)                                   │   │
│  │  "Transforme seus dados em estética"                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SEÇÃO 3: QUEM É O VITRÚVIO + QUICK LINKS (existente)               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SEÇÃO 4: CONSULTORIA INTELIGENTE (existente)                       │   │
│  │  Diagnóstico | Estratégia | Nutrição                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SEÇÃO 5: DÚVIDA RÁPIDA (existente)                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Layout do Card de Acompanhamento Diário

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  🌅 BOM DIA, JOÃO!                      Dom, 09 Fev  🔥 7   │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    TRACKERS RÁPIDOS                         │   │   │
│  │  │                                                             │   │   │
│  │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │   │   │
│  │  │  │  🍽️   │ │  🏋️   │ │  💧   │ │  😴   │ │  🤕   │   │   │   │
│  │  │  │Refeição│ │ Treino │ │  Água  │ │  Sono  │ │  Dor   │   │   │   │
│  │  │  │  2/5   │ │ PEITO  │ │ 1.5/3L │ │  7h ✓  │ │   +    │   │   │   │
│  │  │  │ ██░░░  │ │ 14:00  │ │ ███░░░ │ │ ████░  │ │        │   │   │   │
│  │  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                    RESUMO NUTRICIONAL                       │   │   │
│  │  │                                                             │   │   │
│  │  │  Calorias    Proteína     Carbos       Gordura              │   │   │
│  │  │  1.200       80g          120g         45g                  │   │   │
│  │  │  ────────    ────────     ────────     ────────             │   │   │
│  │  │  2.500       180g         280g         70g                  │   │   │
│  │  │  ███░░░░░    ███░░░░░     ███░░░░░     ████░░░░             │   │   │
│  │  │  48%         44%          43%          64%                  │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  💬 Falar com Vitrúvio...                               🎤  │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │  💡 INSIGHT: Faltam 100g de proteína. Que tal um shake     │   │   │
│  │  │     pós-treino com 2 scoops de whey?                        │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTES

### 3.1 Header do Card

```typescript
interface DailyTrackerHeader {
  // Saudação contextual
  saudacao: string              // "Bom dia", "Boa tarde", "Boa noite"
  nomeAtleta: string            // "João"
  
  // Data
  dataFormatada: string         // "Dom, 09 Fev"
  
  // Streak
  streak: number                // 7
  streakAtivo: boolean          // true se registrou ontem
}

/**
 * Gera saudação baseada na hora
 */
function getSaudacao(): string {
  const hora = new Date().getHours()
  if (hora < 12) return '🌅 Bom dia'
  if (hora < 18) return '☀️ Boa tarde'
  return '🌙 Boa noite'
}
```

### 3.2 Tracker Buttons

```typescript
type TrackerType = 'refeicao' | 'treino' | 'agua' | 'sono' | 'dor' | 'suplemento' | 'peso' | 'energia'

type TrackerStatus = 'pendente' | 'parcial' | 'completo' | 'alerta'

interface TrackerButton {
  id: TrackerType
  icon: string
  label: string
  status: TrackerStatus
  
  // Dados de progresso (opcional)
  atual?: number
  meta?: number
  unidade?: string
  
  // Dados específicos
  detalhe?: string              // "PEITO", "7h", etc.
  horario?: string              // "14:00"
  
  // Visual
  corBorda: string
  corFundo: string
  corIcone: string
}

const TRACKER_CONFIG: Record<TrackerType, Partial<TrackerButton>> = {
  refeicao: {
    icon: '🍽️',
    label: 'Refeição',
    meta: 5,                    // 5 refeições/dia
    unidade: 'ref',
  },
  treino: {
    icon: '🏋️',
    label: 'Treino',
  },
  agua: {
    icon: '💧',
    label: 'Água',
    meta: 3,                    // 3 litros
    unidade: 'L',
  },
  sono: {
    icon: '😴',
    label: 'Sono',
    meta: 8,                    // 8 horas
    unidade: 'h',
  },
  dor: {
    icon: '🤕',
    label: 'Dor',
  },
  suplemento: {
    icon: '💊',
    label: 'Suplem.',
  },
  peso: {
    icon: '⚖️',
    label: 'Peso',
    unidade: 'kg',
  },
  energia: {
    icon: '⚡',
    label: 'Energia',
    meta: 10,                   // escala 1-10
  },
}
```

### 3.3 Visual dos Estados

```typescript
const STATUS_STYLES: Record<TrackerStatus, {
  corBorda: string
  corFundo: string
  corTexto: string
  iconeExtra?: string
}> = {
  pendente: {
    corBorda: '#374151',        // gray-700
    corFundo: '#1F2937',        // gray-800
    corTexto: '#9CA3AF',        // gray-400
  },
  parcial: {
    corBorda: '#F59E0B',        // amber-500
    corFundo: 'rgba(245, 158, 11, 0.1)',
    corTexto: '#FCD34D',        // amber-300
  },
  completo: {
    corBorda: '#10B981',        // emerald-500
    corFundo: 'rgba(16, 185, 129, 0.1)',
    corTexto: '#6EE7B7',        // emerald-300
    iconeExtra: '✓',
  },
  alerta: {
    corBorda: '#EF4444',        // red-500
    corFundo: 'rgba(239, 68, 68, 0.1)',
    corTexto: '#FCA5A5',        // red-300
    iconeExtra: '⚠️',
  },
}
```

### 3.4 Componente React: TrackerButton

```tsx
interface TrackerButtonProps {
  tracker: TrackerButton
  onClick: () => void
}

function TrackerButton({ tracker, onClick }: TrackerButtonProps) {
  const styles = STATUS_STYLES[tracker.status]
  
  // Calcular progresso
  const progresso = tracker.meta 
    ? Math.min(100, (tracker.atual || 0) / tracker.meta * 100)
    : 0
  
  return (
    <button
      onClick={onClick}
      className="tracker-button"
      style={{
        borderColor: styles.corBorda,
        backgroundColor: styles.corFundo,
      }}
    >
      {/* Ícone */}
      <span className="tracker-icon">{tracker.icon}</span>
      
      {/* Label */}
      <span className="tracker-label">{tracker.label}</span>
      
      {/* Valor/Status */}
      <div className="tracker-value">
        {tracker.atual !== undefined && tracker.meta ? (
          <span>{tracker.atual}/{tracker.meta}{tracker.unidade}</span>
        ) : tracker.detalhe ? (
          <span>{tracker.detalhe}</span>
        ) : tracker.status === 'completo' ? (
          <span>✓</span>
        ) : (
          <span>+</span>
        )}
      </div>
      
      {/* Barra de progresso */}
      {tracker.meta && (
        <div className="tracker-progress">
          <div 
            className="tracker-progress-fill"
            style={{ 
              width: `${progresso}%`,
              backgroundColor: styles.corBorda,
            }}
          />
        </div>
      )}
      
      {/* Horário (para treino) */}
      {tracker.horario && (
        <span className="tracker-horario">{tracker.horario}</span>
      )}
    </button>
  )
}
```

---

## 4. FLUXOS DE INTERAÇÃO

### 4.1 Fluxo: Registrar Refeição

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  REGISTRAR REFEIÇÃO                                                     X   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Qual refeição?                                                             │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │   ☀️    │ │   🌅    │ │   🌞    │ │   🌆    │ │   🌙    │              │
│  │  Café   │ │ Lanche  │ │ Almoço  │ │ Lanche  │ │ Jantar  │              │
│  │ manhã   │ │  manhã  │ │         │ │  tarde  │ │         │              │
│  │         │ │         │ │    ✓    │ │         │ │         │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│       ✓                                                                     │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  OPÇÃO 1: Descrever com texto                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 200g de frango grelhado, 150g de arroz integral, salada de folhas    │ │
│  │ verdes com tomate                                                     │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  OPÇÃO 2: Enviar foto                                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │                    📸 Tirar foto do prato                            │ │
│  │                    📁 Escolher da galeria                            │ │
│  │                                                                       │ │
│  │         A IA analisa a foto e estima os macros automaticamente       │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  OPÇÃO 3: Buscar alimento                                                   │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 🔍 Buscar alimento...                                                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  📊 ESTIMATIVA DA IA                                                        │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  Calorias      Proteína      Carboidrato      Gordura                │ │
│  │  ~450 kcal     ~50g          ~45g             ~8g                    │ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │  │ 🍗 Frango grelhado (200g)     │  330 kcal  │  50g P  │  0g C   │ │ │
│  │  │ 🍚 Arroz integral (150g)      │  110 kcal  │  3g P   │  23g C  │ │ │
│  │  │ 🥗 Salada verde (100g)        │  15 kcal   │  1g P   │  3g C   │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                       │ │
│  │  [Ajustar quantidades]                                               │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                                                             │
│                                        [CANCELAR]    [REGISTRAR]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Fluxo: Registrar Treino

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  REGISTRAR TREINO                                                       X   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📋 TREINO SUGERIDO PARA HOJE                                               │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  🏋️ PEITO + TRÍCEPS                                     Dia 3 de 5   │ │
│  │                                                                       │ │
│  │  Baseado na sua estratégia de Hipertrofia Corretiva:                 │ │
│  │  • Foco em desenvolvimento de peitoral superior (gap -7cm)           │ │
│  │  • Volume moderado em tríceps (proporção OK)                         │ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │  │ Supino Inclinado Halteres    4 x 10-12    Foco: Peito superior │ │ │
│  │  │ Supino Reto Barra            4 x 8-10     Força + Volume       │ │ │
│  │  │ Crucifixo Inclinado          3 x 12-15    Alongamento          │ │ │
│  │  │ Cross Over                   3 x 15       Definição            │ │ │
│  │  │ Tríceps Pulley               4 x 12       Volume               │ │ │
│  │  │ Tríceps Francês              3 x 12       Alongamento          │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                       │ │
│  │  [VER TREINO DETALHADO →]                                            │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Você seguiu este treino?                                                   │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                                      │
│  │   ✅    │ │   🔄    │ │   ❌    │                                      │
│  │   Sim   │ │ Parcial │ │   Não   │                                      │
│  │ Completo│ │         │ │  Fiz    │                                      │
│  │         │ │         │ │  outro  │                                      │
│  └─────────┘ └─────────┘ └─────────┘                                      │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Como foi o treino?                                                         │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│  │   😫    │ │   😐    │ │   💪    │ │   🔥    │                          │
│  │ Muito   │ │ Normal  │ │  Bom    │ │ Excelente│                          │
│  │ difícil │ │         │ │         │ │         │                          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Duração total:                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ◀  [    1h 30min    ]  ▶                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Alguma dor ou desconforto durante o treino?                                │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ ○ Nenhum                                                             │ │
│  │ ○ Leve desconforto em: [________________]                            │ │
│  │ ○ Dor significativa em: [________________]                           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Observações (opcional):                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Aumentei carga no supino inclinado para 32kg                         │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                                                                             │
│                                        [CANCELAR]    [REGISTRAR]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Fluxo: Registrar Água

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  💧 REGISTRAR ÁGUA                                                      X   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           HOJE: 1.5L / 3L                                   │
│                                                                             │
│                    ┌─────────────────────────────┐                          │
│                    │                             │                          │
│                    │      ████████████████       │                          │
│                    │      ████████████████       │                          │
│                    │      ████████████████       │                          │
│                    │      ░░░░░░░░░░░░░░░░       │                          │
│                    │      ░░░░░░░░░░░░░░░░       │                          │
│                    │      ░░░░░░░░░░░░░░░░       │                          │
│                    │                             │                          │
│                    │           50%               │                          │
│                    │                             │                          │
│                    └─────────────────────────────┘                          │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Adicionar:                                                                 │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │  200ml  │ │  300ml  │ │  500ml  │ │  750ml  │ │   1L    │              │
│  │   🥛    │ │   🥛    │ │   🍶    │ │   🍶    │ │   🧴    │              │
│  │  Copo   │ │  Copo   │ │ Garrafa │ │ Garrafa │ │ Garrafa │              │
│  │ pequeno │ │ grande  │ │ pequena │ │ média   │ │ grande  │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                             │
│  Ou digite a quantidade:                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ [________] ml                                              [ADICIONAR]│ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  📊 HISTÓRICO DE HOJE                                                       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  08:30    500ml    ████                                              │ │
│  │  10:15    300ml    ██                                                │ │
│  │  12:45    500ml    ████                                              │ │
│  │  15:30    200ml    █                                                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  💡 Dica: Você treina às 14:00. Beba pelo menos 500ml antes do treino!     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Fluxo: Registrar Sono

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  😴 REGISTRAR SONO                                                      X   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Como foi seu sono na noite passada?                                        │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Horário que dormiu:                                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        [ 23 : 30 ]                                   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Horário que acordou:                                                       │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                        [ 06 : 30 ]                                   │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│                      ═══════════════════════════                            │
│                          TOTAL: 7 horas                                     │
│                      ═══════════════════════════                            │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Qualidade do sono:                                                         │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │   😫    │ │   😕    │ │   😐    │ │   🙂    │ │   😴    │              │
│  │ Péssimo │ │  Ruim   │ │ Regular │ │   Bom   │ │ Ótimo   │              │
│  │    1    │ │    2    │ │    3    │ │    4    │ │    5    │              │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘              │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Acordou durante a noite?                                                   │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│  │  Não    │ │ 1 vez   │ │ 2 vezes │ │ 3+ vezes│                          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Como está sua energia agora?                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  😫  ─────●─────────────────────────────────────────────────  ⚡    │   │
│  │       1    2    3    4    5    6    7    8    9    10               │   │
│  │                      [4]                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💡 Dica: 7h é bom, mas você está com energia baixa. Tente dormir às 22h   │
│     hoje para completar 8h e melhorar a recuperação.                        │
│                                                                             │
│                                                                             │
│                                        [CANCELAR]    [REGISTRAR]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Fluxo: Reportar Dor/Lesão

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  🤕 REPORTAR DOR OU LESÃO                                               X   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Onde está a dor?                                                           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │                         ┌─────┐                                       │ │
│  │                         │CABEÇA│                                      │ │
│  │                         └─────┘                                       │ │
│  │                    ┌────┐     ┌────┐                                  │ │
│  │                    │OMBRO│     │OMBRO│   ← Toque na região            │ │
│  │                    │ E  │     │ D  │                                  │ │
│  │                    └────┘     └────┘                                  │ │
│  │               ┌────┐   ┌─────┐   ┌────┐                               │ │
│  │               │BRAÇO│  │PEITO│   │BRAÇO│                              │ │
│  │               │ E  │   │     │   │ D  │                               │ │
│  │               └────┘   └─────┘   └────┘                               │ │
│  │                        ┌─────┐                                        │ │
│  │                        │LOMBAR│                                       │ │
│  │                        └─────┘                                        │ │
│  │               ┌────┐             ┌────┐                               │ │
│  │               │COXA │           │COXA │                               │ │
│  │               │ E  │             │ D  │                               │ │
│  │               └────┘             └────┘                               │ │
│  │               ┌────┐             ┌────┐                               │ │
│  │               │PANT.│           │PANT.│                               │ │
│  │               │ E  │             │ D  │                               │ │
│  │               └────┘             └────┘                               │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Região selecionada: OMBRO DIREITO                                          │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Intensidade da dor:                                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  😊  ─────────────────●─────────────────────────────────────  😫    │   │
│  │       1    2    3    4    5    6    7    8    9    10               │   │
│  │                      Moderada [4]                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Tipo de dor:                                                               │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│  │ Aguda   │ │ Latejante│ │ Queimação│ │ Formig. │                         │
│  │ (fisgada)│ │         │ │         │ │         │                          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Quando começou?                                                            │
│                                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│  │  Hoje   │ │ Ontem   │ │ Esta    │ │ Há mais │                          │
│  │         │ │         │ │ semana  │ │ tempo   │                          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  O que piora a dor?                                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ □ Movimento    □ Carga/Peso    □ Alongamento    □ Repouso            │ │
│  │ □ Pressão      □ Frio          □ Calor          □ Nada específico    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Descrição adicional (opcional):                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Sinto dor ao fazer supino, principalmente na descida                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  ⚠️ ATENÇÃO: Se a dor for intensa (7+) ou persistir por mais de 1 semana,  │
│     recomendamos consultar um profissional de saúde.                        │
│                                                                             │
│  💡 Com base nesse registro, o Vitrúvio ajustará seus treinos              │
│     automaticamente para evitar movimentos que possam agravar a lesão.     │
│                                                                             │
│                                                                             │
│                                        [CANCELAR]    [REGISTRAR]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. INPUT CONVERSACIONAL

### 5.1 Processamento de Linguagem Natural

```typescript
interface ConversationalInput {
  texto: string
  tipo: 'registro' | 'consulta' | 'comando'
  entidade?: TrackerType
  dados?: Record<string, any>
}

/**
 * Processa input do usuário e identifica intenção
 */
function processarInput(texto: string): ConversationalInput {
  const textoLower = texto.toLowerCase()
  
  // Padrões de REFEIÇÃO
  const padroesRefeicao = [
    /comi (.+)/i,
    /almocei (.+)/i,
    /jantei (.+)/i,
    /tomei café (.+)/i,
    /lanche (.+)/i,
    /(\d+)g de (.+)/i,
  ]
  
  // Padrões de TREINO
  const padroesTreino = [
    /treinei (.+)/i,
    /fiz (.+) hoje/i,
    /treino de (.+)/i,
    /academia (.+)/i,
  ]
  
  // Padrões de ÁGUA
  const padroesAgua = [
    /bebi (\d+)(ml|l|litros?)/i,
    /tomei (\d+)(ml|l|litros?) de água/i,
    /água (\d+)/i,
  ]
  
  // Padrões de SONO
  const padroesSono = [
    /dormi (\d+)h/i,
    /dormi (\d+) horas/i,
    /acordei às (\d+)/i,
    /sono (.+)/i,
  ]
  
  // Padrões de DOR
  const padroesDor = [
    /dor (no|na|em) (.+)/i,
    /tô com dor/i,
    /machucado/i,
    /lesão/i,
    /incomodando/i,
  ]
  
  // Padrões de CONSULTA
  const padroesConsulta = [
    /quanto (.+) (comi|bebi|treinei)/i,
    /como (está|tá) (meu|minha) (.+)/i,
    /qual meu (.+)/i,
    /meu progresso/i,
  ]
  
  // Identificar e retornar
  for (const padrao of padroesRefeicao) {
    const match = texto.match(padrao)
    if (match) {
      return {
        texto,
        tipo: 'registro',
        entidade: 'refeicao',
        dados: { descricao: match[1] || match[2] },
      }
    }
  }
  
  // ... similar para outros padrões
  
  // Fallback: enviar para IA processar
  return {
    texto,
    tipo: 'consulta',
  }
}
```

### 5.2 Exemplos de Interação

```typescript
const EXEMPLOS_INTERACAO = [
  // REFEIÇÕES
  {
    input: "comi 200g de frango com arroz",
    resposta: "Registrado! 🍽️ Almoço: Frango (200g) + Arroz. Estimativa: ~450kcal, 50g proteína. Confirma?",
    acao: "abrir_modal_refeicao_preenchido",
  },
  {
    input: "almocei um prato feito",
    resposta: "O que tinha no prato feito? Me conta os ingredientes ou manda uma foto 📸",
    acao: "pedir_mais_info",
  },
  
  // TREINO
  {
    input: "treinei peito hoje, 1h30",
    resposta: "💪 Treino de Peito registrado! Duração: 1h30. Como foi a intensidade? [😫 😐 💪 🔥]",
    acao: "abrir_modal_treino_parcial",
  },
  {
    input: "não consegui treinar hoje",
    resposta: "Sem problemas! Descanso também é importante. Quer reagendar o treino de Peito para amanhã?",
    acao: "oferecer_reagendamento",
  },
  
  // ÁGUA
  {
    input: "bebi 500ml de água",
    resposta: "💧 +500ml registrado! Total hoje: 2L / 3L (67%). Continue assim!",
    acao: "registrar_agua",
  },
  
  // SONO
  {
    input: "dormi mal, só 5h",
    resposta: "😴 Registrado: 5h de sono. Isso pode afetar sua recuperação. Quer que eu ajuste a intensidade do treino de hoje?",
    acao: "registrar_sono_e_sugerir",
  },
  
  // DOR
  {
    input: "tô com dor no ombro direito",
    resposta: "🤕 Vou registrar isso. Me conta mais: intensidade de 1-10? Quando começou? Isso vai ajudar a ajustar seus treinos.",
    acao: "abrir_modal_dor",
  },
  
  // CONSULTAS
  {
    input: "quanto de proteína comi hoje?",
    resposta: "📊 Proteína hoje: 80g / 180g (44%). Faltam 100g. Sugestão: shake com 2 scoops de whey (50g) + refeição rica em proteína.",
    acao: "exibir_resumo",
  },
  {
    input: "qual meu treino de amanhã?",
    resposta: "🏋️ Amanhã é dia de COSTAS + BÍCEPS. Horário sugerido: 14:00. Quer ver os exercícios?",
    acao: "exibir_treino",
  },
  {
    input: "como tá meu progresso essa semana?",
    resposta: "📈 Resumo da semana:\n• Treinos: 4/5 ✅\n• Dieta: 78% de aderência\n• Sono médio: 6.5h\n• Destaques: Aumentou carga no supino!\nQuer ver mais detalhes?",
    acao: "exibir_resumo_semanal",
  },
]
```

---

## 6. SISTEMA DE INSIGHTS

### 6.1 Geração de Insights

```typescript
interface Insight {
  tipo: 'alerta' | 'dica' | 'elogio' | 'lembrete'
  prioridade: 1 | 2 | 3 | 4 | 5    // 1 = mais urgente
  icone: string
  mensagem: string
  acao?: {
    label: string
    callback: () => void
  }
}

/**
 * Gera insight mais relevante para o momento
 */
function gerarInsightPrincipal(dados: DadosDiarios): Insight {
  const insights: Insight[] = []
  
  // ALERTA: Déficit proteico crítico
  if (dados.proteina.atual < dados.proteina.meta * 0.3) {
    insights.push({
      tipo: 'alerta',
      prioridade: 1,
      icone: '⚠️',
      mensagem: `Proteína crítica: apenas ${dados.proteina.atual}g de ${dados.proteina.meta}g. Você pode perder massa muscular!`,
      acao: {
        label: 'Ver sugestões',
        callback: () => mostrarSugestoesProteina(),
      },
    })
  }
  
  // ALERTA: Treino pendente (passou do horário)
  const agora = new Date()
  if (dados.treino.status === 'pendente' && 
      dados.treino.horarioSugerido && 
      agora.getHours() > parseInt(dados.treino.horarioSugerido.split(':')[0]) + 2) {
    insights.push({
      tipo: 'lembrete',
      prioridade: 2,
      icone: '🏋️',
      mensagem: `Treino de ${dados.treino.tipo} ainda pendente. Vai conseguir treinar hoje?`,
      acao: {
        label: 'Registrar',
        callback: () => abrirModalTreino(),
      },
    })
  }
  
  // ALERTA: Sono ruim + treino pesado
  if (dados.sono.horas < 6 && dados.treino.intensidadePlanejada === 'alta') {
    insights.push({
      tipo: 'dica',
      prioridade: 2,
      icone: '💡',
      mensagem: `Você dormiu apenas ${dados.sono.horas}h. Sugiro reduzir a intensidade do treino hoje para evitar lesões.`,
      acao: {
        label: 'Ajustar treino',
        callback: () => ajustarIntensidadeTreino(),
      },
    })
  }
  
  // ALERTA: Dor reportada + exercício afetado
  if (dados.dores.length > 0) {
    const dorAtiva = dados.dores.find(d => d.ativa)
    if (dorAtiva && dados.treino.exerciciosAfetados.length > 0) {
      insights.push({
        tipo: 'alerta',
        prioridade: 1,
        icone: '🤕',
        mensagem: `Lembre-se: você reportou dor no ${dorAtiva.regiao}. Evite: ${dados.treino.exerciciosAfetados.join(', ')}`,
      })
    }
  }
  
  // ELOGIO: Streak alto
  if (dados.streak >= 7 && dados.streak % 7 === 0) {
    insights.push({
      tipo: 'elogio',
      prioridade: 4,
      icone: '🔥',
      mensagem: `Incrível! ${dados.streak} dias consecutivos usando o app! Sua consistência é inspiradora!`,
    })
  }
  
  // ELOGIO: Bateu meta de proteína antes das 18h
  if (dados.proteina.atual >= dados.proteina.meta && agora.getHours() < 18) {
    insights.push({
      tipo: 'elogio',
      prioridade: 3,
      icone: '🎯',
      mensagem: `Meta de proteína batida antes das 18h! Excelente planejamento!`,
    })
  }
  
  // DICA: Hidratação baixa
  if (dados.agua.atual < dados.agua.meta * 0.5) {
    insights.push({
      tipo: 'dica',
      prioridade: 3,
      icone: '💧',
      mensagem: `Hidratação em ${Math.round(dados.agua.atual / dados.agua.meta * 100)}%. Beba água para melhorar performance e recuperação.`,
      acao: {
        label: '+500ml',
        callback: () => adicionarAgua(500),
      },
    })
  }
  
  // DEFAULT: Dica motivacional
  if (insights.length === 0) {
    insights.push({
      tipo: 'dica',
      prioridade: 5,
      icone: '💪',
      mensagem: getMotivacionalAleatorio(),
    })
  }
  
  // Retornar insight de maior prioridade
  return insights.sort((a, b) => a.prioridade - b.prioridade)[0]
}

function getMotivacionalAleatorio(): string {
  const frases = [
    "Consistência é mais importante que intensidade. Continue registrando!",
    "Cada refeição registrada é um passo mais perto do seu físico ideal.",
    "Lembre-se: você está construindo o corpo dos seus sonhos, um dia de cada vez.",
    "Disciplina é fazer o que precisa ser feito, mesmo quando não quer.",
    "Seu futuro eu vai agradecer pela sua dedicação de hoje.",
  ]
  return frases[Math.floor(Math.random() * frases.length)]
}
```

---

## 7. NOTIFICAÇÕES

### 7.1 Sistema de Notificações Push

```typescript
interface NotificationConfig {
  id: string
  tipo: TrackerType | 'geral'
  titulo: string
  mensagem: string
  horario: string                // "08:00"
  diasSemana: number[]           // [0,1,2,3,4,5,6] (0=domingo)
  condicao?: () => boolean       // Se retornar false, não envia
  acao?: {
    label: string
    deepLink: string
  }
}

const NOTIFICACOES_PADRAO: NotificationConfig[] = [
  // MANHÃ
  {
    id: 'cafe_manha',
    tipo: 'refeicao',
    titulo: '☀️ Bom dia!',
    mensagem: 'Não esqueça de registrar seu café da manhã',
    horario: '08:00',
    diasSemana: [0,1,2,3,4,5,6],
    acao: {
      label: 'Registrar',
      deepLink: 'vitru://coach/refeicao',
    },
  },
  {
    id: 'agua_manha',
    tipo: 'agua',
    titulo: '💧 Hidratação',
    mensagem: 'Comece o dia bebendo água!',
    horario: '09:00',
    diasSemana: [0,1,2,3,4,5,6],
    condicao: () => getDadosDiarios().agua.atual < 500,
  },
  
  // MEIO DIA
  {
    id: 'almoco',
    tipo: 'refeicao',
    titulo: '🍽️ Hora do almoço',
    mensagem: 'Registre seu almoço para acompanhar seus macros',
    horario: '12:30',
    diasSemana: [0,1,2,3,4,5,6],
  },
  
  // PRÉ-TREINO
  {
    id: 'pre_treino',
    tipo: 'treino',
    titulo: '🏋️ Treino em 1 hora!',
    mensagem: (dados) => `Treino de ${dados.treino.tipo} às ${dados.treino.horario}. Já tomou seu pré?`,
    horario: 'dinamico', // 1h antes do treino
    diasSemana: [1,2,3,4,5], // dias de treino
    condicao: () => getDadosDiarios().treino.status === 'pendente',
  },
  
  // PÓS-TREINO
  {
    id: 'pos_treino',
    tipo: 'treino',
    titulo: '💪 Como foi o treino?',
    mensagem: 'Registre seu treino enquanto está fresco na memória',
    horario: 'dinamico', // 30min depois do horário do treino
    condicao: () => getDadosDiarios().treino.status === 'pendente',
  },
  
  // TARDE
  {
    id: 'proteina_check',
    tipo: 'refeicao',
    titulo: '🥩 Check de proteína',
    mensagem: (dados) => `Você consumiu ${dados.proteina.atual}g de ${dados.proteina.meta}g. ${dados.proteina.atual < dados.proteina.meta * 0.7 ? 'Acelere!' : 'Tá no caminho!'}`,
    horario: '16:00',
    diasSemana: [0,1,2,3,4,5,6],
  },
  
  // NOITE
  {
    id: 'jantar',
    tipo: 'refeicao',
    titulo: '🌙 Última refeição',
    mensagem: (dados) => `Faltam ${dados.proteina.meta - dados.proteina.atual}g de proteína. Capriche no jantar!`,
    horario: '19:30',
    diasSemana: [0,1,2,3,4,5,6],
    condicao: () => getDadosDiarios().proteina.atual < getDadosDiarios().proteina.meta,
  },
  {
    id: 'agua_noite',
    tipo: 'agua',
    titulo: '💧 Última chance',
    mensagem: (dados) => `Você bebeu ${dados.agua.atual}L hoje. Meta: ${dados.agua.meta}L`,
    horario: '20:00',
    diasSemana: [0,1,2,3,4,5,6],
    condicao: () => getDadosDiarios().agua.atual < getDadosDiarios().agua.meta * 0.8,
  },
  {
    id: 'sono',
    tipo: 'sono',
    titulo: '😴 Hora de descansar',
    mensagem: 'Sono de qualidade = ganhos de qualidade. Boa noite!',
    horario: '22:00',
    diasSemana: [0,1,2,3,4,5,6],
  },
  
  // SEMANAL
  {
    id: 'check_in_semanal',
    tipo: 'geral',
    titulo: '📊 Check-in semanal',
    mensagem: 'Hora de registrar seu peso e medidas! Vamos ver seu progresso.',
    horario: '09:00',
    diasSemana: [0], // Domingo
    acao: {
      label: 'Fazer check-in',
      deepLink: 'vitru://avaliacao/checkin',
    },
  },
]
```

---

## 8. MODELO DE DADOS

### 8.1 Schemas

```typescript
// ==========================================
// REFEIÇÃO
// ==========================================
interface Refeicao {
  id: string
  atletaId: string
  data: Date
  tipo: 'cafe' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia' | 'outro'
  horario: Date
  
  // Descrição
  descricao?: string
  fotoUrl?: string
  
  // Macros (calculados ou inputados)
  calorias: number
  proteina: number
  carboidrato: number
  gordura: number
  fibra?: number
  
  // Alimentos detalhados (opcional)
  alimentos?: {
    nome: string
    quantidade: number
    unidade: 'g' | 'ml' | 'unidade' | 'colher' | 'xicara'
    calorias: number
    proteina: number
    carboidrato: number
    gordura: number
  }[]
  
  // Metadata
  fonte: 'manual' | 'foto_ia' | 'busca' | 'favorito'
  confianca?: number              // 0-100% (para estimativas da IA)
  
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// TREINO DIÁRIO
// ==========================================
interface TreinoDiario {
  id: string
  atletaId: string
  data: Date
  
  // Treino planejado
  treinoPlanoId?: string          // Referência ao plano de treino
  grupamento: string              // "Peito + Tríceps"
  
  // Status
  status: 'pendente' | 'completo' | 'parcial' | 'pulado' | 'substituido'
  seguiuPlano: boolean
  
  // Execução
  horarioInicio?: Date
  horarioFim?: Date
  duracao?: number                // minutos
  
  // Feedback
  intensidadePercebida: 1 | 2 | 3 | 4   // 1=difícil, 4=excelente
  energiaDurante: number          // 1-10
  
  // Cargas (opcional - para tracking de progressão)
  exerciciosExecutados?: {
    exercicioId: string
    nome: string
    series: {
      repeticoes: number
      carga: number
      unidade: 'kg' | 'lb'
      rpe?: number                // Rate of Perceived Exertion 1-10
    }[]
  }[]
  
  // Dor/Desconforto
  reportouDor: boolean
  dorId?: string                  // Referência ao registro de dor
  
  // Observações
  observacoes?: string
  
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// ÁGUA
// ==========================================
interface RegistroAgua {
  id: string
  atletaId: string
  data: Date
  horario: Date
  quantidade: number              // ml
  
  createdAt: Date
}

// ==========================================
// SONO
// ==========================================
interface RegistroSono {
  id: string
  atletaId: string
  data: Date                      // Data de referência (dia que acordou)
  
  horarioDormiu: Date
  horarioAcordou: Date
  duracaoTotal: number            // minutos
  
  qualidade: 1 | 2 | 3 | 4 | 5    // 1=péssimo, 5=excelente
  acordouDuranteNoite: 0 | 1 | 2 | 3  // vezes
  
  energiaAoAcordar: number        // 1-10
  
  observacoes?: string
  
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// DOR / LESÃO
// ==========================================
interface RegistroDor {
  id: string
  atletaId: string
  
  // Localização
  regiao: string                  // "ombro_direito", "lombar", etc.
  lado?: 'esquerdo' | 'direito' | 'bilateral' | 'central'
  
  // Características
  intensidade: number             // 1-10
  tipo: 'aguda' | 'latejante' | 'queimacao' | 'formigamento' | 'outro'
  
  // Temporal
  dataInicio: Date
  duracaoEstimada?: string        // "hoje", "esta_semana", "mais_tempo"
  
  // Gatilhos
  pioracom: string[]              // ["movimento", "carga", "frio", etc.]
  
  // Status
  ativa: boolean
  dataResolucao?: Date
  
  // Descrição
  descricao?: string
  
  // Impacto no treino
  exerciciosAfetados?: string[]   // ["supino", "desenvolvimento", etc.]
  
  createdAt: Date
  updatedAt: Date
}

// ==========================================
// RESUMO DIÁRIO (agregação)
// ==========================================
interface ResumoDiario {
  id: string
  atletaId: string
  data: Date
  
  // Nutrição
  nutricao: {
    refeicoes: number
    totalCalorias: number
    totalProteina: number
    totalCarboidrato: number
    totalGordura: number
    metaCalorias: number
    metaProteina: number
    metaCarboidrato: number
    metaGordura: number
    aderenciaPercentual: number
  }
  
  // Hidratação
  hidratacao: {
    totalMl: number
    metaMl: number
    aderenciaPercentual: number
  }
  
  // Treino
  treino: {
    planejado: boolean
    realizado: boolean
    tipo?: string
    duracao?: number
    intensidade?: number
  }
  
  // Sono (da noite anterior)
  sono: {
    horas: number
    qualidade: number
    energiaResultante: number
  }
  
  // Dores ativas
  doresAtivas: number
  
  // Score do dia (0-100)
  scoreDia: number
  
  // Streak
  streakAtual: number
  
  createdAt: Date
  updatedAt: Date
}
```

---

## 9. DASHBOARD DO PERSONAL

### 9.1 Visão dos Atletas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  👨‍💼 PAINEL DO PERSONAL                                    Pedro Coach       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 RESUMO DO DIA                                          Dom, 09 Fev      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Total atletas: 15   │  Ativos hoje: 12   │  Alertas: 3            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ⚠️ ALERTAS PRIORITÁRIOS                                                    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  🤕 João Ogro reportou dor no OMBRO DIREITO (intensidade 6/10)       │ │
│  │     Há 2 horas • Treino de Peito hoje                     [Ver →]    │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │  ⚠️ Maria Silva não registra há 3 dias                               │ │
│  │     Última atividade: 06/02/2026                          [Contatar] │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │  📉 Carlos Santos - Energia baixa 3 dias consecutivos                │ │
│  │     Média: 4/10 • Possível overtraining?                  [Ver →]    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  👥 MEUS ATLETAS                                         [🔍 Filtrar]       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  ┌─────┐  João Ogro Silva                           🔴 Alerta        │ │
│  │  │ 👤  │  Última atividade: 10min atrás                              │ │
│  │  └─────┘  🍽️ 2/5  🏋️ ━━  💧 1.5L  😴 7h                              │ │
│  │           ⚠️ Dor no ombro direito                                    │ │
│  │                                                                       │ │
│  │  ┌─────┐  Ana Costa                                  🟢 No caminho   │ │
│  │  │ 👤  │  Última atividade: 1h atrás                                 │ │
│  │  └─────┘  🍽️ 4/5  🏋️ ✓   💧 2.5L  😴 8h                              │ │
│  │           ✨ Treino completo, dieta 92%                               │ │
│  │                                                                       │ │
│  │  ┌─────┐  Carlos Santos                              🟡 Atenção      │ │
│  │  │ 👤  │  Última atividade: 3h atrás                                 │ │
│  │  └─────┘  🍽️ 3/5  🏋️ ✓   💧 1L   😴 5h                               │ │
│  │           ⚡ Energia baixa (4/10) - 3º dia                            │ │
│  │                                                                       │ │
│  │  ┌─────┐  Maria Silva                                ⚫ Inativo      │ │
│  │  │ 👤  │  Última atividade: 3 dias atrás                             │ │
│  │  └─────┘  Sem registros recentes                                     │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Detalhe do Atleta (Visão Personal)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ← Voltar                        JOÃO OGRO SILVA                            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 RESUMO DE HOJE                                        Dom, 09 Fev      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  NUTRIÇÃO                    TREINO                 RECUPERAÇÃO     │   │
│  │  ─────────                   ───────                ───────────     │   │
│  │  Calorias: 1.200/2.500       Status: Pendente       Sono: 7h        │   │
│  │  Proteína: 80g/180g          Tipo: Peito+Tríceps    Qualidade: 4/5  │   │
│  │  Aderência: 48%              Horário: 14:00         Energia: 6/10   │   │
│  │                                                                     │   │
│  │  ⚠️ ALERTA: Dor no ombro direito (6/10)                             │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  📅 HISTÓRICO DA SEMANA                                                     │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │       Seg     Ter     Qua     Qui     Sex     Sab     DOM            │ │
│  │       03      04      05      06      07      08      09             │ │
│  │  ──────────────────────────────────────────────────────────────────  │ │
│  │  🍽️   ✓85%    ✓90%    ✓78%    ✓82%    ✓88%    ✓75%    ○48%          │ │
│  │  🏋️   ✓       ━       ✓       ━       ✓       ━       ○             │ │
│  │  💧   ✓2.8L   ✓3L     ✓2.5L   ✓2.8L   ✓3L     ✓2L     ○1.5L         │ │
│  │  😴   7h      8h      6h      7h      7h      9h      7h            │ │
│  │  ⚡   7       8       5       6       7       8       6             │ │
│  │  ──────────────────────────────────────────────────────────────────  │ │
│  │  Score 78     85      65      72      80      70      --            │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  🤕 REGISTRO DE DOR                                                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Região: Ombro Direito                                               │ │
│  │  Intensidade: 6/10 (moderada-alta)                                   │ │
│  │  Tipo: Aguda                                                         │ │
│  │  Início: Hoje                                                        │ │
│  │  Piora com: Movimento, Carga                                         │ │
│  │  Descrição: "Dor ao fazer supino, principalmente na descida"         │ │
│  │                                                                       │ │
│  │  📋 AÇÃO SUGERIDA:                                                    │ │
│  │  • Substituir supino por exercícios que não envolvam ombro           │ │
│  │  • Sugerir consulta médica se persistir > 5 dias                     │ │
│  │  • Aplicar gelo após atividades                                      │ │
│  │                                                                       │ │
│  │  [Ajustar treino automaticamente]  [Enviar mensagem]                 │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  💬 ENVIAR MENSAGEM                                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Oi João, vi que você reportou dor no ombro. Vamos ajustar seu       │ │
│  │ treino de hoje. Evite supino e faça apenas máquinas...              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│  [Enviar via app]  [Enviar via WhatsApp]                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. GAMIFICAÇÃO

### 10.1 Sistema de Streaks

```typescript
interface StreakSystem {
  atual: number                   // Dias consecutivos
  recorde: number                 // Maior streak já alcançado
  ultimoRegistro: Date
  
  // Regras
  diasParaManter: TrackerType[]   // Quais trackers contam
  minimoParaContar: number        // Ex: pelo menos 3 de 5 trackers
}

const STREAK_CONFIG = {
  // Para manter o streak, precisa registrar pelo menos 3 destes
  trackersObrigatorios: ['refeicao', 'treino', 'agua'],
  minimoTrackers: 2,              // Pelo menos 2 dos 3
  
  // Bônus por streak
  bonus: {
    7: { badge: '🔥 1 Semana', xp: 100 },
    14: { badge: '🔥 2 Semanas', xp: 250 },
    30: { badge: '🔥 1 Mês', xp: 500 },
    60: { badge: '🔥 2 Meses', xp: 1000 },
    90: { badge: '🔥 3 Meses', xp: 2000 },
    180: { badge: '🔥 6 Meses', xp: 5000 },
    365: { badge: '🔥 1 Ano', xp: 10000 },
  },
}
```

### 10.2 Sistema de XP e Níveis

```typescript
interface XPSystem {
  totalXP: number
  nivel: number
  xpProximoNivel: number
  
  // XP por ação
  acoes: {
    registrarRefeicao: 10,
    registrarTreino: 25,
    registrarAgua: 5,
    registrarSono: 10,
    completarDia: 50,              // Todos os trackers
    baterMetaProteina: 20,
    baterMetaAgua: 15,
    treinarNoDiaPlanejado: 30,
    fazerCheckinSemanal: 100,
  }
}

const NIVEIS = [
  { nivel: 1, nome: 'Iniciante', xpMinimo: 0 },
  { nivel: 2, nome: 'Dedicado', xpMinimo: 500 },
  { nivel: 3, nome: 'Consistente', xpMinimo: 1500 },
  { nivel: 4, nome: 'Comprometido', xpMinimo: 3500 },
  { nivel: 5, nome: 'Disciplinado', xpMinimo: 7000 },
  { nivel: 6, nome: 'Avançado', xpMinimo: 12000 },
  { nivel: 7, nome: 'Expert', xpMinimo: 20000 },
  { nivel: 8, nome: 'Elite', xpMinimo: 35000 },
  { nivel: 9, nome: 'Mestre', xpMinimo: 55000 },
  { nivel: 10, nome: 'Lenda', xpMinimo: 80000 },
]
```

### 10.3 Badges/Conquistas

```typescript
interface Badge {
  id: string
  nome: string
  icone: string
  descricao: string
  condicao: (dados: DadosAtleta) => boolean
  xpBonus: number
}

const BADGES: Badge[] = [
  // STREAK
  { id: 'streak_7', nome: '1 Semana de Fogo', icone: '🔥', descricao: '7 dias consecutivos', xpBonus: 100 },
  { id: 'streak_30', nome: 'Mês Perfeito', icone: '📅', descricao: '30 dias consecutivos', xpBonus: 500 },
  
  // TREINO
  { id: 'treino_100', nome: 'Centurião', icone: '💯', descricao: '100 treinos registrados', xpBonus: 500 },
  { id: 'treino_madrugador', nome: 'Madrugador', icone: '🌅', descricao: 'Treinou antes das 7h', xpBonus: 50 },
  { id: 'treino_noturno', nome: 'Coruja', icone: '🦉', descricao: 'Treinou depois das 22h', xpBonus: 50 },
  
  // NUTRIÇÃO
  { id: 'proteina_7dias', nome: 'Máquina de Proteína', icone: '🥩', descricao: 'Bateu meta de proteína 7 dias seguidos', xpBonus: 200 },
  { id: 'dieta_perfeita', nome: 'Dieta Perfeita', icone: '🎯', descricao: '100% de aderência em um dia', xpBonus: 100 },
  
  // PROGRESSO
  { id: 'primeiro_kg', nome: 'Primeira Conquista', icone: '⚖️', descricao: 'Perdeu/ganhou 1kg', xpBonus: 100 },
  { id: 'meta_bf', nome: 'Definição', icone: '💪', descricao: 'Atingiu meta de BF%', xpBonus: 1000 },
  { id: 'proporcao_ideal', nome: 'Proporção Áurea', icone: '✨', descricao: 'Atingiu proporção ideal em uma métrica', xpBonus: 500 },
  
  // ESPECIAIS
  { id: 'early_adopter', nome: 'Pioneiro', icone: '🚀', descricao: 'Usuário dos primeiros 1000', xpBonus: 500 },
  { id: 'feedback', nome: 'Voz Ativa', icone: '📣', descricao: 'Enviou feedback para o app', xpBonus: 50 },
]
```

---

## 11. API ENDPOINTS

### 11.1 Endpoints de Registro

```typescript
// POST /api/daily/refeicao
interface PostRefeicaoBody {
  tipo: TipoRefeicao
  descricao?: string
  fotoBase64?: string
  alimentos?: Alimento[]
  horario?: Date
}

// POST /api/daily/treino
interface PostTreinoBody {
  treinoPlanoId?: string
  seguiuPlano: boolean
  intensidade: 1 | 2 | 3 | 4
  duracao: number
  observacoes?: string
  reportouDor: boolean
  dorDetalhes?: DorDetalhes
}

// POST /api/daily/agua
interface PostAguaBody {
  quantidade: number    // ml
}

// POST /api/daily/sono
interface PostSonoBody {
  horarioDormiu: Date
  horarioAcordou: Date
  qualidade: 1 | 2 | 3 | 4 | 5
  acordouDuranteNoite: number
  energiaAoAcordar: number
}

// POST /api/daily/dor
interface PostDorBody {
  regiao: string
  lado?: string
  intensidade: number
  tipo: TipoDor
  dataInicio: Date
  pioraCom: string[]
  descricao?: string
}
```

### 11.2 Endpoints de Consulta

```typescript
// GET /api/daily/resumo?data=2026-02-09
interface GetResumoDiarioResponse {
  data: Date
  nutricao: NutricaoResumo
  hidratacao: HidratacaoResumo
  treino: TreinoResumo
  sono: SonoResumo
  doresAtivas: Dor[]
  streak: number
  scoreDia: number
  insight: Insight
}

// GET /api/daily/historico?inicio=2026-02-01&fim=2026-02-09
interface GetHistoricoResponse {
  dias: ResumoDiario[]
  estatisticas: {
    mediaAderenciaDieta: number
    mediaSono: number
    treinosRealizados: number
    treinosPlanejados: number
    streakAtual: number
    streakRecorde: number
  }
}

// GET /api/personal/atletas
interface GetAtletasResponse {
  atletas: {
    id: string
    nome: string
    ultimaAtividade: Date
    status: 'ativo' | 'atencao' | 'alerta' | 'inativo'
    resumoHoje: ResumoDiarioCompacto
    alertas: Alerta[]
  }[]
}
```

---

## 12. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Acompanhamento Diário completo |
| 1.1 | Mar/2026 | Atualização com estado real da implementação |

---

## 13. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### 13.1 Fluxos de Registro Implementados

| Fluxo (SPEC) | Modal Real | Status |
|--------------|-----------|:------:|
| 4.1 Registrar Refeição | `RegistrarRefeicaoModal.tsx` (16.3K) | ✅ Texto |
| 4.2 Registrar Treino | `RegistrarTreinoModal.tsx` (10K) | ✅ |
| 4.3 Registrar Água | `RegistrarAguaModal.tsx` (6.5K) | ✅ |
| 4.4 Registrar Sono | `RegistrarSonoModal.tsx` (13.1K) | ✅ |
| 4.5 Reportar Dor | `ReportarDorModal.tsx` (13.6K) | ✅ |

### 13.2 Trackers Implementados vs SPEC

| Tracker (SPEC) | Implementado |
|----------------|:------------:|
| Refeição | ✅ |
| Treino | ✅ |
| Água | ✅ |
| Sono | ✅ |
| Dor | ✅ |
| Suplemento | ❌ |
| Peso | ❌ |
| Energia | ❌ |

### 13.3 O Que Está Funcionando ✅

- [x] Trackers rápidos na tela HOJE (5 de 8)
- [x] Modais de registro para: refeição, treino, água, sono, dor
- [x] Integração com `portalTrackers.ts` para persistência
- [x] Notificações para o personal via `notificacaoTriggers.ts`
- [x] Feedback de treino (renomeado de "Como você está hoje")
- [x] Store de tracking diário (`useDailyTrackingStore`)

### 13.4 Pendências vs SPEC

- [ ] Seção 5 — Input conversacional NLP (processamento texto livre)
- [ ] Resumo Nutricional em tempo real (macros do dia)
- [ ] Estimativa de macros por IA (ao descrever refeição)
- [ ] Foto de refeição → análise por IA
- [ ] Busca de alimentos na base
- [ ] Trackers: suplemento, peso, energia
- [ ] Gamificação dos trackers (XP, conquistas)
- [ ] Dashboard do Personal com visão em tempo real dos atletas (seção 10 da spec)
- [ ] Relatórios periódicos de acompanhamento

---

**VITRU IA - Acompanhamento Diário do Coach IA v1.1**  
*Registro • Insights • Gamificação • Dashboard Personal*
