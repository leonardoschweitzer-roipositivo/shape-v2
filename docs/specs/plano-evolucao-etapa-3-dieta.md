# SPEC: Plano de Evolução - Etapa 3: Plano de Dieta

## Montagem do Plano Alimentar Mensal

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA  
**Módulo:** VITRÚVIO IA - Plano de Evolução  
**Etapa:** 3 de 3

---

## 1. VISÃO GERAL

### 1.1 O que é o Plano de Dieta?

O **Plano de Dieta** é a terceira e última etapa do Plano de Evolução. Baseado no diagnóstico (Etapa 1) e alinhado com o plano de treino (Etapa 2), o VITRÚVIO monta a estratégia alimentar para atingir as metas de composição corporal.

### 1.2 Objetivo

> "Criar um déficit ou superávit calórico adequado para atingir as metas mensais de composição corporal, garantindo energia para os treinos e nutrientes para recuperação."

### 1.3 Características do Plano

| Característica | Descrição |
|----------------|-----------|
| **Duração** | Mensal (4 semanas) - renovável |
| **Ajustes** | Semanais baseados em peso e feedback |
| **Flexibilidade** | Refeições livres programadas |
| **Objetivo** | Perder 0.4-0.5kg gordura/mês + ganhar massa magra |

### 1.4 Estrutura Temporal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    ESTRUTURA DO PLANO DE DIETA                              │
│                                                                             │
│  🎯 META ANUAL: Perder 5kg gordura (15.8% → 10%) + Ganhar 2.5kg massa magra│
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │    MÊS 1          MÊS 2          MÊS 3          ...        MÊS 12  │   │
│  │                                                                     │   │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐              ┌─────────┐│   │
│  │  │  PLANO  │    │  PLANO  │    │  PLANO  │              │  PLANO  ││   │
│  │  │ MENSAL  │───▶│ MENSAL  │───▶│ MENSAL  │───▶  ...  ───▶│ MENSAL  ││   │
│  │  │    1    │    │    2    │    │    3    │              │   12    ││   │
│  │  └─────────┘    └─────────┘    └─────────┘              └─────────┘│   │
│  │       │              │              │                        │     │   │
│  │       ▼              ▼              ▼                        ▼     │   │
│  │   📊 Peso        📊 Peso        📊 Peso                  📊 Peso  │   │
│  │   Feedback       Feedback       Feedback                 Feedback │   │
│  │   Ajuste         Ajuste         Ajuste                   Final    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Cada MÊS tem 4 SEMANAS com checkpoints de peso:                           │
│  • Semana 1: Adaptação                                                     │
│  • Semana 2: Avaliação inicial                                             │
│  • Semana 3: Ajuste se necessário                                          │
│  • Semana 4: Fechamento e preparação próximo mês                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. NAVEGAÇÃO E ESTRUTURA

### 2.1 Hierarquia de Telas

```
Coach IA (lista de alunos)
└── Plano de Evolução
    └── [Atleta Selecionado]
        ├── Etapa 1: Diagnóstico ✓
        ├── Etapa 2: Plano de Treino ✓
        └── Etapa 3: Plano de Dieta ◀── ESTA SPEC
```

### 2.2 Breadcrumb

```
Coach IA  /  Plano de Evolução  /  Leonardo Schweitzer  /  Plano de Dieta
```

### 2.3 Stepper de Progresso

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│      1       │───────│      2       │───────│      3       │
│  DIAGNÓSTICO │       │    TREINO    │       │    DIETA     │
│      ✓       │       │      ✓       │       │   ● ativo    │
└──────────────┘       └──────────────┘       └──────────────┘
```

---

## 3. LAYOUT DA TELA

### 3.1 Estrutura Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Logo + Breadcrumb + Notificações                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SIDEBAR              CONTEÚDO PRINCIPAL                                   │
│  ┌──────────┐        ┌─────────────────────────────────────────────────┐   │
│  │          │        │                                                 │   │
│  │  Menu    │        │  STEPPER (1 ✓ ─── 2 ✓ ─── 3 ●)                 │   │
│  │  lateral │        │                                                 │   │
│  │          │        │  CARD: Resumo Diagnóstico + Treino             │   │
│  │  Coach   │        │                                                 │   │
│  │  IA ◀    │        │  SEÇÃO 1: Estratégia Calórica                  │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 2: Distribuição de Macros               │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 3: Estrutura de Refeições               │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 4: Exemplo de Cardápio                  │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 5: Checkpoints e Ajustes                │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 6: Considerações do VITRÚVIO            │   │
│  │          │        │                                                 │   │
│  │          │        │  FOOTER: [← Treino] [Finalizar Plano →]        │   │
│  │          │        │                                                 │   │
│  └──────────┘        └─────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. SEÇÕES DO PLANO DE DIETA

### 4.1 Card: Resumo das Etapas Anteriores

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  👤 LEONARDO SCHWEITZER                                                     │
│                                                                             │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐     │
│  │  📊 DIAGNÓSTICO               │  │  🏋️ TREINO                     │     │
│  │                               │  │                               │     │
│  │  TDEE: 2.586 kcal            │  │  Divisão: ABCDE               │     │
│  │  Meta BF: 15.8% → 10%        │  │  Frequência: 5x/semana        │     │
│  │  Meta Peso: 82.5 → 80 kg     │  │  Foco: Panturrilha + Deltoides│     │
│  │                               │  │                               │     │
│  └───────────────────────────────┘  └───────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Seção 1: Estratégia Calórica

**Objetivo:** Definir o déficit/superávit e calorias diárias.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔥 ESTRATÉGIA CALÓRICA                                                      │
│ Definição do balanço energético para atingir as metas                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  FASE ATUAL: RECOMPOSIÇÃO CORPORAL (Cutting Moderado)              │   │
│  │                                                                     │   │
│  │  Objetivo: Perder gordura mantendo/ganhando massa magra            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 CÁLCULO DO DÉFICIT                                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   TDEE (Gasto Total)                              2.586 kcal/dia   │   │
│  │                                                                     │   │
│  │   ─────────────────────────────────────────────────────────────    │   │
│  │                                                                     │   │
│  │   Déficit Planejado                                 -400 kcal/dia  │   │
│  │   (moderado para preservar massa magra)              (~15% TDEE)   │   │
│  │                                                                     │   │
│  │   ═════════════════════════════════════════════════════════════    │   │
│  │                                                                     │   │
│  │   CALORIAS DIÁRIAS                                2.186 kcal/dia   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📅 VARIAÇÃO POR DIA                                                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   Tipo de Dia           Calorias       Carbs        Observação     │   │
│  │   ─────────────────────────────────────────────────────────────    │   │
│  │   🏋️ Dias de TREINO      2.300 kcal    280g         Mais carbs     │   │
│  │      (5 dias/semana)                               para energia    │   │
│  │                                                                     │   │
│  │   😴 Dias de DESCANSO    1.950 kcal    180g         Menos carbs    │   │
│  │      (2 dias/semana)                               menos gasto     │   │
│  │                                                                     │   │
│  │   ─────────────────────────────────────────────────────────────    │   │
│  │                                                                     │   │
│  │   MÉDIA SEMANAL          2.186 kcal/dia                            │   │
│  │   DÉFICIT SEMANAL        2.800 kcal (~0.4kg gordura)               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📈 PROJEÇÃO MENSAL                                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   Déficit mensal:        ~12.000 kcal                              │   │
│  │   Perda de gordura:      ~0.4-0.5 kg/mês                           │   │
│  │   Meta mês 1:            82.5 kg → 82.1 kg                         │   │
│  │                          15.8% BF → 15.3% BF                       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💡 INSIGHT DO VITRÚVIO                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ "Déficit de 400 kcal é moderado e permite preservar massa magra,   │   │
│  │  especialmente com o suporte hormonal que você utiliza. Déficits   │   │
│  │  mais agressivos poderiam comprometer performance nos treinos e    │   │
│  │  recuperação. Paciência é a chave para recomposição de qualidade." │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Seção 2: Distribuição de Macros

**Objetivo:** Definir proteína, carboidrato e gordura.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🥩 DISTRIBUIÇÃO DE MACRONUTRIENTES                                          │
│ Proteínas, carboidratos e gorduras para o objetivo                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 MACROS - DIAS DE TREINO (2.300 kcal)                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │    PROTEÍNA     │ │  CARBOIDRATO    │ │    GORDURA      │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │     180g        │ │     280g        │ │      65g        │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │   2.2 g/kg      │ │   3.4 g/kg      │ │   0.8 g/kg      │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │   720 kcal      │ │  1.120 kcal     │ │   585 kcal      │      │   │
│  │  │     31%         │ │      49%        │ │     25%         │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘      │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐  │   │
│  │  │  PROT 31% ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │   │
│  │  │  CARB 49% ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │   │
│  │  │  GORD 25% ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │   │
│  │  └─────────────────────────────────────────────────────────────┘  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 MACROS - DIAS DE DESCANSO (1.950 kcal)                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │    PROTEÍNA     │ │  CARBOIDRATO    │ │    GORDURA      │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │     180g        │ │     180g        │ │      65g        │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │   2.2 g/kg      │ │   2.2 g/kg      │ │   0.8 g/kg      │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  │   720 kcal      │ │   720 kcal      │ │   585 kcal      │      │   │
│  │  │     37%         │ │      37%        │ │     30%         │      │   │
│  │  │                 │ │                 │ │                 │      │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘      │   │
│  │                                                                     │   │
│  │  ⚡ Diferença: -100g de carboidrato nos dias sem treino            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 JUSTIFICATIVA DOS MACROS                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🥩 PROTEÍNA: 2.2 g/kg (180g)                                      │   │
│  │     • Alta para preservar massa magra em déficit                   │   │
│  │     • Suporta síntese proteica com volume alto de treino           │   │
│  │     • Ajustada para uso de TRT (maior síntese)                     │   │
│  │                                                                     │   │
│  │  🍚 CARBOIDRATO: 3.4 g/kg treino / 2.2 g/kg descanso              │   │
│  │     • Ciclagem de carbs para otimizar energia e déficit            │   │
│  │     • Mais carbs = melhor performance no treino                    │   │
│  │     • Menos carbs no descanso = maior oxidação de gordura          │   │
│  │                                                                     │   │
│  │  🥑 GORDURA: 0.8 g/kg (65g)                                        │   │
│  │     • Mínimo saudável para hormônios e absorção de vitaminas       │   │
│  │     • Priorizar fontes mono e poli-insaturadas                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Seção 3: Estrutura de Refeições

**Objetivo:** Distribuir os macros ao longo do dia.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🍽️ ESTRUTURA DE REFEIÇÕES                                                   │
│ Distribuição dos macros ao longo do dia                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📅 DIAS DE TREINO (5 refeições + pós-treino)                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  #   Refeição          Horário    Prot   Carb   Gord   Kcal       │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  1   ☀️ Café da Manhã   07:00      40g    50g    15g    495        │   │
│  │                                                                     │   │
│  │  2   🥪 Lanche Manhã    10:00      25g    30g    10g    310        │   │
│  │                                                                     │   │
│  │  3   🍛 Almoço          13:00      45g    70g    20g    640        │   │
│  │                                                                     │   │
│  │  4   ⚡ Pré-Treino      16:00      25g    50g     5g    345        │   │
│  │      (1h antes do treino)                                          │   │
│  │                                                                     │   │
│  │  ──  🏋️ TREINO          17:00-18:00                                 │   │
│  │                                                                     │   │
│  │  5   💪 Pós-Treino      18:30      30g    50g     5g    365        │   │
│  │      (até 1h após treino)                                          │   │
│  │                                                                     │   │
│  │  6   🌙 Jantar          20:30      15g    30g    10g    270        │   │
│  │      (mais leve)                                                   │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  TOTAL                           180g   280g    65g   2.425*       │   │
│  │                                                                     │   │
│  │  * Pequena variação é normal                                       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📅 DIAS DE DESCANSO (5 refeições)                                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  #   Refeição          Horário    Prot   Carb   Gord   Kcal       │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  1   ☀️ Café da Manhã   08:00      40g    35g    15g    435        │   │
│  │                                                                     │   │
│  │  2   🥪 Lanche Manhã    11:00      30g    25g    15g    355        │   │
│  │                                                                     │   │
│  │  3   🍛 Almoço          14:00      45g    50g    20g    560        │   │
│  │                                                                     │   │
│  │  4   🥗 Lanche Tarde    17:00      30g    35g    10g    350        │   │
│  │                                                                     │   │
│  │  5   🌙 Jantar          20:00      35g    35g     5g    315        │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  TOTAL                           180g   180g    65g   2.015*       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🍕 REFEIÇÃO LIVRE                                                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Frequência: 1x por SEMANA (preferencialmente sábado)              │   │
│  │                                                                     │   │
│  │  Orientações:                                                      │   │
│  │  • Substituir UMA refeição (não o dia todo)                        │   │
│  │  • Comer até satisfação, não até passar mal                        │   │
│  │  • Manter proteína adequada nas outras refeições do dia            │   │
│  │  • Não compensar com jejum no dia seguinte                         │   │
│  │  • Aproveitar sem culpa - faz parte do processo                    │   │
│  │                                                                     │   │
│  │  ⚠️ Se peso estagnar por 2+ semanas, avaliar reduzir para quinzenal│   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.5 Seção 4: Exemplo de Cardápio

**Objetivo:** Dar exemplos práticos de alimentos.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🍴 EXEMPLO DE CARDÁPIO                                                      │
│ Sugestões práticas para os dias de treino                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ☀️ CAFÉ DA MANHÃ (40P / 50C / 15G)                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  OPÇÃO A                         OPÇÃO B                           │   │
│  │  ─────────────────────           ─────────────────────             │   │
│  │  • 4 ovos inteiros               • 150g de peito de frango        │   │
│  │  • 2 fatias pão integral         • 80g de tapioca                  │   │
│  │  • 1 banana média                • 1 banana média                  │   │
│  │  • 30g de pasta de amendoim      • 200ml de suco natural          │   │
│  │                                                                     │   │
│  │  OPÇÃO C                                                           │   │
│  │  ─────────────────────                                             │   │
│  │  • 80g de aveia                                                    │   │
│  │  • 1 scoop whey (30g)                                              │   │
│  │  • 1 banana                                                        │   │
│  │  • 20g de castanhas                                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🍛 ALMOÇO (45P / 70C / 20G)                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  OPÇÃO A                         OPÇÃO B                           │   │
│  │  ─────────────────────           ─────────────────────             │   │
│  │  • 180g de frango grelhado       • 180g de patinho moído          │   │
│  │  • 150g de arroz branco          • 150g de batata doce            │   │
│  │  • 80g de feijão                 • 80g de feijão                   │   │
│  │  • Salada à vontade              • Salada à vontade               │   │
│  │  • 1 colher azeite               • 1 colher azeite                │   │
│  │                                                                     │   │
│  │  OPÇÃO C                                                           │   │
│  │  ─────────────────────                                             │   │
│  │  • 200g de tilápia                                                 │   │
│  │  • 180g de arroz integral                                          │   │
│  │  • Legumes refogados                                               │   │
│  │  • 1 colher de azeite                                              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚡ PRÉ-TREINO (25P / 50C / 5G) - 1h antes                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  OPÇÃO A                         OPÇÃO B                           │   │
│  │  ─────────────────────           ─────────────────────             │   │
│  │  • 1 scoop whey                  • 150g de frango desfiado        │   │
│  │  • 1 banana grande               • 2 fatias pão integral          │   │
│  │  • 30g de aveia                  • 1 fruta                         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💪 PÓS-TREINO (30P / 50C / 5G) - até 1h após                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  OPÇÃO A (shake)                 OPÇÃO B (sólido)                  │   │
│  │  ─────────────────────           ─────────────────────             │   │
│  │  • 1 scoop whey                  • 150g de frango                  │   │
│  │  • 60g de maltodextrina          • 150g de arroz branco           │   │
│  │    ou 2 bananas                  • Pouco tempero/gordura           │   │
│  │  • 200ml de água                                                   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 LISTA DE ALIMENTOS SUGERIDOS                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🥩 PROTEÍNAS           🍚 CARBOIDRATOS       🥑 GORDURAS          │   │
│  │  ─────────────────      ─────────────────     ─────────────────    │   │
│  │  • Frango               • Arroz branco        • Azeite de oliva   │   │
│  │  • Patinho              • Arroz integral      • Castanhas         │   │
│  │  • Tilápia              • Batata doce         • Amendoim          │   │
│  │  • Atum                 • Batata inglesa      • Abacate           │   │
│  │  • Ovos                 • Aveia               • Gema de ovo       │   │
│  │  • Whey protein         • Pão integral        • Pasta de amend.   │   │
│  │  • Carne vermelha       • Macarrão            • Óleo de coco      │   │
│  │  • Queijo cottage       • Frutas                                   │   │
│  │                         • Tapioca                                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.6 Seção 5: Checkpoints e Ajustes

**Objetivo:** Definir regras de monitoramento e ajuste.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 CHECKPOINTS E AJUSTES                                                    │
│ Monitoramento semanal e regras de ajuste                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📅 CRONOGRAMA DO MÊS 1                                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   Semana    Peso Esperado    Ação                                  │   │
│  │   ─────────────────────────────────────────────────────────────    │   │
│  │                                                                     │   │
│  │   Início    82.5 kg          Peso inicial (média de 3 dias)       │   │
│  │                                                                     │   │
│  │   Sem 1     82.3 kg          Adaptação - pode haver retenção      │   │
│  │             (±0.3kg)         Não ajustar ainda                     │   │
│  │                                                                     │   │
│  │   Sem 2     82.1 kg          Primeira avaliação real              │   │
│  │             (±0.2kg)         Verificar tendência                   │   │
│  │                                                                     │   │
│  │   Sem 3     82.0 kg          Ajustar se necessário                │   │
│  │             (±0.2kg)         Ver regras abaixo                     │   │
│  │                                                                     │   │
│  │   Sem 4     81.8 kg          Fechamento do mês                    │   │
│  │             (±0.2kg)         Preparar próximo ciclo               │   │
│  │                                                                     │   │
│  │   ─────────────────────────────────────────────────────────────    │   │
│  │   Meta Mês 1:  -0.4 a -0.5 kg de gordura                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚖️ COMO PESAR CORRETAMENTE                                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ✅ FAZER:                                                          │   │
│  │  • Pesar todos os dias, de manhã, após ir ao banheiro             │   │
│  │  • Usar MÉDIA de 7 dias (não peso diário isolado)                 │   │
│  │  • Sempre na mesma balança                                         │   │
│  │  • Sem roupa ou sempre com a mesma                                 │   │
│  │                                                                     │   │
│  │  ❌ NÃO FAZER:                                                      │   │
│  │  • Entrar em pânico com variação diária (normal até 1kg)          │   │
│  │  • Pesar após refeição livre                                       │   │
│  │  • Comparar manhã com noite                                        │   │
│  │  • Ajustar dieta baseado em 1 dia                                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🔧 REGRAS DE AJUSTE                                                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  CENÁRIO                          AJUSTE                           │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  ✅ Peso caindo 0.3-0.5 kg/sem    Manter tudo igual               │   │
│  │     (dentro do esperado)          Está funcionando!                │   │
│  │                                                                     │   │
│  │  ⚠️ Peso caindo >0.7 kg/sem       AUMENTAR 100 kcal               │   │
│  │     (muito rápido)                Pode perder massa magra          │   │
│  │                                                                     │   │
│  │  ⚠️ Peso estagnado 2+ semanas     REDUZIR 100 kcal                │   │
│  │     (platô)                       OU adicionar 20min cardio       │   │
│  │                                                                     │   │
│  │  ⚠️ Peso subindo                  Revisar aderência               │   │
│  │     (direção errada)              Se ok, REDUZIR 150 kcal         │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  📍 ONDE AJUSTAR:                                                  │   │
│  │  • Primeiro: carboidratos (±25g = ~100 kcal)                      │   │
│  │  • Nunca reduzir proteína                                         │   │
│  │  • Gordura: mínimo 0.7 g/kg                                       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📈 OUTROS INDICADORES PARA MONITORAR                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Indicador              Frequência      Esperado                   │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  Peso (média 7 dias)    Semanal         -0.3 a -0.5 kg/sem        │   │
│  │  Medida cintura         Quinzenal       Reduzindo gradualmente     │   │
│  │  Fotos comparativas     Mensal          Mudança visual             │   │
│  │  Energia no treino      Diário          Boa/estável                │   │
│  │  Fome                   Diário          Controlável                │   │
│  │  Sono                   Diário          7-8h, qualidade boa        │   │
│  │                                                                     │   │
│  │  ⚠️ Se energia cair muito ou fome ficar insuportável,             │   │
│  │     considerar refeed ou reduzir déficit.                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.7 Seção 6: Considerações do VITRÚVIO

**Objetivo:** Resumo final e próximos passos.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💬 CONSIDERAÇÕES DO VITRÚVIO                                                │
│ Observações finais sobre o plano alimentar                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🎯 ESTRATÉGIA PRINCIPAL                                            │   │
│  │                                                                     │   │
│  │  "Este plano foi desenhado para recomposição corporal - perder    │   │
│  │   gordura enquanto mantém ou ganha massa magra. O déficit de      │   │
│  │   400 kcal é moderado, permitindo boa energia para os treinos    │   │
│  │   intensos que planejamos."                                        │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  ⚠️ PONTOS DE ATENÇÃO                                               │   │
│  │                                                                     │   │
│  │  1. CONSISTÊNCIA > PERFEIÇÃO                                       │   │
│  │     Seguir 80-90% do plano consistentemente é melhor que           │   │
│  │     100% por 3 dias e depois abandonar. Se errar uma refeição,    │   │
│  │     volte na próxima. Não "compense".                              │   │
│  │                                                                     │   │
│  │  2. HIDRATAÇÃO                                                     │   │
│  │     Mínimo 3 litros de água por dia.                               │   │
│  │     Mais em dias de treino e calor.                                │   │
│  │     Água ajuda no metabolismo e na saciedade.                      │   │
│  │                                                                     │   │
│  │  3. TIMING PÓS-TREINO                                              │   │
│  │     A janela pós-treino é real mas não mágica.                     │   │
│  │     Ideal: comer em até 2h após treino.                            │   │
│  │     Priorizar proteína + carboidrato.                              │   │
│  │                                                                     │   │
│  │  4. FLEXIBILIDADE COM CONTROLE                                     │   │
│  │     A refeição livre semanal é importante psicologicamente.        │   │
│  │     Mas se peso estagnar, pode ser preciso revisar.                │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  📊 CONTEXTO CONSIDERADO                                           │   │
│  │                                                                     │   │
│  │  • Profissão sedentária (programador, home office)                 │   │
│  │    → NEAT baixo já considerado no TDEE                             │   │
│  │                                                                     │   │
│  │  • Uso de TRT                                                      │   │
│  │    → Proteína alta (2.2g/kg) para aproveitar síntese aumentada    │   │
│  │    → Déficit moderado (preserva massa com suporte hormonal)        │   │
│  │                                                                     │   │
│  │  • Treino 5x/semana de alta intensidade                           │   │
│  │    → Ciclagem de carbs para suportar performance                   │   │
│  │    → Pós-treino bem estruturado                                    │   │
│  │                                                                     │   │
│  │  • Sem restrições alimentares informadas                           │   │
│  │    → Cardápio diversificado                                        │   │
│  │    → Ajustar se houver intolerâncias                               │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  ✅ PLANO DE EVOLUÇÃO COMPLETO!                                     │   │
│  │                                                                     │   │
│  │  Você agora tem:                                                   │   │
│  │  ✓ Diagnóstico completo com metas de 12 meses                     │   │
│  │  ✓ Plano de treino trimestral com periodização                    │   │
│  │  ✓ Plano de dieta mensal com checkpoints                          │   │
│  │                                                                     │   │
│  │  Próximos passos:                                                  │   │
│  │  1. Revisar e aprovar este plano completo                         │   │
│  │  2. Iniciar execução na próxima segunda-feira                     │   │
│  │  3. Registrar peso diariamente                                     │   │
│  │  4. Feedback semanal para ajustes                                  │   │
│  │  5. Nova avaliação de medidas em 30 dias                          │   │
│  │  6. Renovação do plano de dieta mensalmente                        │   │
│  │                                                                     │   │
│  │  "Leonardo, seu plano está completo! Com consistência e           │   │
│  │   dedicação, em 12 meses você estará na classificação ELITE.      │   │
│  │   Estou aqui para ajustar o que for necessário ao longo do       │   │
│  │   caminho. Vamos juntos nessa jornada!"                           │   │
│  │                                                                     │   │
│  │                                           — VITRÚVIO IA            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. ESTRUTURA DE DADOS

```typescript
interface PlanoDietaEvolucao {
  id: string
  planoEvolucaoId: string
  atletaId: string
  mes: number                        // 1, 2, 3... 12
  
  // Estratégia calórica
  estrategia: {
    fase: 'CUTTING' | 'BULKING' | 'MANUTENCAO' | 'RECOMPOSICAO'
    tdee: number
    deficit_superavit: number        // -400, +300, etc
    caloriasDiarias: {
      diasTreino: number
      diasDescanso: number
      mediaSemanal: number
    }
    deficitSemanal: number
    projecaoMensal: {
      perdaGordura: number
      pesoInicial: number
      pesoFinal: number
      bfInicial: number
      bfFinal: number
    }
  }
  
  // Macronutrientes
  macros: {
    diasTreino: {
      proteina: { gramas: number; gKg: number; kcal: number; pct: number }
      carboidrato: { gramas: number; gKg: number; kcal: number; pct: number }
      gordura: { gramas: number; gKg: number; kcal: number; pct: number }
      total: number
    }
    diasDescanso: {
      proteina: { gramas: number; gKg: number; kcal: number; pct: number }
      carboidrato: { gramas: number; gKg: number; kcal: number; pct: number }
      gordura: { gramas: number; gKg: number; kcal: number; pct: number }
      total: number
    }
    justificativa: {
      proteina: string
      carboidrato: string
      gordura: string
    }
  }
  
  // Estrutura de refeições
  refeicoes: {
    diasTreino: {
      quantidade: number
      estrutura: Array<{
        numero: number
        nome: string
        horario: string
        proteina: number
        carboidrato: number
        gordura: number
        kcal: number
        observacao?: string
      }>
    }
    diasDescanso: {
      quantidade: number
      estrutura: Array<{
        numero: number
        nome: string
        horario: string
        proteina: number
        carboidrato: number
        gordura: number
        kcal: number
      }>
    }
    refeicaoLivre: {
      frequencia: 'SEMANAL' | 'QUINZENAL'
      orientacoes: string[]
    }
  }
  
  // Cardápio exemplo
  cardapio: {
    refeicoes: Array<{
      nome: string
      macros: string
      opcoes: Array<{
        letra: string
        itens: string[]
      }>
    }>
    alimentosSugeridos: {
      proteinas: string[]
      carboidratos: string[]
      gorduras: string[]
    }
  }
  
  // Checkpoints
  checkpoints: {
    cronograma: Array<{
      semana: number
      pesoEsperado: number
      tolerancia: number
      acao: string
    }>
    comoPesar: {
      fazer: string[]
      naoFazer: string[]
    }
    regrasAjuste: Array<{
      cenario: string
      ajuste: string
    }>
    outrosIndicadores: Array<{
      indicador: string
      frequencia: string
      esperado: string
    }>
  }
  
  // Considerações
  consideracoes: {
    estrategiaPrincipal: string
    pontosAtencao: Array<{
      titulo: string
      descricao: string
    }>
    contextoConsiderado: string[]
    proximosPassos: string[]
    mensagemFinal: string
  }
  
  // Status
  status: 'RASCUNHO' | 'AGUARDANDO_APROVACAO' | 'APROVADO' | 'ATIVO' | 'CONCLUIDO'
  
  // Feedback semanal (preenchido durante execução)
  feedbacks: Array<{
    semana: number
    pesoMedio: number
    fome: 1 | 2 | 3 | 4 | 5
    energia: 1 | 2 | 3 | 4 | 5
    aderencia: number              // % estimado
    observacoes: string
    ajusteRealizado?: string
  }>
  
  // Metadata
  geradoEm: Date
  aprovadoEm?: Date
  aprovadoPor?: 'PERSONAL' | 'ATLETA'
}
```

---

## 6. CÁLCULOS

### 6.1 Déficit Calórico

```typescript
function calcularDeficit(
  objetivo: 'CUTTING' | 'RECOMPOSICAO',
  tdee: number,
  pesoAtual: number,
  usaHormonios: boolean
): number {
  // Base: 15-25% do TDEE para cutting
  // Recomposição: 10-15% mais moderado
  
  let percentual: number
  
  if (objetivo === 'CUTTING') {
    percentual = usaHormonios ? 0.20 : 0.15  // Mais agressivo com suporte
  } else {
    percentual = usaHormonios ? 0.15 : 0.12  // Moderado para recomposição
  }
  
  const deficit = Math.round(tdee * percentual)
  
  // Limites de segurança
  const minCalorias = pesoAtual * 22  // Mínimo ~22 kcal/kg
  const caloriasFinal = tdee - deficit
  
  if (caloriasFinal < minCalorias) {
    return tdee - minCalorias
  }
  
  return deficit
}
```

### 6.2 Distribuição de Macros

```typescript
function calcularMacros(
  calorias: number,
  peso: number,
  objetivo: string,
  usaHormonios: boolean
): Macros {
  // Proteína: 1.8-2.4 g/kg (mais alta com déficit e/ou hormônios)
  const proteinaGKg = usaHormonios ? 2.2 : 2.0
  const proteinaG = Math.round(peso * proteinaGKg)
  const proteinaKcal = proteinaG * 4
  
  // Gordura: 0.7-1.0 g/kg (mínimo para saúde hormonal)
  const gorduraGKg = 0.8
  const gorduraG = Math.round(peso * gorduraGKg)
  const gorduraKcal = gorduraG * 9
  
  // Carboidrato: resto das calorias
  const carboidratoKcal = calorias - proteinaKcal - gorduraKcal
  const carboidratoG = Math.round(carboidratoKcal / 4)
  const carboidratoGKg = carboidratoG / peso
  
  return {
    proteina: { gramas: proteinaG, gKg: proteinaGKg, kcal: proteinaKcal },
    carboidrato: { gramas: carboidratoG, gKg: carboidratoGKg, kcal: carboidratoKcal },
    gordura: { gramas: gorduraG, gKg: gorduraGKg, kcal: gorduraKcal }
  }
}
```

---

## 7. AÇÕES DA TELA

| Botão | Ação |
|-------|------|
| **← Plano de Treino** | Retorna para Etapa 2 |
| **Finalizar Plano →** | Conclui o Plano de Evolução completo |
| **Regenerar Plano** | Recria o plano de dieta |
| **Exportar PDF** | Gera PDF do plano |
| **Editar** | Permite ajustes manuais (Personal) |

---

## 8. REGRAS DE NEGÓCIO

### 8.1 Limites de Déficit

| Situação | Déficit Máximo | Motivo |
|----------|----------------|--------|
| Com TRT/hormônios | 20-25% TDEE | Preserva massa com suporte |
| Natural | 15-20% TDEE | Mais conservador |
| Iniciante | 10-15% TDEE | Adaptação ao déficit |

### 8.2 Proteína Mínima

| Situação | Proteína (g/kg) |
|----------|-----------------|
| Cutting agressivo | 2.2 - 2.4 |
| Cutting moderado | 2.0 - 2.2 |
| Recomposição | 1.8 - 2.2 |
| Bulking | 1.6 - 2.0 |

### 8.3 Gordura Mínima

- **Mínimo absoluto:** 0.7 g/kg
- **Ideal:** 0.8 - 1.0 g/kg
- **Nunca abaixo de 50g/dia** (saúde hormonal)

### 8.4 Ajustes Semanais

| Cenário | Ajuste |
|---------|--------|
| Perda 0.3-0.5 kg/sem | Manter |
| Perda >0.7 kg/sem | +100 kcal (carbs) |
| Estagnado 2+ sem | -100 kcal ou +cardio |
| Subindo | Revisar aderência, depois -150 kcal |

---

## 9. INTEGRAÇÃO COM METODOLOGIA DO PERSONAL

Se o Personal tiver metodologia cadastrada com preferências de dieta:

```typescript
const gerarDietaComMetodologia = (
  diagnostico: Diagnostico,
  metodologia: MetodologiaPersonal
) => {
  // 1. Usar abordagem preferida
  const abordagem = metodologia.dieta.abordagem.tipo  // FLEXIVEL, ESTRUTURADA, etc
  
  // 2. Respeitar faixas de macros
  const proteinaRange = metodologia.dieta.macros.proteina  // min-max g/kg
  
  // 3. Usar número de refeições preferido
  const refeicoes = metodologia.dieta.refeicoes.ideal
  
  // 4. Aplicar estratégias permitidas
  const estrategias = metodologia.dieta.estrategias.usadas  // carb cycling, etc
  
  // 5. Evitar estratégias na lista negra
  const evitar = metodologia.dieta.estrategias.evitadas  // jejum, etc
}
```

---

## 10. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |
| 1.1 | Mar/2026 | Estado real da implementação |

---

## 11. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### Componente Principal
- `DietaView.tsx` (23.4K) em `templates/Personal/` — Renderiza plano de dieta completo

### Service de Cálculo
- `dieta.ts` (45K) em `services/calculations/` — Motor de dieta completo
  - Estratégia calórica (superávit, déficit, manutenção)
  - Distribuição de macronutrientes (proteína, carboidrato, gordura)
  - Estrutura de refeições (5-6 por dia)
  - Menu exemplo com alimentos e quantidades

### O Que Está Funcionando ✅
- [x] Estratégia calórica baseada no objetivo e TDEE
- [x] Distribuição de macros por refeição
- [x] Estrutura de 5-6 refeições diárias
- [x] Menu exemplo com substituições
- [x] Checkpoints de reavaliação (mensal)
- [x] Insights do Vitrúvio sobre dieta
- [x] Editabilidade pelo personal trainer (DietaView)
- [x] Integração com fluxo de aprovação

### Pendências
- [ ] Exportar PDF
- [ ] Lista de compras automática
- [ ] Integração com apps de contagem calórica

---

**VITRU IA - Plano de Evolução: Etapa 3 - Plano de Dieta v1.1**
