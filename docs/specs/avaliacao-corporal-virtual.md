# SPEC: Avaliação Corporal Virtual por IA
## VITRU IA - Estimativa de Medidas via Visão Computacional

**Versão:** 2.0.0  
**Data:** 2026-03-09  
**Autor:** Leonardo Schweitzer  
**Status:** Aprovado para Implementação  
**Módulo:** `virtual-assessment`

---

## 1. Visão Geral

### 1.1 Problema

Personal trainers online não conseguem medir alunos remotos. Alternativas atuais (auto-medição, estimativa visual) são imprecisas ou inviáveis.

### 1.2 Solução

Estimativa de medidas corporais por análise de **4 fotos** usando IA (Gemini Vision), integrada ao fluxo existente de `medidas` → `avaliacoes` do VITRU IA.

### 1.3 Decisão Arquitetural

> **INSERT na tabela `medidas` existente** com `registrado_por = 'IA_VISION'`.
> Isso reutiliza automaticamente toda a engine de cálculos (scores, proporções, simetria, diagnóstico).
> **NÃO** criar tabela `body_assessments` separada.

---

## 2. Protocolo de Captura: 4 Fotos

### 2.1 Poses Obrigatórias

| # | Pose | O que estima | Imagem |
|---|---|---|---|
| 1 | **Frontal** | Ombros, peitoral, cintura, quadril, abdômen, pescoço | Frente completa |
| 2 | **Costas** | Costas, ombros (validação), cintura (validação) | Costas completa |
| 3 | **Lateral Esquerda** | Braço E, antebraço E, coxa E, panturrilha E | Lado esquerdo |
| 4 | **Lateral Direita** | Braço D, antebraço D, coxa D, panturrilha D | Lado direito |

### 2.2 Vestuário

- **Homens**: sunga
- **Mulheres**: biquíni

### 2.3 Instruções para o Atleta

- ✅ Braços levemente afastados do corpo (~15°)
- ✅ Pés na largura dos ombros
- ✅ Ambiente bem iluminado, fundo neutro
- ✅ Objeto de referência no chão (cartão crédito, folha A4 ou fita métrica)
- ✅ Corpo inteiro visível (pés à cabeça)
- ❌ Não usar roupas largas
- ❌ Não flexionar músculos

---

## 3. Mapeamento IA → Tabela `medidas`

| Estimativa Gemini | Campo `medidas` | Fonte principal |
|---|---|---|
| `shoulders` | `ombros` | Frontal + Costas |
| `chest` | `peitoral` | Frontal |
| `waist` | `cintura` | Frontal + Costas |
| `hips` | `quadril` | Frontal |
| `abdomen` | `abdomen` | Frontal |
| `neck` | `pescoco` | Frontal |
| `armLeft` | `braco_esquerdo` | Lateral Esquerda |
| `armRight` | `braco_direito` | Lateral Direita |
| `forearmLeft` | `antebraco_esquerdo` | Lateral Esquerda |
| `forearmRight` | `antebraco_direito` | Lateral Direita |
| `thighLeft` | `coxa_esquerda` | Lateral Esquerda |
| `thighRight` | `coxa_direita` | Lateral Direita |
| `calfLeft` | `panturrilha_esquerda` | Lateral Esquerda |
| `calfRight` | `panturrilha_direita` | Lateral Direita |
| `bodyFatPercentage` | `gordura_corporal` | Frontal + Laterais |
| `weight` (input) | `peso` | Informado pelo atleta |

---

## 4. Arquitetura Técnica

### 4.1 Fluxo de Dados

```
Portal do Atleta
  └─ Wizard Upload (4 fotos + peso + referência)
       └─ Compressão client-side (Canvas API, max 1200px)
            └─ Edge Function: analyze-body
                 ├─ Upload fotos → bucket body-assessment-photos
                 ├─ Gemini Vision API (4 imagens + prompt)
                 ├─ Parse JSON → mapeamento para campos medidas
                 ├─ INSERT medidas (registrado_por = 'IA_VISION')
                 └─ INSERT medidas_ia_metadata (confiança, notas)
                      └─ Engine de cálculos existente
                           └─ AssessmentScreen (Score, Proporções, Simetria, Diagnóstico)
```

### 4.2 Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React + TypeScript (stack atual) |
| Upload | `<input type="file" accept="image/*" capture>` |
| Compressão | Canvas API (client-side) |
| Backend | Supabase Edge Function (Deno) |
| Vision AI | Gemini 2.0 Flash (API key já configurada) |
| Database | Supabase PostgreSQL (tabela `medidas` existente) |
| Storage | Supabase Storage (bucket privado) |

### 4.3 Estrutura de Arquivos (patterns existentes)

```
src/
├── components/organisms/
│   └── VirtualAssessmentWizard/
│       ├── VirtualAssessmentWizard.tsx    # Container principal
│       ├── StepDadosBasicos.tsx           # Step 1: peso + referência
│       ├── StepUploadFotos.tsx            # Step 2: 4 uploads
│       ├── StepRevisao.tsx               # Step 3: preview
│       ├── StepResultado.tsx             # Step 4: resultado + confiança
│       ├── InstrucoesCaptura.tsx          # Instruções visuais
│       ├── ConfidenceBadge.tsx            # Badge Alta/Média/Baixa
│       └── index.ts                      # Barrel export
├── services/
│   └── virtualAssessment.service.ts      # Service p/ Edge Function
supabase/
├── functions/
│   └── analyze-body/
│       └── index.ts                      # Edge Function Gemini Vision
└── migrations/
    └── add-ia-vision-support.sql         # Migration
```

---

## 5. Schema do Banco de Dados

### 5.1 Alteração na tabela `medidas`

```sql
-- Expandir registrado_por com novo valor
ALTER TABLE medidas ALTER COLUMN registrado_por TYPE VARCHAR(20);
-- Permitir: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP' | 'IA_VISION'
```

### 5.2 Nova tabela: `medidas_ia_metadata`

```sql
CREATE TABLE medidas_ia_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medida_id UUID REFERENCES medidas(id) ON DELETE CASCADE,
  atleta_id UUID NOT NULL,
  
  -- Imagens (paths no storage)
  frontal_image_path TEXT NOT NULL,
  costas_image_path TEXT NOT NULL,
  lateral_esq_image_path TEXT NOT NULL,
  lateral_dir_image_path TEXT NOT NULL,
  
  -- Referência
  reference_object VARCHAR(20) NOT NULL,
  
  -- Qualidade e confiança
  overall_confidence VARCHAR(10) NOT NULL,
  image_quality_score INTEGER,
  analysis_notes TEXT[],
  
  -- Metadata do processamento
  ai_model_used VARCHAR(50) DEFAULT 'gemini-2.0-flash',
  processing_time_ms INTEGER,
  raw_response JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_confidence CHECK (overall_confidence IN ('high', 'medium', 'low'))
);

CREATE INDEX idx_ia_metadata_medida ON medidas_ia_metadata(medida_id);
CREATE INDEX idx_ia_metadata_atleta ON medidas_ia_metadata(atleta_id, created_at DESC);
```

### 5.3 Storage

```sql
-- Bucket privado
INSERT INTO storage.buckets (id, name, public) 
VALUES ('body-assessment-photos', 'body-assessment-photos', false);
```

### 5.4 RLS Policies

```sql
-- medidas_ia_metadata
ALTER TABLE medidas_ia_metadata ENABLE ROW LEVEL SECURITY;

-- Atleta vê seus próprios metadados (via token do portal)
CREATE POLICY "Atletas veem próprios metadados IA" ON medidas_ia_metadata
  FOR SELECT USING (
    atleta_id IN (
      SELECT id FROM atletas WHERE portal_token = current_setting('request.headers')::json->>'x-portal-token'
    )
  );

-- Personal vê metadados dos seus alunos
CREATE POLICY "Personal vê metadados dos alunos" ON medidas_ia_metadata
  FOR SELECT USING (
    atleta_id IN (
      SELECT id FROM atletas WHERE personal_id IN (
        SELECT id FROM personais WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Insert via service role (Edge Function)
CREATE POLICY "Service pode inserir metadados" ON medidas_ia_metadata
  FOR INSERT WITH CHECK (true);

-- Storage policies
CREATE POLICY "Atleta acessa próprias fotos" ON storage.objects
  FOR ALL USING (
    bucket_id = 'body-assessment-photos' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM atletas WHERE portal_token = current_setting('request.headers')::json->>'x-portal-token'
    )
  );
```

---

## 6. Edge Function: analyze-body

### 6.1 Input

```typescript
interface AnalyzeBodyRequest {
  frontalImageBase64: string;
  costasImageBase64: string;
  lateralEsqImageBase64: string;
  lateralDirImageBase64: string;
  referenceObject: 'credit_card' | 'a4_paper' | 'tape_measure';
  heightCm: number;
  weightKg: number;
  sexo: 'M' | 'F';
  atletaId: string;
}
```

### 6.2 Output

```typescript
interface AnalyzeBodyResponse {
  success: boolean;
  medidaId: string;
  measurements: {
    ombros: number;
    peitoral: number;
    cintura: number;
    quadril: number;
    abdomen: number;
    pescoco: number;
    braco_esquerdo: number;
    braco_direito: number;
    antebraco_esquerdo: number;
    antebraco_direito: number;
    coxa_esquerda: number;
    coxa_direita: number;
    panturrilha_esquerda: number;
    panturrilha_direita: number;
    gordura_corporal: number;
  };
  confidence: {
    overall: 'high' | 'medium' | 'low';
    perMeasurement: Record<string, 'high' | 'medium' | 'low'>;
  };
  analysisNotes: string[];
  processingTimeMs: number;
}
```

### 6.3 System Prompt

```markdown
Você é um especialista em avaliação física e análise de composição corporal. 
Sua tarefa é estimar medidas corporais (circunferências) a partir de 4 fotografias.

## IMAGENS RECEBIDAS
1. FRONTAL - pessoa de frente
2. COSTAS - pessoa de costas
3. LATERAL ESQUERDA - lado esquerdo
4. LATERAL DIREITA - lado direito

## OBJETO DE REFERÊNCIA
- Cartão de crédito: 85.6mm × 53.98mm
- Folha A4: 210mm × 297mm
- Fita métrica: usar marcações visíveis

## MEDIDAS A ESTIMAR (todas em cm, circunferências)

### Da imagem FRONTAL + COSTAS:
- ombros (circunferência total)
- peitoral (circunferência na linha mamilar)
- cintura (menor circunferência abdominal)
- quadril (maior circunferência pélvica)
- abdomen (circunferência na altura do umbigo)
- pescoco (circunferência do pescoço)

### Da imagem LATERAL ESQUERDA:
- braco_esquerdo (circunferência no ponto médio)
- antebraco_esquerdo (maior circunferência)
- coxa_esquerda (maior circunferência)
- panturrilha_esquerda (maior circunferência)

### Da imagem LATERAL DIREITA:
- braco_direito (circunferência no ponto médio)
- antebraco_direito (maior circunferência)
- coxa_direita (maior circunferência)
- panturrilha_direita (maior circunferência)

### Estimativa visual:
- gordura_corporal (% de gordura corporal, estimativa visual)

## PROTOCOLO
1. Identifique o objeto de referência e calcule pixels/cm
2. Para cada medida, use a largura aparente + fator de profundidade
3. Compare lado E vs D para detectar assimetrias reais
4. Estime BF% considerando: definição muscular, vascularização, depósitos de gordura

## FORMATO DE RESPOSTA (JSON puro, sem markdown)
{
  "scaleDetected": true,
  "measurements": {
    "ombros": {"value": 120, "confidence": "high"},
    "peitoral": {"value": 105, "confidence": "medium"},
    "cintura": {"value": 82, "confidence": "high"},
    "quadril": {"value": 98, "confidence": "medium"},
    "abdomen": {"value": 85, "confidence": "medium"},
    "pescoco": {"value": 38, "confidence": "high"},
    "braco_esquerdo": {"value": 35, "confidence": "high"},
    "braco_direito": {"value": 35.5, "confidence": "high"},
    "antebraco_esquerdo": {"value": 28, "confidence": "medium"},
    "antebraco_direito": {"value": 28.5, "confidence": "medium"},
    "coxa_esquerda": {"value": 58, "confidence": "medium"},
    "coxa_direita": {"value": 57.5, "confidence": "medium"},
    "panturrilha_esquerda": {"value": 38, "confidence": "high"},
    "panturrilha_direita": {"value": 38, "confidence": "high"}
  },
  "gordura_corporal": {"value": 14, "confidence": "medium"},
  "imageQuality": {
    "frontal": {"score": 85, "issues": []},
    "costas": {"score": 80, "issues": []},
    "lateralEsq": {"score": 75, "issues": ["slight_rotation"]},
    "lateralDir": {"score": 80, "issues": []}
  },
  "notes": ["Boa iluminação", "Referência detectada", "Assimetria leve detectada em braços"]
}

## NÍVEIS DE CONFIANÇA
- "high": Landmarks claros, boa iluminação, pose correta (range ±2cm)
- "medium": Alguma ambiguidade (range ±3-4cm)
- "low": Alta incerteza (range ±5cm+)

## RESTRIÇÕES
- NUNCA invente medidas se não conseguir estimar
- Retorne erro se qualidade da imagem for insuficiente
- Seja conservador nas estimativas de BF%
```

---

## 7. Frontend: Wizard de Upload

### 7.1 Steps do Wizard

| Step | Componente | Conteúdo |
|---|---|---|
| 1 | `StepDadosBasicos` | Peso atual (pré-preenchido da ficha), seleção de objeto referência |
| 2 | `StepUploadFotos` | 4 slots de upload com preview, instruções de vestuário/pose |
| 3 | `StepRevisao` | Preview das 4 fotos, opção de refazer cada uma |
| 4 | `StepResultado` | Loading animado → medidas com badges de confiança → "Ver Avaliação" |

### 7.2 Upload via input nativo

```tsx
// Funciona em todos os devices, abre câmera ou galeria
<input 
  type="file" 
  accept="image/*" 
  capture="environment"  // Câmera traseira (ideal p/ outra pessoa tirar)
  onChange={handleImageSelect}
/>
```

### 7.3 Compressão Client-Side

```typescript
// Antes de enviar, comprimir para max 1200px largura
// Canvas API: resize + quality 0.8
// Reduz payload significativamente (3MB → ~200KB)
```

---

## 8. Integração no Portal do Atleta

### 8.1 Entry Points

1. **EmptyState** (`AssessmentScreen`) — quando não tem avaliação: botão "📸 Avaliação Virtual"
2. **Header** (`AssessmentScreen`) — quando já tem avaliação: botão "📸 Nova Avaliação"
3. O wizard abre como **modal fullscreen**

### 8.2 Pós-Avaliação

1. Edge Function retorna `medidaId`
2. Frontend faz refresh dos dados de avaliação (re-fetch `buscarTodosDadosSecundarios`)
3. Navega para AssessmentScreen que exibe Score + Proporções + Simetria + Diagnóstico
4. Badge "Estimado por IA" indica medidas virtuais

---

## 9. Fases de Implementação

### ✅ Fase 1: MVP (atual)
- Migration SQL (`IA_VISION` + `medidas_ia_metadata`)
- Bucket storage + RLS
- Edge Function com Gemini Vision (4 fotos)
- Wizard de Upload (4 steps)
- Service layer (compressão + chamada)
- Integração no AssessmentScreen
- Badge de confiança

### ⏳ Fase 2: Refinamento
- Calibração por medida real
- Overlay de silhueta na câmera inline
- Notificação para personal
- Otimização de prompt baseada em feedback

### ⏳ Fase 3: Avançado
- Comparativo foto-a-foto lado-a-lado
- Export PDF
- Dashboard agregado do personal
- Analytics de funil

---

## 10. Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Precisão insuficiente (±3-5cm) | Disclaimer "estimativa", badge IA_VISION, fase 2 calibração |
| Custo API Gemini | Rate limiting, compressão de imagem, Gemini Flash (mais barato) |
| Privacidade das fotos | Bucket privado, RLS, URLs assinadas com expiração |
| Pose incorreta | Instruções visuais claras, validação de qualidade na resposta |
| Vestuário inadequado | Instruções explícitas (sunga/biquíni), rejeição se IA detectar roupa larga |

---

**Documento atualizado em:** 2026-03-09  
**Alinhado com:** Plano de Implementação v2  
**Próxima revisão:** Após conclusão da Fase 1