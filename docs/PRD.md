# SHAPE-V — Product Requirements Document (PRD)

**Versão:** 1.0  
**Data:** 06/02/2026  
**Status:** Draft  
**Plataforma de Desenvolvimento:** Antigravity IDE  

---

## 1. Visão Geral do Produto

### 1.1 Propósito

SHAPE-V é uma plataforma SaaS B2B2C de avaliação física inteligente focada na **estética clássica masculina** (físico "Deus Grego"). A aplicação utiliza IA para analisar proporções áureas corporais, assimetrias bilaterais e composição corporal, gerando planos de treino e dieta personalizados para que o usuário evolua em direção ao ideal das proporções clássicas (Golden Ratio 1.618).

### 1.2 Problema

Personal trainers e academias realizam avaliações físicas de forma manual e genérica, sem foco em proporções estéticas nem análise inteligente de assimetrias. Os alunos que buscam o físico clássico (V-Taper, simetria bilateral, proporções áureas) não possuem ferramentas que monitorem sua evolução em direção a esse ideal específico e sugiram correções inteligentes.

### 1.3 Solução

Uma plataforma que:

- Captura medidas antropométricas completas (lineares, dobras cutâneas, bilaterais)
- Calcula automaticamente proporções áureas, índices de simetria e composição corporal
- Compara com padrões clássicos (referência Steve Reeves e Golden Ratio)
- Utiliza IA para diagnosticar pontos fracos, assimetrias e gerar estratégias de treino e dieta personalizadas
- Oferece histórico visual de evolução com gráficos de convergência ao ideal áureo

### 1.4 Nome e Identidade

- **Nome:** SHAPE-V (referência ao V-Taper / Shape em "V")
- **Tagline:** "Aesthetic Architect — A Matemática do Físico Clássico Validada pela Ciência e Inteligência Artificial"
- **Escala Shape-V:** Bloco → Normal → Atlético → Estético → Freak
- **Target Golden Ratio:** 1.618

---

## 2. Mercado e Oportunidade

### 2.1 Tamanho de Mercado (Brasil)

| Nível | Estimativa | Descrição |
|-------|-----------|-----------|
| **TAM (Mercado Total)** | 11.000.000 | Homens que frequentam academias regularmente no Brasil |
| **SAM (Mercado Endereçável)** | 4.400.000 | Homens cujo objetivo principal ou secundário é estética e hipertrofia |
| **SOM (Mercado Foco/Core)** | 2.000.000 | Homens "Hardcore" que buscam simetria, perfeição visual e usam suplementação |

### 2.2 Base de Mercado Direto (B2B)

| Segmento | Quantidade |
|----------|-----------|
| Academias (pontos de venda/atuação) | 57.000 |
| Personal Trainers / Professores (influenciadores/prestadores) | 267.000 |
| **Total de foco direto** | **~324.000 unidades** |

**Proporção de Usuários:** ~82% Personal Trainers, ~18% Academias.

### 2.3 Projeção Financeira

**Premissas:**
- Base de Mercado Total: 324.000 usuários (57.000 Academias + 267.000 Personais)
- ARPU Personal: R$ 100,00/mês
- ARPU Academia: R$ 500,00/mês

**Cenários de MRR:**

| Cenário | Penetração | Usuários Ativos | Personais Ativos | Academias Ativas | MRR |
|---------|-----------|----------------|-----------------|-----------------|-----|
| Conservador | 1% | 3.240 | 2.670 | 570 | R$ 552.000 |
| Moderado | 3% | 9.720 | 8.010 | 1.710 | R$ 1.656.000 |
| Otimista | 5% | 16.200 | 13.350 | 2.850 | R$ 2.760.000 |

---

## 3. Precificação (Tiered Pricing)

| Plano | Perfil do Usuário | Faixa de Alunos | Preço Mensal | Custo Médio/Aluno |
|-------|-------------------|----------------|-------------|-------------------|
| **Starter** | Personal Iniciante | Até 5 alunos | R$ 49,90 | R$ 9,98 |
| **Pro** | Personal Estabelecido | Até 20 alunos | R$ 99,90 | R$ 4,99 |
| **Elite** | Personal High Ticket | Até 50 alunos | R$ 189,90 | R$ 3,79 |
| **Academia Small** | Estúdios/Academias | Até 150 alunos | R$ 399,90 | R$ 2,66 |
| **Academia Business** | Academias Médias | Até 500 alunos | R$ 799,90 | R$ 1,59 |
| **Enterprise** | Grandes Redes | Acima de 500 | Sob consulta | < R$ 1,00 |

**Modelo:** Custo por aluno decrescente para incentivar a escala. Usuário final (aluno direto, sem personal) terá plano gratuito com limitações ou plano individual a definir.

---

## 4. Usuários e Personas

### 4.1 Tipos de Usuário

| Tipo | Papel | Acesso |
|------|-------|--------|
| **Admin Plataforma** | Administrador SHAPE-V | Gestão global, métricas, billing |
| **Academia** | Empresa/CNPJ | Cadastra e gerencia personais/professores, vê métricas agregadas |
| **Personal/Professor** | Profissional de educação física | Cadastra e gerencia alunos, realiza avaliações, acessa Coach IA |
| **Aluno (via Personal)** | Aluno vinculado a um personal/academia | Visualiza suas avaliações e evolução (read-only ou conforme permissão) |
| **Aluno (Direto)** | Usuário final independente | Cadastra suas próprias avaliações, acessa Coach IA com limitações |

### 4.2 Preferência de Categoria / Modo de Comparação

Cada usuário (personal ou aluno) pode definir em seu perfil o **Modo de Comparação padrão**, que será usado como referência nas avaliações:

| Modo | Ícone | Descrição |
|------|-------|-----------|
| Golden Ratio | 🏛️ | Proporções áureas clássicas (Steve Reeves, 1.618) — **padrão** |
| Classic Physique | 🏆 | Referência CBum (ajustada ao frame do usuário) |
| Men's Physique | 🏖️ | Padrão ideal da categoria IFBB Men's Physique |

O personal pode definir o modo de comparação por aluno (ex: um aluno que compete em Classic Physique usa modo CBum, outro que busca estética natural usa Golden Ratio). O modo pode ser alterado a qualquer momento sem afetar dados históricos — apenas recalcula os targets de exibição.

### 4.2 Hierarquia de Dados

```
Academia (tenant)
  └── Personal/Professor (membro)
        └── Aluno (cadastro)
              └── Avaliação (registro)
                    ├── Medidas Corporais
                    ├── Índices Básicos
                    ├── Proporções Áureas
                    ├── Análise de Assimetrias
                    └── Coach IA (Treino + Dieta)
```

---

## 5. Arquitetura de Features

### 5.1 Módulos Principais

#### 5.1.1 Módulo de Cadastro e Gestão

**Funcionalidades:**
- Cadastro de academia (dados empresa, logo, plano)
- Cadastro de personais/professores (vinculados a academia ou independentes)
- Cadastro de alunos (dados pessoais, objetivos, histórico)
- Gestão de vínculos (aluno ↔ personal ↔ academia)
- Dashboard de gestão (total de alunos, avaliações realizadas, evolução agregada)

#### 5.1.2 Módulo de Avaliação IA

**Tela: "Avaliação IA"** — Registro antropométrico e inteligência de simetria corporal.

**Medidas Corporais capturadas:**

**Básicas:**
| Campo | Unidade |
|-------|---------|
| Idade | anos |
| Altura | cm |
| Peso | kg |

**Tronco:**
| Campo | Unidade |
|-------|---------|
| Pescoço | cm |
| Ombros | cm |
| Peitoral | cm |

**Core:**
| Campo | Unidade |
|-------|---------|
| Cintura | cm |
| Quadril | cm |

**Membros (Esquerdo / Direito):**
| Campo | Esq. | Dir. | Unidade |
|-------|------|------|---------|
| Braço | - | - | cm |
| Antebraço | - | - | cm |
| Pulso | - | - | cm |
| Coxa | - | - | cm |
| Joelho | - | - | cm |
| Panturrilha | - | - | cm |
| Tornozelo | - | - | cm |

**Protocolo 7 Dobras Cutâneas:**
| Dobra | Unidade |
|-------|---------|
| Tricipital | mm |
| Subescapular | mm |
| Peitoral | mm |
| Axilar Média | mm |
| Suprailíaca | mm |
| Abdominal | mm |
| Coxa | mm |

#### 5.1.3 Módulo de Resultados da Avaliação

A tela de resultados possui **3 abas:**

**Aba 1 — Diagnóstico Estético**
- **Avaliação Geral:** Score de 0 a 100 pontos (nota A/B/C/D/E), classificação textual ("Excelente! Próximo do ideal clássico.")
- **Radar de Simetria:** Gráfico radar com eixos: V-Taper, Tronco, Braço, Antebraço, Cintura, Coxas, Panturrilha, Trindade (pescoço=braço=panturrilha)
- **Gordura Corporal:** Percentual atual com variação (ex: 12.9%, -2.1%), gauge visual, classificação (Atleta/Normal/Acima), métodos Marinha e Pollock
- **Peso Atual:** Peso total com variação
- **Peso Magro:** Massa livre de gordura (músculos, ossos, etc.)
- **Peso Gordo:** Massa adiposa total
- **Análise da Inteligência Artificial:** Texto descritivo com insights sobre composição e simetria

**Aba 2 — Proporções Áureas / Comparativo de Referência**

O usuário pode escolher o **Modo de Comparação** entre três referências distintas:

| Modo | Referência | Descrição | Público-alvo |
|------|-----------|-----------|-------------|
| **🏛️ Golden Ratio (Padrão)** | Steve Reeves + Proporção Áurea (1.618) | O ideal matemático clássico das proporções gregas. Busca simetria perfeita e harmonia natural entre segmentos corporais. | Todos os usuários; base default |
| **🏆 Classic Physique (CBum)** | Chris Bumstead (6x Mr. Olympia Classic Physique) | As proporções do maior expoente moderno da categoria Classic Physique. Combina volume muscular elevado com V-Taper extremo e linhas clássicas. | Usuários que almejam o físico de competição Classic Physique |
| **🏖️ Men's Physique (Categoria)** | Padrão médio dos Top 5 Olympia Men's Physique | Referência baseada nos parâmetros médios dos melhores competidores da categoria (não há um expoente único dominante). Foco em upper body estético com cintura fina e costas largas, sem ênfase excessiva em pernas. | Usuários que buscam o "beach body" estético de competição |

**Detalhamento das Referências:**

**🏆 Referência Classic Physique — Chris Bumstead (CBum)**

CBum é o maior campeão da história da categoria Classic Physique (6 títulos consecutivos no Mr. Olympia, 2019-2024, aposentado após o 6º título). Suas proporções representam o ápice moderno do ideal clássico com volume muscular superior.

*Medidas de referência em competição (aproximadas, não oficiais):*

| Medida | Valor (aprox.) | Contexto |
|--------|---------------|----------|
| Altura | 185 cm (6'1") | — |
| Peso (stage) | ~108 kg (237 lbs) | Peso em competição |
| Peso (off-season) | ~120 kg (264 lbs) | Peso fora de temporada |
| Peitoral | ~130 cm (51") | — |
| Cintura | ~76 cm (30") | Cintura extremamente fina para o frame |
| Braço | ~51 cm (20") | — |
| Coxa | ~76 cm (30") | — |
| BF% (stage) | ~3-4% | Condição de palco |
| FFMI | ~29.2 | Índice de massa livre de gordura |

*Proporções-chave CBum:*

| Proporção | Valor CBum | vs Golden Ratio (1.618) |
|-----------|-----------|----------------------|
| V-Taper (Ombros/Cintura) | ~1.82 | Acima do golden ratio — V-Taper mais extremo |
| Peitoral/Cintura | ~1.71 | Próximo do golden ratio |
| Coxa/Cintura | ~1.00 | — |

*Como funciona:* O sistema escala as medidas de CBum proporcionalmente à estrutura óssea do usuário (usando pulso, tornozelo e altura como referência de frame size). Assim, um usuário de 1.70m não terá como meta os mesmos centímetros absolutos de CBum (1.85m), mas sim as mesmas *proporções* ajustadas ao seu frame.

```
Meta_Ajustada = Medida_CBum × (Frame_Usuário / Frame_CBum)
Frame = f(pulso, tornozelo, altura)
```

**🏖️ Referência Men's Physique — Padrão da Categoria**

A Men's Physique é uma categoria que não possui um expoente único e dominante como a Classic Physique teve com CBum. Campeões recentes incluem Ryan Terry (2023, 2024, 2025), Erin Banks (2022), Brandon Hendrickson (2020, 2021) e Jeremy Buendia (4x, 2014-2017). A divisão valoriza a estética de "beach body": ombros largos, cintura fina, costas em V, braços proporcionais, com foco no upper body (competidores usam board shorts, pernas não são julgadas diretamente).

*Ao invés de uma referência individual, o sistema utiliza um "Padrão Ideal Men's Physique" baseado em:*

| Parâmetro | Critério da Categoria |
|-----------|----------------------|
| V-Taper | Extremo — foco principal de julgamento |
| Ombros | Largos, cap arredondado (deltóides 3D), sem bloqueio |
| Cintura | A menor possível, abs definidos com separação profunda |
| Costas | Amplas, com boa espessura e detalhamento |
| Braços | Proporcionais ao tronco, não excessivamente volumosos |
| Peitoral | Cheio, com separação, sem excesso de massa |
| Pernas | Não avaliadas diretamente (board shorts), mas proporcionais |
| BF% ideal | 5-7% (condição de palco, ligeiramente menos seco que Classic) |
| Condicionamento | Pele fina, vascularidade moderada, aspecto "limpo" |

*Proporções-alvo Men's Physique:*

| Proporção | Target MP | Observação |
|-----------|----------|------------|
| V-Taper (Ombros/Cintura) | ≥ 1.65 | Proporção de ombro/cintura é o principal fator |
| Peitoral/Cintura | ~1.55 | Peito cheio mas sem massa excessiva |
| Braço | Proporcional | Braço não deve dominar o visual |
| Cintura | Mínima absoluta | Prioridade máxima da categoria |

*Como funciona:* O sistema calcula metas baseadas em ratios ideais da categoria, ajustados à estrutura óssea do usuário. Como não há um físico singular de referência, as metas são derivadas de médias dos top competidores e dos critérios de julgamento da IFBB.

**Implementação na Interface:**

Na aba "Proporções Áureas" da tela de Resultados da Avaliação, o usuário verá um seletor no topo da página:

```
[ 🏛️ Golden Ratio ] [ 🏆 Classic Physique (CBum) ] [ 🏖️ Men's Physique ]
```

Ao trocar o modo:
- As **barras de progresso** recalibram seus targets
- As **metas em centímetros** se ajustam ao padrão escolhido
- O **status textual** reflete a distância ao novo target
- O **gráfico radar** se reorganiza (Men's Physique pode omitir ou reduzir peso das pernas)
- A **Análise da IA** no Coach IA contextualiza recomendações para a categoria escolhida

**Na tela de Evolução (Gráficos):**
- O gráfico "Evolução Áurea" mostra a **linha target** referente ao modo selecionado
- O usuário pode alternar entre modos para ver sua convergência relativa a cada referência

**No Coach IA:**
- O diagnóstico, treino e dieta são **contextualizados** para a categoria escolhida
- Classic Physique: foco em volume muscular + proporções + pernas completas
- Men's Physique: foco em upper body, V-Taper extremo, cintura mínima, condicionamento limpo
- Golden Ratio: foco em equilíbrio natural e simetria matemática

---

Para cada proporção (independente do modo de comparação selecionado):
- Ilustração anatômica com linhas de referência
- Nome da métrica e valor atual em cm
- Meta Reeves (quando aplicável)
- Barra de progresso visual (Bloco → Normal → Atlético → Estético → Freak)
- Indicador "VOCÊ" na barra
- Target GOLDEN indicado
- Status textual (ex: "QUASE LÁ (1.56)", "EM PROGRESSO (81%)")

**Proporções calculadas:**

| Proporção | Fórmula | Target |
|-----------|---------|--------|
| **Shape-V (V-Taper Index)** | Ombros ÷ Cintura | 1.618 (Golden Ratio) |
| **Poder de Tronco (Peitoral)** | Peitoral absoluto | Meta Reeves baseada em estrutura óssea |
| **Braço** | Braço absoluto | Meta Reeves (ex: 34.2cm) |
| **Proporção Braço/Antebraço** | Braço ÷ Antebraço | ~1.618 |
| **Proporção Coxa/Joelho** | Coxa ÷ Joelho | ~1.618 |
| **Proporção Coxa/Panturrilha** | Coxa ÷ Panturrilha | ~1.618 |
| **Proporção Panturrilha/Tornozelo** | Panturrilha ÷ Tornozelo | ~1.618 |
| **Trindade Clássica** | Pescoço ≈ Braço ≈ Panturrilha | Igualdade entre os três |

**Aba 3 — Análise de Assimetrias**

Para cada grupo muscular bilateral:
- Badge: "DIFERENCIAL BILATERAL" + "REVIEW" (quando assimetria alta)
- Nome do grupo muscular
- Medida Esq. vs Dir. (ex: L: 41cm R: 44.5cm)
- Diferença absoluta em cm (ex: 3.5 DIFF/CM)
- Barra visual indicando lado dominante
- Classificação: SIMÉTRICO (< 3%) / ASSIMETRIA MODERADA (3-5%) / ASSIMETRIA ALTA (> 5%)
- Percentual de assimetria

**Radar de Desequilíbrio:**
- Gráfico radar tipo "teia de aranha" com todos os grupos musculares
- Sobreposição lado esquerdo (azul) vs lado direito (rosa/magenta)
- % Score geral de simetria (ex: 95% Score)
- Comparativo visual de Braço, Antebraço, Pulso, Coxa, Joelho, Panturrilha, Tornozelo

**Grupos analisados:** Braço, Antebraço, Pulso, Coxa, Joelho, Panturrilha, Tornozelo.

#### 5.1.4 Módulo "Momento" (Dashboard Principal)

Tela inicial do aluno mostrando:
- Hero banner: "SIMETRIA DO FÍSICO PERFEITO — A Matemática do Físico Clássico Validada pela Ciência e Inteligência Artificial"
- **Pontuação Geral:**
  - Escala Shape-V com ratio atual (ex: 1.56) e posição na barra
  - Avaliação Geral (ex: A 80/100 pts) com gráfico circular
- **Métricas Principais:** Cards com medidas-chave
- Botão "REALIZAR AVALIAÇÃO IA"

#### 5.1.5 Módulo "Evolução"

Histórico completo de avaliações e progresso físico.

**Modo Lista:**
- Tabela com colunas: Data Avaliação, Tipo, Peso Corporal, Gordura Corporal, Shape-V, Assimetria (Média), Ações (visualizar, editar, excluir)

**Modo Gráficos:**
- **Evolução Áurea:** Convergência para o Golden Ratio (1.618) ao longo do tempo, com linha target tracejada
- **Medidas Brutas (cm):** Seletor de grupo muscular (ex: Ombros), evolução temporal
- **Evolução do Peso (kg):** Peso total (azul), peso magro (verde), peso gordo (vermelho) ao longo do tempo
- **Gordura Corporal (%):** Evolução percentual com método selecionável (Navy/Pollock)
- **Scanner de Assimetrias:** Evolução da diferença bilateral por grupo muscular, threshold visual (< 0.5cm verde / > 1.5cm laranja)
- Filtros temporais: 3M, 6M, 1Y, ALL

#### 5.1.6 Módulo "Coach IA"

Assistente inteligente para periodização de treino e dieta.

**Seção: Consultoria Inteligente**
"Nossa IA cruza seus dados biométricos com as proporções da Era de Ouro para gerar um plano de ação completo: Diagnóstico, Treino e Nutrição."

**3 Pilares:**

| Pilar | Nome | Funcionalidade |
|-------|------|---------------|
| **01. Diagnóstico** | Insights do Coach IA | Avaliação Estrutural — Gera conselhos acionáveis via IA baseados na estrutura óssea específica e desenvolvimento muscular atual. Botão: "Consultar o Coach" |
| **02. Estratégia** | Hipertrofia Corretiva | Personalização Total — A IA analisa pontos fracos (Radar de Simetria) para criar uma rotina de especialização, enquanto mantém pontos fortes. Botão: "Gerar Estratégia de Treino" |
| **03. Nutrição** | Combustível Metabólico | Dieta Proporcional — A IA calcula macros específicos para afinar a cintura ou preencher grupos musculares fracos (Bulking/Cutting inteligente). Botão: "Gerar Dieta" |

---

## 6. Fluxos de Usuário Principais

### 6.1 Fluxo da Academia

1. Academia se cadastra → escolhe plano (Academia Small / Business / Enterprise)
2. Cadastra personais/professores vinculados
3. Cada personal cadastra seus alunos
4. Personal realiza avaliação IA do aluno
5. IA processa e gera resultados (3 abas)
6. Personal acessa Coach IA para gerar plano de treino e dieta
7. Aluno visualiza seus resultados e evolução
8. Novas avaliações periódicas alimentam o histórico

### 6.2 Fluxo do Personal Independente

1. Personal se cadastra → escolhe plano (Starter / Pro / Elite)
2. Cadastra seus alunos
3. Realiza avaliação IA → Resultados → Coach IA
4. Acompanha evolução dos alunos ao longo do tempo

### 6.3 Fluxo do Aluno Direto

1. Aluno se cadastra (plano gratuito ou individual)
2. Registra suas próprias medidas corporais
3. Realiza Avaliação IA
4. Visualiza resultados e acessa Coach IA (com limitações)
5. Registra novas avaliações e acompanha evolução

---

## 7. Requisitos Técnicos

### 7.1 Stack Tecnológica (Antigravity IDE)

A definir com base nas capacidades da plataforma Antigravity. Considerações:

| Camada | Tecnologia Sugerida |
|--------|-------------------|
| Frontend | Next.js / React (Antigravity compatible) |
| Backend/API | Antigravity functions / API routes |
| Banco de Dados | PostgreSQL (relacional para dados estruturados) |
| Autenticação | Auth integrado (Antigravity) ou Clerk/NextAuth |
| IA/ML | Anthropic Claude API (para Coach IA) |
| Gráficos | Recharts ou Chart.js |
| Hospedagem | Antigravity Cloud |

### 7.2 Modelo de Dados (Entidades Principais)

```
Organization (Academia)
├── id, name, cnpj, logo, plan_id, created_at
│
├── Subscription
│   ├── plan_type, status, max_students, billing_cycle
│
├── Professional (Personal/Professor)
│   ├── id, org_id (nullable), name, email, cref, plan_id
│   │
│   └── Student (Aluno)
│       ├── id, professional_id, org_id, name, email, birth_date, gender, goals
│       ├── comparison_mode: enum('golden_ratio', 'classic_physique', 'mens_physique')
│       │
│       └── Assessment (Avaliação)
│           ├── id, student_id, professional_id, date, type
│           │
│           ├── BasicMeasurements
│           │   ├── age, height, weight
│           │
│           ├── TrunkMeasurements
│           │   ├── neck, shoulders, chest
│           │
│           ├── CoreMeasurements
│           │   ├── waist, hip
│           │
│           ├── LimbMeasurements (bilateral)
│           │   ├── muscle_group, left_cm, right_cm
│           │   ├── (arm, forearm, wrist, thigh, knee, calf, ankle)
│           │
│           ├── SkinFolds (7 dobras)
│           │   ├── tricep, subscapular, chest, midaxillary,
│           │   │   suprailiac, abdominal, thigh
│           │
│           ├── CalculatedResults (computed)
│           │   ├── body_fat_pct_navy, body_fat_pct_pollock
│           │   ├── lean_mass, fat_mass
│           │   ├── shape_v_ratio, overall_score
│           │   ├── golden_proportions (JSON)
│           │   ├── asymmetry_analysis (JSON)
│           │   ├── symmetry_radar_score
│           │
│           └── AICoachOutput
│               ├── diagnosis_text, training_plan, diet_plan
│               ├── generated_at, model_version
│
└── Plan
    ├── id, name, tier, max_students, price_monthly
```

### 7.3 Cálculos e Fórmulas

**Gordura Corporal — Método Marinha (Navy):**
```
BF% = 86.010 × log10(cintura - pescoço) - 70.041 × log10(altura) + 36.76
```

**Gordura Corporal — Protocolo 7 Dobras (Pollock/Jackson):**
```
Densidade = 1.112 - 0.00043499(S) + 0.00000055(S²) - 0.00028826(idade)
S = soma das 7 dobras
BF% = (495 / Densidade) - 450
```

**Peso Magro:**
```
Peso Magro = Peso × (1 - BF%/100)
```

**Peso Gordo:**
```
Peso Gordo = Peso × (BF%/100)
```

**Shape-V (V-Taper Index):**
```
Shape-V = Ombros / Cintura
Target = 1.618
```

**Proporções Áureas Genéricas:**
```
Ratio = Medida_Maior / Medida_Menor
Target = 1.618
Progresso% = (Ratio_Atual / 1.618) × 100
```

**Assimetria Bilateral:**
```
Diff_cm = |Esquerdo - Direito|
Diff_pct = (Diff_cm / max(Esquerdo, Direito)) × 100
Classificação:
  < 3% → SIMÉTRICO
  3-5% → ASSIMETRIA MODERADA
  > 5% → ASSIMETRIA ALTA
```

**Avaliação Geral (Score 0-100):**
```
Score = w1 × ProporçãoScore + w2 × SimetriaScore + w3 × ComposiçãoScore
Sugestão de pesos: w1=0.40, w2=0.35, w3=0.25
Grade: A (80-100), B (60-79), C (40-59), D (20-39), E (0-19)
```

**Metas Steve Reeves (baseadas em estrutura óssea):**
```
Meta Braço = Pulso × 2.52
Meta Panturrilha = Tornozelo × 1.92
Meta Pescoço ≈ Braço ≈ Panturrilha (Trindade Clássica)
Meta Peitoral = Cintura × 1.48 (ou baseada em medida de tórax)
Meta Coxa = Joelho × 1.75
```

**Ajuste de Metas por Modo de Comparação:**

O sistema armazena um "Physique Reference Profile" para cada modo. As metas absolutas (em cm) são calculadas ajustando as proporções da referência à estrutura óssea do usuário.

```
Frame Index = (Pulso_cm + Tornozelo_cm + Altura_cm) / 3
Fator de Escala = Frame_Index_Usuário / Frame_Index_Referência
```

*Referência Classic Physique (CBum):*
```
Frame_CBum = (19.0 + 24.5 + 185) / 3 = 76.17
Ratios_CBum:
  V-Taper (Ombros/Cintura) = ~1.82
  Peitoral/Cintura = ~1.71
  Braço_target = Pulso_usuario × 2.68  (CBum: ~51/19 = 2.68)
  Panturrilha_target = Tornozelo_usuario × 2.08
  Coxa_target = Joelho_usuario × 1.86
```

*Referência Men's Physique (Padrão Categoria):*
```
Ratios_MP:
  V-Taper (Ombros/Cintura) = ≥ 1.65
  Peitoral/Cintura = ~1.55
  Braço_target = Pulso_usuario × 2.40  (braço proporcional, não massivo)
  Panturrilha_target = Tornozelo_usuario × 1.85
  Coxa_target = não priorizado (mas Joelho × 1.65 como referência)
Pesos do Score MP:
  Upper Body (V-Taper, ombros, costas, peito, braços) = 70%
  Core (cintura, abs) = 20%
  Lower Body = 10%
```

*Referência Golden Ratio (Padrão):*
```
Ratios_GR:
  Todas as proporções target = 1.618
  Braço_target = Pulso × 2.52 (Steve Reeves)
  Panturrilha_target = Tornozelo × 1.92
  Coxa_target = Joelho × 1.75
Pesos do Score GR:
  Proporções = 40%, Simetria = 35%, Composição = 25%
```

### 7.4 Integração com IA (Coach IA)

**Provider:** Anthropic Claude API (ou equivalente)

**Contexto enviado à IA por avaliação:**
- Todas as medidas brutas (básicas, tronco, core, membros bilaterais, dobras cutâneas)
- Resultados calculados (BF%, peso magro/gordo, proporções áureas, assimetrias)
- Histórico de avaliações anteriores (tendências)
- Score geral e classificação
- Objetivos do aluno

**Outputs esperados:**

1. **Diagnóstico (Insights do Coach):** Análise textual da estrutura atual, pontos fortes, pontos a melhorar, prioridades baseadas no gap para o ideal áureo.

2. **Estratégia de Treino (Hipertrofia Corretiva):** Rotina semanal com foco em grupos musculares deficitários para corrigir proporções e assimetrias. Inclui exercícios unilaterais quando há assimetria, ênfase em grupos que estão abaixo do target áureo.

3. **Dieta (Combustível Metabólico):** Plano de macros calculado para o objetivo (bulking para preencher grupos fracos, cutting para afinar cintura se V-Taper está baixo). Macros diários com distribuição de refeições.

### 7.5 Requisitos Não-Funcionais

| Requisito | Especificação |
|-----------|--------------|
| Performance | Tempo de resposta < 2s para operações CRUD, < 10s para geração IA |
| Disponibilidade | 99.5% uptime |
| Escalabilidade | Suportar até 50.000 usuários simultâneos |
| Segurança | LGPD compliance, dados de saúde criptografados, auth multi-fator opcional |
| Idioma | Português (BR) como padrão, estrutura para i18n futuro |
| Mobile | Responsivo (mobile-first para uso em academias) |
| Offline | Cache local de última avaliação para consulta rápida |

---

## 8. Design e UX

### 8.1 Design System

- **Tema:** Dark mode como padrão (ambiente de academia/treino)
- **Cores primárias:** Azul profundo (#0A0F1C base), Ciano/Teal (#00C9A7 destaque), Roxo (#7C3AED accent)
- **Tipografia:** Sans-serif moderna, boa legibilidade em contraste escuro
- **Visualizações:** Gráficos com cores vibrantes em fundo escuro (azul para dados, verde para peso magro, vermelho para gordura, laranja para assimetrias altas)
- **Ícones:** Lucide ou equivalente
- **Ilustrações:** Silhuetas anatômicas com linhas de referência (Golden Ratio overlay)

### 8.2 Navegação

**Menu lateral (sidebar):**
- Momento (dashboard)
- Evolução (histórico + gráficos)
- Coach IA (treino + dieta)
- Sistema: Perfil, Configurações, Sair

**Header:**
- Breadcrumb (SHAPE-V / Seção atual)
- Botão "REALIZAR AVALIAÇÃO IA" (sempre acessível)
- Notificações

**Footer:**
- Central de Ajuda, Abrir Chamado, Documentação
- Status do sistema (ex: "SISTEMAS OPERACIONAIS v1.0.0 Beta")
- Termos de Uso, Privacidade

---

## 9. Roadmap

### Fase 1 — MVP (Meses 1-3)
- Cadastro de usuários (personal + aluno direto)
- Formulário de avaliação completo (medidas + dobras cutâneas)
- Cálculos automáticos (composição corporal, proporções áureas, assimetrias)
- Tela de resultados (3 abas)
- Dashboard "Momento"
- Autenticação e billing (planos Starter e Pro)

### Fase 2 — Evolução + IA (Meses 3-5)
- Histórico de avaliações
- Gráficos de evolução (todos os tipos)
- Integração Coach IA (diagnóstico + treino + dieta)
- Planos Elite e Academia Small

### Fase 3 — Multi-tenant (Meses 5-7)
- Módulo Academia (gestão de personais e alunos)
- Dashboard agregado para academias
- Planos Academia Business e Enterprise
- Permissões granulares por papel

### Fase 4 — Escala (Meses 7-12)
- App mobile nativo (iOS + Android)
- Integração com dispositivos (balanças inteligentes, fitas métricas Bluetooth)
- Análise por foto (computer vision para estimativa de medidas)
- Marketplace de personais
- Gamificação (rankings, badges de evolução)
- API pública para integrações de terceiros

---

## 10. Métricas de Sucesso (KPIs)

| Métrica | Meta (6 meses) |
|---------|----------------|
| Usuários cadastrados (personais) | 1.000+ |
| Alunos cadastrados | 5.000+ |
| Avaliações realizadas/mês | 3.000+ |
| MRR | R$ 100.000+ |
| Churn mensal | < 5% |
| NPS | > 50 |
| Tempo médio para primeira avaliação | < 10 min |
| Taxa de retenção 30 dias | > 70% |

---

## 11. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Baixa adoção por personais | Alto | Onboarding assistido, trial gratuito, conteúdo educativo sobre proporções áureas |
| Custo de IA alto por avaliação | Médio | Cache de resultados similares, rate limiting, otimização de prompts |
| Precisão das medidas manuais | Médio | Guias visuais de medição, vídeos tutoriais, futura integração com computer vision |
| Concorrentes genéricos (apps de treino) | Médio | Diferenciação radical no nicho estético/proporções áureas — ninguém faz isso com IA |
| LGPD e dados de saúde | Alto | Consentimento explícito, criptografia, data retention policies, DPO |

---

## 12. Glossário

| Termo | Definição |
|-------|-----------|
| **Golden Ratio** | Proporção áurea (1.618), base matemática das proporções estéticas ideais |
| **V-Taper** | Formato em "V" do tronco (ombros largos, cintura fina) — principal indicador estético |
| **Shape-V** | Índice proprietário = Ombros ÷ Cintura. Quanto mais próximo de 1.618, mais estético |
| **Steve Reeves** | Referência do fisiculturismo clássico da Era de Ouro, padrão de proporções ideais |
| **Trindade Clássica** | Pescoço ≈ Braço ≈ Panturrilha — sinal de desenvolvimento proporcional |
| **Assimetria Bilateral** | Diferença de medida entre lado esquerdo e direito do mesmo grupo muscular |
| **Hipertrofia Corretiva** | Treino focado em corrigir proporções e assimetrias, não apenas ganhar massa |
| **BF%** | Body Fat Percentage — percentual de gordura corporal |
| **ARPU** | Average Revenue Per User — receita média por usuário |
| **MRR** | Monthly Recurring Revenue — receita mensal recorrente |
