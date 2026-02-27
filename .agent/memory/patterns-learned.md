# 🧠 Patterns Learned

> Padrões descobertos durante o desenvolvimento do VITRU IA

---

## Formato de Registro

```
### [DATA] - [NOME DO PADRÃO]

**Contexto**: Onde/como foi descoberto
**Padrão**: Descrição do padrão
**Exemplo**: Código ou referência
**Aplicar em**: Onde reutilizar
**Adicionado à SKILL**: [caminho] ou "Pendente"
```

---

## Padrões Registrados

### 2026-02-26 - Hook de Medidas Corporais

**Contexto**: Ao criar componentes de avaliação física, percebeu-se que a lógica de conversão e validação de medidas se repetia.

**Padrão**: Criar hook `useBodyMeasurements` que encapsula:
- Conversão de unidades (cm/in, kg/lb)
- Validação de ranges aceitáveis
- Formatação para exibição
- Cálculos derivados (IMC, proporções)

**Exemplo**:
```tsx
const { 
  measurements,
  setMeasurement,
  convertTo,
  isValid,
  calculated 
} = useBodyMeasurements(initialData);

// calculated.bmi, calculated.bodyFatPercentage, etc.
```

**Aplicar em**: Qualquer componente que manipule medidas corporais
**Adicionado à SKILL**: `skills/frontend/SKILL.md`

---

### 2026-02-26 - Componente de Proporção Áurea Visual

**Contexto**: Exibir proporções áureas requer visualização comparativa entre medida atual e ideal.

**Padrão**: Componente `ProportionGauge` que mostra:
- Barra de progresso com zona ideal destacada
- Indicador da posição atual
- Diferença percentual
- Código de cores (vermelho/amarelo/verde)

**Exemplo**:
```tsx
<ProportionGauge
  label="Ombros / Cintura"
  current={1.42}
  ideal={1.618}
  tolerance={0.1}
/>
```

**Aplicar em**: Dashboard de avaliações, relatórios de evolução
**Adicionado à SKILL**: `skills/ui-ux/SKILL.md`

---

### 2026-02-26 - Padrão de Formulário com Auto-Save

**Contexto**: Formulários longos de avaliação física perdiam dados se usuário saísse da página.

**Padrão**: Implementar auto-save com:
- Debounce de 2 segundos após última alteração
- Indicador visual de "salvando..." / "salvo"
- Recuperação de rascunho ao voltar
- Armazenamento em localStorage + Supabase draft

**Exemplo**:
```tsx
const { register, isDirty, saveStatus } = useAutoSaveForm({
  key: 'assessment-draft',
  onSave: (data) => saveDraft(data),
  debounceMs: 2000
});
```

**Aplicar em**: Todos os formulários com mais de 5 campos
**Adicionado à SKILL**: `skills/frontend/SKILL.md`

---

<!-- Novos padrões serão adicionados acima desta linha -->