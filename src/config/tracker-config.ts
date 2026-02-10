/**
 * Tracker Configuration
 * 
 * Configurações estáticas para o sistema de acompanhamento diário
 */

import type {
    TrackerType,
    TrackerButton,
    TrackerStatus,
    NotificationConfig,
    Badge
} from '../types/daily-tracking'

// ==========================================
// TRACKER CONFIG
// ==========================================

export const TRACKER_CONFIG: Record<TrackerType, Partial<TrackerButton>> = {
    refeicao: {
        icon: '🍽️',
        label: 'Refeição',
        meta: 5,                    // 5 refeições/dia
        unidade: 'ref',
    },
    treino: {
        icon: '🏋️',
        label: 'Treino',
    },
    agua: {
        icon: '💧',
        label: 'Água',
        meta: 3,                    // 3 litros
        unidade: 'L',
    },
    sono: {
        icon: '😴',
        label: 'Sono',
        meta: 8,                    // 8 horas
        unidade: 'h',
    },
    dor: {
        icon: '🤕',
        label: 'Dor',
    },
    suplemento: {
        icon: '💊',
        label: 'Suplem.',
    },
    peso: {
        icon: '⚖️',
        label: 'Peso',
        unidade: 'kg',
    },
    energia: {
        icon: '⚡',
        label: 'Energia',
        meta: 10,                   // escala 1-10
    },
}

// ==========================================
// STATUS STYLES
// ==========================================

export const STATUS_STYLES: Record<TrackerStatus, {
    corBorda: string
    corFundo: string
    corTexto: string
    iconeExtra?: string
}> = {
    pendente: {
        corBorda: '#374151',        // gray-700
        corFundo: '#1F2937',        // gray-800
        corTexto: '#9CA3AF',        // gray-400
    },
    parcial: {
        corBorda: '#F59E0B',        // amber-500
        corFundo: 'rgba(245, 158, 11, 0.1)',
        corTexto: '#FCD34D',        // amber-300
    },
    completo: {
        corBorda: '#10B981',        // emerald-500
        corFundo: 'rgba(16, 185, 129, 0.1)',
        corTexto: '#6EE7B7',        // emerald-300
        iconeExtra: '✓',
    },
    alerta: {
        corBorda: '#EF4444',        // red-500
        corFundo: 'rgba(239, 68, 68, 0.1)',
        corTexto: '#FCA5A5',        // red-300
        iconeExtra: '⚠️',
    },
}

// ==========================================
// NOTIFICAÇÕES PADRÃO
// ==========================================

export const NOTIFICACOES_PADRAO: NotificationConfig[] = [
    // MANHÃ
    {
        id: 'cafe_manha',
        tipo: 'refeicao',
        titulo: '☀️ Bom dia!',
        mensagem: 'Não esqueça de registrar seu café da manhã',
        horario: '08:00',
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
        acao: {
            label: 'Registrar',
            deepLink: 'vitru://coach/refeicao',
        },
    },
    {
        id: 'agua_manha',
        tipo: 'agua',
        titulo: '💧 Hidratação',
        mensagem: 'Comece o dia bebendo água!',
        horario: '09:00',
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
    },

    // MEIO DIA
    {
        id: 'almoco',
        tipo: 'refeicao',
        titulo: '🍽️ Hora do almoço',
        mensagem: 'Registre seu almoço para acompanhar seus macros',
        horario: '12:30',
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
    },

    // PRÉ-TREINO
    {
        id: 'pre_treino',
        tipo: 'treino',
        titulo: '🏋️ Treino em 1 hora!',
        mensagem: 'Prepare-se para o treino. Já tomou seu pré?',
        horario: 'dinamico', // 1h antes do treino
        diasSemana: [1, 2, 3, 4, 5], // dias de treino
    },

    // TARDE
    {
        id: 'proteina_check',
        tipo: 'refeicao',
        titulo: '🥩 Check de proteína',
        mensagem: 'Hora de verificar se você está na meta de proteína',
        horario: '16:00',
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
    },

    // NOITE
    {
        id: 'jantar',
        tipo: 'refeicao',
        titulo: '🌙 Última refeição',
        mensagem: 'Registre seu jantar e complete suas metas do dia',
        horario: '19:30',
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
    },
    {
        id: 'sono',
        tipo: 'sono',
        titulo: '😴 Hora de descansar',
        mensagem: 'Sono de qualidade = ganhos de qualidade. Boa noite!',
        horario: '22:00',
        diasSemana: [0, 1, 2, 3, 4, 5, 6],
    },

    // SEMANAL
    {
        id: 'check_in_semanal',
        tipo: 'geral',
        titulo: '📊 Check-in semanal',
        mensagem: 'Hora de registrar seu peso e medidas! Vamos ver seu progresso.',
        horario: '09:00',
        diasSemana: [0], // Domingo
        acao: {
            label: 'Fazer check-in',
            deepLink: 'vitru://avaliacao/checkin',
        },
    },
]

// ==========================================
// STREAK CONFIG
// ==========================================

export const STREAK_CONFIG = {
    // Para manter o streak, precisa registrar pelo menos 2 destes 3
    trackersObrigatorios: ['refeicao', 'treino', 'agua'] as TrackerType[],
    minimoTrackers: 2,

    // Bônus por streak
    bonus: {
        7: { badge: '🔥 1 Semana', xp: 100 },
        14: { badge: '🔥 2 Semanas', xp: 250 },
        30: { badge: '🔥 1 Mês', xp: 500 },
        60: { badge: '🔥 2 Meses', xp: 1000 },
        90: { badge: '🔥 3 Meses', xp: 2000 },
        180: { badge: '🔥 6 Meses', xp: 5000 },
        365: { badge: '🔥 1 Ano', xp: 10000 },
    },
}

// ==========================================
// XP POR AÇÃO
// ==========================================

export const XP_ACOES = {
    registrarRefeicao: 10,
    registrarTreino: 25,
    registrarAgua: 5,
    registrarSono: 10,
    completarDia: 50,              // Todos os trackers
    baterMetaProteina: 20,
    baterMetaAgua: 15,
    treinarNoDiaPlanejado: 30,
    fazerCheckinSemanal: 100,
}

// ==========================================
// NÍVEIS
// ==========================================

export const NIVEIS = [
    { nivel: 1, nome: 'Iniciante', xpMinimo: 0 },
    { nivel: 2, nome: 'Dedicado', xpMinimo: 500 },
    { nivel: 3, nome: 'Consistente', xpMinimo: 1500 },
    { nivel: 4, nome: 'Comprometido', xpMinimo: 3500 },
    { nivel: 5, nome: 'Disciplinado', xpMinimo: 7000 },
    { nivel: 6, nome: 'Avançado', xpMinimo: 12000 },
    { nivel: 7, nome: 'Expert', xpMinimo: 20000 },
    { nivel: 8, nome: 'Elite', xpMinimo: 35000 },
    { nivel: 9, nome: 'Mestre', xpMinimo: 55000 },
    { nivel: 10, nome: 'Lenda', xpMinimo: 80000 },
]

// ==========================================
// BADGES
// ==========================================

export const BADGES: Omit<Badge, 'condicao'>[] = [
    // STREAK
    { id: 'streak_7', nome: '1 Semana de Fogo', icone: '🔥', descricao: '7 dias consecutivos', xpBonus: 100 },
    { id: 'streak_30', nome: 'Mês Perfeito', icone: '📅', descricao: '30 dias consecutivos', xpBonus: 500 },
    { id: 'streak_90', nome: 'Trimestre Perfeito', icone: '💎', descricao: '90 dias consecutivos', xpBonus: 2000 },

    // TREINO
    { id: 'treino_100', nome: 'Centurião', icone: '💯', descricao: '100 treinos registrados', xpBonus: 500 },
    { id: 'treino_madrugador', nome: 'Madrugador', icone: '🌅', descricao: 'Treinou antes das 7h', xpBonus: 50 },
    { id: 'treino_noturno', nome: 'Coruja', icone: '🦉', descricao: 'Treinou depois das 22h', xpBonus: 50 },

    // NUTRIÇÃO
    { id: 'proteina_7dias', nome: 'Máquina de Proteína', icone: '🥩', descricao: 'Bateu meta de proteína 7 dias seguidos', xpBonus: 200 },
    { id: 'dieta_perfeita', nome: 'Dieta Perfeita', icone: '🎯', descricao: '100% de aderência em um dia', xpBonus: 100 },
    { id: 'hidratacao_perfeita', nome: 'Hidratação Perfeita', icone: '💧', descricao: 'Bateu meta de água 7 dias seguidos', xpBonus: 150 },

    // PROGRESSO
    { id: 'primeiro_kg', nome: 'Primeira Conquista', icone: '⚖️', descricao: 'Perdeu/ganhou 1kg', xpBonus: 100 },
    { id: 'meta_bf', nome: 'Definição', icone: '💪', descricao: 'Atingiu meta de BF%', xpBonus: 1000 },
    { id: 'proporcao_ideal', nome: 'Proporção Áurea', icone: '✨', descricao: 'Atingiu proporção ideal em uma métrica', xpBonus: 500 },

    // ESPECIAIS
    { id: 'early_adopter', nome: 'Pioneiro', icone: '🚀', descricao: 'Usuário dos primeiros 1000', xpBonus: 500 },
    { id: 'feedback', nome: 'Voz Ativa', icone: '📣', descricao: 'Enviou feedback para o app', xpBonus: 50 },
    { id: 'compartilhou', nome: 'Influenciador', icone: '📢', descricao: 'Compartilhou o app com amigos', xpBonus: 100 },
]

// ==========================================
// SAUDAÇÕES
// ==========================================

export function getSaudacao(): string {
    const hora = new Date().getHours()
    if (hora < 12) return '🌅 Bom dia'
    if (hora < 18) return '☀️ Boa tarde'
    return '🌙 Boa noite'
}

// ==========================================
// FRASES MOTIVACIONAIS
// ==========================================

export const FRASES_MOTIVACIONAIS = [
    "Consistência é mais importante que intensidade. Continue registrando!",
    "Cada refeição registrada é um passo mais perto do seu físico ideal.",
    "Lembre-se: você está construindo o corpo dos seus sonhos, um dia de cada vez.",
    "Disciplina é fazer o que precisa ser feito, mesmo quando não quer.",
    "Seu futuro eu vai agradecer pela sua dedicação de hoje.",
    "A diferença entre quem você é e quem quer ser é o que você faz.",
    "Resultados acontecem quando você para de fazer desculpas.",
    "Todo progresso começa com a decisão de tentar.",
    "O único treino ruim é aquele que não aconteceu.",
    "Não conte os dias, faça os dias contarem.",
]
