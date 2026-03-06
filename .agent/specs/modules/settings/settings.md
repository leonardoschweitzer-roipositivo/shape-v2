# SPEC: Tela de Configurações - VITRU IA

## Documento de Especificação da Tela de Settings

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (A Matemática do Físico Perfeito)

---

## 1. VISÃO GERAL

A tela de **Configurações** permite que cada tipo de usuário gerencie seus dados, preferências e assinatura.

### 1.1 Estrutura por Perfil

| Seção | 🏢 Academia | 🏋️ Personal | 💪 Atleta |
|-------|:-----------:|:------------:|:---------:|
| Conta | ✅ | ✅ | ✅ |
| Empresa | ✅ | ❌ | ❌ |
| Profissional | ❌ | ✅ | ❌ |
| Metodologia | ❌ | ✅ | ❌ |
| Branding | ✅ | ❌ | ❌ |
| Personais | ✅ | ❌ | ❌ |
| Atletas | ❌ | ✅ | ❌ |
| Plano | ✅ | ✅ | ✅ |
| Notificações | ✅ | ✅ | ✅ |
| Privacidade | ❌ | ✅ | ✅ |
| Segurança | ✅ | ✅ | ✅ |
| Integrações | ✅ | ✅ | ❌ |
| Meus Dados | ❌ | ❌ | ✅ |

> **Nota:** Para o Atleta, as seções **Perfil**, **Medidas**, **Saúde** e **VITRÚVIO** são gerenciadas na **Tela de Perfil**, não em Configurações.

---

## 2. CONFIGURAÇÕES: ATLETA

### 2.1 Menu de Seções

```typescript
const ATHLETE_SETTINGS_SECTIONS = [
  { id: 'account', icon: 'User', label: 'Conta', description: 'Email, senha e dados de acesso' },
  { id: 'notifications', icon: 'Bell', label: 'Notificações', description: 'Alertas e lembretes' },
  { id: 'privacy', icon: 'Shield', label: 'Privacidade', description: 'Visibilidade e compartilhamento' },
  { id: 'security', icon: 'Lock', label: 'Segurança', description: 'Senha, 2FA e sessões' },
  { id: 'plan', icon: 'CreditCard', label: 'Plano', description: 'Assinatura e pagamentos' },
  { id: 'data', icon: 'Database', label: 'Meus Dados', description: 'Exportar ou excluir dados' },
]
```

> **Nota:** As seções Perfil, Medidas, Saúde e VITRÚVIO foram movidas para a **Tela de Perfil** para melhor separação de responsabilidades.

### 2.2 Seção: Conta

**Campos:**
- Email atual (verificado/não verificado)
- Botão "Alterar email"
- Contas conectadas (Google, Apple)
- Vinculação com Personal (se existir)

```
┌─────────────────────────────────────────────────────────────┐
│  📧 EMAIL                                                   │
│  joao.atleta@email.com  ✓ Verificado                        │
│  [Alterar email]                                            │
├─────────────────────────────────────────────────────────────┤
│  🔗 CONTAS CONECTADAS                                       │
│  🍎 Apple - joao@icloud.com          [Desconectar]          │
│  G  Google                           [Conectar →]           │
├─────────────────────────────────────────────────────────────┤
│  👤 VINCULAÇÃO                                              │
│  Vinculado a: João Carlos Silva (Personal)                  │
│  Desde: 10/01/2026                                          │
│  [Solicitar desvinculação]                                  │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Seção: Perfil

**Campos:**
- Foto de perfil
- Nome
- Data de nascimento
- Sexo biológico (para cálculos)
- Objetivo principal
- Sistema de unidades (Métrico/Imperial)
- Método de proporção preferido
- Idioma
- Tema (Escuro/Claro/Sistema)

### 2.4 Seção: Medidas Estruturais

**Campos:**
- Altura (cm)
- Circunferência do Punho (cm)
- Circunferência do Tornozelo (cm)
- Circunferência do Joelho (cm) - opcional
- Largura da Pelve (cm) - opcional

**Exibe também:**
- Tabela com ideais calculados baseados nas estruturais
- Aviso de que alterar recalcula os ideais

### 2.5 Seção: Saúde (VITRÚVIO)

**Dados confidenciais para personalização do Coach IA:**

```typescript
interface HealthSettings {
  // Condições de Saúde
  condicoesSaude: {
    nome: string           // "Hipertensão", "Diabetes"
    severidade: 'leve' | 'moderada' | 'grave'
    controlada: boolean
    medicacao?: string
  }[]
  
  // Lesões
  lesoes: {
    local: string          // "Ombro esquerdo"
    tipo: string           // "Tendinite"
    status: 'ativa' | 'recuperacao' | 'recuperada'
    restricoes: string[]   // "Evitar press acima da cabeça"
  }[]
  
  // Medicamentos
  medicamentos: {
    nome: string
    dosagem: string
    frequencia: string
    motivo: string
  }[]
  
  // Suplementos
  suplementos: {
    nome: string
    dosagem: string
    frequencia: string
    objetivo: string
  }[]
  
  // Ergogênicos (confidencial)
  ergogenicos: 'nenhum' | 'trt' | 'anabolizantes' | 'emagrecedores' | 'prefiro_nao_informar'
}
```

**Privacidade:** Estes dados NÃO são visíveis para Personal ou Academia.

### 2.6 Seção: VITRÚVIO (PRO)

**Configurações do Coach IA:**

```typescript
interface VitruvioSettings {
  // Perfil de Vida
  lifestyle: {
    profissao: string
    rotinaDiaria: 'sedentaria' | 'leve' | 'moderada' | 'ativa' | 'muito_ativa'
    horasSono: number        // 4-12
    nivelEstresse: 'baixo' | 'moderado' | 'alto' | 'muito_alto'
  }
  
  // Experiência de Treino
  training: {
    tempoTreinando: 'menos_1_ano' | '1_3_anos' | '3_5_anos' | '5_10_anos' | 'mais_10_anos'
    frequenciaSemanal: number  // 2-7
    duracaoTreino: '30_45' | '45_60' | '60_90' | 'mais_90'
    localTreino: 'academia_completa' | 'academia_simples' | 'home_gym' | 'casa_basico' | 'misto'
    diasDisponiveis: string[]  // ['seg', 'ter', 'qua', 'qui']
  }
  
  // Alimentação
  nutrition: {
    dietaAtual: 'sem_restricao' | 'vegetariana' | 'vegana' | 'low_carb' | 'cetogenica' | 'outra'
    refeicoesdia: number       // 2-6
    alergias: string[]
    sabeCozinhar: boolean
    orcamento: 'baixo' | 'moderado' | 'alto' | 'sem_limite'
  }
  
  // Barra de progresso
  profileCompletion: number    // 0-100%
}
```

### 2.7 Seção: Notificações

**Configurações:**

| Notificação | Push | Email | Padrão |
|-------------|:----:|:-----:|:------:|
| Lembrete de medição | ✅ | ❌ | Semanal (Dom 20h) |
| Insights do VITRÚVIO | ✅ | ✅ | Ativo |
| Conquistas e marcos | ✅ | ❌ | Ativo |
| Relatório semanal | ❌ | ✅ | Ativo |
| Novidades do app | ✅ | ❌ | Ativo |
| Promoções | ❌ | ❌ | Inativo |

### 2.8 Seção: Privacidade

**Configurações:**

```typescript
interface PrivacySettings {
  // Visibilidade pública
  public: {
    aparecerHallDeuses: boolean     // default: true
    mostrarFotoRanking: boolean     // default: false
    permitirComparacoesAnonimas: boolean  // default: true
  }
  
  // Visibilidade para Personal (se vinculado)
  personal: {
    // Sempre visível (não configurável)
    medidasEvolucao: true   // readonly
    scoresProporções: true  // readonly
    
    // Configurável
    fotosProgresso: boolean // default: true
    
    // Nunca visível (não configurável)
    dadosSaude: false       // readonly
    medicamentos: false     // readonly
    ergogenicos: false      // readonly
  }
  
  // Uso de dados
  data: {
    analyticsDeUso: boolean         // default: true
    dadosParaPesquisa: boolean      // default: false
  }
}
```

### 2.9 Seção: Segurança

**Funcionalidades:**
- Alterar senha
- Ativar/Desativar 2FA
- Ver sessões ativas
- Encerrar outras sessões
- Histórico de atividade (logins, alterações)

### 2.10 Seção: Plano

**Exibe:**
- Plano atual (FREE ou PRO)
- Se coberto por Personal: mostra vínculo
- Próxima cobrança
- Método de pagamento
- Histórico de pagamentos
- Botões: Mudar plano, Cancelar

### 2.11 Seção: Meus Dados

**Funcionalidades:**
- Exportar dados (JSON ou CSV)
- Excluir conta (com confirmação)

---

## 3. CONFIGURAÇÕES: PERSONAL TRAINER

### 3.1 Menu de Seções

```typescript
const PERSONAL_SETTINGS_SECTIONS = [
  { id: 'account', icon: 'User', label: 'Conta' },
  { id: 'professional', icon: 'Briefcase', label: 'Profissional' },
  { id: 'methodology', icon: 'Brain', label: 'Metodologia', badge: 'VITRÚVIO' },
  { id: 'athletes', icon: 'Users', label: 'Atletas' },
  { id: 'notifications', icon: 'Bell', label: 'Notificações' },
  { id: 'privacy', icon: 'Shield', label: 'Privacidade' },
  { id: 'security', icon: 'Lock', label: 'Segurança' },
  { id: 'plan', icon: 'CreditCard', label: 'Plano' },
  { id: 'integrations', icon: 'Plug', label: 'Integrações' },
]
```

### 3.2 Seção: Profissional

**Campos:**

```typescript
interface ProfessionalSettings {
  // Foto
  avatarUrl: string | null
  
  // Dados pessoais
  name: string
  phone: string
  city: string
  state: string
  
  // Registro
  cref: string | null
  crefState: string | null
  crefVerified: boolean     // readonly
  yearsExperience: string
  
  // Especialidades (máx 5)
  specialties: Specialty[]
  
  // Bio
  bio: string              // máx 500 chars
  
  // Redes
  instagram: string | null
  website: string | null
}

type Specialty = 
  | 'hypertrophy' | 'weight_loss' | 'strength' | 'bodybuilding'
  | 'functional' | 'sports' | 'rehabilitation' | 'elderly'
  | 'prenatal' | 'online'
```

### 3.3 Seção: Metodologia (VITRÚVIO)

**Importante para IA alinhar planos:**

```typescript
interface MethodologySettings {
  // Abordagem de treino (múltipla escolha)
  trainingApproach: TrainingApproach[]
  
  // Métodos de avaliação (múltipla escolha)
  assessmentMethods: AssessmentMethod[]
  
  // Frequência de reavaliação
  reassessmentFrequency: 'weekly' | 'biweekly' | 'monthly' | 'bimonthly' | 'quarterly'
  
  // Periodização
  usesPeriodization: boolean
  periodizationType?: 'linear' | 'undulating' | 'block' | 'conjugate'
}

type TrainingApproach = 'volume' | 'intensity' | 'frequency' | 'balanced' | 'progressive' | 'instinctive'
type AssessmentMethod = 'tape_measure' | 'skinfold' | 'bioimpedance' | 'photos' | 'strength_tests' | 'functional_tests'
```

**Uso pela IA:**
- VITRÚVIO gera planos seguindo a metodologia do personal
- Lembretes de reavaliação baseados na frequência configurada
- Periodização dos treinos segue o tipo preferido

### 3.4 Seção: Atletas

**Funcionalidades:**
- Resumo: X/Y atletas (limite do plano)
- Convites pendentes (com opção de reenviar/cancelar)
- Lista de atletas ativos (com score, última medição)
- Botão: Convidar novo atleta
- Link de convite compartilhável
- Ações: Ver perfil, Desvincular

```
┌─────────────────────────────────────────────────────────────┐
│  📊 RESUMO                                                  │
│  Atletas: 8/10  ████████░░  [Fazer upgrade]                 │
├─────────────────────────────────────────────────────────────┤
│  📨 CONVITES PENDENTES                                      │
│  maria@email.com - Enviado há 2 dias - [Reenviar] [Cancelar]│
│  [+ Convidar novo atleta]                                   │
├─────────────────────────────────────────────────────────────┤
│  👥 ATLETAS ATIVOS                                          │
│  🔍 Buscar...                                               │
│                                                             │
│  👤 João Silva         Score: 78   Medição: Há 3 dias       │
│  👤 Maria Santos       Score: 82   Medição: Há 7 dias ⚠️    │
│  ...                                                        │
├─────────────────────────────────────────────────────────────┤
│  🔗 LINK DE CONVITE                                         │
│  vitruia.com/convite/abc123  [Copiar]                       │
└─────────────────────────────────────────────────────────────┘
```

### 3.5 Seção: Plano

**Exibe:**
- Plano atual (BASIC/PRO/UNLIMITED)
- Se vinculado a Academia: mostra que é coberto
- Uso de atletas: X/Y
- Opções de upgrade
- Pagamentos e faturamento

---

## 4. CONFIGURAÇÕES: ACADEMIA

### 4.1 Menu de Seções

```typescript
const ACADEMY_SETTINGS_SECTIONS = [
  { id: 'account', icon: 'User', label: 'Conta' },
  { id: 'company', icon: 'Building', label: 'Empresa' },
  { id: 'branding', icon: 'Palette', label: 'Branding', badge: 'PRO' },
  { id: 'personals', icon: 'UserCog', label: 'Personais' },
  { id: 'plan', icon: 'CreditCard', label: 'Plano' },
  { id: 'integrations', icon: 'Plug', label: 'Integrações', badge: 'UNLIMITED' },
  { id: 'reports', icon: 'BarChart', label: 'Relatórios' },
  { id: 'notifications', icon: 'Bell', label: 'Notificações' },
  { id: 'security', icon: 'Lock', label: 'Segurança' },
]
```

### 4.2 Seção: Empresa

**Campos:**

```typescript
interface CompanySettings {
  // Identificação
  businessName: string      // Nome fantasia
  legalName: string | null  // Razão social
  cnpj: string | null
  
  // Contato
  phone: string
  email: string
  website: string | null
  
  // Endereço
  address: string | null
  city: string
  state: string
  zipCode: string | null
  
  // Responsável
  ownerName: string
  ownerRole: string
  ownerPhone: string | null
  
  // Tamanho (para benchmarks)
  employeeCount: '1-5' | '6-15' | '16-30' | '31-50' | '50+'
  monthlyClients: '1-50' | '51-200' | '201-500' | '501-1000' | '1000+'
}
```

### 4.3 Seção: Branding (PRO)

**White-label:**

```typescript
interface BrandingSettings {
  // Visual
  logoUrl: string | null
  primaryColor: string      // hex, default: #00D9A5
  secondaryColor: string | null
  
  // Preview em tempo real
  // Mostra como ficará em relatórios
}
```

**Funcionalidades:**
- Upload de logo (PNG/JPG, máx 2MB)
- Seletor de cor primária
- Preview de como aparece em relatórios
- Reset para padrão VITRU IA

### 4.4 Seção: Personais

**Funcionalidades:**
- Resumo: X/Y personais (limite do plano)
- Convites pendentes
- Lista de personais (com quantidade de atletas)
- Botão: Convidar novo personal
- Ações: Ver perfil, Definir limite de atletas, Desvincular

```
┌─────────────────────────────────────────────────────────────┐
│  📊 RESUMO                                                  │
│  Personais: 4/5  ████████░░                                 │
│  Total atletas: 32                                          │
├─────────────────────────────────────────────────────────────┤
│  📨 CONVITES PENDENTES                                      │
│  carlos@email.com - Enviado há 3 dias                       │
│  [+ Convidar novo personal]                                 │
├─────────────────────────────────────────────────────────────┤
│  👥 PERSONAIS ATIVOS                                        │
│                                                             │
│  🏋️ João Carlos Silva                                       │
│     CREF: 012345-G/SP  │  Atletas: 8                        │
│     [Ver] [Definir limite] [Desvincular]                    │
│                                                             │
│  🏋️ Maria Santos                                            │
│     CREF: 067890-G/SP  │  Atletas: 12                       │
│     [Ver] [Definir limite] [Desvincular]                    │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

### 4.5 Seção: Plano

**Exibe:**
- Plano atual (BASIC/PRO/UNLIMITED)
- Uso: Personais e Atletas totais
- Features do plano
- Opções de upgrade
- Histórico de faturamento

### 4.6 Seção: Integrações (UNLIMITED)

**APIs e serviços:**
- API Keys para integração externa
- Webhooks configuráveis
- Conexão com sistemas de gestão

---

## 5. COMPONENTES COMUNS

### 5.1 Layout da Tela

```typescript
interface SettingsLayoutProps {
  sections: SettingsSection[]
  activeSection: string
  userRole: 'ATHLETE' | 'PERSONAL' | 'ACADEMY'
}

function SettingsLayout({ sections, activeSection, userRole }: SettingsLayoutProps) {
  return (
    <div className="settings-layout">
      {/* Header */}
      <header className="settings-header">
        <h1>SETTINGS</h1>
        <Badge>{userRole}</Badge>
      </header>
      
      {/* Content */}
      <div className="settings-content">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          {sections.map(section => (
            <SettingsNavItem
              key={section.id}
              {...section}
              active={activeSection === section.id}
            />
          ))}
        </aside>
        
        {/* Main */}
        <main className="settings-main">
          <SettingsSection id={activeSection} />
        </main>
      </div>
    </div>
  )
}
```

### 5.2 Card de Configuração

```typescript
interface SettingsCardProps {
  icon: string
  title: string
  description?: string
  children: React.ReactNode
}

function SettingsCard({ icon, title, description, children }: SettingsCardProps) {
  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <Icon name={icon} />
        <div>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
      </div>
      <div className="settings-card-content">
        {children}
      </div>
    </div>
  )
}
```

### 5.3 Toggle de Configuração

```typescript
interface SettingsToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}
```

### 5.4 Feedback de Salvamento

```typescript
// Auto-save com debounce
const AUTOSAVE_DELAY = 1000 // ms

// Estados visuais
type SaveState = 'idle' | 'saving' | 'saved' | 'error'

// Feedback inline
<span className="save-status">
  {state === 'saving' && '💾 Salvando...'}
  {state === 'saved' && '✓ Salvo'}
  {state === 'error' && '⚠️ Erro ao salvar'}
</span>
```

---

## 6. VALIDAÇÕES E REGRAS

### 6.1 Validações por Campo

```typescript
const SETTINGS_VALIDATIONS = {
  // Comum
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Formato: (11) 99999-9999'),
  
  // Medidas
  altura: z.number().min(100).max(250),
  punho: z.number().min(10).max(25),
  tornozelo: z.number().min(15).max(35),
  
  // Personal
  cref: z.string().regex(/^\d{6}-[GP]$/, 'Formato: 012345-G'),
  bio: z.string().max(500),
  specialties: z.array(z.string()).max(5),
  
  // Academia
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/),
}
```

### 6.2 Permissões de Edição

| Campo | Quem pode editar |
|-------|-----------------|
| Email | Próprio usuário |
| Senha | Próprio usuário |
| Medidas estruturais | Atleta |
| Dados de saúde | Atleta (privado) |
| Metodologia | Personal |
| Limite de atletas (Personal vinculado) | Academia |
| Branding | Academia |

### 6.3 Ações Críticas

Requerem confirmação:
- Alterar email
- Alterar senha
- Desvincular de Personal/Academia
- Cancelar assinatura
- Excluir conta

---

## 7. API ENDPOINTS

### 7.1 Settings

```typescript
// GET /api/settings
// Retorna todas as configurações do usuário logado

// PATCH /api/settings/:section
// Atualiza uma seção específica
// Body: dados da seção

// Exemplos:
PATCH /api/settings/profile
PATCH /api/settings/health
PATCH /api/settings/methodology
PATCH /api/settings/notifications
PATCH /api/settings/privacy
```

### 7.2 Ações Específicas

```typescript
// POST /api/settings/change-email
// POST /api/settings/change-password
// POST /api/settings/enable-2fa
// POST /api/settings/disable-2fa
// POST /api/settings/export-data
// DELETE /api/settings/delete-account

// POST /api/settings/unlink-personal (Atleta)
// POST /api/settings/unlink-athlete/:id (Personal)
// POST /api/settings/unlink-personal/:id (Academia)
```

---

## 8. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Settings para Atleta, Personal e Academia |
| 1.1 | Mar/2026 | Atualização com estado real da implementação |

---

## 9. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### 9.1 Componentes Implementados

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| NotificationSettingsPage | `pages/NotificationSettingsPage.tsx` (12.4K) | Configurações de notificação do personal (toggles por categoria, horários) |
| PersonalProfilePage | `templates/Personal/PersonalProfilePage.tsx` (13K) | Perfil/conta do personal (dados profissionais, foto, etc.) |
| AthleteSettingsPage | `pages/AthleteSettingsPage/` | Configurações do atleta |

### 9.2 O Que Está Implementado ✅

- [x] Configurações de notificação do Personal (seção completa)
- [x] Perfil profissional do Personal (nome, foto, dados)
- [x] Logout
- [x] Dark mode (via toggle)

### 9.3 O Que NÃO Está Implementado

- [ ] Seção Conta (alteração de email, 2FA, sessões ativas)
- [ ] Seção Profissional completa (CREF, especialidades, bio)
- [ ] Seção Metodologia (abordagem de treino, periodização)
- [ ] Seção Atletas (gestão de convites via settings)
- [ ] Seção Privacidade (visibilidade no ranking, compartilhamento)
- [ ] Seção Segurança (senha, 2FA, histórico de atividade)
- [ ] Seção Plano (assinatura, pagamentos)
- [ ] Seção Integrações (API keys, webhooks)
- [ ] Seção Meus Dados (exportar/excluir dados LGPD)
- [ ] Configurações do tipo Academia (empresa, branding, personais)
- [ ] Configurações do tipo Atleta completas (saúde, VITRÚVIO, medidas)

---

**VITRU IA Settings v1.1**  
*Conta • Perfil • Saúde • VITRÚVIO • Plano • Privacidade • Segurança*
