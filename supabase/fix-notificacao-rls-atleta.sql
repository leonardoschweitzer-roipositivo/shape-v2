-- =============================================
-- VITRU IA - Fix RLS para Notificações do Atleta
-- =============================================
-- O Portal do Atleta precisa INSERIR notificações
-- para o Personal (ex: feedback, registro rápido).
-- A policy original só permitia o Personal inserir.
-- =============================================
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Permitir que o ATLETA insira notificações referentes a si mesmo
--    (atleta_id deve pertencer ao usuário autenticado)
CREATE POLICY "notificacao_atleta_insert" ON notificacoes FOR INSERT
    WITH CHECK (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- 2. Permitir que o ATLETA leia notificações onde ele é o atleta_id
--    (necessário para a deduplicação por grupo_id no service)
CREATE POLICY "notificacao_atleta_select" ON notificacoes FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- ===== PRONTO! =====
-- Agora o Portal do Atleta pode criar notificações para o Personal.
