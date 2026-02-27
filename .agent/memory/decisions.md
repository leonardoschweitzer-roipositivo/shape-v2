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

<!-- Novas decisões serão adicionadas acima desta linha -->