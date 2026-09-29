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
### 2026-09-22 - Janelas de tempo sempre relativas a "hoje"

**Contexto**: Heatmap de consistência do atleta travou em Mar–Ago porque a janela foi hardcoded (`new Date(ano, 2, 1)`).
**Padrão**: Visualizações temporais (heatmaps, gráficos "últimos N") devem ancorar em hoje, nunca em mês fixo.
Chaves de dia via `getFullYear/getMonth/getDate` (fuso local), não `toISOString()` (UTC). Se a janela cruza o
ano, a query de dados também precisa cruzar.
**Aplicar em**: `CardConsistencia`, `CalendarHeatmap`, qualquer gráfico de evolução.

### 2026-10-15 - Privilégio nunca pelo e-mail do perfil nem do JWT sozinho

**Contexto**: GOD era decidido por whitelist de e-mail (JWT/profile). Com confirmação de e-mail desligada, qualquer um
se cadastra com um e-mail da lista ainda não registrado; `profiles.email` era editável pelo próprio usuário.
**Padrão**: privilégio = linha em tabela administrada (`app_admins`) + função `SECURITY DEFINER`; no front, usar o
e-mail do login (`authStore.user.email`), nunca `profile.email`, e travar colunas espelho do auth por trigger.
**Aplicar em**: qualquer checagem de papel/admin (RLS e gates do App).

### 2026-10-15 - Link de uso único: consumir só no submit

**Padrão**: links de convite/recuperação apontam para a página do app com `token_hash`; `verifyOtp` só no envio do
formulário (prévias de WhatsApp/e-mail fazem GET e queimariam `action_link`). Depois de consumir, seguir na sessão
(retries não chamam `verifyOtp` de novo). Modo "sessão sem token" só se a página veio de um link de recuperação.
