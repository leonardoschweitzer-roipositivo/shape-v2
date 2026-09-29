/**
 * Redirecionamento pós-login — decide o destino pelo papel do usuário + dispositivo.
 *
 * Compartilhado entre Login e DefinirSenhaPage.
 * `onDesktop` recebe o perfil quando o destino é o app desktop (renderizado pelo App a partir do authStore).
 */
import { useAuthStore } from '@/stores/authStore';
import { isMobileDevice } from '@/utils/mobileDetect';
import { isGodEmail } from '@/types/auth';
import type { ProfileType } from '@/components/organisms';

export function redirecionarPosLogin(onDesktop: (perfil: ProfileType) => void = () => window.location.replace('/')): void {
    const state = useAuthStore.getState();
    const role = state.profile?.role?.toUpperCase();
    const email = state.user?.email || ''; // e-mail do login (não o do perfil)
    const mobile = isMobileDevice();

    if (email && isGodEmail(email)) {
        if (mobile) window.location.replace('/god');
        else onDesktop('god');
        return;
    }

    switch (role) {
        case 'PERSONAL': {
            const personal = state.entity?.personal;
            // Onboarding pendente: o App mostra o onboarding na raiz
            if (mobile && personal?.id && personal.onboarding_completo) {
                window.location.replace(`/personal/${personal.id}`);
                return;
            }
            onDesktop('personal');
            return;
        }
        case 'ATLETA': {
            const atleta = state.entity?.atleta;
            if (atleta?.personal_id) {
                window.location.replace('/atleta');
                return;
            }
            if (mobile) {
                window.location.replace('/meu-portal');
                return;
            }
            onDesktop('atleta');
            return;
        }
        case 'ACADEMIA': {
            const academiaId = state.entity?.academia?.id;
            if (mobile && academiaId) {
                window.location.replace(`/academia/${academiaId}`);
                return;
            }
            onDesktop('academia');
            return;
        }
        default:
            onDesktop('atleta');
    }
}
