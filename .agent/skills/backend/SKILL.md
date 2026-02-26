# ⚙️ Backend Skill

> Padrões e convenções de backend do VITRU IA (Supabase)

---

## 🎯 Propósito

Consultar quando a tarefa envolver:
- Queries ao Supabase
- Edge Functions
- APIs e endpoints
- Autenticação e autorização
- RPC functions

**Keywords**: API, supabase, query, endpoint, RPC, edge, function, auth

---

## 📁 Estrutura de Arquivos

```
src/
  lib/
    supabase.ts              # Cliente Supabase
  services/
    {entity}Service.ts       # Services por entidade
  
supabase/
  functions/
    {function-name}/
      index.ts               # Edge function
  migrations/
    {timestamp}_{name}.sql   # Migrations
```

---

## 🧩 Padrões e Convenções

### 1. Cliente Supabase

```tsx
// lib/supabase.ts

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### 2. Services Pattern

```tsx
// services/assessmentService.ts

import { supabase } from '@/lib/supabase'
import type { Assessment, CreateAssessmentDTO } from '@/types/assessment.types'

export const assessmentService = {
  /**
   * Busca todas as avaliações de um atleta
   */
  async getByAthlete(athleteId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        athlete:athletes(id, name),
        measurements(*)
      `)
      .eq('athlete_id', athleteId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(`Failed to fetch assessments: ${error.message}`)
    return data
  },

  /**
   * Cria nova avaliação
   */
  async create(dto: CreateAssessmentDTO): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .insert(dto)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to create assessment: ${error.message}`)
    return data
  },

  /**
   * Atualiza avaliação existente
   */
  async update(id: string, dto: Partial<Assessment>): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .update(dto)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw new Error(`Failed to update assessment: ${error.message}`)
    return data
  },

  /**
   * Remove avaliação (soft delete)
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('assessments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) throw new Error(`Failed to delete assessment: ${error.message}`)
  }
}
```

### 3. Queries Tipadas

```tsx
// Sempre use o tipo Database gerado
import type { Database } from '@/types/database.types'

type Assessment = Database['public']['Tables']['assessments']['Row']
type InsertAssessment = Database['public']['Tables']['assessments']['Insert']
type UpdateAssessment = Database['public']['Tables']['assessments']['Update']
```

### 4. Edge Functions

```tsx
// supabase/functions/calculate-proportions/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RequestBody {
  assessmentId: string
}

interface ProportionsResult {
  shoulderToWaist: number
  chestToWaist: number
  // ...
}

serve(async (req) => {
  // 1. CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Auth
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 3. Parse body
    const { assessmentId }: RequestBody = await req.json()

    // 4. Create authenticated client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // 5. Business logic
    const { data: assessment, error } = await supabase
      .from('assessments')
      .select('*, measurements(*)')
      .eq('id', assessmentId)
      .single()

    if (error) throw error

    const proportions = calculateProportions(assessment.measurements)

    // 6. Return response
    return new Response(
      JSON.stringify(proportions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

### 5. RPC Functions (Postgres)

```sql
-- migrations/20260226_calculate_body_fat.sql

CREATE OR REPLACE FUNCTION calculate_body_fat(
  p_assessment_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
  v_sum_folds NUMERIC;
  v_age INTEGER;
  v_gender TEXT;
  v_density NUMERIC;
  v_body_fat NUMERIC;
BEGIN
  -- Busca dados
  SELECT 
    (m.triceps + m.subscapular + m.suprailiac + m.abdominal + 
     m.thigh + m.chest + m.midaxillary),
    EXTRACT(YEAR FROM AGE(a.birth_date)),
    a.gender
  INTO v_sum_folds, v_age, v_gender
  FROM assessments ass
  JOIN measurements m ON m.assessment_id = ass.id
  JOIN athletes a ON a.id = ass.athlete_id
  WHERE ass.id = p_assessment_id;

  -- Cálculo Jackson & Pollock
  IF v_gender = 'M' THEN
    v_density := 1.112 - (0.00043499 * v_sum_folds) + 
                 (0.00000055 * v_sum_folds * v_sum_folds) - 
                 (0.00028826 * v_age);
  ELSE
    v_density := 1.097 - (0.00046971 * v_sum_folds) + 
                 (0.00000056 * v_sum_folds * v_sum_folds) - 
                 (0.00012828 * v_age);
  END IF;

  -- Siri equation
  v_body_fat := ((4.95 / v_density) - 4.5) * 100;

  RETURN ROUND(v_body_fat, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

```tsx
// Chamada no frontend
const { data, error } = await supabase.rpc('calculate_body_fat', {
  p_assessment_id: assessmentId
})
```

### 6. Tratamento de Erros

```tsx
// utils/supabaseErrors.ts

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string
  ) {
    super(message)
    this.name = 'SupabaseError'
  }
}

export function handleSupabaseError(error: any): never {
  if (error.code === 'PGRST116') {
    throw new SupabaseError('Registro não encontrado', error.code)
  }
  if (error.code === '23505') {
    throw new SupabaseError('Registro duplicado', error.code)
  }
  if (error.code === '42501') {
    throw new SupabaseError('Sem permissão', error.code)
  }
  throw new SupabaseError(error.message, error.code, error.details)
}
```

---

## 🔐 Autenticação

### Verificar Usuário

```tsx
const { data: { user }, error } = await supabase.auth.getUser()

if (!user) {
  throw new Error('Not authenticated')
}
```

### RLS Policies

```sql
-- Usuário só vê seus próprios dados
CREATE POLICY "Users can view own assessments"
ON assessments FOR SELECT
USING (auth.uid() = user_id);

-- Personal pode ver dados dos seus atletas
CREATE POLICY "Trainers can view their athletes assessments"
ON assessments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM athletes
    WHERE athletes.id = assessments.athlete_id
    AND athletes.trainer_id = auth.uid()
  )
);
```

---

## ✅ Checklist

Antes de finalizar código backend:

- [ ] Query usa tipos do Database?
- [ ] Erros tratados com mensagens claras?
- [ ] RLS policies consideradas?
- [ ] Edge function tem CORS headers?
- [ ] Service methods documentados?
- [ ] Soft delete em vez de hard delete?
- [ ] Logs apropriados para debug?

---

## 📝 Notas de Aprendizado

<!-- Padrões descobertos serão adicionados aqui -->

---

## 🔗 Referências

- Schema: `specs/architecture/data-model.md`
- API Routes: `specs/architecture/api-routes.md`
- Supabase Docs: https://supabase.com/docs