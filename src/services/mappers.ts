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
    return {
        id: medida.id,
        date: medida.data,
        score: avaliacao?.score_geral ? Number(avaliacao.score_geral) : undefined,
        ratio: undefined, // Calculado posteriormente
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
            tricep: 0,
            subscapular: 0,
            chest: 0,
            axillary: 0,
            suprailiac: 0,
            abdominal: 0,
            thigh: 0,
        },
    };
}

/**
 * Enriquecer MeasurementHistory com dados fixos da ficha
 */
export function enriquecerComFicha(history: MeasurementHistory, ficha: Ficha | null): MeasurementHistory {
    if (!ficha) return history;

    return {
        ...history,
        measurements: {
            ...history.measurements,
            height: Number(ficha.altura) || 0,
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

    const score = ultimaAvaliacao?.score_geral ? Number(ultimaAvaliacao.score_geral) : 0;
    const scoreAnterior = penultimaAvaliacao?.score_geral ? Number(penultimaAvaliacao.score_geral) : score;
    const scoreVariation = score - scoreAnterior;

    // Mapear medidas para MeasurementHistory
    const assessments: MeasurementHistory[] = medidas.map(medida => {
        const avaliacaoCorrespondente = avaliacoes.find(a => a.medidas_id === medida.id);
        const history = mapMedidaToHistory(medida, avaliacaoCorrespondente);
        return enriquecerComFicha(history, ficha);
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
        ratio: 0, // Calculado separadamente
        lastMeasurement: medidas[0]?.data || atleta.created_at,
        status,
        linkedSince: atleta.created_at,
        assessments,
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
