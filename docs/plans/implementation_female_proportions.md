# Plano de Implementação: Proporções Femininas (SPEC v1.0)

## Contexto
Implementar a lógica de avaliação de proporções corporais para atletas do sexo feminino na aba "PROPORCOES AUREAS" da tela "RESULTADOS DA AVALIACAO IA". A implementação seguirá estritamente o documento `docs/specs/proporcoes-femininas.md`.

## 1. Atualização de Tipos e Interfaces
**Arquivo:** `src/components/templates/AssessmentResults/types.ts`
- Atualizar `ComparisonMode` para incluir as categorias femininas:
  - `female_golden` (Padrão)
  - `bikini`
  - `wellness`
  - `figure`
  - `womens_physique`
  - `womens_bodybuilding`
- Atualizar interface `Measurements` para incluir campos obrigatórios para mulheres:
  - `quadril` (Essencial para WHR)
  - `abaixo_busto` (Opcional/Calculado)
  - `gluteo_dobra` (Opcional para Wellness)

## 2. Implementação do Motor de Cálculo (Service)
**Novo Arquivo:** `src/services/calculations/femaleProportions.ts`
Implementar todas as constantes e funções de cálculo definidas na SPEC:
- **Constantes:** `FEMALE_GOLDEN_RATIO`, `BIKINI_CONSTANTS`, `WELLNESS_CONSTANTS`, etc.
- **Funções de Ideais:**
  - `calcularIdeaisFemaleGoldenRatio`
  - `calcularIdeaisBikini`
  - `calcularIdeaisWellness`
  - `calcularIdeaisFigure`
  - ... e demais categorias.
- **Funções de Score:** Implementar lógica de pontuação específica para métricas femininas (WHR, Hourglass Index, etc).

**Atualização:** `src/services/calculations/index.ts`
- Exportar as novas funções criadas.

## 3. Configuração de Widgets (Cards)
**Novo Arquivo:** `src/components/templates/AssessmentResults/config/femaleProportionItems.ts`
Criar a configuração dos cards específicos para o público feminino, focando nas métricas da SPEC:
1.  **WHR (Waist-to-Hip Ratio):** A métrica mais importante (0.70 ideal).
2.  **Hourglass Index:** Índice de ampulheta.
3.  **Shape-X (SWR Feminino):** Proporção Ombros/Cintura.
4.  **WCR (Waist-to-Chest):** Equilíbrio superior.
5.  **Glúteos & Coxas:** Foco especial para Wellness/Bikini.
6.  **Simetria:** Comparativos de membros.

**Atualização:** `src/components/templates/AssessmentResults/hooks/useProportionCalculations.ts`
- Atualizar o hook para detectar o modo selecionado.
- Se for categoria feminina, utilizar `getFemaleProportionItems` e as funções de cálculo correspondentes.

## 4. Atualização da Interface (UI)
**Arquivo:** `src/components/templates/AssessmentResults/tabs/ProportionsTab.tsx`
- **Detecção de Gênero:** Utilizar `useAthleteStore` para identificar se o usuário é `female`.
- **Mock Data:** Criar `MOCK_FEMALE_MEASUREMENTS` para testes visuais imediatos (baseado nas medidas de exemplo da spec).
- **Seletores de Categoria:**
  - Se `gender === 'female'`, renderizar os botões:
    - ✨ Golden Ratio
    - 🩱 Bikini
    - 🏃 Wellness
    - 👙 Figure
    - 💪 W. Physique
    - 🏆 W. Bodybuilding
- **Lógica de Estado:** Ajustar o estado inicial de `comparisonMode` para `female_golden` se for mulher.

## 5. Fluxo de Execução
1.  Usuário acessa a aba "Proporções Áureas".
2.  Sistema verifica `athleteStore.profile.gender`.
3.  Se Mulher:
    - Carrega medidas femininas (Cintura, Quadril, Busto, etc.).
    - Exibe widgets focados em WHR e Hourglass.
    - Permite alternar entre categorias (ex: ver como seu corpo se compara a uma atleta Wellness).
4.  Se Homem:
    - Mantém comportamento atual (Shape-V, Golden Ratio Masculino).

---
**Aprovação necessária:** Posso prosseguir com a criação dos arquivos de serviço e atualização dos componentes conforme este plano?
