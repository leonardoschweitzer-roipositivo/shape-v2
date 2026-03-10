/**
 * Configurações Visuais das Notificações — VITRU IA
 * 
 * Este arquivo contém ícones e cores para as notificações.
 * Separado do arquivo de tipos para evitar problemas de importação em serviços .ts
 */
import React from 'react'
import {
    Trophy,
    User,
    BarChart3,
    Droplets,
    Moon,
    Weight,
    TrendingUp,
    TrendingDown,
    Ruler,
    AlertCircle as AlertIcon,
    Flame as WorkoutIcon,
    History,
    Activity,
    MessageCircle,
    AlertTriangle,
    Star,
    Info,
    FileText,
    Dumbbell
} from 'lucide-react'
import type { PrioridadeNotificacao, CategoriaNotificacao } from './notificacao.types'

// ===== Constantes de Prioridade =====

export const PRIORIDADE_CONFIG: Record<PrioridadeNotificacao, {
    cor: string
    icone: React.ReactNode
    badge: boolean
}> = {
    urgente: { cor: '#EF4444', icone: <AlertIcon size={20} className="text-rose-500" />, badge: true },
    alerta: { cor: '#F59E0B', icone: <AlertTriangle size={18} className="text-amber-500" />, badge: true },
    destaque: { cor: '#22C55E', icone: <Star size={18} className="text-emerald-500 fill-emerald-500/20" />, badge: true },
    normal: { cor: '#3B82F6', icone: <Info size={18} className="text-sky-500" />, badge: true },
    baixa: { cor: '#6B7280', icone: <FileText size={16} className="text-zinc-500" />, badge: false },
}

// ===== Configuração por Tipo de Notificação (Ícones específicos) =====

export const TIPO_ICON_MAP: Partial<Record<string, React.ReactNode>> = {
    // Treino
    'TREINO_COMPLETO': <WorkoutIcon size={18} className="text-emerald-400" />,
    'TREINO_PULADO': <WorkoutIcon size={18} className="text-amber-400 opacity-60" />,
    'STREAK_ALUNO': <WorkoutIcon size={20} className="text-orange-500" />,
    'FEEDBACK_TREINO': <MessageCircle size={18} className="text-indigo-400" />,

    // Medidas
    'NOVA_MEDICAO_PORTAL': <Ruler size={18} className="text-indigo-400" />,
    'SCORE_SUBIU': <TrendingUp size={18} className="text-emerald-400" />,
    'SCORE_CAIU': <TrendingDown size={18} className="text-rose-500" />,
    'PROPORCAO_IDEAL': <Star size={18} className="text-amber-400" />,

    // Portal / Registros
    'REGISTRO_RAPIDO': <Activity size={18} className="text-sky-400" />,
    'DOR_REPORTADA': <AlertTriangle size={18} className="text-rose-500" />,
    'STREAK_QUEBRADA': <History size={18} className="text-zinc-500" />,
    'PRIMEIRO_ACESSO': <User size={18} className="text-indigo-400" />,
    // Notificações para o Atleta
    'TREINO_EDITADO': <Dumbbell size={18} className="text-indigo-400" />,
    'RESPOSTA_PERSONAL': <MessageCircle size={18} className="text-emerald-400" />,
    'MENSAGEM_PERSONAL': <MessageCircle size={18} className="text-sky-400" />,
}

// Helper para detectar ícones contextuais na mensagem
export function getContextualIcon(titulo: string, mensagem: string, tipo: string): React.ReactNode | null {
    if (TIPO_ICON_MAP[tipo]) return TIPO_ICON_MAP[tipo];

    const texto = (titulo + ' ' + mensagem).toLowerCase();
    if (texto.includes('água')) return <Droplets size={18} className="text-sky-400" />;
    if (texto.includes('sono') || texto.includes('dormir')) return <Moon size={18} className="text-indigo-300" />;
    if (texto.includes('peso') || texto.includes('balança')) return <Weight size={18} className="text-emerald-400" />;
    if (texto.includes('treino') || texto.includes('exercício')) return <WorkoutIcon size={18} className="text-emerald-400" />;
    if (texto.includes('feedback') || texto.includes('mandou')) return <MessageCircle size={18} className="text-indigo-400" />;

    return null;
}

// ===== Constantes de Categoria =====

export const CATEGORIA_CONFIG: Record<CategoriaNotificacao, {
    label: string
    icone: React.ReactNode
    cor: string
}> = {
    treino: { label: 'Treino', icone: <Dumbbell size={16} />, cor: '#3B82F6' },
    medidas: { label: 'Medidas', icone: <Ruler size={16} />, cor: '#8B5CF6' },
    conquistas: { label: 'Conquistas', icone: <Trophy size={16} />, cor: '#F59E0B' },
    portal: { label: 'Portal', icone: <User size={16} />, cor: '#22C55E' },
    resumo: { label: 'Resumos', icone: <BarChart3 size={16} />, cor: '#6B7280' },
}
