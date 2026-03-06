# SPEC: Notificações do Personal

## Documento de Especificação Técnica v1.1

**Versão:** 1.1  
**Data:** Março 2026  
**Projeto:** VITRU IA - Sistema de Notificações para Personal Trainers  
**Princípio:** Informação Relevante no Momento Certo  
**Status:** ✅ Implementado

---

## 1. VISÃO GERAL

### 1.1 Objetivo

Criar um **sistema de notificações inteligente** para o Personal Trainer, que o mantenha **atualizado sobre seus alunos** sem exigir que ele acesse cada perfil individualmente. O Personal deve saber:

1. **O que aconteceu** — Eventos recentes dos alunos
2. **O que precisa de atenção** — Alertas e situações que demandam ação
3. **O que celebrar** — Conquistas e marcos dos alunos

### 1.2 Filosofia

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  "O Personal que SABE não precisa perguntar.                 ║
║   O Personal que ANTECIPA gera valor.                        ║
║   O Personal que CELEBRA fideliza."                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### 1.3 Princípios

| Princípio | Descrição | Exemplo |
|-----------|-----------|---------|
| **Relevância** | Só notificar o que exige atenção ou gera valor | Não notificar "aluno bebeu água" |
| **Timing** | Informação no momento certo | Alerta de inatividade após 7 dias, não 1 dia |
| **Acionável** | Toda notificação leva a uma ação | Link direto para perfil do aluno |
| **Não Intrusiva** | Agrupar quando possível, respeitar horários | Resumo diário às 8h ao invés de 50 push |
| **Celebratória** | Destacar conquistas para incentivar feedback | "Carlos bateu a meta! Parabéns!" |

---

## 2. CATEGORIAS DE NOTIFICAÇÕES

### 2.1 Visão Geral das Categorias

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  📋 NOTIFICAÇÕES DO PERSONAL                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🏋️ TREINO                                              │   │
│  │  Treino completado, treino pulado, streak               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📏 MEDIDAS & AVALIAÇÃO                                  │   │
│  │  Nova medição registrada, marco atingido, regressão     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ⚠️ ALERTAS DE ATENÇÃO                                   │   │
│  │  Inatividade, queda de score, assimetria alta           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🏆 CONQUISTAS & MARCOS                                  │   │
│  │  Meta atingida, top ranking, recorde pessoal            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  👤 PORTAL & ACESSO                                      │   │
│  │  Primeiro acesso, medição pelo portal, inatividade      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📊 RESUMOS PERIÓDICOS                                   │   │
│  │  Resumo diário, resumo semanal, relatório mensal        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. NOTIFICAÇÕES DETALHADAS

### 3.1 🏋️ Categoria: TREINO

| ID | Evento | Mensagem | Prioridade | Gatilho |
|----|--------|----------|------------|---------|
| `TREINO_COMPLETO` | Aluno completou treino | "💪 **{nome}** completou o treino de {grupo} ({duração})" | Normal | Registro de treino com status `completo` |
| `TREINO_PULADO` | Aluno pulou treino | "⏭️ **{nome}** pulou o treino de hoje ({grupo})" | Normal | Registro de treino com status `pulado` |
| `STREAK_ALUNO` | Aluno mantém sequência | "🔥 **{nome}** completou {dias} treinos seguidos!" | Destaque | Contagem de dias consecutivos ≥ 5 |
| `STREAK_QUEBRADA` | Aluno quebrou sequência | "📉 **{nome}** quebrou a sequência de {dias} treinos" | Alerta | Primeiro dia sem treino após streak ≥ 5 |
| `SEM_TREINO_3D` | 3 dias sem treinar | "⚠️ **{nome}** está há 3 dias sem treinar" | Alerta | 3 dias sem registro de treino |
| `SEM_TREINO_7D` | 7 dias sem treinar | "🚨 **{nome}** não treina há 1 semana" | Urgente | 7 dias sem registro de treino |

**Regras de agrupamento:**
- Se mais de 5 alunos completaram treino no mesmo dia → Agrupar em: "💪 **5 alunos** completaram treinos hoje"
- Treinos pulados NUNCA são agrupados (requerem atenção individual)

---

### 3.2 📏 Categoria: MEDIDAS & AVALIAÇÃO

| ID | Evento | Mensagem | Prioridade | Gatilho |
|----|--------|----------|------------|---------|
| `NOVA_MEDICAO_PORTAL` | Aluno registrou medidas pelo portal | "📏 **{nome}** registrou novas medidas pelo Portal" | Normal | Insert na tabela `medidas` com `registrado_por = 'PORTAL'` |
| `SCORE_SUBIU` | Score do aluno aumentou | "📈 **{nome}**: Score subiu de {antigo} para {novo} (+{diff} pts)" | Destaque | Novo score > score anterior |
| `SCORE_CAIU` | Score do aluno diminuiu | "📉 **{nome}**: Score caiu de {antigo} para {novo} ({diff} pts)" | Alerta | Novo score < score anterior |
| `GORDURA_REDUZIDA` | Gordura corporal reduziu | "🔥 **{nome}** reduziu gordura de {antigo}% para {novo}% (-{diff}%)" | Destaque | percentual_gordura diminuiu |
| `GORDURA_AUMENTOU` | Gordura corporal aumentou | "⚠️ **{nome}**: Gordura subiu de {antigo}% para {novo}% (+{diff}%)" | Alerta | percentual_gordura aumentou significativamente (>2%) |
| `SHAPE_V_MELHOROU` | Shape-V (V-Taper) melhorou | "📐 **{nome}**: Shape-V subiu para {ratio} (era {anterior})" | Destaque | Razão ombro/cintura melhorou |
| `ASSIMETRIA_DETECTADA` | Nova assimetria alta detectada | "⚖️ **{nome}**: Assimetria alta em {grupo} ({diff}cm / {pct}%)" | Alerta | Assimetria > 5% detectada na avaliação |
| `ASSIMETRIA_CORRIGIDA` | Assimetria foi corrigida | "✅ **{nome}** corrigiu assimetria em {grupo}!" | Destaque | Assimetria que era > 5% agora é < 3% |
| `SEM_MEDICAO_14D` | 14 dias sem medir | "📏 **{nome}** está há 14 dias sem atualizar medidas" | Alerta | 14 dias sem insert na tabela `medidas` |
| `SEM_MEDICAO_30D` | 30 dias sem medir | "🚨 **{nome}** não mede há 1 mês. Agendar avaliação?" | Urgente | 30 dias sem insert na tabela `medidas` |

---

### 3.3 🏆 Categoria: CONQUISTAS & MARCOS

| ID | Evento | Mensagem | Prioridade | Gatilho |
|----|--------|----------|------------|---------|
| `META_ATINGIDA` | Aluno atingiu sua meta de score | "🏆 **{nome}** atingiu a meta de {meta} pts! Hora de celebrar!" | Destaque | score_geral ≥ score_meta |
| `MUDOU_CLASSIFICACAO` | Aluno subiu de classificação | "⬆️ **{nome}** evoluiu de {antiga} para {nova}!" | Destaque | classificação mudou para cima |
| `TOP_RANKING` | Aluno entrou no top 10 | "👑 **{nome}** entrou no Top 10! Posição #{pos}" | Destaque | Aluno entrou top 10 do ranking |
| `RECORDE_PESSOAL` | Melhor score histórico | "🔥 **{nome}** bateu recorde pessoal: {score} pts!" | Destaque | score > max(scores_anteriores) |
| `MELHOR_MES` | Melhor evolução mensal | "📈 **{nome}** teve a melhor evolução do mês: +{pts} pts" | Destaque | Evolução mensal > maiores anteriores |
| `PESO_META` | Aluno atingiu peso ideal | "⚖️ **{nome}** atingiu peso alvo de {peso}kg!" | Destaque | peso_atual ≈ peso_meta (±1kg) |
| `PROPORCAO_IDEAL` | Proporção atingiu o ideal | "🏛️ **{nome}**: proporção de {grupo} atingiu o Golden Ratio!" | Destaque | Proporção ≥ 95% do ideal |

---

### 3.4 👤 Categoria: PORTAL & ACESSO

| ID | Evento | Mensagem | Prioridade | Gatilho |
|----|--------|----------|------------|---------|
| `PRIMEIRO_ACESSO` | Aluno acessou o portal pela primeira vez | "🎉 **{nome}** acessou o Portal pela primeira vez!" | Destaque | `portal_acessos` mudou de 0 para 1 |
| `ACESSO_PORTAL` | Aluno acessou o portal | "👤 **{nome}** acessou o Portal" | Baixa | `portal_ultimo_acesso` atualizado |
| `PORTAL_INATIVO_7D` | Aluno não acessa portal há 7 dias | "📱 **{nome}** não acessa o Portal há 7 dias" | Normal | 7 dias sem atualização em `portal_ultimo_acesso` |
| `PORTAL_INATIVO_30D` | Aluno não acessa portal há 30 dias | "🚨 **{nome}** não acessa o Portal há 1 mês" | Alerta | 30 dias sem acesso ao portal |
| `DOR_REPORTADA` | Aluno reportou dor/desconforto | "🩹 **{nome}** reportou dor em {local} (intensidade {nivel}/10)" | Urgente | Registro tipo `DOR` na tabela `registros` |

---

### 3.5 📊 Categoria: RESUMOS PERIÓDICOS

| ID | Frequência | Conteúdo | Horário |
|----|-----------|----------|---------|
| `RESUMO_DIARIO` | Diário | "📋 Resumo de hoje: {n} treinos concluídos, {m} pulados, {k} sem treinar" | 21:00 |
| `RESUMO_SEMANAL` | Semanal (Domingo) | Relatório completo: taxa de conclusão, destaques, alertas, rankings | 10:00 (Domingo) |
| `RESUMO_MENSAL` | Mensal (Dia 1) | Evolução de todos os alunos, quem melhorou mais, quem precisa de atenção | 10:00 (Dia 1) |

**Conteúdo do Resumo Semanal:**

```typescript
interface ResumoSemanal {
  // Visão Geral
  totalAlunos: number
  alunosAtivos: number          // Treinaram pelo menos 1x na semana
  alunosInativos: number        // Não treinaram na semana
  
  // Treinos
  totalTreinosConcluidos: number
  totalTreinosPulados: number
  taxaConclusao: number         // % de treinos concluídos vs planejados
  
  // Destaques Positivos
  alunoDestaque: {
    nome: string
    motivo: string              // "Melhor evolução" ou "Streak de 12 dias"
  }
  
  // Alertas
  alunosSemMedicao: {
    nome: string
    diasSemMedir: number
  }[]
  
  alunosSemTreino: {
    nome: string
    diasSemTreinar: number
  }[]
  
  // Evolução
  scoresMudaram: {
    nome: string
    scoreDe: number
    scorePara: number
    diferenca: number
  }[]
}
```

**Conteúdo do Resumo Mensal:**

```typescript
interface ResumoMensal {
  // KPIs do mês
  mes: string                         // "Fevereiro 2026"
  scoresMedio: number                  // Score médio de todos os alunos
  evolucaoMedia: number               // Média de evolução de score
  
  // Top 3 Evolução
  topEvolucao: {
    nome: string
    evolucao: number
  }[]
  
  // Precisam de Atenção
  precisamAtencao: {
    nome: string
    problema: string                  // "Sem medição há 28 dias"
  }[]
  
  // Conquistas do mês
  conquistasDoMes: {
    nome: string
    conquista: string                 // "Atingiu meta de 70 pts"
  }[]
  
  // Métricas do Personal
  totalAvaliacoes: number
  novosAlunos: number
  alunosDesistentes: number
  rankingPersonal: number             // Posição no ranking de personais
}
```

---

## 4. PRIORIDADES E CONFIGURAÇÕES

### 4.1 Níveis de Prioridade

```typescript
type PrioridadeNotificacao = 'urgente' | 'alerta' | 'destaque' | 'normal' | 'baixa'

const PRIORIDADE_CONFIG = {
  urgente: {
    cor: '#EF4444',     // Vermelho
    icone: '🚨',
    som: true,
    badge: true,
    persistente: true,  // Não some automaticamente
  },
  alerta: {
    cor: '#F59E0B',     // Amarelo/Laranja
    icone: '⚠️',
    som: true,
    badge: true,
    persistente: false,
  },
  destaque: {
    cor: '#22C55E',     // Verde
    icone: '🌟',
    som: false,
    badge: true,
    persistente: false,
  },
  normal: {
    cor: '#3B82F6',     // Azul
    icone: 'ℹ️',
    som: false,
    badge: true,
    persistente: false,
  },
  baixa: {
    cor: '#6B7280',     // Cinza
    icone: '📝',
    som: false,
    badge: false,
    persistente: false,
  },
}
```

### 4.2 Configurações do Personal

O Personal pode personalizar quais notificações deseja receber:

```typescript
interface ConfigNotificacoesPersonal {
  // Por categoria
  treino: {
    ativo: boolean            // Receber notificações de treino
    agrupar: boolean          // Agrupar completados (> 5)
    alertarPulados: boolean   // Alertar treinos pulados
    alertarInatividade: boolean
  }
  
  medidas: {
    ativo: boolean
    alertarRegressao: boolean // Score caiu / gordura subiu
    alertarInatividade: boolean
  }
  
  conquistas: {
    ativo: boolean            // Metas, rankings, recordes
  }
  
  portal: {
    ativo: boolean
    alertarInatividade: boolean
    notificarDor: boolean     // SEMPRE ON por padrão
  }
  
  resumos: {
    diario: boolean           // Resumo diário
    semanal: boolean          // Resumo semanal
    mensal: boolean           // Resumo mensal
  }
  
  // Horários
  horarioInicio: string       // "08:00" — não notificar antes
  horarioFim: string          // "21:00" — não notificar depois
  
  // Canal
  canalPrincipal: 'in_app' | 'push' | 'email'
}
```

**Padrão para novos Personais:**
- Todas as categorias: **ativas**
- Dor reportada: **SEMPRE ativo** (não pode desativar por segurança)
- Resumo semanal: **ativo**
- Resumo diário: **inativo** (opt-in)
- Horário: 08:00 - 21:00

---

## 5. INTERFACE DO PERSONAL

### 5.1 Sino de Notificações (Header)

```
┌─────────────────────────────────────────────────────────────────┐
│  🔔 VITRU IA                    [🔔③]  [👤 Personal]           │
│  Dashboard                                                      │
└─────────────────────────────────────────────────────────────────┘
```

- Badge vermelho com contagem de não-lidas
- Ao clicar: abre painel lateral de notificações

### 5.2 Painel de Notificações (Drawer Lateral)

```
┌─────────────────────────────────────────────────────────────┐
│  🔔 NOTIFICAÇÕES                     [Marcar todas lidas]  │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  HOJE                                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🚨 10:32                                           │   │
│  │  🩹 Carlos Mendes reportou dor em OMBRO             │   │
│  │  Intensidade: 7/10                                  │   │
│  │  [Ver detalhes →]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🌟 09:15                                           │   │
│  │  🏆 João Ogro atingiu a meta de 70 pts!             │   │
│  │  Score: 71.2 • Classificação: ATLETA               │   │
│  │  [Ver perfil →]  [Enviar parabéns →]               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ℹ️ 08:45                                           │   │
│  │  💪 5 alunos completaram treinos hoje               │   │
│  │  Ana, Pedro, Felipe, Marcos, Lucia                  │   │
│  │  [Ver detalhes →]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ONTEM                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ⚠️ 14:20                                           │   │
│  │  📉 Rodrigo Ferri: Score caiu de 65 para 62        │   │
│  │  (-3 pts) • Gordura subiu 1.2%                     │   │
│  │  [Ver avaliação →]                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ⚠️ 08:00                                           │   │
│  │  🚨 3 alunos sem treinar há mais de 7 dias         │   │
│  │  Graciela (9d), Felipe (8d), Marcos (7d)           │   │
│  │  [Ver lista →]                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Ver todas →]                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Página de Notificações (Centro Completo)

Acessível via "Ver todas" ou menu lateral. Layout com:

- **Filtros**: Todas | Treino | Medidas | Conquistas | Portal | Alertas
- **Busca por aluno**: Campo de busca pelo nome do aluno
- **Período**: Hoje | Esta semana | Este mês | Tudo
- **Status**: Todas | Não lidas | Lidas
- **Lista paginada**: Com agrupamento por data

```
┌─────────────────────────────────────────────────────────────┐
│  🔔 CENTRO DE NOTIFICAÇÕES                                  │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [Todas] [Treino] [Medidas] [Conquistas] [Portal] [Alertas]│
│                                                             │
│  🔍 Buscar aluno...              [Hoje ▼]  [Não lidas ▼]  │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│    {Lista de notificações agrupadas por data}               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. MODELO DE DADOS

### 6.1 Tabela `notificacoes`

```sql
CREATE TABLE IF NOT EXISTS notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Destinatário
    personal_id UUID NOT NULL REFERENCES personais(id) ON DELETE CASCADE,
    
    -- Origem (aluno que gerou o evento)
    atleta_id UUID REFERENCES atletas(id) ON DELETE CASCADE,
    
    -- Conteúdo
    tipo TEXT NOT NULL,               -- 'TREINO_COMPLETO', 'META_ATINGIDA', etc.
    categoria TEXT NOT NULL,           -- 'treino', 'medidas', 'conquistas', 'portal', 'resumo'
    prioridade TEXT NOT NULL DEFAULT 'normal', -- 'urgente', 'alerta', 'destaque', 'normal', 'baixa'
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    dados JSONB,                      -- Dados extras estruturados (score, diff, etc.)
    
    -- Estado
    lida BOOLEAN DEFAULT FALSE,
    lida_em TIMESTAMPTZ,
    
    -- Ação
    acao_url TEXT,                     -- URL para navegar (ex: /aluno/{id}/avaliacao)
    acao_label TEXT,                   -- "Ver perfil", "Ver avaliação", etc.
    
    -- Agrupamento (para notificações resumidas)
    grupo_id TEXT,                    -- Para agrupar notificações similares
    agrupada BOOLEAN DEFAULT FALSE,   -- Se faz parte de um grupo
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ            -- Expiração automática (90 dias)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notificacoes_personal ON notificacoes(personal_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_atleta ON notificacoes(atleta_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON notificacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_notificacoes_lida ON notificacoes(personal_id, lida);
CREATE INDEX IF NOT EXISTS idx_notificacoes_created ON notificacoes(personal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notificacoes_prioridade ON notificacoes(personal_id, prioridade);
```

### 6.2 Tabela `notificacao_config`

```sql
CREATE TABLE IF NOT EXISTS notificacao_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_id UUID NOT NULL REFERENCES personais(id) ON DELETE CASCADE UNIQUE,
    
    -- Configurações por categoria (JSONB)
    config JSONB NOT NULL DEFAULT '{
      "treino": { "ativo": true, "agrupar": true, "alertarPulados": true, "alertarInatividade": true },
      "medidas": { "ativo": true, "alertarRegressao": true, "alertarInatividade": true },
      "conquistas": { "ativo": true },
      "portal": { "ativo": true, "alertarInatividade": true, "notificarDor": true },
      "resumos": { "diario": false, "semanal": true, "mensal": true },
      "horarioInicio": "08:00",
      "horarioFim": "21:00",
      "canalPrincipal": "in_app"
    }',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.3 RLS (Row Level Security)

```sql
-- Personal vê apenas suas notificações
CREATE POLICY "notificacao_personal" ON notificacoes FOR ALL
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

-- Config: apenas do próprio personal
CREATE POLICY "notificacao_config_personal" ON notificacao_config FOR ALL
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );
```

---

## 7. GATILHOS DE DISPARO

### 7.1 Gatilhos por Evento de Banco

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  EVENTO NO BANCO           →     NOTIFICAÇÃO GERADA        │
│                                                             │
│  INSERT registros                                           │
│    tipo='TREINO'           →     TREINO_COMPLETO            │
│    status='pulado'         →     TREINO_PULADO              │
│    tipo='DOR'              →     DOR_REPORTADA              │
│                                                             │
│  INSERT medidas            →     NOVA_MEDICAO_PORTAL        │
│    (registrado_por='PORTAL')                                │
│                                                             │
│  INSERT avaliacoes         →     SCORE_SUBIU / SCORE_CAIU   │
│    (comparar com anterior)       GORDURA / ASSIMETRIA       │
│                                  META_ATINGIDA              │
│                                  MUDOU_CLASSIFICACAO        │
│                                  RECORDE_PESSOAL            │
│                                                             │
│  UPDATE atletas                                             │
│    portal_acessos: 0→1    →     PRIMEIRO_ACESSO             │
│    portal_ultimo_acesso   →     ACESSO_PORTAL               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Gatilhos por CRON (Agendados)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  SCHEDULE                  →     NOTIFICAÇÃO GERADA        │
│                                                             │
│  Diário às 08:00                                            │
│    - Verificar inatividade →     SEM_TREINO_3D / 7D        │
│    - Verificar medições    →     SEM_MEDICAO_14D / 30D     │
│    - Verificar portal      →     PORTAL_INATIVO_7D / 30D   │
│    - Gerar resumo diário   →     RESUMO_DIARIO              │
│                                                             │
│  Semanal (Domingo 10:00)                                    │
│    - Compilar semana       →     RESUMO_SEMANAL             │
│    - Calcular streaks      →     STREAK_ALUNO              │
│    - Atualizar rankings    →     TOP_RANKING                │
│                                                             │
│  Mensal (Dia 1, 10:00)                                      │
│    - Compilar mês          →     RESUMO_MENSAL              │
│    - Melhor evolução       →     MELHOR_MES                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. TIPOS TYPESCRIPT

```typescript
// ===== Tipos de Notificação =====

type CategoriaNotificacao = 'treino' | 'medidas' | 'conquistas' | 'portal' | 'resumo'

type TipoNotificacao =
  // Treino
  | 'TREINO_COMPLETO'
  | 'TREINO_PULADO'
  | 'STREAK_ALUNO'
  | 'STREAK_QUEBRADA'
  | 'SEM_TREINO_3D'
  | 'SEM_TREINO_7D'
  // Medidas
  | 'NOVA_MEDICAO_PORTAL'
  | 'SCORE_SUBIU'
  | 'SCORE_CAIU'
  | 'GORDURA_REDUZIDA'
  | 'GORDURA_AUMENTOU'
  | 'SHAPE_V_MELHOROU'
  | 'ASSIMETRIA_DETECTADA'
  | 'ASSIMETRIA_CORRIGIDA'
  | 'SEM_MEDICAO_14D'
  | 'SEM_MEDICAO_30D'
  // Conquistas
  | 'META_ATINGIDA'
  | 'MUDOU_CLASSIFICACAO'
  | 'TOP_RANKING'
  | 'RECORDE_PESSOAL'
  | 'MELHOR_MES'
  | 'PESO_META'
  | 'PROPORCAO_IDEAL'
  // Portal
  | 'PRIMEIRO_ACESSO'
  | 'ACESSO_PORTAL'
  | 'PORTAL_INATIVO_7D'
  | 'PORTAL_INATIVO_30D'
  | 'DOR_REPORTADA'
  // Resumos
  | 'RESUMO_DIARIO'
  | 'RESUMO_SEMANAL'
  | 'RESUMO_MENSAL'

interface Notificacao {
  id: string
  personalId: string
  atletaId?: string
  
  tipo: TipoNotificacao
  categoria: CategoriaNotificacao
  prioridade: PrioridadeNotificacao
  
  titulo: string
  mensagem: string
  dados?: Record<string, unknown>
  
  lida: boolean
  lidaEm?: Date
  
  acaoUrl?: string
  acaoLabel?: string
  
  grupoId?: string
  agrupada: boolean
  
  createdAt: Date
  expiresAt?: Date
  
  // Dados do aluno (para exibição)
  atletaNome?: string
  atletaFoto?: string
}

// ===== Hooks =====

interface UseNotificacoesReturn {
  notificacoes: Notificacao[]
  naoLidas: number
  loading: boolean
  marcarComoLida: (id: string) => Promise<void>
  marcarTodasComoLidas: () => Promise<void>
  filtrar: (filtro: FiltroNotificacao) => void
}

interface FiltroNotificacao {
  categoria?: CategoriaNotificacao
  prioridade?: PrioridadeNotificacao
  periodo?: 'hoje' | 'semana' | 'mes' | 'tudo'
  lida?: boolean
  atletaId?: string
  busca?: string
}
```

---

## 9. REGRAS DE NEGÓCIO

### 9.1 Deduplicação

- Não enviar a mesma notificação mais de 1x por evento
- Usar `grupo_id` para evitar duplicatas de eventos recurrentes
- Exemplo: `SEM_TREINO_7D` não deve ser enviada se já foi enviada para o mesmo aluno na mesma semana

### 9.2 Expiração

- Notificações expiram após **90 dias**
- Notificações lidas podem ser excluídas após **30 dias**
- Limpeza automática via CRON

### 9.3 Limites

- Máximo de **50 notificações por dia** por Personal (para evitar spam)
- Se ultrapassar, agrupar em resumo: "📋 +{n} outras atualizações"
- Dor reportada e alertas urgentes **não contam no limite**

### 9.4 Contexto de Ação

Toda notificação deve levar o Personal ao contexto correto:
- **Treino** → Ficha do aluno (aba treino)
- **Medidas** → Avaliação do aluno (última avaliação)
- **Conquistas** → Perfil do aluno (aba progresso)
- **Portal** → Lista de alunos (com filtro de status)
- **Dor** → Ficha do aluno (destaque em dor)

---

## 10. MÉTRICAS DE SUCESSO

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Taxa de leitura | > 70% | Notificações lidas / total |
| Tempo até leitura | < 4 horas | Média entre criação e leitura |
| Ação após notificação | > 30% | Cliques em "Ver detalhes" / total |
| Engajamento do Personal | > 80% | Personais que acessam painel / total |
| Retenção de alunos | Aumento 15% | Alunos ativos 30+ dias após alertas |

---

*SPEC v1.1 — Notificações do Personal — VITRU IA*

---

## 11. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### 11.1 Arquivos Implementados

| Caminho | Descrição | Tamanho |
|---------|-----------|---------|
| `src/types/notificacao.types.ts` | Tipos, interfaces, constantes (CategoriaNotificacao, TipoNotificacao, Notificacao, ConfigNotificacoesPersonal, etc.) | 4.5K |
| `src/services/notificacao.service.ts` | CRUD Supabase: buscar, contarNaoLidas, marcarComoLida, marcarTodasComoLidas, criar, criarBatch, limparExpiradas, buscarConfig, atualizarConfig | 8.9K |
| `src/services/notificacaoTriggers.ts` | 10 gatilhos: onTreinoCompleto, onTreinoPulado, onNovaMedicaoPortal, onNovaAvaliacao, onPrimeiroAcessoPortal, onDorReportada, onContextoPreenchido, onRegistroRapido, onFeedbackTreino | 15.1K |
| `src/services/resumoNotificacoes.ts` | Serviço de geração de resumos periódicos (diário, semanal, mensal) | 11.7K |
| `src/hooks/useNotificacoes.ts` | Hook React: polling de notificações, contagem de não-lidas, marcar como lida | 5.1K |
| `src/pages/NotificationsPage.tsx` | Página principal de notificações com filtros, paginação e agrupamento por data | 12.5K |
| `src/pages/NotificationSettingsPage.tsx` | Configurações de notificação do personal (toggles por categoria, horários) | 12.4K |
| `src/components/organisms/NotificationDrawer/` | Drawer lateral de notificações (sino no header) | ~4K |
| `supabase/notificacoes-schema.sql` | Schema SQL: tabelas notificacoes + notificacao_config, índices, RLS, triggers | 4K |

### 11.2 Tipos Adicionados vs SPEC Original

Os seguintes tipos foram **adicionados** na implementação real, não presentes na SPEC original:

- `'CONTEXTO_PREENCHIDO'` — Aluno preencheu formulário de contexto do portal
- `'REGISTRO_RAPIDO'` — Aluno registrou água/sono/peso/refeição rápida
- `'FEEDBACK_TREINO'` — Aluno deixou feedback textual sobre treino

### 11.3 O Que Está Funcionando ✅

- [x] Criação de notificações via triggers (treino completo/pulado, medidas, avaliação, portal, dor, registro rápido, feedback treino)
- [x] CRUD completo via Supabase com RLS
- [x] Deduplicação por `grupo_id`
- [x] Expiração automática (90 dias)
- [x] Drawer lateral com sino e badge de contagem
- [x] Página de notificações com filtros (categoria, período, lida/não-lida)
- [x] Página de configurações com toggles por categoria
- [x] Hook `useNotificacoes` com polling
- [x] Batch de notificações (múltiplas de uma avaliação)

### 11.4 Pendências / Diferenças vs SPEC

- [ ] Resumos periódicos (CRON diário/semanal/mensal) — Lógica implementada em `resumoNotificacoes.ts`, mas sem scheduler automático (precisa de Supabase Edge Functions ou CRON externo)
- [ ] Notificações push (apenas in_app atualmente)
- [ ] Agrupamento visual de >5 treinos concluídos no mesmo dia
- [ ] Modal de detalhe de notificação (ao clicar)

