/**
 * PersonalCoachView - Tela do Vitrúvio IA para o Personal
 * 
 * Tela única com:
 * - Cards de status + busca + tabela de alunos
 * - Bloco "Montar Plano de Evolução" abaixo da tabela
 *   → Ao selecionar aluno na tabela, ele aparece no bloco e CTA fica ativo
 *   → Clicar em "Iniciar" abre o wizard
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    Search,
    Users,
    UserCheck,
    AlertTriangle,
    UserX,
    Sparkles,
    Target,
    Stethoscope,
    Dumbbell,
    Salad,
    ArrowRight,
    Play,
    Check,
    Bot,
    X,
    FileText,
    Eye,
    Clock,
    Loader2,
} from 'lucide-react';
import { PersonalAthlete } from '@/mocks/personal';
import { useDataStore } from '@/stores/dataStore';
import { buscarDiagnostico } from '@/services/calculations/diagnostico';
import { buscarPlanoTreino } from '@/services/calculations/treino';
import { buscarPlanoDieta } from '@/services/calculations/dieta';

// ===== TYPES =====

type StatusFilter = 'all' | 'active' | 'inactive' | 'attention';

interface StatusCardData {
    label: string;
    count: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    filter: StatusFilter;
}

// ===== SUBCOMPONENTS =====

/** Card de status */
const StatusCard: React.FC<{
    data: StatusCardData;
    isActive: boolean;
    onClick: () => void;
}> = ({ data, isActive, onClick }) => {
    const Icon = data.icon;

    return (
        <button
            onClick={onClick}
            className={`flex-1 min-w-[140px] p-4 rounded-xl border transition-all ${isActive
                ? `${data.bgColor} ${data.borderColor} shadow-lg`
                : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? data.color : 'text-gray-500'
                    }`}>
                    {data.label}
                </span>
                <Icon size={14} className={isActive ? data.color : 'text-gray-600'} />
            </div>
            <p className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {data.count}
            </p>
        </button>
    );
};

/** Linha de atleta na tabela */
const AthleteRow: React.FC<{
    athlete: PersonalAthlete;
    isSelected: boolean;
    onSelect: (athlete: PersonalAthlete) => void;
}> = ({ athlete, isSelected, onSelect }) => {
    const getStatusBadge = (status: string) => {
        const config: Record<string, { label: string; classes: string }> = {
            active: { label: 'Ativo', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
            inactive: { label: 'Inativo', classes: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
            attention: { label: 'Atenção', classes: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
        };
        const s = config[status] || config.active;
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${s.classes}`}>
                {s.label}
            </span>
        );
    };

    return (
        <tr
            className={`transition-colors cursor-pointer group ${isSelected
                ? 'bg-primary/5 border-l-2 border-l-primary'
                : 'hover:bg-white/[0.03]'
                }`}
            onClick={() => onSelect(athlete)}
        >
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shrink-0 ${isSelected
                        ? 'bg-primary/20 border-2 border-primary'
                        : 'bg-gradient-to-br from-primary/20 to-secondary/20'
                        }`}>
                        {isSelected ? (
                            <Check size={16} className="text-primary" />
                        ) : (
                            athlete.avatarUrl
                                ? <img src={athlete.avatarUrl} alt={athlete.name} className="w-full h-full rounded-full object-cover" />
                                : '👤'
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-white'}`}>
                            {athlete.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{athlete.email}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="text-white font-bold">{athlete.score}</span>
            </td>
            <td className="px-6 py-4 text-center">
                <span className="text-white font-mono text-sm">
                    {typeof athlete.ratio === 'number' ? athlete.ratio.toFixed(2) : athlete.ratio}
                </span>
            </td>
            <td className="px-6 py-4 text-center">
                {getStatusBadge(athlete.status)}
            </td>
            <td className="px-6 py-4 text-right">
                {isSelected ? (
                    <span className="text-xs text-primary font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                        <Check size={12} />
                        Selecionado
                    </span>
                ) : (
                    <span className="text-xs text-gray-500 group-hover:text-primary transition-colors font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                        <Sparkles size={12} />
                        Selecionar
                    </span>
                )}
            </td>
        </tr>
    );
};

// ===== MAIN COMPONENT =====

interface PersonalCoachViewProps {
    onStartDiagnostico?: (atletaId: string) => void;
    onConsultPlan?: (atletaId: string, tipo: 'diagnostico' | 'treino' | 'dieta') => void;
}

export const PersonalCoachView: React.FC<PersonalCoachViewProps> = ({ onStartDiagnostico, onConsultPlan }) => {
    const [selectedAthlete, setSelectedAthlete] = useState<PersonalAthlete | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [savedPlans, setSavedPlans] = useState<{
        diagnostico: { exists: boolean; createdAt?: string };
        treino: { exists: boolean; createdAt?: string };
        dieta: { exists: boolean; createdAt?: string };
    } | null>(null);
    const [loadingPlans, setLoadingPlans] = useState(false);

    const planBlockRef = useRef<HTMLDivElement>(null);

    const { personalAthletes } = useDataStore();

    // Scroll para o bloco de plano ao selecionar atleta
    useEffect(() => {
        if (selectedAthlete && planBlockRef.current) {
            planBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedAthlete]);

    // Buscar planos salvos ao selecionar atleta
    useEffect(() => {
        if (!selectedAthlete) {
            setSavedPlans(null);
            return;
        }

        const loadPlans = async () => {
            setLoadingPlans(true);
            try {
                const [diag, treino, dieta] = await Promise.all([
                    buscarDiagnostico(selectedAthlete.id),
                    buscarPlanoTreino(selectedAthlete.id),
                    buscarPlanoDieta(selectedAthlete.id),
                ]);

                setSavedPlans({
                    diagnostico: { exists: !!diag, createdAt: (diag as any)?.geradoEm },
                    treino: { exists: !!treino },
                    dieta: { exists: !!dieta },
                });
            } catch (err) {
                console.error('[CoachView] Erro ao buscar planos:', err);
                setSavedPlans(null);
            } finally {
                setLoadingPlans(false);
            }
        };

        loadPlans();
    }, [selectedAthlete]);

    // Contadores por status
    const statusCounts = useMemo(() => {
        const counts = { all: 0, active: 0, inactive: 0, attention: 0 };
        personalAthletes.forEach(a => {
            counts.all++;
            if (a.status === 'active') counts.active++;
            else if (a.status === 'inactive') counts.inactive++;
            else if (a.status === 'attention') counts.attention++;
        });
        return counts;
    }, [personalAthletes]);

    const statusCards: StatusCardData[] = [
        { label: 'Total', count: statusCounts.all, icon: Users, color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary/30', filter: 'all' },
        { label: 'Ativos', count: statusCounts.active, icon: UserCheck, color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', filter: 'active' },
        { label: 'Atenção', count: statusCounts.attention, icon: AlertTriangle, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', filter: 'attention' },
        { label: 'Inativos', count: statusCounts.inactive, icon: UserX, color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30', filter: 'inactive' },
    ];

    // Filtragem
    const filteredAthletes = useMemo(() => {
        let result = personalAthletes;

        if (statusFilter !== 'all') {
            result = result.filter(a => a.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.name.toLowerCase().includes(q) ||
                a.email.toLowerCase().includes(q)
            );
        }

        return result;
    }, [personalAthletes, statusFilter, searchQuery]);

    const handleSelectAthlete = (athlete: PersonalAthlete) => {
        // Toggle: clicar no mesmo deseleciona
        setSelectedAthlete(prev =>
            prev?.id === athlete.id ? null : athlete
        );
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
                <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">

                    {/* Header */}
                    <div className="flex flex-col animate-fade-in-up">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                            VITRÚVIO IA
                        </h2>
                        <p className="text-gray-400 mt-2 font-light">
                            Selecione um aluno e monte o plano de evolução com inteligência artificial.
                        </p>
                    </div>

                    <div className="h-px w-full bg-white/10" />

                    {/* Status Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up">
                        {statusCards.map(card => (
                            <StatusCard
                                key={card.filter}
                                data={card}
                                isActive={statusFilter === card.filter}
                                onClick={() => setStatusFilter(
                                    statusFilter === card.filter ? 'all' : card.filter
                                )}
                            />
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative animate-fade-in-up">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar aluno por nome ou email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                        />
                    </div>

                    {/* Athletes Table */}
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl overflow-hidden animate-fade-in-up">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Aluno
                                        </th>
                                        <th className="px-6 py-3.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Score
                                        </th>
                                        <th className="px-6 py-3.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Ratio
                                        </th>
                                        <th className="px-6 py-3.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Status
                                        </th>
                                        <th className="px-6 py-3.5 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Ação
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredAthletes.map(athlete => (
                                        <AthleteRow
                                            key={athlete.id}
                                            athlete={athlete}
                                            isSelected={selectedAthlete?.id === athlete.id}
                                            onSelect={handleSelectAthlete}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty state */}
                        {filteredAthletes.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-gray-500 text-sm">Nenhum aluno encontrado</p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-2 text-primary text-xs font-bold uppercase tracking-wider hover:text-primary/80 transition-colors"
                                    >
                                        Limpar busca
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ══════════════════════════════════════════════════
                        BLOCO: MONTAR PLANO DE EVOLUÇÃO
                        Fica sempre visível, mas ativa ao selecionar aluno
                    ══════════════════════════════════════════════════ */}
                    <div
                        ref={planBlockRef}
                        className={`bg-[#131B2C] border rounded-2xl p-6 md:p-8 transition-all duration-500 ${selectedAthlete
                            ? 'border-primary/30 shadow-[0_0_20px_rgba(0,201,167,0.08)]'
                            : 'border-white/10 opacity-60'
                            }`}
                    >
                        {/* Atleta selecionado badge */}
                        {selectedAthlete && (
                            <div className="flex items-center justify-between mb-6 animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                                        <Bot size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                            Aluno Selecionado
                                        </p>
                                        <h4 className="text-white font-bold uppercase text-sm">
                                            {selectedAthlete.name}
                                        </h4>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAthlete(null)}
                                    className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
                                    title="Desselecionar"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        {/* Header da seção */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-all ${selectedAthlete
                                ? 'bg-primary/10 border-primary/20'
                                : 'bg-white/5 border-white/10'
                                }`}>
                                <Target size={22} className={selectedAthlete ? 'text-primary' : 'text-gray-600'} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                                    Montar Plano de Evolução
                                </h3>
                                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${selectedAthlete ? 'text-primary' : 'text-gray-600'
                                    }`}>
                                    Fluxo guiado em 3 etapas
                                </p>
                            </div>
                        </div>

                        {/* Descrição */}
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            {selectedAthlete
                                ? `O Vitrúvio vai analisar ${selectedAthlete.name} e montar um plano completo de evolução personalizado, desde o diagnóstico até a dieta, tudo alinhado com as proporções ideais e os objetivos definidos.`
                                : 'Selecione um aluno na tabela acima para iniciar o plano de evolução personalizado.'
                            }
                        </p>

                        {/* Steps preview */}
                        <div className="flex items-center gap-3 mb-8 flex-wrap">
                            {[
                                { icon: Stethoscope, label: 'Diagnóstico', num: '1' },
                                { icon: Dumbbell, label: 'Treino', num: '2' },
                                { icon: Salad, label: 'Dieta', num: '3' },
                            ].map((step, idx) => (
                                <React.Fragment key={step.num}>
                                    {idx > 0 && (
                                        <ArrowRight size={14} className="text-gray-600 shrink-0" />
                                    )}
                                    <div className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-all ${selectedAthlete
                                        ? 'bg-white/5 border-white/10'
                                        : 'bg-white/[0.02] border-white/5'
                                        }`}>
                                        <step.icon size={14} className={selectedAthlete ? 'text-primary' : 'text-gray-600'} />
                                        <span className={`text-xs font-bold uppercase tracking-wider ${selectedAthlete ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => selectedAthlete && onStartDiagnostico?.(selectedAthlete.id)}
                            disabled={!selectedAthlete}
                            className={`w-full flex items-center justify-center gap-3 h-14 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${selectedAthlete
                                ? 'bg-primary text-[#0A0F1C] shadow-[0_0_20px_rgba(0,201,167,0.2)] hover:shadow-[0_0_30px_rgba(0,201,167,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                                : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                                }`}
                        >
                            <Play size={18} />
                            {selectedAthlete
                                ? 'Iniciar Plano de Evolução'
                                : 'Selecione um aluno para iniciar'
                            }
                        </button>

                        {selectedAthlete && (
                            <p className="text-[10px] text-center text-gray-600 mt-3 uppercase tracking-widest animate-fade-in">
                                Baseado na última avaliação e dados do contexto do atleta
                            </p>
                        )}
                    </div>

                    {/* ══════════════════════════════════════════════════
                        BLOCO: PLANOS SALVOS
                        Aparece quando o atleta selecionado tem planos no banco
                    ══════════════════════════════════════════════════ */}
                    {selectedAthlete && (
                        <div className={`bg-[#131B2C] border rounded-2xl p-6 md:p-8 transition-all duration-500 animate-fade-in-up ${savedPlans && (savedPlans.diagnostico.exists || savedPlans.treino.exists || savedPlans.dieta.exists)
                                ? 'border-white/15'
                                : 'border-white/10 opacity-70'
                            }`}>
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <FileText size={22} className="text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                                        Planos Salvos
                                    </h3>
                                    <p className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-600">
                                        Consultar plano de evolução existente
                                    </p>
                                </div>
                            </div>

                            {loadingPlans ? (
                                <div className="flex items-center justify-center gap-3 py-8">
                                    <Loader2 size={20} className="text-primary animate-spin" />
                                    <span className="text-sm text-gray-400">Buscando planos salvos...</span>
                                </div>
                            ) : savedPlans && (savedPlans.diagnostico.exists || savedPlans.treino.exists || savedPlans.dieta.exists) ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Card Diagnóstico */}
                                    <div className={`p-4 rounded-xl border transition-all ${savedPlans.diagnostico.exists
                                            ? 'bg-white/5 border-white/10 hover:border-primary/30 hover:bg-primary/5'
                                            : 'bg-white/[0.02] border-white/5 opacity-50'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${savedPlans.diagnostico.exists ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/10'
                                                }`}>
                                                <Stethoscope size={16} className={savedPlans.diagnostico.exists ? 'text-primary' : 'text-gray-600'} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase tracking-wide">Diagnóstico</p>
                                                {savedPlans.diagnostico.exists && savedPlans.diagnostico.createdAt && (
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                        <Clock size={10} />
                                                        {new Date(savedPlans.diagnostico.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {savedPlans.diagnostico.exists ? (
                                            <button
                                                onClick={() => onConsultPlan?.(selectedAthlete.id, 'diagnostico')}
                                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 text-gray-300 hover:text-primary text-xs font-bold uppercase tracking-wider transition-all"
                                            >
                                                <Eye size={14} />
                                                Consultar
                                            </button>
                                        ) : (
                                            <p className="text-xs text-gray-600 text-center py-2">Não gerado</p>
                                        )}
                                    </div>

                                    {/* Card Treino */}
                                    <div className={`p-4 rounded-xl border transition-all ${savedPlans.treino.exists
                                            ? 'bg-white/5 border-white/10 hover:border-primary/30 hover:bg-primary/5'
                                            : 'bg-white/[0.02] border-white/5 opacity-50'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${savedPlans.treino.exists ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/10'
                                                }`}>
                                                <Dumbbell size={16} className={savedPlans.treino.exists ? 'text-primary' : 'text-gray-600'} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase tracking-wide">Plano de Treino</p>
                                            </div>
                                        </div>
                                        {savedPlans.treino.exists ? (
                                            <button
                                                onClick={() => onConsultPlan?.(selectedAthlete.id, 'treino')}
                                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 text-gray-300 hover:text-primary text-xs font-bold uppercase tracking-wider transition-all"
                                            >
                                                <Eye size={14} />
                                                Consultar
                                            </button>
                                        ) : (
                                            <p className="text-xs text-gray-600 text-center py-2">Não gerado</p>
                                        )}
                                    </div>

                                    {/* Card Dieta */}
                                    <div className={`p-4 rounded-xl border transition-all ${savedPlans.dieta.exists
                                            ? 'bg-white/5 border-white/10 hover:border-primary/30 hover:bg-primary/5'
                                            : 'bg-white/[0.02] border-white/5 opacity-50'
                                        }`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${savedPlans.dieta.exists ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/10'
                                                }`}>
                                                <Salad size={16} className={savedPlans.dieta.exists ? 'text-primary' : 'text-gray-600'} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase tracking-wide">Plano de Dieta</p>
                                            </div>
                                        </div>
                                        {savedPlans.dieta.exists ? (
                                            <button
                                                onClick={() => onConsultPlan?.(selectedAthlete.id, 'dieta')}
                                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 text-gray-300 hover:text-primary text-xs font-bold uppercase tracking-wider transition-all"
                                            >
                                                <Eye size={14} />
                                                Consultar
                                            </button>
                                        ) : (
                                            <p className="text-xs text-gray-600 text-center py-2">Não gerado</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-6">
                                    Nenhum plano de evolução gerado ainda para este aluno.
                                </p>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* Wizard removido — agora navega para DiagnosticoView */}
        </>
    );
};
