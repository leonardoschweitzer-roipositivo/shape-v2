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
    let scoreMedio = 0

    if (atletaIds.length > 0) {
        // Buscar última atividade de AMBAS as tabelas + scores dos assessments
        const [{ data: medidas }, { data: assessments }] = await Promise.all([
            supabase
                .from('medidas')
                .select('atleta_id, created_at')
                .in('atleta_id', atletaIds)
                .order('created_at', { ascending: false }),
            supabase
                .from('assessments')
                .select('atleta_id, created_at, score')
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

        // Score por atleta (último assessment)
        const scorePorAtleta = new Map<string, number>()
        for (const a of assessments ?? []) {
            const atual = ultimaPorAtleta.get(a.atleta_id)
            if (!atual || new Date(a.created_at) > new Date(atual)) {
                ultimaPorAtleta.set(a.atleta_id, a.created_at)
            }
            if (!scorePorAtleta.has(a.atleta_id) && a.score) {
                scorePorAtleta.set(a.atleta_id, a.score)
            }
        }

        // Contabilizar statuses e atenção baseada em SCORE < 60 (alinhado com Desktop)
        let somaScores = 0
        let qtdComScore = 0

        for (const id of atletaIds) {
            const ultima = ultimaPorAtleta.get(id) ?? null
            const score = scorePorAtleta.get(id) ?? 0
            const status = classificarStatus(ultima)
            if (status === 'ATIVO') ativos++
            else if (status === 'ATENCAO') atencaoCount++
            else inativos++

            // "Precisa de atenção" = score > 0 e < 60 (critério do Desktop)
            if (score > 0 && score < 60) atencaoCount++
            if (score > 0) { somaScores += score; qtdComScore++ }
        }

        scoreMedio = qtdComScore > 0 ? Math.round(somaScores / qtdComScore * 10) / 10 : 0
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
        scoreMedio,
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
            .select('score, date, created_at, measurements')
            .eq('atleta_id', atletaId)
            .order('date', { ascending: false })
            .limit(2),
    ])

    const medidas = medidasData ?? []
    const assessments = (assessData ?? []) as { score: number | null; date: string; created_at: string; measurements?: Record<string, unknown> }[]
    const ultima = medidas[0]
    const penultima = medidas[1]

    // Score: prioridade para assessments
    const scoreAtual = assessments[0]?.score ?? ultima?.score ?? 0
    const scoreSemanaAnterior = assessments[1]?.score ?? penultima?.score ?? 0
    const evolucaoSemana = Math.round((scoreAtual - scoreSemanaAnterior) * 10) / 10

    // Extrair medidas lineares: primeiro tenta tabela medidas, senão cai para assessments.measurements.linear
    let ombrosAtual = ultima?.ombros ?? 0
    let peitoralAtual = ultima?.peitoral ?? 0
    let cinturaAtual = ultima?.cintura ?? 0
    let ombrosAnterior = penultima?.ombros ?? 0
    let peitoralAnterior = penultima?.peitoral ?? 0
    let cinturaAnterior = penultima?.cintura ?? 0

    // Fallback: se medidas lineares estão zeradas, buscar de assessments.measurements.linear
    if (ombrosAtual === 0 && peitoralAtual === 0 && cinturaAtual === 0 && assessments.length > 0) {
        const linear0 = (assessments[0]?.measurements as { linear?: Record<string, number> })?.linear
        const linear1 = assessments.length > 1
            ? (assessments[1]?.measurements as { linear?: Record<string, number> })?.linear
            : undefined

        if (linear0) {
            ombrosAtual = linear0.shoulders ?? 0
            peitoralAtual = linear0.chest ?? 0
            cinturaAtual = linear0.waist ?? 0
        }
        if (linear1) {
            ombrosAnterior = linear1.shoulders ?? 0
            peitoralAnterior = linear1.chest ?? 0
            cinturaAnterior = linear1.waist ?? 0
        }
    }

    // Proporções resumidas com valor anterior para comparação
    const proporcoes: ProporçãoResumo[] = (ombrosAtual > 0 || peitoralAtual > 0 || cinturaAtual > 0) ? [
        {
            nome: 'Ombros',
            valor: ombrosAtual,
            valorAnterior: ombrosAnterior,
            meta: 135,
            percentual: Math.min(100, Math.round((ombrosAtual / 135) * 100))
        },
        {
            nome: 'Peitoral',
            valor: peitoralAtual,
            valorAnterior: peitoralAnterior,
            meta: 120,
            percentual: Math.min(100, Math.round((peitoralAtual / 120) * 100))
        },
        {
            nome: 'Cintura',
            valor: cinturaAtual,
            valorAnterior: cinturaAnterior,
            meta: 80,
            percentual: Math.min(100, Math.round((cinturaAtual / 80) * 100))
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
