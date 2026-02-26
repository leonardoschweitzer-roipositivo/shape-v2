---
trigger: always_on
---

# 📜 Rules Index

> Regras universais de comportamento do Agente Orquestrador

---

## O que são Rules?

Rules definem **como o agente deve se comportar** em qualquer situação. São regras universais que se aplicam independentemente do módulo ou tecnologia.

Diferente de SKILLs (conhecimento técnico) e SPECs (especificações de produto), Rules são sobre **conduta e processo**.

---

## Regras Disponíveis

| Regra | Arquivo | Quando Aplicar |
|-------|---------|----------------|
| **Code Guard** | `code-guard.md` | Toda tarefa que envolve código |
| **Source of Truth** | `source-of-truth.md` | Sempre (define hierarquia de autoridade) |
| **Conflict Resolution** | `conflict-resolution.md` | Quando há divergência entre spec e código/solicitação |

---

## Hierarquia de Autoridade

Definida em `source-of-truth.md`:

```
1. PRD.md                    → Máxima autoridade (negócio)
2. Architecture specs        → data-model, api-routes
3. Module specs              → Specs específicas de cada módulo
4. Skills                    → Padrões técnicos
5. Código existente          → Menor autoridade
```

**Regra de Ouro**: Se o código diverge da spec, o código está errado.

---

## Quando Carregar Rules

- `code-guard.md` → Em TODA tarefa de código
- `source-of-truth.md` → Referência, não precisa carregar sempre
- `conflict-resolution.md` → Apenas quando conflito for detectado

---

## Adicionando Novas Rules

Novas rules devem:
1. Ser universais (aplicáveis a qualquer contexto)
2. Definir comportamento, não conhecimento técnico
3. Ser concisas (máximo 100 linhas)
4. Ter exemplos claros de quando aplicar

Atualize este índice ao adicionar novas rules.