-- ============================================================
-- Migration: Criar tabela comentarios_notificacao
-- Permite ao Personal responder/comentar notificações recebidas.
-- ============================================================

-- 1. Tabela de comentários
CREATE TABLE IF NOT EXISTS public.comentarios_notificacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notificacao_id UUID NOT NULL REFERENCES public.notificacoes(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL,
    autor_tipo TEXT NOT NULL CHECK (autor_tipo IN ('personal', 'atleta')),
    mensagem TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índices
CREATE INDEX idx_comentarios_notificacao_id ON public.comentarios_notificacao(notificacao_id);
CREATE INDEX idx_comentarios_autor ON public.comentarios_notificacao(autor_id);

-- 3. RLS (Row Level Security)
ALTER TABLE public.comentarios_notificacao ENABLE ROW LEVEL SECURITY;

-- Personal pode criar e ler comentários das suas notificações
CREATE POLICY "Personal pode ler comentários das suas notificações" ON public.comentarios_notificacao
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.notificacoes n
            WHERE n.id = notificacao_id
            AND n.personal_id = auth.uid()
        )
        OR autor_id = auth.uid()
    );

CREATE POLICY "Personal pode criar comentários" ON public.comentarios_notificacao
    FOR INSERT WITH CHECK (
        autor_id = auth.uid()
    );

CREATE POLICY "Autor pode deletar seus próprios comentários" ON public.comentarios_notificacao
    FOR DELETE USING (
        autor_id = auth.uid()
    );
