/**
 * Gerador de Resumos Periódicos — VITRU IA
 *
 * Roda no login do Personal e gera resumos (diário/semanal/mensal)
 * com base nos dados agregados dos alunos.
 *
 * Usa localStorage para rastrear a última geração de cada tipo.
 */

import { supabase } from './supabase'
import { notificacaoService } from './notificacao.service'
import type { CriarNotificacaoDTO, ConfigNotificacoesPersonal } from '@/types/notificacao.types'

// ===== Helpers de Date =====

function getInicioHoje(): Date {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}

function getInicioOntem(): Date {
    const d = getInicioHoje()
    d.setDate(d.getDate() - 1)
    return d
}

function getInicioSemana(): Date {
    const d = getInicioHoje()
    // Segunda-feira anterior
    const day = d.getDay()
    const diff = day === 0 ? 6 : day - 1 // Ajustar para seg=0
    d.setDate(d.getDate() - diff)
    return d
}

function getInicioMesAnterior(): Date {
    const d = getInicioHoje()
    d.setDate(1) // Primeiro dia do mês atual
    d.setMonth(d.getMonth() - 1) // Mês anterior
    return d
}

function getFimMesAnterior(): Date {
    const d = getInicioHoje()
    d.setDate(0) // Último dia do mês anterior
    d.setHours(23, 59, 59, 999)
    return d
}

function formatarData(d: Date): string {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

const MESES_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

// ===== Buscar dados agregados =====

interface DadosResumo {
    totalAlunos: number
    treinosCompletos: number
    treinosPulados: number
    alunosQueTrainaram: number
    alunosSemTreino: number
    novasMedicoes: number
    dorReportada: number
    nomesMaisAtivos: string[]
    nomesMenosAtivos: string[]
}

async function buscarDadosResumo(
    personalId: string,
    dataInicio: Date,
    dataFim: Date
): Promise<DadosResumo> {
    const inicioStr = dataInicio.toISOString().slice(0, 10)
    const fimStr = dataFim.toISOString().slice(0, 10)

    // 1. Buscar alunos ativos
    const { data: atletas } = await supabase
        .from('atletas')
        .select('id, nome')
        .eq('personal_id', personalId)
        .eq('ativo', true)

    const listaAtletas = (atletas || []) as Array<{ id: string; nome: string }>
    const totalAlunos = listaAtletas.length
    if (totalAlunos === 0) {
        return {
            totalAlunos: 0, treinosCompletos: 0, treinosPulados: 0,
            alunosQueTrainaram: 0, alunosSemTreino: 0, novasMedicoes: 0,
            dorReportada: 0, nomesMaisAtivos: [], nomesMenosAtivos: [],
        }
    }

    const atletaIds = listaAtletas.map(a => a.id)

    // 2. Buscar registros de treino no período
    const { data: registros } = await supabase
        .from('registros_diarios')
        .select('atleta_id, dados')
        .in('atleta_id', atletaIds)
        .eq('tipo', 'treino')
        .gte('data', inicioStr)
        .lte('data', fimStr)

    const regsArr = (registros || []) as Array<{ atleta_id: string; dados: Record<string, unknown> }>

    let treinosCompletos = 0
    let treinosPulados = 0
    const atletasComTreino = new Set<string>()
    const contagemPorAtleta = new Map<string, number>()

    for (const r of regsArr) {
        const status = (r.dados as Record<string, unknown>)?.status as string
        if (status === 'completo') {
            treinosCompletos++
            atletasComTreino.add(r.atleta_id)
            contagemPorAtleta.set(r.atleta_id, (contagemPorAtleta.get(r.atleta_id) || 0) + 1)
        } else if (status === 'pulado') {
            treinosPulados++
        }
    }

    // 3. Buscar novas medições
    const { count: novasMedicoes } = await supabase
        .from('medidas')
        .select('id', { count: 'exact', head: true })
        .in('atleta_id', atletaIds)
        .gte('data', inicioStr)
        .lte('data', fimStr)

    // 4. Buscar relatos de dor
    const { data: dorRegistros } = await supabase
        .from('registros_diarios')
        .select('id')
        .in('atleta_id', atletaIds)
        .eq('tipo', 'dor')
        .gte('data', inicioStr)
        .lte('data', fimStr)

    // 5. Mapear nomes mais/menos ativos
    const atletasOrdenados = [...contagemPorAtleta.entries()]
        .sort((a, b) => b[1] - a[1])

    const nomesMaisAtivos = atletasOrdenados
        .slice(0, 3)
        .map(([id]) => listaAtletas.find(a => a.id === id)?.nome || 'Atleta')

    const alunosSemTreino = totalAlunos - atletasComTreino.size
    const atletasSemTreino = listaAtletas
        .filter(a => !atletasComTreino.has(a.id))
        .slice(0, 3)
        .map(a => a.nome)

    return {
        totalAlunos,
        treinosCompletos,
        treinosPulados,
        alunosQueTrainaram: atletasComTreino.size,
        alunosSemTreino,
        novasMedicoes: novasMedicoes || 0,
        dorReportada: (dorRegistros || []).length,
        nomesMaisAtivos,
        nomesMenosAtivos: atletasSemTreino,
    }
}

// ===== Chaves de controle no localStorage =====

function getStorageKey(personalId: string, tipo: string): string {
    return `vitru-resumo-${tipo}-${personalId}`
}

function getUltimaGeracao(personalId: string, tipo: string): Date | null {
    const raw = localStorage.getItem(getStorageKey(personalId, tipo))
    return raw ? new Date(raw) : null
}

function marcarGerado(personalId: string, tipo: string): void {
    localStorage.setItem(getStorageKey(personalId, tipo), new Date().toISOString())
}

// ===== Verificar se é hora de gerar =====

function devGerarDiario(personalId: string): boolean {
    const ultima = getUltimaGeracao(personalId, 'diario')
    if (!ultima) return true
    // Gerar se a última geração foi antes de hoje
    return ultima < getInicioHoje()
}

function devGerarSemanal(personalId: string): boolean {
    const ultima = getUltimaGeracao(personalId, 'semanal')
    if (!ultima) return true
    // Gerar se hoje é segunda (ou se nunca gerou esta semana)
    const hoje = new Date()
    const ehSegunda = hoje.getDay() === 1
    return ehSegunda && ultima < getInicioHoje()
}

function devGerarMensal(personalId: string): boolean {
    const ultima = getUltimaGeracao(personalId, 'mensal')
    if (!ultima) return true
    // Gerar se hoje é dia 1 (ou primeiros 3 dias) e última geração foi mês passado
    const hoje = new Date()
    const ehInicioMes = hoje.getDate() <= 3
    return ehInicioMes && ultima < getInicioHoje()
}

// ===== Gerador Principal =====

/**
 * Gera resumos pendentes (diário/semanal/mensal).
 * Deve ser chamado 1x por sessão, após o inactivity check.
 */
export async function gerarResumosPendentes(personalId: string): Promise<number> {
    // Buscar config do personal para saber quais resumos estão ativados
    const config = await notificacaoService.buscarConfig(personalId)
    let criados = 0

    // ===== DIÁRIO =====
    if (config.resumos.diario && devGerarDiario(personalId)) {
        const ontem = getInicioOntem()
        const fimOntem = new Date(ontem)
        fimOntem.setHours(23, 59, 59, 999)

        const dados = await buscarDadosResumo(personalId, ontem, fimOntem)

        if (dados.totalAlunos > 0) {
            const notif: CriarNotificacaoDTO = {
                personal_id: personalId,
                tipo: 'RESUMO_DIARIO',
                categoria: 'resumo',
                prioridade: 'baixa',
                titulo: `📊 Resumo de ontem (${formatarData(ontem)})`,
                mensagem: montarMensagemResumo(dados, 'ontem'),
                dados: { ...dados, periodo: 'diario', dataInicio: ontem.toISOString() },
                grupo_id: `resumo-diario-${ontem.toISOString().slice(0, 10)}`,
            }
            const resultado = await notificacaoService.criar(notif)
            if (resultado) criados++
        }
        marcarGerado(personalId, 'diario')
    }

    // ===== SEMANAL =====
    if (config.resumos.semanal && devGerarSemanal(personalId)) {
        const inicioSemana = getInicioSemana()
        // Semana passada
        const inicioSemPassada = new Date(inicioSemana)
        inicioSemPassada.setDate(inicioSemPassada.getDate() - 7)
        const fimSemPassada = new Date(inicioSemana)
        fimSemPassada.setDate(fimSemPassada.getDate() - 1)
        fimSemPassada.setHours(23, 59, 59, 999)

        const dados = await buscarDadosResumo(personalId, inicioSemPassada, fimSemPassada)

        if (dados.totalAlunos > 0) {
            const notif: CriarNotificacaoDTO = {
                personal_id: personalId,
                tipo: 'RESUMO_SEMANAL',
                categoria: 'resumo',
                prioridade: 'normal',
                titulo: `📊 Resumo da semana (${formatarData(inicioSemPassada)} — ${formatarData(fimSemPassada)})`,
                mensagem: montarMensagemResumo(dados, 'na semana'),
                dados: { ...dados, periodo: 'semanal', dataInicio: inicioSemPassada.toISOString(), dataFim: fimSemPassada.toISOString() },
                grupo_id: `resumo-semanal-${inicioSemPassada.toISOString().slice(0, 10)}`,
            }
            const resultado = await notificacaoService.criar(notif)
            if (resultado) criados++
        }
        marcarGerado(personalId, 'semanal')
    }

    // ===== MENSAL =====
    if (config.resumos.mensal && devGerarMensal(personalId)) {
        const inicioMes = getInicioMesAnterior()
        const fimMes = getFimMesAnterior()
        const nomeMes = MESES_PT[inicioMes.getMonth()]

        const dados = await buscarDadosResumo(personalId, inicioMes, fimMes)

        if (dados.totalAlunos > 0) {
            const notif: CriarNotificacaoDTO = {
                personal_id: personalId,
                tipo: 'RESUMO_MENSAL',
                categoria: 'resumo',
                prioridade: 'normal',
                titulo: `📊 Relatório de ${nomeMes}`,
                mensagem: montarMensagemResumo(dados, `em ${nomeMes}`),
                dados: { ...dados, periodo: 'mensal', mes: nomeMes, dataInicio: inicioMes.toISOString(), dataFim: fimMes.toISOString() },
                grupo_id: `resumo-mensal-${inicioMes.toISOString().slice(0, 7)}`,
            }
            const resultado = await notificacaoService.criar(notif)
            if (resultado) criados++
        }
        marcarGerado(personalId, 'mensal')
    }

    if (criados > 0) {
        console.info(`[gerarResumosPendentes] ${criados} resumo(s) gerado(s)`)
    }

    return criados
}

// ===== Mensagem do resumo =====

function montarMensagemResumo(dados: DadosResumo, periodoLabel: string): string {
    const partes: string[] = []

    // Treinos
    if (dados.treinosCompletos > 0 || dados.treinosPulados > 0) {
        partes.push(`💪 ${dados.treinosCompletos} treinos completos, ${dados.treinosPulados} pulados`)
    }

    // Frequência
    partes.push(`👥 ${dados.alunosQueTrainaram}/${dados.totalAlunos} alunos treinaram ${periodoLabel}`)

    // Sem treino
    if (dados.alunosSemTreino > 0) {
        const nomes = dados.nomesMenosAtivos.length > 0
            ? ` (${dados.nomesMenosAtivos.join(', ')})`
            : ''
        partes.push(`⚠️ ${dados.alunosSemTreino} aluno(s) não treinaram${nomes}`)
    }

    // Medições
    if (dados.novasMedicoes > 0) {
        partes.push(`📏 ${dados.novasMedicoes} nova(s) medição(ões)`)
    }

    // Dor
    if (dados.dorReportada > 0) {
        partes.push(`🩹 ${dados.dorReportada} reporte(s) de dor`)
    }

    // Mais ativos
    if (dados.nomesMaisAtivos.length > 0) {
        partes.push(`⭐ Mais ativos: ${dados.nomesMaisAtivos.join(', ')}`)
    }

    return partes.join(' • ')
}
