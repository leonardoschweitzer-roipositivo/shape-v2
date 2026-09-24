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

## Pendências (o que ficou pendente)
- **Projeto dormente** desde ~20/04/2026 (último commit `40b8743`) — confirmar com o Leo se segue vivo antes de investir.
- Retrato detalhado de rotas/features **a preencher** ao retomar (este arquivo nasceu como esqueleto honesto).
- Conferir `GEMINI_API_KEY` no ambiente de deploy.
- **Leo testar** (22/09/2026): heatmap de Consistência na Home do atleta deve mostrar ~Abr→Set com os treinos de setembro marcados e o dia de hoje em verde/âmbar na última coluna. Métricas (116 treinos etc.) não devem mudar.
- `CardConsistenciaPersonal` (portal do personal) segue com janela ancorada no plano/trimestres — não mexido; revisar se também parecer travado.

- **Leo testar** (24/09/2026): no celular, abrir `/atleta` (e `/meu-portal`) e deitar o aparelho → deve aparecer "Gire o celular" cobrindo tudo; ao voltar pra vertical, o portal volta normal. Tablet deitado não deve mostrar o aviso.
- (Opcional) Adicionar manifest PWA com `"orientation": "portrait"` para trava nativa no Android quando instalado na tela inicial — não existe manifest hoje.

## Gotchas
- Histórico de decisões e padrões já está em `.agent/memory/decisions.md` e `patterns-learned.md` — ler antes de propor mudanças estruturais.
