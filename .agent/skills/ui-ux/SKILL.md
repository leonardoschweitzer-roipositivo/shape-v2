# 🎯 UI/UX Skill

> Padrões de design e experiência do usuário do VITRU IA

---

## 🎯 Propósito

Consultar quando a tarefa envolver:
- Design de interfaces
- Sistema de cores e temas
- Componentes visuais
- Layout e espaçamento
- Acessibilidade

**Keywords**: design, tema, cores, layout, dark, visual, UI, UX, acessibilidade

---

## 🎨 Design System VITRU IA

### Identidade Visual

O VITRU IA usa um tema **dark premium** inspirado em:
- Proporção áurea (φ = 1.618)
- Estética fitness/saúde
- Visual clean e profissional

---

## 🎨 Cores

### Paleta Principal

```css
:root {
  /* Gold - Cor primária (destaque, CTAs, links) */
  --color-gold: #d4a853;
  --color-gold-light: #e8c97a;
  --color-gold-dark: #b8912e;
  
  /* Backgrounds */
  --color-bg: #0a0a0a;              /* Fundo principal */
  --color-surface: #111111;          /* Cards, modais */
  --color-surface-elevated: #1a1a1a; /* Elementos elevados */
  
  /* Borders */
  --color-border: #2a2a2a;
  --color-border-hover: #3a3a3a;
  
  /* Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #888888;
  --color-text-muted: #555555;
  
  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Uso das Cores

| Cor | Uso | Classe Tailwind |
|-----|-----|-----------------|
| Gold | CTAs, links, destaques | `text-gold`, `bg-gold` |
| Surface | Cards, containers | `bg-surface` |
| Border | Divisores, bordas | `border-border` |
| Text Primary | Títulos, texto principal | `text-white` |
| Text Secondary | Descrições, labels | `text-gray-400` |
| Text Muted | Placeholders, hints | `text-gray-600` |

---

## 📐 Espaçamento

### Escala (Base 4px)

```
4px   = p-1, m-1, gap-1
8px   = p-2, m-2, gap-2
12px  = p-3, m-3, gap-3
16px  = p-4, m-4, gap-4
24px  = p-6, m-6, gap-6
32px  = p-8, m-8, gap-8
48px  = p-12, m-12, gap-12
64px  = p-16, m-16, gap-16
```

### Regras de Espaçamento

| Contexto | Espaçamento |
|----------|-------------|
| Entre seções | `py-16` ou `py-24` |
| Padding de cards | `p-4` ou `p-6` |
| Gap em grids | `gap-4` ou `gap-6` |
| Entre form fields | `space-y-4` |
| Entre texto | `space-y-2` |

---

## 🔲 Border Radius

```css
--radius-sm: 4px;    /* rounded-sm - Badges, tags */
--radius-md: 8px;    /* rounded-md - Inputs, buttons */
--radius-lg: 12px;   /* rounded-lg - Cards */
--radius-xl: 16px;   /* rounded-xl - Modais, containers */
--radius-full: 9999px; /* rounded-full - Avatares, pills */
```

---

## 📝 Tipografia

### Font Family

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Escala de Tamanhos

| Uso | Classe | Tamanho |
|-----|--------|---------|
| Hero title | `text-4xl` ou `text-5xl` | 36-48px |
| Section title | `text-2xl` ou `text-3xl` | 24-30px |
| Card title | `text-lg` ou `text-xl` | 18-20px |
| Body text | `text-base` | 16px |
| Small text | `text-sm` | 14px |
| Caption | `text-xs` | 12px |

### Font Weight

| Uso | Classe |
|-----|--------|
| Títulos | `font-bold` (700) |
| Subtítulos | `font-semibold` (600) |
| Labels | `font-medium` (500) |
| Body | `font-normal` (400) |

---

## 🧩 Componentes

### Card Padrão

```tsx
<div className="bg-surface border border-border rounded-xl p-6">
  <h3 className="text-lg font-semibold mb-2">Título</h3>
  <p className="text-gray-400">Descrição</p>
</div>
```

### Button Primary

```tsx
<button className="
  bg-gold hover:bg-gold-light 
  text-black font-semibold 
  px-6 py-3 rounded-full
  transition-all duration-200
  hover:shadow-lg hover:shadow-gold/20
">
  Ação Principal
</button>
```

### Button Secondary

```tsx
<button className="
  bg-transparent border border-border
  text-white hover:text-gold hover:border-gold
  px-6 py-3 rounded-full
  transition-all duration-200
">
  Ação Secundária
</button>
```

### Input

```tsx
<input 
  className="
    w-full bg-surface border border-border rounded-lg
    px-4 py-3 text-white placeholder-gray-600
    focus:border-gold focus:ring-1 focus:ring-gold
    transition-colors duration-200
  "
  placeholder="Digite aqui..."
/>
```

### Badge/Tag

```tsx
// Neutro
<span className="px-2 py-1 bg-surface-elevated rounded text-xs text-gray-400">
  Tag
</span>

// Gold (destaque)
<span className="px-2 py-1 bg-gold/20 rounded text-xs text-gold">
  Destaque
</span>
```

---

## 📊 Visualizações de Dados

### Gauge de Proporção

```tsx
interface ProportionGaugeProps {
  label: string
  current: number
  ideal: number
  tolerance?: number
}

// Visual:
// [====|====●====|====]
//      ^ideal   ^current
// Verde se dentro da tolerância, amarelo/vermelho se fora
```

### Progress Bar

```tsx
<div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
  <div 
    className="h-full bg-gold rounded-full transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Metric Card

```tsx
<div className="bg-surface border border-border rounded-xl p-4">
  <p className="text-xs text-gray-500 uppercase tracking-wide">Label</p>
  <p className="text-2xl font-bold text-white mt-1">42.5%</p>
  <p className="text-sm text-success mt-1">↑ 2.3% vs anterior</p>
</div>
```

---

## ♿ Acessibilidade

### Contraste

- Texto principal sobre fundo: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Gold (#d4a853) sobre preto: ✅ 8.5:1

### Focus States

```tsx
// SEMPRE incluir focus visible
className="... focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
```

### ARIA Labels

```tsx
<button aria-label="Fechar modal">
  <XIcon />
</button>

<input 
  aria-label="Peso em quilogramas"
  aria-describedby="peso-hint"
/>
<span id="peso-hint" className="text-xs text-gray-500">
  Digite o peso em kg
</span>
```

---

## ✅ Checklist

Antes de finalizar trabalho de UI:

- [ ] Cores usando tokens (não hardcoded)?
- [ ] Espaçamento seguindo escala de 4px?
- [ ] Tipografia consistente?
- [ ] Border radius padrão?
- [ ] Hover states em elementos interativos?
- [ ] Focus states visíveis?
- [ ] Contraste adequado?
- [ ] Dark theme consistente?

---

## 📝 Notas de Aprendizado

<!-- Padrões descobertos serão adicionados aqui -->

### ProportionGauge Component

Componente para visualizar proporções áureas com indicador de zona ideal.
Ver `memory/patterns-learned.md`.

---

## 🔗 Referências

- Design System completo: `specs/design/design-system.md`
- Tailwind CSS: https://tailwindcss.com/docs
- Radix UI (primitivos): https://www.radix-ui.com/