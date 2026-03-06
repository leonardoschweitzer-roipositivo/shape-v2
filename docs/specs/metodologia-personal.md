# SPEC: Metodologia do Personal

## Cadastro e Gestão da Metodologia de Trabalho

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA  
**Relacionado:** SPEC_VITRUVIUS_IA_v2.md

---

## 1. VISÃO GERAL

### 1.1 O que é a Metodologia do Personal?

A **Metodologia** é um conjunto de preferências e práticas de trabalho que o Personal cadastra no sistema. O VITRÚVIO usa essa metodologia como **guia** ao criar planos de treino e dieta para os atletas daquele Personal.

### 1.2 Objetivo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  "Permitir que o VITRÚVIO crie planos alinhados com o estilo de trabalho   │
│   do Personal, respeitando suas preferências e filosofia de treinamento,   │
│   enquanto ainda oferece sugestões de melhoria baseadas em ciência."       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Princípios

| Princípio | Descrição |
|-----------|-----------|
| **Respeito** | VITRÚVIO respeita a metodologia como base |
| **Flexibilidade** | Personal pode ser tão detalhado quanto quiser |
| **Sugestões** | VITRÚVIO pode sugerir fora da metodologia (destacado) |
| **Evolução** | Metodologia pode ser atualizada a qualquer momento |

---

## 2. ESTRUTURA DA METODOLOGIA

### 2.1 Seções da Metodologia (4 seções)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    ESTRUTURA DA METODOLOGIA                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  📝 1. INFORMAÇÕES GERAIS                                           │   │
│  │     • Nome da metodologia                                          │   │
│  │     • Descrição / Filosofia de trabalho                            │   │
│  │                                                                     │   │
│  │  🏋️ 2. PREFERÊNCIAS DE TREINO                                       │   │
│  │     • Divisão preferida (ABC, PPL, etc)                            │   │
│  │     • Frequência semanal                                           │   │
│  │     • Volume (séries por grupo)                                    │   │
│  │     • Intensidade e periodização                                   │   │
│  │     • Técnicas usadas/evitadas                                     │   │
│  │     • Exercícios preferidos/evitados                               │   │
│  │                                                                     │   │
│  │  🍽️ 3. PREFERÊNCIAS DE DIETA                                        │   │
│  │     • Abordagem (flexível, estruturada, etc)                       │   │
│  │     • Distribuição de macros                                       │   │
│  │     • Número de refeições                                          │   │
│  │     • Estratégias usadas/evitadas                                  │   │
│  │                                                                     │   │
│  │  📋 4. OBSERVAÇÕES E REGRAS                                         │   │
│  │     • Observações gerais                                           │   │
│  │     • Regras específicas para o VITRÚVIO                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Estrutura de Dados

```typescript
interface MetodologiaPersonal {
  id: string
  personalId: string
  
  // ══════════════════════════════════════════════════════════════════════
  // 1. INFORMAÇÕES GERAIS
  // ══════════════════════════════════════════════════════════════════════
  geral: {
    nome: string                      // "Método Progressivo de Hipertrofia"
    descricao: string                 // Filosofia de trabalho (texto livre)
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 2. PREFERÊNCIAS DE TREINO
  // ══════════════════════════════════════════════════════════════════════
  treino: {
    // Divisão
    divisao: {
      preferida: 'ABC' | 'ABCD' | 'ABCDE' | 'UPPER_LOWER' | 'PPL' | 'FULL_BODY' | 'OUTRO'
      outra?: string
      flexivel: boolean               // Aceita outras divisões?
    }
    
    // Frequência semanal
    frequencia: {
      minimo: number
      ideal: number
      maximo: number
    }
    
    // Volume (séries por grupo/semana)
    volume: {
      minimo: number
      ideal: number
      maximo: number
      ajustePorNivel: boolean
    }
    
    // Intensidade
    intensidade: {
      abordagem: 'ALTA' | 'MODERADA' | 'PERIODIZADA' | 'AUTOREGULADA'
      usaRPE: boolean
      usaPercentualRM: boolean
      treinoAteFalha: 'SEMPRE' | 'ULTIMA_SERIE' | 'RARAMENTE' | 'NUNCA'
    }
    
    // Periodização
    periodizacao: {
      usa: boolean
      tipo: 'LINEAR' | 'ONDULADA' | 'BLOCO' | null
      duracaoMesociclo: number
      incluiDeload: boolean
      frequenciaDeload: number
    }
    
    // Técnicas
    tecnicas: {
      usadas: string[]
      evitadas: string[]
    }
    
    // Exercícios
    exercicios: {
      preferidos: { grupo: string; exercicios: string[] }[]
      evitados: { exercicio: string; motivo: string }[]
      priorizaCompostos: boolean
      incluiUnilaterais: boolean
    }
    
    // Cardio
    cardio: {
      inclui: boolean
      tipo: 'HIIT' | 'LISS' | 'MODERADO' | 'VARIADO' | null
      frequencia: number
      quando: 'ANTES_TREINO' | 'APOS_TREINO' | 'SEPARADO' | null
    }
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 3. PREFERÊNCIAS DE DIETA
  // ══════════════════════════════════════════════════════════════════════
  dieta: {
    // Abordagem
    abordagem: {
      tipo: 'FLEXIVEL' | 'ESTRUTURADA' | 'LOW_CARB' | 'CETOGENICA' | 'OUTRO'
      outra?: string
    }
    
    // Macros (g/kg)
    macros: {
      proteina: { min: number; max: number }
      carboidrato: { min: number; max: number }
      gordura: { min: number; max: number }
      usaCiclagem: boolean
    }
    
    // Refeições
    refeicoes: {
      ideal: number
      minimo: number
      maximo: number
      flexivel: boolean
    }
    
    // Estratégias
    estrategias: {
      usadas: string[]
      evitadas: string[]
    }
    
    // Suplementação
    suplementos: {
      recomendados: string[]
      observacoes: string
    }
    
    // Hidratação
    hidratacao: {
      mlPorKg: number
    }
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 4. OBSERVAÇÕES E REGRAS
  // ══════════════════════════════════════════════════════════════════════
  observacoes: {
    gerais: string
    regras: string[]                  // Regras específicas para VITRÚVIO
  }
  
  // Metadata
  preenchido: boolean
  completude: number
  createdAt: Date
  updatedAt: Date
}
```

---

## 3. INTERFACE DE CADASTRO

### 3.1 Tela Principal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ⚙️ MINHA METODOLOGIA DE TRABALHO                                           │
│                                                                             │
│  Configure como você trabalha para que o VITRÚVIO crie planos              │
│  alinhados com seu estilo profissional.                                    │
│                                                                             │
│  Completude: ████████░░ 80%                                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 📝 Informações Gerais                               ✅ Preenchido   │   │
│  │    Nome: Método Progressivo de Hipertrofia                         │   │
│  │                                                        [ Editar → ] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🏋️ Preferências de Treino                           ✅ Preenchido   │   │
│  │    Divisão ABC • 4-5x/semana • 14-18 séries/grupo                  │   │
│  │                                                        [ Editar → ] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🍽️ Preferências de Dieta                            ✅ Preenchido   │   │
│  │    Flexível • 1.8-2.2g/kg proteína • 5 refeições                   │   │
│  │                                                        [ Editar → ] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 📋 Observações e Regras                             ⚠️ Incompleto   │   │
│  │    Adicione regras para o VITRÚVIO seguir                          │   │
│  │                                                        [ Editar → ] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  💡 Quanto mais detalhada sua metodologia, mais precisos serão os         │
│     planos criados pelo VITRÚVIO para seus atletas.                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Formulário: Preferências de Treino

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🏋️ PREFERÊNCIAS DE TREINO                                             [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DIVISÃO DE TREINO                                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Divisão preferida                                                         │
│  [●] ABC    [ ] ABCD    [ ] ABCDE    [ ] Upper/Lower                      │
│  [ ] Push/Pull/Legs     [ ] Full Body    [ ] Outro: _____                 │
│                                                                             │
│  [✓] Aceito usar outras divisões dependendo do atleta                     │
│                                                                             │
│  FREQUÊNCIA E VOLUME                                                       │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Frequência semanal: Mín [3] • Ideal [4] • Máx [6]                        │
│  Séries/grupo/semana: Mín [10] • Ideal [16] • Máx [20]                    │
│                                                                             │
│  [✓] Ajustar volume conforme nível do atleta                              │
│                                                                             │
│  INTENSIDADE                                                               │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Abordagem: [●] Moderada  [ ] Alta  [ ] Periodizada  [ ] Autoregulada     │
│                                                                             │
│  [✓] Uso RPE    [ ] Uso % de 1RM                                          │
│                                                                             │
│  Treino até falha: [ ] Sempre  [●] Última série  [ ] Raramente  [ ] Nunca │
│                                                                             │
│  PERIODIZAÇÃO                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [✓] Uso periodização                                                     │
│  Tipo: [●] Linear  [ ] Ondulada  [ ] Em blocos                            │
│  Duração mesociclo: [4] semanas                                           │
│  [✓] Incluir deload a cada [4] semanas                                    │
│                                                                             │
│  TÉCNICAS                                                                  │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Uso: [✓] Drop-set  [✓] Rest-pause  [ ] Super-set  [✓] Bi-set            │
│  Evito: [ ] Drop-set  [ ] Rest-pause  [✓] Super-set  [✓] Cluster         │
│                                                                             │
│  EXERCÍCIOS                                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [✓] Priorizar compostos  [✓] Incluir unilaterais para assimetrias       │
│                                                                             │
│  Preferidos por grupo:                                    [+ Adicionar]   │
│  • Peitoral: Supino reto, Supino inclinado                              × │
│  • Costas: Puxada, Remada curvada                                       × │
│                                                                             │
│  Evitados:                                                [+ Adicionar]   │
│  • Remada cavalinho - Risco lombar                                      × │
│                                                                             │
│  CARDIO                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  [✓] Incluir cardio    Tipo: [HIIT ▼]    [2]x/semana    [Após treino ▼]  │
│                                                                             │
│                              [ CANCELAR ]        [ 💾 SALVAR ]              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Formulário: Observações e Regras

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📋 OBSERVAÇÕES E REGRAS                                               [X] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Observações gerais sobre sua metodologia                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Prefiro progressão de carga semanal. Não gosto de treinos muito    │   │
│  │ longos (máximo 60-70 min). Acredito que descanso é tão importante  │   │
│  │ quanto treino.                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Regras para o VITRÚVIO seguir                            [+ Adicionar]   │
│                                                                             │
│  💡 Regras que o VITRÚVIO SEMPRE seguirá ao criar planos.                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Sempre começar treino com exercício composto                   × │   │
│  │ 2. Nunca mais que 3 exercícios para grupos pequenos               × │   │
│  │ 3. Incluir pelo menos 1 exercício unilateral por sessão           × │   │
│  │ 4. Proteína distribuída em todas as refeições                     × │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Nova regra:                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                        [ + ADICIONAR ]     │
│                                                                             │
│                              [ CANCELAR ]        [ 💾 SALVAR ]              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. COMO VITRÚVIO USA A METODOLOGIA

### 4.1 Hierarquia de Decisão

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│           HIERARQUIA DE DECISÃO DO VITRÚVIO                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  1️⃣ REGRAS DO PERSONAL (maior prioridade)                           │   │
│  │     └── Regras específicas sempre são seguidas                     │   │
│  │                                                                     │   │
│  │  2️⃣ CONTEXTO DO ATLETA                                              │   │
│  │     └── Lesões, restrições, disponibilidade                        │   │
│  │                                                                     │   │
│  │  3️⃣ PREFERÊNCIAS DO PERSONAL                                        │   │
│  │     └── Divisão, volume, técnicas preferidas                       │   │
│  │                                                                     │   │
│  │  4️⃣ SUGESTÕES DO VITRÚVIO (menor prioridade)                        │   │
│  │     └── Otimizações baseadas em ciência (destacadas)               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Exemplo de Sugestão Fora da Metodologia

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  💡 SUGESTÃO DO VITRÚVIO (fora da metodologia)                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  Sua metodologia indica divisão ABC, porém o atleta:                       │
│  • Tem assimetria de 5% no bíceps esquerdo                                │
│  • Treina 6x por semana                                                   │
│                                                                             │
│  💬 "Sugiro considerar uma divisão com maior frequência para trabalhar    │
│      a assimetria mais vezes por semana."                                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  O plano foi criado seguindo sua metodologia ABC.                         │
│  Fica a seu critério aprovar ou ajustar.                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. BANCO DE DADOS

```sql
CREATE TABLE metodologias_personal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  personal_id UUID NOT NULL REFERENCES personais(id) ON DELETE CASCADE,
  
  -- Seções (JSONB)
  geral JSONB,
  treino JSONB,
  dieta JSONB,
  observacoes JSONB,
  
  -- Controle
  preenchido BOOLEAN DEFAULT FALSE,
  completude INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(personal_id)
);

CREATE INDEX idx_metodologia_personal ON metodologias_personal(personal_id);
```

---

## 6. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |
| 1.1 | Mar/2026 | Estado real da implementação |

---

## 7. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### Implementação Parcial
A metodologia é **usada** pelo contextBuilder na geração de planos, mas **não tem tela dedicada** de cadastro ainda.

### O Que Está Implementado ✅
- [x] Campos de metodologia no contexto do personal (contextBuilder.ts)
- [x] Metodologia influencia prompts de geração (treino + dieta)
- [x] Hierarquia de decisão respeitada (IA considera preferências)
- [x] Preferências básicas de treino (divisão, volume, técnicas)

### O Que Está Pendente ❌
- [ ] Tela dedicada "Minha Metodologia" (seção 3 da SPEC)
- [ ] Formulário de 4 seções (Geral, Treino, Dieta, Observações)
- [ ] Barra de completude visual
- [ ] Tabela `metodologias_personal` no Supabase (usa campos genéricos hoje)
- [ ] Regras específicas para Vitrúvio (texto livre)
- [ ] Sugestões do Vitrúvio "fora da metodologia"

---

**VITRU IA - Metodologia do Personal v1.1**
