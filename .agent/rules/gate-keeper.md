---
trigger: always_on
---

# 🚦 Gate Keeper - Ativação Inteligente do Orquestrador

> Rule Always On - Analisa a solicitação e recomenda se deve ativar o Agente Orquestrador

## Instrução

Antes de executar QUALQUER solicitação relacionada a código:

1. **Analise** a complexidade e escopo da tarefa
2. **Classifique** como ALTA ou BAIXA complexidade
3. **Recomende** se deve ou não ativar o orquestrador
4. **Aguarde** confirmação do usuário

---

## Critérios de Classificação

### 🔴 ALTA Complexidade (Recomendar ATIVAR)

- Criar novo módulo ou feature completa
- Criar múltiplos componentes relacionados
- Implementar fluxo completo (ex: dashboard, formulário multi-step)
- Integrar frontend + backend + banco
- Refatorar arquitetura existente
- Criar componentes que serão reutilizados
- Implementar lógica de negócio complexa
- Trabalhar com cálculos (proporções, gordura, métricas)

### 🟢 BAIXA Complexidade (Recomendar NÃO ativar)

- Corrigir bug ou typo
- Ajustar estilo/CSS pontual
- Adicionar/remover campo simples
- Renomear variável ou arquivo
- Tirar dúvida sobre código existente
- Explicar conceito
- Alteração em um único arquivo pequeno
- Consulta rápida

---

## Formato da Pergunta

### Se ALTA complexidade:
```
🤖 **Análise da Solicitação**

Detectei: [descrição do que foi solicitado]
Complexidade: 🔴 Alta
Módulos envolvidos: [lista de módulos/skills]

**Recomendo ATIVAR o orquestrador** para garantir:
- Padrões do Gold Standard
- Consistência com specs existentes
- Código componentizado e tipado

→ Confirma? (SIM / NÃO)
```

### Se BAIXA complexidade:
```
🤖 **Análise da Solicitação**

Detectei: [descrição do que foi solicitado]
Complexidade: 🟢 Baixa

**Recomendo seguir SEM orquestrador** - tarefa simples e pontual.

→ Confirma? (SIM para seguir sem / NÃO para ativar orquestrador)
```

---

## Comportamento Pós-Confirmação

### Usuário ATIVA orquestrador:
1. Carregue `skills/gold-standard/SKILL.md` (SEMPRE)
2. Identifique e carregue SKILLs relevantes por keywords
3. Identifique e carregue SPECs do módulo afetado
4. Execute seguindo protocolo completo do `.agent/AGENT.md`
5. Entregue com relatório estruturado

### Usuário NÃO ativa orquestrador:
1. Execute a tarefa diretamente
2. Mantenha boas práticas básicas (tipar, não duplicar)
3. Resposta simples e direta

---

## Atalhos (pular análise)

| Prefixo | Ação |
|---------|------|
| `!` | Executa SEM orquestrador, sem perguntar |
| `@agent` | Executa COM orquestrador, sem perguntar |

**Exemplos:**
- `! corrige o typo no botão` → Direto, sem perguntar
- `@agent crie o módulo de avaliações` → Orquestrador, sem perguntar

---

## Exceções (não perguntar, decidir automaticamente)

### Executar SEM orquestrador:
- Pergunta/dúvida teórica
- Não envolve código
- Explicação de algo existente
- Prefixo `!`

### Executar COM orquestrador:
- Prefixo `@agent`
- Usuário menciona "seguir specs" ou "usar padrões"
- Solicitação menciona múltiplos módulos explicitamente