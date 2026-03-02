/**
 * AssessmentScreen - Tela AVALIAÇÃO do Portal do Atleta
 * 
 * Compositor que monta as 3 seções:
 * 1. Score Geral (hero)
 * 2. Diagnóstico Estético (composição corporal)
 * 3. Proporções Áureas (barras visuais 75-110%)
 * 4. Análise de Assimetria (E vs D)
 * 
 * Mobile-first com seções colapsáveis
 */

import React, { memo } from 'react'
import { ClipboardList } from 'lucide-react'
import { ScoreGeralAvaliacao } from './components/ScoreGeralAvaliacao'
import { DiagnosticoSection } from './components/DiagnosticoSection'
import { ProporcoesSection } from './components/ProporcoesSection'
import { AssimetriaSection } from './components/AssimetriaSection'
import type { AvaliacaoDados } from '@/types/assessment-evaluation.types'

interface AssessmentScreenProps {
    avaliacao: AvaliacaoDados | null
    isLoading?: boolean
}

function formatDate(date: Date): string {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${dias[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${meses[date.getMonth()]} ${date.getFullYear()}`
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
                Nenhuma Avaliação
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-[280px]">
                Peça ao seu Personal para realizar sua primeira avaliação física para
                ver seus resultados aqui.
            </p>
        </div>
    )
}

export const AssessmentScreen = memo(function AssessmentScreen({
    avaliacao,
    isLoading = false,
}: AssessmentScreenProps) {
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-500">Carregando avaliação...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#060B18] pb-20">
            {/* Header */}
            <div className="bg-[#060B18] border-b border-white/5 px-6 py-4">
                <h2 className="text-xl font-black text-white tracking-tight">
                    AVALIAÇÃO
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {avaliacao
                        ? `Última avaliação: ${formatDate(avaliacao.data)}`
                        : 'Sua análise física completa'
                    }
                </p>
            </div>

            {/* Content */}
            {!avaliacao ? (
                <EmptyState />
            ) : (
                <div className="px-4 py-4 space-y-4">
                    {/* 1. Score Geral */}
                    <ScoreGeralAvaliacao
                        scoreGeral={avaliacao.scoreGeral}
                        classificacao={avaliacao.classificacaoGeral}
                        emoji={avaliacao.emojiGeral}
                        scores={avaliacao.scores}
                        penalizacoes={avaliacao.penalizacoes}
                    />

                    {/* 2. Diagnóstico Estético */}
                    <DiagnosticoSection
                        diagnostico={avaliacao.diagnostico}
                    />

                    {/* 3. Proporções Áureas */}
                    <ProporcoesSection
                        proporcoes={avaliacao.proporcoes}
                        scoreTotal={avaliacao.scores.proporcoes.valor}
                    />

                    {/* 4. Análise de Assimetria */}
                    <AssimetriaSection
                        assimetria={avaliacao.assimetria}
                    />
                </div>
            )}
        </div>
    )
})
