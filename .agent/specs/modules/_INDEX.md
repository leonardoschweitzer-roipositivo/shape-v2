# 📦 Modules Index

> Especificações por módulo/feature do VITRU IA
> **Última atualização:** Março 2026

## Mapa de Módulos

```
VITRU IA
├── 🚪 Onboarding        → Registro e primeiro acesso              ✅
├── 📊 Dashboard         → Visão geral (Personal e Atleta)         ✅
├── 🏃 Athletes          → Gestão de atletas/alunos                ✅
├── 📏 Assessments       → Avaliações físicas e proporções         ✅
├── 📈 Evolution         → Acompanhamento de evolução              ✅
├── 🤖 AI Coach          → Vitruvius - Coach IA                    ✅
├── 🏆 Gamification      → Hall dos Deuses, Rankings               ✅
├── 🔔 Notifications     → Notificações do Personal                ✅
└── ⚙️ Settings          → Configurações                           ✅
```

## Detalhamento por Módulo

### 🚪 Onboarding (`./onboarding/`) — ✅ Implementado
- `onboarding.md` - Fluxo de onboarding
- `user-registration.md` - Registro de usuários
- `users-flows.md` - Fluxos de usuário
- **Implementação:** `StudentRegistration/`, `PortalLanding.tsx`, `ContextoFormPublico.tsx`, `Login/`

### 📊 Dashboard (`./dashboard/`) — ✅ Implementado
- `dashboard-atleta.md` - Dashboard do atleta
- `dashboard-personal.md` - Dashboard do personal
- `tela-visao-geral-personal-academia.md` - Visão geral
- **Implementação:** `PersonalDashboard.tsx`, `PersonalStatsCard.tsx`, `DashboardView/`, `PersonalCoachDashboard.tsx`

### 🏃 Athletes (`./athletes/`) — ✅ Implementado
- `cadastro-de-atletas.md` - Cadastro de atletas
- `portal-atleta.md` - Portal do atleta (5 abas: Home/Treino/Coach/Progresso/Perfil)
- `alunos-academia.md` - Gestão de alunos
- **Implementação:** `AthletePortal.tsx`, `PersonalAthletesList.tsx`, `AthleteDetailsView.tsx`, `AthleteContextSection.tsx`

### 📏 Assessments (`./assessments/`) — ✅ Implementado
- `calculo-avaliacao-geral.md` - Cálculo de avaliação
- `calculo-proporcoes.md` - Cálculo de proporções áureas
- `proporcoes-masculinas.md` - Proporções masculinas
- `proporcoes-femininas.md` - Proporções femininas
- `escalas-proporcoes.md` - Escalas de proporções
- **Implementação:** `services/calculations/` (17 arquivos incl. `diagnostico.ts`, `dieta.ts`, `treino.ts`, `potencial.ts`, `objetivos.ts`)

### 📈 Evolution (`./evolution/`) — ✅ Implementado
- `evolution.md` - Sistema de evolução
- **Implementação:** `Evolution.tsx` (46K), `EvolutionCharts/` (6 componentes), `evolutionProcessor.ts`, `PersonalEvolutionView.tsx`

### 🤖 AI Coach (`./ai-coach/`) — ✅ Implementado
- `ai-coach.md` - Especificação do Vitruvius
- `coach-acompanhamento.md` - Acompanhamento do coach + Plano de Evolução
- **Implementação:** `vitruviusAI.ts`, `vitruviusContext.ts`, `vitruviusPrompts.ts`, `CoachScreen.tsx`, `PersonalCoachView.tsx`, `ChatMessages/`, `ChatPlanoEvolucao/`

### 🏆 Gamification (`./gamification/`) — ✅ Implementado
- `hall-dos-deuses.md` - Hall dos Deuses
- `ranking-personais.md` - Ranking de personais
- **Implementação:** `HallDosDeuses/`, `RankingPersonais/` (7 componentes), `GamificationPanel/`, `personalRankingStore.ts`

### ⚙️ Settings (`./settings/`) — ✅ Implementado
- `settings.md` - Configurações do sistema
- **Implementação:** `NotificationSettingsPage.tsx`, `AthleteSettingsPage/`, `PersonalProfilePage.tsx`

### 🔔 Notifications (`./notifications/`) — ✅ Implementado
- `SPEC-notificacoes-personal.md` - Notificações do Personal
- **Implementação:** `notificacao.service.ts`, `notificacaoTriggers.ts`, `resumoNotificacoes.ts`, `useNotificacoes.ts`, `NotificationsPage.tsx`, `NotificationSettingsPage.tsx`, `NotificationDrawer/`, `notificacoes-schema.sql`
