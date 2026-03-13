/**
 * GOD Dashboard Service
 *
 * Queries agregadas para o painel administrativo GOD.
 * Fornece KPIs macro, dados de crescimento, distribuição de scores,
 * atividade dos atletas, uso da IA e widgets de gestão.
 *
 * Fluxo: GodDashboard → godDashboardService → Supabase
 */
import { supabase } from '@/services/supabase';

// ===== TYPES =====

export interface KPIsMacro {
    academias: { total: number; ativas: number };
    personais: { total: number; ativos: number };
    atletas: { total: number; ativos: number };
    avaliacoesMes: number;
    avaliacoesMesAnterior: number;
}

export interface CrescimentoMensal {
    mes: string; // 'YYYY-MM'
    label: string; // 'Jan', 'Fev', etc
    atletas: number;
    personais: number;
    academias: number;
}

export interface DistribuicaoScore {
    classificacao: string;
    quantidade: number;
    cor: string;
}

export interface AtividadeDiaria {
    data: string;
    treino: number;
    agua: number;
    sono: number;
    refeicao: number;
}

export interface UsoIADiario {
    data: string;
    diagnostico: number;
    treino: number;
    dieta: number;
    chat: number;
}

export interface PersonalRanking {
    personal_id: string;
    personal_nome: string;
    total_atletas: number;
    atletas_ativos: number;
    score_medio: number | null;
}

export interface AtletaAtencao {
    id: string;
    nome: string;
    foto_url: string | null;
    personal_nome: string;
    dias_desde_avaliacao: number | null;
    score_geral: number | null;
}

export interface AcademiasPorPlano {
    plano: string;
    quantidade: number;
}

// ===== HELPERS =====

const MESES_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function getInicioMesAtual(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function getInicioMesAnterior(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
}

function getFimMesAnterior(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
}

function getDataMesesAtras(meses: number): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - meses, 1).toISOString();
}

// ===== SERVICE =====

export const godDashboardService = {
    /**
     * Busca KPIs macro: contagens de academias, personais, atletas e avaliações
     */
    async fetchKPIsMacro(): Promise<KPIsMacro> {
        const [academias, personais, atletas, avalsMes, avalsMesAnterior] = await Promise.all([
            supabase.from('academias').select('status', { count: 'exact', head: false }),
            supabase.from('personais').select('status', { count: 'exact', head: false }),
            supabase.from('atletas').select('status', { count: 'exact', head: false }),
            supabase.from('medidas').select('*', { count: 'exact', head: true })
                .gte('created_at', getInicioMesAtual()),
            supabase.from('medidas').select('*', { count: 'exact', head: true })
                .gte('created_at', getInicioMesAnterior())
                .lte('created_at', getFimMesAnterior()),
        ]);

        const acData = academias.data || [];
        const perData = personais.data || [];
        const atlData = atletas.data || [];

        return {
            academias: {
                total: acData.length,
                ativas: acData.filter((a: { status: string }) => a.status === 'ATIVO').length,
            },
            personais: {
                total: perData.length,
                ativos: perData.filter((p: { status: string }) => p.status === 'ATIVO').length,
            },
            atletas: {
                total: atlData.length,
                ativos: atlData.filter((a: { status: string }) => a.status === 'ATIVO').length,
            },
            avaliacoesMes: avalsMes.count ?? 0,
            avaliacoesMesAnterior: avalsMesAnterior.count ?? 0,
        };
    },

    /**
     * Busca dados de crescimento mensal (últimos 6 meses)
     */
    async fetchCrescimentoPorMes(): Promise<CrescimentoMensal[]> {
        const dataInicio = getDataMesesAtras(6);

        const [atletas, personais, academias] = await Promise.all([
            supabase.from('atletas').select('created_at').gte('created_at', dataInicio),
            supabase.from('personais').select('created_at').gte('created_at', dataInicio),
            supabase.from('academias').select('created_at').gte('created_at', dataInicio),
        ]);

        // Agrupa por mês
        const mesesMap = new Map<string, CrescimentoMensal>();
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            mesesMap.set(key, {
                mes: key,
                label: MESES_PT[d.getMonth()],
                atletas: 0,
                personais: 0,
                academias: 0,
            });
        }

        const addToMonth = (items: { created_at: string }[] | null, field: 'atletas' | 'personais' | 'academias') => {
            (items || []).forEach(item => {
                const d = new Date(item.created_at);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                const entry = mesesMap.get(key);
                if (entry) entry[field]++;
            });
        };

        addToMonth(atletas.data, 'atletas');
        addToMonth(personais.data, 'personais');
        addToMonth(academias.data, 'academias');

        return Array.from(mesesMap.values());
    },

    /**
     * Busca distribuição de scores/classificações dos atletas
     */
    async fetchDistribuicaoScores(): Promise<DistribuicaoScore[]> {
        const { data } = await supabase
            .from('v_atletas_com_avaliacao')
            .select('classificacao_geral');

        const contagem: Record<string, number> = {
            INICIO: 0,
            CAMINHO: 0,
            QUASE_LA: 0,
            META: 0,
            ELITE: 0,
        };

        (data || []).forEach((row: { classificacao_geral: string | null }) => {
            const cls = row.classificacao_geral;
            if (cls && cls in contagem) contagem[cls]++;
        });

        const cores: Record<string, string> = {
            INICIO: '#ef4444',
            CAMINHO: '#f97316',
            QUASE_LA: '#eab308',
            META: '#22c55e',
            ELITE: '#d4a853',
        };

        const labels: Record<string, string> = {
            INICIO: 'Início',
            CAMINHO: 'Caminho',
            QUASE_LA: 'Quase Lá',
            META: 'Meta',
            ELITE: 'Elite',
        };

        return Object.entries(contagem).map(([cls, qtd]) => ({
            classificacao: labels[cls] || cls,
            quantidade: qtd,
            cor: cores[cls] || '#888',
        }));
    },

    /**
     * Busca registros de atividade diária dos últimos 7 dias
     */
    async fetchAtividadeDiaria(): Promise<AtividadeDiaria[]> {
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

        const { data } = await supabase
            .from('registros')
            .select('data, tipo')
            .gte('data', seteDiasAtras.toISOString().split('T')[0]);

        const diasMap = new Map<string, AtividadeDiaria>();

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            diasMap.set(key, { data: key, treino: 0, agua: 0, sono: 0, refeicao: 0 });
        }

        (data || []).forEach((row: { data: string; tipo: string }) => {
            const entry = diasMap.get(row.data);
            if (!entry) return;
            switch (row.tipo) {
                case 'TREINO': entry.treino++; break;
                case 'AGUA': entry.agua++; break;
                case 'SONO': entry.sono++; break;
                case 'REFEICAO': entry.refeicao++; break;
            }
        });

        return Array.from(diasMap.values());
    },

    /**
     * Busca uso da IA (consultorias) nos últimos 30 dias
     */
    async fetchUsoIA(): Promise<UsoIADiario[]> {
        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

        const { data } = await supabase
            .from('consultorias')
            .select('data, tipo')
            .gte('data', trintaDiasAtras.toISOString().split('T')[0]);

        const diasMap = new Map<string, UsoIADiario>();

        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            diasMap.set(key, { data: key, diagnostico: 0, treino: 0, dieta: 0, chat: 0 });
        }

        (data || []).forEach((row: { data: string; tipo: string }) => {
            const entry = diasMap.get(row.data);
            if (!entry) return;
            switch (row.tipo) {
                case 'DIAGNOSTICO': entry.diagnostico++; break;
                case 'TREINO': entry.treino++; break;
                case 'DIETA': entry.dieta++; break;
                case 'CHAT': entry.chat++; break;
            }
        });

        return Array.from(diasMap.values());
    },

    /**
     * Busca top 5 personais por score médio
     */
    async fetchTopPersonais(): Promise<PersonalRanking[]> {
        const { data } = await supabase
            .from('v_kpis_personal')
            .select('personal_id, personal_nome, total_atletas, atletas_ativos, score_medio')
            .order('score_medio', { ascending: false, nullsFirst: false })
            .limit(5);

        return (data || []) as PersonalRanking[];
    },

    /**
     * Busca atletas que precisam de atenção (>30 dias sem avaliação)
     */
    async fetchAtletasAtencao(): Promise<AtletaAtencao[]> {
        const { data } = await supabase
            .from('v_atletas_com_avaliacao')
            .select('id, nome, foto_url, personal_nome, dias_desde_avaliacao, score_geral')
            .gt('dias_desde_avaliacao', 30)
            .order('dias_desde_avaliacao', { ascending: false })
            .limit(10);

        return (data || []) as AtletaAtencao[];
    },

    /**
     * Busca contagem de academias por plano
     */
    async fetchAcademiasPorPlano(): Promise<AcademiasPorPlano[]> {
        const { data } = await supabase
            .from('academias')
            .select('plano');

        const contagem: Record<string, number> = { BASIC: 0, PRO: 0, ENTERPRISE: 0 };
        (data || []).forEach((row: { plano: string }) => {
            if (row.plano in contagem) contagem[row.plano]++;
        });

        return Object.entries(contagem).map(([plano, quantidade]) => ({ plano, quantidade }));
    },
};
