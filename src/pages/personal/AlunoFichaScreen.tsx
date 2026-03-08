import React, { useEffect, useState } from 'react'
import { ChevronLeft, TrendingUp, TrendingDown, Flame, Trophy, Loader2, Sparkles, Camera, User } from 'lucide-react'
import type { FichaAlunoResumo } from '@/types/personal-portal'
import { HeaderAluno } from './components/HeaderAluno'
import { CardConsistenciaPersonal } from './components/CardConsistenciaPersonal'
import { CardUltimosRegistros } from './components/CardUltimosRegistros'
import { CardMetasTrimestrePersonal } from './components/CardMetasTrimestrePersonal'
import { CardTreinosAccordion } from './components/CardTreinosAccordion'
import { buscarFichaAluno } from '@/services/personalPortal.service'
import { atletaService } from '@/services/atleta.service'
import { storageService } from '@/services/storage.service'
import { gerarConteudoIA } from '@/services/vitruviusAI'
import { getFontesCientificas } from '@/services/vitruviusContext'

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
        <span className={`text - [10px] font - black uppercase tracking - wider px - 2 py - 0.5 rounded - full border ${estilo} `}>
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
            const fileName = `atleta - ${alunoId} -${Date.now()}.jpg`
            const publicUrl = await storageService.uploadImage('avatars', `atleta - avatars / ${fileName} `, file)

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

        // Buscar fontes científicas para o prompt
        const fontes = getFontesCientificas('diagnostico')

        const prompt = `Você é o Vitrúvio IA, um assistente científico de alta performance para personal trainers.
Analise os dados reais do aluno ${ficha.nome} e gere um insight TÉCNICO, ANALÍTICO e EMBASADO.

DADOS REAIS DO ALUNO:
- Score Atual: ${ficha.score} pts(Meta 12M: ${ficha.scoreMeta12M} pts)
    - Consistência Anual: ${ficha.consistencia}% (Streak Atual: ${ficha.streak} dias)
- Últimos Registros: ${ficha.ultimosRegistros.map(r => `${r.valor} (${r.descricao || 'sem detalhes'})`).join(', ')}
- Composição: BF ${ficha.gorduraPct?.toFixed(1)}%, Massa Magra ${ficha.massaMagra?.toFixed(1)} kg, Peso ${ficha.peso} kg

FONTES CIENTÍFICAS DISPONÍVEIS:
${fontes}

REGRAS OBRIGATÓRIAS:
1. Cite pelo menos UMA fonte científica específica(ex: Schoenfeld, Morton, ACSM) para embasar sua recomendação.
2. Seja direto e profissional(máximo 4 frases).
3. Foque na ação prática que o Personal deve tomar na próxima sessão com base nos últimos registros e na consistência.

Responda APENAS com o insight em português brasileiro, use tom de consultor técnico.`

        const resultado = await gerarConteudoIA<string>(prompt).catch(() => null)

        let insightFinal: string | null = null
        if (typeof resultado === 'string') {
            insightFinal = resultado
        } else if (resultado && typeof resultado === 'object') {
            insightFinal = String(Object.values(resultado as Record<string, unknown>)[0] ?? '')
        }

        setInsight(insightFinal ?? `${ficha.nome} mantém ${ficha.checkinsMes} treinos no mês.Segundo Schoenfeld(2017), a consistência é o pilar primário da hipertrofia.Continue monitorando os feedbacks recentes para ajustes finos.`)
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
            <HeaderAluno
                nome={ficha.nome}
                email={ficha.email}
                fotoUrl={fotoUrl}
                nivel={ficha.nivel}
                loading={loading}
                uploading={uploading}
                onVoltar={onVoltar}
                onAvatarUpload={handleAvatarUpload}
            />

            <div className="px-4 py-6 space-y-6">
                {/* 1. Card de Consistência + Heatmap (Ordem solicitada) */}
                <CardConsistenciaPersonal
                    checkins={ficha.checkins}
                    streakAtual={ficha.streak}
                    recorde={ficha.recorde}
                    totalTreinos={ficha.totalTreinos}
                    consistencia={ficha.consistencia}
                    tempoTotalMinutos={ficha.tempoTotalMinutos}
                    proximoBadge={ficha.proximoBadge}
                    atletaId={alunoId}
                    startDateOverride={ficha.evolucaoPlanCreatedAt}
                />

                {/* 1.1 Accordion de Treinos (Nova funcionalidade conforme pedido) */}
                <CardTreinosAccordion
                    planoTreino={ficha.planoTreino}
                    atletaId={alunoId}
                />

                {/* 2. Últimos Registros */}
                <CardUltimosRegistros registros={ficha.ultimosRegistros} />

                {/* 3. Insight do Vitrúvio */}
                <div className="bg-surface-deep rounded-3xl p-5 border border-white/5 shadow-xl transition-all hover:border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={40} className="text-indigo-400" />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Sparkles size={18} className="text-indigo-400" />
                            </div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Insight do Vitrúvio</h3>
                        </div>
                        {!insight && !insightLoading && (
                            <button
                                onClick={gerarInsight}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                            >
                                Gerar Insight
                            </button>
                        )}
                    </div>

                    {insightLoading && (
                        <div className="flex items-center gap-3 py-4 text-gray-400 animate-pulse">
                            <Loader2 size={16} className="animate-spin text-indigo-400" />
                            <span className="text-sm font-medium">Analisando dados e literatura científica...</span>
                        </div>
                    )}

                    {insight && (
                        <div className="relative">
                            <p className="text-gray-300 text-sm leading-relaxed mb-4 border-l-2 border-indigo-500/30 pl-4 py-1">
                                {insight}
                            </p>
                            <div className="flex justify-end">
                                <button className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300" onClick={() => setInsight(null)}>
                                    Nova Análise
                                </button>
                            </div>
                        </div>
                    )}

                    {!insight && !insightLoading && (
                        <p className="text-gray-500 text-xs leading-relaxed">
                            Toque em "Gerar" para obter uma análise técnica baseada na consistência e nos registros recentes deste aluno.
                        </p>
                    )}
                </div>

                {/* 4. Metas do Trimestre (Unificado) */}
                <CardMetasTrimestrePersonal
                    metasProporcoes={ficha.metasProporcoes}
                    diagnosticoDados={ficha.diagnosticoDados}
                    medidas={ficha.medidas}
                    sexo={ficha.sexo || 'M'}
                    composicaoAtual={{
                        peso: ficha.peso || 0,
                        gorduraPct: ficha.gorduraPct || 0
                    }}
                    scoreAtual={ficha.score}
                    scoreMeta3M={ficha.scoreMeta3M}
                />
            </div>
        </div>
    )
}
