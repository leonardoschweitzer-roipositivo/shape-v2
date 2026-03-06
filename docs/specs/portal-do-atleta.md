# SPEC: Portal do Atleta

## Documento de Especificação Técnica v2.0

**Versão:** 2.0  
**Data:** Fevereiro 2026  
**Projeto:** VITRU IA - Portal do Atleta  
**Princípio:** Mínima Fricção, Máximo Valor

---

## 1. VISÃO GERAL

### 1.1 Objetivo

Portal **ultra-simplificado** para o atleta cadastrado pelo Personal (direto ou via academia). O atleta acessa apenas:
1. Suas **últimas medidas**
2. Sua **última avaliação** (proporções e score)
3. **Acompanhamento diário** (registros rápidos)
4. **Chat com Coach IA**

### 1.2 Quem Acessa Este Portal

```
+-----------------------------------------------------------------
|
|  PERSONAL (usuário direto)   |   |
|   cadastra  ATLETA  acessa PORTAL   |   |  -------------------------------------------------------------  |   |  ACADEMIA   |   |
|   PERSONAL (vinculado)   |   |
|   cadastra  ATLETA  acessa PORTAL   |   |
--------------------------------------------------------------

  O ATLETA NÃO SE CADASTRA SOZINHO - sempre vem do Personal!
```

### 1.3 Princípios de Design

```
+-----------------------------------------------------------------
|
|   PRINCÍPIOS DO PORTAL DO ATLETA   |   |  +-----------------------------------------------------------------   |  |   |  |  1  MENOS É MAIS   |
|   Mostrar apenas o essencial. Esconder complexidade.   |
|   |
|  2  AÇÃO PRIMEIRO   |
|   O que preciso fazer AGORA deve estar em destaque.   |
|   |
|  3  UM TOQUE   |
|   Qualquer ação principal deve estar a no máximo 1 toque.   |
|   |
|  4  FEEDBACK INSTANTÃ‚NEO   |
|   Toda ação gera resposta visual imediata.   |
|   |
|  5  MOBILE FIRST   |
|   95% dos atletas usarão no celular.   |
|   |
|  ------------------------------------------------------------------   |   |
--------------------------------------------------------------------------
```

---

## 2. ESTRUTURA DE NAVEGAÇÃO

### 2.1 Menu Principal (Bottom Navigation)

O atleta tem apenas **4 abas** no menu inferior:

```
+-----------------------------------------------------------------
|
|   [CONTEÃšDO DA TELA]   |   |   |
--------------------------------------------------------------------------
|
|   🏠   |   HOJE   COACH   PROGRESSO   PERFIL   |   |
--------------------------------------------------------------------------
```

| Aba | Ícone | Função Principal |-----|:-----:|------------------| **HOJE** | 🏠 | Tudo que precisa fazer/registrar hoje | **COACH** | Conversar com Vitrúvio (IA) | **PROGRESSO** | Ver evolução e medidas | **PERFIL** | Dados pessoais e configurações |

### 2.2 Hierarquia de Informação

```
ATLETA
 HOJE (Home)
|   Card de Treino do Dia
|   Card de Dieta do Dia
|   Trackers Rápidos (água, sono, etc.)
|   Insight do Coach IA
|
 COACH (Chat)
|   Chat com Vitrúvio
|   Histórico de conversas
|   Ações rápidas (registrar refeição, etc.)
|
 PROGRESSO
|   Resumo Geral (Score)
|   Gráficos de Evolução
|   Proporções Atuais
|   Histórico de Avaliações
|
 PERFIL
   Dados Pessoais
   Meu Personal
   Configurações
   Ajuda
```

---

## 3. TELA: HOJE (HOME)

### 3.1 Layout Completo

```
+-----------------------------------------------------------------
|
|  +-----------------------------------------------------------------   |  |  Olá, João!   Dom, 09 Fev   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |  ‹ TREINO DE HOJE   |
|  -----------------------------------------------------------------  |
|   |
|  PEITO + TRÍCEPS   Dia 3/5   |
|  Foco: Peitoral superior (gap identificado)   |
|   |
|  +-----------------------------------------------------------------   |
|  |   [  VER TREINO COMPLETO  ]   |   |  |  ----------------------------------------------------------   |
|   |
|  +-----------------------------------------------------------------  +-----------------------------------------------------------------   |
|  |  COMPLETEI  |  PULAR HOJE |   |  |  ------------  ------------   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   DIETA DE HOJE   |
|  -----------------------------------------------------------------  |
|   |
|  Calorias   Proteína   Carbos   Gordura   |
|  1.200   80g   120g   45g   |
|  --------   --------   --------   --------   |
|  2.500   180g   280g   70g   |
|   |
|  48%   44%   43%   64%   |
|   |
|  +-----------------------------------------------------------------   |
|  |   [ + REGISTRAR REFEIÇÃO ]   |   |  |  ----------------------------------------------------------   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   RÁPIDO   |
|   |
|  +----------------------------------------------------------------- +----------------------------------------------------------------- +----------------------------------------------------------------- +-----------------------------------------------------------------   |
|  |   |   |   |  •   |   |  | Água   | Sono   | Peso   | Dor   |   |  | 1.5L   |  7h   | 85kg   |   +   |   |  |  ----- ----- ----- -----   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   DICA DO COACH   |
|   |
|  "Faltam 100g de proteína hoje. Que tal um shake   |
|   pós-treino com 2 scoops de whey?"   |
|   |
|  +-----------------------------------------------------------------   |
|  |   [ FALAR COM O COACH ]   |   |  |  ----------------------------------------------------------   |
|   |
|  ------------------------------------------------------------------   |   |
--------------------------------------------------------------------------
|   🏠   |   HOJE   COACH   PROGRESSO   PERFIL   |
--------------------------------------------------------------------------
```

### 3.2 Componentes da Tela HOJE

#### 3.2.1 Header com Saudação

```typescript
interface HeaderHojeProps {
  nomeAtleta: string
  dataFormatada: string
  streak: number
}

// Saudação baseada na hora
function getSaudacao(): string {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}
```

#### 3.2.2 Card de Treino

```typescript
interface CardTreinoProps {
  // Info do treino
  titulo: string   // "PEITO + TRÍCEPS"
  subtitulo?: string   // "Foco: Peitoral superior"
  diaAtual: number   // 3
  diasTotal: number   // 5
  
  // Status
  status: 'pendente' | 'completo' | 'pulado' | 'descanso'
  
  // Ações
  onVerTreino: () => void
  onCompletei: () => void
  onPular: () => void
}
```

**Estados do Card de Treino:**

```
+-----------------------------------------------------------------
|
|  ESTADO: PENDENTE (padrão)   |  +-----------------------------------------------------------------   |  |  ‹ TREINO DE HOJE   |
|  PEITO + TRÍCEPS   Dia 3/5   |
|  [VER TREINO]  [ COMPLETEI]  [ PULAR]   |
|  ------------------------------------------------------   |   |  ESTADO: COMPLETO   |  +-----------------------------------------------------------------   |  |   TREINO COMPLETO!   |
|  PEITO + TRÍCEPS  1h 30min  Intensidade:   |
|  [VER DETALHES]   |
|  ------------------------------------------------------   |   |  ESTADO: DESCANSO   |  +-----------------------------------------------------------------   |  |   DIA DE DESCANSO   |
|  Recuperação é essencial para os ganhos!   |
|  Próximo treino: Segunda (COSTAS)   |
|  ------------------------------------------------------   |   |
--------------------------------------------------------------
```

#### 3.2.3 Card de Dieta

```typescript
interface CardDietaProps {
  // Metas do dia
  metaCalorias: number
  metaProteina: number
  metaCarbos: number
  metaGordura: number
  
  // Consumido até agora
  consumidoCalorias: number
  consumidoProteina: number
  consumidoCarbos: number
  consumidoGordura: number
  
  // Ação
  onRegistrarRefeicao: () => void
}
```

#### 3.2.4 Trackers Rápidos

```typescript
interface TrackerRapido {
  id: 'agua' | 'sono' | 'peso' | 'dor'
  icone: string
  label: string
  valor?: string | number
  unidade?: string
  status: 'pendente' | 'registrado'
  onClick: () => void
}

const TRACKERS_RAPIDOS: TrackerRapido[] = [
  { id: 'agua', icone: ', label: 'Água', unidade: 'L' },
  { id: 'sono', icone: ', label: 'Sono', unidade: 'h' },
  { id: 'peso', icone: '', label: 'Peso', unidade: 'kg' },
  { id: 'dor', icone: '•', label: 'Dor' },
]
```

#### 3.2.5 Dica do Coach

```typescript
interface DicaCoachProps {
  mensagem: string
  tipo: 'dica' | 'alerta' | 'elogio'
  onFalarComCoach: () => void
}
```

---

## 4. TELA: COACH (CHAT)

### 4.1 Layout do Chat

```
+-----------------------------------------------------------------
|
|  +-----------------------------------------------------------------   |  |   VITRÃšVIO   Hoje   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   |  |  +-----------------------------------------------------------------   |
|  | – Olá João! Como posso ajudar hoje?   |   |  |   |   |  | Vi que você tem treino de PEITO hoje.   |   |  | Lembre-se de focar no peitoral superior!  |   |  |  ----------------------------------------   |
|   10:30   |
|   |
|   +-----------------------------------------------------------------  |
|   | Comi 200g de frango com arroz no almoço  |   |  |   ----------------------------------------  |
|   10:35   |
|   |
|  +-----------------------------------------------------------------   |
|  | – Registrado!   |   |  |   |   |  | Almoço: ~450 kcal, 50g proteína   |   |  |   |   |  | Total do dia:   |   |  |  Calorias: 1.200/2.500 (48%)   |   |  |  Proteína: 80g/180g (44%)   |   |  |   |   |  |  Dica: Tome um shake pós-treino para   |   |  | garantir a meta de proteína!   |   |  |  ----------------------------------------   |
|   10:35   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |  AÇÃ•ES RÁPIDAS   |
|   |
|  +----------------------------------------------------------------- +----------------------------------------------------------------- +----------------------------------------------------------------- +-----------------------------------------------------------------   |
|  | |  ‹   |   |   |   |  |Refeição| Treino | +Água  |Dúvida  |   |  |  ----- ----- ----- -----   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   Digite sua mensagem...   |
|  ------------------------------------------------------------------   |   |
--------------------------------------------------------------------------
|   🏠   |   HOJE   COACH   PROGRESSO   PERFIL   |
--------------------------------------------------------------------------
```

### 4.2 Ações Rápidas do Chat

```typescript
interface AcaoRapidaChat {
  id: string
  icone: string
  label: string
  acao: () => void
  
  // Mensagem pré-definida que será enviada
  mensagemPadrao?: string
}

const ACOES_RAPIDAS_CHAT: AcaoRapidaChat[] = [
  {
   id: 'refeicao',
   icone: '
   label: 'Refeição',
   mensagemPadrao: 'Quero registrar uma refeição',
  },
  {
   id: 'treino',
   icone: '‹
   label: 'Treino',
   mensagemPadrao: 'Quero registrar meu treino de hoje',
  },
  {
   id: 'agua',
   icone: ',
   label: '+Água',
   mensagemPadrao: 'Bebi água agora',
  },
  {
   id: 'duvida',
   icone: '
   label: 'Dúvida',
   mensagemPadrao: 'Tenho uma dúvida',
  },
]
```

### 4.3 Processamento de Mensagens

```typescript
// Exemplos de interações
const EXEMPLOS_CHAT = [
  // REGISTRO DE REFEIÇÃO
  {
   usuario: "comi 200g de frango com arroz",
   resposta: `Registrado! 

Almoço: ~450 kcal, 50g proteína

Total do dia:
 Calorias: 1.200/2.500 (48%)
 Proteína: 80g/180g (44%)

 Dica: Tome um shake pós-treino para garantir a meta de proteína!`,
  },
  
  // REGISTRO DE TREINO
  {
   usuario: "acabei o treino",
   resposta: `Boa!  Como foi o treino de PEITO + TRÍCEPS?

[ Difícil] [ Normal] [ Bom] [ Ótimo]

Duração aproximada?`,
  },
  
  // CONSULTA
  {
   usuario: "quanto de proteína já comi hoje?",
   resposta: ` Proteína hoje: 80g / 180g (44%)

Refeições registradas:
 Café: 15g
 Almoço: 50g
 Lanche: 15g

Faltam 100g. Sugestões:
 Shake com 2 scoops: ~50g
 Peito de frango (200g): ~50g
 Ovos (4 unidades): ~24g`,
  },
  
  // DOR
  {
   usuario: "tô com dor no ombro",
   resposta: `• Vou registrar isso. Me conta mais:

Intensidade (1-10)?
[1-3 Leve] [4-6 Moderada] [7-10 Forte]

Quando começou?
[Hoje] [Ontem] [Esta semana] [Há mais tempo]

  Vou ajustar seu treino para evitar movimentos que possam piorar.`,
  },
]
```

---

## 5. TELA: PROGRESSO

### 5.1 Layout Completo

```
+-----------------------------------------------------------------
|
|  +-----------------------------------------------------------------   |  |   MEU PROGRESSO   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   |  |   SCORE GERAL   |
|   |
|   +-----------------------------------------------------------------   |
|   |   |
|   |   78   |   |  |   pontos   |   |  |   |   |  |   ------------   |
|   |
|   QUASE LÁ  (+5 vs mês passado)   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   EVOLUÇÃO   [Peso  [3 meses   |
|   |
|   88   |
|   |   |  |   86   |
|   |   |  |   84   |
|   |   |  |   82   |
|   -------------------------------------------   |
|   Dez   Jan   Fev   |
|   |
|   -4.2kg em 3 meses  Meta: 80kg (-2kg restantes)   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   MINHAS PROPORÇÃ•ES   [Ver todas   |
|   |
|  +----------------------------------------------------------------- |
|  |  Shape-V   1.52 / 1.62   QUASE LÁ   |   |  |   94%   |   |  |  ------------------------------------------------------------ |
|   |
|  +----------------------------------------------------------------- |
|  |  Peitoral   6.8 / 6.5   META   |   |  |   105%   |   |  |  ------------------------------------------------------------ |
|   |
|  +----------------------------------------------------------------- |
|  |  Cintura   0.92 / 0.86   CAMINHO   |   |  |   85%   |   |  |  ------------------------------------------------------------ |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   HISTÓRICO   [Ver todos   |
|   |
|  +-----------------------------------------------------------------   |
|  |  09 Fev 2026  Score: 78  Peso: 82.4kg   [Ver   |   |  |  15 Jan 2026  Score: 73  Peso: 84.1kg   [Ver   |   |  |  20 Dez 2025  Score: 70  Peso: 86.5kg   [Ver   |   |  |  ----------------------------------------------------------   |
|   |
|  ------------------------------------------------------------------   |   |
--------------------------------------------------------------------------
|   🏠   |   HOJE   COACH   PROGRESSO   PERFIL   |
--------------------------------------------------------------------------
```

### 5.2 Componentes da Tela Progresso

#### 5.2.1 Card Score Geral

```typescript
interface CardScoreGeralProps {
  score: number   // 78
  classificacao: string   // "QUASE LÁ"
  emoji: string   // "
  variacaoVsMes: number   // +5
}
```

#### 5.2.2 Gráfico de Evolução

```typescript
interface GraficoEvolucaoProps {
  // Dados
  dados: { data: Date; valor: number }[]
  
  // Filtros
  metricaSelecionada: 'peso' | 'bf' | 'score' | 'medida'
  periodoSelecionado: '1m' | '3m' | '6m' | '1a' | 'todos'
  
  // Meta (opcional)
  meta?: number
}
```

#### 5.2.3 Lista de Proporções

```typescript
interface ProporcaoResumoProps {
  nome: string   // "Shape-V"
  atual: number   // 1.52
  meta: number   // 1.62
  percentual: number   // 94
  classificacao: string   // "QUASE LÁ"
  emoji: string   // "
}
```

---

## 6. TELA: PERFIL

### 6.1 Layout Completo

```
+-----------------------------------------------------------------
|
|  +-----------------------------------------------------------------   |  |   |  |   +-----------------------------------------------------------------   |
|   |   |
|   |  FOTO   |   |  |   |   |  |   ------   |
|   |
|   João Ogro Silva   |
|   joao.ogro@email.com   |
|   |
|   +-----------------------------------------------------------------   |
|   |   Editar Perfil  |   |  |   -----------------   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   DADOS BÁSICOS   |
|  ----------------------------------------------------------------- |
|  Altura   175 cm   |
|  Idade   28 anos   |
|  Objetivo   Hipertrofia com definição   |
|  Categoria   Golden Ratio   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   MEU PERSONAL   |
|  ----------------------------------------------------------------- |
|   |
|  +-----------------------------------------------------------------  Pedro Coach   |
|  |FOTO |  CREF: 123456-G/SP   |
|  --   (11) 99999-9999   |
|   |
|  +-----------------------------------------------------------------  +-----------------------------------------------------------------   |
|  |  WhatsApp   |  Ligar   |   |  |  -------------  -------------   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   CONFIGURAÇÃ•ES   |
|  ----------------------------------------------------------------- |
|   |
|   Notificações   [ON]   |
|   Modo Escuro   [ON]   |
|   Unidade de Medida   [cm]   |
|   Unidade de Peso   [kg]   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   AJUDA   |
|  ----------------------------------------------------------------- |
|   |
|   Tutorial   |
|   Suporte   |
|   Termos de Uso   |
|   Política de Privacidade   |
|   |
|  ------------------------------------------------------------------   |   |  +-----------------------------------------------------------------   |  |   |  |   [  SAIR DA CONTA ]   |
|   |
|  ------------------------------------------------------------------   |   |
--------------------------------------------------------------------------
|   🏠   |   HOJE   COACH   PROGRESSO   PERFIL   |
--------------------------------------------------------------------------
```

---

## 7. FLUXOS PRINCIPAIS

### 7.1 Fluxo: Registrar Refeição (Simplificado)

```
+-----------------------------------------------------------------
|
|  REGISTRAR REFEIÇÃO   X   |   |
--------------------------------------------------------------------------
|
|  Qual refeição?   |   |  +----------------------------------------------------------------- +----------------------------------------------------------------- +----------------------------------------------------------------- +----------------------------------------------------------------- +-----------------------------------------------------------------   |  |- Café  |ŽLanche |moço | +Lanche |antar |
|  ------ ------ ------ ------ ------   |   |  ------------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |  Descreva o que comeu...   |
|   |
|  Ex: "200g de frango, arroz e salada"   |
|   |
|  -------------------------------------------------------------------- |   |  +-----------------------------------------------------------------  +-----------------------------------------------------------------   |  |   Tirar foto   |   Da galeria   |
|  ------------------  ------------------   |   |   |   |   [ REGISTRAR ]   |   |
--------------------------------------------------------------------------
```

### 7.2 Fluxo: Completar Treino (Simplificado)

```
+-----------------------------------------------------------------
|
|   COMPLETAR TREINO   X   |   |
--------------------------------------------------------------------------
|
|  PEITO + TRÍCEPS   |   |  ------------------------------------------------------------------------- |   |  Como foi?   |   |  +----------------------------------------------------------------- +----------------------------------------------------------------- +----------------------------------------------------------------- +-----------------------------------------------------------------   |  |   |   |   |   |   | Difícil | Normal  |  Bom   | Ótimo   |
|  ------ ------ ------ ------   |   |  ------------------------------------------------------------------------- |   |  Duração aproximada:   |   |  +----------------------------------------------------------------- +----------------------------------------------------------------- +----------------------------------------------------------------- +-----------------------------------------------------------------   |  |  45min  |   1h   | 1h30min |   2h   |
|  ------ ------ ------ ------   |   |  ------------------------------------------------------------------------- |   |  Alguma dor ou desconforto?   |   |  +-----------------------------------------------------------------  +-----------------------------------------------------------------   |  |   Nenhum   |    Sim, reportar |
|  ---------------  ---------------   |   |   |   [ SALVAR ]   |   |
--------------------------------------------------------------------------
```

### 7.3 Fluxo: Ver Treino do Dia

```
+-----------------------------------------------------------------
|
|   Voltar   TREINO DE HOJE   |   |
--------------------------------------------------------------------------
|
|  ‹ PEITO + TRÍCEPS   Dia 3/5   |   |  Foco: Peitoral superior (gap identificado pela IA)   |   |  ------------------------------------------------------------------------- |   |   EXERCÍCIOS   |   |  +----------------------------------------------------------------- |  |  1. SUPINO INCLINADO COM HALTERES   |
|   4 séries x 10-12 repetições   |
|   Foco: Peitoral superior   |
|   [ Vídeo] |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |  2. SUPINO RETO COM BARRA   |
|   4 séries x 8-10 repetições   |
|   Desça a barra até o peito   |
|   [ Vídeo] |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |  3. CRUCIFIXO INCLINADO   |
|   3 séries x 12-15 repetições   |
|   Sinta o alongamento   |
|   [ Vídeo] |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |  4. CROSS OVER   |
|   3 séries x 15 repetições   |
|   Contraia no centro   |
|   [ Vídeo] |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |  5. TRÍCEPS PULLEY   |
|   4 séries x 12 repetições   |
|   [ Vídeo] |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |  6. TRÍCEPS FRANCÃŠS   |
|   3 séries x 12 repetições   |
|   [ Vídeo] |
|  -------------------------------------------------------------------- |   |  ------------------------------------------------------------------------- |   |  +-----------------------------------------------------------------   |  |   [  COMPLETEI O TREINO ]   |
|  ------------------------------------------------------------------   |   |
--------------------------------------------------------------------------
```

---

## 8. ONBOARDING DO ATLETA

### 8.1 Fluxo de Primeiro Acesso

```
+-----------------------------------------------------------------
|
|   PASSO 1/4   |   |   +-----------------------------------------------------------------   |   |   |   |   ‹ VITRU IA   |
|   |
|   ------------------   |   |   |   Bem-vindo ao VITRU IA!   |   |   Vamos configurar seu perfil em poucos passos.   |   |   |   +-----------------------------------------------------------------   |   |   COMEÇAR   |
|   ----------------------   |   |   |   |   |
--------------------------------------------------------------------------

+-----------------------------------------------------------------
|
|   Voltar   PASSO 2/4   |   |   |   Dados Básicos   |   |   |  Nome completo   |  +----------------------------------------------------------------- |  | João Ogro Silva   |
|  -------------------------------------------------------------------- |   |  Data de nascimento   |  +----------------------------------------------------------------- |  | 15/03/1998   |
|  -------------------------------------------------------------------- |   |  Sexo   |  +-----------------------------------------------------------------  +-----------------------------------------------------------------   |  | Masculino   |   - Feminino   |
|  ---------------  ---------------   |   |  Altura (cm)   |  +----------------------------------------------------------------- |  | 175   |
|  -------------------------------------------------------------------- |   |   |   +-----------------------------------------------------------------   |   |   PRÓXIMO   |
|   ----------------------   |   |   |   |
--------------------------------------------------------------------------

+-----------------------------------------------------------------
|
|   Voltar   PASSO 3/4   |   |   |   Qual seu objetivo?   |   |   |  +----------------------------------------------------------------- |  |   GANHAR MASSA MUSCULAR   |
|   Foco em hipertrofia e ganho de peso   |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |   PERDER GORDURA   |
|   Foco em definição e perda de peso   |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |   RECOMPOSIÇÃO CORPORAL   |
|   Ganhar músculo e perder gordura ao mesmo tempo   |
|  -------------------------------------------------------------------- |   |  +----------------------------------------------------------------- |  |  † COMPETIÇÃO   |
|   Preparação para competições de fisiculturismo   |
|  -------------------------------------------------------------------- |   |   |   +-----------------------------------------------------------------   |   |   PRÓXIMO   |
|   ----------------------   |   |   |   |
--------------------------------------------------------------------------

+-----------------------------------------------------------------
|
|   Voltar   PASSO 4/4   |   |   |   Tudo pronto!   |   |   |  +----------------------------------------------------------------- |  | |  |   +-----------------------------------------------------------------   |
|   |   |
|   --------------   |
|   |
|   Seu perfil foi criado!   |
|   |
|  Seu Personal (Pedro Coach) já pode acessar seus dados   |
|  e criar treinos e dietas personalizados para você.   |
|   |
|  Enquanto isso, explore o app e conheça o Vitrúvio,   |
|  seu coach virtual inteligente!   |
|   |
|  -------------------------------------------------------------------- |   |   |   +-----------------------------------------------------------------   |   |   COMEÇAR!   |
|   ----------------------   |   |   |   |
--------------------------------------------------------------------------
```

---

## 9. NOTIFICAÇÃ•ES

### 9.1 Notificações do Atleta

```typescript
const NOTIFICACOES_ATLETA = [
  // TREINO
  {
   id: 'treino_lembrete',
   titulo: '‹ Hora do treino!',
   mensagem: 'Seu treino de PEITO + TRÍCEPS está esperando.',
   horario: '14:00',
   diasSemana: [1, 2, 3, 4, 5],
   tipo: 'lembrete',
  },
  
  // DIETA
  {
   id: 'refeicao_almoco',
   titulo: ' Hora do almoço!',
   mensagem: 'Não esqueça de registrar sua refeição.',
   horario: '12:30',
   diasSemana: [0, 1, 2, 3, 4, 5, 6],
   tipo: 'lembrete',
  },
  {
   id: 'proteina_alerta',
   titulo: '  Proteína baixa!',
   mensagem: 'Você só consumiu 50% da meta. Tome um shake!',
   horario: '18:00',
   condicao: (dados) => dados.proteina.atual < dados.proteina.meta * 0.5,
   tipo: 'alerta',
  },
  
  // ÁGUA
  {
   id: 'agua_lembrete',
   titulo: ' Beba água!',
   mensagem: 'Hidratação é essencial para seus ganhos.',
   horario: '10:00',
   diasSemana: [0, 1, 2, 3, 4, 5, 6],
   tipo: 'lembrete',
  },
  
  // PERSONAL
  {
   id: 'personal_mensagem',
   titulo: ' Mensagem do Personal',
   mensagem: 'Pedro Coach enviou uma mensagem.',
   tipo: 'push',
   // Disparada pelo backend quando Personal envia mensagem
  },
  
  // PROGRESSO
  {
   id: 'checkin_semanal',
   titulo: ' Check-in semanal!',
   mensagem: 'Hora de registrar seu peso e medidas.',
   horario: '09:00',
   diasSemana: [0], // Domingo
   tipo: 'lembrete',
  },
]
```

---

## 10. ESTADOS E FEEDBACKS

### 10.1 Estados Visuais

```typescript
// Estados do Treino
const ESTADOS_TREINO = {
  pendente: {
   cor: '#3B82F6',
   icone: '‹
   label: 'Treino disponível',
  },
  completo: {
   cor: '#10B981',
   icone: '
   label: 'Treino completo!',
  },
  pulado: {
   cor: '#F59E0B',
   icone: '',
   label: 'Treino pulado',
  },
  descanso: {
   cor: '#6B7280',
   icone: ',
   label: 'Dia de descanso',
  },
}

// Estados do Tracker
const ESTADOS_TRACKER = {
  pendente: {
   corBorda: '#374151',
   corFundo: '#1F2937',
   label: 'Registrar',
  },
  parcial: {
   corBorda: '#F59E0B',
   corFundo: 'rgba(245, 158, 11, 0.1)',
   label: 'Parcial',
  },
  completo: {
   corBorda: '#10B981',
   corFundo: 'rgba(16, 185, 129, 0.1)',
   label: 'Completo!',
  },
}
```

### 10.2 Feedbacks de Ação

```typescript
// Toasts de sucesso
const TOASTS = {
  treinoRegistrado: {
   icone: '
   titulo: 'Treino registrado!',
   mensagem: 'Parabéns pelo treino de hoje! ,
   duracao: 3000,
  },
  refeicaoRegistrada: {
   icone: '
   titulo: 'Refeição registrada!',
   mensagem: '+50g proteína adicionados',
   duracao: 3000,
  },
  aguaAdicionada: {
   icone: ',
   titulo: '+500ml!',
   mensagem: 'Total: 2L / 3L',
   duracao: 2000,
  },
  pesoRegistrado: {
   icone: '',
   titulo: 'Peso registrado!',
   mensagem: '82.4kg  -0.3kg vs última semana',
   duracao: 3000,
  },
}
```

---

## 11. PERMISSÃ•ES E CONFIGURAÇÃ•ES

### 11.1 Permissões Necessárias

```typescript
const PERMISSOES_APP = {
  // Obrigatórias
  camera: {
   motivo: 'Para tirar fotos das refeições e do progresso',
   obrigatoria: false,
  },
  galeria: {
   motivo: 'Para selecionar fotos existentes',
   obrigatoria: false,
  },
  notificacoes: {
   motivo: 'Para lembrar de treinos, refeições e água',
   obrigatoria: true,
  },
  
  // Opcionais
  microfone: {
   motivo: 'Para usar comandos de voz com o Coach IA',
   obrigatoria: false,
  },
}
```

### 11.2 Configurações do Atleta

```typescript
interface ConfiguracoesAtleta {
  // Notificações
  notificacoes: {
   treinoLembrete: boolean
   refeicaoLembrete: boolean
   aguaLembrete: boolean
   mensagensPersonal: boolean
  }
  
  // Preferências
  preferencias: {
   modoEscuro: boolean
   unidadePeso: 'kg' | 'lb'
   unidadeMedida: 'cm' | 'in'
   idioma: 'pt-BR' | 'en-US' | 'es'
  }
  
  // Privacidade
  privacidade: {
   compartilharProgressoPersonal: boolean
   compartilharProgressoAcademia: boolean
   fotoPerfilVisivel: boolean
  }
}
```

---

## 12. MODELO DE DADOS DO ATLETA

### 12.1 Perfil do Atleta

```typescript
interface PerfilAtleta {
  id: string
  
  // Dados básicos
  nome: string
  email: string
  telefone?: string
  dataNascimento: Date
  sexo: 'M' | 'F'
  fotoUrl?: string
  
  // Medidas estruturais (fixas)
  altura: number
  punho?: number
  tornozelo?: number
  joelho?: number
  pelve?: number
  
  // Objetivo
  objetivo: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO'
  categoriaPreferida?: string
  
  // Vínculos
  personalId: string
  academiaId?: string
  
  // Status
  status: 'ATIVO' | 'INATIVO' | 'PENDENTE'
  dataVinculo: Date
  
  // Configurações
  configuracoes: ConfiguracoesAtleta
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

### 12.2 Relacionamentos

```
+-----------------------------------------------------------------
|
|   HIERARQUIA DE USUÁRIOS   |   |  +-----------------------------------------------------------------   |  |   |  |   +-----------------------------------------------------------------   |
|   |   ACADEMIA   |   |  |   -----------   |
|   |   |  |   +-----------------------------------------------------------------   |
|   |   |   |  |   |  |   +-----------------------------------------------------------------   +-----------------------------------------------------------------   +-----------------------------------------------------------------   |
|   | PERSONAL | PERSONAL | PERSONAL |   |  |   A   |   B   |   C   |   |  |   -------   -------   -------   |
|   |   |   |  |   +-----------------------------------------------------------------   +-----------------------------------------------------------------   +-----------------------------------------------------------------   |
|   |   |   |   |
|   |
|   +----------------------------------------------------------------- +----------------------------------------------------------------- +----------------------------------------------------------------- +-----------------------------------------------------------------   |
|   |ATLETA|ATLETA|ATLETA|ATLETA|ATLETA|ATLETA|   |  |  1   |  2   |  3   |  4   |  5   |  6   |   |  |   --- --------- --------- ---   |
|   |
|  -----------------------------------------------------------------  |
|   |
|  PERSONAL INDEPENDENTE:   |
|   |
|   +-----------------------------------------------------------------   |
|   | PERSONAL |   |  |   D   |   |  |   -------   |
|   |   |  |   +-----------------------------------------------------------------   |
|   |   |
|   |
|   +----------------------------------------------------------------- +-----------------------------------------------------------------   |
|   |ATLETA|ATLETA|   |  |  7   |  8   |   |  |   --- ---   |
|   |
|  ------------------------------------------------------------------   |   |  Para o ATLETA, a experiência é IDÃŠNTICA independente da origem.   |   |
--------------------------------------------------------------------------
```

---

## 13. RESUMO

### 13.1 Telas do Atleta

| Tela | Função | Prioridade |------|--------|:----------:| **HOJE** | Treino, dieta, trackers do dia |  Alta | **COACH** | Chat com Vitrúvio |  Alta | **PROGRESSO** | Evolução e medidas |  Média | **PERFIL** | Dados e configurações |  Baixa |

### 13.2 Ações Principais

| Ação | Localização | Frequência |------|-------------|:----------:| Ver treino do dia | HOJE | Diária | Completar treino | HOJE | Diária | Registrar refeição | HOJE / COACH | 3-5x/dia | Registrar água | HOJE | 5-10x/dia | Falar com Coach | COACH | Conforme necessidade | Ver progresso | PROGRESSO | Semanal |

### 13.3 Princípios Aplicados

 **Menos é mais** - Apenas 4 abas no menu  
 **Ação primeiro** - Treino e dieta em destaque  
 **Um toque** - Registrar água com 1 clique  
 **Feedback instantÃ¢neo** - Toasts de confirmação  
 **Mobile first** - Layout otimizado para celular  

---

## 14. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial - Portal simplificado do Atleta |
| 1.1 | Mar/2026 | Estado real da implementação |

---

## 15. ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### Componente Principal
- `PortalAluno.tsx` (15K+) em `templates/Portal/` — Container principal do portal
- `PortalLayout.tsx` — Layout com bottom nav de 5 abas

### Abas Implementadas (5, não 4 como planejado)
| Aba | Componente | Status |
|-----|-----------|--------|
| **Home** | `HomeTab.tsx` | ✅ Cards de treino, dieta, trackers, alerta do coach |
| **Treino** | `TreinoTab.tsx` | ✅ Treino do dia com exercícios, vídeos, registro de carga |
| **Dieta** | `DietaTab.tsx` | ✅ Dieta do dia com macros e refeições |
| **Evolução** | `EvolucaoTab.tsx` | ✅ Score, gráficos, proporções |
| **Perfil** | `PerfilTab.tsx` | ✅ Dados pessoais, personal, configurações |

### O Que Está Funcionando ✅
- [x] Acesso via token (sem cadastro do atleta)
- [x] Bottom navigation com 5 abas
- [x] Card de treino do dia com completar/pular
- [x] Exercícios com vídeos e detalhes (modal)
- [x] Registro de carga por exercício
- [x] Trackers rápidos (água, sono, peso, feedback)
- [x] Alerta do Coach com insights
- [x] Dieta do dia com macros
- [x] Evolução com gráficos (Recharts)
- [x] Header de identidade padrão
- [x] Gamificação (badges, streaks)

### Pendências
- [ ] Chat com Coach IA (aba dedicada)
- [ ] Ranking / Hall dos Deuses
- [ ] Onboarding de primeiro acesso (passo-a-passo)
- [ ] Notificações push para atleta

---

**VITRU IA - Portal do Atleta v1.1**  
*Simples  Focado  Direto ao Ponto*
