# Plano — Conta do Personal → Alunos → Treinos (VITRU IA)

## Contexto

O Leo perguntou se o personal consegue criar a própria conta, cadastrar alunos e montar treinos para eles.
**Consegue.** O fluxo existe de ponta a ponta:

1. **Criar conta:** Login → "Criar conta" → escolhe "Personal". Um trigger no banco (`handle_new_user`) cria as linhas em `profiles` e `personais`.
2. **Cadastrar aluno:** botão "Novo Aluno", no desktop e no mobile (`/personal/:id`). O acesso do aluno usa a senha padrão `Shape2026!`, que vai no link.
3. **Montar treino:** "Montar Plano" → Diagnóstico → Treino (regras fixas + Gemini) → Dieta. Ao salvar, o treino aparece na hora no portal do aluno.

Mas a análise encontrou **falhas graves de segurança**, **bugs que quebram o fluxo** e **lacunas**:

- **Segurança:**
  - qualquer pessoa pode se cadastrar como GOD/ACADEMIA, ou trocar a própria função depois;
  - o personal pode alterar o próprio plano e limite;
  - a função `link_existing_user_to_atleta` permite sequestrar qualquer aluno;
  - todos os alunos usam a mesma senha, e ela vai no link;
  - regras de acesso do portal (RLS) expõem as linhas de alunos com token.
- **Bugs:**
  - erro no cadastro vira uma conta "fantasma" que cai na tela de atleta com dados de exemplo;
  - "Esqueci minha senha" e "Alterar senha" não fazem nada;
  - "Editar treino" no desktop abre em branco;
  - edições depois de salvar se perdem;
  - as diretrizes do personal e as escolhas da IA são descartadas no merge;
  - homem 3x/semana fica sem treino de perna;
  - excluir um plano apaga todos os planos do aluno;
  - arquivar um aluno salva ATIVO.
- **Lacunas:**
  - personal não tem onboarding;
  - o perfil mostra valores fixos no código ("PRO até 50", "Membro desde 2022");
  - o limite de alunos não é aplicado;
  - não dá para criar treino do zero, reaproveitar treino de outro aluno ou usar modelos;
  - a tela de convite existe, mas é 100% dados de exemplo.

**Decisões do Leo:**
- tudo, em fases (1 PR por fase, o Leo testa entre elas);
- acesso do aluno por **convite com senha própria**;
- **limite de alunos aplicado no banco, sem pagamento** (upgrade manual);
- **cadastro aberto, com onboarding** do personal.

## Convenções (todas as fases)

- **SQL:** `supabase/migrations/2026MMDD_faseN_<tema>.sql`.
  - Pode rodar duas vezes sem efeito colateral (`CREATE OR REPLACE`, `IF [NOT] EXISTS`).
  - Tem um bloco **PRÉ-CHECK** comentado no topo e termina com `SELECT '✅ ...'`.
  - O Leo roda à mão no SQL Editor do Supabase (o repo não controla migrations).
  - O PR lista a ordem SQL → funções → frontend.
- **Edge Functions:**
  - reusar `_shared/supabase_client.ts` (`getSupabaseClient`, `getSupabaseAdminClient`) e `_shared/auth_helper.ts` (`corsHeaders`, `jsonResponse`, `errorResponse`);
  - identificar o usuário com `userClient.auth.getUser()`, nunca decodificando o JWT sem verificar;
  - nova variável de ambiente `APP_URL`.
- **Funções SQL auxiliares** (criadas na Fase 0, reaproveitadas depois), todas `STABLE SECURITY DEFINER`: `app_meu_personal_id()`, `app_meu_atleta_id()`, `app_personal_do_atleta()`, `app_is_god()` (lista de e-mails de `god-rls-biblioteca.sql`) e `app_is_admin_ctx()` (SQL Editor, `service_role` ou GOD).
  - Elas também evitam a recursão infinita de RLS entre `personais` e `atletas`.
- **Ao fim de cada fase:**
  - registrar em `.agent/memory/changelog.md` e `decisions.md`;
  - atualizar `estado-atual.md` (retrato + `## Pendências` com o SQL a rodar, configurações do dashboard e o roteiro de teste do Leo);
  - `npm run build` sem erro;
  - commit/push em `claude/trusting-dirac-k07d2y`.

---

## Fase 0 — Blindagem do banco (PR pequeno)

Objetivo: fechar escalada de função, sequestro de aluno e contas órfãs **sem quebrar** o cadastro atual de aluno.

**`20260930_fase0_blindagem_auth.sql`**
- **`handle_new_user`:**
  - aceita só `PERSONAL | ACADEMIA | ATLETA`; qualquer outra coisa vira ATLETA;
  - `ON CONFLICT` em `profiles` **não mexe em `role`**;
  - usa `ON CONFLICT (auth_user_id) DO NOTHING` em `personais`/`academias`;
  - **remove o `EXCEPTION WHEN OTHERS`** (um erro no cadastro passa a aparecer em vez de gerar conta órfã);
  - backfill de órfãos (reusar o bloco de `auto-provisioning.sql`).
- **`profiles`:**
  - trocar `profiles_own FOR ALL` por uma regra de SELECT e uma de UPDATE;
  - trigger `trg_profiles_bloquear_role`: trocar a função só se `app_is_admin_ctx()`.
- **`personais`:**
  - remover duplicados (via pré-check) + `UNIQUE(auth_user_id)`;
  - trocar `personal_own FOR ALL` por SELECT/UPDATE próprios (INSERT só via trigger);
  - `personais_atleta_select` (o aluno vê o próprio personal);
  - trigger `trg_personais_proteger_campos`: `plano`, `limite_atletas`, `status`, `auth_user_id` e `academia_id` só mudam se `app_is_admin_ctx()`.
- **`atletas`:** índice único parcial em `auth_user_id`.
- **`link_existing_user_to_atleta`:** reescrever com verificação de dono (`personal_id = app_meu_personal_id()`, usuário-alvo ATLETA ainda não vinculado). É temporário: sai na Fase 2.

**`20260930_fase0b_portal_rls_self.sql`** (arquivo separado, porque é o ponto de maior risco)
- Primeiro, criar regras próprias do aluno (`app_meu_atleta_id()`):
  - `fichas`, `medidas`, `assessments`, `diagnosticos`, `planos_treino` (SELECT + UPDATE — usado por `portalTrackers`), `planos_dieta`, `registros_diarios`, `notificacoes`;
  - UPDATE da própria linha em `atletas`.
- Depois, remover as regras de token `portal_*` e `notificacao_anon_*`.
- Deixar no PR um trecho de reversão (rodar de novo os `portal-rls-*.sql`).

**Código**
- `src/stores/authStore.ts`: `.single()` → `.maybeSingle()` em `fetchEntityData`, `signIn` e `checkSession`.
- `src/App.tsx:177-181`: remover o fallback `|| 'atleta'`. Conta sem perfil, ou PERSONAL sem linha em `personais`, → nova `src/components/templates/ContaIncompleta.tsx` (mensagem + Sair).
- `ProfileSelector.tsx`: nunca mostrar GOD no cadastro.

**Leo testa**
1. Novo personal é criado com `profiles` + `personais`.
2. `signUp` pelo console com `role:'GOD'` → vira ATLETA.
3. `update personais set plano='UNLIMITED'` como personal → erro.
4. Cadastro de aluno atual continua funcionando.
5. **Passada completa no portal do aluno:** hoje, registrar treino, medidas, contexto, dieta, notificações.
6. Logins antigos continuam funcionando.

---

## Fase 1 — Conta do personal

Objetivo: cadastro → onboarding curto → perfil com plano e limite reais, recuperar e alterar senha, `/personal/:id` protegido.

**`20261003_fase1_conta_personal.sql`**
- `personais` ganha `cidade`, `estado char(2)`, `especialidades text[]`, `bio`, `onboarding_completo bool default false` (`cref` e `telefone` já existem).
- Backfill: personais existentes recebem `onboarding_completo = true`.
- Trigger `trg_personais_sync_limite`: ao mudar `plano`, ajusta `limite_atletas` (FREE 10 · PRO 50 · UNLIMITED NULL).
- Upgrade manual: `UPDATE personais SET plano='PRO' WHERE email=…` (registrar em `estado-atual.md`).

**Auth (`src/stores/authStore.ts`)**
- `signUp`: incluir `emailRedirectTo`. Se o Supabase já devolver uma sessão, chamar `checkSession()` (hoje fica uma sessão "escondida"). Se não, avisar que falta confirmar o e-mail.
- Novas ações:
  - `refreshEntity()`;
  - `resetPassword(email)` (`redirectTo: origin + '/definir-senha'`);
  - `initAuthListener()` com um único `onAuthStateChange`: `SIGNED_OUT` limpa o estado; `PASSWORD_RECOVERY` → `/definir-senha`; chamadas dentro de `setTimeout(0)`.
- Extrair `handleSmartRedirect` (Login.tsx:81-137) para `src/utils/redirecionarPosLogin.ts`.

**Nova página `src/pages/auth/DefinirSenhaPage.tsx` (`/definir-senha`)**, reusada no convite da Fase 2
- Detectada no `App.tsx` junto das outras rotas, **antes** da tela de login.
- **Entrada A (principal):** `?th=<token_hash>&type=invite|recovery` → formulário (senha + confirmação, ≥8). **Só ao enviar** chama `verifyOtp({token_hash, type})` → `updateUser({password})`. Assim a prévia de link do WhatsApp não consome o token.
- **Entrada B:** sessão que chega no hash da URL (modelo padrão do Supabase) → `updateUser` direto.
- Link expirado → mensagem clara. Se já houver outra pessoa logada → "Você está logado como X — sair e continuar?".
- Depois de salvar: `checkSession()` → `redirecionarPosLogin()`.

**Login (`src/components/templates/Login/Login.tsx`)**
- "Esqueci minha senha" ganha formulário inline → `resetPassword` (mensagem neutra, sem revelar se o e-mail existe).
- Cadastro já começa com "Personal" selecionado. Depois de cadastrar, o gate de onboarding assume.
- Manter o auto-login `?p=` até a Fase 2.

**Onboarding — `src/pages/onboarding/PersonalOnboarding.tsx`** (2 passos)
1. Nome, CREF (opcional; validação leve `^\d{6}-[GP]/[A-Z]{2}$`), WhatsApp.
2. Cidade, UF, especialidades (chips).
- Campos em `src/components/organisms/PersonalDadosForm/`, reusado no perfil.
- Salvar → novo `personalService.completarOnboarding()` em `src/services/personal.service.ts` → `refreshEntity()`.
- **Gate no `App.tsx`** logo depois da tela de login (vale para desktop e mobile): PERSONAL com `!onboarding_completo` vê o onboarding. Status `SUSPENSO`/`INATIVO` vê a tela de conta suspensa (reusa `ContaIncompleta`).

**Perfil real**
- `PersonalProfilePage.tsx`:
  - "Membro desde" vem de `created_at` (`date-fns`, ptBR);
  - selo do plano + "até N alunos"/"ilimitado";
  - barra de uso `atletaService.contarAtivos()` / `limite_atletas`;
  - bio, CREF, cidade e especialidades editáveis;
  - "Fazer upgrade" abre WhatsApp do suporte;
  - "Alterar senha" abre um modal: pede a senha atual (`signInWithPassword`) e depois `updateUser`.
- `PersonalDashboard.tsx:42` passa a usar `limite_atletas` real. `src/pages/personal/ProfileScreen.tsx` (mobile) mostra os mesmos dados.
- A view `settings` do personal para de usar `AthleteSettingsPage` (que mostra cartão de crédito falso).

**`/personal/:id`**
- Sai da exceção da tela de login.
- Se o `id` não for o do personal logado, redireciona para o próprio.
- `PersonalPortal.tsx:92`: em vez de carregar para sempre, mostra erro + Sair.

**Configuração no dashboard (vira pendência para o Leo)**
- Site URL e Redirect URL `…/definir-senha`.
- Modelo de e-mail "Reset Password" → `{{ .SiteURL }}/definir-senha?th={{ .TokenHash }}&type=recovery`.
- **SMTP próprio (ex.: Resend)** para os e-mails chegarem a usuários reais.

**Leo testa**
1. Novo personal → onboarding (desktop e mobile) → dashboard.
2. Perfil mostra FREE, 0/10 e a data real.
3. Mudar `plano='PRO'` → 50.
4. Alterar senha.
5. Esqueci senha → `/definir-senha` → login.
6. `/personal/<id de outro>` → redireciona para o próprio.
7. Status `SUSPENSO` → tela de conta suspensa.

---

## Fase 2 — Alunos com convite (fim da senha padrão)

**`20261008_fase2_alunos_convite.sql`**
- **Pré-check:**
  - personais acima do limite;
  - e-mails duplicados por personal;
  - tabelas com FK para `atletas`;
  - alunos ainda com `Shape2026!` (`crypt` em `auth.users`).
- **Colunas:** `atletas.convite_enviado_em`, `acesso_ativado_em`.
- **E-mail:** trigger de normalização (`lower(trim)`) + normalizar os existentes + índice único `(personal_id, email)`.
- **`trg_atletas_limite_plano`:**
  - roda em BEFORE INSERT/UPDATE de status e personal_id;
  - trava a linha do personal com `FOR UPDATE` e conta os alunos com status diferente de `INATIVO`;
  - se já bateu o limite → `RAISE 'LIMITE_ALUNOS_ATINGIDO'`;
  - quem já está acima do limite mantém os alunos, mas não adiciona novos.
- **`trg_atletas_proteger_campos`:** `auth_user_id` e `personal_id` só mudam se `app_is_admin_ctx()`.
- **RPC `cadastrar_aluno(nome, email, telefone, sexo, objetivo)`** (SECURITY INVOKER, uma transação):
  - `INSERT atletas`;
  - `INSERT fichas … ON CONFLICT (atleta_id) DO UPDATE` (funciona com ou sem o trigger de ficha que não está no repo).
- **Só para `service_role`:** `app_auth_user_id_por_email(email)` e `app_excluir_aluno_dados(atleta_id)` (apaga os dependentes numa transação só e devolve o `auth_user_id`).
- **Para o próprio aluno:** `app_marcar_acesso_ativado()`.
- `DROP FUNCTION link_existing_user_to_atleta`.

**Edge Function `supabase/functions/convidar-aluno/index.ts`** — `POST {atleta_id, email?}` → `{link, email, tipo, expira_em}`
1. `getUser()` → busca o personal (401/403 se não houver, ou se estiver SUSPENSO/INATIVO).
2. Busca o aluno → **verifica se é do personal** (403); aluno `INATIVO` → 409.
3. Normaliza e valida o e-mail.
4. `app_auth_user_id_por_email`:
   - **mesmo `auth_user_id` do aluno** (reenvio ou aluno antigo com `Shape2026!`) → `generateLink({type:'recovery'})`;
   - **outro usuário** → 409 `EMAIL_EM_USO` (nunca gerar link para conta alheia);
   - **nenhum** → `generateLink({type:'invite', options.data:{full_name, role:'ATLETA'}})` → grava `atletas.auth_user_id` e `convite_enviado_em`. Se a gravação falhar → `auth.admin.deleteUser` (desfaz).
5. Link = `${APP_URL}/definir-senha?th=${hashed_token}&type=…`.
   - Não usar `action_link`, porque a prévia do WhatsApp consumiria o token.
   - Não usar `inviteUserByEmail`, porque sem SMTP o e-mail não chega.
   - Validade de 24h (Dashboard → Email OTP Expiration = 86400).

**Edge Function `supabase/functions/excluir-aluno/index.ts`**
- Mesma verificação de dono.
- `app_excluir_aluno_dados` → se o auth user for ATLETA e não estiver ligado a mais nenhum aluno → `auth.admin.deleteUser`.

**Frontend**
- **Novo `src/services/aluno.service.ts`:**
  - `cadastrarAluno()` (RPC + link opcional; se o link falhar, o aluno não é desfeito);
  - `gerarLinkAcesso()` (`functions.invoke('convidar-aluno')`);
  - `arquivarAluno` / `reativarAluno` (status `INATIVO`/`ATIVO`);
  - `excluirAluno()`;
  - `mensagemErro(code)` → "Seu plano FREE permite 10 alunos ativos. Arquive um aluno ou fale com o suporte…", "E-mail já cadastrado".
- Remover do `atleta.service.ts` as funções `criar`, `criarFicha` e `deletar`, que ninguém usa.
- **Componentes compartilhados:**
  - `src/hooks/useCadastroAluno.ts`;
  - `src/components/organisms/AcessoAlunoCard/` (link, Copiar, WhatsApp "crie sua senha… válido por 24h", mailto, status *ativo / convite pendente / sem acesso*).
- **Telas:**
  - `StudentRegistration.tsx` e `NovoAlunoScreen.tsx` mantêm o layout, mas usam o hook e o card. Sai **toda** a troca de sessão / `signUp` / RPC.
  - `AthleteDetailsView.tsx:136-295` e `AlunoFichaScreen.tsx:189-247` → botão "Gerar/Reenviar link de acesso" + card.
  - Arquivar passa a gravar `INATIVO` (AthleteDetailsView.tsx:477), com botões "Arquivado"/"Reativar".
  - `App.tsx` `handleDeleteAthlete` (503-569) → `excluirAluno`. A confirmação oferece "Arquivar (libera vaga)" ou "Excluir definitivamente".
  - `mappers.ts` mapeia `auth_user_id`, `convite_enviado_em` e `acesso_ativado_em`.
  - `PersonalPortal.tsx`: `recarregarAlunos` + `onAlunoCriado` (o aluno novo aparece no mobile sem recarregar a página).
  - `DefinirSenhaPage` chama `app_marcar_acesso_ativado` depois de salvar.
  - `Login.tsx` perde o auto-login `?p=` (mantém só o `?email=` preenchido).
- **Apagar:**
  - `DEFAULT_ATHLETE_PASSWORD` (3 arquivos);
  - `src/pages/athlete/AthleteLogin.tsx`;
  - `src/services/invites.ts` e `registration.ts`;
  - `AthleteInvitationModal` e a lógica de modal de convite no `App.tsx`;
  - `portalToken` e `portalService.generateToken`, que ninguém usa.
- **Alunos antigos:** continuam entrando com `Shape2026!`. O personal clica "Gerar novo link" (recovery) e o aluno cria a própria senha. A troca forçada fica para a Fase 4.

**Leo testa**
1. Cadastrar aluno → aparece um link, sem senha na tela ou na URL.
2. Colar o link no WhatsApp (a prévia não pode quebrar) → abrir em aba anônima → criar senha → cai em `/atleta`.
3. Abrir o mesmo link de novo → "expirado".
4. Aluno antigo → reenviar → a senha antiga deixa de funcionar.
5. E-mail de aluno de outro personal → "e-mail já cadastrado".
6. `invoke('convidar-aluno')` com aluno de outro personal → 403.
7. `limite_atletas=1` → segundo cadastro bloqueado com mensagem amigável; arquivar um libera a vaga.
8. Mobile: o aluno novo aparece na lista.
9. Excluir → some o aluno e o usuário de login dele.
10. Aluno sem e-mail → o cadastro funciona.

---

## Fase 3 — Treinos: correções, "Criar do zero", copiar e modelos

**Pré-check:** `\d planos_treino` (a estrutura da tabela não está no repo).

**Correções**
- **Merge da IA:**
  - novo `src/services/calculations/treinoPipeline.ts` com `enriquecerPlanoTreinoCompleto(plano, perfil, instrucoes)`;
  - passos em sequência: `structuredClone` → `enriquecerTreinoComIA` → `enriquecerPrescricaoComIA` sobre esse resultado;
  - usado em `TreinoView.tsx:260-290` e `gerarPlanoOnboardingIA.ts:260-263`;
  - fim das diretrizes descartadas e da alteração de objeto compartilhado.
- **Editar treino em branco:** `isEditMode = !!initialData && !readOnlyData` libera o conteúdo (TreinoView.tsx:500) e o bloqueio por avaliação (:202).
- **Salvar edições:**
  - `handleSaveEdits` (174-190) grava no banco também em edição e depois de salvo;
  - `salvarPlanoTreino` (treino.ts:~1001) só grava `diagnostico_id` se ele vier preenchido.
- **3x/semana sem perna:**
  - `selecionarTreinos(todos, freq, sexo)` substitui `.slice(0,freq)` (treino.ts:631/797). Homem 3x = Peito/Tri+ombro · Costas/Bi · Pernas;
  - `estruturaSemanal` passa a ser montada a partir dos treinos finais;
  - `frequenciaSemanal = treinos.length`.
- **Excluir um plano:** remover a exclusão por `atleta_id` em `AthleteDetailsView.tsx:380-387`.
- **Mobile sem plano:** `AlunoFichaScreen.tsx:325` abre `EditarTreinoScreen` com um plano vazio.

**Criar do zero**
- Novo `src/services/calculations/treinoManual.ts` com `criarPlanoTreinoVazio(atletaId, freq 2..6)`.
- `PlanoTreino.origem?: 'VITRUVIO'|'MANUAL'|'COPIA'|'MODELO'`. `SecaoVisaoAnual`/`SecaoTrimestreAtual` somem quando o plano não é VITRUVIO.
- Em `AthleteDetailsView`, "Montar treino" vira um menu:
  - Gerar com Vitrúvio (exige avaliação);
  - Criar do zero;
  - Copiar de aluno/modelo.
- Nova view `'novo-treino'` (`ViewState` em `src/utils/getPageTitle.ts` + ramo do personal no `App.tsx`) → `TreinoView` com prop `iniciarEditando`.
- **Biblioteca de exercícios no editor** (`SecaoTreinosEditavel.tsx`):
  - novo molecule `ExercicioAutocomplete` usando `exercicioBibliotecaService.buscar` (espera 300 ms após a digitação);
  - preenche `nome`, `bibliotecaId` e `urlVideo`; texto livre continua valendo (o casamento aproximado continua como reserva);
  - ativar os seletores de técnica e descanso (`TECNICAS_OPCOES`/`DESCANSO_OPCOES`, hoje sem uso).

**Copiar de outro aluno + Modelos**
- `20261015_fase3_treino_modelos.sql`: tabela `treino_modelos(id, personal_id→personais, nome, descricao, frequencia, treinos jsonb, timestamps)` com RLS `personal_id = app_meu_personal_id()` + trigger `update_updated_at`.
- `src/services/treinoModelos.service.ts`:
  - `listarPlanosDosAlunos`, `listarModelos`, `salvarComoModelo`, `excluirModelo`;
  - `copiarTreinos(treinos, destino)`: clona, gera ids novos, zera as cargas absolutas, `origem` COPIA/MODELO.
- `src/components/organisms/CopiarTreinoModal/`:
  - abas "Meus modelos" | "Outros alunos";
  - prévia com `SecaoTreinosSemanais` em modo leitura;
  - "Usar" leva à `'novo-treino'` em modo edição, depois de confirmar "Substituir treino atual de X?".
- Botão "Salvar como modelo" no `TreinoView`.

**Leo testa**
1. Homem 3x → A/B/C com perna, e a divisão bate com os treinos.
2. Diretriz "sem agachamento livre" é respeitada.
3. Editar treino → tela não fica em branco → salvar → reabrir → alteração salva, `diagnostico_id` intacto.
4. Aluno sem avaliação → criar do zero com exercícios da biblioteca → o vídeo aparece no portal do aluno.
5. Copiar de A para B → A não muda.
6. Salvar como modelo → aplicar em C.
7. Excluir um plano → os outros continuam.
8. Mobile sem plano → abre o editor vazio.

---

## Fase 4 (opcional, depois)

- Versões e rascunho de plano (`rascunho`/`arquivado` + "Publicar").
- Ajustes do aluno no portal vão para `ajustesAluno` + notificação ao personal, sem sobrescrever o plano.
- Administração de plano/limite/status no portal GOD.
- Troca forçada das senhas `Shape2026!` restantes.
- SMTP (Resend) + convite por e-mail.
- Vínculo por consentimento para aluno independente.
- Limite de links por hora no `convidar-aluno`.
- Modelos globais do VITRU.

## Verificação (cada fase)

- `npm run build` sem erro de tipo.
- Rodar o app (`npm run dev`) e usar o Playwright + Chromium já instalados para abrir as telas novas: login/esqueci senha, `/definir-senha`, onboarding, cadastro de aluno, editor de treino.
- SQL: rodar cada migration duas vezes numa cópia/branch do Supabase (se houver) e os pré-checks antes.
- Roteiro "Leo testa" de cada fase registrado em `estado-atual.md → ## Pendências`, junto com o SQL a rodar, `supabase functions deploy …`, `supabase secrets set APP_URL=…` e as configurações do dashboard.
