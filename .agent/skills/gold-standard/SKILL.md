# ⭐ Gold Standard - Padrão Ouro de Programação

> **SKILL OBRIGATÓRIA** - Consultar em TODA tarefa de código

---

## 🎯 Propósito

Esta skill define os padrões de excelência que **DEVEM** ser seguidos em todo código do VITRU IA. É a fundação de qualidade do projeto.

**Carregar**: SEMPRE, em qualquer tarefa que envolva código.

---

## 🏗️ 1. Arquitetura e Componentização

### 1.1 Single Responsibility Principle (SRP)

Cada componente/função/módulo deve ter **UMA** única responsabilidade.

```tsx
// ❌ ERRADO - Componente faz muitas coisas
function UserDashboard() {
  const [user, setUser] = useState()
  const [metrics, setMetrics] = useState()
  const [assessments, setAssessments] = useState()
  
  useEffect(() => { fetchUser() }, [])
  useEffect(() => { fetchMetrics() }, [])
  useEffect(() => { calculateProgress() }, [])
  
  return (/* 200 linhas de JSX */)
}

// ✅ CORRETO - Responsabilidades separadas
function UserDashboard() {
  return (
    <DashboardLayout>
      <UserHeader />
      <MetricsGrid />
      <AssessmentsList />
      <ProgressChart />
    </DashboardLayout>
  )
}
```

### 1.2 Tamanho Máximo de Arquivos

| Tipo | Máximo | Ação se ultrapassar |
|------|--------|---------------------|
| Componentes | 150 linhas | Dividir em subcomponentes |
| Hooks | 100 linhas | Extrair lógica para utils |
| Utilitários | 50 linhas/função | Dividir em funções menores |
| Tipos | 100 linhas | Separar por domínio |

### 1.3 Composição sobre Herança

```tsx
// ✅ Composição
<Card>
  <CardHeader>
    <CardTitle>Avaliação</CardTitle>
  </CardHeader>
  <CardContent>
    {children}
  </CardContent>
</Card>
```

---

## 🚫 2. DRY - Don't Repeat Yourself

### 2.1 Regra dos 2

Código duplicado **2+ vezes** DEVE ser extraído.

```tsx
// ❌ ERRADO - Lógica duplicada
function ComponentA() {
  const formatted = `${value.toFixed(2)}%`
}
function ComponentB() {
  const formatted = `${value.toFixed(2)}%`
}

// ✅ CORRETO - Utilitário extraído
// utils/formatters.ts
export const formatPercentage = (value: number) => `${value.toFixed(2)}%`

// Componentes usam
const formatted = formatPercentage(value)
```

### 2.2 Tabela de Extração

| Duplicação | Extrair para |
|------------|--------------|
| Lógica de UI | Componente reutilizável |
| Lógica de estado | Hook customizado |
| Lógica de negócio | Utilitário/Service |
| Estilos repetidos | Design Token ou classe |
| Tipos repetidos | Interface compartilhada |

---

## 🎨 3. Design Tokens

### 3.1 Regra de Ouro

**NUNCA** use valores hardcoded. **SEMPRE** use tokens.

```tsx
// ❌ ERRADO - Valores hardcoded
<div style={{ color: '#d4a853', padding: '16px', borderRadius: '8px' }}>

// ✅ CORRETO - Design Tokens via Tailwind
<div className="text-gold p-4 rounded-lg">

// ✅ CORRETO - CSS Variables
<div style={{ color: 'var(--color-gold)' }}>
```

### 3.2 Tokens do VITRU IA

```ts
// Cores principais
--color-gold: #d4a853
--color-gold-light: #e8c97a
--color-bg: #0a0a0a
--color-surface: #111111
--color-border: #2a2a2a
--color-text-primary: #ffffff
--color-text-secondary: #888888

// Espaçamento (usar classes Tailwind)
p-1 = 4px    p-2 = 8px    p-3 = 12px
p-4 = 16px   p-6 = 24px   p-8 = 32px

// Border radius
rounded-sm = 4px   rounded = 6px    rounded-md = 8px
rounded-lg = 12px  rounded-xl = 16px rounded-full = 9999px
```

---

## 📁 4. Estrutura de Pastas

### 4.1 Feature-Based Structure

Organize por funcionalidade, não por tipo.

```
// ✅ CORRETO - Por feature
src/
  features/
    assessments/
      components/
        AssessmentForm.tsx
        AssessmentCard.tsx
      hooks/
        useAssessment.ts
        useBodyMeasurements.ts
      services/
        assessmentService.ts
      types/
        assessment.types.ts
      utils/
        calculations.ts
      index.ts          # Barrel export
    dashboard/
      components/
      hooks/
      index.ts
  shared/              # Componentes compartilhados
    components/
      Button/
      Card/
      Input/
    hooks/
    utils/
```

### 4.2 Barrel Exports

Cada feature DEVE ter um `index.ts`:

```ts
// features/assessments/index.ts
export { AssessmentForm } from './components/AssessmentForm'
export { AssessmentCard } from './components/AssessmentCard'
export { useAssessment } from './hooks/useAssessment'
export type { Assessment, Measurement } from './types/assessment.types'
```

---

## 🔒 5. TypeScript Strict

### 5.1 Configuração Obrigatória

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 5.2 Tipos Explícitos

Props, returns e variáveis importantes **DEVEM** ter tipos explícitos.

```tsx
// ❌ ERRADO
const formatValue = (value) => { ... }
function Component({ data }) { ... }

// ✅ CORRETO
interface MeasurementData {
  value: number
  unit: 'cm' | 'in'
  timestamp: Date
}

const formatValue = (value: number): string => { ... }

interface ComponentProps {
  data: MeasurementData
  onUpdate?: (data: MeasurementData) => void
}

function Component({ data, onUpdate }: ComponentProps): JSX.Element { ... }
```

### 5.3 Proibição de `any`

```tsx
// ❌ PROIBIDO
const data: any = fetchData()

// ✅ CORRETO
const data: unknown = fetchData()
if (isMeasurementData(data)) {
  // TypeScript sabe que data é MeasurementData
}
```

---

## ⚡ 6. Performance

### 6.1 Memoização Estratégica

```tsx
// Componentes que recebem objetos/arrays
const MemoizedChart = React.memo(EvolutionChart)

// Cálculos pesados
const processedData = useMemo(() => 
  calculateProportions(measurements), 
  [measurements]
)

// Callbacks passados para children
const handleUpdate = useCallback((id: string) => {
  updateAssessment(id)
}, [updateAssessment])
```

### 6.2 Lazy Loading

```tsx
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### 6.3 Evite Re-renders

```tsx
// ❌ ERRADO - Objeto novo a cada render
<Component style={{ margin: 10 }} data={[1,2,3]} />

// ✅ CORRETO - Referências estáveis
const style = useMemo(() => ({ margin: 10 }), [])
const data = useMemo(() => [1,2,3], [])
<Component style={style} data={data} />
```

---

## 📝 7. Documentação no Código

### 7.1 JSDoc para Funções Públicas

```tsx
/**
 * Calcula o percentual de gordura corporal usando método de 7 dobras.
 * 
 * @param measurements - Medidas das dobras cutâneas em mm
 * @param age - Idade do atleta em anos
 * @param gender - Gênero ('M' ou 'F')
 * @returns Percentual de gordura corporal
 * 
 * @example
 * const bf = calculateBodyFat({ triceps: 10, ... }, 25, 'M')
 * // Returns: 12.5
 */
export function calculateBodyFat(
  measurements: SkinFoldMeasurements,
  age: number,
  gender: Gender
): number {
  // ...
}
```

### 7.2 Comentários Estratégicos

Comente o **PORQUÊ**, não o **QUÊ**.

```tsx
// ❌ ERRADO - Comenta o óbvio
// Incrementa o contador
counter++

// ✅ CORRETO - Explica decisão
// Usamos 7 dobras em vez de 3 para maior precisão em atletas
// Referência: Jackson & Pollock (1978)
const bodyFat = calculate7FoldMethod(measurements)
```

---

## ✅ 8. Checklist Pré-Entrega

Antes de finalizar **QUALQUER** código:

### Arquitetura
- [ ] Componentes têm responsabilidade única?
- [ ] Arquivos dentro do limite de linhas?
- [ ] Estrutura segue feature-based?

### Qualidade
- [ ] Código duplicado foi extraído?
- [ ] Design tokens sendo usados?
- [ ] TypeScript strict satisfeito?
- [ ] Não há uso de `any`?

### Performance
- [ ] Memoização onde necessário?
- [ ] Lazy loading para componentes pesados?
- [ ] Sem objetos/arrays inline em props?

### Manutenibilidade
- [ ] Funções públicas documentadas?
- [ ] Nomes descritivos e consistentes?
- [ ] Barrel exports configurados?

---

## 📝 Notas de Aprendizado

<!-- Seção atualizada pelo agente quando novos padrões são descobertos -->

### 2026-02-26 - Hook useBodyMeasurements
Padrão de hook para encapsular lógica de medidas corporais.
Ver `memory/patterns-learned.md` para detalhes.

---

## 🔗 Referências

- [React Patterns](https://reactpatterns.com/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Tailwind CSS](https://tailwindcss.com/docs)