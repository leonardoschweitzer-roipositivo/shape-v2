/**
 * OnboardingWizard — Wizard de primeira vez no Portal do Aluno
 * 
 * Aparece quando o aluno entra no portal pela primeira vez (sem avaliação e sem onboarding completo).
 * Oferece 3 caminhos:
 *   1. "Meu Personal vai medir" → pede apenas data nascimento, marca flag
 *   2. "Avaliação por Fotos (IA)" → redireciona ao VirtualAssessmentWizard existente
 *   3. "Medidas Básicas" → mini-wizard: data nascimento, altura, peso, cintura, quadril, nível atividade, objetivo
 */

import React, { useState } from 'react';
import {
    UserCheck,
    Camera,
    Ruler,
    ChevronRight,
    ArrowLeft,
    Sparkles,
    Loader2,
    Check,
    Calendar,
    Activity,
    Target,
} from 'lucide-react';
import { supabase } from '@/services/supabase';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface OnboardingWizardProps {
    atletaId: string;
    atletaNome: string;
    sexo: 'M' | 'F';
    onComplete: () => void;
    onGoToVirtualAssessment: () => void;
    onLogout?: () => void;
}

type WizardScreen = 'escolha' | 'personal-form' | 'basico-form' | 'sucesso';

interface BasicFormData {
    dataNascimento: string;
    altura: string;
    peso: string;
    cintura: string;
    quadril: string;
    nivelAtividade: 'SEDENTARIO' | 'LEVE' | 'MODERADO' | 'INTENSO' | '';
    objetivo: 'HIPERTROFIA' | 'EMAGRECIMENTO' | 'SAUDE' | 'PERFORMANCE' | '';
}

const NIVEL_OPTIONS = [
    { value: 'SEDENTARIO', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
    { value: 'LEVE', label: 'Leve', desc: '1-2x por semana' },
    { value: 'MODERADO', label: 'Moderado', desc: '3-5x por semana' },
    { value: 'INTENSO', label: 'Intenso', desc: '6-7x por semana' },
] as const;

const OBJETIVO_OPTIONS = [
    { value: 'HIPERTROFIA', label: '💪 Hipertrofia', desc: 'Ganhar massa muscular' },
    { value: 'EMAGRECIMENTO', label: '🔥 Emagrecimento', desc: 'Perder gordura' },
    { value: 'SAUDE', label: '❤️ Saúde', desc: 'Melhorar condição física' },
    { value: 'PERFORMANCE', label: '⚡ Performance', desc: 'Rendimento atlético' },
] as const;

const INITIAL_FORM: BasicFormData = {
    dataNascimento: '',
    altura: '',
    peso: '',
    cintura: '',
    quadril: '',
    nivelAtividade: '',
    objetivo: '',
};

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export function OnboardingWizard({
    atletaId,
    atletaNome,
    sexo,
    onComplete,
    onGoToVirtualAssessment,
    onLogout,
}: OnboardingWizardProps) {
    const [screen, setScreen] = useState<WizardScreen>('escolha');
    const [dataNascimentoPersonal, setDataNascimentoPersonal] = useState('');
    const [form, setForm] = useState<BasicFormData>(INITIAL_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    const firstName = atletaNome.split(' ')[0];

    // ─── Salvar: "Meu Personal vai medir" ────────────
    const handleSavePersonal = async () => {
        if (!dataNascimentoPersonal) return;

        setSaving(true);
        setError(null);

        try {
            const { error: fichaErr } = await supabase
                .from('fichas')
                .update({
                    data_nascimento: dataNascimentoPersonal,
                    onboarding_completo: true,
                    metodo_medidas: 'PERSONAL',
                } as Record<string, unknown>)
                .eq('atleta_id', atletaId);

            if (fichaErr) throw new Error(fichaErr.message);

            setSuccessMessage('Seu personal fará suas medidas presencialmente. Enquanto isso, explore seu portal!');
            setScreen('sucesso');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    // ─── Salvar: "Medidas Básicas" ────────────
    const handleSaveBasico = async () => {
        if (!form.dataNascimento || !form.altura || !form.peso) return;

        setSaving(true);
        setError(null);

        try {
            // 1. Atualizar ficha com dados básicos
            const fichaUpdate: Record<string, unknown> = {
                data_nascimento: form.dataNascimento,
                altura: parseFloat(form.altura),
                onboarding_completo: true,
                metodo_medidas: 'BASICO',
            };
            if (form.nivelAtividade) fichaUpdate.nivel_atividade = form.nivelAtividade;
            if (form.objetivo) fichaUpdate.objetivo = form.objetivo;

            const { error: fichaErr } = await supabase
                .from('fichas')
                .update(fichaUpdate)
                .eq('atleta_id', atletaId);

            if (fichaErr) throw new Error(`Erro na ficha: ${fichaErr.message}`);

            // 2. Inserir medidas
            const medidasInsert: Record<string, unknown> = {
                atleta_id: atletaId,
                data: new Date().toISOString().split('T')[0],
                peso: parseFloat(form.peso),
                registrado_por: 'ALUNO_ONBOARDING',
            };
            if (form.cintura) medidasInsert.cintura = parseFloat(form.cintura);
            if (form.quadril) medidasInsert.quadril = parseFloat(form.quadril);

            const { error: medidaErr } = await supabase
                .from('medidas')
                .insert(medidasInsert);

            if (medidaErr) throw new Error(`Erro nas medidas: ${medidaErr.message}`);

            setSuccessMessage('Suas medidas básicas foram registradas. Seu personal pode complementá-las depois!');
            setScreen('sucesso');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    // Handle IA Fotos (marca onboarding e redireciona)
    const handleGoToIA = async () => {
        // Marcar onboarding como IA_FOTOS antes de redirecionar
        try {
            await supabase
                .from('fichas')
                .update({
                    metodo_medidas: 'IA_FOTOS',
                } as Record<string, unknown>)
                .eq('atleta_id', atletaId);
        } catch {
            // Não-crítico: prosseguir mesmo se falhar
        }
        onGoToVirtualAssessment();
    };

    // ═══════════════════════════════════════════════════════
    // TELA DE SUCESSO
    // ═══════════════════════════════════════════════════════
    if (screen === 'sucesso') {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
                <div className="max-w-sm w-full text-center space-y-6 animate-fade-in">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                        <Check className="text-emerald-400" size={36} strokeWidth={3} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-black text-white uppercase tracking-wide">
                            Tudo Pronto!
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {successMessage}
                        </p>
                    </div>
                    <button
                        onClick={onComplete}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                        Explorar Meu Portal
                    </button>
                    {onLogout && (
                        <div className="pt-4 opacity-30 hover:opacity-100 transition-opacity">
                            <button
                                onClick={onLogout}
                                className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                            >
                                Sair da conta
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════
    // FORMULÁRIO: "MEU PERSONAL VAI MEDIR"
    // ═══════════════════════════════════════════════════════
    if (screen === 'personal-form') {
        return (
            <div className="min-h-screen bg-background-dark text-white">
                <div className="max-w-md mx-auto px-4 py-8 space-y-6">
                    {/* Header */}
                    <button
                        onClick={() => setScreen('escolha')}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>

                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto">
                            <UserCheck className="text-indigo-400" size={24} />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-wider">
                            Meu Personal Vai Medir
                        </h2>
                        <p className="text-zinc-500 text-xs">
                            Precisamos apenas da sua data de nascimento para calcular sua idade.
                        </p>
                    </div>

                    {/* Data de Nascimento */}
                    <div className="bg-surface-deep rounded-2xl p-5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Data de Nascimento *
                            </span>
                        </div>
                        <input
                            type="date"
                            value={dataNascimentoPersonal}
                            onChange={(e) => setDataNascimentoPersonal(e.target.value)}
                            className="w-full bg-background-dark text-white text-sm font-medium rounded-xl px-4 py-3.5 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Erro */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                            ❌ {error}
                        </div>
                    )}

                    {/* Salvar */}
                    <button
                        onClick={handleSavePersonal}
                        disabled={!dataNascimentoPersonal || saving}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${
                            !dataNascimentoPersonal || saving
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                        }`}
                    >
                        {saving ? (
                            <><Loader2 size={16} className="animate-spin" /> Salvando...</>
                        ) : (
                            <><Check size={16} /> Confirmar</>
                        )}
                    </button>

                    {onLogout && (
                        <div className="pt-8 text-center opacity-30 hover:opacity-100 transition-opacity">
                            <button
                                onClick={onLogout}
                                className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                            >
                                Sair da conta
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════
    // FORMULÁRIO: "MEDIDAS BÁSICAS"
    // ═══════════════════════════════════════════════════════
    if (screen === 'basico-form') {
        const formValid = form.dataNascimento && form.altura && form.peso;

        return (
            <div className="min-h-screen bg-background-dark text-white pb-8">
                <div className="max-w-md mx-auto px-4 py-8 space-y-5">
                    {/* Header */}
                    <button
                        onClick={() => setScreen('escolha')}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>

                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                            <Ruler className="text-emerald-400" size={24} />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-wider">
                            Medidas Básicas
                        </h2>
                        <p className="text-zinc-500 text-xs">
                            Preencha o que souber. Campos com * são obrigatórios.
                        </p>
                    </div>

                    {/* Dados obrigatórios */}
                    <div className="bg-surface-deep rounded-2xl p-5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <Sparkles size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Dados Essenciais
                            </span>
                        </div>

                        {/* Data de Nascimento */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                Data de Nascimento *
                            </label>
                            <input
                                type="date"
                                value={form.dataNascimento}
                                onChange={(e) => setForm(prev => ({ ...prev, dataNascimento: e.target.value }))}
                                className="w-full bg-background-dark text-white text-sm font-medium rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        {/* Altura + Peso (grid) */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    Altura (cm) *
                                </label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={form.altura}
                                    onChange={(e) => setForm(prev => ({ ...prev, altura: e.target.value }))}
                                    placeholder="170"
                                    className="w-full bg-background-dark text-white text-sm font-medium placeholder-zinc-700 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    Peso (kg) *
                                </label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="0.1"
                                    value={form.peso}
                                    onChange={(e) => setForm(prev => ({ ...prev, peso: e.target.value }))}
                                    placeholder="75.0"
                                    className="w-full bg-background-dark text-white text-sm font-medium placeholder-zinc-700 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medidas opcionais */}
                    <div className="bg-surface-deep rounded-2xl p-5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <Ruler size={14} className="text-emerald-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Medidas Adicionais (opcional)
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    Cintura (cm)
                                </label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={form.cintura}
                                    onChange={(e) => setForm(prev => ({ ...prev, cintura: e.target.value }))}
                                    placeholder="80"
                                    className="w-full bg-background-dark text-white text-sm font-medium placeholder-zinc-700 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                    Quadril (cm)
                                </label>
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    value={form.quadril}
                                    onChange={(e) => setForm(prev => ({ ...prev, quadril: e.target.value }))}
                                    placeholder="95"
                                    className="w-full bg-background-dark text-white text-sm font-medium placeholder-zinc-700 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nível de Atividade */}
                    <div className="bg-surface-deep rounded-2xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <Activity size={14} className="text-amber-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Nível de Atividade
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {NIVEL_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, nivelAtividade: opt.value }))}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        form.nivelAtividade === opt.value
                                            ? 'bg-amber-500/15 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                                            : 'bg-background-dark border-white/5'
                                    }`}
                                >
                                    <span className={`text-xs font-black uppercase tracking-wider block ${
                                        form.nivelAtividade === opt.value ? 'text-amber-400' : 'text-zinc-500'
                                    }`}>
                                        {opt.label}
                                    </span>
                                    <span className="text-[9px] text-zinc-600">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Objetivo */}
                    <div className="bg-surface-deep rounded-2xl p-5 border border-white/5 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <Target size={14} className="text-purple-400" />
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                Objetivo Principal
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {OBJETIVO_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, objetivo: opt.value }))}
                                    className={`p-3 rounded-xl border text-left transition-all ${
                                        form.objetivo === opt.value
                                            ? 'bg-purple-500/15 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.1)]'
                                            : 'bg-background-dark border-white/5'
                                    }`}
                                >
                                    <span className={`text-xs font-black block ${
                                        form.objetivo === opt.value ? 'text-purple-400' : 'text-zinc-500'
                                    }`}>
                                        {opt.label}
                                    </span>
                                    <span className="text-[9px] text-zinc-600">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Erro */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                            ❌ {error}
                        </div>
                    )}

                    {/* Salvar */}
                    <button
                        onClick={handleSaveBasico}
                        disabled={!formValid || saving}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] ${
                            !formValid || saving
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                        }`}
                    >
                        {saving ? (
                            <><Loader2 size={16} className="animate-spin" /> Salvando...</>
                        ) : (
                            <><Check size={16} /> Salvar Medidas</>
                        )}
                    </button>

                    {onLogout && (
                        <div className="pt-8 text-center opacity-30 hover:opacity-100 transition-opacity">
                            <button
                                onClick={onLogout}
                                className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                            >
                                Sair da conta
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════
    // TELA PRINCIPAL: ESCOLHA DAS 3 OPÇÕES
    // ═══════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-background-dark text-white">
            <div className="max-w-md mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="text-4xl">🎯</div>
                    <h1 className="text-xl font-black uppercase tracking-wider">
                        Olá, {firstName}!
                    </h1>
                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
                        Para criar seu <strong className="text-white">Plano de Evolução</strong>, precisamos de algumas informações suas.
                        Como deseja registrar suas medidas?
                    </p>
                </div>

                {/* Opção 1: Personal Vai Medir */}
                <button
                    onClick={() => setScreen('personal-form')}
                    className="w-full bg-surface-deep hover:bg-white/[0.06] border border-white/5 hover:border-indigo-500/30 rounded-2xl p-5 text-left transition-all active:scale-[0.98] group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-indigo-500/25 transition-colors">
                            <UserCheck className="text-indigo-400" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                                    Meu Personal Vai Medir
                                </h3>
                                <ChevronRight size={16} className="text-zinc-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                            </div>
                            <p className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                                Seu personal fará suas medidas presencialmente. Você só precisa informar a data de nascimento.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Divisor */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">ou</span>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Opção 2: Fotos IA */}
                <button
                    onClick={handleGoToIA}
                    className="w-full bg-surface-deep hover:bg-white/[0.06] border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 text-left transition-all active:scale-[0.98] group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-500/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-500/25 transition-colors">
                            <Camera className="text-purple-400" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                                    Avaliação por Fotos (IA)
                                </h3>
                                <ChevronRight size={16} className="text-zinc-600 group-hover:text-purple-400 transition-colors shrink-0" />
                            </div>
                            <p className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                                Tire 4 fotos e a IA estima suas medidas corporais. ~2 minutos.
                            </p>
                            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                                <Sparkles size={10} className="text-purple-400" />
                                <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">Powered by IA</span>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Divisor */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">ou</span>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Opção 3: Medidas Básicas */}
                <button
                    onClick={() => setScreen('basico-form')}
                    className="w-full bg-surface-deep hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/30 rounded-2xl p-5 text-left transition-all active:scale-[0.98] group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-emerald-500/25 transition-colors">
                            <Ruler className="text-emerald-400" size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                                    Medidas Básicas
                                </h3>
                                <ChevronRight size={16} className="text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                            </div>
                            <p className="text-zinc-500 text-[11px] mt-1 leading-relaxed">
                                Informe altura, peso, data de nascimento e outras medidas que souber. ~1 minuto.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Footer */}
                <div className="pt-4 flex items-start gap-3 p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-2xl">
                    <Sparkles className="text-indigo-400 shrink-0 mt-0.5" size={14} />
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                        Independente da sua escolha, seu personal pode complementar ou refazer suas medidas a qualquer momento.
                    </p>
                </div>

                {/* Optional Logout */}
                {onLogout && (
                    <div className="pt-8 text-center opacity-30 hover:opacity-100 transition-opacity">
                        <button
                            onClick={onLogout}
                            className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                        >
                            Sair da conta
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
