/**
 * AlunoFichaScreen — Ficha Rápida do Aluno (sub-tela dentro de ALUNOS)
 *
 * Exibe: score, nível, evolução, proporções, streak e Insight IA.
 */

import React, { useEffect, useState } from 'react'
import { ChevronLeft, TrendingUp, TrendingDown, Flame, Trophy, Loader2, Sparkles, Camera, User } from 'lucide-react'
import type { FichaAlunoResumo } from '@/types/personal-portal'
import { buscarFichaAluno } from '@/services/personalPortal.service'
import { atletaService } from '@/services/atleta.service'
import { storageService } from '@/services/storage.service'
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
    const [uploading, setUploading] = useState(false)
    const [fotoUrl, setFotoUrl] = useState<string | null>(null)

    useEffect(() => {
        buscarFichaAluno(alunoId).then(data => {
            setFicha(data)
            setFotoUrl(data?.fotoUrl ?? null)
            setLoading(false)
        })
    }, [alunoId])

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !ficha) return

        try {
            setUploading(true)

            // 1. Upload para o Supabase Storage (bucket 'avatars')
            const fileName = `atleta-${alunoId}-${Date.now()}.jpg`
            const publicUrl = await storageService.uploadImage('avatars', `atleta-avatars/${fileName}`, file)

            // 2. Atualiza a URL na tabela 'atletas'
            const atualizado = await atletaService.atualizar(alunoId, { foto_url: publicUrl })

            if (atualizado) {
                setFotoUrl(publicUrl)
                // Opcional: Recarregar a ficha se necessário, mas alterar apenas a fotoUrl localmente já melhora UX
            }
        } catch (err) {
            console.error('[AlunoFicha] Erro ao trocar foto:', err)
            alert('Erro ao carregar a imagem. Verifique se o bucket "avatars" existe no seu Supabase.')
        } finally {
            setUploading(false)
        }
    }

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
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="text-[var(--color-accent)] animate-spin" size={36} />
            </div>
        )
    }

    if (!ficha) {
        return (
            <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center px-6">
                <p className="text-gray-500 text-sm">Não foi possível carregar os dados do aluno.</p>
                <button onClick={onVoltar} className="mt-4 text-[var(--color-accent)] text-sm font-bold">
                    ← Voltar
                </button>
            </div>
        )
    }

    const consistenciaPct = ficha.totalDiasMes > 0
        ? Math.round((ficha.checkinsMes / ficha.totalDiasMes) * 100)
        : 0

    return (
        <div className="min-h-screen bg-background-dark pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-background-dark px-4 pt-5 pb-3 border-b border-white/5 z-10">
                <button onClick={onVoltar} className="flex items-center gap-1.5 text-gray-400 text-sm mb-3 hover:text-white transition-colors">
                    <ChevronLeft size={18} />
                    <span>Alunos</span>
                </button>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar com Upload */}
                        <div className="relative group shrink-0">
                            <label className="cursor-pointer block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                                <div className="w-14 h-14 rounded-full bg-[var(--bg-card)] flex items-center justify-center border-2 border-white/10 overflow-hidden relative overflow-hidden">
                                    {uploading ? (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 text-white animate-spin">
                                            <Loader2 size={20} />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                                            <Camera size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                    {fotoUrl ? (
                                        <img src={fotoUrl} alt={ficha.nome} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-600" size={24} />
                                    )}
                                </div>
                                {/* Badge de edição no mobile (Always Visible) */}
                                <div className="absolute -bottom-1 -right-1 bg-[var(--color-accent)] text-black p-1 rounded-full border-2 border-background-dark">
                                    <Camera size={10} />
                                </div>
                            </label>
                        </div>
                        <div>
                            <h1 className="text-white text-xl font-black">{ficha.nome}</h1>
                            <p className="text-gray-500 text-xs mt-0.5">{ficha.email}</p>
                        </div>
                    </div>
                    <NivelBadge nivel={ficha.nivel} />
                </div>
            </div>

            <div className="px-4 pt-5 space-y-4">
                {/* Score */}
                <div className="bg-surface rounded-2xl p-4 border border-white/5">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">📊 Score Shape-V</p>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[var(--color-accent)] text-4xl font-black">{ficha.score}</p>
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
                    <div className="bg-surface rounded-2xl p-4 border border-white/5">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">📐 Proporções</p>
                        <div className="space-y-4">
                            {ficha.proporcoes.map(prop => {
                                const delta = prop.valorAnterior > 0 ? +(prop.valor - prop.valorAnterior).toFixed(1) : null
                                const cresceu = delta !== null && delta > 0
                                const diminuiu = delta !== null && delta < 0
                                return (
                                    <div key={prop.nome}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-gray-300 text-sm">{prop.nome}</span>
                                            <div className="flex items-center gap-2">
                                                {/* Medidas lineares: anterior → atual */}
                                                {prop.valorAnterior > 0 ? (
                                                    <span className="text-gray-500 text-xs font-mono">
                                                        {prop.valorAnterior}cm
                                                        <span className="mx-1 text-gray-600">→</span>
                                                        <span className={cresceu ? 'text-emerald-400' : diminuiu ? 'text-red-400' : 'text-white'}>
                                                            {prop.valor}cm
                                                        </span>
                                                        {delta !== null && delta !== 0 && (
                                                            <span className={`ml-1 text-[10px] font-bold ${cresceu ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                ({cresceu ? '+' : ''}{delta})
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-white text-sm font-semibold">{prop.valor} cm</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--color-accent)] rounded-full transition-all"
                                                style={{ width: `${Math.min(100, prop.percentual)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-0.5">
                                            <span className="text-gray-600 text-[10px]">{prop.percentual}% do ideal</span>
                                            <span className="text-gray-600 text-[10px]">meta: {prop.meta}cm</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Consistência */}
                <div className="bg-surface rounded-2xl p-4 border border-white/5">
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
                <div className="bg-surface rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">🤖 Insight do Vitrúvio</p>
                        {!insight && !insightLoading && (
                            <button
                                onClick={gerarInsight}
                                className="flex items-center gap-1.5 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/20 transition-colors"
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
