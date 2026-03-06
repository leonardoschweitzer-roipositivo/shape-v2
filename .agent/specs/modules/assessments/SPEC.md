# 📏 Assessments Module

> Avaliações físicas e proporções áureas

## Status: ✅ IMPLEMENTADO (Março 2026)

## 📄 Arquivos deste Módulo

| Arquivo | Descrição |
|---------|-----------|
| calculo-avaliacao-geral.md | Cálculo de avaliação geral |
| calculo-proporcoes.md | Cálculo de proporções áureas |
| proporcoes-masculinas.md | Proporções masculinas |
| proporcoes-femininas.md | Proporções femininas |
| escalas-proporcoes.md | Escalas de proporções |

## 🔗 Dependências

- `services/calculations/assessment.ts` — Motor principal de avaliação (30.9K)
- `services/calculations/diagnostico.ts` — Diagnóstico corporal detalhado (40K)
- `services/calculations/goldenRatio.ts` — Cálculos do ratio áureo
- `services/calculations/constants.ts` — Constantes e referências científicas (7.3K)

## 📊 Status de Implementação

- [x] Especificação completa
- [x] Implementação frontend (AssessmentPage, AssessmentResults, etc.)
- [x] Implementação de cálculos (17 arquivos em `services/calculations/`)
- [ ] Testes automatizados

## ✅ ESTADO ATUAL DA IMPLEMENTAÇÃO

### Arquivos de Cálculo (`services/calculations/`)

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `assessment.ts` | 30.9K | Motor de avaliação: scores, proporções, classificações |
| `diagnostico.ts` | 40K | Diagnóstico corporal: composição, simetria, pontos fortes/fracos |
| `dieta.ts` | 38.3K | Cálculos de dieta: TMB, TDEE, macros, refeições |
| `treino.ts` | 50.2K | Cálculos de treino: divisão, volume, exercícios por grupo (MAIOR arquivo do app) |
| `objetivos.ts` | 10.9K | Cálculos de objetivos: metas, projeções, timeline |
| `potencial.ts` | 14.1K | Cálculos de potencial genético: FFMI, limites naturais |
| `goldenRatio.ts` | 1.8K | Cálculos do ratio áureo (1.618) |
| `constants.ts` | 7.3K | Constantes científicas: referências, limites, categorias |
| `utils.ts` | 5.4K | Utilitários de cálculo |
| `femaleProportions.ts` | 10.1K | Proporções femininas (modelo específico) |
| `classicPhysique.ts` | 2.1K | Proporções Classic Physique |
| `mensPhysique.ts` | 2K | Proporções Men's Physique |
| `openBodybuilding.ts` | 2.5K | Proporções Open Bodybuilding |
| `personal-calculations.ts` | 7K | Cálculos específicos do personal |
| `evolutionProcessor.ts` | 10.3K | Processamento de dados de evolução |
| `index.ts` | 1.9K | Barrel exports |

### Componentes de UI

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| AssessmentPage | `pages/AssessmentPage.tsx` | Página de avaliação |
| AssessmentResults | `pages/AssessmentResults.tsx` (lazy) | Resultados da avaliação |
| AssessmentModal | `organisms/modals/AssessmentModal/` | Modal de avaliação |
| PersonalAssessmentView | `templates/Personal/PersonalAssessmentView.tsx` | Avaliação pelo personal |

### Fontes Científicas (`docs/specs/fontes-cientificas/`)

15 arquivos de referência científica: carboidratos, composição corporal, déficit/superávit, frequência de treino, gorduras, hidratação, hormônios, metabolismo, periodização, proporções áureas, proporções femininas, proteína, recuperação, suplementação, volume de treino.
