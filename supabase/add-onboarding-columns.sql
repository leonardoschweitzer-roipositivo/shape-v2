-- Adicionar colunas de onboarding na tabela fichas
-- Suporta o wizard de primeira vez do Portal do Aluno

-- Flag que indica se o aluno completou o onboarding
ALTER TABLE public.fichas
ADD COLUMN IF NOT EXISTS onboarding_completo boolean DEFAULT false;

-- Método de medidas escolhido pelo aluno no onboarding
-- Valores: 'PERSONAL' | 'IA_FOTOS' | 'BASICO' | NULL (não preencheu ainda)
ALTER TABLE public.fichas
ADD COLUMN IF NOT EXISTS metodo_medidas text;

-- Nível de atividade física do aluno (útil para cálculo TMB/TDEE)
-- Valores: 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | NULL
ALTER TABLE public.fichas
ADD COLUMN IF NOT EXISTS nivel_atividade text;

-- Comentário informativo
COMMENT ON COLUMN public.fichas.onboarding_completo IS 'Se o aluno completou o wizard de primeiro acesso no Portal';
COMMENT ON COLUMN public.fichas.metodo_medidas IS 'Método de medidas escolhido: PERSONAL, IA_FOTOS, BASICO';
COMMENT ON COLUMN public.fichas.nivel_atividade IS 'Nível de atividade física: SEDENTARIO, LEVE, MODERADO, INTENSO';
