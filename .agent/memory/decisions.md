# 📝 Decisions Log

> Registro de decisões arquiteturais importantes do VITRU IA

---

## Formato de Registro

```
### [DATA] - [TÍTULO DA DECISÃO]

**Contexto**: Por que a decisão foi necessária
**Decisão**: O que foi decidido
**Alternativas Consideradas**: O que mais foi avaliado
**Consequências**: Impacto da decisão
**Status**: Ativa | Revisada | Obsoleta
```

---

## Decisões Registradas

### 2026-02-26 - Adoção do Process Disclosure

**Contexto**: Context window da LLM ficava sobrecarregado ao carregar todas as specs e skills de uma vez, resultando em respostas genéricas e perda de padrões definidos.

**Decisão**: Implementar sistema de carregamento seletivo onde o agente:
1. Analisa a solicitação primeiro (sem carregar nada)
2. Identifica SKILLs e SPECs relevantes
3. Carrega APENAS o necessário
4. Executa a tarefa
5. Atualiza docs se aprendeu algo novo

**Alternativas Consideradas**:
- Carregar tudo sempre → Descartado por sobrecarregar contexto
- Usar múltiplos agentes especializados → Complexidade excessiva
- Resumir docs automaticamente → Perda de detalhes importantes

**Consequências**:
- Context window ~10x mais leve
- Respostas mais precisas e consistentes
- Requer manutenção de índices (_INDEX.md)
- Agente precisa de lógica de roteamento

**Status**: Ativa

---

### 2026-02-26 - Gold Standard como SKILL Obrigatória

**Contexto**: Código gerado variava em qualidade dependendo das instruções dadas em cada sessão.

**Decisão**: Criar `skills/gold-standard/SKILL.md` que é carregada em TODA tarefa de código, definindo:
- Padrões de componentização
- Regras DRY
- Design Tokens
- TypeScript strict
- Convenções de nomenclatura

**Alternativas Consideradas**:
- Incluir padrões no PRD → Mistura negócio com técnico
- Criar rule em vez de skill → Rules são comportamentais, não técnicas
- Deixar implícito → Inconsistência garantida

**Consequências**:
- Código consistente entre sessões
- Overhead mínimo (~2KB sempre carregados)
- Padrões evoluem conforme projeto amadurece

**Status**: Ativa

---

### 2026-02-26 - Organização por Feature/Módulo

**Contexto**: Specs estavam todas em uma pasta flat, dificultando identificar o que carregar para cada tarefa.

**Decisão**: Reorganizar specs em estrutura hierárquica:
```
specs/
├── prd/           → Visão do produto
├── architecture/  → Decisões técnicas globais
├── modules/       → Um subdiretório por feature
│   ├── onboarding/
│   ├── dashboard/
│   ├── assessments/
│   └── ...
└── design/        → UI/UX e fluxos visuais
```

**Alternativas Consideradas**:
- Manter flat com prefixos → Difícil navegação
- Separar por tipo (components/, hooks/, etc.) → Não reflete domínio de negócio

**Consequências**:
- Fácil identificar specs relacionadas
- Carregamento por módulo simplificado
- Alinhado com estrutura de código (feature-based)

**Status**: Ativa

---

### 2026-02-27 - Contexto do Atleta como JSONB na tabela fichas

**Contexto**: Necessidade de armazenar informações qualitativas sobre o atleta (saúde, medicações, lesões, estilo de vida, profissão, histórico de treino e dietas) para uso pela IA e pelo personal.

**Decisão**: Armazenar como campo JSONB (`contexto`) na tabela `fichas` existente, em vez de tabelas relacionais separadas ou arquivos `.md`.

**Alternativas Consideradas**:
- Tabelas relacionais (CondicaoSaude, Lesao, Medicamento) → Over-engineering para fase atual
- Arquivos .md por atleta → Inseguro, complexo de sincronizar, sem RLS
- Campo texto simples → Sem estrutura para IA processar

**Consequências**:
- Flexibilidade: campos podem ser adicionados sem migrations
- Segurança: RLS do Supabase protege dados sensíveis de saúde
- Performance: uma query retorna tudo, fácil de passar como contexto para IA

**Status**: Ativa

---

### 2026-09-24 - Trava de orientação via overlay (não via API)

**Decisão**: Portal do Aluno "travado" na vertical com overlay CSS "Gire o celular" + tentativa de
`screen.orientation.lock` como bônus.
**Por quê**: iOS/Safari não permite travar rotação de página web (nem em PWA). O overlay é o único
jeito que funciona em todos os celulares. Trava nativa real só existiria com app nativo (Capacitor etc.)
ou manifest PWA `orientation: portrait` (Android, app instalado) — o projeto não tem manifest hoje.

**Status**: Ativa

---

### 2026-09-30 - Autorização no banco via funções `app_*` SECURITY DEFINER

**Contexto**: RLS espalhada em scripts soltos, com subqueries `personais ↔ atletas` (risco de recursão) e policies
de portal por token abertas para qualquer usuário. Papel (`role`) vinha do cliente no cadastro e podia ser alterado.
**Decisão**: (1) funções `app_meu_personal_id()`, `app_meu_atleta_id()`, `app_personal_do_atleta()`,
`app_atleta_eh_meu(id)`, `app_is_god()`, `app_is_admin_ctx()` como base de toda policy nova; (2) aluno acessa só
por login (`self_*`), personal pelos próprios alunos (`dono_all_*`); (3) campos administrativos (role, plano,
limite, status, vínculos) só mudam em contexto admin (SQL Editor, service_role ou GOD), via trigger;
(4) cadastro público aceita só PERSONAL/ACADEMIA/ATLETA. Plano completo: `docs/plano-conta-personal-alunos-treinos.md`
(acesso do aluno por convite com senha própria; limite de alunos no banco sem pagamento; cadastro aberto com onboarding).
**Alternativas**: manter token do portal (código morto, inseguro); checar papel só no front (burlável).
**Status**: Ativa

---

### 2026-10-08 - Acesso do aluno por link de uso único gerado no servidor

**Contexto**: alunos recebiam a senha padrão `Shape2026!` na URL; a conta era criada no navegador do personal
trocando a sessão (frágil) e a RPC de vínculo permitia sequestro de aluno.
**Decisão**: Edge Function `convidar-aluno` (service_role, após checar que o aluno é do personal) usa
`auth.admin.generateLink` (`invite` p/ novo login, `recovery` p/ reenvio) e devolve um link do **app**
`/definir-senha?th=<hashed_token>&type=...`. O token só é consumido no submit (`verifyOtp`) — prévia de link do
WhatsApp não queima o convite. Sem SMTP: o personal envia por WhatsApp/cópia. E-mail de outra conta → 409.
**Alternativas**: `inviteUserByEmail` (depende de SMTP), `action_link` do Supabase (GET consome o token),
senha temporária aleatória (ainda trafega senha).
**Status**: Ativa

---

### 2026-10-08 - Limite de alunos aplicado no banco (sem pagamento)

**Decisão**: trigger `trg_atletas_limite_plano` conta alunos com status ≠ INATIVO (arquivar libera vaga);
`limite_atletas` NULL = ilimitado; plano ajusta limite via trigger (FREE 10 · PRO 50 · UNLIMITED). Upgrade manual
pelo SQL Editor/GOD. Front só traduz o erro `LIMITE_ALUNOS_ATINGIDO`.
**Status**: Ativa

---

<!-- Novas decisões serão adicionadas acima desta linha -->