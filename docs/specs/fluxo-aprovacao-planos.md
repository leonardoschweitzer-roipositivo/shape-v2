# SPEC: Fluxo de Aprovação de Planos

## Workflow de Aprovação de Treinos e Dietas

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA  
**Relacionado:** SPEC_VITRUVIUS_IA_v2.md

---

## 1. VISÃO GERAL

### 1.1 Conceito

Quando o VITRÚVIO cria um plano de treino ou dieta, esse plano precisa ser **aprovado** antes de ser liberado para o atleta executar. O aprovador depende se o atleta tem ou não um Personal vinculado.

### 1.2 Regra Fundamental

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    REGRA DE APROVAÇÃO                                       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ATLETA COM PERSONAL                                                │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  VITRÚVIO cria ──▶ PERSONAL aprova ──▶ ATLETA recebe               │   │
│  │                                                                     │   │
│  │  • Personal tem palavra final                                      │   │
│  │  • Personal pode aprovar, ajustar ou rejeitar                      │   │
│  │  • VITRÚVIO respeita metodologia do Personal                       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ATLETA SEM PERSONAL (contratou VITRU direto)                      │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  VITRÚVIO cria ──▶ ATLETA aceita ──▶ ATLETA executa                │   │
│  │                                                                     │   │
│  │  • Atleta é responsável pela aprovação                             │   │
│  │  • Pode aceitar, pedir ajuste ou rejeitar                          │   │
│  │  • VITRÚVIO recomenda consultar profissional                       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. STATUS DOS PLANOS

### 2.1 Ciclo de Vida do Plano

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    CICLO DE VIDA DO PLANO                                   │
│                                                                             │
│                                                                             │
│      ┌──────────┐                                                           │
│      │ RASCUNHO │  ← VITRÚVIO está criando                                 │
│      └────┬─────┘                                                           │
│           │                                                                 │
│           │ VITRÚVIO finaliza                                               │
│           ▼                                                                 │
│      ┌────────────────────┐                                                │
│      │ AGUARDANDO         │  ← Esperando aprovador                         │
│      │ APROVAÇÃO          │                                                │
│      └────┬───────────────┘                                                │
│           │                                                                 │
│           ├─────────────────┬─────────────────┐                            │
│           │                 │                 │                            │
│           ▼                 ▼                 ▼                            │
│      ┌──────────┐     ┌──────────┐     ┌──────────┐                       │
│      │ APROVADO │     │ APROVADO │     │ REJEITADO│                       │
│      │          │     │ COM      │     │          │                       │
│      │          │     │ AJUSTES  │     │          │                       │
│      └────┬─────┘     └────┬─────┘     └──────────┘                       │
│           │                │                                               │
│           └───────┬────────┘                                               │
│                   │                                                        │
│                   │ Data de início chega                                   │
│                   ▼                                                        │
│              ┌──────────┐                                                  │
│              │  ATIVO   │  ← Atleta executando                             │
│              └────┬─────┘                                                  │
│                   │                                                        │
│                   │ Período termina                                        │
│                   ▼                                                        │
│              ┌──────────┐                                                  │
│              │CONCLUÍDO │  ← Finalizado                                    │
│              └──────────┘                                                  │
│                                                                             │
│      ─────────────────────────────────────────────────────────────────     │
│                                                                             │
│      Status especiais:                                                     │
│                                                                             │
│      ┌──────────┐     ┌──────────┐                                        │
│      │ EXPIRADO │     │CANCELADO │                                        │
│      └──────────┘     └──────────┘                                        │
│      (não revisado     (cancelado                                          │
│       em 7 dias)        manualmente)                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Definição dos Status

```typescript
type StatusPlano = 
  | 'RASCUNHO'              // VITRÚVIO ainda está gerando
  | 'AGUARDANDO_APROVACAO'  // Aguardando Personal/Atleta aprovar
  | 'APROVADO'              // Aprovado sem alterações
  | 'APROVADO_COM_AJUSTES'  // Aprovado com modificações
  | 'REJEITADO'             // Rejeitado (precisa novo plano)
  | 'ATIVO'                 // Em execução pelo atleta
  | 'CONCLUIDO'             // Período do plano terminou
  | 'EXPIRADO'              // Não foi revisado em 7 dias
  | 'CANCELADO'             // Cancelado manualmente
```

---

## 3. FLUXO DETALHADO

### 3.1 Fluxo: Atleta COM Personal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    FLUXO: ATLETA COM PERSONAL                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  1️⃣ CRIAÇÃO DO PLANO                                                │   │
│  │                                                                     │   │
│  │     Atleta ou Personal                                              │   │
│  │           │                                                         │   │
│  │           │ "Criar plano de treino trimestral"                      │   │
│  │           ▼                                                         │   │
│  │     ┌─────────────┐                                                 │   │
│  │     │  VITRÚVIO   │                                                 │   │
│  │     │             │                                                 │   │
│  │     │ Considera:  │                                                 │   │
│  │     │ • Avaliação │                                                 │   │
│  │     │ • Contexto  │                                                 │   │
│  │     │ • Metodol.  │                                                 │   │
│  │     │ • Insights  │                                                 │   │
│  │     └─────────────┘                                                 │   │
│  │           │                                                         │   │
│  │           │ Gera plano                                              │   │
│  │           ▼                                                         │   │
│  │     Status: AGUARDANDO_APROVACAO                                    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  2️⃣ NOTIFICAÇÃO                                                     │   │
│  │                                                                     │   │
│  │     🔔 Personal recebe notificação:                                 │   │
│  │     "Novo plano de treino para João aguardando aprovação"          │   │
│  │                                                                     │   │
│  │     🔔 Atleta recebe notificação:                                   │   │
│  │     "Seu plano de treino foi criado e está com seu Personal"       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  3️⃣ REVISÃO DO PERSONAL                                             │   │
│  │                                                                     │   │
│  │     Personal abre o plano e vê:                                    │   │
│  │     • Estrutura completa do plano                                  │   │
│  │     • Justificativa do VITRÚVIO                                    │   │
│  │     • Sugestões fora da metodologia (se houver)                    │   │
│  │     • Contexto do atleta usado                                     │   │
│  │                                                                     │   │
│  │     Personal escolhe:                                              │   │
│  │                                                                     │   │
│  │     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │   │
│  │     │ ✅ APROVAR  │ │ ✏️ AJUSTAR  │ │ ❌ REJEITAR │               │   │
│  │     └─────────────┘ └─────────────┘ └─────────────┘               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  4️⃣ AÇÕES DO PERSONAL                                               │   │
│  │                                                                     │   │
│  │     ┌─────────────────────────────────────────────────────────┐    │   │
│  │     │ ✅ APROVAR                                               │    │   │
│  │     │                                                         │    │   │
│  │     │ • Plano liberado como está                              │    │   │
│  │     │ • Comentário opcional para o atleta                     │    │   │
│  │     │ • Status → APROVADO                                     │    │   │
│  │     └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │     ┌─────────────────────────────────────────────────────────┐    │   │
│  │     │ ✏️ AJUSTAR                                               │    │   │
│  │     │                                                         │    │   │
│  │     │ • Personal modifica exercícios, séries, etc             │    │   │
│  │     │ • Registra quais ajustes fez                            │    │   │
│  │     │ • Comentário explicando os ajustes                      │    │   │
│  │     │ • Status → APROVADO_COM_AJUSTES                         │    │   │
│  │     └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  │     ┌─────────────────────────────────────────────────────────┐    │   │
│  │     │ ❌ REJEITAR                                              │    │   │
│  │     │                                                         │    │   │
│  │     │ • Obrigatório informar motivo                           │    │   │
│  │     │ • Pode solicitar novo plano com instruções              │    │   │
│  │     │ • Status → REJEITADO                                    │    │   │
│  │     └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  5️⃣ NOTIFICAÇÃO AO ATLETA                                           │   │
│  │                                                                     │   │
│  │     Se APROVADO:                                                   │   │
│  │     🔔 "Seu plano de treino foi aprovado! Veja os detalhes."      │   │
│  │                                                                     │   │
│  │     Se APROVADO_COM_AJUSTES:                                       │   │
│  │     🔔 "Seu plano foi aprovado com alguns ajustes do Personal."   │   │
│  │                                                                     │   │
│  │     Se REJEITADO:                                                  │   │
│  │     🔔 "Seu Personal solicitou um novo plano. Motivo: ..."        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Fluxo: Atleta SEM Personal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    FLUXO: ATLETA SEM PERSONAL                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  1️⃣ CRIAÇÃO DO PLANO                                                │   │
│  │                                                                     │   │
│  │     Atleta                                                          │   │
│  │        │                                                            │   │
│  │        │ "Criar plano de treino"                                    │   │
│  │        ▼                                                            │   │
│  │     ┌─────────────┐                                                 │   │
│  │     │  VITRÚVIO   │                                                 │   │
│  │     │             │                                                 │   │
│  │     │ Considera:  │                                                 │   │
│  │     │ • Avaliação │                                                 │   │
│  │     │ • Contexto  │                                                 │   │
│  │     │ • Insights  │                                                 │   │
│  │     │ • Melhores  │                                                 │   │
│  │     │   práticas  │                                                 │   │
│  │     └─────────────┘                                                 │   │
│  │           │                                                         │   │
│  │           │ Gera plano                                              │   │
│  │           ▼                                                         │   │
│  │     Status: AGUARDANDO_APROVACAO                                    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  2️⃣ APRESENTAÇÃO PARA O ATLETA                                      │   │
│  │                                                                     │   │
│  │     VITRÚVIO apresenta o plano diretamente ao atleta               │   │
│  │                                                                     │   │
│  │     ⚠️ AVISO IMPORTANTE:                                            │   │
│  │     ┌─────────────────────────────────────────────────────────┐    │   │
│  │     │ Este plano foi criado com base em seus dados e nas      │    │   │
│  │     │ melhores práticas. Recomendamos que você consulte um    │    │   │
│  │     │ profissional de educação física para acompanhamento.    │    │   │
│  │     │                                                         │    │   │
│  │     │ Em caso de dor ou desconforto durante os exercícios,   │    │   │
│  │     │ pare imediatamente e procure orientação profissional.  │    │   │
│  │     └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  3️⃣ DECISÃO DO ATLETA                                               │   │
│  │                                                                     │   │
│  │     Atleta escolhe:                                                │   │
│  │                                                                     │   │
│  │     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │   │
│  │     │ ✅ ACEITAR  │ │ 🔄 PEDIR    │ │ ❌ REJEITAR │               │   │
│  │     │             │ │   AJUSTE    │ │             │               │   │
│  │     └─────────────┘ └─────────────┘ └─────────────┘               │   │
│  │                                                                     │   │
│  │     ✅ ACEITAR                                                      │   │
│  │        • Plano entra em vigor                                      │   │
│  │        • Status → APROVADO                                         │   │
│  │                                                                     │   │
│  │     🔄 PEDIR AJUSTE                                                 │   │
│  │        • Atleta informa o que quer diferente                       │   │
│  │        • VITRÚVIO gera versão ajustada                             │   │
│  │        • Novo ciclo de aprovação                                   │   │
│  │                                                                     │   │
│  │     ❌ REJEITAR                                                     │   │
│  │        • Atleta informa motivo                                     │   │
│  │        • Status → REJEITADO                                        │   │
│  │        • Pode solicitar novo plano                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. INTERFACES

### 4.1 Tela: Lista de Planos Pendentes (Personal)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  📋 PLANOS PENDENTES DE APROVAÇÃO                                           │
│                                                                             │
│  Você tem 3 planos aguardando sua revisão                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🏋️ PLANO DE TREINO TRIMESTRAL                      Criado há 2 dias │   │
│  │                                                                     │   │
│  │ 👤 João Silva                                                       │   │
│  │ 🎯 Hipertrofia com foco em ombros                                  │   │
│  │ 📅 12 semanas • 4x/semana                                          │   │
│  │                                                                     │   │
│  │ 💡 VITRÚVIO sugere 2 ajustes fora da metodologia                   │   │
│  │                                                                     │   │
│  │      [ 👁️ Ver Detalhes ]  [ ✅ Aprovar ]  [ ✏️ Ajustar ]  [ ❌ ]    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🍽️ PLANO DE DIETA MENSAL                           Criado há 3 dias │   │
│  │                                                                     │   │
│  │ 👤 Maria Costa                                                      │   │
│  │ 🎯 Cutting - Definição                                             │   │
│  │ 📅 4 semanas • 2200 kcal/dia                                       │   │
│  │                                                                     │   │
│  │ ✅ 100% alinhado com sua metodologia                               │   │
│  │                                                                     │   │
│  │      [ 👁️ Ver Detalhes ]  [ ✅ Aprovar ]  [ ✏️ Ajustar ]  [ ❌ ]    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🏋️ PLANO DE TREINO TRIMESTRAL              ⚠️ Expira em 1 dia      │   │
│  │                                                                     │   │
│  │ 👤 Pedro Santos                                                     │   │
│  │ 🎯 Correção de assimetria                                          │   │
│  │ 📅 4 semanas • 5x/semana                                           │   │
│  │                                                                     │   │
│  │      [ 👁️ Ver Detalhes ]  [ ✅ Aprovar ]  [ ✏️ Ajustar ]  [ ❌ ]    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Modal: Revisão de Plano de Treino

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                         [X] │
│  📋 REVISÃO DE PLANO DE TREINO                                              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  👤 Atleta: João Silva                                                      │
│  🎯 Objetivo: Hipertrofia com foco em ombros                               │
│  📅 Duração: 12 semanas (Trimestral) • 4 treinos/semana                    │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📊 CONTEXTO USADO                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Score atual: 68 (CAMINHO)                                          │   │
│  │ Ponto fraco: Deltóide lateral (72% do ideal)                       │   │
│  │ Assimetria: Bíceps esquerdo -3.2%                                  │   │
│  │ Lesões: Nenhuma informada                                          │   │
│  │ Disponibilidade: 4-5x/semana, 60min                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  🏋️ ESTRUTURA DO PLANO                                                      │
│                                                                             │
│  Divisão: ABC (conforme sua metodologia)                                   │
│  Periodização: Linear • 3 mesociclos de 4 semanas                         │
│                                                                             │
│  ┌─ MESOCICLO 1 (Semanas 1-4): Adaptação ──────────────────────────────┐   │
│  │                                                                     │   │
│  │  DIA A - Peito + Tríceps                                           │   │
│  │  ├── Supino reto: 4x8-10 (composto - conforme regra #1)           │   │
│  │  ├── Supino inclinado: 3x10-12                                     │   │
│  │  ├── Crucifixo máquina: 3x12-15                                    │   │
│  │  ├── Tríceps pulley: 3x10-12                                       │   │
│  │  └── Tríceps francês: 3x10-12                                      │   │
│  │                                                                     │   │
│  │  DIA B - Costas + Bíceps                                           │   │
│  │  ├── Puxada frontal: 4x8-10 (composto)                             │   │
│  │  ├── Remada curvada: 3x10-12                                       │   │
│  │  ├── Remada baixa: 3x10-12                                         │   │
│  │  ├── Rosca direta: 3x10-12                                         │   │
│  │  ├── Rosca martelo: 3x10-12                                        │   │
│  │  │                                                                 │   │
│  │  │  💡 SUGESTÃO VITRÚVIO (fora da metodologia):                   │   │
│  │  │  ┌───────────────────────────────────────────────────────────┐ │   │
│  │  │  │ Adicionar 1 série extra de rosca unilateral com braço    │ │   │
│  │  │  │ esquerdo para correção da assimetria de -3.2%.           │ │   │
│  │  │  └───────────────────────────────────────────────────────────┘ │   │
│  │  │                                                                 │   │
│  │  └── [+ Rosca scott unilateral E: 2x12] (sugestão)                │   │
│  │                                                                     │   │
│  │  DIA C - Pernas + Ombros                                           │   │
│  │  ├── Agachamento livre: 4x8-10 (composto)                          │   │
│  │  ├── Leg press: 3x10-12                                            │   │
│  │  ├── Cadeira extensora: 3x12-15                                    │   │
│  │  ├── Mesa flexora: 3x10-12                                         │   │
│  │  ├── Desenvolvimento: 4x8-10 (FOCO - ponto fraco)                  │   │
│  │  ├── Elevação lateral: 4x12-15 (FOCO)                              │   │
│  │  └── Elevação frontal: 3x12-15                                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [Ver Mesociclo 2] [Ver Mesociclo 3]                                       │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💬 JUSTIFICATIVA DO VITRÚVIO                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ O plano foi criado priorizando deltóides (ponto fraco em 72%) e   │   │
│  │ seguindo sua metodologia ABC com periodização linear. Adicionei   │   │
│  │ volume extra para ombros no Dia C. Sugiro considerar trabalho     │   │
│  │ unilateral para bíceps devido à assimetria identificada.          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📝 SEU COMENTÁRIO (opcional)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│       [ ❌ REJEITAR ]        [ ✏️ AJUSTAR ]        [ ✅ APROVAR ]           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Modal: Ajustar Plano

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                         [X] │
│  ✏️ AJUSTAR PLANO                                                           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Faça os ajustes necessários no plano. Suas alterações serão              │
│  registradas e enviadas ao atleta.                                        │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  DIA A - Peito + Tríceps                                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. Supino reto                                                     │   │
│  │     Séries: [4] ▼   Reps: [8-10    ]   Descanso: [90s] ▼         │   │
│  │     Técnica: [Nenhuma        ▼]                                    │   │
│  │     Observação: ________________________________              [×] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2. Supino inclinado                                                │   │
│  │     Séries: [4] ▼   Reps: [10-12   ]   Descanso: [60s] ▼  ⚡EDIT │   │
│  │     Técnica: [Nenhuma        ▼]                                    │   │
│  │     Observação: ________________________________              [×] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [... mais exercícios ...]                                                 │
│                                                                             │
│  [ + Adicionar exercício ]                                                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  📝 DESCREVA OS AJUSTES REALIZADOS                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Aumentei séries do supino inclinado de 3 para 4, pois o atleta    │   │
│  │ tem bom desenvolvimento de peitoral inferior mas precisa focar    │   │
│  │ no superior.                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                    [ CANCELAR ]        [ 💾 SALVAR E APROVAR ]              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Modal: Rejeitar Plano

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                         [X] │
│  ❌ REJEITAR PLANO                                                          │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Por favor, informe o motivo da rejeição para que o VITRÚVIO possa        │
│  criar um novo plano mais adequado.                                        │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Motivo da rejeição *                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [ ] Volume muito alto para o nível atual do atleta                 │   │
│  │ [ ] Exercícios incompatíveis com lesões/restrições                 │   │
│  │ [ ] Divisão não adequada para disponibilidade                      │   │
│  │ [ ] Fora da minha metodologia de trabalho                          │   │
│  │ [●] Outro motivo                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Descreva o motivo *                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ O atleta mencionou que não terá acesso a academia nas próximas    │   │
│  │ 2 semanas (viagem). Preciso de um plano que possa ser feito em    │   │
│  │ casa com equipamento mínimo.                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [ ] Solicitar novo plano automaticamente com essas instruções            │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                    [ CANCELAR ]        [ ❌ CONFIRMAR REJEIÇÃO ]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.5 Notificação: Plano Aprovado (para Atleta)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  🔔 NOTIFICAÇÃO                                                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ✅ SEU PLANO DE TREINO FOI APROVADO!                              │   │
│  │                                                                     │   │
│  │  Seu Personal Pedro aprovou seu plano de treino trimestral        │   │
│  │  criado pelo VITRÚVIO.                                            │   │
│  │                                                                     │   │
│  │  📅 Início: Segunda-feira, 03/03/2026                              │   │
│  │  📅 Término: 26/05/2026 (12 semanas)                               │   │
│  │                                                                     │   │
│  │  💬 Comentário do Personal:                                        │   │
│  │  "Excelente plano! Vamos focar forte nos ombros esse trimestre.   │   │
│  │   Aceitei a sugestão do VITRÚVIO para trabalho unilateral de      │   │
│  │   bíceps. Qualquer dúvida me chama! 💪"                            │   │
│  │                                                                     │   │
│  │                          [ VER MEU PLANO ]                         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. REGRAS DE NEGÓCIO

### 5.1 Prazos

| Regra | Valor | Ação |
|-------|-------|------|
| Prazo para aprovação (Personal) | 7 dias | Notificar após 5 dias |
| Prazo para aprovação (Atleta) | 14 dias | Notificar após 10 dias |
| Plano expira se não revisado | Sim | Status → EXPIRADO |
| Lembrete de expiração | 24h antes | Notificação |

### 5.2 Notificações

```typescript
const NOTIFICACOES_APROVACAO = {
  // Ao criar plano
  plano_criado: {
    personal: "Novo plano de {tipo} para {atleta} aguardando aprovação",
    atleta: "Seu plano de {tipo} foi criado e está com seu Personal"
  },
  
  // Ao aprovar
  plano_aprovado: {
    atleta: "Seu plano de {tipo} foi aprovado! Início em {data}"
  },
  
  // Ao aprovar com ajustes
  plano_aprovado_ajustes: {
    atleta: "Seu plano de {tipo} foi aprovado com alguns ajustes do Personal"
  },
  
  // Ao rejeitar
  plano_rejeitado: {
    atleta: "Seu Personal solicitou um novo plano. Motivo: {motivo}"
  },
  
  // Lembretes
  lembrete_5_dias: {
    personal: "Plano de {atleta} aguardando aprovação há 5 dias"
  },
  lembrete_24h: {
    personal: "⚠️ Plano de {atleta} expira amanhã!"
  },
  
  // Expiração
  plano_expirado: {
    personal: "Plano de {atleta} expirou sem revisão",
    atleta: "Seu plano expirou. Solicite um novo ao seu Personal"
  }
}
```

### 5.3 Permissões

```typescript
const PERMISSOES_APROVACAO = {
  // Quem pode aprovar
  aprovar: {
    com_personal: ['PERSONAL'],
    sem_personal: ['ATLETA']
  },
  
  // Quem pode ajustar
  ajustar: {
    com_personal: ['PERSONAL'],
    sem_personal: []  // Atleta só pode pedir ajuste, não editar
  },
  
  // Quem pode rejeitar
  rejeitar: {
    com_personal: ['PERSONAL'],
    sem_personal: ['ATLETA']
  },
  
  // Quem pode visualizar
  visualizar: {
    com_personal: ['PERSONAL', 'ATLETA', 'ACADEMIA'],
    sem_personal: ['ATLETA']
  }
}
```

---

## 6. BANCO DE DADOS

### 6.1 Campos de Aprovação nas Tabelas de Planos

```sql
-- Campos adicionais em planos_treino e planos_dieta

-- Status
status VARCHAR(30) DEFAULT 'RASCUNHO'
  CHECK (status IN (
    'RASCUNHO',
    'AGUARDANDO_APROVACAO',
    'APROVADO',
    'APROVADO_COM_AJUSTES',
    'REJEITADO',
    'ATIVO',
    'CONCLUIDO',
    'EXPIRADO',
    'CANCELADO'
  )),

-- Aprovação
aprovador_tipo VARCHAR(10) CHECK (aprovador_tipo IN ('PERSONAL', 'ATLETA')),
aprovador_id UUID,
aprovado_em TIMESTAMP WITH TIME ZONE,
comentario_aprovacao TEXT,

-- Ajustes (se APROVADO_COM_AJUSTES)
ajustes_realizados JSONB,
/*
{
  "descricao": "Aumentei séries do supino inclinado",
  "alteracoes": [
    {
      "tipo": "MODIFICACAO",
      "local": "Dia A > Supino inclinado",
      "de": "3x10-12",
      "para": "4x10-12"
    }
  ]
}
*/

-- Rejeição (se REJEITADO)
rejeitado_em TIMESTAMP WITH TIME ZONE,
motivo_rejeicao TEXT,
categoria_rejeicao VARCHAR(50),

-- Controle de prazo
enviado_para_aprovacao_em TIMESTAMP WITH TIME ZONE,
prazo_aprovacao TIMESTAMP WITH TIME ZONE
```

### 6.2 Tabela: historico_aprovacoes

```sql
CREATE TABLE historico_aprovacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Referência ao plano
  plano_tipo VARCHAR(10) NOT NULL CHECK (plano_tipo IN ('TREINO', 'DIETA')),
  plano_id UUID NOT NULL,
  
  -- Ação
  acao VARCHAR(30) NOT NULL CHECK (acao IN (
    'CRIADO',
    'ENVIADO_APROVACAO',
    'APROVADO',
    'APROVADO_COM_AJUSTES',
    'REJEITADO',
    'EXPIRADO',
    'ATIVADO',
    'CONCLUIDO',
    'CANCELADO'
  )),
  
  -- Quem fez
  usuario_tipo VARCHAR(20) NOT NULL, -- 'VITRUVIO', 'PERSONAL', 'ATLETA', 'SISTEMA'
  usuario_id UUID,
  
  -- Detalhes
  detalhes JSONB,
  comentario TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_historico_plano ON historico_aprovacoes(plano_tipo, plano_id);
CREATE INDEX idx_historico_data ON historico_aprovacoes(created_at DESC);
```

---

## 7. API ENDPOINTS

```typescript
// Listar planos pendentes (Personal)
GET /api/personal/:personalId/planos/pendentes
Response: { planos: PlanoResumo[] }

// Detalhes do plano para revisão
GET /api/planos/:tipo/:planoId/revisao
Response: { plano: PlanoCompleto, contexto: ContextoUsado, sugestoes: Sugestao[] }

// Aprovar plano
POST /api/planos/:tipo/:planoId/aprovar
Body: { comentario?: string }
Response: { success: boolean, plano: Plano }

// Aprovar com ajustes
POST /api/planos/:tipo/:planoId/aprovar-com-ajustes
Body: { ajustes: Ajuste[], descricao: string, comentario?: string }
Response: { success: boolean, plano: Plano }

// Rejeitar plano
POST /api/planos/:tipo/:planoId/rejeitar
Body: { motivo: string, categoria: string, solicitarNovo?: boolean }
Response: { success: boolean }

// Pedir ajuste (Atleta sem Personal)
POST /api/planos/:tipo/:planoId/pedir-ajuste
Body: { ajusteSolicitado: string }
Response: { success: boolean, novoPlanoId?: string }

// Aceitar plano (Atleta sem Personal)
POST /api/planos/:tipo/:planoId/aceitar
Response: { success: boolean, plano: Plano }
```

---

## 8. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |
| 1.1 | Mar/2026 | Estado real da implementação |

---

## 9. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### Implementação Parcial
O fluxo de aprovação foi implementado de forma simplificada na v1, sem todas as telas de modal previstas na SPEC:

### O Que Está Funcionando ✅
- [x] Stepper de 3 etapas (Diagnóstico → Treino → Dieta)
- [x] Geração automática do plano pelo Vitrúvio (Gemini API)
- [x] Editabilidade do plano de treino pelo personal (TreinoView)
- [x] Editabilidade do plano de dieta pelo personal (DietaView)
- [x] Contexto do atleta usado na geração
- [x] Personal como "supervisor" que revisa antes de liberar

### Pendências
- [ ] Status formal do plano (RASCUNHO, AGUARDANDO_APROVAÇÃO, APROVADO, etc.)
- [ ] Tela de lista de planos pendentes do personal
- [ ] Modal de revisão estruturado (aprovar/ajustar/rejeitar)
- [ ] Notificações de aprovação para atleta
- [ ] Histórico de aprovações no banco
- [ ] Prazo de expiração automático (7 dias)
- [ ] Fluxo para atleta SEM personal

---

**VITRU IA - Fluxo de Aprovação de Planos v1.1**
