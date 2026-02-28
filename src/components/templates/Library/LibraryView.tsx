import React from 'react';
import { ChevronRight, Library, Flame, Dumbbell, Beef, Scale, Activity, GitBranch, Heart } from 'lucide-react';

interface LibraryViewProps {
    onNavigateToSource: (sourceId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigateToSource }) => {
    const sources = [
        {
            id: 'golden-ratio',
            title: 'Proporções Áureas e Ideais Corporais',
            description: 'A base científica do VITRÚVIO para avaliação de simetria, incluindo o Grecian Ideal de Sandow, as proporções de Steve Reeves e o Modelo Científico de Casey Butt.',
            bgIconColor: 'bg-amber-500/10',
            icon: <Library className="w-5 h-5 text-amber-500" />,
            badges: ['Estética', 'Módulo de Avaliação'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        },
        {
            id: 'metabolism',
            title: 'Metabolismo e Gasto Energético',
            description: 'Equações científicas de TMB (Mifflin-St Jeor, Katch-McArdle), NEAT, EAT, TEF e adaptação metabólica — base para cálculo de necessidades calóricas e planos de dieta.',
            bgIconColor: 'bg-orange-500/10',
            icon: <Flame className="w-5 h-5 text-orange-500" />,
            badges: ['Diagnóstico', 'Plano de Dieta'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        },
        {
            id: 'training-volume',
            title: 'Volume de Treino para Hipertrofia',
            description: 'MEV, MAV e MRV por grupo muscular. Meta-análises de Schoenfeld, Krieger, Pelland. Tabelas de volume por nível de experiência, periodização em mesociclos e sinais de overreaching.',
            bgIconColor: 'bg-blue-500/10',
            icon: <Dumbbell className="w-5 h-5 text-blue-400" />,
            badges: ['Plano de Treino', 'Hipertrofia'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        },
        {
            id: 'protein',
            title: 'Proteína para Hipertrofia',
            description: 'Necessidades proteicas por objetivo (1.6–2.8 g/kg), leucine threshold, distribuição em refeições, timing, proteína no déficit e qualidade de fontes (PDCAAS/DIAAS).',
            bgIconColor: 'bg-violet-500/10',
            icon: <Beef className="w-5 h-5 text-violet-400" />,
            badges: ['Plano de Dieta', 'Nutrição'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        },
        {
            id: 'energy-balance',
            title: 'Déficit e Superávit Calórico',
            description: 'Taxas de perda/ganho de peso por % de gordura e nível de experiência, recomposição corporal, adaptação metabólica, platôs e protocolo de ajuste calórico.',
            bgIconColor: 'bg-emerald-500/10',
            icon: <Scale className="w-5 h-5 text-emerald-400" />,
            badges: ['Plano de Dieta', 'Composição Corporal'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        },
        {
            id: 'training-frequency',
            title: 'Frequência de Treino',
            description: 'MPS timeline, meta-análises de Schoenfeld (2016/2019), frequência ótima por grupo muscular, comparação de splits e trade-off volume/sessão vs frequência.',
            bgIconColor: 'bg-cyan-500/10',
            icon: <Activity className="w-5 h-5 text-cyan-400" />,
            badges: ['Plano de Treino', 'Hipertrofia'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        },
        {
            id: 'periodization',
            title: 'Periodização de Treino',
            description: 'Modelos LP, DUP, WUP e Blocos — evidências sobre periodizado vs não-periodizado, deload (consenso Delphi), progressão de carga e estrutura de mesociclos.',
            bgIconColor: 'bg-indigo-500/10',
            icon: <GitBranch className="w-5 h-5 text-indigo-400" />,
            badges: ['Plano de Treino', 'Evolução'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        },
        {
            id: 'feminine-proportions',
            title: 'Proporções Corporais Femininas',
            description: 'WHR (Venus Index), tipos de corpo (ampulheta/pera/retângulo/maçã), categorias de competição (Bikini/Wellness/Figure), gordura corporal feminina e ciclo menstrual.',
            bgIconColor: 'bg-rose-500/10',
            icon: <Heart className="w-5 h-5 text-rose-400" />,
            badges: ['Avaliação', 'Feminino'],
            version: 'v1.0',
            lastUpdate: 'Fev 2026'
        }
    ];


    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex items-center justify-between animate-fade-in-up">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">BIBLIOTECA CIENTÍFICA</h1>
                        <p className="text-gray-400 mt-2 font-light">
                            Documentação e literatura técnica que fundamentam as análises da IA do VITRÚVIO
                        </p>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* List View */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    {/* List Headers */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-4 bg-white/5 border-b border-card-border">
                        <div className="col-span-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Fonte
                        </div>
                        <div className="col-span-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Categorias
                        </div>
                        <div className="col-span-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Versão
                        </div>
                        <div className="col-span-1 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Ação
                        </div>
                    </div>

                    <div className="divide-y divide-card-border">
                        {sources.map(source => (
                            <div
                                key={source.id}
                                onClick={() => onNavigateToSource(source.id)}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                {/* Title & Desc */}
                                <div className="col-span-1 md:col-span-6 flex gap-3 items-center">
                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${source.bgIconColor}`}>
                                        {source.icon}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <h3 className="text-white font-medium group-hover:text-primary transition-colors truncate">
                                            {source.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 truncate">
                                            {source.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="col-span-1 md:col-span-3 flex flex-wrap gap-2">
                                    {source.badges.map(badge => (
                                        <span key={badge} className="px-3 py-1 rounded-full text-xs font-medium border bg-white/5 border-white/10 text-gray-300 whitespace-nowrap">
                                            {badge}
                                        </span>
                                    ))}
                                </div>

                                {/* Version & Date */}
                                <div className="col-span-1 md:col-span-2 flex flex-col">
                                    <span className="text-white font-semibold text-sm">{source.version}</span>
                                    <span className="text-xs text-gray-400">{source.lastUpdate}</span>
                                </div>

                                {/* Action */}
                                <div className="hidden md:flex col-span-1 items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {sources.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">Nenhuma fonte científica disponível no momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
