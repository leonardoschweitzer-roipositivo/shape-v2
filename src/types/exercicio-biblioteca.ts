/**
 * Tipos para a Biblioteca de Exercícios
 */

export type GrupoMuscular =
    | 'peito'
    | 'costas'
    | 'ombro'
    | 'braco'
    | 'perna'
    | 'gluteo'
    | 'abdomen'
    | 'cardio'

export type NivelExercicio = 'iniciante' | 'intermediario' | 'avancado'

export type Equipamento =
    | 'barra'
    | 'haltere'
    | 'maquina'
    | 'cabo'
    | 'peso_corporal'
    | 'kettlebell'
    | 'equipamento'

export interface ExercicioBiblioteca {
    id: string
    nome: string
    nome_alternativo?: string
    grupo_muscular: GrupoMuscular
    subgrupo?: string
    equipamento?: Equipamento
    nivel: NivelExercicio
    url_video?: string
    thumbnail_url?: string
    duracao_video_seg?: number
    descricao?: string
    instrucoes?: string[]
    dicas?: string[]
    erros_comuns?: string[]
    em_breve: boolean
    ativo: boolean
    created_at: string
    updated_at: string
}

export const GRUPO_MUSCULAR_CONFIG: Record<GrupoMuscular, { label: string; emoji: string; cor: string }> = {
    peito: { label: 'Peito', emoji: '🏋️', cor: 'indigo' },
    costas: { label: 'Costas', emoji: '🔙', cor: 'purple' },
    ombro: { label: 'Ombros', emoji: '💪', cor: 'blue' },
    braco: { label: 'Braços', emoji: '👊', cor: 'violet' },
    perna: { label: 'Pernas', emoji: '🦵', cor: 'emerald' },
    gluteo: { label: 'Glúteos', emoji: '🍑', cor: 'pink' },
    abdomen: { label: 'Abdômen', emoji: '⚡', cor: 'amber' },
    cardio: { label: 'Cardio', emoji: '❤️', cor: 'red' },
}

export const NIVEL_CONFIG: Record<NivelExercicio, { label: string; cor: string }> = {
    iniciante: { label: 'Iniciante', cor: 'emerald' },
    intermediario: { label: 'Intermediário', cor: 'amber' },
    avancado: { label: 'Avançado', cor: 'red' },
}

export const EQUIPAMENTO_CONFIG: Record<Equipamento, { label: string; emoji: string }> = {
    barra: { label: 'Barra', emoji: '🏗️' },
    haltere: { label: 'Haltere', emoji: '🏋️' },
    maquina: { label: 'Máquina', emoji: '⚙️' },
    cabo: { label: 'Cabo', emoji: '🔗' },
    peso_corporal: { label: 'Peso Corporal', emoji: '🤸' },
    kettlebell: { label: 'Kettlebell', emoji: '🫘' },
    equipamento: { label: 'Equipamento', emoji: '🧰' },
}

export interface FiltroBiblioteca {
    grupo?: GrupoMuscular
    nivel?: NivelExercicio
    equipamento?: Equipamento
    busca?: string
    emBreve?: boolean // undefined = todos, true = só em breve, false = só com vídeo
}
