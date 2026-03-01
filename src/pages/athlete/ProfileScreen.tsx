/**
 * ProfileScreen - Tela PERFIL do Portal do Atleta
 * 
 * Informações do atleta, personal trainer e configurações
 */

import React from 'react'
import { ProfileHeader } from '../../components/molecules/ProfileHeader'
import { CardDadosBasicos } from '../../components/organisms/CardDadosBasicos'
import { CardMeuPersonal } from '../../components/organisms/CardMeuPersonal'
import { ProfileMenuLinks } from '../../components/organisms/ProfileMenuLinks'
import { DadosBasicos, MeuPersonal } from '../../types/athlete-portal'

interface ProfileScreenProps {
    nome: string
    email: string
    fotoUrl?: string
    dadosBasicos: DadosBasicos
    personal: MeuPersonal | null
    onSettings: () => void
    onHelp: () => void
    onLogout: () => void
}

export function ProfileScreen({
    nome,
    email,
    fotoUrl,
    dadosBasicos,
    personal,
    onSettings,
    onHelp,
    onLogout
}: ProfileScreenProps) {
    return (
        <div className="min-h-screen bg-[#060B18] pb-20">
            {/* Header com foto e nome */}
            <ProfileHeader
                nome={nome}
                email={email}
                fotoUrl={fotoUrl}
            />

            {/* Content */}
            <div className="px-4 py-6 space-y-4">
                {/* Dados Básicos */}
                <CardDadosBasicos dados={dadosBasicos} />

                {/* Meu Personal */}
                <CardMeuPersonal personal={personal} />

                {/* Menu Links */}
                <ProfileMenuLinks
                    onSettings={onSettings}
                    onHelp={onHelp}
                    onLogout={onLogout}
                />
            </div>
        </div>
    )
}
