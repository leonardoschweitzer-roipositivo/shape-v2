# VITRU IA — Product Requirements Document (PRD)

**Versão:** 1.1 (Frontend MVP)
**Data:** 08/02/2026
**Status:** frontend-mvp-v1
**Plataforma de Desenvolvimento:** Antigravity IDE

---

## 1. Visão Geral do Produto

### 1.1 Propósito

VITRU IA é uma plataforma SaaS B2B2C de avaliação física inteligente focada na **estética clássica masculina** (físico "Deus Grego"). A aplicação utiliza IA para analisar proporções áureas corporais, assimetrias bilaterais e composição corporal, gerando planos de treino e dieta personalizados para que o usuário evolua em direção ao ideal das proporções clássicas (Golden Ratio 1.618).

### 1.2 Problema

Personal trainers e academias realizam avaliações físicas de forma manual e genérica, sem foco em proporções estéticas nem análise inteligente de assimetrias. Os alunos que buscam o físico clássico (V-Taper, simetria bilateral, proporções áureas) não possuem ferramentas que monitorem sua evolução em direção a esse ideal específico e sugiram correções inteligentes.

### 1.3 Solução (Frontend MVP)

Uma aplicação web (SPA) que prototipa a experiência completa:

-   Captura medidas antropométricas completas (lineares, dobras cutâneas, bilaterais)
-   Interface para visualização de proporções áureas e índices de simetria
-   Comparação visual com padrões clássicos (Golden Ratio, Classic Physique, Men's Physique)
-   Stub de IA ("Coach IA") para demonstrar diagnósticos e estratégias
-   Dashboards específicos para Academias, Personais e Alunos

### 1.4 Nome e Identidade

-   **Nome:** VITRU IA (referência a Vitrúvio e suas proporções perfeitas + Inteligência Artificial)
-   **Tagline:** "A Matemática do Físico Perfeito — As proporções vitruvianas de Da Vinci, decodificadas e aplicadas no seu físico por Inteligência Artificial."
-   **Escala Shape-V:** Bloco → Normal → Atlético → Estético → Freak
-   **Target Golden Ratio:** 1.618

---

## 2. Status da Implementação (Frontend Only)

> [!NOTE]
> Esta versão do documento reflete o estado atual do código frontend (`shape-v2`). A lógica de backend, autenticação real e persistência de banco de dados são **simuladas** via estado local (Zustand) e mocks.

### 2.1 Stack Tecnológica
-   **Frontend:** React (Vite), TypeScript
-   **Estilização:** Tailwind CSS + Variáveis CSS (Design Tokens)
-   **Estado:** Zustand (Gerenciamento de perfil, auth mock, dados de avaliação)
-   **Roteamento:** Condicional baseado em estado de view (`currentView`)
-   **Ícones:** Lucide React

---

## 3. Usuários e Perfis

O sistema suporta a navegação distinta para três perfis de usuário, controlados via estado global:

| Perfil | Descrição | Funcionalidades Principais no Frontend |
| :--- | :--- | :--- |
| **Academia** | Gestão de negócio | Dashboard Academia, Lista de Personais, Lista de Alunos (Agregado), Ranking Personais |
| **Personal** | Gestão de alunos | Dashboard Personal, Meus Alunos, Realizar Avaliação, Ver Evolução e Coach IA dos alunos |
| **Atleta** | Uso final | Dashboard Pessoal, Ver Resultados, Comparação no Hall dos Deuses, Configurações |

---

## 4. Arquitetura de Features (Alinhado com Código)

### 4.1 Módulo de Avaliação e Resultados

**Tela: "Resultados da Avaliação"**
Implementada com 3 abas principais de análise:

1.  **Diagnóstico Estético**:
    *   Score Geral e Classificação (S, A, B, C, D)
    *   Composição Corporal (Peso Magro/Gordo, BF% Navy/Pollock)
    *   Radar de Simetria (Gráfico Radar Chart)

2.  **Proporções Áureas**:
    *   Comparativo com targets (Golden Ratio, Classic Physique, Men's Physique)
    *   Barras de progresso para cada grupo muscular (Pescoço, Ombros, Peitoral, Braços, Cintura, etc.)
    *   Visualização de "Gap" para o ideal

3.  **Análise de Assimetrias**:
    *   Comparativo Bilateral (Esquerdo vs Direito)
    *   Indicadores visuais de desequilíbrio (>3% alerta)
    *   Foco em membros (Braços, Pernas, Panturrilhas)

### 4.2 Módulo "Coach IA"

Assistente inteligente implementado com 3 pilares de serviço e um chat rápido:

*   **Pilar 1: Diagnóstico**: Insights sobre estrutura óssea e pontos atuais.
*   **Pilar 2: Estratégia**: Recomendações de treino corretivo (Hipertrofia Corretiva).
*   **Pilar 3: Nutrição**: Planejamento de macros para objetivos específicos (Bulking/Cutting proporcional).
*   **Chat Rápido**: Funcionalidade "Dúvida Rápida" (Modal de chat).

### 4.3 Módulo de Configurações (Athlete Settings)

A página de configurações (`AthleteSettingsPage`) possui 6 seções ativas no frontend:

1.  **Conta**: Email, Contas Conectadas e Vinculação com Personal.
2.  **Notificações**: Lembretes de medição, Insights, Novidades do App.
3.  **Privacidade**: Visibilidade no Hall dos Deuses, Fotos de progresso para personal.
4.  **Segurança**: Senha, 2FA, Sessões ativas.
5.  **Plano**: Visualização do plano atual (Free/Pro) e Billing.
6.  **Meus Dados**: Exportação (JSON/CSV) e Exclusão de conta.

### 4.4 Hall dos Deuses / Ranking

*   **Hall dos Deuses**: Ranking de atletas baseado no Shape-V ratio (simulado).
*   **Ranking de Personais**: Tabela classificatória de treinadores por performance dos alunos.

---

## 5. Design System & UI

### 5.1 Design Tokens

A aplicação utiliza um sistema de tokens centralizado (`src/tokens/`) para garantir consistência:

*   **Cores**: Paleta Dark Mode (Neutrais escuros, Primary Brand Color, Secondary Accents).
*   **Tipografia**: Família Sans-serif, escalas definidas (h1-h6, body).
*   **Espaçamento**: Escala de grid baseada em 4px (rem).
*   **Bordas**: Raios de curvatura padronizados para cards e botões.

### 5.2 Componentes UI Principais

*   **Layout**: Sidebar fixa à esquerda, Header flutuante, Área de conteúdo com scroll independente.
*   **Cards**: `HeroCard` (Banners), `StatCard` (Métricas), `CoachPillarCard` (Serviços IA).
*   **Gráficos**: Integração com Recharts para visualização de dados.
*   **Feedback**: Loaders, Modais de confirmação, Badges de status.

---

## 6. Fluxos de Usuário (Navegação Implementada)

### 6.1 Fluxo da Academia
1.  **Dashboard**: Visão geral de alunos e personais.
2.  **Personais**: Listagem e gestão de treinadores.
3.  **Ranking**: Visualização de desempenho da equipe.

### 6.2 Fluxo do Personal
1.  **Dashboard**: Visão rápida dos alunos.
2.  **Meus Alunos**: Lista detalhada -> Selecionar Aluno -> Ações.
3.  **Ações no Aluno**: Realizar Avaliação, Ver Coach IA, Ver Evolução Histórica.

### 6.3 Fluxo do Atleta
1.  **Dashboard (Momento)**: Status atual, Score Shape-V.
2.  **Resultados**: Detalhes da última avaliação (3 abas).
3.  **Coach IA**: Interação com inteligência para planos.
4.  **Configurações**: Gestão de perfil e preferências.

---

## 7. Próximos Passos (Backend Integration)

Para evoluir este MVP Frontend para um produto completo, os seguintes passos de backend são necessários:

1.  **Banco de Dados Real**: Migrar de stores Zustand para PostgreSQL/Supabase.
2.  **Autenticação**: Integrar Clerk ou Auth.js para login real.
3.  **API de IA**: Conectar o módulo "Coach IA" à API da Anthropic/OpenAI para geração real de textos.
4.  **Armazenamento de Imagens**: Upload real de fotos de progresso (S3/R2).

---
