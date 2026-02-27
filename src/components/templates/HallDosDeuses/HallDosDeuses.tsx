import React, { useState } from 'react';
import { Trophy, TrendingUp, Flame, Award, Target, Zap, Crown, ArrowRight, Calendar, Lock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDataStore } from '@/stores/dataStore';

// Tipos de ranking
type RankingType =
    | 'nota-geral'
    | 'shape-v'
    | 'gordura'
    | 'peso-proporcional'
    | 'trindade-classica'
    | 'mestre-simetria'
    | 'ffmi'
    | 'the-architect';

interface RankingUser {
    id: string;
    nome: string;
    valor: number;
    variacao?: number;
    badge?: string;
}

interface RankingCategory {
    tipo: RankingType;
    titulo: string;
    descricao: string;
    icon: React.ElementType;
    metrica: string;
}

// Definição de categorias
const PRINCIPAIS: RankingCategory[] = [
    { tipo: 'nota-geral', titulo: 'Ranking Geral', descricao: 'Os físicos mais completos e harmônicos', icon: Trophy, metrica: 'pts' },
    { tipo: 'shape-v', titulo: 'Ranking Shape-V', descricao: 'Os V-Tapers mais impressionantes', icon: Target, metrica: 'ratio' },
    { tipo: 'gordura', titulo: 'Ranking de Definição', descricao: 'Os físicos mais secos e definidos', icon: Flame, metrica: '%' },
    { tipo: 'peso-proporcional', titulo: 'Mais Pesado Proporcional', descricao: 'Maior peso ajustado pela altura', icon: Trophy, metrica: 'kg/m' },
];

const ESPECIAIS: RankingCategory[] = [
    { tipo: 'trindade-classica', titulo: 'Trindade Clássica', descricao: 'Simetria perfeita: Pescoço, Braço e Panturrilha', icon: Crown, metrica: '% harm' },
    { tipo: 'mestre-simetria', titulo: 'Mestre da Simetria', descricao: 'Menor desequilíbrio bilateral (L/R)', icon: Award, metrica: '% sim' },
    { tipo: 'ffmi', titulo: 'Índice de Densidade (FFMI)', descricao: 'Massa magra proporcional à altura', icon: Zap, metrica: 'FFMI' },
    { tipo: 'the-architect', titulo: 'The Architect (Maior Evolução)', descricao: 'Maior convergência para o alvo em 90 dias', icon: TrendingUp, metrica: '% evo' },
];

// Card com dados reais
const RankingCard: React.FC<{ category: RankingCategory; usuarios: RankingUser[] }> = ({ category, usuarios }) => {
    const Icon = category.icon;

    const getMedalColor = (position: number) => {
        if (position === 1) return 'text-yellow-400';
        if (position === 2) return 'text-gray-300';
        if (position === 3) return 'text-amber-600';
        return 'text-gray-500';
    };

    const getMedalEmoji = (position: number) => {
        if (position === 1) return '🥇';
        if (position === 2) return '🥈';
        if (position === 3) return '🥉';
        return `#${position}`;
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all hover:bg-white/[0.07]">
            <div className="p-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{category.titulo}</h3>
                        <p className="text-sm text-gray-400">{category.descricao}</p>
                    </div>
                </div>
            </div>

            {usuarios.length === 0 ? (
                <div className="p-10 flex flex-col items-center justify-center text-center gap-3">
                    <Lock size={32} className="text-gray-600" />
                    <p className="text-gray-500 text-sm">Sem dados suficientes para o ranking</p>
                    <p className="text-gray-600 text-xs">Cadastre atletas e realize avaliações para popular este ranking</p>
                </div>
            ) : (
                <div className="p-6">
                    <div className="space-y-2">
                        {usuarios.slice(0, 10).map((usuario, index) => {
                            const posicao = index + 1;
                            return (
                                <div
                                    key={usuario.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${getMedalColor(posicao)}`}>
                                        <span>{getMedalEmoji(posicao)}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-sm border border-white/20">
                                        {usuario.nome.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium text-sm text-white truncate block">{usuario.nome}</span>
                                        {usuario.badge && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/20 text-secondary border border-white/10">
                                                {usuario.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold font-mono text-white">
                                            {usuario.valor.toFixed(1)}
                                            <span className="text-xs text-gray-400 ml-1">{category.metrica}</span>
                                        </div>
                                        {usuario.variacao !== undefined && (
                                            <div className={`text-xs font-medium ${usuario.variacao >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center justify-end gap-1`}>
                                                <TrendingUp size={10} className={usuario.variacao < 0 ? 'rotate-180' : ''} />
                                                {usuario.variacao >= 0 ? '+' : ''}{usuario.variacao.toFixed(1)}%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente Principal
export const HallDosDeuses: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'principais' | 'especiais'>('principais');
    const { personalAthletes } = useDataStore();

    // Construir rankings a partir dos dados reais dos atletas
    const buildRanking = (tipo: RankingType): RankingUser[] => {
        const atletasComAvaliacoes = personalAthletes.filter(a => a.assessments && a.assessments.length > 0);

        if (atletasComAvaliacoes.length === 0) return [];

        switch (tipo) {
            case 'nota-geral':
                return atletasComAvaliacoes
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .map(a => ({ id: a.id, nome: a.name, valor: a.score || 0, variacao: a.scoreVariation, badge: a.score >= 90 ? 'ELITE' : undefined }));

            case 'shape-v':
                return atletasComAvaliacoes
                    .sort((a, b) => (b.ratio || 0) - (a.ratio || 0))
                    .map(a => ({ id: a.id, nome: a.name, valor: a.ratio || 0, badge: (a.ratio || 0) >= 1.6 ? 'FREAK' : undefined }));

            case 'gordura':
                return atletasComAvaliacoes
                    .filter(a => (a.assessments[0].bf || 0) > 0)
                    .sort((a, b) => (a.assessments[0].bf || 0) - (b.assessments[0].bf || 0)) // Menor BF ganha
                    .map(a => ({ id: a.id, nome: a.name, valor: a.assessments[0].bf || 0, badge: (a.assessments[0].bf || 0) <= 8 ? 'RIBBED' : undefined }));

            case 'peso-proporcional':
                return atletasComAvaliacoes
                    .map(a => {
                        const height = a.assessments[0].measurements.height / 100; // metros
                        const weight = a.assessments[0].measurements.weight;
                        const value = height > 0 ? weight / height : 0;
                        return { id: a.id, nome: a.name, valor: Math.round(value * 10) / 10 };
                    })
                    .sort((a, b) => b.valor - a.valor);

            case 'trindade-classica':
                return atletasComAvaliacoes
                    .map(a => {
                        const assessment = a.assessments[0];
                        let valor = 0;
                        try {
                            // assessment.proporcoes = result.scores (salvo no mapper)
                            const json = assessment.proporcoes;
                            if (json) {
                                // json.proporcoes.detalhes.detalhes = ProporcaoDetalhe[]
                                const detalhes = json?.proporcoes?.detalhes?.detalhes || json?.proporcoes?.detalhes;
                                if (Array.isArray(detalhes)) {
                                    const triade = detalhes.find((d: any) => d.proporcao === 'triade');
                                    valor = triade?.percentualDoIdeal || triade?.valor || 0;
                                }
                            }
                            // Fallback para o score geral se não achou detalhes
                            if (valor === 0) valor = assessment.score || 0;
                        } catch (e) { valor = assessment.score || 0; }
                        return { id: a.id, nome: a.name, valor: Math.round(valor * 10) / 10 };
                    })
                    .sort((a, b) => b.valor - a.valor);

            case 'mestre-simetria':
                return atletasComAvaliacoes
                    .map(a => {
                        let valor = 0;
                        try {
                            // json = result.scores, portanto json.simetria.valor
                            const json = a.assessments[0].proporcoes;
                            if (json) {
                                valor = json?.simetria?.valor || json?.simetria?.detalhes?.score || 0;
                            }
                            if (valor === 0) valor = a.score || 0;
                        } catch (e) { valor = a.score || 0; }
                        return { id: a.id, nome: a.name, valor: Math.round(valor * 10) / 10 };
                    })
                    .sort((a, b) => b.valor - a.valor);

            case 'ffmi':
                return atletasComAvaliacoes
                    .filter(a => (a.assessments[0].ffmi || 0) > 0)
                    .sort((a, b) => (b.assessments[0].ffmi || 0) - (a.assessments[0].ffmi || 0))
                    .map(a => ({ id: a.id, nome: a.name, valor: a.assessments[0].ffmi || 0, badge: (a.assessments[0].ffmi || 0) >= 22 ? 'NATTY?' : undefined }));

            case 'the-architect':
                return atletasComAvaliacoes
                    .filter(a => (a.scoreVariation || 0) > 0)
                    .sort((a, b) => (b.scoreVariation || 0) - (a.scoreVariation || 0))
                    .map(a => ({ id: a.id, nome: a.name, valor: a.scoreVariation || 0, badge: (a.scoreVariation || 0) >= 15 ? 'ON FIRE' : undefined }));

            default:
                return atletasComAvaliacoes
                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                    .map(a => ({ id: a.id, nome: a.name, valor: a.score || 0 }));
        }
    };

    const displayCategories = selectedTab === 'principais' ? PRINCIPAIS : ESPECIAIS;

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">HALL DOS DEUSES</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Compare-se com os melhores e domine as métricas do físico clássico
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Hero Banner */}
                <div className="w-full h-[400px] md:h-[500px] rounded-2xl relative overflow-hidden group shadow-2xl shadow-black/50 border border-white/10">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop')`,
                            backgroundPosition: 'center'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/90 to-transparent" />
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="absolute right-10 md:right-32 top-1/2 -translate-y-1/2 w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center pointer-events-none opacity-60">
                        <div className="w-40 h-40 border border-secondary/30 rounded-full" />
                        <div className="absolute w-full h-[1px] bg-primary/20 rotate-45" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 max-w-3xl">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-[10px] md:text-xs font-bold px-2.5 py-1 rounded border tracking-wider uppercase text-primary bg-primary/20 border-primary/20">
                                RANKINGS GLOBAIS
                            </span>
                            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium uppercase">
                                <Calendar size={14} className="text-gray-500" />
                                {format(new Date(), "d MMM, yyyy", { locale: ptBR })}
                            </span>
                        </div>

                        <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-3">
                            COMPETE COM OS <br className="hidden md:block" /> MELHORES
                        </h3>

                        <p className="text-gray-300 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-light">
                            Rankings baseados em dados <strong className="text-primary font-medium">100% reais</strong> dos atletas. Cadastre seus alunos e realize avaliações para aparecer no ranking.
                        </p>

                        <div className="flex items-center gap-4">
                            <a href="#rankings" className="text-white text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group/btn cursor-pointer">
                                Ver rankings
                                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Empty state global se não há atletas */}
                {personalAthletes.length === 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
                        <Users size={48} className="text-gray-600" />
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Nenhum atleta cadastrado ainda</h3>
                            <p className="text-gray-400 text-sm max-w-md">
                                Para aparecer nos rankings, cadastre seus atletas e realize avaliações. Os dados são calculados automaticamente com base nas métricas reais.
                            </p>
                        </div>
                    </div>
                )}

                {/* Rankings Grid */}
                {personalAthletes.length > 0 && (
                    <div id="rankings" className="flex flex-col gap-6">
                        {/* Tabs */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedTab('principais')}
                                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${selectedTab === 'principais'
                                    ? 'bg-primary/10 text-primary border border-white/10'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Rankings Principais
                            </button>
                            <button
                                onClick={() => setSelectedTab('especiais')}
                                className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${selectedTab === 'especiais'
                                    ? 'bg-secondary/10 text-secondary border border-white/10'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                Rankings Especiais
                            </button>
                        </div>

                        {/* Grid de Rankings */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
                            {displayCategories.map((category) => (
                                <RankingCard
                                    key={category.tipo}
                                    category={category}
                                    usuarios={buildRanking(category.tipo)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="h-px w-full bg-white/5" />

                {/* Footer Info */}
                <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                <Trophy size={18} className="text-primary" />
                                Como funciona?
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Os rankings são calculados com base nas avaliações mais recentes dos seus atletas.
                                Sua posição reflete o desempenho em cada métrica no contexto dos seus alunos.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                <Zap size={18} className="text-primary" />
                                Dica Pro
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Foque em melhorar os pontos fracos dos seus atletas! Use o Coach IA para criar estratégias personalizadas
                                e elevar os scores. A consistência é a chave para se tornar um mestre.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
