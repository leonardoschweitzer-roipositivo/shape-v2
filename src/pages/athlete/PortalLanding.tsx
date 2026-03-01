/**
 * PortalLanding — Página de entrada do Portal do Atleta
 * 
 * Exibida quando o atleta acessa via link de convite (?token=XXX)
 * Mostra dados do atleta e opções: ver ficha, registrar medidas
 */

import React, { useState, useEffect } from 'react';
import {
    User, Ruler, Activity, Trophy, ArrowRight,
    Sparkles, Shield, TrendingUp, Clock,
    Loader2
} from 'lucide-react';
import { portalService, PortalAthleteData } from '@/services/portalService';
import { SelfMeasurements } from './SelfMeasurements';
import { AthletePortal } from '../AthletePortal';

interface PortalLandingProps {
    token: string;
    onClose: () => void;
}

type PortalView = 'home' | 'measurements' | 'history' | 'portal';

export function PortalLanding({ token, onClose }: PortalLandingProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [athleteData, setAthleteData] = useState<PortalAthleteData | null>(null);
    const [view, setView] = useState<PortalView>('home');

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await portalService.validateToken(token);
                if (!data) {
                    setError('Link inválido ou expirado. Peça um novo link ao seu Personal.');
                } else {
                    setAthleteData(data);
                }
            } catch (err) {
                setError('Erro ao carregar dados. Tente novamente.');
            }
            setLoading(false);
        }
        loadData();
    }, [token]);

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="text-indigo-400 mx-auto animate-spin" size={40} />
                    <p className="text-gray-500 text-sm">Validando seu acesso...</p>
                </div>
            </div>
        );
    }

    // Error
    if (error || !athleteData) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="text-red-400" size={36} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-white">ACESSO NEGADO</h1>
                        <p className="text-gray-400 text-sm">{error || 'Token inválido.'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    // Portal completo (4 tabs)
    if (view === 'portal') {
        return (
            <AthletePortal
                atletaId={athleteData.id}
                atletaNome={athleteData.nome}
            />
        );
    }

    // Measurements form
    if (view === 'measurements') {
        return (
            <SelfMeasurements
                atletaId={athleteData.id}
                atletaNome={athleteData.nome}
                sexo={athleteData.ficha?.sexo || 'M'}
                onSave={async (measurements) => {
                    const result = await portalService.saveMeasurements(athleteData.id, measurements);
                    if (result.success) {
                        // Reload data
                        const updated = await portalService.validateToken(token);
                        if (updated) setAthleteData(updated);
                    }
                    return result.success;
                }}
                onBack={() => setView('home')}
            />
        );
    }

    // Home
    const lastAval = athleteData.avaliacoes[0];
    const lastMedida = athleteData.medidas[0];
    const sexoLabel = athleteData.ficha?.sexo === 'F' ? 'FEMININO' : 'MASCULINO';
    const scoreColor = lastAval?.score_geral
        ? lastAval.score_geral >= 90 ? 'text-yellow-400'
            : lastAval.score_geral >= 80 ? 'text-emerald-400'
                : lastAval.score_geral >= 70 ? 'text-blue-400'
                    : 'text-orange-400'
        : 'text-gray-500';

    return (
        <div className="min-h-screen bg-[#060B18]">
            {/* Gradient Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 via-indigo-900/10 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

                <div className="relative max-w-2xl mx-auto px-6 pt-10 pb-8">
                    {/* Avatar + Name + Vitru Logo */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 flex-shrink-0">
                            <User className="text-white" size={24} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h1 className="text-xl font-black text-white tracking-tight uppercase">
                                {athleteData.nome}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                                    {sexoLabel}
                                </span>
                                {athleteData.ficha?.altura && (
                                    <>
                                        <span className="text-gray-700">•</span>
                                        <span className="text-[10px] font-bold tracking-wider text-gray-500">
                                            {athleteData.ficha.altura} CM
                                        </span>
                                    </>
                                )}
                                {lastMedida?.peso && (
                                    <>
                                        <span className="text-gray-700">•</span>
                                        <span className="text-[10px] font-bold tracking-wider text-gray-500">
                                            {lastMedida.peso} KG
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Vitru Logo */}
                        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-indigo-300 font-black text-sm">V</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <span className="text-white font-black text-[8px] tracking-widest">VITRU</span>
                                <span className="text-indigo-400 font-black text-[7px] tracking-widest italic">IA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-6 -mt-2 space-y-6 pb-12">
                {/* Personal badge */}
                <div className="flex items-center gap-3 px-4 py-3 bg-[#0A0F1C] rounded-xl border border-white/5">
                    <Shield className="text-indigo-400" size={14} />
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        Personal: <span className="text-white">{athleteData.personalNome}</span>
                    </span>
                </div>

                {/* Score Card (if exists) */}
                {lastAval && (
                    <div className="p-6 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl border border-white/5 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase">
                                Última Avaliação
                            </span>
                            <span className="text-[10px] text-gray-600 font-mono">
                                {new Date(lastAval.data).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <div className="flex items-end gap-6">
                            <div>
                                <span className={`text-5xl font-black ${scoreColor}`}>
                                    {lastAval.score_geral}
                                </span>
                                <span className="text-gray-600 text-sm ml-1 font-bold">pts</span>
                            </div>
                            <div className="flex-1 pb-2">
                                <span className={`text-xs font-black tracking-widest uppercase ${scoreColor}`}>
                                    {lastAval.classificacao_geral}
                                </span>
                                <div className="mt-2 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                                        style={{ width: `${lastAval.score_geral}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Cards */}
                <div className="space-y-3">
                    <h2 className="text-[10px] font-bold tracking-[0.15em] text-gray-500 uppercase px-1">
                        O que deseja fazer?
                    </h2>

                    {/* Entrar no Portal Completo */}
                    <button
                        onClick={() => setView('portal')}
                        className="w-full group flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl hover:border-emerald-500/40 hover:bg-emerald-500/15 transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                            <Activity className="text-emerald-400" size={22} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-white font-bold text-sm uppercase tracking-wide block">
                                Meu Portal Completo
                            </span>
                            <span className="text-gray-500 text-xs">
                                Treino, dieta, progresso e chat com Coach IA
                            </span>
                        </div>
                        <ArrowRight className="text-gray-600 group-hover:text-emerald-400 transition-colors" size={18} />
                    </button>

                    {/* Registrar Medidas */}
                    <button
                        onClick={() => setView('measurements')}
                        className="w-full group flex items-center gap-4 p-5 bg-gradient-to-r from-indigo-500/10 to-emerald-500/5 border border-indigo-500/20 rounded-2xl hover:border-indigo-500/40 hover:bg-indigo-500/15 transition-all text-left"
                    >
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                            <Ruler className="text-indigo-400" size={22} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-white font-bold text-sm uppercase tracking-wide block">
                                Registrar Minhas Medidas
                            </span>
                            <span className="text-gray-500 text-xs">
                                Preencha suas medidas corporais atuais com uma fita métrica
                            </span>
                        </div>
                        <ArrowRight className="text-gray-600 group-hover:text-indigo-400 transition-colors" size={18} />
                    </button>

                    {/* Ver Histórico */}
                    <button
                        disabled
                        className="w-full flex items-center gap-4 p-5 bg-[#0A0F1C] border border-white/5 rounded-2xl opacity-50 cursor-not-allowed text-left"
                    >
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                            <TrendingUp className="text-gray-600" size={22} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-gray-400 font-bold text-sm uppercase tracking-wide block">
                                Ver Minha Evolução
                            </span>
                            <span className="text-gray-600 text-xs">
                                Em breve — acompanhe seus resultados ao longo do tempo
                            </span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-600 bg-white/5 px-2 py-1 rounded-full">
                            BREVE
                        </span>
                    </button>

                    {/* Última medida info */}
                    {lastMedida && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-[#0A0F1C] rounded-xl border border-white/5">
                            <Clock className="text-gray-600" size={14} />
                            <span className="text-[10px] text-gray-600">
                                Última medida registrada em{' '}
                                <span className="text-gray-400 font-bold">
                                    {new Date(lastMedida.data).toLocaleDateString('pt-BR')}
                                </span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-white/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="text-indigo-400" size={12} />
                        <span className="text-[10px] text-gray-600 font-bold tracking-wider uppercase">
                            Powered by VITRU IA
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-700">
                        Suas medidas são analisadas pela nossa IA para gerar seu score Shape-V
                    </p>
                </div>
            </div>
        </div>
    );
}
