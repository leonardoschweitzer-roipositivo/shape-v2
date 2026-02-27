// RankingPersonaisPage - Main page composition
// VITRU IA - Ranking Personais

import React from 'react';
import { Info, Award, Trophy, List, BarChart3, Calendar, ArrowRight, Users, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePersonalRankingStore } from '@/stores/personalRankingStore';
import { PersonalTop3 } from './PersonalTop3';
import { PersonalRankingFilters } from './PersonalRankingFilters';
import { PersonalRankingTable } from './PersonalRankingTable';
import { PersonalStatsSummary } from './PersonalStatsSummary';
import { PersonalPublicProfile } from './PersonalPublicProfile';

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle: string }> = ({
    icon,
    title,
    subtitle,
}) => (
    <div className="flex items-center gap-3 mb-4 animate-fade-in-up">
        <div className="p-2 bg-[#131B2C] rounded-xl text-primary border border-white/10 shadow-lg">
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
            <p className="text-[10px] text-gray-500 font-medium">{subtitle}</p>
        </div>
    </div>
);

export const RankingPersonaisPage: React.FC = () => {
    const {
        filteredPersonals,
        selectedPersonal,
        filters,
        stats,
        hasMore,
        setFilters,
        resetFilters,
        selectPersonal,
        loadMore,
    } = usePersonalRankingStore();

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Header Section */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">RANKING PERSONAIS</h2>
                    <p className="text-gray-400 mt-2 font-light">
                        Os melhores profissionais baseado em resultados reais dos seus atletas
                    </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Hero Banner */}
                <div className="w-full h-[400px] md:h-[500px] rounded-2xl relative overflow-hidden group shadow-2xl shadow-black/50 border border-white/10 animate-fade-in-up">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=2034&auto=format&fit=crop')`,
                            backgroundPosition: 'center 20%'
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
                                ELITE DOS TREINADORES
                            </span>
                            <span className="text-gray-400 text-xs flex items-center gap-1.5 font-medium uppercase">
                                <Calendar size={14} className="text-gray-500" />
                                {format(new Date(), "d MMM, yyyy", { locale: ptBR })}
                            </span>
                        </div>

                        <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-3">
                            OS MESTRES DO <br className="hidden md:block" /> RESULTADO REAL
                        </h3>

                        <p className="text-gray-300 text-sm md:text-base max-w-lg mb-8 leading-relaxed font-light">
                            Conheça os profissionais que mais geram <strong className="text-primary font-medium">evolução estética</strong> e consistência. O ranking é baseado em dados 100% reais dos alunos.
                        </p>

                        <div className="flex items-center gap-4">
                            <a href="#filtros" className="text-white text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 group/btn cursor-pointer">
                                Explorar Ranking
                                <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Filters Section */}
                <div id="filtros" className="flex flex-col gap-4">
                    <SectionHeader
                        icon={<Award size={20} className="text-secondary" />}
                        title="Busca e Filtros"
                        subtitle="Refine sua busca por categoria, região e período"
                    />
                    <PersonalRankingFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        onReset={resetFilters}
                    />
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Empty State — ranking global ainda não integrado ao Supabase */}
                {filteredPersonals.length === 0 && (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-4">
                        <Lock size={48} className="text-gray-600" />
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Ranking em breve</h3>
                            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                                O ranking global de personais é calculado a partir dos dados de todos os treinadores na plataforma.
                                Esta funcionalidade estará disponível quando a plataforma estiver com múltiplos usuários cadastrados.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                            <Users size={16} className="text-primary" />
                            <span className="text-primary text-sm font-medium">Você já está registrado e será ranqueado automaticamente</span>
                        </div>
                    </div>
                )}

                {/* TOP 3 Podium — só aparece com dados reais */}
                {filteredPersonals.length >= 3 && (
                    <div className="flex flex-col gap-4">
                        <SectionHeader
                            icon={<Trophy size={20} className="text-yellow-500" />}
                            title="Líderes do Mês"
                            subtitle="Os profissionais com maior pontuação no período selecionado"
                        />
                        <PersonalTop3
                            personals={filteredPersonals}
                            onSelectPersonal={selectPersonal}
                        />
                    </div>
                )}

                {filteredPersonals.length > 0 && <div className="h-px w-full bg-white/5" />}

                {/* Ranking Table Section */}
                {filteredPersonals.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <SectionHeader
                            icon={<List size={20} className="text-primary" />}
                            title="Classificação Completa"
                            subtitle="Lista detalhada por score, evolução e número de atletas"
                        />
                        <PersonalRankingTable
                            personals={filteredPersonals}
                            onSelectPersonal={selectPersonal}
                            onLoadMore={loadMore}
                            hasMore={hasMore}
                        />
                    </div>
                )}

                {filteredPersonals.length > 0 && <div className="h-px w-full bg-white/5" />}

                {/* Stats Summary section */}
                {filteredPersonals.length > 0 && (
                    <div className="flex flex-col gap-4">
                        <SectionHeader
                            icon={<BarChart3 size={20} className="text-secondary" />}
                            title="Visão Analítica"
                            subtitle="Estatísticas globais do ecossistema de personais na plataforma"
                        />
                        <PersonalStatsSummary stats={stats} />
                    </div>
                )}

                <div className="h-px w-full bg-white/5" />

                {/* Info Banner at the bottom */}
                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 flex items-start gap-3 opacity-80">
                    <Info size={20} className="text-secondary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="text-secondary font-medium uppercase tracking-wider text-xs">Ranking Meritocrático</p>
                        <p className="text-gray-400 mt-1 leading-relaxed">
                            Classificação baseada na evolução real dos atletas, consistência de resultados,
                            correção de assimetrias e engajamento na plataforma. Não é um ranking de popularidade.
                        </p>
                    </div>
                </div>
            </div>

            {/* Public Profile Modal */}
            <PersonalPublicProfile
                profile={selectedPersonal}
                onClose={() => selectPersonal(null)}
            />
        </div>
    );
};

export default RankingPersonaisPage;
