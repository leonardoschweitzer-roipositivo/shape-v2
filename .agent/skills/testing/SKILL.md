# 🧪 Testing Skill

> Padrões de testes do VITRU IA

---

## 🎯 Propósito

Consultar quando a tarefa envolver:
- Testes unitários
- Testes de integração
- Testes E2E
- Mocks e fixtures
- Cobertura de código

**Keywords**: teste, test, spec, mock, coverage, vitest, playwright

---

## 📁 Estrutura de Arquivos

```
src/
  features/
    assessments/
      components/
        AssessmentForm.tsx
        AssessmentForm.test.tsx    # Teste junto do componente
      hooks/
        useAssessment.ts
        useAssessment.test.ts
      utils/
        calculations.ts
        calculations.test.ts

tests/
  e2e/
    assessment-flow.spec.ts        # Testes E2E
  fixtures/
    assessment.fixture.ts          # Dados de teste
  mocks/
    supabase.mock.ts              # Mocks de serviços
```

---

## 🧩 Padrões e Convenções

### 1. Stack de Testes

| Tipo | Ferramenta | Uso |
|------|------------|-----|
| Unit | Vitest | Funções, hooks, utils |
| Component | Vitest + Testing Library | Componentes React |
| E2E | Playwright | Fluxos completos |

### 2. Nomenclatura

```ts
// Arquivo: {nome}.test.ts ou {nome}.spec.ts
// Describe: nome da função/componente
// It: "should" + comportamento esperado

describe('calculateBodyFat', () => {
  it('should return correct percentage for male athlete', () => {})
  it('should throw error for invalid measurements', () => {})
  it('should handle edge case of zero values', () => {})
})
```

### 3. Teste Unitário

```ts
// utils/calculations.test.ts

import { describe, it, expect } from 'vitest'
import { calculateBodyFat, calculateBMI } from './calculations'

describe('calculateBodyFat', () => {
  it('should calculate body fat for male using 7-fold method', () => {
    const measurements = {
      triceps: 10,
      subscapular: 12,
      suprailiac: 15,
      abdominal: 20,
      thigh: 18,
      chest: 8,
      midaxillary: 10
    }
    
    const result = calculateBodyFat(measurements, 25, 'M')
    
    expect(result).toBeCloseTo(15.2, 1)
  })

  it('should throw error for negative values', () => {
    const measurements = { triceps: -5, /* ... */ }
    
    expect(() => calculateBodyFat(measurements, 25, 'M'))
      .toThrow('Measurements cannot be negative')
  })
})

describe('calculateBMI', () => {
  it('should calculate BMI correctly', () => {
    expect(calculateBMI(70, 1.75)).toBeCloseTo(22.86, 2)
  })

  it('should handle metric and imperial units', () => {
    expect(calculateBMI(154, 69, 'imperial')).toBeCloseTo(22.74, 2)
  })
})
```

### 4. Teste de Hook

```ts
// hooks/useAssessment.test.ts

import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAssessment } from './useAssessment'
import { supabase } from '@/lib/supabase'

// Mock do Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}))

describe('useAssessment', () => {
  it('should fetch assessment by id', async () => {
    const mockAssessment = { id: '123', athlete_id: '456' }
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockAssessment, error: null })
        })
      })
    } as any)

    const { result } = renderHook(() => useAssessment())
    
    await result.current.fetch('123')
    
    await waitFor(() => {
      expect(result.current.assessment).toEqual(mockAssessment)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should handle fetch error', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ 
            data: null, 
            error: { message: 'Not found' } 
          })
        })
      })
    } as any)

    const { result } = renderHook(() => useAssessment())
    
    await result.current.fetch('invalid-id')
    
    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.assessment).toBeNull()
    })
  })
})
```

### 5. Teste de Componente

```tsx
// components/AssessmentCard.test.tsx

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AssessmentCard } from './AssessmentCard'

const mockAssessment = {
  id: '123',
  athlete_name: 'João Silva',
  assessment_date: '2026-02-26',
  status: 'completed'
}

describe('AssessmentCard', () => {
  it('should render assessment information', () => {
    render(<AssessmentCard assessment={mockAssessment} />)
    
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('26/02/2026')).toBeInTheDocument()
    expect(screen.getByText('Completa')).toBeInTheDocument()
  })

  it('should call onSelect when clicked', () => {
    const onSelect = vi.fn()
    
    render(<AssessmentCard assessment={mockAssessment} onSelect={onSelect} />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(onSelect).toHaveBeenCalledWith('123')
  })

  it('should show draft badge for draft assessments', () => {
    const draftAssessment = { ...mockAssessment, status: 'draft' }
    
    render(<AssessmentCard assessment={draftAssessment} />)
    
    expect(screen.getByText('Rascunho')).toBeInTheDocument()
  })
})
```

### 6. Teste E2E

```ts
// tests/e2e/assessment-flow.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Assessment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'trainer@test.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should create new assessment', async ({ page }) => {
    // Navegar para atleta
    await page.click('text=João Silva')
    await page.click('text=Nova Avaliação')
    
    // Preencher formulário
    await page.fill('[name="weight"]', '75')
    await page.fill('[name="height"]', '175')
    await page.fill('[name="triceps"]', '10')
    // ... outros campos
    
    // Submeter
    await page.click('text=Salvar Avaliação')
    
    // Verificar sucesso
    await expect(page.locator('text=Avaliação salva')).toBeVisible()
    await expect(page).toHaveURL(/\/assessments\//)
  })

  test('should show validation errors for invalid data', async ({ page }) => {
    await page.click('text=João Silva')
    await page.click('text=Nova Avaliação')
    
    // Tentar submeter sem dados
    await page.click('text=Salvar Avaliação')
    
    // Verificar erros
    await expect(page.locator('text=Peso é obrigatório')).toBeVisible()
    await expect(page.locator('text=Altura é obrigatória')).toBeVisible()
  })
})
```

### 7. Fixtures e Mocks

```ts
// tests/fixtures/assessment.fixture.ts

import type { Assessment, Measurement } from '@/types'

export const createMockAssessment = (overrides?: Partial<Assessment>): Assessment => ({
  id: 'test-assessment-id',
  athlete_id: 'test-athlete-id',
  trainer_id: 'test-trainer-id',
  assessment_date: '2026-02-26',
  status: 'completed',
  notes: null,
  created_at: '2026-02-26T10:00:00Z',
  updated_at: '2026-02-26T10:00:00Z',
  deleted_at: null,
  ...overrides
})

export const createMockMeasurements = (overrides?: Partial<Measurement>): Measurement => ({
  id: 'test-measurement-id',
  assessment_id: 'test-assessment-id',
  weight: 75,
  height: 175,
  triceps: 10,
  subscapular: 12,
  // ...
  ...overrides
})
```

---

## 📊 Cobertura

### Mínimos Recomendados

| Tipo | Cobertura Mínima |
|------|------------------|
| Utils/Calculations | 90% |
| Hooks | 80% |
| Components | 70% |
| Services | 80% |

### Comando

```bash
npm run test:coverage
```

---

## ✅ Checklist

Antes de finalizar trabalho com testes:

- [ ] Testes cobrem happy path?
- [ ] Testes cobrem edge cases?
- [ ] Testes cobrem erros esperados?
- [ ] Mocks são limpos entre testes?
- [ ] Fixtures são reutilizáveis?
- [ ] Nomenclatura segue padrão "should..."?
- [ ] Testes são independentes entre si?
- [ ] Cobertura mínima atingida?

---

## 📝 Notas de Aprendizado

<!-- Padrões descobertos serão adicionados aqui -->

---

## 🔗 Referências

- Vitest: https://vitest.dev/
- Testing Library: https://testing-library.com/
- Playwright: https://playwright.dev/