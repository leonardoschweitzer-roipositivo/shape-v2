import { HeroContent, DashboardResponse } from '../types';

// Helper for date diff if date-fns not available or to reduce deps
const isWithinLast24Hours = (date?: Date): boolean => {
    if (!date) return false;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours <= 24;
};

export function getHeroContent(data: DashboardResponse): HeroContent {
    const { insights } = data;

    // Priority 1: Recent Achievement (last 24h)
    const recentAchievementInsight = insights.find(
        i => i.type === 'achievement' && isWithinLast24Hours(i.createdAt)
    );

    if (recentAchievementInsight) {
        return {
            badge: { label: 'CONQUISTA DESBLOQUEADA', variant: 'secondary' },
            date: recentAchievementInsight.createdAt,
            title: recentAchievementInsight.title,
            description: recentAchievementInsight.message,
            cta: { label: 'Ver conquistas', href: '/achievements' },
            image: {
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBveJp4fqO5P_9M0jdpi0Fr1eqSirHZlFbxtgxUe2M1xw4O1RmZoLx82Qg9Lh9LWgrxfFP56XioCTHTqpe9HZxGIyQfiTBfaIDcUkiEuzK2NfC6XHfceWUhu2Zv3CW6SkkLRtv-znR5u01DoqRUUXnkOObEHU97h_WmTSD6q8bTsKOYaRGGAHe7SJHxDAN6gTjOMjRKy2HOMa_R3O_DJQTthbOTzSdpiJjsAeR9dAi6RL7o7v5w0juHcd7cZ5obRe2gzsq4AN3jESN',
                alt: 'Conquista',
                position: 'background'
            }
        };
    }

    // Priority 2: High Priority Alert (Warning)
    const criticalAlert = insights.find(i => i.type === 'warning' && i.priority === 'high');
    if (criticalAlert) {
        return {
            badge: { label: 'ATENÇÃO', variant: 'warning' },
            date: criticalAlert.createdAt,
            title: criticalAlert.title,
            description: criticalAlert.message,
            cta: { label: 'Ver detalhes', href: '/measurements' },
            image: {
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBveJp4fqO5P_9M0jdpi0Fr1eqSirHZlFbxtgxUe2M1xw4O1RmZoLx82Qg9Lh9LWgrxfFP56XioCTHTqpe9HZxGIyQfiTBfaIDcUkiEuzK2NfC6XHfceWUhu2Zv3CW6SkkLRtv-znR5u01DoqRUUXnkOObEHU97h_WmTSD6q8bTsKOYaRGGAHe7SJHxDAN6gTjOMjRKy2HOMa_R3O_DJQTthbOTzSdpiJjsAeR9dAi6RL7o7v5w0juHcd7cZ5obRe2gzsq4AN3jESN',
                alt: 'Alerta',
                position: 'background'
            }
        };
    }

    // Priority 3: Weekly Report (Default)
    return {
        badge: { label: 'RELATÓRIO SEMANAL', variant: 'primary' },
        date: new Date(),
        title: 'SIMETRIA DO\nFÍSICO PERFEITO',
        description: 'Sua análise de Proporção Áurea indica uma evolução de 2.4% no deltoide lateral, aproximando-se do Golden Ratio ideal.',
        cta: { label: 'Ver análise detalhada', href: '/results' },
        image: {
            src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBveJp4fqO5P_9M0jdpi0Fr1eqSirHZlFbxtgxUe2M1xw4O1RmZoLx82Qg9Lh9LWgrxfFP56XioCTHTqpe9HZxGIyQfiTBfaIDcUkiEuzK2NfC6XHfceWUhu2Zv3CW6SkkLRtv-znR5u01DoqRUUXnkOObEHU97h_WmTSD6q8bTsKOYaRGGAHe7SJHxDAN6gTjOMjRKy2HOMa_R3O_DJQTthbOTzSdpiJjsAeR9dAi6RL7o7v5w0juHcd7cZ5obRe2gzsq4AN3jESN',
            alt: 'Shape Analysis',
            position: 'background'
        }
    };
}
