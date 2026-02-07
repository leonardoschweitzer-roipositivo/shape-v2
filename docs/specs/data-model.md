# SPEC: Data Model - SHAPE-V

## Documento de Modelo de Dados

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** SHAPE-V (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

Este documento define a estrutura de dados completa do SHAPE-V, incluindo schema do banco de dados, tipos TypeScript, validações Zod e relacionamentos entre entidades.

### 1.1 Stack de Dados

| Camada | Tecnologia | Uso |
|--------|------------|-----|
| **Database** | PostgreSQL (Supabase) | Persistência principal |
| **ORM** | Prisma | Queries type-safe |
| **Validation** | Zod | Validação de schemas |
| **Cache** | React Query | Cache client-side |
| **State** | Zustand | Estado global |

### 1.2 Diagrama de Entidades (ERD)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Academy   │──────<│   Personal  │──────<│    User     │
│  (tenant)   │  1:N  │ (trainer)   │  1:N  │  (athlete)  │
└─────────────┘       └─────────────┘       └──────┬──────┘
                                                   │
       ┌───────────────────────────────────────────┤
       │                    │                      │
       ▼                    ▼                      ▼
┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│   Profile   │     │   Measurement   │────<│   Invite    │
└─────────────┘     └────────┬────────┘     └─────────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────────┐  ┌─────────────┐     ┌─────────────────┐
│  ProportionScore │  │  BodyPhoto  │     │      Goal       │
└──────────────────┘  └─────────────┘     └─────────────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────┐
                                          │   Achievement   │
                                          └─────────────────┘
```

### 1.3 Modelo de Usuários

```
┌─────────────────────────────────────────────────────────────────┐
│                    HIERARQUIA DE USUÁRIOS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💪 ATLETA (B2C)          Contrata → Usa sozinho               │
│                                                                 │
│  🏋️ PERSONAL (B2B)        Contrata → Cadastra atletas          │
│                                                                 │
│  🏢 ACADEMIA (B2B)        Contrata → Cadastra personais        │
│                                       → Personais cadastram     │
│                                         atletas                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. SCHEMA DO BANCO DE DADOS (PRISMA)

### 2.1 User & Authentication

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS GLOBAIS
// ============================================

enum UserRole {
  ATHLETE       // Atleta individual
  PERSONAL      // Personal trainer
  ACADEMY       // Academia/Empresa
  ADMIN         // Administrador do sistema
}

enum PlanType {
  // Atleta
  FREE
  ATHLETE_PRO
  
  // Personal
  PERSONAL_BASIC     // Até 10 alunos
  PERSONAL_PRO       // Até 50 alunos
  PERSONAL_UNLIMITED // Ilimitado
  
  // Academia
  ACADEMY_BASIC      // Até 5 personais
  ACADEMY_PRO        // Até 20 personais
  ACADEMY_UNLIMITED  // Ilimitado
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  name          String?
  avatarUrl     String?
  
  // Tipo de usuário (NOVO)
  role          UserRole  @default(ATHLETE)
  
  // OAuth
  googleId      String?   @unique
  appleId       String?   @unique
  
  // Status
  emailVerified DateTime?
  isActive      Boolean   @default(true)
  
  // Plano (ATUALIZADO)
  plan          PlanType  @default(FREE)
  planExpiresAt DateTime?
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  // Relations - Próprias (Atleta)
  profile       Profile?
  measurements  Measurement[]
  goals         Goal[]
  achievements  UserAchievement[]
  photos        BodyPhoto[]
  sessions      Session[]
  
  // Relations - Multi-user (NOVO)
  personal      Personal?   @relation("PersonalUser")     // Se for PERSONAL
  academy       Academy?    @relation("AcademyUser")      // Se for ACADEMY
  
  // Vinculação com Personal (para ATHLETE)
  assignedTo    Personal?   @relation("AthletePersonal", fields: [personalId], references: [id])
  personalId    String?
  
  // Convites enviados
  invitesSent   Invite[]    @relation("InviteSender")
  
  @@index([role])
  @@index([personalId])
  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  userAgent    String?
  ipAddress    String?
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
  @@map("sessions")
}
```

### 2.2 Profile

```prisma
// ============================================
// PROFILE (Dados pessoais e estruturais)
// ============================================

model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique
  
  // Dados Pessoais
  birthDate       DateTime?
  gender          Gender   @default(MALE)
  
  // Medidas Estruturais (não mudam)
  altura          Float?   // cm
  punho           Float?   // cm
  tornozelo       Float?   // cm
  joelho          Float?   // cm
  pelve           Float?   // cm
  
  // Preferências
  unitSystem      UnitSystem @default(METRIC)
  preferredMethod ProportionMethod @default(GOLDEN_RATIO)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("profiles")
}

enum Gender {
  MALE
  FEMALE
  OTHER
}

enum UnitSystem {
  METRIC
  IMPERIAL
}

enum ProportionMethod {
  GOLDEN_RATIO
  CLASSIC_PHYSIQUE
  MENS_PHYSIQUE
}
```

### 2.3 Personal (NOVO)

```prisma
// ============================================
// PERSONAL (Personal Trainer)
// ============================================

model Personal {
  id            String    @id @default(cuid())
  userId        String    @unique
  
  // Dados Profissionais
  cref          String?   // Registro profissional (CREF)
  specialties   String[]  // Especialidades: ["Hipertrofia", "Emagrecimento"]
  bio           String?   // Biografia/descrição
  phone         String?   // Telefone de contato
  
  // Vinculação com Academia (opcional)
  academyId     String?
  academy       Academy?  @relation(fields: [academyId], references: [id], onDelete: SetNull)
  
  // Limites do Plano
  maxAthletes   Int       @default(10)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User      @relation("PersonalUser", fields: [userId], references: [id], onDelete: Cascade)
  athletes      User[]    @relation("AthletePersonal")
  
  @@index([academyId])
  @@map("personals")
}
```

### 2.4 Academy (NOVO)

```prisma
// ============================================
// ACADEMY (Academia/Empresa)
// ============================================

model Academy {
  id            String    @id @default(cuid())
  userId        String    @unique  // User admin da academia
  
  // Dados da Empresa
  businessName  String              // Nome fantasia
  legalName     String?             // Razão social
  cnpj          String?   @unique   // CNPJ
  
  // Contato
  phone         String?
  email         String?
  website       String?
  
  // Endereço
  address       String?
  city          String?
  state         String?
  zipCode       String?
  
  // Visual/Branding
  logoUrl       String?
  primaryColor  String?   @default("#00C9A7")
  
  // Limites do Plano
  maxPersonals  Int       @default(5)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User       @relation("AcademyUser", fields: [userId], references: [id], onDelete: Cascade)
  personals     Personal[]
  
  @@map("academies")
}
```

### 2.5 Invite (NOVO)

```prisma
// ============================================
// INVITE (Convites pendentes)
// ============================================

model Invite {
  id            String       @id @default(cuid())
  
  // Quem convidou
  invitedById   String
  invitedBy     User         @relation("InviteSender", fields: [invitedById], references: [id], onDelete: Cascade)
  invitedByRole UserRole     // PERSONAL ou ACADEMY
  
  // Convidado
  email         String
  name          String?      // Nome sugerido
  role          UserRole     // ATHLETE (para personal) ou PERSONAL (para academia)
  
  // Contexto (um ou outro)
  academyId     String?      // Se convite de academia para personal
  personalId    String?      // Se convite de personal para atleta
  
  // Configurações específicas
  maxAthletes   Int?         // Se for convite para personal (limite de alunos)
  
  // Token único
  token         String       @unique @default(cuid())
  
  // Status
  status        InviteStatus @default(PENDING)
  expiresAt     DateTime
  acceptedAt    DateTime?
  
  // Mensagem personalizada
  message       String?
  
  // Timestamps
  createdAt     DateTime     @default(now())
  
  @@index([email])
  @@index([token])
  @@index([status])
  @@map("invites")
}

enum InviteStatus {
  PENDING
  ACCEPTED
  EXPIRED
  CANCELLED
}
```

### 2.7 Measurement

```prisma
// ============================================
// MEASUREMENT (Medidas variáveis)
// ============================================

model Measurement {
  id              String   @id @default(cuid())
  userId          String
  
  // Quem registrou a medição (NOVO)
  // Se o próprio atleta, será null ou igual ao userId
  // Se o personal registrou para o atleta, será o ID do personal
  registeredById  String?
  
  // Data da medição
  measuredAt      DateTime @default(now())
  
  // Composição Corporal
  peso            Float?   // kg
  gorduraCorporal Float?   // percentual
  
  // Medidas Variáveis (cm)
  cintura         Float
  ombros          Float
  peitoral        Float
  braco           Float    // bíceps flexionado
  antebraco       Float
  pescoco         Float
  coxa            Float
  panturrilha     Float
  
  // Medidas Bilaterais (opcional)
  bracoEsquerdo   Float?
  bracoDireito    Float?
  coxaEsquerda    Float?
  coxaDireita     Float?
  panturrilhaEsquerda Float?
  panturrilhaDireita  Float?
  
  // Metadata
  notes           String?
  source          MeasurementSource @default(MANUAL)
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  scores          ProportionScore[]
  photos          BodyPhoto[]
  
  @@index([userId])
  @@index([measuredAt])
  @@index([registeredById])
  @@map("measurements")
}

enum MeasurementSource {
  MANUAL
  PHOTO_AI
  SMART_SCALE
  IMPORTED
  PERSONAL_ENTRY   // Registrado pelo personal (NOVO)
}
```

### 2.8 ProportionScore

```prisma
// ============================================
// PROPORTION SCORE (Resultados calculados)
// ============================================

model ProportionScore {
  id              String   @id @default(cuid())
  measurementId   String
  
  // Método usado
  method          ProportionMethod
  
  // Score Total
  scoreTotal      Float    // 0-100
  
  // Scores por Proporção (JSON)
  // { ombros: 85.5, peitoral: 90.2, ... }
  scoresDetalhados Json
  
  // Ideais Calculados (JSON)
  // { ombros: 132.7, peitoral: 113.8, ... }
  ideaisCalculados Json
  
  // Diferenças (JSON)
  // { ombros: { diferenca: 12.7, necessario: 'aumentar' }, ... }
  diferencas       Json
  
  // Classificação
  classificacao    ScoreClassification
  
  // Timestamps
  createdAt        DateTime @default(now())
  
  measurement      Measurement @relation(fields: [measurementId], references: [id], onDelete: Cascade)
  
  @@unique([measurementId, method])
  @@index([measurementId])
  @@map("proportion_scores")
}

enum ScoreClassification {
  ELITE           // 95-100
  AVANCADO        // 85-94
  INTERMEDIARIO   // 75-84
  INICIANTE       // 60-74
  DESENVOLVIMENTO // 0-59
}
```

### 2.9 BodyPhoto

```prisma
// ============================================
// BODY PHOTO (Fotos corporais)
// ============================================

model BodyPhoto {
  id              String   @id @default(cuid())
  userId          String
  measurementId   String?
  
  // Arquivo
  url             String
  thumbnailUrl    String?
  
  // Metadata
  pose            PhotoPose
  angle           PhotoAngle @default(FRONT)
  
  // AI Analysis (opcional)
  aiAnalysis      Json?    // Pontos detectados, medidas estimadas
  
  // Timestamps
  takenAt         DateTime @default(now())
  createdAt       DateTime @default(now())
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  measurement     Measurement? @relation(fields: [measurementId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([measurementId])
  @@map("body_photos")
}

enum PhotoPose {
  RELAXED
  FLEXED
  VACUUM
  SIDE_CHEST
  BACK_DOUBLE_BICEPS
}

enum PhotoAngle {
  FRONT
  BACK
  LEFT_SIDE
  RIGHT_SIDE
}
```

### 2.10 Goals & Achievements

```prisma
// ============================================
// GOALS (Metas do usuário)
// ============================================

model Goal {
  id              String   @id @default(cuid())
  userId          String
  
  // Tipo de meta
  type            GoalType
  targetMetric    String   // 'ombros', 'cintura', 'scoreTotal', etc.
  
  // Valores
  currentValue    Float
  targetValue     Float
  
  // Status
  status          GoalStatus @default(IN_PROGRESS)
  completedAt     DateTime?
  
  // Prazo
  deadline        DateTime?
  
  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@map("goals")
}

enum GoalType {
  INCREASE        // Aumentar medida
  DECREASE        // Diminuir medida
  MAINTAIN        // Manter medida
  SCORE_TARGET    // Atingir score
}

enum GoalStatus {
  IN_PROGRESS
  COMPLETED
  FAILED
  CANCELLED
}

// ============================================
// ACHIEVEMENTS (Conquistas/Gamificação)
// ============================================

model Achievement {
  id              String   @id @default(cuid())
  
  // Identificação
  code            String   @unique
  name            String
  description     String
  
  // Visual
  icon            String
  color           String
  
  // Requisitos
  category        AchievementCategory
  requirement     Json     // { type: 'score', value: 85, method: 'golden_ratio' }
  
  // Pontos
  xpReward        Int      @default(0)
  
  // Status
  isActive        Boolean  @default(true)
  
  users           UserAchievement[]
  
  @@map("achievements")
}

model UserAchievement {
  id              String   @id @default(cuid())
  userId          String
  achievementId   String
  
  // Quando conquistou
  unlockedAt      DateTime @default(now())
  
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement     Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  
  @@unique([userId, achievementId])
  @@map("user_achievements")
}

enum AchievementCategory {
  MEASUREMENT     // Relacionado a medidas
  CONSISTENCY     // Consistência de uso
  PROPORTION      // Proporções atingidas
  PROGRESS        // Progresso ao longo do tempo
  SOCIAL          // Compartilhamento, etc.
}
```

---

## 3. TYPES TYPESCRIPT

### 3.1 User & Role Types

```typescript
// types/user.ts

// Tipos de usuário
export type UserRole = 'ATHLETE' | 'PERSONAL' | 'ACADEMY' | 'ADMIN'

// Tipos de plano
export type PlanType = 
  | 'FREE'
  | 'ATHLETE_PRO'
  | 'PERSONAL_BASIC'
  | 'PERSONAL_PRO'
  | 'PERSONAL_UNLIMITED'
  | 'ACADEMY_BASIC'
  | 'ACADEMY_PRO'
  | 'ACADEMY_UNLIMITED'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: UserRole              // NOVO
  isActive: boolean
  plan: PlanType              // ATUALIZADO
  planExpiresAt: Date | null
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date | null
  personalId: string | null   // NOVO: Se atleta vinculado a personal
}

export interface UserWithProfile extends User {
  profile: Profile | null
}

export interface UserWithRelations extends UserWithProfile {
  personal?: Personal | null      // Se role === 'PERSONAL'
  academy?: Academy | null        // Se role === 'ACADEMY'
  assignedTo?: Personal | null    // Se role === 'ATHLETE' e vinculado
}

export interface Profile {
  id: string
  userId: string
  birthDate: Date | null
  gender: Gender
  altura: number | null
  punho: number | null
  tornozelo: number | null
  joelho: number | null
  pelve: number | null
  unitSystem: UnitSystem
  preferredMethod: ProportionMethod
  createdAt: Date
  updatedAt: Date
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type UnitSystem = 'METRIC' | 'IMPERIAL'
export type ProportionMethod = 'GOLDEN_RATIO' | 'CLASSIC_PHYSIQUE' | 'MENS_PHYSIQUE'
```

### 3.2 Personal Types (NOVO)

```typescript
// types/personal.ts

export interface Personal {
  id: string
  userId: string
  cref: string | null
  specialties: string[]
  bio: string | null
  phone: string | null
  academyId: string | null
  maxAthletes: number
  createdAt: Date
  updatedAt: Date
}

export interface PersonalWithUser extends Personal {
  user: User
}

export interface PersonalWithAthletes extends PersonalWithUser {
  athletes: User[]
  athleteCount: number        // Computed field
}

export interface PersonalWithAcademy extends PersonalWithUser {
  academy: Academy | null
}

// Input para criação/atualização
export interface PersonalInput {
  cref?: string
  specialties?: string[]
  bio?: string
  phone?: string
}
```

### 3.3 Academy Types (NOVO)

```typescript
// types/academy.ts

export interface Academy {
  id: string
  userId: string
  businessName: string
  legalName: string | null
  cnpj: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  logoUrl: string | null
  primaryColor: string
  maxPersonals: number
  createdAt: Date
  updatedAt: Date
}

export interface AcademyWithUser extends Academy {
  user: User
}

export interface AcademyWithPersonals extends AcademyWithUser {
  personals: PersonalWithAthletes[]
  personalCount: number       // Computed field
  totalAthletes: number       // Computed field
}

// Input para criação/atualização
export interface AcademyInput {
  businessName: string
  legalName?: string
  cnpj?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  logoUrl?: string
  primaryColor?: string
}
```

### 3.4 Invite Types (NOVO)

```typescript
// types/invite.ts

export type InviteStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED'

export interface Invite {
  id: string
  invitedById: string
  invitedByRole: UserRole
  email: string
  name: string | null
  role: UserRole              // Role que o convidado terá
  academyId: string | null
  personalId: string | null
  maxAthletes: number | null  // Se convite para personal
  token: string
  status: InviteStatus
  expiresAt: Date
  acceptedAt: Date | null
  message: string | null
  createdAt: Date
}

export interface InviteWithSender extends Invite {
  invitedBy: User
}

// Input para criar convite
export interface CreateInviteInput {
  email: string
  name?: string
  role: 'ATHLETE' | 'PERSONAL'  // Só esses podem ser convidados
  message?: string
  maxAthletes?: number          // Só para convite de personal
}

// Response ao aceitar convite
export interface AcceptInviteResponse {
  invite: Invite
  user: User
  requiresPassword: boolean     // true se usuário novo precisa definir senha
}
```

### 3.5 Measurement Types

```typescript
// types/measurement.ts

export interface Measurement {
  id: string
  userId: string
  measuredAt: Date
  
  // Composição
  peso: number | null
  gorduraCorporal: number | null
  
  // Medidas principais (cm)
  cintura: number
  ombros: number
  peitoral: number
  braco: number
  antebraco: number
  pescoco: number
  coxa: number
  panturrilha: number
  
  // Bilaterais (opcional)
  bracoEsquerdo: number | null
  bracoDireito: number | null
  coxaEsquerda: number | null
  coxaDireita: number | null
  panturrilhaEsquerda: number | null
  panturrilhaDireita: number | null
  
  notes: string | null
  source: MeasurementSource
  createdAt: Date
  updatedAt: Date
}

export type MeasurementSource = 'MANUAL' | 'PHOTO_AI' | 'SMART_SCALE' | 'IMPORTED' | 'PERSONAL_ENTRY'

// Input para criação de medida
export interface MeasurementInput {
  measuredAt?: Date
  registeredById?: string     // NOVO: ID de quem registrou (personal)
  peso?: number
  gorduraCorporal?: number
  cintura: number
  ombros: number
  peitoral: number
  braco: number
  antebraco: number
  pescoco: number
  coxa: number
  panturrilha: number
  bracoEsquerdo?: number
  bracoDireito?: number
  coxaEsquerda?: number
  coxaDireita?: number
  panturrilhaEsquerda?: number
  panturrilhaDireita?: number
  notes?: string
  source?: MeasurementSource
}

// Medidas completas para cálculo (inclui estruturais do perfil)
export interface FullMeasurements {
  // Estruturais (do Profile)
  altura: number
  punho: number
  tornozelo: number
  joelho: number
  pelve: number
  
  // Variáveis (do Measurement)
  cintura: number
  ombros: number
  peitoral: number
  braco: number
  antebraco: number
  pescoco: number
  coxa: number
  panturrilha: number
}
```

### 3.3 Proportion Types

```typescript
// types/proportions.ts

export interface ProportionScore {
  id: string
  measurementId: string
  method: ProportionMethod
  scoreTotal: number
  scoresDetalhados: ScoresDetalhados
  ideaisCalculados: IdeaisCalculados
  diferencas: Diferencas
  classificacao: ScoreClassification
  createdAt: Date
}

export type ScoreClassification = 
  | 'ELITE'           // 95-100
  | 'AVANCADO'        // 85-94
  | 'INTERMEDIARIO'   // 75-84
  | 'INICIANTE'       // 60-74
  | 'DESENVOLVIMENTO' // 0-59

// Scores detalhados por proporção
export interface ScoresDetalhados {
  ombros: number      // 1. Ombro + Cintura
  peitoral: number    // 2. Peitoral + Punho
  braco: number       // 3. Braço + Punho
  antebraco: number   // 4. Antebraço + Braço
  triade: number      // 5. Pescoço + Braço + Panturrilha
  cintura: number     // 6. Cintura + Pelve
  coxa: number        // 7. Coxa + Joelho + Cintura
  coxaPanturrilha: number // 8. Coxa + Panturrilha
  panturrilha: number // 9. Panturrilha + Tornozelo
}

// Valores ideais calculados
export interface IdeaisCalculados {
  ombros: number
  peitoral: number
  braco: number
  antebraco: number
  triade: TriadeIdeal
  cintura: number
  coxa: number
  coxaPanturrilha: CoxaPanturrilhaIdeal
  panturrilha: number
}

export interface TriadeIdeal {
  valorIdeal: number
  pescoco: number
  panturrilha: number
  regra: string
}

export interface CoxaPanturrilhaIdeal {
  coxaIdeal: number
  panturrilhaRef: number
  regra: string
}

// Diferenças calculadas
export interface Diferencas {
  [key: string]: {
    diferenca: number
    necessario: 'aumentar' | 'diminuir' | 'manter'
  }
}

// Resultado completo de cálculo
export interface ProportionResult {
  method: ProportionMethod
  scoreTotal: number
  scores: ScoresDetalhados
  ideais: IdeaisCalculados
  diferencas: Diferencas
  classificacao: ClassificacaoInfo
}

export interface ClassificacaoInfo {
  nivel: ScoreClassification
  emoji: string
  descricao: string
  cor: string
}

// Comparação entre métodos
export interface MethodComparison {
  goldenRatio: ProportionResult
  classicPhysique: ProportionResult
  mensPhysique: ProportionResult
  recomendacao: {
    melhorCategoria: ProportionMethod
    score: number
    ranking: Array<{
      nome: string
      score: number
    }>
  }
}
```

### 3.4 Goal & Achievement Types

```typescript
// types/goals.ts

export interface Goal {
  id: string
  userId: string
  type: GoalType
  targetMetric: string
  currentValue: number
  targetValue: number
  status: GoalStatus
  completedAt: Date | null
  deadline: Date | null
  createdAt: Date
  updatedAt: Date
}

export type GoalType = 'INCREASE' | 'DECREASE' | 'MAINTAIN' | 'SCORE_TARGET'
export type GoalStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface GoalInput {
  type: GoalType
  targetMetric: string
  targetValue: number
  deadline?: Date
}

// types/achievements.ts

export interface Achievement {
  id: string
  code: string
  name: string
  description: string
  icon: string
  color: string
  category: AchievementCategory
  requirement: AchievementRequirement
  xpReward: number
  isActive: boolean
}

export type AchievementCategory = 
  | 'MEASUREMENT' 
  | 'CONSISTENCY' 
  | 'PROPORTION' 
  | 'PROGRESS' 
  | 'SOCIAL'

export interface AchievementRequirement {
  type: 'score' | 'measurement' | 'streak' | 'count'
  value: number
  method?: ProportionMethod
  metric?: string
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date
  achievement: Achievement
}
```

---

## 4. VALIDAÇÃO ZOD

### 4.1 User Schemas

```typescript
// schemas/user.schema.ts

import { z } from 'zod'

export const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER'])
export const unitSystemSchema = z.enum(['METRIC', 'IMPERIAL'])
export const proportionMethodSchema = z.enum(['GOLDEN_RATIO', 'CLASSIC_PHYSIQUE', 'MENS_PHYSIQUE'])

// Registro de usuário
export const registerUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
})

// Login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

// Atualização de perfil
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  birthDate: z.coerce.date().optional(),
  gender: genderSchema.optional(),
  altura: z.number().min(100).max(250).optional(),
  punho: z.number().min(10).max(25).optional(),
  tornozelo: z.number().min(15).max(35).optional(),
  joelho: z.number().min(25).max(55).optional(),
  pelve: z.number().min(70).max(150).optional(),
  unitSystem: unitSystemSchema.optional(),
  preferredMethod: proportionMethodSchema.optional(),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
```

### 4.2 Measurement Schemas

```typescript
// schemas/measurement.schema.ts

import { z } from 'zod'

const measurementSourceSchema = z.enum(['MANUAL', 'PHOTO_AI', 'SMART_SCALE', 'IMPORTED'])

// Schema base para medidas (valores em cm)
const baseMeasurementSchema = z.object({
  // Composição corporal
  peso: z.number().min(30).max(300).optional(),
  gorduraCorporal: z.number().min(3).max(60).optional(),
  
  // Medidas principais obrigatórias
  cintura: z.number().min(50).max(150),
  ombros: z.number().min(80).max(180),
  peitoral: z.number().min(70).max(170),
  braco: z.number().min(20).max(70),
  antebraco: z.number().min(15).max(50),
  pescoco: z.number().min(25).max(60),
  coxa: z.number().min(35).max(90),
  panturrilha: z.number().min(25).max(60),
})

// Schema para medidas bilaterais (opcional)
const bilateralMeasurementsSchema = z.object({
  bracoEsquerdo: z.number().min(20).max(70).optional(),
  bracoDireito: z.number().min(20).max(70).optional(),
  coxaEsquerda: z.number().min(35).max(90).optional(),
  coxaDireita: z.number().min(35).max(90).optional(),
  panturrilhaEsquerda: z.number().min(25).max(60).optional(),
  panturrilhaDireita: z.number().min(25).max(60).optional(),
})

// Schema completo para criar medida
export const createMeasurementSchema = baseMeasurementSchema
  .merge(bilateralMeasurementsSchema)
  .extend({
    measuredAt: z.coerce.date().optional(),
    notes: z.string().max(500).optional(),
    source: measurementSourceSchema.optional(),
  })

// Schema para atualizar medida
export const updateMeasurementSchema = createMeasurementSchema.partial()

// Schema para medidas estruturais (do perfil)
export const structuralMeasurementsSchema = z.object({
  altura: z.number().min(100).max(250),
  punho: z.number().min(10).max(25),
  tornozelo: z.number().min(15).max(35),
  joelho: z.number().min(25).max(55),
  pelve: z.number().min(70).max(150),
})

// Schema completo para cálculo de proporções
export const fullMeasurementsSchema = structuralMeasurementsSchema.merge(baseMeasurementSchema)

export type CreateMeasurementInput = z.infer<typeof createMeasurementSchema>
export type UpdateMeasurementInput = z.infer<typeof updateMeasurementSchema>
export type StructuralMeasurements = z.infer<typeof structuralMeasurementsSchema>
export type FullMeasurements = z.infer<typeof fullMeasurementsSchema>
```

### 4.3 Goal Schemas

```typescript
// schemas/goal.schema.ts

import { z } from 'zod'

const goalTypeSchema = z.enum(['INCREASE', 'DECREASE', 'MAINTAIN', 'SCORE_TARGET'])
const goalStatusSchema = z.enum(['IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED'])

// Métricas válidas para metas
const validMetrics = [
  'ombros', 'peitoral', 'braco', 'antebraco', 'pescoco',
  'cintura', 'coxa', 'panturrilha', 'peso', 'gorduraCorporal',
  'scoreTotal', 'scoreGoldenRatio', 'scoreClassic', 'scoreMensPhysique'
] as const

export const createGoalSchema = z.object({
  type: goalTypeSchema,
  targetMetric: z.enum(validMetrics),
  targetValue: z.number().positive(),
  deadline: z.coerce.date().optional(),
})

export const updateGoalSchema = z.object({
  targetValue: z.number().positive().optional(),
  status: goalStatusSchema.optional(),
  deadline: z.coerce.date().optional(),
})

export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
```

---

## 5. QUERIES E MUTATIONS COMUNS

### 5.1 User Queries

```typescript
// services/queries/user.queries.ts

import { prisma } from '@/lib/prisma'

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  })
}
```

### 5.2 Measurement Queries

```typescript
// services/queries/measurement.queries.ts

import { prisma } from '@/lib/prisma'

export async function getMeasurementsByUser(
  userId: string,
  options?: {
    limit?: number
    offset?: number
    startDate?: Date
    endDate?: Date
  }
) {
  const { limit = 10, offset = 0, startDate, endDate } = options ?? {}
  
  return prisma.measurement.findMany({
    where: {
      userId,
      measuredAt: {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      },
    },
    orderBy: { measuredAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      scores: true,
      photos: true,
    },
  })
}

export async function getLatestMeasurement(userId: string) {
  return prisma.measurement.findFirst({
    where: { userId },
    orderBy: { measuredAt: 'desc' },
    include: { scores: true },
  })
}

export async function getMeasurementWithScores(id: string) {
  return prisma.measurement.findUnique({
    where: { id },
    include: {
      scores: true,
      photos: true,
    },
  })
}
```

### 5.3 Measurement Mutations

```typescript
// services/mutations/measurement.mutations.ts

import { prisma } from '@/lib/prisma'
import type { CreateMeasurementInput } from '@/schemas/measurement.schema'
import { calculateAllProportions } from '@/services/calculations'

export async function createMeasurement(
  userId: string,
  input: CreateMeasurementInput
) {
  // 1. Buscar dados estruturais do perfil
  const profile = await prisma.profile.findUnique({
    where: { userId },
  })
  
  if (!profile?.altura || !profile?.punho) {
    throw new Error('Perfil incompleto. Preencha as medidas estruturais.')
  }
  
  // 2. Criar medição
  const measurement = await prisma.measurement.create({
    data: {
      userId,
      ...input,
      measuredAt: input.measuredAt ?? new Date(),
      source: input.source ?? 'MANUAL',
    },
  })
  
  // 3. Calcular scores para todos os métodos
  const fullMeasurements = {
    altura: profile.altura,
    punho: profile.punho,
    tornozelo: profile.tornozelo!,
    joelho: profile.joelho!,
    pelve: profile.pelve!,
    ...input,
  }
  
  const results = calculateAllProportions(fullMeasurements)
  
  // 4. Salvar scores
  const scoresToCreate = [
    { method: 'GOLDEN_RATIO', ...results.goldenRatio },
    { method: 'CLASSIC_PHYSIQUE', ...results.classicPhysique },
    { method: 'MENS_PHYSIQUE', ...results.mensPhysique },
  ]
  
  await prisma.proportionScore.createMany({
    data: scoresToCreate.map(score => ({
      measurementId: measurement.id,
      method: score.method,
      scoreTotal: score.scoreTotal,
      scoresDetalhados: score.scores,
      ideaisCalculados: score.ideais,
      diferencas: score.diferencas,
      classificacao: score.classificacao.nivel,
    })),
  })
  
  // 5. Verificar achievements
  await checkAndUnlockAchievements(userId, results)
  
  // 6. Retornar medição completa
  return prisma.measurement.findUnique({
    where: { id: measurement.id },
    include: { scores: true },
  })
}
```

---

## 6. ÍNDICES E PERFORMANCE

### 6.1 Índices Recomendados

```prisma
// Já definidos no schema acima com @@index

// Índices principais:
// - users: email (unique)
// - sessions: userId, token
// - measurements: userId, measuredAt
// - proportion_scores: measurementId
// - body_photos: userId, measurementId
// - goals: userId
// - user_achievements: [userId, achievementId] (unique)
```

### 6.2 Queries Otimizadas

```typescript
// Para listagens paginadas, sempre usar:
// - take/skip para paginação
// - select para campos específicos
// - orderBy com índice

// Exemplo de query otimizada
export async function getMeasurementsSummary(userId: string, limit = 30) {
  return prisma.measurement.findMany({
    where: { userId },
    select: {
      id: true,
      measuredAt: true,
      peso: true,
      cintura: true,
      ombros: true,
      scores: {
        select: {
          method: true,
          scoreTotal: true,
          classificacao: true,
        },
      },
    },
    orderBy: { measuredAt: 'desc' },
    take: limit,
  })
}
```

---

## 7. MIGRATIONS

### 7.1 Comandos Prisma

```bash
# Criar migration
npx prisma migrate dev --name init

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (dev only)
npx prisma migrate reset

# Gerar client
npx prisma generate

# Abrir Prisma Studio
npx prisma studio
```

### 7.2 Seed Data

```typescript
// prisma/seed.ts

import { prisma } from '../src/lib/prisma'

async function main() {
  // Criar achievements padrão
  const achievements = [
    {
      code: 'FIRST_MEASUREMENT',
      name: 'Primeira Medição',
      description: 'Registrou sua primeira medição corporal',
      icon: '📏',
      color: '#00C9A7',
      category: 'MEASUREMENT',
      requirement: { type: 'count', value: 1 },
      xpReward: 100,
    },
    {
      code: 'GOLDEN_ELITE',
      name: 'Elite Dourada',
      description: 'Atingiu score Elite no Golden Ratio',
      icon: '🏆',
      color: '#FFD700',
      category: 'PROPORTION',
      requirement: { type: 'score', value: 95, method: 'GOLDEN_RATIO' },
      xpReward: 500,
    },
    {
      code: 'WEEK_STREAK',
      name: 'Semana Consistente',
      description: 'Registrou medidas por 7 dias seguidos',
      icon: '🔥',
      color: '#EF4444',
      category: 'CONSISTENCY',
      requirement: { type: 'streak', value: 7 },
      xpReward: 200,
    },
    // ... mais achievements
  ]
  
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { code: achievement.code },
      update: achievement,
      create: achievement,
    })
  }
  
  console.log('Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

---

## 8. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do Data Model |
| 1.1 | Fev/2026 | Adicionado Multi-User: Personal, Academy, Invite, Roles |

---

**SHAPE-V Data Model**  
*PostgreSQL • Prisma • Zod • TypeScript • Multi-User*
