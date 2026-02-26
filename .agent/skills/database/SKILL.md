# 🗄️ Database Skill

> Padrões e convenções de banco de dados do VITRU IA (Supabase/PostgreSQL)

---

## 🎯 Propósito

Consultar quando a tarefa envolver:
- Criação/alteração de tabelas
- Migrations
- RLS Policies
- Queries complexas
- Otimização de performance

**Keywords**: tabela, schema, migration, RLS, banco, query, index, policy

---

## 📁 Estrutura de Arquivos

```
supabase/
  migrations/
    {timestamp}_{description}.sql
  seed.sql                          # Dados iniciais
  
src/
  types/
    database.types.ts               # Tipos gerados (npx supabase gen types)
```

---

## 🧩 Padrões e Convenções

### 1. Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Tabelas | snake_case, plural | `assessments`, `body_measurements` |
| Colunas | snake_case | `created_at`, `athlete_id` |
| Primary Key | `id` (UUID) | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign Key | `{tabela_singular}_id` | `athlete_id`, `trainer_id` |
| Timestamps | `created_at`, `updated_at` | Sempre incluir |
| Soft delete | `deleted_at` | `deleted_at TIMESTAMPTZ` |

### 2. Template de Tabela

```sql
-- migrations/20260226_create_assessments.sql

CREATE TABLE assessments (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign keys
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Dados
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'archived')),
  
  -- Timestamps (SEMPRE incluir)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ  -- Soft delete
);

-- Índices
CREATE INDEX idx_assessments_athlete ON assessments(athlete_id);
CREATE INDEX idx_assessments_trainer ON assessments(trainer_id);
CREATE INDEX idx_assessments_date ON assessments(assessment_date DESC);

-- Trigger para updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE assessments IS 'Avaliações físicas dos atletas';
COMMENT ON COLUMN assessments.status IS 'draft: em edição, completed: finalizada, archived: arquivada';
```

### 3. Função updated_at (criar uma vez)

```sql
-- migrations/00000000_setup_functions.sql

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 4. RLS Policies

```sql
-- Habilitar RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Usuário autenticado pode ver
CREATE POLICY "Authenticated users can view"
ON assessments FOR SELECT
TO authenticated
USING (true);

-- Policy: Trainer vê seus atletas
CREATE POLICY "Trainers view own athletes assessments"
ON assessments FOR SELECT
TO authenticated
USING (
  trainer_id = auth.uid()
  OR
  athlete_id IN (
    SELECT id FROM athletes WHERE trainer_id = auth.uid()
  )
);

-- Policy: Trainer pode inserir para seus atletas
CREATE POLICY "Trainers can insert for own athletes"
ON assessments FOR INSERT
TO authenticated
WITH CHECK (
  trainer_id = auth.uid()
  AND
  athlete_id IN (
    SELECT id FROM athletes WHERE trainer_id = auth.uid()
  )
);

-- Policy: Trainer pode atualizar próprias avaliações
CREATE POLICY "Trainers can update own assessments"
ON assessments FOR UPDATE
TO authenticated
USING (trainer_id = auth.uid())
WITH CHECK (trainer_id = auth.uid());

-- Policy: Apenas soft delete
CREATE POLICY "Trainers can soft delete own assessments"
ON assessments FOR UPDATE
TO authenticated
USING (trainer_id = auth.uid() AND deleted_at IS NULL)
WITH CHECK (deleted_at IS NOT NULL);
```

### 5. Queries Padrão

#### Select com Joins
```sql
SELECT 
  a.*,
  ath.name as athlete_name,
  json_agg(m.*) as measurements
FROM assessments a
JOIN athletes ath ON ath.id = a.athlete_id
LEFT JOIN measurements m ON m.assessment_id = a.id
WHERE a.trainer_id = $1
  AND a.deleted_at IS NULL
GROUP BY a.id, ath.name
ORDER BY a.created_at DESC;
```

#### Upsert
```sql
INSERT INTO measurements (assessment_id, type, value, unit)
VALUES ($1, $2, $3, $4)
ON CONFLICT (assessment_id, type)
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();
```

#### Soft Delete
```sql
UPDATE assessments
SET deleted_at = NOW()
WHERE id = $1 AND trainer_id = $2;
```

### 6. Índices

```sql
-- Índice simples
CREATE INDEX idx_assessments_athlete ON assessments(athlete_id);

-- Índice composto (ordem importa!)
CREATE INDEX idx_assessments_trainer_date ON assessments(trainer_id, assessment_date DESC);

-- Índice parcial (só registros ativos)
CREATE INDEX idx_assessments_active ON assessments(trainer_id)
WHERE deleted_at IS NULL;

-- Índice para full-text search
CREATE INDEX idx_athletes_name_search ON athletes 
USING gin(to_tsvector('portuguese', name));
```

### 7. Migrations

#### Criar Migration
```bash
npx supabase migration new create_assessments
```

#### Aplicar Migrations
```bash
npx supabase db push
```

#### Gerar Tipos TypeScript
```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

---

## 📊 Schema do VITRU IA

### Tabelas Principais

```
auth.users (Supabase Auth)
    │
    ├── trainers (Personal Trainers)
    │       │
    │       └── athletes (Atletas do trainer)
    │               │
    │               ├── assessments (Avaliações)
    │               │       │
    │               │       └── measurements (Medidas)
    │               │
    │               └── evolution_records (Histórico)
    │
    └── settings (Configurações do usuário)
```

### Relacionamentos

| Tabela | Relacionamento | Com |
|--------|----------------|-----|
| trainers | 1:N | athletes |
| athletes | 1:N | assessments |
| assessments | 1:N | measurements |
| athletes | 1:N | evolution_records |

---

## ✅ Checklist

Antes de finalizar trabalho de banco:

- [ ] Tabela segue nomenclatura padrão?
- [ ] `created_at` e `updated_at` incluídos?
- [ ] Soft delete com `deleted_at`?
- [ ] RLS habilitado e policies criadas?
- [ ] Índices para queries frequentes?
- [ ] Foreign keys com ON DELETE apropriado?
- [ ] Tipos TypeScript regenerados?
- [ ] Migration testada localmente?

---

## 📝 Notas de Aprendizado

<!-- Padrões descobertos serão adicionados aqui -->

---

## 🔗 Referências

- Schema completo: `specs/architecture/data-model.md`
- Supabase CLI: https://supabase.com/docs/guides/cli
- PostgreSQL Docs: https://www.postgresql.org/docs/