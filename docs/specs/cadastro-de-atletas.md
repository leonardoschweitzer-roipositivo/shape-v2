# SPEC: Cadastro de Atletas/Alunos

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Sistema de Gestão de Atletas

---

## 1. VISÃO GERAL

Este documento especifica o sistema de cadastro de atletas/alunos no VITRU IA, considerando a hierarquia de três níveis de usuários e os diferentes fluxos de cadastro.

### 1.1 Hierarquia de Usuários

```
┌─────────────────────────────────────────────────────────────────┐
│                    HIERARQUIA VITRU IA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       🏢 ACADEMIA                               │
│                    (Nível Superior)                             │
│                          │                                      │
│            ┌─────────────┼─────────────┐                        │
│            │             │             │                        │
│            ▼             ▼             ▼                        │
│       👤 Personal   👤 Personal   👤 Personal                   │
│         Trainer       Trainer       Trainer                     │
│            │             │             │                        │
│       ┌────┴────┐   ┌────┴────┐   ┌────┴────┐                   │
│       ▼    ▼    ▼   ▼    ▼    ▼   ▼    ▼    ▼                   │
│      🏋️   🏋️   🏋️  🏋️   🏋️   🏋️  🏋️   🏋️   🏋️                  │
│    Atletas/Alunos                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Cenários de Cadastro

| Cenário | Quem Cadastra | Quem é Cadastrado | Método |
|---------|---------------|-------------------|--------|
| **A** | Personal Trainer | Atleta/Aluno | Link de Convite |
| **B** | Personal Trainer | Atleta/Aluno | Cadastro Manual |
| **C** | Academia | Personal Trainer | Link de Convite |
| **D** | Academia | Personal Trainer | Cadastro Manual |
| **E** | Atleta | Próprio cadastro | Auto-registro (sem vínculo) |

### 1.3 Objetivos do Sistema

| Objetivo | Descrição |
|----------|-----------|
| **Simplicidade** | Cadastro em menos de 2 minutos |
| **Flexibilidade** | Múltiplos métodos de convite |
| **Segurança** | Links expiráveis, validação de email |
| **Rastreabilidade** | Saber quem convidou quem |
| **Autonomia** | Atleta pode aceitar/recusar vínculo |

---

## 2. TIPOS DE USUÁRIO

### 2.1 Permissões por Tipo

```typescript
enum UserRole {
  ACADEMIA = 'ACADEMIA',
  PERSONAL = 'PERSONAL',
  ATLETA = 'ATLETA',
}

interface RolePermissions {
  // Gestão de usuários
  canInvitePersonal: boolean
  canInviteAtleta: boolean
  canRemovePersonal: boolean
  canRemoveAtleta: boolean
  
  // Acesso a dados
  canViewOwnData: boolean
  canViewAtletaData: boolean
  canViewPersonalData: boolean
  canViewAcademiaData: boolean
  
  // Ações
  canCreateMeasurement: boolean
  canEditAtletaMeasurement: boolean
  canGenerateReports: boolean
  canAccessCoachIA: boolean
}

const PERMISSIONS: Record<UserRole, RolePermissions> = {
  ACADEMIA: {
    canInvitePersonal: true,
    canInviteAtleta: false,      // Academia não convida atleta diretamente
    canRemovePersonal: true,
    canRemoveAtleta: false,
    canViewOwnData: true,
    canViewAtletaData: true,     // Todos os atletas da academia
    canViewPersonalData: true,   // Todos os personais
    canViewAcademiaData: true,
    canCreateMeasurement: false,
    canEditAtletaMeasurement: false,
    canGenerateReports: true,
    canAccessCoachIA: false,
  },
  
  PERSONAL: {
    canInvitePersonal: false,
    canInviteAtleta: true,
    canRemovePersonal: false,
    canRemoveAtleta: true,       // Pode desvincular seus atletas
    canViewOwnData: true,
    canViewAtletaData: true,     // Apenas seus atletas
    canViewPersonalData: false,
    canViewAcademiaData: false,
    canCreateMeasurement: true,  // Pode medir seus atletas
    canEditAtletaMeasurement: true,
    canGenerateReports: true,
    canAccessCoachIA: true,
  },
  
  ATLETA: {
    canInvitePersonal: false,
    canInviteAtleta: false,
    canRemovePersonal: false,
    canRemoveAtleta: false,
    canViewOwnData: true,
    canViewAtletaData: false,
    canViewPersonalData: false,
    canViewAcademiaData: false,
    canCreateMeasurement: true,  // Pode se medir
    canEditAtletaMeasurement: false,
    canGenerateReports: false,
    canAccessCoachIA: true,
  },
}
```

### 2.2 Limites por Plano

```typescript
interface PlanLimits {
  maxPersonais: number | null    // null = ilimitado
  maxAtletas: number | null
  maxMeasurementsPerMonth: number | null
}

const PLAN_LIMITS = {
  // Academia
  ACADEMIA_FREE: {
    maxPersonais: 3,
    maxAtletas: null,            // Herdado dos personais
    maxMeasurementsPerMonth: null,
  },
  ACADEMIA_PRO: {
    maxPersonais: null,          // Ilimitado
    maxAtletas: null,
    maxMeasurementsPerMonth: null,
  },
  
  // Personal
  PERSONAL_FREE: {
    maxPersonais: null,
    maxAtletas: 5,
    maxMeasurementsPerMonth: 50,
  },
  PERSONAL_PRO: {
    maxPersonais: null,
    maxAtletas: null,            // Ilimitado
    maxMeasurementsPerMonth: null,
  },
  
  // Atleta
  ATLETA_FREE: {
    maxPersonais: null,
    maxAtletas: null,
    maxMeasurementsPerMonth: 10,
  },
  ATLETA_PRO: {
    maxPersonais: null,
    maxAtletas: null,
    maxMeasurementsPerMonth: null,
  },
}
```

---

## 3. FLUXO A: PERSONAL CADASTRA ATLETA (CONVITE)

### 3.1 Visão Geral do Fluxo

```
┌─────────────────────────────────────────────────────────────────┐
│           FLUXO: PERSONAL CONVIDA ATLETA (LINK)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PERSONAL                           SISTEMA          ATLETA     │
│     │                                  │               │        │
│     │  1. Clica "Convidar Aluno"       │               │        │
│     ├─────────────────────────────────►│               │        │
│     │                                  │               │        │
│     │  2. Escolhe método:              │               │        │
│     │     • Link genérico              │               │        │
│     │     • Link personalizado (email) │               │        │
│     │     • WhatsApp                   │               │        │
│     │     • QR Code                    │               │        │
│     ├─────────────────────────────────►│               │        │
│     │                                  │               │        │
│     │  3. Gera link de convite         │               │        │
│     │◄─────────────────────────────────┤               │        │
│     │                                  │               │        │
│     │  4. Compartilha link             │               │        │
│     ├──────────────────────────────────┼──────────────►│        │
│     │                                  │               │        │
│     │                                  │  5. Acessa    │        │
│     │                                  │◄──────────────┤        │
│     │                                  │               │        │
│     │                                  │  6. Preenche  │        │
│     │                                  │     dados     │        │
│     │                                  │◄──────────────┤        │
│     │                                  │               │        │
│     │  7. Notifica vínculo             │  8. Confirma  │        │
│     │◄─────────────────────────────────┼──────────────►│        │
│     │                                  │               │        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Tipos de Convite

```typescript
enum InviteType {
  LINK_GENERIC = 'LINK_GENERIC',       // Link reutilizável
  LINK_EMAIL = 'LINK_EMAIL',           // Link único para email específico
  WHATSAPP = 'WHATSAPP',               // Deep link WhatsApp
  QR_CODE = 'QR_CODE',                 // QR Code para impressão
  MANUAL = 'MANUAL',                   // Cadastro manual pelo Personal
}

interface Invite {
  id: string
  type: InviteType
  createdById: string                  // Personal ou Academia
  createdByRole: UserRole
  
  // Para quem
  targetRole: UserRole                 // PERSONAL ou ATLETA
  targetEmail?: string                 // Se LINK_EMAIL
  
  // Link
  code: string                         // Código único (ex: "ABC123")
  url: string                          // URL completa
  
  // Validade
  expiresAt: Date
  maxUses: number | null               // null = ilimitado
  usedCount: number
  
  // Status
  status: InviteStatus
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

enum InviteStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
  EXHAUSTED = 'EXHAUSTED',             // maxUses atingido
}
```

### 3.3 Configuração de Convites

```typescript
const INVITE_CONFIG = {
  // Link genérico (reutilizável)
  LINK_GENERIC: {
    expiresIn: 30 * 24 * 60 * 60 * 1000,  // 30 dias
    maxUses: null,                         // Ilimitado
    codeLength: 8,
    urlPattern: '/convite/{code}',
  },
  
  // Link por email (único)
  LINK_EMAIL: {
    expiresIn: 7 * 24 * 60 * 60 * 1000,   // 7 dias
    maxUses: 1,                            // Uso único
    codeLength: 12,
    urlPattern: '/convite/{code}',
    sendEmail: true,
  },
  
  // WhatsApp
  WHATSAPP: {
    expiresIn: 7 * 24 * 60 * 60 * 1000,   // 7 dias
    maxUses: 1,
    codeLength: 6,
    urlPattern: '/convite/{code}',
    messageTemplate: `Olá! 👋

Você foi convidado(a) para fazer parte do meu time de atletas no VITRU IA - o app que analisa suas proporções corporais usando a matemática do físico perfeito!

Clique no link abaixo para criar sua conta:
{url}

Qualquer dúvida, estou à disposição!

{personalName}
Personal Trainer`,
  },
  
  // QR Code
  QR_CODE: {
    expiresIn: 90 * 24 * 60 * 60 * 1000,  // 90 dias (para impressão)
    maxUses: null,                         // Ilimitado
    codeLength: 8,
    urlPattern: '/convite/{code}',
    qrSize: 300,                           // pixels
  },
}
```

### 3.4 API Endpoints - Convites

```typescript
// ═══════════════════════════════════════════════════════════════
// POST /invites
// Cria novo convite
// ═══════════════════════════════════════════════════════════════

// Request
interface CreateInviteRequest {
  type: InviteType
  targetRole: 'PERSONAL' | 'ATLETA'
  targetEmail?: string                    // Obrigatório se type = LINK_EMAIL
  customMessage?: string                  // Para WhatsApp
  expiresInDays?: number                  // Override do padrão
  maxUses?: number                        // Override do padrão
}

// Response
interface CreateInviteResponse {
  success: true
  data: {
    id: string
    code: string
    url: string
    qrCodeUrl?: string                    // Se type = QR_CODE
    whatsappUrl?: string                  // Se type = WHATSAPP
    expiresAt: string
    maxUses: number | null
  }
}

// Exemplo
POST /invites
Authorization: Bearer <personal_token>
Content-Type: application/json

{
  "type": "WHATSAPP",
  "targetRole": "ATLETA",
  "customMessage": "Vamos juntos nessa jornada!"
}

// Response 201 Created
{
  "success": true,
  "data": {
    "id": "inv_abc123",
    "code": "VTR789",
    "url": "https://vitru.ia/convite/VTR789",
    "whatsappUrl": "https://wa.me/?text=Ol%C3%A1%21%20%F0%9F%91%8B%0A%0AVoc%C3%AA%20foi%20convidado...",
    "expiresAt": "2026-02-15T00:00:00Z",
    "maxUses": 1
  }
}

// ═══════════════════════════════════════════════════════════════
// GET /invites
// Lista convites criados pelo usuário
// ═══════════════════════════════════════════════════════════════

GET /invites?status=ACTIVE&page=1&limit=20
Authorization: Bearer <personal_token>

// Response 200 OK
{
  "success": true,
  "data": [
    {
      "id": "inv_abc123",
      "type": "LINK_GENERIC",
      "code": "MEUTIME",
      "url": "https://vitru.ia/convite/MEUTIME",
      "status": "ACTIVE",
      "usedCount": 12,
      "maxUses": null,
      "expiresAt": "2026-03-01T00:00:00Z",
      "createdAt": "2026-02-01T00:00:00Z"
    },
    // ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE /invites/:id
// Revoga convite
// ═══════════════════════════════════════════════════════════════

DELETE /invites/inv_abc123
Authorization: Bearer <personal_token>

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Convite revogado com sucesso"
  }
}

// ═══════════════════════════════════════════════════════════════
// GET /invites/validate/:code
// Valida código de convite (público)
// ═══════════════════════════════════════════════════════════════

GET /invites/validate/VTR789

// Response 200 OK (válido)
{
  "success": true,
  "data": {
    "valid": true,
    "type": "ATLETA",
    "invitedBy": {
      "name": "João Silva",
      "role": "PERSONAL",
      "avatarUrl": "https://..."
    },
    "academy": {
      "name": "Academia FitMax",        // Se Personal está vinculado
      "logoUrl": "https://..."
    }
  }
}

// Response 200 OK (inválido)
{
  "success": true,
  "data": {
    "valid": false,
    "reason": "EXPIRED"                 // EXPIRED | REVOKED | EXHAUSTED | NOT_FOUND
  }
}
```

### 3.5 Tela: Convidar Atleta (Personal)

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  Convidar Novo Aluno                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Como você quer convidar?                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📱  WhatsApp                                           │    │
│  │      Envie um convite direto pelo WhatsApp              │    │
│  │      Recomendado • Rápido e pessoal                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📧  Email                                              │    │
│  │      Envie um convite por email                         │    │
│  │      Link único e rastreável                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🔗  Link de Convite                                    │    │
│  │      Copie e compartilhe onde quiser                    │    │
│  │      Reutilizável • Válido por 30 dias                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📷  QR Code                                            │    │
│  │      Gere um QR Code para impressão                     │    │
│  │      Ideal para academia ou eventos                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ────────────────────────────────────────────────────────────   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ✏️  Cadastro Manual                                    │    │
│  │      Cadastre o aluno você mesmo                        │    │
│  │      Ideal se o aluno não tem celular                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.6 Tela: WhatsApp Invite

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  Convite por WhatsApp                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mensagem de Convite                                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Olá! 👋                                                │    │
│  │                                                         │    │
│  │  Você foi convidado(a) para fazer parte do meu time     │    │
│  │  de atletas no VITRU IA - o app que analisa suas        │    │
│  │  proporções corporais usando a matemática do físico     │    │
│  │  perfeito!                                              │    │
│  │                                                         │    │
│  │  Clique no link abaixo para criar sua conta:            │    │
│  │  https://vitru.ia/convite/VTR789                        │    │
│  │                                                         │    │
│  │  Qualquer dúvida, estou à disposição!                   │    │
│  │                                                         │    │
│  │  João Silva                                             │    │
│  │  Personal Trainer                                       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ⓘ Você pode editar a mensagem antes de enviar                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │               📱 Abrir no WhatsApp                      │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│                    Copiar mensagem                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.7 Tela: Link de Convite Gerado

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  Link de Convite                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                          ✅                                     │
│                                                                 │
│              Link criado com sucesso!                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │    https://vitru.ia/convite/MEUTIME                     │    │
│  │                                                         │    │
│  │    ┌────────────┐  ┌────────────┐  ┌────────────┐       │    │
│  │    │  📋 Copiar │  │  📱 Share  │  │  📷 QR     │       │    │
│  │    └────────────┘  └────────────┘  └────────────┘       │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Detalhes do Convite                                            │
│  ─────────────────────────────────────────────────────────────  │
│  Tipo:            Link reutilizável                             │
│  Válido até:      01/03/2026                                    │
│  Usos:            Ilimitado                                     │
│  Cadastros:       12 atletas já usaram                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │         Gerenciar links de convite →                    │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. FLUXO B: PERSONAL CADASTRA ATLETA (MANUAL)

### 4.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│           FLUXO: PERSONAL CADASTRA ATLETA MANUALMENTE           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PERSONAL                            SISTEMA                    │
│     │                                   │                       │
│     │  1. Clica "Cadastro Manual"       │                       │
│     ├──────────────────────────────────►│                       │
│     │                                   │                       │
│     │  2. Preenche dados básicos:       │                       │
│     │     • Nome                        │                       │
│     │     • Email (opcional)            │                       │
│     │     • Telefone (opcional)         │                       │
│     │     • Gênero                      │                       │
│     │     • Data de nascimento          │                       │
│     ├──────────────────────────────────►│                       │
│     │                                   │                       │
│     │  3. Preenche medidas estruturais: │                       │
│     │     • Altura                      │                       │
│     │     • Punho                       │                       │
│     │     • Tornozelo                   │                       │
│     ├──────────────────────────────────►│                       │
│     │                                   │                       │
│     │  4. (Opcional) Primeira medição   │                       │
│     ├──────────────────────────────────►│                       │
│     │                                   │                       │
│     │  5. Cria conta do atleta          │                       │
│     │◄──────────────────────────────────┤                       │
│     │                                   │                       │
│     │  6. Gera credenciais temporárias  │                       │
│     │     ou envia convite por email    │                       │
│     │◄──────────────────────────────────┤                       │
│     │                                   │                       │
│                                                                 │
│  NOTA: Atleta pode depois completar seu perfil e trocar senha   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Dados do Cadastro Manual

```typescript
interface ManualAtletaRegistration {
  // Dados básicos (obrigatórios)
  nome: string
  genero: 'MALE' | 'FEMALE'
  dataNascimento: Date
  
  // Contato (pelo menos 1 obrigatório)
  email?: string
  telefone?: string
  
  // Medidas estruturais (obrigatórias)
  altura: number                        // cm
  punho: number                         // cm
  tornozelo: number                     // cm
  
  // Categoria de referência
  categoriaReferencia?: ProportionMethod
  
  // Primeira medição (opcional)
  primeiraMedicao?: {
    peso?: number
    cintura?: number
    ombros?: number
    peitoral?: number
    braco?: number
    antebraco?: number
    coxa?: number
    panturrilha?: number
    // ... outras medidas
  }
  
  // Observações
  observacoes?: string
  
  // Acesso
  gerarCredenciais: boolean             // Gera login temporário
  enviarConvitePorEmail: boolean        // Se tem email
}
```

### 4.3 Tela: Cadastro Manual de Atleta

```
┌─────────────────────────────────────────────────────────────────┐
│  ←  Cadastro Manual de Aluno                         Passo 1/3  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Dados Básicos                                                  │
│                                                                 │
│  Nome completo *                                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Maria Silva Santos                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Gênero *                                                       │
│  ┌────────────────────┐  ┌────────────────────┐                 │
│  │   ♂️ Masculino     │  │   ♀️ Feminino  ✓   │                 │
│  └────────────────────┘  └────────────────────┘                 │
│                                                                 │
│  Data de nascimento *                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  15/05/1995                                        📅   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Contato (pelo menos 1 obrigatório)                             │
│                                                                 │
│  Email                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  maria.silva@email.com                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Telefone (WhatsApp)                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  (51) 99999-9999                                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     Próximo →                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ←  Cadastro Manual de Aluno                         Passo 2/3  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Medidas Estruturais                                            │
│                                                                 │
│  ⓘ Essas medidas não mudam com treino e são usadas para         │
│    calcular as proporções ideais.                               │
│                                                                 │
│  Altura *                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  165                                               cm   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Punho *                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  15.5                                              cm   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Circunferência no osso proeminente                             │
│                                                                 │
│  Tornozelo *                                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  21                                                cm   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  Parte mais fina, acima do osso                                 │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Categoria de Referência                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🏛️ Golden Ratio                                   ▼   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌───────────────┐  ┌─────────────────────────────────────┐     │
│  │  ← Voltar     │  │           Próximo →                 │     │
│  └───────────────┘  └─────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ←  Cadastro Manual de Aluno                         Passo 3/3  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Primeira Medição (opcional)                                    │
│                                                                 │
│  ⓘ Você pode registrar a primeira avaliação agora ou fazer      │
│    depois.                                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ☐  Pular por agora                                     │    │
│  │  ☑  Registrar primeira medição                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Se "Registrar primeira medição" selecionado]                  │
│                                                                 │
│  Peso                        Cintura                            │
│  ┌───────────────────┐       ┌───────────────────┐              │
│  │  62            kg │       │  68            cm │              │
│  └───────────────────┘       └───────────────────┘              │
│                                                                 │
│  Ombros                      Quadril                            │
│  ┌───────────────────┐       ┌───────────────────┐              │
│  │  96            cm │       │  94            cm │              │
│  └───────────────────┘       └───────────────────┘              │
│                                                                 │
│  Busto                       Braço                              │
│  ┌───────────────────┐       ┌───────────────────┐              │
│  │  88            cm │       │  27            cm │              │
│  └───────────────────┘       └───────────────────┘              │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Acesso do Aluno                                                │
│                                                                 │
│  ☑ Enviar convite por email                                     │
│    O aluno receberá um email para criar sua senha               │
│                                                                 │
│  ☐ Gerar credenciais temporárias                                │
│    Você receberá login e senha para passar ao aluno             │
│                                                                 │
│  ┌───────────────┐  ┌─────────────────────────────────────┐     │
│  │  ← Voltar     │  │       Cadastrar Aluno               │     │
│  └───────────────┘  └─────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 API: Cadastro Manual

```typescript
// ═══════════════════════════════════════════════════════════════
// POST /athletes
// Cadastra atleta manualmente (Personal ou Academia)
// ═══════════════════════════════════════════════════════════════

// Request
interface CreateAthleteRequest {
  // Dados básicos
  nome: string
  genero: 'MALE' | 'FEMALE'
  dataNascimento: string                 // ISO date
  
  // Contato
  email?: string
  telefone?: string
  
  // Medidas estruturais
  altura: number
  punho: number
  tornozelo: number
  
  // Opcionais
  joelho?: number
  pelve?: number
  categoriaReferencia?: ProportionMethod
  observacoes?: string
  
  // Primeira medição
  primeiraMedicao?: MeasurementInput
  
  // Acesso
  enviarConviteEmail?: boolean
  gerarCredenciaisTemporarias?: boolean
}

// Response
interface CreateAthleteResponse {
  success: true
  data: {
    athlete: {
      id: string
      nome: string
      email?: string
      status: 'PENDING' | 'ACTIVE'
    }
    
    // Se gerou credenciais temporárias
    credentials?: {
      login: string                       // Email ou código gerado
      temporaryPassword: string
      expiresAt: string
    }
    
    // Se enviou convite
    invite?: {
      id: string
      sentTo: string
      expiresAt: string
    }
    
    // Se registrou primeira medição
    measurement?: {
      id: string
      scores: ProportionScores
    }
  }
}

// Exemplo
POST /athletes
Authorization: Bearer <personal_token>
Content-Type: application/json

{
  "nome": "Maria Silva Santos",
  "genero": "FEMALE",
  "dataNascimento": "1995-05-15",
  "email": "maria.silva@email.com",
  "telefone": "+5551999999999",
  "altura": 165,
  "punho": 15.5,
  "tornozelo": 21,
  "categoriaReferencia": "GOLDEN_RATIO",
  "enviarConviteEmail": true,
  "primeiraMedicao": {
    "peso": 62,
    "cintura": 68,
    "ombros": 96,
    "quadril": 94,
    "busto": 88,
    "braco": 27
  }
}

// Response 201 Created
{
  "success": true,
  "data": {
    "athlete": {
      "id": "ath_xyz789",
      "nome": "Maria Silva Santos",
      "email": "maria.silva@email.com",
      "status": "PENDING"
    },
    "invite": {
      "id": "inv_abc123",
      "sentTo": "maria.silva@email.com",
      "expiresAt": "2026-02-15T00:00:00Z"
    },
    "measurement": {
      "id": "msr_def456",
      "scores": {
        "goldenRatio": {
          "total": 78.5,
          "classificacao": "INTERMEDIARIO"
        }
      }
    }
  }
}
```

---

## 5. FLUXO C: ACADEMIA CADASTRA PERSONAL (CONVITE)

### 5.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│           FLUXO: ACADEMIA CONVIDA PERSONAL                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACADEMIA                            SISTEMA        PERSONAL    │
│     │                                   │               │       │
│     │  1. Acessa "Meus Personais"       │               │       │
│     ├──────────────────────────────────►│               │       │
│     │                                   │               │       │
│     │  2. Clica "Adicionar Personal"    │               │       │
│     ├──────────────────────────────────►│               │       │
│     │                                   │               │       │
│     │  3. Escolhe método:               │               │       │
│     │     • Convite por email           │               │       │
│     │     • Link de convite             │               │       │
│     │     • Cadastro manual             │               │       │
│     ├──────────────────────────────────►│               │       │
│     │                                   │               │       │
│     │  4. Preenche dados e/ou email     │               │       │
│     ├──────────────────────────────────►│               │       │
│     │                                   │               │       │
│     │  5. Sistema envia convite         │               │       │
│     │                                   ├──────────────►│       │
│     │                                   │               │       │
│     │                                   │  6. Personal  │       │
│     │                                   │     aceita    │       │
│     │                                   │◄──────────────┤       │
│     │                                   │               │       │
│     │  7. Notifica vínculo              │               │       │
│     │◄──────────────────────────────────┤               │       │
│     │                                   │               │       │
│     │                                   │               │       │
│  NOTA: Personal pode ACEITAR ou RECUSAR vínculo                 │
│        Se recusar, continua usando VITRU IA independente        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Dados do Convite para Personal

```typescript
interface PersonalInviteData {
  // Dados do Personal
  nome?: string                          // Opcional - Personal preenche
  email: string                          // Obrigatório para convite
  telefone?: string
  
  // Especialidades (tags)
  especialidades?: string[]              // Ex: ['Hipertrofia', 'Emagrecimento']
  
  // Configurações de acesso
  permissoes?: {
    podeVerRelatoriosAcademia: boolean
    podeExportarDados: boolean
  }
  
  // CREF (registro profissional)
  cref?: string
}
```

### 5.3 Tela: Gerenciar Personais (Academia)

```
┌─────────────────────────────────────────────────────────────────┐
│  VITRU IA                                           Academia    │
│  ☰                                                  FitMax      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Meus Personal Trainers                                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🔍 Buscar personal...                                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  12 personais ativos • 3 pendentes • 45 atletas total           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  👤 João Silva                             ✅ Ativo     │    │
│  │     CREF: 012345-G/RS                                   │    │
│  │     📊 15 atletas • Score médio: 78.5                   │    │
│  │     Especialidades: Hipertrofia, Competição             │    │
│  │                                              Ver perfil │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  👤 Maria Santos                           ✅ Ativo     │    │
│  │     CREF: 054321-G/RS                                   │    │
│  │     📊 22 atletas • Score médio: 82.3                   │    │
│  │     Especialidades: Emagrecimento, Funcional            │    │
│  │                                              Ver perfil │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  👤 Pedro Costa                            ⏳ Pendente  │    │
│  │     Convite enviado em 05/02/2026                       │    │
│  │     pedro.costa@email.com                               │    │
│  │                              Reenviar    Cancelar       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │          ➕ Adicionar Personal Trainer                  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Modal: Convidar Personal (Academia)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                           ✕     │
│                                                                 │
│               Adicionar Personal Trainer                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Email do Personal *                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  personal@email.com                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Nome (opcional - o personal pode editar)                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  CREF (opcional)                                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Especialidades                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ☑ Hipertrofia    ☐ Emagrecimento    ☐ Funcional       │    │
│  │  ☐ Competição     ☐ Reabilitação     ☐ Idosos          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Mensagem personalizada (opcional)                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Olá! Gostaríamos de convidá-lo para fazer parte da     │    │
│  │  nossa equipe de personal trainers na Academia FitMax.  │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │                  Enviar Convite                         │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ⓘ O personal receberá um email com o convite. Ele pode         │
│    aceitar ou recusar o vínculo com a academia.                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. FLUXO D: ACADEMIA CADASTRA PERSONAL (MANUAL)

### 6.1 Cenário de Uso

Este fluxo é usado quando:
- Personal não tem email
- Personal não tem celular/smartphone
- Academia quer controle total do cadastro
- Processo de onboarding presencial

### 6.2 Dados do Cadastro Manual de Personal

```typescript
interface ManualPersonalRegistration {
  // Dados básicos (obrigatórios)
  nome: string
  email?: string
  telefone?: string
  
  // Profissional
  cref?: string
  especialidades?: string[]
  
  // Acesso
  gerarCredenciais: boolean
  
  // Vínculo
  autoAceitar: boolean                   // Se true, vínculo já fica ativo
}
```

---

## 7. FLUXO E: ATLETA SE CADASTRA SOZINHO

### 7.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│           FLUXO: ATLETA AUTO-REGISTRO (SEM VÍNCULO)             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  O atleta pode se cadastrar diretamente no VITRU IA sem         │
│  estar vinculado a nenhum Personal ou Academia.                 │
│                                                                 │
│  Neste caso:                                                    │
│  • Atleta usa o app de forma independente                       │
│  • Pode se vincular a um Personal depois (via convite)          │
│  • Tem acesso limitado às funcionalidades FREE                  │
│  • Pode fazer upgrade para PRO individual                       │
│                                                                 │
│  FLUXO:                                                         │
│  1. Acessa vitru.ia                                             │
│  2. Clica "Criar conta"                                         │
│  3. Escolhe "Sou Atleta"                                        │
│  4. Preenche dados básicos (email, senha, nome)                 │
│  5. Confirma email                                              │
│  6. Completa onboarding (medidas estruturais)                   │
│  7. Começa a usar                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Vinculação Posterior

```typescript
// Atleta pode receber convite de Personal e aceitar vínculo
interface VinculoRequest {
  atletaId: string
  personalId: string
  academiaId?: string                    // Se Personal está em academia
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}

// Atleta pode ter MÚLTIPLOS vínculos (ex: 2 personais diferentes)
// Mas precisa escolher qual é o "principal" para o dashboard
```

---

## 8. GESTÃO DE VÍNCULOS

### 8.1 Modelo de Dados

```typescript
interface Vinculo {
  id: string
  
  // Partes
  superiorId: string                     // Academia ou Personal
  superiorRole: 'ACADEMIA' | 'PERSONAL'
  subordinadoId: string                  // Personal ou Atleta
  subordinadoRole: 'PERSONAL' | 'ATLETA'
  
  // Status
  status: VinculoStatus
  
  // Metadados
  convidadoPor: string                   // userId de quem convidou
  conviteId?: string                     // Referência ao convite original
  
  // Datas
  createdAt: Date
  acceptedAt?: Date
  rejectedAt?: Date
  removedAt?: Date
  
  // Quem removeu (se aplicável)
  removedBy?: string
  removeReason?: string
}

enum VinculoStatus {
  PENDING = 'PENDING',                   // Convite enviado, aguardando
  ACTIVE = 'ACTIVE',                     // Vínculo ativo
  REJECTED = 'REJECTED',                 // Convite recusado
  REMOVED = 'REMOVED',                   // Vínculo removido
  EXPIRED = 'EXPIRED',                   // Convite expirou
}
```

### 8.2 Regras de Vínculo

```typescript
const VINCULO_RULES = {
  // Academia -> Personal
  ACADEMIA_PERSONAL: {
    // Academia pode ter múltiplos personais
    maxVinculos: null,
    
    // Personal pode estar em múltiplas academias
    personalPodeMultiplasAcademias: true,
    
    // Quem pode remover
    quemPodeRemover: ['ACADEMIA', 'PERSONAL'],
    
    // Notificações
    notificarRemocao: true,
  },
  
  // Personal -> Atleta
  PERSONAL_ATLETA: {
    // Personal pode ter múltiplos atletas (limite por plano)
    maxVinculos: 'BY_PLAN',              // Depende do plano
    
    // Atleta pode ter múltiplos personais
    atletaPodeMultiplosPersonais: true,
    
    // Quem pode remover
    quemPodeRemover: ['PERSONAL', 'ATLETA'],
    
    // Notificações
    notificarRemocao: true,
  },
}
```

### 8.3 API: Gestão de Vínculos

```typescript
// ═══════════════════════════════════════════════════════════════
// GET /vinculos
// Lista vínculos do usuário
// ═══════════════════════════════════════════════════════════════

GET /vinculos?status=ACTIVE&role=subordinado
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    // Se o usuário é ATLETA
    "personais": [
      {
        "vinculoId": "vnc_abc123",
        "personal": {
          "id": "prs_xyz789",
          "nome": "João Silva",
          "avatarUrl": "https://...",
          "especialidades": ["Hipertrofia"]
        },
        "academia": {                     // Se Personal está em academia
          "id": "acd_def456",
          "nome": "Academia FitMax",
          "logoUrl": "https://..."
        },
        "isPrincipal": true,
        "since": "2026-01-15T00:00:00Z"
      }
    ],
    
    // Se o usuário é PERSONAL
    "atletas": [
      {
        "vinculoId": "vnc_def456",
        "atleta": {
          "id": "ath_abc123",
          "nome": "Maria Santos",
          "avatarUrl": "https://...",
          "ultimaMedicao": "2026-02-01T00:00:00Z",
          "scoreAtual": 78.5
        },
        "since": "2026-01-20T00:00:00Z"
      }
    ],
    
    // Se o usuário é ACADEMIA
    "personais": [
      {
        "vinculoId": "vnc_ghi789",
        "personal": {
          "id": "prs_xyz789",
          "nome": "João Silva",
          "cref": "012345-G/RS",
          "totalAtletas": 15,
          "scoreMedio": 78.5
        },
        "status": "ACTIVE",
        "since": "2025-06-01T00:00:00Z"
      }
    ]
  }
}

// ═══════════════════════════════════════════════════════════════
// POST /vinculos/:id/accept
// Aceita convite de vínculo
// ═══════════════════════════════════════════════════════════════

POST /vinculos/vnc_abc123/accept
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "vinculo": {
      "id": "vnc_abc123",
      "status": "ACTIVE",
      "acceptedAt": "2026-02-08T10:00:00Z"
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// POST /vinculos/:id/reject
// Rejeita convite de vínculo
// ═══════════════════════════════════════════════════════════════

POST /vinculos/vnc_abc123/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Já tenho personal"          // Opcional
}

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Convite recusado"
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE /vinculos/:id
// Remove vínculo existente
// ═══════════════════════════════════════════════════════════════

DELETE /vinculos/vnc_abc123
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Atleta trocou de academia"  // Opcional
}

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Vínculo removido com sucesso"
  }
}
```

---

## 9. NOTIFICAÇÕES

### 9.1 Tipos de Notificação

```typescript
const CADASTRO_NOTIFICATIONS = {
  // Para Personal
  ATLETA_ACEITO: {
    title: '🎉 Novo atleta no time!',
    body: '{atletaNome} aceitou seu convite e agora faz parte do seu time.',
    action: { type: 'navigate', to: '/atletas/{atletaId}' },
  },
  
  ATLETA_RECUSADO: {
    title: 'Convite recusado',
    body: '{atletaNome} recusou seu convite.',
    action: null,
  },
  
  ATLETA_SAIU: {
    title: 'Atleta saiu do time',
    body: '{atletaNome} removeu o vínculo com você.',
    action: null,
  },
  
  // Para Atleta
  CONVITE_PERSONAL: {
    title: '👋 Convite de Personal',
    body: '{personalNome} quer te adicionar como atleta.',
    action: { type: 'navigate', to: '/convites/{conviteId}' },
  },
  
  // Para Academia
  PERSONAL_ACEITO: {
    title: '🎉 Novo personal na equipe!',
    body: '{personalNome} aceitou o convite e agora faz parte da academia.',
    action: { type: 'navigate', to: '/personais/{personalId}' },
  },
  
  PERSONAL_SAIU: {
    title: 'Personal saiu da academia',
    body: '{personalNome} removeu o vínculo com a academia.',
    action: null,
  },
}
```

### 9.2 Emails Transacionais

```typescript
const CADASTRO_EMAILS = {
  // Convite para Atleta
  INVITE_ATLETA: {
    subject: '🏋️ Você foi convidado para o VITRU IA!',
    template: 'invite-atleta',
    variables: ['personalNome', 'personalAvatar', 'academiaLogo', 'inviteUrl'],
  },
  
  // Convite para Personal
  INVITE_PERSONAL: {
    subject: '💼 Convite para fazer parte da {academiaNome}',
    template: 'invite-personal',
    variables: ['academiaNome', 'academiaLogo', 'inviteUrl', 'customMessage'],
  },
  
  // Confirmação de vínculo
  VINCULO_CONFIRMADO: {
    subject: '✅ Vínculo confirmado no VITRU IA',
    template: 'vinculo-confirmado',
    variables: ['nomeUsuario', 'nomeVinculado', 'tipoVinculo'],
  },
  
  // Credenciais temporárias
  CREDENCIAIS_TEMPORARIAS: {
    subject: '🔐 Suas credenciais do VITRU IA',
    template: 'credenciais-temporarias',
    variables: ['nomeUsuario', 'login', 'senhaTemporaria', 'urlLogin'],
  },
}
```

---

## 10. SEGURANÇA

### 10.1 Validações

```typescript
const SECURITY_RULES = {
  // Convites
  invite: {
    // Código de convite
    codeMinLength: 6,
    codeMaxLength: 12,
    codeCharset: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', // Sem 0, O, I, 1
    
    // Expiração
    minExpiration: 1 * 24 * 60 * 60 * 1000,          // 1 dia
    maxExpiration: 90 * 24 * 60 * 60 * 1000,         // 90 dias
    
    // Rate limiting
    maxInvitesPerHour: 20,
    maxInvitesPerDay: 100,
  },
  
  // Cadastro
  registration: {
    // Credenciais temporárias
    tempPasswordLength: 12,
    tempPasswordExpiration: 7 * 24 * 60 * 60 * 1000, // 7 dias
    
    // Validação de email
    emailVerificationRequired: true,
    emailVerificationExpiration: 24 * 60 * 60 * 1000, // 24 horas
  },
  
  // Vínculos
  vinculo: {
    // Limites de pendentes
    maxPendingInvitesPerUser: 50,
    
    // Cooldown após rejeição
    rejectionCooldown: 7 * 24 * 60 * 60 * 1000,     // 7 dias
  },
}
```

### 10.2 Auditoria

```typescript
interface AuditLog {
  id: string
  action: AuditAction
  actorId: string
  actorRole: UserRole
  targetId: string
  targetType: 'USER' | 'INVITE' | 'VINCULO'
  details: Record<string, any>
  ip: string
  userAgent: string
  createdAt: Date
}

enum AuditAction {
  // Convites
  INVITE_CREATED = 'INVITE_CREATED',
  INVITE_REVOKED = 'INVITE_REVOKED',
  INVITE_USED = 'INVITE_USED',
  
  // Cadastro
  USER_REGISTERED = 'USER_REGISTERED',
  USER_REGISTERED_MANUAL = 'USER_REGISTERED_MANUAL',
  
  // Vínculos
  VINCULO_REQUESTED = 'VINCULO_REQUESTED',
  VINCULO_ACCEPTED = 'VINCULO_ACCEPTED',
  VINCULO_REJECTED = 'VINCULO_REJECTED',
  VINCULO_REMOVED = 'VINCULO_REMOVED',
}
```

---

## 11. MÉTRICAS E ANALYTICS

### 11.1 Eventos de Analytics

```typescript
const CADASTRO_ANALYTICS = {
  // Funil de convite
  'invite_created': { type: InviteType, role: UserRole },
  'invite_shared': { type: InviteType, channel: string },
  'invite_clicked': { inviteId: string },
  'invite_converted': { inviteId: string, timeToConvert: number },
  
  // Funil de cadastro
  'registration_started': { source: string, inviteId?: string },
  'registration_step_completed': { step: number, stepName: string },
  'registration_completed': { source: string, timeToComplete: number },
  'registration_abandoned': { step: number, reason?: string },
  
  // Vínculos
  'vinculo_accepted': { timeToAccept: number },
  'vinculo_rejected': { reason?: string },
  'vinculo_removed': { duration: number, removedBy: string },
}
```

### 11.2 KPIs do Cadastro

| KPI | Descrição | Meta |
|-----|-----------|------|
| **Invite-to-Registration Rate** | % de convites que resultam em cadastro | > 40% |
| **Registration Completion Rate** | % de cadastros iniciados que são finalizados | > 70% |
| **Time to First Measurement** | Tempo entre cadastro e primeira medição | < 24h |
| **Vinculo Acceptance Rate** | % de convites de vínculo aceitos | > 80% |
| **Churn de Vínculos** | % de vínculos removidos por mês | < 5% |

---

## 12. CONSIDERAÇÕES FINAIS

### 12.1 Resumo dos Fluxos

| Fluxo | Quem | Cadastra | Método |
|-------|------|----------|--------|
| A | Personal | Atleta | Convite (Link/WhatsApp/Email/QR) |
| B | Personal | Atleta | Manual |
| C | Academia | Personal | Convite (Email/Link) |
| D | Academia | Personal | Manual |
| E | - | Atleta | Auto-registro |

### 12.2 Prioridades de Implementação

1. **MVP:** Fluxos A, C, E (convites e auto-registro)
2. **v1.1:** Fluxos B, D (cadastro manual)
3. **v1.2:** QR Code, WhatsApp com preview, credenciais temporárias

### 12.3 Integrações Futuras

- **WhatsApp Business API:** Convites mais ricos
- **Google Workspace:** Importar contatos
- **Sistemas de academia:** Sincronizar cadastro
- **CONFEF/CREF:** Validar registro profissional

---

## 13. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Fluxos de cadastro completos |

---

**VITRU IA - Sistema de Cadastro de Atletas v1.0**  
*Convites • Cadastro Manual • Vínculos • Hierarquia Multi-Nível*
