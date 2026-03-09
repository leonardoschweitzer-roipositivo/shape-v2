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
import { ClipboardList, Camera } from 'lucide-react'
import { ScoreGeralAvaliacao } from './components/ScoreGeralAvaliacao'
import { DiagnosticoSection } from './components/DiagnosticoSection'
import { ProporcoesSection } from './components/ProporcoesSection'
import { AssimetriaSection } from './components/AssimetriaSection'
import { HeaderIdentidade } from './components/HeaderIdentidade'
import type { AvaliacaoDados } from '@/types/assessment-evaluation.types'

interface AssessmentScreenProps {
    avaliacao: AvaliacaoDados | null
    isLoading?: boolean
    nomeAtleta?: string
    sexo?: string
    altura?: number
    peso?: number
    personalNome?: string
    onStartVirtualAssessment?: () => void
}

function formatDate(date: Date): string {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    return `${dias[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${meses[date.getMonth()]} ${date.getFullYear()}`
}

function EmptyState({ onStartVirtual }: { onStartVirtual?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                <ClipboardList size={28} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
                Nenhuma Avaliação
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-[280px] mb-6">
                Peça ao seu Personal para realizar sua primeira avaliação física ou
                faça uma avaliação virtual por foto.
            </p>
            {onStartVirtual && (
                <button
                    onClick={onStartVirtual}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-black uppercase tracking-wider hover:bg-indigo-500 active:scale-[0.97] transition-all"
                >
                    <Camera size={16} />
                    Avaliação Virtual
                </button>
            )}
        </div>
    )
}

export const AssessmentScreen = memo(function AssessmentScreen({
    avaliacao,
    isLoading = false,
    nomeAtleta,
    sexo,
    altura,
    peso,
    personalNome,
    onStartVirtualAssessment,
}: AssessmentScreenProps) {
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-500">Carregando avaliação...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background-dark pb-20">
            {/* Header */}
            <HeaderIdentidade
                nome={nomeAtleta || 'Atleta'}
                sexo={sexo === 'M' ? 'MASCULINO' : 'FEMININO'}
                altura={altura ?? 0}
                peso={peso ?? 0}
                fotoUrl={undefined}
                personalNome={personalNome}
                personalRanking={3}
            />

            {/* Content */}
            {!avaliacao ? (
                <EmptyState onStartVirtual={onStartVirtualAssessment} />
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

            {/* Botão flutuante de avaliação virtual (quando já tem avaliação) */}
            {avaliacao && onStartVirtualAssessment && (
                <div className="fixed bottom-24 right-4 z-40">
                    <button
                        onClick={onStartVirtualAssessment}
                        className="flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 text-white text-xs font-black uppercase shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 active:scale-[0.95] transition-all"
                    >
                        <Camera size={14} />
                        Nova Avaliação Virtual
                    </button>
                </div>
            )}
        </div>
    )
})
