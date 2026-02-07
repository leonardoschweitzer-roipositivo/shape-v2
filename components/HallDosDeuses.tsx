import React, { useState } from 'react';
import { Trophy, Medal, TrendingUp, Flame, Award, Target, Zap, Crown, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
    avatar?: string;
    valor: number;
    variacao?: number;
    badge?: string;
}

interface RankingData {
    tipo: RankingType;
    titulo: string;
    descricao: string;
    icon: React.ElementType;
    metrica: string;
    usuarios: RankingUser[];
}

// Componente de Card de Ranking
const RankingCard: React.FC<{ data: RankingData; userPosition?: number }> = ({ data, userPosition = 4 }) => {
    const Icon = data.icon;

    const getMedalColor = (position: number) => {
        if (position === 1) return 'text-primary';
        if (position === 2) return 'text-gray-300';
        if (position === 3) return 'text-gray-400';
        return 'text-gray-500';
    };

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all hover:bg-white/[0.07]">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{data.titulo}</h3>
                        <p className="text-sm text-gray-400">{data.descricao}</p>
                    </div>
                </div>
            </div>

            {/* Lista de Rankings */}
            <div className="p-6">
                <div className="space-y-2">
                    {data.usuarios.slice(0, 10).map((usuario, index) => {
                        const posicao = index + 1;
                        const isUser = posicao === userPosition;

                        return (
                            <div
                                key={usuario.id}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isUser
                                    ? 'bg-primary/10 border border-primary/20'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {/* Posição */}
                                <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${getMedalColor(posicao)}`}>
                                    {posicao <= 3 ? (
                                        <Medal size={18} />
                                    ) : (
                                        <span>#{posicao}</span>
                                    )}
                                </div>

                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-semibold text-sm border border-white/20">
                                    {usuario.avatar || usuario.nome.charAt(0).toUpperCase()}
                                </div>

                                {/* Nome e Badge */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium text-sm truncate ${isUser ? 'text-primary' : 'text-white'}`}>
                                            {usuario.nome} {isUser && <span className="text-xs text-gray-400">(Você)</span>}
                                        </span>
                                        {usuario.badge && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/20">
                                                {usuario.badge}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Valor */}
                                <div className="text-right">
                                    <div className="text-lg font-bold font-mono text-white">
                                        {usuario.valor.toFixed(posicao <= 3 ? 2 : 1)}
                                        <span className="text-xs text-gray-400 ml-1">{data.metrica}</span>
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

            {/* Footer com estatística */}
            <div className="bg-white/5 p-4 border-t border-white/10">
                <div className="text-center">
                    <span className="text-xs text-gray-400">
                        Você está entre os top <span className="font-bold text-primary">{((userPosition / data.usuarios.length) * 100).toFixed(0)}%</span> nesta categoria
                    </span>
                </div>
            </div>
        </div>
    );
};

// Dados de exemplo (mock data)
const mockRankings: RankingData[] = [
    {
        tipo: 'nota-geral',
        titulo: 'Ranking Geral',
        descricao: 'Os físicos mais completos e harmônicos da plataforma',
        icon: Trophy,
        metrica: 'pts',
        usuarios: [
            { id: '1', nome: 'Marcus Silva', valor: 95.8, variacao: 2.3, badge: 'ELITE' },
            { id: '2', nome: 'Rafael Costa', valor: 92.4, variacao: 1.8 },
            { id: '3', nome: 'Lucas Fernandes', valor: 89.7, variacao: -0.5 },
            { id: '4', nome: 'Você', valor: 85.2, variacao: 3.1 },
            { id: '5', nome: 'Carlos Mendes', valor: 84.9, variacao: 1.2 },
            { id: '6', nome: 'Diego Alves', valor: 82.3, variacao: 0.8 },
            { id: '7', nome: 'Bruno Santos', valor: 81.5, variacao: 2.0 },
            { id: '8', nome: 'Felipe Lima', valor: 79.8, variacao: -1.2 },
            { id: '9', nome: 'Thiago Rodrigues', valor: 78.6, variacao: 0.5 },
            { id: '10', nome: 'André Oliveira', valor: 77.4, variacao: 1.9 }
        ]
    },
    {
        tipo: 'shape-v',
        titulo: 'Ranking Shape-V',
        descricao: 'Os V-Tapers mais impressionantes - ombros largos e cintura fina',
        icon: Target,
        metrica: 'ratio',
        usuarios: [
            { id: '1', nome: 'Rafael Costa', valor: 1.62, variacao: 0.8, badge: 'FREAK' },
            { id: '2', nome: 'Marcus Silva', valor: 1.59, variacao: 1.2 },
            { id: '3', nome: 'Diego Alves', valor: 1.58, variacao: 0.5 },
            { id: '4', nome: 'Você', valor: 1.56, variacao: 2.1 },
            { id: '5', nome: 'Lucas Fernandes', valor: 1.54, variacao: 0.3 },
            { id: '6', nome: 'Bruno Santos', valor: 1.52, variacao: 1.5 },
            { id: '7', nome: 'Carlos Mendes', valor: 1.51, variacao: -0.2 },
            { id: '8', nome: 'Felipe Lima', valor: 1.49, variacao: 0.9 },
            { id: '9', nome: 'Thiago Rodrigues', valor: 1.47, variacao: 1.1 },
            { id: '10', nome: 'André Oliveira', valor: 1.45, variacao: 0.6 }
        ]
    },
    {
        tipo: 'gordura',
        titulo: 'Ranking de Definição',
        descricao: 'Os físicos mais secos e definidos - menor % de gordura corporal',
        icon: Flame,
        metrica: '%',
        usuarios: [
            { id: '1', nome: 'Lucas Fernandes', valor: 8.2, variacao: -1.5, badge: 'SHREDDED' },
            { id: '2', nome: 'Rafael Costa', valor: 9.1, variacao: -0.8 },
            { id: '3', nome: 'Diego Alves', valor: 9.8, variacao: -1.2 },
            { id: '4', nome: 'Você', valor: 10.5, variacao: -2.1 },
            { id: '5', nome: 'Marcus Silva', valor: 11.2, variacao: -0.5 },
            { id: '6', nome: 'Bruno Santos', valor: 11.9, variacao: -0.9 },
            { id: '7', nome: 'Felipe Lima', valor: 12.4, variacao: 0.3 },
            { id: '8', nome: 'Carlos Mendes', valor: 13.1, variacao: -0.6 },
            { id: '9', nome: 'Thiago Rodrigues', valor: 13.8, variacao: -1.0 },
            { id: '10', nome: 'André Oliveira', valor: 14.5, variacao: 0.2 }
        ]
    },
    {
        tipo: 'ffmi',
        titulo: 'Índice de Densidade (FFMI)',
        descricao: 'Massa magra proporcional à altura - volume muscular real independente do frame',
        icon: Zap,
        metrica: 'FFMI',
        usuarios: [
            { id: '1', nome: 'Marcus Silva', valor: 24.8, variacao: 1.2, badge: 'MASS MONSTER' },
            { id: '2', nome: 'Carlos Mendes', valor: 23.9, variacao: 0.8 },
            { id: '3', nome: 'Rafael Costa', valor: 23.2, variacao: 1.5 },
            { id: '4', nome: 'Você', valor: 22.5, variacao: 2.3 },
            { id: '5', nome: 'Bruno Santos', valor: 22.1, variacao: 1.0 },
            { id: '6', nome: 'Diego Alves', valor: 21.8, variacao: 0.6 },
            { id: '7', nome: 'Lucas Fernandes', valor: 21.4, variacao: 0.9 },
            { id: '8', nome: 'Felipe Lima', valor: 20.9, variacao: 1.3 },
            { id: '9', nome: 'Thiago Rodrigues', valor: 20.5, variacao: 0.7 },
            { id: '10', nome: 'André Oliveira', valor: 20.1, variacao: 1.1 }
        ]
    },
    {
        tipo: 'trindade-classica',
        titulo: 'Trindade Clássica',
        descricao: 'Menor variação entre Pescoço, Braço e Panturrilha - simetria de ouro',
        icon: Crown,
        metrica: '% harm',
        usuarios: [
            { id: '1', nome: 'Marcus Silva', valor: 95.9, variacao: 0.8, badge: 'HARMONIA' },
            { id: '2', nome: 'Rafael Costa', valor: 94.2, variacao: 1.2 },
            { id: '3', nome: 'Lucas Fernandes', valor: 92.8, variacao: 0.5 },
            { id: '4', nome: 'Você', valor: 91.5, variacao: 1.8 },
            { id: '5', nome: 'Diego Alves', valor: 90.3, variacao: 0.6 },
            { id: '6', nome: 'Bruno Santos', valor: 89.7, variacao: 1.1 },
            { id: '7', nome: 'Carlos Mendes', valor: 88.4, variacao: 0.9 },
            { id: '8', nome: 'Felipe Lima', valor: 87.2, variacao: 1.3 },
            { id: '9', nome: 'Thiago Rodrigues', valor: 86.5, variacao: 0.4 },
            { id: '10', nome: 'André Oliveira', valor: 85.1, variacao: 1.5 }
        ]
    },
    {
        tipo: 'mestre-simetria',
        titulo: 'Mestre da Simetria',
        descricao: 'Menor desequilíbrio bilateral (L/R) - simetria perfeita entre os lados',
        icon: Award,
        metrica: '% sim',
        usuarios: [
            { id: '1', nome: 'Rafael Costa', valor: 98.5, variacao: 0.3, badge: 'PERFEITO' },
            { id: '2', nome: 'Lucas Fernandes', valor: 97.8, variacao: 0.5 },
            { id: '3', nome: 'Marcus Silva', valor: 96.9, variacao: 0.2 },
            { id: '4', nome: 'Você', valor: 95.2, variacao: 1.2 },
            { id: '5', nome: 'Diego Alves', valor: 94.6, variacao: 0.8 },
            { id: '6', nome: 'Bruno Santos', valor: 93.9, variacao: 0.6 },
            { id: '7', nome: 'Carlos Mendes', valor: 93.1, variacao: 0.4 },
            { id: '8', nome: 'Felipe Lima', valor: 92.3, variacao: 0.9 },
            { id: '9', nome: 'Thiago Rodrigues', valor: 91.7, variacao: 0.7 },
            { id: '10', nome: 'André Oliveira', valor: 90.8, variacao: 1.0 }
        ]
    },
    {
        tipo: 'peso-proporcional',
        titulo: 'Mais Pesado Proporcional',
        descricao: 'Maior peso corporal ajustado pela altura - densidade máxima por frame',
        icon: Trophy,
        metrica: 'kg/m',
        usuarios: [
            { id: '1', nome: 'Carlos Mendes', valor: 52.8, variacao: 2.1, badge: 'HEAVYWEIGHT' },
            { id: '2', nome: 'Marcus Silva', valor: 51.3, variacao: 1.5 },
            { id: '3', nome: 'Bruno Santos', valor: 49.7, variacao: 1.8 },
            { id: '4', nome: 'Você', valor: 48.2, variacao: 2.5 },
            { id: '5', nome: 'Rafael Costa', valor: 47.5, variacao: 1.2 },
            { id: '6', nome: 'Diego Alves', valor: 46.9, variacao: 0.9 },
            { id: '7', nome: 'Lucas Fernandes', valor: 45.8, variacao: 1.4 },
            { id: '8', nome: 'Felipe Lima', valor: 45.1, variacao: 1.0 },
            { id: '9', nome: 'Thiago Rodrigues', valor: 44.3, variacao: 1.6 },
            { id: '10', nome: 'André Oliveira', valor: 43.7, variacao: 0.8 }
        ]
    },
    {
        tipo: 'the-architect',
        titulo: 'The Architect (Maior Evolução)',
        descricao: 'Maior convergência para o alvo nos últimos 90 dias - esforço e constância',
        icon: TrendingUp,
        metrica: '% evo',
        usuarios: [
            { id: '1', nome: 'Felipe Lima', valor: 15.8, variacao: 15.8, badge: 'ON FIRE' },
            { id: '2', nome: 'André Oliveira', valor: 14.2, variacao: 14.2 },
            { id: '3', nome: 'Thiago Rodrigues', valor: 12.9, variacao: 12.9 },
            { id: '4', nome: 'Você', valor: 11.5, variacao: 11.5 },
            { id: '5', nome: 'Bruno Santos', valor: 10.3, variacao: 10.3 },
            { id: '6', nome: 'Diego Alves', valor: 9.7, variacao: 9.7 },
            { id: '7', nome: 'Carlos Mendes', valor: 8.4, variacao: 8.4 },
            { id: '8', nome: 'Lucas Fernandes', valor: 7.2, variacao: 7.2 },
            { id: '9', nome: 'Rafael Costa', valor: 6.1, variacao: 6.1 },
            { id: '10', nome: 'Marcus Silva', valor: 5.3, variacao: 5.3 }
        ]
    }
];

// Componente Principal
export const HallDosDeuses: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<'principais' | 'especiais'>('principais');

    const rankingsPrincipais = mockRankings.filter(r =>
        ['nota-geral', 'shape-v', 'gordura', 'peso-proporcional'].includes(r.tipo)
    );

    const rankingsEspeciais = mockRankings.filter(r =>
        ['trindade-classica', 'mestre-simetria', 'ffmi', 'the-architect'].includes(r.tipo)
    );

    const displayRankings = selectedTab === 'principais' ? rankingsPrincipais : rankingsEspeciais;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
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
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop')`,
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/90 to-transparent"></div>

                    {/* Decorative Grid */}
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Trophy Circle Decoration */}
                    <div className="absolute right-10 md:right-32 top-1/2 -translate-y-1/2 w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center pointer-events-none opacity-60">
                        <div className="w-40 h-40 border border-secondary/30 rounded-full"></div>
                        <div className="absolute w-full h-[1px] bg-primary/20 rotate-45"></div>
                    </div>

                    {/* Content */}
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
                            Você está ranqueado entre os <strong className="text-primary font-medium">Top 40%</strong> dos atletas na plataforma. Continue evoluindo e domine as métricas do físico clássico.
                        </p>

                        <div className="flex items-center gap-4">
                            <a href="#rankings" className="text-white text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group/btn cursor-pointer">
                                Ver minha posição
                                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Main Content Area */}
                <div id="rankings" className="flex flex-col gap-6">
                    {/* Tabs */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedTab('principais')}
                            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${selectedTab === 'principais'
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Rankings Principais
                        </button>
                        <button
                            onClick={() => setSelectedTab('especiais')}
                            className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${selectedTab === 'especiais'
                                ? 'bg-secondary/10 text-secondary border border-secondary/20'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            Rankings Especiais
                        </button>
                    </div>

                    {/* Grid de Rankings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
                        {displayRankings.map((ranking) => (
                            <RankingCard
                                key={ranking.tipo}
                                data={ranking}
                                userPosition={4}
                            />
                        ))}
                    </div>
                </div>

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
                                Os rankings são atualizados diariamente com base nas avaliações mais recentes.
                                Sua posição reflete seu desempenho em cada métrica comparado a todos os usuários da plataforma.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                                <Zap size={18} className="text-primary" />
                                Dica Pro
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Foque em melhorar seus pontos fracos! Use o Coach IA para criar estratégias personalizadas
                                e escalar nos rankings. A consistência é a chave para se tornar um Deus Grego.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
