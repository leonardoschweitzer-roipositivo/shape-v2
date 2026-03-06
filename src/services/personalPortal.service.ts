/**
 * Personal Portal Service — VITRU IA
 *
 * Queries Supabase para o Portal do Personal (Mobile First).
 * Carregamento bifásico: contexto crítico → dados secundários.
 *
 * Fluxo: PersonalPortal → personalPortalService → Supabase
 */

import { supabase } from './supabase'
import type {
    AlunoCard,
    FichaAlunoResumo,
    PersonalPortalContext,
    AtividadeRecente,
    StatusAluno,
    ProporçãoResumo,
} from '@/types/personal-portal'

// ===== Helpers =====

/**
 * Classifica o aluno com base na data da última medição.
 */
function classificarStatus(ultimaMedicao: string | null): StatusAluno {
    if (!ultimaMedicao) return 'INATIVO'
    const diasDesdeUltima = Math.floor(
        (Date.now() - new Date(ultimaMedicao).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diasDesdeUltima > 30) return 'INATIVO'
    if (diasDesdeUltima > 7) return 'ATENCAO'
    return 'ATIVO'
}

/**
 * Mapeia score para nível/classificação.
 */
function scoreParaNivel(score: number | null): string | null {
    if (!score || score <= 0) return null
    if (score >= 90) return 'ELITE'
    if (score >= 75) return 'ATLETA'
    if (score >= 50) return 'EVOLUINDO'
    return 'INICIANDO'
}

// ===== Fase Crítica =====

/**
 * Carrega o contexto básico do personal (dados do personal + contadores de alunos).
 * Deve ser chamado na primeira fase de carregamento.
 */
export async function carregarContextoPersonal(
    personalId: string
): Promise<PersonalPortalContext | null> {
    const { data: personal, error } = await supabase
        .from('personais')
        .select('id, nome, email, foto_url')
        .eq('id', personalId)
        .single()

    if (error || !personal) {
        console.error('[PersonalPortal] Erro ao carregar contexto:', error?.message)
        return null
    }

    // Buscar atletas (query simples, sem join problemático)
    const { data: atletas } = await supabase
        .from('atletas')
        .select('id')
        .eq('personal_id', personalId)

    const atletaIds = (atletas ?? []).map(a => a.id)

    // Para cada atleta, buscar última medição para classificar status
    let ativos = 0
    let atencaoCount = 0
    let inativos = 0

    if (atletaIds.length > 0) {
        // Buscar última atividade de AMBAS as tabelas
        const [{ data: medidas }, { data: assessments }] = await Promise.all([
            supabase
                .from('medidas')
                .select('atleta_id, created_at')
                .in('atleta_id', atletaIds)
                .order('created_at', { ascending: false }),
            supabase
                .from('assessments')
                .select('atleta_id, created_at')
                .in('atleta_id', atletaIds)
                .order('created_at', { ascending: false }),
        ])

        // Agrupar e pegar a data mais recente entre medidas e assessments
        const ultimaPorAtleta = new Map<string, string>()
        for (const m of medidas ?? []) {
            if (!ultimaPorAtleta.has(m.atleta_id)) {
                ultimaPorAtleta.set(m.atleta_id, m.created_at)
            }
        }
        for (const a of assessments ?? []) {
            const atual = ultimaPorAtleta.get(a.atleta_id)
            if (!atual || new Date(a.created_at) > new Date(atual)) {
                ultimaPorAtleta.set(a.atleta_id, a.created_at)
            }
        }

        for (const id of atletaIds) {
            const ultima = ultimaPorAtleta.get(id) ?? null
            const status = classificarStatus(ultima)
            if (status === 'ATIVO') ativos++
            else if (status === 'ATENCAO') atencaoCount++
            else inativos++
        }
    }

    return {
        personalId: personal.id,
        nome: personal.nome,
        email: personal.email,
        fotoUrl: personal.foto_url ?? null,
        totalAlunos: atletaIds.length,
        alunosAtivos: ativos,
        alunosAtencao: atencaoCount,
        alunosInativos: inativos,
    }
}

// ===== Dados Principais =====

/**
 * Lista todos os alunos do personal com score, status e última medição.
 * Usa queries separadas (atletas + medidas) para evitar join inline que pode falhar.
 */
export async function listarAlunos(personalId: string): Promise<AlunoCard[]> {
    // 1. Buscar atletas
    const { data: atletas, error } = await supabase
        .from('atletas')
        .select('id, nome, email, foto_url')
        .eq('personal_id', personalId)
        .order('nome', { ascending: true })

    if (error || !atletas) {
        console.error('[PersonalPortal] Erro ao listar alunos:', error?.message)
        return []
    }

    if (atletas.length === 0) return []

    const atletaIds = atletas.map(a => a.id)

    // 2. Buscar medidas E assessments de todos os atletas (em paralelo)
    const [{ data: todasMedidas }, { data: todosAssessments }] = await Promise.all([
        supabase
            .from('medidas')
            .select('id, atleta_id, created_at, score')
            .in('atleta_id', atletaIds)
            .order('created_at', { ascending: false }),
        supabase
            .from('assessments')
            .select('id, atleta_id, created_at, score, date')
            .in('atleta_id', atletaIds)
            .order('date', { ascending: false }),
    ])

    // Agrupar medidas por atleta
    const medidasPorAtleta = new Map<string, { created_at: string; score: number | null }[]>()
    for (const m of todasMedidas ?? []) {
        if (!medidasPorAtleta.has(m.atleta_id)) medidasPorAtleta.set(m.atleta_id, [])
        medidasPorAtleta.get(m.atleta_id)!.push({ created_at: m.created_at, score: m.score })
    }

    // Agrupar assessments por atleta
    const assessmentsPorAtleta = new Map<string, { date: string; score: number | null; created_at: string }[]>()
    for (const a of (todosAssessments ?? []) as { id: string; atleta_id: string; created_at: string; score: number | null; date: string }[]) {
        if (!assessmentsPorAtleta.has(a.atleta_id)) assessmentsPorAtleta.set(a.atleta_id, [])
        assessmentsPorAtleta.get(a.atleta_id)!.push({ date: a.date, score: a.score, created_at: a.created_at })
    }

    const hoje = new Date()
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - 7)

    return atletas.map((atleta) => {
        const medidas = medidasPorAtleta.get(atleta.id) ?? []
        const assessments = assessmentsPorAtleta.get(atleta.id) ?? []

        // Última avaliação: a data mais recente entre medidas e assessments
        const ultimaMed = medidas[0]?.created_at ?? null
        const ultimaAssess = assessments[0]?.created_at ?? null
        let ultimaMedicao = ultimaMed
        if (ultimaAssess && (!ultimaMedicao || new Date(ultimaAssess) > new Date(ultimaMedicao))) {
            ultimaMedicao = ultimaAssess
        }

        // Score: prioridade para assessment (fonte principal), senão medidas
        const scoreAtual = assessments[0]?.score ?? medidas[0]?.score ?? 0

        // Evolução semanal via assessments
        const scoreSemanaAnterior = assessments.length > 1 ? assessments[1]?.score ?? 0 : 0
        const evolucaoSemana = scoreAtual - scoreSemanaAnterior

        return {
            id: atleta.id,
            nome: atleta.nome,
            email: atleta.email ?? '',
            fotoUrl: atleta.foto_url ?? null,
            score: scoreAtual,
            nivel: scoreParaNivel(scoreAtual),
            status: classificarStatus(ultimaMedicao),
            ultimaMedicao,
            evolucaoSemana: Math.round(evolucaoSemana * 10) / 10,
            streak: 0,
        } as AlunoCard
    })
}

/**
 * Busca a ficha rápida de um aluno específico (para a sub-tela de Ficha).
 */
export async function buscarFichaAluno(atletaId: string): Promise<FichaAlunoResumo | null> {
    // 1. Buscar atleta
    const { data: atleta, error } = await supabase
        .from('atletas')
        .select('id, nome, email, foto_url')
        .eq('id', atletaId)
        .single()

    if (error || !atleta) {
        console.error('[PersonalPortal] Erro ao buscar ficha:', error?.message)
        return null
    }

    // 2. Buscar ficha
    const { data: fichaData } = await supabase
        .from('fichas')
        .select('telefone, atleta_id')
        .eq('atleta_id', atletaId)
        .limit(1)

    const ficha = fichaData?.[0]

    // 3. Buscar medidas e assessments em paralelo
    const [{ data: medidasData }, { data: assessData }] = await Promise.all([
        supabase
            .from('medidas')
            .select('created_at, score, ombros, peitoral, cintura, quadril, braco_direito, coxa_direita')
            .eq('atleta_id', atletaId)
            .order('created_at', { ascending: false })
            .limit(5),
        supabase
            .from('assessments')
            .select('score, date, created_at')
            .eq('atleta_id', atletaId)
            .order('date', { ascending: false })
            .limit(2),
    ])

    const medidas = medidasData ?? []
    const assessments = assessData ?? []
    const ultima = medidas[0]
    const penultima = medidas[1]

    // Score: prioridade para assessments
    const scoreAtual = (assessments[0] as { score: number | null })?.score ?? ultima?.score ?? 0
    const scoreSemanaAnterior = (assessments[1] as { score: number | null })?.score ?? penultima?.score ?? 0
    const evolucaoSemana = Math.round((scoreAtual - scoreSemanaAnterior) * 10) / 10

    // Proporções resumidas com valor anterior para comparação
    const proporcoes: ProporçãoResumo[] = ultima ? [
        {
            nome: 'Ombros',
            valor: ultima.ombros ?? 0,
            valorAnterior: penultima?.ombros ?? 0,
            meta: 135,
            percentual: Math.min(100, Math.round(((ultima.ombros ?? 0) / 135) * 100))
        },
        {
            nome: 'Peitoral',
            valor: ultima.peitoral ?? 0,
            valorAnterior: penultima?.peitoral ?? 0,
            meta: 120,
            percentual: Math.min(100, Math.round(((ultima.peitoral ?? 0) / 120) * 100))
        },
        {
            nome: 'Cintura',
            valor: ultima.cintura ?? 0,
            valorAnterior: penultima?.cintura ?? 0,
            meta: 80,
            percentual: Math.min(100, Math.round(((ultima.cintura ?? 0) / 80) * 100))
        },
    ].filter(p => p.valor > 0) : []

    // 4. Streak e check-ins (simplificado — busca registros do mês)
    const inicioMes = new Date()
    inicioMes.setDate(1)

    const { data: registros } = await supabase
        .from('registros_diarios')
        .select('data, treino_status')
        .eq('atleta_id', atletaId)
        .gte('data', inicioMes.toISOString().split('T')[0])
        .order('data', { ascending: false })

    const checkinsMes = (registros ?? []).filter(r => r.treino_status === 'completo').length
    const totalDiasMes = new Date().getDate()

    // 5. Buscar personal_id a partir da tabela atletas
    const { data: atletaFull } = await supabase
        .from('atletas')
        .select('personal_id')
        .eq('id', atletaId)
        .single()

    return {
        id: atleta.id,
        nome: atleta.nome,
        email: atleta.email ?? '',
        telefone: ficha?.telefone ?? null,
        fotoUrl: atleta.foto_url ?? null,
        score: scoreAtual,
        nivel: scoreParaNivel(scoreAtual),
        evolucaoSemana,
        streak: checkinsMes,
        checkinsMes,
        totalDiasMes,
        proporcoes: proporcoes.slice(0, 3),
        insightIA: null,
        pessoalId: atletaFull?.personal_id ?? '',
    }
}

/**
 * Busca a atividade recente (últimas 5 ações) dos alunos do personal.
 */
export async function buscarAtividadeRecente(personalId: string): Promise<AtividadeRecente[]> {
    // Buscar IDs dos atletas do personal
    const { data: atletas } = await supabase
        .from('atletas')
        .select('id, nome')
        .eq('personal_id', personalId)

    if (!atletas || atletas.length === 0) return []

    const atletaIds = atletas.map(a => a.id)
    const atletaMap = Object.fromEntries(atletas.map(a => [a.id, a.nome]))

    // Buscar registros diários recentes
    const { data: registros } = await supabase
        .from('registros_diarios')
        .select('id, atleta_id, treino_status, observacoes, created_at')
        .in('atleta_id', atletaIds)
        .order('created_at', { ascending: false })
        .limit(10)

    const atividades: AtividadeRecente[] = (registros ?? [])
        .filter(r => r.treino_status === 'completo' || r.treino_status === 'pulado')
        .slice(0, 5)
        .map(r => ({
            id: r.id,
            tipo: r.treino_status === 'completo' ? 'TREINO_COMPLETO' : 'TREINO_PULADO',
            alunoId: r.atleta_id,
            alunoNome: atletaMap[r.atleta_id] ?? 'Aluno',
            descricao: r.treino_status === 'completo'
                ? 'completou o treino de hoje'
                : 'pulou o treino de hoje',
            criadoEm: r.created_at,
        } as AtividadeRecente))

    return atividades
}
