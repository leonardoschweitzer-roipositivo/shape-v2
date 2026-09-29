-- =============================================
-- VITRU IA — FASE 1: Conta do Personal (onboarding + plano/limite)
-- =============================================
-- Rodar DEPOIS das migrations da Fase 0 (usa app_is_admin_ctx). Idempotente.
--
-- ─── PRÉ-CHECK ──────────────────────────────────────────────────────────────
--   SELECT plano, limite_atletas, count(*) FROM personais GROUP BY 1, 2 ORDER BY 1, 2;
--   (personais com limite diferente do padrão do plano ficam como estão — o sync só
--    age quando o plano muda)
--
-- ─── UPGRADE MANUAL DE PLANO (sem pagamento) ────────────────────────────────
--   UPDATE personais SET plano = 'PRO' WHERE email = 'fulano@x.com';
--   → limite_atletas vira 50 automaticamente (FREE 10 · PRO 50 · UNLIMITED ilimitado).
--   Limite customizado: UPDATE personais SET plano='PRO', limite_atletas=80 WHERE ...
-- =============================================

-- 1. Dados profissionais + flag de onboarding
ALTER TABLE personais ADD COLUMN IF NOT EXISTS cidade              text;
ALTER TABLE personais ADD COLUMN IF NOT EXISTS estado              char(2);
ALTER TABLE personais ADD COLUMN IF NOT EXISTS especialidades      text[] NOT NULL DEFAULT '{}';
ALTER TABLE personais ADD COLUMN IF NOT EXISTS bio                 text;
ALTER TABLE personais ADD COLUMN IF NOT EXISTS onboarding_completo boolean NOT NULL DEFAULT false;

-- Backfill: quem já existia antes desta migration não passa pelo onboarding.
-- (Roda uma vez só: marca a migração numa tabela de controle.)
CREATE TABLE IF NOT EXISTS public.app_migracoes_aplicadas (
    nome        text PRIMARY KEY,
    aplicada_em timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.app_migracoes_aplicadas ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.app_migracoes_aplicadas WHERE nome = 'fase1_backfill_onboarding') THEN
        UPDATE personais SET onboarding_completo = true WHERE onboarding_completo = false;
        INSERT INTO public.app_migracoes_aplicadas (nome) VALUES ('fase1_backfill_onboarding');
    END IF;
END $$;

-- 2. UNLIMITED = sem limite (NULL)
UPDATE personais SET limite_atletas = NULL
WHERE plano = 'UNLIMITED' AND limite_atletas IS NOT NULL;

-- 3. Ao mudar o plano, ajusta o limite (se o limite não foi informado junto)
CREATE OR REPLACE FUNCTION public.trg_personais_sync_limite()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.plano IS DISTINCT FROM OLD.plano
       AND NEW.limite_atletas IS NOT DISTINCT FROM OLD.limite_atletas THEN
        NEW.limite_atletas := CASE NEW.plano
            WHEN 'FREE' THEN 10
            WHEN 'PRO'  THEN 50
            ELSE NULL                       -- UNLIMITED
        END;
    END IF;
    RETURN NEW;
END;
$$;

-- Nome começa com "a_" para rodar ANTES de trg_personais_proteger_campos (ordem alfabética):
-- a proteção continua valendo porque compara NEW x OLD depois do ajuste.
DROP TRIGGER IF EXISTS a_trg_personais_sync_limite ON personais;
CREATE TRIGGER a_trg_personais_sync_limite
    BEFORE UPDATE OF plano ON personais
    FOR EACH ROW EXECUTE FUNCTION public.trg_personais_sync_limite();

-- 4. Validação leve de UF
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'personais_estado_uf_chk') THEN
        ALTER TABLE personais ADD CONSTRAINT personais_estado_uf_chk
            CHECK (estado IS NULL OR estado ~ '^[A-Z]{2}$');
    END IF;
END $$;

SELECT '✅ Fase 1 aplicada: onboarding do personal + sync de limite por plano' AS status;
