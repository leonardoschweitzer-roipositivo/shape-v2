# SPEC: Portal Mobile do Personal

## Documento de Especificação Técnica

**Versão:** 1.0  
**Data:** Março 2026  
**Projeto:** VITRÚVIO IA - Portal Mobile do Personal  
**Tecnologia:** Capacitor (PWA empacotado) ou React Native  
**Plataformas:** iOS (App Store) e Android (Play Store)

---

## 1. VISÃO GERAL

### 1.1 Objetivo

Criar um **app mobile focado no Personal Trainer** para uso no dia-a-dia, permitindo:

- Acompanhar alunos rapidamente entre treinos
- Receber notificações importantes em tempo real
- Tomar ações rápidas sem precisar de computador
- Ter informações essenciais "no bolso"

### 1.2 Filosofia: Mobile First = Menos é Mais

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   "O Personal está NA ACADEMIA, entre um aluno e outro.        │
│    Ele tem 30 segundos para checar algo no celular.            │
│    O app precisa responder 3 perguntas instantaneamente:"      │
│                                                                 │
│    1. Quem precisa de atenção AGORA?                           │
│    2. O que aconteceu desde a última vez que olhei?            │
│    3. Qual ação rápida posso tomar?                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 O que NÃO vai para o Mobile

| Funcionalidade | Motivo | Onde Fica |
|----------------|--------|-----------|
| Cadastro completo de aluno | Muitos campos, precisa de teclado | Portal Web |
| Montar plano de treino completo | Complexo, precisa de tela grande | Portal Web |
| Montar plano de dieta completo | Complexo, precisa de tela grande | Portal Web |
| Avaliação IA completa | Input de muitas medidas | Portal Web |
| Relatórios detalhados | Gráficos complexos, exportação | Portal Web |
| Configurações avançadas | Uso raro | Portal Web |

### 1.4 O que VAI para o Mobile

| Funcionalidade | Por quê? | Frequência |
|----------------|----------|------------|
| **Dashboard resumido** | Visão geral rápida | Diária |
| **Lista de alunos** | Acesso rápido ao status | Diária |
| **Notificações** | Alertas em tempo real | Constante |
| **Ficha rápida do aluno** | Consultar entre treinos | Diária |
| **Registrar medidas** | Na hora da avaliação | Semanal |
| **Chat com aluno** | Comunicação rápida | Diária |
| **Check-in manual** | Confirmar presença | Diária |

---

## 2. ARQUITETURA DE TELAS

### 2.1 Mapa de Navegação

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         SPLASH SCREEN                           │
│                              │                                  │
│                              ▼                                  │
│                           LOGIN                                 │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                      BOTTOM NAV                           │ │
│  │                                                           │ │
│  │   🏠          👥          🔔          💬          👤     │ │
│  │  HOME       ALUNOS      ALERTAS      CHAT       PERFIL   │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│        │           │           │           │           │       │
│        ▼           ▼           ▼           ▼           ▼       │
│    Dashboard   Lista de    Central de   Lista de    Config    │
│    Resumido    Alunos      Notific.     Conversas             │
│                    │                        │                  │
│                    ▼                        ▼                  │
│              Ficha Aluno              Chat Individual          │
│                    │                                           │
│           ┌───────┴───────┐                                    │
│           ▼               ▼                                    │
│     Quick Actions    Histórico                                 │
│     (Medidas, etc)   Resumido                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Inventário de Telas

| # | Tela | Descrição | Prioridade |
|---|------|-----------|------------|
| 1 | Splash | Logo VITRÚVIO ao abrir | Alta |
| 2 | Login | Email/senha ou biometria | Alta |
| 3 | **HOME** | Dashboard resumido do dia | Alta |
| 4 | **Alunos** | Lista com filtros rápidos | Alta |
| 5 | **Ficha Aluno** | Resumo individual | Alta |
| 6 | **Notificações** | Central de alertas | Alta |
| 7 | **Chat** | Mensagens com alunos | Alta |
| 8 | Registrar Medidas | Input rápido de circunferências | Média |
| 9 | Perfil | Configurações básicas | Baixa |

---

## 3. ESPECIFICAÇÃO DAS TELAS

### 3.1 HOME - Dashboard Resumido

**Objetivo:** Responder em 5 segundos: "Como está meu dia?"

```
┌─────────────────────────────────────────┐
│ ☀️ Bom dia, Leonardo!          🔔 3    │
│ Quinta, 6 de Março                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📊 RESUMO DO DIA               │   │
│  │                                  │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐    │   │
│  │  │  6   │ │  4   │ │  2   │    │   │
│  │  │Ativos│ │Treino│ │Alerta│    │   │
│  │  │      │ │ Hoje │ │  ⚠️  │    │   │
│  │  └──────┘ └──────┘ └──────┘    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ⚠️ PRECISAM DE ATENÇÃO                │
│  ┌─────────────────────────────────┐   │
│  │ 🔴 Carlos Mendes                │   │
│  │    Score: 0 • Sem medição há 5d │ → │
│  ├─────────────────────────────────┤   │
│  │ 🔴 Felipe Andrade               │   │
│  │    Score: 0 • Sem medição há 5d │ → │
│  └─────────────────────────────────┘   │
│                                         │
│  📈 TOP EVOLUÇÃO DA SEMANA             │
│  ┌─────────────────────────────────┐   │
│  │ 🥇 Leonardo S.  +8.2 pts  91.7  │   │
│  │ 🥈 Graciela D.  +2.1 pts  77.0  │   │
│  │ 🥉 Rodrigo F.   +0.5 pts  59.1  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  🔥 ATIVIDADE RECENTE                  │
│  ┌─────────────────────────────────┐   │
│  │ Graciela registrou medição  3d  │   │
│  │ Leonardo registrou medição  3d  │   │
│  │ Rodrigo registrou medição   4d  │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      👥      🔔      💬      👤   │
│  Home   Alunos  Alertas  Chat   Perfil │
└─────────────────────────────────────────┘
```

#### Dados Exibidos

| Widget | Dados | Atualização |
|--------|-------|-------------|
| **Resumo do Dia** | Alunos ativos, com treino hoje, em alerta | Real-time |
| **Precisam de Atenção** | Alunos com status "Atenção" (sem medição >7d, score baixo) | Real-time |
| **Top Evolução** | 3 alunos com maior evolução na semana | Diária |
| **Atividade Recente** | Últimas 5 ações dos alunos | Real-time |

#### Interações

| Elemento | Ação | Destino |
|----------|------|---------|
| Card "Precisam de Atenção" | Tap | Ficha do Aluno |
| Card "Top Evolução" | Tap | Ficha do Aluno |
| Card "Atividade Recente" | Tap | Ficha do Aluno |
| Sino de notificação | Tap | Tela de Notificações |

---

### 3.2 ALUNOS - Lista com Filtros

**Objetivo:** Encontrar qualquer aluno em 3 segundos

```
┌─────────────────────────────────────────┐
│ ← MEUS ALUNOS                    🔍    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔍 Buscar por nome ou email... │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│  │Todos │ │Ativos│ │Alerta│ │Inativ│  │
│  │  6   │ │  3   │ │  2   │ │  1   │  │
│  └──────┘ └──────┘ └──────┘ └──────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Leonardo Schweitzer          │   │
│  │    91.7 pts • ELITE • 🟢 Ativo  │   │
│  │    Última medição: 3 dias       │ → │
│  ├─────────────────────────────────┤   │
│  │ 👤 Graciela Danos               │   │
│  │    77.0 pts • ATLETA • 🟢 Ativo │   │
│  │    Última medição: 3 dias       │ → │
│  ├─────────────────────────────────┤   │
│  │ 👤 Rodrigo Ferri                │   │
│  │    59.1 pts • EVOLUINDO • 🟢    │   │
│  │    Última medição: 4 dias       │ → │
│  ├─────────────────────────────────┤   │
│  │ 👤 Carlos Mendes                │   │
│  │    0 pts • -- • 🔴 Atenção      │   │
│  │    Última medição: 5 dias       │ → │
│  ├─────────────────────────────────┤   │
│  │ 👤 Felipe Andrade               │   │
│  │    0 pts • -- • 🔴 Atenção      │   │
│  │    Última medição: 5 dias       │ → │
│  ├─────────────────────────────────┤   │
│  │ 👤 Victor Hugo                  │   │
│  │    0 pts • -- • ⚪ Inativo      │   │
│  │    Última medição: 1 semana     │ → │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      👥      🔔      💬      👤   │
└─────────────────────────────────────────┘
```

#### Filtros Rápidos (Chips)

| Filtro | Descrição | Cor |
|--------|-----------|-----|
| **Todos** | Todos os alunos vinculados | Neutro |
| **Ativos** | Status = "Ativo" (mediu nos últimos 7 dias) | Verde |
| **Atenção** | Status = "Atenção" (sem medição >7 dias OU score caiu) | Vermelho |
| **Inativos** | Status = "Inativo" (sem medição >30 dias) | Cinza |

#### Card do Aluno (Lista)

```typescript
interface AlunoCardProps {
  id: string;
  nome: string;
  avatar?: string;
  score: number;
  nivel: 'INICIANDO' | 'EVOLUINDO' | 'ATLETA' | 'ELITE' | 'DEUS' | null;
  status: 'ATIVO' | 'ATENCAO' | 'INATIVO';
  ultimaMedicao: Date;
  evolucaoSemana?: number; // +8.2 ou -2.1
}
```

#### Ordenação Padrão

1. **Atenção** primeiro (precisam de ação)
2. **Ativos** ordenados por última medição (mais recentes primeiro)
3. **Inativos** por último

---

### 3.3 FICHA DO ALUNO - Resumo Individual

**Objetivo:** Tudo sobre o aluno em UMA tela scrollável

```
┌─────────────────────────────────────────┐
│ ← Leonardo Schweitzer            ⋮     │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         ┌───────────┐           │   │
│  │         │   👤      │           │   │
│  │         │  Avatar   │           │   │
│  │         └───────────┘           │   │
│  │                                  │   │
│  │      Leonardo Schweitzer        │   │
│  │      leonardo@email.com         │   │
│  │      📱 (51) 99999-9999         │   │
│  │                                  │   │
│  │  ┌────────┐ ┌────────┐         │   │
│  │  │📱 Ligar│ │💬 Chat │         │   │
│  │  └────────┘ └────────┘         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📊 SCORE SHAPE-V               │   │
│  │                                  │   │
│  │      ┌─────────────────┐        │   │
│  │      │      91.7       │        │   │
│  │      │      pts        │        │   │
│  │      │   🏆 ELITE      │        │   │
│  │      └─────────────────┘        │   │
│  │                                  │   │
│  │  Evolução: +8.2 pts ↑ (semana) │   │
│  │  Meta: 95 pts em 3 meses        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📐 PROPORÇÕES RESUMO           │   │
│  │                                  │   │
│  │  Shape-V      1.58  ████████░░  │   │
│  │  Costas       1.43  ███████░░░  │   │
│  │  Peitoral     6.76  █████░░░░░  │   │
│  │  Cintura      0.82  ████████░░  │   │
│  │                                  │   │
│  │  🔴 Foco: Braço (ratio 2.20)   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📅 CONSISTÊNCIA                │   │
│  │                                  │   │
│  │  🔥 Streak: 15 dias             │   │
│  │  📊 Check-ins mês: 18/22        │   │
│  │                                  │   │
│  │  ░░▓▓▓▓▓░▓▓▓▓▓░▓▓▓▓▓░▓▓▓▓▓░   │   │
│  │  Seg Ter Qua Qui Sex Sáb Dom    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ⚡ AÇÕES RÁPIDAS               │   │
│  │                                  │   │
│  │  ┌──────────┐ ┌──────────┐     │   │
│  │  │📏 Medir  │ │✅ Check-in│     │   │
│  │  └──────────┘ └──────────┘     │   │
│  │  ┌──────────┐ ┌──────────┐     │   │
│  │  │📋 Treino │ │📊 Histórico│    │   │
│  │  └──────────┘ └──────────┘     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🤖 INSIGHT DO COACH IA         │   │
│  │                                  │   │
│  │  "Leonardo está no nível ELITE  │   │
│  │  com score 91.7. Foco atual:    │   │
│  │  aumentar volume de braço para  │   │
│  │  equilibrar proporções. O ratio │   │
│  │  de 2.20 está abaixo do ideal." │   │
│  │                                  │   │
│  │  💬 Falar com Coach IA →        │   │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      👥      🔔      💬      👤   │
└─────────────────────────────────────────┘
```

#### Seções da Ficha

| Seção | Dados | Interação |
|-------|-------|-----------|
| **Header** | Nome, email, telefone, avatar | Ligar, Chat |
| **Score** | Pontuação, nível, evolução, meta | Ver detalhes |
| **Proporções** | Top 4 métricas + ponto fraco | Ver completo |
| **Consistência** | Streak, check-ins, heatmap mini | Ver calendário |
| **Ações Rápidas** | Botões de ação | Navegar |
| **Insight IA** | Resumo do Coach | Abrir chat IA |

#### Ações Rápidas

| Ação | Descrição | Destino |
|------|-----------|---------|
| **📏 Medir** | Registrar novas medidas | Tela de Medição Rápida |
| **✅ Check-in** | Confirmar presença hoje | Ação direta (haptic) |
| **📋 Treino** | Ver treino do dia | Tela Treino Simplificado |
| **📊 Histórico** | Evolução ao longo do tempo | Tela Histórico |

---

### 3.4 NOTIFICAÇÕES - Central de Alertas

**Objetivo:** Não perder nada importante

```
┌─────────────────────────────────────────┐
│ ← NOTIFICAÇÕES               Limpar    │
├─────────────────────────────────────────┤
│                                         │
│  HOJE                                   │
│  ┌─────────────────────────────────┐   │
│  │ 🔴 Carlos Mendes precisa de     │   │
│  │    atenção - sem medição há 5d  │   │
│  │    Há 2 horas                   │ → │
│  ├─────────────────────────────────┤   │
│  │ 📈 Leonardo Schweitzer subiu    │   │
│  │    para ELITE! Score: 91.7      │   │
│  │    Há 4 horas                   │ → │
│  ├─────────────────────────────────┤   │
│  │ 💬 Graciela Danos enviou        │   │
│  │    mensagem: "Dúvida sobre..."  │   │
│  │    Há 5 horas                   │ → │
│  └─────────────────────────────────┘   │
│                                         │
│  ONTEM                                  │
│  ┌─────────────────────────────────┐   │
│  │ ✅ Rodrigo Ferri fez check-in   │   │
│  │    Streak: 12 dias 🔥           │   │
│  │    Ontem às 18:32               │ → │
│  ├─────────────────────────────────┤   │
│  │ 📏 Graciela Danos registrou     │   │
│  │    novas medidas                │   │
│  │    Ontem às 15:20               │ → │
│  └─────────────────────────────────┘   │
│                                         │
│  ESTA SEMANA                            │
│  ┌─────────────────────────────────┐   │
│  │ 🎯 Meta atingida! Leonardo      │   │
│  │    alcançou 90 pts (meta Q1)    │   │
│  │    Terça-feira                  │ → │
│  ├─────────────────────────────────┤   │
│  │ ⚠️ Felipe Andrade - streak      │   │
│  │    quebrado (era 8 dias)        │   │
│  │    Segunda-feira                │ → │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      👥      🔔      💬      👤   │
└─────────────────────────────────────────┘
```

#### Tipos de Notificação

| Tipo | Ícone | Trigger | Prioridade |
|------|-------|---------|------------|
| **Atenção** | 🔴 | Aluno sem medição >7 dias | Alta |
| **Conquista** | 📈 | Aluno subiu de nível | Média |
| **Mensagem** | 💬 | Nova mensagem do aluno | Alta |
| **Check-in** | ✅ | Aluno fez check-in | Baixa |
| **Medição** | 📏 | Aluno registrou medidas | Média |
| **Meta** | 🎯 | Aluno atingiu meta | Média |
| **Streak** | ⚠️ | Aluno quebrou streak | Média |
| **Evolução** | 📊 | Score do aluno caiu | Alta |

#### Push Notifications

```typescript
interface PushNotification {
  id: string;
  tipo: 'ATENCAO' | 'CONQUISTA' | 'MENSAGEM' | 'CHECKIN' | 'MEDICAO' | 'META' | 'STREAK' | 'EVOLUCAO';
  titulo: string;
  corpo: string;
  alunoId: string;
  alunoNome: string;
  data: Date;
  lida: boolean;
  acao: {
    tipo: 'FICHA_ALUNO' | 'CHAT' | 'HISTORICO';
    params: Record<string, string>;
  };
}
```

#### Configurações de Notificação

| Notificação | Default | Configurável |
|-------------|---------|--------------|
| Aluno precisa de atenção | ✅ ON | Sim |
| Aluno subiu de nível | ✅ ON | Sim |
| Nova mensagem | ✅ ON | Sim |
| Check-in do aluno | ❌ OFF | Sim |
| Aluno registrou medidas | ✅ ON | Sim |
| Meta atingida | ✅ ON | Sim |
| Streak quebrado | ✅ ON | Sim |

---

### 3.5 CHAT - Comunicação com Alunos

**Objetivo:** Comunicação rápida sem sair do app

```
┌─────────────────────────────────────────┐
│ ← CONVERSAS                      🔍    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Graciela Danos          🔵  │   │
│  │    Dúvida sobre o treino de...  │   │
│  │    Há 2 horas                   │ → │
│  ├─────────────────────────────────┤   │
│  │ 👤 Leonardo Schweitzer         │   │
│  │    Obrigado! Vou seguir o plano │   │
│  │    Ontem                        │ → │
│  ├─────────────────────────────────┤   │
│  │ 👤 Rodrigo Ferri               │   │
│  │    Posso treinar amanhã às 8h?  │   │
│  │    Há 2 dias                    │ → │
│  └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│  🏠      👥      🔔      💬      👤   │
└─────────────────────────────────────────┘
```

#### Tela de Conversa Individual

```
┌─────────────────────────────────────────┐
│ ← Graciela Danos              📱 ⋮    │
├─────────────────────────────────────────┤
│                                         │
│        ┌─────────────────────┐         │
│        │ Oi! Tudo bem?       │  10:30  │
│        └─────────────────────┘         │
│                                         │
│  ┌─────────────────────┐               │
│  │ Oi Graci! Tudo sim, │               │
│  │ e você?             │  10:32        │
│  └─────────────────────┘               │
│                                         │
│        ┌─────────────────────┐         │
│        │ Tenho uma dúvida    │         │
│        │ sobre o treino de   │         │
│        │ amanhã. É pra fazer │  10:35  │
│        │ cardio antes ou     │         │
│        │ depois da musculação│         │
│        └─────────────────────┘         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────┐ ┌────┐│
│ │ Digite sua mensagem...      │ │ ➤  ││
│ └─────────────────────────────┘ └────┘│
└─────────────────────────────────────────┘
```

#### Funcionalidades do Chat

| Feature | Descrição | Prioridade |
|---------|-----------|------------|
| Mensagens de texto | Envio e recebimento | Alta |
| Push notification | Notificar nova mensagem | Alta |
| Status de leitura | Visto/não visto | Média |
| Indicador "digitando" | Real-time | Baixa |
| Enviar imagem | Fotos de progresso | Média |
| Quick replies | Respostas pré-definidas | Baixa |

---

### 3.6 REGISTRAR MEDIDAS - Input Rápido

**Objetivo:** Registrar medidas na hora da avaliação

```
┌─────────────────────────────────────────┐
│ ← NOVA MEDIÇÃO                         │
│   Leonardo Schweitzer                   │
├─────────────────────────────────────────┤
│                                         │
│  Data: 06/03/2026          📅          │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  COMPOSIÇÃO CORPORAL                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  Peso (kg)           ┌────────────┐    │
│                      │    87.5    │    │
│                      └────────────┘    │
│                                         │
│  Gordura (%)         ┌────────────┐    │
│                      │    11.7    │    │
│                      └────────────┘    │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  CIRCUNFERÊNCIAS (cm)                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  Ombros              ┌────────────┐    │
│                      │    133     │    │
│                      └────────────┘    │
│                                         │
│  Peito               ┌────────────┐    │
│                      │    120     │    │
│                      └────────────┘    │
│                                         │
│  Cintura             ┌────────────┐    │
│                      │    84      │    │
│                      └────────────┘    │
│                                         │
│  Braço (D)           ┌────────────┐    │
│                      │    39      │    │
│                      └────────────┘    │
│                                         │
│  Braço (E)           ┌────────────┐    │
│                      │    39      │    │
│                      └────────────┘    │
│                                         │
│  [... mais campos com scroll ...]      │
│                                         │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │     💾 SALVAR E CALCULAR        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### Campos de Medição

| Grupo | Campos | Obrigatório |
|-------|--------|-------------|
| **Composição** | Peso, Gordura (%) | Peso sim |
| **Superiores** | Ombros, Peito, Costas | Ombros sim |
| **Core** | Cintura, Quadril | Cintura sim |
| **Braços** | Braço D, Braço E, Antebraço D, Antebraço E | Braço D sim |
| **Pernas** | Coxa D, Coxa E, Panturrilha D, Panturrilha E | Coxa D sim |

#### Fluxo Pós-Salvar

```
┌─────────────────────────────────────────┐
│                                         │
│           ✅ MEDIÇÃO SALVA!             │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                  │   │
│  │   Score Anterior:    83.5 pts   │   │
│  │   Score Novo:        91.7 pts   │   │
│  │                                  │   │
│  │       📈 +8.2 pts               │   │
│  │                                  │   │
│  │   🎉 Leonardo subiu para ELITE! │   │
│  │                                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     📊 VER RESULTADO COMPLETO   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     ← VOLTAR PARA ALUNOS        │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. SISTEMA DE NOTIFICAÇÕES

### 4.1 Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      BACKEND (API)                              │
│                           │                                     │
│              ┌───────────┴───────────┐                         │
│              ▼                       ▼                         │
│      Notification Service      Push Service                    │
│              │                       │                         │
│              ▼                       ▼                         │
│      PostgreSQL              Firebase Cloud Messaging          │
│      (histórico)                    │                          │
│                                     │                          │
│                    ┌────────────────┴────────────────┐         │
│                    ▼                                 ▼         │
│               iOS (APNs)                      Android (FCM)    │
│                    │                                 │         │
│                    ▼                                 ▼         │
│            App Personal                       App Personal     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Triggers de Notificação

| Evento | Trigger | Notificação para Personal |
|--------|---------|---------------------------|
| `aluno.medicao.criada` | Aluno registrou medidas | "📏 {nome} registrou novas medidas" |
| `aluno.score.subiu_nivel` | Score cruzou threshold | "📈 {nome} subiu para {nivel}!" |
| `aluno.score.caiu` | Score diminuiu >5% | "⚠️ Score de {nome} caiu para {score}" |
| `aluno.checkin.criado` | Aluno fez check-in | "✅ {nome} fez check-in" |
| `aluno.streak.quebrado` | Streak zerou | "⚠️ {nome} quebrou streak de {dias} dias" |
| `aluno.meta.atingida` | Atingiu meta definida | "🎯 {nome} atingiu meta de {score}!" |
| `aluno.inativo` | Sem medição >7 dias | "🔴 {nome} precisa de atenção - {dias}d sem medir" |
| `chat.mensagem.nova` | Aluno enviou mensagem | "💬 {nome}: {preview}" |

### 4.3 Implementação Push (Capacitor)

```typescript
// src/services/push-notifications.ts

import { PushNotifications } from '@capacitor/push-notifications';
import { api } from '@/lib/api';

export async function initPushNotifications(personalId: string) {
  // Solicitar permissão
  const permission = await PushNotifications.requestPermissions();
  
  if (permission.receive !== 'granted') {
    console.log('Push notifications não permitidas');
    return;
  }
  
  // Registrar no serviço de push
  await PushNotifications.register();
  
  // Listener para token
  PushNotifications.addListener('registration', async (token) => {
    console.log('Push token:', token.value);
    
    // Salvar token no backend
    await api.post('/personal/push-token', {
      personalId,
      token: token.value,
      platform: Capacitor.getPlatform() // 'ios' | 'android'
    });
  });
  
  // Notificação recebida com app aberto
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Notificação recebida:', notification);
    
    // Atualizar badge de notificações
    updateNotificationBadge();
    
    // Mostrar toast/snackbar
    showInAppNotification(notification);
  });
  
  // Clique na notificação
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Ação na notificação:', action);
    
    const data = action.notification.data;
    
    // Navegar para tela apropriada
    switch (data.tipo) {
      case 'FICHA_ALUNO':
        router.push(`/alunos/${data.alunoId}`);
        break;
      case 'CHAT':
        router.push(`/chat/${data.alunoId}`);
        break;
      case 'MEDICAO':
        router.push(`/alunos/${data.alunoId}/historico`);
        break;
    }
  });
}

// Badge no ícone do app
export async function updateAppBadge(count: number) {
  if (Capacitor.getPlatform() === 'ios') {
    await PushNotifications.setBadgeCount({ count });
  }
}
```

### 4.4 Payload de Notificação

```typescript
// Backend - Envio de push
interface PushPayload {
  notification: {
    title: string;
    body: string;
    badge?: number;
    sound?: 'default' | string;
  };
  data: {
    tipo: 'FICHA_ALUNO' | 'CHAT' | 'MEDICAO' | 'CONQUISTA';
    alunoId: string;
    alunoNome: string;
    notificationId: string;
  };
  android?: {
    channelId: 'alertas' | 'mensagens' | 'atividades';
    priority: 'high' | 'normal';
  };
  apns?: {
    payload: {
      aps: {
        'content-available': 1;
        'mutable-content': 1;
      };
    };
  };
}

// Exemplo de payload
const exemploPayload: PushPayload = {
  notification: {
    title: '📈 Leonardo subiu para ELITE!',
    body: 'Score: 91.7 pts (+8.2 esta semana)',
    badge: 3,
    sound: 'default'
  },
  data: {
    tipo: 'FICHA_ALUNO',
    alunoId: 'clx123abc',
    alunoNome: 'Leonardo Schweitzer',
    notificationId: 'notif_456'
  },
  android: {
    channelId: 'alertas',
    priority: 'high'
  }
};
```

---

## 5. MODELO DE DADOS

### 5.1 Entidades Mobile-Específicas

```prisma
// prisma/schema.prisma

// Token de push notification
model PushToken {
  id          String   @id @default(cuid())
  personalId  String
  token       String   @unique
  platform    String   // 'ios' | 'android'
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  personal    Personal @relation(fields: [personalId], references: [id])
  
  @@map("push_tokens")
}

// Notificações do Personal
model NotificacaoPersonal {
  id          String   @id @default(cuid())
  personalId  String
  tipo        String   // 'ATENCAO' | 'CONQUISTA' | 'MENSAGEM' | etc
  titulo      String
  corpo       String
  alunoId     String?
  dados       Json?    // dados extras
  lida        Boolean  @default(false)
  lidaEm      DateTime?
  createdAt   DateTime @default(now())
  
  personal    Personal @relation(fields: [personalId], references: [id])
  aluno       Atleta?  @relation(fields: [alunoId], references: [id])
  
  @@index([personalId, lida])
  @@index([personalId, createdAt])
  @@map("notificacoes_personal")
}

// Mensagens do chat
model Mensagem {
  id          String   @id @default(cuid())
  conversaId  String
  remetenteId String
  remetenteTipo String // 'PERSONAL' | 'ATLETA'
  conteudo    String
  tipo        String   @default("TEXTO") // 'TEXTO' | 'IMAGEM'
  lida        Boolean  @default(false)
  lidaEm      DateTime?
  createdAt   DateTime @default(now())
  
  conversa    Conversa @relation(fields: [conversaId], references: [id])
  
  @@index([conversaId, createdAt])
  @@map("mensagens")
}

model Conversa {
  id          String   @id @default(cuid())
  personalId  String
  atletaId    String
  ultimaMensagem String?
  ultimaMensagemEm DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  personal    Personal @relation(fields: [personalId], references: [id])
  atleta      Atleta   @relation(fields: [atletaId], references: [id])
  mensagens   Mensagem[]
  
  @@unique([personalId, atletaId])
  @@map("conversas")
}

// Configurações de notificação do Personal
model ConfigNotificacao {
  id                    String   @id @default(cuid())
  personalId            String   @unique
  
  // Tipos de notificação
  notifAtencao          Boolean  @default(true)
  notifConquista        Boolean  @default(true)
  notifMensagem         Boolean  @default(true)
  notifCheckin          Boolean  @default(false)
  notifMedicao          Boolean  @default(true)
  notifMeta             Boolean  @default(true)
  notifStreak           Boolean  @default(true)
  
  // Horários
  horarioInicio         String   @default("07:00") // Não incomodar antes
  horarioFim            String   @default("22:00") // Não incomodar depois
  
  // Som
  somAtivado            Boolean  @default(true)
  
  personal              Personal @relation(fields: [personalId], references: [id])
  
  @@map("config_notificacoes")
}
```

### 5.2 Tipos TypeScript

```typescript
// src/types/mobile.ts

export interface AlunoResumo {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
  score: number;
  nivel: Nivel | null;
  status: 'ATIVO' | 'ATENCAO' | 'INATIVO';
  ultimaMedicao: Date | null;
  evolucaoSemana: number;
  streak: number;
}

export interface DashboardResumo {
  totalAlunos: number;
  alunosAtivos: number;
  alunosTreinoHoje: number;
  alunosAtencao: number;
  precisamAtencao: AlunoResumo[];
  topEvolucao: AlunoResumo[];
  atividadeRecente: Atividade[];
}

export interface Atividade {
  id: string;
  tipo: 'MEDICAO' | 'CHECKIN' | 'CONQUISTA' | 'MENSAGEM';
  alunoId: string;
  alunoNome: string;
  descricao: string;
  data: Date;
}

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  titulo: string;
  corpo: string;
  alunoId?: string;
  alunoNome?: string;
  lida: boolean;
  data: Date;
}

export type TipoNotificacao = 
  | 'ATENCAO' 
  | 'CONQUISTA' 
  | 'MENSAGEM' 
  | 'CHECKIN' 
  | 'MEDICAO' 
  | 'META' 
  | 'STREAK' 
  | 'EVOLUCAO';

export interface Conversa {
  id: string;
  atletaId: string;
  atletaNome: string;
  atletaAvatar?: string;
  ultimaMensagem?: string;
  ultimaMensagemEm?: Date;
  naoLidas: number;
}

export interface Mensagem {
  id: string;
  conversaId: string;
  remetenteId: string;
  remetenteTipo: 'PERSONAL' | 'ATLETA';
  conteudo: string;
  tipo: 'TEXTO' | 'IMAGEM';
  lida: boolean;
  data: Date;
}
```

---

## 6. API ENDPOINTS

### 6.1 Dashboard

```typescript
// GET /api/mobile/personal/dashboard
// Retorna resumo do dia

interface DashboardResponse {
  success: true;
  data: {
    resumo: {
      totalAlunos: number;
      alunosAtivos: number;
      alunosTreinoHoje: number;
      alunosAtencao: number;
    };
    precisamAtencao: AlunoResumo[];
    topEvolucao: AlunoResumo[];
    atividadeRecente: Atividade[];
  };
}
```

### 6.2 Alunos

```typescript
// GET /api/mobile/personal/alunos?status=ATIVO&q=leonardo
// Lista alunos com filtros

interface AlunosResponse {
  success: true;
  data: AlunoResumo[];
  meta: {
    total: number;
    ativos: number;
    atencao: number;
    inativos: number;
  };
}

// GET /api/mobile/personal/alunos/:id
// Ficha completa do aluno

interface FichaAlunoResponse {
  success: true;
  data: {
    aluno: AlunoCompleto;
    scoreAtual: number;
    nivel: Nivel;
    evolucaoSemana: number;
    meta: Meta;
    proporcoes: ProporcoesResumo;
    consistencia: {
      streak: number;
      checkinsMes: number;
      totalDiasMes: number;
      heatmap: boolean[]; // últimos 28 dias
    };
    insightIA: string;
  };
}
```

### 6.3 Notificações

```typescript
// GET /api/mobile/personal/notificacoes?page=1&limit=20
// Lista notificações

interface NotificacoesResponse {
  success: true;
  data: Notificacao[];
  meta: {
    total: number;
    naoLidas: number;
    page: number;
    totalPages: number;
  };
}

// POST /api/mobile/personal/notificacoes/:id/lida
// Marca como lida

// POST /api/mobile/personal/notificacoes/limpar
// Marca todas como lidas

// GET /api/mobile/personal/notificacoes/config
// Configurações de notificação

// PUT /api/mobile/personal/notificacoes/config
// Atualiza configurações
```

### 6.4 Chat

```typescript
// GET /api/mobile/personal/conversas
// Lista conversas

interface ConversasResponse {
  success: true;
  data: Conversa[];
}

// GET /api/mobile/personal/conversas/:atletaId/mensagens?page=1
// Lista mensagens de uma conversa

interface MensagensResponse {
  success: true;
  data: Mensagem[];
  meta: {
    page: number;
    hasMore: boolean;
  };
}

// POST /api/mobile/personal/conversas/:atletaId/mensagens
// Envia mensagem

interface EnviarMensagemBody {
  conteudo: string;
  tipo: 'TEXTO' | 'IMAGEM';
}
```

### 6.5 Medições

```typescript
// POST /api/mobile/personal/alunos/:id/medicoes
// Registra nova medição

interface NovaMedicaoBody {
  data: string; // ISO date
  peso?: number;
  gordura?: number;
  ombros?: number;
  peito?: number;
  costas?: number;
  cintura?: number;
  quadril?: number;
  bracoD?: number;
  bracoE?: number;
  antebracoD?: number;
  antebracoE?: number;
  coxaD?: number;
  coxaE?: number;
  panturrilhaD?: number;
  panturrilhaE?: number;
}

interface NovaMedicaoResponse {
  success: true;
  data: {
    medicaoId: string;
    scoreAnterior: number;
    scoreNovo: number;
    evolucao: number;
    nivelAnterior: Nivel;
    nivelNovo: Nivel;
    subiuNivel: boolean;
  };
}
```

---

## 7. DESIGN SYSTEM MOBILE

### 7.1 Cores

```typescript
// src/styles/colors.ts

export const colors = {
  // Fundos
  bgPrimary: '#0F172A',    // Fundo principal (navy escuro)
  bgSecondary: '#1E293B',  // Cards e seções
  bgTertiary: '#334155',   // Inputs e hovers
  
  // Primária
  primary: '#10B981',      // Verde/Teal (ações, sucesso)
  primaryDark: '#059669',  // Hover
  primaryLight: '#34D399', // Destaque
  
  // Secundária
  secondary: '#F97316',    // Laranja (alertas, evolução)
  secondaryDark: '#EA580C',
  
  // Status
  success: '#10B981',      // Verde
  warning: '#F59E0B',      // Amarelo
  error: '#EF4444',        // Vermelho
  info: '#3B82F6',         // Azul
  
  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  
  // Níveis
  niveis: {
    iniciando: '#94A3B8',  // Cinza
    evoluindo: '#3B82F6',  // Azul
    atleta: '#10B981',     // Verde
    elite: '#EAB308',      // Dourado
    deus: '#A855F7',       // Roxo
  },
  
  // Status do aluno
  statusAluno: {
    ativo: '#10B981',      // Verde
    atencao: '#EF4444',    // Vermelho
    inativo: '#64748B',    // Cinza
  }
};
```

### 7.2 Tipografia

```typescript
// src/styles/typography.ts

export const typography = {
  // Família
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  
  // Tamanhos
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Pesos
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Presets
  heading1: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700',
  },
  heading3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
};
```

### 7.3 Espaçamento

```typescript
// src/styles/spacing.ts

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};
```

### 7.4 Componentes Base

```typescript
// src/components/ui/Card.tsx

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'highlight';
}

// src/components/ui/Button.tsx

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

// src/components/ui/Badge.tsx

interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

// src/components/ui/Avatar.tsx

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

---

## 8. TECNOLOGIA E ARQUITETURA

### 8.1 Stack Recomendada

| Camada | Tecnologia | Motivo |
|--------|------------|--------|
| **Framework** | React Native ou Capacitor | Performance nativa |
| **Navegação** | React Navigation 6 | Padrão de mercado |
| **Estado** | Zustand | Leve e simples |
| **API** | React Query + Axios | Cache e retry |
| **Push** | Firebase Cloud Messaging | iOS e Android |
| **Storage** | AsyncStorage | Persistência local |
| **Forms** | React Hook Form + Zod | Validação |

### 8.2 Estrutura de Pastas

```
vitruvio-personal-mobile/
├── src/
│   ├── app/                    # Telas (file-based routing)
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   └── _layout.tsx
│   │   ├── (tabs)/
│   │   │   ├── index.tsx       # HOME
│   │   │   ├── alunos/
│   │   │   │   ├── index.tsx   # Lista
│   │   │   │   └── [id].tsx    # Ficha
│   │   │   ├── notificacoes.tsx
│   │   │   ├── chat/
│   │   │   │   ├── index.tsx
│   │   │   │   └── [id].tsx
│   │   │   ├── perfil.tsx
│   │   │   └── _layout.tsx     # Tab Navigator
│   │   └── _layout.tsx         # Root Layout
│   ├── components/
│   │   ├── ui/                 # Componentes base
│   │   ├── aluno/              # Componentes de aluno
│   │   ├── dashboard/          # Widgets do dashboard
│   │   └── chat/               # Componentes de chat
│   ├── services/
│   │   ├── api.ts              # Cliente API
│   │   ├── push.ts             # Push notifications
│   │   └── storage.ts          # AsyncStorage
│   ├── stores/
│   │   ├── auth.ts             # Autenticação
│   │   ├── alunos.ts           # Estado dos alunos
│   │   └── notificacoes.ts     # Estado das notificações
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAlunos.ts
│   │   └── useNotificacoes.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── assets/
│   ├── images/
│   └── fonts/
├── app.json                    # Configuração Expo/RN
└── package.json
```

### 8.3 Opção A: Capacitor (Recomendado se já tem web)

**Vantagens:**
- Usa código React/Next.js existente
- Implementação mais rápida (1-2 semanas)
- Mesma base de código do Portal Web

**Desvantagens:**
- Performance ligeiramente inferior
- Menos "nativo"

### 8.4 Opção B: React Native (Recomendado para melhor UX)

**Vantagens:**
- Performance nativa
- Melhor UX mobile
- Componentes nativos (gestos, animações)

**Desvantagens:**
- Requer desenvolvimento separado
- Mais tempo (4-6 semanas)

### 8.5 Decisão Recomendada

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   RECOMENDAÇÃO: React Native (Expo)                            │
│                                                                 │
│   Motivo: O Personal usa o app MUITO durante o dia.            │
│   A experiência precisa ser fluida, rápida, nativa.            │
│                                                                 │
│   O investimento extra em desenvolvimento (4-6 semanas)        │
│   compensa pela qualidade da experiência diária.               │
│                                                                 │
│   Já temos o App do Atleta em Capacitor, então ter o           │
│   App do Personal em React Native diferencia e mostra          │
│   que investimos mais na ferramenta de trabalho do Personal.   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. CRONOGRAMA

### 9.1 Fases do Projeto

| Fase | Duração | Entregáveis |
|------|---------|-------------|
| **1. Setup** | 1 semana | Projeto configurado, navegação, design system |
| **2. Autenticação** | 3 dias | Login, biometria, persistência |
| **3. Dashboard** | 1 semana | HOME com todos os widgets |
| **4. Alunos** | 1 semana | Lista, ficha, ações rápidas |
| **5. Notificações** | 1 semana | Central, push, configurações |
| **6. Chat** | 1 semana | Lista, conversa, real-time |
| **7. Medições** | 3 dias | Input rápido, feedback |
| **8. Polimento** | 1 semana | Animações, loading states, edge cases |
| **9. Testes** | 1 semana | Dispositivos reais, beta testers |
| **10. Publicação** | 3 dias | App Store, Play Store |
| **TOTAL** | ~8 semanas | |

### 9.2 MVP (4 semanas)

Se precisar entregar mais rápido, o MVP inclui:

| Tela | Incluso no MVP |
|------|----------------|
| Login | ✅ |
| HOME | ✅ |
| Lista de Alunos | ✅ |
| Ficha do Aluno | ✅ (simplificada) |
| Notificações | ✅ (push + lista) |
| Chat | ❌ (v2) |
| Medições | ❌ (v2) |
| Perfil | ✅ (básico) |

---

## 10. MÉTRICAS DE SUCESSO

### 10.1 KPIs do App

| Métrica | Meta | Medição |
|---------|------|---------|
| **DAU** (Daily Active Users) | 60% dos personais | Firebase Analytics |
| **Sessões/dia** | 3+ sessões | Firebase Analytics |
| **Tempo médio sessão** | 2-5 minutos | Firebase Analytics |
| **Taxa de abertura push** | >30% | Firebase Cloud Messaging |
| **Avaliação na loja** | 4.5+ estrelas | App Store / Play Store |
| **Crash rate** | <1% | Firebase Crashlytics |

### 10.2 Eventos para Rastrear

```typescript
// Analytics events
const events = {
  // Navegação
  'screen_view': { screen_name: string },
  
  // Ações
  'aluno_visualizado': { aluno_id: string },
  'medicao_registrada': { aluno_id: string, score_novo: number },
  'checkin_registrado': { aluno_id: string },
  'mensagem_enviada': { aluno_id: string },
  
  // Notificações
  'push_recebido': { tipo: string },
  'push_clicado': { tipo: string },
  'notificacao_lida': { tipo: string },
  
  // Engajamento
  'filtro_aplicado': { filtro: string },
  'busca_realizada': { termo: string },
};
```

---

## 11. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Mar/2026 | Versão inicial - Especificação completa |

---

## 12. RESUMO EXECUTIVO

### O que é

App mobile para **Personal Trainers** do VITRÚVIO IA, focado em:
- Acompanhamento rápido de alunos
- Notificações em tempo real
- Ações essenciais do dia-a-dia

### O que tem

| Funcionalidade | Descrição |
|----------------|-----------|
| **Dashboard** | Resumo do dia em 5 segundos |
| **Lista de Alunos** | Filtros rápidos por status |
| **Ficha do Aluno** | Score, proporções, consistência, insight IA |
| **Notificações** | Push + central de alertas |
| **Chat** | Comunicação direta com alunos |
| **Medições** | Input rápido de circunferências |

### O que NÃO tem

- Cadastro completo (vai pro web)
- Montar plano de treino completo (vai pro web)
- Relatórios detalhados (vai pro web)

### Tecnologia

**React Native (Expo)** - para UX nativa e performance

### Prazo

- **MVP:** 4 semanas
- **Completo:** 8 semanas

### Próximos Passos

1. Validar SPEC com stakeholders
2. Criar protótipo Figma
3. Setup do projeto React Native
4. Desenvolvimento iterativo
5. Beta testing com personais
6. Publicação nas lojas

---

**VITRÚVIO IA - Portal Mobile do Personal**  
*Seus alunos no bolso.*
