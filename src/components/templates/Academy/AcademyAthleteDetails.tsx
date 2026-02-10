import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, User, Activity } from 'lucide-react';
import { BarraScore } from '@/components/molecules/BarraScore';
import { CardMedidaBilateral } from '@/components/molecules/CardMedidaBilateral';
import { getAthleteDetails, getAthleteEvolutionData } from '@/mocks/academyAthletes';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export interface AcademyAthleteDetailsProps {
    athleteId: string;
    onBack: () => void;
    onConsultAssessment: (assessmentId: string) => void;
}

export const AcademyAthleteDetails: React.FC<AcademyAthleteDetailsProps> = ({
    athleteId,
    onBack,
    onConsultAssessment
}) => {
    const details = getAthleteDetails(athleteId);
    const evolutionData = getAthleteEvolutionData(athleteId);

    if (!details) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-gray-500">Aluno não encontrado.</p>
            </div>
        );
    }

    const { aluno, personal, ficha, ultimaAvaliacao, ultimasMedidas, historicoAvaliacoes, estatisticas } = details;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    const calcularDiasNaAcademia = () => {
        const hoje = new Date('2026-02-10');
        const diff = hoje.getTime() - aluno.dataCadastro.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const diasNaAcademia = calcularDiasNaAcademia();

    // Preparar dados para gráficos
    const scoreChartData = evolutionData.scoreData.map(d => ({
        date: d.data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        score: d.valor
    }));

    const pesoChartData = evolutionData.pesoData.map(d => ({
        date: d.data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        peso: d.valor
    }));

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full overflow-y-auto">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full animate-fade-in-up">
                {/* Botão Voltar */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary transition-all group w-fit"
                >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Voltar para lista</span>
                </button>

                {/* SEÇÃO 1: Header do Aluno */}
                <div className="bg-card-dark border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <User size={120} />
                    </div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {aluno.fotoUrl ? (
                                <img
                                    src={aluno.fotoUrl}
                                    alt={aluno.nome}
                                    className="w-40 h-40 rounded-3xl object-cover border-2 border-white/10 shadow-2xl"
                                />
                            ) : (
                                <div className="w-40 h-40 rounded-3xl bg-primary/10 border-2 border-white/10 flex items-center justify-center shadow-2xl">
                                    <span className="text-5xl font-bold text-primary">
                                        {aluno.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Informações */}
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-white tracking-tighter mb-2">{aluno.nome}</h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        {aluno.email && (
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <Mail className="w-4 h-4 text-primary" />
                                                <span>{aluno.email}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span>{aluno.telefone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${aluno.status === 'ATIVO' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                    {aluno.status === 'ATIVO' ? 'ATIVO' : 'INATIVO'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Idade</div>
                                    <div className="text-lg font-bold text-white tracking-tight">{aluno.idade} anos</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Sexo</div>
                                    <div className="text-lg font-bold text-white tracking-tight">{aluno.sexo === 'M' ? 'Masculino' : 'Feminino'}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Na academia há</div>
                                    <div className="text-lg font-bold text-white tracking-tight">{diasNaAcademia} dias</div>
                                </div>
                            </div>

                            {/* Personal Responsável */}
                            <div className="pt-4">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Personal Responsável</p>
                                <div className="flex items-center gap-4 justify-center md:justify-start bg-card-dark/50 p-3 rounded-2xl border border-white/5 w-fit">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{personal.nome}</div>
                                        <div className="text-xs text-gray-400">{personal.telefone}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO 2: Última Avaliação */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">ÚLTIMA AVALIAÇÃO</h2>
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                            {formatDate(ultimaAvaliacao.data)}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Score Geral */}
                        <div className="bg-card-dark border border-white/10 rounded-2xl p-8 flex flex-col justify-center">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Score Geral VITRU</h3>
                            <div className="flex flex-col items-center justify-center mb-8">
                                <div className="text-8xl font-bold text-primary tracking-tighter">{ultimaAvaliacao.score}</div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">Pontuação Atual</div>
                            </div>
                            <BarraScore
                                score={ultimaAvaliacao.score}
                                classificacao={ultimaAvaliacao.classificacao}
                                mostrarEscala={true}
                            />
                        </div>

                        <div className="space-y-8">
                            {/* Composição Corporal */}
                            <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 tracking-widest">Composição Corporal</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Peso Total', valor: `${ultimaAvaliacao.composicao.peso} kg`, color: 'text-white' },
                                        { label: 'Gordura', valor: `${ultimaAvaliacao.composicao.gorduraCorporal?.toFixed(1)}%`, color: 'text-orange-500' },
                                        { label: 'Massa Magra', valor: `${ultimaAvaliacao.composicao.massaMagra?.toFixed(1)} kg`, color: 'text-green-500' },
                                        { label: 'Massa Gorda', valor: `${ultimaAvaliacao.composicao.massaGorda?.toFixed(1)} kg`, color: 'text-red-500' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                                            <div className={`text-xl font-bold tracking-tight ${item.color}`}>{item.valor}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Simetria & Proporções Resumo */}
                            <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Equilíbrio Estético</h2>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold text-green-500">{ultimaAvaliacao.simetria.score}%</span>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white uppercase tracking-wider">Score Simetria</div>
                                        <div className="text-xs text-green-500/80 font-medium">{ultimaAvaliacao.simetria.classificacao}</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {ultimaAvaliacao.proporcoes.slice(0, 2).map((prop, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                                <span className="text-gray-400">{prop.nome}</span>
                                                <span className="text-primary">{prop.percentual}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${prop.percentual}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO 3 & 4: Ficha e Medidas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ficha do Atleta */}
                    <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-white tracking-tight uppercase mb-8 flex items-center gap-3">
                            <span className="p-2 bg-primary/10 rounded-lg"><Calendar className="w-5 h-5 text-primary" /></span>
                            Ficha Estrutural
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Altura', valor: `${ficha.altura} cm` },
                                { label: 'Punho', valor: `${ficha.punho} cm` },
                                { label: 'Tornozelo', valor: `${ficha.tornozelo} cm` },
                                { label: 'Joelho', valor: `${ficha.joelho} cm` }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                                    <div className="text-xl font-bold text-white tracking-tight">{item.valor}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Objetivo</span>
                                <span className="text-sm font-bold text-primary uppercase">{ficha.objetivo}</span>
                            </div>
                            {ficha.categoriaPreferida && (
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</span>
                                    <span className="text-sm font-bold text-secondary uppercase">{ficha.categoriaPreferida}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medidas Tronco */}
                    <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-bold text-white tracking-tight uppercase mb-8 flex items-center gap-3">
                            <span className="p-2 bg-primary/10 rounded-lg"><Activity className="w-5 h-5 text-primary" /></span>
                            Medidas do Tronco
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'Ombros', valor: `${ultimasMedidas.ombros} cm` },
                                { label: 'Peitoral', valor: `${ultimasMedidas.peitoral} cm` },
                                { label: 'Cintura', valor: `${ultimasMedidas.cintura} cm` },
                                { label: 'Quadril', valor: `${ultimasMedidas.quadril} cm` }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                                    <div className="text-xl font-bold text-white tracking-tight">{item.valor}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Medidas Bilaterais */}
                <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                    <h2 className="text-xl font-bold text-white tracking-tight uppercase mb-8">Simetria de Membros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CardMedidaBilateral label="BRAÇO" valorDireito={ultimasMedidas.bracoD} valorEsquerdo={ultimasMedidas.bracoE} unidade="cm" />
                        <CardMedidaBilateral label="ANTEBRAÇO" valorDireito={ultimasMedidas.antebracoD} valorEsquerdo={ultimasMedidas.antebracoE} unidade="cm" />
                        <CardMedidaBilateral label="COXA" valorDireito={ultimasMedidas.coxaD} valorEsquerdo={ultimasMedidas.coxaE} unidade="cm" />
                        <CardMedidaBilateral label="PANTURRILHA" valorDireito={ultimasMedidas.panturrilhaD} valorEsquerdo={ultimasMedidas.panturrilhaE} unidade="cm" />
                    </div>
                </div>

                {/* SEÇÃO 5: Evolução */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase border-b border-white/10 pb-4">📈 Histórico de Evolução</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Curva de Desempenho (Score)</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={scoreChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                                        <XAxis dataKey="date" stroke="#4A5568" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#4A5568" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748', borderRadius: '12px' }} itemStyle={{ color: '#00D9A5', fontWeight: 700 }} />
                                        <Line type="monotone" dataKey="score" stroke="#00D9A5" strokeWidth={4} dot={{ fill: '#00D9A5', r: 5, strokeWidth: 2, stroke: '#0F172A' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Flutuação de Peso</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={pesoChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                                        <XAxis dataKey="date" stroke="#4A5568" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#4A5568" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748', borderRadius: '12px' }} itemStyle={{ color: '#3B82F6', fontWeight: 700 }} />
                                        <Line type="monotone" dataKey="peso" stroke="#3B82F6" strokeWidth={4} dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#0F172A' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Performance Agregada</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: 'Evolução Score', valor: `${estatisticas.evolucaoScore > 0 ? '+' : ''}${estatisticas.evolucaoScore} pts`, sub: 'desde o início', trend: 'up' },
                                        { label: 'Variação Peso', valor: `${estatisticas.evolucaoPeso > 0 ? '+' : ''}${estatisticas.evolucaoPeso.toFixed(1)} kg`, sub: 'desde o início', trend: estatisticas.evolucaoPeso <= 0 ? 'up' : 'down' },
                                        { label: 'Frequência', valor: `${estatisticas.mediaFrequenciaAvaliacoes} dias`, sub: 'média entre avals', trend: 'neutral' }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                                                <div className="text-sm text-gray-400 font-medium">{stat.sub}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-xl font-bold tracking-tight ${stat.trend === 'up' ? 'text-green-500' : stat.trend === 'down' ? 'text-orange-500' : 'text-white'}`}>
                                                    {stat.valor}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card-dark border border-white/10 rounded-2xl p-8">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Totais Acadêmicos</h3>
                                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-5xl font-bold text-white mb-2">{estatisticas.totalAvaliacoes}</div>
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avaliações Feitas</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEÇÃO 6: Histórico de Avaliações */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase px-2">📅 Linha do Tempo</h2>
                    <div className="bg-card-dark border border-white/10 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Data</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Score</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Classificação</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Peso</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {historicoAvaliacoes.map((avaliacao) => (
                                    <tr key={avaliacao.id} className="hover:bg-primary/5 transition-all group">
                                        <td className="px-8 py-5 text-sm font-medium text-white">{formatDate(avaliacao.data)}</td>
                                        <td className="px-8 py-5">
                                            <span className="text-lg font-bold text-primary tracking-tight">{avaliacao.score}</span>
                                            <span className="text-[10px] text-gray-500 ml-1">pts</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-gray-400">
                                                {avaliacao.classificacao}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-400 font-medium">{avaliacao.peso} kg</td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => onConsultAssessment(avaliacao.id)}
                                                className="px-6 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-background-dark border border-primary/20 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all"
                                            >
                                                Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
