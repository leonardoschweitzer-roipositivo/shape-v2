/**
 * Types gerados do schema do Supabase
 * 
 * Para atualizar estes types, execute:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
 * 
 * OU crie manualmente baseado no schema do banco
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            academias: {
                Row: {
                    id: string
                    auth_user_id: string | null
                    nome: string
                    razao_social: string | null
                    cnpj: string | null
                    email: string
                    telefone: string | null
                    endereco_rua: string | null
                    endereco_numero: string | null
                    endereco_complemento: string | null
                    endereco_bairro: string | null
                    endereco_cidade: string | null
                    endereco_estado: string | null
                    endereco_cep: string | null
                    plano: 'BASIC' | 'PRO' | 'ENTERPRISE'
                    limite_personais: number
                    limite_atletas: number
                    logo_url: string | null
                    status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    data_vencimento: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    auth_user_id?: string | null
                    nome: string
                    razao_social?: string | null
                    cnpj?: string | null
                    email: string
                    telefone?: string | null
                    endereco_rua?: string | null
                    endereco_numero?: string | null
                    endereco_complemento?: string | null
                    endereco_bairro?: string | null
                    endereco_cidade?: string | null
                    endereco_estado?: string | null
                    endereco_cep?: string | null
                    plano?: 'BASIC' | 'PRO' | 'ENTERPRISE'
                    limite_personais?: number
                    limite_atletas?: number
                    logo_url?: string | null
                    status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    data_vencimento?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    auth_user_id?: string | null
                    nome?: string
                    razao_social?: string | null
                    cnpj?: string | null
                    email?: string
                    telefone?: string | null
                    endereco_rua?: string | null
                    endereco_numero?: string | null
                    endereco_complemento?: string | null
                    endereco_bairro?: string | null
                    endereco_cidade?: string | null
                    endereco_estado?: string | null
                    endereco_cep?: string | null
                    plano?: 'BASIC' | 'PRO' | 'ENTERPRISE'
                    limite_personais?: number
                    limite_atletas?: number
                    logo_url?: string | null
                    status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    data_vencimento?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            personais: {
                Row: {
                    id: string
                    auth_user_id: string | null
                    academia_id: string | null
                    nome: string
                    email: string
                    telefone: string | null
                    cpf: string | null
                    cref: string | null
                    foto_url: string | null
                    plano: 'FREE' | 'PRO' | 'UNLIMITED'
                    limite_atletas: number
                    status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    data_vinculo: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    auth_user_id?: string | null
                    academia_id?: string | null
                    nome: string
                    email: string
                    telefone?: string | null
                    cpf?: string | null
                    cref?: string | null
                    foto_url?: string | null
                    plano?: 'FREE' | 'PRO' | 'UNLIMITED'
                    limite_atletas?: number
                    status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    data_vinculo?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    auth_user_id?: string | null
                    academia_id?: string | null
                    nome?: string
                    email?: string
                    telefone?: string | null
                    cpf?: string | null
                    cref?: string | null
                    foto_url?: string | null
                    plano?: 'FREE' | 'PRO' | 'UNLIMITED'
                    limite_atletas?: number
                    status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    data_vinculo?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            atletas: {
                Row: {
                    id: string
                    auth_user_id: string | null
                    personal_id: string
                    academia_id: string | null
                    nome: string
                    email: string | null
                    telefone: string | null
                    foto_url: string | null
                    portal_token: string | null
                    portal_token_expira: string | null
                    portal_acessos: number
                    portal_ultimo_acesso: string | null
                    status: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    auth_user_id?: string | null
                    personal_id: string
                    academia_id?: string | null
                    nome: string
                    email?: string | null
                    telefone?: string | null
                    foto_url?: string | null
                    portal_token?: string | null
                    portal_token_expira?: string | null
                    portal_acessos?: number
                    portal_ultimo_acesso?: string | null
                    status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    auth_user_id?: string | null
                    personal_id?: string
                    academia_id?: string | null
                    nome?: string
                    email?: string | null
                    telefone?: string | null
                    foto_url?: string | null
                    portal_token?: string | null
                    portal_token_expira?: string | null
                    portal_acessos?: number
                    portal_ultimo_acesso?: string | null
                    status?: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
                    created_at?: string
                    updated_at?: string
                }
            }
            fichas: {
                Row: {
                    id: string
                    atleta_id: string
                    data_nascimento: string | null
                    sexo: 'M' | 'F'
                    altura: number | null
                    punho: number | null
                    tornozelo: number | null
                    joelho: number | null
                    pelve: number | null
                    objetivo: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE' | 'EMAGRECIMENTO'
                    categoria_preferida: string | null
                    observacoes: string | null
                    restricoes: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    atleta_id: string
                    data_nascimento?: string | null
                    sexo: 'M' | 'F'
                    altura?: number | null
                    punho?: number | null
                    tornozelo?: number | null
                    joelho?: number | null
                    pelve?: number | null
                    objetivo?: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE' | 'EMAGRECIMENTO'
                    categoria_preferida?: string | null
                    observacoes?: string | null
                    restricoes?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    atleta_id?: string
                    data_nascimento?: string | null
                    sexo?: 'M' | 'F'
                    altura?: number | null
                    punho?: number | null
                    tornozelo?: number | null
                    joelho?: number | null
                    pelve?: number | null
                    objetivo?: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE' | 'EMAGRECIMENTO'
                    categoria_preferida?: string | null
                    observacoes?: string | null
                    restricoes?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            medidas: {
                Row: {
                    id: string
                    atleta_id: string
                    data: string
                    peso: number | null
                    gordura_corporal: number | null
                    ombros: number | null
                    peitoral: number | null
                    cintura: number | null
                    quadril: number | null
                    abdomen: number | null
                    braco_esquerdo: number | null
                    braco_direito: number | null
                    antebraco_esquerdo: number | null
                    antebraco_direito: number | null
                    coxa_esquerda: number | null
                    coxa_direita: number | null
                    panturrilha_esquerda: number | null
                    panturrilha_direita: number | null
                    pescoco: number | null
                    registrado_por: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
                    personal_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    atleta_id: string
                    data?: string
                    peso?: number | null
                    gordura_corporal?: number | null
                    ombros?: number | null
                    peitoral?: number | null
                    cintura?: number | null
                    quadril?: number | null
                    abdomen?: number | null
                    braco_esquerdo?: number | null
                    braco_direito?: number | null
                    antebraco_esquerdo?: number | null
                    antebraco_direito?: number | null
                    coxa_esquerda?: number | null
                    coxa_direita?: number | null
                    panturrilha_esquerda?: number | null
                    panturrilha_direita?: number | null
                    pescoco?: number | null
                    registrado_por?: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
                    personal_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    atleta_id?: string
                    data?: string
                    peso?: number | null
                    gordura_corporal?: number | null
                    ombros?: number | null
                    peitoral?: number | null
                    cintura?: number | null
                    quadril?: number | null
                    abdomen?: number | null
                    braco_esquerdo?: number | null
                    braco_direito?: number | null
                    antebraco_esquerdo?: number | null
                    antebraco_direito?: number | null
                    coxa_esquerda?: number | null
                    coxa_direita?: number | null
                    panturrilha_esquerda?: number | null
                    panturrilha_direita?: number | null
                    pescoco?: number | null
                    registrado_por?: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
                    personal_id?: string | null
                    created_at?: string
                }
            }
            avaliacoes: {
                Row: {
                    id: string
                    atleta_id: string
                    medidas_id: string
                    data: string
                    peso: number | null
                    gordura_corporal: number | null
                    massa_magra: number | null
                    massa_gorda: number | null
                    imc: number | null
                    ffmi: number | null
                    score_geral: number | null
                    classificacao_geral: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE' | null
                    proporcoes: Json | null
                    simetria: Json | null
                    comparacao_anterior: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    atleta_id: string
                    medidas_id: string
                    data?: string
                    peso?: number | null
                    gordura_corporal?: number | null
                    massa_magra?: number | null
                    massa_gorda?: number | null
                    imc?: number | null
                    ffmi?: number | null
                    score_geral?: number | null
                    classificacao_geral?: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE' | null
                    proporcoes?: Json | null
                    simetria?: Json | null
                    comparacao_anterior?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    atleta_id?: string
                    medidas_id?: string
                    data?: string
                    peso?: number | null
                    gordura_corporal?: number | null
                    massa_magra?: number | null
                    massa_gorda?: number | null
                    imc?: number | null
                    ffmi?: number | null
                    score_geral?: number | null
                    classificacao_geral?: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE' | null
                    proporcoes?: Json | null
                    simetria?: Json | null
                    comparacao_anterior?: Json | null
                    created_at?: string
                }
            }
            registros: {
                Row: {
                    id: string
                    atleta_id: string
                    data: string
                    tipo: 'REFEICAO' | 'TREINO' | 'AGUA' | 'SONO' | 'DOR' | 'PESO' | 'SUPLEMENTO' | 'OUTRO'
                    dados: Json
                    origem: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
                    created_at: string
                }
                Insert: {
                    id?: string
                    atleta_id: string
                    data?: string
                    tipo: 'REFEICAO' | 'TREINO' | 'AGUA' | 'SONO' | 'DOR' | 'PESO' | 'SUPLEMENTO' | 'OUTRO'
                    dados: Json
                    origem?: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
                    created_at?: string
                }
                Update: {
                    id?: string
                    atleta_id?: string
                    data?: string
                    tipo?: 'REFEICAO' | 'TREINO' | 'AGUA' | 'SONO' | 'DOR' | 'PESO' | 'SUPLEMENTO' | 'OUTRO'
                    dados?: Json
                    origem?: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
                    created_at?: string
                }
            }
            consultorias: {
                Row: {
                    id: string
                    atleta_id: string
                    tipo: 'DIAGNOSTICO' | 'TREINO' | 'DIETA' | 'CHAT'
                    contexto: Json | null
                    prompt: string
                    resposta: string
                    tokens_usados: number | null
                    modelo: string | null
                    data: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    atleta_id: string
                    tipo: 'DIAGNOSTICO' | 'TREINO' | 'DIETA' | 'CHAT'
                    contexto?: Json | null
                    prompt: string
                    resposta: string
                    tokens_usados?: number | null
                    modelo?: string | null
                    data?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    atleta_id?: string
                    tipo?: 'DIAGNOSTICO' | 'TREINO' | 'DIETA' | 'CHAT'
                    contexto?: Json | null
                    prompt?: string
                    resposta?: string
                    tokens_usados?: number | null
                    modelo?: string | null
                    data?: string
                    created_at?: string
                }
            }
        }
        Views: {
            v_atletas_com_avaliacao: {
                Row: {
                    id: string
                    nome: string
                    foto_url: string | null
                    personal_id: string
                    personal_nome: string
                    academia_id: string | null
                    status: string
                    created_at: string
                    ultima_avaliacao_data: string | null
                    score_geral: number | null
                    classificacao_geral: string | null
                    peso: number | null
                    dias_desde_avaliacao: number | null
                }
            }
            v_kpis_personal: {
                Row: {
                    personal_id: string
                    personal_nome: string
                    total_atletas: number
                    atletas_ativos: number
                    atletas_inativos: number
                    score_medio: number | null
                    avaliacoes_mes: number
                    atletas_elite: number
                    atletas_meta: number
                    atletas_quase_la: number
                    atletas_caminho: number
                    atletas_inicio: number
                }
            }
            v_kpis_academia: {
                Row: {
                    academia_id: string
                    academia_nome: string
                    total_personais: number
                    personais_ativos: number
                    total_atletas: number
                    atletas_ativos: number
                    score_medio: number | null
                    avaliacoes_mes: number
                }
            }
        }
        Enums: {
            status_tipo: 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO' | 'TRIAL'
            sexo_tipo: 'M' | 'F'
            plano_academia_tipo: 'BASIC' | 'PRO' | 'ENTERPRISE'
            plano_personal_tipo: 'FREE' | 'PRO' | 'UNLIMITED'
            objetivo_tipo: 'HIPERTROFIA' | 'DEFINICAO' | 'RECOMPOSICAO' | 'COMPETICAO' | 'SAUDE' | 'EMAGRECIMENTO'
            categoria_tipo: 'GOLDEN_RATIO' | 'CLASSIC_PHYSIQUE' | 'MENS_PHYSIQUE' | 'BODYBUILDING' | 'BIKINI' | 'WELLNESS' | 'FIGURE' | 'WOMENS_PHYSIQUE' | 'WOMENS_BODYBUILDING'
            classificacao_tipo: 'INICIO' | 'CAMINHO' | 'QUASE_LA' | 'META' | 'ELITE'
            registro_tipo: 'REFEICAO' | 'TREINO' | 'AGUA' | 'SONO' | 'DOR' | 'PESO' | 'SUPLEMENTO' | 'OUTRO'
            consultoria_tipo: 'DIAGNOSTICO' | 'TREINO' | 'DIETA' | 'CHAT'
            origem_tipo: 'PORTAL' | 'COACH_IA' | 'PERSONAL' | 'APP'
        }
    }
}

// ===== HELPER TYPES =====

export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
    Database['public']['Enums'][T]

export type Views<T extends keyof Database['public']['Views']> =
    Database['public']['Views'][T]['Row']

// ===== ALIASES PARA FACILITAR USO =====

export type Academia = Tables<'academias'>
export type Personal = Tables<'personais'>
export type Atleta = Tables<'atletas'>
export type Ficha = Tables<'fichas'>
export type Medida = Tables<'medidas'>
export type Avaliacao = Tables<'avaliacoes'>
export type Registro = Tables<'registros'>
export type Consultoria = Tables<'consultorias'>

// Views
export type AtletaComAvaliacao = Views<'v_atletas_com_avaliacao'>
export type KPIsPersonal = Views<'v_kpis_personal'>
export type KPIsAcademia = Views<'v_kpis_academia'>

// Enums
export type StatusTipo = Enums<'status_tipo'>
export type SexoTipo = Enums<'sexo_tipo'>
export type PlanoAcademiaTipo = Enums<'plano_academia_tipo'>
export type PlanoPersonalTipo = Enums<'plano_personal_tipo'>
export type ObjetivoTipo = Enums<'objetivo_tipo'>
export type CategoriaTipo = Enums<'categoria_tipo'>
export type ClassificacaoTipo = Enums<'classificacao_tipo'>
export type RegistroTipo = Enums<'registro_tipo'>
export type ConsultoriaTipo = Enums<'consultoria_tipo'>
export type OrigemTipo = Enums<'origem_tipo'>
