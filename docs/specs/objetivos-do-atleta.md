# SPEC: Objetivos do Atleta

## Sistema de Metas e Planejamento de 12 Meses

**Versão:** 1.2  
**Data:** Fevereiro 2026  
**Módulo:** Onboarding / Plano de Evolução

---

## 1. VISÃO GERAL

### 1.1 Propósito

Esta SPEC define os **objetivos disponíveis** para atletas no VITRÚVIO IA e como cada objetivo se traduz em estratégias concretas de treino, dieta e acompanhamento ao longo de 12 meses.

### 1.2 Princípio Central

O VITRÚVIO não apenas pergunta "qual seu objetivo", mas **analisa a situação atual** do atleta (% gordura, FFMI, proporções, experiência) e **sugere o objetivo mais adequado**.

### 1.3 Diferencial VITRÚVIO

- **Físico Proporcional (Golden Ratio)** como objetivo central e diferenciado
- **Análise de proporções** para identificar pontos fracos automaticamente
- **Planos adaptativos** que ajustam conforme o progresso

---

## 2. OBJETIVOS DISPONÍVEIS

### 2.0 Tabela Resumo

| Código | Nome | Ícone | Descrição Curta |
|--------|------|-------|-----------------|
| BULK | Ganhar Massa | 🏋️ | Ficar maior e mais forte |
| CUT | Emagrecer/Definir | 🔥 | Perder gordura, ver músculos |
| RECOMP | Recomposição | ⚖️ | Perder gordura + ganhar músculo |
| GOLDEN_RATIO | Físico Proporcional | 📐 | Shape equilibrado e estético |
| TRANSFORM | Transformação Completa | 🔄 | Mudança radical em 12 meses |
| MAINTAIN | Manutenção | ✨ | Manter físico com mínimo esforço |

---

## 2. DETALHAMENTO DOS OBJETIVOS

### 2.1 BULK - Ganhar Massa Muscular

**Descrição completa:** Foco em maximizar ganho de massa muscular através de superávit calórico controlado e treino de hipertrofia com volume progressivo.

**Para quem é indicado:**
- Pessoas magras querendo ganhar tamanho
- Atletas já definidos querendo adicionar massa
- % gordura atual < 18% (homens) ou < 28% (mulheres)
- FFMI < 22 (homens) ou < 18 (mulheres)

**Para quem NÃO é indicado:**
- % gordura > 25% (H) / > 35% (M) → fazer CUT primeiro
- Pessoas com resistência à insulina severa
- Quem não consegue treinar consistentemente

| Aspecto | Especificação |
|---------|---------------|
| **Dieta** | Superávit +200 a +400 kcal/dia (lean bulk) |
| **Proteína** | 1.8-2.2 g/kg de peso corporal |
| **Carboidratos** | Alto (4-6 g/kg), priorizando pré e pós-treino |
| **Gorduras** | Moderado (0.8-1.2 g/kg), mínimo para hormônios |
| **Ganho esperado** | 0.25-0.5 kg/semana (intermediários: 0.25 kg) |

| Aspecto Treino | Especificação |
|----------------|---------------|
| **Volume** | Alto: 16-22 séries/grupo/semana |
| **Frequência** | 2x por grupo muscular por semana |
| **Intensidade** | Moderada-alta (RIR 1-3) |
| **Periodização** | DUP ou linear com progressão de volume |
| **Foco** | Exercícios compostos + isoladores para pontos fracos |

**Estrutura de 12 meses:**

| Período | Fase | Calorias | Volume | Notas |
|---------|------|----------|--------|-------|
| Meses 1-4 | Bulk fase 1 | +300 kcal | Progressivo | Construir base |
| Mês 4-5 | Mini-cut (opcional) | -400 kcal | Manter | Se % gordura > 17% |
| Meses 5-9 | Bulk fase 2 | +300 kcal | Progressivo | Continuar ganhos |
| Mês 9-10 | Mini-cut (opcional) | -400 kcal | Manter | Se % gordura > 17% |
| Meses 10-12 | Bulk ou transição | +200 kcal | Alto | Avaliar próximo ciclo |

**Gatilhos para mini-cut:**
- % gordura ultrapassou 18% (H) / 28% (M)
- Sensibilidade à insulina diminuindo (fome constante)
- Visualmente perdendo definição demais

**Métricas de sucesso:**
- ✅ Peso subindo 0.25-0.5 kg/semana
- ✅ FFMI aumentando
- ✅ Circunferências subindo (braço, coxa, peito)
- ✅ Força progredindo nos levantamentos principais
- ✅ % gordura não ultrapassando 18% (H) / 28% (M)

**Sinais de alerta:**
- ⚠️ Ganho > 0.7 kg/semana → reduzir calorias (muito gordo)
- ⚠️ Ganho < 0.15 kg/semana por 3+ semanas → aumentar calorias
- ⚠️ Força estagnada → avaliar recuperação/volume

### 2.2 CUT - Emagrecer/Definir

**Descrição completa:** Foco em perder gordura corporal preservando o máximo de massa muscular através de déficit calórico moderado, treino de força e proteína alta.

**Para quem é indicado:**
- % gordura > 18% (H) / > 28% (M)
- Atletas pós-bulk querendo revelar músculos
- Pessoas querendo melhorar saúde metabólica
- Preparação para competições de physique

**Subtipos de CUT:**

| Subtipo | % Gordura Inicial | Déficit | Duração Típica |
|---------|-------------------|---------|----------------|
| CUT_LEVE | 18-22% (H) / 28-32% (M) | -300 kcal | 8-12 semanas |
| CUT_MODERADO | 22-28% (H) / 32-38% (M) | -400-500 kcal | 12-20 semanas |
| CUT_AGRESSIVO | >28% (H) / >38% (M) | -500-750 kcal | 16-24 semanas |
| CUT_COMPETICAO | <15% → <8% (H) | -300-400 kcal | 12-16 semanas |

| Aspecto | Especificação |
|---------|---------------|
| **Dieta** | Déficit -300 a -500 kcal/dia (moderado) |
| **Proteína** | 2.2-2.8 g/kg (MAIS ALTA que bulk!) |
| **Carboidratos** | Moderado (2-4 g/kg), priorizar treino |
| **Gorduras** | Mínimo 0.7 g/kg para hormônios |
| **Perda esperada** | 0.5-1% do peso corporal/semana |

| Aspecto Treino | Especificação |
|----------------|---------------|
| **Volume** | Moderado: 12-16 séries/grupo/semana |
| **Prioridade** | MANTER CARGAS (não reduzir peso na barra!) |
| **Frequência** | 2x por grupo muscular |
| **Intensidade** | Alta (RIR 1-2) |
| **Cardio** | Opcional: 2-4 sessões LISS ou 1-2 HIIT/semana |

**Estrutura de 12 meses (exemplo: começando 25% BF):**

| Período | Fase | Calorias | Meta BF% | Notas |
|---------|------|----------|----------|-------|
| Meses 1-3 | Cut intenso | -500 kcal | 25%→20% | Déficit maior no início |
| Mês 4 | Diet break | Manutenção | ~20% | 2 semanas para recuperar |
| Meses 4-7 | Cut moderado | -400 kcal | 20%→15% | Déficit menor |
| Mês 8 | Diet break | Manutenção | ~15% | 2 semanas |
| Meses 8-10 | Cut leve | -300 kcal | 15%→12% | Mais conservador |
| Meses 11-12 | Manutenção | TDEE | 12% | Estabilizar novo peso |

**Diet Breaks e Refeeds:**
- **Refeed:** 1-2 dias/semana com carboidratos elevados (quando <15% BF)
- **Diet Break:** 1-2 semanas em manutenção a cada 8-12 semanas de déficit
- **Propósito:** Restaurar hormônios, motivação e performance

**Métricas de sucesso:**
- ✅ % gordura diminuindo
- ✅ Circunferência abdominal reduzindo
- ✅ Força MANTIDA (não precisa subir, não pode despencar)
- ✅ FFMI mantido ou com queda mínima
- ✅ Aparência visual melhorando (fotos)

**Sinais de alerta:**
- ⚠️ Força caindo >10% → reduzir déficit ou diet break
- ⚠️ Platô >3 semanas → ajustar calorias ou adicionar cardio
- ⚠️ Fome incontrolável → refeed ou diet break
- ⚠️ Sono/humor/libido comprometidos → reduzir déficit

### 2.3 RECOMP - Recomposição Corporal

**Descrição completa:** Ganhar músculo e perder gordura SIMULTANEAMENTE, mantendo peso relativamente estável mas transformando a composição corporal.

**Para quem é indicado:**
- Iniciantes em musculação (< 1 ano de treino sério)
- Pessoas retornando após pausa longa (muscle memory)
- "Skinny fat" (pouca massa + gordura moderada)
- % gordura 15-22% (H) / 22-30% (M) com FFMI baixo
- Quem não quer fazer ciclos tradicionais de bulk/cut

**Para quem NÃO é indicado:**
- ❌ Atletas avançados já magros (muito ineficiente)
- ❌ Muito gordos >30% (H) / >40% (M) → fazer CUT primeiro
- ❌ Muito magros <10% (H) / <18% (M) → fazer BULK primeiro
- ❌ Atletas com FFMI já alto (perto do potencial genético)

**Por que funciona para iniciantes:**
- Muscle memory (retornando de pausa)
- Alta sensibilidade ao estímulo de treino
- Maior capacidade de síntese proteica
- Gordura corporal fornece energia para construir músculo

| Aspecto | Especificação |
|---------|---------------|
| **Dieta** | Manutenção ou leve déficit (-100 a -200 kcal) |
| **Proteína** | 2.0-2.4 g/kg (alta para garantir síntese) |
| **Carboidratos** | Moderado (3-4 g/kg) |
| **Gorduras** | Moderado (0.8-1.0 g/kg) |
| **Peso corporal** | Relativamente estável (±1-2 kg) |

| Aspecto Treino | Especificação |
|----------------|---------------|
| **Volume** | Moderado-alto: 14-18 séries/grupo/semana |
| **Frequência** | 2-3x por grupo muscular |
| **Intensidade** | Alta (RIR 1-2) |
| **Prioridade** | Progressão de carga é ESSENCIAL |
| **Foco** | Sobrecarga progressiva em compostos |

**Estrutura de 12 meses:**

| Período | Fase | Calorias | Foco |
|---------|------|----------|------|
| Meses 1-6 | Recomp puro | Manutenção | Treinar pesado, comer bem |
| Mês 7 | Avaliação | - | Decidir próxima fase |
| Meses 7-12 (opção A) | Continuar recomp | Manutenção | Se ainda progredindo |
| Meses 7-12 (opção B) | Transição bulk | +200 kcal | Se já magro |
| Meses 7-12 (opção C) | Transição cut | -300 kcal | Se quer definir mais |

**Expectativas realistas (iniciante, 12 meses):**
- Ganho de músculo: 4-7 kg
- Perda de gordura: 5-10 kg
- Peso líquido: pode ficar IGUAL ou até SUBIR levemente
- Visual: mudança SIGNIFICATIVA

**IMPORTANTE - A balança engana no recomp!**
```
Exemplo:
Início:  80 kg, 22% BF → 17.6 kg gordura, 62.4 kg massa magra
Final:   80 kg, 15% BF → 12.0 kg gordura, 68.0 kg massa magra

Peso: IGUAL (80 kg)
Mas: -5.6 kg gordura, +5.6 kg músculo = TRANSFORMAÇÃO
```

**Métricas de sucesso:**
- ✅ Visual mudando (fotos mensais!)
- ✅ Força SUBINDO consistentemente
- ✅ Circunferência da cintura diminuindo
- ✅ Circunferência de braço/peito aumentando
- ✅ Roupas servindo diferente

**NÃO usar como métrica principal:**
- ❌ Peso na balança (vai enganar)
- ❌ IMC (irrelevante para recomp)

### 2.4 GOLDEN_RATIO - Físico Proporcional ⭐

**⭐ ESTE É O DIFERENCIAL DO VITRÚVIO IA ⭐**

**Descrição completa:** Foco em alcançar proporções corporais ideais baseadas na Razão Áurea (φ = 1.618), desenvolvendo um físico equilibrado, simétrico e esteticamente harmonioso.

**Para quem é indicado:**
- Quem busca ESTÉTICA acima de tamanho ou força pura
- Atletas com desproporções visíveis
- Quem quer o "shape clássico" (ombros largos, cintura fina, V-taper)
- Competidores de Men's Physique / Classic Physique / Bikini
- Qualquer pessoa querendo visual harmônico

**Proporções Alvo (Golden Ratio):**

| Medida | Fórmula | Exemplo (cintura 80cm) |
|--------|---------|------------------------|
| Ombros | Cintura × 1.618 | 129.4 cm |
| Peito | Cintura × 1.4 | 112 cm |
| Braço | Cintura × 0.5 | 40 cm |
| Antebraço | Braço × 0.8 | 32 cm |
| Coxa | Cintura × 0.75 | 60 cm |
| Panturrilha | = Braço (ou pescoço) | 40 cm |
| Pescoço | = Braço | 40 cm |

**Índice de Adônis:**
```
Índice de Adônis = Circunferência dos Ombros / Circunferência da Cintura

Ideal: 1.618 (Golden Ratio)
Aceitável: 1.5 - 1.7
Abaixo de 1.4: Ombros subdesenvolvidos ou cintura larga
Acima de 1.8: Raro naturalmente, possível com genética excepcional
```

**Processo de Análise:**

1. **Medir todas as circunferências**
2. **Calcular proporções atuais vs ideais**
3. **Identificar PONTOS FRACOS** (abaixo do ideal)
4. **Identificar PONTOS FORTES** (no ideal ou acima)
5. **Criar plano de treino priorizado**

**Estratégia de Treino:**

| Classificação | Volume Semanal | Frequência | Exemplo |
|---------------|----------------|------------|---------|
| PRIORIDADE MÁXIMA | 18-22 séries | 3x/semana | Ombros se estreitos |
| PRIORIDADE ALTA | 14-18 séries | 2-3x/semana | Costas para V-taper |
| MANUTENÇÃO | 10-14 séries | 2x/semana | Grupos no ideal |
| VOLUME REDUZIDO | 6-10 séries | 1-2x/semana | Grupos acima (raro) |

**Estratégia de Dieta (depende da análise inicial):**

| Situação Inicial | Estratégia | Razão |
|------------------|------------|-------|
| % gordura > 18% (H) | Começar em CUT | Cintura menor = proporções melhores |
| % gordura 12-18% (H) | RECOMP ou BULK leve | Construir enquanto mantém cintura |
| % gordura < 12% (H) | BULK controlado | Adicionar massa nos pontos fracos |

**CHAVE: A cintura é o denominador de TODAS as proporções!**
- Reduzir 5cm de cintura melhora TODAS as razões automaticamente
- Muitas vezes, CUT + treino de ombros resolve mais que bulk

**Estrutura de 12 meses:**

| Período | Fase | Foco |
|---------|------|------|
| Mês 1 | Diagnóstico | Avaliação completa, identificar prioridades |
| Meses 2-4 | Correção Primária | Ataque intenso aos pontos fracos |
| Mês 5 | Reavaliação | Medir progresso, ajustar prioridades |
| Meses 6-8 | Correção Secundária | Continuar pontos fracos, iniciar refinamento |
| Mês 9 | Reavaliação | Segunda medição completa |
| Meses 10-11 | Refinamento | Ajustes finos, detalhes |
| Mês 12 | Polimento | Definição para revelar proporções |

**Exemplo de Plano de Treino Personalizado:**

```
Atleta com: ombros estreitos (1.35 Adônis), cintura ok, pernas boas

PRIORIDADE MÁXIMA (3x/semana):
• Deltoides lateral: 20 séries/semana (6-7 por sessão)
• Deltoides posterior: 14 séries/semana

PRIORIDADE ALTA (2-3x/semana):
• Costas (largura): 16 séries/semana
• Peito superior: 12 séries/semana

MANUTENÇÃO (2x/semana):
• Peito médio: 8 séries/semana
• Braços: 10 séries/semana

VOLUME REDUZIDO (2x/semana, menos volume):
• Quadríceps: 10 séries/semana
• Isquiotibiais: 8 séries/semana
```

**Métricas de sucesso:**
- ✅ Índice de Adônis aproximando de 1.618
- ✅ Proporções individuais melhorando
- ✅ Simetria bilateral (esquerda = direita)
- ✅ Aparência visual harmônica
- ✅ Fotos mostrando melhora no "shape"

### 2.5 TRANSFORM - Transformação Completa

**Descrição completa:** Mudança radical de composição corporal em 12 meses, combinando fases estratégicas de bulk e cut para máxima transformação visual. O objetivo "antes e depois".

**Para quem é indicado:**
- Pessoas querendo mudança DRAMÁTICA
- Quem tem tempo e comprometimento para 12 meses intensos
- Iniciantes ou intermediários com alto potencial de ganho
- % gordura entre 18-28% (H) / 25-35% (M)
- Pessoas dispostas a fazer tracking rigoroso

**Requisitos de comprometimento:**
- ⚡ Treino 4-6x por semana
- ⚡ Tracking de dieta consistente (pelo menos 80% dos dias)
- ⚡ Check-ins regulares (pesagem diária, fotos semanais)
- ⚡ Sono 7-8 horas por noite
- ⚡ Adesão ao plano por 12 meses

**Cenários de Transformação:**

**CENÁRIO A: "Skinny Fat" (pouco músculo + gordura moderada)**
```
Perfil: 75kg, 22% BF, FFMI 18, iniciante
Meta: Ganhar músculo primeiro, depois revelar

Meses 1-3:   BULK (+300 kcal) - construir base
Meses 4:     Mini-cut (2-3 sem) - se BF > 24%
Meses 4-7:   BULK (+300 kcal) - continuar construção
Mês 8:       Mini-cut (2-3 sem) - se necessário
Meses 8-10:  BULK (+250 kcal) - fase final de ganho
Meses 11-12: CUT (-400 kcal) - revelar ganhos

Resultado esperado:
Início:  75kg, 22% BF → 16.5kg gordura, 58.5kg massa magra
Final:   78kg, 12% BF → 9.4kg gordura, 68.6kg massa magra
Ganho:   +10kg massa magra, -7kg gordura
```

**CENÁRIO B: "Gordo" (excesso de gordura)**
```
Perfil: 95kg, 30% BF, FFMI 19, intermediário
Meta: Perder gordura primeiro, depois construir

Meses 1-5:   CUT (-500 kcal) - eliminar gordura
Mês 6:       Diet break (2 sem) - recuperar
Meses 6-10:  BULK (+300 kcal) - construir com base magra
Meses 11-12: CUT FINAL (-400 kcal) - polimento

Resultado esperado:
Início:  95kg, 30% BF → 28.5kg gordura, 66.5kg massa magra
Final:   82kg, 14% BF → 11.5kg gordura, 70.5kg massa magra
Ganho:   +4kg massa magra, -17kg gordura
```

**CENÁRIO C: "Magro" (pouca gordura, pouco músculo)**
```
Perfil: 65kg, 10% BF, FFMI 17, iniciante
Meta: Maximizar ganho de massa

Meses 1-4:   BULK (+400 kcal) - ganho agressivo permitido
Mês 5:       Mini-cut (2 sem) - se BF > 16%
Meses 5-9:   BULK (+350 kcal) - continuar
Mês 10:      Mini-cut (2 sem) - se necessário
Meses 10-12: CUT LEVE (-300 kcal) - revelar

Resultado esperado:
Início:  65kg, 10% BF → 6.5kg gordura, 58.5kg massa magra
Final:   75kg, 12% BF → 9kg gordura, 66kg massa magra
Ganho:   +7.5kg massa magra, +2.5kg gordura (aceitável)
```

**Expectativas gerais (iniciante dedicado, 12 meses):**
- Ganho de massa magra: 5-10 kg
- Perda/ganho de gordura: depende do cenário
- Mudança visual: DRAMÁTICA
- Aumento de força: 50-100%+ nos principais levantamentos

**Métricas de sucesso:**
- ✅ Fotos comparativas (principal!)
- ✅ Composição corporal (DEXA ideal, ou estimativa)
- ✅ FFMI aumentando
- ✅ Força nos principais levantamentos
- ✅ Circunferências mudando na direção certa

### 2.6 MAINTAIN - Manutenção

**Descrição completa:** Manter o físico atual com o mínimo esforço necessário, priorizando sustentabilidade, qualidade de vida e saúde a longo prazo.

**Para quem é indicado:**
- Pessoas satisfeitas com físico atual
- Atletas em "off-season" entre competições
- Pessoas com pouco tempo disponível
- Foco em saúde e longevidade, não mais ganhos
- Transição pós-transformação (consolidar resultados)
- Períodos de muito estresse na vida (trabalho, família)

**Princípio científico:**
- Volume para MANTER é ~1/3 do volume para GANHAR
- Intensidade (carga) é mais importante que volume para manutenção
- Frequência pode ser reduzida sem perda significativa

| Aspecto | Especificação |
|---------|---------------|
| **Dieta** | Manutenção calórica (TDEE) |
| **Proteína** | 1.6-2.0 g/kg (mínimo efetivo) |
| **Tracking** | Opcional - pode ser intuitivo |
| **Flexibilidade** | 80/20 (80% nutritivo, 20% livre) |

| Aspecto Treino | Especificação |
|----------------|---------------|
| **Volume** | Mínimo efetivo: 6-10 séries/grupo/semana |
| **Frequência** | 2-3 sessões totais por semana |
| **Intensidade** | MANTER CARGAS (essencial!) |
| **Split** | Full body ou Upper/Lower simples |
| **Duração sessão** | 45-60 minutos |

**Exemplo de Rotina Mínima Efetiva (3x/semana):**

```
SESSÃO A (Segunda):
• Agachamento: 3×6-8
• Supino: 3×6-8
• Remada curvada: 3×8-10
• Rosca direta: 2×10-12

SESSÃO B (Quarta):
• Terra: 3×5
• Press militar: 3×8-10
• Puxada: 3×8-10
• Tríceps corda: 2×10-12

SESSÃO C (Sexta):
• Leg press: 3×10-12
• Supino inclinado: 3×8-10
• Remada unilateral: 3×10-12
• Elevação lateral: 2×12-15

Tempo total: ~45 min por sessão
Volume semanal: ~6-9 séries por grupo
```

**Exemplo de Rotina Ultra-Mínima (2x/semana):**

```
SESSÃO A:
• Agachamento: 3×6-8
• Supino: 3×6-8
• Remada: 3×8-10
• Press ombros: 2×8-10

SESSÃO B:
• Terra: 3×5
• Supino inclinado: 3×8-10
• Puxada: 3×8-10
• Leg curl: 2×10-12

Tempo total: ~40 min por sessão
```

**Estrutura de 12 meses:**
- Meses 1-12: Estável, sem fases distintas
- Ajustes menores conforme necessário
- Reavaliação a cada 3 meses

**Métricas de sucesso:**
- ✅ Peso estável (±2-3 kg de flutuação normal)
- ✅ Força mantida (não precisa subir)
- ✅ % gordura estável
- ✅ Aderência ao programa
- ✅ Qualidade de vida mantida

**Quando reavaliar objetivo:**
- ⚠️ Se perder força consistentemente → aumentar volume
- ⚠️ Se ganhar gordura → ajustar calorias
- ⚠️ Se motivação mudar → transição para outro objetivo
- ⚠️ Se tempo disponível aumentar → considerar BULK ou GOLDEN_RATIO

---

## 3. MATRIZ DE DECISÃO

### 3.1 Qual Objetivo Recomendar?

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SITUAÇÃO DO ATLETA                          OBJETIVO RECOMENDADO      │
├─────────────────────────────────────────────────────────────────────────┤
│  % gordura > 25% (H) / > 35% (M)             CUT (prioridade saúde)    │
│  % gordura > 18% (H) / > 28% (M)             CUT ou TRANSFORM          │
│  % gordura < 12% (H) / < 20% (M) + FFMI baixo  BULK                    │
│  Iniciante + gordura moderada (15-22%)       RECOMP                    │
│  Proporções desbalanceadas (Adônis < 1.4)    GOLDEN_RATIO              │
│  Quer mudança dramática + comprometido       TRANSFORM                 │
│  Satisfeito + pouco tempo                    MAINTAIN                  │
│  Avançado + magro + quer mais massa          BULK                      │
│  Avançado + quer revelar definição           CUT                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Fluxo de Decisão Simplificado

```
                    ┌─────────────────┐
                    │ % Gordura atual │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         > 25% (H)      15-25% (H)      < 15% (H)
         > 35% (M)      25-35% (M)      < 25% (M)
              │              │              │
              ▼              │              ▼
        ┌─────────┐          │        ┌─────────┐
        │   CUT   │          │        │  BULK   │
        └─────────┘          │        │   ou    │
                             │        │ MAINTAIN│
                             ▼        └─────────┘
                    ┌─────────────────┐
                    │   Experiência   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
          Iniciante    Intermediário     Avançado
              │              │              │
              ▼              ▼              ▼
        ┌─────────┐    ┌───────────┐  ┌───────────┐
        │ RECOMP  │    │ TRANSFORM │  │GOLDEN_RATIO│
        │   ou    │    │    ou     │  │    ou     │
        │TRANSFORM│    │GOLDEN_RATIO│ │   BULK    │
        └─────────┘    └───────────┘  └───────────┘
```

---

## 4. PARÂMETROS POR OBJETIVO

### 4.1 Resumo de Dieta

| Objetivo | Calorias | Proteína | Carboidratos | Gorduras |
|----------|----------|----------|--------------|----------|
| BULK | TDEE + 200-400 | 1.8-2.2 g/kg | Alto | Moderado |
| CUT | TDEE - 300-500 | 2.2-2.8 g/kg | Moderado | Moderado |
| RECOMP | TDEE ± 100 | 2.0-2.4 g/kg | Moderado | Moderado |
| GOLDEN_RATIO | Varia | 2.0-2.4 g/kg | Varia | Varia |
| TRANSFORM | Varia por fase | 2.0-2.4 g/kg | Varia | Varia |
| MAINTAIN | TDEE | 1.6-2.0 g/kg | Livre | Livre |

### 4.2 Resumo de Treino

| Objetivo | Volume/grupo/sem | Frequência | Intensidade | Foco |
|----------|------------------|------------|-------------|------|
| BULK | 16-22 séries | 2x | Moderada-Alta | Progressão de volume |
| CUT | 12-16 séries | 2x | Alta (manter!) | Preservar força |
| RECOMP | 14-18 séries | 2-3x | Alta | Progressão de carga |
| GOLDEN_RATIO | 10-20 (varia) | 2-3x | Moderada-Alta | Pontos fracos |
| TRANSFORM | Varia por fase | 2x | Varia | Periodização |
| MAINTAIN | 6-10 séries | 2x | Alta (manter!) | Mínimo efetivo |

---

## 5. MÉTRICAS DE ACOMPANHAMENTO

### 5.1 Por Objetivo

| Objetivo | Métrica Principal | Métricas Secundárias |
|----------|-------------------|----------------------|
| BULK | Peso subindo | FFMI, circunferências, força |
| CUT | % gordura descendo | Cintura, força mantida, fotos |
| RECOMP | Visual mudando | Força subindo, cintura descendo, peso estável |
| GOLDEN_RATIO | Proporções aproximando do ideal | Índice Adônis, simetria |
| TRANSFORM | Fotos antes/depois | Composição corporal, FFMI |
| MAINTAIN | Estabilidade | Peso, força, % gordura estáveis |

### 5.2 Frequência de Avaliação

| Check | Frequência | O que avaliar |
|-------|------------|---------------|
| Peso | Diário (média semanal) | Tendência, não valor único |
| Circunferências | Quinzenal | Cintura, braço, coxa, peito |
| Fotos | Mensal | Frente, lado, costas |
| Força | Cada treino | Progressão de cargas |
| % Gordura | Mensal | Dobras ou bioimpedância |
| Proporções | Mensal | Cálculo Golden Ratio |

---

## 6. TRANSIÇÕES ENTRE OBJETIVOS

### 6.1 Quando Mudar de Objetivo

| De | Para | Gatilho |
|----|------|---------|
| BULK | CUT | % gordura > 18% (H) / > 28% (M) |
| BULK | MAINTAIN | Satisfeito com tamanho |
| CUT | BULK | % gordura < 12% (H) / < 20% (M) |
| CUT | MAINTAIN | Atingiu meta de definição |
| RECOMP | BULK | Já magro, quer mais massa |
| RECOMP | CUT | Ainda com gordura, quer definir mais |
| TRANSFORM | MAINTAIN | Completou 12 meses |
| GOLDEN_RATIO | MAINTAIN | Proporções no alvo |

### 6.2 Período de Transição

Entre qualquer mudança de objetivo:
- **2-4 semanas em manutenção calórica**
- Permite estabilização hormonal e metabólica
- Evita rebote (especialmente pós-cut)

---

## 7. OBJETIVOS POR PÚBLICO ESPECÍFICO

### 7.1 Mulheres

**Diferenças fisiológicas relevantes:**
- % gordura essencial maior (10-13% vs 2-5% homens)
- Flutuações hormonais mensais afetam peso e performance
- Menor capacidade absoluta de ganho muscular (mas proporcional similar)
- Distribuição de gordura diferente (quadril/coxas vs abdominal)

| Objetivo | Ajustes para Mulheres |
|----------|----------------------|
| BULK | Superávit menor (+150 a +300 kcal), expectativa 0.15-0.3 kg/sem |
| CUT | Meta de % gordura diferente (18-22% atlético, não <15%) |
| RECOMP | Funciona muito bem, especialmente iniciantes |
| GOLDEN_RATIO | Proporções diferentes (cintura/quadril, não ombros/cintura) |
| MAINTAIN | Considerar variações do ciclo menstrual no peso |

**Proporções Golden Ratio Femininas:**

| Medida | Fórmula |
|--------|---------|
| Quadril | Cintura × 1.4-1.5 |
| Busto | ≈ Quadril |
| Coxa | Cintura × 0.6-0.7 |
| Cintura | Referência base |

### 7.2 Atletas 40+ Anos

**Considerações especiais:**
- Recuperação mais lenta (48-72h entre sessões do mesmo grupo)
- Declínio hormonal natural (testosterona, GH)
- Maior risco de lesões articulares
- Sarcopenia começa (perda muscular natural)

| Objetivo | Ajustes para 40+ |
|----------|------------------|
| BULK | Superávit conservador (+200 kcal), volume moderado |
| CUT | Déficit menor (-300 kcal), mais tempo, proteína 2.4+ g/kg |
| RECOMP | EXCELENTE opção para esta faixa etária |
| MAINTAIN | Prioridade em manter massa muscular e densidade óssea |

**Recomendações gerais 40+:**
- Aquecimento mais longo (10-15 min)
- Deloads mais frequentes (a cada 3-4 semanas)
- Priorizar exercícios com menor impacto articular
- Sono e recuperação ainda mais importantes

### 7.3 Iniciantes Absolutos

**Definição:** Menos de 3 meses de treino consistente

**Recomendação padrão:** RECOMP (independente de % gordura moderado)

**Razão:**
- Ganhos neurais rápidos nas primeiras semanas
- Alta responsividade ao estímulo
- Pode ganhar músculo mesmo em déficit leve
- Foco em aprender técnica, não maximizar um objetivo

**Após 3-6 meses:** Reavaliar e potencialmente migrar para objetivo específico

---

## 8. COMBINAÇÃO E PRIORIZAÇÃO DE OBJETIVOS

### 8.1 Objetivo Primário + Secundário

O atleta pode ter um objetivo principal com um secundário:

| Primário | Secundário Comum | Exemplo |
|----------|------------------|---------|
| BULK | GOLDEN_RATIO | Ganhar massa priorizando ombros |
| CUT | GOLDEN_RATIO | Definir mantendo proporções |
| GOLDEN_RATIO | BULK | Corrigir proporções ganhando massa |
| GOLDEN_RATIO | CUT | Corrigir proporções definindo |
| TRANSFORM | GOLDEN_RATIO | Transformação com foco em proporções |

### 8.2 Como Funciona na Prática

**Exemplo: BULK + GOLDEN_RATIO**
- Dieta: superávit de BULK
- Treino: priorização de volume do GOLDEN_RATIO
- Resultado: ganha massa focando em pontos fracos

**Exemplo: CUT + GOLDEN_RATIO**
- Dieta: déficit de CUT
- Treino: manutenção geral, volume alto apenas em pontos fracos
- Resultado: define revelando proporções melhores

---

## 9. METAS INTERMEDIÁRIAS (CHECKPOINTS)

### 9.1 Estrutura Trimestral

Cada objetivo deve ter metas a cada 3 meses para manter motivação:

**BULK - Checkpoints:**

| Mês | Meta | Indicador de Sucesso |
|-----|------|----------------------|
| 3 | +2-3 kg peso | Força +10-15% nos compostos |
| 6 | +4-5 kg peso | FFMI +0.5-1.0 |
| 9 | +6-7 kg peso | Circunferências visivelmente maiores |
| 12 | +7-10 kg peso | Fotos mostram diferença clara |

**CUT - Checkpoints:**

| Mês | Meta | Indicador de Sucesso |
|-----|------|----------------------|
| 3 | -4-6 kg peso | Cintura -3-5 cm |
| 6 | -8-10 kg peso | Abdominais começando a aparecer |
| 9 | -10-12 kg peso | Definição visível |
| 12 | Meta atingida | Força mantida ±5% |

**RECOMP - Checkpoints:**

| Mês | Meta | Indicador de Sucesso |
|-----|------|----------------------|
| 3 | Peso estável, visual melhor | Força +15-20% |
| 6 | Roupas servindo diferente | Cintura -2 cm, braço +1 cm |
| 9 | Transformação visível | Fotos mostram mudança |
| 12 | Decidir próxima fase | Avaliação completa |

### 9.2 Reavaliação Trimestral

A cada 3 meses, o sistema deve:
1. Comparar métricas atuais vs metas
2. Mostrar progresso visual (gráficos)
3. Sugerir ajustes se necessário
4. Perguntar se deseja continuar ou mudar objetivo

---

## 10. AJUSTES POR ESTILO DE VIDA

### 10.1 Períodos de Viagem

| Duração | Recomendação |
|---------|--------------|
| 1 semana | Manutenção calórica, treino mínimo ou pausar |
| 2-3 semanas | MAINTAIN temporário, full body 2x/sem se possível |
| 1+ mês | Reavaliar objetivo, possivelmente MAINTAIN |

### 10.2 Períodos de Alto Estresse

**Sinais de estresse elevado:**
- Sono < 6 horas
- Trabalho > 60 horas/semana
- Problemas pessoais significativos

**Ajustes recomendados:**
- Reduzir volume de treino em 30-40%
- Se em CUT: aumentar calorias para manutenção
- Se em BULK: reduzir superávit
- Considerar transição temporária para MAINTAIN

### 10.3 Lesões e Limitações

| Situação | Ajuste |
|----------|--------|
| Lesão leve (1-2 semanas) | Treinar em volta, manter calorias |
| Lesão moderada (3-4 semanas) | MAINTAIN, adaptar exercícios |
| Lesão grave (1+ mês) | MAINTAIN, foco em reabilitação |
| Limitação permanente | Adaptar exercícios, metas realistas |

---

## 11. MENSAGENS DO COACH IA POR OBJETIVO

### 11.1 Mensagens de Início

| Objetivo | Mensagem de Boas-Vindas |
|----------|-------------------------|
| BULK | "Hora de construir! Vamos focar em ganho de massa com qualidade. Lembre-se: paciência é chave - ganhos sólidos levam tempo." |
| CUT | "Vamos revelar o trabalho duro! Proteína alta, treino pesado, déficit moderado. Você vai se surpreender com o que está escondido." |
| RECOMP | "A transformação silenciosa começa agora. A balança pode não mudar muito, mas o espelho vai contar outra história." |
| GOLDEN_RATIO | "Vamos esculpir proporções de estátua grega! Foco cirúrgico nos pontos que vão fazer a maior diferença no seu shape." |
| TRANSFORM | "12 meses para uma nova versão de você. Comprometimento total. Resultados extraordinários." |
| MAINTAIN | "Missão: manter os ganhos com eficiência. Treino inteligente, vida equilibrada." |

### 11.2 Mensagens de Checkpoint (3 meses)

| Situação | Mensagem |
|----------|----------|
| Meta atingida | "Excelente progresso! Você está no caminho certo. Vamos manter o ritmo." |
| Abaixo da meta | "Progresso mais lento que o esperado. Vamos revisar: aderência à dieta, sono, treino. Pequenos ajustes fazem grande diferença." |
| Acima da meta | "Você está superando expectativas! Cuidado para não acelerar demais - consistência vence velocidade." |

### 11.3 Mensagens de Alerta

| Situação | Mensagem |
|----------|----------|
| Platô de peso (BULK) | "Peso estável há 3 semanas. Hora de aumentar calorias em 100-150 kcal." |
| Platô de peso (CUT) | "Platô detectado. Opções: aumentar cardio, reduzir 100 kcal, ou fazer refeed." |
| Força caindo (CUT) | "Força caindo mais que 10%. Considere um diet break de 1-2 semanas." |
| % gordura alto (BULK) | "Você ultrapassou 18% de gordura. Recomendo um mini-cut de 3-4 semanas." |

---

## 12. EXEMPLOS DE CASOS DE USO

### 12.1 Caso: João, 28 anos, "Skinny Fat"

**Perfil inicial:**
- 75 kg, 1.78m
- 22% gordura corporal
- FFMI: 18.2
- Treina há 6 meses sem consistência

**Objetivo recomendado:** RECOMP

**Plano 12 meses:**
- Meses 1-6: Recomposição (manutenção calórica, treino progressivo)
- Mês 7: Reavaliação
- Meses 7-12: Transição para BULK leve (já estará mais magro)

**Resultado esperado:**
- Peso: 75 kg → 76 kg (+1 kg)
- Gordura: 22% → 15% (-7%)
- FFMI: 18.2 → 20.5 (+2.3)

### 12.2 Caso: Maria, 35 anos, Pós-Gravidez

**Perfil inicial:**
- 70 kg, 1.65m
- 32% gordura corporal
- Nunca treinou sério

**Objetivo recomendado:** CUT (com transição para RECOMP)

**Plano 12 meses:**
- Meses 1-4: CUT moderado (-400 kcal)
- Mês 5: Diet break
- Meses 5-8: CUT leve (-300 kcal)
- Meses 9-12: RECOMP ou MAINTAIN

**Resultado esperado:**
- Peso: 70 kg → 58 kg (-12 kg)
- Gordura: 32% → 22% (-10%)

### 12.3 Caso: Pedro, 45 anos, Executivo

**Perfil inicial:**
- 85 kg, 1.80m
- 26% gordura corporal
- Treinou na juventude, parou há 10 anos
- Disponibilidade: 3x/semana, 1 hora

**Objetivo recomendado:** RECOMP (muscle memory)

**Plano 12 meses:**
- Full body 3x/semana
- Foco em compostos
- Manutenção calórica, proteína alta
- Deloads frequentes

**Resultado esperado:**
- Peso: 85 kg → 83 kg (-2 kg)
- Gordura: 26% → 18% (-8%)
- Recuperação de boa parte da massa muscular anterior

---

## 13. SUPLEMENTAÇÃO POR OBJETIVO

### 13.1 Suplementos Essenciais vs Opcionais

| Categoria | Suplementos | Evidência |
|-----------|-------------|-----------|
| **ESSENCIAL** | Creatina (5g/dia) | Forte evidência para força e massa |
| **MUITO ÚTIL** | Whey Protein | Conveniência para atingir meta proteica |
| **ÚTIL** | Cafeína (pré-treino) | Melhora performance aguda |
| **SITUACIONAL** | Vitamina D, Ômega-3 | Se deficiente na dieta |
| **DESNECESSÁRIO** | BCAAs (se proteína adequada), Glutamina | Redundante com dieta correta |

### 13.2 Recomendação por Objetivo

| Objetivo | Suplementos Prioritários | Notas |
|----------|--------------------------|-------|
| **BULK** | Creatina, Whey, Maltodextrina | Maltodextrina para atingir calorias se necessário |
| **CUT** | Creatina, Whey (isolado), Cafeína | Cafeína ajuda com energia em déficit |
| **RECOMP** | Creatina, Whey | Básico, foco na dieta |
| **GOLDEN_RATIO** | Creatina, Whey | Mesmo que objetivo de dieta subjacente |
| **TRANSFORM** | Creatina, Whey, Cafeína | Todos úteis na jornada |
| **MAINTAIN** | Creatina (opcional), Whey | Mínimo necessário |

### 13.3 Notas sobre Creatina

- **Dose:** 5g/dia, todos os dias (não precisa de fase de loading)
- **Timing:** Qualquer horário, consistência importa mais
- **Retenção de água:** 1-3 kg inicial é NORMAL (água intramuscular)
- **Em CUT:** Manter! Ajuda a preservar força e massa

---

## 14. CARDIO POR OBJETIVO

### 14.1 Tipos de Cardio

| Tipo | Descrição | Calorias/hora* | Impacto na Recuperação |
|------|-----------|----------------|------------------------|
| **LISS** | Low Intensity Steady State (caminhada, bike leve) | 200-400 kcal | Baixo |
| **MISS** | Moderate Intensity (corrida leve, elíptico) | 400-600 kcal | Moderado |
| **HIIT** | High Intensity Interval Training | 300-500 kcal | Alto |

*Varia muito por peso corporal e intensidade real

### 14.2 Recomendação por Objetivo

| Objetivo | Cardio Recomendado | Frequência | Notas |
|----------|-------------------|------------|-------|
| **BULK** | LISS (opcional) | 0-2x/sem | Apenas para saúde cardiovascular |
| **CUT** | LISS + HIIT opcional | 2-4x/sem LISS, 0-2x HIIT | Adicionar gradualmente se platô |
| **RECOMP** | LISS | 2-3x/sem | Moderado, não exagerar |
| **GOLDEN_RATIO** | Conforme objetivo de dieta | - | Segue BULK ou CUT |
| **TRANSFORM** | Varia por fase | - | Mais em cut, menos em bulk |
| **MAINTAIN** | LISS | 2-3x/sem | Para saúde, não para déficit |

### 14.3 Cardio e Hipertrofia

**Interferência do cardio no ganho muscular:**
- LISS: interferência mínima
- HIIT: pode interferir se excessivo (>3x/sem) ou perto do treino de pernas
- Separar cardio e treino de pernas por pelo menos 24h se possível

**Regra prática:**
- Em BULK: cardio é ferramenta de SAÚDE, não de gasto calórico
- Em CUT: cardio é ferramenta SECUNDÁRIA (dieta é primária)

---

## 15. SONO E RECUPERAÇÃO POR OBJETIVO

### 15.1 Importância do Sono

| Aspecto | Impacto de Sono Ruim (<6h) |
|---------|---------------------------|
| Síntese proteica | Reduzida em até 20% |
| Testosterona | Reduzida em até 15% |
| Cortisol | Aumentado (catabolismo) |
| Fome/Grelina | Aumentada (dificulta cut) |
| Performance | Reduzida significativamente |
| Recuperação | Comprometida |

### 15.2 Recomendação por Objetivo

| Objetivo | Sono Mínimo | Sono Ideal | Notas |
|----------|-------------|------------|-------|
| **BULK** | 7h | 8-9h | Crescimento acontece no sono |
| **CUT** | 7h | 8h | Sono ruim aumenta fome e piora humor |
| **RECOMP** | 7h | 8h | Essencial para fazer as duas coisas |
| **GOLDEN_RATIO** | 7h | 8h | Segue padrão geral |
| **TRANSFORM** | 7h | 8-9h | Sono é parte da transformação |
| **MAINTAIN** | 6-7h | 7-8h | Pode ser um pouco mais flexível |

### 15.3 Estratégias de Recuperação

| Estratégia | Eficácia | Custo | Recomendação |
|------------|----------|-------|--------------|
| Sono adequado | ⭐⭐⭐⭐⭐ | Grátis | ESSENCIAL |
| Nutrição adequada | ⭐⭐⭐⭐⭐ | Baixo | ESSENCIAL |
| Deload programado | ⭐⭐⭐⭐ | Grátis | A cada 4-6 semanas |
| Gerenciar estresse | ⭐⭐⭐⭐ | Grátis | Muito importante |
| Caminhada (LISS) | ⭐⭐⭐ | Grátis | Recuperação ativa |
| Massagem | ⭐⭐⭐ | Alto | Opcional, agradável |
| Crioterapia/Gelo | ⭐⭐ | Médio | Evidência mista |
| Alongamento | ⭐⭐ | Grátis | Bom para mobilidade |

---

## 16. EXPECTATIVAS PSICOLÓGICAS

### 16.1 Fases Emocionais por Objetivo

**BULK:**
1. **Semanas 1-4:** Empolgação inicial, força subindo
2. **Semanas 5-12:** Preocupação com gordura, normal
3. **Meses 3-6:** Aceitação do processo, foco no longo prazo
4. **Meses 6-12:** Satisfação com ganhos, ansiedade para definir

**CUT:**
1. **Semanas 1-3:** Motivação alta, resultados rápidos (água)
2. **Semanas 4-8:** Platô aparente, frustração
3. **Semanas 9-16:** Resultados reais, motivação retorna
4. **Final:** Orgulho do resultado, medo de perder

**RECOMP:**
1. **Mês 1-2:** Frustração (balança não muda)
2. **Mês 3-4:** Percebe mudanças visuais, motivação aumenta
3. **Mês 5-6:** Transformação evidente, satisfação

### 16.2 Como Lidar com Platôs

| Tipo de Platô | Duração Normal | Ação |
|---------------|----------------|------|
| Peso (BULK) | 2-3 semanas | Aumentar calorias em 100-150 |
| Peso (CUT) | 2-3 semanas | Ajustar calorias ou adicionar cardio |
| Força | 2-4 semanas | Avaliar recuperação, deload, variar exercícios |
| Visual | 3-4 semanas | Paciência - mudanças são graduais |

### 16.3 Mentalidade Correta

| Objetivo | Mentalidade Necessária |
|----------|------------------------|
| **BULK** | "Aceitar ganho temporário de gordura para ganho permanente de músculo" |
| **CUT** | "Déficit é desconfortável, mas temporário. Consistência vence perfeição." |
| **RECOMP** | "A balança não conta a história toda. Confie no processo." |
| **TRANSFORM** | "12 meses é um investimento. Cada dia conta." |
| **MAINTAIN** | "Menos é mais. Consistência sustentável." |

---

## 17. ERROS COMUNS POR OBJETIVO

### 17.1 BULK - Erros

| Erro | Consequência | Correção |
|------|--------------|----------|
| Superávit muito alto (+1000 kcal) | Ganho excessivo de gordura | Limitar a +300-400 kcal |
| Negligenciar proteína | Ganho subótimo de músculo | Manter 1.8-2.2 g/kg |
| Não fazer mini-cuts | Ficar gordo demais | Mini-cut quando BF > 18% |
| Treinar muito leve | Estímulo insuficiente | Progressão de carga sempre |
| Esperar "bulk sujo" funcionar | Gordura extra não vira músculo | Lean bulk é mais eficiente |

### 17.2 CUT - Erros

| Erro | Consequência | Correção |
|------|--------------|----------|
| Déficit muito agressivo | Perda de músculo, fome extrema | Limitar a -500 kcal |
| Reduzir proteína | Perda de massa magra | AUMENTAR para 2.2-2.8 g/kg |
| Parar de treinar pesado | Perda de músculo | Manter intensidade, reduzir volume |
| Muito cardio, pouco peso | Skinny fat no final | Priorizar treino de força |
| Sem diet breaks | Platô hormonal, fadiga | Diet break a cada 8-12 semanas |
| Comparar com outros | Frustração | Comparar com você mesmo |

### 17.3 RECOMP - Erros

| Erro | Consequência | Correção |
|------|--------------|----------|
| Focar na balança | Frustração desnecessária | Usar fotos, medidas, força |
| Déficit muito grande | Vira apenas cut | Manutenção ou déficit mínimo |
| Superávit | Ganha mais gordura que músculo | Manter manutenção |
| Não progredir no treino | Sem estímulo para crescer | Progressão de carga essencial |
| Desistir cedo demais | Não ver resultados | Dar pelo menos 3-6 meses |

### 17.4 GOLDEN_RATIO - Erros

| Erro | Consequência | Correção |
|------|--------------|----------|
| Treinar tudo igual | Proporções não mudam | Priorizar pontos fracos |
| Ignorar a cintura | Proporções não melhoram | Cintura menor = tudo melhor |
| Só foco em ombros | Desequilíbrio | Visão holística das proporções |
| Não medir regularmente | Sem feedback | Medir mensalmente |

---

## 18. SPLIT DE TREINO POR OBJETIVO

### 18.1 Splits Recomendados

| Objetivo | Dias/Semana | Split Recomendado | Alternativa |
|----------|-------------|-------------------|-------------|
| **BULK** | 5-6 | Push/Pull/Legs (2x) | Upper/Lower + dia extra |
| **CUT** | 4-5 | Upper/Lower (2x) | Push/Pull/Legs |
| **RECOMP** | 4-5 | Upper/Lower (2x) | Full Body 4x |
| **GOLDEN_RATIO** | 5-6 | Customizado por prioridades | - |
| **TRANSFORM** | 4-6 | Varia por fase | - |
| **MAINTAIN** | 2-3 | Full Body | Upper/Lower |

### 18.2 Exemplo: Split GOLDEN_RATIO Customizado

**Cenário:** Ombros e costas fracos, pernas e peito bons

```
SEGUNDA - Push (ênfase ombros)
• Desenvolvimento: 4×8-10
• Elevação lateral: 4×12-15
• Elevação frontal: 3×12-15
• Supino inclinado: 3×8-10
• Tríceps: 3×10-12

TERÇA - Pull (ênfase costas largura)
• Puxada aberta: 4×8-10
• Remada cavalinho: 4×10-12
• Pullover: 3×12-15
• Face pull: 3×15-20
• Bíceps: 3×10-12

QUARTA - Legs (manutenção)
• Agachamento: 3×8-10
• Leg press: 3×10-12
• Mesa flexora: 3×10-12
• Panturrilha: 3×12-15

QUINTA - Push (ênfase ombros)
• Desenvolvimento máquina: 4×10-12
• Elevação lateral cabo: 4×15-20
• Supino reto: 3×8-10
• Supino máquina: 3×10-12
• Tríceps: 3×10-12

SEXTA - Pull (ênfase costas)
• Barra fixa: 4×máx
• Remada unilateral: 4×10-12
• Puxada triângulo: 3×12-15
• Crucifixo inverso: 3×15-20
• Bíceps: 3×10-12

SÁBADO - Ombros extra + Core
• Elevação lateral: 5×12-15
• Face pull: 3×15-20
• Encolhimento: 3×12-15
• Abdominais: 3 exercícios
```

---

## 19. ALGORITMO DE RECOMENDAÇÃO

### 19.1 Fluxograma de Decisão

```
INÍCIO
  │
  ▼
┌─────────────────────────────┐
│ % Gordura Corporal?         │
└─────────────────────────────┘
  │
  ├── > 30% (H) / > 40% (M) ──────────────► CUT (obrigatório)
  │
  ├── 25-30% (H) / 35-40% (M) ────────────► CUT (recomendado)
  │                                          │
  │                                          └── Aceita TRANSFORM
  │
  ├── 18-25% (H) / 28-35% (M) ──────┐
  │                                  │
  │                                  ▼
  │                         ┌───────────────────┐
  │                         │ Experiência?       │
  │                         └───────────────────┘
  │                                  │
  │                    ┌─────────────┼─────────────┐
  │                    │             │             │
  │               Iniciante    Intermediário   Avançado
  │                    │             │             │
  │                    ▼             ▼             ▼
  │               RECOMP     TRANSFORM ou    CUT ou
  │                          GOLDEN_RATIO   GOLDEN_RATIO
  │
  ├── 12-18% (H) / 20-28% (M) ──────┐
  │                                  │
  │                                  ▼
  │                         ┌───────────────────┐
  │                         │ FFMI?              │
  │                         └───────────────────┘
  │                                  │
  │                    ┌─────────────┴─────────────┐
  │                    │                           │
  │               FFMI < 20 (H)              FFMI > 20 (H)
  │               FFMI < 17 (M)              FFMI > 17 (M)
  │                    │                           │
  │                    ▼                           ▼
  │               BULK ou                    GOLDEN_RATIO
  │               RECOMP                     ou CUT leve
  │
  └── < 12% (H) / < 20% (M) ──────────────► BULK (recomendado)
                                             │
                                             └── Aceita MAINTAIN
```

### 19.2 Código de Recomendação

```typescript
interface DadosAtleta {
  gorduraCorporal: number      // %
  ffmi: number
  sexo: 'M' | 'F'
  experiencia: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO'
  indiceAdonis?: number        // ombros/cintura
  tempoDisponivel: number      // dias por semana
  objetivo_declarado?: ObjetivoCode
}

function recomendarObjetivo(dados: DadosAtleta): {
  recomendado: ObjetivoCode
  alternativas: ObjetivoCode[]
  justificativa: string[]
  alertas: string[]
} {
  const resultado = {
    recomendado: '' as ObjetivoCode,
    alternativas: [] as ObjetivoCode[],
    justificativa: [] as string[],
    alertas: [] as string[]
  }
  
  // Limites por sexo
  const limites = dados.sexo === 'M' 
    ? { bfMuitoAlto: 30, bfAlto: 25, bfMedio: 18, bfBaixo: 12, ffmiMedio: 20 }
    : { bfMuitoAlto: 40, bfAlto: 35, bfMedio: 28, bfBaixo: 20, ffmiMedio: 17 }

  // REGRA 1: Muito gordo → CUT obrigatório
  if (dados.gorduraCorporal >= limites.bfMuitoAlto) {
    resultado.recomendado = 'CUT'
    resultado.justificativa.push(`% gordura (${dados.gorduraCorporal}%) muito elevado`)
    resultado.justificativa.push('Priorizar saúde e perda de gordura')
    resultado.alertas.push('BULK não é recomendado neste momento')
    return resultado
  }

  // REGRA 2: Gordo → CUT recomendado
  if (dados.gorduraCorporal >= limites.bfAlto) {
    resultado.recomendado = 'CUT'
    resultado.alternativas = ['TRANSFORM']
    resultado.justificativa.push(`% gordura (${dados.gorduraCorporal}%) acima do ideal para bulk`)
    resultado.justificativa.push('Cut primeiro para depois construir')
    return resultado
  }

  // REGRA 3: Muito magro → BULK recomendado
  if (dados.gorduraCorporal <= limites.bfBaixo) {
    resultado.recomendado = 'BULK'
    resultado.alternativas = ['MAINTAIN', 'GOLDEN_RATIO']
    resultado.justificativa.push(`% gordura (${dados.gorduraCorporal}%) permite bulk limpo`)
    resultado.justificativa.push('Momento ideal para ganhar massa')
    return resultado
  }

  // REGRA 4: Range médio - depende de outros fatores
  if (dados.gorduraCorporal > limites.bfBaixo && dados.gorduraCorporal < limites.bfAlto) {
    
    // Iniciante → RECOMP
    if (dados.experiencia === 'INICIANTE') {
      resultado.recomendado = 'RECOMP'
      resultado.alternativas = ['TRANSFORM']
      resultado.justificativa.push('Iniciante com potencial para recomposição')
      resultado.justificativa.push('Pode ganhar músculo e perder gordura simultaneamente')
      return resultado
    }
    
    // FFMI baixo → BULK ou RECOMP
    if (dados.ffmi < limites.ffmiMedio) {
      resultado.recomendado = dados.gorduraCorporal < limites.bfMedio ? 'BULK' : 'RECOMP'
      resultado.alternativas = ['GOLDEN_RATIO', 'TRANSFORM']
      resultado.justificativa.push(`FFMI (${dados.ffmi}) indica espaço para ganho muscular`)
      return resultado
    }
    
    // FFMI bom + proporções ruins → GOLDEN_RATIO
    if (dados.indiceAdonis && (dados.indiceAdonis < 1.4 || dados.indiceAdonis > 1.8)) {
      resultado.recomendado = 'GOLDEN_RATIO'
      resultado.alternativas = ['CUT', 'BULK']
      resultado.justificativa.push(`Índice de Adônis (${dados.indiceAdonis.toFixed(2)}) fora do ideal`)
      resultado.justificativa.push('Foco em corrigir proporções')
      return resultado
    }
    
    // Default para intermediário/avançado
    resultado.recomendado = dados.gorduraCorporal > limites.bfMedio ? 'CUT' : 'BULK'
    resultado.alternativas = ['GOLDEN_RATIO', 'TRANSFORM']
    resultado.justificativa.push('Escolha baseada no % de gordura atual')
  }

  return resultado
}
```

---

## 20. INTEGRAÇÃO COM OUTRAS SPECS

### 20.1 SPECs Científicas Relacionadas

| SPEC | Relação com Objetivos |
|------|----------------------|
| SPEC_CIENCIA_METABOLISMO | Cálculo de TDEE por objetivo |
| SPEC_CIENCIA_PROTEINA | Recomendações de proteína por objetivo |
| SPEC_CIENCIA_DEFICIT_SUPERAVIT | Ajustes calóricos para CUT/BULK |
| SPEC_CIENCIA_VOLUME_TREINO | Volume semanal por objetivo |
| SPEC_CIENCIA_FREQUENCIA_TREINO | Frequência por objetivo |
| SPEC_CIENCIA_PERIODIZACAO | Estrutura de mesociclos |
| SPEC_CIENCIA_COMPOSICAO_CORPORAL | Métricas de % gordura, FFMI |
| SPEC_CIENCIA_PROPORCOES_AUREAS | Base para GOLDEN_RATIO |

### 20.2 Como as SPECs se Conectam

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SPEC_OBJETIVOS_ATLETA                          │
│                      (Define QUAL é o objetivo)                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ SPEC_METABOLISMO │   │ SPEC_VOLUME     │   │ SPEC_PROPORCOES │
│ (Calorias)       │   │ (Séries/semana) │   │ (Golden Ratio)  │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ SPEC_DEFICIT    │   │ SPEC_FREQUENCIA │   │ SPEC_COMP_CORP  │
│ SPEC_PROTEINA   │   │ SPEC_PERIODIZ   │   │ (FFMI, % BF)    │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## 21. FAQ POR OBJETIVO

### 21.1 BULK

**P: Vou ficar gordo fazendo bulk?**
R: Com lean bulk (+200-300 kcal) e monitoramento, o ganho de gordura é mínimo. Se passar de 18% BF, fazemos mini-cut.

**P: Posso fazer bulk sendo iniciante?**
R: Sim, mas RECOMP geralmente é melhor para iniciantes com gordura moderada. Bulk puro é ideal para quem já está magro (<15%).

**P: Quanto tempo devo ficar em bulk?**
R: Tipicamente 4-6 meses contínuos, com mini-cuts de 2-3 semanas se necessário.

### 21.2 CUT

**P: Vou perder músculo no cut?**
R: Com proteína alta (2.2-2.8 g/kg), treino de força mantido e déficit moderado, a perda muscular é mínima.

**P: Por que minha força caiu?**
R: Alguma queda é normal em déficit. Se > 10%, considere diet break ou reduzir déficit.

**P: Quanto tempo leva para ver abdominais?**
R: Depende do % gordura inicial. Homens geralmente veem a partir de 12-14%, mulheres 18-20%.

### 21.3 RECOMP

**P: Por que meu peso não muda?**
R: É ESPERADO em recomp. Você está trocando gordura por músculo. Foque em medidas e fotos.

**P: Recomp funciona para avançados?**
R: Não muito bem. Avançados já perto do potencial devem fazer ciclos de bulk/cut.

**P: Quanto tempo posso ficar em recomp?**
R: Enquanto estiver progredindo em força e visual. Após 6-12 meses, considere objetivo específico.

### 21.4 GOLDEN_RATIO

**P: Posso priorizar um músculo muito?**
R: Sim! É a essência deste objetivo. Pontos fracos podem receber 2-3x mais volume.

**P: E se eu não quiser pernas grandes?**
R: Perfeitamente válido. Mantenha volume mínimo para pernas e priorize tronco.

**P: Como sei se minhas proporções estão boas?**
R: O índice Adônis (ombros/cintura) ideal é 1.618. Acima de 1.5 já é considerado bom.

---

## 22. INTERFACE DO USUÁRIO

### 7.1 Tela de Seleção de Objetivo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  QUAL É SEU OBJETIVO PARA OS PRÓXIMOS 12 MESES?                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🏋️ GANHAR MASSA MUSCULAR                                        │   │
│  │    Quero ficar maior e mais forte                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔥 EMAGRECER / DEFINIR                                          │   │
│  │    Quero perder gordura e ver os músculos                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ⚖️ RECOMPOSIÇÃO CORPORAL                                        │   │
│  │    Quero perder gordura E ganhar músculo ao mesmo tempo         │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📐 FÍSICO PROPORCIONAL                                    ⭐     │   │
│  │    Quero um shape equilibrado com proporções ideais             │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔄 TRANSFORMAÇÃO COMPLETA                                       │   │
│  │    Quero mudar meu corpo completamente em 12 meses              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ✨ MANTER MEU FÍSICO                                            │   │
│  │    Já estou satisfeito, quero manter com o mínimo esforço       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  💡 Baseado nos seus dados, recomendamos: RECOMPOSIÇÃO CORPORAL        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Após Seleção - Confirmação

O sistema deve mostrar:
1. Resumo do objetivo escolhido
2. O que esperar em 12 meses
3. Compromissos necessários (frequência, dieta)
4. Métricas que serão acompanhadas
5. Botão de confirmação

---

## 8. TIPOS TYPESCRIPT

```typescript
type ObjetivoCode = 'BULK' | 'CUT' | 'RECOMP' | 'GOLDEN_RATIO' | 'TRANSFORM' | 'MAINTAIN'

interface Objetivo {
  codigo: ObjetivoCode
  nome: string
  descricao: string
  icone: string
  
  // Parâmetros de dieta
  dieta: {
    caloriasMeta: 'SUPERAVIT' | 'DEFICIT' | 'MANUTENCAO' | 'VARIA'
    ajusteKcal: { min: number, max: number }  // ex: { min: 200, max: 400 }
    proteinaGKg: { min: number, max: number }
  }
  
  // Parâmetros de treino
  treino: {
    volumeSeriesSemana: { min: number, max: number }
    frequenciaPorGrupo: number
    intensidade: 'MODERADA' | 'ALTA' | 'MUITO_ALTA'
    foco: string
  }
  
  // Critérios de elegibilidade
  elegibilidade: {
    bfMinimo?: number
    bfMaximo?: number
    ffmiMinimo?: number
    ffmiMaximo?: number
    experienciaMinima?: string[]
  }
  
  // Fases do plano
  fases: FaseObjetivo[]
  
  // Métricas
  metricaPrincipal: string
  metricasSecundarias: string[]
}

interface FaseObjetivo {
  nome: string
  duracaoMeses: { min: number, max: number }
  descricao: string
  ajustes: {
    calorias?: string
    volume?: string
    intensidade?: string
  }
}

interface RecomendacaoObjetivo {
  objetivoRecomendado: ObjetivoCode
  alternativas: ObjetivoCode[]
  justificativa: string[]
  alertas?: string[]
}
```

---

## 9. REGRAS DE NEGÓCIO

### 9.1 Validações

1. **Objetivo CUT não permitido se:**
   - % gordura < 10% (H) / < 18% (M)
   - Sistema deve sugerir BULK ou MAINTAIN

2. **Objetivo BULK não permitido se:**
   - % gordura > 25% (H) / > 35% (M)
   - Sistema deve sugerir CUT primeiro

3. **Objetivo RECOMP recomendado se:**
   - Iniciante (< 1 ano de treino)
   - % gordura entre 15-22% (H) / 22-30% (M)
   - FFMI abaixo da média

4. **Objetivo GOLDEN_RATIO destacado se:**
   - Índice Adônis < 1.4 ou > 1.8
   - Assimetrias detectadas nas medições

### 9.2 Reavaliação Automática

O sistema deve sugerir mudança de objetivo quando:

| Condição | Sugestão |
|----------|----------|
| Em BULK e % gordura > 18% | "Considere um mini-cut" |
| Em CUT e força caindo muito | "Considere diet break ou reduzir déficit" |
| Em CUT e atingiu meta | "Parabéns! Transicionar para manutenção?" |
| Em RECOMP há 6+ meses sem mudança | "Considere definir bulk ou cut específico" |
| Proporções atingiram ideal | "Meta Golden Ratio atingida! Manutenção?" |

---

## CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |
| 1.1 | Fev/2026 | Detalhamento completo de cada objetivo |
| 1.2 | Fev/2026 | Adicionado: Suplementação, Cardio, Sono/Recuperação, Expectativas Psicológicas, Erros Comuns, Splits de Treino, Algoritmo de Recomendação, Integração com SPECs |
| 1.3 | Mar/2026 | Estado real da implementação |

---

## ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO (Março 2026)

### Implementação Parcial
Os objetivos são utilizados no motor de cálculo (`diagnostico.ts`) para determinar estratégias, mas sem tela dedicada de seleção pelo atleta.

### O Que Está Implementado ✅
- [x] 6 objetivos definidos nos types (`BULK, CUT, RECOMP, GOLDEN_RATIO, TRANSFORM, MAINTAIN`)
- [x] Matriz de decisão implementada no `diagnostico.ts` (40K)
- [x] Estratégia de treino ajustada por objetivo no `treino.ts` (50K)
- [x] Estratégia de dieta ajustada por objetivo no `dieta.ts` (45K)
- [x] Parâmetros de macros/volume por objetivo
- [x] Ajustes por gênero (masculino/feminino) nos cálculos
- [x] Context Builder envia objetivo ao Gemini

### O Que Está Pendente ❌
- [ ] Tela de seleção de objetivo pelo atleta (onboarding)
- [ ] Sugestão automática do Vitrúvio (seção 3.2)
- [ ] Checkpoints trimestrais com reavaliação automática
- [ ] Transição formal entre objetivos
- [ ] Objetivo primário + secundário combinados
- [ ] Ajustes por estilo de vida (viagem, período de provas)
- [ ] Especificidades para atletas 40+

---

**VITRU IA - SPEC Objetivos do Atleta v1.3**
