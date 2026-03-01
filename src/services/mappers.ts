/**
 * Supabase → UI Mappers
 * 
 * Converte os dados retornados do Supabase para os formatos
 * que a UI atual espera (interfaces de mocks).
 * 
 * Isso permite uma migração gradual: os componentes continuam
 * usando as mesmas interfaces, mas os dados vêm do banco real.
 */
import type { Atleta, Ficha, Medida, Personal } from '@/lib/database.types';
import type { PersonalAthlete, MeasurementHistory, PersonalProfile, PersonalStats } from '@/mocks/personal';




// ===== ATLETA → PersonalAthlete =====

/**
 * Converte dados do Supabase para PersonalAthlete (interface da UI).
 * Agora recebe `assessments[]` da tabela consolidada ao invés de `avaliacoes[]`.
 */
export function mapAtletaToPersonalAthlete(
    atleta: Atleta,
    ficha: Ficha | null,
    medidas: Medida[],
    assessments: any[]
): PersonalAthlete {
    const ultimoAssessment = assessments[0]; // Já vem ordenado DESC por date
    const penultimoAssessment = assessments[1];

    // Score: lê da coluna dedicada, com fallback no objeto `results.avaliacaoGeral`
    // (quando a avaliação foi salva antes da coluna score ser adicionada ao schema)
    const getScore = (a: any): number => {
        if (!a) return 0;
        return Number(a.score) || Number(a.results?.avaliacaoGeral) || 0;
    };
    const getRatio = (a: any): number => {
        if (!a) return 0;
        return Number(a.ratio) || Number(a.results?.scores?.proporcoes?.detalhes?.proporcaoMaisForte) || 0;
    };

    // Score e Ratio: Devem vir estritamente de assessments Reais (IA).
    // Se não houver avaliações no histórico, o score será 0.
    const score = getScore(ultimoAssessment);
    const penultimaScore = getScore(penultimoAssessment) || score;
    const scoreVariation = score - penultimaScore;
    const ratio = getRatio(ultimoAssessment);

    // Auto-converter altura de metros para cm
    let alturaCm = Number(ficha?.altura) || 0;
    if (alturaCm > 0 && alturaCm < 3) alturaCm = Math.round(alturaCm * 100);

    // Construir MeasurementHistory[] a partir dos assessments
    const mappedAssessments: MeasurementHistory[] = assessments.map((assessment) => {
        const linear = assessment.measurements?.linear || {};
        const skins = assessment.measurements?.skinfolds || {};
        const resultsStored = assessment.results || {};

        return {
            id: assessment.id,
            _source: 'assessments' as const,
            date: assessment.date,
            score: getScore(assessment),
            ratio: getRatio(assessment),
            bf: Number(assessment.body_fat) || 0,
            ffmi: resultsStored?.scores?.composicao?.detalhes?.detalhes?.ffmi?.valor || 0,
            proporcoes: resultsStored?.proporcoes_aureas || resultsStored?.scores || null,
            measurements: {
                weight: Number(linear.weight) || Number(assessment.weight) || 0,
                height: Number(linear.height) || alturaCm || 0,
                neck: Number(linear.neck) || 0,
                shoulders: Number(linear.shoulders) || 0,
                chest: Number(linear.chest) || 0,
                waist: Number(linear.waist) || 0,
                abdomen: Number(linear.abdomen) || Number(linear.waist) || 0,
                hips: Number(linear.hips) || 0,
                pelvis: Number(linear.pelvis) || Number(ficha?.pelve) || 0,
                armRight: Number(linear.armRight) || 0,
                armLeft: Number(linear.armLeft) || 0,
                forearmRight: Number(linear.forearmRight) || 0,
                forearmLeft: Number(linear.forearmLeft) || 0,
                thighRight: Number(linear.thighRight) || 0,
                thighLeft: Number(linear.thighLeft) || 0,
                calfRight: Number(linear.calfRight) || 0,
                calfLeft: Number(linear.calfLeft) || 0,
                wristRight: Number(linear.wristRight) || Number(ficha?.punho) || 17,
                wristLeft: Number(linear.wristLeft) || Number(ficha?.punho) || 17,
                kneeRight: Number(linear.kneeRight) || Number(ficha?.joelho) || 40,
                kneeLeft: Number(linear.kneeLeft) || Number(ficha?.joelho) || 40,
                ankleRight: Number(linear.ankleRight) || Number(ficha?.tornozelo) || 22,
                ankleLeft: Number(linear.ankleLeft) || Number(ficha?.tornozelo) || 22,
            },
            skinfolds: {
                tricep: Number(skins.tricep) || 0,
                subscapular: Number(skins.subscapular) || 0,
                chest: Number(skins.chest) || 0,
                axillary: Number(skins.axillary) || 0,
                suprailiac: Number(skins.suprailiac) || 0,
                abdominal: Number(skins.abdominal) || 0,
                thigh: Number(skins.thigh) || 0,
            },
        };
    });

    // Fallback: Não incorporamos medidas brutas no histórico de avaliações.
    // O histórico deve ser o reflexo fiel da tabela 'assessments'.
    if (mappedAssessments.length === 0 && medidas.length > 0) {
        console.info(`[Mapper] 📊 Atleta ${atleta.nome} possui medidas brutas, mas o histórico de avaliações permanece limpo.`);
    }


    // Determinar status
    let status: 'active' | 'inactive' | 'attention' = 'active';
    if (atleta.status === 'INATIVO') {
        status = 'inactive';
    } else if (score < 50 || scoreVariation < -5) {
        status = 'attention';
    }

    return {
        id: atleta.id,
        personalId: atleta.personal_id,
        name: atleta.nome,
        email: atleta.email || '',
        gender: ficha?.sexo === 'F' ? 'FEMALE' : 'MALE',
        avatarUrl: atleta.foto_url,
        score,
        scoreVariation: Math.round(scoreVariation * 10) / 10,
        ratio,
        lastMeasurement: assessments[0]?.date || medidas[0]?.data || atleta.created_at,
        status,
        linkedSince: atleta.created_at,
        assessments: mappedAssessments,
        birthDate: ficha?.data_nascimento || undefined,
        phone: atleta.telefone || undefined,
        contexto: (ficha?.contexto as any) || null,
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
