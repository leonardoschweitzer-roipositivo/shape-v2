# SPEC: Modelo de Dados e Arquitetura de Páginas

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Modelo de Dados e Arquitetura

---

## 1. VISÃO GERAL DA ARQUITETURA

### 1.1 Diagrama de Entidades (Tabelas)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                     │
│                                    MODELO DE DADOS - VITRU IA                                       │
│                                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                    HIERARQUIA PRINCIPAL                                      │   │
│  │                                                                                              │   │
│  │     ┌──────────────┐         ┌──────────────┐         ┌──────────────┐                      │   │
│  │     │   ACADEMIA   │ ──1:N──▶│   PERSONAL   │ ──1:N──▶│    ATLETA    │                      │   │
│  │     │              │         │              │         │              │                      │   │
│  │     │ • id         │         │ • id         │         │ • id         │                      │   │
│  │     │ • nome       │         │ • nome       │         │ • nome       │                      │   │
│  │     │ • cnpj       │         │ • email      │         │ • email      │                      │   │
│  │     │ • plano      │         │ • cref       │         │ • telefone   │                      │   │
│  │     │ • ...        │         │ • academiaId?│         │ • personalId │                      │   │
│  │     └──────────────┘         │ • ...        │         │ • academiaId?│                      │   │
│  │            │                 └──────────────┘         │ • ...        │                      │   │
│  │            │                        │                 └──────────────┘                      │   │
│  │            │                        │                        │                              │   │
│  │            │              Personal pode ser                  │                              │   │
│  │            │              independente (sem                  │                              │   │
│  │            │              academiaId)                        │                              │   │
│  │            │                                                 │                              │   │
│  └────────────┼─────────────────────────────────────────────────┼──────────────────────────────┘   │
│               │                                                 │                                   │
│               │                                                 │                                   │
│  ┌────────────┼─────────────────────────────────────────────────┼──────────────────────────────┐   │
│  │            │              DADOS DO ATLETA                    │                              │   │
│  │            │                                                 │                              │   │
│  │            │         ┌───────────────────────────────────────┼──────────────────────┐       │   │
│  │            │         │                                       │                      │       │   │
│  │            │         ▼                                       ▼                      ▼       │   │
│  │            │  ┌──────────────┐                       ┌──────────────┐       ┌──────────────┐│   │
│  │            │  │    FICHA     │ ──────────────────────│   MEDIDAS    │       │  REGISTROS   ││   │
│  │            │  │   (1:1)      │                       │    (1:N)     │       │    (1:N)     ││   │
│  │            │  │              │                       │              │       │              ││   │
│  │            │  │ • atletaId   │                       │ • atletaId   │       │ • atletaId   ││   │
│  │            │  │ • altura     │                       │ • data       │       │ • data       ││   │
│  │            │  │ • dataNasc   │                       │ • ombros     │       │ • tipo       ││   │
│  │            │  │ • sexo       │                       │ • peitoral   │       │ • dados      ││   │
│  │            │  │ • objetivo   │                       │ • cintura    │       │ (refeição,   ││   │
│  │            │  │ • punho      │                       │ • quadril    │       │  treino,     ││   │
│  │            │  │ • tornozelo  │                       │ • braçoE/D   │       │  água, sono, ││   │
│  │            │  │ • joelho     │                       │ • coxaE/D    │       │  dor...)     ││   │
│  │            │  │ • pelve      │                       │ • ...        │       │              ││   │
│  │            │  └──────────────┘                       └──────────────┘       └──────────────┘│   │
│  │            │         │                                      │                      │        │   │
│  │            │         │                                      │                      │        │   │
│  │            │         │         ┌────────────────────────────┘                      │        │   │
│  │            │         │         │                                                   │        │   │
│  │            │         │         ▼                                                   │        │   │
│  │            │         │  ┌──────────────┐                                          │        │   │
│  │            │         │  │  AVALIAÇÕES  │◀─────────────────────────────────────────┘        │   │
│  │            │         │  │    (1:N)     │                                                   │   │
│  │            │         │  │              │                                                   │   │
│  │            │         │  │ • atletaId   │                                                   │   │
│  │            │         │  │ • medidasId  │ ◀── Referência às medidas daquela data           │   │
│  │            │         │  │ • data       │                                                   │   │
│  │            │         │  │ • peso       │                                                   │   │
│  │            │         │  │ • bf%        │                                                   │   │
│  │            │         │  │ • scoreGeral │                                                   │   │
│  │            │         │  │ • proporções │ ◀── JSON com todas as proporções calculadas      │   │
│  │            │         │  │ • ...        │                                                   │   │
│  │            │         │  └──────────────┘                                                   │   │
│  │            │         │                                                                     │   │
│  └────────────┼─────────┼─────────────────────────────────────────────────────────────────────┘   │
│               │         │                                                                         │
│               │         │                                                                         │
│  ┌────────────┼─────────┼─────────────────────────────────────────────────────────────────────┐   │
│  │            │         │              CONSULTORIA IA                                         │   │
│  │            │         │                                                                     │   │
│  │            │         │  ┌──────────────┐                                                   │   │
│  │            │         └─▶│  CONSULTORIA │                                                   │   │
│  │            │            │    (1:N)     │                                                   │   │
│  │            │            │              │                                                   │   │
│  │            │            │ • atletaId   │                                                   │   │
│  │            │            │ • tipo       │ ◀── "diagnostico", "treino", "dieta"              │   │
│  │            │            │ • prompt     │                                                   │   │
│  │            │            │ • resposta   │                                                   │   │
│  │            │            │ • data       │                                                   │   │
│  │            │            └──────────────┘                                                   │   │
│  │            │                                                                               │   │
│  └────────────┼───────────────────────────────────────────────────────────────────────────────┘   │
│               │                                                                                   │
└───────────────┼───────────────────────────────────────────────────────────────────────────────────┘
                │
                │
     Academia alimenta os dados
     que fluem para baixo
```

---

## 2. TABELAS DETALHADAS

### 2.1 ACADEMIA

```typescript
interface Academia {
  id: string                      // UUID
  
  // Dados de cadastro
  nome: string
  razaoSocial?: string
  cnpj: string
  email: string
  telefone: string
  
  // Endereço
  endereco: {
    rua: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  
  // Plano/Assinatura
  plano: 'BASIC' | 'PRO' | 'ENTERPRISE'
  limitePersonais: number
  limiteAtletas: number
  
  // Logo
  logoUrl?: string
  
  // Status
  status: 'ATIVO' | 'INATIVO' | 'TRIAL' | 'SUSPENSO'
  dataVencimento?: Date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 2.2 PERSONAL

```typescript
interface Personal {
  id: string                      // UUID
  
  // Vínculo (opcional - pode ser independente)
  academiaId?: string             // null = Personal independente
  
  // Dados de cadastro
  nome: string
  email: string
  telefone: string
  cpf: string
  cref: string                    // Registro profissional
  
  // Foto
  fotoUrl?: string
  
  // Autenticação
  senhaHash: string
  
  // Plano (se independente)
  plano?: 'FREE' | 'PRO' | 'UNLIMITED'
  limiteAtletas?: number
  
  // Status
  status: 'ATIVO' | 'INATIVO'
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 2.3 ATLETA

```typescript
interface Atleta {
  id: string                      // UUID
  
  // Vínculos
  personalId: string              // Obrigatório
  academiaId?: string             // Herdado do Personal ou null
  
  // Dados de cadastro
  nome: string
  email?: string
  telefone: string                // Obrigatório para WhatsApp
  
  // Foto
  fotoUrl?: string
  
  // Token do portal (acesso sem login)
  portalToken: string             // Hash único para URL
  portalTokenExpira?: Date        // Opcional: expiração
  
  // Status
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE'
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 2.4 FICHA (Dados Estruturais - 1:1 com Atleta)

```typescript
interface Ficha {
  id: string                      // UUID
  atletaId: string                // FK única (1:1)
  
  // Dados pessoais
  dataNascimento: Date
  sexo: 'M' | 'F'
  
  // Medidas estruturais (fixas - não mudam)
  altura: number                  // cm
  punho: number                   // cm - circunferência
  tornozelo: number               // cm - circunferência
  joelho: number                  // cm - circunferência
  pelve?: number                  // cm - largura óssea
  
  // Objetivo
  objetivo: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE'
  categoriaPreferida?: string     // "GOLDEN_RATIO", "CLASSIC_PHYSIQUE", etc.
  
  // Observações médicas
  observacoes?: string
  restricoes?: string[]           // ["Hérnia de disco", "Tendinite ombro"]
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 2.5 MEDIDAS (Histórico - 1:N com Atleta)

```typescript
interface Medidas {
  id: string                      // UUID
  atletaId: string                // FK
  
  // Data do registro
  data: Date
  
  // Composição corporal
  peso: number                    // kg
  gorduraCorporal?: number        // % (se medido)
  
  // Medidas de circunferência (cm)
  // Tronco
  ombros: number
  peitoral: number
  cintura: number
  quadril: number
  abdomen?: number
  
  // Braços (bilaterais)
  bracoEsquerdo: number
  bracoDireito: number
  antebracoEsquerdo: number
  antebracoDireito: number
  
  // Pernas (bilaterais)
  coxaEsquerda: number
  coxaDireita: number
  panturrilhaEsquerda: number
  panturrilhaDireita: number
  
  // Pescoço (opcional)
  pescoco?: number
  
  // Quem registrou
  registradoPor: 'PERSONAL' | 'ATLETA'
  personalId?: string
  
  // Metadata
  createdAt: Date
}
```

### 2.6 AVALIAÇÕES (Análise - 1:N com Atleta)

```typescript
interface Avaliacao {
  id: string                      // UUID
  atletaId: string                // FK
  medidasId: string               // FK - referência às medidas usadas
  
  // Data
  data: Date
  
  // Composição (calculada)
  peso: number
  gorduraCorporal: number
  massaMagra: number
  massaGorda: number
  
  // Índices calculados
  imc: number
  ffmi?: number                   // Fat-Free Mass Index
  
  // Score geral
  scoreGeral: number              // 0-100
  classificacaoGeral: string      // "INICIO", "CAMINHO", "QUASE_LA", "META", "ELITE"
  
  // Proporções calculadas (JSON)
  proporcoes: {
    nome: string
    indiceAtual: number
    indiceMeta: number
    percentualDoIdeal: number
    classificacao: string
  }[]
  
  // Simetria bilateral
  simetria: {
    braco: number                 // % de diferença
    antebraco: number
    coxa: number
    panturrilha: number
    scoreSimtetria: number
  }
  
  // Comparação com avaliação anterior
  comparacaoAnterior?: {
    avaliacaoAnteriorId: string
    diferencaPeso: number
    diferencaBF: number
    diferencaScore: number
  }
  
  // Metadata
  createdAt: Date
}
```

### 2.7 REGISTROS (Acompanhamento Diário - 1:N com Atleta)

```typescript
interface Registro {
  id: string                      // UUID
  atletaId: string                // FK
  
  // Data/hora
  data: Date
  
  // Tipo de registro
  tipo: 'REFEICAO' | 'TREINO' | 'AGUA' | 'SONO' | 'DOR' | 'PESO' | 'SUPLEMENTO'
  
  // Dados específicos por tipo (JSON)
  dados: RegistroRefeicao | RegistroTreino | RegistroAgua | RegistroSono | RegistroDor | RegistroPeso
  
  // Origem
  origem: 'PORTAL' | 'COACH_IA' | 'PERSONAL'
  
  // Metadata
  createdAt: Date
}

// Tipos específicos de dados
interface RegistroRefeicao {
  tipo: 'cafe' | 'lanche_manha' | 'almoco' | 'lanche_tarde' | 'jantar' | 'ceia'
  descricao: string
  fotoUrl?: string
  calorias?: number
  proteina?: number
  carboidrato?: number
  gordura?: number
}

interface RegistroTreino {
  grupamento: string              // "Peito + Tríceps"
  duracao: number                 // minutos
  intensidade: 1 | 2 | 3 | 4      // 1=difícil, 4=ótimo
  observacoes?: string
}

interface RegistroAgua {
  quantidade: number              // ml
}

interface RegistroSono {
  horas: number
  qualidade: 1 | 2 | 3            // 1=ruim, 3=ótimo
  acordouDuranteNoite?: number
}

interface RegistroDor {
  local: string                   // "ombro_direito"
  intensidade: number             // 1-10
  tipo?: string                   // "aguda", "latejante"
  observacoes?: string
}

interface RegistroPeso {
  peso: number                    // kg
}
```

### 2.8 CONSULTORIA (Coach IA - 1:N com Atleta)

```typescript
interface Consultoria {
  id: string                      // UUID
  atletaId: string                // FK
  
  // Tipo de consultoria
  tipo: 'DIAGNOSTICO' | 'TREINO' | 'DIETA' | 'CHAT'
  
  // Contexto usado (snapshot)
  contexto: {
    avaliacaoId?: string
    medidasId?: string
    fichaSnapshot: Partial<Ficha>
    medidasSnapshot?: Partial<Medidas>
  }
  
  // Interação
  prompt: string                  // Pergunta/solicitação
  resposta: string                // Resposta da IA
  
  // Metadata
  data: Date
  tokens?: number                 // Tokens consumidos
  modelo?: string                 // "claude-3.5-sonnet"
  
  createdAt: Date
}
```

---

## 3. RELACIONAMENTOS (DIAGRAMA ER)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                     │
│                                    DIAGRAMA ER - VITRU IA                                           │
│                                                                                                     │
│                                                                                                     │
│    ┌──────────────┐                                                                                 │
│    │   ACADEMIA   │                                                                                 │
│    └──────┬───────┘                                                                                 │
│           │                                                                                         │
│           │ 1:N (uma academia tem vários personais)                                                 │
│           │                                                                                         │
│           ▼                                                                                         │
│    ┌──────────────┐                                                                                 │
│    │   PERSONAL   │─────────────────────────────────────────────────────────────────┐              │
│    └──────┬───────┘                                                                 │              │
│           │                                                                         │              │
│           │ 1:N (um personal tem vários atletas)                                    │              │
│           │                                                                         │              │
│           ▼                                                                         │              │
│    ┌──────────────┐                                                                 │              │
│    │    ATLETA    │◀────────────────────────────────────────────────────────────────┘              │
│    └──────┬───────┘                                                                                 │
│           │                                                                                         │
│           ├───────────────────┬───────────────────┬───────────────────┬──────────────────┐          │
│           │                   │                   │                   │                  │          │
│           │ 1:1               │ 1:N               │ 1:N               │ 1:N              │ 1:N      │
│           │                   │                   │                   │                  │          │
│           ▼                   ▼                   ▼                   ▼                  ▼          │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   ┌──────────────┐ │
│    │    FICHA     │    │   MEDIDAS    │    │  AVALIAÇÕES  │    │  REGISTROS   │   │ CONSULTORIA  │ │
│    │              │    │              │    │              │    │              │   │              │ │
│    │ (dados fixos)│    │ (histórico)  │    │ (análises)   │    │ (diário)     │   │ (Coach IA)   │ │
│    └──────────────┘    └──────┬───────┘    └──────────────┘    └──────────────┘   └──────────────┘ │
│                               │                   ▲                                                 │
│                               │                   │                                                 │
│                               │ N:1               │                                                 │
│                               │ (avaliação usa    │                                                 │
│                               │  medidas)         │                                                 │
│                               └───────────────────┘                                                 │
│                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Resumo dos Relacionamentos

| Entidade A | Relação | Entidade B | Descrição |
|------------|:-------:|------------|-----------|
| ACADEMIA | 1:N | PERSONAL | Uma academia tem vários personais |
| PERSONAL | 1:N | ATLETA | Um personal tem vários atletas |
| ATLETA | 1:1 | FICHA | Cada atleta tem uma ficha única |
| ATLETA | 1:N | MEDIDAS | Atleta tem várias medições ao longo do tempo |
| ATLETA | 1:N | AVALIAÇÕES | Atleta tem várias avaliações |
| ATLETA | 1:N | REGISTROS | Atleta faz vários registros diários |
| ATLETA | 1:N | CONSULTORIA | Atleta tem várias interações com Coach IA |
| MEDIDAS | N:1 | AVALIAÇÕES | Cada avaliação usa um registro de medidas |

---

## 4. PÁGINAS/TELAS E SUAS CONEXÕES

### 4.1 Mapa de Páginas por Tipo de Usuário

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                     │
│                                    MAPA DE PÁGINAS - VITRU IA                                       │
│                                                                                                     │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                                            │    │
│  │                              ÁREA ADMINISTRATIVA                                           │    │
│  │                                                                                            │    │
│  │    ┌─────────────────────────────────────────────────────────────────────────────────┐    │    │
│  │    │                           ACADEMIA (Web App)                                    │    │    │
│  │    │                                                                                 │    │    │
│  │    │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │    │    │
│  │    │    │  Dashboard  │    │  Personais  │    │  Relatórios │    │ Configurações│   │    │    │
│  │    │    │             │    │  (lista)    │    │             │    │             │    │    │    │
│  │    │    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    │    │    │
│  │    │                                                                                 │    │    │
│  │    └─────────────────────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                                            │    │
│  │    ┌─────────────────────────────────────────────────────────────────────────────────┐    │    │
│  │    │                           PERSONAL (Web App)                                    │    │    │
│  │    │                                                                                 │    │    │
│  │    │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │    │    │
│  │    │    │  Dashboard  │    │   Atletas   │    │  Coach IA   │    │    Perfil   │    │    │    │
│  │    │    │             │    │   (lista)   │    │             │    │             │    │    │    │
│  │    │    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └─────────────┘    │    │    │
│  │    │           │                  │                  │                              │    │    │
│  │    │           │                  │                  │                              │    │    │
│  │    │           ▼                  ▼                  ▼                              │    │    │
│  │    │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                       │    │    │
│  │    │    │  Evolução   │    │   Atleta    │    │ Diagnóstico │                       │    │    │
│  │    │    │  (gráficos) │    │  (detalhe)  │    │   Treino    │                       │    │    │
│  │    │    │             │    │             │    │   Dieta     │                       │    │    │
│  │    │    └─────────────┘    └──────┬──────┘    └─────────────┘                       │    │    │
│  │    │                              │                                                 │    │    │
│  │    │                    ┌─────────┼─────────┬─────────────────┐                     │    │    │
│  │    │                    │         │         │                 │                     │    │    │
│  │    │                    ▼         ▼         ▼                 ▼                     │    │    │
│  │    │             ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐               │    │    │
│  │    │             │  Ficha   │ │ Medidas  │ │Avaliações│ │Registros │               │    │    │
│  │    │             │ (editar) │ │(adicionar│ │ (lista)  │ │ (lista)  │               │    │    │
│  │    │             │          │ │  nova)   │ │          │ │          │               │    │    │
│  │    │             └──────────┘ └──────────┘ └────┬─────┘ └──────────┘               │    │    │
│  │    │                                            │                                   │    │    │
│  │    │                                            ▼                                   │    │    │
│  │    │                                     ┌──────────┐                               │    │    │
│  │    │                                     │Avaliação │                               │    │    │
│  │    │                                     │(detalhe) │──▶ [Enviar Portal]            │    │    │
│  │    │                                     └──────────┘                               │    │    │
│  │    │                                                                                 │    │    │
│  │    └─────────────────────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                                            │    │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                                     │
│                                                                                                     │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                                            │    │
│  │                              ÁREA DO ATLETA                                                │    │
│  │                                                                                            │    │
│  │    ┌─────────────────────────────────────────────────────────────────────────────────┐    │    │
│  │    │                      PORTAL DO ATLETA (Web Mobile)                              │    │    │
│  │    │                                                                                 │    │    │
│  │    │    Acesso via link único (sem login): vitru.app/p/{token}                      │    │    │
│  │    │                                                                                 │    │    │
│  │    │    ┌─────────────────────────────────────────────────────────────────────┐     │    │    │
│  │    │    │                        UMA TELA (scroll)                            │     │    │    │
│  │    │    │                                                                     │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │   Header    │  ◀── Nome, Personal, Data                        │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │ Score Geral │  ◀── Última AVALIAÇÃO                           │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │ Composição  │  ◀── Última AVALIAÇÃO                           │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │ Proporções  │  ◀── Última AVALIAÇÃO                           │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │  Medidas    │  ◀── Última MEDIDAS                             │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │ Acompanham. │  ──▶ Cria REGISTROS                             │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │  Coach IA   │  ──▶ Cria CONSULTORIA                           │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │    ┌─────────────┐                                                  │     │    │    │
│  │    │    │    │  Contato    │  ◀── Dados do PERSONAL                          │     │    │    │
│  │    │    │    └─────────────┘                                                  │     │    │    │
│  │    │    │                                                                     │     │    │    │
│  │    │    └─────────────────────────────────────────────────────────────────────┘     │    │    │
│  │    │                                                                                 │    │    │
│  │    └─────────────────────────────────────────────────────────────────────────────────┘    │    │
│  │                                                                                            │    │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Tabela: Páginas e Dados que Consomem/Produzem

| Página | Usuário | Lê (SELECT) | Escreve (INSERT/UPDATE) |
|--------|---------|-------------|-------------------------|
| **Academia: Dashboard** | Academia | Personal, Atleta (counts) | - |
| **Academia: Personais** | Academia | Personal | Personal |
| **Personal: Dashboard** | Personal | Atleta, Avaliações (resumo) | - |
| **Personal: Evolução** | Personal | Avaliações, Medidas | - |
| **Personal: Atletas** | Personal | Atleta | - |
| **Personal: Atleta (detalhe)** | Personal | Atleta, Ficha, Medidas, Avaliações, Registros | - |
| **Personal: Ficha** | Personal | Ficha | Ficha |
| **Personal: Medidas** | Personal | Medidas | Medidas |
| **Personal: Avaliações** | Personal | Avaliações | Avaliações |
| **Personal: Avaliação (detalhe)** | Personal | Avaliação, Medidas | - |
| **Personal: Coach IA** | Personal | Atleta, Ficha, Medidas, Avaliações | Consultoria |
| **Portal: Tela única** | Atleta | Atleta, Ficha, Medidas, Avaliações | Registros, Consultoria |

---

## 5. FLUXO DE DADOS

### 5.1 Fluxo: Cadastro de Atleta

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    FLUXO: CADASTRO DE ATLETA                                │
│                                                                             │
│    Personal                                                                 │
│        │                                                                    │
│        │ 1. Criar atleta                                                    │
│        ▼                                                                    │
│    ┌──────────┐                                                             │
│    │  ATLETA  │ ◀── INSERT                                                  │
│    └────┬─────┘                                                             │
│         │                                                                   │
│         │ 2. Preencher ficha                                                │
│         ▼                                                                   │
│    ┌──────────┐                                                             │
│    │  FICHA   │ ◀── INSERT                                                  │
│    └────┬─────┘                                                             │
│         │                                                                   │
│         │ 3. Registrar medidas                                              │
│         ▼                                                                   │
│    ┌──────────┐                                                             │
│    │ MEDIDAS  │ ◀── INSERT                                                  │
│    └────┬─────┘                                                             │
│         │                                                                   │
│         │ 4. Sistema calcula proporções e score                             │
│         ▼                                                                   │
│    ┌──────────┐                                                             │
│    │AVALIAÇÃO │ ◀── INSERT (gerado automaticamente)                         │
│    └────┬─────┘                                                             │
│         │                                                                   │
│         │ 5. Enviar portal                                                  │
│         ▼                                                                   │
│    ┌──────────────────┐                                                     │
│    │ WhatsApp/Link    │                                                     │
│    │ vitru.app/p/xxx  │                                                     │
│    └──────────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Fluxo: Nova Avaliação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    FLUXO: NOVA AVALIAÇÃO                                    │
│                                                                             │
│    Personal                                                                 │
│        │                                                                    │
│        │ 1. Registrar novas medidas                                         │
│        ▼                                                                    │
│    ┌──────────┐                                                             │
│    │ MEDIDAS  │ ◀── INSERT (nova linha com data atual)                      │
│    └────┬─────┘                                                             │
│         │                                                                   │
│         │ 2. Sistema busca FICHA do atleta                                  │
│         │                                                                   │
│         ├──────────────▶ FICHA (dados estruturais)                          │
│         │                                                                   │
│         │ 3. Sistema calcula:                                               │
│         │    - Proporções (usando fórmulas + FICHA + MEDIDAS)               │
│         │    - Simetria bilateral                                           │
│         │    - Score geral                                                  │
│         │    - Comparação com avaliação anterior                            │
│         │                                                                   │
│         ▼                                                                   │
│    ┌──────────┐                                                             │
│    │AVALIAÇÃO │ ◀── INSERT (com todos os cálculos)                          │
│    └────┬─────┘                                                             │
│         │                                                                   │
│         │ 4. Exibe resultado e sugere enviar portal                         │
│         ▼                                                                   │
│    ┌──────────────────┐                                                     │
│    │ Botão "Enviar    │                                                     │
│    │ Portal ao Atleta"│                                                     │
│    └──────────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Fluxo: Atleta Acessa Portal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    FLUXO: ACESSO AO PORTAL                                  │
│                                                                             │
│    Atleta clica no link                                                     │
│    vitru.app/p/{token}                                                      │
│        │                                                                    │
│        │ 1. Sistema valida token                                            │
│        ▼                                                                    │
│    ┌──────────┐                                                             │
│    │  ATLETA  │ ◀── SELECT WHERE portalToken = token                        │
│    └────┬─────┘                                                             │
│         │                                                                   │
│         │ 2. Busca dados relacionados                                       │
│         │                                                                   │
│         ├──────▶ PERSONAL (nome, telefone)                                  │
│         │                                                                   │
│         ├──────▶ FICHA (dados estruturais)                                  │
│         │                                                                   │
│         ├──────▶ MEDIDAS (última = ORDER BY data DESC LIMIT 1)              │
│         │                                                                   │
│         ├──────▶ AVALIAÇÃO (última = ORDER BY data DESC LIMIT 1)            │
│         │                                                                   │
│         │ 3. Monta página do portal                                         │
│         ▼                                                                   │
│    ┌──────────────────┐                                                     │
│    │   Portal do      │                                                     │
│    │   Atleta         │                                                     │
│    │   (renderizado)  │                                                     │
│    └──────────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 Fluxo: Coach IA

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                    FLUXO: COACH IA                                          │
│                                                                             │
│    Personal ou Atleta                                                       │
│        │                                                                    │
│        │ 1. Seleciona tipo (diagnóstico/treino/dieta/chat)                  │
│        │                                                                    │
│        │ 2. Sistema monta contexto                                          │
│        │                                                                    │
│        ├──────▶ FICHA (snapshot)                                            │
│        ├──────▶ MEDIDAS (última)                                            │
│        ├──────▶ AVALIAÇÃO (última + histórico)                              │
│        ├──────▶ REGISTROS (últimos 7 dias)                                  │
│        │                                                                    │
│        │ 3. Envia para IA                                                   │
│        ▼                                                                    │
│    ┌──────────────────┐                                                     │
│    │   Claude API     │                                                     │
│    │   (LLM)          │                                                     │
│    └────────┬─────────┘                                                     │
│             │                                                               │
│             │ 4. Retorna resposta                                           │
│             ▼                                                               │
│    ┌──────────────────┐                                                     │
│    │  CONSULTORIA     │ ◀── INSERT (tipo, contexto, resposta)               │
│    └──────────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. QUERIES PRINCIPAIS

### 6.1 Portal do Atleta - Carregar Dados

```sql
-- 1. Buscar atleta pelo token
SELECT a.*, p.nome AS personalNome, p.telefone AS personalTelefone
FROM atletas a
JOIN personais p ON a.personalId = p.id
WHERE a.portalToken = :token
  AND a.status = 'ATIVO';

-- 2. Buscar ficha do atleta
SELECT * FROM fichas WHERE atletaId = :atletaId;

-- 3. Buscar última medida
SELECT * FROM medidas 
WHERE atletaId = :atletaId 
ORDER BY data DESC 
LIMIT 1;

-- 4. Buscar última avaliação
SELECT * FROM avaliacoes 
WHERE atletaId = :atletaId 
ORDER BY data DESC 
LIMIT 1;
```

### 6.2 Dashboard do Personal - Resumo

```sql
-- Atletas com última avaliação
SELECT 
  a.id,
  a.nome,
  a.fotoUrl,
  av.data AS ultimaAvaliacao,
  av.scoreGeral,
  av.classificacaoGeral,
  av.peso
FROM atletas a
LEFT JOIN LATERAL (
  SELECT * FROM avaliacoes 
  WHERE atletaId = a.id 
  ORDER BY data DESC 
  LIMIT 1
) av ON true
WHERE a.personalId = :personalId
  AND a.status = 'ATIVO'
ORDER BY av.data DESC;
```

### 6.3 Evolução - Gráfico de Peso

```sql
SELECT data, peso
FROM avaliacoes
WHERE atletaId = :atletaId
  AND data >= :dataInicio
ORDER BY data ASC;
```

---

## 7. ÍNDICES RECOMENDADOS

```sql
-- Atletas
CREATE INDEX idx_atletas_personal ON atletas(personalId);
CREATE INDEX idx_atletas_token ON atletas(portalToken);
CREATE INDEX idx_atletas_academia ON atletas(academiaId);

-- Fichas
CREATE UNIQUE INDEX idx_fichas_atleta ON fichas(atletaId);

-- Medidas
CREATE INDEX idx_medidas_atleta_data ON medidas(atletaId, data DESC);

-- Avaliações
CREATE INDEX idx_avaliacoes_atleta_data ON avaliacoes(atletaId, data DESC);
CREATE INDEX idx_avaliacoes_medidas ON avaliacoes(medidasId);

-- Registros
CREATE INDEX idx_registros_atleta_data ON registros(atletaId, data DESC);
CREATE INDEX idx_registros_tipo ON registros(atletaId, tipo, data DESC);

-- Consultoria
CREATE INDEX idx_consultoria_atleta ON consultoria(atletaId, data DESC);
```

---

## 8. RESUMO VISUAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         RESUMO - MODELO DE DADOS                            │
│                                                                             │
│  ENTIDADES:                                                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ACADEMIA ──1:N──▶ PERSONAL ──1:N──▶ ATLETA                                │
│                                         │                                   │
│                                         ├──1:1──▶ FICHA                     │
│                                         ├──1:N──▶ MEDIDAS ◀──┐              │
│                                         ├──1:N──▶ AVALIAÇÕES ┘              │
│                                         ├──1:N──▶ REGISTROS                 │
│                                         └──1:N──▶ CONSULTORIA               │
│                                                                             │
│  PÁGINAS:                                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ACADEMIA:  Dashboard │ Personais │ Relatórios │ Config                     │
│                                                                             │
│  PERSONAL:  Dashboard │ Evolução │ Atletas │ Coach IA │ Perfil              │
│                        └─▶ Atleta (detalhe)                                 │
│                             └─▶ Ficha │ Medidas │ Avaliações │ Registros    │
│                                                                             │
│  ATLETA:    Portal (uma tela com scroll)                                    │
│             └─▶ Score │ Composição │ Proporções │ Medidas │ Acompanhamento  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Modelo de dados completo |

---

**VITRU IA - Modelo de Dados e Arquitetura v1.0**  
*Entidades • Relacionamentos • Páginas • Fluxos*
