# SPEC: Dashboard Personal - VITRU IA

## Documento de Especificação do Dashboard do Personal Trainer

**Versão:** 1.1  
**Data:** Março 2026  
**Projeto:** VITRU IA (Sistema de Análise de Proporções Corporais)  
**Status:** ✅ Implementado

---

## 1. VISÃO GERAL

O Dashboard do Personal é a interface principal para Personal Trainers gerenciarem seus alunos, acompanharem evolução e registrarem medições.

### 1.1 Objetivos

- Fornecer visão consolidada de todos os alunos
- Identificar alunos que precisam de atenção
- Facilitar registro de medições
- Gerenciar convites e vínculos
- Acompanhar performance geral

---

## 2. COMPONENTES PRINCIPAIS

### 2.1 PersonalDashboard.tsx

**Responsabilidade:** Tela principal do Personal com resumo geral e alertas.

**Seções:**

1. **Header de Boas-Vindas**
   - Nome do personal
   - Quantidade de alunos ativos
   - Limite do plano

2. **Cards de Resumo** (4 cards)
   - Alunos Ativos
   - Mediram esta Semana (%)
   - Score Médio (com variação)
   - Precisam de Atenção

3. **Alunos que Precisam de Atenção**
   - Lista de até 5 alunos com:
     - Última medição > 14 dias
     - Score caiu > 3 pontos
     - Assimetria alta (> 8%)
   - Ações rápidas: Ver perfil, Enviar lembrete

4. **Top Performers**
   - Top 5 alunos por score
   - Medalhas para top 3
   - Link para ranking completo

5. **Atividade Recente**
   - Últimas 10 atividades
   - Tipos: Medição registrada, Meta atingida, Novo recorde

6. **Próximas Ações**
   - Sugestões automáticas
   - Aniversários da semana
   - Alunos próximos de meta

**Props:**
```typescript
interface PersonalDashboardProps {
  onNavigateToAthlete: (athleteId: string) => void;
  onNavigateToAthletes: () => void;
}
```

**Mock Data:**
```typescript
const mockPersonalStats = {
  totalAthletes: 12,
  maxAthletes: 20, // Limite do plano
  measuredThisWeek: 8,
  averageScore: 76.5,
  scoreVariation: 2.3,
  needsAttention: 3,
};

const mockAthletesNeedingAttention = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    avatarUrl: null,
    score: 72,
    scoreVariation: -3,
    lastMeasurement: '2026-01-20',
    reason: 'Última medição: 18 dias atrás',
  },
  // ... mais 2
];

const mockTopPerformers = [
  {
    id: '2',
    name: 'Ana Lima',
    score: 92,
    ratio: 1.58,
    position: 1,
  },
  // ... top 5
];

const mockRecentActivity = [
  {
    id: '1',
    athleteName: 'João Silva',
    action: 'Registrou medidas',
    timestamp: '2026-02-07T10:30:00',
    type: 'measurement',
  },
  // ... últimas 10
];
```

---

### 2.2 PersonalAthletesList.tsx

**Responsabilidade:** Lista completa de alunos com filtros e busca.

**Features:**

1. **Header**
   - Botão "Convidar Aluno" (destaque)
   - Campo de busca
   - Filtro por status (Todos, Ativos, Inativos, Atenção)

2. **Tabela de Alunos**
   - Colunas:
     - Avatar + Nome + Email
     - Score (com variação)
     - Ratio (Shape-V)
     - Última Medição (relativa: "Hoje", "2 dias", etc)
     - Status (badge colorido)
   - Ações por linha:
     - Ver Perfil
     - Registrar Medição
     - Menu (Editar, Remover vínculo)

3. **Paginação**
   - 10 alunos por página
   - Navegação simples

**Props:**
```typescript
interface PersonalAthletesListProps {
  onSelectAthlete: (athleteId: string) => void;
  onInviteAthlete: () => void;
  onRegisterMeasurement: (athleteId: string) => void;
}
```

**Status Badge:**
```typescript
type AthleteStatus = 'active' | 'inactive' | 'attention';

const statusConfig = {
  active: {
    label: 'Ativo',
    color: 'green',
    icon: '🟢',
    criteria: 'Mediu nos últimos 7 dias',
  },
  inactive: {
    label: 'Inativo',
    color: 'yellow',
    icon: '🟡',
    criteria: 'Não mede há 8-30 dias',
  },
  attention: {
    label: 'Atenção',
    color: 'red',
    icon: '🔴',
    criteria: 'Score caiu ou assimetria alta',
  },
};
```

---

### 2.3 PersonalAthleteDetail.tsx

**Responsabilidade:** Visualização completa dos dados de um aluno específico.

**Layout:**

1. **Header do Atleta**
   - Avatar grande
   - Nome, email
   - Data de vínculo
   - 3 Cards: Score, Ratio, Evolução (%)

2. **Tabs de Navegação**
   - Dashboard (padrão do atleta)
   - Evolução (gráficos)
   - Medições (histórico)
   - Metas (objetivos)
   - Anotações (notas do personal)

3. **Área de Conteúdo**
   - Renderiza o componente correspondente à tab
   - Usa os mesmos componentes que o atleta vê
   - Modo "visualização" (sem edição direta)

4. **Ações do Personal** (barra fixa no bottom)
   - Registrar Medição
   - Adicionar Nota
   - Definir Meta
   - Enviar Mensagem

**Props:**
```typescript
interface PersonalAthleteDetailProps {
  athleteId: string;
  onBack: () => void;
  onRegisterMeasurement: () => void;
  onAddNote: () => void;
  onSetGoal: () => void;
}
```

**Tabs:**
```typescript
type AthleteDetailTab = 'dashboard' | 'evolution' | 'measurements' | 'goals' | 'notes';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'evolution', label: 'Evolução', icon: TrendingUp },
  { id: 'measurements', label: 'Medições', icon: Activity },
  { id: 'goals', label: 'Metas', icon: Target },
  { id: 'notes', label: 'Anotações', icon: FileText },
];
```

---

### 2.4 PersonalInviteModal.tsx

**Responsabilidade:** Modal para convidar novos alunos.

**Campos:**

1. **Email do Aluno** (obrigatório)
   - Validação de email
   - Verificação se já existe

2. **Nome** (opcional)
   - Pré-preenche o cadastro

3. **Mensagem Personalizada** (opcional)
   - Textarea com limite de 500 caracteres
   - Placeholder com mensagem padrão

**Informações:**
- Contador de convites pendentes
- Limite do plano atual
- Explicação do fluxo

**Props:**
```typescript
interface PersonalInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (data: InviteData) => Promise<void>;
  pendingInvites: number;
  maxInvites: number;
}

interface InviteData {
  email: string;
  name?: string;
  message?: string;
}
```

**Validações:**
```typescript
const validateInvite = (data: InviteData) => {
  const errors: Record<string, string> = {};
  
  if (!data.email) {
    errors.email = 'Email é obrigatório';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email inválido';
  }
  
  if (data.message && data.message.length > 500) {
    errors.message = 'Mensagem muito longa (máx. 500 caracteres)';
  }
  
  return errors;
};
```

---

### 2.5 PersonalMeasurementModal.tsx

**Responsabilidade:** Modal para registrar medições de um aluno.

**Seções:**

1. **Header**
   - Nome do aluno
   - Data da medição (editável, padrão: hoje)

2. **Formulário de Medidas**
   - Mesmos campos da avaliação do atleta
   - Agrupados por categoria:
     - Básicas (Altura, Peso)
     - Tronco (Pescoço, Ombros, Peitoral)
     - Core (Cintura, Quadril)
     - Membros (com toggle bilateral)
   - Validação de valores

3. **Observações**
   - Campo de texto livre
   - Contexto da medição

4. **Ações**
   - Salvar Medição
   - Cancelar

**Props:**
```typescript
interface PersonalMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
  onSaveMeasurement: (data: MeasurementData) => Promise<void>;
}

interface MeasurementData {
  date: string;
  height: number;
  weight: number;
  neck: number;
  shoulders: number;
  chest: number;
  waist: number;
  hip: number;
  // ... outros campos
  notes?: string;
}
```

---

### 2.6 PersonalStatsCard.tsx

**Responsabilidade:** Card reutilizável para estatísticas do dashboard.

**Variantes:**

1. **Número Simples**
   - Valor principal
   - Label
   - Ícone

2. **Número com Variação**
   - Valor principal
   - Variação (positiva/negativa)
   - Percentual ou absoluto

3. **Percentual**
   - Valor percentual
   - Barra de progresso
   - Meta (opcional)

**Props:**
```typescript
interface PersonalStatsCardProps {
  title: string;
  value: number;
  variation?: number;
  variationType?: 'absolute' | 'percentage';
  unit?: string;
  icon?: React.ElementType;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showProgress?: boolean;
  target?: number;
}
```

**Exemplo de Uso:**
```tsx
<PersonalStatsCard
  title="Alunos Ativos"
  value={12}
  icon={Users}
  color="primary"
/>

<PersonalStatsCard
  title="Score Médio"
  value={76.5}
  variation={2.3}
  variationType="absolute"
  icon={TrendingUp}
  color="success"
/>

<PersonalStatsCard
  title="Mediram esta Semana"
  value={67}
  unit="%"
  showProgress
  target={80}
  icon={Activity}
  color="warning"
/>
```

---

## 3. NAVEGAÇÃO E ROTAS

### 3.1 Atualização do App.tsx

**Novos ViewStates:**
```typescript
type ViewState = 
  | 'dashboard'
  | 'results'
  | 'evolution'
  | 'hall'
  | 'coach'
  | 'profile'
  | 'settings'
  | 'assessment'
  | 'trainers-ranking'
  // NOVOS para Personal:
  | 'personal-dashboard'
  | 'personal-athletes'
  | 'personal-athlete-detail'
  | 'personal-reports';
```

**Lógica de Renderização:**
```typescript
const renderContent = () => {
  // Se usuário é Personal, redireciona dashboard para personal-dashboard
  if (userProfile === 'personal') {
    switch (currentView) {
      case 'dashboard':
        return <PersonalDashboard 
          onNavigateToAthlete={(id) => {
            setSelectedAthleteId(id);
            setCurrentView('personal-athlete-detail');
          }}
          onNavigateToAthletes={() => setCurrentView('personal-athletes')}
        />;
      case 'students': // Menu "Alunos"
        return <PersonalAthletesList 
          onSelectAthlete={(id) => {
            setSelectedAthleteId(id);
            setCurrentView('personal-athlete-detail');
          }}
          onInviteAthlete={() => setIsInviteModalOpen(true)}
          onRegisterMeasurement={(id) => {
            setSelectedAthleteId(id);
            setIsMeasurementModalOpen(true);
          }}
        />;
      case 'personal-athlete-detail':
        return <PersonalAthleteDetail 
          athleteId={selectedAthleteId}
          onBack={() => setCurrentView('personal-athletes')}
          onRegisterMeasurement={() => setIsMeasurementModalOpen(true)}
        />;
      // ... outros casos
    }
  }
  
  // Lógica existente para atleta
  // ...
};
```

---

## 4. MOCK DATA

### 4.1 Estrutura de Dados

```typescript
// Mock de Personal
export const mockPersonal = {
  id: 'personal-1',
  userId: 'user-1',
  name: 'Professor Carlos Silva',
  email: 'carlos@personal.com',
  cref: '012345-G/SP',
  specialties: ['Hipertrofia', 'Estética', 'Bodybuilding'],
  bio: 'Personal trainer especializado em estética clássica e proporções áureas.',
  plan: 'PERSONAL_PRO',
  maxAthletes: 20,
  athleteCount: 12,
  createdAt: '2023-01-15',
};

// Mock de Atletas vinculados
export const mockPersonalAthletes = [
  {
    id: 'athlete-1',
    name: 'Ana Lima',
    email: 'ana@email.com',
    avatarUrl: null,
    score: 92,
    scoreVariation: 3,
    ratio: 1.58,
    lastMeasurement: '2026-02-07',
    status: 'active',
    linkedSince: '2023-03-10',
  },
  {
    id: 'athlete-2',
    name: 'Carlos Souza',
    email: 'carlos@email.com',
    avatarUrl: null,
    score: 88,
    scoreVariation: 1,
    ratio: 1.52,
    lastMeasurement: '2026-02-05',
    status: 'active',
    linkedSince: '2023-05-22',
  },
  {
    id: 'athlete-3',
    name: 'João Silva',
    email: 'joao@email.com',
    avatarUrl: null,
    score: 72,
    scoreVariation: -3,
    ratio: 1.42,
    lastMeasurement: '2026-01-20',
    status: 'inactive',
    linkedSince: '2023-08-15',
  },
  // ... total de 12 atletas
];

// Mock de Convites Pendentes
export const mockPendingInvites = [
  {
    id: 'invite-1',
    email: 'novo@email.com',
    name: 'Novo Aluno',
    status: 'PENDING',
    sentAt: '2026-02-05',
    expiresAt: '2026-02-12',
  },
];
```

---

## 5. ESTADOS E HOOKS

### 5.1 Custom Hooks

```typescript
// hooks/usePersonalDashboard.ts
export function usePersonalDashboard() {
  const [stats, setStats] = useState(mockPersonalStats);
  const [athletesNeedingAttention, setAthletesNeedingAttention] = useState(mockAthletesNeedingAttention);
  const [topPerformers, setTopPerformers] = useState(mockTopPerformers);
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity);
  
  // Futuramente: fetch real data
  // useEffect(() => {
  //   fetchPersonalDashboardData().then(setStats);
  // }, []);
  
  return {
    stats,
    athletesNeedingAttention,
    topPerformers,
    recentActivity,
  };
}

// hooks/usePersonalAthletes.ts
export function usePersonalAthletes() {
  const [athletes, setAthletes] = useState(mockPersonalAthletes);
  const [filter, setFilter] = useState<AthleteStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAthletes = useMemo(() => {
    let result = athletes;
    
    if (filter !== 'all') {
      result = result.filter(a => a.status === filter);
    }
    
    if (searchQuery) {
      result = result.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [athletes, filter, searchQuery]);
  
  return {
    athletes: filteredAthletes,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
  };
}
```

---

## 6. DESIGN TOKENS

### 6.1 Cores Específicas do Personal

```typescript
// Adicionar em tokens/colors.ts
export const colors = {
  // ... cores existentes
  
  // Personal Dashboard
  personal: {
    primary: '#8B5CF6',      // Roxo - identidade do personal
    accent: '#F59E0B',       // Amber - destaques
    success: '#10B981',      // Verde - alunos ativos
    warning: '#F59E0B',      // Amarelo - atenção
    danger: '#EF4444',       // Vermelho - crítico
  },
  
  // Status dos Atletas
  athleteStatus: {
    active: '#10B981',       // Verde
    inactive: '#F59E0B',     // Amarelo
    attention: '#EF4444',    // Vermelho
  },
};
```

---

## 7. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Estrutura Base
- [x] Criar pasta `/components/Personal/`
- [x] Criar `PersonalDashboard.tsx` (estrutura básica)
- [x] Criar `PersonalAthletesList.tsx` (estrutura básica)
- [x] Criar mock data em `/src/mocks/personal.ts`
- [x] Atualizar `App.tsx` com lógica de Personal
- [x] Atualizar `Sidebar.tsx`

### Fase 2: Dashboard
- [x] Implementar `PersonalStatsCard.tsx`
- [x] Implementar seção "Resumo Geral"
- [x] Implementar seção "Alunos que Precisam de Atenção"
- [x] Implementar seção "Top Performers"
- [x] Implementar seção "Atividade Recente"
- [ ] Implementar seção "Próximas Ações"

### Fase 3: Lista de Alunos
- [x] Implementar busca e filtros
- [x] Implementar tabela de alunos
- [x] Implementar badges de status
- [ ] Implementar paginação
- [x] Implementar ações por linha

### Fase 4: Detalhe do Aluno
- [x] Criar `AthleteDetailsView.tsx` (equivalente a PersonalAthleteDetail)
- [x] Implementar header do atleta
- [x] Implementar tabs de navegação
- [x] Integrar componentes existentes do atleta
- [x] Implementar barra de ações

### Fase 5: Modais
- [x] Criar `AthleteInvitationModal` / `PersonalInvitationModal`
- [x] Implementar validações de convite
- [x] Criar modais de medição via fluxo de avaliação
- [x] Implementar formulário de medições
- [x] Implementar salvamento via Supabase

### Fase 6: Hooks e Estado
- [x] Criar `usePersonalDashboardStore.ts` (via Zustand)
- [x] Personal Athletes integrado com `athleteStore.ts`
- [ ] Criar `usePersonalInvites.ts`
- [ ] Criar `usePersonalMeasurements.ts`

### Fase 7: Refinamento
- [x] Adicionar animações e transições
- [x] Implementar loading states
- [x] Implementar error states
- [ ] Adicionar tooltips e ajuda contextual
- [x] Testes de responsividade

---

## 8. PRÓXIMOS PASSOS

1. **Features Ainda Não Implementadas**
   - Seção "Próximas Ações" no dashboard
   - Paginação na lista de alunos
   - Tooltips e ajuda contextual

2. **Features Avançadas**
   - Relatórios consolidados
   - Exportação de dados
   - Agendamento de medições

3. **Academia (Fase Futura)**
   - Dashboard da Academia
   - Gerenciamento de Personais
   - Relatórios consolidados multi-nível

---

## 9. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### 9.1 Componentes Implementados

| Componente | Caminho | Tamanho | Descrição |
|------------|---------|---------|-----------|
| PersonalDashboard | `templates/Personal/PersonalDashboard.tsx` | 16.5K | Dashboard principal com stats, lista de atenção, top performers |
| PersonalStatsCard | `templates/Personal/PersonalStatsCard.tsx` | 4.4K | Card de estatísticas com ícone e trend |
| PersonalAthletesList | `templates/Personal/PersonalAthletesList.tsx` | 16.9K | Lista completa de alunos com filtros e busca |
| AthleteDetailsView | `templates/Personal/AthleteDetailsView.tsx` | 74.9K | Visão detalhada do aluno (maior componente do app) |
| AthleteContextSection | `templates/Personal/AthleteContextSection.tsx` | 18.2K | Seção de contexto do atleta |
| PersonalAssessmentView | `templates/Personal/PersonalAssessmentView.tsx` | 13.7K | Visão de avaliação pelo personal |
| PersonalCoachView | `templates/Personal/PersonalCoachView.tsx` | 33.4K | Coach IA do personal (Plano de Evolução) |
| PersonalCoachDashboard | `templates/Personal/PersonalCoachDashboard.tsx` | 722B | Dashboard do coach (wrapper) |
| PersonalEvolutionView | `templates/Personal/PersonalEvolutionView.tsx` | 5.9K | Evolução de aluno selecionado |
| PersonalProfilePage | `templates/Personal/PersonalProfilePage.tsx` | 13K | Perfil/conta do personal |
| PersonalAthleteSelector | `templates/Personal/PersonalAthleteSelector.tsx` | 3.1K | Seletor de atleta (dropdown) |
| DiagnosticoView | `templates/Personal/DiagnosticoView.tsx` | 41.4K | Diagnóstico do Plano de Evolução |
| TreinoView | `templates/Personal/TreinoView.tsx` | 29.2K | Treino do Plano de Evolução |
| DietaView | `templates/Personal/DietaView.tsx` | 56.2K | Dieta do Plano de Evolução |
| PlanoEvolucaoHelpers | `templates/Personal/PlanoEvolucaoHelpers.ts` | 5.3K | Helpers do plano de evolução |
| PlanoEvolucaoShared | `templates/Personal/PlanoEvolucaoShared.tsx` | 5.9K | Componentes compartilhados do plano |
