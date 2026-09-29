# 📋 Changelog

> Histórico de mudanças em specs e skills do VITRU IA

---

## Formato de Registro

```
### [DATA] - [ARQUIVO]
**Tipo**: Criação | Atualização | Remoção
**Mudança**: O que mudou
**Motivo**: Por que mudou
```

---

## Histórico

### 2026-02-26 - Reorganização Estrutural Completa

**Tipo**: Criação
**Mudança**: Estrutura `.agent/` criada com:
- `rules/` - Regras universais do agente
- `skills/` - Habilidades técnicas reutilizáveis
- `specs/` - Especificações do produto organizadas por módulo
- `memory/` - Sistema de aprendizado e decisões
- `archive/` - Backup de arquivos legados

**Motivo**: Preparação para implementação do Agente Orquestrador com Process Disclosure

---

### 2026-02-26 - Migração de Specs

**Tipo**: Movimentação
**Mudança**: Specs migradas de `docs/specs/` para `.agent/specs/` com nova organização:
- PRD → `specs/prd/`
- Arquitetura → `specs/architecture/`
- Módulos → `specs/modules/{módulo}/`
- Design → `specs/design/`

**Motivo**: Organização por domínio para carregamento seletivo (Process Disclosure)

---

### 2026-02-27 - Correção Categorias de Gordura Corporal

**Tipo**: Atualização
**Mudança**:
- `BodyFatGauge.tsx`: Corrigido limiar do Fitness masculino (`< 18` → `< 17`), 17,1% agora classifica como "Aceitável"
- `BodyFatGauge.tsx`: Corrigido Essencial feminino (`< 12` → `< 14`) para alinhar com ACE
- `BodyFatGauge.tsx`: Renomeado "Média" → "Aceitável" (terminologia ACE)
- `BodyFatGauge.tsx`: Adicionadas marcações visuais (segmentos coloridos + ticks com %) no gauge
- `calculo-proporcoes.md`: SPEC atualizada com categorias corrigidas (masc + fem)
**Motivo**: 17,1% de gordura corporal estava classificado incorretamente como "Fitness" em vez de "Aceitável". Padrão ACE define Fitness masculino como 14-17% (exclusive). Gauge também precisava de marcações visuais para melhor orientação.

---

### 2026-03-01 - Reformulação Home do Atleta v2.0

**Tipo**: Atualização Completa / Criação
**Mudança**: 
- Modificou `TodayScreen.tsx` para apresentar o novo layout v2.0 com foco em engajamento.
- Componentes modulares (SRP) criados sob `src/pages/athlete/components/`:
  - `HeaderIdentidade`
  - `CardPersonal`
  - `CardScoreMeta`
  - `CardRanking`
  - `CardFocoSemana`
  - `AcoesRapidas`
  - `FooterUltimaMedicao`
- Inclusão do mock temporário local dentro da Home para espelhar a SPEC em todos os dados de Gamificação visual enquanto os mocks do backend não vêm da API.
- Adição da interface fortemente tipada em `HomeAtletaTypes.ts`.
**Motivo**: Implementar o Documento de Especificação Técnica v2.0 com foco em dar Direção/Gamificação/Score visível e imediato ao atleta, guiando o usuário ao sucesso (Retenção, Engajamento).

---

<!-- Novos registros serão adicionados acima desta linha -->### 2026-03-12 - CardTreino.tsx
**Tipo**: Atualização
**Mudança**: Adicionado SwipeableRow, edição de exercícios e botão de adicionar.
**Motivo**: Facilitar a edição da sessão de treino atual localmente pelo usuário.


### 2026-09-22 - Heatmap de Consistência (atleta) com janela móvel

**Tipo**: Atualização
**Mudança**: `src/pages/athlete/components/CardConsistencia.tsx` — o heatmap deixou de usar janela fixa
(1º de março + 26 semanas = sempre Mar–Ago) e passou a mostrar as **últimas 26 semanas terminando na semana
atual**. Hook `useHojeKey` vira o dia à meia-noite / ao voltar para a aba, então o heatmap anda sozinho com o
app aberto. Datas agora em fuso local (antes `toISOString`/UTC). Rótulos de mês alinhados ao início da coluna.
`src/services/consistencia.service.ts` — a busca começa no mais antigo entre 1º/jan e o início da janela
(~27 semanas), para o heatmap não ficar vazio em jan–jun; métricas (treinos, consistência, tempo, recorde)
continuam restritas ao ano. Streak usa a janela completa (não zera na virada do ano).
**Motivo**: Leo reportou o heatmap "travado" em agosto, sem marcar os treinos dos últimos dias (setembro).

### 2026-09-24 - Portal do Aluno travado na vertical (celular)

**Tipo**: Criação
**Mudança**: Novo `src/components/organisms/PortraitLock/` — tenta `screen.orientation.lock('portrait')`
(só funciona no Android com app instalado/tela cheia) e, como fallback universal, cobre a tela com
"Gire o celular" quando a media query `(orientation: landscape) and (pointer: coarse) and (max-height: 540px)`
bate. Montado em `App.tsx` nas rotas `/atleta` (PortalLanding) e `/meu-portal` (AtletaIndependentePortal).
Tablet deitado e desktop não são afetados (validado com Playwright: iPhone retrato ✗, iPhone deitado ✓,
iPad deitado ✗, desktop ✗).
**Motivo**: Leo pediu que o portal do aluno no celular nunca fique na horizontal (layout quebrava).

### 2026-09-30 - Fase 0 do plano "Conta do Personal → Alunos → Treinos": blindagem do banco

**Tipo**: Criação / Segurança
**Mudança**:
- Plano completo (Fases 0–4) salvo em `docs/plano-conta-personal-alunos-treinos.md`.
- `supabase/migrations/20260930_fase0_blindagem_auth.sql`: funções `app_is_god`, `app_is_admin_ctx`,
  `app_meu_personal_id`, `app_meu_atleta_id`, `app_personal_do_atleta`, `app_atleta_eh_meu`;
  `handle_new_user` só aceita PERSONAL/ACADEMIA/ATLETA, não sobrescreve role e não engole erro;
  backfill de órfãos; `profiles` sem INSERT/DELETE do cliente + trigger que trava `role`;
  `personais` com UNIQUE(auth_user_id), sem INSERT do cliente, trigger protegendo plano/limite/status/vínculos;
  índice único em `atletas.auth_user_id`; leitura GOD em academias/personais/atletas;
  `link_existing_user_to_atleta` com checagem de dono.
- `supabase/migrations/20260930_fase0b_portal_rls_self.sql`: policies `self_*` (aluno logado) e `dono_all_*`
  (personal) em fichas/medidas/assessments/diagnosticos/planos_treino/planos_dieta/registros_diarios/chat_messages,
  notificações e comentários; remove as policies de token (`portal_*`, `*_portal_*`, `notificacao_anon_*`,
  `atleta_notificacao_*`, `atleta_comentario_*`) — incluindo `portal_select_personais USING (true)`.
- `src/stores/authStore.ts`: `.single()` → `.maybeSingle()`.
- `src/App.tsx`: guarda A2 — logado sem profile (ou PERSONAL/ACADEMIA sem entidade) vê
  `src/components/templates/ContaIncompleta` em vez do dashboard do atleta com mocks.
**Motivo**: análise do fluxo do personal achou escalada de papel no cadastro, sequestro de aluno via RPC,
policies de token abertas para qualquer logado e contas órfãs silenciosas.

### 2026-10-03 - Fase 1: conta do personal (onboarding, senha, plano real)

**Tipo**: Criação / Atualização
**Mudança**:
- `supabase/migrations/20261003_fase1_conta_personal.sql`: `personais` ganha cidade/estado/especialidades/bio/
  onboarding_completo (backfill true p/ existentes, controlado por `app_migracoes_aplicadas`); UNLIMITED = limite NULL;
  trigger `a_trg_personais_sync_limite` (FREE 10 · PRO 50 · UNLIMITED ∞) ao trocar plano.
- `authStore`: signUp com `emailRedirectTo` e login imediato quando há sessão; `refreshEntity`, `resetPassword`,
  `changePassword` (reautentica), `initAuthListener` (SIGNED_OUT / PASSWORD_RECOVERY).
- Novas telas: `src/pages/auth/DefinirSenhaPage.tsx` (/definir-senha — token só é consumido no submit),
  `src/pages/onboarding/PersonalOnboarding.tsx` (2 passos). Organisms `PersonalDadosForm` (+ validação/máscara) e
  `AlterarSenhaModal`. Utils `planoPersonal.ts` e `redirecionarPosLogin.ts` (extraído do Login).
- `Login`: "Esqueci minha senha" funcional (mensagem neutra), cadastro começa em Personal, senha ≥ 8 no cadastro,
  **fim do auto-login `?p=`** (só pré-preenche `?email=`).
- `App`: gates /definir-senha, conta suspensa, onboarding; `/personal/:id` e `/academia/:id` exigem login e
  `/personal/:id` só abre o do próprio personal; settings do personal = perfil profissional; breakpoint mobile único.
- `PersonalProfilePage` / `ProfileScreen` (mobile): plano, limite e uso reais, dados editáveis, alterar senha.
  `PersonalDashboard` usa `limite_atletas` real. `PersonalPortal` mostra erro em vez de spinner infinito.
**Motivo**: Fase 1 do plano `docs/plano-conta-personal-alunos-treinos.md`.
