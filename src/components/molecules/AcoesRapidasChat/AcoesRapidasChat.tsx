/**
 * AcoesRapidasChat Component
 * 
 * Ações rápidas para interação com o chat (4 botões)
 */

import React from 'react'
import { AcaoRapidaChatItem } from '../../../types/athlete-portal'

interface AcoesRapidasChatProps {
    onActionClick: (id: AcaoRapidaChatItem['id']) => void
}

const ACOES_RAPIDAS: AcaoRapidaChatItem[] = [
    {
        id: 'refeicao',
        icone: '🍽️',
        label: 'Refeição',
        mensagemPadrao: 'Quero registrar uma refeição'
    },
    {
        id: 'treino',
        icone: '🏋️',
        label: 'Treino',
        mensagemPadrao: 'Quero registrar meu treino de hoje'
    },
    {
        id: 'agua',
        icone: '💧',
        label: '+Água',
        mensagemPadrao: 'Bebi água agora'
    },
    {
        id: 'duvida',
        icone: '❓',
        label: 'Dúvida',
        mensagemPadrao: 'Tenho uma dúvida'
    }
]

export function AcoesRapidasChat({ onActionClick }: AcoesRapidasChatProps) {
    return (
        <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-800">
            <div className="grid grid-cols-4 gap-2">
                {ACOES_RAPIDAS.map((acao) => (
                    <button
                        key={acao.id}
                        onClick={() => onActionClick(acao.id)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                        <span className="text-2xl">{acao.icone}</span>
                        <span className="text-[10px] font-medium text-gray-400">
                            {acao.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export { ACOES_RAPIDAS }
