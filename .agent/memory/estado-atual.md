# Estado atual — VITRU IA (shape-v2) — edite no lugar

> Fotografia viva. **Consulte antes de mexer.** Atualize quando o mapa mudar.
> (Arquivo criado em 21/07/2026 para dar a este projeto a seção de **Pendências** que faltava —
> o retrato abaixo é o melhor conhecido; refine ao retomar o trabalho.)

## O que é
Dashboard de **avaliação física com IA** (VITRU IA). App front-end exportado do Google AI Studio.

## Stack & deploy
- **Vite 6 + React 19 + TypeScript + Zustand 5**; design tokens em `src/tokens/`; serviços em `src/services/` (~39 módulos); stores em `src/stores/`.
- IA = **Google Gemini** (`@google/generative-ai`) — requer `GEMINI_API_KEY` (`.env`).
- Convenção de memória própria em `.agent/`: `rules/`, `skills/`, e `memory/` (changelog/decisions/patterns-learned).
- Comandos: `npm run dev` · `npm run build`. **Quem testa é o Leo.**

## Fluxo Personal → Alunos → Treinos (mapeado em 30/09/2026)
- **Conta**: Login → "Criar conta" → Personal → trigger `handle_new_user` cria `profiles` + `personais` (FREE, 10 alunos).
  Login só email+senha. Sem onboarding, sem reset de senha funcional (Fase 1).
- **Alunos**: `StudentRegistration` (desktop) e `NovoAlunoScreen` (mobile `/personal/:id`) — insert direto em `atletas`
  + conta do aluno criada no navegador do personal com senha padrão `Shape2026!` (sai na Fase 2 → convite).
- **Treinos**: Montar Plano → Diagnóstico → `TreinoView` (regras em `calculations/treino.ts` + Gemini) → Dieta.
  Bugs conhecidos (merge da IA, editar em branco, 3x sem perna, excluir apaga todos) → Fase 3.
- **Plano completo em `docs/plano-conta-personal-alunos-treinos.md`** — Fase 0 feita (30/09), Fases 1–3 aguardando teste da 0.
- **Autorização no banco**: funções `app_*` (ver `decisions.md` 2026-09-30); aluno acessa por login (`self_*`),
  personal pelos próprios alunos (`dono_all_*`). Portal por token (`portal_token`) é código morto.

## Pendências (o que ficou pendente)
- **FASE 0 — Leo rodar no Supabase SQL Editor, nesta ordem** (antes, rodar os PRÉ-CHECKs do topo de cada arquivo):
  1. `supabase/migrations/20260930_fase0_blindagem_auth.sql` — se avisar WARNING de duplicados em
     `personais`/`atletas.auth_user_id`, resolver e rodar de novo.
  2. `supabase/migrations/20260930_fase0b_portal_rls_self.sql` — **maior risco**; rollback descrito no topo do arquivo.
- **FASE 0 — Leo testar**: (1) criar conta Personal nova → entra no dashboard normal; (2) no console,
  `supabase.auth.signUp({email, password, options:{data:{role:'GOD'}}})` → profile nasce ATLETA;
  (3) logado como personal, `supabase.from('personais').update({plano:'UNLIMITED'}).eq('id', <seu id>)` → erro
  CAMPO_ADMINISTRATIVO; (4) cadastrar aluno com "Criar acesso" continua funcionando; (5) **portal do aluno completo**:
  Hoje, registrar treino, editar exercício, medidas, contexto/onboarding, dieta, notificações e comentários;
  (6) personal: lista de alunos, notificações, editar treino; (7) GOD dashboard mostra contagens; (8) logins antigos ok.
- **Próximas fases** (só depois do OK da Fase 0): Fase 1 conta do personal (onboarding, esqueci/alterar senha, perfil
  real, `/personal/:id` protegido) → Fase 2 alunos por convite (Edge Functions `convidar-aluno`/`excluir-aluno`,
  limite no banco) → Fase 3 treinos (correções, criar do zero, copiar/modelos). Detalhes no plano.
- `academias` ainda com `academia_own FOR ALL` (academia pode mudar o próprio plano/limite) — tratar junto com admin GOD (Fase 4).
- Retrato detalhado de rotas/features **a preencher** ao retomar (este arquivo nasceu como esqueleto honesto).
- Conferir `GEMINI_API_KEY` no ambiente de deploy.
- **Leo testar** (22/09/2026): heatmap de Consistência na Home do atleta deve mostrar ~Abr→Set com os treinos de setembro marcados e o dia de hoje em verde/âmbar na última coluna. Métricas (116 treinos etc.) não devem mudar.
- `CardConsistenciaPersonal` (portal do personal) segue com janela ancorada no plano/trimestres — não mexido; revisar se também parecer travado.

- **Leo testar** (24/09/2026): no celular, abrir `/atleta` (e `/meu-portal`) e deitar o aparelho → deve aparecer "Gire o celular" cobrindo tudo; ao voltar pra vertical, o portal volta normal. Tablet deitado não deve mostrar o aviso.
- (Opcional) Adicionar manifest PWA com `"orientation": "portrait"` para trava nativa no Android quando instalado na tela inicial — não existe manifest hoje.

## Gotchas
- Histórico de decisões e padrões já está em `.agent/memory/decisions.md` e `patterns-learned.md` — ler antes de propor mudanças estruturais.
