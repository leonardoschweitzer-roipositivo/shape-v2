# SPEC: Plano de Evolução - Etapa 1: Diagnóstico

## Análise Completa do Atleta

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA  
**Módulo:** VITRÚVIO IA - Plano de Evolução  
**Etapa:** 1 de 3

---

## 1. VISÃO GERAL

### 1.1 O que é o Diagnóstico?

O **Diagnóstico** é a primeira etapa do Plano de Evolução. O VITRÚVIO analisa profundamente o atleta para entender seu ponto de partida e definir metas realistas para 12 meses.

### 1.2 Objetivo

> "Entender ONDE o atleta está hoje para definir ONDE ele pode chegar em 12 meses, com metas intermediárias mensais e semestrais."

### 1.3 O que o Diagnóstico Analisa

| # | Análise | Descrição |
|---|---------|-----------|
| 1 | **Taxas Metabólicas** | TMB, TMB+NEAT, TDEE baseado no contexto |
| 2 | **Composição Corporal** | Peso, gordura %, massa magra, massa gorda |
| 3 | **Análise Estética** | Score, classificação, proporções por grupo |
| 4 | **Simetria** | Assimetrias bilaterais identificadas |
| 5 | **Pontos Fortes/Fracos** | Grupos acima e abaixo do ideal |
| 6 | **Metas 12 Meses** | Objetivos de proporções (trimestral) e composição (mensal) |

---

## 2. NAVEGAÇÃO E ESTRUTURA

### 2.1 Hierarquia de Telas

```
Coach IA (lista de alunos)
└── Plano de Evolução
    └── [Atleta Selecionado]
        ├── Etapa 1: Diagnóstico ◀── ESTA SPEC
        ├── Etapa 2: Plano de Treino
        └── Etapa 3: Plano de Dieta
```

### 2.2 Breadcrumb

```
Coach IA  /  Plano de Evolução  /  Leonardo Schweitzer  /  Diagnóstico
```

### 2.3 Stepper de Progresso

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│      1       │───────│      2       │───────│      3       │
│  DIAGNÓSTICO │       │    TREINO    │       │    DIETA     │
│   ● ativo    │       │      ○       │       │      ○       │
└──────────────┘       └──────────────┘       └──────────────┘
```

---

## 3. LAYOUT DA TELA

### 3.1 Estrutura Geral

A tela de Diagnóstico deve ser uma **tela completa** (não popup/modal), seguindo o mesmo padrão visual da tela "Coach IA", com sidebar, header e área de conteúdo.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: Logo + Breadcrumb + Notificações + Ações                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SIDEBAR              CONTEÚDO PRINCIPAL                                   │
│  ┌──────────┐        ┌─────────────────────────────────────────────────┐   │
│  │          │        │                                                 │   │
│  │  Menu    │        │  STEPPER (1 ● ─── 2 ○ ─── 3 ○)                 │   │
│  │  lateral │        │                                                 │   │
│  │          │        │  CARD: Info do Atleta Selecionado              │   │
│  │  Coach   │        │                                                 │   │
│  │  IA ◀    │        │  SEÇÃO 1: Taxas Metabólicas                    │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 2: Composição Corporal                  │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 3: Análise Estética                     │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 4: Pontos Fortes e Fracos               │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 5: Metas de 12 Meses                    │   │
│  │          │        │                                                 │   │
│  │          │        │  FOOTER: [← Voltar] [Próximo: Plano Treino →]  │   │
│  │          │        │                                                 │   │
│  └──────────┘        └─────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. SEÇÕES DO DIAGNÓSTICO

### 4.1 Card: Informações do Atleta

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  👤 LEONARDO SCHWEITZER                                                     │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   SCORE     │  │   RATIO     │  │   STATUS    │  │  AVALIAÇÃO  │       │
│  │    86.2     │  │    1.48     │  │    META     │  │  15/02/2026 │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Seção 1: Taxas Metabólicas

**Objetivo:** Calcular o gasto calórico diário considerando o CONTEXTO do atleta.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 TAXAS METABÓLICAS                                                        │
│ Cálculo do gasto calórico diário baseado no contexto do atleta             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │      TMB        │  │   TMB + NEAT    │  │      TDEE       │            │
│  │                 │  │                 │  │                 │            │
│  │    1.847        │  │     2.124       │  │     2.586       │            │
│  │    kcal/dia     │  │    kcal/dia     │  │    kcal/dia     │            │
│  │                 │  │                 │  │                 │            │
│  │  Taxa Metab.    │  │  + Atividades   │  │   + Treino      │            │
│  │  Basal          │  │    Diárias      │  │   (5-6x/sem)    │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 FATORES CONSIDERADOS DO CONTEXTO                                       │
│                                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐       │
│  │ 📐 DADOS BASE                │  │ 💼 PROFISSÃO                 │       │
│  │ Idade: 32 anos               │  │ Cargo: Programador           │       │
│  │ Sexo: Masculino              │  │ Tipo: Home Office            │       │
│  │ Altura: 178 cm               │  │ Horas sentado: 10h/dia       │       │
│  │ Peso: 82.5 kg                │  │ Nível: Sedentário            │       │
│  └──────────────────────────────┘  └──────────────────────────────┘       │
│                                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐       │
│  │ 🏋️ HISTÓRICO DE TREINO       │  │ 💊 MEDICAÇÕES                │       │
│  │ Tempo: Desde os 16 anos      │  │ Enantato 250mg (10/10 dias)  │       │
│  │ Frequência: 5-6x/semana      │  │ Dizebatida 2.5mg (10/10 dias)│       │
│  │ Duração: 60-75 min           │  │                              │       │
│  │ Intensidade: Alta            │  │ ⚡ Ajuste: +10% metabolismo  │       │
│  └──────────────────────────────┘  └──────────────────────────────┘       │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📈 GRÁFICO: COMPOSIÇÃO DO GASTO CALÓRICO DIÁRIO                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2.586 kcal/dia                                                     │   │
│  │  ┌────────────────────────────┬──────────┬───────────────────────┐ │   │
│  │  │           TMB              │   NEAT   │      Treino (EAT)     │ │   │
│  │  │        1.847 kcal          │ 277 kcal │       462 kcal        │ │   │
│  │  │           71%              │   11%    │         18%           │ │   │
│  │  └────────────────────────────┴──────────┴───────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💡 INSIGHT DO VITRÚVIO                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ "Seu gasto com atividades diárias (NEAT) é baixo devido ao         │   │
│  │  trabalho sedentário em home office. Incluir caminhadas de         │   │
│  │  20-30min pode aumentar seu TDEE em ~150-200 kcal/dia."            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Seção 2: Composição Corporal

**Objetivo:** Analisar distribuição atual e projetar metas de recomposição.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏋️ COMPOSIÇÃO CORPORAL                                                      │
│ Análise da distribuição de massa magra e gordura                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────┐  ┌────────────────────────────────┐│
│  │        PESO TOTAL: 82.5 kg        │  │      GORDURA: 15.8%            ││
│  │                                    │  │                                ││
│  │   ┌──────────────┬──────────────┐  │  │   ████████████████░░░░░░░░    ││
│  │   │ Massa Magra  │ Massa Gorda  │  │  │                                ││
│  │   │   69.5 kg    │   13.0 kg    │  │  │   Faixa ideal: 10-15%         ││
│  │   │    84.2%     │    15.8%     │  │  │   Status: Levemente acima     ││
│  │   └──────────────┴──────────────┘  │  │                                ││
│  └────────────────────────────────────┘  └────────────────────────────────┘│
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 COMPARATIVO: ATUAL vs META 12 MESES                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │          ATUAL                              META (12 meses)         │   │
│  │                                                                     │   │
│  │     ┌───────────────┐                    ┌───────────────┐          │   │
│  │     │ ████████████  │  69.5kg           │ █████████████  │  72.0kg  │   │
│  │     │ ████████████  │  Massa Magra      │ █████████████  │  Magra   │   │
│  │     │ ░░░░░░░░░░░░  │  13.0kg           │ ░░░░░░░░░░░░  │  8.0kg   │   │
│  │     │               │  Massa Gorda      │               │  Gorda   │   │
│  │     └───────────────┘                    └───────────────┘          │   │
│  │        82.5 kg | 15.8% BF                  80.0 kg | 10.0% BF       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📈 TABELA DE PROJEÇÃO                                                     │
│                                                                             │
│  ┌──────────────┬───────────┬───────────┬───────────┬───────────┐         │
│  │              │  ATUAL    │  6 MESES  │ 12 MESES  │  MUDANÇA  │         │
│  ├──────────────┼───────────┼───────────┼───────────┼───────────┤         │
│  │ Peso Total   │  82.5 kg  │  81.0 kg  │  80.0 kg  │   -2.5 kg │         │
│  │ Massa Magra  │  69.5 kg  │  70.5 kg  │  72.0 kg  │   +2.5 kg │         │
│  │ Massa Gorda  │  13.0 kg  │  10.5 kg  │   8.0 kg  │   -5.0 kg │         │
│  │ Gordura (%)  │  15.8%    │  13.0%    │  10.0%    │   -5.8%   │         │
│  └──────────────┴───────────┴───────────┴───────────┴───────────┘         │
│                                                                             │
│  💡 INSIGHT DO VITRÚVIO                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ "Meta de recomposição: perder 5kg de gordura e ganhar 2.5kg de      │   │
│  │  massa magra. O peso cairá apenas 2.5kg, mas a mudança visual      │   │
│  │  será significativa. Com seu histórico e TRT, meta é realista."    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Seção 3: Análise Estética

**Objetivo:** Avaliar proporções baseadas na Proporção Áurea.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⭐ ANÁLISE ESTÉTICA                                                         │
│ Avaliação baseada na Proporção Áurea (φ = 1.618)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────┐  ┌────────────────────────────────┐│
│  │         SCORE GERAL: 86.2         │  │       CLASSIFICAÇÃO: META      ││
│  │                                    │  │                                ││
│  │   ████████████████████░░░░░░░░░   │  │   INÍCIO    < 70               ││
│  │                                    │  │   CAMINHO   70-84              ││
│  │   Meta 12 meses: 92+ (ELITE)      │  │   META      85-94  ◀── VOCÊ    ││
│  │                                    │  │   ELITE     95-100             ││
│  └────────────────────────────────────┘  └────────────────────────────────┘│
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 PROPORÇÕES POR GRUPO MUSCULAR                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Grupo           Atual    Ideal      %      Status      Progresso  │   │
│  │  ───────────────────────────────────────────────────────────────── │   │
│  │  Shape-V         1.48     1.618     91%     META     ████████████░░│   │
│  │  Peitoral        109 cm   115 cm    95%     META     █████████████░│   │
│  │  Braço D         41.5 cm  42.5 cm   98%     META     ██████████████│   │
│  │  Braço E         40.2 cm  42.5 cm   95%     META     █████████████░│   │
│  │  Antebraço D     32.0 cm  33.0 cm   97%     META     █████████████░│   │
│  │  Antebraço E     31.5 cm  33.0 cm   95%     META     █████████████░│   │
│  │  Coxa D          62.0 cm  64.0 cm   97%     META     █████████████░│   │
│  │  Coxa E          61.5 cm  64.0 cm   96%     META     █████████████░│   │
│  │  Panturrilha D   38.0 cm  41.5 cm   92%     META     ████████████░░│   │
│  │  Panturrilha E   37.5 cm  41.5 cm   90%     CAMINHO  ███████████░░░│   │
│  │  Cintura         82.0 cm  80.0 cm   97%     META     █████████████░│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐│
│  │  📈 GRÁFICO RADAR               │  │  ⚖️ ANÁLISE DE SIMETRIA          ││
│  │                                  │  │                                  ││
│  │         Shape-V 91%              │  │  Score de Simetria: 96.2%       ││
│  │             ▲                    │  │  Status: EXCELENTE              ││
│  │            /│\                   │  │                                  ││
│  │ Peitoral  / │ \   Braços        │  │  ┌────────────────────────────┐ ││
│  │   95%    /  │  \    97%         │  │  │Grupo       D      E   Diff │ ││
│  │     ───●────●────●───           │  │  │Braço     41.5   40.2  -3.1%│ ││
│  │ Cintura  \  │  /   Coxas        │  │  │Antebraço 32.0   31.5  -1.6%│ ││
│  │   97%     \ │ /      97%        │  │  │Coxa      62.0   61.5  -0.8%│ ││
│  │            \│/                  │  │  │Panturr.  38.0   37.5  -1.3%│ ││
│  │             ▼                   │  │  └────────────────────────────┘ ││
│  │       Panturrilha 91%           │  │                                  ││
│  │                                  │  │  ⚠️ Atenção: Bíceps E -3.1%     ││
│  │  ─── Atual   - - - Ideal        │  │     Trabalho unilateral indicado││
│  └──────────────────────────────────┘  └──────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.5 Seção 4: Pontos Fortes e Fracos

**Objetivo:** Identificar prioridades para o plano de treino.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💪 PONTOS FORTES E FRACOS                                                   │
│ Prioridades de desenvolvimento para o plano de treino                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────────────────────┐  ┌────────────────────────────────┐│
│  │  ✅ PONTOS FORTES                  │  │  ⚠️ PONTOS FRACOS              ││
│  │                                    │  │                                ││
│  │  🏆 Braço Direito       98%       │  │  🔻 Panturrilha E    90%       ││
│  │     Muito próximo do ideal        │  │     Prioridade: ALTA           ││
│  │                                    │  │     Meta: +4cm                 ││
│  │  🏆 Coxa Direita        97%       │  │                                ││
│  │     Excelente proporção           │  │  🔻 Shape-V          91%       ││
│  │                                    │  │     Prioridade: ALTA           ││
│  │  🏆 Antebraço Direito   97%       │  │     Foco: deltoides laterais   ││
│  │     Bem desenvolvido              │  │                                ││
│  │                                    │  │  🔻 Panturrilha D    92%       ││
│  │                                    │  │     Prioridade: MÉDIA          ││
│  └────────────────────────────────────┘  └────────────────────────────────┘│
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🎯 PRIORIDADES DE DESENVOLVIMENTO (Ordem de Foco no Treino)               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │   #   Prioridade   Grupo                Atual → Meta    Observação │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │   1   🔴 ALTA      Panturrilhas (ambas) 37.5 → 41.5cm   +4.0 cm    │   │
│  │   2   🔴 ALTA      Deltoides laterais   ratio 1.48→1.618  Shape-V │   │
│  │   3   🟡 MÉDIA     Bíceps esquerdo      40.2 → 42.5cm   Assimetria│   │
│  │   4   🟢 BAIXA     Peitoral             109 → 115cm     +6.0 cm   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💡 INSIGHT DO VITRÚVIO                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ "Suas panturrilhas são o ponto mais distante do ideal e terão      │   │
│  │  prioridade máxima. Focar em deltoides laterais vai melhorar seu   │   │
│  │  Shape-V significativamente. A assimetria de bíceps será corrigida │   │
│  │  com trabalho unilateral no início dos treinos de braço."          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.6 Seção 5: Metas de 12 Meses

**Objetivo:** Definir objetivos claros com checkpoints.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🎯 METAS DE 12 MESES                                                        │
│ Objetivos e checkpoints do plano de evolução                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🏆 META PRINCIPAL: ATINGIR CLASSIFICAÇÃO ELITE                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │    ATUAL                  6 MESES                 12 MESES          │   │
│  │     86.2        ─────────▶   89         ─────────▶    92+          │   │
│  │     META                     META                     ELITE         │   │
│  │                                                                     │   │
│  │  ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │              Progresso atual: 86.2 / 92 (93.7%)                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 METAS DE PROPORÇÕES (Checkpoints Trimestrais)                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Grupo              Atual     3M       6M       9M      12M   Ideal│   │
│  │  ───────────────────────────────────────────────────────────────── │   │
│  │  🔴 Panturrilha E   37.5cm   38.5cm   39.5cm   40.5cm  41.5   41.5│   │
│  │  🔴 Panturrilha D   38.0cm   39.0cm   40.0cm   41.0cm  41.5   41.5│   │
│  │  🔴 Shape-V         1.48     1.52     1.56     1.60    1.618  1.618│   │
│  │  🟡 Braço E         40.2cm   40.8cm   41.5cm   42.0cm  42.5   42.5│   │
│  │  🟢 Peitoral        109cm    111cm    113cm    114cm   115    115 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 METAS DE COMPOSIÇÃO CORPORAL (Checkpoints Mensais)                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Mês    │ Peso    │ BF%    │ M.Magra  │ M.Gorda  │ Δ Gorda │ Δ MM  │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  Atual  │ 82.5 kg │ 15.8%  │ 69.5 kg  │ 13.0 kg  │    -    │   -   │   │
│  │  Mês 3  │ 81.6 kg │ 14.3%  │ 69.9 kg  │ 11.7 kg  │ -1.3 kg │+0.4 kg│   │
│  │  Mês 6  │ 81.0 kg │ 13.0%  │ 70.5 kg  │ 10.5 kg  │ -2.5 kg │+1.0 kg│   │
│  │  Mês 9  │ 80.5 kg │ 11.5%  │ 71.2 kg  │  9.3 kg  │ -3.7 kg │+1.7 kg│   │
│  │  Mês 12 │ 80.0 kg │ 10.0%  │ 72.0 kg  │  8.0 kg  │ -5.0 kg │+2.5 kg│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📅 CHECKPOINTS DE AVALIAÇÃO                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │   📊 AVALIAÇÃO INICIAL        Hoje (baseline)                      │   │
│  │      Score: 86.2 | BF: 15.8% | Peso: 82.5kg                       │   │
│  │                                                                     │   │
│  │   📊 AVALIAÇÃO 6 MESES        Checkpoint intermediário             │   │
│  │      Meta: Score 89 | BF: 13% | Peso: 81kg                        │   │
│  │                                                                     │   │
│  │   📊 AVALIAÇÃO 12 MESES       Avaliação final                      │   │
│  │      Meta: Score 92+ | BF: 10% | Peso: 80kg                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💬 RESUMO DO VITRÚVIO                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  "Leonardo, você está na classificação META com score 86.2.        │   │
│  │                                                                     │   │
│  │   Em 12 meses, com foco em panturrilhas e deltoides laterais,     │   │
│  │   você pode atingir a classificação ELITE (92+).                   │   │
│  │                                                                     │   │
│  │   Na composição corporal, a meta é uma recomposição clássica:     │   │
│  │   perder 5kg de gordura e ganhar 2.5kg de massa magra.            │   │
│  │                                                                     │   │
│  │   Com seu histórico desde os 16 anos, frequência de 5-6x/semana,  │   │
│  │   e suporte hormonal, essas metas são desafiadoras mas realistas. │   │
│  │                                                                     │   │
│  │   Vamos montar o plano de treino para fazer isso acontecer!"      │   │
│  │                                                                     │   │
│  │                                           — VITRÚVIO IA            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. CÁLCULOS E FÓRMULAS

### 5.1 Taxa Metabólica Basal (TMB)

```typescript
// Fórmula de Mifflin-St Jeor
function calcularTMB(peso: number, altura: number, idade: number, sexo: 'M' | 'F'): number {
  if (sexo === 'M') {
    return (10 * peso) + (6.25 * altura) - (5 * idade) + 5
  } else {
    return (10 * peso) + (6.25 * altura) - (5 * idade) - 161
  }
}
```

### 5.2 Ajuste por Medicações

```typescript
function ajustarTMB(tmb: number, contexto: ContextoAtleta): number {
  let fator = 1.0
  
  if (contexto.medicacoesUso?.usaAnabolizantes) {
    fator += 0.10 // +10%
  }
  
  if (contexto.medicacoesUso?.usaTermogenicos) {
    fator += 0.05 // +5%
  }
  
  return tmb * fator
}
```

### 5.3 TDEE

```typescript
function calcularTDEE(tmb: number, nivelAtividade: string, freqTreino: number) {
  const FATORES_NEAT = {
    'SEDENTARIO': 0.15,
    'LEVE': 0.30,
    'MODERADO': 0.50,
  }
  
  const neat = tmb * FATORES_NEAT[nivelAtividade]
  const eat = (350 * freqTreino) / 7
  
  return { tmb, neat, eat, tdee: tmb + neat + eat }
}
```

---

## 6. ESTRUTURA DE DADOS

```typescript
interface Diagnostico {
  id: string
  planoEvolucaoId: string
  atletaId: string
  
  taxas: {
    tmb: number
    tmbAjustada: number
    neat: number
    eat: number
    tdee: number
    fatoresConsiderados: string[]
  }
  
  composicaoAtual: {
    peso: number
    gorduraPct: number
    massaMagra: number
    massaGorda: number
  }
  
  metasComposicao: {
    peso6Meses: number
    peso12Meses: number
    gordura6Meses: number
    gordura12Meses: number
    projecaoMensal: Array<{
      mes: number
      peso: number
      gorduraPct: number
      massaMagra: number
      massaGorda: number
    }>
  }
  
  analiseEstetica: {
    scoreAtual: number
    classificacaoAtual: string
    scoreMeta6Meses: number
    scoreMeta12Meses: number
    proporcoes: Proporcao[]
    simetria: AnaliseSimetria
  }
  
  prioridades: Array<{
    grupo: string
    nivel: 'ALTA' | 'MEDIA' | 'BAIXA'
    percentualAtual: number
    meta: number
    observacao: string
  }>
  
  metasProporcoes: Array<{
    grupo: string
    atual: number
    meta3M: number
    meta6M: number
    meta9M: number
    meta12M: number
  }>
  
  resumoVitruvio: string
  geradoEm: Date
}
```

---

## 7. AÇÕES DA TELA

| Botão | Ação |
|-------|------|
| **← Voltar** | Retorna para `/coach-ia` |
| **Próximo: Plano de Treino →** | Avança para Etapa 2 |
| **Regenerar** | Recalcula diagnóstico |
| **Exportar PDF** | Gera relatório |

---

## 8. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |
| 1.1 | Mar/2026 | Estado real da implementação |

---

## 9. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### Componente Principal
- `DiagnosticoView.tsx` (41.4K) em `templates/Personal/` — Renderiza todo o diagnóstico

### Service de Cálculo
- `diagnostico.ts` (40K) em `services/calculations/` — Motor de diagnóstico completo
- `assessment.ts` (30.9K) — Scores, proporções, classificações auxiliares

### O Que Está Funcionando ✅
- [x] Taxas metabólicas (TMB, NEAT, TDEE) com fatores do contexto
- [x] Composição corporal (peso, gordura %, massa magra, massa gorda)
- [x] Análise estética (score, classificação, proporções por grupo)
- [x] Simetria bilateral com detecção de assimetrias
- [x] Pontos fortes e fracos (prioridades de desenvolvimento)
- [x] Metas de 12 meses (proporções trimestrais + composição mensal)
- [x] Insights do Vitrúvio (texto gerado por IA)
- [x] Stepper de progresso Diagnóstico → Treino → Dieta

### Pendências
- [ ] Exportar PDF
- [ ] Botão Regenerar diagnóstico

---

**VITRU IA - Plano de Evolução: Etapa 1 - Diagnóstico v1.1**
