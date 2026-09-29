# Estado atual — VITRU IA (shape-v2) — edite no lugar

> Fotografia viva. **Consulte antes de mexer.** Atualize quando o mapa mudar.
> (Arquivo criado em 21/07/2026 para dar a este projeto a seção de **Pendências** que faltava —
> o retrato abaixo é o melhor conhecido; refine ao retomar o trabalho.)

## O que é
Dashboard de **avaliação física com IA** (VITRU IA). App front-end exportado do Google AI Studio.

## Stack & deploy
- **Vite 6 + React 19 + TypeScript + Zustand 5**; design tokens em `src/tokens/`; serviços em `src/services/` (~39 módulos); stores em `src/stores/`.
- IA = **Google Gemini** (`@google/generative-ai`) — requer `GEMINI_API_KEY` (`.env`).
- Supabase (Auth + Postgres/RLS + Edge Functions Deno em `supabase/functions/`). SQL roda **à mão** no SQL Editor.
- Convenção de memória própria em `.agent/`: `rules/`, `skills/`, e `memory/` (changelog/decisions/patterns-learned).
- Comandos: `npm run dev` · `npm run build`. **Quem testa é o Leo.**

## Fluxo Personal → Alunos → Treinos (reescrito em 30/09–15/10/2026 — plano em `docs/plano-conta-personal-alunos-treinos.md`)
- **Conta do personal**: Login → "Criar conta" (Personal por padrão, senha ≥ 8) → trigger `handle_new_user` cria
  `profiles` + `personais` (FREE, 10 alunos) → **onboarding** 2 passos (`src/pages/onboarding/PersonalOnboarding.tsx`)
  → dashboard. "Esqueci minha senha" e "Alterar senha" funcionam (`/definir-senha`). Perfil (desktop e mobile) mostra
  plano/limite/uso reais e é editável. Conta SUSPENSO/INATIVO vê tela de conta suspensa. `/personal/:id` exige login
  e só abre o do próprio personal.
- **Alunos**: cadastro via RPC `cadastrar_aluno` (`src/services/aluno.service.ts` + `useCadastroAluno`). Acesso ao
  portal por **link de uso único** (Edge Function `convidar-aluno` → `/definir-senha?th=…`), o aluno cria a própria
  senha — **não existe mais senha padrão**. Limite do plano aplicado no banco (arquivados não contam). Arquivar =
  status INATIVO; excluir = Edge Function `excluir-aluno` (dados + login).
- **Treinos**: 1 plano ativo por aluno (histórico preservado). Plano de Evolução com IA continua no `TreinoView`;
  **editor dedicado** `TreinoEditorView` para criar do zero, copiar de outro aluno, aplicar/salvar modelo
  (`treino_modelos`) e editar qualquer plano. Autocomplete da biblioteca (vídeo) no editor. Card "Treinos" na ficha
  do aluno lista todos os planos.
- **Autorização no banco**: funções `app_*` + GOD por tabela `app_admins` (não por e-mail); aluno acessa por login
  (`self_*`), personal pelos próprios alunos (`dono_all_*`). Portal por token (`portal_token`) é código morto.

## Pendências (o que ficou pendente)
- **APLICAR NO SUPABASE (depois do merge), nesta ordem** — rodar antes os PRÉ-CHECKs do topo de cada arquivo:
  1. `supabase/migrations/20260930_fase0_blindagem_auth.sql` (se avisar WARNING de duplicados, resolver e rodar de novo)
  2. `supabase/migrations/20260930_fase0b_portal_rls_self.sql` — **maior risco**; rollback no topo do arquivo
  3. `supabase/migrations/20261003_fase1_conta_personal.sql`
  4. `supabase/migrations/20261008_fase2_alunos_convite.sql`
  5. `supabase/migrations/20261015_fase3_treinos.sql`
  (Todas validadas 2x num Postgres 16 local com stub do Supabase — não no banco real.)
- **Edge Functions**: `supabase functions deploy convidar-aluno excluir-aluno` e
  `supabase secrets set APP_URL=https://<domínio de produção>` (sem isso o convite falha).
- **Dashboard Supabase → Auth**: (a) URL Configuration: Site URL = produção; Redirect URLs += `https://<prod>/definir-senha`;
  (b) Email → **Email OTP Expiration = 86400** (a UI promete link de 24h; o padrão é 1h);
  (c) Email Templates → Reset Password: link `{{ .SiteURL }}/definir-senha?th={{ .TokenHash }}&type=recovery`;
  (d) **SMTP próprio (ex.: Resend)** — sem ele o "Esqueci minha senha" não chega a usuários reais (convite de aluno
  não depende: vai por WhatsApp).
- **Vercel**: `VITE_SUPORTE_WHATSAPP` (só dígitos, com DDI) para o botão "Fazer upgrade" aparecer.
- **GOD**: agora é a tabela `app_admins` (semeada na migration com as contas GOD que já existem). Novo GOD:
  `INSERT INTO app_admins(user_id) SELECT id FROM auth.users WHERE email='…';`. A UI ainda usa a whitelist de e-mail
  (`src/types/auth.ts`) só para decidir a tela; `supabase/god-rls-biblioteca.sql` (antigo) ainda usa e-mail do JWT —
  migrar para `app_is_god()` depois.
- **Upgrade manual de plano**: `UPDATE personais SET plano='PRO' WHERE email='…';` (limite vai para 50 sozinho).
- **Alunos antigos com a senha `Shape2026!`** continuam entrando; o personal abre a ficha → "Portal do Aluno" →
  "Gerar novo link" e envia; o aluno cria a própria senha. Listar quem falta: PRÉ-CHECK (c) da migration da Fase 2.
- **Leo testar (roteiro completo no PR)**: criar personal → onboarding → perfil real; esqueci/alterar senha;
  cadastrar aluno → link no WhatsApp (prévia não pode queimar) → aluno cria senha → cai em /atleta; limite do plano
  (arquivar libera vaga); excluir aluno; masculino 3x tem perna; diretriz "sem agachamento livre" respeitada; criar
  treino do zero sem avaliação; copiar de aluno; salvar/aplicar modelo; excluir um plano não apaga os outros;
  **portal do aluno completo** (Hoje, registrar treino, medidas, contexto, dieta, notificações, comentários).
- **Fora do escopo / Fase 4**: versões/rascunho de plano; ajustes do aluno no portal notificarem o personal em vez de
  sobrescrever; admin de plano/limite no portal GOD; troca forçada das senhas antigas; `academias` ainda com
  `academia_own FOR ALL` (academia muda o próprio plano); `invites.ts`/`registration.ts` (mock) ainda usados pelo
  convite academia→personal; rate limit no `convidar-aluno`.
- Retrato detalhado de rotas/features **a preencher** ao retomar (este arquivo nasceu como esqueleto honesto).
- Conferir `GEMINI_API_KEY` no ambiente de deploy.
- **Leo testar** (22/09/2026): heatmap de Consistência na Home do atleta deve mostrar ~Abr→Set com os treinos de setembro marcados e o dia de hoje em verde/âmbar na última coluna. Métricas (116 treinos etc.) não devem mudar.
- `CardConsistenciaPersonal` (portal do personal) segue com janela ancorada no plano/trimestres — não mexido; revisar se também parecer travado.
- **Leo testar** (24/09/2026): no celular, abrir `/atleta` (e `/meu-portal`) e deitar o aparelho → deve aparecer "Gire o celular" cobrindo tudo; ao voltar pra vertical, o portal volta normal. Tablet deitado não deve mostrar o aviso.
- (Opcional) Adicionar manifest PWA com `"orientation": "portrait"` para trava nativa no Android quando instalado na tela inicial — não existe manifest hoje.

## Gotchas
- Histórico de decisões e padrões já está em `.agent/memory/decisions.md` e `patterns-learned.md` — ler antes de propor mudanças estruturais.
- Tailwind vem por CDN (`index.html`) — em ambiente sem internet as telas renderizam sem estilo (Playwright local).
- `AthleteDetailsView.tsx` tem `// @ts-nocheck`: `tsc` não pega nomes indefinidos lá — conferir à mão.
- Supabase Edge Functions: usar `npm:@supabase/supabase-js@2` (esm.sh pode estar bloqueado no ambiente).
