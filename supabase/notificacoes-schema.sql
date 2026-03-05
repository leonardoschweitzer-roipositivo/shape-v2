-- =============================================
-- VITRU IA - Schema de Notificações do Personal
-- =============================================
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =============================================

-- 0. LIMPAR TABELAS ANTERIORES (caso existam de tentativa anterior)
DROP TABLE IF EXISTS notificacao_config CASCADE;
DROP TABLE IF EXISTS notificacoes CASCADE;

-- 1. TABELA DE NOTIFICAÇÕES
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Destinatário
    personal_id UUID NOT NULL REFERENCES personais(id) ON DELETE CASCADE,

    -- Origem (aluno que gerou o evento)
    atleta_id UUID REFERENCES atletas(id) ON DELETE CASCADE,

    -- Conteúdo
    tipo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    prioridade TEXT NOT NULL DEFAULT 'normal',
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    dados JSONB,

    -- Estado
    lida BOOLEAN DEFAULT FALSE,
    lida_em TIMESTAMPTZ,

    -- Ação
    acao_url TEXT,
    acao_label TEXT,

    -- Agrupamento
    grupo_id TEXT,
    agrupada BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);

-- 2. TABELA DE CONFIGURAÇÕES DE NOTIFICAÇÃO
CREATE TABLE notificacao_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_id UUID NOT NULL REFERENCES personais(id) ON DELETE CASCADE UNIQUE,

    config JSONB NOT NULL DEFAULT '{
      "treino": { "ativo": true, "agrupar": true, "alertarPulados": true, "alertarInatividade": true },
      "medidas": { "ativo": true, "alertarRegressao": true, "alertarInatividade": true },
      "conquistas": { "ativo": true },
      "portal": { "ativo": true, "alertarInatividade": true, "notificarDor": true },
      "resumos": { "diario": false, "semanal": true, "mensal": true },
      "horarioInicio": "08:00",
      "horarioFim": "21:00",
      "canalPrincipal": "in_app"
    }',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ÍNDICES
CREATE INDEX idx_notificacoes_personal ON notificacoes(personal_id);
CREATE INDEX idx_notificacoes_atleta ON notificacoes(atleta_id);
CREATE INDEX idx_notificacoes_tipo ON notificacoes(tipo);
CREATE INDEX idx_notificacoes_lida ON notificacoes(personal_id, lida);
CREATE INDEX idx_notificacoes_created ON notificacoes(personal_id, created_at DESC);
CREATE INDEX idx_notificacoes_prioridade ON notificacoes(personal_id, prioridade);

-- 4. RLS
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacao_config ENABLE ROW LEVEL SECURITY;

-- Personal vê apenas suas notificações
CREATE POLICY "notificacao_personal_select" ON notificacoes FOR SELECT
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "notificacao_personal_insert" ON notificacoes FOR INSERT
    WITH CHECK (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "notificacao_personal_update" ON notificacoes FOR UPDATE
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

CREATE POLICY "notificacao_personal_delete" ON notificacoes FOR DELETE
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

-- Config: apenas do próprio personal
CREATE POLICY "notificacao_config_personal" ON notificacao_config FOR ALL
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

-- 5. TRIGGER UPDATED_AT para notificacao_config
CREATE TRIGGER trigger_notificacao_config_updated_at
    BEFORE UPDATE ON notificacao_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ===== PRONTO! =====
-- Tabelas notificacoes e notificacao_config criadas com índices, RLS e triggers.
