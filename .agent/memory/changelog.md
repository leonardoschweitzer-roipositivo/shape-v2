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

<!-- Novos registros serão adicionados acima desta linha -->