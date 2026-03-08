/**
 * PersonalPortal — Container Principal do Portal do Personal
 *
 * Espelha o AthletePortal.tsx:
 * - URL dedicada: /personal/:personalId
 * - BottomNavigation com 4 tabs: Home, Alunos, Alertas, Perfil
 * - Carregamento bifásico: contexto crítico → dados secundários
 * - Mobile First: display otimizado para 375px+
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { BottomNavigationPersonal } from '@/components/organisms/BottomNavigationPersonal'
import { HomeScreen } from './personal/HomeScreen'
import { AlunosScreen } from './personal/AlunosScreen'
import { AlertasScreen } from './personal/AlertasScreen'
import { ProfileScreen } from './personal/ProfileScreen'
import {
    carregarContextoPersonal,
    listarAlunos,
    buscarAtividadeRecente,
} from '@/services/personalPortal.service'
import { notificacaoService } from '@/services/notificacao.service'
import type {
    PersonalPortalTab,
    PersonalPortalContext,
    AlunoCard,
    AtividadeRecente,
} from '@/types/personal-portal'
import type { Notificacao } from '@/types/notificacao.types'

interface PersonalPortalProps {
    personalId: string
    onLogout?: () => void
}

export function PersonalPortal({ personalId, onLogout }: PersonalPortalProps) {
    const [activeTab, setActiveTab] = useState<PersonalPortalTab>('home')
    const [loading, setLoading] = useState(true)

    // Estado crítico (Fase 1)
    const [contexto, setContexto] = useState<PersonalPortalContext | null>(null)

    // Estado secundário (Fase 2)
    const [alunos, setAlunos] = useState<AlunoCard[]>([])
    const [atividade, setAtividade] = useState<AtividadeRecente[]>([])
    const [alertasNaoLidos, setAlertasNaoLidos] = useState(0)
    const [notificacoesRecentes, setNotificacoesRecentes] = useState<Notificacao[]>([])

    // Estado de aluno selecionado (para navegação de Alertas → Ficha)
    const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<string | null>(null)

    // Fase 1: carrega dados críticos rapidamente
    useEffect(() => {
        async function loadCritical() {
            setLoading(true)
            const ctx = await carregarContextoPersonal(personalId)
            setContexto(ctx)
            setLoading(false)
        }
        loadCritical()
    }, [personalId])

    // Fase 2: carrega dados secundários em background
    useEffect(() => {
        if (!contexto) return
        async function loadSecondary() {
            const [alunosData, atividadeData, { data: notifsData }] = await Promise.all([
                listarAlunos(personalId),
                buscarAtividadeRecente(personalId),
                notificacaoService.buscar(personalId, { limit: 10 }),
            ])
            setAlunos(alunosData)
            setAtividade(atividadeData)
            const naoLidas = notifsData.filter(n => !n.lida)
            setNotificacoesRecentes(naoLidas.slice(0, 5))
            setAlertasNaoLidos(naoLidas.length)
        }
        loadSecondary()
    }, [contexto, personalId])

    // Alunos que precisam de atenção: critério do Desktop (score > 0 e < 60, OU status ATENCAO)
    const alunosAtencao = alunos.filter(a =>
        a.status === 'ATENCAO' || (a.score > 0 && a.score < 60)
    )

    const handleAbrirAluno = useCallback((alunoId: string) => {
        setAlunoSelecionadoId(alunoId)
        setActiveTab('alunos')
    }, [])

    // Loading state
    if (loading || !contexto) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="text-[var(--color-accent)] mx-auto animate-spin" size={40} />
                    <p className="text-gray-500 text-sm">Carregando seu portal...</p>
                </div>
            </div>
        )
    }

    const renderActiveScreen = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <HomeScreen
                        contexto={contexto}
                        alunosAtencao={alunosAtencao}
                        todosAlunos={alunos}
                        atividadeRecente={atividade}
                        onAbrirAluno={handleAbrirAluno}
                        notificacoesRecentes={notificacoesRecentes}
                        onVerAlertas={() => setActiveTab('alertas')}
                        onVerAlunos={() => setActiveTab('alunos')}
                        unreadCount={alertasNaoLidos}
                    />
                )
            case 'alunos':
                return (
                    <AlunosScreen
                        alunos={alunos}
                        alunoInicialId={alunoSelecionadoId ?? undefined}
                        onAlunoFechou={() => setAlunoSelecionadoId(null)}
                    />
                )
            case 'alertas':
                return (
                    <AlertasScreen
                        personalId={personalId}
                        onAbrirAluno={handleAbrirAluno}
                        onAtualizarContador={setAlertasNaoLidos}
                    />
                )
            case 'perfil':
                return (
                    <ProfileScreen
                        contexto={contexto}
                        onLogout={onLogout ?? (() => { })}
                    />
                )
        }
    }

    return (
        <div className="relative">
            {renderActiveScreen()}
            <BottomNavigationPersonal
                activeTab={activeTab}
                onTabChange={(tab) => {
                    if (tab !== 'alunos') setAlunoSelecionadoId(null)
                    setActiveTab(tab)
                }}
                alertasNaoLidos={alertasNaoLidos}
            />
        </div>
    )
}
