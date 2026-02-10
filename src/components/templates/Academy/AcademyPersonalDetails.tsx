import React from 'react'
import {
    Edit,
    Users,
    TrendingUp,
    Activity,
    FileText,
    Trophy,
    Mail,
    Phone,
    IdCard,
    Calendar,
    UserCheck,
    TrendingDown,
    Search,
    ArrowLeft
} from 'lucide-react'
import { usePersonalDetails } from '@/hooks/usePersonalDetails'
import { CardKPI } from '@/components/molecules/CardKPI'
import { BarraDistribuicao } from '@/components/molecules/BarraDistribuicao'
import { CardAlunoRanking } from '@/components/molecules/CardAlunoRanking'
import { CardAlunoAtencao } from '@/components/molecules/CardAlunoAtencao'
import { GraficoLinha } from '@/components/molecules/GraficoLinha'
import { SearchBar } from '@/components/molecules/SearchBar'

interface AcademyPersonalDetailsProps {
    personalId?: string;
    onBack: () => void;
}

/**
 * Tela de detalhes do Personal para visualização pela Academia
 * Design refinado seguindo os padrões "Vibe Code" do app.
 */
export const AcademyPersonalDetails: React.FC<AcademyPersonalDetailsProps> = ({
    personalId = 'personal-1', // Default para demo
    onBack
}) => {
    const academiaId = 'academy-1' // TODO: pegar do contexto de autenticação  

    const { isLoading, dados, dadosGraficos, periodoGraficos, setPeriodoGraficos } = usePersonalDetails(
        personalId,
        academiaId
    )

    const [termoBusca, setTermoBusca] = React.useState('')
    const [ordenarPor, setOrdenarPor] = React.useState<'score_desc' | 'nome_asc'>('score_desc')
    const [mostrarTodosAlunos, setMostrarTodosAlunos] = React.useState(false)

    if (isLoading || !dados) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background-dark min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 font-medium animate-pulse">Carregando detalhes do personal...</p>
                </div>
            </div>
        )
    }

    const { personal, kpis, ranking, alunos, topAlunos, alunosAtencao, distribuicao } = dados

    // Filtrar e ordenar alunos
    const alunosFiltrados = alunos
        .filter(a => a.nome.toLowerCase().includes(termoBusca.toLowerCase()))
        .sort((a, b) => {
            if (ordenarPor === 'score_desc') return b.score - a.score
            return a.nome.localeCompare(b.nome)
        })

    const alunosExibidos = mostrarTodosAlunos ? alunosFiltrados : alunosFiltrados.slice(0, 5)

    const handleVerAluno = (alunoId: string) => {
        // TODO: Implementar navegação para detalhes do aluno
        console.log('Ver aluno:', alunoId)
    }

    const formatarData = (data: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(data)
    }

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full bg-background-dark animate-fade-in-up">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">

                {/* Cabeçalho de Navegação e Título */}
                <div className="flex flex-col gap-6">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-gray-500 hover:text-primary transition-all w-fit"
                    >
                        <div className="p-1.5 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest mt-0.5">Voltar para Personais</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                                <UserCheck className="w-7 h-7 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">DETALHES DO PERSONAL</h1>
                        </div>

                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/30 transition-all text-sm font-bold uppercase tracking-wider">
                            <Edit className="w-4 h-4" />
                            <span>Editar Registro</span>
                        </button>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Card de Ficha do Personal */}
                <div className="bg-card-dark border border-card-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        {/* Foto e Status */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                {personal.fotoUrl ? (
                                    <img
                                        src={personal.fotoUrl}
                                        alt={personal.nome}
                                        className="w-32 h-32 rounded-2xl object-cover border-2 border-primary/30 p-1 bg-background-dark"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center">
                                        <span className="text-primary font-bold text-5xl opacity-80 uppercase leading-none">
                                            {personal.nome.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border shadow-lg ${personal.status === 'ATIVO'
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                                    }`}>
                                    {personal.status}
                                </div>
                            </div>
                        </div>

                        {/* Dados e Ranking */}
                        <div className="flex-1 flex flex-col lg:flex-row gap-8">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight leading-none">{personal.nome}</h2>
                                    <p className="text-gray-500 text-sm font-light">Membro verificado desde {formatarData(personal.dataVinculo)}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-300 truncate">{personal.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-300">{personal.telefone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <IdCard className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-300">{personal.cref}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-300">{personal.diasNaAcademia} dias na rede</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ranking Widget */}
                            <div className="w-full lg:w-48 p-5 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center group hover:border-primary/30 transition-all">
                                <div className="text-4xl mb-2 filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">{ranking.medalha || '👤'}</div>
                                <div className="text-2xl font-black text-primary tracking-tighter uppercase leading-none italic">
                                    {ranking.posicao}º LUGAR
                                </div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                    DE {ranking.totalPersonais} PERSONAIS
                                </div>
                                <div className="mt-3 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                    TOP {ranking.percentil}% GLOBAL
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* KPIs de Desempenho */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        INDICADORES DE DESEMPENHO
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <CardKPI
                            icone={<Users className="w-6 h-6" />}
                            titulo="BASE DE ALUNOS"
                            valorPrincipal={kpis.alunos.total}
                            subtitulo={`${kpis.alunos.ativos} ativos • ${kpis.alunos.inativos} inativos`}
                        />
                        <CardKPI
                            icone={<TrendingUp className="w-6 h-6" />}
                            titulo="SCORE MÉDIO"
                            valorPrincipal={kpis.score.medio}
                            unidade="pts"
                        />
                        <CardKPI
                            icone={<Activity className="w-6 h-6" />}
                            titulo="EVOLUÇÃO MÉDIA"
                            valorPrincipal={kpis.score.evolucaoMensal >= 0 ? `+${kpis.score.evolucaoMensal}` : kpis.score.evolucaoMensal}
                            unidade="pts/mês"
                            variacao={{
                                valor: Math.abs(kpis.score.evolucaoMensal),
                                tipo: 'ABSOLUTO',
                                direcao: kpis.score.tendencia === 'SUBINDO' ? 'UP' : kpis.score.tendencia === 'CAINDO' ? 'DOWN' : 'STABLE'
                            }}
                        />
                        <CardKPI
                            icone={<FileText className="w-6 h-6" />}
                            titulo="PRODUTIVIDADE"
                            valorPrincipal={kpis.avaliacoes.esteMes}
                            subtitulo={`${kpis.avaliacoes.mesPassado} no mês anterior`}
                            variacao={{
                                valor: kpis.avaliacoes.variacaoPercentual,
                                tipo: 'PERCENTUAL',
                                direcao: kpis.avaliacoes.esteMes > kpis.avaliacoes.mesPassado ? 'UP' : 'DOWN'
                            }}
                        />
                    </div>
                </div>

                {/* Distribuição por Classificação */}
                <div className="bg-card-dark border border-card-border rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8 opacity-80 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Distribuição Técnica dos Alunos
                    </h3>
                    <BarraDistribuicao dados={distribuicao.map(d => ({
                        label: d.emoji + ' ' + d.classificacao.replace('_', ' '),
                        emoji: d.emoji,
                        valor: d.quantidade,
                        percentual: d.percentual,
                        cor: d.corBarra
                    }))} />
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Alunos */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            TOP PERFORMERS
                        </h2>
                        <div className="space-y-3">
                            {topAlunos.map((top) => (
                                <CardAlunoRanking
                                    key={top.aluno.id}
                                    posicao={top.posicao}
                                    medalha={top.medalha}
                                    aluno={{
                                        nome: top.aluno.nome,
                                        fotoUrl: top.aluno.fotoUrl,
                                        score: top.aluno.score,
                                        classificacao: top.aluno.classificacao,
                                        emoji: top.aluno.emoji
                                    }}
                                    onVerDetalhes={() => handleVerAluno(top.aluno.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Alunos que Precisam de Atenção */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-5 h-5 text-red-500" />
                            RISCO DE RETENÇÃO
                        </h2>
                        {alunosAtencao.length > 0 ? (
                            <div className="space-y-3">
                                {alunosAtencao.map((aluno) => (
                                    <CardAlunoAtencao
                                        key={aluno.id}
                                        aluno={{
                                            nome: aluno.nome,
                                            fotoUrl: aluno.fotoUrl
                                        }}
                                        motivo={{
                                            icone: aluno.icone,
                                            descricao: aluno.descricao,
                                            tipo: aluno.motivo === 'INATIVO' ? 'DANGER' : 'WARNING'
                                        }}
                                        onVerDetalhes={() => handleVerAluno(aluno.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card-dark border border-dashed border-card-border p-12 rounded-2xl flex flex-col items-center justify-center text-center">
                                <Activity className="w-12 h-12 text-gray-700 mb-4" />
                                <p className="text-gray-500 font-medium">Todos os alunos em dia.</p>
                                <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-2">Nenhum risco de retenção identificado</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Evolução ao Longo do Tempo */}
                {dadosGraficos && (
                    <div className="space-y-8">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2 leading-none">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Evolução Histórica da Base
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-card-dark border border-card-border rounded-2xl p-2 overflow-hidden">
                                <GraficoLinha
                                    titulo="Score Médio (Performance)"
                                    icone={<TrendingUp className="w-5 h-5" />}
                                    dados={dadosGraficos.scoreMedio.dados}
                                    tendencia={dadosGraficos.scoreMedio.tendencia}
                                    periodos={['3_MESES', '6_MESES', '12_MESES']}
                                    periodoSelecionado={periodoGraficos}
                                    onPeriodoChange={setPeriodoGraficos}
                                />
                            </div>

                            <div className="bg-card-dark border border-card-border rounded-2xl p-2 overflow-hidden">
                                <GraficoLinha
                                    titulo="Volume de Alunos (Crescimento)"
                                    icone={<Users className="w-5 h-5" />}
                                    dados={dadosGraficos.totalAlunos.dados}
                                    tendencia={dadosGraficos.totalAlunos.tendencia}
                                    periodos={['3_MESES', '6_MESES', '12_MESES']}
                                    periodoSelecionado={periodoGraficos}
                                    onPeriodoChange={setPeriodoGraficos}
                                />
                            </div>

                            <div className="lg:col-span-2 bg-card-dark border border-card-border rounded-2xl p-2 overflow-hidden">
                                <GraficoLinha
                                    titulo="Atividade de Mensuração (Fidelidade)"
                                    icone={<FileText className="w-5 h-5" />}
                                    dados={dadosGraficos.avaliacoes.dados}
                                    tendencia={dadosGraficos.avaliacoes.tendencia}
                                    periodos={['3_MESES', '6_MESES', '12_MESES']}
                                    periodoSelecionado={periodoGraficos}
                                    onPeriodoChange={setPeriodoGraficos}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="h-px w-full bg-white/10" />

                {/* Todos os Alunos */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            GESTÃO DA BASE
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-primary transition-all" />
                                <input
                                    type="text"
                                    value={termoBusca}
                                    onChange={(e) => setTermoBusca(e.target.value)}
                                    placeholder="Localizar aluno..."
                                    className="bg-white/5 border border-white/10 text-white rounded-xl py-2 pl-9 pr-4 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all w-full md:w-64"
                                />
                            </div>

                            <select
                                value={ordenarPor}
                                onChange={(e) => setOrdenarPor(e.target.value as any)}
                                className="bg-white/5 border border-white/10 text-white rounded-xl py-2 px-4 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                            >
                                <option value="score_desc">Classificar: Score</option>
                                <option value="nome_asc">Classificar: Nome</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {alunosExibidos.map((aluno) => (
                            <div
                                key={aluno.id}
                                className="bg-card-dark border border-card-border p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer group flex items-center gap-4"
                                onClick={() => handleVerAluno(aluno.id)}
                            >
                                {/* Foto */}
                                {aluno.fotoUrl ? (
                                    <img
                                        src={aluno.fotoUrl}
                                        alt={aluno.nome}
                                        className="w-12 h-12 rounded-xl object-cover border border-white/10 group-hover:border-primary/30 transition-all"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
                                        <span className="text-white font-bold opacity-50 uppercase">
                                            {aluno.nome.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Info */}
                                <div className="flex-1">
                                    <h4 className="text-white font-bold uppercase tracking-tight group-hover:text-primary transition-all leading-none mb-1">{aluno.nome}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{aluno.classificacao}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                        <span className="text-[10px] text-gray-500 font-medium">Última avaliação: {formatarData(aluno.ultimaAvaliacao)}</span>
                                    </div>
                                </div>

                                {/* Score */}
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-xl font-black text-white tracking-tighter leading-none">{aluno.score}</div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className={`flex items-center gap-0.5 text-[10px] font-black tracking-tighter ${aluno.evolucaoUltimoMes >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {aluno.evolucaoUltimoMes >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {Math.abs(aluno.evolucaoUltimoMes)} PTS
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Ver Todos */}
                    {!mostrarTodosAlunos && alunosFiltrados.length > 5 && (
                        <div className="text-center pt-2">
                            <button
                                onClick={() => setMostrarTodosAlunos(true)}
                                className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                            >
                                Exibir todos os {alunosFiltrados.length} alunos vinculados
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

