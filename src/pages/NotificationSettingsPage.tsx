/**
 * NotificationSettingsPage — Configurações de Notificação do Personal
 *
 * Permite ativar/desativar categorias, ajustar opções de
 * agrupamento, alertas de regressão, inatividade, etc.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Bell, ArrowLeft, Save, Loader2 } from 'lucide-react'
import { notificacaoService } from '@/services/notificacao.service'
import { useAuthStore } from '@/stores/authStore'
import type { ConfigNotificacoesPersonal } from '@/types/notificacao.types'

interface NotificationSettingsPageProps {
    onBack?: () => void
}

// Toggle switch component
function Toggle({
    enabled,
    onChange,
    label,
    description,
}: {
    enabled: boolean
    onChange: (v: boolean) => void
    label: string
    description?: string
}) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{label}</p>
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                )}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${enabled ? 'bg-primary' : 'bg-white/10'
                    }`}
            >
                <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                        }`}
                />
            </button>
        </div>
    )
}

export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
    const { entity } = useAuthStore()
    const personalId = entity?.personal?.id || null

    const [config, setConfig] = useState<ConfigNotificacoesPersonal | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Load config
    useEffect(() => {
        if (!personalId) return
        setLoading(true)
        notificacaoService.buscarConfig(personalId).then(c => {
            setConfig(c)
            setLoading(false)
        })
    }, [personalId])

    // Update a nested config field
    const updateField = useCallback(<K extends keyof ConfigNotificacoesPersonal>(
        section: K,
        field: string,
        value: boolean
    ) => {
        if (!config) return
        setConfig({
            ...config,
            [section]: {
                ...(config[section] as Record<string, unknown>),
                [field]: value,
            },
        })
        setSaved(false)
    }, [config])

    // Save
    const handleSave = useCallback(async () => {
        if (!personalId || !config) return
        setSaving(true)
        await notificacaoService.atualizarConfig(personalId, config)
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }, [personalId, config])

    if (loading || !config) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <Bell size={22} className="text-primary" />
                        <h1 className="text-xl font-bold text-white">Configurações de Notificação</h1>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${saved
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                        }`}
                >
                    {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : saved ? (
                        '✓ Salvo'
                    ) : (
                        <>
                            <Save size={16} />
                            Salvar
                        </>
                    )}
                </button>
            </div>

            {/* Treino */}
            <section className="bg-white/[0.02] rounded-xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    🏋️ Treino
                </h2>
                <p className="text-xs text-gray-500 mb-3">Notificações de treinos completos, pulados e inatividade</p>
                <div className="divide-y divide-white/5">
                    <Toggle
                        enabled={config.treino.ativo}
                        onChange={(v) => updateField('treino', 'ativo', v)}
                        label="Notificações de Treino"
                        description="Receber alertas quando alunos completam ou pulam treinos"
                    />
                    <Toggle
                        enabled={config.treino.agrupar}
                        onChange={(v) => updateField('treino', 'agrupar', v)}
                        label="Agrupar treinos"
                        description="Agrupar treinos completos do mesmo aluno no mesmo dia"
                    />
                    <Toggle
                        enabled={config.treino.alertarPulados}
                        onChange={(v) => updateField('treino', 'alertarPulados', v)}
                        label="Alertar treinos pulados"
                        description="Notificar quando um aluno pula o treino"
                    />
                    <Toggle
                        enabled={config.treino.alertarInatividade}
                        onChange={(v) => updateField('treino', 'alertarInatividade', v)}
                        label="Alerta de inatividade"
                        description="Notificar se aluno não treina há 3+ dias"
                    />
                </div>
            </section>

            {/* Medidas */}
            <section className="bg-white/[0.02] rounded-xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    📏 Medidas
                </h2>
                <p className="text-xs text-gray-500 mb-3">Novas medições e alertas de regressão</p>
                <div className="divide-y divide-white/5">
                    <Toggle
                        enabled={config.medidas.ativo}
                        onChange={(v) => updateField('medidas', 'ativo', v)}
                        label="Notificações de Medidas"
                        description="Receber alertas de novas medições e avaliações"
                    />
                    <Toggle
                        enabled={config.medidas.alertarRegressao}
                        onChange={(v) => updateField('medidas', 'alertarRegressao', v)}
                        label="Alertar regressão"
                        description="Notificar quando score ou gordura pioram"
                    />
                    <Toggle
                        enabled={config.medidas.alertarInatividade}
                        onChange={(v) => updateField('medidas', 'alertarInatividade', v)}
                        label="Alerta sem medição"
                        description="Notificar se aluno não mede há 14+ dias"
                    />
                </div>
            </section>

            {/* Conquistas */}
            <section className="bg-white/[0.02] rounded-xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    🏆 Conquistas
                </h2>
                <p className="text-xs text-gray-500 mb-3">Metas atingidas, evolução e recordes</p>
                <div className="divide-y divide-white/5">
                    <Toggle
                        enabled={config.conquistas.ativo}
                        onChange={(v) => updateField('conquistas', 'ativo', v)}
                        label="Notificações de Conquistas"
                        description="Receber alertas de metas, classificação e recordes pessoais"
                    />
                </div>
            </section>

            {/* Portal */}
            <section className="bg-white/[0.02] rounded-xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    👤 Portal do Atleta
                </h2>
                <p className="text-xs text-gray-500 mb-3">Acessos, inatividade e reporte de dor</p>
                <div className="divide-y divide-white/5">
                    <Toggle
                        enabled={config.portal.ativo}
                        onChange={(v) => updateField('portal', 'ativo', v)}
                        label="Notificações do Portal"
                        description="Receber alertas de primeiro acesso e atividade"
                    />
                    <Toggle
                        enabled={config.portal.alertarInatividade}
                        onChange={(v) => updateField('portal', 'alertarInatividade', v)}
                        label="Alerta de inatividade"
                        description="Notificar se aluno não acessa o portal há 7+ dias"
                    />
                    <Toggle
                        enabled={config.portal.notificarDor}
                        onChange={(v) => updateField('portal', 'notificarDor', v)}
                        label="Reporte de dor"
                        description="Notificar imediatamente quando aluno reporta dor (prioridade URGENTE)"
                    />
                </div>
            </section>

            {/* Resumos */}
            <section className="bg-white/[0.02] rounded-xl border border-white/5 p-5">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    📊 Resumos Periódicos
                </h2>
                <p className="text-xs text-gray-500 mb-3">Relatórios automáticos de progresso</p>
                <div className="divide-y divide-white/5">
                    <Toggle
                        enabled={config.resumos.diario}
                        onChange={(v) => updateField('resumos', 'diario', v)}
                        label="Resumo diário"
                        description="Receber resumo dos treinos do dia ao final do período"
                    />
                    <Toggle
                        enabled={config.resumos.semanal}
                        onChange={(v) => updateField('resumos', 'semanal', v)}
                        label="Resumo semanal"
                        description="Receber resumo da semana toda segunda-feira"
                    />
                    <Toggle
                        enabled={config.resumos.mensal}
                        onChange={(v) => updateField('resumos', 'mensal', v)}
                        label="Resumo mensal"
                        description="Receber relatório mensal no dia 1 de cada mês"
                    />
                </div>
            </section>

            <div className="h-8" />
        </div>
    )
}
