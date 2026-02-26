# SPEC: Roadmap de Implementação - VITRU IA

## Conectando a Aplicação ao Banco de Dados

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Status:** ✅ Banco criado | 🔄 Implementação em andamento

---

## 📍 STATUS ATUAL

| Item | Status |
|------|--------|
| Deploy Vercel | ✅ Concluído |
| Supabase Auth | ✅ Configurado |
| Banco de Dados | ✅ Tabelas criadas |
| Conexão App ↔ DB | 🔄 Próximo passo |
| APIs | ⏳ Pendente |
| Telas | ⏳ Pendente |

---

## 🗺️ ROADMAP GERAL

```
FASE 1: INFRAESTRUTURA          [Semana 1]
├── 1.1 Configurar Supabase Client
├── 1.2 Criar tipos TypeScript
├── 1.3 Configurar variáveis de ambiente
└── 1.4 Testar conexão

FASE 2: AUTENTICAÇÃO            [Semana 1-2]
├── 2.1 Fluxo de login/registro
├── 2.2 Identificar tipo de usuário
├── 2.3 Middleware de proteção de rotas
└── 2.4 Tela de onboarding por tipo

FASE 3: CRUD BÁSICO             [Semana 2-3]
├── 3.1 CRUD Academia
├── 3.2 CRUD Personal
├── 3.3 CRUD Atleta
└── 3.4 CRUD Ficha

FASE 4: FUNCIONALIDADES CORE    [Semana 3-4]
├── 4.1 Sistema de Medidas
├── 4.2 Sistema de Avaliações
├── 4.3 Cálculos de Proporções
└── 4.4 Dashboard por tipo de usuário

FASE 5: FEATURES AVANÇADAS      [Semana 5-6]
├── 5.1 Coach IA
├── 5.2 Registros Diários
├── 5.3 Portal do Atleta
└── 5.4 Rankings e Hall dos Deuses
```

---

## 📋 FASE 1: INFRAESTRUTURA

### 1.1 Configurar Supabase Client

**Objetivo:** Criar cliente Supabase para usar em toda a aplicação

**Arquivos a criar:**

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Cliente para browser
│   │   ├── server.ts        # Cliente para server components
│   │   ├── middleware.ts    # Cliente para middleware
│   │   └── admin.ts         # Cliente admin (service role)
│   └── database.types.ts    # Tipos gerados do Supabase
```

**Código - `src/lib/supabase/client.ts`:**
```typescript
import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Código - `src/lib/supabase/server.ts`:**
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component - ignorar
          }
        },
      },
    }
  )
}
```

**Código - `src/lib/supabase/middleware.ts`:**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirecionar se não autenticado
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/p/') && // Portal público
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

---

### 1.2 Criar Tipos TypeScript

**Objetivo:** Gerar tipos a partir do schema do banco

**Comando para gerar tipos:**
```bash
npx supabase gen types typescript --project-id SEU_PROJECT_ID > src/lib/database.types.ts
```

**Ou manualmente criar `src/lib/database.types.ts`:**
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academias: {
        Row: {
          id: string
          auth_user_id: string | null
          nome: string
          razao_social: string | null
          cnpj: string | null
          email: string
          telefone: string | null
          endereco_rua: string | null
          endereco_numero: string | null
          endereco_complemento: string | null
          endereco_bairro: string | null
          endereco_cidade: string | null
          endereco_estado: string | null
          endereco_cep: string | null
          plano: 'BASIC' | 'PRO' | 'ENTERPRISE'
          limite_personais: number
          limite_atletas: number
          logo_url: string | null
          status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
          data_vencimento: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          nome: string
          razao_social?: string | null
          cnpj?: string | null
          email: string
          telefone?: string | null
          // ... outros campos opcionais
        }
        Update: {
          nome?: string
          email?: string
          // ... todos campos opcionais
        }
      }
      personais: {
        Row: {
          id: string
          auth_user_id: string | null
          academia_id: string | null
          nome: string
          email: string
          telefone: string | null
          cpf: string | null
          cref: string | null
          foto_url: string | null
          plano: 'FREE' | 'PRO' | 'UNLIMITED'
          limite_atletas: number
          status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
          data_vinculo: string
          created_at: string
          updated_at: string
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
      atletas: {
        Row: {
          id: string
          auth_user_id: string | null
          personal_id: string
          academia_id: string | null
          nome: string
          email: string | null
          telefone: string | null
          foto_url: string | null
          portal_token: string | null
          portal_token_expira: string | null
          portal_acessos: number
          portal_ultimo_acesso: string | null
          status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
          created_at: string
          updated_at: string
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
      fichas: {
        Row: {
          id: string
          atleta_id: string
          data_nascimento: string | null
          sexo: 'M' | 'F'
          altura: number | null
          punho: number | null
          tornozelo: number | null
          joelho: number | null
          pelve: number | null
          objetivo: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE' | 'EMAGRECIMENTO'
          categoria_preferida: string | null
          observacoes: string | null
          restricoes: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
      medidas: {
        Row: {
          id: string
          atleta_id: string
          data: string
          peso: number | null
          gordura_corporal: number | null
          ombros: number | null
          peitoral: number | null
          cintura: number | null
          quadril: number | null
          abdomen: number | null
          braco_esquerdo: number | null
          braco_direito: number | null
          antebraco_esquerdo: number | null
          antebraco_direito: number | null
          coxa_esquerda: number | null
          coxa_direita: number | null
          panturrilha_esquerda: number | null
          panturrilha_direita: number | null
          pescoco: number | null
          registrado_por: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
          personal_id: string | null
          created_at: string
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
      avaliacoes: {
        Row: {
          id: string
          atleta_id: string
          medidas_id: string
          data: string
          peso: number | null
          gordura_corporal: number | null
          massa_magra: number | null
          massa_gorda: number | null
          imc: number | null
          ffmi: number | null
          score_geral: number | null
          classificacao_geral: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE' | null
          proporcoes: Json | null
          simetria: Json | null
          comparacao_anterior: Json | null
          created_at: string
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
      registros: {
        Row: {
          id: string
          atleta_id: string
          data: string
          tipo: 'REFEICAO' | 'TREINO' | 'AGUA' | 'SONO' | 'DOR' | 'PESO' | 'SUPLEMENTO' | 'OUTRO'
          dados: Json
          origem: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
          created_at: string
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
      consultorias: {
        Row: {
          id: string
          atleta_id: string
          tipo: 'DIAGNOSTICO' | 'TREINO' | 'DIETA' | 'CHAT'
          contexto: Json | null
          prompt: string
          resposta: string
          tokens_usados: number | null
          modelo: string | null
          data: string
          created_at: string
        }
        Insert: {
          // ...
        }
        Update: {
          // ...
        }
      }
    }
    Views: {
      v_atletas_com_avaliacao: {
        Row: {
          id: string
          nome: string
          foto_url: string | null
          personal_id: string
          personal_nome: string
          academia_id: string | null
          status: string
          created_at: string
          ultima_avaliacao_data: string | null
          score_geral: number | null
          classificacao_geral: string | null
          peso: number | null
          dias_desde_avaliacao: number | null
        }
      }
      v_kpis_personal: {
        Row: {
          personal_id: string
          personal_nome: string
          total_atletas: number
          atletas_ativos: number
          atletas_inativos: number
          score_medio: number | null
          avaliacoes_mes: number
          atletas_elite: number
          atletas_meta: number
          atletas_quase_la: number
          atletas_caminho: number
          atletas_inicio: number
        }
      }
      v_kpis_academia: {
        Row: {
          academia_id: string
          academia_nome: string
          total_personais: number
          personais_ativos: number
          total_atletas: number
          atletas_ativos: number
          score_medio: number | null
          avaliacoes_mes: number
        }
      }
    }
    Enums: {
      status_tipo: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
      sexo_tipo: 'M' | 'F'
      plano_academia_tipo: 'BASIC' | 'PRO' | 'ENTERPRISE'
      plano_personal_tipo: 'FREE' | 'PRO' | 'UNLIMITED'
      objetivo_tipo: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE' | 'EMAGRECIMENTO'
      categoria_tipo: 'GOLDEN_RATIO' | 'CLASSIC_PHYSIQUE' | 'MENS_PHYSIQUE' | 'BODYBUILDING' | 'BIKINI' | 'WELLNESS' | 'FIGURE' | 'WOMENS_PHYSIQUE' | 'WOMENS_BODYBUILDING'
      classificacao_tipo: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE'
      registro_tipo: 'REFEICAO' | 'TREINO' | 'AGUA' | 'SONO' | 'DOR' | 'PESO' | 'SUPLEMENTO' | 'OUTRO'
      consultoria_tipo: 'DIAGNOSTICO' | 'TREINO' | 'DIETA' | 'CHAT'
      origem_tipo: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row']

// Aliases para facilitar uso
export type Academia = Tables<'academias'>
export type Personal = Tables<'personais'>
export type Atleta = Tables<'atletas'>
export type Ficha = Tables<'fichas'>
export type Medida = Tables<'medidas'>
export type Avaliacao = Tables<'avaliacoes'>
export type Registro = Tables<'registros'>
export type Consultoria = Tables<'consultorias'>
```

---

### 1.3 Configurar Variáveis de Ambiente

**Arquivo `.env.local`:**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# (Futuro) OpenAI/Anthropic para Coach IA
# ANTHROPIC_API_KEY=sk-ant-...
```

**Onde encontrar no Supabase:**
1. Project Settings → API
2. Copiar `URL` e `anon public` key
3. Para `service_role`, copiar a key (NUNCA expor no client!)

---

### 1.4 Testar Conexão

**Criar arquivo de teste `src/app/api/test-db/route.ts`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Testar conexão
    const { data: academias, error } = await supabase
      .from('academias')
      .select('count')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Conexão com banco de dados OK!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao conectar' 
    }, { status: 500 })
  }
}
```

**Testar:** Acessar `http://localhost:3000/api/test-db`

---

## 📋 FASE 2: AUTENTICAÇÃO

### 2.1 Fluxo de Login/Registro

**Estrutura de arquivos:**
```
src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── registro/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── actions.ts          # Server Actions
├── (dashboard)/
│   ├── layout.tsx          # Layout protegido
│   └── ...
```

**Server Actions - `src/app/(auth)/actions.ts`:**
```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        nome: formData.get('nome') as string,
        tipo: formData.get('tipo') as string, // 'academia' | 'personal' | 'atleta'
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

---

### 2.2 Identificar Tipo de Usuário

**Hook - `src/hooks/useUserType.ts`:**
```typescript
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export type UserType = 'academia' | 'personal' | 'atleta' | null

interface UserProfile {
  type: UserType
  profileId: string | null
  profile: any
}

export function useUserType() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    type: null,
    profileId: null,
    profile: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserType() {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      // Verificar se é Academia
      const { data: academia } = await supabase
        .from('academias')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (academia) {
        setUserProfile({ type: 'academia', profileId: academia.id, profile: academia })
        setLoading(false)
        return
      }

      // Verificar se é Personal
      const { data: personal } = await supabase
        .from('personais')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (personal) {
        setUserProfile({ type: 'personal', profileId: personal.id, profile: personal })
        setLoading(false)
        return
      }

      // Verificar se é Atleta
      const { data: atleta } = await supabase
        .from('atletas')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      if (atleta) {
        setUserProfile({ type: 'atleta', profileId: atleta.id, profile: atleta })
        setLoading(false)
        return
      }

      // Usuário novo - precisa de onboarding
      setUserProfile({ type: null, profileId: null, profile: null })
      setLoading(false)
    }

    fetchUserType()
  }, [])

  return { ...userProfile, loading }
}
```

---

### 2.3 Middleware de Proteção

**Atualizar `src/middleware.ts`:**
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     * - api/public (public APIs)
     * - p/ (portal público do atleta)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/public|p/).*)',
  ],
}
```

---

### 2.4 Onboarding por Tipo

**Página `src/app/onboarding/page.tsx`:**
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<'academia' | 'personal' | 'atleta' | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSelectType = (type: 'academia' | 'personal' | 'atleta') => {
    setUserType(type)
    setStep(2)
  }

  const handleSubmit = async (formData: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    if (userType === 'academia') {
      await supabase.from('academias').insert({
        auth_user_id: user.id,
        nome: formData.nome,
        email: user.email,
        ...formData
      })
      router.push('/academia/dashboard')
    } else if (userType === 'personal') {
      await supabase.from('personais').insert({
        auth_user_id: user.id,
        nome: formData.nome,
        email: user.email,
        ...formData
      })
      router.push('/personal/dashboard')
    } else if (userType === 'atleta') {
      // Atleta precisa de vínculo com personal
      // Fluxo diferente
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {step === 1 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Bem-vindo ao VITRU IA!</h1>
          <p>Selecione seu perfil:</p>
          
          <div className="grid gap-4">
            <button 
              onClick={() => handleSelectType('academia')}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              🏢 Sou uma Academia
            </button>
            <button 
              onClick={() => handleSelectType('personal')}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              👨‍🏫 Sou Personal Trainer
            </button>
            <button 
              onClick={() => handleSelectType('atleta')}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              🏃 Sou Atleta
            </button>
          </div>
        </div>
      )}

      {step === 2 && userType === 'academia' && (
        <AcademiaOnboardingForm onSubmit={handleSubmit} />
      )}

      {step === 2 && userType === 'personal' && (
        <PersonalOnboardingForm onSubmit={handleSubmit} />
      )}
    </div>
  )
}
```

---

## 📋 FASE 3: CRUD BÁSICO

### 3.1 Estrutura de Services

**Criar services reutilizáveis:**
```
src/
├── services/
│   ├── academia.service.ts
│   ├── personal.service.ts
│   ├── atleta.service.ts
│   ├── ficha.service.ts
│   ├── medidas.service.ts
│   └── avaliacao.service.ts
```

**Exemplo - `src/services/atleta.service.ts`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/lib/database.types'

type Atleta = Tables<'atletas'>
type AtletaInsert = Omit<Atleta, 'id' | 'created_at' | 'updated_at'>

export const atletaService = {
  // Listar atletas do personal
  async listar(personalId: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('atletas')
      .select(`
        *,
        ficha:fichas(*),
        ultima_avaliacao:avaliacoes(
          id, data, score_geral, classificacao_geral, peso
        )
      `)
      .eq('personal_id', personalId)
      .order('nome')
    
    if (error) throw error
    return data
  },

  // Buscar atleta por ID
  async buscarPorId(id: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('atletas')
      .select(`
        *,
        ficha:fichas(*),
        personal:personais(id, nome, telefone),
        avaliacoes(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Criar atleta
  async criar(atleta: AtletaInsert) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('atletas')
      .insert(atleta)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar atleta
  async atualizar(id: string, atleta: Partial<Atleta>) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('atletas')
      .update(atleta)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Deletar atleta
  async deletar(id: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('atletas')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Buscar por token do portal
  async buscarPorToken(token: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('atletas')
      .select(`
        *,
        ficha:fichas(*),
        personal:personais(id, nome, telefone, foto_url),
        avaliacoes(
          *,
          medidas:medidas(*)
        )
      `)
      .eq('portal_token', token)
      .single()
    
    if (error) throw error
    return data
  }
}
```

---

## 📋 FASE 4: FUNCIONALIDADES CORE

### 4.1 Sistema de Medidas

**API Route - `src/app/api/atletas/[id]/medidas/route.ts`:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Listar medidas do atleta
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('medidas')
    .select('*')
    .eq('atleta_id', params.id)
    .order('data', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

// POST - Criar nova medida
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await request.json()
  
  const { data: medida, error } = await supabase
    .from('medidas')
    .insert({
      atleta_id: params.id,
      ...body
    })
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Criar avaliação automaticamente
  const avaliacao = await criarAvaliacaoAutomatica(params.id, medida.id)
  
  return NextResponse.json({ medida, avaliacao }, { status: 201 })
}
```

### 4.2 Cálculo de Proporções

**Criar `src/lib/calculos/proporcoes.ts`:**
```typescript
import { Ficha, Medida } from '@/lib/database.types'

export interface Proporcao {
  nome: string
  indice_atual: number
  indice_meta: number
  percentual_do_ideal: number
  classificacao: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE'
}

export function calcularProporcoes(ficha: Ficha, medidas: Medida): Proporcao[] {
  const proporcoes: Proporcao[] = []
  
  // Shape-V (Ombros / Cintura)
  if (medidas.ombros && medidas.cintura) {
    const atual = medidas.ombros / medidas.cintura
    const meta = 1.618 // Golden Ratio
    const percentual = (atual / meta) * 100
    
    proporcoes.push({
      nome: 'Shape-V',
      indice_atual: Number(atual.toFixed(2)),
      indice_meta: meta,
      percentual_do_ideal: Math.min(Number(percentual.toFixed(0)), 120),
      classificacao: classificarPercentual(percentual)
    })
  }
  
  // Peitoral (baseado no punho)
  if (medidas.peitoral && ficha.punho) {
    const meta = ficha.punho * 6.5
    const percentual = (medidas.peitoral / meta) * 100
    
    proporcoes.push({
      nome: 'Peitoral',
      indice_atual: medidas.peitoral,
      indice_meta: Number(meta.toFixed(1)),
      percentual_do_ideal: Math.min(Number(percentual.toFixed(0)), 120),
      classificacao: classificarPercentual(percentual)
    })
  }
  
  // Braço (baseado no punho)
  const braco = medidas.braco_direito || medidas.braco_esquerdo
  if (braco && ficha.punho) {
    const meta = ficha.punho * 2.5
    const percentual = (braco / meta) * 100
    
    proporcoes.push({
      nome: 'Braço',
      indice_atual: braco,
      indice_meta: Number(meta.toFixed(1)),
      percentual_do_ideal: Math.min(Number(percentual.toFixed(0)), 120),
      classificacao: classificarPercentual(percentual)
    })
  }
  
  // ... mais proporções
  
  return proporcoes
}

function classificarPercentual(percentual: number): Proporcao['classificacao'] {
  if (percentual >= 98) return 'ELITE'
  if (percentual >= 95) return 'META'
  if (percentual >= 85) return 'QUASE_LA'
  if (percentual >= 70) return 'CAMINHO'
  return 'INICIO'
}

export function calcularScoreGeral(proporcoes: Proporcao[]): number {
  if (proporcoes.length === 0) return 0
  
  const soma = proporcoes.reduce((acc, p) => acc + p.percentual_do_ideal, 0)
  return Math.round(soma / proporcoes.length)
}

export function calcularSimetria(medidas: Medida): { score: number; detalhes: any } {
  const detalhes: any = {}
  let totalDiff = 0
  let count = 0
  
  // Braços
  if (medidas.braco_direito && medidas.braco_esquerdo) {
    const diff = Math.abs(medidas.braco_direito - medidas.braco_esquerdo) / 
                 Math.max(medidas.braco_direito, medidas.braco_esquerdo) * 100
    detalhes.braco = Number(diff.toFixed(1))
    totalDiff += diff
    count++
  }
  
  // Coxas
  if (medidas.coxa_direita && medidas.coxa_esquerda) {
    const diff = Math.abs(medidas.coxa_direita - medidas.coxa_esquerda) / 
                 Math.max(medidas.coxa_direita, medidas.coxa_esquerda) * 100
    detalhes.coxa = Number(diff.toFixed(1))
    totalDiff += diff
    count++
  }
  
  // Panturrilhas
  if (medidas.panturrilha_direita && medidas.panturrilha_esquerda) {
    const diff = Math.abs(medidas.panturrilha_direita - medidas.panturrilha_esquerda) / 
                 Math.max(medidas.panturrilha_direita, medidas.panturrilha_esquerda) * 100
    detalhes.panturrilha = Number(diff.toFixed(1))
    totalDiff += diff
    count++
  }
  
  const mediaDiff = count > 0 ? totalDiff / count : 0
  const score = Math.max(0, Math.round(100 - mediaDiff * 10))
  
  return { score, detalhes }
}
```

---

## 📅 CRONOGRAMA RESUMIDO

| Fase | Duração | Entregas |
|------|---------|----------|
| **Fase 1** | 2-3 dias | Supabase conectado, tipos criados |
| **Fase 2** | 3-4 dias | Login, registro, onboarding funcionando |
| **Fase 3** | 4-5 dias | CRUD de todas entidades |
| **Fase 4** | 5-7 dias | Medidas, avaliações, dashboards |
| **Fase 5** | 7-10 dias | Coach IA, registros, portal |

**Total estimado:** 3-4 semanas para MVP

---

## ✅ CHECKLIST - PRÓXIMOS PASSOS IMEDIATOS

```
[ ] 1. Criar pasta src/lib/supabase/
[ ] 2. Criar client.ts, server.ts, middleware.ts
[ ] 3. Gerar tipos TypeScript do banco
[ ] 4. Configurar .env.local com chaves
[ ] 5. Criar endpoint /api/test-db para testar conexão
[ ] 6. Testar conexão local
[ ] 7. Fazer deploy no Vercel com variáveis de ambiente
[ ] 8. Testar conexão em produção
```

---

## 🚀 COMANDO PARA COMEÇAR

```bash
# 1. Instalar dependências do Supabase
npm install @supabase/supabase-js @supabase/ssr

# 2. Gerar tipos (opcional, mas recomendado)
npx supabase login
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts

# 3. Criar estrutura de pastas
mkdir -p src/lib/supabase
mkdir -p src/services
mkdir -p src/hooks
```

---

**Quer que eu comece gerando os arquivos da Fase 1?**
