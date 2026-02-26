---
trigger: always_on
---

# 🛡️ Code Guard

> Regra de guarda para desenvolvimento spec-driven

---

## Quando Aplicar

**SEMPRE** que código for:
- Criado
- Modificado
- Refatorado
- Revisado

---

## Instruções Obrigatórias

### 1. Double-Check Specs

Antes de escrever qualquer código, você **DEVE** ler e validar contra:

| Documento | Propósito |
|-----------|-----------|
| `specs/prd/PRD.md` | Alinhamento com requisitos de negócio |
| `skills/gold-standard/SKILL.md` | Padrões de código e arquitetura |
| `specs/modules/{módulo}/SPEC.md` | Requisitos específicos do módulo |

### 2. Refactoring Protocol

Ao refatorar código existente:

- [ ] Priorize conformidade com `gold-standard`
- [ ] Verifique se lógica ainda cumpre requisitos do PRD
- [ ] Mantenha ou melhore cobertura de tipos
- [ ] Não introduza código duplicado
- [ ] Atualize SPEC se comportamento mudar

### 3. Architecture & UI/UX

- Mantenha arquitetura limpa conforme `specs/architecture/`
- UI/UX deve seguir `skills/ui-ux/SKILL.md`
- Se mudança conflita com arquitetura estabelecida → **FLAG IMEDIATAMENTE**

### 4. Checklist Pré-Entrega

Antes de entregar código, verifique:

```
□ TypeScript strict satisfeito (sem any, sem erros)
□ Componentes seguem padrão de componentização
□ Não há código duplicado (DRY)
□ Design tokens utilizados (sem cores/valores hardcoded)
□ Nomenclatura consistente com projeto
□ Funções públicas documentadas
```

---

## Fluxo de Execução

```
┌─────────────────────────────────────┐
│ 1. Recebe tarefa de código          │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 2. Carrega: gold-standard + specs   │
│    do módulo afetado                │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 3. Valida requisitos contra PRD     │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 4. Implementa seguindo padrões      │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 5. Executa checklist pré-entrega    │
└─────────────────┬───────────────────┘
                  ▼
┌─────────────────────────────────────┐
│ 6. Entrega + atualiza specs se      │
│    necessário                       │
└─────────────────────────────────────┘
```

---

## Violações Comuns

❌ Implementar sem ler a SPEC do módulo
❌ Usar `any` no TypeScript
❌ Hardcodar cores ou valores de espaçamento
❌ Criar componente com mais de 150 linhas
❌ Duplicar lógica que já existe em outro lugar
❌ Ignorar padrões de nomenclatura

---

## Relacionado

- `source-of-truth.md` → Hierarquia de autoridade
- `conflict-resolution.md` → O que fazer em caso de conflito
- `skills/gold-standard/SKILL.md` → Padrões técnicos detalhados