/**
 * Configurações Visuais das Notificações — VITRU IA
 * 
 * Este arquivo contém ícones e cores para as notificações.
 * Separado do arquivo de tipos para evitar problemas de importação em serviços .ts
 */
import React from 'react'
import {
    AlertCircle,
    AlertTriangle,
    Star,
    Info,
    FileText,
    Dumbbell,
    Ruler,
    Trophy,
    User,
    BarChart3
} from 'lucide-react'
import type { PrioridadeNotificacao, CategoriaNotificacao } from './notificacao.types'

// ===== Constantes de Prioridade =====

export const PRIORIDADE_CONFIG: Record<PrioridadeNotificacao, {
    cor: string
    icone: React.ReactNode
    badge: boolean
}> = {
    urgente: { cor: '#EF4444', icone: <AlertCircle size={20} className="text-rose-500" />, badge: true },
    alerta: { cor: '#F59E0B', icone: <AlertTriangle size={18} className="text-amber-500" />, badge: true },
    destaque: { cor: '#22C55E', icone: <Star size={18} className="text-emerald-500 fill-emerald-500/20" />, badge: true },
    normal: { cor: '#3B82F6', icone: <Info size={18} className="text-sky-500" />, badge: true },
    baixa: { cor: '#6B7280', icone: <FileText size={16} className="text-zinc-500" />, badge: false },
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
