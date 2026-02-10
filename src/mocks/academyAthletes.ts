// Mock Data: Academy Athletes - Aggregated view across all personal trainers

import type {
    AlunoResumo,
    ListaAlunosAcademia,
    DetalheAlunoAcademia,
    PersonalResumo,
    AlunoCompleto,
    Ficha,
    AvaliacaoCompleta,
    Medidas,
    AvaliacaoResumo,
    EstatisticasAluno,
    GraficoEvolucaoData
} from '@/types/academy';

// Personal Trainers vinculados à Academia
export const mockAcademyPersonals: PersonalResumo[] = [
    {
        id: 'personal-1',
        nome: 'Pedro Coach',
        fotoUrl: undefined,
        telefone: '(11) 98888-8888',
        email: 'pedro.coach@vitruia.com'
    },
    {
        id: 'personal-2',
        nome: 'Maria Fitness',
        fotoUrl: undefined,
        telefone: '(11) 97777-7777',
        email: 'maria.fitness@vitruia.com'
    },
    {
        id: 'personal-3',
        nome: 'João Training',
        fotoUrl: undefined,
        telefone: '(11) 96666-6666',
        email: 'joao.training@vitruia.com'
    }
];

// Função auxiliar para calcular dias desde última avaliação
const calcularDiasSemAvaliacao = (dataAvaliacao: Date): number => {
    const hoje = new Date('2026-02-10');
    const diff = hoje.getTime() - dataAvaliacao.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Alunos da Academia (Resumo para Lista)
export const mockAcademyAthletes: AlunoResumo[] = [
    {
        id: 'athlete-leonardo',
        nome: 'Leonardo Schweitzer',
        fotoUrl: undefined,
        personalId: 'personal-1',
        personalNome: 'Pedro Coach',
        ultimaAvaliacao: {
            data: new Date('2026-02-09'),
            score: 91,
            classificacao: 'ELITE'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-09'))
    },
    {
        id: 'athlete-1',
        nome: 'Ricardo Souza',
        fotoUrl: undefined,
        personalId: 'personal-1',
        personalNome: 'Pedro Coach',
        ultimaAvaliacao: {
            data: new Date('2026-02-08'),
            score: 92,
            classificacao: 'ELITE'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-08'))
    },
    {
        id: 'athlete-2',
        nome: 'Fernanda Lima',
        fotoUrl: undefined,
        personalId: 'personal-2',
        personalNome: 'Maria Fitness',
        ultimaAvaliacao: {
            data: new Date('2026-02-08'),
            score: 89,
            classificacao: 'META'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-08'))
    },
    {
        id: 'athlete-3',
        nome: 'Bruno Silva',
        fotoUrl: undefined,
        personalId: 'personal-1',
        personalNome: 'Pedro Coach',
        ultimaAvaliacao: {
            data: new Date('2026-02-05'),
            score: 55,
            classificacao: 'CAMINHO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-05'))
    },
    {
        id: 'athlete-4',
        nome: 'Camila Rocha',
        fotoUrl: undefined,
        personalId: 'personal-2',
        personalNome: 'Maria Fitness',
        ultimaAvaliacao: {
            data: new Date('2026-02-06'),
            score: 52,
            classificacao: 'CAMINHO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-06'))
    },
    {
        id: 'athlete-5',
        nome: 'Gabriel Torres',
        fotoUrl: undefined,
        personalId: 'personal-3',
        personalNome: 'João Training',
        ultimaAvaliacao: {
            data: new Date('2026-02-01'),
            score: 48,
            classificacao: 'INICIO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-01'))
    },
    {
        id: 'athlete-6',
        nome: 'Larissa Mendes',
        fotoUrl: undefined,
        personalId: 'personal-2',
        personalNome: 'Maria Fitness',
        ultimaAvaliacao: {
            data: new Date('2026-02-03'),
            score: 58,
            classificacao: 'CAMINHO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-03'))
    },
    {
        id: 'athlete-7',
        nome: 'João Ogro Silva',
        fotoUrl: undefined,
        personalId: 'personal-1',
        personalNome: 'Pedro Coach',
        ultimaAvaliacao: {
            data: new Date('2026-02-05'),
            score: 42,
            classificacao: 'INICIO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-05'))
    },
    {
        id: 'athlete-8',
        nome: 'Maria Curva Oliveira',
        fotoUrl: undefined,
        personalId: 'personal-3',
        personalNome: 'João Training',
        ultimaAvaliacao: {
            data: new Date('2026-02-09'),
            score: 44,
            classificacao: 'INICIO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-09'))
    },
    {
        id: 'athlete-9',
        nome: 'Carlos Santos',
        fotoUrl: undefined,
        personalId: 'personal-3',
        personalNome: 'João Training',
        ultimaAvaliacao: {
            data: new Date('2025-12-15'),
            score: 65,
            classificacao: 'CAMINHO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2025-12-15'))
    },
    {
        id: 'athlete-10',
        nome: 'Ana Costa',
        fotoUrl: undefined,
        personalId: 'personal-1',
        personalNome: 'Pedro Coach',
        ultimaAvaliacao: {
            data: new Date('2025-10-10'),
            score: 58,
            classificacao: 'INICIO'
        },
        status: 'INATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2025-10-10'))
    },
    {
        id: 'athlete-11',
        nome: 'Paulo Martins',
        fotoUrl: undefined,
        personalId: 'personal-2',
        personalNome: 'Maria Fitness',
        ultimaAvaliacao: {
            data: new Date('2026-02-07'),
            score: 78,
            classificacao: 'QUASE_LA'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-07'))
    },
    {
        id: 'athlete-12',
        nome: 'Juliana Alves',
        fotoUrl: undefined,
        personalId: 'personal-3',
        personalNome: 'João Training',
        ultimaAvaliacao: {
            data: new Date('2026-02-04'),
            score: 72,
            classificacao: 'CAMINHO'
        },
        status: 'ATIVO',
        diasDesdeUltimaAvaliacao: calcularDiasSemAvaliacao(new Date('2026-02-04'))
    }
];

// Lista de alunos com totais
export const mockAcademyAthletesList: ListaAlunosAcademia = {
    alunos: mockAcademyAthletes,
    totalAlunos: mockAcademyAthletes.length,
    totalAtivos: mockAcademyAthletes.filter(a => a.status === 'ATIVO').length,
    totalInativos: mockAcademyAthletes.filter(a => a.status === 'INATIVO').length,
    personaisDisponiveis: mockAcademyPersonals.map(p => ({ id: p.id, nome: p.nome }))
};

// Função para gerar detalhes completos de um aluno
export const getAthleteDetails = (athleteId: string): DetalheAlunoAcademia | null => {
    const athleteSummary = mockAcademyAthletes.find(a => a.id === athleteId);
    if (!athleteSummary) return null;

    const personal = mockAcademyPersonals.find(p => p.id === athleteSummary.personalId);
    if (!personal) return null;

    // Exemplo completo para "João Ogro Silva"
    if (athleteId === 'athlete-7') {
        const aluno: AlunoCompleto = {
            id: 'athlete-7',
            nome: 'João Ogro Silva',
            fotoUrl: undefined,
            email: 'joao.ogro@email.com',
            telefone: '(11) 99999-9999',
            dataNascimento: new Date('1997-08-15'),
            idade: 28,
            sexo: 'M',
            status: 'ATIVO',
            dataCadastro: new Date('2025-08-15')
        };

        const ficha: Ficha = {
            altura: 175,
            punho: 17.5,
            tornozelo: 22,
            joelho: 38,
            pelve: 95,
            objetivo: 'Hipertrofia',
            categoriaPreferida: 'Golden Ratio'
        };

        const ultimaAvaliacao: AvaliacaoCompleta = {
            id: 'eval-7-1',
            data: new Date('2026-02-05'),
            score: 42,
            classificacao: 'INICIO',
            composicao: {
                peso: 115.0,
                gorduraCorporal: 32.5,
                massaMagra: 77.6,
                massaGorda: 37.4
            },
            proporcoes: [
                { nome: 'Shape-V (Ombros)', atual: 115, meta: 191, percentual: 60, classificacao: 'INICIO' },
                { nome: 'Peitoral', atual: 105, meta: 114, percentual: 92, classificacao: 'CAMINHO' },
                { nome: 'Cintura', atual: 118, meta: 82, percentual: 52, classificacao: 'INICIO' }
            ],
            simetria: {
                score: 96,
                classificacao: 'Excelente',
                comparacoes: [
                    { parte: 'Braço', esquerdo: 35.5, direito: 36, diferenca: 1.4 },
                    { parte: 'Antebraço', esquerdo: 28, direito: 28, diferenca: 0 },
                    { parte: 'Coxa', esquerdo: 61, direito: 62, diferenca: 1.6 },
                    { parte: 'Panturrilha', esquerdo: 38, direito: 38, diferenca: 0 }
                ]
            }
        };

        const ultimasMedidas: Medidas = {
            data: new Date('2026-02-05'),
            ombros: 115,
            peitoral: 105,
            cintura: 118,
            quadril: 122,
            bracoD: 36,
            bracoE: 35.5,
            antebracoD: 28,
            antebracoE: 28,
            coxaD: 62,
            coxaE: 61,
            panturrilhaD: 38,
            panturrilhaE: 38
        };

        const historicoAvaliacoes: AvaliacaoResumo[] = [
            { id: 'eval-7-1', data: new Date('2026-02-05'), score: 42, classificacao: 'INICIO', peso: 115.0 },
            { id: 'eval-7-2', data: new Date('2026-01-15'), score: 40, classificacao: 'INICIO', peso: 116.5 },
            { id: 'eval-7-3', data: new Date('2025-12-20'), score: 38, classificacao: 'INICIO', peso: 118.0 },
            { id: 'eval-7-4', data: new Date('2025-11-28'), score: 37, classificacao: 'INICIO', peso: 118.8 },
            { id: 'eval-7-5', data: new Date('2025-11-05'), score: 36, classificacao: 'INICIO', peso: 119.2 },
            { id: 'eval-7-6', data: new Date('2025-10-15'), score: 35, classificacao: 'INICIO', peso: 119.8 },
            { id: 'eval-7-7', data: new Date('2025-09-22'), score: 34, classificacao: 'INICIO', peso: 120.0 },
            { id: 'eval-7-8', data: new Date('2025-08-15'), score: 33, classificacao: 'INICIO', peso: 120.5 }
        ];

        const estatisticas: EstatisticasAluno = {
            totalAvaliacoes: 8,
            diasNaAcademia: 178,
            evolucaoScore: 9, // 42 - 33
            evolucaoPeso: -5.5, // 115 - 120.5
            mediaFrequenciaAvaliacoes: 22 // 178 dias / 8 avaliações
        };

        return {
            aluno,
            personal,
            ficha,
            ultimaAvaliacao,
            ultimasMedidas,
            historicoAvaliacoes,
            estatisticas
        };
    }

    // Template genérico para outros atletas
    const aluno: AlunoCompleto = {
        id: athleteId,
        nome: athleteSummary.nome,
        fotoUrl: athleteSummary.fotoUrl,
        email: `${athleteSummary.nome.toLowerCase().replace(' ', '.')}@email.com`,
        telefone: '(11) 99999-9999',
        dataNascimento: new Date('1995-01-01'),
        idade: 31,
        sexo: 'M',
        status: athleteSummary.status,
        dataCadastro: new Date('2024-01-01')
    };

    const ficha: Ficha = {
        altura: 175,
        punho: 17,
        tornozelo: 22,
        joelho: 38,
        objetivo: 'Hipertrofia'
    };

    const ultimaAvaliacao: AvaliacaoCompleta = {
        id: `eval-${athleteId}-1`,
        data: athleteSummary.ultimaAvaliacao?.data || new Date(),
        score: athleteSummary.ultimaAvaliacao?.score || 50,
        classificacao: athleteSummary.ultimaAvaliacao?.classificacao || 'CAMINHO',
        composicao: {
            peso: 80,
            gorduraCorporal: 15,
            massaMagra: 68,
            massaGorda: 12
        },
        proporcoes: [
            { nome: 'Shape-V', atual: 130, meta: 145, percentual: 90, classificacao: 'CAMINHO' },
            { nome: 'Peitoral', atual: 100, meta: 110, percentual: 91, classificacao: 'CAMINHO' },
            { nome: 'Cintura', atual: 82, meta: 74, percentual: 88, classificacao: 'CAMINHO' }
        ],
        simetria: {
            score: 95,
            classificacao: 'Excelente',
            comparacoes: [
                { parte: 'Braço', esquerdo: 37, direito: 38, diferenca: 2.7 },
                { parte: 'Coxa', esquerdo: 57, direito: 58, diferenca: 1.7 }
            ]
        }
    };

    const ultimasMedidas: Medidas = {
        data: athleteSummary.ultimaAvaliacao?.data || new Date(),
        ombros: 130,
        peitoral: 100,
        cintura: 82,
        quadril: 95,
        bracoD: 38,
        bracoE: 37,
        antebracoD: 30,
        antebracoE: 29.5,
        coxaD: 58,
        coxaE: 57,
        panturrilhaD: 38,
        panturrilhaE: 38
    };

    const historicoAvaliacoes: AvaliacaoResumo[] = [
        { id: `eval-${athleteId}-1`, data: new Date('2026-02-05'), score: athleteSummary.ultimaAvaliacao?.score || 50, classificacao: athleteSummary.ultimaAvaliacao?.classificacao || 'CAMINHO', peso: 80 }
    ];

    const estatisticas: EstatisticasAluno = {
        totalAvaliacoes: 1,
        diasNaAcademia: 100,
        evolucaoScore: 0,
        evolucaoPeso: 0,
        mediaFrequenciaAvaliacoes: 30
    };

    return {
        aluno,
        personal,
        ficha,
        ultimaAvaliacao,
        ultimasMedidas,
        historicoAvaliacoes,
        estatisticas
    };
};

// Dados de evolução para gráficos
export const getAthleteEvolutionData = (athleteId: string): {
    scoreData: GraficoEvolucaoData[];
    pesoData: GraficoEvolucaoData[];
} => {
    // Exemplo para João Ogro Silva
    if (athleteId === 'athlete-7') {
        return {
            scoreData: [
                { data: new Date('2025-08-15'), valor: 33 },
                { data: new Date('2025-09-22'), valor: 34 },
                { data: new Date('2025-10-15'), valor: 35 },
                { data: new Date('2025-11-05'), valor: 36 },
                { data: new Date('2025-11-28'), valor: 37 },
                { data: new Date('2025-12-20'), valor: 38 },
                { data: new Date('2026-01-15'), valor: 40 },
                { data: new Date('2026-02-05'), valor: 42 }
            ],
            pesoData: [
                { data: new Date('2025-08-15'), valor: 120.5 },
                { data: new Date('2025-09-22'), valor: 120.0 },
                { data: new Date('2025-10-15'), valor: 119.8 },
                { data: new Date('2025-11-05'), valor: 119.2 },
                { data: new Date('2025-11-28'), valor: 118.8 },
                { data: new Date('2025-12-20'), valor: 118.0 },
                { data: new Date('2026-01-15'), valor: 116.5 },
                { data: new Date('2026-02-05'), valor: 115.0 }
            ]
        };
    }

    // Template genérico
    return {
        scoreData: [
            { data: new Date('2026-01-01'), valor: 45 },
            { data: new Date('2026-02-01'), valor: 50 }
        ],
        pesoData: [
            { data: new Date('2026-01-01'), valor: 82 },
            { data: new Date('2026-02-01'), valor: 80 }
        ]
    };
};
