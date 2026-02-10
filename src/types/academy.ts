// Types for Academy Athletes Management

export interface AlunoResumo {
    id: string;
    nome: string;
    fotoUrl?: string;

    // Vínculo
    personalId: string;
    personalNome: string;

    // Última avaliação
    ultimaAvaliacao?: {
        data: Date;
        score: number;
        classificacao: string;
    };

    // Status
    status: 'ATIVO' | 'INATIVO';
    diasDesdeUltimaAvaliacao: number;
}

export interface PersonalResumo {
    id: string;
    nome: string;
    fotoUrl?: string;
    telefone: string;
    email?: string;
}

export interface AlunoCompleto {
    id: string;
    nome: string;
    fotoUrl?: string;
    email?: string;
    telefone: string;
    dataNascimento: Date;
    idade: number;
    sexo: 'M' | 'F';
    status: 'ATIVO' | 'INATIVO';
    dataCadastro: Date;
}

export interface Ficha {
    altura: number;
    punho: number;
    tornozelo: number;
    joelho: number;
    pelve?: number;
    objetivo: string;
    categoriaPreferida?: string;
}

export interface ComposicaoCorporal {
    peso: number;
    gorduraCorporal?: number;
    massaMagra?: number;
    massaGorda?: number;
}

export interface Proporcao {
    nome: string;
    atual: number;
    meta: number;
    percentual: number;
    classificacao: string;
}

export interface Simetria {
    score: number;
    classificacao: string;
    comparacoes: {
        parte: string;
        esquerdo: number;
        direito: number;
        diferenca: number;
    }[];
}

export interface AvaliacaoCompleta {
    id: string;
    data: Date;
    score: number;
    classificacao: string;
    composicao: ComposicaoCorporal;
    proporcoes: Proporcao[];
    simetria: Simetria;
}

export interface Medidas {
    data: Date;

    // Tronco
    ombros: number;
    peitoral: number;
    cintura: number;
    quadril: number;

    // Braços (bilateral)
    bracoD: number;
    bracoE: number;
    antebracoD: number;
    antebracoE: number;

    // Pernas (bilateral)
    coxaD: number;
    coxaE: number;
    panturrilhaD: number;
    panturrilhaE: number;
}

export interface AvaliacaoResumo {
    id: string;
    data: Date;
    score: number;
    classificacao: string;
    peso: number;
}

export interface EstatisticasAluno {
    totalAvaliacoes: number;
    diasNaAcademia: number;
    evolucaoScore: number;       // diferença primeira vs última
    evolucaoPeso: number;        // diferença primeira vs última
    mediaFrequenciaAvaliacoes: number;  // dias entre avaliações
}

export interface DetalheAlunoAcademia {
    aluno: AlunoCompleto;
    personal: PersonalResumo;
    ficha: Ficha;
    ultimaAvaliacao: AvaliacaoCompleta;
    ultimasMedidas: Medidas;
    historicoAvaliacoes: AvaliacaoResumo[];
    estatisticas: EstatisticasAluno;
}

export interface ListaAlunosAcademia {
    alunos: AlunoResumo[];

    // Totais
    totalAlunos: number;
    totalAtivos: number;
    totalInativos: number;

    // Filtros disponíveis
    personaisDisponiveis: { id: string; nome: string }[];
}

export interface FiltrosListaAlunos {
    personal: string | 'todos';
    status: 'todos' | 'ativos' | 'inativos';
    classificacao: string;
    ordenarPor: 'ultima_avaliacao_desc' | 'ultima_avaliacao_asc' | 'score_desc' | 'score_asc' | 'nome_asc' | 'nome_desc';
    periodo: 'todos' | 'ultimos_7_dias' | 'ultimos_30_dias' | 'mais_30_dias';
}

export interface GraficoEvolucaoData {
    data: Date;
    valor: number;
}
