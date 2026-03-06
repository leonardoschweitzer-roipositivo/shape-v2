# SPEC: Home do Atleta v2.0

## Documento de Especificação Técnica

**Versão:** 2.0  
**Data:** Março 2026  
**Projeto:** VITRÚVIO IA - Portal do Atleta  
**Foco:** Engajamento, Gamificação e Retenção

---

## 1. VISÃO GERAL

### 1.1 Objetivo

Transformar a HOME do atleta em uma **máquina de engajamento** que:
- Mostra **onde está** e **onde quer chegar**
- Celebra **progresso** constantemente
- Cria **competição saudável** via rankings
- Dá **direção clara** do que fazer hoje
- Gera **vínculo emocional** com o app

### 1.2 Filosofia de Design

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  "O aluno que VÊ progresso não cancela.                      ║
║   O aluno que TEM meta não desiste.                          ║
║   O aluno que COMPETE se engaja."                            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### 1.3 Princípios da HOME v2

| Princípio | Descrição | Implementação |
|-----------|-----------|---------------|
| **Meta Visível** | Sempre mostrar destino | Score atual → Score meta |
| **Progresso Constante** | Celebrar toda evolução | "+X pts este mês" |
| **Competição Saudável** | Rankings motivacionais | Posição + Top X% |
| **Foco Único** | Uma ação principal | CTA "Ver Treino de Hoje" |
| **Personalização** | Falar com o aluno | "Seu ombro precisa de..." |

---

## 2. ESTRUTURA DA TELA

### 2.1 Hierarquia Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. HEADER (Identidade)                                 │   │
│  │     Nome, dados físicos, logo                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  2. CARD PERSONAL (Vínculo + Status)                    │   │
│  │     Nome do personal + ranking dele                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  3. CARD SCORE + META (O mais importante)               │   │
│  │     Score atual → Meta + Progresso do mês               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  4. CARD RANKING (Competição)                           │   │
│  │     Posição geral + Posição evolução                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  5. CARD FOCO DA SEMANA (Direção)                       │   │
│  │     O que treinar + CTA principal                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  6. AÇÕES RÁPIDAS (Secundárias)                         │   │
│  │     Medir | Coach IA | Evolução                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  7. FOOTER (Última medição)                             │   │
│  │     Data + Status                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Layout Visual Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────┐  CARLOS MENDES                               ┌───┐   │
│  │  👤  │  MASCULINO • 178 CM • 94 KG                  │ V │   │
│  └──────┘                                              └───┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  👤 PERSONAL: LEONARDO SCHWEITZER          ⭐ #3 SP    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ÚLTIMA AVALIAÇÃO                           28/02/2026 │   │
│  │                                                         │   │
│  │        44.8          META EM 6 MESES          70       │   │
│  │         pts    ━━━━━━━━━━━━━━━━━━━━━░░░░░░░   pts      │   │
│  │                                                         │   │
│  │     COMEÇANDO           64% da meta          ATLETA    │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  📈 +3.2 pts este mês    🔥 Melhor mês do ano! │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🏆 HALL DOS DEUSES              Academia Xtreme       │   │
│  │                                                         │   │
│  │  Sua posição geral                                      │   │
│  │  #47 de 312 alunos              ████████░░░░ Top 15%   │   │
│  │                                                         │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                         │   │
│  │  🔥 Ranking de evolução (mês)                          │   │
│  │  #12 de 312 alunos              ██████████░░ Top 4%    │   │
│  │                                                         │   │
│  │                                        [Ver ranking →] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎯 FOCO DESTA SEMANA                                   │   │
│  │                                                         │   │
│  │  Seu OMBRO está 4cm abaixo da proporção ideal.         │   │
│  │  Esta semana o Coach IA preparou 2 treinos             │   │
│  │  focados em deltoides para acelerar sua evolução.      │   │
│  │                                                         │   │
│  │  Próximo treino: OMBRO + TRAPÉZIO                      │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │            💪 VER TREINO DE HOJE                │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │
│  │      📏      │ │      🤖      │ │      📊      │         │
│  │    MEDIR     │ │   COACH IA   │ │   EVOLUÇÃO   │         │
│  └───────────────┘ └───────────────┘ └───────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📅 Última medida: 27/02/2026 • Há 2 dias ✓            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                    ✨ POWERED BY VITRU IA                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTES DETALHADOS

### 3.1 Header (Identidade do Atleta)

```typescript
interface HeaderAtletaProps {
  nome: string
  sexo: 'MASCULINO' | 'FEMININO'
  altura: number        // em cm
  peso: number          // em kg
  fotoUrl?: string
}

// Exemplo
const header: HeaderAtletaProps = {
  nome: 'CARLOS MENDES',
  sexo: 'MASCULINO',
  altura: 178,
  peso: 94,
  fotoUrl: null  // Mostra ícone padrão
}
```

**Regras de exibição:**
- Nome sempre em MAIÚSCULAS
- Dados separados por bullet (•)
- Foto circular ou ícone padrão
- Logo VITRU IA no canto direito

---

### 3.2 Card Personal

```typescript
interface CardPersonalProps {
  nome: string
  rankingCidade?: number      // #3 em SP
  cidadeSigla?: string        // SP
  rankingAcademia?: number    // #1 na academia
  totalPersonaisCidade?: number
  exibirRanking: boolean      // Personal pode ocultar
}

// Exemplo
const cardPersonal: CardPersonalProps = {
  nome: 'LEONARDO SCHWEITZER',
  rankingCidade: 3,
  cidadeSigla: 'SP',
  rankingAcademia: 1,
  totalPersonaisCidade: 847,
  exibirRanking: true
}
```

**Regras de exibição:**

| Situação | Exibição |
|----------|----------|
| Personal top 10 cidade | `⭐ #3 SP` (destaque dourado) |
| Personal top 50 cidade | `#23 SP` (sem estrela) |
| Personal fora do top 50 | Não exibe ranking |
| Personal ocultou ranking | Não exibe ranking |
| Aluno sem personal | `Sem personal vinculado` |

**Por que mostrar ranking do Personal:**
- Aluno sente orgulho: "Meu personal é top 3"
- Personal se esforça para manter posição
- Cria diferencial competitivo

---

### 3.3 Card Score + Meta (Principal)

```typescript
interface CardScoreMetaProps {
  // Score atual
  scoreAtual: number              // 44.8
  classificacaoAtual: string      // "COMEÇANDO"
  dataUltimaAvaliacao: Date
  
  // Meta
  scoreMeta: number               // 70
  classificacaoMeta: string       // "ATLETA"
  prazoMeta: number               // 6 (meses)
  
  // Progresso
  evolucaoMes: number             // +3.2
  evolucaoMesAnterior: number     // +1.8 (para comparar)
  melhorMesHistorico: number      // 4.1
  
  // Calculados
  percentualMeta: number          // 64%
  pontosRestantes: number         // 25.2
}

// Funções auxiliares
function calcularPercentualMeta(atual: number, meta: number): number {
  return Math.round((atual / meta) * 100)
}

function gerarMensagemProgresso(
  evolucaoMes: number, 
  melhorMes: number
): string {
  if (evolucaoMes >= melhorMes) {
    return '🔥 Melhor mês do ano!'
  } else if (evolucaoMes > 0) {
    return '📈 Evoluindo bem!'
  } else if (evolucaoMes === 0) {
    return '⏸️ Mantendo o score'
  } else {
    return '💪 Vamos recuperar!'
  }
}
```

**Layout do Card:**

```
┌─────────────────────────────────────────────────────────────┐
│  ÚLTIMA AVALIAÇÃO                             28/02/2026   │
│                                                             │
│       44.8              META EM 6 MESES             70     │
│        pts         ━━━━━━━━━━━━━━━░░░░░░░░          pts    │
│                                                             │
│    COMEÇANDO            64% da meta              ATLETA    │
│     (laranja)                                    (verde)   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📈 +3.2 pts este mês       🔥 Melhor mês do ano!  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Classificações por Score:**

```typescript
const CLASSIFICACOES = [
  { min: 0,  max: 30,  nome: 'INICIANDO',   cor: '#EF4444', emoji: '🌱' },
  { min: 30, max: 50,  nome: 'COMEÇANDO',   cor: '#F97316', emoji: '🔥' },
  { min: 50, max: 65,  nome: 'EVOLUINDO',   cor: '#EAB308', emoji: '📈' },
  { min: 65, max: 80,  nome: 'ATLETA',      cor: '#22C55E', emoji: '💪' },
  { min: 80, max: 90,  nome: 'AVANÇADO',    cor: '#3B82F6', emoji: '⚡' },
  { min: 90, max: 95,  nome: 'ELITE',       cor: '#8B5CF6', emoji: '👑' },
  { min: 95, max: 100, nome: 'DEUS GREGO',  cor: '#FFD700', emoji: '🏆' },
]
```

**Cores da Barra de Progresso:**
- Parte preenchida: Gradiente da cor atual → cor da meta
- Parte vazia: Cinza escuro (#374151)

---

### 3.4 Card Ranking (Hall dos Deuses)

```typescript
interface CardRankingProps {
  // Contexto
  contexto: 'academia' | 'cidade' | 'estado' | 'brasil'
  nomeContexto: string          // "Academia Xtreme" ou "São Paulo"
  
  // Ranking por score absoluto
  posicaoGeral: number          // #47
  totalParticipantes: number    // 312
  percentilGeral: number        // Top 15%
  
  // Ranking por evolução do mês
  posicaoEvolucao: number       // #12
  percentilEvolucao: number     // Top 4%
  
  // Movimento
  movimentoGeral: number        // +5 (subiu 5 posições)
  movimentoEvolucao: number     // -2 (caiu 2 posições)
  
  // Participação
  atletaParticipa: boolean      // true (optou por aparecer)
}

// Função para calcular percentil
function calcularPercentil(posicao: number, total: number): number {
  return Math.round((posicao / total) * 100)
}

function formatarPercentil(percentil: number): string {
  return `Top ${percentil}%`
}
```

**Layout do Card:**

```
┌─────────────────────────────────────────────────────────────┐
│  🏆 HALL DOS DEUSES                    Academia Xtreme     │
│                                                             │
│  Sua posição geral                                          │
│  #47 de 312 alunos                 ████████░░░░░ Top 15%   │
│                                    ↑ Subiu 5 posições       │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  🔥 Ranking de evolução (mês)                              │
│  #12 de 312 alunos                 ██████████░░░ Top 4%    │
│                                                             │
│                                          [Ver ranking →]   │
└─────────────────────────────────────────────────────────────┘
```

**Estados do Movimento:**

```typescript
function formatarMovimento(movimento: number): { texto: string, cor: string } {
  if (movimento > 0) {
    return { texto: `↑ Subiu ${movimento} posições`, cor: '#22C55E' }  // verde
  } else if (movimento < 0) {
    return { texto: `↓ Caiu ${Math.abs(movimento)} posições`, cor: '#EF4444' }  // vermelho
  } else {
    return { texto: '→ Manteve posição', cor: '#6B7280' }  // cinza
  }
}
```

**Quando mostrar cada ranking:**

| Ranking | Quando Mostrar |
|---------|----------------|
| Por score (geral) | Sempre |
| Por evolução (mês) | Se teve medição no mês |
| Movimento | Se tem histórico de 2+ medições |

**Privacidade:**
- Aluno pode optar por NÃO aparecer no ranking público
- Se não aparece, ainda vê "Sua posição seria #47"
- Padrão: participa (opt-out, não opt-in)

---

### 3.5 Card Foco da Semana

```typescript
interface CardFocoSemanaProps {
  // Ponto fraco identificado
  areaPrioritaria: string           // "OMBRO"
  diferencaCm?: number              // 4 (cm abaixo do ideal)
  diferencaPercentual?: number      // 12% (abaixo do ideal)
  
  // Recomendação
  quantidadeTreinos: number         // 2
  grupamentoFoco: string            // "deltoides"
  
  // Próximo treino
  proximoTreinoNome: string         // "OMBRO + TRAPÉZIO"
  proximoTreinoData?: Date          // opcional
  
  // Estado
  temTreinoHoje: boolean
}

// Geração automática da mensagem (via Coach IA)
function gerarMensagemFoco(props: CardFocoSemanaProps): string {
  const { areaPrioritaria, diferencaCm, quantidadeTreinos, grupamentoFoco } = props
  
  return `Seu ${areaPrioritaria} está ${diferencaCm}cm abaixo da proporção ideal. ` +
         `Esta semana o Coach IA preparou ${quantidadeTreinos} treinos ` +
         `focados em ${grupamentoFoco} para acelerar sua evolução.`
}
```

**Layout do Card:**

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 FOCO DESTA SEMANA                                       │
│                                                             │
│  Seu OMBRO está 4cm abaixo da proporção ideal.             │
│  Esta semana o Coach IA preparou 2 treinos                 │
│  focados em deltoides para acelerar sua evolução.          │
│                                                             │
│  Próximo treino: OMBRO + TRAPÉZIO                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              💪 VER TREINO DE HOJE                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Variações do CTA:**

| Situação | Texto do Botão | Cor |
|----------|----------------|-----|
| Tem treino hoje | `💪 VER TREINO DE HOJE` | Verde |
| Treino concluído | `✅ TREINO CONCLUÍDO` | Verde escuro |
| Dia de descanso | `😴 HOJE É DESCANSO` | Cinza |
| Sem treino definido | `📋 VER MEU PLANO` | Azul |

**Priorização de Áreas (para foco):**

```typescript
interface AnaliseProporções {
  area: string
  proporcaoAtual: number
  proporcaoIdeal: number
  diferenca: number         // em cm ou ratio
  percentualIdeal: number   // % do ideal
  prioridade: number        // 1 = mais urgente
}

// Ordenar por maior déficit
function priorizarAreas(analises: AnaliseProporções[]): AnaliseProporções[] {
  return analises.sort((a, b) => a.percentualIdeal - b.percentualIdeal)
}
```

---

### 3.6 Ações Rápidas

```typescript
interface AcaoRapida {
  id: string
  icone: string
  label: string
  rota: string
  badge?: string            // "NOVO" ou número
  desabilitada?: boolean
}

const ACOES_RAPIDAS: AcaoRapida[] = [
  {
    id: 'medir',
    icone: '📏',
    label: 'MEDIR',
    rota: '/atleta/medidas/nova',
  },
  {
    id: 'coach',
    icone: '🤖',
    label: 'COACH IA',
    rota: '/atleta/coach',
    badge: '2',              // 2 mensagens não lidas
  },
  {
    id: 'evolucao',
    icone: '📊',
    label: 'EVOLUÇÃO',
    rota: '/atleta/evolucao',
  },
]
```

**Layout:**

```
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│      📏      │ │    🤖  ②     │ │      📊      │
│    MEDIR     │ │   COACH IA   │ │   EVOLUÇÃO   │
└───────────────┘ └───────────────┘ └───────────────┘
```

---

### 3.7 Footer (Última Medição)

```typescript
interface FooterMedicaoProps {
  dataUltimaMedida: Date
  diasDesdeUltima: number
  statusMedicao: 'em_dia' | 'atencao' | 'atrasado'
}

function calcularStatusMedicao(diasDesdeUltima: number): string {
  if (diasDesdeUltima <= 7) {
    return 'em_dia'       // ✓ verde
  } else if (diasDesdeUltima <= 14) {
    return 'atencao'      // ⚠️ amarelo
  } else {
    return 'atrasado'     // 🔴 vermelho
  }
}

function formatarDias(dias: number): string {
  if (dias === 0) return 'Hoje'
  if (dias === 1) return 'Ontem'
  if (dias <= 7) return `Há ${dias} dias`
  if (dias <= 30) return `Há ${Math.floor(dias / 7)} semanas`
  return `Há ${Math.floor(dias / 30)} meses`
}
```

**Estados:**

| Estado | Exibição | Cor |
|--------|----------|-----|
| Em dia (≤7 dias) | `📅 Última medida: 27/02/2026 • Há 2 dias ✓` | Verde |
| Atenção (8-14 dias) | `📅 Última medida: 20/02/2026 • Há 9 dias ⚠️` | Amarelo |
| Atrasado (>14 dias) | `📅 Medir novamente! Última: 10/02/2026 🔴` | Vermelho |

---

## 4. ESTADOS DA TELA

### 4.1 Estado: Primeiro Acesso (Sem Medidas)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  👤 CARLOS MENDES                                          │
│  MASCULINO • 178 CM • 94 KG                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  👤 PERSONAL: LEONARDO SCHWEITZER                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  🎯 COMECE SUA JORNADA                              │   │
│  │                                                     │   │
│  │  Registre suas medidas para descobrir              │   │
│  │  seu Score Shape-V e receber seu plano             │   │
│  │  personalizado de evolução.                        │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │         📏 REGISTRAR MINHAS MEDIDAS         │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  ⏱️ Leva apenas 5 minutos                          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Estado: Sem Meta Definida

Se o aluno tem medidas mas não tem meta:

```
┌─────────────────────────────────────────────────────────────┐
│  ÚLTIMA AVALIAÇÃO                             28/02/2026   │
│                                                             │
│              44.8                   META                   │
│               pts              [DEFINIR META]              │
│                                                             │
│           COMEÇANDO                                        │
│                                                             │
│  ⚠️ Defina sua meta para ter um plano personalizado       │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Estado: Meta Atingida 🎉

```
┌─────────────────────────────────────────────────────────────┐
│  ÚLTIMA AVALIAÇÃO                             28/02/2026   │
│                                                             │
│              70.2                  META                    │
│               pts                   70                     │
│                                                             │
│            ATLETA            🎉 META ATINGIDA!             │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🏆 PARABÉNS! Você alcançou sua meta!              │   │
│  │                                                     │   │
│  │  [NOVA META: 80 pts]        [MANTER ATUAL]         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.4 Estado: Regressão no Score

```
┌─────────────────────────────────────────────────────────────┐
│  📈 -1.2 pts este mês                💪 Vamos recuperar!   │
└─────────────────────────────────────────────────────────────┘
```

Mensagens de apoio (não punitivas):
- "💪 Vamos recuperar!"
- "🔄 Faz parte do processo"
- "📈 O próximo mês será melhor"

---

## 5. LÓGICA DE NEGÓCIO

### 5.1 Cálculo da Meta Automática

```typescript
interface MetaSugerida {
  scoreMeta: number
  prazoMeses: number
  classificacaoMeta: string
  evolucaoMediaNecessaria: number  // pts/mês
}

function calcularMetaSugerida(
  scoreAtual: number,
  historicoEvolucao: number[]      // últimos meses
): MetaSugerida {
  
  // Média de evolução histórica (ou estimada)
  const evolucaoMedia = historicoEvolucao.length > 0
    ? historicoEvolucao.reduce((a, b) => a + b) / historicoEvolucao.length
    : 3.0  // Estimativa padrão: 3 pts/mês
  
  // Meta realista: próxima classificação
  const proximaClassificacao = getProximaClassificacao(scoreAtual)
  
  // Prazo baseado na evolução média
  const pontosNecessarios = proximaClassificacao.min - scoreAtual
  const prazoMeses = Math.ceil(pontosNecessarios / evolucaoMedia)
  
  // Limitar prazo entre 3 e 12 meses
  const prazoFinal = Math.max(3, Math.min(12, prazoMeses))
  
  return {
    scoreMeta: proximaClassificacao.min,
    prazoMeses: prazoFinal,
    classificacaoMeta: proximaClassificacao.nome,
    evolucaoMediaNecessaria: pontosNecessarios / prazoFinal
  }
}
```

### 5.2 Cálculo do Ranking

```typescript
interface DadosRanking {
  atletaId: string
  scoreAtual: number
  evolucaoMes: number
  academiaId?: string
  cidadeId: string
  participaRanking: boolean
}

async function calcularPosicaoRanking(
  atletaId: string,
  contexto: 'academia' | 'cidade' | 'estado' | 'brasil',
  tipo: 'score' | 'evolucao'
): Promise<{ posicao: number, total: number, percentil: number }> {
  
  // Buscar todos os atletas do contexto que participam
  const atletas = await buscarAtletasContexto(contexto, { participaRanking: true })
  
  // Ordenar por score ou evolução
  const ordenados = atletas.sort((a, b) => {
    if (tipo === 'score') {
      return b.scoreAtual - a.scoreAtual  // Maior primeiro
    } else {
      return b.evolucaoMes - a.evolucaoMes
    }
  })
  
  // Encontrar posição do atleta
  const posicao = ordenados.findIndex(a => a.atletaId === atletaId) + 1
  const total = ordenados.length
  const percentil = Math.round((posicao / total) * 100)
  
  return { posicao, total, percentil }
}
```

### 5.3 Identificação do Foco da Semana

```typescript
interface AreaFoco {
  nome: string              // "OMBRO"
  medidaAtual: number       // 112 cm
  medidaIdeal: number       // 116 cm
  diferenca: number         // -4 cm
  percentualIdeal: number   // 96.5%
  grupoMuscular: string     // "deltoides"
}

async function identificarFocoSemana(atletaId: string): Promise<AreaFoco> {
  // Buscar última avaliação
  const avaliacao = await buscarUltimaAvaliacao(atletaId)
  
  // Analisar todas as proporções
  const analises: AreaFoco[] = [
    analisarOmbros(avaliacao),
    analisarPeito(avaliacao),
    analisarCostas(avaliacao),
    analisarBracos(avaliacao),
    analisarCintura(avaliacao),
    analisarPernas(avaliacao),
  ]
  
  // Retornar área com maior déficit (menor % do ideal)
  return analises.sort((a, b) => a.percentualIdeal - b.percentualIdeal)[0]
}
```

---

## 6. NOTIFICAÇÕES E GATILHOS

### 6.1 Gatilhos de Engajamento

| Gatilho | Notificação | Quando |
|---------|-------------|--------|
| Score subiu | "🎉 Seu score subiu para 47.2! +2.4 pts" | Após nova medição |
| Subiu no ranking | "🏆 Você subiu para #42! Top 13% da academia" | Após atualização ranking |
| Entrou top 10 | "👑 VOCÊ ESTÁ NO TOP 10! #8 de 312 alunos" | Ranking atualizado |
| Bateu recorde | "🔥 RECORDE! Maior evolução mensal: +5.1 pts" | Fim do mês |
| Meta próxima | "🎯 Faltam apenas 3.2 pts para sua meta!" | Score > 90% da meta |
| Meta atingida | "🏆 PARABÉNS! Você atingiu sua meta de 70 pts!" | Score ≥ meta |

### 6.2 Gatilhos de Reengajamento

| Gatilho | Notificação | Quando |
|---------|-------------|--------|
| 7 dias sem medir | "📏 Que tal atualizar suas medidas?" | 7 dias |
| 14 dias sem medir | "⚠️ Suas medidas estão desatualizadas" | 14 dias |
| Caiu no ranking | "💪 Você caiu para #52. Vamos recuperar?" | Ranking atualizado |
| Score parado | "📈 Seu score está estável. Nova medição?" | 30 dias sem mudança |

---

## 7. INTEGRAÇÕES

### 7.1 Dados Necessários

```typescript
interface DadosHomeAtleta {
  // Perfil
  perfil: {
    id: string
    nome: string
    sexo: 'M' | 'F'
    altura: number
    peso: number
    fotoUrl?: string
  }
  
  // Personal
  personal?: {
    id: string
    nome: string
    rankingCidade?: number
    cidadeSigla?: string
  }
  
  // Score e Meta
  score: {
    atual: number
    classificacao: string
    dataAvaliacao: Date
    meta?: number
    prazoMeta?: number  // meses
    evolucaoMes: number
    melhorMesHistorico: number
  }
  
  // Ranking
  ranking: {
    contexto: string
    posicaoGeral: number
    posicaoEvolucao: number
    total: number
    movimentoGeral: number
  }
  
  // Foco
  foco: {
    area: string
    diferencaCm: number
    proximoTreino: string
    temTreinoHoje: boolean
  }
}
```

### 7.2 Endpoints Necessários

```typescript
// GET /api/atleta/:id/home
// Retorna todos os dados da HOME em uma chamada

// GET /api/atleta/:id/ranking?contexto=academia&tipo=score
// Retorna posição no ranking

// GET /api/atleta/:id/foco-semana
// Retorna área de foco calculada pelo Coach IA

// POST /api/atleta/:id/meta
// Define ou atualiza meta do atleta
```

---

## 8. MÉTRICAS DE SUCESSO

### 8.1 KPIs da HOME

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Taxa de definição de meta** | >80% | Atletas com meta / total |
| **Frequência de medição** | ≤10 dias | Média de dias entre medições |
| **Cliques em "Ver Ranking"** | >30% | Cliques / sessões |
| **Cliques em "Ver Treino"** | >50% | Cliques / sessões |
| **Tempo na HOME** | <30s | Deve ser rápido, não demorado |
| **Retenção 30 dias** | >85% | Atletas ativos após 30 dias |

### 8.2 Testes A/B Sugeridos

| Teste | Variante A | Variante B |
|-------|------------|------------|
| Meta | Mostrar meta | Não mostrar meta |
| Ranking | Mostrar posição | Mostrar só Top X% |
| Foco | Texto detalhado | Apenas "Foco: OMBRO" |
| CTA | "Ver Treino" | "Treinar Agora" |

---

## 9. ACESSIBILIDADE E PERFORMANCE

### 9.1 Acessibilidade

- Contraste mínimo 4.5:1 em todos os textos
- Labels em todos os elementos interativos
- Suporte a VoiceOver / TalkBack
- Tamanho mínimo de toque: 44x44 px

### 9.2 Performance

- Tempo de carregamento: <2 segundos
- Skeleton loading enquanto carrega
- Cache de dados do ranking (atualiza a cada 1h)
- Imagens otimizadas (WebP, lazy loading)

---

## 10. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Home básica |
| 2.0 | Mar/2026 | Redesign completo com foco em engajamento: Meta visível, Ranking, Foco da semana, Progresso mensal |

---

## 11. RESUMO EXECUTIVO

### O que muda da v1 para v2:

| Elemento | v1 (Atual) | v2 (Nova) |
|----------|------------|-----------|
| Score | ✅ Mostra | ✅ Mostra + META |
| Meta | ❌ Não tem | ✅ "44.8 → 70 pts" |
| Progresso | ❌ Não mostra | ✅ "+3.2 pts este mês" |
| Ranking geral | ❌ Não tem | ✅ "#47 de 312" |
| Ranking evolução | ❌ Não tem | ✅ "#12 maior evolução" |
| Ranking Personal | ❌ Só nome | ✅ "⭐ #3 SP" |
| Foco semanal | ❌ Não tem | ✅ "Ombro -4cm" |
| CTA principal | ⚠️ 4 iguais | ✅ 1 destaque |

### Impacto esperado:

- **Retenção:** +15-25% (aluno com meta não cancela)
- **Engajamento:** +40% (ranking gera competição)
- **Frequência de medição:** +30% (quer ver progresso)
- **NPS:** +10 pontos (experiência mais clara)

---

## ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### Componente Principal
- `HomeTab.tsx` em `templates/Portal/` — Tab Home do portal do atleta

### Cards Implementados ✅
- [x] **Header Identidade** (nome, sexo, altura, peso)
- [x] **Card Personal** (nome do personal vinculado)
- [x] **Alerta do Coach** (insight do Vitrúvio)
- [x] **Treino de Hoje** (com ações completar/pular)
- [x] **Dieta de Hoje** (macros resumidos)
- [x] **Feedback sobre o Treino** (registros rápidos)
- [x] **Registro Rápido** (água, sono, peso)
- [x] **Consistência/Streaks** (card de streak)
- [x] **Badges/Gamificação** (badges conquistados)

### Pendências
- [ ] Card Score + Meta (barra de progresso score atual → meta)
- [ ] Card Ranking / Hall dos Deuses
- [ ] Sistema de metas configuráveis pelo atleta
- [ ] Foco da Semana (ponto fraco identificado)
- [ ] Ações Rápidas (grid Medir/Coach/Evolução)

---

**VITRÚVIO IA - Home do Atleta v2.0**  
*Meta • Progresso • Competição • Resultado*
