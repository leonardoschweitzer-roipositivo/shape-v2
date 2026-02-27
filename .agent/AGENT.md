# 🤖 VITRU IA - Agente Orquestrador de Código

> **Versão**: 1.0.0
> **Última atualização**: 2026-02-26
> **Projeto**: VITRU IA - Sistema de Avaliação e Acompanhamento Fitness

---

## 🎯 Missão

Orquestrar o desenvolvimento do VITRU IA de forma eficiente, carregando **apenas o contexto necessário** para cada tarefa (Process Disclosure), mantendo consistência de código e evoluindo o conhecimento do sistema.

---

## 📁 Estrutura do Sistema

```
.agent/
├── AGENT.md              ← Você está aqui (Orquestrador)
├── rules/                ← Regras de comportamento
├── skills/               ← Conhecimento técnico
├── specs/                ← Especificações do produto
├── memory/               ← Aprendizados e decisões
└── archive/              ← Backup de arquivos legados
```

---

## ⚡ Protocolo de Execução (Process Disclosure)

### Ao receber uma tarefa, siga EXATAMENTE esta ordem:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ANALISE (não carregue nada ainda)                        │
│    → Leia a solicitação                                     │
│    → Identifique keywords                                   │
│    → Liste SKILLs e SPECs potencialmente relevantes         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CARREGUE (apenas o necessário)                           │
│    → ⭐ SEMPRE: skills/gold-standard/SKILL.md               │
│    → SKILLs específicas identificadas                       │
│    → SPECs do módulo afetado                                │
│    → NUNCA carregue tudo                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. EXECUTE                                                  │
│    → Aplique Gold Standard primeiro                         │
│    → Siga padrões das SKILLs específicas                    │
│    → Respeite requisitos das SPECs                          │
│    → Consulte rules/ se houver conflito                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. APRENDA                                                  │
│    → Novo padrão descoberto? → Atualize SKILL               │
│    → SPEC desatualizada? → Atualize SPEC                    │
│    → Decisão importante? → Registre em memory/decisions.md  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. ENTREGUE                                                 │
│    → Código/resultado da tarefa                             │
│    → Lista de arquivos criados/modificados                  │
│    → SKILLs/SPECs atualizadas (se houver)                   │
│    → Próximos passos sugeridos (se aplicável)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Mapa de SKILLs

### ⭐ OBRIGATÓRIA (carregar em TODA tarefa de código)

| Skill | Caminho |
|-------|---------|
| **Gold Standard** | `skills/gold-standard/SKILL.md` |

### Por Contexto (carregar conforme keywords)

| Keywords | Skill | Caminho |
|----------|-------|---------|
| componente, react, hook, tela, UI, estado, form | **Frontend** | `skills/frontend/SKILL.md` |
| API, supabase, query, endpoint, RPC, edge, auth | **Backend** | `skills/backend/SKILL.md` |
| tabela, schema, migration, RLS, banco, index | **Database** | `skills/database/SKILL.md` |
| design, tema, cores, layout, dark, visual, UX | **UI/UX** | `skills/ui-ux/SKILL.md` |
| teste, test, spec, mock, coverage | **Testing** | `skills/testing/SKILL.md` |

---

## 📋 Mapa de SPECs

### Documento Principal

| Spec | Caminho |
|------|---------|
| **PRD** | `specs/prd/PRD.md` |

### Arquitetura

| Spec | Caminho |
|------|---------|
| Data Model | `specs/architecture/data-model.md` |
| API Routes | `specs/architecture/api-routes.md` |
| Tech Stack | `specs/architecture/tech-stack.md` |

### Módulos

| Módulo | Caminho | Keywords |
|--------|---------|----------|
| Onboarding | `specs/modules/onboarding/` | registro, cadastro, signup, login |
| Dashboard | `specs/modules/dashboard/` | dashboard, visão geral, home |
| Athletes | `specs/modules/athletes/` | atleta, aluno, cadastro atleta |
| Assessments | `specs/modules/assessments/` | avaliação, medidas, proporções, gordura |
| Evolution | `specs/modules/evolution/` | evolução, progresso, histórico |
| AI Coach | `specs/modules/ai-coach/` | vitruvius, coach, treino, dieta, IA |
| Gamification | `specs/modules/gamification/` | ranking, hall, conquista, badge |
| Settings | `specs/modules/settings/` | configuração, preferências, perfil |

---

## 📜 Mapa de Rules

| Regra | Caminho | Quando Usar |
|-------|---------|-------------|
| Code Guard | `rules/code-guard.md` | Toda tarefa de código |
| Source of Truth | `rules/source-of-truth.md` | Dúvida sobre autoridade |
| Conflict Resolution | `rules/conflict-resolution.md` | Conflito detectado |

---

## 🎮 Comandos Especiais

O usuário pode usar estes comandos:

| Comando | Ação |
|---------|------|
| `/status` | Mostra estado do projeto baseado nas SPECs |
| `/skills` | Lista SKILLs disponíveis |
| `/specs` | Lista SPECs disponíveis |
| `/learn [padrão]` | Adiciona padrão à SKILL apropriada |
| `/decide [decisão]` | Registra decisão em memory/decisions.md |
| `/update-spec [módulo]` | Atualiza SPEC de um módulo |

---

## 🔄 Regras de Atualização

### Quando ATUALIZAR uma SKILL:

- ✅ Descobriu padrão que será reutilizado
- ✅ Encontrou solução melhor para problema recorrente
- ✅ Criou componente/hook/util que vira referência
- ✅ Aprendeu convenção que deve ser seguida

### Quando ATUALIZAR uma SPEC:

- ✅ Implementou funcionalidade planejada (marcar como ✅)
- ✅ Requisito mudou durante desenvolvimento
- ✅ Adicionou funcionalidade não prevista
- ✅ Corrigiu informação desatualizada

### Formato de Atualização:

Ao atualizar qualquer documento, adicione entrada em `memory/changelog.md`:

```markdown
### [DATA] - [ARQUIVO]
**Tipo**: Atualização
**Mudança**: [O que mudou]
**Motivo**: [Por que mudou]
```

---

## 🚨 Regras Críticas

### ⛔ NUNCA faça:

1. Carregar todas as SKILLs/SPECs de uma vez
2. Ignorar o Gold Standard em tarefas de código
3. Implementar sem verificar SPEC do módulo
4. Prosseguir com conflito não resolvido
5. Usar `any` no TypeScript
6. Hardcodar valores (cores, espaçamentos)
7. Criar componentes com mais de 150 linhas
8. Duplicar código existente

### ✅ SEMPRE faça:

1. Analisar antes de carregar contexto
2. Carregar Gold Standard em tarefas de código
3. Verificar SPEC antes de implementar
4. Pausar e reportar conflitos
5. Tipar explicitamente (TypeScript strict)
6. Usar Design Tokens
7. Componentizar adequadamente
8. Extrair código duplicado

---

## 📊 Hierarquia de Autoridade

```
1. PRD.md                    → Máxima autoridade
2. Architecture specs        → data-model, api-routes
3. Module specs              → Specs de cada módulo
4. Skills                    → Padrões técnicos
5. Código existente          → Menor autoridade
```

**Regra de Ouro**: Se código diverge da spec, o **código está errado**.

---

## 🧠 Memory

| Arquivo | Propósito |
|---------|-----------|
| `memory/changelog.md` | Histórico de mudanças em docs |
| `memory/decisions.md` | Decisões arquiteturais importantes |
| `memory/patterns-learned.md` | Padrões descobertos |

---

## 📝 Template de Resposta

Ao concluir uma tarefa, use este formato:

```
## ✅ Tarefa Concluída

**Solicitação**: [resumo do que foi pedido]

**Arquivos criados/modificados**:
- `path/to/file.tsx` - [descrição breve]
- `path/to/file.ts` - [descrição breve]

**SKILLs consultadas**:
- gold-standard, frontend

**SPECs consultadas**:
- modules/assessments/SPEC.md

**Atualizações em docs** (se houver):
- `skills/frontend/SKILL.md` - Adicionado padrão X

**Próximos passos sugeridos** (se aplicável):
- Implementar integração com backend
- Adicionar testes
```

---

## 🚀 Início Rápido

Para cada nova tarefa:

1. **Leia** a solicitação completamente
2. **Identifique** keywords → mapeie SKILLs e SPECs
3. **Carregue** Gold Standard + contexto específico
4. **Execute** seguindo padrões
5. **Atualize** docs se aprendeu algo novo
6. **Entregue** com relatório estruturado

---

*Agente Orquestrador v1.0.0 - VITRU IA*
