/**
 * ProgressScreen - Tela PROGRESSO do Portal do Atleta
 * 
 * Mostra evolução do score, gráfico, proporções e histórico
 */

import React from 'react'
import { CardScoreGeral } from '../../components/organisms/CardScoreGeral'
import { GraficoEvolucao } from '../../components/organisms/GraficoEvolucao'
import { ListaProporcoesResumo } from '../../components/organisms/ListaProporcoesResumo'
import { HistoricoAvaliacoes } from '../../components/organisms/HistoricoAvaliacoes'
import { ScoreGeral, GraficoEvolucaoData, ProporcaoResumo } from '../../types/athlete-portal'

interface ProgressScreenProps {
    scoreGeral: ScoreGeral
    graficoEvolucao: GraficoEvolucaoData
    proporcoes: ProporcaoResumo[]
    historicoAvaliacoes: Array<{
        id: string
        data: Date
        score: number
        classificacao: string
    }>
    onVerDetalhesAvaliacao: (id: string) => void
}

export function ProgressScreen({
    scoreGeral,
    graficoEvolucao,
    proporcoes,
    historicoAvaliacoes,
    onVerDetalhesAvaliacao
}: ProgressScreenProps) {
    return (
        <div className="min-h-screen bg-[#060B18] pb-20">
            {/* Header */}
            <div className="bg-[#060B18] border-b border-white/5 px-6 py-4">
                <h2 className="text-xl font-black text-white tracking-tight">PROGRESSO</h2>
                <p className="text-sm text-gray-500 mt-1">Acompanhe sua evolução</p>
            </div>

            {/* Content */}
            <div className="px-4 py-4 space-y-6">
                {/* Score Geral */}
                <CardScoreGeral score={scoreGeral} />

                {/* Gráfico de Evolução */}
                <GraficoEvolucao dados={graficoEvolucao} />

                {/* Top 3 Proporções */}
                <ListaProporcoesResumo proporcoes={proporcoes} />

                {/* Histórico de Avaliações */}
                <HistoricoAvaliacoes
                    avaliacoes={historicoAvaliacoes}
                    onVerDetalhes={onVerDetalhesAvaliacao}
                />
            </div>
        </div>
    )
}
