# SPEC: Card de Consistência e Streak

## Documento de Especificação Técnica

**Versão:** 1.0  
**Data:** Março 2026  
**Projeto:** VITRÚVIO IA - Portal do Atleta  
**Componente:** Card de Consistência (HOME do Atleta)  
**Inspiração:** GitHub Contributions, Duolingo Streak

---

## 1. VISÃO GERAL

### 1.1 Objetivo

Adicionar um **Card de Consistência** na HOME do Portal do Atleta que:
- Mostra a **sequência atual** de dias treinando (streak)
- Exibe o **recorde pessoal** de streak
- Visualiza a **consistência anual** em grade (heatmap)
- Gera **vício positivo** em manter a sequência

### 1.2 Localização na HOME

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Nome, dados)                                       │
├─────────────────────────────────────────────────────────────┤
│  CARD PERSONAL (+ ranking)                                  │
├─────────────────────────────────────────────────────────────┤
│  CARD SCORE + META                                          │
├─────────────────────────────────────────────────────────────┤
│  CARDS DE MEDIDAS (Ombros, Cintura)                         │
├─────────────────────────────────────────────────────────────┤
│  CTA: VER TREINO DE HOJE                                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │            🔥 CARD DE CONSISTÊNCIA 🔥               │   │
│  │                  (ESTE COMPONENTE)                  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  CARD HALL DOS DEUSES (Rankings)                            │
├─────────────────────────────────────────────────────────────┤
│  AÇÕES RÁPIDAS (Medir, Coach IA, Evolução)                  │
├─────────────────────────────────────────────────────────────┤
│  FOOTER (Última medida)                                     │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Por que Este Card é Importante

| Problema | Solução |
|----------|---------|
| Aluno treina sem consistência | Streak visível cria pressão positiva |
| Não sabe se está sendo regular | Grade mostra padrão claramente |
| Falta motivação em dias difíceis | "Não quero perder meu streak de 15 dias" |
| Não percebe progresso no hábito | Números concretos: 135 treinos, 115h |

---

## 2. LAYOUT DO CARD

### 2.1 Versão Completa (Expandida)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │                      🔥                             │   │
│  │                                                     │   │
│  │                   15 dias                           │   │
│  │                Sequência Atual                      │   │
│  │                                                     │   │
│  │              🏆 RECORDE: 24 DIAS                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│             (fundo gradiente laranja/vermelho)             │
│                                                             │
│  Consistência                              📅 Anual ▼      │
│                                                             │
│     Jan    Fev    Mar    Abr    Mai    Jun                 │
│     ██░░   ████   ███░   ░░░░   ░░░░   ░░░░                │
│     ██░█   ████   ████   ░░░░   ░░░░   ░░░░                │
│     ████   ██░█   ██▪▪   ░░░░   ░░░░   ░░░░                │
│     ░███   ████   ▪▪▪▪   ░░░░   ░░░░   ░░░░                │
│                    ↑ Hoje                                   │
│                                                             │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐     │
│  │      🏋️      │ │      📊      │ │      ⏱️      │     │
│  │     135      │ │     64%      │ │   115h40m    │     │
│  │   Treinos    │ │ Consistência │ │ Tempo Total  │     │
│  └───────────────┘ └───────────────┘ └───────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Versão Compacta (Para HOME)

Para não ocupar muito espaço na HOME, usar versão compacta:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🔥 CONSISTÊNCIA                          [Ver mais →]     │
│                                                             │
│  ┌────────────────────┐   Jan Fev Mar                      │
│  │                    │   ██░ ███ ██░                      │
│  │   🔥 15 dias       │   ░██ ███ ███                      │
│  │   Sequência Atual  │   ██░ █░█ ██▪  ← Hoje              │
│  │                    │   ███ ███ ▪▪▪                      │
│  │   🏆 Recorde: 24   │                                    │
│  │                    │   135 treinos • 64%                │
│  └────────────────────┘                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Versão Mínima (Se precisar economizar espaço)

```
┌─────────────────────────────────────────────────────────────┐
│  🔥 15 dias seguidos    ████████████░░░░    🏆 Recorde: 24 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENTES DETALHADOS

### 3.1 Contador de Streak

```typescript
interface StreakContadorProps {
  // Streak atual
  diasAtuais: number              // 15
  
  // Recorde
  recordeDias: number             // 24
  dataRecorde: Date               // Quando atingiu o recorde
  
  // Estado
  streakEmRisco: boolean          // true se não treinou hoje e é dia de treino
  treinouHoje: boolean            // true se já treinou hoje
}

// Cores do fundo baseado no streak
function getCorFundoStreak(dias: number): { from: string, to: string } {
  if (dias >= 30) {
    return { from: '#EF4444', to: '#DC2626' }  // Vermelho intenso
  } else if (dias >= 14) {
    return { from: '#F97316', to: '#EA580C' }  // Laranja
  } else if (dias >= 7) {
    return { from: '#F59E0B', to: '#D97706' }  // Amarelo/laranja
  } else {
    return { from: '#6B7280', to: '#4B5563' }  // Cinza (ainda construindo)
  }
}

// Emoji do fogo baseado no streak
function getEmojiStreak(dias: number): string {
  if (dias >= 60) return '🌋'      // Vulcão (épico)
  if (dias >= 30) return '🔥🔥🔥'  // Triplo fogo
  if (dias >= 14) return '🔥🔥'    // Duplo fogo
  if (dias >= 7) return '🔥'       // Fogo normal
  if (dias >= 3) return '✨'       // Faísca
  return '💪'                       // Começando
}
```

### 3.2 Grade de Consistência (Heatmap)

```typescript
interface GradeConsistenciaProps {
  // Dados
  ano: number                     // 2026
  diasTreinados: Date[]           // Array de datas que treinou
  diasDescanso: Date[]            // Array de dias que eram descanso
  
  // Visualização
  mesesVisiveis: number           // 3 (compacto) ou 6 (expandido) ou 12 (completo)
  mostrarLegenda: boolean
}

interface DiaGrade {
  data: Date
  status: 'treinou' | 'nao_treinou' | 'descanso' | 'futuro' | 'hoje'
  intensidade?: number            // 0-3 para variação de cor
}

// Status de cada dia
enum StatusDia {
  TREINOU = 'treinou',           // ██ Azul escuro
  TREINOU_PARCIAL = 'parcial',   // ▓▓ Azul médio  
  NAO_TREINOU = 'nao_treinou',   // ░░ Cinza (deveria ter treinado)
  DESCANSO = 'descanso',         // ·· Cinza claro (não precisava)
  FUTURO = 'futuro',             // □□ Vazio
  HOJE = 'hoje',                 // ▪▪ Destaque (hoje)
}

// Cores
const CORES_GRADE = {
  treinou: '#3B82F6',            // Azul
  treinou_parcial: '#93C5FD',    // Azul claro
  nao_treinou: '#374151',        // Cinza escuro
  descanso: '#1F2937',           // Quase invisível
  futuro: '#111827',             // Fundo
  hoje: '#22C55E',               // Verde (destaque)
  hoje_pendente: '#F59E0B',      // Amarelo (ainda pode treinar)
}
```

### 3.3 Métricas de Resumo

```typescript
interface MetricasConsistencia {
  // Contadores
  totalTreinos: number            // 135
  totalHoras: number              // 115.67 (em horas decimais)
  totalMinutos: number            // 6940 (alternativa)
  
  // Percentuais
  consistenciaPercentual: number  // 64 (%)
  
  // Calculados
  mediaMinutosPorTreino: number   // 51.4
  mediaTreinosPorSemana: number   // 3.2
}

// Calcular consistência
function calcularConsistencia(
  diasTreinados: number,
  diasProgramados: number
): number {
  if (diasProgramados === 0) return 0
  return Math.round((diasTreinados / diasProgramados) * 100)
}

// Formatar tempo
function formatarTempo(minutos: number): string {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  return `${horas}h${mins.toString().padStart(2, '0')}m`
}
```

---

## 4. ESTADOS DO CARD

### 4.1 Estado: Streak Ativo

```
┌─────────────────────────────────────────────────────────────┐
│                        🔥                                   │
│                     15 dias                                 │
│                  Sequência Atual                            │
│                                                             │
│                 🏆 RECORDE: 24 DIAS                         │
└─────────────────────────────────────────────────────────────┘
        (Fundo gradiente laranja, streak saudável)
```

### 4.2 Estado: Streak em Risco (Não treinou hoje, é dia de treino)

```
┌─────────────────────────────────────────────────────────────┐
│                        ⚠️                                   │
│                     15 dias                                 │
│                  Sequência em Risco!                        │
│                                                             │
│           Treine hoje para manter seu streak!              │
│                                                             │
│          [💪 VER TREINO DE HOJE]                           │
└─────────────────────────────────────────────────────────────┘
        (Fundo gradiente amarelo/vermelho pulsante)
```

### 4.3 Estado: Streak Perdido (Quebrou a sequência)

```
┌─────────────────────────────────────────────────────────────┐
│                        💔                                   │
│                      0 dias                                 │
│                   Sequência Zerada                          │
│                                                             │
│              Seu recorde continua: 24 dias                  │
│               Vamos começar de novo!                        │
│                                                             │
│          [🔥 INICIAR NOVO STREAK]                          │
└─────────────────────────────────────────────────────────────┘
        (Fundo cinza, mensagem motivacional)
```

### 4.4 Estado: Recorde Batido!

```
┌─────────────────────────────────────────────────────────────┐
│                       🎉🏆🎉                                │
│                     25 dias                                 │
│                   NOVO RECORDE!                             │
│                                                             │
│              Você superou os 24 dias!                       │
│              Continue assim! 🔥                             │
└─────────────────────────────────────────────────────────────┘
        (Fundo dourado com confetes animados)
```

### 4.5 Estado: Primeiro Acesso (Sem histórico)

```
┌─────────────────────────────────────────────────────────────┐
│                        💪                                   │
│                                                             │
│              Comece sua sequência!                          │
│                                                             │
│         Complete seu primeiro treino para                   │
│           iniciar seu contador de streak.                   │
│                                                             │
│          [🏋️ COMEÇAR AGORA]                                │
└─────────────────────────────────────────────────────────────┘
        (Fundo neutro, call to action)
```

### 4.6 Estado: Dia de Descanso

```
┌─────────────────────────────────────────────────────────────┐
│                        😴                                   │
│                     15 dias                                 │
│                  Sequência Atual                            │
│                                                             │
│         Hoje é descanso. Streak protegido! ✓               │
│                                                             │
│                 🏆 RECORDE: 24 DIAS                         │
└─────────────────────────────────────────────────────────────┘
        (Fundo normal, mensagem de conforto)
```

---

## 5. LÓGICA DE NEGÓCIO

### 5.1 Cálculo do Streak

```typescript
interface ConfiguracaoStreak {
  // O que conta como "dia treinado"
  contarTreinoParcial: boolean     // true = qualquer treino conta
  minimoMinutos: number            // 0 = qualquer duração
  
  // O que quebra o streak
  diasDescansoContam: boolean      // true = descanso não quebra
  toleranciaHoras: number          // 24 = até meia-noite do dia seguinte
}

const CONFIG_PADRAO: ConfiguracaoStreak = {
  contarTreinoParcial: true,       // Qualquer treino conta
  minimoMinutos: 0,                // Sem mínimo
  diasDescansoContam: true,        // Descanso não quebra streak
  toleranciaHoras: 24,             // Até o fim do dia
}

async function calcularStreak(
  atletaId: string,
  config: ConfiguracaoStreak = CONFIG_PADRAO
): Promise<{ atual: number, recorde: number, emRisco: boolean }> {
  
  // Buscar treinos ordenados por data (mais recente primeiro)
  const treinos = await buscarTreinosAtleta(atletaId, { ordenar: 'desc' })
  const diasDescanso = await buscarDiasDescanso(atletaId)
  
  let streakAtual = 0
  let dataVerificacao = new Date()
  dataVerificacao.setHours(0, 0, 0, 0)
  
  // Verificar se treinou hoje
  const treinouHoje = treinos.some(t => 
    isSameDay(t.data, dataVerificacao)
  )
  
  // Se não treinou hoje, verificar se é dia de descanso
  const hojeEhDescanso = diasDescanso.some(d => 
    isSameDay(d, dataVerificacao)
  )
  
  // Contar streak
  while (true) {
    const treinouNoDia = treinos.some(t => 
      isSameDay(t.data, dataVerificacao)
    )
    const eraDescanso = diasDescanso.some(d => 
      isSameDay(d, dataVerificacao)
    )
    
    if (treinouNoDia) {
      streakAtual++
    } else if (eraDescanso && config.diasDescansoContam) {
      // Descanso não quebra, mas também não incrementa
      // Continue verificando
    } else {
      // Quebrou o streak
      break
    }
    
    // Ir para o dia anterior
    dataVerificacao.setDate(dataVerificacao.getDate() - 1)
  }
  
  // Buscar recorde
  const recorde = await buscarRecordeStreak(atletaId)
  
  // Verificar se streak está em risco
  const emRisco = !treinouHoje && !hojeEhDescanso
  
  return {
    atual: streakAtual,
    recorde: recorde,
    emRisco: emRisco
  }
}
```

### 5.2 Atualização do Recorde

```typescript
async function verificarEAtualizarRecorde(
  atletaId: string,
  streakAtual: number
): Promise<{ novoRecorde: boolean, recordeAnterior: number }> {
  
  const recordeAtual = await buscarRecordeStreak(atletaId)
  
  if (streakAtual > recordeAtual) {
    await atualizarRecordeStreak(atletaId, {
      dias: streakAtual,
      dataAtingido: new Date()
    })
    
    // Disparar notificação de novo recorde
    await enviarNotificacao(atletaId, {
      tipo: 'NOVO_RECORDE_STREAK',
      dados: { dias: streakAtual, anterior: recordeAtual }
    })
    
    return { novoRecorde: true, recordeAnterior: recordeAtual }
  }
  
  return { novoRecorde: false, recordeAnterior: recordeAtual }
}
```

### 5.3 Geração da Grade

```typescript
async function gerarGradeConsistencia(
  atletaId: string,
  ano: number,
  meses?: number[]  // Opcional: filtrar meses específicos
): Promise<DiaGrade[][]> {
  
  const treinos = await buscarTreinosAno(atletaId, ano)
  const descansos = await buscarDescansosAno(atletaId, ano)
  
  const grade: DiaGrade[][] = []
  const hoje = new Date()
  
  // Para cada mês
  for (let mes = 0; mes < 12; mes++) {
    if (meses && !meses.includes(mes)) continue
    
    const diasDoMes: DiaGrade[] = []
    const diasNoMes = new Date(ano, mes + 1, 0).getDate()
    
    for (let dia = 1; dia <= diasNoMes; dia++) {
      const data = new Date(ano, mes, dia)
      
      let status: StatusDia
      
      if (data > hoje) {
        status = StatusDia.FUTURO
      } else if (isSameDay(data, hoje)) {
        const treinouHoje = treinos.some(t => isSameDay(t.data, data))
        status = treinouHoje ? StatusDia.TREINOU : StatusDia.HOJE
      } else {
        const treinou = treinos.some(t => isSameDay(t.data, data))
        const eraDescanso = descansos.some(d => isSameDay(d, data))
        
        if (treinou) {
          status = StatusDia.TREINOU
        } else if (eraDescanso) {
          status = StatusDia.DESCANSO
        } else {
          status = StatusDia.NAO_TREINOU
        }
      }
      
      diasDoMes.push({ data, status })
    }
    
    grade.push(diasDoMes)
  }
  
  return grade
}
```

---

## 6. CONQUISTAS DE STREAK

### 6.1 Badges de Streak

```typescript
interface BadgeStreak {
  id: string
  nome: string
  descricao: string
  emoji: string
  diasNecessarios: number
  cor: string
  desbloqueado: boolean
  dataDesbloqueio?: Date
}

const BADGES_STREAK: Omit<BadgeStreak, 'desbloqueado' | 'dataDesbloqueio'>[] = [
  {
    id: 'streak_3',
    nome: 'Primeiros Passos',
    descricao: '3 dias seguidos de treino',
    emoji: '🌱',
    diasNecessarios: 3,
    cor: '#22C55E',
  },
  {
    id: 'streak_7',
    nome: 'Uma Semana',
    descricao: '7 dias seguidos de treino',
    emoji: '🔥',
    diasNecessarios: 7,
    cor: '#F59E0B',
  },
  {
    id: 'streak_14',
    nome: 'Duas Semanas',
    descricao: '14 dias seguidos de treino',
    emoji: '🔥🔥',
    diasNecessarios: 14,
    cor: '#F97316',
  },
  {
    id: 'streak_30',
    nome: 'Um Mês',
    descricao: '30 dias seguidos de treino',
    emoji: '💪',
    diasNecessarios: 30,
    cor: '#EF4444',
  },
  {
    id: 'streak_60',
    nome: 'Dois Meses',
    descricao: '60 dias seguidos de treino',
    emoji: '⚡',
    diasNecessarios: 60,
    cor: '#8B5CF6',
  },
  {
    id: 'streak_90',
    nome: 'Trimestre',
    descricao: '90 dias seguidos de treino',
    emoji: '🏆',
    diasNecessarios: 90,
    cor: '#3B82F6',
  },
  {
    id: 'streak_180',
    nome: 'Semestre',
    descricao: '180 dias seguidos de treino',
    emoji: '👑',
    diasNecessarios: 180,
    cor: '#FFD700',
  },
  {
    id: 'streak_365',
    nome: 'Lendário',
    descricao: '1 ano inteiro de treino!',
    emoji: '🏅',
    diasNecessarios: 365,
    cor: '#FFD700',
  },
]
```

### 6.2 Exibição no Card

Quando próximo de uma conquista:

```
┌─────────────────────────────────────────────────────────────┐
│                        🔥🔥                                 │
│                     12 dias                                 │
│                  Sequência Atual                            │
│                                                             │
│         ⏳ Faltam 2 dias para: 🔥🔥 Duas Semanas           │
│                                                             │
│                 🏆 RECORDE: 24 DIAS                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. NOTIFICAÇÕES

### 7.1 Gatilhos de Notificação

| Gatilho | Notificação | Horário |
|---------|-------------|---------|
| Streak em risco | "⚠️ Seu streak de 15 dias está em risco! Treine hoje." | 18:00 |
| Último aviso | "🔥 ÚLTIMA CHANCE! Faltam 2h para manter o streak." | 22:00 |
| Streak perdido | "💔 Streak zerado. Mas seu recorde de 24 dias continua!" | Manhã seguinte |
| Streak salvo | "✅ Streak salvo! Agora são 16 dias seguidos!" | Após treino |
| Novo recorde | "🎉 NOVO RECORDE! 25 dias de streak!" | Após treino |
| Conquista | "🏆 Nova conquista: 'Um Mês' - 30 dias seguidos!" | Após treino |
| Próximo de conquista | "⏳ Faltam 2 dias para 'Duas Semanas'!" | Manhã |

### 7.2 Exemplos de Notificação

```typescript
const NOTIFICACOES_STREAK = {
  em_risco: {
    titulo: '⚠️ Streak em risco!',
    mensagem: 'Seu streak de {dias} dias acaba hoje. Treine para manter!',
    acao: 'VER TREINO',
    prioridade: 'alta',
  },
  ultimo_aviso: {
    titulo: '🔥 ÚLTIMA CHANCE!',
    mensagem: 'Faltam 2 horas! Não perca seu streak de {dias} dias.',
    acao: 'TREINAR AGORA',
    prioridade: 'urgente',
  },
  streak_salvo: {
    titulo: '✅ Streak salvo!',
    mensagem: 'Boa! Agora são {dias} dias seguidos. Continue assim!',
    prioridade: 'normal',
  },
  novo_recorde: {
    titulo: '🎉 NOVO RECORDE!',
    mensagem: '{dias} dias de streak! Você superou seu recorde anterior.',
    prioridade: 'celebracao',
  },
  conquista: {
    titulo: '🏆 Nova conquista!',
    mensagem: 'Você desbloqueou: "{nome_conquista}"',
    prioridade: 'celebracao',
  },
}
```

---

## 8. RANKING DE CONSISTÊNCIA

### 8.1 Novo Ranking no Hall dos Deuses

Adicionar ao Hall dos Deuses:

```
┌─────────────────────────────────────────────────────────────┐
│  🔥 RANKING DE CONSISTÊNCIA                    Academia    │
│                                                             │
│  Maior streak ativo:                                        │
│  #1  Ana Silva       47 dias 🔥🔥🔥                         │
│  #2  João Santos     38 dias 🔥🔥                           │
│  #3  Maria Costa     35 dias 🔥🔥                           │
│  ...                                                        │
│  #23 Você           15 dias 🔥      ↑ Subindo!             │
│                                                             │
│                                        [Ver ranking →]     │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Interface do Ranking

```typescript
interface RankingConsistencia {
  tipo: 'streak_ativo' | 'recorde_historico' | 'consistencia_mensal'
  contexto: 'academia' | 'cidade' | 'geral'
  
  posicoes: {
    posicao: number
    atletaId: string
    atletaNome: string
    valor: number           // dias ou percentual
    emoji: string
    ehUsuarioAtual: boolean
  }[]
  
  posicaoUsuario: number
  totalParticipantes: number
}
```

---

## 9. INTEGRAÇÃO COM COACH IA

### 9.1 Mensagens Contextuais do Coach

```typescript
const MENSAGENS_COACH_STREAK = {
  streak_pequeno: [
    "Você está no dia {dias} do seu streak! Cada dia conta.",
    "Continue assim! Consistência é mais importante que intensidade.",
  ],
  streak_crescendo: [
    "Impressionante! {dias} dias seguidos mostra comprometimento real.",
    "Seu streak de {dias} dias está fazendo diferença nos resultados.",
  ],
  streak_longo: [
    "Você é uma máquina! {dias} dias é elite.",
    "Menos de 5% dos atletas mantêm um streak como o seu.",
  ],
  proximo_recorde: [
    "Faltam só {faltam} dias para bater seu recorde!",
    "Você está a {faltam} dias de fazer história!",
  ],
  recuperando: [
    "Dia {dias} do novo streak. Você está voltando com tudo!",
    "Recomeçar também é força. Vamos reconquistar o recorde!",
  ],
}
```

---

## 10. ESPECIFICAÇÕES TÉCNICAS

### 10.1 Interface Completa do Componente

```typescript
interface CardConsistenciaProps {
  // Streak
  streak: {
    atual: number
    recorde: number
    emRisco: boolean
    treinouHoje: boolean
    hojeEhDescanso: boolean
  }
  
  // Grade
  grade: {
    ano: number
    meses: DiaGrade[][]
    mesesVisiveis: 3 | 6 | 12
  }
  
  // Métricas
  metricas: {
    totalTreinos: number
    consistenciaPercentual: number
    tempoTotal: number        // em minutos
  }
  
  // Próxima conquista
  proximaConquista?: {
    nome: string
    emoji: string
    diasFaltando: number
  }
  
  // Callbacks
  onVerMais: () => void
  onVerTreino: () => void
}
```

### 10.2 Endpoint da API

```typescript
// GET /api/atleta/:id/consistencia
interface ResponseConsistencia {
  streak: {
    atual: number
    recorde: number
    emRisco: boolean
    treinouHoje: boolean
    hojeEhDescanso: boolean
  }
  
  grade: {
    [mes: string]: {
      dia: number
      status: StatusDia
    }[]
  }
  
  metricas: {
    totalTreinos: number
    consistenciaPercentual: number
    tempoTotalMinutos: number
  }
  
  conquistas: {
    desbloqueadas: BadgeStreak[]
    proxima: BadgeStreak | null
    diasParaProxima: number | null
  }
  
  ranking: {
    posicao: number
    total: number
  }
}
```

---

## 11. MÉTRICAS DE SUCESSO

### 11.1 KPIs do Card

| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Streak médio** | >7 dias | Média de streak dos atletas ativos |
| **Taxa de recuperação** | >60% | Atletas que reiniciam após perder streak |
| **Visualização do card** | >80% | Atletas que scrollam até o card |
| **Clique em "Ver mais"** | >20% | Interesse em detalhes |
| **Retenção com streak >14** | >90% | Atletas com streak longo vs churn |

### 11.2 Correlação Esperada

```
Streak > 7 dias   →  Retenção +15%
Streak > 14 dias  →  Retenção +25%
Streak > 30 dias  →  Retenção +40%
```

---

## 12. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Mar/2026 | Versão inicial - Card de Consistência para HOME do Atleta |

---

## 13. RESUMO

### O que o Card de Consistência adiciona à HOME:

| Elemento | Efeito |
|----------|--------|
| **Streak visível** | "Não posso perder meus 15 dias" |
| **Recorde** | "Quero bater os 24 dias" |
| **Grade visual** | Cada quadrado vazio dói |
| **Métricas** | "135 treinos, 115h investidas" |
| **Conquistas** | Gamificação, badges colecionáveis |
| **Ranking** | Competição de consistência |

### Impacto Esperado:

- **Frequência de treino:** +25%
- **Retenção:** +20%
- **Engajamento diário:** +35%
- **Vínculo emocional:** Muito maior (custo afundado)

---

**VITRÚVIO IA - Card de Consistência**  
*Cada dia conta. Cada treino importa.*
