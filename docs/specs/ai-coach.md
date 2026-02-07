# SPEC: VITRÚVIO - VITRU IA (v2.0)

## Documento de Especificação do VITRÚVIO

**Versão:** 2.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (A Matemática do Físico Perfeito)

---

## 1. VISÃO GERAL

O **VITRÚVIO** é o diferencial competitivo do VITRU IA. Não somos apenas uma calculadora de proporções - somos um **coach virtual inteligente** que analisa, orienta e motiva o atleta em sua jornada para o físico ideal.

### 1.0 Origem do Nome

> **VITRÚVIO** é inspirado em **Marcus Vitruvius Pollio**, o arquiteto romano do século I a.C. que definiu as proporções ideais do corpo humano em sua obra "De Architectura". Seus estudos sobre simetria e proporção inspiraram Leonardo da Vinci a criar o icônico **Homem Vitruviano** - a representação perfeita das proporções humanas que fundamenta toda a filosofia do VITRU IA.

### 1.1 Missão do VITRÚVIO

> "Transformar dados em planos de ação personalizados que ajudem o atleta a entender seu corpo, otimizar seu treino e dieta, e atingir seu físico ideal da forma mais eficiente possível."

### 1.2 Princípios do VITRÚVIO

| Princípio | Descrição |
|-----------|-----------|
| **Personalizado** | Cada análise considera o contexto completo do usuário |
| **Acionável** | Sempre gera planos concretos de treino e dieta |
| **Seguro** | Considera saúde, lesões e medicamentos |
| **Motivador** | Celebra vitórias, mesmo pequenas |
| **Honesto** | Aponta problemas sem ser desmotivador |
| **Educativo** | Explica o "porquê" das recomendações |
| **Contextual** | Considera histórico, metas, rotina e limitações |

### 1.3 Capacidades do VITRÚVIO (v2.0)

```
┌─────────────────────────────────────────────────────────────────┐
│                         VITRÚVIO v2.0                           │
│                    Coach IA do VITRU IA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 ANÁLISE           📈 EVOLUÇÃO          🎯 RECOMENDAÇÕES     │
│  • Proporções         • Tendências         • Treino            │
│  • Simetria           • Comparativos       • Dieta             │
│  • Estética           • Projeções          • Prioridades       │
│  • Diagnóstico        • Marcos             • Metas             │
│                                                                 │
│  🏋️ PLANO DE TREINO   🥗 PLANO ALIMENTAR   👤 CONTEXTO RICO    │
│  • Divisão semanal    • Calorias/macros    • Saúde/lesões      │
│  • Exercícios foco    • Refeições          • Medicamentos      │
│  • Correção simetria  • Timing nutrientes  • Rotina de vida    │
│  • Progressão         • Suplementação      • Disponibilidade   │
│                                                                 │
│  💬 COMUNICAÇÃO       🏆 MOTIVAÇÃO         ⚠️ ALERTAS          │
│  • Insights diários   • Conquistas         • Assimetrias       │
│  • Relatórios         • Streaks            • Regressões        │
│  • Chat interativo    • Celebrações        • Saúde/segurança   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Fluxo Principal (NOVO)

```
┌─────────────────────────────────────────────────────────────────┐
│                    JORNADA COMPLETA DO USUÁRIO                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ ONBOARDING COMPLETO                                         │
│     └─▶ Coleta contexto rico (saúde, vida, objetivos)          │
│                              ▼                                  │
│  2️⃣ AVALIAÇÃO IA                                                │
│     └─▶ Usuário insere medidas corporais                       │
│                              ▼                                  │
│  3️⃣ RESULTADOS                                                  │
│     └─▶ Scores, proporções, simetria, diagnóstico              │
│                              ▼                                  │
│  4️⃣ VITRÚVIO PROCESSA                                           │
│     └─▶ Cruza resultados + contexto completo                   │
│                              ▼                                  │
│  5️⃣ PLANO PERSONALIZADO                                         │
│     └─▶ Treino específico + Dieta específica + Timeline        │
│                              ▼                                  │
│  6️⃣ ACOMPANHAMENTO                                              │
│     └─▶ Insights diários, ajustes, reavaliações               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. PERFIL COMPLETO DO USUÁRIO (NOVO)

### 2.1 UserHealthProfile

O VITRÚVIO precisa de um contexto rico para gerar recomendações precisas e seguras.

```typescript
interface UserHealthProfile {
  // ============================================
  // DADOS BÁSICOS
  // ============================================
  idade: number
  genero: 'masculino' | 'feminino' | 'outro'
  altura: number                      // cm
  pesoAtual: number                   // kg
  
  // ============================================
  // COMPOSIÇÃO CORPORAL
  // ============================================
  gorduraCorporal?: number            // %
  pesoMeta?: number                   // kg
  massaMagra?: number                 // kg (calculado)
  
  // ============================================
  // PERFIL DE VIDA
  // ============================================
  profissao: string                   // "Programador", "Pedreiro", etc
  rotinaDiaria: RotinaDiaria          // Nível de atividade no trabalho
  horasSono: number                   // Média por noite
  qualidadeSono: 'ruim' | 'regular' | 'boa' | 'excelente'
  nivelEstresse: NivelEstresse
  horasTrabalho: number               // Horas por dia
  trabalhoFisico: boolean             // Se trabalho envolve esforço físico
  
  // ============================================
  // SAÚDE E CONDIÇÕES MÉDICAS
  // ============================================
  condicoesSaude: CondicaoSaude[]
  lesoes: Lesao[]
  alergias: string[]
  restricoesMovimento: string[]       // "Não pode fazer supino", etc
  
  // ============================================
  // FÁRMACOS E SUPLEMENTOS
  // ============================================
  medicamentos: Medicamento[]
  suplementos: Suplemento[]
  usaEsteroides: boolean
  trt: boolean                        // Terapia de reposição de testosterona
  esteroidesDetalhes?: string         // Confidencial
  
  // ============================================
  // EXPERIÊNCIA DE TREINO
  // ============================================
  tempoTreinando: ExperienciaTreino
  frequenciaTreinoAtual: number       // Dias por semana atual
  frequenciaTreinoDesejada: number    // Dias que quer/pode treinar
  duracaoTreinoMax: number            // Minutos máximo por sessão
  localTreino: LocalTreino
  equipamentosDisponiveis: string[]   // Lista de equipamentos
  treinoAtual?: string                // Descrição do treino atual
  
  // ============================================
  // PREFERÊNCIAS ALIMENTARES
  // ============================================
  dietaAtual: TipoDieta
  refeicoesdia: number                // Quantas refeições faz/quer fazer
  cozinha: boolean                    // Sabe/pode cozinhar
  tempoPreparoRefeicao: number        // Minutos disponíveis
  orcamentoAlimentacao: Orcamento
  alimentosEvitar: string[]           // Não gosta ou não pode
  alimentosPreferidos: string[]       // Prefere comer
  fazJejum: boolean
  horarioJejum?: string               // "16:8", "20:4", etc
  
  // ============================================
  // OBJETIVOS
  // ============================================
  objetivoPrincipal: ObjetivoPrincipal
  objetivoEspecifico: string          // Texto livre
  prazo: PrazoObjetivo
  prioridades: string[]               // ["Aumentar ombros", "Reduzir cintura"]
  competicao: boolean                 // Pretende competir?
  categoriaInteresse?: string         // "Classic Physique", "Men's Physique"
  
  // ============================================
  // DISPONIBILIDADE
  // ============================================
  diasDisponiveisTreino: DiaSemana[]
  horarioPreferido: HorarioTreino
  tempoMaximoTreino: number           // Minutos
  treinarEmCasa: boolean              // Pode/quer treinar em casa também
  
  // ============================================
  // HISTÓRICO
  // ============================================
  pesoMaximoHistorico?: number
  pesoMinimoHistorico?: number
  melhorFormaFisica?: string          // Descrição de quando estava melhor
  tentativasAnteriores?: string       // O que já tentou e não funcionou
}
```

### 2.2 Tipos Auxiliares

```typescript
// Enums de Rotina
enum RotinaDiaria {
  SEDENTARIA = 'sedentaria',          // Trabalho sentado, pouco movimento
  LEVE = 'leve',                      // Trabalho sentado, caminha às vezes
  MODERADA = 'moderada',              // Trabalho em pé, movimento moderado
  ATIVA = 'ativa',                    // Trabalho físico leve
  MUITO_ATIVA = 'muito_ativa'         // Trabalho físico intenso
}

enum NivelEstresse {
  BAIXO = 'baixo',
  MODERADO = 'moderado',
  ALTO = 'alto',
  MUITO_ALTO = 'muito_alto'
}

// Saúde
interface CondicaoSaude {
  nome: string                        // "Diabetes tipo 2"
  severidade: 'leve' | 'moderada' | 'grave'
  controlada: boolean
  medicacao?: string                  // Medicamento usado
  observacoes?: string
}

interface Lesao {
  local: string                       // "Ombro esquerdo"
  tipo: string                        // "Tendinite"
  dataOcorrencia?: Date
  recuperada: boolean
  restricoes: string[]                // ["Evitar press acima da cabeça"]
  observacoes?: string
}

interface Medicamento {
  nome: string                        // "Losartana"
  principioAtivo?: string             // "Losartana potássica"
  dosagem: string                     // "50mg"
  frequencia: string                  // "1x ao dia"
  horario?: string                    // "Manhã"
  motivo: string                      // "Pressão alta"
  efeitosColaterais?: string[]        // Efeitos que o usuário sente
}

interface Suplemento {
  nome: string                        // "Whey Protein"
  marca?: string
  dosagem: string                     // "30g"
  frequencia: string                  // "Pós-treino"
  objetivo: string                    // "Aumento de proteína"
}

// Treino
enum ExperienciaTreino {
  INICIANTE = 'iniciante',            // < 1 ano
  INTERMEDIARIO = 'intermediario',    // 1-3 anos
  AVANCADO = 'avancado',              // 3-5 anos
  EXPERIENTE = 'experiente',          // 5-10 anos
  VETERANO = 'veterano'               // 10+ anos
}

enum LocalTreino {
  ACADEMIA_COMPLETA = 'academia_completa',
  ACADEMIA_SIMPLES = 'academia_simples',
  HOME_GYM = 'home_gym',
  CASA_BASICO = 'casa_basico',        // Só peso corporal / elásticos
  MISTO = 'misto'
}

// Alimentação
enum TipoDieta {
  SEM_RESTRICAO = 'sem_restricao',
  VEGETARIANA = 'vegetariana',
  VEGANA = 'vegana',
  PESCETARIANA = 'pescetariana',
  LOW_CARB = 'low_carb',
  CETOGENICA = 'cetogenica',
  MEDITERRANEA = 'mediterranea',
  FLEXIVEL = 'flexivel',              // IIFYM
  OUTRA = 'outra'
}

enum Orcamento {
  BAIXO = 'baixo',                    // Precisa economizar
  MODERADO = 'moderado',              // Normal
  ALTO = 'alto',                      // Pode investir mais
  SEM_LIMITE = 'sem_limite'           // Orçamento não é problema
}

// Objetivos
enum ObjetivoPrincipal {
  ESTETICA = 'estetica',              // Melhorar aparência
  HIPERTROFIA = 'hipertrofia',        // Ganhar massa muscular
  DEFINICAO = 'definicao',            // Perder gordura mantendo músculo
  RECOMPOSICAO = 'recomposicao',      // Perder gordura e ganhar músculo
  FORCA = 'forca',                    // Ficar mais forte
  SAUDE = 'saude',                    // Melhorar saúde geral
  COMPETICAO = 'competicao',          // Preparar para competição
  MANUTENCAO = 'manutencao'           // Manter físico atual
}

enum PrazoObjetivo {
  CURTO = '3meses',
  MEDIO = '6meses',
  LONGO = '1ano',
  MUITO_LONGO = '2anos',
  SEM_PRAZO = 'sem_prazo'
}

enum HorarioTreino {
  MANHA_CEDO = 'manha_cedo',          // 5h-7h
  MANHA = 'manha',                    // 7h-11h
  ALMOCO = 'almoco',                  // 11h-14h
  TARDE = 'tarde',                    // 14h-18h
  NOITE = 'noite',                    // 18h-22h
  MADRUGADA = 'madrugada',            // 22h-5h
  FLEXIVEL = 'flexivel'
}

type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo'
```

### 2.3 Schema Prisma (Adições)

```prisma
// ============================================
// PROFILE (Expandido)
// ============================================

model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique
  
  // Dados Básicos (existente)
  birthDate       DateTime?
  gender          Gender   @default(MALE)
  altura          Float?
  punho           Float?
  tornozelo       Float?
  joelho          Float?
  pelve           Float?
  
  // NOVO: Perfil de Vida
  profissao           String?
  rotinaDiaria        RotinaDiaria?
  horasSono           Float?
  qualidadeSono       QualidadeSono?
  nivelEstresse       NivelEstresse?
  horasTrabalho       Float?
  trabalhoFisico      Boolean   @default(false)
  
  // NOVO: Experiência de Treino
  tempoTreinando          ExperienciaTreino?
  frequenciaTreinoAtual   Int?
  frequenciaTreinoDesejada Int?
  duracaoTreinoMax        Int?
  localTreino             LocalTreino?
  equipamentos            String[]
  treinoAtual             String?
  
  // NOVO: Alimentação
  dietaAtual              TipoDieta?
  refeicoesdia            Int?
  cozinha                 Boolean?
  tempoPreparoRefeicao    Int?
  orcamentoAlimentacao    Orcamento?
  alimentosEvitar         String[]
  alimentosPreferidos     String[]
  fazJejum                Boolean   @default(false)
  horarioJejum            String?
  
  // NOVO: Objetivos
  objetivoPrincipal       ObjetivoPrincipal?
  objetivoEspecifico      String?
  prazo                   PrazoObjetivo?
  prioridades             String[]
  competicao              Boolean   @default(false)
  categoriaInteresse      String?
  
  // NOVO: Disponibilidade
  diasDisponiveisTreino   String[]
  horarioPreferido        HorarioTreino?
  treinarEmCasa           Boolean   @default(false)
  
  // NOVO: Histórico
  pesoMaximoHistorico     Float?
  pesoMinimoHistorico     Float?
  melhorFormaFisica       String?
  tentativasAnteriores    String?
  
  // NOVO: Ergogênicos
  usaEsteroides           Boolean   @default(false)
  trt                     Boolean   @default(false)
  esteroidesDetalhes      String?   // Criptografado
  
  // Preferências (existente)
  unitSystem      UnitSystem @default(METRIC)
  preferredMethod ProportionMethod @default(GOLDEN_RATIO)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("profiles")
}

// ============================================
// CONDIÇÕES DE SAÚDE (NOVO)
// ============================================

model CondicaoSaude {
  id              String   @id @default(cuid())
  userId          String
  
  nome            String
  severidade      Severidade  @default(LEVE)
  controlada      Boolean     @default(false)
  medicacao       String?
  observacoes     String?
  
  ativo           Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("condicoes_saude")
}

// ============================================
// LESÕES (NOVO)
// ============================================

model Lesao {
  id              String   @id @default(cuid())
  userId          String
  
  local           String              // "Ombro esquerdo"
  tipo            String              // "Tendinite"
  dataOcorrencia  DateTime?
  recuperada      Boolean   @default(false)
  restricoes      String[]            // Exercícios a evitar
  observacoes     String?
  
  ativo           Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("lesoes")
}

// ============================================
// MEDICAMENTOS (NOVO)
// ============================================

model Medicamento {
  id              String   @id @default(cuid())
  userId          String
  
  nome            String
  principioAtivo  String?
  dosagem         String
  frequencia      String
  horario         String?
  motivo          String
  efeitosColaterais String[]
  
  ativo           Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("medicamentos")
}

// ============================================
// SUPLEMENTOS (NOVO)
// ============================================

model Suplemento {
  id              String   @id @default(cuid())
  userId          String
  
  nome            String
  marca           String?
  dosagem         String
  frequencia      String
  objetivo        String
  
  ativo           Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("suplementos")
}

// ============================================
// ENUMS NOVOS
// ============================================

enum RotinaDiaria {
  SEDENTARIA
  LEVE
  MODERADA
  ATIVA
  MUITO_ATIVA
}

enum QualidadeSono {
  RUIM
  REGULAR
  BOA
  EXCELENTE
}

enum NivelEstresse {
  BAIXO
  MODERADO
  ALTO
  MUITO_ALTO
}

enum ExperienciaTreino {
  INICIANTE
  INTERMEDIARIO
  AVANCADO
  EXPERIENTE
  VETERANO
}

enum LocalTreino {
  ACADEMIA_COMPLETA
  ACADEMIA_SIMPLES
  HOME_GYM
  CASA_BASICO
  MISTO
}

enum TipoDieta {
  SEM_RESTRICAO
  VEGETARIANA
  VEGANA
  PESCETARIANA
  LOW_CARB
  CETOGENICA
  MEDITERRANEA
  FLEXIVEL
  OUTRA
}

enum Orcamento {
  BAIXO
  MODERADO
  ALTO
  SEM_LIMITE
}

enum ObjetivoPrincipal {
  ESTETICA
  HIPERTROFIA
  DEFINICAO
  RECOMPOSICAO
  FORCA
  SAUDE
  COMPETICAO
  MANUTENCAO
}

enum PrazoObjetivo {
  TRES_MESES
  SEIS_MESES
  UM_ANO
  DOIS_ANOS
  SEM_PRAZO
}

enum HorarioTreino {
  MANHA_CEDO
  MANHA
  ALMOCO
  TARDE
  NOITE
  MADRUGADA
  FLEXIVEL
}

enum Severidade {
  LEVE
  MODERADA
  GRAVE
}
```

---

## 3. ARQUITETURA DO SISTEMA (Atualizada)

### 3.1 Pipeline de Processamento

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  DADOS COMPLETOS │────▶│  ANÁLISE E       │────▶│  GERAÇÃO DE      │
│  DO USUÁRIO      │     │  CRUZAMENTO      │     │  PLANOS          │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
  • Medidas corporais      • Scores proporções     • Plano de treino
  • Perfil de saúde        • Gaps identificados    • Plano alimentar
  • Condições médicas      • Prioridades           • Recomendações
  • Medicamentos           • Restrições saúde      • Timeline
  • Rotina de vida         • Análise de risco      • Alertas segurança
  • Objetivos              • Contexto cruzado      • Ajustes periódicos
```

### 3.2 Componentes do Sistema

```typescript
interface AICoachSystem {
  // ============================================
  // COLETORES DE CONTEXTO (NOVO)
  // ============================================
  collectors: {
    profile: ProfileCollector           // Coleta dados do perfil
    health: HealthCollector             // Coleta condições de saúde
    medications: MedicationCollector    // Coleta medicamentos
    lifestyle: LifestyleCollector       // Coleta dados de rotina
    goals: GoalCollector                // Coleta objetivos
  }
  
  // ============================================
  // ANALISADORES
  // ============================================
  analyzers: {
    proportions: ProportionAnalyzer     // Analisa proporções vs ideais
    symmetry: SymmetryAnalyzer          // Analisa simetria bilateral
    evolution: EvolutionAnalyzer        // Analisa tendências temporais
    aesthetic: AestheticAnalyzer        // Diagnóstico estético geral
    risk: RiskAnalyzer                  // NOVO: Analisa riscos de saúde
    readiness: ReadinessAnalyzer        // NOVO: Analisa prontidão para treino
  }
  
  // ============================================
  // GERADORES DE CONTEÚDO
  // ============================================
  generators: {
    insights: InsightGenerator          // Gera insights diários
    reports: ReportGenerator            // Gera relatórios semanais
    recommendations: RecommendationGenerator
    alerts: AlertGenerator
    
    // NOVOS
    training: TrainingPlanGenerator     // Gera plano de treino
    nutrition: NutritionPlanGenerator   // Gera plano alimentar
    periodization: PeriodizationGenerator // Gera periodização
  }
  
  // ============================================
  // PERSONALIZADOR
  // ============================================
  personalizer: {
    tone: ToneAdapter                   // Adapta tom de voz
    context: ContextBuilder             // Constrói contexto completo
    history: HistoryManager             // Gerencia histórico
    safety: SafetyChecker               // NOVO: Verifica segurança
  }
}
```

### 3.3 Context Builder (NOVO)

O Context Builder é responsável por montar o contexto completo para a IA.

```typescript
class ContextBuilder {
  
  async buildFullContext(userId: string): Promise<AIContext> {
    // Buscar todos os dados do usuário
    const [
      user,
      profile,
      condicoes,
      lesoes,
      medicamentos,
      suplementos,
      latestMeasurement,
      measurementHistory,
      scores,
      goals
    ] = await Promise.all([
      this.getUser(userId),
      this.getProfile(userId),
      this.getCondicoesSaude(userId),
      this.getLesoes(userId),
      this.getMedicamentos(userId),
      this.getSuplementos(userId),
      this.getLatestMeasurement(userId),
      this.getMeasurementHistory(userId, 90), // últimos 90 dias
      this.getLatestScores(userId),
      this.getGoals(userId)
    ])
    
    // Calcular métricas derivadas
    const idade = this.calcularIdade(profile.birthDate)
    const tmb = this.calcularTMB(profile, latestMeasurement)
    const tdee = this.calcularTDEE(tmb, profile.rotinaDiaria, profile.frequenciaTreinoAtual)
    const nivelExperiencia = this.classificarExperiencia(profile.tempoTreinando)
    
    // Identificar restrições
    const restricoes = this.identificarRestricoes(lesoes, condicoes, medicamentos)
    
    // Montar contexto estruturado
    return {
      // Identificação
      nome: user.name,
      idade,
      genero: profile.gender,
      
      // Físico atual
      fisico: {
        altura: profile.altura,
        peso: latestMeasurement?.peso,
        gordura: latestMeasurement?.gorduraCorporal,
        massaMagra: this.calcularMassaMagra(latestMeasurement),
      },
      
      // Resultados da avaliação
      avaliacao: {
        scoreGeral: scores?.scoreTotal,
        classificacao: scores?.classificacao,
        ratio: this.calcularRatio(latestMeasurement, profile),
        metodo: profile.preferredMethod,
        pontosFracos: this.identificarPontosFracos(scores),
        pontosFortes: this.identificarPontosFortes(scores),
        assimetrias: this.identificarAssimetrias(latestMeasurement),
      },
      
      // Contexto de vida
      vida: {
        profissao: profile.profissao,
        rotina: profile.rotinaDiaria,
        horasSono: profile.horasSono,
        qualidadeSono: profile.qualidadeSono,
        estresse: profile.nivelEstresse,
        horasTrabalho: profile.horasTrabalho,
      },
      
      // Saúde
      saude: {
        condicoes: condicoes.filter(c => c.ativo),
        lesoes: lesoes.filter(l => l.ativo && !l.recuperada),
        lesoesRecuperadas: lesoes.filter(l => l.recuperada),
        alergias: profile.alergias || [],
        restricoesMovimento: restricoes.movimento,
      },
      
      // Fármacos
      farmacos: {
        medicamentos: medicamentos.filter(m => m.ativo),
        suplementos: suplementos.filter(s => s.ativo),
        usaEsteroides: profile.usaEsteroides,
        trt: profile.trt,
        interacoesAlerta: this.verificarInteracoes(medicamentos, suplementos),
      },
      
      // Treino
      treino: {
        experiencia: profile.tempoTreinando,
        nivelExperiencia,
        frequenciaAtual: profile.frequenciaTreinoAtual,
        frequenciaDesejada: profile.frequenciaTreinoDesejada,
        duracaoMax: profile.duracaoTreinoMax,
        local: profile.localTreino,
        equipamentos: profile.equipamentos || [],
        diasDisponiveis: profile.diasDisponiveisTreino || [],
        horario: profile.horarioPreferido,
        treinoAtual: profile.treinoAtual,
      },
      
      // Alimentação
      alimentacao: {
        dieta: profile.dietaAtual,
        refeicoes: profile.refeicoesdia,
        cozinha: profile.cozinha,
        tempoPreparo: profile.tempoPreparoRefeicao,
        orcamento: profile.orcamentoAlimentacao,
        evitar: profile.alimentosEvitar || [],
        preferidos: profile.alimentosPreferidos || [],
        jejum: profile.fazJejum,
        horarioJejum: profile.horarioJejum,
        alergias: profile.alergias || [],
      },
      
      // Objetivos
      objetivo: {
        principal: profile.objetivoPrincipal,
        especifico: profile.objetivoEspecifico,
        prazo: profile.prazo,
        prioridades: profile.prioridades || [],
        competicao: profile.competicao,
        categoria: profile.categoriaInteresse,
        metas: goals,
      },
      
      // Métricas calculadas
      metricas: {
        tmb,
        tdee,
        caloriasGanho: tdee + 300,
        caloriasPerca: tdee - 500,
        caloriasManutencao: tdee,
        proteinaMinima: latestMeasurement?.peso * 1.6,
        proteinaIdeal: latestMeasurement?.peso * 2.0,
        proteinaMaxima: latestMeasurement?.peso * 2.4,
      },
      
      // Restrições consolidadas
      restricoes: {
        exercicios: restricoes.exercicios,
        movimentos: restricoes.movimento,
        alimentos: restricoes.alimentos,
        intensidade: restricoes.intensidade,
        alertas: restricoes.alertas,
      },
      
      // Histórico
      historico: {
        medicoes: measurementHistory.length,
        tendencia: this.calcularTendencia(measurementHistory),
        melhorScore: this.getMelhorScore(measurementHistory),
        consistencia: this.calcularConsistencia(measurementHistory),
      },
    }
  }
  
  private identificarRestricoes(
    lesoes: Lesao[],
    condicoes: CondicaoSaude[],
    medicamentos: Medicamento[]
  ): Restricoes {
    const restricoes: Restricoes = {
      exercicios: [],
      movimento: [],
      alimentos: [],
      intensidade: null,
      alertas: [],
    }
    
    // Restrições por lesões
    for (const lesao of lesoes.filter(l => !l.recuperada)) {
      restricoes.exercicios.push(...(lesao.restricoes || []))
      restricoes.alertas.push(`Lesão ativa: ${lesao.tipo} em ${lesao.local}`)
    }
    
    // Restrições por condições de saúde
    for (const condicao of condicoes) {
      if (condicao.nome.toLowerCase().includes('cardíac') || 
          condicao.nome.toLowerCase().includes('coração')) {
        restricoes.intensidade = 'moderada'
        restricoes.alertas.push('Condição cardíaca: evitar intensidade muito alta')
      }
      
      if (condicao.nome.toLowerCase().includes('diabetes')) {
        restricoes.alertas.push('Diabetes: monitorar glicemia, evitar jejum prolongado')
      }
      
      if (condicao.nome.toLowerCase().includes('pressão') ||
          condicao.nome.toLowerCase().includes('hipertensão')) {
        restricoes.alertas.push('Hipertensão: evitar valsalva excessiva, monitorar pressão')
      }
    }
    
    // Restrições por medicamentos
    for (const med of medicamentos) {
      if (med.nome.toLowerCase().includes('anticoagulante')) {
        restricoes.alertas.push('Anticoagulante: cuidado com impactos e lesões')
      }
      
      if (med.motivo.toLowerCase().includes('pressão')) {
        restricoes.alertas.push('Medicamento para pressão: monitorar durante treino')
      }
    }
    
    return restricoes
  }
}
```

---

## 4. GERAÇÃO DE PLANO DE TREINO (NOVO)

### 4.1 Estrutura do Plano de Treino

```typescript
interface PlanoTreino {
  // Metadata
  id: string
  userId: string
  criadoEm: Date
  validoAte: Date                     // Quando deve ser reavaliado
  versao: number
  
  // Visão geral
  visaoGeral: {
    titulo: string                    // "Plano Hipertrofia - Foco V-Taper"
    descricao: string
    duracao: string                   // "8 semanas"
    objetivo: string
    divisao: DivisaoTreino
    diasPorSemana: number
  }
  
  // Dias de treino
  dias: DiaTreino[]
  
  // Prioridades baseadas na avaliação
  prioridades: {
    musculosFoco: string[]            // ["Deltóide lateral", "Peitoral superior"]
    correcaoSimetria: CorrecaoSimetria[]
    manutencao: string[]              // Músculos para manter
  }
  
  // Progressão
  progressao: {
    semana1a2: string                 // Descrição da fase
    semana3a4: string
    semana5a6: string
    semana7a8: string
    deload: string                    // Quando e como fazer deload
  }
  
  // Alertas de segurança
  alertas: AlertaSeguranca[]
  
  // Ajustes personalizados
  ajustes: {
    porLesao: AjusteLesao[]
    porCondicao: AjusteCondicao[]
    porMedicamento: AjusteMedicamento[]
  }
}

interface DiaTreino {
  dia: DiaSemana
  nome: string                        // "Push A - Ênfase Ombros"
  gruposMusculares: string[]
  duracaoEstimada: number             // minutos
  
  aquecimento: Exercicio[]
  exerciciosPrincipais: Exercicio[]
  exerciciosAcessorios: Exercicio[]
  finalizacao: Exercicio[]
  
  observacoes: string[]
  substituicoes: Substituicao[]       // Alternativas se não tiver equipamento
}

interface Exercicio {
  id: string
  nome: string                        // "Desenvolvimento com halteres"
  musculoAlvo: string                 // "Deltóide anterior"
  musculosSecundarios: string[]       // ["Tríceps", "Peitoral superior"]
  
  // Execução
  series: number
  repeticoes: string                  // "8-12" ou "12-15" ou "até falha"
  descanso: number                    // segundos
  cadencia?: string                   // "3-1-2" (excêntrico-pausa-concêntrico)
  
  // Técnicas especiais
  tecnica?: TecnicaEspecial           // "Drop-set", "Rest-pause", etc.
  
  // Intensidade
  intensidade: string                 // "RPE 8" ou "70% 1RM"
  progressaoSemanal?: string          // "+2.5kg por semana"
  
  // Instruções
  execucao: string                    // Como executar corretamente
  dicasForma: string[]                // Dicas de forma
  errosComuns: string[]               // O que evitar
  
  // Substituições
  substituicoes: string[]             // Exercícios alternativos
  
  // Segurança
  contraindicado?: string[]           // Lesões que impedem este exercício
  cuidados?: string[]                 // Cuidados especiais
}

interface CorrecaoSimetria {
  musculo: string                     // "Braço"
  ladoMenor: 'esquerdo' | 'direito'
  diferencaPercent: number
  estrategia: string                  // "Iniciar séries pelo lado menor"
  exerciciosUnilaterais: string[]
  seriesExtras: number                // Séries extras para o lado menor
}

type DivisaoTreino = 
  | 'FULL_BODY'           // Corpo todo (iniciantes, 2-3x/sem)
  | 'UPPER_LOWER'         // Superior/Inferior (intermediário, 4x/sem)
  | 'PPL'                 // Push/Pull/Legs (avançado, 6x/sem)
  | 'PPLX2'               // PPL 2x por semana
  | 'BRO_SPLIT'           // 1 músculo por dia (5x/sem)
  | 'ARNOLD_SPLIT'        // Peito+Costas, Ombros+Braços, Pernas
  | 'CUSTOM'              // Personalizado

type TecnicaEspecial = 
  | 'DROP_SET'
  | 'REST_PAUSE'
  | 'MIOTREPS'
  | 'SUPERSET'
  | 'GIANT_SET'
  | 'CLUSTER'
  | 'TEMPO'
  | 'ISOMETRICO'
```

### 4.2 Prompt para Geração de Treino

```typescript
const TRAINING_PLAN_PROMPT = `
Você é VITRÚVIO, o coach de IA do VITRU IA. Seu nome é uma homenagem a Marcus Vitruvius Pollio, 
o arquiteto romano que definiu as proporções ideais do corpo humano. Você é especialista em criar 
planos de treino personalizados para otimização de proporções corporais e estética.

## CONTEXTO COMPLETO DO USUÁRIO
{{userContext}}

## RESULTADOS DA AVALIAÇÃO
Score Geral: {{scoreGeral}} ({{classificacao}})
Ratio Ombro/Cintura: {{ratio}}

### Pontos Fracos (PRIORIDADE)
{{pontosFracos}}

### Pontos Fortes (MANTER)
{{pontosFortes}}

### Assimetrias a Corrigir
{{assimetrias}}

## RESTRIÇÕES IMPORTANTES
{{restricoes}}

## INSTRUÇÕES

Crie um plano de treino completo considerando:

### 1. DIVISÃO DE TREINO
- Considere a experiência: {{experiencia}}
- Dias disponíveis: {{diasDisponiveis}}
- Duração máxima: {{duracaoMax}} minutos
- Local: {{localTreino}}
- Equipamentos: {{equipamentos}}

### 2. PRIORIZAÇÃO
- Foque nos pontos fracos identificados na avaliação
- Os músculos prioritários devem:
  - Ser treinados primeiro no dia (quando mais energia)
  - Ter mais volume semanal (séries totais)
  - Usar técnicas intensificadoras

### 3. CORREÇÃO DE SIMETRIA
Para cada assimetria > 5%:
- Incluir exercícios unilaterais
- Lado menor inicia o movimento
- 1-2 séries extras para o lado menor

### 4. SEGURANÇA
{{alertasSaude}}
- Respeitar todas as lesões e restrições
- Ajustar intensidade conforme condições médicas
- Considerar interações com medicamentos

### 5. PROGRESSÃO
- Semanas 1-2: Adaptação (RPE 7)
- Semanas 3-4: Progressão (RPE 8)
- Semanas 5-6: Intensificação (RPE 8-9)
- Semana 7-8: Pico + Deload

### 6. FORMATO DE RESPOSTA
Para cada exercício, forneça:
- Nome do exercício
- Músculo alvo
- Séries x Repetições
- Descanso
- Técnica de execução (breve)
- Substituição se não tiver equipamento

## RESTRIÇÕES ABSOLUTAS
- NUNCA prescreva exercícios contraindicados para as lesões listadas
- SEMPRE reduza intensidade se houver condição cardíaca
- CONSIDERE efeitos de medicamentos na performance
- ADAPTE para os equipamentos disponíveis

## FORMATO JSON
{
  "visaoGeral": {
    "titulo": "string",
    "descricao": "string",
    "duracao": "string",
    "divisao": "string",
    "diasPorSemana": number
  },
  "prioridades": {
    "musculosFoco": ["string"],
    "correcaoSimetria": [{"musculo": "string", "estrategia": "string"}],
    "manutencao": ["string"]
  },
  "dias": [
    {
      "dia": "string",
      "nome": "string",
      "gruposMusculares": ["string"],
      "duracaoEstimada": number,
      "exercicios": [
        {
          "nome": "string",
          "musculoAlvo": "string",
          "series": number,
          "repeticoes": "string",
          "descanso": number,
          "execucao": "string",
          "substituicao": "string"
        }
      ],
      "observacoes": ["string"]
    }
  ],
  "progressao": {
    "descricao": "string",
    "semanasAdaptacao": "string",
    "semanasProgressao": "string",
    "deload": "string"
  },
  "alertasSeguranca": ["string"]
}
`
```

---

## 5. GERAÇÃO DE PLANO ALIMENTAR (NOVO)

### 5.1 Estrutura do Plano Alimentar

```typescript
interface PlanoAlimentar {
  // Metadata
  id: string
  userId: string
  criadoEm: Date
  validoAte: Date
  versao: number
  
  // Visão geral
  visaoGeral: {
    titulo: string                    // "Plano Hipertrofia - Superávit Moderado"
    objetivo: string                  // "Ganho de massa com mínimo de gordura"
    faseDieta: FaseDieta
    duracaoSugerida: string
  }
  
  // Calorias e macros
  calorias: {
    tdee: number                      // Gasto energético total
    meta: number                      // Calorias alvo
    ajuste: string                    // "+300kcal (superávit moderado)"
  }
  
  macros: {
    proteina: MacroConfig
    carboidrato: MacroConfig
    gordura: MacroConfig
  }
  
  // Distribuição
  distribuicao: {
    refeicoesdia: number
    timing: TimingNutricional
    refeicoes: Refeicao[]
  }
  
  // Suplementação
  suplementacao: {
    essenciais: SuplementoRecomendado[]
    opcionais: SuplementoRecomendado[]
    evitar: string[]                  // Suplementos a evitar por saúde
  }
  
  // Hidratação
  hidratacao: {
    aguaDiaria: number                // litros
    observacoes: string
  }
  
  // Ajustes
  ajustes: {
    diasTreino: AjusteDia
    diasDescanso: AjusteDia
    finaisSemana: string
  }
  
  // Alertas
  alertas: AlertaNutricional[]
  
  // Lista de compras sugerida
  listaCompras: ItemCompra[]
}

interface MacroConfig {
  gramas: number
  gramasKg: number                    // Por kg de peso corporal
  calorias: number
  percentual: number
  fontesPrincipais: string[]
}

interface TimingNutricional {
  preWorkout: {
    tempo: string                     // "1-2h antes"
    composicao: string                // "Carboidrato complexo + proteína leve"
    exemplo: string
  }
  intraWorkout?: {
    necessario: boolean
    composicao?: string
    exemplo?: string
  }
  posWorkout: {
    tempo: string                     // "Até 2h após"
    composicao: string                // "Proteína rápida + carboidrato"
    exemplo: string
  }
  antesDeDoimir: {
    tempo: string
    composicao: string
    exemplo: string
  }
}

interface Refeicao {
  numero: number
  nome: string                        // "Café da manhã"
  horarioSugerido: string             // "7:00"
  calorias: number
  macros: { proteina: number; carboidrato: number; gordura: number }
  
  opcoes: OpcaoRefeicao[]             // 2-3 opções por refeição
  
  observacoes?: string
}

interface OpcaoRefeicao {
  nome: string                        // "Opção 1 - Ovos com aveia"
  alimentos: AlimentoQuantidade[]
  tempoPreparo: number                // minutos
  dificuldade: 'facil' | 'media' | 'dificil'
  custo: 'baixo' | 'medio' | 'alto'
  
  macros: { proteina: number; carboidrato: number; gordura: number }
  calorias: number
}

interface AlimentoQuantidade {
  alimento: string
  quantidade: number
  unidade: string                     // "g", "ml", "unidade", "xícara"
  observacao?: string                 // "cozido", "cru", etc.
}

interface SuplementoRecomendado {
  nome: string
  dosagem: string
  horario: string
  motivo: string
  essencial: boolean
  custoMensal?: string
}

interface AlertaNutricional {
  tipo: 'saude' | 'interacao' | 'alergia' | 'restricao'
  titulo: string
  descricao: string
  acao: string
}

type FaseDieta = 
  | 'SUPERAVIT_AGRESSIVO'    // +500kcal
  | 'SUPERAVIT_MODERADO'     // +300kcal
  | 'SUPERAVIT_LEVE'         // +150kcal
  | 'MANUTENCAO'             // TDEE
  | 'DEFICIT_LEVE'           // -300kcal
  | 'DEFICIT_MODERADO'       // -500kcal
  | 'DEFICIT_AGRESSIVO'      // -750kcal
  | 'RECOMPOSICAO'           // Cíclico
```

### 5.2 Prompt para Geração de Dieta

```typescript
const NUTRITION_PLAN_PROMPT = `
Você é VITRÚVIO, o coach de IA do VITRU IA. Seu nome é uma homenagem a Marcus Vitruvius Pollio, 
o arquiteto romano que definiu as proporções ideais do corpo humano. Você é especialista em 
nutrição esportiva focada em otimização de composição corporal e estética.

## CONTEXTO COMPLETO DO USUÁRIO
{{userContext}}

## DADOS FÍSICOS
- Peso atual: {{peso}} kg
- Altura: {{altura}} cm
- Gordura corporal: {{gordura}}%
- Massa magra estimada: {{massaMagra}} kg

## MÉTRICAS CALCULADAS
- TMB: {{tmb}} kcal
- TDEE: {{tdee}} kcal
- Proteína mínima: {{proteinaMin}}g (1.6g/kg)
- Proteína ideal: {{proteinaIdeal}}g (2.0g/kg)

## OBJETIVO
{{objetivoPrincipal}}: {{objetivoEspecifico}}
Prazo: {{prazo}}

## PREFERÊNCIAS ALIMENTARES
- Dieta atual: {{dietaAtual}}
- Refeições por dia: {{refeicoesdia}}
- Sabe cozinhar: {{cozinha}}
- Tempo para preparar: {{tempoPreparo}} minutos
- Orçamento: {{orcamento}}
- Faz jejum: {{fazJejum}} {{horarioJejum}}

### Alimentos a EVITAR (não gosta ou não pode)
{{alimentosEvitar}}

### Alimentos PREFERIDOS
{{alimentosPreferidos}}

### Alergias/Intolerâncias
{{alergias}}

## CONDIÇÕES DE SAÚDE RELEVANTES
{{condicoesSaude}}

## MEDICAMENTOS QUE AFETAM DIETA
{{medicamentosRelevantes}}

## SUPLEMENTOS ATUAIS
{{suplementosAtuais}}

## INSTRUÇÕES

Crie um plano alimentar completo considerando:

### 1. CALORIAS
- Calcule o ajuste calórico baseado no objetivo
- Superávit para ganho: +200 a +400kcal
- Déficit para perda: -300 a -500kcal
- Considere o nível de atividade e metabolismo

### 2. MACRONUTRIENTES
- Proteína: 1.8-2.2g/kg para hipertrofia
- Gordura: mínimo 0.8g/kg para saúde hormonal
- Carboidrato: restante das calorias

### 3. RESTRIÇÕES DE SAÚDE
{{restricoesSaude}}
- Diabetes: controlar índice glicêmico, distribuir carboidratos
- Hipertensão: limitar sódio
- Colesterol: limitar gorduras saturadas
- Problemas renais: ajustar proteína se necessário

### 4. PRATICIDADE
- Refeições simples se pouco tempo
- Meal prep se disponível
- Opções econômicas se orçamento baixo
- Considerar rotina de trabalho

### 5. TIMING NUTRICIONAL
- Pré-treino: energia para performance
- Pós-treino: recuperação e síntese proteica
- Antes de dormir: proteína lenta (se aplicável)

### 6. SUPLEMENTAÇÃO
- Avaliar necessidade real
- Considerar custo-benefício
- Verificar interações com medicamentos
- Nunca substituir alimentação

## RESTRIÇÕES ABSOLUTAS
- NUNCA inclua alimentos que o usuário é alérgico
- RESPEITE a dieta escolhida (vegana, vegetariana, etc.)
- CONSIDERE interações medicamento-alimento
- AJUSTE para condições de saúde específicas

## FORMATO JSON
{
  "visaoGeral": {
    "titulo": "string",
    "objetivo": "string",
    "faseDieta": "string",
    "duracaoSugerida": "string"
  },
  "calorias": {
    "tdee": number,
    "meta": number,
    "ajuste": "string"
  },
  "macros": {
    "proteina": {"gramas": number, "gramasKg": number, "calorias": number, "percentual": number},
    "carboidrato": {"gramas": number, "gramasKg": number, "calorias": number, "percentual": number},
    "gordura": {"gramas": number, "gramasKg": number, "calorias": number, "percentual": number}
  },
  "distribuicao": {
    "refeicoesdia": number,
    "timing": {
      "preWorkout": {"tempo": "string", "composicao": "string", "exemplo": "string"},
      "posWorkout": {"tempo": "string", "composicao": "string", "exemplo": "string"}
    }
  },
  "refeicoes": [
    {
      "numero": number,
      "nome": "string",
      "horarioSugerido": "string",
      "calorias": number,
      "opcoes": [
        {
          "nome": "string",
          "alimentos": [{"alimento": "string", "quantidade": number, "unidade": "string"}],
          "tempoPreparo": number,
          "macros": {"proteina": number, "carboidrato": number, "gordura": number}
        }
      ]
    }
  ],
  "suplementacao": {
    "essenciais": [{"nome": "string", "dosagem": "string", "horario": "string", "motivo": "string"}],
    "opcionais": [{"nome": "string", "dosagem": "string", "motivo": "string"}],
    "evitar": ["string"]
  },
  "hidratacao": {
    "litrosDia": number,
    "observacoes": "string"
  },
  "alertas": [{"tipo": "string", "titulo": "string", "descricao": "string"}],
  "listaComprasSemanal": ["string"]
}
`
```

---

## 6. TIPOS DE ANÁLISE (Mantido + Expandido)

### 6.1 Análise de Proporções
*(Mantido da versão anterior)*

### 6.2 Análise de Simetria
*(Mantido da versão anterior)*

### 6.3 Análise de Evolução
*(Mantido da versão anterior)*

### 6.4 Diagnóstico Estético
*(Mantido da versão anterior)*

### 6.5 Análise de Risco (NOVO)

```typescript
interface RiskAnalysis {
  // Score de risco geral
  overallRisk: 'baixo' | 'moderado' | 'alto' | 'muito_alto'
  riskScore: number                   // 0-100
  
  // Riscos por categoria
  riscos: {
    cardiovascular: RiscoCategoria
    musculoesqueletico: RiscoCategoria
    metabolico: RiscoCategoria
    farmacologico: RiscoCategoria
  }
  
  // Recomendações de segurança
  recomendacoes: {
    obrigatorias: string[]            // DEVE fazer
    sugeridas: string[]               // DEVERIA fazer
    evitar: string[]                  // NÃO deve fazer
  }
  
  // Exames sugeridos
  examesSugeridos: string[]
  
  // Acompanhamento profissional
  profissionaisRecomendados: string[] // "Cardiologista", "Fisioterapeuta"
}

interface RiscoCategoria {
  nivel: 'baixo' | 'moderado' | 'alto'
  fatores: string[]
  mitigacao: string[]
}
```

---

## 7. GERAÇÃO DE INSIGHTS (Expandido)

### 7.1 Novos Tipos de Insights

```typescript
type InsightType = 
  // Existentes
  | 'progress'
  | 'achievement'
  | 'warning'
  | 'tip'
  | 'motivation'
  | 'reminder'
  | 'comparison'
  | 'projection'
  | 'education'
  
  // NOVOS
  | 'training_adjustment'     // Ajuste no treino sugerido
  | 'diet_adjustment'         // Ajuste na dieta sugerido
  | 'health_alert'            // Alerta de saúde
  | 'supplement_reminder'     // Lembrete de suplemento
  | 'recovery'                // Dica de recuperação
  | 'sleep'                   // Insight sobre sono
  | 'stress'                  // Insight sobre estresse
  | 'plateau'                 // Detectou platô
  | 'deload'                  // Sugestão de deload
```

### 7.2 Insights Contextuais (NOVO)

```typescript
// Insights que usam o contexto completo do usuário

const CONTEXTUAL_INSIGHTS = {
  // Baseado em sono
  poorSleep: {
    condition: (ctx) => ctx.vida.horasSono < 6 || ctx.vida.qualidadeSono === 'ruim',
    insight: {
      type: 'sleep',
      title: 'Sono prejudicando ganhos',
      message: 'Seu sono de {{horasSono}}h pode estar limitando seus resultados. ' +
               'A síntese proteica muscular acontece principalmente durante o sono profundo.',
      action: 'Ver dicas de sono',
      priority: 'high'
    }
  },
  
  // Baseado em estresse
  highStress: {
    condition: (ctx) => ctx.vida.estresse === 'alto' || ctx.vida.estresse === 'muito_alto',
    insight: {
      type: 'stress',
      title: 'Estresse elevado detectado',
      message: 'O cortisol elevado pode dificultar ganho muscular e facilitar acúmulo de gordura. ' +
               'Considere técnicas de relaxamento.',
      action: 'Ver técnicas anti-estresse',
      priority: 'medium'
    }
  },
  
  // Baseado em medicamentos
  medicationInteraction: {
    condition: (ctx) => ctx.farmacos.interacoesAlerta.length > 0,
    insight: {
      type: 'health_alert',
      title: 'Atenção com suplementação',
      message: 'Alguns suplementos podem interagir com {{medicamento}}. ' +
               'Consulte seu médico antes de iniciar nova suplementação.',
      action: 'Ver detalhes',
      priority: 'high'
    }
  },
  
  // Baseado em platô
  plateau: {
    condition: (ctx) => ctx.historico.tendencia === 'estagnado' && ctx.historico.medicoes >= 4,
    insight: {
      type: 'plateau',
      title: 'Possível platô detectado',
      message: 'Suas medidas estão estagnadas há {{semanas}} semanas. ' +
               'Pode ser hora de ajustar treino ou dieta.',
      action: 'Ver sugestões de quebra de platô',
      priority: 'high'
    }
  },
  
  // Sugestão de deload
  needsDeload: {
    condition: (ctx) => ctx.treino.semanasConsecutivas >= 6 && !ctx.treino.fezDeloadRecente,
    insight: {
      type: 'deload',
      title: 'Hora do deload?',
      message: 'Você está há {{semanas}} semanas treinando intenso. ' +
               'Uma semana de deload pode potencializar seus ganhos.',
      action: 'Ver como fazer deload',
      priority: 'medium'
    }
  },
}
```

---

## 8. INTERFACE DE CHAT (NOVO)

### 8.1 Estrutura do Chat

```typescript
interface ChatMessage {
  id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  
  // Metadata
  context?: {
    type: 'general' | 'training' | 'nutrition' | 'health' | 'analysis'
    relatedData?: string              // ID de medição, plano, etc.
  }
  
  // Ações sugeridas pelo assistant
  suggestedActions?: Array<{
    label: string
    action: string                    // 'generate_plan', 'show_analysis', etc.
    params?: Record<string, any>
  }>
  
  // Feedback do usuário
  feedback?: {
    helpful: boolean
    timestamp: Date
  }
}

interface Conversation {
  id: string
  userId: string
  startedAt: Date
  lastMessageAt: Date
  messageCount: number
  topic?: string                      // Resumo do assunto
  resolved: boolean
}
```

### 8.2 System Prompt do Chat

```typescript
const CHAT_SYSTEM_PROMPT = `
Você é VITRÚVIO, o coach de IA do VITRU IA. Seu nome é uma homenagem a Marcus Vitruvius Pollio, 
o arquiteto romano que definiu as proporções ideais do corpo humano - os mesmos princípios que 
inspiraram o Homem Vitruviano de Da Vinci. Você é especialista em análise de proporções corporais, 
treino e nutrição para fisiculturismo estético.

## SEU CONTEXTO DO USUÁRIO
{{userContext}}

## SUAS CAPACIDADES
1. Responder dúvidas sobre treino, dieta e proporções
2. Explicar resultados da avaliação
3. Sugerir ajustes no plano atual
4. Dar dicas de execução de exercícios
5. Orientar sobre nutrição
6. Motivar e acompanhar o progresso

## SUAS LIMITAÇÕES
1. NÃO é médico - sempre sugira consultar profissionais para questões de saúde
2. NÃO pode prescrever medicamentos ou dosagens
3. NÃO pode diagnosticar condições médicas
4. DEVE respeitar as restrições de saúde do usuário

## REGRAS DE SEGURANÇA
- Se o usuário perguntar sobre esteroides: orientar sobre riscos, nunca incentivar
- Se detectar sinais de distúrbio alimentar: sugerir acompanhamento psicológico
- Se houver lesão ativa: sempre priorizar recuperação sobre progresso
- Se houver condição de saúde: considerar nas recomendações

## TOM DE VOZ
- Técnico mas acessível
- Motivador mas realista
- Personalizado (use o nome do usuário)
- Empático e compreensivo
- Direto ao ponto

## FORMATO DE RESPOSTAS
- Respostas concisas para perguntas simples
- Respostas estruturadas para perguntas complexas
- Sempre ofereça próximos passos quando relevante
- Use bullet points para listas
- Use emojis com moderação para engajar

## CONTEXTO DA CONVERSA
{{conversationHistory}}

Responda à mensagem do usuário de forma útil e personalizada.
`
```

---

## 9. LIMITES FREE vs PRO (Atualizado)

### 9.1 Tabela de Features

| Feature | Free | PRO |
|---------|------|-----|
| **Insights diários** | 3 | Ilimitados |
| **Tipos de insight** | Básicos | Todos (incluindo contextuais) |
| **Relatório semanal** | Resumido | Completo |
| **Relatório mensal** | ❌ | ✅ |
| **Análise de proporções** | Score geral | Breakdown completo |
| **Análise de simetria** | Básica (2 músculos) | Completa (todos) |
| **Análise de evolução** | 30 dias | Histórico completo |
| **Diagnóstico estético** | ❌ | ✅ |
| **Análise de risco** | ❌ | ✅ |
| **Projeções** | ❌ | ✅ |
| **Chat com VITRÚVIO** | 5 msgs/dia | Ilimitado |
| **Plano de Treino** | Genérico | Personalizado completo |
| **Plano Alimentar** | Macros básicos | Completo com refeições |
| **Ajustes de plano** | ❌ | ✅ (ilimitados) |
| **Exportar relatórios** | ❌ | ✅ (PDF) |
| **Histórico de planos** | ❌ | ✅ |

---

## 10. INTEGRAÇÃO COM LLM (Atualizado)

### 10.1 Configuração

```typescript
const AI_COACH_CONFIG: LLMConfig = {
  provider: 'anthropic',              // ou 'openai'
  model: 'claude-3-5-sonnet',         // ou 'gpt-4-turbo'
  temperature: 0.7,
  maxTokens: 4000,                    // Aumentado para planos completos
  systemPrompt: COACH_SYSTEM_PROMPT,
}

// Modelos por tipo de tarefa
const MODEL_CONFIG = {
  chat: { model: 'claude-3-5-sonnet', maxTokens: 1000 },
  analysis: { model: 'claude-3-5-sonnet', maxTokens: 2000 },
  trainingPlan: { model: 'claude-3-5-sonnet', maxTokens: 4000 },
  nutritionPlan: { model: 'claude-3-5-sonnet', maxTokens: 4000 },
  insights: { model: 'claude-3-haiku', maxTokens: 500 },  // Mais rápido/barato
}
```

### 10.2 Rate Limiting e Custos

```typescript
const RATE_LIMITS = {
  free: {
    chatMessagesPerDay: 5,
    plansPerMonth: 1,
    analysisPerDay: 3,
  },
  pro: {
    chatMessagesPerDay: null,         // Ilimitado
    plansPerMonth: null,              // Ilimitado
    analysisPerDay: null,             // Ilimitado
  }
}
```

---

## 11. MÉTRICAS E MONITORAMENTO (Expandido)

### 11.1 KPIs do VITRÚVIO

| Métrica | Descrição | Meta |
|---------|-----------|------|
| Insight Click Rate | % de insights clicados | > 30% |
| Report Open Rate | % de relatórios abertos | > 60% |
| Plan Completion Rate | % de planos seguidos | > 40% |
| Chat Satisfaction | NPS do chat | > 50 |
| Training Adherence | % de treinos completados | > 70% |
| Diet Adherence | % de dieta seguida | > 60% |
| Retention Impact | Retenção PRO vs Free | +30% |
| Results Achievement | % que atingiu metas | > 25% |

---

## 12. FLUXO DE COLETA DE DADOS

### 12.1 Onboarding Expandido

```
ETAPA 1: DADOS BÁSICOS
├── Nome, email, senha
├── Gênero, data de nascimento
└── Altura

ETAPA 2: PERFIL DE VIDA
├── Profissão
├── Rotina diária (sedentária → muito ativa)
├── Horas de sono
├── Nível de estresse
└── Horas de trabalho

ETAPA 3: SAÚDE
├── Condições de saúde (lista com busca)
├── Lesões atuais ou passadas
├── Alergias alimentares
└── Restrições de movimento

ETAPA 4: MEDICAMENTOS
├── Medicamentos em uso
├── Dosagem e frequência
├── Suplementos atuais
└── Uso de ergogênicos (opcional/confidencial)

ETAPA 5: EXPERIÊNCIA
├── Tempo de treino
├── Frequência atual
├── Local de treino
├── Equipamentos disponíveis
└── Treino atual (descrição)

ETAPA 6: ALIMENTAÇÃO
├── Tipo de dieta
├── Refeições por dia
├── Sabe cozinhar
├── Tempo para preparar
├── Orçamento
├── Alimentos a evitar
└── Alimentos preferidos

ETAPA 7: OBJETIVOS
├── Objetivo principal
├── Objetivo específico (texto)
├── Prazo
├── Prioridades (ranking)
├── Pretende competir?
└── Categoria de interesse

ETAPA 8: DISPONIBILIDADE
├── Dias disponíveis para treino
├── Horário preferido
├── Tempo máximo por sessão
└── Pode treinar em casa?

ETAPA 9: MEDIDAS ESTRUTURAIS
├── Punho, tornozelo, joelho, pelve
└── (medidas que não mudam)

ETAPA 10: PRIMEIRA AVALIAÇÃO
├── Peso atual
├── Medidas variáveis
└── Fotos (opcional)
```

---

## 13. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do VITRÚVIO |
| 2.0 | Fev/2026 | UserHealthProfile completo, Plano de Treino, Plano Alimentar, Chat, Análise de Risco, Insights Contextuais |

---

**VITRÚVIO - Coach IA do VITRU IA v2.0**  
*Inspirado em Marcus Vitruvius Pollio • Análise • Treino • Dieta • Personalização Total*