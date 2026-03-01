export interface HeaderAtletaProps {
    nome: string
    sexo: 'MASCULINO' | 'FEMININO' | string
    altura: number
    peso?: number
    fotoUrl?: string
}

export interface CardPersonalProps {
    nome: string
    rankingCidade?: number
    cidadeSigla?: string
    rankingAcademia?: number
    totalPersonaisCidade?: number
    exibirRanking: boolean
}

export interface CardScoreMetaProps {
    scoreAtual: number
    classificacaoAtual: string
    dataUltimaAvaliacao: Date
    scoreMeta: number
    classificacaoMeta: string
    prazoMeta: number // meses
    evolucaoMes: number
    evolucaoMesAnterior: number
    melhorMesHistorico: number
    percentualMeta: number
    pontosRestantes: number
}

export interface CardRankingProps {
    contexto: 'academia' | 'cidade' | 'estado' | 'brasil'
    nomeContexto: string
    posicaoGeral: number
    totalParticipantes: number
    percentilGeral: number
    posicaoEvolucao: number
    percentilEvolucao: number
    movimentoGeral: number
    movimentoEvolucao: number
    atletaParticipa: boolean
}

export interface CardFocoSemanaProps {
    areaPrioritaria: string
    diferencaCm?: number
    diferencaPercentual?: number
    quantidadeTreinos: number
    grupamentoFoco: string
    proximoTreinoNome: string
    proximoTreinoData?: Date
    temTreinoHoje: boolean
    treinoConcluido: boolean
    onVerTreino: () => void
}

export interface AcaoRapida {
    id: string
    icone: string
    label: string
    rota: string
    badge?: string
    desabilitada?: boolean
    onClick?: () => void
}

export interface FooterMedicaoProps {
    dataUltimaMedida: Date
    diasDesdeUltima: number
    statusMedicao: 'em_dia' | 'atencao' | 'atrasado'
}
