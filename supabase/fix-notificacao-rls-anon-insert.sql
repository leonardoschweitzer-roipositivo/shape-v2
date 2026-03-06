-- =============================================
-- VITRU IA - Fix RLS para Notificações via Token (Anon)
-- =============================================
-- O Portal do Atleta acessa via TOKEN (sem sessão Supabase Auth).
-- As policies originais exigiam auth.uid(), bloqueando INSERT
-- no mobile (onde não há sessão auth do Personal).
--
-- Este fix permite INSERT/SELECT anônimo na tabela notificacoes
-- desde que o atleta_id seja válido.
-- =============================================
-- Executado em: 2026-03-06
-- =============================================

-- 1. Permitir INSERT anônimo (Portal do Atleta via token)
CREATE POLICY "notificacao_anon_insert" ON notificacoes FOR INSERT
    WITH CHECK (
        atleta_id IS NOT NULL
        AND atleta_id IN (SELECT id FROM atletas)
    );

-- 2. Permitir SELECT anônimo (necessário para deduplicação por grupo_id)
CREATE POLICY "notificacao_anon_select" ON notificacoes FOR SELECT
    USING (
        atleta_id IS NOT NULL
        AND atleta_id IN (SELECT id FROM atletas)
    );

-- ===== PRONTO! =====
-- Agora o Portal do Atleta via token pode criar notificações para o Personal.
