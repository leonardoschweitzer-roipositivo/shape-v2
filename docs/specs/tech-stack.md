# VITRU IA — Technical Specifications (SPEC)

**Versão:** 1.0  
**Data:** 06/02/2026  
**Referência:** VITRU IA PRD v1.0  

---

## 1. Tech Stack Definida

```
┌─────────────────────────────────────────────────────────────┐
│  ANTIGRAVITY                        Code Editor & Workflow  │
├─────────────────────────────────────────────────────────────┤
│  CLAUDE  ·  GOOGLE AI STUDIO        AI Dev & Design         │
├─────────────────────────────────────────────────────────────┤
│  GEMINI  ·  MCP  ·  NEXT.JS         IA Brain & Backend      │
├─────────────────────────────────────────────────────────────┤
│  REACT  ·  TAILWIND  ·  SHADCN/UI  ·  SUPABASE  Frontend & DB │
├─────────────────────────────────────────────────────────────┤
│  VERCEL  ·  TYPESCRIPT  ·  POSTGRESQL  ·  NODE.JS  Infra    │
└─────────────────────────────────────────────────────────────┘
```

| Camada | Tecnologia | Papel no VITRU IA |
|--------|-----------|-----------------|
| **IDE** | Antigravity | Editor principal, agent-first development, geração de código |
| **AI Design** | Google AI Studio + Stitch | Geração de UI/frontend, prototipação |
| **AI Dev** | Claude (Anthropic) | Lógica de negócio complexa, prompts de sistema, Coach IA |
| **AI Backend** | Gemini API (Google) | Coach IA runtime — diagnóstico, treino, dieta |
| **Protocol** | MCP (Model Context Protocol) | Conexão entre Antigravity ↔ ferramentas externas |
| **Framework** | Next.js 14+ (App Router) | Fullstack framework, SSR, API Routes, middleware |
| **Runtime** | Node.js + TypeScript | Linguagem e runtime principal |
| **UI Library** | React 18+ | Renderização de componentes |
| **Styling** | Tailwind CSS 3+ | Utility-first CSS, dark theme |
| **Components** | shadcn/ui | Component library (Radix primitives + Tailwind) |
| **Database** | Supabase (PostgreSQL) | BaaS — DB, Auth, Storage, Realtime, Edge Functions |
| **Deploy** | Vercel | Hosting, CI/CD, Edge Network, Preview Deploys |

---

## 2. Arquitetura do Sistema

### 2.1 Diagrama de Arquitetura

```
┌──────────────────────────────────────────────────────────────────┐
│                         VERCEL (Edge Network)                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                   NEXT.JS APP (App Router)                  │   │
│  │                                                             │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │   │
│  │  │   Pages /    │  │  Server      │  │  API Routes      │  │   │
│  │  │   Layouts    │  │  Components  │  │  /api/*          │  │   │
│  │  │  (RSC +      │  │  (Data       │  │                  │  │   │
│  │  │   Client)    │  │   Fetching)  │  │  - /assessments  │  │   │
│  │  └─────────────┘  └──────────────┘  │  - /coach-ia     │  │   │
│  │                                      │  - /webhooks     │  │   │
│  │  ┌─────────────────────────────────┐ └──────────────────┘  │   │
│  │  │  MIDDLEWARE (auth, rbac, i18n)  │                        │   │
│  │  └─────────────────────────────────┘                        │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────┬────────────────────┘
                           │                  │
              ┌────────────▼──────┐  ┌────────▼─────────┐
              │   SUPABASE        │  │   GEMINI API     │
              │                   │  │   (Google AI)    │
              │  ◆ PostgreSQL     │  │                  │
              │  ◆ Auth (GoTrue) │  │  ◆ Coach IA      │
              │  ◆ Storage       │  │  ◆ Diagnóstico   │
              │  ◆ Realtime      │  │  ◆ Treino        │
              │  ◆ Edge Funcs    │  │  ◆ Dieta         │
              └───────────────────┘  └──────────────────┘
```

### 2.2 Fluxo de Dados

```
Usuário (Browser)
    │
    ▼
Next.js (Vercel) ──── SSR/RSC ────► Supabase Client (dados)
    │                                     │
    ├── Client Components ◄───────────────┘ (realtime subscriptions)
    │
    ├── API Route /api/assessments/calculate
    │       └── Calcula proporções, assimetrias, scores (server-side)
    │       └── Salva em Supabase via service_role key
    │
    ├── API Route /api/coach-ia/generate
    │       └── Monta prompt com dados da avaliação
    │       └── Chama Gemini API (streaming)
    │       └── Salva resultado em Supabase
    │       └── Retorna stream para o frontend
    │
    └── Server Actions (forms, mutations)
            └── Supabase operations via server client
```

---

## 3. Estrutura de Diretórios

```
vitru-ia/
├── .env.local                          # Variáveis de ambiente
├── .env.example                        # Template de env vars
├── next.config.ts                      # Config Next.js
├── tailwind.config.ts                  # Config Tailwind (dark theme)
├── tsconfig.json                       # TypeScript config
├── package.json
│
├── public/
│   ├── images/
│   │   ├── logo.svg                    # Logo VITRU IA
│   │   ├── silhouettes/               # Silhuetas anatômicas SVG
│   │   └── hero/                      # Imagens do hero banner
│   └── fonts/                         # Custom fonts se necessário
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout (providers, sidebar)
│   │   ├── page.tsx                   # Redirect → /momento
│   │   ├── globals.css                # Tailwind imports + custom vars
│   │   │
│   │   ├── (auth)/                    # Grupo: rotas de autenticação
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   │
│   │   ├── (dashboard)/               # Grupo: rotas autenticadas (com sidebar)
│   │   │   ├── layout.tsx             # Dashboard layout com sidebar + header
│   │   │   ├── momento/page.tsx       # Dashboard principal
│   │   │   ├── evolucao/page.tsx      # Histórico + gráficos
│   │   │   ├── coach-ia/page.tsx      # Coach IA
│   │   │   ├── avaliacao/
│   │   │   │   ├── nova/page.tsx      # Formulário de nova avaliação
│   │   │   │   └── [id]/
│   │   │   │       └── resultados/page.tsx  # Resultados (3 abas)
│   │   │   ├── alunos/                # Gestão de alunos (personal)
│   │   │   │   ├── page.tsx           # Lista de alunos
│   │   │   │   ├── novo/page.tsx      # Cadastro de aluno
│   │   │   │   └── [id]/page.tsx      # Perfil do aluno
│   │   │   ├── academia/              # Módulo academia
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── personais/page.tsx
│   │   │   │   └── relatorios/page.tsx
│   │   │   └── perfil/page.tsx        # Perfil + configurações
│   │   │
│   │   └── api/                       # API Routes
│   │       ├── assessments/
│   │       │   ├── route.ts           # CRUD avaliações
│   │       │   └── calculate/route.ts # Cálculos server-side
│   │       ├── coach-ia/
│   │       │   └── generate/route.ts  # Geração via Gemini
│   │       └── webhooks/
│   │           └── stripe/route.ts    # Webhook de billing
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components (auto-gerados)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── sidebar.tsx            # Sidebar navigation
│   │   │   ├── header.tsx             # Top header com breadcrumb
│   │   │   ├── footer.tsx             # Footer
│   │   │   └── mobile-nav.tsx         # Hamburger menu mobile
│   │   │
│   │   ├── assessment/
│   │   │   ├── measurement-form.tsx   # Form de medidas corporais
│   │   │   ├── basic-fields.tsx       # Campos básicos (idade, altura, peso)
│   │   │   ├── trunk-fields.tsx       # Campos tronco
│   │   │   ├── core-fields.tsx        # Campos core
│   │   │   ├── limb-fields.tsx        # Campos bilaterais
│   │   │   ├── skinfold-fields.tsx    # Campos 7 dobras
│   │   │   └── comparison-mode-selector.tsx
│   │   │
│   │   ├── results/
│   │   │   ├── aesthetic-diagnosis.tsx    # Aba 1: Diagnóstico
│   │   │   ├── golden-proportions.tsx     # Aba 2: Proporções
│   │   │   ├── asymmetry-analysis.tsx     # Aba 3: Assimetrias
│   │   │   ├── proportion-card.tsx        # Card individual de proporção
│   │   │   ├── asymmetry-card.tsx         # Card individual de assimetria
│   │   │   ├── body-silhouette.tsx        # SVG interativo do corpo
│   │   │   └── score-gauge.tsx            # Gauge de score geral
│   │   │
│   │   ├── charts/
│   │   │   ├── symmetry-radar.tsx         # Radar de simetria (Recharts)
│   │   │   ├── evolution-line.tsx         # Gráfico evolução áurea
│   │   │   ├── weight-evolution.tsx       # Gráfico peso (magro/gordo/total)
│   │   │   ├── body-fat-chart.tsx         # Gráfico gordura corporal
│   │   │   ├── asymmetry-scanner.tsx      # Scanner de assimetrias
│   │   │   ├── progress-bar-scale.tsx     # Barra BLOCO→FREAK
│   │   │   └── imbalance-radar.tsx        # Radar de desequilíbrio bilateral
│   │   │
│   │   ├── coach/
│   │   │   ├── diagnosis-card.tsx
│   │   │   ├── training-card.tsx
│   │   │   ├── nutrition-card.tsx
│   │   │   └── ai-response-stream.tsx     # Componente de streaming IA
│   │   │
│   │   └── shared/
│   │       ├── loading-skeleton.tsx
│   │       ├── empty-state.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # createBrowserClient (client-side)
│   │   │   ├── server.ts              # createServerClient (server-side)
│   │   │   ├── admin.ts               # createServiceRoleClient (API routes)
│   │   │   └── middleware.ts          # Supabase auth middleware helper
│   │   │
│   │   ├── gemini/
│   │   │   ├── client.ts              # GoogleGenerativeAI client
│   │   │   ├── prompts/
│   │   │   │   ├── system-prompt.ts   # System prompt base do Coach IA
│   │   │   │   ├── diagnosis.ts       # Prompt para diagnóstico
│   │   │   │   ├── training.ts        # Prompt para treino
│   │   │   │   └── nutrition.ts       # Prompt para dieta
│   │   │   └── schemas/
│   │   │       └── coach-output.ts    # Zod schema do output estruturado
│   │   │
│   │   ├── calculations/
│   │   │   ├── body-composition.ts    # BF%, peso magro/gordo
│   │   │   ├── golden-proportions.ts  # Proporções áureas
│   │   │   ├── asymmetry.ts           # Análise de assimetrias
│   │   │   ├── overall-score.ts       # Score geral 0-100
│   │   │   ├── comparison-modes.ts    # Golden Ratio / CBum / MP targets
│   │   │   └── steve-reeves.ts        # Metas Steve Reeves
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts                  # clsx + tailwind-merge
│   │   │   ├── format.ts             # Formatadores (números, datas, etc)
│   │   │   └── constants.ts          # Constantes globais
│   │   │
│   │   └── validations/
│   │       ├── assessment.ts          # Zod schemas para avaliação
│   │       ├── student.ts             # Zod schemas para aluno
│   │       └── auth.ts               # Zod schemas para auth
│   │
│   ├── hooks/
│   │   ├── use-assessment.ts          # Hook para operações de avaliação
│   │   ├── use-student.ts             # Hook para operações de aluno
│   │   ├── use-evolution.ts           # Hook para dados de evolução
│   │   ├── use-coach-ia.ts            # Hook para streaming do Coach IA
│   │   └── use-user.ts               # Hook para dados do usuário logado
│   │
│   ├── types/
│   │   ├── database.ts                # Types gerados pelo Supabase CLI
│   │   ├── assessment.ts              # Types de avaliação
│   │   ├── proportions.ts             # Types de proporções
│   │   ├── coach.ts                   # Types do Coach IA
│   │   └── enums.ts                   # Enums compartilhados
│   │
│   └── middleware.ts                  # Next.js middleware (auth guard)
│
├── supabase/
│   ├── config.toml                    # Supabase local config
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   ├── 003_functions.sql
│   │   └── 004_seed_plans.sql
│   └── seed.sql                       # Dados de seed (planos, demo user)
│
└── scripts/
    └── generate-types.sh              # npx supabase gen types
```

---

## 4. Banco de Dados — Supabase (PostgreSQL)

### 4.1 Schema SQL Completo

```sql
-- ============================================================
-- MIGRATION 001: INITIAL SCHEMA
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('admin', 'academy_owner', 'professional', 'student');
CREATE TYPE plan_tier AS ENUM ('free', 'starter', 'pro', 'elite', 'academy_small', 'academy_business', 'enterprise');
CREATE TYPE comparison_mode AS ENUM ('golden_ratio', 'classic_physique', 'mens_physique');
CREATE TYPE subscription_status AS ENUM ('active', 'trialing', 'past_due', 'canceled', 'paused');
CREATE TYPE assessment_type AS ENUM ('initial', 'periodic', 'competition_prep');
CREATE TYPE asymmetry_level AS ENUM ('symmetric', 'moderate', 'high');
CREATE TYPE score_grade AS ENUM ('A', 'B', 'C', 'D', 'E');

-- ============================================================
-- PLANS (reference table)
-- ============================================================

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tier plan_tier NOT NULL UNIQUE,
  max_students INTEGER NOT NULL,
  price_monthly_cents INTEGER NOT NULL,  -- em centavos (R$)
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PROFILES (extends Supabase Auth users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  phone TEXT,
  cref TEXT,                              -- registro profissional (personal)
  comparison_mode comparison_mode DEFAULT 'golden_ratio',
  preferred_bf_method TEXT DEFAULT 'navy', -- 'navy' | 'pollock'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ORGANIZATIONS (Academias)
-- ============================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  logo_url TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  plan_id UUID REFERENCES plans(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id),        -- personal independente
  organization_id UUID REFERENCES organizations(id), -- academia
  plan_id UUID NOT NULL REFERENCES plans(id),
  status subscription_status DEFAULT 'trialing',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT sub_owner CHECK (
    (profile_id IS NOT NULL AND organization_id IS NULL) OR
    (profile_id IS NULL AND organization_id IS NOT NULL)
  )
);

-- ============================================================
-- ORGANIZATION MEMBERS (Personal ↔ Academia)
-- ============================================================

CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'professional', -- 'owner', 'professional'
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(organization_id, profile_id)
);

-- ============================================================
-- STUDENTS (Alunos)
-- ============================================================

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id UUID NOT NULL REFERENCES profiles(id),
  organization_id UUID REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  gender TEXT DEFAULT 'male',
  goals TEXT,
  comparison_mode comparison_mode DEFAULT 'golden_ratio',
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ASSESSMENTS (Avaliações)
-- ============================================================

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES profiles(id),
  assessment_type assessment_type DEFAULT 'periodic',
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  comparison_mode comparison_mode DEFAULT 'golden_ratio',

  -- BÁSICAS
  age INTEGER NOT NULL,
  height_cm NUMERIC(5,1) NOT NULL,
  weight_kg NUMERIC(5,1) NOT NULL,

  -- TRONCO
  neck_cm NUMERIC(5,1),
  shoulders_cm NUMERIC(5,1) NOT NULL,
  chest_cm NUMERIC(5,1),

  -- CORE
  waist_cm NUMERIC(5,1) NOT NULL,
  hip_cm NUMERIC(5,1),

  -- MEMBROS BILATERAIS
  arm_left_cm NUMERIC(5,1),
  arm_right_cm NUMERIC(5,1),
  forearm_left_cm NUMERIC(5,1),
  forearm_right_cm NUMERIC(5,1),
  wrist_left_cm NUMERIC(5,1),
  wrist_right_cm NUMERIC(5,1),
  thigh_left_cm NUMERIC(5,1),
  thigh_right_cm NUMERIC(5,1),
  knee_left_cm NUMERIC(5,1),
  knee_right_cm NUMERIC(5,1),
  calf_left_cm NUMERIC(5,1),
  calf_right_cm NUMERIC(5,1),
  ankle_left_cm NUMERIC(5,1),
  ankle_right_cm NUMERIC(5,1),

  -- PROTOCOLO 7 DOBRAS (mm)
  skinfold_tricep NUMERIC(4,1),
  skinfold_subscapular NUMERIC(4,1),
  skinfold_chest NUMERIC(4,1),
  skinfold_midaxillary NUMERIC(4,1),
  skinfold_suprailiac NUMERIC(4,1),
  skinfold_abdominal NUMERIC(4,1),
  skinfold_thigh NUMERIC(4,1),

  -- RESULTADOS CALCULADOS (computed no backend, salvos para performance)
  body_fat_navy NUMERIC(4,1),
  body_fat_pollock NUMERIC(4,1),
  lean_mass_kg NUMERIC(5,1),
  fat_mass_kg NUMERIC(5,1),
  shape_v_ratio NUMERIC(4,3),
  overall_score INTEGER,               -- 0-100
  score_grade score_grade,
  symmetry_score INTEGER,              -- 0-100
  proportions_data JSONB,              -- { proporções calculadas }
  asymmetry_data JSONB,                -- { assimetrias calculadas }

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AI COACH OUTPUTS
-- ============================================================

CREATE TABLE coach_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  output_type TEXT NOT NULL,            -- 'diagnosis', 'training', 'nutrition'
  content TEXT NOT NULL,                -- Resposta da IA (markdown)
  structured_data JSONB,                -- Dados estruturados (ex: plano de treino)
  model_name TEXT NOT NULL,             -- ex: 'gemini-2.5-pro'
  tokens_used INTEGER,
  comparison_mode comparison_mode,
  generated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_assessments_student ON assessments(student_id);
CREATE INDEX idx_assessments_date ON assessments(assessment_date DESC);
CREATE INDEX idx_assessments_student_date ON assessments(student_id, assessment_date DESC);
CREATE INDEX idx_students_professional ON students(professional_id);
CREATE INDEX idx_students_org ON students(organization_id);
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_profile ON organization_members(profile_id);
CREATE INDEX idx_coach_outputs_assessment ON coach_outputs(assessment_id);
CREATE INDEX idx_subscriptions_profile ON subscriptions(profile_id);

-- ============================================================
-- TIMESTAMPS TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_students
  BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_assessments
  BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at_organizations
  BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 4.2 Row Level Security (RLS)

```sql
-- ============================================================
-- MIGRATION 002: RLS POLICIES
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- PROFILES: usuário vê/edita apenas seu próprio perfil
CREATE POLICY "Users view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- STUDENTS: personal vê seus alunos; academia vê alunos da org
CREATE POLICY "Professionals view own students"
  ON students FOR SELECT USING (
    professional_id = auth.uid()
    OR organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE profile_id = auth.uid() AND is_active = true
    )
  );
CREATE POLICY "Professionals manage own students"
  ON students FOR ALL USING (professional_id = auth.uid());

-- ASSESSMENTS: acesso via student ownership
CREATE POLICY "View assessments of own students"
  ON assessments FOR SELECT USING (
    professional_id = auth.uid()
    OR student_id IN (
      SELECT id FROM students WHERE professional_id = auth.uid()
    )
  );
CREATE POLICY "Create assessments for own students"
  ON assessments FOR INSERT WITH CHECK (
    professional_id = auth.uid()
    OR student_id IN (
      SELECT id FROM students WHERE professional_id = auth.uid()
    )
  );

-- COACH OUTPUTS: acesso via assessment ownership
CREATE POLICY "View coach outputs of own assessments"
  ON coach_outputs FOR SELECT USING (
    assessment_id IN (
      SELECT id FROM assessments WHERE professional_id = auth.uid()
      OR student_id IN (
        SELECT id FROM students WHERE professional_id = auth.uid()
      )
    )
  );

-- ORGANIZATIONS: owner e membros
CREATE POLICY "View own organization"
  ON organizations FOR SELECT USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT organization_id FROM organization_members
      WHERE profile_id = auth.uid() AND is_active = true
    )
  );
```

### 4.3 Database Functions

```sql
-- ============================================================
-- MIGRATION 003: FUNCTIONS
-- ============================================================

-- Função para contar alunos ativos de um profissional
CREATE OR REPLACE FUNCTION get_student_count(p_profile_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM students
  WHERE professional_id = p_profile_id AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

-- Função para verificar limite de alunos pelo plano
CREATE OR REPLACE FUNCTION check_student_limit(p_profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
BEGIN
  SELECT get_student_count(p_profile_id) INTO current_count;

  SELECT p.max_students INTO max_allowed
  FROM subscriptions s
  JOIN plans p ON s.plan_id = p.id
  WHERE s.profile_id = p_profile_id AND s.status = 'active'
  LIMIT 1;

  IF max_allowed IS NULL THEN
    max_allowed := 3; -- free tier default
  END IF;

  RETURN current_count < max_allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-criar profile quando user se registra
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 4.4 Seed Data

```sql
-- ============================================================
-- MIGRATION 004: SEED PLANS
-- ============================================================

INSERT INTO plans (name, tier, max_students, price_monthly_cents) VALUES
  ('Free',              'free',             3,     0),
  ('Starter',           'starter',          5,     4990),
  ('Pro',               'pro',              20,    9990),
  ('Elite',             'elite',            50,    18990),
  ('Academia Small',    'academy_small',    150,   39990),
  ('Academia Business', 'academy_business', 500,   79990),
  ('Enterprise',        'enterprise',       99999, 0);
```

---

## 5. Autenticação — Supabase Auth

### 5.1 Configuração

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protege rotas do dashboard
  if (!user && request.nextUrl.pathname.startsWith('/(dashboard)')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect se já logado tentando acessar auth pages
  if (user && request.nextUrl.pathname.startsWith('/(auth)')) {
    return NextResponse.redirect(new URL('/momento', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

### 5.2 Fluxo de Registro

```typescript
// Signup com metadata de role
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: name,
      role: selectedRole, // 'professional' | 'academy_owner' | 'student'
    }
  }
})
```

---

## 6. Motor de Cálculos

### 6.1 Body Composition

```typescript
// src/lib/calculations/body-composition.ts

export function calcBodyFatNavy(
  waist: number, neck: number, height: number
): number {
  return +(86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76).toFixed(1)
}

export function calcBodyFatPollock(
  skinfolds: {
    tricep: number; subscapular: number; chest: number;
    midaxillary: number; suprailiac: number; abdominal: number;
    thigh: number;
  },
  age: number
): number {
  const S = Object.values(skinfolds).reduce((a, b) => a + b, 0)
  const density = 1.112 - 0.00043499 * S + 0.00000055 * S * S - 0.00028826 * age
  return +((495 / density) - 450).toFixed(1)
}

export function calcLeanMass(weight: number, bodyFatPct: number): number {
  return +(weight * (1 - bodyFatPct / 100)).toFixed(1)
}

export function calcFatMass(weight: number, bodyFatPct: number): number {
  return +(weight * bodyFatPct / 100).toFixed(1)
}
```

### 6.2 Golden Proportions

```typescript
// src/lib/calculations/golden-proportions.ts

import { ComparisonMode } from '@/types/enums'

const GOLDEN_RATIO = 1.618

interface ProportionResult {
  name: string
  current: number
  target: number
  ratio: number
  progress: number  // 0-100
  status: 'deficit' | 'on_track' | 'exceeded'
}

// Ratios por modo de comparação (conforme spec calculo-proporcoes.md v2.0)
const MODE_CONFIGS = {
  golden_ratio: {
    vtaper_target: GOLDEN_RATIO,     // 1.618 - Ombros = Cintura × 1.618
    chest_wrist_mult: 6.5,           // Peitoral = Punho × 6.5
    arm_wrist_mult: 2.52,            // Braço = Punho × 2.52
    forearm_arm_mult: 0.80,          // Antebraço = Braço × 0.80
    waist_pelvis_mult: 0.86,         // Cintura = Pelve × 0.86
    thigh_knee_mult: 1.75,           // Coxa = Joelho × 1.75
    thigh_calf_ratio: 1.5,           // Coxa = Panturrilha × 1.5
    calf_ankle_mult: 1.92,           // Panturrilha = Tornozelo × 1.92
    triad_enabled: true,             // Pescoço ≈ Braço ≈ Panturrilha
    score_weights: { 
      ombros: 18, peitoral: 14, braco: 14, antebraco: 5, triade: 10,
      cintura: 12, coxa: 10, coxa_panturrilha: 8, panturrilha: 9
    },
  },
  classic_physique: {
    vtaper_target: 1.70,             // Ombros = Cintura × 1.70 (mais agressivo)
    chest_wrist_mult: 7.0,           // Peitoral = Punho × 7.0
    arm_formula: 'height',           // Braço = (Altura/185) × 50cm
    arm_ref_height: 185,
    arm_ref_size: 50,
    forearm_arm_mult: 0.80,          // Antebraço = Braço × 0.80
    waist_height_mult: 0.42,         // Cintura = Altura × 0.42 (super apertada)
    thigh_waist_mult: 0.97,          // Coxa = Cintura × 0.97
    thigh_calf_ratio: 1.5,           // Coxa = Panturrilha × 1.5
    calf_arm_mult: 0.96,             // Panturrilha = Braço × 0.96
    triad_enabled: true,             // ~1:1:1 (harmonia)
    score_weights: { 
      ombros: 18, peitoral: 14, braco: 16, antebraco: 4, triade: 8,
      cintura: 16, coxa: 10, coxa_panturrilha: 6, panturrilha: 8
    },
  },
  mens_physique: {
    vtaper_target: 1.55,             // Ombros = Cintura × 1.55 (mais suave)
    chest_wrist_mult: 6.2,           // Peitoral = Punho × 6.2
    arm_formula: 'height',           // Braço = (Altura/178) × 43cm
    arm_ref_height: 178,
    arm_ref_size: 43,
    forearm_arm_mult: 0.80,          // Antebraço = Braço × 0.80
    waist_height_mult: 0.455,        // Cintura = Altura × 0.455
    calf_ankle_mult: 1.8,            // Panturrilha = Tornozelo × 1.8 (estética)
    triad_enabled: false,            // N/A - foco em upper body
    thigh_enabled: false,            // N/A - não julgada (board shorts)
    thigh_calf_enabled: false,       // N/A - não julgada
    score_weights: { 
      ombros: 25, peitoral: 22, braco: 25, antebraco: 6, triade: 0,
      cintura: 17, coxa: 0, coxa_panturrilha: 0, panturrilha: 5
    },
  },
} as const

export function calcShapeV(shoulders: number, waist: number): number {
  return +(shoulders / waist).toFixed(3)
}

export function calcAllProportions(
  measurements: AssessmentMeasurements,
  mode: ComparisonMode
): ProportionResult[] {
  const config = MODE_CONFIGS[mode]
  const results: ProportionResult[] = []

  // V-Taper (Shape-V)
  const vtaper = calcShapeV(measurements.shoulders_cm, measurements.waist_cm)
  results.push({
    name: 'Shape-V (V-Taper)',
    current: vtaper,
    target: config.vtaper_target,
    ratio: vtaper,
    progress: Math.min(100, (vtaper / config.vtaper_target) * 100),
    status: vtaper >= config.vtaper_target * 0.97 ? 'on_track'
          : vtaper > config.vtaper_target ? 'exceeded' : 'deficit',
  })

  // Braço (média bilateral)
  const avgArm = avg(measurements.arm_left_cm, measurements.arm_right_cm)
  const avgWrist = avg(measurements.wrist_left_cm, measurements.wrist_right_cm)
  const armTarget = avgWrist * config.arm_wrist_mult
  results.push({
    name: 'Braço',
    current: avgArm,
    target: +armTarget.toFixed(1),
    ratio: +(avgArm / avgWrist).toFixed(3),
    progress: Math.min(100, (avgArm / armTarget) * 100),
    status: avgArm >= armTarget * 0.97 ? 'on_track' : 'deficit',
  })

  // Panturrilha
  const avgCalf = avg(measurements.calf_left_cm, measurements.calf_right_cm)
  const avgAnkle = avg(measurements.ankle_left_cm, measurements.ankle_right_cm)
  const calfTarget = avgAnkle * config.calf_ankle_mult
  results.push({
    name: 'Panturrilha',
    current: avgCalf,
    target: +calfTarget.toFixed(1),
    ratio: +(avgCalf / avgAnkle).toFixed(3),
    progress: Math.min(100, (avgCalf / calfTarget) * 100),
    status: avgCalf >= calfTarget * 0.97 ? 'on_track' : 'deficit',
  })

  // Coxa
  const avgThigh = avg(measurements.thigh_left_cm, measurements.thigh_right_cm)
  const avgKnee = avg(measurements.knee_left_cm, measurements.knee_right_cm)
  const thighTarget = avgKnee * config.thigh_knee_mult
  results.push({
    name: 'Coxa',
    current: avgThigh,
    target: +thighTarget.toFixed(1),
    ratio: +(avgThigh / avgKnee).toFixed(3),
    progress: Math.min(100, (avgThigh / thighTarget) * 100),
    status: avgThigh >= thighTarget * 0.97 ? 'on_track' : 'deficit',
  })

  // Peitoral
  if (measurements.chest_cm && measurements.waist_cm) {
    const chestTarget = measurements.waist_cm * config.chest_waist_mult
    results.push({
      name: 'Peitoral',
      current: measurements.chest_cm,
      target: +chestTarget.toFixed(1),
      ratio: +(measurements.chest_cm / measurements.waist_cm).toFixed(3),
      progress: Math.min(100, (measurements.chest_cm / chestTarget) * 100),
      status: measurements.chest_cm >= chestTarget * 0.97 ? 'on_track' : 'deficit',
    })
  }

  // Trindade Clássica (Pescoço ≈ Braço ≈ Panturrilha)
  if (measurements.neck_cm) {
    const trinity = [measurements.neck_cm, avgArm, avgCalf]
    const trinityAvg = trinity.reduce((a, b) => a + b, 0) / 3
    const maxDev = Math.max(...trinity.map(v => Math.abs(v - trinityAvg)))
    const trinityScore = Math.max(0, 100 - (maxDev / trinityAvg) * 100 * 5)
    results.push({
      name: 'Trindade Clássica',
      current: +trinityAvg.toFixed(1),
      target: +trinityAvg.toFixed(1),
      ratio: +(maxDev).toFixed(1),
      progress: trinityScore,
      status: trinityScore > 90 ? 'on_track' : 'deficit',
    })
  }

  return results
}

function avg(a: number | null, b: number | null): number {
  if (a && b) return (a + b) / 2
  return a || b || 0
}
```

### 6.3 Asymmetry Analysis

```typescript
// src/lib/calculations/asymmetry.ts

export interface AsymmetryResult {
  muscle_group: string
  left_cm: number
  right_cm: number
  diff_cm: number
  diff_pct: number
  level: 'symmetric' | 'moderate' | 'high'
  dominant_side: 'left' | 'right' | 'equal'
}

const MUSCLE_GROUPS = [
  'arm', 'forearm', 'wrist', 'thigh', 'knee', 'calf', 'ankle'
] as const

export function calcAsymmetries(measurements: Record<string, number>): AsymmetryResult[] {
  return MUSCLE_GROUPS.map(group => {
    const left = measurements[`${group}_left_cm`] || 0
    const right = measurements[`${group}_right_cm`] || 0
    const diff = Math.abs(left - right)
    const max = Math.max(left, right)
    const pct = max > 0 ? (diff / max) * 100 : 0

    return {
      muscle_group: group,
      left_cm: left,
      right_cm: right,
      diff_cm: +diff.toFixed(1),
      diff_pct: +pct.toFixed(1),
      level: pct < 3 ? 'symmetric' : pct < 5 ? 'moderate' : 'high',
      dominant_side: left > right ? 'left' : right > left ? 'right' : 'equal',
    }
  })
}

export function calcSymmetryScore(asymmetries: AsymmetryResult[]): number {
  const penalties = asymmetries.map(a => {
    if (a.level === 'symmetric') return 0
    if (a.level === 'moderate') return 5
    return 12
  })
  return Math.max(0, 100 - penalties.reduce((a, b) => a + b, 0))
}
```

---

## 7. Coach IA — Integração Gemini

### 7.1 Client Setup

```typescript
// src/lib/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 4096,
  },
})
```

### 7.2 System Prompt

```typescript
// src/lib/gemini/prompts/system-prompt.ts

export const COACH_IA_SYSTEM_PROMPT = `
Você é o Coach IA do VITRU IA, especialista em avaliação estética masculina baseada em proporções áureas, simetria bilateral e composição corporal.

Seu papel é analisar dados antropométricos de atletas e gerar recomendações precisas para que evoluam em direção ao ideal das proporções clássicas do fisiculturismo (Golden Ratio 1.618, padrão Steve Reeves, referência Chris Bumstead para Classic Physique).

REGRAS:
1. Sempre responda em Português Brasileiro.
2. Seja técnico mas acessível — o público são personal trainers e atletas de academia.
3. Priorize as correções que trarão maior impacto visual/estético primeiro.
4. Para assimetrias, SEMPRE recomende exercícios unilaterais no lado deficiente.
5. Considere o modo de comparação selecionado (Golden Ratio, Classic Physique ou Men's Physique).
6. Nunca recomende substâncias farmacológicas. Foque em treino, dieta e suplementação básica.
7. Use markdown para formatar a resposta (headers, bold, listas).

REFERÊNCIAS DE PROPORÇÕES (spec v2.0):

GOLDEN RATIO (9 Proporções):
- Ombros = Cintura × 1.618
- Peitoral = Punho × 6.5
- Braço = Punho × 2.52
- Antebraço = Braço × 0.80
- Tríade: Pescoço ≈ Braço ≈ Panturrilha (1:1:1)
- Cintura = Pelve × 0.86
- Coxa = Joelho × 1.75
- Coxa/Panturrilha: Coxa = Panturrilha × 1.5
- Panturrilha = Tornozelo × 1.92

CLASSIC PHYSIQUE (CBum, 185cm):
- Ombros = Cintura × 1.70 (V-Taper mais agressivo)
- Peitoral = Punho × 7.0
- Braço = (Altura/185) × 50cm
- Cintura = Altura × 0.42 (super apertada!)
- Coxa = Cintura × 0.97
- Panturrilha = Braço × 0.96

MEN'S PHYSIQUE (Ryan Terry, 178cm):
- Ombros = Cintura × 1.55 (V-Taper mais suave)
- Peitoral = Punho × 6.2
- Braço = (Altura/178) × 43cm
- Cintura = Altura × 0.455
- Coxa, Coxa/Panturrilha, Tríade: N/A (não julgadas, usa board shorts)

ESCALA VITRU IA:
- Bloco (ratio < 1.2): Sem definição de V-Taper
- Normal (1.2-1.35): V-Taper mínimo
- Atlético (1.35-1.50): Boa proporção
- Estético (1.50-1.618): Quase ideal
- Freak (>1.618): Acima do golden ratio
`
```

### 7.3 API Route

```typescript
// src/app/api/coach-ia/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { geminiModel } from '@/lib/gemini/client'
import { COACH_IA_SYSTEM_PROMPT } from '@/lib/gemini/prompts/system-prompt'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { assessmentId, outputType } = await request.json()

  // Buscar dados da avaliação
  const { data: assessment } = await supabase
    .from('assessments')
    .select('*, students(*)')
    .eq('id', assessmentId)
    .single()

  if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Buscar histórico
  const { data: history } = await supabase
    .from('assessments')
    .select('assessment_date, shape_v_ratio, overall_score, body_fat_navy, weight_kg')
    .eq('student_id', assessment.student_id)
    .order('assessment_date', { ascending: false })
    .limit(5)

  // Montar contexto
  const context = buildAssessmentContext(assessment, history || [])
  const typePrompt = getTypePrompt(outputType, assessment.comparison_mode)

  // Gerar com streaming
  const result = await geminiModel.generateContentStream({
    contents: [{
      role: 'user',
      parts: [{ text: `${COACH_IA_SYSTEM_PROMPT}\n\n${context}\n\n${typePrompt}` }]
    }],
  })

  // Stream response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let fullText = ''
      for await (const chunk of result.stream) {
        const text = chunk.text()
        fullText += text
        controller.enqueue(encoder.encode(text))
      }
      controller.close()

      // Salvar resultado completo no DB
      await supabase.from('coach_outputs').insert({
        assessment_id: assessmentId,
        output_type: outputType,
        content: fullText,
        model_name: 'gemini-2.5-pro',
        comparison_mode: assessment.comparison_mode,
      })
    },
  })

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

---

## 8. Environment Variables

```bash
# .env.local

# === SUPABASE ===
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# === GEMINI (Google AI) ===
GEMINI_API_KEY=AIzaSy...

# === APP ===
NEXT_PUBLIC_APP_URL=https://shapev.com.br
NEXT_PUBLIC_APP_NAME=VITRU IA

# === STRIPE (billing) ===
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 9. Vercel Deploy Config

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["gru1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
    "GEMINI_API_KEY": "@gemini-api-key",
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "STRIPE_WEBHOOK_SECRET": "@stripe-webhook-secret"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ]
}
```

**Vercel Settings:**
- **Region:** São Paulo (gru1) — menor latência para Brasil
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Node.js Version:** 20.x
- **Framework Preset:** Next.js

---

## 10. Pacotes NPM

```json
{
  "dependencies": {
    "next": "^14.2",
    "react": "^18.3",
    "react-dom": "^18.3",
    "@supabase/supabase-js": "^2.45",
    "@supabase/ssr": "^0.5",
    "@google/generative-ai": "^0.21",
    "recharts": "^2.12",
    "zod": "^3.23",
    "lucide-react": "^0.400",
    "class-variance-authority": "^0.7",
    "clsx": "^2.1",
    "tailwind-merge": "^2.5",
    "date-fns": "^3.6",
    "stripe": "^16"
  },
  "devDependencies": {
    "typescript": "^5.5",
    "@types/react": "^18",
    "@types/node": "^20",
    "tailwindcss": "^3.4",
    "postcss": "^8",
    "autoprefixer": "^10",
    "supabase": "^1.200",
    "eslint": "^8",
    "eslint-config-next": "^14"
  }
}
```

---

## 11. Comandos de Setup

```bash
# 1. Criar projeto Next.js via Antigravity ou manualmente
npx create-next-app@latest vitru-ia --typescript --tailwind --eslint --app --src-dir

# Entrar no diretório
cd vitru-ia
npm install @supabase/supabase-js @supabase/ssr @google/generative-ai recharts zod lucide-react class-variance-authority clsx tailwind-merge date-fns stripe

# 3. Setup shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input table tabs badge dialog dropdown-menu progress select toggle-group tooltip form label textarea separator avatar sheet

# 4. Setup Supabase CLI
npx supabase init
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push  # aplica migrations

# 5. Gerar types do Supabase
npx supabase gen types typescript --linked > src/types/database.ts

# 6. Deploy Vercel
vercel --prod
```

---

## 12. Ordem de Implementação (Sprint Plan)

### Sprint 1 — Foundation (Semana 1-2)
```
□ Setup Next.js + Tailwind + shadcn/ui
□ Configurar Supabase (projeto, migrations, RLS)
□ Implementar autenticação (login, register, middleware)
□ Layout base (sidebar, header, footer)
□ Dark theme
□ Deploy inicial Vercel
```

### Sprint 2 — Assessment Core (Semana 3-4)
```
□ Formulário de avaliação completo (measurement-form)
□ Motor de cálculos (body-composition, golden-proportions, asymmetry)
□ API Route /api/assessments/calculate
□ Salvar avaliação no Supabase
□ Tela de resultados: Diagnóstico Estético
□ Tela de resultados: Proporções Áureas
□ Tela de resultados: Análise de Assimetrias
□ Comparison mode selector (Golden Ratio / CBum / MP)
```

### Sprint 3 — Dashboard & Evolution (Semana 5-6)
```
□ Dashboard "Momento" com cards de pontuação
□ Gestão de alunos (CRUD)
□ Tela Evolução: modo lista
□ Tela Evolução: gráficos (Recharts)
□ Gráfico de convergência áurea
□ Gráficos de peso, gordura, assimetrias
```

### Sprint 4 — Coach IA (Semana 7-8)
```
□ Integração Gemini API
□ System prompt e prompts especializados
□ API Route /api/coach-ia/generate com streaming
□ Tela Coach IA: 3 pilares
□ Componente de streaming da resposta IA
□ Salvar outputs no banco
```

### Sprint 5 — Multi-tenant & Billing (Semana 9-10)
```
□ Módulo Academia (organizações, membros)
□ Dashboard agregado da academia
□ Integração Stripe (planos, checkout, webhooks)
□ Verificação de limites de alunos por plano
□ Perfil e configurações do usuário
```
