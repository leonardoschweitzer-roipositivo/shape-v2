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
    RegistroAtividade,
    MetaProporcao,
} from '@/types/personal-portal'
import { buscarDadosConsistencia } from './consistencia.service'

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
 * Agora ampliada para incluir diagnóstico, últimas 3 atividades e metas.
 */
export async function buscarFichaAluno(atletaId: string): Promise<FichaAlunoResumo | null> {
    // 1. Buscar atleta
    const { data: atleta, error } = await supabase
        .from('atletas')
        .select('id, nome, email, foto_url, personal_id')
        .eq('id', atletaId)
        .single()

    if (error || !atleta) {
        console.error('[PersonalPortal] Erro ao buscar ficha:', error?.message)
        return null
    }

    // 2. Buscar ficha e diagnósticos/assessments
    // Unificar busca em registros_diarios (que contém treinos, dieta e trackers)
    const [
        { data: fichaData },
        { data: assessData },
        { data: registrosData },
        { data: diagConfirmadoData },
        { data: planoTreinoData }
    ] = await Promise.all([
        supabase.from('fichas').select('*').eq('atleta_id', atletaId).limit(1),
        supabase.from('assessments').select('*').eq('atleta_id', atletaId).order('date', { ascending: false }).limit(2),
        supabase.from('registros_diarios')
            .select('id, atleta_id, data, tipo, dados, created_at')
            .eq('atleta_id', atletaId)
            .order('data', { ascending: false })
            .limit(60),
        supabase.from('diagnosticos')
            .select('*')
            .eq('atleta_id', atletaId)
            .eq('status', 'confirmado')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(), // Use maybeSingle to avoid errors if not found
        supabase.from('planos_treino')
            .select('*')
            .eq('atleta_id', atletaId)
            .eq('status', 'ativo')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
    ])

    const ficha = fichaData?.[0]
    const assessments = (assessData ?? []) as any[]
    const registros = registrosData ?? []
    const diagConfirmado = diagConfirmadoData as any
    const planoTreinoRaw = planoTreinoData as any

    // 3. Processar Score e Composição
    // (Assumindo que trackers também estão em registros_diarios conforme portalHoje.ts)
    // No shape-v2, registros_diarios pode ter tipo 'treino', 'refeicao', 'agua', 'sono', 'peso', 'dor'
    const trackers = registros.filter(r => ['agua', 'sono', 'peso', 'dor', 'refeicao'].includes(r.tipo))

    // Extrair checkins (datas de treinos completos)
    const checkins = registros
        .filter(r => r.tipo === 'treino' && r.dados?.status === 'completo')
        .map(r => r.data)
    const ultimoAssess = assessments[0]
    const penultimoAssess = assessments[1]

    // Dados do diagnóstico: Priorizar o confirmado da tabela 'diagnosticos', fallback para o do último assessment
    const diagnostico = (diagConfirmado?.dados || ultimoAssess?.results || ultimoAssess?.diagnostico) as any
    const scoreAtual = ultimoAssess?.score ?? 0
    const scoreAnterior = penultimoAssess?.score ?? 0

    // 4. Mapear Medidas para o Card de Metas (Premium Standard)
    const measurements = ultimoAssess?.measurements as any
    const medidasDiag = diagnostico?._medidas as any
    const lastMedida = registros.find(r => r.tipo === 'peso')?.dados as any // Fallback rudimentar para peso

    const medidasParaCard = {
        ombros: Number(measurements?.linear?.shoulders || measurements?.ombros)
            || Number(medidasDiag?.ombros)
            || Number(ficha?.ombros) // Se existisse na ficha
            || 0,
        cintura: Number(measurements?.linear?.waist || measurements?.cintura)
            || Number(medidasDiag?.cintura)
            || 1,
        braco: (
            (Number(measurements?.linear?.arm_right) + Number(measurements?.linear?.arm_left)) / 2
            || (Number(measurements?.braco_direito) + Number(measurements?.braco_esquerdo)) / 2
            || (Number(medidasDiag?.bracoD) + Number(medidasDiag?.bracoE)) / 2
        ) || 0,
        antebraco: (
            (Number(measurements?.linear?.forearm_right) + Number(measurements?.linear?.forearm_left)) / 2
            || (Number(measurements?.antebraco_direito) + Number(measurements?.antebraco_esquerdo)) / 2
            || (Number(medidasDiag?.antebracoD) + Number(medidasDiag?.antebracoE)) / 2
        ) || 0,
        coxa: (
            (Number(measurements?.linear?.thigh_right) + Number(measurements?.linear?.thigh_left)) / 2
            || (Number(measurements?.coxa_direita) + Number(measurements?.coxa_esquerda)) / 2
            || (Number(medidasDiag?.coxaD) + Number(medidasDiag?.coxaE)) / 2
        ) || 0,
        panturrilha: (
            (Number(measurements?.linear?.calf_right) + Number(measurements?.linear?.calf_left)) / 2
            || (Number(measurements?.panturrilha_direita) + Number(measurements?.panturrilha_esquerda)) / 2
            || (Number(medidasDiag?.panturrilhaD) + Number(medidasDiag?.panturrilhaE)) / 2
        ) || 0,
        peitoral: Number(measurements?.linear?.chest || measurements?.peitoral) || Number(medidasDiag?.peitoral) || 0,
        punho: Number(ficha?.punho) || 0,
        joelho: Number(ficha?.joelho) || 0,
        tornozelo: Number(ficha?.tornozelo) || 0,
    }

    // 5. Mapear Registros Recentes (Para análise da IA e exibição no card)
    const ultimosRegistros: RegistroAtividade[] = []

    // Mapear TODOS os registros relevantes (limitando a 20 para não sobrecarregar)
    const todosMapeados = registros.slice(0, 20).map(r => {
        const tipos: Record<string, { label: string, emoji: string }> = {
            treino: { label: 'Treino', emoji: '🏋️' },
            refeicao: { label: 'Refeição', emoji: '🍽️' },
            agua: { label: 'Água', emoji: '💧' },
            sono: { label: 'Sono', emoji: '😴' },
            peso: { label: 'Peso', emoji: '⚖️' },
            dor: { label: 'Dor', emoji: '🚨' },
            feedback: { label: 'Feedback', emoji: '💬' }
        }
        const info = tipos[r.tipo] || { label: r.tipo, emoji: '📝' }

        let valorExibicao = '---'
        let descricaoExibicao = r.dados?.observacoes || r.dados?.local || info.label

        if (r.tipo === 'treino') {
            valorExibicao = r.dados?.status === 'completo' ? 'Concluído' : 'Pulado'
            descricaoExibicao = r.dados?.grupamento || r.dados?.observacoes || 'Treino do dia'
        } else if (r.tipo === 'refeicao') {
            valorExibicao = r.dados?.calorias ? `${r.dados.calorias} kcal` : 'Registrada'
        } else if (r.tipo === 'agua') {
            valorExibicao = r.dados?.quantidade ? `${r.dados.quantidade}ml` : 'Registrada'
        } else if (r.tipo === 'peso') {
            valorExibicao = r.dados?.quantidade ? `${r.dados.quantidade}kg` : '---'
        } else if (r.tipo === 'sono') {
            valorExibicao = r.dados?.quantidade ? `${r.dados.quantidade}h` : '---'
        } else if (r.tipo === 'dor') {
            valorExibicao = r.dados?.quantidade ? `${r.dados.quantidade}/10` : '---'
        }

        return {
            id: r.id,
            tipo: r.tipo.toUpperCase() as any,
            data: r.data,
            valor: valorExibicao,
            descricao: descricaoExibicao,
            emoji: info.emoji
        }
    })

    const combinados = todosMapeados.slice(0, 15) // Top 15 para os cards e IA

    // 5. Proporções e Metas
    const proporcoes: ProporçãoResumo[] = diagnostico?.analiseEstetica?.proporcoes?.slice(0, 3).map((p: any) => ({
        nome: p.grupo,
        valor: p.atual,
        valorAnterior: 0, // Poderia ser buscado do penúltimo assessment se necessário
        meta: p.ideal,
        percentual: p.pct
    })) ?? []

    const metasProporcoes: MetaProporcao[] = diagnostico?.metasProporcoes ?? []

    // 6. Streak e Consistência (Athlete Standard)
    const dadosConsistencia = await buscarDadosConsistencia(atletaId)

    return {
        id: atleta.id,
        nome: atleta.nome,
        email: atleta.email ?? '',
        telefone: ficha?.telefone ?? null,
        fotoUrl: atleta.foto_url ?? null,
        score: scoreAtual,
        nivel: scoreParaNivel(scoreAtual),
        evolucaoSemana: Math.round((scoreAtual - scoreAnterior) * 10) / 10,
        streak: dadosConsistencia.streakAtual,
        checkinsMes: checkins.filter(d => d.startsWith(new Date().toISOString().slice(0, 7))).length,
        totalDiasMes: new Date().getDate(),
        consistencia: dadosConsistencia.consistencia,
        recorde: dadosConsistencia.recorde,
        totalTreinos: dadosConsistencia.totalTreinos,
        tempoTotalMinutos: dadosConsistencia.tempoTotalMinutos,
        proximoBadge: dadosConsistencia.proximoBadge,
        proporcoes,
        insightIA: null,
        pessoalId: atleta.personal_id ?? '',
        // Novos campos
        sexo: ficha?.sexo,
        altura: ficha?.altura,
        peso: ultimoAssess?.weight || diagnostico?.composicaoAtual?.peso || 0,
        gorduraPct: ultimoAssess?.body_fat || diagnostico?.composicaoAtual?.gorduraPct || 0,
        massaMagra: diagnostico?.composicaoAtual?.massaMagra,
        scoreMeta3M: diagnostico?.analiseEstetica?.scoreMeta3M ?? (scoreAtual > 0 ? scoreAtual + 1.5 : 0),
        scoreMeta6M: diagnostico?.analiseEstetica?.scoreMeta6M,
        scoreMeta12M: diagnostico?.analiseEstetica?.scoreMeta12M,
        checkins: dadosConsistencia.checkins,
        medidas: medidasParaCard,
        diagnosticoDados: diagnostico,
        ultimosRegistros: combinados,
        metasProporcoes,
        planoTreino: planoTreinoRaw?.dados || null,
        evolucaoPlanCreatedAt: diagConfirmado?.created_at || diagConfirmadoData?.created_at || null
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
        .select('id, atleta_id, tipo, dados, created_at')
        .in('atleta_id', atletaIds)
        .order('created_at', { ascending: false })
        .limit(20)

    const atividades: AtividadeRecente[] = (registros ?? [])
        .filter(r => r.tipo === 'treino' && (r.dados?.status === 'completo' || r.dados?.status === 'pulado'))
        .slice(0, 5)
        .map(r => ({
            id: r.id,
            tipo: r.dados.status === 'completo' ? 'TREINO_COMPLETO' : 'TREINO_PULADO',
            alunoId: r.atleta_id,
            alunoNome: atletaMap[r.atleta_id] ?? 'Aluno',
            descricao: r.dados.status === 'completo'
                ? 'completou o treino de hoje'
                : 'pulou o treino de hoje',
            criadoEm: r.created_at,
        } as AtividadeRecente))

    return atividades
}
