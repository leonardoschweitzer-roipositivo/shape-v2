/**
 * PortraitLock - Trava o Portal do Aluno na vertical no celular
 *
 * Navegadores (principalmente Safari/iOS) não permitem travar a rotação de
 * uma página web. Então:
 * 1. Tenta `screen.orientation.lock('portrait')` — funciona no Android quando
 *    o app está instalado na tela inicial / em tela cheia; nos demais casos
 *    falha em silêncio.
 * 2. Fallback universal: se o celular estiver deitado, cobre a tela com um
 *    aviso "gire o celular". O conteúdo nunca é usado na horizontal.
 *
 * Só afeta celulares (toque + altura baixa em landscape). Tablets e desktop
 * seguem livres.
 */

import { useEffect } from 'react'
import { Smartphone } from 'lucide-react'

// Celular deitado: tela de toque em landscape com altura de celular
const PHONE_LANDSCAPE_QUERY = '(orientation: landscape) and (pointer: coarse) and (max-height: 540px)'

export function PortraitLock() {
    useEffect(() => {
        const orientation = screen.orientation as ScreenOrientation & {
            lock?: (o: 'portrait') => Promise<void>
        }
        orientation?.lock?.('portrait').catch(() => { /* não suportado — overlay cobre */ })
    }, [])

    return (
        <>
            <style>{`
                .portrait-lock-overlay { display: none; }
                @media ${PHONE_LANDSCAPE_QUERY} {
                    .portrait-lock-overlay { display: flex; }
                    body { overflow: hidden; }
                }
            `}</style>
            <div
                className="portrait-lock-overlay fixed inset-0 z-[9999] flex-col items-center justify-center gap-4 bg-background-dark px-8 text-center"
                role="alert"
            >
                <Smartphone size={48} className="text-indigo-400 animate-pulse" />
                <p className="text-white text-lg font-black uppercase tracking-wide">Gire o celular</p>
                <p className="text-gray-400 text-sm">O portal funciona apenas na vertical.</p>
            </div>
        </>
    )
}
