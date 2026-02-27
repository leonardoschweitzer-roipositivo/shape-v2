# SPEC: Plano de Evolução - Etapa 2: Plano de Treino

## Montagem do Treino Trimestral

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA  
**Módulo:** VITRÚVIO IA - Plano de Evolução  
**Etapa:** 2 de 3

---

## 1. VISÃO GERAL

### 1.1 O que é o Plano de Treino?

O **Plano de Treino** é a segunda etapa do Plano de Evolução. Baseado no diagnóstico, o VITRÚVIO monta o **COMO** chegar nas metas de 12 meses através de ciclos trimestrais de treino.

### 1.2 Objetivo

> "Definir a estratégia de treino para atingir as metas de proporções em 12 meses, organizando treinos em ciclos trimestrais com periodização adequada."

### 1.3 Estrutura Temporal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  🎯 META ANUAL (12 meses): Score 86.2 → 92+ (META → ELITE)                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   TRIMESTRE 1        TRIMESTRE 2        TRIMESTRE 3     TRIMESTRE 4│   │
│  │   (Sem 1-12)         (Sem 13-24)        (Sem 25-36)     (Sem 37-48)│   │
│  │                                                                     │   │
│  │  ┌───────────┐      ┌───────────┐      ┌───────────┐   ┌──────────┐│   │
│  │  │ 3 Meso-   │      │ 3 Meso-   │      │ 3 Meso-   │   │ 3 Meso-  ││   │
│  │  │ ciclos    │      │ ciclos    │      │ ciclos    │   │ ciclos   ││   │
│  │  │ de 4 sem  │      │ de 4 sem  │      │ de 4 sem  │   │ de 4 sem ││   │
│  │  └─────┬─────┘      └─────┬─────┘      └─────┬─────┘   └────┬─────┘│   │
│  │        ▼                  ▼                  ▼              ▼      │   │
│  │   📊 Aval.3M         📊 Aval.6M         📊 Aval.9M     📊 Aval.12M│   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Cada TRIMESTRE = 3 MESOCICLOS de 4 semanas (12 semanas total)             │
│  Cada MESOCICLO = 3 semanas progressivas + 1 semana deload                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.4 O que o Plano de Treino Define

| Elemento | Descrição |
|----------|-----------|
| **Visão Anual** | 4 trimestres com focos diferentes |
| **Divisão** | ABC, ABCD, PPL, etc (respeitando metodologia do Personal) |
| **Frequência** | Dias por semana |
| **Volume** | Séries por grupo muscular (priorizando pontos fracos) |
| **Periodização** | Fases de cada mesociclo |
| **Exercícios** | Lista completa com séries, reps, descanso, técnicas |

---

## 2. NAVEGAÇÃO

### 2.1 Breadcrumb

```
Coach IA  /  Plano de Evolução  /  Leonardo Schweitzer  /  Plano de Treino
```

### 2.2 Stepper de Progresso

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│      1       │───────│      2       │───────│      3       │
│  DIAGNÓSTICO │       │    TREINO    │       │    DIETA     │
│      ✓       │       │   ● ativo    │       │      ○       │
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
│  │  Menu    │        │  STEPPER (1 ✓ ─── 2 ● ─── 3 ○)                 │   │
│  │  lateral │        │                                                 │   │
│  │          │        │  CARD: Resumo do Diagnóstico                   │   │
│  │  Coach   │        │                                                 │   │
│  │  IA ◀    │        │  SEÇÃO 1: Visão Geral do Plano Anual           │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 2: Trimestre Atual (Detalhado)          │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 3: Divisão de Treino                    │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 4: Treinos da Semana                    │   │
│  │          │        │                                                 │   │
│  │          │        │  SEÇÃO 5: Observações do VITRÚVIO              │   │
│  │          │        │                                                 │   │
│  │          │        │  FOOTER: [← Diagnóstico] [Próximo: Dieta →]    │   │
│  │          │        │                                                 │   │
│  └──────────┘        └─────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. SEÇÕES DO PLANO DE TREINO

### 4.1 Card: Resumo do Diagnóstico

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  👤 LEONARDO SCHWEITZER                                                     │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   SCORE     │  │  META 12M   │  │  PRIORIDADE │  │   TREINO    │       │
│  │    86.2     │  │     92+     │  │ Panturrilha │  │  5-6x/sem   │       │
│  │    META     │  │    ELITE    │  │   Shape-V   │  │   60 min    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│  📋 Prioridades do Diagnóstico: Panturrilhas (alta), Deltoides laterais   │
│     (Shape-V), Bíceps E (assimetria -3.1%)                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Seção 1: Visão Geral do Plano Anual

**Objetivo:** Mostrar os 4 trimestres e seus focos estratégicos.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📅 VISÃO GERAL DO PLANO ANUAL                                               │
│ Estrutura dos 12 meses para atingir Score 92+ (ELITE)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   TRIMESTRE 1           TRIMESTRE 2          TRIMESTRE 3-4         │   │
│  │   Semanas 1-12          Semanas 13-24        Semanas 25-48         │   │
│  │   ◀── ATUAL                                                        │   │
│  │                                                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │   │
│  │  │  🎯 FOCO:       │  │  🎯 FOCO:       │  │  🎯 FOCO:       │    │   │
│  │  │                 │  │                 │  │                 │    │   │
│  │  │  • Panturrilhas │  │  • Shape-V      │  │  • Refinamento  │    │   │
│  │  │    (volume alto)│  │    (deltoides)  │  │  • Simetria     │    │   │
│  │  │  • Base geral   │  │  • Panturrilhas │  │  • Manutenção   │    │   │
│  │  │  • Adaptação    │  │    (manutenção) │  │    dos ganhos   │    │   │
│  │  │                 │  │  • Assimetria   │  │                 │    │   │
│  │  │  Volume: ALTO   │  │  Volume: ALTO   │  │  Volume: MOD.   │    │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │   │
│  │          │                    │                    │               │   │
│  │          ▼                    ▼                    ▼               │   │
│  │     📊 Aval. 3M          📊 Aval. 6M          📊 Aval. 12M        │   │
│  │     Score: 87.5          Score: 89            Score: 92+          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 EVOLUÇÃO ESPERADA DO SCORE                                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Score                                                    92+ ELITE│   │
│  │ 92─┤                                                         ●     │   │
│  │ 90─┤                                               ●    ●          │   │
│  │ 88─┤                                    ●    ●                     │   │
│  │ 86─┼─────●────●────●                                               │   │
│  │    └────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐  │   │
│  │        M1   M2   M3   M4   M5   M6   M7   M8   M9  M10  M11  M12   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Seção 2: Trimestre Atual (Detalhado)

**Objetivo:** Detalhar os 3 mesociclos do trimestre atual.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏋️ TRIMESTRE 1 - DETALHAMENTO                                               │
│ Semanas 1-12 | Foco: Panturrilhas + Base Geral                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   MESOCICLO 1          MESOCICLO 2          MESOCICLO 3            │   │
│  │   Semanas 1-4          Semanas 5-8          Semanas 9-12           │   │
│  │   ◀── ATUAL                                                        │   │
│  │                                                                     │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │   │
│  │  │  📋 ADAPTAÇÃO   │  │  📋 ACUMULAÇÃO  │  │  📋 INTENSIFIC. │    │   │
│  │  │                 │  │                 │  │                 │    │   │
│  │  │  Preparar o     │  │  Aumentar       │  │  Maximizar      │    │   │
│  │  │  corpo para     │  │  volume e       │  │  estímulo       │    │   │
│  │  │  volume alto    │  │  sobrecarga     │  │  hipertrófico   │    │   │
│  │  │                 │  │                 │  │                 │    │   │
│  │  │  Volume: 80%    │  │  Volume: 100%   │  │  Volume: 90%    │    │   │
│  │  │  Intens: 70%    │  │  Intens: 80%    │  │  Intens: 90%    │    │   │
│  │  │  RPE: 6-7       │  │  RPE: 7-8       │  │  RPE: 8-9       │    │   │
│  │  │                 │  │                 │  │                 │    │   │
│  │  │  Sem 1-3: Prog. │  │  Sem 5-7: Prog. │  │  Sem 9-11: Prog.│    │   │
│  │  │  Sem 4: Deload  │  │  Sem 8: Deload  │  │  Sem 12: Deload │    │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 VOLUME SEMANAL POR GRUPO (Séries/semana)                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Grupo              Padrão    T1        Prioridade    Observação   │   │
│  │  ───────────────────────────────────────────────────────────────── │   │
│  │  🔴 Panturrilha     10-12     20        ALTA          2x frequência│   │
│  │  🔴 Deltóide Lat.   10-12     16        ALTA          Foco Shape-V │   │
│  │  🟡 Bíceps          10-12     14        MÉDIA         +2 unilateral│   │
│  │  🟢 Peitoral        12-16     14        NORMAL        Manutenção   │   │
│  │  🟢 Costas          14-18     16        NORMAL        Base         │   │
│  │  🟢 Quadríceps      12-16     14        NORMAL        Manutenção   │   │
│  │  🟢 Posterior       10-14     12        NORMAL        Manutenção   │   │
│  │  🟢 Tríceps         10-12     12        NORMAL        Manutenção   │   │
│  │                                                                     │   │
│  │  Total Semanal:     ~100      ~118 séries                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💡 Volume de panturrilha dobrado (20 séries/semana) para compensar o     │
│     ponto fraco. Deltoides recebem volume extra para melhorar Shape-V.    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Seção 3: Divisão de Treino

**Objetivo:** Definir a estrutura semanal dos treinos.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📋 DIVISÃO DE TREINO                                                        │
│ Estrutura semanal baseada na disponibilidade e prioridades                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  DIVISÃO: ABCDE (5x/semana)                                        │   │
│  │                                                                     │   │
│  │  ✅ Adequada para frequência 5-6x e volume alto                    │   │
│  │  ✅ Permite treinar panturrilha 3x/semana                          │   │
│  │  ✅ Alinhada com metodologia do Personal                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📅 ESTRUTURA SEMANAL                                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │   SEG         TER         QUA         QUI         SEX         SAB  │   │
│  │                                                                     │   │
│  │  ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐  │   │
│  │  │  A  │    │  B  │    │  C  │    │  D  │    │  E  │    │ OFF │  │   │
│  │  │     │    │     │    │     │    │     │    │     │    │     │  │   │
│  │  │Peito│    │Costas│   │Ombro│    │Perna│    │Braço│    │     │  │   │
│  │  │Tríc.│    │Bíceps│   │Pant.│    │Pant.│    │Pant.│    │DESC.│  │   │
│  │  │     │    │     │    │     │    │     │    │     │    │     │  │   │
│  │  └─────┘    └─────┘    └─────┘    └─────┘    └─────┘    └─────┘  │   │
│  │  60 min     60 min     65 min     70 min     55 min               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 DISTRIBUIÇÃO DAS PRIORIDADES                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔴 PANTURRILHA (20 séries/semana)                                 │   │
│  │     • Treino C (Ombros): 8 séries                                  │   │
│  │     • Treino D (Pernas): 8 séries                                  │   │
│  │     • Treino E (Braços): 4 séries                                  │   │
│  │                                                                     │   │
│  │  🔴 DELTÓIDE LATERAL (16 séries/semana)                            │   │
│  │     • Treino C (Ombros): 12 séries (foco)                          │   │
│  │     • Treino A (Peito): 4 séries extra                             │   │
│  │                                                                     │   │
│  │  🟡 BÍCEPS E (correção assimetria)                                 │   │
│  │     • Treino B: 2 séries unilaterais no início                     │   │
│  │     • Treino E: 2 séries unilaterais no início                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.5 Seção 4: Treinos da Semana (Detalhado)

**Objetivo:** Mostrar cada treino com exercícios completos.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏋️ TREINOS DA SEMANA - MESOCICLO 1                                          │
│ Semanas 1-3 (progressivas) + Semana 4 (deload)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─── TABS ────────────────────────────────────────────────────────────┐   │
│  │  [TREINO A]  [TREINO B]  [TREINO C]  [TREINO D]  [TREINO E]        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  TREINO A - PEITO + TRÍCEPS + DELTÓIDE LATERAL                             │
│  Segunda-feira | Duração: ~60 min                                          │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 PEITORAL (14 séries)                                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  1  │ Supino Reto Barra      │   4    │ 6-8    │ 120s  │ -         │   │
│  │  2  │ Supino Inclinado Halt. │   3    │ 8-10   │ 90s   │ -         │   │
│  │  3  │ Crucifixo Inclinado    │   3    │ 10-12  │ 60s   │ -         │   │
│  │  4  │ Crossover              │   2    │ 12-15  │ 60s   │ Drop-set  │   │
│  │  5  │ Flexão (finalização)   │   2    │ AMRAP  │ 60s   │ -         │   │
│  │                                                                     │   │
│  │  💡 Começar com composto pesado (regra do Personal)                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 TRÍCEPS (10 séries)                                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  6  │ Tríceps Pulley Corda   │   3    │ 10-12  │ 60s   │ -         │   │
│  │  7  │ Tríceps Francês        │   3    │ 10-12  │ 60s   │ -         │   │
│  │  8  │ Tríceps Testa          │   2    │ 12-15  │ 60s   │ -         │   │
│  │  9  │ Mergulho Banco         │   2    │ AMRAP  │ 60s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 DELTÓIDE LATERAL (4 séries) 🔴 PRIORIDADE                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ 10  │ Elevação Lateral Cabo  │   2    │ 15-20  │ 45s   │ -         │   │
│  │ 11  │ Elevação Lateral Halt. │   2    │ 12-15  │ 45s   │ Drop-set  │   │
│  │                                                                     │   │
│  │  💡 Volume extra para melhorar Shape-V                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  TREINO B - COSTAS + BÍCEPS                                                │
│  Terça-feira | Duração: ~60 min                                            │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 CORREÇÃO ASSIMETRIA (2 séries) 🟡 PRIMEIRO!                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  1  │ Rosca Scott Unilat. E  │   2    │ 12-15  │ 60s   │ Só lado E │   │
│  │                                                                     │   │
│  │  ⚠️ PRIMEIRO: Corrigir assimetria -3.1% do bíceps esquerdo         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 COSTAS (16 séries)                                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  2  │ Barra Fixa             │   4    │ 6-8    │ 120s  │ -         │   │
│  │  3  │ Remada Curvada         │   4    │ 8-10   │ 90s   │ -         │   │
│  │  4  │ Puxada Frontal         │   3    │ 10-12  │ 60s   │ -         │   │
│  │  5  │ Remada Unilateral      │   3    │ 10-12  │ 60s   │ -         │   │
│  │  6  │ Pulldown Corda         │   2    │ 12-15  │ 60s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 BÍCEPS (12 séries)                                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  7  │ Rosca Direta Barra     │   3    │ 8-10   │ 60s   │ -         │   │
│  │  8  │ Rosca Alternada        │   3    │ 10-12  │ 60s   │ -         │   │
│  │  9  │ Rosca Martelo          │   3    │ 10-12  │ 60s   │ -         │   │
│  │ 10  │ Rosca Concentrada      │   3    │ 12-15  │ 45s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  TREINO C - OMBROS + PANTURRILHA                                           │
│  Quarta-feira | Duração: ~65 min                                           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 OMBROS (16 séries) - FOCO DELTÓIDE LATERAL 🔴                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  1  │ Desenvolvimento Halt.  │   4    │ 6-8    │ 120s  │ -         │   │
│  │  2  │ Elevação Lateral Halt. │   4    │ 10-12  │ 60s   │ -         │   │
│  │  3  │ Elevação Lateral Cabo  │   4    │ 12-15  │ 45s   │ Drop-set  │   │
│  │  4  │ Face Pull              │   2    │ 15-20  │ 45s   │ -         │   │
│  │  5  │ Elevação Frontal       │   2    │ 12-15  │ 45s   │ -         │   │
│  │                                                                     │   │
│  │  💡 12 séries para deltóide lateral (foco Shape-V)                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 PANTURRILHA (8 séries) 🔴 PRIORIDADE ALTA                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  6  │ Panturrilha Sentado    │   4    │ 12-15  │ 45s   │ Pausa 2s  │   │
│  │  7  │ Panturrilha Em Pé      │   4    │ 10-12  │ 45s   │ Pausa 2s  │   │
│  │                                                                     │   │
│  │  ⚠️ AMPLITUDE COMPLETA + PAUSA 2s no topo (contração isométrica)   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  TREINO D - PERNAS + PANTURRILHA                                           │
│  Quinta-feira | Duração: ~70 min                                           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 QUADRÍCEPS (14 séries)                                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  1  │ Agachamento Livre      │   4    │ 6-8    │ 180s  │ -         │   │
│  │  2  │ Leg Press              │   4    │ 10-12  │ 90s   │ -         │   │
│  │  3  │ Cadeira Extensora      │   3    │ 12-15  │ 60s   │ -         │   │
│  │  4  │ Avanço                 │   3    │ 10-12  │ 60s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 POSTERIOR (12 séries)                                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  5  │ Stiff                  │   4    │ 8-10   │ 90s   │ -         │   │
│  │  6  │ Mesa Flexora           │   4    │ 10-12  │ 60s   │ -         │   │
│  │  7  │ Cadeira Flexora        │   4    │ 12-15  │ 60s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 PANTURRILHA (8 séries) 🔴 PRIORIDADE ALTA                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  8  │ Panturrilha Leg Press  │   4    │ 15-20  │ 30s   │ -         │   │
│  │  9  │ Panturrilha Unilateral │   4    │ 12-15  │ 30s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  TREINO E - BRAÇOS + PANTURRILHA                                           │
│  Sexta-feira | Duração: ~55 min                                            │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📋 CORREÇÃO ASSIMETRIA (2 séries) 🟡 PRIMEIRO!                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  1  │ Rosca Martelo Unil. E  │   2    │ 12-15  │ 60s   │ Só lado E │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 BÍCEPS (8 séries)                                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  2  │ Rosca Barra W          │   3    │ 8-10   │ 60s   │ -         │   │
│  │  3  │ Rosca Inclinada        │   3    │ 10-12  │ 60s   │ -         │   │
│  │  4  │ Rosca Spider           │   2    │ 12-15  │ 45s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 TRÍCEPS (8 séries)                                                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  5  │ Tríceps Barra          │   3    │ 8-10   │ 60s   │ -         │   │
│  │  6  │ Tríceps Coice          │   3    │ 10-12  │ 60s   │ -         │   │
│  │  7  │ Tríceps Corda          │   2    │ 12-15  │ 45s   │ Drop-set  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 PANTURRILHA (4 séries) 🔴                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  #  │ Exercício              │ Séries │ Reps   │ Desc. │ Técnica   │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │  8  │ Panturrilha Sentado    │   2    │ 15-20  │ 30s   │ -         │   │
│  │  9  │ Panturrilha Em Pé      │   2    │ 15-20  │ 30s   │ -         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.6 Seção 5: Observações do VITRÚVIO

**Objetivo:** Resumo e recomendações finais.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💬 OBSERVAÇÕES DO VITRÚVIO                                                  │
│ Recomendações sobre o plano de treino                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📋 RESUMO DO PLANO                                                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Divisão: ABCDE (5x/semana)                                        │   │
│  │  Volume total: ~118 séries/semana                                  │   │
│  │  Duração média: 60-70 min por treino                               │   │
│  │                                                                     │   │
│  │  Grupos prioritários:                                              │   │
│  │  • Panturrilha: 20 séries/sem (volume dobrado, 3x frequência)      │   │
│  │  • Deltóide lateral: 16 séries/sem (Shape-V)                       │   │
│  │  • Bíceps E: +4 séries unilaterais (assimetria)                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚠️ PONTOS DE ATENÇÃO                                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. PANTURRILHA: Amplitude completa + pausa 2s no topo.            │   │
│  │     Essa região responde melhor a tempo sob tensão.                │   │
│  │                                                                     │   │
│  │  2. ASSIMETRIA: Sempre começar treinos de braço com séries         │   │
│  │     unilaterais do lado esquerdo.                                  │   │
│  │                                                                     │   │
│  │  3. DELOAD: A cada 4 semanas, reduzir volume 40% e carga 20%.     │   │
│  │                                                                     │   │
│  │  4. PROGRESSÃO: Aumentar carga quando completar limite superior    │   │
│  │     das repetições em todas as séries.                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ✅ ALINHAMENTO COM METODOLOGIA DO PERSONAL                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ✓ Divisão ABCDE conforme preferência                              │   │
│  │  ✓ Compostos no início de cada treino                              │   │
│  │  ✓ Volume adequado por grupo                                       │   │
│  │  ✓ Drop-set apenas em isoladores finais                            │   │
│  │  ✓ Deload a cada 4 semanas                                         │   │
│  │                                                                     │   │
│  │  💡 Sugestão fora da metodologia: Panturrilha em 3 dias para      │   │
│  │     alcançar 20 séries/semana. Necessário pela prioridade.        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💬 MENSAGEM FINAL                                                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  "Leonardo, este plano foi desenhado para suas prioridades:        │   │
│  │   panturrilhas e Shape-V. O volume é alto mas condizente com seu   │   │
│  │   histórico e capacidade de recuperação.                           │   │
│  │                                                                     │   │
│  │   Lembre-se: consistência > intensidade.                           │   │
│  │                                                                     │   │
│  │   Ao final do Trimestre 1, faremos nova avaliação para ajustar     │   │
│  │   o próximo ciclo. Agora vamos para a dieta!"                      │   │
│  │                                                                     │   │
│  │                                           — VITRÚVIO IA            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. ESTRUTURA DE DADOS

```typescript
interface PlanoTreino {
  id: string
  planoEvolucaoId: string
  atletaId: string
  
  // Visão anual
  visaoAnual: {
    trimestres: {
      numero: 1 | 2 | 3 | 4
      semanas: [number, number]
      foco: string[]
      volume: 'ALTO' | 'MODERADO' | 'BAIXO'
      scoreEsperado: number
    }[]
  }
  
  // Trimestre detalhado
  trimestreAtual: {
    numero: number
    mesociclos: {
      numero: 1 | 2 | 3
      nome: string
      semanas: [number, number]
      volumeRelativo: number
      intensidadeRelativa: number
      rpeAlvo: [number, number]
    }[]
    volumePorGrupo: {
      grupo: string
      seriesPadrao: number
      seriesPlano: number
      prioridade: 'ALTA' | 'MEDIA' | 'NORMAL'
      observacao: string
    }[]
  }
  
  // Divisão
  divisao: {
    tipo: string
    frequenciaSemanal: number
    estruturaSemanal: {
      dia: string
      treino: string
      grupos: string[]
      duracaoMinutos: number
    }[]
  }
  
  // Treinos detalhados
  treinos: {
    id: string
    nome: string
    diaSemana: string
    duracaoMinutos: number
    blocos: {
      nomeGrupo: string
      seriesTotal: number
      isPrioridade: boolean
      exercicios: {
        ordem: number
        nome: string
        series: number
        repeticoes: string
        descansoSegundos: number
        tecnica?: string
        observacao?: string
      }[]
    }[]
  }[]
  
  // Observações
  observacoes: {
    resumo: string
    pontosAtencao: string[]
    alinhamentoMetodologia: boolean
    sugestaoForaMetodologia?: string
    mensagemFinal: string
  }
  
  geradoEm: Date
}
```

---

## 6. AÇÕES DA TELA

| Botão | Ação |
|-------|------|
| **← Diagnóstico** | Retorna para Etapa 1 |
| **Próximo: Plano de Dieta →** | Avança para Etapa 3 |
| **Exportar PDF** | Gera relatório |
| **Imprimir Treinos** | Versão para impressão |

---

## 7. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |

---

**VITRU IA - Plano de Evolução: Etapa 2 - Plano de Treino v1.0**
