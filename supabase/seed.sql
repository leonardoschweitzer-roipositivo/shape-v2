-- =============================================
-- VITRU IA - Seed Data para Desenvolvimento
-- =============================================
-- Este script insere dados de teste vinculados ao
-- primeiro Personal encontrado no banco.
-- Execute DEPOIS do auto-provisioning.sql
-- =============================================

-- Usar o primeiro personal existente
DO $$
DECLARE
    v_personal_id UUID;
    v_academia_id UUID;
    v_atleta1_id UUID;
    v_atleta2_id UUID;
    v_atleta3_id UUID;
    v_medida1_id UUID;
    v_medida2_id UUID;
    v_medida3_id UUID;
BEGIN
    -- Buscar o primeiro personal
    SELECT id INTO v_personal_id FROM personais LIMIT 1;

    IF v_personal_id IS NULL THEN
        RAISE NOTICE '⚠️ Nenhum personal encontrado. Registre um usuário como PERSONAL primeiro.';
        RETURN;
    END IF;

    RAISE NOTICE '✅ Usando personal ID: %', v_personal_id;

    -- Buscar academia (se existir)
    SELECT academia_id INTO v_academia_id FROM personais WHERE id = v_personal_id;

    -- ===== ATLETA 1: Ricardo Souza (Elite) =====
    INSERT INTO atletas (personal_id, academia_id, nome, email, status)
    VALUES (v_personal_id, v_academia_id, 'Ricardo Souza', 'ricardo@teste.com', 'ATIVO')
    RETURNING id INTO v_atleta1_id;

    INSERT INTO fichas (atleta_id, sexo, altura, punho, tornozelo, joelho, pelve, objetivo)
    VALUES (v_atleta1_id, 'M', 182, 18, 24, 42, 98, 'HIPERTROFIA');

    INSERT INTO medidas (atleta_id, data, peso, pescoco, ombros, peitoral, cintura, quadril, braco_direito, braco_esquerdo, antebraco_direito, antebraco_esquerdo, coxa_direita, coxa_esquerda, panturrilha_direita, panturrilha_esquerda, registrado_por, personal_id)
    VALUES (v_atleta1_id, '2026-02-08', 95.5, 44, 142, 125, 82, 102, 46.5, 46.5, 36, 36, 68, 68, 42, 42, 'PERSONAL', v_personal_id)
    RETURNING id INTO v_medida1_id;

    INSERT INTO avaliacoes (atleta_id, medidas_id, data, peso, score_geral, classificacao_geral, proporcoes)
    VALUES (v_atleta1_id, v_medida1_id, '2026-02-08', 95.5, 92, 'ELITE',
        '{"ombros_cintura": {"valor": 1.73, "ideal": 1.618, "score": 95}}'::JSONB);

    -- Medida antiga
    INSERT INTO medidas (atleta_id, data, peso, pescoco, ombros, peitoral, cintura, quadril, braco_direito, braco_esquerdo, antebraco_direito, antebraco_esquerdo, coxa_direita, coxa_esquerda, panturrilha_direita, panturrilha_esquerda, registrado_por, personal_id)
    VALUES (v_atleta1_id, '2025-08-08', 92.0, 43, 138, 120, 86, 103, 45, 44, 35, 34.5, 66, 66, 41, 41, 'PERSONAL', v_personal_id);

    -- ===== ATLETA 2: Fernanda Lima (Meta) =====
    INSERT INTO atletas (personal_id, academia_id, nome, email, status)
    VALUES (v_personal_id, v_academia_id, 'Fernanda Lima', 'fernanda@teste.com', 'ATIVO')
    RETURNING id INTO v_atleta2_id;

    INSERT INTO fichas (atleta_id, sexo, altura, punho, tornozelo, joelho, pelve, objetivo)
    VALUES (v_atleta2_id, 'F', 165, 15, 21, 36, 92, 'DEFINICAO');

    INSERT INTO medidas (atleta_id, data, peso, pescoco, ombros, peitoral, cintura, quadril, braco_direito, braco_esquerdo, antebraco_direito, antebraco_esquerdo, coxa_direita, coxa_esquerda, panturrilha_direita, panturrilha_esquerda, registrado_por, personal_id)
    VALUES (v_atleta2_id, '2026-02-08', 68.0, 32, 108, 92, 64, 105, 31, 31, 25, 25, 64, 64, 38, 38, 'PERSONAL', v_personal_id)
    RETURNING id INTO v_medida2_id;

    INSERT INTO avaliacoes (atleta_id, medidas_id, data, peso, score_geral, classificacao_geral, proporcoes)
    VALUES (v_atleta2_id, v_medida2_id, '2026-02-08', 68.0, 89, 'META',
        '{"busto_quadril": {"valor": 0.88, "ideal": 0.85, "score": 90}}'::JSONB);

    -- ===== ATLETA 3: Bruno Silva (Caminho) =====
    INSERT INTO atletas (personal_id, academia_id, nome, email, status)
    VALUES (v_personal_id, v_academia_id, 'Bruno Silva', 'bruno@teste.com', 'ATIVO')
    RETURNING id INTO v_atleta3_id;

    INSERT INTO fichas (atleta_id, sexo, altura, punho, tornozelo, joelho, pelve, objetivo)
    VALUES (v_atleta3_id, 'M', 175, 17, 22, 38, 104, 'EMAGRECIMENTO');

    INSERT INTO medidas (atleta_id, data, peso, pescoco, ombros, peitoral, cintura, quadril, braco_direito, braco_esquerdo, antebraco_direito, antebraco_esquerdo, coxa_direita, coxa_esquerda, panturrilha_direita, panturrilha_esquerda, registrado_por, personal_id)
    VALUES (v_atleta3_id, '2026-02-05', 92.0, 39, 118, 105, 96, 108, 35, 35, 29, 29, 62, 62, 38, 38, 'PERSONAL', v_personal_id)
    RETURNING id INTO v_medida3_id;

    INSERT INTO avaliacoes (atleta_id, medidas_id, data, peso, score_geral, classificacao_geral, proporcoes)
    VALUES (v_atleta3_id, v_medida3_id, '2026-02-05', 92.0, 55, 'CAMINHO',
        '{"ombros_cintura": {"valor": 1.23, "ideal": 1.618, "score": 45}}'::JSONB);

    RAISE NOTICE '✅ Seed completo! 3 atletas criados com medidas e avaliações.';
    RAISE NOTICE '   - Ricardo Souza (Elite, score 92)';
    RAISE NOTICE '   - Fernanda Lima (Meta, score 89)';
    RAISE NOTICE '   - Bruno Silva (Caminho, score 55)';
END $$;

-- Verificar resultado
SELECT 
    a.nome,
    f.sexo,
    av.score_geral,
    av.classificacao_geral,
    m.data as ultima_medida
FROM atletas a
LEFT JOIN fichas f ON f.atleta_id = a.id
LEFT JOIN LATERAL (
    SELECT * FROM avaliacoes WHERE atleta_id = a.id ORDER BY data DESC LIMIT 1
) av ON TRUE
LEFT JOIN LATERAL (
    SELECT * FROM medidas WHERE atleta_id = a.id ORDER BY data DESC LIMIT 1
) m ON TRUE
ORDER BY av.score_geral DESC NULLS LAST;
