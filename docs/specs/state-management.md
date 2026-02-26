# SPEC: State Management - VITRU IA

## Documento de Gerenciamento de Estado

**Versão:** 2.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (Sistema de Análise de Proporções Corporais)

> **Nota v2.0:** Atualizado para refletir a implementação real. A stack de estado é exclusivamente Zustand (sem React Query nem React Hook Form).

---

## 1. VISÃO GERAL

Este documento define a arquitetura de gerenciamento de estado do VITRU IA.

### 1.1 Stack de Estado (Implementada)

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| **Estado Global** | Zustand 5 | Auth, dados, UI, stores especializados |
| **Estado Local** | React `useState` / `useReducer` | Formulários, UI local |
| **Roteamento** | `App.tsx` (condicional) | Views renderizadas por estado no App |
| **Persistência** | Supabase JS Client | CRUD direto via services |

---

## 2. ZUSTAND STORES (Implementadas)

### 2.1 Estrutura de Stores

```
/stores
  ├── authStore.ts                # Autenticação via Supabase Auth
  ├── dataStore.ts                # Dados gerais (avaliações, medidas)
  ├── athleteStore.ts             # Estado do atleta
  ├── personalRankingStore.ts     # Rankings de personais
  ├── useDailyTrackingStore.ts    # Tracking diário
  └── usePersonalDashboardStore.ts # Dashboard do personal
```

### 2.2 Auth Store (`authStore.ts`)

```typescript
import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  entity: EntityData;  // { personal?, atleta?, academia? }
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, additionalData?: { fullName: string; role: UserRole }) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  loadEntityData: (userId: string, role: UserRole) => Promise<void>;
}
```

**Funcionalidades:**
- `signIn` → Supabase `signInWithPassword` → fetch profile → fetch entity (personal/atleta/academia)
- `signUp` → Supabase `signUp` com metadata de role
- `checkSession` → Reidrata sessão ao recarregar página
- `loadEntityData` → Busca dados específicos da tabela correspondente ao role

### 2.3 Data Store (`dataStore.ts`)

Store principal para dados da aplicação (avaliações, atletas vinculados, medidas).

**Tamanho:** 12.931 bytes (store mais complexo)

### 2.4 Athlete Store (`athleteStore.ts`)

Dados específicos do atleta logado (9.485 bytes).

### 2.5 Personal Ranking Store (`personalRankingStore.ts`)

Gerencia rankings e comparações entre personais (13.230 bytes).

### 2.6 Daily Tracking Store (`useDailyTrackingStore.ts`)

Monitoramento diário de hábitos e scores (8.442 bytes).

### 2.7 Personal Dashboard Store (`usePersonalDashboardStore.ts`)

Dados do dashboard do personal (1.907 bytes).

---

## 3. CUSTOM HOOKS (Implementados)

### 3.1 Estrutura de Hooks

```
/hooks
  ├── queries/                    # Placeholder para hooks de dados
  ├── mutations/                  # Placeholder para hooks de mutação
  ├── usePersonalDetails.ts       # Detalhes do personal logado
  ├── useSupabaseConnection.ts    # Status da conexão Supabase
  ├── useSupabaseSync.ts          # Sincronização de dados
  └── useTokens.ts               # Acesso a design tokens
```

### 3.2 `usePersonalDetails`

Hook para carregar e gerenciar detalhes do personal logado, incluindo atletas vinculados e estatísticas.

### 3.3 `useSupabaseConnection`

Verifica e monitora o status da conexão com o Supabase.

### 3.4 `useSupabaseSync`

Sincroniza dados locais (stores) com o Supabase quando a conexão está ativa.

### 3.5 `useTokens`

Acesso tipado aos design tokens do tema (cores, tipografia, espaçamento).

---

## 4. FLUXO DE DADOS

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│  Zustand    │────▶│  Supabase   │
│   (View)    │     │  Store      │     │  Client    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   Renderiza          Gerencia            Persiste
   UI                 Estado              no Supabase
```

---

## 5. RESUMO DE STORES E HOOKS

| Store/Hook | Tipo | Descrição |
|------|------|-----------| 
| `authStore` | Zustand Store | Autenticação, usuário, profile, entity |
| `dataStore` | Zustand Store | Dados de avaliações e medidas |
| `athleteStore` | Zustand Store | Estado do atleta logado |
| `personalRankingStore` | Zustand Store | Rankings de personais |
| `useDailyTrackingStore` | Zustand Store | Tracking diário de hábitos |
| `usePersonalDashboardStore` | Zustand Store | Dashboard do personal |
| `usePersonalDetails` | Custom Hook | Detalhes do personal logado |
| `useSupabaseConnection` | Custom Hook | Status da conexão |
| `useSupabaseSync` | Custom Hook | Sync com Supabase |
| `useTokens` | Custom Hook | Acesso a design tokens |

---

## 6. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial (planejamento com React Query) |
| 2.0 | Fev/2026 | Atualizado para refletir implementação real: 6 Zustand stores + 4 custom hooks, sem React Query/React Hook Form |

---

**VITRU IA State Management v2.0**  
*Zustand 5 • Supabase Client • TypeScript*
