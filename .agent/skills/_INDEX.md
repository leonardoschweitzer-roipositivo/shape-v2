# 📋 Specs Index

> Especificações do produto VITRU IA

---

## O que são Specs?

Specs são **especificações de produto** que definem o QUE deve ser construído. Diferente de SKILLs (como construir), Specs definem requisitos, funcionalidades e regras de negócio.

---

## 📚 Estrutura

```
specs/
├── prd/                    # Product Requirements
│   └── PRD.md              # Documento principal
│
├── architecture/           # Arquitetura técnica
│   ├── data-model.md       # Schema do banco
│   ├── api-routes.md       # Endpoints da API
│   ├── tech-stack.md       # Stack tecnológica
│   └── ...
│
├── modules/                # Specs por módulo
│   ├── onboarding/
│   ├── dashboard/
│   ├── athletes/
│   ├── assessments/
│   ├── evolution/
│   ├── ai-coach/
│   ├── gamification/
│   └── settings/
│
└── design/                 # Design e fluxos
    ├── design-system.md
    └── mapa-visual-fluxo-usuarios.md
```

---

## 📄 Documento Principal

| Documento | Caminho | Descrição |
|-----------|---------|-----------|
| **PRD** | `prd/PRD.md` | Product Requirements Document - Autoridade máxima |

---

## 🏗️ Arquitetura

| Spec | Caminho | Descrição |
|------|---------|-----------|
| Data Model | `architecture/data-model.md` | Schema do banco de dados |
| API Routes | `architecture/api-routes.md` | Endpoints e contratos |
| Tech Stack | `architecture/tech-stack.md` | Tecnologias utilizadas |
| Multi-user | `architecture/multi-user.md` | Arquitetura multi-tenant |
| State Management | `architecture/state-management.md` | Gerenciamento de estado |

---

## 📦 Módulos

| Módulo | Caminho | Descrição | Status |
|--------|---------|-----------|--------|
| **Onboarding** | `modules/onboarding/` | Registro e primeiro acesso | 🚧 |
| **Dashboard** | `modules/dashboard/` | Visão geral (Personal/Atleta) | 🚧 |
| **Athletes** | `modules/athletes/` | Gestão de atletas | 🚧 |
| **Assessments** | `modules/assessments/` | Avaliações físicas | 🚧 |
| **Evolution** | `modules/evolution/` | Acompanhamento de evolução | 📋 |
| **AI Coach** | `modules/ai-coach/` | Vitruvius - Coach IA | 📋 |
| **Gamification** | `modules/gamification/` | Hall dos Deuses, Rankings | 📋 |
| **Settings** | `modules/settings/` | Configurações | 📋 |

**Legenda**: ✅ Completo | 🚧 Em progresso | 📋 Planejado

---

## 🎨 Design

| Spec | Caminho | Descrição |
|------|---------|-----------|
| Design System | `design/design-system.md` | Cores, tipografia, componentes |
| Fluxo Visual | `design/mapa-visual-fluxo-usuarios.md` | Mapa de navegação |

---

## 🔍 Como Usar (Process Disclosure)

### Regra de Carregamento

```
1. Para tarefas de NEGÓCIO/PRODUTO:
   → Carregar PRD.md + spec do módulo afetado

2. Para tarefas de ARQUITETURA:
   → Carregar specs de architecture/

3. Para tarefas de MÓDULO ESPECÍFICO:
   → Carregar apenas specs/modules/{módulo}/

4. NUNCA carregar todas as specs de uma vez
```

### Exemplo

**Tarefa**: "Implementar formulário de avaliação física"

**Carregar**:
- ✅ `specs/modules/assessments/SPEC.md`
- ✅ `specs/modules/assessments/calculo-proporcoes.md`
- ❌ `specs/modules/dashboard/` (não relevante)
- ❌ `specs/modules/ai-coach/` (não relevante)

---

## 📝 Atualizando Specs

Specs devem ser atualizadas quando:

- ✅ Funcionalidade foi implementada (marcar como ✅)
- ✅ Requisito mudou durante desenvolvimento
- ✅ Nova funcionalidade foi adicionada
- ✅ Informação está desatualizada

**Processo**:
1. Identifique a spec a atualizar
2. Faça a alteração
3. Registre em `memory/changelog.md`
4. Se afetar outras specs, atualize-as também

---

## 🔗 Relacionado

- `rules/source-of-truth.md` → Hierarquia de autoridade
- `skills/` → Conhecimento técnico
- `memory/changelog.md` → Histórico de mudanças