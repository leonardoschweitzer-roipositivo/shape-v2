# SPEC: VITRÚVIO IA - O Coach Inteligente

## Documento de Especificação Completa

**Versão:** 2.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA  
**Módulo:** Coach de Inteligência Artificial

---

## 1. VISÃO GERAL

### 1.1 O que é o VITRÚVIO IA?

O **VITRÚVIO IA** é o coach virtual inteligente do VITRU IA, inspirado em Leonardo da Vinci e seu famoso "Homem Vitruviano" - a representação perfeita das proporções humanas ideais.

> *"Assim como Da Vinci estudou as proporções perfeitas do corpo humano, o VITRÚVIO IA analisa, orienta e guia cada atleta em sua jornada para alcançar seu físico ideal."*

### 1.2 Missão

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  "Transformar dados em sabedoria, números em ação, e sonhos em realidade.  │
│   Cada corpo é único, cada jornada é pessoal, cada conquista merece        │
│   ser celebrada."                                                          │
│                                                                             │
│                                              — VITRÚVIO IA                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 SPECs Relacionadas (Separadas)

| SPEC | Descrição | Status |
|------|-----------|--------|
| SPEC_METODOLOGIA_PERSONAL.md | Cadastro e gestão da metodologia do Personal | 🔜 Criar |
| SPEC_APROVACAO_PLANOS.md | Fluxo detalhado de aprovação de planos | 🔜 Criar |
| SPEC_VOICE_INPUT.md | Entrada por voz no VITRÚVIO | ✅ Existe |

---

## 2. PERSONA DO VITRÚVIO

### 2.1 Personalidade

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         PERSONA: VITRÚVIO IA                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ARQUÉTIPO: O Mentor Sábio + O Treinador Dedicado                  │   │
│  │                                                                     │   │
│  │  ────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  🧠 CONHECIMENTO                                                    │   │
│  │     • Profundo em fisiologia, biomecânica e nutrição               │   │
│  │     • Atualizado com pesquisas científicas                         │   │
│  │     • Especialista em proporções e estética corporal               │   │
│  │                                                                     │   │
│  │  💪 MOTIVAÇÃO                                                       │   │
│  │     • Celebra cada conquista, por menor que seja                   │   │
│  │     • Transforma obstáculos em oportunidades                       │   │
│  │     • Nunca desiste do atleta                                      │   │
│  │                                                                     │   │
│  │  🎯 OBJETIVIDADE                                                    │   │
│  │     • Direto ao ponto, sem enrolação                               │   │
│  │     • Sempre termina com ação prática                              │   │
│  │     • Honesto mesmo quando a verdade é difícil                     │   │
│  │                                                                     │   │
│  │  🤝 RESPEITO                                                        │   │
│  │     • Respeita o Personal e sua metodologia                        │   │
│  │     • Adapta-se às preferências do atleta                          │   │
│  │     • Nunca impõe, sempre sugere                                   │   │
│  │                                                                     │   │
│  │  😊 EMPATIA                                                         │   │
│  │     • Entende frustrações e dificuldades                           │   │
│  │     • Ajusta o tom conforme o momento                              │   │
│  │     • Humanizado, não robótico                                     │   │
│  │                                                                     │   │
│  │  🧠 MEMÓRIA                                                         │   │
│  │     • Lembra de conversas anteriores                               │   │
│  │     • Conhece cada vez melhor o atleta                             │   │
│  │     • Personaliza baseado no histórico                             │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Tom de Voz

```typescript
interface TomDeVoz {
  geral: {
    formalidade: 'informal-profissional'
    pronome: 'você'
    emoji: 'moderado'
    humor: 'leve'
  }
  
  contextos: {
    conquista: {
      tom: 'entusiasmado'
      exemplo: "🎉 Isso aí! Seu score subiu 5 pontos!"
    }
    dificuldade: {
      tom: 'empático-motivador'
      exemplo: "Entendo que está difícil. Vamos simplificar: foque apenas em X essa semana."
    }
    estagnacao: {
      tom: 'analítico-construtivo'
      exemplo: "Notei que seu score está estável há 3 semanas. Vamos tentar algo diferente?"
    }
    regressao: {
      tom: 'compreensivo-proativo'
      exemplo: "Vi que as medidas mudaram. Faz parte. Vamos identificar o que aconteceu."
    }
    primeira_vez: {
      tom: 'acolhedor-explicativo'
      exemplo: "Bem-vindo! Sou o VITRÚVIO, seu coach virtual."
    }
  }
}
```

### 2.3 O que VITRÚVIO FAZ

| Função | Descrição |
|--------|-----------|
| **Analisa** | Interpreta medidas, proporções e evolução |
| **Diagnostica** | Identifica pontos fortes, fracos e assimetrias |
| **Recomenda** | Sugere exercícios, ajustes e prioridades |
| **Cria** | Elabora planos de treino e dieta (sujeitos a aprovação) |
| **Motiva** | Celebra conquistas e incentiva nos momentos difíceis |
| **Educa** | Explica o "porquê" de cada recomendação |
| **Alerta** | Notifica sobre regressões, inconsistências ou riscos |
| **Lembra** | Mantém memória das interações para personalização |

### 2.4 O que VITRÚVIO NÃO FAZ

| Limitação | Motivo |
|-----------|--------|
| ❌ Prescrever medicamentos | Não é médico |
| ❌ Prescrever dosagem de anabolizantes | Apenas considera que está em uso |
| ❌ Diagnosticar lesões ou doenças | Sempre recomenda procurar profissional |
| ❌ Substituir o Personal | Trabalha EM CONJUNTO com o profissional |
| ❌ Ignorar a metodologia do Personal | Adapta-se, mesmo quando discorda |
| ❌ Garantir resultados | Sempre fala em potencial e probabilidade |

---

## 3. FONTES DE CONHECIMENTO DO VITRÚVIO

### 3.1 Visão Geral

O VITRÚVIO constrói seu conhecimento sobre o atleta a partir de **4 fontes principais**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│              FONTES DE CONHECIMENTO DO VITRÚVIO                             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  1️⃣ CONTEXTO DO ATLETA (Cadastro)                                   │   │
│  │     └── Informações declaradas pelo atleta/personal                │   │
│  │         • Problemas de saúde                                       │   │
│  │         • Medicações em uso                                        │   │
│  │         • Dores e lesões                                           │   │
│  │         • Exames                                                   │   │
│  │         • Estilo de vida                                           │   │
│  │         • Profissão                                                │   │
│  │         • Histórico de treino                                      │   │
│  │         • Histórico de dietas                                      │   │
│  │                                                                     │   │
│  │  2️⃣ DADOS DE AVALIAÇÃO (Medidas)                                    │   │
│  │     └── Dados objetivos coletados                                  │   │
│  │         • Ficha estrutural (altura, punho, etc)                    │   │
│  │         • Medidas corporais                                        │   │
│  │         • Avaliações e scores                                      │   │
│  │         • Proporções calculadas                                    │   │
│  │         • Evolução ao longo do tempo                               │   │
│  │                                                                     │   │
│  │  3️⃣ HISTÓRICO DE INTERAÇÕES                                        │   │
│  │     └── Conversas e planos anteriores                              │   │
│  │         • Perguntas frequentes                                     │   │
│  │         • Feedbacks sobre planos                                   │   │
│  │         • Preferências demonstradas                                │   │
│  │         • Dificuldades relatadas                                   │   │
│  │                                                                     │   │
│  │  4️⃣ REGISTROS DIÁRIOS                                              │   │
│  │     └── Acompanhamento do dia-a-dia                                │   │
│  │         • Treinos realizados                                       │   │
│  │         • Refeições                                                │   │
│  │         • Sono e recuperação                                       │   │
│  │         • Peso diário                                              │   │
│  │         • Dores ou desconfortos                                    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. CONTEXTO DO ATLETA

### 4.1 Estrutura do Contexto (8 Campos)

O CONTEXTO é fundamental para o VITRÚVIO criar planos personalizados. São 8 campos que capturam informações de saúde, estilo de vida e histórico do atleta.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  📋 CONTEXTO                                                                │
│  Informações de saúde, estilo de vida e histórico do atleta                │
│                                                                             │
│  (3/8 preenchidos)                              [ ✏️ EDITAR CONTEXTO ]      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │ ❤️ PROBLEMAS DE SAÚDE       │  │ 💊 MEDICAÇÕES EM USO        │          │
│  │                             │  │                             │          │
│  │ Condições que afetam gasto  │  │ Medicamentos que            │          │
│  │ calórico, treino e dieta    │  │ influenciam metabolismo     │          │
│  │                             │  │ e performance               │          │
│  │ Não informado               │  │                             │          │
│  │                             │  │ uso de enantato 250mg       │          │
│  │                             │  │ a cada 10 dias e uso de     │          │
│  │                             │  │ dizebatida 2,5mg a cada     │          │
│  │                             │  │ 10 dias                     │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │ ⚠️ DORES E LESÕES           │  │ 📋 EXAMES                   │          │
│  │                             │  │                             │          │
│  │ Restrições que impactam     │  │ Resultados laboratoriais    │          │
│  │ exercícios e recuperação    │  │ e exames de imagem          │          │
│  │                             │  │                             │          │
│  │ Não informado               │  │ Não informado               │          │
│  │                             │  │                             │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │ 🌙 ESTILO DE VIDA           │  │ 💼 PROFISSÃO                │          │
│  │                             │  │                             │          │
│  │ Fatores do dia a dia que    │  │ Atividade laboral e gasto   │          │
│  │ afetam resultados           │  │ calórico ocupacional        │          │
│  │                             │  │                             │          │
│  │ Não informado               │  │ programador Home Office     │          │
│  │                             │  │ Trabalho bastante tempo     │          │
│  │                             │  │ 10 horas por dia sentado    │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
│                                                                             │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │ 🏋️ HISTÓRICO DE TREINO      │  │ 🍽️ HISTÓRICO DE DIETAS      │          │
│  │                             │  │                             │          │
│  │ Experiência e background    │  │ Experiências alimentares    │          │
│  │ de treinamento              │  │ passadas e aprendizados     │          │
│  │                             │  │                             │          │
│  │ treino desde os meus 16     │  │ Não informado               │          │
│  │ anos entretanto na          │  │                             │          │
│  │ pandemia fiquei dois anos   │  │                             │          │
│  │ parado e aí voltei e        │  │                             │          │
│  │ treino praticamente todos   │  │                             │          │
│  │ os dias de 5 a 6 dias       │  │                             │          │
│  │ por semana                  │  │                             │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
│                                                                             │
│                    ÚLTIMA ATUALIZAÇÃO: 27 DE FEVEREIRO DE 2026 ÀS 12:11    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Estrutura de Dados do Contexto

```typescript
interface ContextoAtleta {
  atletaId: string
  
  // ══════════════════════════════════════════════════════════════════════
  // 1. PROBLEMAS DE SAÚDE
  // Condições que afetam gasto calórico, treino e dieta
  // ══════════════════════════════════════════════════════════════════════
  problemasSaude: {
    preenchido: boolean
    condicoes: string[]           // ['diabetes tipo 2', 'hipertensão'...]
    descricaoLivre: string        // Campo livre para detalhes
    impactoTreino: string         // Como afeta o treino
    impactoDieta: string          // Como afeta a dieta
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 2. MEDICAÇÕES EM USO
  // Medicamentos que influenciam metabolismo e performance
  // ══════════════════════════════════════════════════════════════════════
  medicacoesUso: {
    preenchido: boolean
    medicamentos: {
      nome: string                // 'enantato de testosterona'
      dosagem: string             // '250mg'
      frequencia: string          // 'a cada 10 dias'
      motivo?: string             // 'TRT' ou 'performance'
    }[]
    descricaoLivre: string        // Campo livre
    
    // Flag especial para o VITRÚVIO considerar
    usaAnabolizantes: boolean
    usaTermogenicos: boolean
    usaHormonios: boolean
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 3. DORES E LESÕES
  // Restrições que impactam exercícios e recuperação
  // ══════════════════════════════════════════════════════════════════════
  doresLesoes: {
    preenchido: boolean
    lesoes: {
      local: string               // 'ombro direito', 'lombar'
      tipo: string                // 'tendinite', 'hérnia', 'lesão muscular'
      status: 'ATIVA' | 'EM_RECUPERACAO' | 'RECUPERADA_COM_CUIDADO'
      exerciciosEvitar: string[]  // ['supino inclinado', 'desenvolvimento']
      observacoes: string
    }[]
    doresCronicas: {
      local: string
      intensidade: 1 | 2 | 3 | 4 | 5
      gatilhos: string[]          // ['agachamento pesado', 'muito volume']
    }[]
    descricaoLivre: string
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 4. EXAMES
  // Resultados laboratoriais e exames de imagem
  // ══════════════════════════════════════════════════════════════════════
  exames: {
    preenchido: boolean
    laboratoriais: {
      data: Date
      tipo: string                // 'hemograma', 'hormonal', 'lipidograma'
      resultados: string          // Descrição ou valores relevantes
      arquivoUrl?: string         // PDF do exame
    }[]
    imagem: {
      data: Date
      tipo: string                // 'ressonância', 'ultrassom', 'raio-x'
      local: string               // 'ombro direito'
      laudo: string
      arquivoUrl?: string
    }[]
    descricaoLivre: string
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 5. ESTILO DE VIDA
  // Fatores do dia a dia que afetam resultados
  // ══════════════════════════════════════════════════════════════════════
  estiloVida: {
    preenchido: boolean
    sono: {
      horasMedia: number          // 6, 7, 8...
      qualidade: 'BOA' | 'REGULAR' | 'RUIM'
      problemas: string[]         // ['insônia', 'apneia', 'acorda muito']
    }
    estresse: {
      nivel: 1 | 2 | 3 | 4 | 5
      fontes: string[]            // ['trabalho', 'família', 'financeiro']
    }
    alcool: 'NUNCA' | 'RARAMENTE' | 'SOCIALMENTE' | 'FREQUENTE'
    fumo: 'NUNCA' | 'EX_FUMANTE' | 'FUMANTE'
    rotina: {
      acordaHorario: string       // '06:00'
      dormeHorario: string        // '23:00'
      refeicoesDia: number        // 4, 5, 6
      tempoParaCozinhar: boolean
      comeFora: 'NUNCA' | 'POUCO' | 'FREQUENTE' | 'SEMPRE'
    }
    descricaoLivre: string
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 6. PROFISSÃO
  // Atividade laboral e gasto calórico ocupacional
  // ══════════════════════════════════════════════════════════════════════
  profissao: {
    preenchido: boolean
    cargo: string                 // 'programador'
    tipo: 'HOME_OFFICE' | 'PRESENCIAL' | 'HIBRIDO' | 'EXTERNO'
    nivelAtividade: 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO'
    horasSentado: number          // 10
    horasEmPe: number             // 2
    viagens: 'NUNCA' | 'POUCO' | 'FREQUENTE'
    turnos: 'DIURNO' | 'NOTURNO' | 'ALTERNADO'
    descricaoLivre: string        // 'Trabalho bastante tempo 10 horas por dia sentado'
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 7. HISTÓRICO DE TREINO
  // Experiência e background de treinamento
  // ══════════════════════════════════════════════════════════════════════
  historicoTreino: {
    preenchido: boolean
    tempoTotal: string            // '10 anos', '6 meses'
    idade_inicio: number          // 16
    pausas: {
      periodo: string             // '2020-2022'
      motivo: string              // 'pandemia'
      duracao: string             // '2 anos'
    }[]
    frequenciaAtual: number       // 5-6 dias
    modalidades: string[]         // ['musculação', 'crossfit', 'funcional']
    melhorFase: string            // 'antes da pandemia, pesava 85kg'
    descricaoLivre: string
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // 8. HISTÓRICO DE DIETAS
  // Experiências alimentares passadas e aprendizados
  // ══════════════════════════════════════════════════════════════════════
  historicoDietas: {
    preenchido: boolean
    dietasAnteriores: {
      tipo: string                // 'low carb', 'cetogênica', 'flexível'
      duracao: string             // '3 meses'
      resultado: 'SUCESSO' | 'PARCIAL' | 'FRACASSO'
      dificuldades: string[]      // ['fome', 'social', 'monotonia']
      aprendizado: string         // 'funciono melhor com mais carboidrato'
    }[]
    restricoesAlimentares: string[] // ['lactose', 'glúten']
    alergias: string[]
    preferencias: string[]        // ['frango', 'arroz', 'ovos']
    aversoes: string[]            // ['peixe', 'fígado']
    descricaoLivre: string
  }
  
  // ══════════════════════════════════════════════════════════════════════
  // METADATA
  // ══════════════════════════════════════════════════════════════════════
  camposPreenchidos: number       // 3 de 8
  ultimaAtualizacao: Date
  atualizadoPor: 'ATLETA' | 'PERSONAL'
}
```

### 4.3 Como VITRÚVIO Usa o Contexto

```typescript
// Exemplo de como o contexto influencia as decisões do VITRÚVIO

const REGRAS_CONTEXTO = {
  // MEDICAÇÕES
  medicacoes: {
    usaAnabolizantes: {
      impacto: [
        'Pode aumentar volume de treino',
        'Recuperação mais rápida',
        'Maior síntese proteica - ajustar proteína',
        'Monitorar pressão arterial',
        'Considerar suporte hepático na dieta'
      ]
    },
    usaTermogenicos: {
      impacto: [
        'Considerar no cálculo calórico',
        'Atenção à hidratação',
        'Monitorar frequência cardíaca no treino'
      ]
    }
  },
  
  // PROFISSÃO
  profissao: {
    sedentario_10h: {
      impacto: [
        'NEAT muito baixo - incluir caminhadas',
        'Risco de problemas posturais',
        'Priorizar mobilidade de quadril',
        'Treinos podem ser mais intensos (está descansado)',
        'Calorias de manutenção mais baixas'
      ]
    }
  },
  
  // HISTÓRICO DE TREINO
  historicoTreino: {
    experiente_com_pausa: {
      impacto: [
        'Memória muscular - progressão pode ser mais rápida',
        'Conhece os movimentos - pode usar técnicas avançadas',
        'Atenção na readaptação inicial',
        'Não subestimar cargas muito leves'
      ]
    }
  },
  
  // DORES E LESÕES
  doresLesoes: {
    ombro: {
      impacto: [
        'Evitar exercícios listados',
        'Incluir pré-habilitação',
        'Priorizar amplitude controlada',
        'Sugerir alternativas seguras'
      ]
    }
  }
}
```

---

## 5. SISTEMA DE MEMÓRIA E APRENDIZADO

### 5.1 Conceito

Além do CONTEXTO declarado, o VITRÚVIO **aprende** sobre cada atleta ao longo do tempo através das interações.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    SISTEMA DE MEMÓRIA DO VITRÚVIO                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  📊 DADOS OBJETIVOS (automático)                                    │   │
│  │     • Histórico de avaliações e medidas                            │   │
│  │     • Evolução ao longo do tempo                                   │   │
│  │     • Padrões de comportamento nos registros                       │   │
│  │     • Resultados de planos anteriores                              │   │
│  │                                                                     │   │
│  │  💬 INTERAÇÕES (aprendizado contínuo)                               │   │
│  │     • Perguntas frequentes                                         │   │
│  │     • Dúvidas recorrentes                                          │   │
│  │     • Feedbacks sobre planos                                       │   │
│  │     • Tom emocional das conversas                                  │   │
│  │                                                                     │   │
│  │  🎯 INSIGHTS GERADOS (conclusões do VITRÚVIO)                      │   │
│  │     • "Atleta responde melhor a treinos de alta intensidade"       │   │
│  │     • "Tende a abandonar dietas muito restritivas"                 │   │
│  │     • "Progride mais quando recebe feedback diário"                │   │
│  │     • "Ombros são ponto forte, panturrilha é ponto fraco"         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Insights do VITRÚVIO

```typescript
interface InsightsVitruvio {
  atletaId: string
  
  // Sobre treino
  treino: {
    respondeAIntensidade: 'ALTA' | 'MODERADA' | 'BAIXA' | null
    volumeIdeal: 'ALTO' | 'MODERADO' | 'BAIXO' | null
    recuperacao: 'RAPIDA' | 'NORMAL' | 'LENTA' | null
    prefereExercicios: string[]
    evitaExercicios: string[]
  }
  
  // Sobre dieta
  dieta: {
    adereMelhorA: 'FLEXIVEL' | 'ESTRUTURADA' | null
    toleraRestricao: 'BEM' | 'MODERADO' | 'MAL' | null
    pontoFraco: string | null     // 'doces', 'finais de semana'
  }
  
  // Sobre comportamento
  comportamento: {
    motivacao: 'INTRINSECA' | 'EXTRINSECA' | 'MISTA' | null
    respondeA: string[]           // ['desafios', 'números', 'competição']
    desanimaCom: string[]         // ['estagnação', 'restrição']
    frequenciaFeedbackIdeal: 'DIARIO' | 'SEMANAL' | null
  }
  
  // Físico
  fisico: {
    pontosFortes: string[]
    pontosFracos: string[]
    assimetrias: string[]
  }
  
  // Notas livres
  notas: {
    data: Date
    nota: string
    fonte: 'CONVERSA' | 'FEEDBACK' | 'OBSERVACAO'
  }[]
  
  ultimaAtualizacao: Date
}
```

### 5.3 Gatilhos de Atualização

```typescript
const GATILHOS_ATUALIZACAO_INSIGHTS = {
  // Após cada avaliação
  aposAvaliacao: [
    'Atualizar pontos fortes/fracos',
    'Recalcular assimetrias',
    'Verificar velocidade de progresso'
  ],
  
  // Após cada consulta
  aposConsulta: [
    'Extrair informações mencionadas',
    'Identificar preferências',
    'Salvar notas relevantes'
  ],
  
  // Após feedback de plano
  aposFeedbackPlano: [
    'Registrar aderência',
    'Correlacionar com resultado',
    'Ajustar insights sobre preferências'
  ],
  
  // Análise semanal automática
  analiseSemanal: [
    'Calcular padrões de registros',
    'Identificar comportamentos recorrentes',
    'Atualizar insights consolidados'
  ]
}
```

---

## 6. CICLOS DE PLANEJAMENTO

### 6.1 Hierarquia de Metas e Planos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    HIERARQUIA DE PLANEJAMENTO                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🎯 META ANUAL (12 meses)                                           │   │
│  │     • Transformação corporal completa                              │   │
│  │     • Score inicial → Score alvo                                   │   │
│  │     • "Em 1 ano, quero atingir o score META (85+)"                │   │
│  │                                                                     │   │
│  │         │                                                           │   │
│  │         ├─────────────────┬─────────────────┐                      │   │
│  │         ▼                 ▼                 ▼                      │   │
│  │                                                                     │   │
│  │  📊 METAS SEMESTRAIS (6 meses cada)                                 │   │
│  │     • Marcos intermediários de progresso                           │   │
│  │     • Checkpoint para reavaliação de estratégia                    │   │
│  │     • 1º Sem: "Chegar a 75 pontos"                                │   │
│  │     • 2º Sem: "Chegar a 85+ pontos"                               │   │
│  │                                                                     │   │
│  │         │                                                           │   │
│  │         ▼                                                           │   │
│  │                                                                     │   │
│  │  🏋️ PLANOS DE TREINO TRIMESTRAIS (12 semanas)                      │   │
│  │     • Macrociclo com periodização                                  │   │
│  │     • 3 mesociclos de 4 semanas                                    │   │
│  │     • Foco em grupos prioritários                                  │   │
│  │     • Revisão e ajuste a cada trimestre                           │   │
│  │                                                                     │   │
│  │         │                                                           │   │
│  │         ▼                                                           │   │
│  │                                                                     │   │
│  │  🍽️ PLANOS DE DIETA MENSAIS (4 semanas)                            │   │
│  │     • Mais flexível e ajustável                                    │   │
│  │     • Revisão semanal de peso/feedback                            │   │
│  │     • Ajustes conforme resultados                                  │   │
│  │     • Adapta-se ao momento do treino                              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Meta Anual (12 meses)

```typescript
interface MetaAnual {
  id: string
  atletaId: string
  
  // Período
  ano: number
  dataInicio: Date
  dataFim: Date
  
  // Objetivo
  objetivo: {
    tipo: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE'
    descricao: string             // "Transformação completa - ganhar massa e definir"
  }
  
  // Métricas
  metricas: {
    scoreInicial: number
    scoreAlvo: number
    classificacaoAlvo: 'META' | 'ELITE'
    pesoInicial?: number
    pesoAlvo?: number
    bfInicial?: number
    bfAlvo?: number
  }
  
  // Status
  status: 'ATIVA' | 'CONCLUIDA' | 'ABANDONADA'
  
  // Semestres
  semestres: MetaSemestral[]
}
```

### 6.3 Meta Semestral (6 meses)

```typescript
interface MetaSemestral {
  id: string
  metaAnualId: string
  
  // Período
  semestre: 1 | 2
  dataInicio: Date
  dataFim: Date
  
  // Checkpoint
  checkpoint: {
    scoreEsperado: number
    foco: string                  // "Priorizar membros superiores"
  }
  
  // Resultado (preenchido ao final)
  resultado?: {
    scoreAlcancado: number
    analiseVitruvio: string
    ajustesParaProximoSemestre: string[]
  }
}
```

### 6.4 Plano de Treino Trimestral (12 semanas)

```typescript
interface PlanoTreinoTrimestral {
  id: string
  atletaId: string
  metaSemestralId?: string
  
  // Período
  trimestre: 1 | 2 | 3 | 4
  dataInicio: Date
  dataFim: Date
  totalSemanas: 12
  
  // Estrutura
  divisao: 'ABC' | 'ABCD' | 'ABCDE' | 'UPPER_LOWER' | 'PPL' | 'FULL_BODY'
  frequenciaSemanal: number
  
  // Foco do trimestre (baseado na avaliação)
  foco: {
    gruposPrioritarios: string[]  // ['ombros', 'panturrilha']
    assimetriasCorrigir: string[] // ['bíceps esquerdo']
    objetivo: 'FORCA' | 'HIPERTROFIA' | 'RESISTENCIA' | 'MISTO'
  }
  
  // Periodização
  periodizacao: {
    tipo: 'LINEAR' | 'ONDULADA' | 'BLOCO'
    mesociclos: {
      numero: 1 | 2 | 3
      semanas: [number, number]   // [1, 4], [5, 8], [9, 12]
      foco: string                // "Adaptação", "Hipertrofia", "Intensificação"
      volumeRelativo: 'BAIXO' | 'MEDIO' | 'ALTO'
      intensidadeRelativa: 'BAIXA' | 'MEDIA' | 'ALTA'
    }[]
  }
  
  // Semanas detalhadas
  semanas: PlanoSemanal[]
  
  // Aprovação (ver SPEC_APROVACAO_PLANOS.md)
  status: 'RASCUNHO' | 'AGUARDANDO_APROVACAO' | 'APROVADO' | 'ATIVO' | 'CONCLUIDO'
  aprovacao?: {
    aprovadoPor: 'PERSONAL' | 'ATLETA'
    data: Date
    comentario?: string
  }
}

interface PlanoSemanal {
  semanaNumero: number
  mesociclo: 1 | 2 | 3
  
  dias: {
    dia: 'SEG' | 'TER' | 'QUA' | 'QUI' | 'SEX' | 'SAB' | 'DOM'
    tipo: 'TREINO' | 'DESCANSO' | 'CARDIO'
    
    treino?: {
      nome: string                // "Treino A - Peito/Tríceps"
      duracao: number             // minutos
      
      exercicios: {
        ordem: number
        nome: string
        series: number
        repeticoes: string        // "8-10" ou "12" ou "AMRAP"
        descanso: number          // segundos
        tecnica?: string          // "drop-set na última série"
        observacao?: string
        alternativas?: string[]   // Se não tiver equipamento
      }[]
    }
  }[]
  
  observacoes?: string            // "Semana de deload"
}
```

### 6.5 Plano de Dieta Mensal (4 semanas)

```typescript
interface PlanoDietaMensal {
  id: string
  atletaId: string
  planoTreinoId?: string
  
  // Período
  mes: number
  ano: number
  dataInicio: Date
  dataFim: Date
  
  // Estratégia
  estrategia: {
    fase: 'BULK' | 'CUT' | 'MANUTENCAO' | 'RECOMPOSICAO'
    deficit_superavit: number     // -500, 0, +300 kcal
    
    calorias: {
      diasTreino: number
      diasDescanso: number
    }
    
    macros: {
      proteina: { gKg: number; total: number }
      carboidrato: { gKg: number; total: number }
      gordura: { gKg: number; total: number }
    }
  }
  
  // Estrutura de refeições
  refeicoes: {
    quantidade: number            // 5
    
    estrutura: {
      nome: 'CAFE' | 'LANCHE1' | 'ALMOCO' | 'LANCHE2' | 'JANTAR' | 'CEIA'
      horario: string
      macros: { p: number; c: number; g: number; kcal: number }
      
      opcoes: {
        alimento: string
        quantidade: string
        alternativas: string[]
      }[]
    }[]
  }
  
  // Flexibilidade
  refeicaoLivre: {
    frequencia: 'SEMANAL' | 'QUINZENAL'
    orientacao: string
  }
  
  // Checkpoints semanais
  checkpoints: {
    semana: 1 | 2 | 3 | 4
    pesoEsperado?: number
    ajuste?: string               // "Reduzir 100kcal se peso estagnar"
  }[]
  
  // Aprovação
  status: 'RASCUNHO' | 'AGUARDANDO_APROVACAO' | 'APROVADO' | 'ATIVO' | 'CONCLUIDO'
  aprovacao?: {
    aprovadoPor: 'PERSONAL' | 'ATLETA'
    data: Date
  }
  
  // Feedback semanal
  feedbacks: {
    semana: number
    peso: number
    fome: 1 | 2 | 3 | 4 | 5
    energia: 1 | 2 | 3 | 4 | 5
    aderencia: number             // % de aderência
    observacoes: string
    ajusteRealizado?: string
  }[]
}
```

### 6.6 Ciclo de Revisão

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    CICLO DE REVISÃO DOS PLANOS                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  📅 SEMANAL                                                         │   │
│  │     • Atleta registra feedback da dieta                            │   │
│  │     • VITRÚVIO analisa peso e aderência                            │   │
│  │     • Ajustes pequenos na dieta se necessário                      │   │
│  │                                                                     │   │
│  │  📅 MENSAL                                                          │   │
│  │     • Nova avaliação de medidas (opcional mas recomendado)         │   │
│  │     • VITRÚVIO gera novo plano de dieta                            │   │
│  │     • Revisão de progresso no treino                               │   │
│  │                                                                     │   │
│  │  📅 TRIMESTRAL                                                      │   │
│  │     • Avaliação completa obrigatória                               │   │
│  │     • VITRÚVIO gera novo plano de treino                           │   │
│  │     • Análise de evolução de score                                 │   │
│  │     • Ajuste de grupos prioritários                                │   │
│  │                                                                     │   │
│  │  📅 SEMESTRAL                                                       │   │
│  │     • Checkpoint da meta anual                                     │   │
│  │     • Reavaliação de estratégia geral                              │   │
│  │     • Ajuste de metas se necessário                                │   │
│  │                                                                     │   │
│  │  📅 ANUAL                                                           │   │
│  │     • Balanço completo da transformação                            │   │
│  │     • Celebração de conquistas                                     │   │
│  │     • Definição de nova meta anual                                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. MODELO DE SUPERVISÃO (Resumo)

### 7.1 Regra de Aprovação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  REGRA DE APROVAÇÃO DE PLANOS                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ATLETA COM PERSONAL VINCULADO                                     │   │
│  │  ────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  VITRÚVIO gera plano                                               │   │
│  │       │                                                             │   │
│  │       ▼                                                             │   │
│  │  PERSONAL revisa e aprova/ajusta                                   │   │
│  │       │                                                             │   │
│  │       ▼                                                             │   │
│  │  ATLETA recebe plano aprovado                                      │   │
│  │                                                                     │   │
│  │  * VITRÚVIO respeita metodologia do Personal                       │   │
│  │  * VITRÚVIO pode sugerir fora da metodologia (destacado)           │   │
│  │  * Personal tem palavra final                                      │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ATLETA SEM PERSONAL (Contratou VITRU direto)                      │   │
│  │  ────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  VITRÚVIO gera plano                                               │   │
│  │       │                                                             │   │
│  │       ▼                                                             │   │
│  │  ATLETA revisa e aceita/pede ajuste                                │   │
│  │                                                                     │   │
│  │  * VITRÚVIO usa melhores práticas gerais                           │   │
│  │  * VITRÚVIO recomenda consultar profissional                       │   │
│  │  * Atleta é responsável pela execução                              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 Detalhes completos: ver SPEC_APROVACAO_PLANOS.md                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. TIPOS DE INTERAÇÃO

### 8.1 Modos do VITRÚVIO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                      MODOS DE INTERAÇÃO COM VITRÚVIO                        │
│                                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │                 │ │                 │ │                 │               │
│  │  🔍 DIAGNÓSTICO │ │  🏋️ TREINO      │ │  🍽️ DIETA       │               │
│  │                 │ │                 │ │                 │               │
│  │  Análise        │ │  Criar plano    │ │  Criar plano    │               │
│  │  completa do    │ │  trimestral     │ │  mensal         │               │
│  │  físico atual   │ │                 │ │                 │               │
│  │                 │ │  Requer         │ │  Requer         │               │
│  │  Não requer     │ │  aprovação      │ │  aprovação      │               │
│  │  aprovação      │ │                 │ │                 │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │                 │ │                 │ │                 │               │
│  │  💬 CHAT        │ │  📊 EVOLUÇÃO    │ │  ⚡ QUICK       │               │
│  │                 │ │                 │ │                 │               │
│  │  Conversa       │ │  Análise de     │ │  Perguntas      │               │
│  │  livre sobre    │ │  progresso ao   │ │  rápidas        │               │
│  │  qualquer tema  │ │  longo do tempo │ │  pré-definidas  │               │
│  │                 │ │                 │ │                 │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Detalhamento dos Modos

| Modo | Objetivo | Requer Aprovação | Usa Contexto |
|------|----------|:----------------:|:------------:|
| 🔍 Diagnóstico | Analisar físico atual | ❌ | ✅ |
| 🏋️ Treino | Criar plano trimestral | ✅ | ✅ |
| 🍽️ Dieta | Criar plano mensal | ✅ | ✅ |
| 💬 Chat | Conversa livre | ❌ | ✅ |
| 📊 Evolução | Analisar progresso | ❌ | ✅ |
| ⚡ Quick | Respostas rápidas | ❌ | ✅ |

---

## 9. PROMPT BASE (System Prompt)

```typescript
const SYSTEM_PROMPT_VITRUVIO = `
# VOCÊ É O VITRÚVIO IA

Coach virtual inteligente do VITRU IA, especialista em proporções corporais baseadas na Proporção Áurea.

## SUA IDENTIDADE

Nome inspirado no "Homem Vitruviano" de Leonardo da Vinci. Você combina:
- Conhecimento científico profundo
- Abordagem motivadora e empática
- Honestidade construtiva
- Respeito pela individualidade

## PRINCÍPIOS

1. PERSONALIZAÇÃO: Cada resposta é única para o atleta
2. AÇÃO: Sempre termine com algo prático
3. CONTEXTO: Use TODAS as informações disponíveis do atleta
4. MOTIVAÇÃO: Celebre conquistas, mesmo pequenas
5. HONESTIDADE: Aponte problemas de forma construtiva
6. RESPEITO: Respeite o Personal e sua metodologia

## LIMITES

- NÃO prescreva medicamentos ou dosagens de anabolizantes
- NÃO diagnostique lesões ou doenças
- NÃO substitua profissionais de saúde
- NÃO ignore o contexto de saúde do atleta
- SEMPRE considere lesões e restrições ao sugerir exercícios

## DADOS DO ATLETA

### Ficha Básica
{{ficha_atleta}}

### Avaliação Atual
{{avaliacao_atual}}

### CONTEXTO (IMPORTANTE - Use essas informações!)
{{contexto_atleta}}

### Histórico de Avaliações
{{historico_avaliacoes}}

### Insights Acumulados
{{insights_vitruvio}}

### Metodologia do Personal (se houver)
{{metodologia_personal}}

## TOM DE VOZ

- Informal mas profissional
- Use "você"
- Emojis com moderação
- Adaptado ao contexto emocional

## INSTRUÇÕES ESPECÍFICAS

{{instrucoes_modo}}
`
```

---

## 10. BANCO DE DADOS

### 10.1 Tabela: contexto_atleta

```sql
CREATE TABLE contexto_atleta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
  
  -- 8 campos de contexto (JSONB para flexibilidade)
  problemas_saude JSONB,
  medicacoes_uso JSONB,
  dores_lesoes JSONB,
  exames JSONB,
  estilo_vida JSONB,
  profissao JSONB,
  historico_treino JSONB,
  historico_dietas JSONB,
  
  -- Controle
  campos_preenchidos INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_por VARCHAR(20), -- 'ATLETA' ou 'PERSONAL'
  
  UNIQUE(atleta_id)
);
```

### 10.2 Tabela: insights_vitruvio

```sql
CREATE TABLE insights_vitruvio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
  
  -- Insights estruturados (JSONB)
  treino JSONB,
  dieta JSONB,
  comportamento JSONB,
  fisico JSONB,
  
  -- Notas livres
  notas JSONB, -- Array de {data, nota, fonte}
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(atleta_id)
);
```

### 10.3 Tabela: metas_anuais

```sql
CREATE TABLE metas_anuais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
  
  ano INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  
  objetivo JSONB NOT NULL,
  metricas JSONB NOT NULL,
  
  status VARCHAR(20) DEFAULT 'ATIVA',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10.4 Tabela: planos_treino

```sql
CREATE TABLE planos_treino (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
  meta_semestral_id UUID REFERENCES metas_semestrais(id),
  
  trimestre INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  
  divisao VARCHAR(20) NOT NULL,
  frequencia_semanal INTEGER NOT NULL,
  foco JSONB NOT NULL,
  periodizacao JSONB NOT NULL,
  semanas JSONB NOT NULL, -- Array de PlanoSemanal
  
  status VARCHAR(30) DEFAULT 'RASCUNHO',
  aprovacao JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10.5 Tabela: planos_dieta

```sql
CREATE TABLE planos_dieta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
  plano_treino_id UUID REFERENCES planos_treino(id),
  
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  
  estrategia JSONB NOT NULL,
  refeicoes JSONB NOT NULL,
  refeicao_livre JSONB,
  checkpoints JSONB,
  
  status VARCHAR(30) DEFAULT 'RASCUNHO',
  aprovacao JSONB,
  feedbacks JSONB, -- Array de feedback semanal
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 11. RESUMO EXECUTIVO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    VITRÚVIO IA - RESUMO v2.0                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🧠 O QUE É                                                         │   │
│  │     Coach virtual baseado na Proporção Áurea                       │   │
│  │                                                                     │   │
│  │  📋 CONTEXTO (8 campos)                                             │   │
│  │     Problemas de Saúde • Medicações • Dores/Lesões • Exames        │   │
│  │     Estilo de Vida • Profissão • Histórico Treino • Histórico Dieta│   │
│  │                                                                     │   │
│  │  🧠 MEMÓRIA                                                         │   │
│  │     Aprende com interações e gera insights sobre o atleta          │   │
│  │                                                                     │   │
│  │  📅 CICLOS DE PLANEJAMENTO                                          │   │
│  │     • Meta Anual (12 meses) - transformação                        │   │
│  │     • Meta Semestral (6 meses) - checkpoints                       │   │
│  │     • Plano Treino Trimestral (12 semanas)                         │   │
│  │     • Plano Dieta Mensal (4 semanas)                               │   │
│  │                                                                     │   │
│  │  ✅ SUPERVISÃO                                                      │   │
│  │     • Com Personal → Personal aprova                               │   │
│  │     • Sem Personal → Atleta aceita                                 │   │
│  │                                                                     │   │
│  │  🎯 MODOS                                                           │   │
│  │     Diagnóstico • Treino • Dieta • Chat • Evolução • Quick         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 SPECs RELACIONADAS (criar separadamente):                               │
│     • SPEC_METODOLOGIA_PERSONAL.md                                         │
│     • SPEC_APROVACAO_PLANOS.md                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |
| 2.0 | Fev/2026 | Adicionado CONTEXTO (8 campos), Sistema de Memória, Ciclos de Planejamento revisados (Treino Trimestral, Dieta Mensal), Removidos fluxos para SPECs separadas |

---

**VITRU IA - VITRÚVIO IA Coach v2.0**