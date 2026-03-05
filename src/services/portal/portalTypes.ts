/**
 * Portal Data Types — Interfaces para dados do Supabase no Portal do Atleta
 */
import type { DiagnosticoDados } from '@/services/calculations/diagnostico';
import type { PlanoTreino } from '@/services/calculations/treino';
import type { PlanoDieta } from '@/services/calculations/dieta';
import type { ChatMessageRole } from '@/types/athlete-portal';

/** Supabase row shapes (loosely typed for flexibility with dynamic DB schemas) */
export interface SupaAtleta {
    id: string;
    nome: string;
    personal_id: string;
    [key: string]: unknown;
}

export interface SupaPersonal {
    id: string;
    nome: string;
    email?: string;
    telefone?: string;
    cref?: string;
    [key: string]: unknown;
}

export interface SupaFicha {
    atleta_id: string;
    sexo?: string;
    altura?: number;
    peso?: number;
    gordura_percentual?: number;
    objetivo?: string;
    data_nascimento?: string;
    [key: string]: unknown;
}

export interface SupaRegistroDiario {
    id?: string;
    atleta_id: string;
    data: string;
    tipo: string;
    dados: Record<string, unknown>;
    created_at?: string;
    [key: string]: unknown;
}

export interface SupaDiagnostico {
    dados: DiagnosticoDados;
    [key: string]: unknown;
}

export interface SupaPlanoTreino {
    dados: PlanoTreino;
    [key: string]: unknown;
}

export interface SupaPlanoDieta {
    dados: PlanoDieta;
    [key: string]: unknown;
}

/** Nested structure of assessment results stored in DB */
export interface AssessmentResults {
    avaliacaoGeral?: number;
    classificacao?: { nivel: string; emoji: string; cor?: string; descricao?: string };
    scores?: {
        proporcoes?: { valor: number; peso: number; contribuicao: number; detalhes?: Record<string, unknown> };
        composicao?: { valor: number; peso: number; contribuicao: number; detalhes?: { score?: number; detalhes?: Record<string, Record<string, unknown>>; pesoMagro?: number; pesoGordo?: number } };
        simetria?: { valor: number; peso: number; contribuicao: number; detalhes?: { score?: number; detalhes?: Record<string, unknown>[] } };
    };
    penalizacoes?: { vTaper: number; cintura: number };
    insights?: { pontoForte?: string; pontoFraco?: string; proximaMeta?: string };
    proporcoes_aureas?: Array<{ nome: string; atual: number; ideal: number; pct: number; status: string }>;
    proporcoes?: Record<string, unknown>[];
    proportions?: Record<string, unknown>[];
    [key: string]: unknown;
}

export interface SupaAssessment {
    id: string;
    date: string;
    score: number;
    results: AssessmentResults;
    body_fat?: number;
    measurements?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface SupaChatMessage {
    id: string;
    role: ChatMessageRole;
    content: string;
    created_at: string;
    [key: string]: unknown;
}

export interface SupaMedida {
    data: string;
    peso: number;
    [key: string]: unknown;
}

export interface PortalContext {
    atletaId: string;
    atletaNome: string;
    personalId: string;
    personalNome: string;
    ficha: SupaFicha | null;
    diagnostico: DiagnosticoDados | null;
    planoTreino: PlanoTreino | null;
    planoDieta: PlanoDieta | null;
}
