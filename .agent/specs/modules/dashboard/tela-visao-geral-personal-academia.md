# SPEC: Tela PERSONAL - Usuário Academia

## Documento de Especificação Técnica v1.0

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Portal Academia  
**Tela:** Visão Geral do Personal e seus Alunos

---

## 1. VISÃO GERAL

### 1.1 Objetivo

Permitir que a **Academia** visualize o desempenho completo de um **Personal** específico, incluindo métricas de performance, lista de alunos, evolução e comparativos.

### 1.2 Contexto de Acesso

```
ACADEMIA
    │
    └── Menu: PERSONAIS
            │
            └── Lista de Personais
                    │
                    └── Clique no Personal
                            │
                            ▼
                    ┌─────────────────────┐
                    │  TELA DE DETALHE    │
                    │  DO PERSONAL        │
                    │                     │
                    │  (esta SPEC)        │
                    └─────────────────────┘
```

### 1.3 Permissões da Academia

| Ação | Permitido | Observação |
|------|:---------:|------------|
| Visualizar dados do Personal | ✅ | Dados profissionais |
| Visualizar métricas de desempenho | ✅ | KPIs e estatísticas |
| Visualizar lista de alunos | ✅ | Resumo dos alunos |
| Visualizar evolução | ✅ | Gráficos e tendências |
| Editar dados do Personal | ✅ | Apenas dados cadastrais |
| Desativar Personal | ✅ | Remover vínculo |
| Ver detalhes de aluno | ✅ | Redireciona para tela ALUNO |
| Fazer avaliação de aluno | ❌ | Apenas o Personal pode |
| Acessar Coach IA do Personal | ❌ | Privado do Personal |

---

## 2. TELA: LISTA DE PERSONAIS

### 2.1 Layout da Lista (Contexto de Entrada)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  👨‍🏫 PERSONAIS                                                               │
│                                                                             │
│  Total: 12 personais │ 11 ativos │ 1 inativo                               │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  🔍 Buscar personal por nome...                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  FILTROS:                                                                   │
│  ┌─────────────────┐ ┌─────────────────┐                                  │
│  │ Status ▼        │ │ Ordenar por ▼   │                                  │
│  │ Todos           │ │ Nº Alunos       │                                  │
│  └─────────────────┘ └─────────────────┘                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌──────┐  PEDRO COACH                                  ATIVO 🟢   │   │
│  │  │ FOTO │  CREF: 123456-G/SP                                       │   │
│  │  └──────┘  📱 (11) 99999-9999                                       │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ 👥 45       │ │ 📊 76 pts   │ │ 📈 +8 pts   │ │ 🏆 3 ELITE  │   │   │
│  │  │   alunos    │ │ score médio │ │ evol./mês   │ │   atletas   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                                     │   │
│  │  [ 👁️ VER DETALHES ]                              [ ✏️ EDITAR ]    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌──────┐  MARIA FITNESS                                ATIVO 🟢   │   │
│  │  │ FOTO │  CREF: 654321-G/SP                                       │   │
│  │  └──────┘  📱 (11) 98888-8888                                       │   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ 👥 38       │ │ 📊 74 pts   │ │ 📈 +5 pts   │ │ 🏆 2 ELITE  │   │   │
│  │  │   alunos    │ │ score médio │ │ evol./mês   │ │   atletas   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                                     │   │
│  │  [ 👁️ VER DETALHES ]                              [ ✏️ EDITAR ]    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│            [ + ADICIONAR PERSONAL ]                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. TELA: DETALHE DO PERSONAL

### 3.1 Objetivo da Tela

Exibir visão completa do desempenho do Personal, incluindo:
- Dados profissionais
- KPIs de performance
- Lista e distribuição de alunos
- Evolução ao longo do tempo
- Ranking e comparativos

### 3.2 Dados Consumidos

```typescript
interface DetalhePersonalAcademia {
  // Dados do Personal
  personal: {
    id: string
    nome: string
    fotoUrl?: string
    email: string
    telefone: string
    cpf: string
    cref: string
    status: 'ATIVO' | 'INATIVO'
    dataVinculo: Date
    diasNaAcademia: number
  }
  
  // KPIs Principais
  kpis: {
    totalAlunos: number
    alunosAtivos: number
    alunosInativos: number
    
    scoreMedio: number
    evolucaoMediaMensal: number      // pts/mês
    
    avaliacoesEsteMes: number
    avaliacoesMesPassado: number
    totalAvaliacoes: number
    
    atletasElite: number
    atletasMeta: number
    atletasQuaseLa: number
    atletasCaminho: number
    atletasInicio: number
  }
  
  // Ranking na Academia
  ranking: {
    posicao: number
    totalPersonais: number
    percentil: number                // Top X%
  }
  
  // Lista de Alunos (resumida)
  alunos: {
    id: string
    nome: string
    fotoUrl?: string
    score: number
    classificacao: string
    ultimaAvaliacao: Date
    evolucaoUltimoMes: number
    status: 'ATIVO' | 'INATIVO'
  }[]
  
  // Top Alunos
  topAlunos: {
    id: string
    nome: string
    fotoUrl?: string
    score: number
    classificacao: string
  }[]
  
  // Alunos que precisam de atenção
  alunosAtencao: {
    id: string
    nome: string
    motivo: 'SEM_AVALIACAO' | 'SCORE_CAINDO' | 'INATIVO'
    diasSemAvaliacao?: number
    quedaScore?: number
  }[]
  
  // Evolução histórica
  evolucao: {
    scoreMedioPorMes: { mes: string; valor: number }[]
    totalAlunosPorMes: { mes: string; valor: number }[]
    avaliacoesPorMes: { mes: string; valor: number }[]
  }
  
  // Distribuição de classificações
  distribuicao: {
    classificacao: string
    quantidade: number
    percentual: number
  }[]
}
```

### 3.3 Layout Completo da Tela

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ← Voltar para lista                                         [ ✏️ EDITAR ] │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌────────────┐                                                     │   │
│  │  │            │    PEDRO COACH                          ATIVO 🟢   │   │
│  │  │    FOTO    │                                                     │   │
│  │  │            │    📧 pedro.coach@email.com                         │   │
│  │  │            │    📱 (11) 99999-9999                               │   │
│  │  └────────────┘    🏋️ CREF: 123456-G/SP                             │   │
│  │                    📅 Na academia desde: 15/03/2024 (328 dias)      │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │                                                                     │   │
│  │  🏆 RANKING NA ACADEMIA                                             │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  │       🥇 1º LUGAR                                           │   │   │
│  │  │       de 12 personais                                       │   │   │
│  │  │                                                             │   │   │
│  │  │       Top 8% da academia                                    │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  📊 KPIs DE DESEMPENHO                                                      │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ 👥 ALUNOS   │ │ 📊 SCORE    │ │ 📈 EVOLUÇÃO │ │ 📋 AVALIAÇÕES│  │   │
│  │  │             │ │    MÉDIO    │ │    MÉDIA    │ │   ESTE MÊS  │   │   │
│  │  │     45      │ │    76       │ │   +8 pts    │ │     12      │   │   │
│  │  │             │ │   pontos    │ │   /mês      │ │             │   │   │
│  │  │ 42 ativos   │ │             │ │             │ │ (10 mês ant)│   │   │
│  │  │ 3 inativos  │ │             │ │             │ │             │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  📊 DISTRIBUIÇÃO DOS ALUNOS POR CLASSIFICAÇÃO                       │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  │  ELITE 👑     ███████                           3 (7%)      │   │   │
│  │  │  META 🎯      ██████████████████               8 (18%)      │   │   │
│  │  │  QUASE LÁ 💪  ██████████████████████████████  15 (33%)      │   │   │
│  │  │  CAMINHO 🛤️   ████████████████████████        12 (27%)      │   │   │
│  │  │  INÍCIO 🚀    ███████████████                  7 (15%)      │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  🏆 TOP ALUNOS                                                              │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │ 🥇 │ [FOTO] Zeus Fitness      │ 95 pts │ ELITE 👑 │ [Ver →] │ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ 🥈 │ [FOTO] Apollo Strong     │ 92 pts │ ELITE 👑 │ [Ver →] │ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ 🥉 │ [FOTO] Hercules Power    │ 89 pts │ META 🎯  │ [Ver →] │ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ 4º │ [FOTO] Atlas Gym         │ 87 pts │ META 🎯  │ [Ver →] │ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ 5º │ [FOTO] Titan Training    │ 85 pts │ META 🎯  │ [Ver →] │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  ⚠️ ALUNOS QUE PRECISAM DE ATENÇÃO                                         │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │ ⚠️ │ [FOTO] Carlos Santos │ 45 dias sem avaliação   │ [Ver →]│ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ 📉 │ [FOTO] Ana Costa     │ Score caindo (-5 pts)   │ [Ver →]│ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ 🔴 │ [FOTO] Paulo Lima    │ Inativo há 60 dias      │ [Ver →]│ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │  Nenhum aluno em situação crítica? Ótimo trabalho! 🎉              │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  📈 EVOLUÇÃO AO LONGO DO TEMPO                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  📊 SCORE MÉDIO DOS ALUNOS                          [6 meses ▼]    │   │
│  │                                                                     │   │
│  │     78 ┤                                        •                   │   │
│  │        │                                   •                        │   │
│  │     75 ┤                          •   •                             │   │
│  │        │                     •                                      │   │
│  │     72 ┤         •   •                                              │   │
│  │        │    •                                                       │   │
│  │     69 ┤                                                            │   │
│  │        └────────────────────────────────────────────────            │   │
│  │          Set    Out    Nov    Dez    Jan    Fev                     │   │
│  │                                                                     │   │
│  │  📈 Tendência: +1.5 pts/mês                                         │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  👥 TOTAL DE ALUNOS                                 [6 meses ▼]    │   │
│  │                                                                     │   │
│  │     48 ┤                                        •                   │   │
│  │        │                                   •                        │   │
│  │     44 ┤                          •   •                             │   │
│  │        │                     •                                      │   │
│  │     40 ┤         •   •                                              │   │
│  │        │    •                                                       │   │
│  │     36 ┤                                                            │   │
│  │        └────────────────────────────────────────────────            │   │
│  │          Set    Out    Nov    Dez    Jan    Fev                     │   │
│  │                                                                     │   │
│  │  📈 Tendência: +2 alunos/mês                                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  📋 AVALIAÇÕES REALIZADAS                           [6 meses ▼]    │   │
│  │                                                                     │   │
│  │     15 ┤              •                        •                    │   │
│  │        │         •         •              •                         │   │
│  │     12 ┤    •                   •                                   │   │
│  │        │                             •                              │   │
│  │      9 ┤                                                            │   │
│  │        └────────────────────────────────────────────────            │   │
│  │          Set    Out    Nov    Dez    Jan    Fev                     │   │
│  │                                                                     │   │
│  │  📊 Média: 12 avaliações/mês                                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  👥 TODOS OS ALUNOS                                      [Ver todos →]     │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🔍 Buscar aluno...                                                 │   │
│  │                                                                     │   │
│  │  Ordenar por: [Score ▼]                                             │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │ [FOTO] João Ogro    │ 78 pts │ QUASE LÁ 💪 │ +3 pts │ [Ver →]│ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ [FOTO] Maria Silva  │ 72 pts │ CAMINHO 🛤️  │ +2 pts │ [Ver →]│ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ [FOTO] Pedro Santos │ 68 pts │ CAMINHO 🛤️  │ +5 pts │ [Ver →]│ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ [FOTO] Ana Costa    │ 65 pts │ CAMINHO 🛤️  │ -2 pts │ [Ver →]│ │   │
│  │  ├───────────────────────────────────────────────────────────────┤ │   │
│  │  │ [FOTO] Lucas Lima   │ 62 pts │ INÍCIO 🚀   │ +1 pts │ [Ver →]│ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │  Mostrando 5 de 45 alunos                        [Ver todos →]     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  [ 🗑️ DESATIVAR PERSONAL ]                                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. SEÇÕES DETALHADAS

### 4.1 Header do Personal

```typescript
interface HeaderPersonal {
  // Dados básicos
  id: string
  nome: string
  fotoUrl?: string
  email: string
  telefone: string
  cref: string
  status: 'ATIVO' | 'INATIVO'
  dataVinculo: Date
  diasNaAcademia: number
  
  // Ranking
  ranking: {
    posicao: number          // 1
    totalPersonais: number   // 12
    percentil: number        // 8 (Top 8%)
    medalha: '🥇' | '🥈' | '🥉' | null
  }
}
```

**Medalhas do Ranking:**
| Posição | Medalha |
|---------|---------|
| 1º | 🥇 |
| 2º | 🥈 |
| 3º | 🥉 |
| 4º+ | - |

### 4.2 KPIs de Desempenho

```typescript
interface KPIsPersonal {
  // Alunos
  alunos: {
    total: number
    ativos: number
    inativos: number
    novosEsteMes: number
  }
  
  // Score
  score: {
    medio: number
    evolucaoMensal: number     // +/- pts por mês
    tendencia: 'SUBINDO' | 'ESTAVEL' | 'CAINDO'
  }
  
  // Avaliações
  avaliacoes: {
    esteMes: number
    mesPassado: number
    total: number
    variacaoPercentual: number  // % de variação mês a mês
  }
  
  // Classificações
  classificacoes: {
    elite: number
    meta: number
    quaseLa: number
    caminho: number
    inicio: number
  }
}
```

**Cards de KPIs:**
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 👥 ALUNOS   │ │ 📊 SCORE    │ │ 📈 EVOLUÇÃO │ │ 📋 AVALIAÇÕES│
│             │ │    MÉDIO    │ │    MÉDIA    │ │   ESTE MÊS  │
│     45      │ │    76       │ │   +8 pts    │ │     12      │
│             │ │   pontos    │ │   /mês      │ │             │
│ 42 ativos   │ │             │ │ ▲ Subindo   │ │ (+20% vs    │
│ 3 inativos  │ │             │ │             │ │  mês ant.)  │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### 4.3 Distribuição por Classificação

```typescript
interface DistribuicaoClassificacao {
  classificacao: 'ELITE' | 'META' | 'QUASE_LA' | 'CAMINHO' | 'INICIO'
  emoji: string
  quantidade: number
  percentual: number
  corBarra: string
}

const CLASSIFICACOES = [
  { classificacao: 'ELITE', emoji: '👑', cor: '#FFD700' },
  { classificacao: 'META', emoji: '🎯', cor: '#10B981' },
  { classificacao: 'QUASE_LA', emoji: '💪', cor: '#3B82F6' },
  { classificacao: 'CAMINHO', emoji: '🛤️', cor: '#8B5CF6' },
  { classificacao: 'INICIO', emoji: '🚀', cor: '#6B7280' },
]
```

**Gráfico de barras horizontais:**
```
ELITE 👑     ███████                           3 (7%)
META 🎯      ██████████████████               8 (18%)
QUASE LÁ 💪  ██████████████████████████████  15 (33%)
CAMINHO 🛤️   ████████████████████████        12 (27%)
INÍCIO 🚀    ███████████████                  7 (15%)
```

### 4.4 Top Alunos

```typescript
interface TopAluno {
  posicao: number
  medalha?: '🥇' | '🥈' | '🥉'
  
  aluno: {
    id: string
    nome: string
    fotoUrl?: string
    score: number
    classificacao: string
    emoji: string
  }
  
  onVerDetalhes: () => void
}
```

### 4.5 Alunos que Precisam de Atenção

```typescript
interface AlunoAtencao {
  id: string
  nome: string
  fotoUrl?: string
  
  motivo: 'SEM_AVALIACAO' | 'SCORE_CAINDO' | 'INATIVO'
  icone: '⚠️' | '📉' | '🔴'
  descricao: string
  
  // Dados específicos
  diasSemAvaliacao?: number
  quedaScore?: number
  diasInativo?: number
  
  onVerDetalhes: () => void
}

const MOTIVOS_ATENCAO = {
  SEM_AVALIACAO: {
    icone: '⚠️',
    regra: 'Mais de 30 dias sem avaliação',
    template: (dias: number) => `${dias} dias sem avaliação`
  },
  SCORE_CAINDO: {
    icone: '📉',
    regra: 'Score caiu nas últimas 2 avaliações',
    template: (pts: number) => `Score caindo (${pts} pts)`
  },
  INATIVO: {
    icone: '🔴',
    regra: 'Status inativo há mais de 30 dias',
    template: (dias: number) => `Inativo há ${dias} dias`
  }
}
```

### 4.6 Gráficos de Evolução

```typescript
interface GraficoEvolucao {
  tipo: 'SCORE_MEDIO' | 'TOTAL_ALUNOS' | 'AVALIACOES'
  titulo: string
  icone: string
  
  dados: {
    periodo: string      // "Set", "Out", etc
    valor: number
  }[]
  
  tendencia: {
    valor: number        // +1.5
    unidade: string      // "pts/mês" ou "alunos/mês"
    direcao: 'UP' | 'DOWN' | 'STABLE'
  }
  
  periodoSelecionado: '3_MESES' | '6_MESES' | '12_MESES'
}
```

### 4.7 Lista de Todos os Alunos

```typescript
interface ListaAlunosPersonal {
  alunos: {
    id: string
    nome: string
    fotoUrl?: string
    score: number
    classificacao: string
    emoji: string
    evolucaoUltimoMes: number
    status: 'ATIVO' | 'INATIVO'
  }[]
  
  // Ordenação
  ordenarPor: 'score_desc' | 'score_asc' | 'nome_asc' | 'evolucao_desc'
  
  // Busca
  termoBusca: string
  
  // Paginação (mostra 5 por padrão, "Ver todos" expande)
  mostrandoTodos: boolean
  totalAlunos: number
}
```

---

## 5. MODAL: EDITAR PERSONAL

Quando a Academia clica em [EDITAR]:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                         [X] │
│                                                                             │
│  ✏️ EDITAR PERSONAL                                                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  📷 Foto                                                            │   │
│  │  ┌────────────┐                                                     │   │
│  │  │            │  [ ALTERAR FOTO ]                                   │   │
│  │  │    FOTO    │                                                     │   │
│  │  │            │                                                     │   │
│  │  └────────────┘                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Nome completo                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Pedro Coach                                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Email                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ pedro.coach@email.com                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Telefone                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ (11) 99999-9999                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  CREF                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 123456-G/SP                                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Status                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [●] Ativo    [ ] Inativo                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                    [ CANCELAR ]        [ 💾 SALVAR ]                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. MODAL: DESATIVAR PERSONAL

Quando a Academia clica em [DESATIVAR PERSONAL]:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                         [X] │
│                                                                             │
│  ⚠️ DESATIVAR PERSONAL                                                      │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Tem certeza que deseja desativar o personal PEDRO COACH?                   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  ⚠️ ATENÇÃO:                                                                │
│                                                                             │
│  • O personal não poderá mais acessar o sistema                             │
│  • Os 45 alunos vinculados ficarão sem personal                            │
│  • O histórico de avaliações será mantido                                   │
│  • Esta ação pode ser revertida posteriormente                              │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  O que fazer com os alunos?                                                 │
│                                                                             │
│  [●] Manter sem personal (podem ser reatribuídos depois)                    │
│  [ ] Transferir para outro personal:                                        │
│      ┌───────────────────────────────────────────────────────────────┐     │
│      │ Selecione o personal ▼                                        │     │
│      └───────────────────────────────────────────────────────────────┘     │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                    [ CANCELAR ]        [ 🗑️ DESATIVAR ]                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. NAVEGAÇÃO E FLUXOS

### 7.1 Fluxo de Navegação

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                         FLUXO DE NAVEGAÇÃO                                  │
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │                 │                                                        │
│  │  MENU ACADEMIA  │                                                        │
│  │                 │                                                        │
│  │  • Dashboard    │                                                        │
│  │  • Personais ◀──┼──────────────────────────────────────────┐            │
│  │  • Alunos       │                                          │            │
│  │  • Evolução     │                                          │            │
│  │                 │                                          │            │
│  └─────────────────┘                                          │            │
│                                                               │            │
│                                                               ▼            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                    LISTA DE PERSONAIS                               │   │
│  │                                                                     │   │
│  │  [Ver Detalhes] ─────────────────────────────────────────┐          │   │
│  │  [Editar] ──────────────────────────────────────┐        │          │   │
│  │                                                 │        │          │   │
│  └─────────────────────────────────────────────────┼────────┼──────────┘   │
│                                                    │        │              │
│                           ┌────────────────────────┘        │              │
│                           │                                 │              │
│                           ▼                                 ▼              │
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │
│  │  MODAL: EDITAR PERSONAL     │    │   DETALHE DO PERSONAL           │   │
│  │                             │    │                                 │   │
│  │  [Salvar] [Cancelar]        │    │   [← Voltar] ──────────────────┐│   │
│  └─────────────────────────────┘    │                                ││   │
│                                     │   • Header + Ranking           ││   │
│                                     │   • KPIs                       ││   │
│                                     │   • Distribuição               ││   │
│                                     │   • Top Alunos ──────────┐     ││   │
│                                     │   • Alunos Atenção ──────┼─┐   ││   │
│                                     │   • Evolução (gráficos)  │ │   ││   │
│                                     │   • Lista Alunos ────────┼─┼─┐ ││   │
│                                     │   • [Editar] ────────────┼─┼─┼─┼┤   │
│                                     │   • [Desativar] ─────────┼─┼─┼─┼┼─┐ │
│                                     │                          │ │ │ ││ │ │
│                                     └──────────────────────────┼─┼─┼─┼┼─┼─┘
│                                                                │ │ │ ││ │  │
│                                                                │ │ │ ││ │  │
│                               ┌─────────────────────────────────┘ │ │ ││ │  │
│                               │  ┌────────────────────────────────┘ │ ││ │  │
│                               │  │  ┌───────────────────────────────┘ ││ │  │
│                               │  │  │                                 ││ │  │
│                               ▼  ▼  ▼                                 ││ │  │
│                                                                       ││ │  │
│  ┌─────────────────────────────────────────────────────────────────┐ ││ │  │
│  │                  TELA: DETALHE DO ALUNO                         │ ││ │  │
│  │                  (SPEC_TELA_ALUNOS_ACADEMIA.md)                  │◀┘│ │  │
│  └─────────────────────────────────────────────────────────────────┘  │ │  │
│                                                                       │ │  │
│                           ┌───────────────────────────────────────────┘ │  │
│                           │                                             │  │
│                           ▼                                             │  │
│                                                                         │  │
│  ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │                  MODAL: EDITAR PERSONAL                         │   │  │
│  └─────────────────────────────────────────────────────────────────┘   │  │
│                                                                         │  │
│                           ┌─────────────────────────────────────────────┘  │
│                           │                                                │
│                           ▼                                                │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐      │
│  │                  MODAL: DESATIVAR PERSONAL                      │      │
│  └─────────────────────────────────────────────────────────────────┘      │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Ações Disponíveis

| Local | Ação | Resultado |
|-------|------|-----------|
| Lista | Ver Detalhes | Abre tela de detalhe |
| Lista | Editar | Abre modal de edição |
| Lista | Adicionar Personal | Abre modal de cadastro |
| Detalhe | Voltar | Volta para lista |
| Detalhe | Editar | Abre modal de edição |
| Detalhe | Ver aluno | Abre tela DETALHE DO ALUNO |
| Detalhe | Ver todos alunos | Expande lista / vai para ALUNOS filtrado |
| Detalhe | Desativar | Abre modal de confirmação |
| Modal Editar | Salvar | Salva e fecha modal |
| Modal Editar | Cancelar | Fecha modal |
| Modal Desativar | Desativar | Desativa e volta para lista |
| Modal Desativar | Cancelar | Fecha modal |

---

## 8. API ENDPOINTS

### 8.1 Lista de Personais

```typescript
// GET /api/academia/:academiaId/personais
interface GetPersonaisAcademiaRequest {
  status?: 'ATIVO' | 'INATIVO' | 'TODOS'
  ordenarPor?: 'alunos_desc' | 'score_desc' | 'nome_asc'
  busca?: string
}

interface GetPersonaisAcademiaResponse {
  personais: PersonalResumo[]
  total: number
  totalAtivos: number
  totalInativos: number
}
```

### 8.2 Detalhe do Personal

```typescript
// GET /api/academia/:academiaId/personais/:personalId
interface GetPersonalDetalheResponse {
  personal: PersonalCompleto
  kpis: KPIsPersonal
  ranking: RankingPersonal
  distribuicao: DistribuicaoClassificacao[]
  topAlunos: AlunoResumo[]
  alunosAtencao: AlunoAtencao[]
  evolucao: EvolucaoPersonal
  alunos: AlunoResumo[]
}
```

### 8.3 Atualizar Personal

```typescript
// PUT /api/academia/:academiaId/personais/:personalId
interface UpdatePersonalRequest {
  nome?: string
  email?: string
  telefone?: string
  cref?: string
  fotoUrl?: string
  status?: 'ATIVO' | 'INATIVO'
}

interface UpdatePersonalResponse {
  success: boolean
  personal: PersonalCompleto
}
```

### 8.4 Desativar Personal

```typescript
// POST /api/academia/:academiaId/personais/:personalId/desativar
interface DesativarPersonalRequest {
  acaoAlunos: 'MANTER_SEM_PERSONAL' | 'TRANSFERIR'
  novoPersonalId?: string  // Obrigatório se acaoAlunos = 'TRANSFERIR'
}

interface DesativarPersonalResponse {
  success: boolean
  alunosAfetados: number
  alunosTransferidos?: number
}
```

---

## 9. COMPONENTES REUTILIZÁVEIS

### 9.1 CardKPI

```typescript
interface CardKPIProps {
  icone: string
  titulo: string
  valorPrincipal: number | string
  unidade?: string
  subtitulo?: string
  variacao?: {
    valor: number
    tipo: 'PERCENTUAL' | 'ABSOLUTO'
    direcao: 'UP' | 'DOWN' | 'STABLE'
  }
}
```

### 9.2 BarraDistribuicao

```typescript
interface BarraDistribuicaoProps {
  dados: {
    label: string
    emoji: string
    valor: number
    percentual: number
    cor: string
  }[]
  mostrarPercentual?: boolean
  mostrarValor?: boolean
}
```

### 9.3 CardAlunoRanking

```typescript
interface CardAlunoRankingProps {
  posicao: number
  medalha?: '🥇' | '🥈' | '🥉'
  aluno: {
    nome: string
    fotoUrl?: string
    score: number
    classificacao: string
    emoji: string
  }
  onVerDetalhes: () => void
}
```

### 9.4 CardAlunoAtencao

```typescript
interface CardAlunoAtencaoProps {
  aluno: {
    nome: string
    fotoUrl?: string
  }
  motivo: {
    icone: string
    descricao: string
    tipo: 'WARNING' | 'DANGER'
  }
  onVerDetalhes: () => void
}
```

### 9.5 GraficoLinha

```typescript
interface GraficoLinhaProps {
  titulo: string
  icone: string
  dados: { periodo: string; valor: number }[]
  tendencia: {
    valor: number
    unidade: string
    direcao: 'UP' | 'DOWN' | 'STABLE'
  }
  periodos: ('3_MESES' | '6_MESES' | '12_MESES')[]
  periodoSelecionado: string
  onPeriodoChange: (periodo: string) => void
}
```

---

## 10. REGRAS DE NEGÓCIO

### 10.1 Cálculo do Ranking

```typescript
function calcularRankingPersonal(
  personalId: string,
  academiaId: string
): RankingPersonal {
  // 1. Buscar todos os personais da academia
  const personais = await getPersonaisAcademia(academiaId)
  
  // 2. Calcular score de ranking para cada um
  const rankings = personais.map(p => ({
    personalId: p.id,
    scoreRanking: calcularScoreRanking(p)
  }))
  
  // 3. Ordenar por score
  rankings.sort((a, b) => b.scoreRanking - a.scoreRanking)
  
  // 4. Encontrar posição do personal
  const posicao = rankings.findIndex(r => r.personalId === personalId) + 1
  
  return {
    posicao,
    totalPersonais: personais.length,
    percentil: Math.round((1 - posicao / personais.length) * 100)
  }
}

function calcularScoreRanking(personal: Personal): number {
  // Pesos para o ranking
  const PESO_SCORE_MEDIO = 0.4
  const PESO_EVOLUCAO = 0.3
  const PESO_ALUNOS_ATIVOS = 0.2
  const PESO_AVALIACOES_MES = 0.1
  
  return (
    personal.scoreMedio * PESO_SCORE_MEDIO +
    personal.evolucaoMedia * 10 * PESO_EVOLUCAO +  // Normalizado
    personal.alunosAtivos * PESO_ALUNOS_ATIVOS +
    personal.avaliacoesMes * PESO_AVALIACOES_MES
  )
}
```

### 10.2 Identificação de Alunos com Atenção

```typescript
function identificarAlunosAtencao(alunos: Aluno[]): AlunoAtencao[] {
  const atencao: AlunoAtencao[] = []
  
  for (const aluno of alunos) {
    // Regra 1: Mais de 30 dias sem avaliação
    const diasSemAvaliacao = calcularDiasSemAvaliacao(aluno)
    if (diasSemAvaliacao > 30) {
      atencao.push({
        ...aluno,
        motivo: 'SEM_AVALIACAO',
        icone: '⚠️',
        descricao: `${diasSemAvaliacao} dias sem avaliação`,
        diasSemAvaliacao
      })
      continue
    }
    
    // Regra 2: Score caindo nas últimas 2 avaliações
    const quedaScore = calcularQuedaScore(aluno)
    if (quedaScore < -3) {
      atencao.push({
        ...aluno,
        motivo: 'SCORE_CAINDO',
        icone: '📉',
        descricao: `Score caindo (${quedaScore} pts)`,
        quedaScore
      })
      continue
    }
    
    // Regra 3: Inativo há mais de 30 dias
    if (aluno.status === 'INATIVO') {
      const diasInativo = calcularDiasInativo(aluno)
      if (diasInativo > 30) {
        atencao.push({
          ...aluno,
          motivo: 'INATIVO',
          icone: '🔴',
          descricao: `Inativo há ${diasInativo} dias`,
          diasInativo
        })
      }
    }
  }
  
  return atencao
}
```

---

## 11. RESPONSIVIDADE

### 11.1 Desktop (>1024px)

- KPIs: 4 cards em linha
- Gráficos: 2 colunas
- Lista alunos: tabela expandida

### 11.2 Tablet (768px - 1024px)

- KPIs: 2x2 grid
- Gráficos: 1 coluna
- Lista alunos: cards compactos

### 11.3 Mobile (<768px)

- KPIs: 2x2 grid compacto
- Gráficos: 1 coluna, scroll horizontal
- Lista alunos: cards empilhados

---

## 12. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |

---

**VITRU IA - Tela PERSONAL Academia v1.0**
