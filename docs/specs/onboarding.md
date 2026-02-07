# SPEC: Onboarding - VITRU IA

## Documento de Especificação do Onboarding

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA (Sistema de Análise de Proporções Corporais)

---

## 1. VISÃO GERAL

O onboarding é o momento mais crítico da jornada do usuário. Em 5 minutos, precisamos:
- Capturar o interesse
- Coletar dados essenciais
- Entregar valor imediato
- Criar hábito de uso

### 1.1 Objetivos do Onboarding

| Objetivo | Métrica | Meta |
|----------|---------|------|
| **Completar setup** | % usuários que terminam | > 70% |
| **Primeira medição** | % que registram medida | > 60% |
| **Retorno D1** | % que voltam no dia seguinte | > 40% |
| **Tempo de onboarding** | Minutos para completar | < 5 min |

### 1.2 Princípios do Onboarding

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRINCÍPIOS DO ONBOARDING                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎯 PROGRESSIVO       Não pedir tudo de uma vez                 │
│  ⚡ RÁPIDO            Máximo 5 minutos                          │
│  🎁 VALOR IMEDIATO    Mostrar resultado antes de pedir mais     │
│  📱 MOBILE-FIRST      Otimizado para celular                    │
│  🔄 RECUPERÁVEL       Permitir voltar e corrigir                │
│  ⏭️ SKIPÁVEL          Permitir pular (com consequências claras) │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. FLUXO GERAL

### 2.1 Visão do Fluxo Completo

```
┌──────────────┐
│   SPLASH     │
│   SCREEN     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  1. WELCOME  │ ──── Proposta de valor
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  2. SIGNUP   │ ──── Email/Social login
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  3. PROFILE  │ ──── Nome, gênero, objetivo
│    BÁSICO    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  4. MEDIDAS  │ ──── Altura, punho, tornozelo,
│ ESTRUTURAIS  │      joelho, pelve
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  5. TUTORIAL │ ──── Como medir corretamente
│   DE MEDIÇÃO │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  6. PRIMEIRA │ ──── 8 medidas variáveis
│    MEDIÇÃO   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  7. REVEAL   │ ──── Animação do score
│   DO SCORE   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 8. DASHBOARD │ ──── Tour guiado
│     TOUR     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  DASHBOARD   │
│   COMPLETO   │
└──────────────┘
```

### 2.2 Estados Possíveis

```typescript
type OnboardingStep =
  | 'welcome'              // Tela de boas-vindas
  | 'signup'               // Cadastro/login
  | 'profile-basic'        // Dados básicos
  | 'structural-measures'  // Medidas estruturais
  | 'measurement-tutorial' // Tutorial de medição
  | 'first-measurement'    // Primeira medição
  | 'score-reveal'         // Revelação do score
  | 'dashboard-tour'       // Tour pelo dashboard
  | 'completed'            // Onboarding completo

interface OnboardingState {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  skippedSteps: OnboardingStep[]
  startedAt: Date
  completedAt: Date | null
  
  // Dados coletados
  collectedData: {
    // Profile básico
    name?: string
    email?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER'
    birthDate?: Date
    goal?: UserGoal
    experience?: ExperienceLevel
    
    // Medidas estruturais
    altura?: number
    punho?: number
    tornozelo?: number
    joelho?: number
    pelve?: number
    
    // Primeira medição
    firstMeasurement?: MeasurementInput
  }
}

type UserGoal = 
  | 'aesthetics'      // Estética geral
  | 'competition'     // Competição
  | 'health'          // Saúde
  | 'strength'        // Força

type ExperienceLevel =
  | 'beginner'        // < 1 ano de treino
  | 'intermediate'    // 1-3 anos
  | 'advanced'        // 3+ anos
```

---

## 3. TELAS DETALHADAS

### 3.1 Tela 1: Welcome

**Objetivo:** Comunicar proposta de valor e gerar interesse.

```
┌─────────────────────────────────────────┐
│                                         │
│              [LOGO VITRU IA]             │
│                                         │
│         ━━━━━━━━━━━━━━━━━━━━           │
│                                         │
│     DESCUBRA SEU FÍSICO IDEAL          │
│                                         │
│   Análise de proporções corporais       │
│   baseada na Proporção Áurea e          │
│   padrões de fisiculturismo.            │
│                                         │
│                                         │
│         ┌─────────────────┐             │
│         │                 │             │
│         │   [Ilustração   │             │
│         │    de silhueta  │             │
│         │    com medidas] │             │
│         │                 │             │
│         └─────────────────┘             │
│                                         │
│                                         │
│   ● ○ ○ ○                              │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │         COMEÇAR AGORA           │   │
│   └─────────────────────────────────┘   │
│                                         │
│        Já tem conta? Entrar             │
│                                         │
└─────────────────────────────────────────┘
```

**Variação: Carousel de benefícios (swipe)**

```typescript
const WELCOME_SLIDES = [
  {
    title: "DESCUBRA SEU FÍSICO IDEAL",
    description: "Análise de proporções baseada na Proporção Áurea",
    image: "/onboarding/slide-1.png",
  },
  {
    title: "ACOMPANHE SUA EVOLUÇÃO",
    description: "Veja seu progresso ao longo do tempo com gráficos detalhados",
    image: "/onboarding/slide-2.png",
  },
  {
    title: "COACH IA PERSONALIZADO",
    description: "Receba dicas e recomendações baseadas nos seus dados",
    image: "/onboarding/slide-3.png",
  },
]
```

**Componente:**

```typescript
interface WelcomeScreenProps {
  onStart: () => void
  onLogin: () => void
}

function WelcomeScreen({ onStart, onLogin }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  return (
    <div className="welcome-screen">
      <Logo />
      
      <Carousel
        slides={WELCOME_SLIDES}
        current={currentSlide}
        onChange={setCurrentSlide}
      />
      
      <Pagination
        total={WELCOME_SLIDES.length}
        current={currentSlide}
      />
      
      <Button variant="primary" onClick={onStart}>
        COMEÇAR AGORA
      </Button>
      
      <TextButton onClick={onLogin}>
        Já tem conta? <strong>Entrar</strong>
      </TextButton>
    </div>
  )
}
```

---

### 3.2 Tela 2: Signup

**Objetivo:** Criar conta com mínimo de fricção.

```
┌─────────────────────────────────────────┐
│  ←                                      │
│                                         │
│         CRIE SUA CONTA                  │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  📧  seu@email.com              │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  🔒  ••••••••                   │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │         CRIAR CONTA             │   │
│   └─────────────────────────────────┘   │
│                                         │
│         ────── ou ──────                │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  [G]  Continuar com Google      │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  []  Continuar com Apple       │   │
│   └─────────────────────────────────┘   │
│                                         │
│                                         │
│   Ao criar conta, você concorda com     │
│   os Termos de Uso e Política de        │
│   Privacidade.                          │
│                                         │
└─────────────────────────────────────────┘
```

**Componente:**

```typescript
interface SignupScreenProps {
  onSignup: (data: SignupData) => Promise<void>
  onGoogleAuth: () => Promise<void>
  onAppleAuth: () => Promise<void>
  onBack: () => void
}

const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

function SignupScreen({ onSignup, onGoogleAuth, onAppleAuth, onBack }: SignupScreenProps) {
  const form = useForm({
    resolver: zodResolver(signupSchema),
  })
  
  return (
    <div className="signup-screen">
      <Header onBack={onBack} />
      
      <h1>CRIE SUA CONTA</h1>
      
      <form onSubmit={form.handleSubmit(onSignup)}>
        <InputField
          icon={<Mail />}
          placeholder="seu@email.com"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />
        
        <InputField
          icon={<Lock />}
          type="password"
          placeholder="Senha"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />
        
        <Button type="submit" loading={form.formState.isSubmitting}>
          CRIAR CONTA
        </Button>
      </form>
      
      <Divider>ou</Divider>
      
      <SocialButton provider="google" onClick={onGoogleAuth}>
        Continuar com Google
      </SocialButton>
      
      <SocialButton provider="apple" onClick={onAppleAuth}>
        Continuar com Apple
      </SocialButton>
      
      <LegalText />
    </div>
  )
}
```

---

### 3.3 Tela 3: Profile Básico

**Objetivo:** Coletar informações básicas para personalização.

```
┌─────────────────────────────────────────┐
│  ←                           Passo 1/4  │
│                                         │
│         VAMOS PERSONALIZAR              │
│         SUA EXPERIÊNCIA                 │
│                                         │
│   Como podemos te chamar?               │
│   ┌─────────────────────────────────┐   │
│   │  João                           │   │
│   └─────────────────────────────────┘   │
│                                         │
│   Qual seu sexo biológico?              │
│   ┌───────────┐ ┌───────────┐           │
│   │ Masculino │ │ Feminino  │           │
│   └───────────┘ └───────────┘           │
│   (usado para cálculos de proporção)    │
│                                         │
│   Qual seu principal objetivo?          │
│   ┌─────────────────────────────────┐   │
│   │ ✨ Estética geral               │   │
│   └─────────────────────────────────┘   │
│   ┌─────────────────────────────────┐   │
│   │ 🏆 Competição                   │   │
│   └─────────────────────────────────┘   │
│   ┌─────────────────────────────────┐   │
│   │ 💪 Saúde e bem-estar            │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │           CONTINUAR             │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Componente:**

```typescript
interface ProfileBasicScreenProps {
  onContinue: (data: ProfileBasicData) => void
  onBack: () => void
  initialData?: Partial<ProfileBasicData>
}

interface ProfileBasicData {
  name: string
  gender: 'MALE' | 'FEMALE'
  goal: UserGoal
}

const GOALS = [
  { value: 'aesthetics', label: 'Estética geral', icon: '✨', description: 'Melhorar proporções e aparência' },
  { value: 'competition', label: 'Competição', icon: '🏆', description: 'Preparar para competições' },
  { value: 'health', label: 'Saúde e bem-estar', icon: '💪', description: 'Foco em saúde geral' },
]

function ProfileBasicScreen({ onContinue, onBack, initialData }: ProfileBasicScreenProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | null>(initialData?.gender || null)
  const [goal, setGoal] = useState<UserGoal | null>(initialData?.goal || null)
  
  const canContinue = name.length >= 2 && gender && goal
  
  return (
    <div className="profile-basic-screen">
      <Header onBack={onBack} step={1} totalSteps={4} />
      
      <h1>VAMOS PERSONALIZAR SUA EXPERIÊNCIA</h1>
      
      <FormField label="Como podemos te chamar?">
        <InputField
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
      </FormField>
      
      <FormField label="Qual seu sexo biológico?" hint="Usado para cálculos de proporção">
        <ToggleGroup
          value={gender}
          onChange={setGender}
          options={[
            { value: 'MALE', label: 'Masculino' },
            { value: 'FEMALE', label: 'Feminino' },
          ]}
        />
      </FormField>
      
      <FormField label="Qual seu principal objetivo?">
        <RadioCardGroup
          value={goal}
          onChange={setGoal}
          options={GOALS}
        />
      </FormField>
      
      <Button
        onClick={() => onContinue({ name, gender: gender!, goal: goal! })}
        disabled={!canContinue}
      >
        CONTINUAR
      </Button>
    </div>
  )
}
```

---

### 3.4 Tela 4: Medidas Estruturais

**Objetivo:** Coletar as 5 medidas que NÃO mudam com treino.

> ⚠️ **CRÍTICO:** Sem essas medidas, não conseguimos calcular os ideais personalizados!

```
┌─────────────────────────────────────────┐
│  ←                           Passo 2/4  │
│                                         │
│      SUAS MEDIDAS ESTRUTURAIS           │
│                                         │
│   Essas medidas não mudam com treino    │
│   e são a base para calcular seus       │
│   ideais personalizados.                │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  📏 Altura                      │   │
│   │  ┌─────────────────────┐        │   │
│   │  │ 180              cm │  [?]   │   │
│   │  └─────────────────────┘        │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  ✊ Punho (circunferência)      │   │
│   │  ┌─────────────────────┐        │   │
│   │  │ 17.5             cm │  [?]   │   │
│   │  └─────────────────────┘        │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  🦶 Tornozelo (circunferência)  │   │
│   │  ┌─────────────────────┐        │   │
│   │  │ 23               cm │  [?]   │   │
│   │  └─────────────────────┘        │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  🦵 Joelho (circunferência)     │   │
│   │  ┌─────────────────────┐        │   │
│   │  │ 38               cm │  [?]   │   │
│   │  └─────────────────────┘        │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  🍑 Pelve/Quadril               │   │
│   │  ┌─────────────────────┐        │   │
│   │  │ 98               cm │  [?]   │   │
│   │  └─────────────────────┘        │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │           CONTINUAR             │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ⚠️ Essas medidas são essenciais.      │
│   Você não poderá pular esta etapa.     │
│                                         │
└─────────────────────────────────────────┘
```

**Modal de Ajuda (ao clicar em [?]):**

```
┌─────────────────────────────────────────┐
│                                    [X]  │
│                                         │
│   COMO MEDIR O PUNHO                    │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │                                 │   │
│   │      [Imagem/GIF animado        │   │
│   │       mostrando como medir]     │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│   1. Use uma fita métrica flexível      │
│                                         │
│   2. Meça no osso proeminente do        │
│      punho (mão dominante)              │
│                                         │
│   3. Mantenha a fita justa mas sem      │
│      apertar                            │
│                                         │
│   💡 Dica: Valores típicos: 15-20cm     │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │           ENTENDI               │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Componente:**

```typescript
interface StructuralMeasuresScreenProps {
  onContinue: (data: StructuralMeasures) => void
  onBack: () => void
  initialData?: Partial<StructuralMeasures>
}

interface StructuralMeasures {
  altura: number
  punho: number
  tornozelo: number
  joelho: number
  pelve: number
}

const STRUCTURAL_FIELDS = [
  {
    id: 'altura',
    label: 'Altura',
    icon: '📏',
    unit: 'cm',
    min: 140,
    max: 220,
    typical: '160-190',
    helpTitle: 'COMO MEDIR A ALTURA',
    helpContent: 'Fique descalço, coluna ereta contra a parede...',
    helpImage: '/help/altura.gif',
  },
  {
    id: 'punho',
    label: 'Punho (circunferência)',
    icon: '✊',
    unit: 'cm',
    min: 13,
    max: 22,
    typical: '15-19',
    helpTitle: 'COMO MEDIR O PUNHO',
    helpContent: 'Use fita métrica no osso proeminente...',
    helpImage: '/help/punho.gif',
  },
  {
    id: 'tornozelo',
    label: 'Tornozelo (circunferência)',
    icon: '🦶',
    unit: 'cm',
    min: 18,
    max: 30,
    typical: '20-26',
    helpTitle: 'COMO MEDIR O TORNOZELO',
    helpContent: 'Meça na parte mais fina, acima do osso...',
    helpImage: '/help/tornozelo.gif',
  },
  {
    id: 'joelho',
    label: 'Joelho (circunferência)',
    icon: '🦵',
    unit: 'cm',
    min: 30,
    max: 50,
    typical: '35-42',
    helpTitle: 'COMO MEDIR O JOELHO',
    helpContent: 'Meça no centro da patela, perna estendida...',
    helpImage: '/help/joelho.gif',
  },
  {
    id: 'pelve',
    label: 'Pelve/Quadril',
    icon: '🍑',
    unit: 'cm',
    min: 80,
    max: 130,
    typical: '90-110',
    helpTitle: 'COMO MEDIR A PELVE',
    helpContent: 'Meça na parte mais larga do quadril...',
    helpImage: '/help/pelve.gif',
  },
]

function StructuralMeasuresScreen({ onContinue, onBack, initialData }: StructuralMeasuresScreenProps) {
  const [values, setValues] = useState<Partial<StructuralMeasures>>(initialData || {})
  const [helpField, setHelpField] = useState<string | null>(null)
  
  const allFieldsFilled = STRUCTURAL_FIELDS.every(f => values[f.id] !== undefined)
  
  const handleChange = (field: string, value: number) => {
    setValues(prev => ({ ...prev, [field]: value }))
  }
  
  return (
    <div className="structural-measures-screen">
      <Header onBack={onBack} step={2} totalSteps={4} />
      
      <h1>SUAS MEDIDAS ESTRUTURAIS</h1>
      <p className="subtitle">
        Essas medidas não mudam com treino e são a base para 
        calcular seus ideais personalizados.
      </p>
      
      {STRUCTURAL_FIELDS.map(field => (
        <MeasurementInput
          key={field.id}
          label={field.label}
          icon={field.icon}
          unit={field.unit}
          value={values[field.id]}
          onChange={(v) => handleChange(field.id, v)}
          onHelp={() => setHelpField(field.id)}
          min={field.min}
          max={field.max}
          placeholder={field.typical}
        />
      ))}
      
      <Button onClick={() => onContinue(values as StructuralMeasures)} disabled={!allFieldsFilled}>
        CONTINUAR
      </Button>
      
      <WarningText>
        ⚠️ Essas medidas são essenciais. Você não poderá pular esta etapa.
      </WarningText>
      
      {helpField && (
        <HelpModal
          field={STRUCTURAL_FIELDS.find(f => f.id === helpField)!}
          onClose={() => setHelpField(null)}
        />
      )}
    </div>
  )
}
```

---

### 3.5 Tela 5: Tutorial de Medição

**Objetivo:** Ensinar como medir corretamente antes da primeira medição.

```
┌─────────────────────────────────────────┐
│  ←                           Passo 3/4  │
│                                         │
│      COMO MEDIR CORRETAMENTE            │
│                                         │
│   Para resultados precisos, siga        │
│   estas dicas:                          │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  ⏰ HORÁRIO                     │   │
│   │  Sempre no mesmo horário        │   │
│   │  (preferencialmente de manhã)   │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  📏 FITA MÉTRICA                │   │
│   │  Use fita flexível, justa       │   │
│   │  mas sem apertar                │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  💪 POSIÇÃO                     │   │
│   │  Braço: flexionado, contraído   │   │
│   │  Demais: relaxados              │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  🔄 CONSISTÊNCIA                │   │
│   │  Meça sempre do mesmo lado      │   │
│   │  e no mesmo ponto               │   │
│   └─────────────────────────────────┘   │
│                                         │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  ▶️  VER VÍDEO TUTORIAL         │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │     ENTENDI, VAMOS MEDIR!       │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Video Tutorial (Modal ou tela cheia):**

```typescript
const TUTORIAL_SECTIONS = [
  {
    id: 'intro',
    title: 'Introdução',
    duration: '0:30',
    videoUrl: '/tutorials/intro.mp4',
  },
  {
    id: 'tools',
    title: 'Ferramentas necessárias',
    duration: '0:45',
    videoUrl: '/tutorials/tools.mp4',
  },
  {
    id: 'upper',
    title: 'Medindo parte superior',
    duration: '2:00',
    videoUrl: '/tutorials/upper-body.mp4',
    measurements: ['ombros', 'peitoral', 'braco', 'antebraco', 'pescoco'],
  },
  {
    id: 'lower',
    title: 'Medindo parte inferior',
    duration: '1:30',
    videoUrl: '/tutorials/lower-body.mp4',
    measurements: ['cintura', 'coxa', 'panturrilha'],
  },
]
```

---

### 3.6 Tela 6: Primeira Medição

**Objetivo:** Coletar as 8 medidas variáveis de forma guiada.

```
┌─────────────────────────────────────────┐
│  ←                           Passo 4/4  │
│                                         │
│      SUA PRIMEIRA MEDIÇÃO               │
│                                         │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│   Ombros  Peitoral  Braço  ...   ✓ ✓   │
│   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │                                 │   │
│   │      [Ilustração destacando    │   │
│   │       a parte do corpo atual]   │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│   OMBROS (DELTOIDES)                    │
│                                         │
│   Meça no ponto mais largo dos          │
│   ombros, com os braços relaxados       │
│   ao lado do corpo.                     │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  ┌─────────────────────┐        │   │
│   │  │ 120              cm │  [?]   │   │
│   │  └─────────────────────┘        │   │
│   └─────────────────────────────────┘   │
│                                         │
│   💡 Valores típicos: 100-140cm         │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │           PRÓXIMO →             │   │
│   └─────────────────────────────────┘   │
│                                         │
│   Pular esta etapa (completar depois)   │
│                                         │
└─────────────────────────────────────────┘
```

**Fluxo de Medidas (wizard step by step):**

```typescript
const FIRST_MEASUREMENT_FIELDS = [
  {
    id: 'ombros',
    label: 'Ombros (Deltoides)',
    instruction: 'Meça no ponto mais largo dos ombros, com os braços relaxados ao lado do corpo.',
    image: '/measurement-guide/ombros.png',
    typical: '100-140',
    min: 80,
    max: 160,
  },
  {
    id: 'peitoral',
    label: 'Peitoral',
    instruction: 'Meça na altura dos mamilos, respiração normal, sem estufar o peito.',
    image: '/measurement-guide/peitoral.png',
    typical: '90-130',
    min: 70,
    max: 150,
  },
  {
    id: 'braco',
    label: 'Braço (Bíceps)',
    instruction: 'Flexione o braço e contraia o bíceps. Meça no ponto mais grosso.',
    image: '/measurement-guide/braco.png',
    typical: '30-45',
    min: 25,
    max: 55,
  },
  {
    id: 'antebraco',
    label: 'Antebraço',
    instruction: 'Com o punho cerrado, meça no ponto mais grosso do antebraço.',
    image: '/measurement-guide/antebraco.png',
    typical: '25-35',
    min: 20,
    max: 45,
  },
  {
    id: 'pescoco',
    label: 'Pescoço',
    instruction: 'Meça na parte mais estreita, logo abaixo do pomo de Adão.',
    image: '/measurement-guide/pescoco.png',
    typical: '35-45',
    min: 30,
    max: 55,
  },
  {
    id: 'cintura',
    label: 'Cintura',
    instruction: 'Meça na parte mais estreita do abdômen, geralmente na altura do umbigo.',
    image: '/measurement-guide/cintura.png',
    typical: '70-95',
    min: 60,
    max: 120,
  },
  {
    id: 'coxa',
    label: 'Coxa',
    instruction: 'Com a perna relaxada, meça no ponto mais grosso da coxa.',
    image: '/measurement-guide/coxa.png',
    typical: '50-70',
    min: 40,
    max: 85,
  },
  {
    id: 'panturrilha',
    label: 'Panturrilha',
    instruction: 'Com a perna relaxada, meça no ponto mais grosso da panturrilha.',
    image: '/measurement-guide/panturrilha.png',
    typical: '32-42',
    min: 28,
    max: 50,
  },
]

interface FirstMeasurementScreenProps {
  onComplete: (data: FirstMeasurement) => void
  onSkip: () => void
  onBack: () => void
}

function FirstMeasurementScreen({ onComplete, onSkip, onBack }: FirstMeasurementScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [values, setValues] = useState<Record<string, number>>({})
  
  const currentField = FIRST_MEASUREMENT_FIELDS[currentIndex]
  const isLast = currentIndex === FIRST_MEASUREMENT_FIELDS.length - 1
  const completedCount = Object.keys(values).length
  
  const handleNext = () => {
    if (isLast) {
      onComplete(values as FirstMeasurement)
    } else {
      setCurrentIndex(prev => prev + 1)
    }
  }
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    } else {
      onBack()
    }
  }
  
  return (
    <div className="first-measurement-screen">
      <Header onBack={handlePrevious} step={4} totalSteps={4} />
      
      <h1>SUA PRIMEIRA MEDIÇÃO</h1>
      
      <ProgressTabs
        fields={FIRST_MEASUREMENT_FIELDS}
        currentIndex={currentIndex}
        completedValues={values}
        onSelect={setCurrentIndex}
      />
      
      <MeasurementGuide
        field={currentField}
        value={values[currentField.id]}
        onChange={(v) => setValues(prev => ({ ...prev, [currentField.id]: v }))}
      />
      
      <Button onClick={handleNext} disabled={!values[currentField.id]}>
        {isLast ? 'VER MEU RESULTADO' : 'PRÓXIMO →'}
      </Button>
      
      <TextButton onClick={onSkip}>
        Pular esta etapa (completar depois)
      </TextButton>
    </div>
  )
}
```

---

### 3.7 Tela 7: Reveal do Score

**Objetivo:** Momento mágico - revelar o resultado com celebração.

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│         CALCULANDO SEU PERFIL...        │
│                                         │
│              [Loading animation]        │
│                                         │
│         Analisando proporções...        │
│         Comparando com ideais...        │
│         Gerando diagnóstico...          │
│                                         │
│                                         │
└─────────────────────────────────────────┘

              ↓ (após 2-3 segundos)

┌─────────────────────────────────────────┐
│                                         │
│            🎉 PARABÉNS, JOÃO!           │
│                                         │
│         SEU VITRU IA ESTÁ PRONTO         │
│                                         │
│           ╭─────────────────╮           │
│          ╱                   ╲          │
│         │        80          │          │
│         │      PONTOS        │          │
│          ╲                   ╱          │
│           ╰─────────────────╯           │
│                                         │
│         CLASSIFICAÇÃO: AVANÇADO         │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  VITRU IA RATIO                  │   │
│   │                                 │   │
│   │  1.56 / 1.618                   │   │
│   │  ████████████████░░░░           │   │
│   │  ESTÉTICO                       │   │
│   └─────────────────────────────────┘   │
│                                         │
│   💪 Pontos Fortes:                     │
│   • V-Taper acima da média              │
│   • Boa simetria bilateral              │
│                                         │
│   🎯 Foco Recomendado:                  │
│   • Braços (+4cm para o ideal)          │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │      VER ANÁLISE COMPLETA       │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Animação de Reveal:**

```typescript
function ScoreRevealScreen({ score, ratio, classification, strengths, focus, onContinue }) {
  const [phase, setPhase] = useState<'loading' | 'reveal'>('loading')
  
  useEffect(() => {
    // Simular processamento
    const timer = setTimeout(() => setPhase('reveal'), 2500)
    return () => clearTimeout(timer)
  }, [])
  
  if (phase === 'loading') {
    return (
      <div className="score-loading">
        <LoadingSpinner />
        <AnimatedText texts={[
          'Analisando proporções...',
          'Comparando com ideais...',
          'Calculando simetria...',
          'Gerando diagnóstico...',
        ]} />
      </div>
    )
  }
  
  return (
    <div className="score-reveal">
      <Confetti /> {/* Animação de confete */}
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
      >
        <h1>🎉 PARABÉNS, {userName}!</h1>
        <p>SEU VITRU IA ESTÁ PRONTO</p>
        
        <ScoreGauge
          value={score}
          animate={true}
          duration={1500}
        />
        
        <Badge variant={classification.toLowerCase()}>
          {classification}
        </Badge>
      </motion.div>
      
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <RatioCard ratio={ratio} target={1.618} />
        
        <HighlightCard title="💪 Pontos Fortes" items={strengths} />
        
        <HighlightCard title="🎯 Foco Recomendado" items={focus} />
      </motion.div>
      
      <Button onClick={onContinue}>
        VER ANÁLISE COMPLETA
      </Button>
    </div>
  )
}
```

---

### 3.8 Tela 8: Dashboard Tour

**Objetivo:** Guiar o usuário pelos principais elementos do dashboard.

```typescript
const TOUR_STEPS = [
  {
    target: '#hero-card',
    title: 'Seu Relatório',
    content: 'Aqui você verá insights semanais personalizados do Coach IA.',
    position: 'bottom',
  },
  {
    target: '#ratio-card',
    title: 'Shape-V Ratio',
    content: 'Seu índice ombro/cintura. Quanto mais perto de 1.618, melhor!',
    position: 'bottom',
  },
  {
    target: '#score-card',
    title: 'Avaliação Geral',
    content: 'Sua pontuação total considerando todas as proporções.',
    position: 'left',
  },
  {
    target: '#heatmap',
    title: 'Mapa Corporal',
    content: 'Visualize quais partes estão boas (verde) ou precisam de atenção (amarelo/vermelho).',
    position: 'right',
  },
  {
    target: '#metrics-grid',
    title: 'Suas Medidas',
    content: 'Acompanhe cada medida e veja quanto falta para o ideal.',
    position: 'top',
  },
  {
    target: '#add-measurement-btn',
    title: 'Registrar Medidas',
    content: 'Clique aqui sempre que quiser registrar novas medidas. Recomendamos semanalmente!',
    position: 'left',
    highlight: true,
  },
]

function DashboardTour({ onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = TOUR_STEPS[currentStep]
  const isLast = currentStep === TOUR_STEPS.length - 1
  
  return (
    <>
      {/* Overlay escurecido */}
      <div className="tour-overlay" />
      
      {/* Highlight do elemento atual */}
      <Spotlight target={step.target} />
      
      {/* Tooltip */}
      <Tooltip
        target={step.target}
        position={step.position}
      >
        <h3>{step.title}</h3>
        <p>{step.content}</p>
        
        <div className="tour-actions">
          <TextButton onClick={onSkip}>Pular tour</TextButton>
          <Button onClick={() => isLast ? onComplete() : setCurrentStep(prev => prev + 1)}>
            {isLast ? 'Começar!' : 'Próximo'}
          </Button>
        </div>
        
        <TourProgress current={currentStep} total={TOUR_STEPS.length} />
      </Tooltip>
    </>
  )
}
```

---

## 4. SKIP E RECOVERY

### 4.1 Opções de Skip

| Etapa | Pode Pular? | Consequência |
|-------|-------------|--------------|
| Welcome | N/A | - |
| Signup | ❌ Não | Precisa de conta |
| Profile Básico | ⚠️ Parcial | Nome obrigatório, resto opcional |
| Medidas Estruturais | ❌ Não | Sem elas não calcula ideais |
| Tutorial | ✅ Sim | Pode ver depois |
| Primeira Medição | ⚠️ Sim | Dashboard vazio, lembrete constante |
| Score Reveal | N/A | Só aparece se mediu |
| Dashboard Tour | ✅ Sim | Pode reativar em Ajuda |

### 4.2 Recovery de Onboarding Incompleto

```typescript
// Ao abrir o app, verificar estado do onboarding
async function checkOnboardingStatus(userId: string): Promise<OnboardingAction> {
  const user = await getUser(userId)
  const profile = await getProfile(userId)
  const measurements = await getMeasurements(userId)
  
  // Sem perfil básico
  if (!profile) {
    return { action: 'resume', step: 'profile-basic' }
  }
  
  // Sem medidas estruturais
  if (!profile.altura || !profile.punho) {
    return { action: 'resume', step: 'structural-measures' }
  }
  
  // Sem medições
  if (measurements.length === 0) {
    return { action: 'prompt', message: 'Complete sua primeira medição para ver seu Score!' }
  }
  
  // Onboarding completo
  return { action: 'none' }
}
```

### 4.3 Tela de Recovery

```
┌─────────────────────────────────────────┐
│                                         │
│   👋 BEM-VINDO DE VOLTA, JOÃO!          │
│                                         │
│   Você ainda não completou seu          │
│   cadastro. Falta pouco!                │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  ✓ Conta criada                 │   │
│   │  ✓ Perfil básico                │   │
│   │  ○ Medidas estruturais          │ ← │
│   │  ○ Primeira medição             │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │        CONTINUAR CADASTRO       │   │
│   └─────────────────────────────────┘   │
│                                         │
│   Completar depois (acesso limitado)    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. PERSISTÊNCIA DE DADOS

### 5.1 Salvamento Progressivo

```typescript
// Salvar a cada etapa completada (não perder progresso)
async function saveOnboardingProgress(
  userId: string,
  step: OnboardingStep,
  data: Partial<OnboardingData>
) {
  // 1. Salvar no backend
  await api.onboarding.saveProgress({ userId, step, data })
  
  // 2. Salvar localmente (backup)
  localStorage.setItem(`onboarding_${userId}`, JSON.stringify({
    step,
    data,
    timestamp: Date.now(),
  }))
}

// Recuperar progresso ao reabrir
async function loadOnboardingProgress(userId: string): Promise<OnboardingState | null> {
  // Tentar do backend primeiro
  const serverData = await api.onboarding.getProgress(userId)
  if (serverData) return serverData
  
  // Fallback para local
  const localData = localStorage.getItem(`onboarding_${userId}`)
  if (localData) return JSON.parse(localData)
  
  return null
}
```

### 5.2 Validação antes de Avançar

```typescript
const STEP_VALIDATIONS: Record<OnboardingStep, (data: OnboardingData) => ValidationResult> = {
  'profile-basic': (data) => {
    const errors: string[] = []
    if (!data.name || data.name.length < 2) errors.push('Nome é obrigatório')
    if (!data.gender) errors.push('Selecione o sexo biológico')
    return { valid: errors.length === 0, errors }
  },
  
  'structural-measures': (data) => {
    const errors: string[] = []
    const required = ['altura', 'punho', 'tornozelo', 'joelho', 'pelve']
    for (const field of required) {
      if (!data[field]) errors.push(`${field} é obrigatório`)
    }
    return { valid: errors.length === 0, errors }
  },
  
  'first-measurement': (data) => {
    // Pode pular, então sempre válido
    return { valid: true, errors: [] }
  },
}
```

---

## 6. ANALYTICS E TRACKING

### 6.1 Eventos de Onboarding

```typescript
const ONBOARDING_EVENTS = {
  // Início
  'onboarding_started': {},
  
  // Por etapa
  'onboarding_step_viewed': { step: string },
  'onboarding_step_completed': { step: string, duration_seconds: number },
  'onboarding_step_skipped': { step: string },
  
  // Específicos
  'onboarding_help_viewed': { field: string },
  'onboarding_video_watched': { video_id: string, percent_watched: number },
  'onboarding_measurement_entered': { field: string, value: number },
  
  // Resultado
  'onboarding_completed': { total_duration_seconds: number, steps_skipped: string[] },
  'onboarding_abandoned': { last_step: string, duration_seconds: number },
  
  // Score reveal
  'score_revealed': { score: number, ratio: number, classification: string },
}

// Exemplo de tracking
function trackOnboardingStep(step: OnboardingStep, action: 'view' | 'complete' | 'skip') {
  analytics.track(`onboarding_step_${action}ed`, {
    step,
    duration_seconds: calculateStepDuration(step),
    timestamp: new Date().toISOString(),
  })
}
```

### 6.2 Funil de Onboarding

```
┌─────────────────────────────────────────────────────────────────┐
│                    FUNIL DE ONBOARDING                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Welcome         ████████████████████████████████████  100%     │
│                                        │                        │
│  Signup          ██████████████████████████████████░░  95%      │
│                                        │                        │
│  Profile         ████████████████████████████████░░░░  90%      │
│                                        │                        │
│  Estruturais     ██████████████████████████████░░░░░░  85%      │
│                                        │                        │
│  Tutorial        ████████████████████████████░░░░░░░░  80%      │
│                                        │                        │
│  1ª Medição      ████████████████████████░░░░░░░░░░░░  70%      │
│                                        │                        │
│  Score Reveal    ████████████████████████░░░░░░░░░░░░  70%      │
│                                        │                        │
│  Tour            ██████████████████████░░░░░░░░░░░░░░  65%      │
│                                        │                        │
│  COMPLETO        ██████████████████████░░░░░░░░░░░░░░  65%      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Métricas-Chave

| Métrica | Fórmula | Meta |
|---------|---------|------|
| **Completion Rate** | Completos / Iniciados | > 65% |
| **Time to Complete** | Média de tempo | < 5 min |
| **Skip Rate** | Pularam 1ª medição | < 30% |
| **D1 Retention** | Voltaram D+1 | > 40% |
| **Activation Rate** | Mediram 2+ vezes em 7 dias | > 25% |

---

## 7. A/B TESTS SUGERIDOS

### 7.1 Testes Prioritários

| Teste | Variante A | Variante B | Métrica |
|-------|------------|------------|---------|
| **Número de slides welcome** | 3 slides | 1 slide direto | Completion rate |
| **Medidas estruturais** | Tudo junto | Dividido em 2 telas | Drop-off rate |
| **Tutorial obrigatório** | Obrigatório | Opcional | 1ª medição accuracy |
| **Score reveal** | Com animação | Sem animação | Satisfaction score |
| **Skip 1ª medição** | Permitir | Não permitir | Activation rate |

### 7.2 Implementação de A/B

```typescript
// Feature flags para A/B tests
const ONBOARDING_FLAGS = {
  'onboarding_welcome_slides': {
    variants: ['3_slides', '1_slide'],
    default: '3_slides',
  },
  'onboarding_structural_split': {
    variants: ['single_screen', 'two_screens'],
    default: 'single_screen',
  },
  'onboarding_tutorial_required': {
    variants: ['required', 'optional'],
    default: 'optional',
  },
  'onboarding_allow_skip_measurement': {
    variants: ['allow', 'disallow'],
    default: 'allow',
  },
}

function getOnboardingVariant(flagKey: string, userId: string): string {
  // Usar feature flag service (LaunchDarkly, Statsig, etc.)
  return featureFlags.getVariant(flagKey, userId)
}
```

---

## 8. COPY E MICROCOPY

### 8.1 Títulos por Tela

| Tela | Título | Subtítulo |
|------|--------|-----------|
| Welcome | DESCUBRA SEU FÍSICO IDEAL | Análise baseada na Proporção Áurea |
| Signup | CRIE SUA CONTA | - |
| Profile | VAMOS PERSONALIZAR SUA EXPERIÊNCIA | - |
| Estruturais | SUAS MEDIDAS ESTRUTURAIS | Essas medidas são a base para seus ideais |
| Tutorial | COMO MEDIR CORRETAMENTE | Para resultados precisos |
| 1ª Medição | SUA PRIMEIRA MEDIÇÃO | Vamos registrar suas medidas atuais |
| Reveal | 🎉 PARABÉNS, {NOME}! | SEU VITRU IA ESTÁ PRONTO |

### 8.2 Mensagens de Erro

```typescript
const ERROR_MESSAGES = {
  // Validação
  'name_required': 'Como podemos te chamar?',
  'name_too_short': 'Nome precisa ter pelo menos 2 caracteres',
  'email_invalid': 'Digite um email válido',
  'password_too_short': 'Senha precisa ter pelo menos 8 caracteres',
  
  // Medidas
  'measurement_required': 'Esta medida é obrigatória',
  'measurement_too_low': 'Valor muito baixo. Verifique a medida.',
  'measurement_too_high': 'Valor muito alto. Verifique a medida.',
  
  // Network
  'network_error': 'Sem conexão. Verifique sua internet.',
  'server_error': 'Algo deu errado. Tente novamente.',
}
```

### 8.3 Mensagens de Motivação

```typescript
const MOTIVATION_MESSAGES = {
  'profile_complete': 'Ótimo! Agora vamos às medidas estruturais.',
  'structural_complete': 'Perfeito! Seus ideais foram calculados.',
  'measurement_saved': 'Medida registrada! Continue assim.',
  'halfway': 'Você já está na metade! Falta pouco.',
  'almost_done': 'Quase lá! Só mais uma etapa.',
}
```

---

## 9. ACESSIBILIDADE

### 9.1 Requisitos

- [ ] Navegação por teclado em todas as telas
- [ ] Labels em todos os inputs
- [ ] Contraste WCAG AA
- [ ] Screen reader friendly
- [ ] Tamanho de toque mínimo 44x44px
- [ ] Animações respeitam `prefers-reduced-motion`

### 9.2 Implementação

```typescript
// Respeitar preferência de movimento reduzido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function ScoreReveal({ score }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { scale: 0 }}
      animate={{ scale: 1 }}
      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring' }}
    >
      <ScoreGauge value={score} animate={!prefersReducedMotion} />
    </motion.div>
  )
}
```

---

## 10. CHECKLIST DE LANÇAMENTO

### 10.1 Antes do Lançamento

- [ ] Todas as 8 telas implementadas
- [ ] Fluxo de skip funcionando
- [ ] Recovery de progresso funcionando
- [ ] Analytics configurado
- [ ] Imagens/GIFs de tutorial prontos
- [ ] Copy revisado
- [ ] Testes em iOS e Android
- [ ] Testes de acessibilidade
- [ ] Performance < 3s por tela

### 10.2 Pós-Lançamento

- [ ] Monitorar funil de conversão
- [ ] Coletar feedback qualitativo
- [ ] Identificar pontos de drop-off
- [ ] Iterar baseado em dados

---

## 11. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial do Onboarding |

---

**VITRU IA Onboarding**  
*Primeira Impressão • Coleta de Dados • Valor Imediato • Engajamento*
