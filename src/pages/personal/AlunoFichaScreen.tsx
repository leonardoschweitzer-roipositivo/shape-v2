/**
 * AlunoFichaScreen — Ficha Rápida do Aluno (sub-tela dentro de ALUNOS)
 *
 * Exibe: score, nível, evolução, proporções, streak e Insight IA.
 */

import React, { useEffect, useState } from 'react'
import { ChevronLeft, TrendingUp, TrendingDown, Flame, Trophy, Loader2, Sparkles } from 'lucide-react'
import type { FichaAlunoResumo } from '@/types/personal-portal'
import { buscarFichaAluno } from '@/services/personalPortal.service'
import { gerarConteudoIA } from '@/services/vitruviusAI'

interface AlunoFichaScreenProps {
    alunoId: string
    onVoltar: () => void
}

function NivelBadge({ nivel }: { nivel: string | null }) {
    if (!nivel) return null
    const cfg: Record<string, string> = {
        ELITE: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
        ATLETA: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
        EVOLUINDO: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
        INICIANDO: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
    }
    const estilo = cfg[nivel] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    return (
        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${estilo}`}>
            {nivel}
        </span>
    )
}

export function AlunoFichaScreen({ alunoId, onVoltar }: AlunoFichaScreenProps) {
    const [ficha, setFicha] = useState<FichaAlunoResumo | null>(null)
    const [loading, setLoading] = useState(true)
    const [insightLoading, setInsightLoading] = useState(false)
    const [insight, setInsight] = useState<string | null>(null)

    useEffect(() => {
        buscarFichaAluno(alunoId).then(data => {
            setFicha(data)
            setLoading(false)
        })
    }, [alunoId])

    const gerarInsight = async () => {
        if (!ficha || insightLoading) return
        setInsightLoading(true)

        const prompt = `Você é o Vitrúvio IA, assistente de um personal trainer.
Gere um insight CONCISO e ÚTIL (máximo 3 frases) para o personal sobre este aluno, focando no ponto mais importante para a próxima sessão.

Dados do aluno:
- Nome: ${ficha.nome}
- Score: ${ficha.score} pts (${ficha.nivel ?? 'sem nível'})
- Evolução semanal: ${ficha.evolucaoSemana > 0 ? '+' : ''}${ficha.evolucaoSemana} pts
- Streak de treinos no mês: ${ficha.streak}/${ficha.totalDiasMes} dias
- Proporções: ${ficha.proporcoes.map(p => `${p.nome}: ${p.valor}cm`).join(', ')}

Responda APENAS com o insight em português brasileiro, sem saudação, sem formatação markdown.`

        const resultado = await gerarConteudoIA<string>(prompt).catch(() => null)

        // Se retornou JSON (string dentro de JSON), tenta extrair
        let insightFinal: string | null = null
        if (typeof resultado === 'string') {
            insightFinal = resultado
        } else if (resultado && typeof resultado === 'object') {
            insightFinal = String(Object.values(resultado as Record<string, unknown>)[0] ?? '')
        }

        setInsight(insightFinal ?? `${ficha.nome} tem score ${ficha.score} pts. ${ficha.evolucaoSemana > 0 ? `Evolução positiva de +${ficha.evolucaoSemana} pts esta semana.` : 'Trabalhar a consistência de medições para acompanhar a evolução.'}`)
        setInsightLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
                <Loader2 className="text-[var(--color-gold)] animate-spin" size={36} />
            </div>
        )
    }

    if (!ficha) {
        return (
            <div className="min-h-screen bg-[#060B18] flex flex-col items-center justify-center px-6">
                <p className="text-gray-500 text-sm">Não foi possível carregar os dados do aluno.</p>
                <button onClick={onVoltar} className="mt-4 text-[var(--color-gold)] text-sm font-bold">
                    ← Voltar
                </button>
            </div>
        )
    }

    const consistenciaPct = ficha.totalDiasMes > 0
        ? Math.round((ficha.checkinsMes / ficha.totalDiasMes) * 100)
        : 0

    return (
        <div className="min-h-screen bg-[#060B18] pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-[#060B18] px-4 pt-5 pb-3 border-b border-white/5 z-10">
                <button onClick={onVoltar} className="flex items-center gap-1.5 text-gray-400 text-sm mb-3 hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                    <span>Alunos</span>
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-white text-xl font-black">{ficha.nome}</h1>
                        <p className="text-gray-500 text-xs mt-0.5">{ficha.email}</p>
                    </div>
                    <NivelBadge nivel={ficha.nivel} />
                </div>
            </div>

            <div className="px-4 pt-5 space-y-4">
                {/* Score */}
                <div className="bg-[#111827] rounded-2xl p-4 border border-white/5">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">📊 Score Shape-V</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[var(--color-gold)] text-4xl font-black">{ficha.score}</p>
                            <p className="text-gray-500 text-xs mt-0.5">pontos</p>
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-bold ${ficha.evolucaoSemana > 0 ? 'text-emerald-400' : ficha.evolucaoSemana < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                            {ficha.evolucaoSemana > 0
                                ? <TrendingUp size={16} />
                                : ficha.evolucaoSemana < 0
                                    ? <TrendingDown size={16} />
                                    : null}
                            {ficha.evolucaoSemana !== 0 && (
                                <span>{ficha.evolucaoSemana > 0 ? '+' : ''}{ficha.evolucaoSemana} esta semana</span>
                            )}
                            {ficha.evolucaoSemana === 0 && <span className="text-gray-600">Sem evolução semanal</span>}
                        </div>
                    </div>
                </div>

                {/* Proporções */}
                {ficha.proporcoes.length > 0 && (
                    <div className="bg-[#111827] rounded-2xl p-4 border border-white/5">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">📐 Proporções</p>
                        <div className="space-y-3">
                            {ficha.proporcoes.map(prop => (
                                <div key={prop.nome}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-300 text-sm">{prop.nome}</span>
                                        <span className="text-white text-sm font-semibold">{prop.valor} cm</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--color-gold)] rounded-full transition-all"
                                            style={{ width: `${Math.min(100, prop.percentual)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Consistência */}
                <div className="bg-[#111827] rounded-2xl p-4 border border-white/5">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">📅 Consistência</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Flame size={20} className="text-orange-400" />
                            <div>
                                <p className="text-white text-lg font-black">{ficha.streak}</p>
                                <p className="text-gray-500 text-xs">treinos no mês</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white text-lg font-black">{consistenciaPct}%</p>
                            <p className="text-gray-500 text-xs">consistência</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white text-sm font-semibold">{ficha.checkinsMes}/{ficha.totalDiasMes}</p>
                            <p className="text-gray-500 text-xs">dias treinados</p>
                        </div>
                    </div>
                </div>

                {/* Insight IA */}
                <div className="bg-[#111827] rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">🤖 Insight do Vitrúvio</p>
                        {!insight && !insightLoading && (
                            <button
                                onClick={gerarInsight}
                                className="flex items-center gap-1.5 bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--color-gold)]/30 hover:bg-[var(--color-gold)]/20 transition-colors"
                            >
                                <Sparkles size={12} />
                                Gerar
                            </button>
                        )}
                    </div>
                    {insightLoading && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 size={14} className="animate-spin" />
                            <span className="text-sm">Analisando...</span>
                        </div>
                    )}
                    {insight && (
                        <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
                    )}
                    {!insight && !insightLoading && (
                        <p className="text-gray-600 text-sm">Toque em "Gerar" para obter um insight personalizado sobre este aluno.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
