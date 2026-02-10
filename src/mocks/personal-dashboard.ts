/**
 * Mock Data - Personal Dashboard
 */

import type { AtletaDailyStatus, Alerta } from '../types/daily-tracking'

export const mockAtletas: AtletaDailyStatus[] = [
    {
        id: '1',
        nome: 'João Silva',
        avatar: undefined,
        ultimaAtividade: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        status: 'ativo',
        resumoHoje: {
            refeicoes: { atual: 3, meta: 5 },
            treino: { realizado: true, tipo: 'Peito + Tríceps' },
            agua: { atual: 3000, meta: 3000 },
            sono: { horas: 8, qualidade: 4 },
        },
        alertas: [],
    },
    {
        id: '2',
        nome: 'Maria Santos',
        avatar: undefined,
        ultimaAtividade: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
        status: 'atencao',
        resumoHoje: {
            refeicoes: { atual: 2, meta: 5 },
            treino: { realizado: false, tipo: 'Costas + Bíceps' },
            agua: { atual: 1500, meta: 3000 },
            sono: { horas: 6, qualidade: 3 },
        },
        alertas: ['Não treinou hoje', 'Hidratação baixa'],
    },
    {
        id: '3',
        nome: 'Pedro Oliveira',
        avatar: undefined,
        ultimaAtividade: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h atrás
        status: 'alerta',
        resumoHoje: {
            refeicoes: { atual: 1, meta: 5 },
            treino: { realizado: false },
            agua: { atual: 800, meta: 3000 },
            sono: { horas: 5, qualidade: 2 },
        },
        alertas: ['Reportou dor no ombro', 'Sono insuficiente', 'Déficit nutricional'],
    },
    {
        id: '4',
        nome: 'Ana Costa',
        avatar: undefined,
        ultimaAtividade: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12h atrás
        status: 'ativo',
        resumoHoje: {
            refeicoes: { atual: 4, meta: 5 },
            treino: { realizado: true, tipo: 'Pernas' },
            agua: { atual: 2800, meta: 3000 },
            sono: { horas: 7.5, qualidade: 4 },
        },
        alertas: [],
    },
    {
        id: '5',
        nome: 'Carlos Mendes',
        avatar: undefined,
        ultimaAtividade: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
        status: 'inativo',
        resumoHoje: {
            refeicoes: { atual: 0, meta: 5 },
            treino: { realizado: false },
            agua: { atual: 0, meta: 3000 },
            sono: { horas: 0, qualidade: 0 },
        },
        alertas: ['Inativo há 2 dias'],
    },
    {
        id: '6',
        nome: 'Beatriz Lima',
        avatar: undefined,
        ultimaAtividade: new Date(Date.now() - 1000 * 60 * 45), // 45 min atrás
        status: 'ativo',
        resumoHoje: {
            refeicoes: { atual: 5, meta: 5 },
            treino: { realizado: true, tipo: 'Ombros + Abdômen' },
            agua: { atual: 3200, meta: 3000 },
            sono: { horas: 8, qualidade: 5 },
        },
        alertas: [],
    },
    {
        id: '7',
        nome: 'Rafael Souza',
        avatar: undefined,
        ultimaAtividade: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4h atrás
        status: 'atencao',
        resumoHoje: {
            refeicoes: { atual: 2, meta: 5 },
            treino: { realizado: true, tipo: 'Peito' },
            agua: { atual: 1800, meta: 3000 },
            sono: { horas: 6.5, qualidade: 3 },
        },
        alertas: ['Déficit calórico severo'],
    },
]

export const mockAlertas: Alerta[] = [
    {
        id: 'a1',
        atletaId: '3',
        atletaNome: 'Pedro Oliveira',
        tipo: 'dor',
        mensagem: 'Pedro reportou dor intensa no ombro direito (intensidade 8/10)',
        prioridade: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        acao: {
            label: 'Ver detalhes',
            url: '/personal/atleta/3',
        },
    },
    {
        id: 'a2',
        atletaId: '5',
        atletaNome: 'Carlos Mendes',
        tipo: 'inativo',
        mensagem: 'Carlos está inativo há 2 dias sem registrar atividades',
        prioridade: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        acao: {
            label: 'Enviar mensagem',
            url: '/personal/atleta/5',
        },
    },
    {
        id: 'a3',
        atletaId: '2',
        atletaNome: 'Maria Santos',
        tipo: 'deficit_nutricional',
        mensagem: 'Maria está com déficit de proteína há 3 dias consecutivos',
        prioridade: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
    {
        id: 'a4',
        atletaId: '3',
        atletaNome: 'Pedro Oliveira',
        tipo: 'energia_baixa',
        mensagem: 'Pedro reportou sono de baixa qualidade (5h, qualidade 2/5)',
        prioridade: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
    },
    {
        id: 'a5',
        atletaId: '7',
        atletaNome: 'Rafael Souza',
        tipo: 'deficit_nutricional',
        mensagem: 'Rafael está com déficit calórico severo (apenas 800 kcal registradas)',
        prioridade: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
]
