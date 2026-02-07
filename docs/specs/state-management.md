# SPEC: State Management - SHAPE-V

## Documento de Gerenciamento de Estado

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** SHAPE-V (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

Este documento define a arquitetura de gerenciamento de estado do SHAPE-V.

### 1.1 Stack de Estado

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| **Server State** | React Query (TanStack) | Dados da API, cache, sync |
| **Client State** | Zustand | UI state, preferências locais |
| **Form State** | React Hook Form + Zod | Formulários e validação |
| **URL State** | Next.js Router | Navegação, filtros, paginação |

---

## 2. ZUSTAND STORES

### 2.1 Estrutura de Stores

```
/stores
  ├── useAuthStore.ts        # Autenticação e tokens
  ├── useUserStore.ts        # Dados do usuário e perfil
  ├── useMeasurementStore.ts # Estado de medições (UI)
  ├── useUIStore.ts          # Estado da UI (modals, toasts)
  ├── useOnboardingStore.ts  # Fluxo de onboarding
  └── index.ts               # Exportação centralizada
```

### 2.2 Auth Store

```typescript
// stores/useAuthStore.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      
      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          state.accessToken = accessToken
          state.refreshToken = refreshToken
          state.isAuthenticated = true
          state.isLoading = false
        }),
      
      clearTokens: () =>
        set((state) => {
          state.accessToken = null
          state.refreshToken = null
          state.isAuthenticated = false
          state.isLoading = false
        }),
      
      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading
        }),
    })),
    {
      name: 'shape-v-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Selectors
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useAccessToken = () => useAuthStore((s) => s.accessToken)
```

### 2.3 User Store

```typescript
// stores/useUserStore.ts

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User, Profile, ProportionMethod, UnitSystem } from '@/types'

interface UserState {
  user: User | null
  profile: Profile | null
  preferredMethod: ProportionMethod
  unitSystem: UnitSystem
  showTutorials: boolean
  
  setUser: (user: User) => void
  setProfile: (profile: Profile) => void
  updateProfile: (updates: Partial<Profile>) => void
  setPreferredMethod: (method: ProportionMethod) => void
  setUnitSystem: (system: UnitSystem) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: null,
      profile: null,
      preferredMethod: 'GOLDEN_RATIO',
      unitSystem: 'METRIC',
      showTutorials: true,
      
      setUser: (user) => set((state) => { state.user = user }),
      
      setProfile: (profile) => set((state) => {
        state.profile = profile
        if (profile.preferredMethod) state.preferredMethod = profile.preferredMethod
        if (profile.unitSystem) state.unitSystem = profile.unitSystem
      }),
      
      updateProfile: (updates) => set((state) => {
        if (state.profile) Object.assign(state.profile, updates)
      }),
      
      setPreferredMethod: (method) => set((state) => { state.preferredMethod = method }),
      setUnitSystem: (system) => set((state) => { state.unitSystem = system }),
      clearUser: () => set((state) => { state.user = null; state.profile = null }),
    })),
    {
      name: 'shape-v-user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferredMethod: state.preferredMethod,
        unitSystem: state.unitSystem,
        showTutorials: state.showTutorials,
      }),
    }
  )
)

// Selectors
export const useUser = () => useUserStore((s) => s.user)
export const useProfile = () => useUserStore((s) => s.profile)
export const usePreferredMethod = () => useUserStore((s) => s.preferredMethod)
export const useIsPro = () => useUserStore((s) => s.user?.isPro ?? false)
export const useHasCompleteProfile = () => useUserStore((s) => {
  const p = s.profile
  return !!(p?.altura && p?.punho && p?.tornozelo && p?.joelho && p?.pelve)
})
```

### 2.4 UI Store

```typescript
// stores/useUIStore.ts

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type ModalType = 
  | 'addMeasurement' | 'editMeasurement' | 'compareMeasurements'
  | 'uploadPhoto' | 'achievementUnlocked' | 'settings' | 'confirmDelete'
  | null

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

interface UIState {
  activeModal: ModalType
  modalData: Record<string, unknown> | null
  toasts: Toast[]
  isSidebarOpen: boolean
  globalLoading: boolean
  loadingMessage: string | null
  
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void
  closeModal: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  toggleSidebar: () => void
  setGlobalLoading: (loading: boolean, message?: string) => void
}

export const useUIStore = create<UIState>()(
  immer((set) => ({
    activeModal: null,
    modalData: null,
    toasts: [],
    isSidebarOpen: true,
    globalLoading: false,
    loadingMessage: null,
    
    openModal: (modal, data = null) => set((state) => {
      state.activeModal = modal
      state.modalData = data
    }),
    
    closeModal: () => set((state) => {
      state.activeModal = null
      state.modalData = null
    }),
    
    addToast: (toast) => set((state) => {
      const id = `toast_${Date.now()}`
      state.toasts.push({ ...toast, id })
    }),
    
    removeToast: (id) => set((state) => {
      state.toasts = state.toasts.filter((t) => t.id !== id)
    }),
    
    toggleSidebar: () => set((state) => { state.isSidebarOpen = !state.isSidebarOpen }),
    
    setGlobalLoading: (loading, message = null) => set((state) => {
      state.globalLoading = loading
      state.loadingMessage = message
    }),
  }))
)

// Selectors & Helpers
export const useActiveModal = () => useUIStore((s) => s.activeModal)
export const useToasts = () => useUIStore((s) => s.toasts)

export function useToast() {
  const addToast = useUIStore((s) => s.addToast)
  const removeToast = useUIStore((s) => s.removeToast)
  
  return {
    success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
    dismiss: removeToast,
  }
}
```

---

## 3. REACT QUERY CONFIGURATION

### 3.1 Query Client Setup

```typescript
// lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutos
      gcTime: 30 * 60 * 1000,          // 30 minutos
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

### 3.2 Query Keys Factory

```typescript
// lib/queryKeys.ts

export const queryKeys = {
  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
  
  measurements: {
    all: ['measurements'] as const,
    lists: () => [...queryKeys.measurements.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.measurements.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.measurements.all, 'detail', id] as const,
    latest: () => [...queryKeys.measurements.all, 'latest'] as const,
    evolution: (metric: string, period: string) => [...queryKeys.measurements.all, 'evolution', metric, period] as const,
  },
  
  proportions: {
    all: ['proportions'] as const,
    byMeasurement: (id: string) => [...queryKeys.proportions.all, id] as const,
    ideals: (method: string) => [...queryKeys.proportions.all, 'ideals', method] as const,
  },
  
  goals: {
    all: ['goals'] as const,
    list: (status?: string) => [...queryKeys.goals.all, 'list', status] as const,
  },
  
  achievements: {
    all: ['achievements'] as const,
    available: () => [...queryKeys.achievements.all, 'available'] as const,
    user: () => [...queryKeys.achievements.all, 'user'] as const,
  },
  
  ai: {
    all: ['ai'] as const,
    insights: () => [...queryKeys.ai.all, 'insights'] as const,
  },
} as const
```

### 3.3 Measurement Queries

```typescript
// hooks/queries/useMeasurements.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { api } from '@/lib/api'
import { useToast } from '@/stores/useUIStore'

// Queries
export function useMeasurements(filters = {}) {
  return useQuery({
    queryKey: queryKeys.measurements.list(filters),
    queryFn: () => api.measurements.list(filters),
  })
}

export function useMeasurement(id: string) {
  return useQuery({
    queryKey: queryKeys.measurements.detail(id),
    queryFn: () => api.measurements.get(id),
    enabled: !!id,
  })
}

export function useLatestMeasurement() {
  return useQuery({
    queryKey: queryKeys.measurements.latest(),
    queryFn: () => api.measurements.getLatest(),
  })
}

// Mutations
export function useCreateMeasurement() {
  const queryClient = useQueryClient()
  const toast = useToast()
  
  return useMutation({
    mutationFn: (data) => api.measurements.create(data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.proportions.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.user() })
      toast.success('Medição salva!', 'Seus scores foram calculados.')
    },
    
    onError: () => {
      toast.error('Erro ao salvar', 'Tente novamente.')
    },
  })
}

export function useUpdateMeasurement() {
  const queryClient = useQueryClient()
  const toast = useToast()
  
  return useMutation({
    mutationFn: ({ id, data }) => api.measurements.update(id, data),
    
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements.lists() })
      toast.success('Medição atualizada!')
    },
    
    onError: () => {
      toast.error('Erro ao atualizar')
    },
  })
}

export function useDeleteMeasurement() {
  const queryClient = useQueryClient()
  const toast = useToast()
  
  return useMutation({
    mutationFn: (id) => api.measurements.delete(id),
    
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.measurements.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.measurements.lists() })
      toast.success('Medição deletada')
    },
  })
}
```

---

## 4. CACHE STRATEGIES

### 4.1 Estratégias por Tipo de Dado

| Dado | staleTime | gcTime | Estratégia |
|------|-----------|--------|------------|
| User/Profile | 10 min | 1 hora | Cache longo, muda pouco |
| Measurements List | 5 min | 30 min | Cache médio |
| Measurement Detail | 10 min | 1 hora | Cache longo |
| Evolution Charts | 10 min | 1 hora | Dados históricos |
| Achievements | 30 min | 1 hora | Cache longo |
| AI Insights | 1 min | 5 min | Cache curto, dinâmico |

### 4.2 Invalidation Patterns

```typescript
// lib/invalidation.ts

export function invalidateAfterMeasurementChange(queryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.measurements.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.proportions.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.goals.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.ai.insights() })
}

export function invalidateAfterProfileChange(queryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
  queryClient.invalidateQueries({ queryKey: queryKeys.proportions.all })
}

export function clearAllCache(queryClient) {
  queryClient.clear()
}
```

---

## 5. FORM STATE

### 5.1 Measurement Form

```typescript
// components/forms/MeasurementForm.tsx

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createMeasurementSchema } from '@/schemas'
import { useCreateMeasurement } from '@/hooks/queries/useMeasurements'

export function MeasurementForm() {
  const createMutation = useCreateMeasurement()
  
  const form = useForm({
    resolver: zodResolver(createMeasurementSchema),
    defaultValues: {
      cintura: undefined,
      ombros: undefined,
      peitoral: undefined,
      braco: undefined,
      antebraco: undefined,
      pescoco: undefined,
      coxa: undefined,
      panturrilha: undefined,
    },
  })
  
  const onSubmit = async (data) => {
    await createMutation.mutateAsync(data)
    form.reset()
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <InputField
        label="Cintura"
        unit="cm"
        error={form.formState.errors.cintura?.message}
        {...form.register('cintura', { valueAsNumber: true })}
      />
      {/* ... outros campos */}
      
      <Button type="submit" loading={createMutation.isPending}>
        Salvar Medição
      </Button>
    </form>
  )
}
```

---

## 6. URL STATE

### 6.1 Filters via URL

```typescript
// hooks/useUrlFilters.ts

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useMeasurementsUrlFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const filters = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 10,
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    method: searchParams.get('method'),
  }
  
  const setFilters = useCallback((newFilters) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })
    
    router.push(`?${params.toString()}`)
  }, [router, searchParams])
  
  return { filters, setFilters }
}
```

---

## 7. RESUMO DE HOOKS

| Hook | Tipo | Descrição |
|------|------|-----------|
| `useIsAuthenticated` | Selector | Verifica se está logado |
| `useUser` | Selector | Dados do usuário |
| `useProfile` | Selector | Dados do perfil |
| `useIsPro` | Selector | Verifica se é PRO |
| `usePreferredMethod` | Selector | Método preferido |
| `useActiveModal` | Selector | Modal ativo |
| `useToast` | Helper | Funções de toast |
| `useMeasurements` | Query | Lista medições |
| `useMeasurement` | Query | Detalhe medição |
| `useLatestMeasurement` | Query | Última medição |
| `useCreateMeasurement` | Mutation | Criar medição |
| `useUpdateMeasurement` | Mutation | Atualizar medição |
| `useDeleteMeasurement` | Mutation | Deletar medição |

---

## 8. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do State Management |

---

**SHAPE-V State Management**  
*Zustand • React Query • TypeScript*
