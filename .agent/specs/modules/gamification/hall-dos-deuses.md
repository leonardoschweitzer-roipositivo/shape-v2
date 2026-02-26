# Hall dos Deuses - Especificação

**Versão:** 1.0  
**Data:** 07/02/2026  
**Feature:** Sistema de Rankings e Comparação Social

---

## 1. Visão Geral

O **Hall dos Deuses** é um módulo de gamificação e engajamento que permite aos usuários compararem-se com outros nas principais métricas do físico clássico. O objetivo é estimular competição saudável, motivação contínua e senso de comunidade.

---

## 2. Rankings Disponíveis

### 2.1 Rankings Principais

#### 2.1.1 Ranking Geral
- **Métrica:** Nota geral (0-100 pontos)
- **Descrição:** Os físicos mais completos e harmônicos da plataforma
- **Ordenação:** Score total da avaliação (descendente)
- **Color Scheme:** Golden (dourado)
- **Ícone:** Trophy

#### 2.1.2 Ranking Shape-V
- **Métrica:** Ratio ombros/cintura
- **Descrição:** Os V-Tapers mais impressionantes - ombros largos e cintura fina
- **Ordenação:** Valor do Shape-V Ratio (descendente, 1.618 = ideal)
- **Color Scheme:** Teal
- **Ícone:** Target

#### 2.1.3 Ranking de Definição (Gordura Corporal)
- **Métrica:** Percentual de gordura corporal (%)
- **Descrição:** Os físicos mais secos e definidos
- **Ordenação:** Menor % de gordura (crescente)
- **Color Scheme:** Purple
- **Ícone:** Flame

#### 2.1.4 Mais Pesado Proporcional
- **Métrica:** Peso/Altura (kg/m)
- **Descrição:** Maior peso corporal ajustado pela altura - densidade máxima por frame
- **Ordenação:** Peso proporcional à altura (descendente)
- **Color Scheme:** Purple
- **Ícone:** Trophy

---

### 2.2 Rankings Especiais

#### 2.2.1 Trindade Clássica (Simetria de Ouro)
- **Métrica:** % de harmonia (0-100%)
- **Descrição:** Menor variação entre Pescoço, Braço e Panturrilha
- **Cálculo:**
  ```
  Média = (Pescoço + Braço + Panturrilha) / 3
  Desvios = [abs(medida - média) / média for medida in [Pescoço, Braço, Panturrilha]]
  Desvio Médio = sum(Desvios) / 3
  Harmonia % = (1 - Desvio Médio) × 100
  ```
- **Exemplo:** 95.9% de harmonia = excelente equilíbrio
- **Por que é bom:** Valoriza o equilíbrio em vez de apenas o tamanho bruto
- **Color Scheme:** Golden
- **Ícone:** Crown

#### 2.2.2 Mestre da Simetria (Lower Asymmetry)
- **Métrica:** % de simetria bilateral (0-100%)
- **Descrição:** Menor desequilíbrio L/R entre grupos musculares bilaterais
- **Cálculo:** Score geral de assimetria (quanto maior, mais simétrico)
- **Por que é bom:** Estimula o uso do Coach IA para corrigir pontos fracos
- **Color Scheme:** Teal
- **Ícone:** Award

#### 2.2.3 Índice de Densidade (FFMI - Fat-Free Mass Index)
- **Métrica:** FFMI (índice numérico)
- **Descrição:** Massa magra proporcional à altura
- **Cálculo:**
  ```
  Peso Magro = Peso × (1 - BF%/100)
  FFMI = (Peso Magro / Altura²) + 6.1 × (1.8 - Altura)
  
  Onde:
  - Peso em kg
  - Altura em metros
  - BF% = percentual de gordura corporal
  ```
- **Referências:**
  - 16-17: Abaixo da média
  - 18-19: Média
  - 20-21: Acima da média (natural training)
  - 22-23: Excelente (limit natural para muitos)
  - 24-25: Elite (limite natural superior)
  - 26+: Suspeita de uso de PEDs
- **Por que é bom:** Identifica quem tem mais volume real de músculo, independente de ser alto ou baixo
- **Color Scheme:** Green
- **Ícone:** Zap

#### 2.2.4 The Architect (Maior Evolução 90 dias)
- **Métrica:** % de convergência nos últimos 90 dias
- **Descrição:** Maior evolução em direção ao alvo selecionado (Golden Ratio, Classic Physique ou Men's Physique)
- **Cálculo:**
  ```
  Delta Score = Score Atual - Score Há 90 dias
  Convergência % = (Delta Score / Score Ideal) × 100
  ```
- **Por que é bom:** Dá chance para o iniciante brilhar, premiando o esforço e a constância
- **Color Scheme:** Green
- **Ícone:** TrendingUp

---

## 3. Interface do Usuário

### 3.1 Estrutura da Página

```
┌─────────────────────────────────────────────┐
│ Header                                       │
│ ┌──────┐ Hall dos Deuses                    │
│ │Trophy│ Compare-se com os melhores         │
│ └──────┘                                     │
├─────────────────────────────────────────────┤
│ Tabs: [Rankings Principais] [Especiais]     │
├─────────────────────────────────────────────┤
│ Grid 2 Colunas (Desktop) / 1 Col (Mobile)   │
│ ┌─────────────┐ ┌─────────────┐             │
│ │ Ranking 1   │ │ Ranking 2   │             │
│ │ Card        │ │ Card        │             │
│ └─────────────┘ └─────────────┘             │
│ ┌─────────────┐ ┌─────────────┐             │
│ │ Ranking 3   │ │ Ranking 4   │             │
│ └─────────────┘ └─────────────┘             │
├─────────────────────────────────────────────┤
│ Footer Info (Como funciona + Dica Pro)      │
└─────────────────────────────────────────────┘
```

### 3.2 Card de Ranking

Cada card contém:

**Header (com gradiente de cor temática):**
- Ícone temático (48x48px)
- Título do ranking
- Descrição curta

**Body:**
- Lista dos Top 10 usuários:
  - Posição (#1, #2, #3 com medalhas; #4+ com número)
  - Avatar/inicial do usuário
  - Nome
  - Badge especial (quando aplicável)
  - Valor da métrica
  - Variação % recente (com seta up/down)
  
**Footer:**
- Estatística pessoal: "Você está entre os top X% nesta categoria"

### 3.3 Destaque do Usuário

O usuário logado é destacado com:
- Background `bg-primary/10`
- Border `border-primary/30`
- Glow effect
- Tag "(Você)" ao lado do nome
- Texto em cor primary

### 3.4 Medalhas e Posições

| Posição | Visual | Cor | Badge |
|---------|--------|-----|-------|
| 1º | 🥇 Medal Icon | Golden (yellow-400) | Variable by ranking |
| 2º | 🥈 Medal Icon | Silver (gray-300) | - |
| 3º | 🥉 Medal Icon | Bronze (amber-700) | - |
| 4º+ | #N | Gray (gray-500) | - |

### 3.5 Badges Especiais

| Badge | Ranking | Critério |
|-------|---------|----------|
| **ELITE** | Nota Geral | Score ≥ 90 |
| **FREAK** | Shape-V | Ratio ≥ 1.618 |
| **SHREDDED** | Definição | BF% ≤ 9% |
| **MASS MONSTER** | FFMI | FFMI ≥ 24 |
| **HARMONIA** | Trindade Clássica | Harmonia ≥ 95% |
| **PERFEITO** | Mestre Simetria | Simetria ≥ 98% |
| **HEAVYWEIGHT** | Peso Proporcional | Peso/Altura ≥ 50 |
| **ON FIRE** | The Architect | Evolução ≥ 15% |

---

## 4. Color Schemes

| Scheme | Primary | Border | Glow | Uso |
|--------|---------|--------|------|-----|
| **Golden** | `yellow-400` | `yellow-500/30` | `rgba(234,179,8,0.2)` | Nota Geral, Trindade Clássica |
| **Teal** | `primary` | `primary/30` | `rgba(0,201,167,0.2)` | Shape-V, Mestre Simetria |
| **Purple** | `secondary` | `secondary/30` | `rgba(124,58,237,0.2)` | Definição, Peso Proporcional |
| **Green** | `green-400` | `green-500/30` | `rgba(34,197,94,0.2)` | FFMI, The Architect |

---

## 5. Implementação Técnica

### 5.1 Tipos TypeScript

```typescript
type RankingType = 
  | 'nota-geral' 
  | 'shape-v' 
  | 'gordura' 
  | 'peso-proporcional'
  | 'trindade-classica'
  | 'mestre-simetria'
  | 'ffmi'
  | 'the-architect';

interface RankingUser {
  id: string;
  nome: string;
  avatar?: string;
  valor: number;
  variacao?: number;
  badge?: string;
}

interface RankingData {
  tipo: RankingType;
  titulo: string;
  descricao: string;
  icon: React.ElementType;
  metrica: string;
  usuarios: RankingUser[];
  colorScheme: 'golden' | 'teal' | 'purple' | 'green';
}
```

### 5.2 API Endpoints (Futuro)

```
GET /api/rankings/:tipo
  Query params:
    - limit: number (default: 10)
    - userId: string (opcional, para destacar posição)
  
  Response:
    {
      tipo: RankingType,
      titulo: string,
      usuarios: RankingUser[],
      userPosition: number | null
    }

GET /api/rankings/user/:userId
  Response:
    {
      rankings: {
        [key: RankingType]: {
          position: number,
          value: number,
          percentile: number
        }
      }
    }
```

---

## 6. Regras de Negócio

1. **Atualização:** Rankings são atualizados diariamente às 00:00 UTC
2. **Elegibilidade:** Usuário precisa ter no mínimo 1 avaliação completa nos últimos 90 dias
3. **Privacy:** Usuários podem optar por ocultar seu nome nos rankings (aparecem como "Anônimo #ID")
4. **Filtros:** Futuramente, permitir filtrar por:
   - Faixa etária
   - Categoria de competição
   - Região/país
5. **Múltiplos Perfis:** Personal/Academia veem rankings agregados de seus alunos

---

## 7. Gamificação Futura

### 7.1 Achievements
- "Subiu 10 posições em 1 semana"
- "Top 10 em 3 categorias simultaneamente"
- "Manteve Top 5 por 30 dias consecutivos"

### 7.2 Notificações
- "Você subiu para #5 no Ranking Shape-V!"
- "Você está a 0.02 ratio de alcançar o Top 3"
- "Um usuário te ultrapassou no Ranking Geral"

### 7.3 Histórico
- Gráfico de evolução da posição ao longo do tempo
- "Melhor posição alcançada: #2 em 15/01/2026"

---

## 8. Mobile Responsiveness

- **Desktop (≥1024px):** Grid 2 colunas
- **Tablet (768-1023px):** Grid 2 colunas (cards menores)
- **Mobile (<768px):** Grid 1 coluna (scroll vertical)

Cards mantêm mesma estrutura, com ajuste de padding e font sizes.

---

**Implementação:** v1.0 - Protótipo funcional com dados mock  
**Próximos Passos:** Integração com backend, dados reais, filtros, privacy settings
