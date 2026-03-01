-- =====================================================
-- PASSO 1: Descobrir os IDs reais dos atletas
-- =====================================================
SELECT id, nome FROM atletas WHERE nome IN ('Felipe Andrade', 'Carlos Mendes');

-- =====================================================
-- PASSO 2: Inserir medidas (substitua os IDs abaixo)
-- Use os IDs retornados no PASSO 1
-- =====================================================

DO $$
DECLARE
    v_felipe_id UUID;
    v_carlos_id UUID;
BEGIN
    SELECT id INTO v_felipe_id FROM atletas WHERE nome = 'Felipe Andrade' LIMIT 1;
    SELECT id INTO v_carlos_id FROM atletas WHERE nome = 'Carlos Mendes' LIMIT 1;

    -- ─────────────────────────────────────────────
    -- FELIPE ANDRADE — Shape excelente, atlético
    -- 28 anos | 178 cm | 82 kg | 9.5% BF | Score 88.8
    -- ─────────────────────────────────────────────
    INSERT INTO medidas (
        atleta_id, data,
        peso, gordura_corporal,
        pescoco, ombros, peitoral, cintura, quadril, abdomen,
        braco_direito, braco_esquerdo,
        antebraco_direito, antebraco_esquerdo,
        coxa_direita, coxa_esquerda,
        panturrilha_direita, panturrilha_esquerda,
        dobra_tricipital, dobra_subescapular, dobra_peitoral,
        dobra_axilar_media, dobra_suprailiaca, dobra_abdominal, dobra_coxa,
        score, ratio, registrado_por
    ) VALUES (
        v_felipe_id, '2026-02-28',
        82.0,   -- peso (kg)
        9.5,    -- gordura corporal (%)
        -- Lineares
        38.0,   -- pescoco
        124.0,  -- ombros (amplos, muscular)
        106.0,  -- peitoral
        80.0,   -- cintura (lean)
        96.0,   -- quadril
        80.0,   -- abdomen
        41.0,   -- braco direito
        40.5,   -- braco esquerdo
        32.0,   -- antebraco direito
        31.5,   -- antebraco esquerdo
        62.0,   -- coxa direita
        61.5,   -- coxa esquerda
        38.5,   -- panturrilha direita
        38.0,   -- panturrilha esquerda
        -- Dobras cutâneas (mm) — atleta magro
        8.0,    -- tricipital
        10.0,   -- subescapular
        7.0,    -- peitoral
        9.0,    -- axilar media
        8.0,    -- suprailiaca
        12.0,   -- abdominal
        10.0,   -- coxa
        -- Score e ratio
        88.8,   -- score
        1.55,   -- ratio ombro/cintura (proporcional)
        'COACH_IA'
    );

    -- ─────────────────────────────────────────────
    -- CARLOS MENDES — Acima do peso, sedentário
    -- 35 anos | 175 cm | 94 kg | 24.0% BF | Score 44.8
    -- ─────────────────────────────────────────────
    INSERT INTO medidas (
        atleta_id, data,
        peso, gordura_corporal,
        pescoco, ombros, peitoral, cintura, quadril, abdomen,
        braco_direito, braco_esquerdo,
        antebraco_direito, antebraco_esquerdo,
        coxa_direita, coxa_esquerda,
        panturrilha_direita, panturrilha_esquerda,
        dobra_tricipital, dobra_subescapular, dobra_peitoral,
        dobra_axilar_media, dobra_suprailiaca, dobra_abdominal, dobra_coxa,
        score, ratio, registrado_por
    ) VALUES (
        v_carlos_id, '2026-02-28',
        94.0,   -- peso (kg)
        24.0,   -- gordura corporal (%)
        -- Lineares
        42.0,   -- pescoco (espesso)
        118.0,  -- ombros (gordura distribui, mas menores proporcionalmente)
        110.0,  -- peitoral
        98.0,   -- cintura (alta — gordura central)
        106.0,  -- quadril
        100.0,  -- abdomen (maior que cintura — gordura visceral)
        38.0,   -- braco direito
        37.5,   -- braco esquerdo
        29.0,   -- antebraco direito
        28.5,   -- antebraco esquerdo
        62.0,   -- coxa direita
        61.5,   -- coxa esquerda
        39.0,   -- panturrilha direita
        38.5,   -- panturrilha esquerda
        -- Dobras cutâneas (mm) — excesso de gordura
        26.0,   -- tricipital
        28.0,   -- subescapular
        24.0,   -- peitoral
        22.0,   -- axilar media
        30.0,   -- suprailiaca
        35.0,   -- abdominal (elevada — foco de gordura)
        28.0,   -- coxa
        -- Score e ratio
        44.8,   -- score
        1.21,   -- ratio ombro/cintura (baixo — pouca proporcionalidade)
        'COACH_IA'
    );

    RAISE NOTICE '✅ Medidas inseridas! Felipe: %, Carlos: %', v_felipe_id, v_carlos_id;
END $$;

-- =====================================================
-- PASSO 3: Verificar se foram inseridas corretamente
-- =====================================================
SELECT 
    a.nome,
    m.data,
    m.peso,
    m.gordura_corporal,
    m.ombros,
    m.cintura,
    m.score,
    m.ratio
FROM medidas m
JOIN atletas a ON a.id = m.atleta_id
WHERE a.nome IN ('Felipe Andrade', 'Carlos Mendes')
ORDER BY a.nome, m.data DESC;
