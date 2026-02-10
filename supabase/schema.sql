-- =============================================
-- VITRU IA - Schema Completo do Banco de Dados
-- =============================================
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- Ordem de criação respeita as dependências (FK)
-- =============================================

-- ===== ENUMS =====
DO $$ BEGIN
    CREATE TYPE status_tipo AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE', 'SUSPENSO', 'TRIAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE sexo_tipo AS ENUM ('M', 'F');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE plano_academia_tipo AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE plano_personal_tipo AS ENUM ('FREE', 'PRO', 'UNLIMITED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE objetivo_tipo AS ENUM ('HIPERTROFIA', 'DEFINICAO', 'RECOMPOSICAO', 'COMPETICAO', 'SAUDE', 'EMAGRECIMENTO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE classificacao_tipo AS ENUM ('INICIO', 'CAMINHO', 'QUASE_LA', 'META', 'ELITE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE registro_tipo AS ENUM ('REFEICAO', 'TREINO', 'AGUA', 'SONO', 'DOR', 'PESO', 'SUPLEMENTO', 'OUTRO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE consultoria_tipo AS ENUM ('DIAGNOSTICO', 'TREINO', 'DIETA', 'CHAT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE origem_tipo AS ENUM ('PORTAL', 'COACH_IA', 'PERSONAL', 'APP');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ===== TABELAS =====

-- 1. ACADEMIAS (sem dependências)
CREATE TABLE IF NOT EXISTS academias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    razao_social TEXT,
    cnpj TEXT UNIQUE,
    email TEXT NOT NULL,
    telefone TEXT,
    endereco_rua TEXT,
    endereco_numero TEXT,
    endereco_complemento TEXT,
    endereco_bairro TEXT,
    endereco_cidade TEXT,
    endereco_estado TEXT,
    endereco_cep TEXT,
    plano plano_academia_tipo DEFAULT 'BASIC',
    limite_personais INTEGER DEFAULT 5,
    limite_atletas INTEGER DEFAULT 50,
    logo_url TEXT,
    status status_tipo DEFAULT 'ATIVO',
    data_vencimento TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PERSONAIS (depende de academias)
CREATE TABLE IF NOT EXISTS personais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    academia_id UUID REFERENCES academias(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    cpf TEXT,
    cref TEXT,
    foto_url TEXT,
    plano plano_personal_tipo DEFAULT 'FREE',
    limite_atletas INTEGER DEFAULT 10,
    status status_tipo DEFAULT 'ATIVO',
    data_vinculo TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ATLETAS (depende de personais e academias)
CREATE TABLE IF NOT EXISTS atletas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    personal_id UUID NOT NULL REFERENCES personais(id) ON DELETE CASCADE,
    academia_id UUID REFERENCES academias(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    foto_url TEXT,
    portal_token TEXT,
    portal_token_expira TIMESTAMPTZ,
    portal_acessos INTEGER DEFAULT 0,
    portal_ultimo_acesso TIMESTAMPTZ,
    status status_tipo DEFAULT 'ATIVO',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FICHAS (depende de atletas) 
CREATE TABLE IF NOT EXISTS fichas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE UNIQUE,
    data_nascimento DATE,
    sexo sexo_tipo NOT NULL,
    altura NUMERIC(5,1),
    punho NUMERIC(4,1),
    tornozelo NUMERIC(4,1),
    joelho NUMERIC(4,1),
    pelve NUMERIC(5,1),
    objetivo objetivo_tipo DEFAULT 'HIPERTROFIA',
    categoria_preferida TEXT,
    observacoes TEXT,
    restricoes TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MEDIDAS (depende de atletas)
CREATE TABLE IF NOT EXISTS medidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
    data DATE DEFAULT CURRENT_DATE,
    peso NUMERIC(5,1),
    gordura_corporal NUMERIC(4,1),
    ombros NUMERIC(5,1),
    peitoral NUMERIC(5,1),
    cintura NUMERIC(5,1),
    quadril NUMERIC(5,1),
    abdomen NUMERIC(5,1),
    braco_esquerdo NUMERIC(4,1),
    braco_direito NUMERIC(4,1),
    antebraco_esquerdo NUMERIC(4,1),
    antebraco_direito NUMERIC(4,1),
    coxa_esquerda NUMERIC(5,1),
    coxa_direita NUMERIC(5,1),
    panturrilha_esquerda NUMERIC(4,1),
    panturrilha_direita NUMERIC(4,1),
    pescoco NUMERIC(4,1),
    registrado_por origem_tipo DEFAULT 'PERSONAL',
    personal_id UUID REFERENCES personais(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AVALIAÇÕES (depende de atletas e medidas)
CREATE TABLE IF NOT EXISTS avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
    medidas_id UUID NOT NULL REFERENCES medidas(id) ON DELETE CASCADE,
    data DATE DEFAULT CURRENT_DATE,
    peso NUMERIC(5,1),
    gordura_corporal NUMERIC(4,1),
    massa_magra NUMERIC(5,1),
    massa_gorda NUMERIC(5,1),
    imc NUMERIC(4,1),
    ffmi NUMERIC(4,1),
    score_geral NUMERIC(5,1),
    classificacao_geral classificacao_tipo,
    proporcoes JSONB,
    simetria JSONB,
    comparacao_anterior JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REGISTROS DIÁRIOS (depende de atletas)
CREATE TABLE IF NOT EXISTS registros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
    data DATE DEFAULT CURRENT_DATE,
    tipo registro_tipo NOT NULL,
    dados JSONB NOT NULL,
    origem origem_tipo DEFAULT 'APP',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONSULTORIAS IA (depende de atletas)
CREATE TABLE IF NOT EXISTS consultorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    atleta_id UUID NOT NULL REFERENCES atletas(id) ON DELETE CASCADE,
    tipo consultoria_tipo NOT NULL,
    contexto JSONB,
    prompt TEXT NOT NULL,
    resposta TEXT NOT NULL,
    tokens_usados INTEGER,
    modelo TEXT,
    data TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== ÍNDICES =====

CREATE INDEX IF NOT EXISTS idx_personais_academia ON personais(academia_id);
CREATE INDEX IF NOT EXISTS idx_personais_auth_user ON personais(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_atletas_personal ON atletas(personal_id);
CREATE INDEX IF NOT EXISTS idx_atletas_academia ON atletas(academia_id);
CREATE INDEX IF NOT EXISTS idx_atletas_auth_user ON atletas(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_fichas_atleta ON fichas(atleta_id);
CREATE INDEX IF NOT EXISTS idx_medidas_atleta ON medidas(atleta_id);
CREATE INDEX IF NOT EXISTS idx_medidas_data ON medidas(atleta_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_atleta ON avaliacoes(atleta_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_data ON avaliacoes(atleta_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_registros_atleta ON registros(atleta_id);
CREATE INDEX IF NOT EXISTS idx_registros_data ON registros(atleta_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_consultorias_atleta ON consultorias(atleta_id);

-- ===== VIEWS (KPIs) =====

CREATE OR REPLACE VIEW v_atletas_com_avaliacao AS
SELECT 
    a.id,
    a.nome,
    a.foto_url,
    a.personal_id,
    p.nome AS personal_nome,
    a.academia_id,
    a.status::TEXT,
    a.created_at,
    av.data AS ultima_avaliacao_data,
    av.score_geral,
    av.classificacao_geral::TEXT,
    av.peso,
    EXTRACT(DAY FROM NOW() - av.data::TIMESTAMP)::INTEGER AS dias_desde_avaliacao
FROM atletas a
LEFT JOIN personais p ON a.personal_id = p.id
LEFT JOIN LATERAL (
    SELECT * FROM avaliacoes 
    WHERE atleta_id = a.id 
    ORDER BY data DESC 
    LIMIT 1
) av ON TRUE;

CREATE OR REPLACE VIEW v_kpis_personal AS
SELECT 
    p.id AS personal_id,
    p.nome AS personal_nome,
    COUNT(a.id) AS total_atletas,
    COUNT(a.id) FILTER (WHERE a.status = 'ATIVO') AS atletas_ativos,
    COUNT(a.id) FILTER (WHERE a.status = 'INATIVO') AS atletas_inativos,
    AVG(av.score_geral) AS score_medio,
    COUNT(av.id) FILTER (WHERE av.data >= DATE_TRUNC('month', CURRENT_DATE)) AS avaliacoes_mes,
    COUNT(av.id) FILTER (WHERE av.classificacao_geral = 'ELITE') AS atletas_elite,
    COUNT(av.id) FILTER (WHERE av.classificacao_geral = 'META') AS atletas_meta,
    COUNT(av.id) FILTER (WHERE av.classificacao_geral = 'QUASE_LA') AS atletas_quase_la,
    COUNT(av.id) FILTER (WHERE av.classificacao_geral = 'CAMINHO') AS atletas_caminho,
    COUNT(av.id) FILTER (WHERE av.classificacao_geral = 'INICIO') AS atletas_inicio
FROM personais p
LEFT JOIN atletas a ON a.personal_id = p.id
LEFT JOIN LATERAL (
    SELECT * FROM avaliacoes 
    WHERE atleta_id = a.id 
    ORDER BY data DESC 
    LIMIT 1
) av ON TRUE
GROUP BY p.id, p.nome;

CREATE OR REPLACE VIEW v_kpis_academia AS
SELECT
    ac.id AS academia_id,
    ac.nome AS academia_nome,
    COUNT(DISTINCT p.id) AS total_personais,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'ATIVO') AS personais_ativos,
    COUNT(DISTINCT a.id) AS total_atletas,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'ATIVO') AS atletas_ativos,
    AVG(av.score_geral) AS score_medio,
    COUNT(av.id) FILTER (WHERE av.data >= DATE_TRUNC('month', CURRENT_DATE)) AS avaliacoes_mes
FROM academias ac
LEFT JOIN personais p ON p.academia_id = ac.id
LEFT JOIN atletas a ON a.personal_id = p.id
LEFT JOIN LATERAL (
    SELECT * FROM avaliacoes
    WHERE atleta_id = a.id
    ORDER BY data DESC
    LIMIT 1
) av ON TRUE
GROUP BY ac.id, ac.nome;

-- ===== ROW LEVEL SECURITY (RLS) =====

-- Habilitar RLS em todas as tabelas
ALTER TABLE academias ENABLE ROW LEVEL SECURITY;
ALTER TABLE personais ENABLE ROW LEVEL SECURITY;
ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichas ENABLE ROW LEVEL SECURITY;
ALTER TABLE medidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultorias ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (PERMISSIVAS para início - depois refinamos)

-- Academias: proprietário pode tudo
CREATE POLICY "academia_own" ON academias FOR ALL
    USING (auth.uid() = auth_user_id);

-- Personais: proprietário pode tudo
CREATE POLICY "personal_own" ON personais FOR ALL
    USING (auth.uid() = auth_user_id);

-- Atletas: personal do atleta pode tudo
CREATE POLICY "atleta_personal" ON atletas FOR ALL
    USING (
        personal_id IN (
            SELECT id FROM personais WHERE auth_user_id = auth.uid()
        )
    );

-- Atleta pode ver seus próprios dados
CREATE POLICY "atleta_own" ON atletas FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Fichas: seguem mesma lógica de atletas
CREATE POLICY "ficha_personal" ON fichas FOR ALL
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE personal_id IN (
                SELECT id FROM personais WHERE auth_user_id = auth.uid()
            )
        )
    );

CREATE POLICY "ficha_atleta" ON fichas FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- Medidas: personal e atleta
CREATE POLICY "medida_personal" ON medidas FOR ALL
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE personal_id IN (
                SELECT id FROM personais WHERE auth_user_id = auth.uid()
            )
        )
    );

CREATE POLICY "medida_atleta" ON medidas FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- Avaliações
CREATE POLICY "avaliacao_personal" ON avaliacoes FOR ALL
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE personal_id IN (
                SELECT id FROM personais WHERE auth_user_id = auth.uid()
            )
        )
    );

CREATE POLICY "avaliacao_atleta" ON avaliacoes FOR SELECT
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- Registros
CREATE POLICY "registro_atleta" ON registros FOR ALL
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- Consultorias
CREATE POLICY "consultoria_atleta" ON consultorias FOR ALL
    USING (
        atleta_id IN (
            SELECT id FROM atletas WHERE auth_user_id = auth.uid()
        )
    );

-- ===== PROFILES (já deve existir, mas por segurança) =====
-- A tabela profiles já foi criada na configuração de Auth
-- Apenas garantimos a policy
DO $$ BEGIN
    DROP POLICY IF EXISTS "profiles_own" ON profiles;
    CREATE POLICY "profiles_own" ON profiles FOR ALL
        USING (auth.uid() = id);
EXCEPTION WHEN undefined_table THEN
    RAISE NOTICE 'Tabela profiles não encontrada, pulando policy.';
END $$;

-- ===== TRIGGERS =====

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas com updated_at
DO $$ 
DECLARE 
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY['academias', 'personais', 'atletas', 'fichas']
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trigger_updated_at ON %I;
            CREATE TRIGGER trigger_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at();
        ', t, t);
    END LOOP;
END $$;

-- ===== PRONTO! =====
-- Todas as tabelas, índices, views, RLS e triggers criados.
-- Próximo passo: inserir dados de seed (opcional para desenvolvimento).
