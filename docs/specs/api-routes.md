# SPEC: API Routes - VITRU IA

## Documento de Especificação de API

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

Este documento define todos os endpoints da API REST do VITRU IA, incluindo contratos de request/response, autenticação, rate limiting e tratamento de erros.

### 1.1 Base URL

```
Production:  https://api.vitru.ai/v1
Staging:     https://api.staging.vitru.ai/v1
Development: http://localhost:3000/api/v1
```

### 1.2 Formato de Resposta

Todas as respostas seguem o formato padrão:

```typescript
// Sucesso
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-07T12:00:00Z",
    "requestId": "req_abc123"
  }
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Mensagem de erro",
    "details": [ ... ]  // opcional
  },
  "meta": {
    "timestamp": "2026-02-07T12:00:00Z",
    "requestId": "req_abc123"
  }
}

// Lista paginada
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": { ... }
}
```

### 1.3 Headers Padrão

```http
# Request
Content-Type: application/json
Authorization: Bearer <token>
X-Request-ID: <uuid>  // opcional, para tracking

# Response
Content-Type: application/json
X-Request-ID: <uuid>
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1707300000
```

---

## 2. AUTENTICAÇÃO

### 2.1 Endpoints de Auth

#### POST /auth/register

Registra novo usuário.

```typescript
// Request
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "minimo8chars",
  "name": "João Silva"  // opcional
}

// Response 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "name": "João Silva",
      "createdAt": "2026-02-07T12:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}

// Errors
400 - VALIDATION_ERROR: Email inválido / Senha fraca
409 - EMAIL_EXISTS: Email já cadastrado
```

#### POST /auth/login

Autentica usuário existente.

```typescript
// Request
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "minimo8chars"
}

// Response 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "name": "João Silva",
      "isPro": false,
      "profile": { ... }  // se existir
    },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}

// Errors
401 - INVALID_CREDENTIALS: Email ou senha incorretos
403 - ACCOUNT_DISABLED: Conta desativada
```

#### POST /auth/refresh

Renova access token.

```typescript
// Request
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbG..."
}

// Response 200 OK
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",  // novo refresh token
    "expiresIn": 3600
  }
}

// Errors
401 - INVALID_TOKEN: Token inválido ou expirado
```

#### POST /auth/logout

Encerra sessão.

```typescript
// Request
POST /auth/logout
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Logout realizado com sucesso"
  }
}
```

#### POST /auth/forgot-password

Solicita reset de senha.

```typescript
// Request
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

// Response 200 OK (sempre retorna sucesso por segurança)
{
  "success": true,
  "data": {
    "message": "Se o email existir, enviaremos instruções de reset"
  }
}
```

#### POST /auth/reset-password

Reseta senha com token.

```typescript
// Request
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_abc123",
  "password": "novaSenha123"
}

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Senha alterada com sucesso"
  }
}

// Errors
400 - INVALID_TOKEN: Token inválido ou expirado
400 - WEAK_PASSWORD: Senha não atende requisitos
```

### 2.2 OAuth

#### GET /auth/google

Inicia fluxo OAuth com Google.

```typescript
// Redirect para Google OAuth
GET /auth/google

// Callback (interno)
GET /auth/google/callback?code=...

// Response - Redirect para app com tokens
302 -> /app?token=...
```

#### GET /auth/apple

Inicia fluxo OAuth com Apple.

```typescript
// Redirect para Apple OAuth
GET /auth/apple

// Callback (interno)
GET /auth/apple/callback
```

---

## 3. USUÁRIO E PERFIL

### 3.1 User Endpoints

#### GET /users/me

Retorna dados do usuário autenticado.

```typescript
// Request
GET /users/me
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "João Silva",
    "avatarUrl": "https://...",
    "isPro": true,
    "proExpiresAt": "2027-02-07T00:00:00Z",
    "createdAt": "2026-01-01T00:00:00Z",
    "profile": {
      "birthDate": "1990-05-15",
      "gender": "MALE",
      "altura": 180,
      "punho": 17.5,
      "tornozelo": 23,
      "joelho": 38,
      "pelve": 98,
      "unitSystem": "METRIC",
      "preferredMethod": "GOLDEN_RATIO"
    }
  }
}
```

#### PATCH /users/me

Atualiza dados do usuário.

```typescript
// Request
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Pedro Silva",
  "avatarUrl": "https://..."
}

// Response 200 OK
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "name": "João Pedro Silva",
    "avatarUrl": "https://...",
    // ... resto dos dados
  }
}
```

#### DELETE /users/me

Deleta conta do usuário (soft delete).

```typescript
// Request
DELETE /users/me
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Conta desativada com sucesso"
  }
}
```

### 3.2 Profile Endpoints

#### GET /users/me/profile

Retorna perfil completo.

```typescript
// Request
GET /users/me/profile
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "id": "prf_abc123",
    "userId": "usr_abc123",
    "birthDate": "1990-05-15",
    "gender": "MALE",
    "altura": 180,
    "punho": 17.5,
    "tornozelo": 23,
    "joelho": 38,
    "pelve": 98,
    "unitSystem": "METRIC",
    "preferredMethod": "GOLDEN_RATIO",
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-02-01T00:00:00Z"
  }
}
```

#### PUT /users/me/profile

Cria ou atualiza perfil completo.

```typescript
// Request
PUT /users/me/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "birthDate": "1990-05-15",
  "gender": "MALE",
  "altura": 180,
  "punho": 17.5,
  "tornozelo": 23,
  "joelho": 38,
  "pelve": 98,
  "unitSystem": "METRIC",
  "preferredMethod": "GOLDEN_RATIO"
}

// Response 200 OK
{
  "success": true,
  "data": { ... }  // perfil atualizado
}

// Errors
400 - VALIDATION_ERROR: Campos inválidos
```

#### PATCH /users/me/profile

Atualiza campos específicos do perfil.

```typescript
// Request
PATCH /users/me/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferredMethod": "CLASSIC_PHYSIQUE"
}

// Response 200 OK
{
  "success": true,
  "data": { ... }
}
```

---

## 4. MEDIDAS (MEASUREMENTS)

### 4.1 CRUD de Medidas

#### GET /measurements

Lista medidas do usuário com paginação.

```typescript
// Request
GET /measurements?page=1&limit=10&startDate=2026-01-01&endDate=2026-02-01
Authorization: Bearer <token>

// Query Parameters
// - page: número da página (default: 1)
// - limit: itens por página (default: 10, max: 50)
// - startDate: filtro data inicial (ISO 8601)
// - endDate: filtro data final (ISO 8601)
// - includeScores: incluir scores (default: false)

// Response 200 OK
{
  "success": true,
  "data": [
    {
      "id": "msr_abc123",
      "measuredAt": "2026-02-07T10:00:00Z",
      "peso": 82.5,
      "gorduraCorporal": 15.2,
      "cintura": 82,
      "ombros": 120,
      "peitoral": 108,
      "braco": 40,
      "antebraco": 32,
      "pescoco": 40,
      "coxa": 60,
      "panturrilha": 38,
      "source": "MANUAL",
      "createdAt": "2026-02-07T10:05:00Z"
    },
    // ...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET /measurements/:id

Retorna medida específica com scores.

```typescript
// Request
GET /measurements/msr_abc123
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "id": "msr_abc123",
    "measuredAt": "2026-02-07T10:00:00Z",
    "peso": 82.5,
    "gorduraCorporal": 15.2,
    "cintura": 82,
    "ombros": 120,
    "peitoral": 108,
    "braco": 40,
    "antebraco": 32,
    "pescoco": 40,
    "coxa": 60,
    "panturrilha": 38,
    "bracoEsquerdo": 39.5,
    "bracoDireito": 40.5,
    "source": "MANUAL",
    "notes": "Medido após treino",
    "scores": [
      {
        "method": "GOLDEN_RATIO",
        "scoreTotal": 82.5,
        "classificacao": "INTERMEDIARIO",
        "scoresDetalhados": { ... },
        "ideaisCalculados": { ... },
        "diferencas": { ... }
      },
      {
        "method": "CLASSIC_PHYSIQUE",
        "scoreTotal": 78.3,
        // ...
      },
      {
        "method": "MENS_PHYSIQUE",
        "scoreTotal": 85.1,
        // ...
      }
    ],
    "photos": [ ... ],
    "createdAt": "2026-02-07T10:05:00Z"
  }
}

// Errors
404 - NOT_FOUND: Medida não encontrada
```

#### POST /measurements

Cria nova medição.

```typescript
// Request
POST /measurements
Authorization: Bearer <token>
Content-Type: application/json

{
  "measuredAt": "2026-02-07T10:00:00Z",  // opcional, default: now()
  "peso": 82.5,
  "gorduraCorporal": 15.2,
  "cintura": 82,
  "ombros": 120,
  "peitoral": 108,
  "braco": 40,
  "antebraco": 32,
  "pescoco": 40,
  "coxa": 60,
  "panturrilha": 38,
  "bracoEsquerdo": 39.5,      // opcional
  "bracoDireito": 40.5,       // opcional
  "coxaEsquerda": 59,         // opcional
  "coxaDireita": 61,          // opcional
  "notes": "Medido após treino"  // opcional
}

// Response 201 Created
{
  "success": true,
  "data": {
    "id": "msr_abc123",
    "measuredAt": "2026-02-07T10:00:00Z",
    // ... todos os campos
    "scores": [
      {
        "method": "GOLDEN_RATIO",
        "scoreTotal": 82.5,
        "classificacao": "INTERMEDIARIO",
        // ...
      },
      // ... outros métodos
    ]
  }
}

// Errors
400 - VALIDATION_ERROR: Campos inválidos
400 - PROFILE_INCOMPLETE: Perfil incompleto (faltam medidas estruturais)
```

#### PATCH /measurements/:id

Atualiza medição existente.

```typescript
// Request
PATCH /measurements/msr_abc123
Authorization: Bearer <token>
Content-Type: application/json

{
  "peso": 83.0,
  "notes": "Atualizado"
}

// Response 200 OK
{
  "success": true,
  "data": {
    // medição atualizada com scores recalculados
  }
}

// Errors
404 - NOT_FOUND: Medida não encontrada
400 - VALIDATION_ERROR: Campos inválidos
```

#### DELETE /measurements/:id

Deleta medição.

```typescript
// Request
DELETE /measurements/msr_abc123
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Medição deletada com sucesso"
  }
}

// Errors
404 - NOT_FOUND: Medida não encontrada
```

### 4.2 Endpoints Especiais

#### GET /measurements/latest

Retorna última medição do usuário.

```typescript
// Request
GET /measurements/latest
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    // última medição com scores
  }
}

// Response 404 se não houver medições
```

#### GET /measurements/compare

Compara duas medições.

```typescript
// Request
GET /measurements/compare?from=msr_abc&to=msr_xyz
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "from": { ... },  // medição antiga
    "to": { ... },    // medição nova
    "diff": {
      "days": 30,
      "measurements": {
        "peso": { from: 82.5, to: 83.0, change: 0.5, percent: 0.6 },
        "cintura": { from: 84, to: 82, change: -2, percent: -2.4 },
        "ombros": { from: 118, to: 120, change: 2, percent: 1.7 },
        // ...
      },
      "scores": {
        "GOLDEN_RATIO": { from: 80.5, to: 82.5, change: 2, percent: 2.5 },
        // ...
      }
    }
  }
}
```

#### GET /measurements/evolution

Retorna evolução ao longo do tempo.

```typescript
// Request
GET /measurements/evolution?metric=ombros&period=6months
Authorization: Bearer <token>

// Query Parameters
// - metric: ombros, cintura, braco, peso, scoreTotal, etc.
// - period: 1month, 3months, 6months, 1year, all

// Response 200 OK
{
  "success": true,
  "data": {
    "metric": "ombros",
    "period": "6months",
    "points": [
      { "date": "2025-08-01", "value": 115 },
      { "date": "2025-09-01", "value": 116.5 },
      { "date": "2025-10-01", "value": 117 },
      { "date": "2025-11-01", "value": 118 },
      { "date": "2025-12-01", "value": 119 },
      { "date": "2026-01-01", "value": 120 }
    ],
    "stats": {
      "min": 115,
      "max": 120,
      "avg": 117.58,
      "change": 5,
      "changePercent": 4.35
    }
  }
}
```

---

## 5. PROPORÇÕES (PROPORTIONS)

### 5.1 Cálculo de Proporções

#### POST /proportions/calculate

Calcula proporções sem salvar (preview).

```typescript
// Request
POST /proportions/calculate
Authorization: Bearer <token>
Content-Type: application/json

{
  // Medidas estruturais (ou usa do perfil se omitido)
  "altura": 180,
  "punho": 17.5,
  "tornozelo": 23,
  "joelho": 38,
  "pelve": 98,
  
  // Medidas variáveis
  "cintura": 82,
  "ombros": 120,
  "peitoral": 108,
  "braco": 40,
  "antebraco": 32,
  "pescoco": 40,
  "coxa": 60,
  "panturrilha": 38
}

// Response 200 OK
{
  "success": true,
  "data": {
    "goldenRatio": {
      "scoreTotal": 82.5,
      "classificacao": {
        "nivel": "INTERMEDIARIO",
        "emoji": "🥈",
        "descricao": "Boas proporções",
        "cor": "#3B82F6"
      },
      "scores": {
        "ombros": 16.3,
        "peitoral": 13.2,
        "braco": 12.7,
        // ...
      },
      "ideais": {
        "ombros": 132.7,
        "peitoral": 113.8,
        "braco": 44.1,
        // ...
      },
      "diferencas": {
        "ombros": { "diferenca": 12.7, "necessario": "aumentar" },
        "peitoral": { "diferenca": 5.8, "necessario": "aumentar" },
        // ...
      }
    },
    "classicPhysique": {
      "scoreTotal": 78.3,
      "pesoMaximoCategoria": 97.5,
      // ...
    },
    "mensPhysique": {
      "scoreTotal": 85.1,
      // ...
    },
    "recomendacao": {
      "melhorCategoria": "MENS_PHYSIQUE",
      "score": 85.1,
      "ranking": [
        { "nome": "Men's Physique", "score": 85.1 },
        { "nome": "Golden Ratio", "score": 82.5 },
        { "nome": "Classic Physique", "score": 78.3 }
      ]
    }
  }
}
```

#### GET /proportions/:measurementId

Retorna proporções de uma medição específica.

```typescript
// Request
GET /proportions/msr_abc123
Authorization: Bearer <token>

// Query Parameters
// - method: GOLDEN_RATIO | CLASSIC_PHYSIQUE | MENS_PHYSIQUE (opcional, retorna todos se omitido)

// Response 200 OK
{
  "success": true,
  "data": {
    "measurementId": "msr_abc123",
    "measuredAt": "2026-02-07T10:00:00Z",
    "scores": [
      {
        "method": "GOLDEN_RATIO",
        "scoreTotal": 82.5,
        // ...
      },
      // ...
    ]
  }
}
```

#### GET /proportions/ideals

Retorna apenas os valores ideais para o usuário.

```typescript
// Request
GET /proportions/ideals?method=GOLDEN_RATIO
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "method": "GOLDEN_RATIO",
    "ideais": {
      "ombros": 132.7,
      "peitoral": 113.8,
      "braco": 44.1,
      "antebraco": 35.3,
      "cintura": 84.3,
      "coxa": 66.5,
      "panturrilha": 44.2,
      "triade": {
        "valorIdeal": 44.1,
        "regra": "Pescoço = Braço = Panturrilha"
      }
    },
    "baseadoEm": {
      "altura": 180,
      "punho": 17.5,
      "tornozelo": 23,
      "joelho": 38,
      "pelve": 98
    }
  }
}
```

---

## 6. METAS (GOALS)

### 6.1 CRUD de Metas

#### GET /goals

Lista metas do usuário.

```typescript
// Request
GET /goals?status=IN_PROGRESS
Authorization: Bearer <token>

// Query Parameters
// - status: IN_PROGRESS | COMPLETED | FAILED | CANCELLED

// Response 200 OK
{
  "success": true,
  "data": [
    {
      "id": "goal_abc123",
      "type": "INCREASE",
      "targetMetric": "ombros",
      "currentValue": 120,
      "targetValue": 125,
      "progress": 0,  // calculado: 0-100%
      "status": "IN_PROGRESS",
      "deadline": "2026-06-01T00:00:00Z",
      "createdAt": "2026-02-01T00:00:00Z"
    },
    // ...
  ]
}
```

#### POST /goals

Cria nova meta.

```typescript
// Request
POST /goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "INCREASE",
  "targetMetric": "ombros",
  "targetValue": 125,
  "deadline": "2026-06-01"
}

// Response 201 Created
{
  "success": true,
  "data": {
    "id": "goal_abc123",
    "type": "INCREASE",
    "targetMetric": "ombros",
    "currentValue": 120,  // valor atual da última medição
    "targetValue": 125,
    "progress": 0,
    "status": "IN_PROGRESS",
    "deadline": "2026-06-01T00:00:00Z",
    "createdAt": "2026-02-07T00:00:00Z"
  }
}

// Errors
400 - VALIDATION_ERROR: Campos inválidos
400 - METRIC_NOT_FOUND: Métrica não encontrada nas medições
```

#### PATCH /goals/:id

Atualiza meta.

```typescript
// Request
PATCH /goals/goal_abc123
Authorization: Bearer <token>
Content-Type: application/json

{
  "targetValue": 128,
  "deadline": "2026-08-01"
}

// Response 200 OK
```

#### DELETE /goals/:id

Cancela meta.

```typescript
// Request
DELETE /goals/goal_abc123
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "message": "Meta cancelada"
  }
}
```

---

## 7. CONQUISTAS (ACHIEVEMENTS)

### 7.1 Endpoints de Conquistas

#### GET /achievements

Lista todas as conquistas disponíveis.

```typescript
// Request
GET /achievements
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": [
    {
      "id": "ach_abc123",
      "code": "FIRST_MEASUREMENT",
      "name": "Primeira Medição",
      "description": "Registrou sua primeira medição corporal",
      "icon": "📏",
      "color": "#00C9A7",
      "category": "MEASUREMENT",
      "xpReward": 100,
      "unlocked": true,
      "unlockedAt": "2026-01-15T10:00:00Z"
    },
    {
      "id": "ach_xyz789",
      "code": "GOLDEN_ELITE",
      "name": "Elite Dourada",
      "description": "Atingiu score Elite no Golden Ratio",
      "icon": "🏆",
      "color": "#FFD700",
      "category": "PROPORTION",
      "xpReward": 500,
      "unlocked": false,
      "unlockedAt": null
    },
    // ...
  ]
}
```

#### GET /achievements/me

Lista conquistas do usuário.

```typescript
// Request
GET /achievements/me
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "totalXp": 850,
    "level": 5,
    "nextLevelXp": 1000,
    "achievements": [
      {
        "id": "ach_abc123",
        "code": "FIRST_MEASUREMENT",
        "name": "Primeira Medição",
        "unlockedAt": "2026-01-15T10:00:00Z"
      },
      // ... conquistadas
    ],
    "recentUnlocks": [
      // últimas 5 conquistadas
    ]
  }
}
```

---

## 8. FOTOS (PHOTOS)

### 8.1 Upload e Gerenciamento

#### POST /photos/upload

Faz upload de foto corporal.

```typescript
// Request
POST /photos/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- file: <binary>
- pose: "RELAXED" | "FLEXED" | "VACUUM" | ...
- angle: "FRONT" | "BACK" | "LEFT_SIDE" | "RIGHT_SIDE"
- measurementId: "msr_abc123"  // opcional

// Response 201 Created
{
  "success": true,
  "data": {
    "id": "photo_abc123",
    "url": "https://cdn.vitru.ai/photos/...",
    "thumbnailUrl": "https://cdn.vitru.ai/thumbs/...",
    "pose": "RELAXED",
    "angle": "FRONT",
    "measurementId": "msr_abc123",
    "takenAt": "2026-02-07T10:00:00Z",
    "createdAt": "2026-02-07T10:05:00Z"
  }
}

// Errors
400 - INVALID_FILE: Arquivo inválido
413 - FILE_TOO_LARGE: Arquivo muito grande (max 10MB)
```

#### GET /photos

Lista fotos do usuário.

```typescript
// Request
GET /photos?limit=20&angle=FRONT
Authorization: Bearer <token>

// Query Parameters
// - limit: max fotos (default: 20)
// - angle: filtrar por ângulo
// - pose: filtrar por pose
// - measurementId: filtrar por medição

// Response 200 OK
{
  "success": true,
  "data": [ ... ]
}
```

#### DELETE /photos/:id

Deleta foto.

```typescript
// Request
DELETE /photos/photo_abc123
Authorization: Bearer <token>

// Response 200 OK
```

---

## 9. AI COACH

### 9.1 Insights e Recomendações

#### GET /ai/insights

Retorna insights baseados nas medições.

```typescript
// Request
GET /ai/insights
Authorization: Bearer <token>

// Response 200 OK
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "PROGRESS",
        "title": "Ombros em Evolução",
        "message": "Seus ombros cresceram 2cm no último mês. Continue assim!",
        "priority": "HIGH",
        "metric": "ombros",
        "icon": "📈"
      },
      {
        "type": "WARNING",
        "title": "Atenção à Cintura",
        "message": "Sua cintura aumentou 1cm. Considere revisar a dieta.",
        "priority": "MEDIUM",
        "metric": "cintura",
        "icon": "⚠️"
      },
      {
        "type": "TIP",
        "title": "Próximo Objetivo",
        "message": "Faltam apenas 3cm nos ombros para atingir o ideal Golden Ratio.",
        "priority": "LOW",
        "metric": "ombros",
        "icon": "🎯"
      }
    ],
    "weeklyReport": {
      "summary": "Semana positiva! 3 de 4 métricas melhoraram.",
      "highlights": [ ... ],
      "suggestions": [ ... ]
    }
  }
}
```

#### POST /ai/analyze

Solicita análise detalhada da IA.

```typescript
// Request
POST /ai/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "FULL_ANALYSIS",  // ou "QUICK_TIP", "WORKOUT_SUGGESTION"
  "context": {
    "goal": "Melhorar V-taper",
    "timeframe": "3 meses"
  }
}

// Response 200 OK
{
  "success": true,
  "data": {
    "analysis": {
      "strengths": [
        "Seus ombros são seu ponto forte genético (relação ombro/cintura acima da média)"
      ],
      "weaknesses": [
        "A largura da cintura aumentou levemente este mês"
      ],
      "recommendations": [
        "Inclua vacuum abdominal na sua rotina matinal",
        "Foque em exercícios de deltóide lateral",
        "Mantenha déficit calórico leve para reduzir cintura"
      ],
      "projectedProgress": {
        "metric": "scoreTotal",
        "current": 82.5,
        "projected": 87,
        "timeframe": "3 meses"
      }
    }
  }
}

// Nota: Endpoint PRO only
// Errors
403 - PRO_REQUIRED: Recurso disponível apenas para PRO
```

---

## 10. RATE LIMITING

### 10.1 Limites por Endpoint

| Endpoint | Limite Free | Limite PRO |
|----------|------------|------------|
| `/auth/*` | 10/min | 20/min |
| `/measurements` POST | 10/day | 50/day |
| `/photos/upload` | 5/day | 30/day |
| `/ai/analyze` | 0/day | 10/day |
| Outros GET | 100/min | 500/min |
| Outros POST/PATCH | 30/min | 100/min |

### 10.2 Headers de Rate Limit

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1707300000  # Unix timestamp
```

### 10.3 Resposta de Rate Limit

```typescript
// Response 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Limite de requisições excedido",
    "retryAfter": 60  // segundos
  }
}
```

---

## 11. CÓDIGOS DE ERRO

### 11.1 Tabela de Erros

| Código | HTTP | Descrição |
|--------|------|-----------|
| `VALIDATION_ERROR` | 400 | Dados de entrada inválidos |
| `INVALID_CREDENTIALS` | 401 | Email ou senha incorretos |
| `INVALID_TOKEN` | 401 | Token inválido ou expirado |
| `UNAUTHORIZED` | 401 | Não autenticado |
| `FORBIDDEN` | 403 | Sem permissão |
| `PRO_REQUIRED` | 403 | Recurso PRO only |
| `NOT_FOUND` | 404 | Recurso não encontrado |
| `EMAIL_EXISTS` | 409 | Email já cadastrado |
| `CONFLICT` | 409 | Conflito de dados |
| `FILE_TOO_LARGE` | 413 | Arquivo muito grande |
| `RATE_LIMIT_EXCEEDED` | 429 | Limite de requisições |
| `INTERNAL_ERROR` | 500 | Erro interno do servidor |

### 11.2 Formato de Erro

```typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "cintura",
        "message": "Deve ser um número entre 50 e 150"
      },
      {
        "field": "ombros",
        "message": "Campo obrigatório"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-02-07T12:00:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## 12. WEBHOOKS (Futuro)

### 12.1 Eventos Disponíveis

| Evento | Descrição |
|--------|-----------|
| `measurement.created` | Nova medição registrada |
| `achievement.unlocked` | Nova conquista desbloqueada |
| `goal.completed` | Meta atingida |
| `subscription.changed` | Assinatura alterada |

### 12.2 Payload de Webhook

```typescript
{
  "event": "measurement.created",
  "timestamp": "2026-02-07T12:00:00Z",
  "data": {
    "measurementId": "msr_abc123",
    "userId": "usr_abc123",
    // ...
  },
  "signature": "sha256=..."
}
```

---

## 13. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial da API |

---

**VITRU IA API**  
*REST • JWT • Rate Limited • Typed*
