---
trigger: always_on
---

# ⚖️ Conflict Resolution

> Protocolo para resolver conflitos entre specs, código e solicitações

---

## Quando Aplicar

Esta regra deve ser aplicada quando:

- Solicitação do usuário contradiz uma SPEC
- Código existente diverge da SPEC
- Duas SPECs contêm informações conflitantes
- Decisão arquitetural conflita com padrão estabelecido

---

## Tipos de Conflito

### 1. Solicitação vs SPEC

**Exemplo**: Usuário pede "adicione campo X no formulário" mas SPEC não prevê esse campo.

**Protocolo**:
```
⚠️ CONFLITO DETECTADO

A solicitação conflita com a especificação:

📋 Spec: modules/assessments/SPEC.md
📍 Seção: Campos do formulário
❌ Conflito: Campo "X" não está especificado

Opções:
A) Atualizar a SPEC primeiro, depois implementar (recomendado)
B) Implementar e marcar SPEC como desatualizada
C) Cancelar solicitação

Qual opção deseja seguir?
```

### 2. Código vs SPEC

**Exemplo**: Código implementa lógica diferente do especificado.

**Protocolo**:
```
⚠️ DIVERGÊNCIA DETECTADA

O código atual não está alinhado com a especificação:

📋 Spec: modules/dashboard/SPEC.md
📍 Seção: Cálculo de métricas
📁 Arquivo: src/features/dashboard/utils/metrics.ts

Spec diz: "Usar média ponderada dos últimos 30 dias"
Código faz: "Usa média simples dos últimos 7 dias"

Ação: Corrigir código para alinhar com SPEC
       OU atualizar SPEC se código estiver correto

Qual é a fonte de verdade neste caso?
```

### 3. SPEC vs SPEC

**Exemplo**: PRD diz uma coisa, spec de módulo diz outra.

**Protocolo**:
```
⚠️ SPECS CONFLITANTES

Duas especificações contêm informações divergentes:

📋 PRD.md diz: "Sistema suporta apenas Personal Trainers"
📋 modules/onboarding/SPEC.md diz: "Fluxo para Academias"

Hierarquia: PRD > Module Spec

Ação recomendada: Atualizar module spec para alinhar com PRD
                  OU escalar para revisão do PRD

Aguardando decisão...
```

---

## Hierarquia de Resolução

Quando em dúvida, siga esta ordem de autoridade:

```
1. PRD.md                    → Sempre vence
2. Architecture specs        → Vence specs de módulo
3. Module specs              → Vence código existente
4. Gold Standard             → Vence convenções ad-hoc
5. Código existente          → Menor autoridade
```

---

## Fluxo de Resolução

```
┌─────────────────────────────────────┐
│ 1. Detecta conflito                 │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 2. Identifica documentos envolvidos │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 3. Aplica hierarquia de autoridade  │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 4. Apresenta opções ao usuário      │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 5. AGUARDA confirmação explícita    │
│    (NUNCA prossegue sozinho)        │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 6. Executa decisão + registra em    │
│    memory/decisions.md              │
└─────────────────────────────────────┘
```

---

## Regras Críticas

### ⛔ NUNCA faça isso:

- Prosseguir com implementação sem resolver conflito
- Assumir que usuário quer ignorar a spec
- Modificar spec sem confirmação explícita
- Esconder divergência encontrada

### ✅ SEMPRE faça isso:

- Pausar e reportar conflito imediatamente
- Apresentar opções claras
- Aguardar decisão do usuário
- Registrar decisão tomada em `memory/decisions.md`
- Atualizar documento apropriado após decisão

---

## Registro de Decisões

Após resolver conflito, registre em `memory/decisions.md`:

```markdown
### [DATA] - Resolução: [Título do Conflito]

**Conflito**: [Descrição breve]
**Documentos**: [Lista de docs envolvidos]
**Decisão**: [O que foi decidido]
**Ação tomada**: [O que foi feito]
**Responsável**: [Usuário que decidiu]
```

---

## Relacionado

- `source-of-truth.md` → Hierarquia completa de autoridade
- `code-guard.md` → Prevenção de conflitos
- `memory/decisions.md` → Registro de decisões