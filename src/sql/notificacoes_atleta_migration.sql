-- ═══════════════════════════════════════════════════════════
-- MIGRATION: Notificações no Portal do Aluno
-- Data: 2026-03-10
-- Descrição: Adiciona coluna 'destinatario' e RLS policies
--            para permitir notificações bidirecionais (Personal ↔ Aluno)
-- ═══════════════════════════════════════════════════════════

-- 1. Nova coluna 'destinatario'
ALTER TABLE notificacoes
ADD COLUMN IF NOT EXISTS destinatario TEXT NOT NULL DEFAULT 'personal'
CHECK (destinatario IN ('personal', 'atleta'));

-- 2. Índice para busca eficiente por destinatário + atleta
CREATE INDEX IF NOT EXISTS idx_notificacoes_destinatario_atleta
ON notificacoes (destinatario, atleta_id)
WHERE destinatario = 'atleta';

-- 3. RLS Policy: Atleta pode VER suas notificações (acesso anônimo via token)
CREATE POLICY "atleta_notificacao_select"
ON notificacoes FOR SELECT
USING (
    destinatario = 'atleta'
    AND atleta_id IS NOT NULL
    AND atleta_id IN (SELECT id FROM atletas)
);

-- 4. RLS Policy: Atleta pode ATUALIZAR lida/lida_em (acesso anônimo)
CREATE POLICY "atleta_notificacao_update_lida"
ON notificacoes FOR UPDATE
USING (
    destinatario = 'atleta'
    AND atleta_id IS NOT NULL
)
WITH CHECK (
    destinatario = 'atleta'
    AND atleta_id IS NOT NULL
);

-- 5. RLS Policy: Atleta pode inserir comentários nas notificações
-- (Necessário se a policy existente no comentarios_notificacao não cobrir acesso anônimo)
CREATE POLICY "atleta_comentario_insert"
ON comentarios_notificacao FOR INSERT
WITH CHECK (
    autor_tipo = 'atleta'
    AND autor_id IS NOT NULL
    AND autor_id IN (SELECT id FROM atletas)
);

CREATE POLICY "atleta_comentario_select"
ON comentarios_notificacao FOR SELECT
USING (
    notificacao_id IN (
        SELECT id FROM notificacoes
        WHERE atleta_id IS NOT NULL
        AND atleta_id IN (SELECT id FROM atletas)
    )
);
