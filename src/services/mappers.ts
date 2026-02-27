/**
 * Supabase → UI Mappers
 * 
 * Converte os dados retornados do Supabase para os formatos
 * que a UI atual espera (interfaces de mocks).
 * 
 * Isso permite uma migração gradual: os componentes continuam
 * usando as mesmas interfaces, mas os dados vêm do banco real.
 */
import type { Atleta, Ficha, Medida, Avaliacao, Personal } from '@/lib/database.types';
import type { PersonalAthlete, MeasurementHistory, PersonalProfile, PersonalStats } from '@/mocks/personal';

// ===== MEDIDA → MeasurementHistory =====

export function mapMedidaToHistory(medida: Medida, avaliacao?: Avaliacao | null): MeasurementHistory {
    const hasScore = avaliacao?.score_geral !== null && avaliacao?.score_geral !== undefined;
    let scoreVal = hasScore ? Number(avaliacao!.score_geral) : undefined;

    const hasBf = avaliacao?.gordura_corporal !== null && avaliacao?.gordura_corporal !== undefined;
    let bfVal = hasBf ? Number(avaliacao!.gordura_corporal) : undefined;

    const hasFfmi = avaliacao?.ffmi !== null && avaliacao?.ffmi !== undefined;
    let ffmiVal = hasFfmi ? Number(avaliacao!.ffmi) : undefined;

    // Fallback para o JSON se as colunas estiverem vazias (registros antigos)
    // IMPORTANTE: avaliacao.proporcoes contém result.scores (não result inteiro!)
    // Estrutura: { proporcoes: { valor, detalhes }, composicao: { valor, detalhes }, simetria: { valor, detalhes } }
    if (avaliacao?.proporcoes && typeof avaliacao.proporcoes === 'object') {
        const json = avaliacao.proporcoes as any;

        // BF e FFMI — json É o result.scores
        if (bfVal === undefined || bfVal === 0) {
            bfVal = json.composicao?.detalhes?.detalhes?.bf?.valor
                || json.composicao?.detalhes?.bf?.valor;
        }
        if (ffmiVal === undefined || ffmiVal === 0) {
            ffmiVal = json.composicao?.detalhes?.detalhes?.ffmi?.valor
                || json.composicao?.detalhes?.ffmi?.valor;
        }
    }

    return {
        id: medida.id,
        date: medida.data,
        score: scoreVal,
        bf: bfVal,
        ffmi: ffmiVal,
        ratio: undefined,
        proporcoes: avaliacao?.proporcoes,
        measurements: {
            weight: Number(medida.peso) || 0,
            height: 0, // Vem da ficha, não da medida
            neck: Number(medida.pescoco) || 0,
            shoulders: Number(medida.ombros) || 0,
            chest: Number(medida.peitoral) || 0,
            waist: Number(medida.cintura) || 0,
            hips: Number(medida.quadril) || 0,
            pelvis: 0, // Vem da ficha
            armRight: Number(medida.braco_direito) || 0,
            armLeft: Number(medida.braco_esquerdo) || 0,
            forearmRight: Number(medida.antebraco_direito) || 0,
            forearmLeft: Number(medida.antebraco_esquerdo) || 0,
            thighRight: Number(medida.coxa_direita) || 0,
            thighLeft: Number(medida.coxa_esquerda) || 0,
            calfRight: Number(medida.panturrilha_direita) || 0,
            calfLeft: Number(medida.panturrilha_esquerda) || 0,
            wristRight: 0,  // Vem da ficha
            wristLeft: 0,   // Vem da ficha
            kneeRight: 0,   // Vem da ficha
            kneeLeft: 0,    // Vem da ficha
            ankleRight: 0,  // Vem da ficha
            ankleLeft: 0,   // Vem da ficha
        },
        skinfolds: {
            tricep: Number(medida.dobra_tricipital) || 0,
            subscapular: Number(medida.dobra_subescapular) || 0,
            chest: Number(medida.dobra_peitoral) || 0,
            axillary: Number(medida.dobra_axilar_media) || 0,
            suprailiac: Number(medida.dobra_suprailiaca) || 0,
            abdominal: Number(medida.dobra_abdominal) || 0,
            thigh: Number(medida.dobra_coxa) || 0,
        },
    };
}

/**
 * Enriquecer MeasurementHistory com dados fixos da ficha e extrair ratio do JSON se disponível
 */
export function enriquecerComFicha(history: MeasurementHistory, ficha: Ficha | null, avaliacao?: Avaliacao | null): MeasurementHistory {
    if (!ficha) return history;

    // Auto-converter altura de metros para cm se necessário
    let alturaCm = Number(ficha.altura) || 0;
    if (alturaCm > 0 && alturaCm < 3) {
        alturaCm = Math.round(alturaCm * 100);
    }

    // Extrair ratio do JSON da avaliação se houver
    // IMPORTANTE: avaliacao.proporcoes = result.scores  
    // Estrutura: json.proporcoes.detalhes = ProportionScoreDetails { detalhes: ProporcaoDetalhe[] }
    let extractedRatio = history.ratio;
    if (avaliacao?.proporcoes) {
        try {
            const json = avaliacao.proporcoes as any;

            // json É result.scores, portanto:
            // json.proporcoes.detalhes = ProportionScoreDetails (score, detalhes[], ...)
            // json.proporcoes.detalhes.detalhes = ProporcaoDetalhe[]
            const detalhes =
                json?.proporcoes?.detalhes?.detalhes ||  // Correto: result.scores.proporcoes.detalhes(=ProportionScoreDetails).detalhes(=array)
                json?.proporcoes?.detalhes ||             // Se detalhes já for o array
                json?.detalhes;                           // Fallback legacy

            if (Array.isArray(detalhes)) {
                const vTaper = detalhes.find((d: any) =>
                    d.proporcao === 'vTaper' ||
                    d.proporcao === 'shapeV' ||
                    d.proporcao === 'ombros_cintura' ||
                    d.proporcao === 'ombros_cintura_ideal'
                );
                if (vTaper && typeof vTaper.valor === 'number') {
                    extractedRatio = vTaper.valor;
                }
            }
        } catch (e) {
            console.warn('[Mappers] Erro ao extrair ratio no enriquecimento:', e);
        }
    }

    return {
        ...history,
        ratio: extractedRatio,
        measurements: {
            ...history.measurements,
            height: alturaCm,
            pelvis: Number(ficha.pelve) || 0,
            wristRight: Number(ficha.punho) || 0,
            wristLeft: Number(ficha.punho) || 0,
            kneeRight: Number(ficha.joelho) || 0,
            kneeLeft: Number(ficha.joelho) || 0,
            ankleRight: Number(ficha.tornozelo) || 0,
            ankleLeft: Number(ficha.tornozelo) || 0,
        },
    };
}

// ===== ATLETA → PersonalAthlete =====

export function mapAtletaToPersonalAthlete(
    atleta: Atleta,
    ficha: Ficha | null,
    medidas: Medida[],
    avaliacoes: Avaliacao[]
): PersonalAthlete {
    const ultimaAvaliacao = avaliacoes[0]; // Já vem ordenado DESC
    const penultimaAvaliacao = avaliacoes[1];

    const score = (ultimaAvaliacao?.score_geral !== null && ultimaAvaliacao?.score_geral !== undefined)
        ? Number(ultimaAvaliacao.score_geral)
        : 0;

    const penultimaScore = (penultimaAvaliacao?.score_geral !== null && penultimaAvaliacao?.score_geral !== undefined)
        ? Number(penultimaAvaliacao.score_geral)
        : score;

    const scoreVariation = score - penultimaScore;

    // Extrair ratio (V-Taper) dos detalhes salvos no JSON, se existirem
    // IMPORTANTE: ultimaAvaliacao.proporcoes = result.scores
    // json.proporcoes.detalhes.detalhes = ProporcaoDetalhe[]
    let ratio = 0;
    try {
        const json = ultimaAvaliacao?.proporcoes as any;
        const detalhes =
            json?.proporcoes?.detalhes?.detalhes ||  // Correto: scores.proporcoes.detalhes(=ProportionScoreDetails).detalhes(=array)
            json?.proporcoes?.detalhes ||             // Se detalhes já for o array
            json?.detalhes;                           // Fallback legacy

        if (Array.isArray(detalhes)) {
            const vTaper = detalhes.find((d: any) =>
                d.proporcao === 'vTaper' ||
                d.proporcao === 'shapeV' ||
                d.proporcao === 'ombros_cintura' ||
                d.proporcao === 'ombros_cintura_ideal'
            );
            if (vTaper && typeof vTaper.valor === 'number') {
                ratio = vTaper.valor;
            }
            console.info(`[Mappers] Ratio extraído para ${atleta.nome}: ${ratio}`);
        } else {
            console.warn(`[Mappers] Detalhes não é array para ${atleta.nome}:`, typeof detalhes, detalhes);
        }
    } catch (e) {
        console.warn('[Mappers] Erro ao extrair ratio do JSON:', e);
    }

    // Mapear medidas para MeasurementHistory
    // Se houver mais avaliações que medidas ou vice-versa, precisamos de um fallback robusto
    const assessments: MeasurementHistory[] = medidas.map((medida, idx) => {
        // 1. Tentar via medidas_id (link direto)
        let avaliacaoCorrespondente = avaliacoes.find(a => a.medidas_id === medida.id);

        // 2. Fallback: mesma data
        if (!avaliacaoCorrespondente) {
            avaliacaoCorrespondente = avaliacoes.find(a => a.data === medida.data);
        }

        // 3. Fallback: mesmo índice (se 1ª medida = 1ª avaliação, etc)
        if (!avaliacaoCorrespondente && idx < avaliacoes.length) {
            avaliacaoCorrespondente = avaliacoes[idx];
        }

        if (avaliacaoCorrespondente) {
            console.info(`[Mappers] ✅ Avaliação linkada para medida ${medida.id.substring(0, 8)}: score=${avaliacaoCorrespondente.score_geral}`);
        } else {
            console.warn(`[Mappers] ❌ Nenhuma avaliação encontrada para medida ${medida.id.substring(0, 8)}`);
        }

        const history = mapMedidaToHistory(medida, avaliacaoCorrespondente);
        return enriquecerComFicha(history, ficha, avaliacaoCorrespondente);
    });

    // Determinar status
    let status: 'active' | 'inactive' | 'attention' = 'active';
    if (atleta.status === 'INATIVO') {
        status = 'inactive';
    } else if (score < 50 || scoreVariation < -5) {
        status = 'attention';
    }

    return {
        id: atleta.id,
        name: atleta.nome,
        email: atleta.email || '',
        gender: ficha?.sexo === 'F' ? 'FEMALE' : 'MALE',
        avatarUrl: atleta.foto_url,
        score,
        scoreVariation: Math.round(scoreVariation * 10) / 10,
        ratio,
        lastMeasurement: medidas[0]?.data || atleta.created_at,
        status,
        linkedSince: atleta.created_at,
        assessments,
        birthDate: ficha?.data_nascimento || undefined,
        phone: atleta.telefone || undefined,
    };
}

// ===== PERSONAL → PersonalProfile =====

export function mapPersonalToProfile(personal: Personal): PersonalProfile {
    return {
        id: personal.id,
        name: personal.nome,
        email: personal.email,
        gender: 'MALE', // Default, não temos no schema
        avatarUrl: personal.foto_url,
        cref: personal.cref || '',
        specialties: [],
        bio: '',
        createdAt: personal.created_at,
        stats: {
            totalAthletes: 0,
            maxAthletes: personal.limite_atletas,
            measuredThisWeek: 0,
            averageScore: 0,
            scoreVariation: 0,
            needsAttention: 0,
        },
    };
}
