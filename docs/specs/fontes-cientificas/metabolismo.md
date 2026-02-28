# SPEC CIENTÍFICA: Metabolismo e Gasto Energético

## Base de Conhecimento para o VITRÚVIO IA

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Tipo:** Conhecimento Científico Fundamental  
**Módulo:** Diagnóstico / Plano de Dieta

---

## 1. VISÃO GERAL

### 1.1 O que é esta SPEC?

Esta SPEC contém o conhecimento científico sobre **metabolismo e gasto energético** que o VITRÚVIO deve usar como base para:

- Calcular necessidades calóricas do atleta
- Definir déficit ou superávit adequado
- Ajustar planos de dieta
- Entender variações individuais

### 1.2 Componentes do Gasto Energético Total

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    GASTO ENERGÉTICO TOTAL (TDEE)                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │   TMB/BMR          TEF           NEAT           EAT            │   │
│  │   (60-70%)       (8-15%)       (15-30%)       (0-10%)          │   │
│  │                                                                 │   │
│  │   Taxa           Efeito        Atividades     Exercício        │   │
│  │   Metabólica     Térmico       Não-Exercício  Físico           │   │
│  │   Basal          dos           (andar,        (treino)         │   │
│  │                  Alimentos     trabalhar...)                   │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  TDEE = TMB + TEF + NEAT + EAT                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Fontes Científicas Principais

| Fonte | Ano | Contribuição |
|-------|-----|--------------|
| Harris & Benedict | 1918 | Primeira equação de TMB |
| Mifflin-St Jeor | 1990 | Equação mais precisa para população geral |
| Katch-McArdle | 1996 | Equação baseada em massa magra |
| Cunningham | 1980/1991 | Equação para atletas |
| Oxford/Henry | 2005 | Maior amostra (10.552 indivíduos) |
| Levine JA | 2002-2004 | Pesquisa sobre NEAT |

---

## 2. TAXA METABÓLICA BASAL (TMB/BMR)

### 2.1 Definição

> **TMB (Taxa Metabólica Basal)** é a energia mínima necessária para manter as funções vitais do corpo em repouso absoluto, em ambiente termoneutro, após 12h de jejum.

Representa **60-70% do gasto energético total** em indivíduos sedentários.

### 2.2 O que a TMB inclui

- Funcionamento do cérebro (~20%)
- Funcionamento do coração e pulmões
- Função hepática e renal
- Manutenção da temperatura corporal
- Síntese proteica básica
- Funções celulares essenciais

### 2.3 Fatores que Influenciam a TMB

| Fator | Impacto |
|-------|---------|
| **Massa Magra** | Principal determinante (~80% da variação) |
| **Idade** | ↓ ~2% por década após 20 anos |
| **Sexo** | Homens ~5-10% maior que mulheres |
| **Genética** | Variação de ±200-300 kcal entre indivíduos |
| **Hormônios** | Tireoide, testosterona, cortisol |
| **Temperatura** | Febre aumenta ~7% por °C |
| **Déficit calórico** | ↓ Adaptação metabólica |

---

## 3. EQUAÇÕES DE ESTIMATIVA DA TMB

### 3.1 Comparação de Precisão

Baseado em meta-análises e estudos de validação:

| Equação | Precisão (±10%) | Melhor Para | Limitações |
|---------|-----------------|-------------|------------|
| **Mifflin-St Jeor** | 82% não-obesos, 70% obesos | População geral | Não usa massa magra |
| **Katch-McArdle** | ~80% | Atletas, pessoas magras | Requer BF% preciso |
| **Cunningham** | ~80% atletas | Atletas | Requer BF% preciso |
| **Harris-Benedict** | 69% não-obesos, 64% obesos | Uso histórico | Superestima em ~5% |
| **Oxford/Henry** | Melhor baixo viés | População diversa | Menos conhecida |

**Recomendação científica:** Mifflin-St Jeor para população geral, Katch-McArdle para atletas com BF% conhecido.

### 3.2 Equação de Mifflin-St Jeor (1990)

```
HOMENS:
TMB = (10 × peso[kg]) + (6.25 × altura[cm]) − (5 × idade[anos]) + 5

MULHERES:
TMB = (10 × peso[kg]) + (6.25 × altura[cm]) − (5 × idade[anos]) − 161
```

**Fonte:** Mifflin MD, St Jeor ST, et al. (1990). "A new predictive equation for resting energy expenditure in healthy individuals." American Journal of Clinical Nutrition.

**Validação:** Estudo com 498 indivíduos. Meta-análise de Frankenfield (2005) confirmou como a mais precisa.

### 3.3 Equação de Harris-Benedict (1918/1984)

```
ORIGINAL (1918):

HOMENS:
TMB = 66.5 + (13.75 × peso[kg]) + (5.003 × altura[cm]) − (6.755 × idade[anos])

MULHERES:
TMB = 655.1 + (9.563 × peso[kg]) + (1.850 × altura[cm]) − (4.676 × idade[anos])


REVISADA por Roza & Shizgal (1984):

HOMENS:
TMB = 88.362 + (13.397 × peso[kg]) + (4.799 × altura[cm]) − (5.677 × idade[anos])

MULHERES:
TMB = 447.593 + (9.247 × peso[kg]) + (3.098 × altura[cm]) − (4.330 × idade[anos])
```

**Limitação:** Desenvolvida há mais de 100 anos, tende a superestimar em ~5% devido a mudanças no estilo de vida.

### 3.4 Equação de Katch-McArdle (1996)

```
TMB = 370 + (21.6 × Massa Magra[kg])

Onde:
Massa Magra = Peso × (1 - BF%/100)
```

**Vantagem:** Usa massa magra, mais precisa para atletas e pessoas com composição corporal atípica.

**Limitação:** Requer medição precisa de gordura corporal.

### 3.5 Equação de Cunningham (1980/1991)

```
VERSÃO 1980:
TMB = 500 + (22 × Massa Magra[kg])

VERSÃO 1991 (mais usada):
TMB = 370 + (21.6 × Massa Magra[kg])
```

**Nota:** A versão 1991 é idêntica à Katch-McArdle. Cunningham desenvolveu primeiro, Katch-McArdle popularizou.

### 3.6 Equações Oxford/Henry (2005)

```
HOMENS:
18-30 anos: TMB = (14.4 × peso) + (313 × altura) + 113
30-60 anos: TMB = (11.4 × peso) + (541 × altura) − 137
60+ anos:   TMB = (11.4 × peso) + (541 × altura) − 256

MULHERES:
18-30 anos: TMB = (10.4 × peso) + (615 × altura) − 282
30-60 anos: TMB = (8.18 × peso) + (502 × altura) − 11.6
60+ anos:   TMB = (8.52 × peso) + (421 × altura) + 10.7

(peso em kg, altura em metros)
```

**Fonte:** Henry CJ (2005). Desenvolvida com 10.552 indivíduos - maior amostra disponível.

---

## 4. EFEITO TÉRMICO DOS ALIMENTOS (TEF)

### 4.1 Definição

> **TEF (Thermic Effect of Food)** é o aumento do gasto energético após uma refeição, associado à digestão, absorção e armazenamento dos nutrientes.

Representa **8-15% do TDEE**.

### 4.2 TEF por Macronutriente

| Macronutriente | TEF | Explicação |
|----------------|-----|------------|
| **Proteína** | 20-35% | Maior custo de digestão e síntese |
| **Carboidrato** | 5-15% | Custo moderado |
| **Gordura** | 0-5% | Menor custo (armazenamento eficiente) |
| **Álcool** | 10-30% | Metabolismo prioritário no fígado |

### 4.3 Cálculo Prático do TEF

```
TEF SIMPLIFICADO:

TEF = Calorias ingeridas × 0.10  (dieta mista típica)

TEF DETALHADO:

TEF = (Proteína[kcal] × 0.25) + (Carbs[kcal] × 0.08) + (Gordura[kcal] × 0.02)
```

### 4.4 Fatores que Afetam o TEF

| Fator | Efeito |
|-------|--------|
| Composição da dieta | Mais proteína = maior TEF |
| Tamanho da refeição | Refeições maiores = TEF absoluto maior |
| Frequência alimentar | Pouco impacto no TEF total diário |
| Processamento | Alimentos processados = menor TEF |
| Idade | Leve redução com idade |

---

## 5. NEAT - NON-EXERCISE ACTIVITY THERMOGENESIS

### 5.1 Definição

> **NEAT** é a energia gasta em todas as atividades que NÃO são: dormir, comer ou exercício físico estruturado.

Inclui: andar, ficar em pé, digitar, trabalho manual, falar, gesticular, manter postura, "fidgeting" (mexer-se).

### 5.2 Importância do NEAT

```
VARIAÇÃO DO NEAT ENTRE INDIVÍDUOS:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Pessoa sedentária (escritório):     200-400 kcal/dia                  │
│  Pessoa moderadamente ativa:          400-800 kcal/dia                  │
│  Trabalhador ativo:                   800-1500 kcal/dia                 │
│  Trabalhador braçal/agricultor:      1500-2000+ kcal/dia               │
│                                                                         │
│  DIFERENÇA MÁXIMA: até 2000 kcal/dia entre indivíduos do mesmo peso!  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Fonte:** Levine JA (2002). "Non-exercise activity thermogenesis (NEAT)." Best Practice & Research Clinical Endocrinology & Metabolism.

### 5.3 NEAT e Ocupação Profissional

| Ocupação | PAL* | NEAT Estimado |
|----------|------|---------------|
| Trabalho de escritório (sentado) | 1.4-1.5 | 200-400 kcal |
| Trabalho de pé (vendedor, professor) | 1.6-1.7 | 400-700 kcal |
| Trabalho ativo (garçom, enfermeiro) | 1.8-1.9 | 700-1000 kcal |
| Trabalho pesado (construção, agricultura) | 2.0-2.4 | 1000-2000 kcal |

*PAL = Physical Activity Level = TDEE/TMB

### 5.4 NEAT e Adaptação Metabólica

Pesquisa de Levine (1999) demonstrou:

```
OVERFEEDING (+1000 kcal/dia por 8 semanas):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  • Alguns indivíduos AUMENTARAM NEAT em até 700 kcal/dia               │
│    → Ganharam pouca gordura                                            │
│                                                                         │
│  • Outros NÃO aumentaram NEAT                                          │
│    → Ganharam mais gordura                                             │
│                                                                         │
│  Conclusão: NEAT é um mecanismo de defesa contra ganho de peso         │
│             que funciona melhor em algumas pessoas.                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

UNDERFEEDING (déficit calórico):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  • NEAT diminui em 33-51% da redução do TDEE                           │
│  • Pessoas se movem menos inconscientemente                            │
│  • "Fidgeting" diminui                                                 │
│  • Isso contribui para platôs de perda de peso                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.5 Estratégias para Aumentar NEAT

Para atletas com trabalho sedentário:

| Estratégia | Impacto Estimado |
|------------|------------------|
| Caminhar 10.000 passos/dia | +300-400 kcal |
| Mesa de pé (standing desk) | +50-100 kcal/h |
| Reuniões caminhando | +100-200 kcal |
| Estacionar longe | +50-100 kcal |
| Escadas vs elevador | +20-50 kcal/lance |
| Pausas ativas (a cada 30min) | +100-200 kcal/dia |

---

## 6. EAT - EXERCISE ACTIVITY THERMOGENESIS

### 6.1 Definição

> **EAT** é a energia gasta em exercício físico estruturado e intencional (treino de força, cardio, esportes).

Representa **0-10%** do TDEE na maioria das pessoas (muitos não se exercitam).
Em atletas, pode representar **15-30%** do TDEE.

### 6.2 Gasto Calórico por Atividade (MET)

```
MET (Metabolic Equivalent of Task):
1 MET = ~1 kcal/kg/hora (gasto em repouso)

Cálculo: Calorias = MET × peso(kg) × tempo(horas)
```

| Atividade | MET | Kcal/hora (80kg) |
|-----------|-----|------------------|
| Musculação (moderada) | 3.5-6.0 | 280-480 |
| Musculação (intensa) | 6.0-8.0 | 480-640 |
| Caminhada (5 km/h) | 3.5 | 280 |
| Corrida (8 km/h) | 8.0 | 640 |
| Corrida (10 km/h) | 10.0 | 800 |
| Ciclismo (moderado) | 6.0-8.0 | 480-640 |
| Natação | 6.0-10.0 | 480-800 |
| HIIT | 8.0-12.0 | 640-960 |

### 6.3 Estimativa para Treino de Musculação

```
TREINO DE MUSCULAÇÃO:

Gasto aproximado = 5-8 kcal por minuto (dependendo da intensidade)

Treino de 60 minutos ≈ 300-500 kcal

Fatores que aumentam:
• Mais séries e exercícios
• Menos descanso entre séries
• Exercícios compostos
• Supersets/drop sets
• Maior carga (mais esforço)

Fatores que diminuem:
• Muito descanso entre séries
• Exercícios isolados
• Baixa intensidade
```

---

## 7. GASTO ENERGÉTICO TOTAL (TDEE)

### 7.1 Fórmula do TDEE

```
TDEE = TMB + TEF + NEAT + EAT

Ou simplificado:

TDEE = TMB × Fator de Atividade
```

### 7.2 Fatores de Atividade (Multiplicadores)

| Nível | Descrição | Fator |
|-------|-----------|-------|
| **Sedentário** | Trabalho de escritório, sem exercício | 1.2 |
| **Levemente ativo** | Exercício leve 1-3x/semana | 1.375 |
| **Moderadamente ativo** | Exercício moderado 3-5x/semana | 1.55 |
| **Muito ativo** | Exercício intenso 6-7x/semana | 1.725 |
| **Extremamente ativo** | Atleta, trabalho físico + treino | 1.9 |

### 7.3 Cálculo Detalhado do TDEE

```typescript
interface CalculoTDEE {
  tmb: number
  tef: number
  neat: number
  eat: number
  tdee: number
}

function calcularTDEE(
  peso: number,
  altura: number,
  idade: number,
  sexo: 'M' | 'F',
  gorduraCorporal: number | null,
  ocupacao: 'SEDENTARIA' | 'LEVE' | 'MODERADA' | 'ATIVA' | 'MUITO_ATIVA',
  treinosPorSemana: number,
  duracaoTreinoMinutos: number
): CalculoTDEE {
  
  // 1. Calcular TMB
  let tmb: number
  
  if (gorduraCorporal !== null) {
    // Katch-McArdle (mais preciso para atletas)
    const massaMagra = peso * (1 - gorduraCorporal / 100)
    tmb = 370 + (21.6 * massaMagra)
  } else {
    // Mifflin-St Jeor
    if (sexo === 'M') {
      tmb = (10 * peso) + (6.25 * altura) - (5 * idade) + 5
    } else {
      tmb = (10 * peso) + (6.25 * altura) - (5 * idade) - 161
    }
  }
  
  // 2. Calcular TEF (10% das calorias ingeridas ≈ 10% do TDEE)
  // Estimativa inicial, será refinada
  const tefEstimado = tmb * 0.10
  
  // 3. Calcular NEAT baseado na ocupação
  const neatPorOcupacao = {
    'SEDENTARIA': tmb * 0.15,      // ~200-300 kcal
    'LEVE': tmb * 0.25,            // ~400-500 kcal
    'MODERADA': tmb * 0.40,        // ~600-700 kcal
    'ATIVA': tmb * 0.55,           // ~800-1000 kcal
    'MUITO_ATIVA': tmb * 0.70      // ~1000-1200 kcal
  }
  const neat = neatPorOcupacao[ocupacao]
  
  // 4. Calcular EAT (treino)
  // Média de 6 kcal/min para musculação moderada-intensa
  const kcalPorTreino = duracaoTreinoMinutos * 6
  const eatSemanal = kcalPorTreino * treinosPorSemana
  const eat = eatSemanal / 7  // média diária
  
  // 5. Somar tudo
  const tdee = tmb + tefEstimado + neat + eat
  
  // 6. Recalcular TEF mais precisamente
  const tef = tdee * 0.10
  
  return {
    tmb: Math.round(tmb),
    tef: Math.round(tef),
    neat: Math.round(neat),
    eat: Math.round(eat),
    tdee: Math.round(tdee)
  }
}
```

### 7.4 Exemplo Prático

```
ATLETA: Leonardo
─────────────────────────────────────────────────────
Peso: 82.5 kg
Altura: 182 cm
Idade: 32 anos
Sexo: Masculino
Gordura corporal: 15.8%
Ocupação: Sedentária (programador, home office)
Treinos: 5x/semana, 60 minutos

CÁLCULOS:
─────────────────────────────────────────────────────

1. TMB (Katch-McArdle):
   Massa Magra = 82.5 × (1 - 0.158) = 69.5 kg
   TMB = 370 + (21.6 × 69.5) = 1.871 kcal/dia

2. TEF (~10%):
   TEF ≈ 258 kcal/dia

3. NEAT (ocupação sedentária):
   NEAT = 1.871 × 0.15 = 281 kcal/dia

4. EAT (treino):
   Por treino = 60 min × 6 kcal/min = 360 kcal
   Semanal = 360 × 5 = 1.800 kcal
   Diário = 1.800 ÷ 7 = 257 kcal/dia

5. TDEE:
   TDEE = 1.871 + 258 + 281 + 257 = 2.667 kcal/dia

─────────────────────────────────────────────────────
RESULTADO: TDEE ≈ 2.586-2.667 kcal/dia
─────────────────────────────────────────────────────
```

---

## 8. ADAPTAÇÃO METABÓLICA

### 8.1 O que é Adaptação Metabólica?

Quando em déficit calórico prolongado, o corpo reduz o gasto energético além do esperado pela perda de peso. Isso é chamado de "adaptive thermogenesis" ou "metabolic adaptation".

### 8.2 Componentes da Adaptação

```
REDUÇÃO DO GASTO ENERGÉTICO EM DÉFICIT:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. TMB reduzida (~10-15% além do esperado)                            │
│     • Hormônios tireoidianos diminuem                                  │
│     • Eficiência metabólica aumenta                                    │
│                                                                         │
│  2. NEAT reduzido (~33-51% da redução total)                           │
│     • Movimentos inconscientes diminuem                                │
│     • Fadiga aumenta, pessoa se move menos                             │
│                                                                         │
│  3. TEF ligeiramente reduzido                                          │
│     • Menos comida = menos TEF absoluto                                │
│                                                                         │
│  4. EAT pode ser reduzido                                              │
│     • Performance no treino cai                                        │
│     • Menos energia = menos intensidade                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Magnitude da Adaptação

Estudos mostram:

| Situação | Adaptação Metabólica |
|----------|---------------------|
| Déficit moderado (-500 kcal) curto prazo | 5-10% |
| Déficit moderado prolongado (3+ meses) | 10-15% |
| Déficit agressivo (-1000 kcal) | 15-20% |
| Contest prep (bodybuilding) | 20-25% |
| Estudo Minnesota (semi-inanição) | 40% |

### 8.4 Como Minimizar a Adaptação

```
ESTRATÉGIAS:

1. DÉFICIT MODERADO
   • -300 a -500 kcal/dia (não mais)
   • Perda de ~0.5% do peso corporal/semana

2. DIET BREAKS
   • 1-2 semanas em manutenção a cada 8-12 semanas
   • Restaura parcialmente hormônios

3. REFEEDS
   • 1-2 dias de calorias de manutenção (foco em carbs)
   • A cada 1-2 semanas durante déficit

4. MANTER TREINO DE FORÇA
   • Preserva massa muscular
   • Mantém TMB mais elevada

5. PROTEÍNA ALTA
   • 2.0-2.4 g/kg em déficit
   • Preserva massa magra

6. AUMENTAR NEAT CONSCIENTEMENTE
   • Passos diários, atividades de baixa intensidade
   • Contrabalança redução inconsciente
```

---

## 9. COMO O VITRÚVIO DEVE CALCULAR

### 9.1 Fluxo de Cálculo Recomendado

```typescript
function calcularMetabolismoCompleto(atleta: Atleta): ResultadoMetabolismo {
  
  // PASSO 1: Escolher equação apropriada
  const temGorduraCorporal = atleta.gorduraCorporal !== null
  
  let tmb: number
  let equacaoUsada: string
  
  if (temGorduraCorporal) {
    // Katch-McArdle para atletas com BF% conhecido
    const massaMagra = atleta.peso * (1 - atleta.gorduraCorporal / 100)
    tmb = 370 + (21.6 * massaMagra)
    equacaoUsada = 'Katch-McArdle'
  } else {
    // Mifflin-St Jeor para população geral
    if (atleta.sexo === 'M') {
      tmb = (10 * atleta.peso) + (6.25 * atleta.altura) - (5 * atleta.idade) + 5
    } else {
      tmb = (10 * atleta.peso) + (6.25 * atleta.altura) - (5 * atleta.idade) - 161
    }
    equacaoUsada = 'Mifflin-St Jeor'
  }
  
  // PASSO 2: Calcular componentes
  const tef = tmb * 0.10
  const neat = calcularNEAT(tmb, atleta.ocupacao)
  const eat = calcularEAT(atleta.treinos)
  
  // PASSO 3: Somar TDEE
  const tdee = tmb + tef + neat + eat
  
  // PASSO 4: Aplicar ajuste se em déficit prolongado
  let tdeeAjustado = tdee
  if (atleta.semanasEmDeficit > 8) {
    const ajusteAdaptacao = 0.05 + (atleta.semanasEmDeficit * 0.005)
    tdeeAjustado = tdee * (1 - Math.min(ajusteAdaptacao, 0.15))
  }
  
  return {
    tmb: Math.round(tmb),
    tef: Math.round(tef),
    neat: Math.round(neat),
    eat: Math.round(eat),
    tdee: Math.round(tdee),
    tdeeAjustado: Math.round(tdeeAjustado),
    equacaoUsada
  }
}
```

### 9.2 Tabela de Fatores de Atividade (Simplificado)

Para uso quando não há dados detalhados:

| Perfil | Fator | Exemplo |
|--------|-------|---------|
| Sedentário + sem treino | 1.2 | Escritório, não treina |
| Sedentário + treino 3x | 1.4 | Escritório + academia |
| Sedentário + treino 5x | 1.5 | Escritório + treino intenso |
| Ativo + treino 3x | 1.6 | Professor + academia |
| Ativo + treino 5x | 1.7 | Enfermeiro + treino |
| Muito ativo + treino | 1.9 | Construção + treino |
| Atleta profissional | 2.0-2.4 | Treino 2x/dia |

---

## 10. LIMITAÇÕES E CONSIDERAÇÕES

### 10.1 Margem de Erro

```
PRECISÃO DAS ESTIMATIVAS:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  TMB: ±150-200 kcal (mesmo com melhor equação)                         │
│                                                                         │
│  TDEE: ±300-400 kcal (variação individual significativa)               │
│                                                                         │
│  IMPORTANTE: Fórmulas são PONTO DE PARTIDA, não verdade absoluta!      │
│                                                                         │
│  Ajustar baseado em:                                                   │
│  • Mudanças reais de peso após 2-3 semanas                             │
│  • Níveis de energia                                                   │
│  • Performance no treino                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Quando Ajustar o TDEE

| Situação | Ação |
|----------|------|
| Peso caindo >0.7 kg/sem | ↑ Aumentar calorias 100-150 |
| Peso estagnado 2+ semanas | ↓ Reduzir 100-150 OU aumentar NEAT |
| Peso subindo (em cutting) | Revisar aderência, depois ↓ 150-200 |
| Energia muito baixa | ↑ Aumentar calorias ou fazer diet break |

### 10.3 Mensagem para o Atleta

```
"O VITRÚVIO calcula seu gasto energético usando:

• Equação de Katch-McArdle (baseada na sua massa magra)
• Estimativas de NEAT por ocupação
• Gasto estimado dos treinos

IMPORTANTE: Estes são valores estimados com margem de ±300 kcal.
Ajustaremos baseado nos seus resultados reais nas próximas semanas.

Seu corpo é único - as fórmulas são o ponto de partida,
sua resposta real é o que guia os ajustes."
```

---

## 11. REFERÊNCIAS BIBLIOGRÁFICAS

### Equações de TMB

1. Harris JA, Benedict FG (1918). "A Biometric Study of Human Basal Metabolism." PNAS.
2. Mifflin MD, St Jeor ST, et al. (1990). "A new predictive equation for resting energy expenditure in healthy individuals." American Journal of Clinical Nutrition.
3. Roza AM, Shizgal HM (1984). "The Harris Benedict equation reevaluated." American Journal of Clinical Nutrition.
4. Cunningham JJ (1980/1991). "A reanalysis of the factors influencing basal metabolic rate." Nutrition Reviews.
5. Henry CJ (2005). "Basal metabolic rate studies in humans." Public Health Nutrition.

### Validação e Comparação

6. Frankenfield D, et al. (2005). "Comparison of predictive equations for resting metabolic rate in healthy nonobese and obese adults: a systematic review." Journal of the American Dietetic Association.
7. Flack KD, et al. (2023). "Accuracy of Resting Metabolic Rate Prediction Equations in Athletes: A Systematic Review with Meta-analysis." Sports Medicine.

### NEAT

8. Levine JA (2002). "Non-exercise activity thermogenesis (NEAT)." Best Practice & Research Clinical Endocrinology & Metabolism.
9. Levine JA, et al. (2005). "Nonexercise activity thermogenesis (NEAT): environment and biology." American Journal of Physiology.
10. Chung N, et al. (2018). "Non-exercise activity thermogenesis (NEAT): a component of total daily energy expenditure." Journal of Exercise Nutrition & Biochemistry.

### Adaptação Metabólica

11. Rosenbaum M, Leibel RL (2010). "Adaptive thermogenesis in humans." International Journal of Obesity.
12. Trexler ET, et al. (2014). "Metabolic adaptation to weight loss: implications for the athlete." Journal of the ISSN.

---

## 12. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |

---

**VITRU IA - SPEC Científica: Metabolismo e Gasto Energético v1.0**
