---
trigger: always_on
---

# 📜 Source of Truth

> Hierarquia de autoridade no projeto VITRU IA

---

## Princípio Fundamental

> **Se o código diverge da spec, o CÓDIGO está errado.**
> Alinhe o código à spec, não o contrário.

---

## Hierarquia de Autoridade

Do mais autoritativo para o menos:

```
┌─────────────────────────────────────────────────────────┐
│  1. PRD.md                                              │
│     Requisitos de negócio - AUTORIDADE MÁXIMA           │
│     Caminho: specs/prd/PRD.md                           │
├─────────────────────────────────────────────────────────┤
│  2. Architecture Specs                                  │
│     Decisões técnicas estruturais                       │
│     Caminho: specs/architecture/*                       │
│     • data-model.md                                     │
│     • api-routes.md                                     │
│     • tech-stack.md                                     │
├─────────────────────────────────────────────────────────┤
│  3. Module Specs                                        │
│     Especificações de cada funcionalidade               │
│     Caminho: specs/modules/{módulo}/*                   │
├─────────────────────────────────────────────────────────┤
│  4. Skills                                              │
│     Padrões técnicos e convenções                       │
│     Caminho: skills/*                                   │
│     • gold-standard (obrigatória)                       │
│     • frontend, backend, database, etc.                 │
├─────────────────────────────────────────────────────────┤
│  5. Código Existente                                    │
│     MENOR AUTORIDADE - deve se adaptar às specs         │
│     Caminho: src/*                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Aplicação Prática

### Cenário 1: Código vs PRD

```
PRD diz: "Apenas Personal Trainers podem criar avaliações"
Código permite: Qualquer usuário logado criar avaliações

→ CÓDIGO ESTÁ ERRADO
→ Ação: Corrigir código para seguir PRD
```

### Cenário 2: Module Spec vs Architecture

```
Module spec diz: "Usar localStorage para cache"
Architecture spec diz: "Todo estado persistente via Supabase"

→ MODULE SPEC ESTÁ ERRADA
→ Ação: Atualizar module spec para usar Supabase
```

### Cenário 3: Código vs Gold Standard

```
Código usa: Cores hardcoded (#6366f1)
Gold Standard diz: "Usar design tokens"

→ CÓDIGO ESTÁ ERRADO
→ Ação: Refatorar para usar tokens (var(--color-primary))
```

---

## Exceções

A hierarquia pode ser invertida **APENAS** quando:

1. **Spec está claramente desatualizada**
   - Evidência: Código em produção funciona diferente há tempo
   - Ação: Atualizar spec para refletir realidade, então validar

2. **Descoberta técnica invalida spec**
   - Evidência: Limitação de API/biblioteca impede implementação
   - Ação: Documentar limitação, propor alternativa, atualizar spec

3. **Requisito de negócio mudou**
   - Evidência: Stakeholder confirma mudança
   - Ação: Atualizar PRD primeiro, depois cascade para outras specs

---

## Processo de Atualização

Quando uma spec precisa ser atualizada:

```
1. Identifique a spec incorreta/desatualizada
2. Proponha a alteração ao usuário
3. AGUARDE aprovação explícita
4. Atualize a spec
5. Registre em memory/changelog.md
6. Se necessário, cascade para specs dependentes
7. Então, e somente então, modifique o código
```

---

## Verificação de Alinhamento

Ao iniciar qualquer tarefa, verifique:

```
□ Li o PRD e entendi o contexto de negócio?
□ A tarefa está alinhada com architecture specs?
□ Existe module spec para este módulo?
□ Sei quais skills aplicar?
□ Há conflitos aparentes entre documentos?
```

Se encontrar conflitos → Aplicar `conflict-resolution.md`

---

## Comandos Úteis

O usuário pode solicitar:

| Comando | Ação |
|---------|------|
| `/verify-alignment` | Verifica se código está alinhado com specs |
| `/update-spec [path]` | Propõe atualização de spec específica |
| `/cascade-update` | Propaga mudança de spec para dependentes |

---

## Relacionado

- `conflict-resolution.md` → O que fazer quando há conflito
- `code-guard.md` → Regras de desenvolvimento
- `memory/decisions.md` → Decisões que alteraram hierarquia