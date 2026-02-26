# 🎨 Frontend Skill

> Padrões e convenções de desenvolvimento frontend do VITRU IA

---

## 🎯 Propósito

Consultar quando a tarefa envolver:
- Criação de componentes React
- Hooks customizados
- Gerenciamento de estado
- Formulários e validação
- Integração com UI

**Keywords**: componente, react, hook, tela, UI, estado, formulário, form

---

## 📁 Estrutura de Arquivos

```
src/
  features/
    {feature}/
      components/
        {ComponentName}/
          {ComponentName}.tsx
          {ComponentName}.test.tsx  # Se tiver teste
          index.ts
      hooks/
        use{HookName}.ts
      types/
        {feature}.types.ts
      utils/
        {utility}.ts
      index.ts                      # Barrel export
  shared/
    components/
    hooks/
    utils/
```

---

## 🧩 Padrões e Convenções

### 1. Estrutura de Componente

```tsx
// components/AssessmentCard/AssessmentCard.tsx

import { memo } from 'react'
import type { Assessment } from '../../types/assessment.types'

// 1. Types no topo
interface AssessmentCardProps {
  assessment: Assessment
  onSelect?: (id: string) => void
  className?: string
}

// 2. Componente com memo se receber objetos/arrays
export const AssessmentCard = memo(function AssessmentCard({
  assessment,
  onSelect,
  className
}: AssessmentCardProps) {
  // 3. Hooks primeiro
  const { formatDate } = useFormatters()
  
  // 4. Handlers
  const handleClick = useCallback(() => {
    onSelect?.(assessment.id)
  }, [assessment.id, onSelect])
  
  // 5. Early returns para loading/error
  if (!assessment) return null
  
  // 6. Render
  return (
    <div className={cn('card', className)} onClick={handleClick}>
      {/* JSX */}
    </div>
  )
})
```

### 2. Hooks Customizados

```tsx
// hooks/useAssessment.ts

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Assessment } from '../types/assessment.types'

interface UseAssessmentReturn {
  assessment: Assessment | null
  isLoading: boolean
  error: Error | null
  fetch: (id: string) => Promise<void>
  update: (data: Partial<Assessment>) => Promise<void>
}

export function useAssessment(initialId?: string): UseAssessmentReturn {
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const fetch = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setAssessment(data)
    } catch (e) {
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  const update = useCallback(async (data: Partial<Assessment>) => {
    if (!assessment) return
    // ... update logic
  }, [assessment])
  
  return { assessment, isLoading, error, fetch, update }
}
```

### 3. Formulários com React Hook Form

```tsx
// components/AssessmentForm.tsx

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assessmentSchema, type AssessmentFormData } from '../schemas/assessment.schema'

export function AssessmentForm({ onSubmit }: AssessmentFormProps) {
  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      weight: 0,
      height: 0,
      // ...
    }
  })
  
  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Peso (kg)"
        error={form.formState.errors.weight?.message}
        {...form.register('weight', { valueAsNumber: true })}
      />
      {/* ... outros campos */}
    </form>
  )
}
```

### 4. Gerenciamento de Estado

#### Estado Local (useState)
Usar para: estado de UI, formulários simples, toggles

#### Estado Compartilhado (Zustand)
```tsx
// stores/assessmentStore.ts

import { create } from 'zustand'

interface AssessmentStore {
  currentAssessment: Assessment | null
  setCurrentAssessment: (assessment: Assessment | null) => void
  clearAssessment: () => void
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  currentAssessment: null,
  setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
  clearAssessment: () => set({ currentAssessment: null })
}))
```

#### Estado do Servidor (TanStack Query)
```tsx
// hooks/useAssessments.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useAssessments(athleteId: string) {
  return useQuery({
    queryKey: ['assessments', athleteId],
    queryFn: () => fetchAssessments(athleteId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] })
    }
  })
}
```

---

## 🔧 Utilitários Comuns

### cn() - Class Names

```tsx
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Uso
<div className={cn('base-class', isActive && 'active', className)} />
```

### Formatadores

```tsx
// utils/formatters.ts

export const formatPercentage = (value: number, decimals = 1) => 
  `${value.toFixed(decimals)}%`

export const formatMeasurement = (value: number, unit: 'cm' | 'in') =>
  `${value.toFixed(1)} ${unit}`

export const formatDate = (date: Date | string) =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(date))
```

---

## ✅ Checklist

Antes de finalizar código frontend:

- [ ] Componente segue estrutura padrão?
- [ ] Props tipadas com interface?
- [ ] Hooks extraídos para lógica reutilizável?
- [ ] Formulário usa react-hook-form + zod?
- [ ] Estado no nível correto (local/store/server)?
- [ ] Memoização aplicada onde necessário?
- [ ] Classes usando cn() para composição?
- [ ] Barrel export atualizado?

---

## 📝 Notas de Aprendizado

<!-- Padrões descobertos serão adicionados aqui -->

### useBodyMeasurements

Hook para gerenciar medidas corporais com conversão de unidades.
Ver `memory/patterns-learned.md`.

### useAutoSaveForm

Hook para formulários com auto-save e recuperação de rascunho.
Ver `memory/patterns-learned.md`.

---

## 🔗 Referências

- Componentes base: `src/shared/components/`
- Hooks compartilhados: `src/shared/hooks/`
- Design System: `skills/ui-ux/SKILL.md`