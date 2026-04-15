/**
 * Histórico de Treinos — busca registros completos de treino do aluno
 * para alimentar gráficos de progressão (carga e volume) na ficha do aluno.
 */
import { supabase } from '@/services/supabase'
import type { SupaRegistroDiario } from '@/services/portal/portalTypes'

export type PeriodoHistorico = '1m' | '3m' | '6m' | 'tudo'

export function calcularDataInicio(periodo: PeriodoHistorico): string {
    if (periodo === 'tudo') return '1970-01-01'
    const meses = periodo === '1m' ? 1 : periodo === '3m' ? 3 : 6
    const d = new Date()
    d.setMonth(d.getMonth() - meses)
    return d.toISOString().slice(0, 10)
}

export async function buscarHistoricoTreinos(
    atletaId: string,
    dataInicio: string,
): Promise<SupaRegistroDiario[]> {
    const { data, error } = await supabase
        .from('registros_diarios')
        .select('id, atleta_id, data, tipo, dados, created_at')
        .eq('atleta_id', atletaId)
        .eq('tipo', 'treino')
        .gte('data', dataInicio)
        .order('data', { ascending: true })

    if (error) {
        console.error('[historicoTreinosService] erro ao buscar registros:', error)
        return []
    }

    return (data ?? []).filter((r) => {
        const status = (r.dados as Record<string, unknown> | null)?.status
        return status === 'completo'
    }) as SupaRegistroDiario[]
}
