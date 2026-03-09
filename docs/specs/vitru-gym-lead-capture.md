# SPEC: Módulo de Captação para Academias
## VITRU IA - Lead Capture & Conversion System

**Versão:** 1.0.0  
**Data:** 2026-03-09  
**Autor:** Leonardo Schweitzer  
**Status:** Draft  
**Módulo:** `gym-lead-capture`

---

## 1. Visão Geral

### 1.1 Objetivo

Sistema de captação de leads na recepção de academias que:
1. Captura contato do visitante (WhatsApp + Nome)
2. Executa mini-assessment de 60 segundos
3. Gera diagnóstico personalizado via IA
4. Apresenta oferta ideal baseada no perfil
5. Dispara follow-up automático via WhatsApp
6. Fornece dashboard de métricas para a academia

### 1.2 Usuários do Sistema

| Usuário | Papel | Acesso |
|---------|-------|--------|
| **Academia (Admin)** | Configura ofertas, visualiza métricas, gerencia leads | Dashboard completo |
| **Recepção** | Incentiva escaneamento do QR | Apenas QR Code |
| **Visitante (Lead)** | Responde assessment, recebe diagnóstico | App público |

### 1.3 Escopo desta SPEC

Esta SPEC cobre **apenas o módulo da Academia**, incluindo:
- Onboarding e configuração inicial
- Configurador de ofertas customizáveis
- Dashboard de métricas e leads
- Prompt de IA para diagnóstico
- APIs e schemas de banco de dados

---

## 2. Arquitetura do Sistema

### 2.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MÓDULO ACADEMIA                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      DASHBOARD ACADEMIA                              │    │
│  ├─────────────────┬─────────────────┬─────────────────┬───────────────┤    │
│  │   Métricas      │   Leads CRM     │  Configurador   │   QR Codes    │    │
│  │   & Analytics   │   & Follow-up   │   de Ofertas    │   & Links     │    │
│  └────────┬────────┴────────┬────────┴────────┬────────┴───────┬───────┘    │
│           │                 │                 │                │             │
│           └─────────────────┴─────────────────┴────────────────┘             │
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      SUPABASE BACKEND                                │    │
│  ├─────────────────┬─────────────────┬─────────────────┬───────────────┤    │
│  │   Edge Function │   Edge Function │   Edge Function │  Edge Function│    │
│  │   /diagnostic   │   /leads        │   /offers       │  /analytics   │    │
│  └────────┬────────┴────────┬────────┴────────┬────────┴───────┬───────┘    │
│           │                 │                 │                │             │
│           ▼                 ▼                 ▼                ▼             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         DATABASE                                     │    │
│  │  gyms | gym_offers | gym_leads | assessments | follow_up_sequences  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MÓDULO VISITANTE (LEAD)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   QR Code ──► vitru.app/start/{gym_slug} ──► Assessment ──► Diagnóstico    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend Dashboard | React + TypeScript + Tailwind | Stack VITRU |
| State Management | Zustand | Simplicidade |
| Charts | Recharts | Já disponível |
| Backend | Supabase Edge Functions (Deno) | Stack VITRU |
| Database | Supabase PostgreSQL | Stack VITRU |
| AI | Gemini 1.5 Flash | Custo/benefício |
| WhatsApp | Evolution API / Z-API | Integração brasileira |
| QR Code | qrcode.react | Geração client-side |

---

## 3. Schema do Banco de Dados

### 3.1 Tabela: `gyms`

```sql
-- Academias cadastradas no sistema
CREATE TABLE gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados básicos
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  
  -- Contato
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  whatsapp VARCHAR(20) NOT NULL,
  
  -- Endereço
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  
  -- Configurações
  settings JSONB DEFAULT '{
    "primary_color": "#10B981",
    "welcome_message": "Bem-vindo! Faça seu diagnóstico fitness em 60 segundos.",
    "follow_up_enabled": true,
    "follow_up_schedule": {
      "d1": true,
      "d3": true,
      "d7": true,
      "d14": true
    },
    "default_offer_id": null,
    "assessment_questions_custom": null
  }'::jsonb,
  
  -- Plano VITRU
  plan VARCHAR(20) DEFAULT 'starter',
  plan_valid_until DATE,
  
  -- Metadata
  owner_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  CONSTRAINT valid_plan CHECK (plan IN ('starter', 'pro', 'enterprise'))
);

-- Índices
CREATE INDEX idx_gyms_slug ON gyms(slug);
CREATE INDEX idx_gyms_owner ON gyms(owner_user_id);
CREATE INDEX idx_gyms_active ON gyms(is_active) WHERE is_active = true;

-- Trigger para updated_at
CREATE TRIGGER update_gyms_updated_at
  BEFORE UPDATE ON gyms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Tabela: `gym_offers`

```sql
-- Ofertas configuráveis por academia
CREATE TABLE gym_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  
  -- Identificação
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  description TEXT,
  
  -- Configuração do plano
  duration_months INTEGER NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  
  -- Stack de valor (para exibição)
  value_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
  /*
    Exemplo:
    [
      {"item": "Acesso à academia", "value": 1428, "included": true},
      {"item": "Matrícula", "value": 129, "included": true},
      {"item": "Avaliação física IA", "value": 297, "included": true},
      ...
    ]
  */
  
  total_stack_value DECIMAL(10,2) NOT NULL,
  discount_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    ROUND((1 - (total_price / NULLIF(total_stack_value, 0))) * 100, 1)
  ) STORED,
  
  -- Targeting (quem vê essa oferta)
  target_profiles TEXT[] DEFAULT ARRAY['all'],
  /*
    Valores possíveis:
    'all', 'beginner', 'returning', 'experienced',
    'low_commitment', 'medium_commitment', 'high_commitment',
    'goal_weight_loss', 'goal_muscle_gain', 'goal_definition', 'goal_health'
  */
  
  priority INTEGER DEFAULT 0, -- maior = mais prioritário
  
  -- Garantia
  guarantee_days INTEGER DEFAULT 30,
  guarantee_text TEXT DEFAULT 'Se em 30 dias você não sentir diferença, devolvemos seu dinheiro.',
  
  -- Visual
  badge_text VARCHAR(50), -- ex: "MAIS POPULAR", "MELHOR CUSTO-BENEFÍCIO"
  icon VARCHAR(50) DEFAULT '🏋️',
  
  -- CTA
  cta_text VARCHAR(100) DEFAULT 'QUERO COMEÇAR',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_gym_offer_slug UNIQUE (gym_id, slug),
  CONSTRAINT valid_duration CHECK (duration_months > 0 AND duration_months <= 24),
  CONSTRAINT valid_prices CHECK (monthly_price > 0 AND total_price > 0)
);

-- Índices
CREATE INDEX idx_gym_offers_gym ON gym_offers(gym_id);
CREATE INDEX idx_gym_offers_active ON gym_offers(gym_id, is_active) WHERE is_active = true;
CREATE INDEX idx_gym_offers_profiles ON gym_offers USING GIN (target_profiles);
```

### 3.3 Tabela: `gym_leads`

```sql
-- Leads capturados
CREATE TABLE gym_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  
  -- Dados do lead
  name VARCHAR(200) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  
  -- Assessment
  assessment_data JSONB,
  /*
    {
      "goal": "weight_loss",
      "experience": "returning",
      "days_per_week": 4,
      "main_difficulty": "motivation",
      "height_cm": 178,
      "weight_kg": 85
    }
  */
  
  -- Diagnóstico gerado pela IA
  diagnostic_result JSONB,
  /*
    {
      "profile_summary": "Intermediário retornando",
      "imc": 26.8,
      "imc_classification": "sobrepeso",
      "goals": {
        "primary": "Perder 8-10kg de gordura",
        "secondary": ["Ganhar 2-3kg de massa magra", "Melhorar definição abdominal"]
      },
      "timeline": "12 meses",
      "target_date": "2027-03-09",
      "weekly_plan": "4x musculação + 2x cardio",
      "quarterly_milestones": [
        {"q": 1, "goal": "Perder 3kg, criar hábito"},
        {"q": 2, "goal": "Perder mais 3kg, ganhar força"},
        {"q": 3, "goal": "Definição visível"},
        {"q": 4, "goal": "Meta final atingida"}
      ],
      "personalized_message": "Com sua experiência prévia, você tem uma vantagem..."
    }
  */
  
  -- Oferta
  recommended_offer_id UUID REFERENCES gym_offers(id),
  viewed_offer_at TIMESTAMPTZ,
  
  -- Conversão
  status VARCHAR(20) DEFAULT 'new',
  converted_at TIMESTAMPTZ,
  conversion_offer_id UUID REFERENCES gym_offers(id),
  conversion_value DECIMAL(10,2),
  
  -- Follow-up
  follow_up_stage INTEGER DEFAULT 0,
  last_follow_up_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  follow_up_notes TEXT,
  
  -- Origem
  source VARCHAR(50) DEFAULT 'qr_code',
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (
    status IN ('new', 'contacted', 'follow_up', 'negotiating', 'converted', 'lost', 'expired')
  ),
  CONSTRAINT unique_gym_whatsapp UNIQUE (gym_id, whatsapp)
);

-- Índices
CREATE INDEX idx_gym_leads_gym ON gym_leads(gym_id, created_at DESC);
CREATE INDEX idx_gym_leads_status ON gym_leads(gym_id, status);
CREATE INDEX idx_gym_leads_follow_up ON gym_leads(next_follow_up_at) 
  WHERE status IN ('new', 'contacted', 'follow_up', 'negotiating');
CREATE INDEX idx_gym_leads_whatsapp ON gym_leads(whatsapp);
```

### 3.4 Tabela: `lead_interactions`

```sql
-- Histórico de interações com leads
CREATE TABLE lead_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES gym_leads(id) ON DELETE CASCADE,
  
  -- Tipo de interação
  interaction_type VARCHAR(50) NOT NULL,
  /*
    'assessment_started', 'assessment_completed', 'diagnostic_generated',
    'offer_viewed', 'offer_clicked', 'whatsapp_sent', 'whatsapp_delivered',
    'whatsapp_read', 'whatsapp_replied', 'call_made', 'visit_scheduled',
    'visit_completed', 'converted', 'lost'
  */
  
  -- Dados da interação
  data JSONB,
  notes TEXT,
  
  -- Quem fez
  performed_by VARCHAR(50) DEFAULT 'system', -- 'system', 'user', 'admin'
  user_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_interactions_lead ON lead_interactions(lead_id, created_at DESC);
CREATE INDEX idx_lead_interactions_type ON lead_interactions(lead_id, interaction_type);
```

### 3.5 Tabela: `follow_up_templates`

```sql
-- Templates de follow-up por academia
CREATE TABLE follow_up_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  
  -- Configuração
  stage INTEGER NOT NULL, -- 0=imediato, 1=D+1, 2=D+3, 3=D+7, 4=D+14
  delay_hours INTEGER NOT NULL DEFAULT 0,
  
  -- Conteúdo
  message_template TEXT NOT NULL,
  /*
    Variáveis disponíveis:
    {{lead_name}}, {{gym_name}}, {{diagnostic_summary}}, 
    {{offer_name}}, {{offer_price}}, {{offer_link}},
    {{expiry_date}}, {{days_remaining}}
  */
  
  -- Condições
  send_if_status TEXT[] DEFAULT ARRAY['new', 'contacted', 'follow_up'],
  skip_if_replied BOOLEAN DEFAULT true,
  
  -- Tipo
  channel VARCHAR(20) DEFAULT 'whatsapp',
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_gym_stage UNIQUE (gym_id, stage)
);

-- Templates padrão serão inseridos no onboarding da academia
```

### 3.6 RLS Policies

```sql
-- Habilitar RLS
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_templates ENABLE ROW LEVEL SECURITY;

-- Policies para gyms
CREATE POLICY "Owners can manage own gym" ON gyms
  FOR ALL USING (auth.uid() = owner_user_id);

CREATE POLICY "Public can read active gyms by slug" ON gyms
  FOR SELECT USING (is_active = true);

-- Policies para gym_offers
CREATE POLICY "Gym owners can manage offers" ON gym_offers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM gyms WHERE gyms.id = gym_offers.gym_id AND gyms.owner_user_id = auth.uid())
  );

CREATE POLICY "Public can read active offers" ON gym_offers
  FOR SELECT USING (is_active = true);

-- Policies para gym_leads
CREATE POLICY "Gym owners can manage leads" ON gym_leads
  FOR ALL USING (
    EXISTS (SELECT 1 FROM gyms WHERE gyms.id = gym_leads.gym_id AND gyms.owner_user_id = auth.uid())
  );

CREATE POLICY "Leads can be created publicly" ON gym_leads
  FOR INSERT WITH CHECK (true);

-- Policies para lead_interactions
CREATE POLICY "Gym owners can view interactions" ON lead_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM gym_leads gl
      JOIN gyms g ON g.id = gl.gym_id
      WHERE gl.id = lead_interactions.lead_id AND g.owner_user_id = auth.uid()
    )
  );

-- Policies para follow_up_templates
CREATE POLICY "Gym owners can manage templates" ON follow_up_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM gyms WHERE gyms.id = follow_up_templates.gym_id AND gyms.owner_user_id = auth.uid())
  );
```

---

## 4. API Specification

### 4.1 POST /functions/v1/gym/diagnostic

**Descrição:** Processa assessment e gera diagnóstico personalizado via IA.

**Request:**
```typescript
// Headers
Content-Type: application/json

// Body
{
  "gymSlug": "academia-fit-zone",
  "leadData": {
    "name": "João Silva",
    "whatsapp": "5551999999999"
  },
  "assessment": {
    "goal": "weight_loss",           // weight_loss | muscle_gain | definition | health
    "experience": "returning",        // never | returning | less_than_year | more_than_year
    "daysPerWeek": 4,                // 2 | 3 | 4 | 5 | 6
    "mainDifficulty": "motivation",  // time | dont_know | motivation | slow_results
    "heightCm": 178,
    "weightKg": 85
  },
  "utmParams": {
    "source": "instagram",
    "medium": "story",
    "campaign": "marco2026"
  }
}
```

**Response (200):**
```typescript
{
  "success": true,
  "leadId": "uuid",
  "diagnostic": {
    "profileSummary": "Intermediário retornando",
    "profileTags": ["returning", "medium_commitment", "goal_weight_loss"],
    "imc": 26.8,
    "imcClassification": "sobrepeso",
    "imcIdeal": {
      "min": 70,
      "max": 78
    },
    "goals": {
      "primary": "Perder 8-10kg de gordura",
      "secondary": [
        "Ganhar 2-3kg de massa magra",
        "Melhorar definição abdominal",
        "Aumentar disposição e energia"
      ]
    },
    "timeline": {
      "months": 12,
      "targetDate": "2027-03-09",
      "displayDate": "Março de 2027"
    },
    "weeklyPlan": {
      "training": "4x musculação",
      "cardio": "2x cardio moderado",
      "rest": "1 dia de descanso ativo"
    },
    "quarterlyMilestones": [
      {
        "quarter": 1,
        "title": "Fundação",
        "goal": "Perder 3kg e criar o hábito",
        "metrics": ["Peso: 82kg", "Cintura: -2cm"]
      },
      {
        "quarter": 2,
        "title": "Aceleração",
        "goal": "Perder mais 3kg e ganhar força",
        "metrics": ["Peso: 79kg", "Força: +20%"]
      },
      {
        "quarter": 3,
        "title": "Definição",
        "goal": "Definição muscular visível",
        "metrics": ["Peso: 77kg", "BF%: -3%"]
      },
      {
        "quarter": 4,
        "title": "Resultado",
        "goal": "Meta final atingida",
        "metrics": ["Peso: 75kg", "Shape ideal"]
      }
    ],
    "personalizedMessage": "João, com sua experiência prévia de treino, você tem uma vantagem importante: seu corpo já conhece os movimentos e vai responder mais rápido. O segredo agora é consistência. Com 4 treinos por semana, você pode atingir sua melhor forma em 12 meses.",
    "motivationalFact": "Pessoas que treinam 4x/semana têm 73% mais chances de manter resultados a longo prazo."
  },
  "recommendedOffer": {
    "id": "uuid",
    "name": "Plano Transformação 12 Meses",
    "slug": "transformacao-12",
    "monthlyPrice": 119,
    "totalPrice": 1428,
    "totalStackValue": 4406,
    "discountPercentage": 68,
    "ctaText": "QUERO MINHA TRANSFORMAÇÃO",
    "badge": "MAIS COMPLETO"
  },
  "alternativeOffers": [
    {
      "id": "uuid",
      "name": "Plano Evolução 6 Meses",
      "slug": "evolucao-6",
      "monthlyPrice": 139,
      "totalPrice": 834
    }
  ],
  "shareUrl": "https://vitru.app/d/abc123",
  "whatsappSent": true
}
```

**Response (400):**
```typescript
{
  "success": false,
  "error": "INVALID_ASSESSMENT",
  "message": "Campo 'goal' é obrigatório"
}
```

### 4.2 GET /functions/v1/gym/offers

**Descrição:** Lista ofertas de uma academia.

**Request:**
```typescript
// Headers
Authorization: Bearer {supabase_jwt}

// Query params
?gymId={uuid}
&activeOnly=true
```

**Response (200):**
```typescript
{
  "offers": [
    {
      "id": "uuid",
      "name": "Plano Transformação 12 Meses",
      "slug": "transformacao-12",
      "description": "Seu corpo ideal em 1 ano — garantido.",
      "durationMonths": 12,
      "monthlyPrice": 119,
      "totalPrice": 1428,
      "valueStack": [
        {"item": "Acesso à academia (12 meses)", "value": 1428, "included": true},
        {"item": "Matrícula", "value": 129, "included": true},
        {"item": "Avaliação física IA (3 pilares)", "value": 297, "included": true},
        {"item": "Plano Ultra Personalizado 12 meses", "value": 497, "included": true},
        {"item": "Reavaliações trimestrais (3x)", "value": 891, "included": true},
        {"item": "Coach IA 24/7 (12 meses)", "value": 1164, "included": true}
      ],
      "totalStackValue": 4406,
      "discountPercentage": 68,
      "targetProfiles": ["all"],
      "priority": 10,
      "guaranteeDays": 30,
      "guaranteeText": "Se em 30 dias você não sentir diferença, devolvemos seu dinheiro.",
      "badge": "MAIS COMPLETO",
      "icon": "🏆",
      "ctaText": "QUERO MINHA TRANSFORMAÇÃO",
      "isActive": true
    }
    // ... outras ofertas
  ]
}
```

### 4.3 PUT /functions/v1/gym/offers/{id}

**Descrição:** Atualiza uma oferta.

**Request:**
```typescript
// Headers
Authorization: Bearer {supabase_jwt}
Content-Type: application/json

// Body (campos parciais)
{
  "monthlyPrice": 129,
  "totalPrice": 1548,
  "valueStack": [
    // array atualizado
  ],
  "badge": "PROMOÇÃO DE MARÇO"
}
```

**Response (200):**
```typescript
{
  "success": true,
  "offer": {
    // oferta atualizada completa
  }
}
```

### 4.4 GET /functions/v1/gym/leads

**Descrição:** Lista leads com filtros.

**Request:**
```typescript
// Headers
Authorization: Bearer {supabase_jwt}

// Query params
?gymId={uuid}
&status=new,contacted,follow_up
&startDate=2026-03-01
&endDate=2026-03-31
&limit=50
&offset=0
&search=joao
```

**Response (200):**
```typescript
{
  "leads": [
    {
      "id": "uuid",
      "name": "João Silva",
      "whatsapp": "5551999999999",
      "createdAt": "2026-03-09T10:30:00Z",
      "status": "follow_up",
      "assessmentData": {
        "goal": "weight_loss",
        "experience": "returning",
        "daysPerWeek": 4
      },
      "diagnosticResult": {
        "profileSummary": "Intermediário retornando",
        "goals": {
          "primary": "Perder 8-10kg de gordura"
        }
      },
      "recommendedOffer": {
        "id": "uuid",
        "name": "Plano Transformação 12 Meses",
        "monthlyPrice": 119
      },
      "followUpStage": 2,
      "lastFollowUpAt": "2026-03-10T14:00:00Z",
      "nextFollowUpAt": "2026-03-12T10:00:00Z"
    }
    // ...
  ],
  "pagination": {
    "total": 127,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  },
  "summary": {
    "new": 23,
    "contacted": 45,
    "followUp": 32,
    "negotiating": 12,
    "converted": 89,
    "lost": 34,
    "expired": 18
  }
}
```

### 4.5 GET /functions/v1/gym/analytics

**Descrição:** Métricas agregadas da academia.

**Request:**
```typescript
// Headers
Authorization: Bearer {supabase_jwt}

// Query params
?gymId={uuid}
&period=30d  // 7d, 30d, 90d, 12m, all
```

**Response (200):**
```typescript
{
  "period": {
    "start": "2026-02-07",
    "end": "2026-03-09",
    "days": 30
  },
  "funnel": {
    "qrScans": 245,
    "leadsCapured": 187,
    "assessmentsCompleted": 164,
    "offersViewed": 164,
    "conversions": 52,
    "conversionRate": 31.7
  },
  "revenue": {
    "totalContracted": 62400,
    "averageTicket": 1200,
    "byOffer": [
      {"offer": "Transformação 12m", "count": 28, "revenue": 39984},
      {"offer": "Evolução 6m", "count": 15, "revenue": 12510},
      {"offer": "Start 3m", "count": 6, "revenue": 2862},
      {"offer": "Bem-Estar 6m", "count": 3, "revenue": 1782}
    ]
  },
  "trends": {
    "leadsDaily": [
      {"date": "2026-03-01", "count": 8},
      {"date": "2026-03-02", "count": 12},
      // ...
    ],
    "conversionsDaily": [
      {"date": "2026-03-01", "count": 2},
      {"date": "2026-03-02", "count": 3},
      // ...
    ]
  },
  "topSources": [
    {"source": "qr_code", "leads": 120, "conversions": 38},
    {"source": "instagram", "leads": 45, "conversions": 10},
    {"source": "whatsapp", "leads": 22, "conversions": 4}
  ],
  "followUpEfficiency": {
    "d1ResponseRate": 45,
    "d3ResponseRate": 23,
    "d7ResponseRate": 12,
    "averageResponseTime": "4.2 hours"
  },
  "comparison": {
    "vsPreviousPeriod": {
      "leads": "+18%",
      "conversions": "+24%",
      "revenue": "+31%"
    }
  }
}
```

---

## 5. Prompt de IA para Diagnóstico

### 5.1 System Prompt

```markdown
Você é um especialista em avaliação física e prescrição de exercícios. Sua tarefa é gerar um diagnóstico fitness personalizado e motivador baseado nas respostas de um mini-assessment.

## CONTEXTO
Você está ajudando uma academia a converter visitantes em alunos. O diagnóstico deve ser:
1. PRECISO - baseado em evidências e cálculos reais
2. PERSONALIZADO - usar o nome e contexto do lead
3. MOTIVADOR - mostrar que o objetivo é alcançável
4. ESPECÍFICO - com números, datas e metas concretas
5. REALISTA - sem promessas impossíveis

## DADOS DE ENTRADA
Você receberá:
- Nome do lead
- Objetivo (weight_loss, muscle_gain, definition, health)
- Experiência (never, returning, less_than_year, more_than_year)
- Dias disponíveis por semana (2-6)
- Principal dificuldade (time, dont_know, motivation, slow_results)
- Altura (cm) e Peso (kg)
- Data atual

## CÁLCULOS OBRIGATÓRIOS

### IMC
```
IMC = peso / (altura_m)²

Classificação:
- < 18.5: Abaixo do peso
- 18.5-24.9: Peso normal
- 25-29.9: Sobrepeso
- 30-34.9: Obesidade grau 1
- 35-39.9: Obesidade grau 2
- ≥ 40: Obesidade grau 3
```

### Peso Ideal (Fórmula de Devine modificada)
```
Homem: 50 + 0.91 × (altura_cm - 152.4)
Mulher: 45.5 + 0.91 × (altura_cm - 152.4)

Range saudável: peso_ideal ± 10%
```

### Projeção de Resultados (conservadora)
```
Perda de gordura realista: 0.5-1kg/semana (média 0.7kg)
Ganho de massa magra: 0.25-0.5kg/mês para iniciantes, 0.1-0.25kg para intermediários

Fatores de ajuste:
- Experiência prévia: +20% velocidade de adaptação
- 4+ dias/semana: +15% resultados
- Iniciante absoluto: -2 semanas para adaptação inicial
```

### Timeline
```
Base: 12 meses para transformação completa
Ajustes:
- Objetivo simples (saúde): 6 meses
- Objetivo moderado (perder 5-10kg): 6-9 meses
- Objetivo ambicioso (perder 15kg+ ou ganho significativo): 12 meses
- Objetivo de definição avançada: 12 meses
```

## REGRAS DE PERSONALIZAÇÃO

### Por Experiência
- **Nunca treinou**: Foco em "começar do zero", "primeiros passos", "criar o hábito"
- **Retornando**: Foco em "memória muscular", "seu corpo já conhece", "voltar ainda mais forte"
- **Menos de 1 ano**: Foco em "consistência", "próximo nível", "otimizar"
- **Mais de 1 ano**: Foco em "sair do platô", "ajuste fino", "performance"

### Por Dificuldade
- **Falta de tempo**: Mencionar eficiência, treinos otimizados, qualidade > quantidade
- **Não sabe o que fazer**: Mencionar plano personalizado, acompanhamento, passo a passo
- **Motivação**: Mencionar comunidade, metas pequenas, celebrar vitórias
- **Resultados lentos**: Mencionar ciência, ajustes, medição correta de progresso

### Por Objetivo
- **Emagrecer**: Foco em perda de gordura (não peso), medidas, energia
- **Ganhar massa**: Foco em hipertrofia, força, alimentação
- **Definir**: Foco em composição corporal, BF%, estética
- **Saúde**: Foco em disposição, qualidade de vida, longevidade

## FORMATO DE RESPOSTA

Responda APENAS em JSON válido:

```json
{
  "profileSummary": "string (máx 50 chars)",
  "profileTags": ["string"],
  "imc": number,
  "imcClassification": "string",
  "imcIdeal": {
    "min": number,
    "max": number
  },
  "goals": {
    "primary": "string (meta principal específica com números)",
    "secondary": ["string", "string", "string"]
  },
  "timeline": {
    "months": number,
    "targetDate": "YYYY-MM-DD",
    "displayDate": "Mês de Ano"
  },
  "weeklyPlan": {
    "training": "string",
    "cardio": "string",
    "rest": "string"
  },
  "quarterlyMilestones": [
    {
      "quarter": 1,
      "title": "string (1 palavra)",
      "goal": "string",
      "metrics": ["string", "string"]
    }
  ],
  "personalizedMessage": "string (3-4 frases usando o nome do lead, motivacional e específico)",
  "motivationalFact": "string (fato científico relevante)"
}
```

## RESTRIÇÕES
- Não faça promessas de tempo irreais (ex: "perder 20kg em 1 mês")
- Não mencione suplementos ou dietas específicas
- Não faça diagnósticos médicos
- Sempre use linguagem positiva e motivadora
- Mantenha as metas ambiciosas mas alcançáveis
```

### 5.2 User Prompt Template

```markdown
Gere o diagnóstico fitness para:

**Lead:** {{lead_name}}
**Data atual:** {{current_date}}

**Assessment:**
- Objetivo: {{goal}}
- Experiência: {{experience}}
- Dias disponíveis/semana: {{days_per_week}}
- Principal dificuldade: {{main_difficulty}}
- Altura: {{height_cm}} cm
- Peso: {{weight_kg}} kg

Calcule IMC, projete resultados realistas e gere um diagnóstico personalizado e motivador.
```

### 5.3 Exemplo de Output

```json
{
  "profileSummary": "Intermediário retornando",
  "profileTags": ["returning", "medium_commitment", "goal_weight_loss"],
  "imc": 26.8,
  "imcClassification": "sobrepeso",
  "imcIdeal": {
    "min": 70,
    "max": 78
  },
  "goals": {
    "primary": "Perder 8-10kg de gordura corporal",
    "secondary": [
      "Ganhar 2-3kg de massa magra",
      "Reduzir 6-8cm de cintura",
      "Aumentar disposição e energia diária"
    ]
  },
  "timeline": {
    "months": 12,
    "targetDate": "2027-03-09",
    "displayDate": "Março de 2027"
  },
  "weeklyPlan": {
    "training": "4x musculação (A/B/C/D)",
    "cardio": "2x cardio moderado (30min)",
    "rest": "1 dia de descanso ativo ou alongamento"
  },
  "quarterlyMilestones": [
    {
      "quarter": 1,
      "title": "Fundação",
      "goal": "Perder 3kg e criar o hábito consistente",
      "metrics": ["Peso: 82kg", "Cintura: -2cm"]
    },
    {
      "quarter": 2,
      "title": "Aceleração",
      "goal": "Perder mais 3kg e aumentar cargas",
      "metrics": ["Peso: 79kg", "Força: +20%"]
    },
    {
      "quarter": 3,
      "title": "Definição",
      "goal": "Definição muscular começando a aparecer",
      "metrics": ["Peso: 77kg", "BF%: -3%"]
    },
    {
      "quarter": 4,
      "title": "Resultado",
      "goal": "Meta final atingida, manutenção",
      "metrics": ["Peso: 75kg", "Shape ideal"]
    }
  ],
  "personalizedMessage": "João, você tem uma vantagem importante: seu corpo já conhece os movimentos e vai responder mais rápido graças à memória muscular. Com 4 treinos por semana e foco na consistência, você pode atingir sua melhor forma em 12 meses. O segredo não é intensidade máxima todo dia — é aparecer e fazer o básico bem feito.",
  "motivationalFact": "Estudos mostram que pessoas que treinam 4x/semana têm 73% mais chances de manter os resultados a longo prazo do que quem treina esporadicamente."
}
```

---

## 6. Configurador de Ofertas

### 6.1 Estrutura do Componente

```typescript
// src/features/gym-admin/components/OfferConfigurator/index.tsx

interface OfferConfiguratorProps {
  gymId: string;
  offer?: GymOffer; // undefined = nova oferta
  onSave: (offer: GymOffer) => void;
  onCancel: () => void;
}

interface GymOffer {
  id?: string;
  name: string;
  slug: string;
  description: string;
  durationMonths: number;
  monthlyPrice: number;
  totalPrice: number;
  valueStack: ValueStackItem[];
  totalStackValue: number;
  targetProfiles: string[];
  priority: number;
  guaranteeDays: number;
  guaranteeText: string;
  badge?: string;
  icon: string;
  ctaText: string;
  isActive: boolean;
}

interface ValueStackItem {
  id: string;
  item: string;
  value: number;
  included: boolean;
  description?: string;
}
```

### 6.2 UI do Configurador

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CONFIGURADOR DE OFERTA                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ INFORMAÇÕES BÁSICAS ─────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Nome da Oferta *                    Slug (URL)                       │  │
│  │  ┌────────────────────────────────┐  ┌──────────────────────────────┐ │  │
│  │  │ Plano Transformação 12 Meses   │  │ transformacao-12             │ │  │
│  │  └────────────────────────────────┘  └──────────────────────────────┘ │  │
│  │                                                                        │  │
│  │  Descrição curta                                                      │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Seu corpo ideal em 1 ano — garantido.                          │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  Ícone      Badge (opcional)                                          │  │
│  │  ┌──────┐   ┌────────────────────────────────────────┐               │  │
│  │  │ 🏆 ▼│   │ MAIS COMPLETO                          │               │  │
│  │  └──────┘   └────────────────────────────────────────┘               │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ PREÇOS ──────────────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Duração              Mensalidade           Total                     │  │
│  │  ┌──────────────┐    ┌──────────────┐      ┌──────────────────┐      │  │
│  │  │ 12 ▼│ meses  │    │ R$ 119,00    │      │ R$ 1.428,00      │      │  │
│  │  └──────────────┘    └──────────────┘      └──────────────────┘      │  │
│  │                                             (calculado automaticamente)│  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ STACK DE VALOR ──────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Itens incluídos na oferta (arraste para reordenar)                   │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ ≡ │ ✓ │ Acesso à academia (12 meses)           │ R$ 1.428,00 │ 🗑 │  │
│  │  ├────────────────────────────────────────────────────────────────┤  │  │
│  │  │ ≡ │ ✓ │ Matrícula                              │ R$   129,00 │ 🗑 │  │
│  │  ├────────────────────────────────────────────────────────────────┤  │  │
│  │  │ ≡ │ ✓ │ Avaliação física IA (3 pilares)        │ R$   297,00 │ 🗑 │  │
│  │  ├────────────────────────────────────────────────────────────────┤  │  │
│  │  │ ≡ │ ✓ │ Plano Ultra Personalizado 12 meses     │ R$   497,00 │ 🗑 │  │
│  │  ├────────────────────────────────────────────────────────────────┤  │  │
│  │  │ ≡ │ ✓ │ Reavaliações trimestrais (3x)          │ R$   891,00 │ 🗑 │  │
│  │  ├────────────────────────────────────────────────────────────────┤  │  │
│  │  │ ≡ │ ✓ │ Coach IA 24/7 (12 meses)               │ R$ 1.164,00 │ 🗑 │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  [ + Adicionar item ao stack ]                                        │  │
│  │                                                                        │  │
│  │  ─────────────────────────────────────────────────────────────────── │  │
│  │                                                                        │  │
│  │  Valor total do stack:  R$ 4.406,00                                   │  │
│  │  Preço da oferta:       R$ 1.428,00                                   │  │
│  │  Desconto percebido:    68% (R$ 2.978,00 de economia)                 │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ GARANTIA ────────────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Dias de garantia                                                     │  │
│  │  ┌──────────────┐                                                     │  │
│  │  │ 30           │ dias                                                │  │
│  │  └──────────────┘                                                     │  │
│  │                                                                        │  │
│  │  Texto da garantia                                                    │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Se em 30 dias você não sentir diferença, devolvemos seu        │  │  │
│  │  │ dinheiro. Sem perguntas.                                       │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ SEGMENTAÇÃO ─────────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Mostrar esta oferta para:                                            │  │
│  │                                                                        │  │
│  │  Experiência:                  Comprometimento:                       │  │
│  │  ☑ Todos                       ☑ Todos                                │  │
│  │  ☐ Iniciante                   ☐ Baixo (2-3 dias)                     │  │
│  │  ☐ Retornando                  ☐ Médio (4 dias)                       │  │
│  │  ☐ Menos de 1 ano              ☐ Alto (5+ dias)                       │  │
│  │  ☐ Mais de 1 ano                                                      │  │
│  │                                                                        │  │
│  │  Objetivo:                     Prioridade:                            │  │
│  │  ☑ Todos                       ┌──────────────┐                       │  │
│  │  ☐ Emagrecer                   │ 10           │ (maior = aparece      │  │
│  │  ☐ Ganhar massa                └──────────────┘  primeiro)            │  │
│  │  ☐ Definir                                                            │  │
│  │  ☐ Saúde                                                              │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ CALL TO ACTION ──────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  Texto do botão                                                       │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │ QUERO MINHA TRANSFORMAÇÃO                                      │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─ PREVIEW ─────────────────────────────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  [===================PREVIEW DA OFERTA===================]            │  │
│  │  │                                                       │            │  │
│  │  │  🏆 MAIS COMPLETO                                     │            │  │
│  │  │                                                       │            │  │
│  │  │  PLANO TRANSFORMAÇÃO 12 MESES                         │            │  │
│  │  │  Seu corpo ideal em 1 ano — garantido.                │            │  │
│  │  │                                                       │            │  │
│  │  │  ✓ Acesso à academia (12 meses)......... ZERO         │            │  │
│  │  │  ✓ Matrícula............................ ZERO         │            │  │
│  │  │  ✓ Avaliação física IA.................. ZERO         │            │  │
│  │  │  ✓ Plano Ultra Personalizado............ ZERO         │            │  │
│  │  │  ✓ Reavaliações trimestrais (3x)........ ZERO         │            │  │
│  │  │  ✓ Coach IA 24/7....................... ZERO          │            │  │
│  │  │                                                       │            │  │
│  │  │  Valor: R$ 4.406    Você paga: 12x R$ 119             │            │  │
│  │  │  Economia: R$ 2.978 (68%)                             │            │  │
│  │  │                                                       │            │  │
│  │  │  🛡️ Garantia de 30 dias                               │            │  │
│  │  │                                                       │            │  │
│  │  │  [ QUERO MINHA TRANSFORMAÇÃO ]                        │            │  │
│  │  │                                                       │            │  │
│  │  [=======================================================]            │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ☑ Oferta ativa                                                             │
│                                                                              │
│                              [ Cancelar ]  [ Salvar Oferta ]                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Componente React

```tsx
// src/features/gym-admin/components/OfferConfigurator/index.tsx

import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  GripVertical, Trash2, Plus, Shield, Eye, 
  DollarSign, Target, Zap 
} from 'lucide-react';

interface ValueStackItem {
  id: string;
  item: string;
  value: number;
  included: boolean;
}

interface OfferForm {
  name: string;
  slug: string;
  description: string;
  durationMonths: number;
  monthlyPrice: number;
  valueStack: ValueStackItem[];
  guaranteeDays: number;
  guaranteeText: string;
  targetProfiles: string[];
  priority: number;
  badge: string;
  icon: string;
  ctaText: string;
  isActive: boolean;
}

const DEFAULT_STACK_ITEMS: ValueStackItem[] = [
  { id: '1', item: 'Acesso à academia', value: 0, included: true },
  { id: '2', item: 'Matrícula', value: 129, included: true },
  { id: '3', item: 'Avaliação física IA (3 pilares)', value: 297, included: true },
  { id: '4', item: 'Plano personalizado de treino', value: 297, included: true },
  { id: '5', item: 'Coach IA 24/7', value: 97, included: true },
];

const ICONS = ['🏆', '⚡', '🚀', '🎯', '💪', '🔥', '⭐', '🧘'];

const PROFILE_OPTIONS = {
  experience: [
    { value: 'beginner', label: 'Iniciante' },
    { value: 'returning', label: 'Retornando' },
    { value: 'less_than_year', label: 'Menos de 1 ano' },
    { value: 'more_than_year', label: 'Mais de 1 ano' },
  ],
  commitment: [
    { value: 'low_commitment', label: 'Baixo (2-3 dias)' },
    { value: 'medium_commitment', label: 'Médio (4 dias)' },
    { value: 'high_commitment', label: 'Alto (5+ dias)' },
  ],
  goal: [
    { value: 'goal_weight_loss', label: 'Emagrecer' },
    { value: 'goal_muscle_gain', label: 'Ganhar massa' },
    { value: 'goal_definition', label: 'Definir' },
    { value: 'goal_health', label: 'Saúde' },
  ],
};

export const OfferConfigurator: React.FC<{
  gymId: string;
  initialData?: Partial<OfferForm>;
  onSave: (data: OfferForm) => Promise<void>;
  onCancel: () => void;
}> = ({ gymId, initialData, onSave, onCancel }) => {
  const [form, setForm] = useState<OfferForm>({
    name: '',
    slug: '',
    description: '',
    durationMonths: 12,
    monthlyPrice: 119,
    valueStack: DEFAULT_STACK_ITEMS,
    guaranteeDays: 30,
    guaranteeText: 'Se em 30 dias você não sentir diferença, devolvemos seu dinheiro.',
    targetProfiles: ['all'],
    priority: 0,
    badge: '',
    icon: '🏆',
    ctaText: 'QUERO COMEÇAR',
    isActive: true,
    ...initialData,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Cálculos automáticos
  const calculations = useMemo(() => {
    const accessValue = form.monthlyPrice * form.durationMonths;
    
    // Atualizar valor do acesso no stack
    const updatedStack = form.valueStack.map(item => 
      item.item.toLowerCase().includes('acesso') 
        ? { ...item, value: accessValue }
        : item
    );

    const totalStackValue = updatedStack
      .filter(i => i.included)
      .reduce((sum, i) => sum + i.value, 0);

    const totalPrice = form.monthlyPrice * form.durationMonths;
    const discount = totalStackValue > 0 
      ? Math.round((1 - totalPrice / totalStackValue) * 100) 
      : 0;
    const savings = totalStackValue - totalPrice;

    return {
      totalPrice,
      totalStackValue,
      discount,
      savings,
      updatedStack,
    };
  }, [form.monthlyPrice, form.durationMonths, form.valueStack]);

  // Handlers
  const updateField = <K extends keyof OfferForm>(
    field: K, 
    value: OfferForm[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    updateField('name', name);
    if (!initialData?.slug) {
      updateField('slug', generateSlug(name));
    }
  };

  const addStackItem = () => {
    const newItem: ValueStackItem = {
      id: Date.now().toString(),
      item: 'Novo item',
      value: 0,
      included: true,
    };
    updateField('valueStack', [...form.valueStack, newItem]);
  };

  const updateStackItem = (id: string, updates: Partial<ValueStackItem>) => {
    updateField(
      'valueStack',
      form.valueStack.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeStackItem = (id: string) => {
    updateField(
      'valueStack',
      form.valueStack.filter(item => item.id !== id)
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(form.valueStack);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    updateField('valueStack', items);
  };

  const toggleProfile = (profile: string) => {
    if (profile === 'all') {
      updateField('targetProfiles', ['all']);
      return;
    }

    let newProfiles = form.targetProfiles.filter(p => p !== 'all');
    
    if (newProfiles.includes(profile)) {
      newProfiles = newProfiles.filter(p => p !== profile);
    } else {
      newProfiles.push(profile);
    }

    if (newProfiles.length === 0) {
      newProfiles = ['all'];
    }

    updateField('targetProfiles', newProfiles);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...form,
        valueStack: calculations.updatedStack,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? 'Editar Oferta' : 'Nova Oferta'}
        </h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 
                     rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? 'Esconder' : 'Ver'} Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="space-y-6">
          {/* Informações Básicas */}
          <section className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Informações Básicas
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Oferta *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleNameChange(e.target.value)}
                  placeholder="Plano Transformação 12 Meses"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                           focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => updateField('slug', e.target.value)}
                  placeholder="transformacao-12"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                           focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição curta
              </label>
              <input
                type="text"
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Seu corpo ideal em 1 ano — garantido."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                         focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ícone
                </label>
                <div className="flex gap-1">
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => updateField('icon', icon)}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors
                        ${form.icon === icon 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge (opcional)
                </label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={e => updateField('badge', e.target.value)}
                  placeholder="MAIS COMPLETO"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                           focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* Preços */}
          <section className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Preços
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração
                </label>
                <select
                  value={form.durationMonths}
                  onChange={e => updateField('durationMonths', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                           focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {[1, 3, 6, 12, 18, 24].map(m => (
                    <option key={m} value={m}>{m} {m === 1 ? 'mês' : 'meses'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mensalidade
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    value={form.monthlyPrice}
                    onChange={e => updateField('monthlyPrice', Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 
                             focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
                  R$ {calculations.totalPrice.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </section>

          {/* Stack de Valor */}
          <section className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              Stack de Valor
            </h2>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="stack">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {form.valueStack.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-2 p-3 bg-gray-50 
                                     rounded-lg border"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </div>
                            
                            <input
                              type="checkbox"
                              checked={item.included}
                              onChange={e => updateStackItem(item.id, { 
                                included: e.target.checked 
                              })}
                              className="w-4 h-4 text-emerald-600 rounded"
                            />
                            
                            <input
                              type="text"
                              value={item.item}
                              onChange={e => updateStackItem(item.id, { 
                                item: e.target.value 
                              })}
                              className="flex-1 px-2 py-1 border rounded 
                                       focus:ring-1 focus:ring-emerald-500"
                            />
                            
                            <div className="relative w-32">
                              <span className="absolute left-2 top-1/2 
                                             -translate-y-1/2 text-gray-500 text-sm">
                                R$
                              </span>
                              <input
                                type="number"
                                value={item.value}
                                onChange={e => updateStackItem(item.id, { 
                                  value: Number(e.target.value) 
                                })}
                                disabled={item.item.toLowerCase().includes('acesso')}
                                className="w-full pl-8 pr-2 py-1 border rounded 
                                         focus:ring-1 focus:ring-emerald-500
                                         disabled:bg-gray-100 disabled:text-gray-500"
                              />
                            </div>
                            
                            <button
                              onClick={() => removeStackItem(item.id)}
                              className="p-1 text-gray-400 hover:text-red-500 
                                       transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <button
              onClick={addStackItem}
              className="flex items-center gap-2 text-sm text-emerald-600 
                       hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />
              Adicionar item ao stack
            </button>

            {/* Resumo */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valor total do stack:</span>
                <span className="font-medium">
                  R$ {calculations.totalStackValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Preço da oferta:</span>
                <span className="font-medium">
                  R$ {calculations.totalPrice.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Desconto percebido:</span>
                <span className="font-bold text-emerald-600">
                  {calculations.discount}% 
                  (R$ {calculations.savings.toLocaleString('pt-BR')} de economia)
                </span>
              </div>
            </div>
          </section>

          {/* Garantia */}
          <section className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Garantia
            </h2>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dias
                </label>
                <input
                  type="number"
                  value={form.guaranteeDays}
                  onChange={e => updateField('guaranteeDays', Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                           focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto da garantia
                </label>
                <textarea
                  value={form.guaranteeText}
                  onChange={e => updateField('guaranteeText', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                           focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Call to Action</h2>
            <input
              type="text"
              value={form.ctaText}
              onChange={e => updateField('ctaText', e.target.value)}
              placeholder="QUERO COMEÇAR"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 
                       focus:ring-emerald-500 focus:border-emerald-500"
            />
          </section>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 h-fit">
            <OfferPreview
              offer={{
                ...form,
                totalPrice: calculations.totalPrice,
                totalStackValue: calculations.totalStackValue,
                discountPercentage: calculations.discount,
                valueStack: calculations.updatedStack,
              }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={e => updateField('isActive', e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded"
          />
          <span className="text-sm text-gray-700">Oferta ativa</span>
        </label>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg 
                     hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !form.name || !form.slug}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg 
                     hover:bg-emerald-700 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Salvando...' : 'Salvar Oferta'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Preview
const OfferPreview: React.FC<{ offer: any }> = ({ offer }) => {
  return (
    <div className="bg-gray-900 text-white rounded-2xl p-6 space-y-6">
      {offer.badge && (
        <div className="inline-block px-3 py-1 bg-emerald-500 text-sm 
                      font-bold rounded-full">
          {offer.badge}
        </div>
      )}

      <div>
        <div className="text-3xl mb-1">{offer.icon}</div>
        <h3 className="text-xl font-bold">{offer.name || 'Nome da Oferta'}</h3>
        <p className="text-gray-400">{offer.description || 'Descrição da oferta'}</p>
      </div>

      <div className="space-y-2">
        {offer.valueStack
          .filter((i: ValueStackItem) => i.included)
          .map((item: ValueStackItem) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-300">✓ {item.item}</span>
              <span className="text-emerald-400 font-medium">ZERO</span>
            </div>
          ))}
      </div>

      <div className="pt-4 border-t border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Valor:</span>
          <span>R$ {offer.totalStackValue?.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex justify-between items-baseline mt-2">
          <span className="text-gray-400">Você paga:</span>
          <span className="text-2xl font-bold">
            {offer.durationMonths}x R$ {offer.monthlyPrice}
          </span>
        </div>
        <div className="text-emerald-400 text-sm mt-1">
          Economia: R$ {(offer.totalStackValue - offer.totalPrice)?.toLocaleString('pt-BR')} 
          ({offer.discountPercentage}%)
        </div>
      </div>

      {offer.guaranteeDays > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Shield className="w-4 h-4" />
          Garantia de {offer.guaranteeDays} dias
        </div>
      )}

      <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 
                       text-white font-bold rounded-xl transition-colors">
        {offer.ctaText || 'QUERO COMEÇAR'}
      </button>
    </div>
  );
};
```

---

## 7. Templates de Follow-up Padrão

### 7.1 D+0 (Imediato)

```
Olá {{lead_name}}! 👋

Seu diagnóstico fitness está pronto! 🎯

📊 *Seu perfil:* {{diagnostic_summary}}

🎯 *Sua meta:* {{goals_primary}}

📅 *Previsão:* {{timeline_display_date}}

Vi que o *{{offer_name}}* é perfeito pra você:
✅ {{offer_stack_count}} benefícios inclusos
✅ Economia de {{offer_discount}}%
✅ Garantia de {{offer_guarantee_days}} dias

👉 Veja sua oferta exclusiva: {{offer_link}}

⏰ *Essa condição é válida só por 48h!*

Qualquer dúvida, me chama aqui!
```

### 7.2 D+1

```
E aí {{lead_name}}, tudo bem? 😊

Vi que você fez o diagnóstico ontem e queria saber:

*Ficou alguma dúvida sobre o {{offer_name}}?*

Lembra que você tem:
• Garantia de {{offer_guarantee_days}} dias
• Pode cancelar se não gostar
• Começa a ver resultados em 21 dias

👉 {{offer_link}}

Posso te ajudar com algo?
```

### 7.3 D+3

```
{{lead_name}}, última chance! ⏰

Sua oferta exclusiva do *{{offer_name}}* expira amanhã.

Depois disso, o preço volta ao normal e você perde:
❌ R$ {{offer_savings}} de economia
❌ {{offer_stack_count}} benefícios inclusos

Não deixa passar! 👇
{{offer_link}}
```

### 7.4 D+7 (Downsell)

```
Oi {{lead_name}}! 

Sei que às vezes um compromisso de {{offer_duration}} meses parece muito.

Que tal começar menor?

Temos o *Plano Start de 3 meses* por apenas R$ 159/mês:
✅ Todos os benefícios básicos
✅ Sem compromisso longo
✅ Pode migrar depois

Quer saber mais? Me chama aqui! 👇
```

---

## 8. Lógica de Seleção de Oferta

### 8.1 Algoritmo de Matching

```typescript
// src/features/gym-admin/services/offerMatcher.ts

interface AssessmentData {
  goal: 'weight_loss' | 'muscle_gain' | 'definition' | 'health';
  experience: 'never' | 'returning' | 'less_than_year' | 'more_than_year';
  daysPerWeek: number;
  mainDifficulty: 'time' | 'dont_know' | 'motivation' | 'slow_results';
  heightCm: number;
  weightKg: number;
}

interface GymOffer {
  id: string;
  targetProfiles: string[];
  priority: number;
  // ... outros campos
}

export function selectBestOffer(
  assessment: AssessmentData,
  offers: GymOffer[]
): { recommended: GymOffer; alternatives: GymOffer[] } {
  // Gerar tags do perfil
  const profileTags = generateProfileTags(assessment);

  // Filtrar ofertas ativas que match com o perfil
  const matchingOffers = offers
    .filter(offer => offer.isActive)
    .filter(offer => {
      if (offer.targetProfiles.includes('all')) return true;
      return offer.targetProfiles.some(tag => profileTags.includes(tag));
    })
    .sort((a, b) => {
      // Ordenar por: match score > priority
      const scoreA = calculateMatchScore(profileTags, a.targetProfiles);
      const scoreB = calculateMatchScore(profileTags, b.targetProfiles);
      
      if (scoreA !== scoreB) return scoreB - scoreA;
      return b.priority - a.priority;
    });

  if (matchingOffers.length === 0) {
    throw new Error('No matching offers found');
  }

  return {
    recommended: matchingOffers[0],
    alternatives: matchingOffers.slice(1, 3),
  };
}

function generateProfileTags(assessment: AssessmentData): string[] {
  const tags: string[] = [];

  // Experiência
  switch (assessment.experience) {
    case 'never':
      tags.push('beginner');
      break;
    case 'returning':
      tags.push('returning');
      break;
    case 'less_than_year':
      tags.push('intermediate');
      break;
    case 'more_than_year':
      tags.push('experienced');
      break;
  }

  // Comprometimento
  if (assessment.daysPerWeek <= 3) {
    tags.push('low_commitment');
  } else if (assessment.daysPerWeek === 4) {
    tags.push('medium_commitment');
  } else {
    tags.push('high_commitment');
  }

  // Objetivo
  tags.push(`goal_${assessment.goal}`);

  // Combinações especiais
  if (assessment.experience === 'never' && assessment.daysPerWeek <= 3) {
    tags.push('cautious_starter');
  }

  if (
    (assessment.experience === 'returning' || assessment.experience === 'more_than_year') &&
    assessment.daysPerWeek >= 4
  ) {
    tags.push('committed_returner');
  }

  if (assessment.goal === 'health') {
    tags.push('wellness_focused');
  }

  return tags;
}

function calculateMatchScore(
  profileTags: string[],
  offerTargets: string[]
): number {
  if (offerTargets.includes('all')) return 1;
  
  const matches = offerTargets.filter(tag => profileTags.includes(tag)).length;
  return matches / offerTargets.length;
}
```

### 8.2 Matriz de Decisão

| Perfil | Tags Geradas | Oferta Padrão |
|--------|--------------|---------------|
| Nunca treinou + 2-3 dias | `beginner`, `low_commitment`, `cautious_starter` | Start 3 meses |
| Nunca treinou + 4+ dias | `beginner`, `medium/high_commitment` | Evolução 6 meses |
| Retornando + qualquer | `returning`, `*_commitment` | Transformação 12 meses |
| +1 ano + 4+ dias | `experienced`, `high_commitment`, `committed_returner` | Transformação 12 meses |
| Qualquer + Saúde | `*`, `goal_health`, `wellness_focused` | Bem-Estar 6 meses |

---

## 9. Plano de Implementação

### 9.1 Fases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ROADMAP DE IMPLEMENTAÇÃO                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FASE 1: Core Backend (1 semana)                                            │
│  ├─ [ ] Migrations SQL (gyms, offers, leads, interactions)                  │
│  ├─ [ ] RLS Policies                                                        │
│  ├─ [ ] Edge Function: /gym/diagnostic                                      │
│  ├─ [ ] Integração Gemini para diagnóstico                                  │
│  └─ [ ] Testes unitários                                                    │
│                                                                              │
│  FASE 2: Dashboard Academia (2 semanas)                                     │
│  ├─ [ ] Onboarding de academia                                              │
│  ├─ [ ] Configurador de ofertas                                             │
│  ├─ [ ] Lista de leads + CRM básico                                         │
│  ├─ [ ] Métricas e analytics                                                │
│  └─ [ ] Gerador de QR Code                                                  │
│                                                                              │
│  FASE 3: Fluxo do Lead (1 semana)                                           │
│  ├─ [ ] Landing page dinâmica (/start/{slug})                               │
│  ├─ [ ] Mini-assessment                                                     │
│  ├─ [ ] Tela de diagnóstico                                                 │
│  ├─ [ ] Tela de oferta                                                      │
│  └─ [ ] Integração WhatsApp (envio do diagnóstico)                          │
│                                                                              │
│  FASE 4: Automações (1 semana)                                              │
│  ├─ [ ] Sistema de follow-up automático                                     │
│  ├─ [ ] Templates editáveis                                                 │
│  ├─ [ ] Webhooks de eventos                                                 │
│  └─ [ ] Notificações para academia                                          │
│                                                                              │
│  FASE 5: Polish (1 semana)                                                  │
│  ├─ [ ] Otimização mobile                                                   │
│  ├─ [ ] Testes E2E                                                          │
│  ├─ [ ] Documentação                                                        │
│  └─ [ ] Onboarding de academia piloto                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Timeline total: ~6 semanas
```

---

## 10. Considerações Finais

### 10.1 Integrações Futuras

| Integração | Prioridade | Descrição |
|------------|------------|-----------|
| WhatsApp Business API | Alta | Mensagens em escala |
| Stripe/Pagar.me | Alta | Pagamento direto no link |
| Google Analytics | Média | Tracking avançado |
| Zapier | Média | Automações customizadas |
| CRM existente (RD Station, Pipedrive) | Baixa | Exportação de leads |

### 10.2 Métricas de Sucesso

| Métrica | Target | Medição |
|---------|--------|---------|
| Taxa de captura (QR → Lead) | >70% | Analytics |
| Taxa de conversão (Lead → Matrícula) | >25% | CRM |
| Tempo médio de conversão | <7 dias | CRM |
| NPS da academia | >60 | Survey |
| Churn de academias | <5%/mês | Billing |

---

**Documento gerado em:** 2026-03-09  
**Próxima revisão:** Após conclusão da Fase 1