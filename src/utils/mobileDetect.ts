/**
 * Utilitário de detecção de dispositivo mobile.
 * Usa largura da viewport como critério principal (≤ 768px).
 */

export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
}
