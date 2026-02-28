# SPEC CIENTÍFICA: Periodização de Treino

## Base de Conhecimento para o VITRÚVIO IA

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Tipo:** Conhecimento Científico Fundamental  
**Módulo:** Plano de Treino / Evolução

---

## 1. VISÃO GERAL

### 1.1 O que é esta SPEC?

Esta SPEC contém o conhecimento científico sobre **periodização de treino** que o VITRÚVIO deve usar como base para:

- Estruturar programas de treino em ciclos
- Escolher o modelo de periodização adequado
- Implementar deloads corretamente
- Progressão de carga ao longo do tempo
- Prevenir overreaching e overtraining

### 1.2 Definição

> **Periodização** é a organização sistemática e sequencial do treinamento em ciclos de diferentes durações, com o objetivo de otimizar adaptações, prevenir platôs e reduzir risco de lesões.

```
HIERARQUIA DOS CICLOS DE TREINO:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  MACROCICLO (3-12 meses)                                               │
│  ─────────────────────────                                             │
│  • Período de treino completo (ex: 1 ano, temporada)                   │
│  • Contém múltiplos mesociclos                                         │
│  • Objetivo geral do atleta                                            │
│                                                                         │
│     └── MESOCICLO (3-6 semanas)                                        │
│         ────────────────────────                                       │
│         • Bloco de treino com objetivo específico                      │
│         • Foco em uma qualidade (hipertrofia, força, etc)              │
│         • Geralmente 4-6 semanas                                       │
│                                                                         │
│            └── MICROCICLO (1 semana)                                   │
│                ────────────────────────                                │
│                • Uma semana de treino                                  │
│                • Unidade básica de planejamento                        │
│                • Contém todas as sessões semanais                      │
│                                                                         │
│                   └── SESSÃO DE TREINO                                 │
│                       ────────────────────                             │
│                       • Um treino individual                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Fontes Científicas Principais

| Pesquisador/Estudo | Ano | Contribuição |
|--------------------|-----|--------------|
| Grgic et al. | 2017 | Meta-análise LP vs DUP hipertrofia |
| Moesgaard et al. | 2022 | Meta-análise periodização vs não-periodizado |
| Harries et al. | 2015 | Review LP vs UP força |
| Bell et al. | 2023 | Consenso Delphi sobre deload |
| Williams et al. | 2017 | Meta-análise periodização e força |

---

## 2. MODELOS DE PERIODIZAÇÃO

### 2.1 Periodização Linear (Clássica)

```
PERIODIZAÇÃO LINEAR (LP):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  CONCEITO:                                                             │
│  • Volume DIMINUI progressivamente                                      │
│  • Intensidade (carga) AUMENTA progressivamente                        │
│  • Mudanças graduais a cada 2-4 semanas                                │
│                                                                         │
│  EXEMPLO (12 semanas):                                                 │
│  ─────────────────────                                                 │
│                                                                         │
│  Semanas 1-4: HIPERTROFIA                                              │
│  • 4 séries × 10-12 reps                                               │
│  • 65-75% 1RM                                                          │
│  • Alto volume, intensidade moderada                                   │
│                                                                         │
│  Semanas 5-8: FORÇA                                                    │
│  • 4 séries × 6-8 reps                                                 │
│  • 75-85% 1RM                                                          │
│  • Volume moderado, intensidade alta                                   │
│                                                                         │
│  Semanas 9-12: PICO DE FORÇA                                           │
│  • 3-4 séries × 3-5 reps                                               │
│  • 85-95% 1RM                                                          │
│  • Baixo volume, intensidade muito alta                                │
│                                                                         │
│  VISUALIZAÇÃO:                                                         │
│                                                                         │
│  Volume    ████████████                                                │
│            ████████████                                                │
│            ████████                                                    │
│            ████████                                                    │
│            ████                                                        │
│            ████                                                        │
│            ──────────────────────→ Tempo                               │
│                                                                         │
│  Intensidade    ████                                                   │
│                 ████                                                   │
│                 ████████                                               │
│                 ████████                                               │
│                 ████████████                                           │
│                 ████████████                                           │
│                 ──────────────────────→ Tempo                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Periodização Ondulatória Diária (DUP)

```
DAILY UNDULATING PERIODIZATION (DUP):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  CONCEITO:                                                             │
│  • Volume e intensidade variam A CADA SESSÃO                           │
│  • Treina múltiplas qualidades na mesma semana                         │
│  • Maior variação no estímulo                                          │
│                                                                         │
│  EXEMPLO (1 semana típica):                                            │
│  ─────────────────────────                                             │
│                                                                         │
│  Segunda: HIPERTROFIA                                                  │
│  • 4 séries × 10 reps                                                  │
│  • 70% 1RM                                                             │
│  • RIR 2-3                                                             │
│                                                                         │
│  Quarta: FORÇA                                                         │
│  • 5 séries × 5 reps                                                   │
│  • 82% 1RM                                                             │
│  • RIR 1-2                                                             │
│                                                                         │
│  Sexta: POTÊNCIA/FORÇA-RESISTÊNCIA                                     │
│  • 3 séries × 3 reps (potência) OU                                     │
│  • 3 séries × 15 reps (resistência)                                    │
│  • 85-90% 1RM OU 60% 1RM                                               │
│                                                                         │
│  VISUALIZAÇÃO (1 semana):                                              │
│                                                                         │
│  Volume      ▲           ▲           ▲                                 │
│              █           █           █                                 │
│              █     █     █     █     █                                 │
│              █     █     █     █     █                                 │
│              ─────────────────────────→                                │
│              Seg   Ter   Qua   Qui   Sex                               │
│                                                                         │
│  Intensidade            █                 █                            │
│              █          █           █     █                            │
│              █          █           █                                  │
│              ─────────────────────────→                                │
│              Seg   Ter   Qua   Qui   Sex                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Periodização Ondulatória Semanal (WUP)

```
WEEKLY UNDULATING PERIODIZATION (WUP):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  CONCEITO:                                                             │
│  • Foco muda A CADA SEMANA                                             │
│  • Menos variação que DUP, mais que LP                                 │
│  • Cada semana tem um objetivo predominante                            │
│                                                                         │
│  EXEMPLO (4 semanas):                                                  │
│  ─────────────────────                                                 │
│                                                                         │
│  Semana 1: HIPERTROFIA                                                 │
│  • Todos os treinos: 3-4 × 10-12 reps                                  │
│                                                                         │
│  Semana 2: FORÇA                                                       │
│  • Todos os treinos: 4-5 × 5-6 reps                                    │
│                                                                         │
│  Semana 3: HIPERTROFIA (mais volume)                                   │
│  • Todos os treinos: 4 × 8-10 reps                                     │
│                                                                         │
│  Semana 4: FORÇA (mais intensidade)                                    │
│  • Todos os treinos: 5 × 3-5 reps                                      │
│                                                                         │
│  Depois: repetir ciclo com progressão de carga                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Periodização em Blocos

```
BLOCK PERIODIZATION:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  CONCEITO:                                                             │
│  • Divide treinamento em blocos sequenciais                            │
│  • Cada bloco foca em 1-2 qualidades                                   │
│  • Maior especificidade que LP tradicional                             │
│                                                                         │
│  BLOCOS TÍPICOS:                                                       │
│  ────────────────                                                      │
│                                                                         │
│  BLOCO 1 - ACUMULAÇÃO (3-4 semanas)                                    │
│  • Foco: hipertrofia, capacidade de trabalho                           │
│  • Volume ALTO                                                         │
│  • Intensidade MODERADA                                                │
│  • 65-75% 1RM, 8-12+ reps                                              │
│                                                                         │
│  BLOCO 2 - TRANSMUTAÇÃO (3-4 semanas)                                  │
│  • Foco: força máxima                                                  │
│  • Volume MODERADO                                                     │
│  • Intensidade ALTA                                                    │
│  • 80-90% 1RM, 3-6 reps                                                │
│                                                                         │
│  BLOCO 3 - REALIZAÇÃO (1-2 semanas)                                    │
│  • Foco: expressão de força/pico                                       │
│  • Volume BAIXO                                                        │
│  • Intensidade MUITO ALTA                                              │
│  • 90-100%+ 1RM, 1-3 reps                                              │
│                                                                         │
│  USO IDEAL:                                                            │
│  • Atletas de força (powerlifting, weightlifting)                      │
│  • Preparação para competição                                          │
│  • Atletas avançados/elite                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.5 Comparação dos Modelos

```
COMPARAÇÃO DOS MODELOS DE PERIODIZAÇÃO:

┌──────────────────────────────────────────────────────────────────────────────────┐
│ MODELO              VARIAÇÃO      PARA QUEM              COMPLEXIDADE            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│ LINEAR (LP)         A cada        Iniciantes,            Baixa                   │
│                     2-4 semanas   foco em força                                  │
│                                                                                  │
│ ONDULATÓRIA         Diária        Intermediários+,       Moderada                │
│ DIÁRIA (DUP)        (sessão)      treinados                                      │
│                                                                                  │
│ ONDULATÓRIA         Semanal       Intermediários,        Baixa-Moderada          │
│ SEMANAL (WUP)                     híbrido LP/DUP                                 │
│                                                                                  │
│ BLOCOS              Por bloco     Avançados,             Alta                    │
│                     (3-4 sem)     competidores                                   │
│                                                                                  │
│ NÃO-PERIODIZADO     Nenhuma       Iniciantes (curto      Muito Baixa             │
│                                   prazo), manutenção                             │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. O QUE A CIÊNCIA DIZ

### 3.1 Meta-Análise: Periodizado vs Não-Periodizado

**Estudo:** Moesgaard et al. (2022) - "Effects of Periodization on Strength and Muscle Hypertrophy in Volume-Equated Resistance Training Programs"

**Metodologia:**
- 35 estudos incluídos
- Comparou treino periodizado vs não-periodizado
- Volume EQUALIZADO entre condições

**Resultados para FORÇA (1RM):**

| Comparação | Effect Size | p-value | Conclusão |
|------------|-------------|---------|-----------|
| Periodizado vs Não-Periodizado | ES = 0.31 | p = 0.02 | **Periodizado melhor** |
| Undulating vs Linear | ES = 0.28 | p = 0.04 | **UP melhor (treinados)** |

**Resultados para HIPERTROFIA:**

| Comparação | Effect Size | p-value | Conclusão |
|------------|-------------|---------|-----------|
| Periodizado vs Não-Periodizado | Não significativo | p > 0.05 | Sem diferença |
| Undulating vs Linear | ES = 0.05 | p = 0.72 | Sem diferença |

**Conclusões:**
- Para FORÇA: periodização é superior, UP melhor que LP em treinados
- Para HIPERTROFIA: não faz diferença significativa (quando volume é igual)

### 3.2 Meta-Análise: LP vs DUP para Hipertrofia

**Estudo:** Grgic et al. (2017) - "Effects of linear and daily undulating periodized resistance training programs on measures of muscle hypertrophy"

**Metodologia:**
- 13 estudos elegíveis
- Comparou LP (linear) vs DUP (ondulatória diária)
- Medidas de hipertrofia (ultrassom, DEXA, circunferência)

**Resultados:**

```
COMPARAÇÃO LP vs DUP PARA HIPERTROFIA:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Effect Size (Cohen's d): -0.02                                        │
│  95% CI: [-0.25, 0.21]                                                 │
│  p = 0.848                                                             │
│                                                                         │
│  INTERPRETAÇÃO:                                                        │
│  • Diferença praticamente ZERO                                         │
│  • LP e DUP produzem hipertrofia SIMILAR                               │
│  • Escolha pode ser baseada em preferência pessoal                     │
│                                                                         │
│  IMPLICAÇÃO PRÁTICA:                                                   │
│  Para hipertrofia, o que importa é:                                    │
│  1. Volume total                                                       │
│  2. Sobrecarga progressiva                                             │
│  3. Consistência                                                       │
│  NÃO o modelo de periodização específico!                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Análise do Stronger by Science

Greg Nuckols (2020) analisou os dados disponíveis:

```
CONCLUSÕES DA ANÁLISE:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. PERIODIZAÇÃO IMPORTA MAIS PARA FORÇA QUE HIPERTROFIA               │
│     • Força: periodizado > não-periodizado                             │
│     • Hipertrofia: sem diferença significativa                         │
│                                                                         │
│  2. UNDULATING PODE SER MELHOR PARA TREINADOS                          │
│     • Treinados: UP > LP para força                                    │
│     • Não-treinados: LP = UP (sem diferença)                           │
│                                                                         │
│  3. O EFEITO PODE VARIAR POR EXERCÍCIO                                 │
│     • Supino: periodização parece importar mais                        │
│     • Agachamento: menos diferença entre modelos                       │
│                                                                         │
│  4. PARA HIPERTROFIA, FOQUE EM VOLUME                                  │
│     • Volume é o driver principal                                      │
│     • Periodização é secundária                                        │
│     • Escolha modelo que permita acumular mais volume                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. DELOAD (SEMANA DE DESCARGA)

### 4.1 Definição e Propósito

```
O QUE É DELOAD:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  DEFINIÇÃO (Consenso Delphi, Bell et al. 2023):                        │
│  "Período de estresse de treino reduzido projetado para mitigar        │
│   fadiga fisiológica e psicológica, promover recuperação e             │
│   aumentar preparação para o próximo ciclo de treino."                 │
│                                                                         │
│  PROPÓSITOS:                                                           │
│  ────────────                                                          │
│  1. Dissipar fadiga acumulada                                          │
│  2. Permitir recuperação completa                                      │
│  3. Prevenir overreaching não-funcional                                │
│  4. Restaurar motivação                                                │
│  5. Permitir adaptações se manifestarem                                │
│                                                                         │
│  NÃO É:                                                                │
│  ──────                                                                │
│  • Parar de treinar completamente (isso é detraining)                  │
│  • Treinar muito leve a ponto de perder adaptações                     │
│  • Necessário para todos (depende do contexto)                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Quando Fazer Deload

```
INDICADORES PARA DELOAD:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ABORDAGEM PRÉ-PLANEJADA (Proativa):                                   │
│  ────────────────────────────────────                                  │
│  • A cada 4-6 semanas de treino intenso                                │
│  • No final de cada mesociclo                                          │
│  • Antes de iniciar novo bloco/programa                                │
│                                                                         │
│  ABORDAGEM AUTOREGULADA (Reativa):                                     │
│  ─────────────────────────────────                                     │
│  Fazer deload quando notar:                                            │
│  • Performance estagnada ou diminuindo por 2+ semanas                  │
│  • Dor muscular persistente que não resolve                            │
│  • Dores articulares ou desconforto                                    │
│  • Fadiga excessiva antes/durante treinos                              │
│  • Motivação muito baixa para treinar                                  │
│  • Sono piorando                                                       │
│  • Irritabilidade aumentada                                            │
│                                                                         │
│  FREQUÊNCIA TÍPICA (pesquisa):                                         │
│  ──────────────────────────────                                        │
│  • Média: a cada 5.6 ± 2.3 semanas                                     │
│  • Range: 3-10 semanas (depende do indivíduo)                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Como Fazer Deload

```
MÉTODOS DE DELOAD:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  DURAÇÃO:                                                              │
│  ─────────                                                             │
│  • Típica: 5-7 dias (1 semana)                                         │
│  • Range: 3-14 dias                                                    │
│  • Menos de 7 dias: sem perda de adaptações                            │
│  • Mais de 21 dias: risco de detraining                                │
│                                                                         │
│  REDUÇÃO DE VOLUME (mais comum):                                       │
│  ─────────────────────────────────                                     │
│  • Reduzir séries em 40-60%                                            │
│  • Manter intensidade (carga) igual                                    │
│  • Manter frequência igual                                             │
│  • Exemplo: de 4 séries para 2 séries                                  │
│                                                                         │
│  REDUÇÃO DE INTENSIDADE:                                               │
│  ────────────────────────                                              │
│  • Reduzir carga em 40-60%                                             │
│  • Manter volume igual                                                 │
│  • Exemplo: de 100kg para 60kg                                         │
│                                                                         │
│  REDUÇÃO DE ESFORÇO (RIR):                                             │
│  ──────────────────────────                                            │
│  • Aumentar RIR significativamente                                     │
│  • De RIR 1-2 para RIR 4-5                                             │
│  • Parar bem longe da falha                                            │
│                                                                         │
│  REDUÇÃO DE FREQUÊNCIA:                                                │
│  ─────────────────────────                                             │
│  • Reduzir dias de treino                                              │
│  • De 5x para 3x por semana                                            │
│  • Menos comum, mas válido                                             │
│                                                                         │
│  RECOMENDAÇÃO PRÁTICA:                                                 │
│  ───────────────────────                                               │
│  Combinar: reduzir VOLUME em 50% + aumentar RIR para 4+                │
│  Manter: mesma frequência + mesmos exercícios                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.4 Evidências sobre Deload

```
O QUE A PESQUISA MOSTRA:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ESTUDO: Schoenfeld et al. (2024) - 9 semanas, 90 séries/semana        │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  GRUPOS:                                                               │
│  • DELOAD: pausa de 1 semana na semana 5                               │
│  • TRAD: treino contínuo (sem pausa)                                   │
│                                                                         │
│  RESULTADOS:                                                           │
│  • Hipertrofia: SEM DIFERENÇA entre grupos                             │
│  • Força: leve vantagem para TRAD em isométrico                        │
│  • Nenhum participante sentiu necessidade de deload ao final           │
│                                                                         │
│  CONCLUSÃO:                                                            │
│  • Overreaching por treino de força sozinho é RARO                     │
│  • Deload pode não ser NECESSÁRIO para todos                           │
│  • Mas também não prejudica                                            │
│                                                                         │
│  META-ANÁLISE: Bosquet et al. - Detraining                             │
│  ─────────────────────────────────────────────                         │
│  • Força NÃO diminui significativamente até 3 semanas sem treino       │
│  • < 7 dias: sem perda de força                                        │
│  • 7-14 dias: perda mínima                                             │
│  • > 21 dias: perda significativa começa                               │
│                                                                         │
│  SURVEY COM ATLETAS (Rogerson et al.):                                 │
│  ──────────────────────────────────────                                │
│  • 92.3% usam deload para reduzir fadiga                               │
│  • 64.6% para preparar próximo ciclo                                   │
│  • Duração média: 6.4 ± 1.7 dias                                       │
│  • Frequência média: a cada 5.6 semanas                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. PROGRESSÃO DE CARGA

### 5.1 Tipos de Progressão

```
MODELOS DE PROGRESSÃO:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  PROGRESSÃO LINEAR SIMPLES:                                            │
│  ─────────────────────────────                                         │
│  • Adicionar peso a cada semana                                        │
│  • Exemplo: +2.5kg supino por semana                                   │
│  • Funciona bem para INICIANTES                                        │
│  • Eventualmente para (platô)                                          │
│                                                                         │
│  DUPLA PROGRESSÃO:                                                     │
│  ─────────────────                                                     │
│  • Primeiro aumenta reps, depois aumenta peso                          │
│  • Exemplo:                                                            │
│    Sem 1: 80kg × 8 reps                                                │
│    Sem 2: 80kg × 9 reps                                                │
│    Sem 3: 80kg × 10 reps                                               │
│    Sem 4: 82.5kg × 8 reps (volta para 8, peso maior)                   │
│  • Mais sustentável que progressão linear                              │
│                                                                         │
│  PROGRESSÃO DE VOLUME:                                                 │
│  ───────────────────────                                               │
│  • Aumenta séries ao longo do mesociclo                                │
│  • Exemplo:                                                            │
│    Sem 1: 3 séries                                                     │
│    Sem 2: 3 séries                                                     │
│    Sem 3: 4 séries                                                     │
│    Sem 4: 4 séries                                                     │
│    Sem 5: DELOAD (2 séries)                                            │
│    Sem 6: recomeça com 3 séries, mais peso                             │
│                                                                         │
│  PROGRESSÃO POR RIR:                                                   │
│  ───────────────────                                                   │
│  • Começa longe da falha, aproxima ao longo do ciclo                   │
│  • Exemplo:                                                            │
│    Sem 1: RIR 4                                                        │
│    Sem 2: RIR 3                                                        │
│    Sem 3: RIR 2                                                        │
│    Sem 4: RIR 1                                                        │
│    Sem 5: DELOAD                                                       │
│  • Boa para gerenciar fadiga                                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Exemplo de Mesociclo Completo

```
MESOCICLO DE HIPERTROFIA (5 semanas):

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ESTRUTURA GERAL:                                                      │
│  • 4 semanas de treino + 1 semana de deload                            │
│  • Progressão de volume + aproximação à falha                          │
│  • Volume começa conservador, aumenta                                  │
│                                                                         │
│  EXEMPLO - SUPINO:                                                     │
│  ─────────────────                                                     │
│                                                                         │
│  SEMANA 1 (Introdução):                                                │
│  • 3 séries × 10 reps                                                  │
│  • RIR 3-4                                                             │
│  • Peso: 80kg                                                          │
│                                                                         │
│  SEMANA 2 (Acumulação):                                                │
│  • 3 séries × 10-11 reps                                               │
│  • RIR 3                                                               │
│  • Peso: 80kg (aumenta reps)                                           │
│                                                                         │
│  SEMANA 3 (Intensificação):                                            │
│  • 4 séries × 10 reps                                                  │
│  • RIR 2                                                               │
│  • Peso: 82.5kg                                                        │
│                                                                         │
│  SEMANA 4 (Overreaching funcional):                                    │
│  • 4 séries × 10-12 reps                                               │
│  • RIR 1 (perto da falha)                                              │
│  • Peso: 82.5kg                                                        │
│                                                                         │
│  SEMANA 5 (DELOAD):                                                    │
│  • 2 séries × 8 reps                                                   │
│  • RIR 4-5                                                             │
│  • Peso: 75kg (reduzido)                                               │
│                                                                         │
│  PRÓXIMO MESOCICLO:                                                    │
│  • Volta para 3 séries                                                 │
│  • Começa com 85kg                                                     │
│  • Repete estrutura                                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. APLICAÇÃO POR OBJETIVO

### 6.1 Periodização para Hipertrofia

```
PERIODIZAÇÃO PARA HIPERTROFIA:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  MODELO RECOMENDADO: DUP ou progressão linear simples                  │
│                                                                         │
│  RAZÃO:                                                                │
│  • Hipertrofia depende mais de VOLUME que do modelo                    │
│  • Variação de reps (6-12-15) pode otimizar diferentes fibras          │
│  • DUP mantém variedade e motivação                                    │
│                                                                         │
│  EXEMPLO DUP PARA HIPERTROFIA:                                         │
│  ──────────────────────────────                                        │
│                                                                         │
│  Dia 1: Força-Hipertrofia (6-8 reps)                                   │
│  • Supino 4×6-8 @ RPE 8                                                │
│  • Agachamento 4×6-8 @ RPE 8                                           │
│                                                                         │
│  Dia 2: Hipertrofia (10-12 reps)                                       │
│  • Supino inclinado 4×10-12 @ RPE 8                                    │
│  • Leg press 4×10-12 @ RPE 8                                           │
│                                                                         │
│  Dia 3: Metabólico (12-15+ reps)                                       │
│  • Supino máquina 3×15 @ RPE 9                                         │
│  • Extensora 3×15 @ RPE 9                                              │
│                                                                         │
│  ESTRUTURA DO MESOCICLO:                                               │
│  • 4-6 semanas de treino                                               │
│  • Volume aumenta progressivamente                                     │
│  • 1 semana de deload                                                  │
│  • Repetir com mais carga                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Periodização para Força

```
PERIODIZAÇÃO PARA FORÇA:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  MODELO RECOMENDADO: Block ou LP (para treinados: DUP)                 │
│                                                                         │
│  RAZÃO:                                                                │
│  • Força requer especificidade (treinar pesado)                        │
│  • Treinados se beneficiam de variação (DUP)                           │
│  • Block permite pico para competição                                  │
│                                                                         │
│  EXEMPLO BLOCK PERIODIZATION (12 semanas para competição):             │
│  ──────────────────────────────────────────────────────────            │
│                                                                         │
│  BLOCO 1 - ACUMULAÇÃO (Semanas 1-4):                                   │
│  • Supino: 5×8 @ 70-75%                                                │
│  • Agachamento: 5×8 @ 70-75%                                           │
│  • Terra: 4×6 @ 70-75%                                                 │
│  • Foco: construir base, volume alto                                   │
│                                                                         │
│  BLOCO 2 - TRANSMUTAÇÃO (Semanas 5-9):                                 │
│  • Supino: 5×5 @ 80-85%                                                │
│  • Agachamento: 5×5 @ 80-85%                                           │
│  • Terra: 4×4 @ 80-85%                                                 │
│  • Foco: força máxima                                                  │
│                                                                         │
│  BLOCO 3 - REALIZAÇÃO (Semanas 10-12):                                 │
│  • Supino: 3×3 @ 90%+                                                  │
│  • Agachamento: 3×3 @ 90%+                                             │
│  • Terra: 2×2 @ 90%+                                                   │
│  • Foco: expressão de força, pico                                      │
│                                                                         │
│  Semana 13: COMPETIÇÃO ou teste de 1RM                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Periodização para Manutenção

```
PERIODIZAÇÃO PARA MANUTENÇÃO:

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  QUANDO USAR:                                                          │
│  • Períodos de muito estresse                                          │
│  • Férias/viagens                                                      │
│  • Foco em outro objetivo (cardio, esporte)                            │
│  • Recuperação de lesão                                                │
│                                                                         │
│  VOLUME MÍNIMO PARA MANTER:                                            │
│  ────────────────────────────                                          │
│  • ~1/3 do volume de ganho                                             │
│  • 6-9 séries por grupo por semana                                     │
│  • 2 sessões por semana total podem ser suficientes                    │
│                                                                         │
│  EXEMPLO (2x/semana full body):                                        │
│  ──────────────────────────────                                        │
│                                                                         │
│  Sessão A:                                                             │
│  • Agachamento 3×6-8                                                   │
│  • Supino 3×6-8                                                        │
│  • Remada 3×8-10                                                       │
│  • Overhead press 2×8-10                                               │
│                                                                         │
│  Sessão B:                                                             │
│  • Terra 3×5                                                           │
│  • Supino inclinado 3×8-10                                             │
│  • Puxada 3×8-10                                                       │
│  • Elevação lateral 2×12-15                                            │
│                                                                         │
│  CHAVE: Manter INTENSIDADE (carga) mesmo com volume reduzido           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. COMO O VITRÚVIO DEVE PRESCREVER

### 7.1 Algoritmo de Periodização

```typescript
interface ParametrosPeriodizacao {
  objetivo: 'HIPERTROFIA' | 'FORCA' | 'MANUTENCAO' | 'RECOMP'
  experiencia: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO' | 'ELITE'
  diasDisponiveis: number
  semanasDisponiveis: number
  temCompetição: boolean
  dataCompeticao?: Date
}

interface PlanoPeriodizacao {
  modelo: string
  estruturaMesociclo: MesocicloConfig
  frequenciaDeload: number  // semanas
  progressao: string
  justificativa: string[]
}

interface MesocicloConfig {
  duracaoSemanas: number
  semanasDeload: number
  progressaoVolume: string
  progressaoIntensidade: string
}

function determinarPeriodizacao(params: ParametrosPeriodizacao): PlanoPeriodizacao {
  let modelo: string
  let duracaoMeso: number
  let freqDeload: number
  
  // Determinar modelo baseado em objetivo e experiência
  if (params.objetivo === 'HIPERTROFIA') {
    if (params.experiencia === 'INICIANTE') {
      modelo = 'LINEAR_SIMPLES'
      duracaoMeso = 6
      freqDeload = 6
    } else {
      modelo = 'DUP'  // ondulatória diária
      duracaoMeso = 5
      freqDeload = 5
    }
  } else if (params.objetivo === 'FORCA') {
    if (params.temCompetição) {
      modelo = 'BLOCK'
      duracaoMeso = 4
      freqDeload = 4
    } else if (params.experiencia === 'AVANCADO' || params.experiencia === 'ELITE') {
      modelo = 'DUP'
      duracaoMeso = 4
      freqDeload = 4
    } else {
      modelo = 'LINEAR'
      duracaoMeso = 4
      freqDeload = 4
    }
  } else if (params.objetivo === 'MANUTENCAO') {
    modelo = 'SIMPLES'  // sem periodização complexa
    duracaoMeso = 8  // ciclos mais longos
    freqDeload = 8  // menos frequente
  } else {  // RECOMP
    modelo = 'DUP'
    duracaoMeso = 5
    freqDeload = 5
  }
  
  // Ajustar por experiência
  if (params.experiencia === 'INICIANTE') {
    freqDeload = Math.max(freqDeload, 6)  // iniciantes precisam menos
  } else if (params.experiencia === 'ELITE') {
    freqDeload = Math.min(freqDeload, 4)  // elite pode precisar mais
  }
  
  // Configurar mesociclo
  const estruturaMesociclo: MesocicloConfig = {
    duracaoSemanas: duracaoMeso,
    semanasDeload: 1,
    progressaoVolume: 'Aumentar 1-2 séries por semana até deload',
    progressaoIntensidade: 'Dupla progressão (reps depois peso)'
  }
  
  // Determinar tipo de progressão
  let progressao: string
  if (params.experiencia === 'INICIANTE') {
    progressao = 'LINEAR_CARGA'  // adicionar peso toda semana
  } else if (params.objetivo === 'HIPERTROFIA') {
    progressao = 'DUPLA_PROGRESSAO'  // reps depois peso
  } else {
    progressao = 'PROGRESSAO_RIR'  // aproximar da falha ao longo do ciclo
  }
  
  // Preparar justificativas
  const justificativa: string[] = [
    `Modelo ${modelo} escolhido para ${params.objetivo} com ${params.experiencia}`,
    `Mesociclo de ${duracaoMeso} semanas com deload na última`,
    `Deload a cada ${freqDeload} semanas`
  ]
  
  if (params.temCompetição) {
    justificativa.push('Estrutura em blocos para pico na competição')
  }
  
  return {
    modelo,
    estruturaMesociclo,
    frequenciaDeload: freqDeload,
    progressao,
    justificativa
  }
}
```

### 7.2 Exemplo de Aplicação

```
ATLETA: Leonardo
─────────────────────────────────────────────────────
Objetivo: HIPERTROFIA
Experiência: ELITE (16 anos)
Dias disponíveis: 5
Semanas disponíveis: 12 (planejamento)
Competição: Não

RESULTADO:
─────────────────────────────────────────────────────

MODELO: DUP (Ondulatória Diária)

ESTRUTURA DO MESOCICLO:
• Duração: 5 semanas (4 treino + 1 deload)
• 3 ciclos em 12 semanas

PROGRESSÃO:
• Semanas 1-2: Volume base, RIR 3
• Semanas 3-4: Volume aumenta, RIR 2-1
• Semana 5: Deload (50% volume, RIR 5)

EXEMPLO DE SEMANA (DUP):
─────────────────────────────────────────────────────
Segunda (Força):
  - Supino 4×5-6 @ RPE 8
  - Agachamento 4×5-6 @ RPE 8

Terça (Hipertrofia):
  - Supino inclinado 4×8-10 @ RPE 8
  - Leg press 4×10-12 @ RPE 8

Quinta (Metabólico):
  - Supino máquina 3×12-15 @ RPE 9
  - Hack squat 3×12-15 @ RPE 9

Sexta (Força-Hipertrofia):
  - Supino 4×6-8 @ RPE 8
  - Agachamento frontal 4×6-8 @ RPE 8

JUSTIFICATIVA:
• DUP para atleta treinado mantém variação e motivação
• Não há diferença em hipertrofia entre modelos
• Permite trabalhar diferentes faixas de rep na mesma semana
```

---

## 8. TABELA RESUMO PARA O VITRÚVIO

### 8.1 Referência Rápida

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                    ESCOLHA DO MODELO DE PERIODIZAÇÃO                             │
├──────────────────────────────────────────────────────────────────────────────────┤
│ OBJETIVO + EXPERIÊNCIA                     MODELO RECOMENDADO                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Hipertrofia + Iniciante                    Linear simples ou DUP simples         │
│ Hipertrofia + Intermediário/Avançado       DUP ou WUP                            │
│ Força + Iniciante                          Linear                                │
│ Força + Treinado                           DUP ou Block                          │
│ Força + Competição                         Block periodization                   │
│ Manutenção                                 Simples (sem periodização)            │
├──────────────────────────────────────────────────────────────────────────────────┤
│                    DELOAD - GUIA RÁPIDO                                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Frequência típica                          A cada 4-6 semanas                    │
│ Duração                                    5-7 dias (1 semana)                   │
│ Redução de volume                          40-60% (metade das séries)            │
│ Intensidade                                Manter ou reduzir levemente           │
│ RIR                                        Aumentar para 4-5                     │
│ Frequência                                 Manter igual                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│                    O QUE A CIÊNCIA DIZ                                           │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Para FORÇA:        Periodizado > Não-periodizado                                 │
│ Para HIPERTROFIA:  Sem diferença significativa entre modelos                     │
│ LP vs DUP:         Similar para hipertrofia, DUP melhor força (treinados)        │
│ Deload:            Provavelmente útil, mas não sempre necessário                 │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Regras de Ouro

```
REGRAS DO VITRÚVIO PARA PERIODIZAÇÃO:

1. VOLUME É REI PARA HIPERTROFIA
   • Modelo de periodização é secundário
   • Foque em acumular volume progressivamente

2. VARIAÇÃO IMPORTA PARA FORÇA (TREINADOS)
   • DUP pode ser superior a LP para quem já treina
   • Iniciantes: qualquer modelo funciona

3. DELOAD É FERRAMENTA, NÃO REGRA
   • Use quando precisar (fadiga, platô)
   • Ou programe preventivamente (4-6 semanas)
   • Não é obrigatório para todos

4. ESCOLHA O QUE VOCÊ VAI SEGUIR
   • O melhor programa é o que você faz consistentemente
   • Preferência pessoal importa

5. SOBRECARGA PROGRESSIVA SEMPRE
   • Independente do modelo, progredir é essencial
   • Peso, reps, ou séries devem aumentar ao longo do tempo

6. MESOCICLOS DE 4-6 SEMANAS
   • Tempo suficiente para adaptar
   • Curto o bastante para ajustar

7. NÃO COMPLIQUE DEMAIS
   • Iniciantes: progressão linear simples
   • Avançados: podem se beneficiar de modelos complexos
   • Complexidade não garante resultados
```

---

## 9. REFERÊNCIAS BIBLIOGRÁFICAS

### Meta-Análises de Periodização

1. Grgic J, et al. (2017). "Effects of linear and daily undulating periodized resistance training programs on measures of muscle hypertrophy: a systematic review and meta-analysis." PeerJ.

2. Moesgaard L, et al. (2022). "Effects of Periodization on Strength and Muscle Hypertrophy in Volume-Equated Resistance Training Programs: A Systematic Review and Meta-analysis." Sports Medicine.

3. Harries SK, et al. (2015). "Systematic review and meta-analysis of linear and undulating periodized resistance training programs on muscular strength." Journal of Strength and Conditioning Research.

4. Williams TD, et al. (2017). "Comparison of Periodized and Non-Periodized Resistance Training on Maximal Strength: A Meta-Analysis." Sports Medicine.

### Deload e Recuperação

5. Bell L, et al. (2023). "Integrating Deloading into Strength and Physique Sports Training Programmes: An International Delphi Consensus Approach." Sports Medicine - Open.

6. Bell L, et al. (2022). "Coaches' perceptions, practices and experiences of deloading in strength and physique sports." Frontiers in Sports and Active Living.

7. Rogerson D, et al. (2024). "Deloading Practices in Strength and Physique Sports: A Cross-sectional Survey." Sports Medicine.

8. Schoenfeld BJ, et al. (2024). "Gaining more from doing less? The effects of a one-week deload period during supervised resistance training on muscular adaptations." PeerJ.

### Análises Adicionais

9. Nuckols G (2020). "Periodization: What the Data Say." Stronger by Science.

10. Bosquet L, et al. (2013). "Effects of tapering on performance: a meta-analysis." Medicine and Science in Sports and Exercise.

---

## 10. CHANGELOG

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0 | Fev/2026 | Versão inicial |

---

**VITRU IA - SPEC Científica: Periodização de Treino v1.0**
