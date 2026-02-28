import React from 'react';
import { ChevronRight, Library, Info, Tag, History } from 'lucide-react';

interface LibraryViewProps {
    onNavigateToSource: (sourceId: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onNavigateToSource }) => {
    const sources = [
        {
            id: 'golden-ratio',
            title: 'Proporções Áureas e Ideais Corporais',
            description: 'A base científica do VITRÚVIO para avaliação de simetria, incluindo o Grecian Ideal de Sandow, as proporções de Steve Reeves e o Modelo Científico de Casey Butt.',
            iconColor: 'text-amber-500',
            bgIconColor: 'bg-amber-500/10',
            icon: <Library className="w-5 h-5 text-amber-500" />,
            badges: ['Estética', 'Módulo de Avaliação'],
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
