# CLAUDE.md — VITRU IA (shape-v2)

App de avaliação física com IA (Gemini). Vite + React 19 + Zustand 5 + design tokens.
Exportado do Google AI Studio. Comandos: `npm run dev` · `npm run build`. **Quem testa é o Leo.**

## Memória do projeto (`.agent/memory/`) — ler no início, atualizar no fim

Antes de mexer, **leia a memória**. Ao terminar qualquer tarefa, **registre as duas coisas**:

- **`changelog.md`** / **`decisions.md`** / **`patterns-learned.md`** — **o que foi feito** e por quê
  (marcos, decisões arquiteturais, padrões aprendidos). Entrada nova por tarefa concluída.
- **`estado-atual.md`** — a fotografia do que existe hoje **e a seção `## Pendências`: o que ficou
  pendente** (o que falta, o que o Leo precisa testar, envs a configurar).
  **Toda pendência que sobrar — de código ou operacional — tem de ser registrada aqui.**
