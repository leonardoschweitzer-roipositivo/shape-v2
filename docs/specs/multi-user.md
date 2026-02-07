# SPEC: Multi-User System - SHAPE-V

## Documento de Especificação do Sistema Multi-Usuário

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** SHAPE-V (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

O SHAPE-V atende 3 tipos de usuários, cada um podendo contratar o sistema diretamente:

### 1.1 Tipos de Usuários

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODELO DE NEGÓCIO SHAPE-V                    │
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

### 1.2 Resumo de Funcionalidades por Tipo

| Funcionalidade | Atleta | Personal | Academia |
|----------------|--------|----------|----------|
| Registrar próprias medidas | ✅ | ❌ | ❌ |
| Ver próprio dashboard | ✅ | ❌ | ❌ |
| Cadastrar atletas | ❌ | ✅ | ❌ |
| Cadastrar personais | ❌ | ❌ | ✅ |
| Ver dashboard de alunos | ❌ | ✅ | ✅ |
| Registrar medidas de alunos | ❌ | ✅ | ❌* |
| Relatórios consolidados | ❌ | ✅ | ✅ |
| Gerenciar planos/assinaturas | ❌ | ✅ | ✅ |

*Academia vê, mas quem registra é o Personal

---

## 2. MODELO DE DADOS

### 2.1 Diagrama de Entidades

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   ACADEMY   │──────<│   PERSONAL  │──────<│   ATHLETE   │
│  (Academia) │ 1:N   │  (Personal) │ 1:N   │  (Atleta)   │
└─────────────┘       └─────────────┘       └─────────────┘
                             │                     │
                             │ (pode ser           │
                             │  independente)      │
                             │                     │
                      ┌──────┴──────┐       ┌──────┴──────┐
                      │    USER     │       │ MEASUREMENT │
                      │  (base)     │       │  (Medidas)  │
                      └─────────────┘       └─────────────┘
```

### 2.2 Schema Prisma (Adições)

```prisma
// ============================================
// USER (Atualizado - adicionar role)
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  name          String?
  avatarUrl     String?
  
  // NOVO: Tipo de usuário
  role          UserRole  @default(ATHLETE)
  
  // OAuth
  googleId      String?   @unique
  appleId       String?   @unique
  
  // Status
  emailVerified DateTime?
  isActive      Boolean   @default(true)
  
  // Subscription
  plan          PlanType  @default(FREE)
  planExpiresAt DateTime?
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLoginAt   DateTime?
  
  // Relations
  profile       Profile?
  
  // Atleta
  measurements  Measurement[]
  goals         Goal[]
  achievements  UserAchievement[]
  photos        BodyPhoto[]
  
  // Personal
  personal      Personal?
  
  // Academia
  academy       Academy?
  
  // Vinculações (atleta pode estar vinculado a personal)
  assignedTo    Personal? @relation("AthletePersonal", fields: [personalId], references: [id])
  personalId    String?
  
  @@map("users")
}

enum UserRole {
  ATHLETE       // Atleta individual
  PERSONAL      // Personal trainer
  ACADEMY       // Academia/Empresa
  ADMIN         // Administrador do sistema
}

enum PlanType {
  FREE
  PERSONAL_BASIC     // Personal: até 10 alunos
  PERSONAL_PRO       // Personal: até 50 alunos
  PERSONAL_UNLIMITED // Personal: ilimitado
  ACADEMY_BASIC      // Academia: até 5 personais
  ACADEMY_PRO        // Academia: até 20 personais
  ACADEMY_UNLIMITED  // Academia: ilimitado
}

// ============================================
// PERSONAL (Novo)
// ============================================

model Personal {
  id            String    @id @default(cuid())
  userId        String    @unique
  
  // Dados profissionais
  cref          String?   // Registro profissional
  specialties   String[]  // Especialidades
  bio           String?   // Biografia
  
  // Vinculação com academia (opcional)
  academyId     String?
  academy       Academy?  @relation(fields: [academyId], references: [id])
  
  // Limites do plano
  maxAthletes   Int       @default(10)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  athletes      User[]    @relation("AthletePersonal")
  
  @@map("personals")
}

// ============================================
// ACADEMY (Novo)
// ============================================

model Academy {
  id            String    @id @default(cuid())
  userId        String    @unique  // User admin da academia
  
  // Dados da empresa
  businessName  String              // Nome fantasia
  legalName     String?             // Razão social
  cnpj          String?   @unique
  
  // Contato
  phone         String?
  address       String?
  city          String?
  state         String?
  
  // Visual
  logoUrl       String?
  primaryColor  String?   @default("#00C9A7")
  
  // Limites do plano
  maxPersonals  Int       @default(5)
  
  // Timestamps
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  personals     Personal[]
  
  @@map("academies")
}

// ============================================
// INVITES (Convites pendentes)
// ============================================

model Invite {
  id            String       @id @default(cuid())
  
  // Quem convidou
  invitedBy     String       // UserId de quem convidou
  invitedByRole UserRole     // PERSONAL ou ACADEMY
  
  // Convidado
  email         String
  role          UserRole     // ATHLETE (para personal) ou PERSONAL (para academia)
  
  // Contexto
  academyId     String?      // Se convite de academia
  personalId    String?      // Se convite de personal
  
  // Token
  token         String       @unique
  
  // Status
  status        InviteStatus @default(PENDING)
  expiresAt     DateTime
  acceptedAt    DateTime?
  
  // Timestamps
  createdAt     DateTime     @default(now())
  
  @@index([email])
  @@index([token])
  @@map("invites")
}

enum InviteStatus {
  PENDING
  ACCEPTED
  EXPIRED
  CANCELLED
}
```

### 2.3 Tipos TypeScript

```typescript
// types/users.ts

export type UserRole = 'ATHLETE' | 'PERSONAL' | 'ACADEMY' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: UserRole
  plan: PlanType
  planExpiresAt: Date | null
  isActive: boolean
  createdAt: Date
  personalId: string | null  // Se atleta vinculado a personal
}

export interface Personal {
  id: string
  userId: string
  user: User
  cref: string | null
  specialties: string[]
  bio: string | null
  academyId: string | null
  academy: Academy | null
  maxAthletes: number
  athleteCount: number       // Computed
  athletes: User[]
  createdAt: Date
}

export interface Academy {
  id: string
  userId: string
  user: User
  businessName: string
  legalName: string | null
  cnpj: string | null
  phone: string | null
  logoUrl: string | null
  primaryColor: string
  maxPersonals: number
  personalCount: number      // Computed
  personals: Personal[]
  createdAt: Date
}

export interface Invite {
  id: string
  invitedBy: string
  invitedByRole: UserRole
  email: string
  role: UserRole
  status: InviteStatus
  expiresAt: Date
  createdAt: Date
}
```

---

## 3. PERMISSÕES E ACESSO

### 3.1 Matriz de Permissões

```typescript
const PERMISSIONS = {
  // Atleta
  ATHLETE: {
    // Próprios dados
    'own:profile:read': true,
    'own:profile:write': true,
    'own:measurements:read': true,
    'own:measurements:write': true,
    'own:evolution:read': true,
    'own:goals:read': true,
    'own:goals:write': true,
    
    // Dados de outros
    'athletes:read': false,
    'athletes:write': false,
    'personals:read': false,
    'personals:write': false,
  },
  
  // Personal
  PERSONAL: {
    // Próprios dados
    'own:profile:read': true,
    'own:profile:write': true,
    
    // Atletas (seus alunos)
    'athletes:read': true,
    'athletes:write': true,
    'athletes:invite': true,
    'athletes:measurements:read': true,
    'athletes:measurements:write': true,
    'athletes:evolution:read': true,
    
    // Relatórios
    'reports:athletes': true,
    
    // Outros personais
    'personals:read': false,
    'personals:write': false,
  },
  
  // Academia
  ACADEMY: {
    // Próprios dados
    'own:profile:read': true,
    'own:profile:write': true,
    
    // Personais (funcionários)
    'personals:read': true,
    'personals:write': true,
    'personals:invite': true,
    
    // Atletas (via personais)
    'athletes:read': true,
    'athletes:write': false,  // Só personal pode editar
    'athletes:evolution:read': true,
    
    // Relatórios
    'reports:athletes': true,
    'reports:personals': true,
    'reports:consolidated': true,
  },
}
```

### 3.2 Middleware de Autorização

```typescript
// middleware/authorization.ts

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Você não tem permissão para acessar este recurso',
      })
    }
    
    next()
  }
}

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    const userPermissions = PERMISSIONS[user.role]
    
    if (!userPermissions[permission]) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Você não tem permissão para esta ação',
      })
    }
    
    next()
  }
}

// Verificar se personal pode acessar atleta específico
export async function requireAthleteAccess(req: Request, res: Response, next: NextFunction) {
  const user = req.user
  const athleteId = req.params.athleteId
  
  if (user.role === 'ATHLETE') {
    // Atleta só pode acessar próprios dados
    if (user.id !== athleteId) {
      return res.status(403).json({ error: 'FORBIDDEN' })
    }
  }
  
  if (user.role === 'PERSONAL') {
    // Personal só pode acessar seus atletas
    const athlete = await prisma.user.findFirst({
      where: { id: athleteId, personalId: user.personal.id }
    })
    if (!athlete) {
      return res.status(403).json({ error: 'FORBIDDEN' })
    }
  }
  
  if (user.role === 'ACADEMY') {
    // Academia pode acessar atletas de seus personais
    const athlete = await prisma.user.findFirst({
      where: {
        id: athleteId,
        assignedTo: {
          academyId: user.academy.id
        }
      }
    })
    if (!athlete) {
      return res.status(403).json({ error: 'FORBIDDEN' })
    }
  }
  
  next()
}
```

---

## 4. ROTAS DA API (Adições)

### 4.1 Rotas do Personal

```typescript
// Personal - Gerenciamento de Atletas
GET    /personal/athletes              // Lista atletas do personal
GET    /personal/athletes/:id          // Detalhe do atleta
POST   /personal/athletes/invite       // Convida novo atleta
DELETE /personal/athletes/:id          // Remove vínculo com atleta

// Personal - Medições de Atletas
GET    /personal/athletes/:id/measurements     // Lista medições do atleta
POST   /personal/athletes/:id/measurements     // Registra medição para atleta
GET    /personal/athletes/:id/evolution        // Evolução do atleta
GET    /personal/athletes/:id/proportions      // Proporções do atleta

// Personal - Dashboard
GET    /personal/dashboard             // Dashboard do personal
GET    /personal/reports               // Relatórios consolidados

// Personal - Perfil
GET    /personal/profile               // Perfil do personal
PATCH  /personal/profile               // Atualiza perfil
```

### 4.2 Rotas da Academia

```typescript
// Academia - Gerenciamento de Personais
GET    /academy/personals              // Lista personais da academia
GET    /academy/personals/:id          // Detalhe do personal
POST   /academy/personals/invite       // Convida novo personal
DELETE /academy/personals/:id          // Remove vínculo com personal

// Academia - Visualização de Atletas
GET    /academy/athletes               // Lista todos atletas (de todos personais)
GET    /academy/athletes/:id           // Detalhe do atleta (read-only)

// Academia - Dashboard
GET    /academy/dashboard              // Dashboard da academia
GET    /academy/reports                // Relatórios consolidados
GET    /academy/reports/personals      // Relatório por personal
GET    /academy/reports/athletes       // Relatório de atletas

// Academia - Perfil
GET    /academy/profile                // Perfil da academia
PATCH  /academy/profile                // Atualiza perfil
```

### 4.3 Rotas de Convites

```typescript
// Convites
GET    /invites                        // Lista convites enviados
POST   /invites                        // Cria convite
DELETE /invites/:id                    // Cancela convite
GET    /invites/accept/:token          // Aceita convite (público)
POST   /invites/accept/:token          // Confirma aceitação
```

---

## 5. TELAS DO PERSONAL

### 5.1 Navegação (Sidebar)

```
┌─────────────────────┐
│  🏋️ SHAPE-V         │
│  Personal           │
├─────────────────────┤
│                     │
│  📊 Dashboard       │
│                     │
│  👥 Meus Alunos     │
│                     │
│  📈 Relatórios      │
│                     │
│  ⚙️ Configurações   │
│                     │
├─────────────────────┤
│  SISTEMA            │
│                     │
│  👤 Meu Perfil      │
│  💳 Meu Plano       │
│  🚪 Sair            │
│                     │
└─────────────────────┘
```

### 5.2 Dashboard do Personal

```
┌─────────────────────────────────────────────────────────────────┐
│  SHAPE-V / PERSONAL                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👋 Olá, Professor Carlos!                                      │
│  Você tem 12 alunos ativos.                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📊 RESUMO GERAL                                             ││
│  │                                                             ││
│  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    ││
│  │ │  ALUNOS   │ │  MEDIRAM  │ │   SCORE   │ │  PRECISAM │    ││
│  │ │  ATIVOS   │ │  SEMANA   │ │   MÉDIO   │ │  ATENÇÃO  │    ││
│  │ │    12     │ │    8      │ │   76.5    │ │     3     │    ││
│  │ │           │ │   67%     │ │   +2.3    │ │           │    ││
│  │ └───────────┘ └───────────┘ └───────────┘ └───────────┘    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ⚠️ ALUNOS QUE PRECISAM DE ATENÇÃO                           ││
│  │                                                             ││
│  │ ┌─────────────────────────────────────────────────────────┐ ││
│  │ │ 👤 João Silva          Última medição: 18 dias atrás    │ ││
│  │ │    Score: 72 (↓3)      [Ver perfil] [Enviar lembrete]   │ ││
│  │ └─────────────────────────────────────────────────────────┘ ││
│  │ ┌─────────────────────────────────────────────────────────┐ ││
│  │ │ 👤 Maria Santos        Assimetria alta: Braço 9.2%      │ ││
│  │ │    Score: 68           [Ver perfil] [Ver análise]       │ ││
│  │ └─────────────────────────────────────────────────────────┘ ││
│  │ ┌─────────────────────────────────────────────────────────┐ ││
│  │ │ 👤 Pedro Costa         Score caiu 5pts no último mês    │ ││
│  │ │    Score: 65 (↓5)      [Ver perfil] [Ver evolução]      │ ││
│  │ └─────────────────────────────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────────┐ ┌────────────────────────────┐│
│  │ 🏆 TOP PERFORMERS            │ │ 📈 ATIVIDADE RECENTE       ││
│  │                              │ │                            ││
│  │ 1. Ana Lima      92 pts 🥇  │ │ • João mediu hoje          ││
│  │ 2. Carlos Souza  88 pts 🥈  │ │ • Maria atingiu meta       ││
│  │ 3. Fernanda Dias 85 pts 🥉  │ │ • Pedro registrou medidas  ││
│  │ 4. Lucas Alves   83 pts     │ │ • Ana bateu recorde        ││
│  │ 5. Julia Rocha   81 pts     │ │                            ││
│  │                              │ │                            ││
│  │ [Ver ranking completo]       │ │ [Ver todas atividades]     ││
│  └──────────────────────────────┘ └────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📅 PRÓXIMAS AÇÕES                                           ││
│  │                                                             ││
│  │ • 4 alunos não medem há mais de 7 dias                      ││
│  │ • 2 alunos próximos de bater meta                           ││
│  │ • 1 aluno com aniversário esta semana 🎂                    ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Lista de Alunos

```
┌─────────────────────────────────────────────────────────────────┐
│  SHAPE-V / MEUS ALUNOS                      [+ Convidar Aluno]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 Buscar aluno...                    Filtrar: [Todos ▼]       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ALUNO              SCORE    RATIO    ÚLTIMA      STATUS    ││
│  │                                       MEDIÇÃO               ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │                                                             ││
│  │  👤 Ana Lima          92    1.58     Hoje        🟢 Ativo   ││
│  │     ana@email.com                                           ││
│  │                                                             ││
│  │  👤 Carlos Souza      88    1.52     2 dias      🟢 Ativo   ││
│  │     carlos@email.com                                        ││
│  │                                                             ││
│  │  👤 Fernanda Dias     85    1.49     5 dias      🟢 Ativo   ││
│  │     fer@email.com                                           ││
│  │                                                             ││
│  │  👤 João Silva        72    1.42     18 dias     🟡 Inativo ││
│  │     joao@email.com                                          ││
│  │                                                             ││
│  │  👤 Pedro Costa       65    1.35     3 dias      🔴 Atenção ││
│  │     pedro@email.com                                         ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Mostrando 5 de 12 alunos                    [1] [2] [3] [→]    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Detalhe do Aluno (Visão do Personal)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Voltar    SHAPE-V / ALUNO / ANA LIMA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────┐  ┌──────────────────────────────────────┐│
│  │                   │  │ ANA LIMA                             ││
│  │      [Avatar]     │  │ ana@email.com                        ││
│  │                   │  │ Aluna desde: Jan/2023                ││
│  │                   │  │                                      ││
│  └───────────────────┘  │ ┌────────┐ ┌────────┐ ┌────────┐    ││
│                         │ │ SCORE  │ │ RATIO  │ │ EVOL.  │    ││
│                         │ │   92   │ │  1.58  │ │  +8%   │    ││
│                         │ └────────┘ └────────┘ └────────┘    ││
│                         └──────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ [Dashboard] [Evolução] [Medições] [Metas] [Anotações]       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  [Aqui carrega o Dashboard/Evolução/etc do atleta           ││
│  │   - Mesmas telas que o atleta vê, mas em modo visualização] ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🏋️ AÇÕES DO PERSONAL                                        ││
│  │                                                             ││
│  │ [+ Registrar Medição]  [📝 Adicionar Nota]  [🎯 Definir Meta]││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.5 Modal: Convidar Aluno

```
┌─────────────────────────────────────────────────────────────────┐
│                                                            [X]  │
│                                                                 │
│  📨 CONVIDAR NOVO ALUNO                                         │
│                                                                 │
│  Envie um convite por email para seu aluno se cadastrar         │
│  no SHAPE-V vinculado a você.                                   │
│                                                                 │
│  Email do aluno:                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ aluno@email.com                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Nome (opcional):                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ João da Silva                                               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Mensagem personalizada (opcional):                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Olá! Convido você para usar o SHAPE-V para                  ││
│  │ acompanharmos juntos sua evolução física.                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ℹ️ O aluno receberá um email com link para se cadastrar.       │
│     Após o cadastro, ele aparecerá automaticamente na sua       │
│     lista de alunos.                                            │
│                                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              ENVIAR CONVITE                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Convites pendentes: 2 de 10 (plano atual)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.6 Modal: Registrar Medição (para aluno)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                            [X]  │
│                                                                 │
│  📏 REGISTRAR MEDIÇÃO PARA ANA LIMA                             │
│                                                                 │
│  Data da medição:                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 07/02/2026                                            [📅] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Ombros          cm   │  │ Peitoral        cm   │            │
│  │ [    120        ]    │  │ [    108        ]    │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Braço           cm   │  │ Antebraço       cm   │            │
│  │ [    38         ]    │  │ [    30         ]    │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Pescoço         cm   │  │ Cintura         cm   │            │
│  │ [    38         ]    │  │ [    76         ]    │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Coxa            cm   │  │ Panturrilha     cm   │            │
│  │ [    58         ]    │  │ [    38         ]    │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                 │
│  [ ] Incluir medidas bilaterais (E/D)                          │
│                                                                 │
│  Observações:                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Medição realizada após treino de membros superiores.        ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              SALVAR MEDIÇÃO                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. TELAS DA ACADEMIA

### 6.1 Navegação (Sidebar)

```
┌─────────────────────┐
│  🏢 SHAPE-V         │
│  Academia           │
├─────────────────────┤
│                     │
│  📊 Dashboard       │
│                     │
│  🏋️ Personais       │
│                     │
│  👥 Todos Alunos    │
│                     │
│  📈 Relatórios      │
│                     │
│  ⚙️ Configurações   │
│                     │
├─────────────────────┤
│  SISTEMA            │
│                     │
│  🏢 Perfil Academia │
│  💳 Plano           │
│  🚪 Sair            │
│                     │
└─────────────────────┘
```

### 6.2 Dashboard da Academia

```
┌─────────────────────────────────────────────────────────────────┐
│  SHAPE-V / ACADEMIA                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🏢 Academia Fitness Pro                                        │
│  Visão geral do seu negócio                                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📊 RESUMO GERAL                                             ││
│  │                                                             ││
│  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    ││
│  │ │ PERSONAIS │ │  ALUNOS   │ │  MEDIRAM  │ │   SCORE   │    ││
│  │ │  ATIVOS   │ │  TOTAIS   │ │  SEMANA   │ │   MÉDIO   │    ││
│  │ │     8     │ │    94     │ │    67     │ │   74.2    │    ││
│  │ │   de 10   │ │           │ │   71%     │ │   +1.8    │    ││
│  │ └───────────┘ └───────────┘ └───────────┘ └───────────┘    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────────┐ ┌────────────────────────────┐│
│  │ 🏋️ PERFORMANCE PERSONAIS     │ │ 📈 DISTRIBUIÇÃO SCORES     ││
│  │                              │ │                            ││
│  │ Personal      Alunos  Média  │ │      [Gráfico de pizza]    ││
│  │ ────────────────────────────│ │                            ││
│  │ Carlos Lima     15    82.3  │ │  🟢 Elite (5%)             ││
│  │ Ana Souza       12    78.5  │ │  🟢 Avançado (22%)         ││
│  │ Pedro Santos    14    76.2  │ │  🟡 Intermediário (45%)    ││
│  │ Maria Costa     11    74.8  │ │  🟠 Iniciante (20%)        ││
│  │ João Silva      10    71.3  │ │  🔴 Desenvolvimento (8%)   ││
│  │ ...                         │ │                            ││
│  │                              │ │                            ││
│  │ [Ver todos]                  │ │                            ││
│  └──────────────────────────────┘ └────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📅 ATIVIDADE RECENTE                                        ││
│  │                                                             ││
│  │ • Carlos Lima adicionou 2 novos alunos                      ││
│  │ • 15 medições registradas hoje                              ││
│  │ • Ana Souza: aluno João atingiu score 85 🎉                 ││
│  │ • 3 alunos não medem há mais de 14 dias                     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ⚠️ ALERTAS                                                  ││
│  │                                                             ││
│  │ • Personal Maria Costa: 3 alunos inativos há 2+ semanas    ││
│  │ • Limite de alunos: João Silva está em 10/10               ││
│  │ • 5 alunos com queda de score no último mês                ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Lista de Personais

```
┌─────────────────────────────────────────────────────────────────┐
│  SHAPE-V / PERSONAIS                      [+ Convidar Personal] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 Buscar personal...                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  PERSONAL           ALUNOS   SCORE    ATIVIDADE   STATUS    ││
│  │                              MÉDIO    ÚLTIMA                ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │                                                             ││
│  │  🏋️ Carlos Lima       15     82.3    Hoje        🟢 Ativo   ││
│  │     CREF: 012345-G/SP                                       ││
│  │     carlos@academia.com                                     ││
│  │                                                             ││
│  │  🏋️ Ana Souza         12     78.5    Ontem       🟢 Ativo   ││
│  │     CREF: 023456-G/SP                                       ││
│  │     ana@academia.com                                        ││
│  │                                                             ││
│  │  🏋️ Pedro Santos      14     76.2    3 dias      🟢 Ativo   ││
│  │     CREF: 034567-G/SP                                       ││
│  │     pedro@academia.com                                      ││
│  │                                                             ││
│  │  🏋️ Maria Costa       11     74.8    7 dias      🟡 Pouco   ││
│  │     CREF: 045678-G/SP                             ativo     ││
│  │     maria@academia.com                                      ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Mostrando 4 de 8 personais                  [1] [2] [→]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.4 Detalhe do Personal (Visão da Academia)

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Voltar    SHAPE-V / PERSONAL / CARLOS LIMA                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────┐  ┌──────────────────────────────────────┐│
│  │                   │  │ CARLOS LIMA                          ││
│  │      [Avatar]     │  │ carlos@academia.com                  ││
│  │                   │  │ CREF: 012345-G/SP                    ││
│  │                   │  │ Desde: Mar/2022                      ││
│  └───────────────────┘  │                                      ││
│                         │ ┌────────┐ ┌────────┐ ┌────────┐    ││
│                         │ │ ALUNOS │ │ SCORE  │ │ ATIVOS │    ││
│                         │ │   15   │ │  82.3  │ │  14    │    ││
│                         │ └────────┘ └────────┘ └────────┘    ││
│                         └──────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ [Alunos] [Estatísticas] [Atividade]                         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 👥 ALUNOS DE CARLOS LIMA                                    ││
│  │                                                             ││
│  │  ALUNO              SCORE    RATIO    ÚLTIMA      STATUS    ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │  👤 Lucas Alves       88    1.55     Hoje        🟢 Ativo   ││
│  │  👤 Julia Rocha       85    1.52     2 dias      🟢 Ativo   ││
│  │  👤 Marcos Silva      82    1.48     3 dias      🟢 Ativo   ││
│  │  👤 Carla Santos      79    1.45     5 dias      🟢 Ativo   ││
│  │  ...                                                        ││
│  │                                                             ││
│  │  [Ver todos os 15 alunos]                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Todos os Alunos (Visão Consolidada)

```
┌─────────────────────────────────────────────────────────────────┐
│  SHAPE-V / TODOS OS ALUNOS                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 Buscar aluno...         Personal: [Todos ▼]  Status: [Todos ▼]│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │  ALUNO           PERSONAL      SCORE  RATIO  ÚLTIMA  STATUS ││
│  │  ─────────────────────────────────────────────────────────  ││
│  │                                                             ││
│  │  👤 Lucas Alves   Carlos Lima    88   1.55   Hoje    🟢     ││
│  │  👤 Julia Rocha   Carlos Lima    85   1.52   2d      🟢     ││
│  │  👤 Ana Pereira   Ana Souza      84   1.51   1d      🟢     ││
│  │  👤 Marcos Silva  Carlos Lima    82   1.48   3d      🟢     ││
│  │  👤 Fernanda Luz  Pedro Santos   80   1.46   Hoje    🟢     ││
│  │  👤 Roberto Dias  Ana Souza      78   1.44   5d      🟢     ││
│  │  👤 Carla Santos  Carlos Lima    79   1.45   5d      🟢     ││
│  │  👤 Paulo Neves   Maria Costa    72   1.40   12d     🟡     ││
│  │  👤 Sandra Lima   Pedro Santos   68   1.36   8d      🟡     ││
│  │  👤 João Costa    Maria Costa    65   1.33   15d     🔴     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Mostrando 10 de 94 alunos                   [1] [2] ... [10] [→]│
│                                                                 │
│  [📊 Exportar relatório]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.6 Modal: Convidar Personal

```
┌─────────────────────────────────────────────────────────────────┐
│                                                            [X]  │
│                                                                 │
│  📨 CONVIDAR NOVO PERSONAL                                      │
│                                                                 │
│  Envie um convite para um personal trainer se vincular          │
│  à sua academia no SHAPE-V.                                     │
│                                                                 │
│  Email do personal:                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ personal@email.com                                          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Nome (opcional):                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Carlos da Silva                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  CREF (opcional):                                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 012345-G/SP                                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Limite de alunos para este personal:                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 20                                                     [▼] ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ℹ️ O personal receberá um email com link para aceitar o        │
│     convite. Se já tiver conta, será vinculado automaticamente. │
│     Se não, criará uma conta nova.                              │
│                                                                 │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              ENVIAR CONVITE                                 ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Personais ativos: 8 de 10 (plano atual)                        │
│  [Fazer upgrade do plano]                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. RELATÓRIOS

### 7.1 Relatórios do Personal

```
┌─────────────────────────────────────────────────────────────────┐
│  SHAPE-V / RELATÓRIOS                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Período: [Último mês ▼]     [📊 Exportar PDF] [📧 Enviar]      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📊 RESUMO DO PERÍODO                                        ││
│  │                                                             ││
│  │ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    ││
│  │ │  ALUNOS   │ │ MEDIÇÕES  │ │ SCORE     │ │  NOVOS    │    ││
│  │ │  ATIVOS   │ │ REGISTR.  │ │ MÉDIO     │ │  ALUNOS   │    ││
│  │ │    12     │ │    45     │ │  76.5     │ │    2      │    ││
│  │ │   +1      │ │  +12%     │ │  +2.3     │ │           │    ││
│  │ └───────────┘ └───────────┘ └───────────┘ └───────────┘    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📈 EVOLUÇÃO DOS ALUNOS                                      ││
│  │                                                             ││
│  │  [Gráfico de linha: Score médio ao longo do mês]            ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🏆 TOP EVOLUÇÕES DO MÊS                                     ││
│  │                                                             ││
│  │  1. Ana Lima       +8 pts    68 → 76                        ││
│  │  2. Carlos Dias    +6 pts    72 → 78                        ││
│  │  3. Maria Santos   +5 pts    70 → 75                        ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ⚠️ PRECISAM DE ATENÇÃO                                      ││
│  │                                                             ││
│  │  • João Silva: não mede há 18 dias                          ││
│  │  • Pedro Costa: score caiu 5 pontos                         ││
│  │  • Lucia Alves: assimetria alta (braços 8.5%)               ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Relatórios da Academia

```
┌─────────────────────────────────────────────────────────────────┐
│  SHAPE-V / RELATÓRIOS                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Geral] [Por Personal] [Por Aluno] [Exportar]                  │
│                                                                 │
│  Período: [Último mês ▼]                                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📊 VISÃO GERAL DA ACADEMIA                                  ││
│  │                                                             ││
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐││
│  │ │PERSONAIS│ │ ALUNOS  │ │MEDIÇÕES │ │ SCORE   │ │ CHURN   │││
│  │ │    8    │ │   94    │ │   312   │ │  74.2   │ │  2.1%   │││
│  │ │  +1     │ │  +8     │ │  +15%   │ │  +1.8   │ │  -0.5%  │││
│  │ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌──────────────────────────────┐ ┌────────────────────────────┐│
│  │ 🏋️ RANKING PERSONAIS         │ │ 📈 EVOLUÇÃO SCORE MÉDIO    ││
│  │                              │ │                            ││
│  │ #  Personal      Alunos Média│ │    [Gráfico de linha]      ││
│  │ 1. Carlos Lima     15   82.3│ │                            ││
│  │ 2. Ana Souza       12   78.5│ │                            ││
│  │ 3. Pedro Santos    14   76.2│ │                            ││
│  │ 4. Maria Costa     11   74.8│ │                            ││
│  │ 5. João Silva      10   71.3│ │                            ││
│  │                              │ │                            ││
│  └──────────────────────────────┘ └────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📊 DISTRIBUIÇÃO POR CLASSIFICAÇÃO                           ││
│  │                                                             ││
│  │  Elite (95+)        ████  5 alunos (5%)                     ││
│  │  Avançado (85-94)   ████████████  21 alunos (22%)           ││
│  │  Intermediário      ████████████████████  42 alunos (45%)   ││
│  │  Iniciante (60-74)  ████████████  19 alunos (20%)           ││
│  │  Desenvolvimento    ████  7 alunos (8%)                     ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. FLUXOS

### 8.1 Fluxo: Personal Convida Atleta

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Personal   │────▶│   Sistema   │────▶│   Atleta    │
│  convida    │     │ envia email │     │  recebe     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                           ┌───────────────────┴───────────────────┐
                           │                                       │
                           ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │ Já tem conta│                         │ Não tem     │
                    │ no SHAPE-V  │                         │ conta       │
                    └──────┬──────┘                         └──────┬──────┘
                           │                                       │
                           ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │ Faz login e │                         │ Cria conta  │
                    │ aceita      │                         │ já vinculado│
                    │ vínculo     │                         │ ao personal │
                    └──────┬──────┘                         └──────┬──────┘
                           │                                       │
                           └───────────────────┬───────────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Atleta      │
                                        │ aparece na  │
                                        │ lista do    │
                                        │ Personal    │
                                        └─────────────┘
```

### 8.2 Fluxo: Academia Convida Personal

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Academia   │────▶│   Sistema   │────▶│  Personal   │
│  convida    │     │ envia email │     │  recebe     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                           ┌───────────────────┴───────────────────┐
                           │                                       │
                           ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │ Já é        │                         │ Não é       │
                    │ Personal    │                         │ Personal    │
                    │ no SHAPE-V  │                         │ ainda       │
                    └──────┬──────┘                         └──────┬──────┘
                           │                                       │
                           ▼                                       ▼
                    ┌─────────────┐                         ┌─────────────┐
                    │ Aceita      │                         │ Cria conta  │
                    │ vínculo com │                         │ como        │
                    │ academia    │                         │ Personal    │
                    └──────┬──────┘                         └──────┬──────┘
                           │                                       │
                           └───────────────────┬───────────────────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │ Personal    │
                                        │ aparece na  │
                                        │ lista da    │
                                        │ Academia    │
                                        └─────────────┘
```

### 8.3 Fluxo: Registro de Medição

```
┌─────────────────────────────────────────────────────────────────┐
│                    QUEM PODE REGISTRAR MEDIÇÃO                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ATLETA INDEPENDENTE                                            │
│  ┌─────────────┐                                                │
│  │   Atleta    │ ──────▶ Registra próprias medidas             │
│  └─────────────┘                                                │
│                                                                 │
│  ────────────────────────────────────────────────────────────   │
│                                                                 │
│  ATLETA DE PERSONAL                                             │
│  ┌─────────────┐                                                │
│  │   Atleta    │ ──────▶ Registra próprias medidas             │
│  └─────────────┘                                                │
│         ou                                                      │
│  ┌─────────────┐                                                │
│  │  Personal   │ ──────▶ Registra para o atleta                │
│  └─────────────┘                                                │
│                                                                 │
│  ────────────────────────────────────────────────────────────   │
│                                                                 │
│  ATLETA DE ACADEMIA                                             │
│  ┌─────────────┐                                                │
│  │   Atleta    │ ──────▶ Registra próprias medidas             │
│  └─────────────┘                                                │
│         ou                                                      │
│  ┌─────────────┐                                                │
│  │  Personal   │ ──────▶ Registra para o atleta                │
│  │ da academia │                                                │
│  └─────────────┘                                                │
│                                                                 │
│  ⚠️ Academia NÃO registra medidas diretamente                   │
│     (apenas visualiza)                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. PLANOS E LIMITES

### 9.1 Planos Atleta

| Plano | Preço | Recursos |
|-------|-------|----------|
| **FREE** | R$ 0 | Medições ilimitadas, Dashboard básico, 1 método |
| **PRO** | R$ 19,90/mês | Todos métodos, AI Coach, Relatórios, Sem anúncios |

### 9.2 Planos Personal

| Plano | Preço | Alunos | Recursos |
|-------|-------|--------|----------|
| **BASIC** | R$ 49,90/mês | Até 10 | Dashboard, Relatórios básicos |
| **PRO** | R$ 99,90/mês | Até 50 | + AI Coach para alunos, Relatórios avançados |
| **UNLIMITED** | R$ 199,90/mês | Ilimitado | + White-label, API |

### 9.3 Planos Academia

| Plano | Preço | Personais | Recursos |
|-------|-------|-----------|----------|
| **BASIC** | R$ 199,90/mês | Até 5 | Dashboard, Relatórios |
| **PRO** | R$ 399,90/mês | Até 20 | + Relatórios avançados, Exportação |
| **UNLIMITED** | R$ 799,90/mês | Ilimitado | + White-label, API, Suporte dedicado |

---

## 10. CONSIDERAÇÕES TÉCNICAS

### 10.1 Rotas Protegidas por Role

```typescript
// middleware/routes.ts

const ROUTE_PERMISSIONS = {
  // Rotas de Atleta
  '/dashboard': ['ATHLETE'],
  '/measurements': ['ATHLETE'],
  '/evolution': ['ATHLETE'],
  
  // Rotas de Personal
  '/personal/*': ['PERSONAL'],
  
  // Rotas de Academia
  '/academy/*': ['ACADEMY'],
  
  // Rotas compartilhadas (com verificação de acesso)
  '/athletes/:id/*': ['ATHLETE', 'PERSONAL', 'ACADEMY'],
}
```

### 10.2 Estrutura de Pastas Frontend

```
/app
  /(auth)
    /login
    /register
    /invite/[token]
  
  /(athlete)              # Rotas do Atleta
    /dashboard
    /evolution
    /measurements
    /profile
  
  /(personal)             # Rotas do Personal
    /personal
      /dashboard
      /athletes
      /athletes/[id]
      /reports
      /settings
  
  /(academy)              # Rotas da Academia
    /academy
      /dashboard
      /personals
      /personals/[id]
      /athletes
      /athletes/[id]
      /reports
      /settings
```

### 10.3 Componentes Compartilhados

```typescript
// Componentes que podem ser reutilizados entre roles

// Dashboard do atleta (usado por Personal e Academia para visualizar)
<AthleteDashboard athleteId={id} readOnly={true} />

// Evolução do atleta
<AthleteEvolution athleteId={id} readOnly={true} />

// Lista de medições
<MeasurementsList athleteId={id} canAdd={isPersonalOrAthlete} />

// Card de atleta (para listas)
<AthleteCard athlete={athlete} onClick={...} />

// Card de personal (para lista da academia)
<PersonalCard personal={personal} onClick={...} />
```

---

## 11. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do Multi-User System |

---

**SHAPE-V Multi-User System**  
*Atleta • Personal • Academia*
