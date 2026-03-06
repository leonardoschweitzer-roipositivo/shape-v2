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

    // Buscar contadores de alunos
    const { data: atletas } = await supabase
        .from('atletas')
        .select('id, medidas(created_at)')
        .eq('personal_id', personalId)

    let ativos = 0
    let atencao = 0
    let inativos = 0

    for (const atleta of atletas ?? []) {
        const medidas = (atleta as { medidas?: { created_at: string }[] }).medidas ?? []
        const ultima = medidas.length > 0
            ? medidas.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
            : null
        const status = classificarStatus(ultima)
        if (status === 'ATIVO') ativos++
        else if (status === 'ATENCAO') atencao++
        else inativos++
    }

    return {
        personalId: personal.id,
        nome: personal.nome,
        email: personal.email,
        fotoUrl: personal.foto_url ?? null,
        totalAlunos: (atletas ?? []).length,
        alunosAtivos: ativos,
        alunosAtencao: atencao,
        alunosInativos: inativos,
    }
}

// ===== Dados Principais =====

/**
 * Lista todos os alunos do personal com score, status e última medição.
 * Usado na Tab ALUNOS e na seção "Precisam de Atenção" da Home.
 */
export async function listarAlunos(personalId: string): Promise<AlunoCard[]> {
    const { data: atletas, error } = await supabase
        .from('atletas')
        .select(`
            id,
            nome,
            email,
            foto_url,
            medidas (
                id,
                created_at,
                score_shape_v
            )
        `)
        .eq('personal_id', personalId)
        .order('nome', { ascending: true })

    if (error || !atletas) {
        console.error('[PersonalPortal] Erro ao listar alunos:', error?.message)
        return []
    }

    const hoje = new Date()
    const inicioSemana = new Date(hoje)
    inicioSemana.setDate(hoje.getDate() - 7)

    return atletas.map((atleta) => {
        const medidas = ((atleta as { medidas?: { id: string; created_at: string; score_shape_v: number | null }[] }).medidas ?? [])
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        const ultimaMedicao = medidas[0]?.created_at ?? null
        const scoreAtual = medidas[0]?.score_shape_v ?? 0

        // Calcula evolução semanal
        const medidasSemana = medidas.filter(m => new Date(m.created_at) >= inicioSemana)
        const scoreSemanaAnterior = medidasSemana.length > 1
            ? medidasSemana[medidasSemana.length - 1].score_shape_v ?? 0
            : 0
        const evolucaoSemana = scoreAtual - scoreSemanaAnterior

        return {
            id: atleta.id,
            nome: atleta.nome,
            email: atleta.email,
            fotoUrl: (atleta as { foto_url?: string | null }).foto_url ?? null,
            score: scoreAtual,
            nivel: scoreParaNivel(scoreAtual),
            status: classificarStatus(ultimaMedicao),
            ultimaMedicao,
            evolucaoSemana: Math.round(evolucaoSemana * 10) / 10,
            streak: 0, // TODO: calcular streak via registros_diarios
        } as AlunoCard
    })
}

/**
 * Busca a ficha rápida de um aluno específico (para a sub-tela de Ficha).
 */
export async function buscarFichaAluno(atletaId: string): Promise<FichaAlunoResumo | null> {
    const { data: atleta, error } = await supabase
        .from('atletas')
        .select(`
            id, nome, email, foto_url,
            fichas (telefone, personal_id),
            medidas (
                created_at, score_shape_v,
                ombros, peito, cintura, quadril, braco_d, coxa_d
            )
        `)
        .eq('id', atletaId)
        .single()

    if (error || !atleta) {
        console.error('[PersonalPortal] Erro ao buscar ficha:', error?.message)
        return null
    }

    const fichas = (atleta as { fichas?: { telefone?: string; personal_id: string }[] }).fichas ?? []
    const ficha = fichas[0]

    const medidas = ((atleta as { medidas?: { created_at: string; score_shape_v: number | null; ombros?: number; peito?: number; cintura?: number; quadril?: number; braco_d?: number; coxa_d?: number }[] }).medidas ?? [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const ultima = medidas[0]
    const scoreAtual = ultima?.score_shape_v ?? 0
    const scoreSemanaAnterior = medidas[1]?.score_shape_v ?? 0
    const evolucaoSemana = Math.round((scoreAtual - scoreSemanaAnterior) * 10) / 10

    const penultima = medidas[1] // medição anterior para comparação

    // Proporções resumidas a partir da última medição (com valor anterior para comparação)
    const proporcoes: ProporçãoResumo[] = ultima ? [
        {
            nome: 'Ombros',
            valor: ultima.ombros ?? 0,
            valorAnterior: penultima?.ombros ?? 0,
            meta: 135,
            percentual: Math.min(100, Math.round(((ultima.ombros ?? 0) / 135) * 100))
        },
        {
            nome: 'Peito',
            valor: ultima.peito ?? 0,
            valorAnterior: penultima?.peito ?? 0,
            meta: 120,
            percentual: Math.min(100, Math.round(((ultima.peito ?? 0) / 120) * 100))
        },
        {
            nome: 'Cintura',
            valor: ultima.cintura ?? 0,
            valorAnterior: penultima?.cintura ?? 0,
            meta: 80,
            percentual: Math.min(100, Math.round(((ultima.cintura ?? 0) / 80) * 100))
        },
    ].filter(p => p.valor > 0) : []

    // Streak e check-ins (simplificado — busca registros do mês)
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

    return {
        id: atleta.id,
        nome: atleta.nome,
        email: atleta.email,
        telefone: ficha?.telefone ?? null,
        fotoUrl: (atleta as { foto_url?: string | null }).foto_url ?? null,
        score: scoreAtual,
        nivel: scoreParaNivel(scoreAtual),
        evolucaoSemana,
        streak: checkinsMes, // Estimativa simples
        checkinsMes,
        totalDiasMes,
        proporcoes: proporcoes.slice(0, 3),
        insightIA: null, // gerado sob demanda
        pessoalId: ficha?.personal_id ?? '',
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
