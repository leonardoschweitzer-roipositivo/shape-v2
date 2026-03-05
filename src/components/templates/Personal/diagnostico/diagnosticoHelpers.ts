/**
 * DiagnosticoView Helpers — Pure utility functions
 */
import { colors } from '@/tokens';
import { type ContextoAtleta } from '../AthleteContextSection';

export const generateGeneralAnalysis = (contexto: ContextoAtleta | null | undefined, score: number): string => {
    const scoreText = score >= 85 ? "nível de elite" : score >= 70 ? "perfil muito bom" : score >= 60 ? "estágio intermediário" : "fase inicial de desenvolvimento";

    if (!contexto) {
        return `O atleta encontra-se em um ${scoreText} (Score: ${score}). No entanto, a ausência de dados de contexto impossibilita uma análise de riscos e lifestyle. Recomenda-se preencher a ficha para personalizar as próximas etapas de treino e dieta.`;
    }

    const insights = [];

    // Saúde e Lesões (Prioridade Máxima)
    if ((contexto.problemas_saude && contexto.problemas_saude.toLowerCase() !== 'nenhum') ||
        (contexto.dores_lesoes && contexto.dores_lesoes.toLowerCase() !== 'nenhuma')) {
        insights.push(`Considerando ${contexto.problemas_saude || 'o histórico de saúde'} e as dores/lesões relatadas (${contexto.dores_lesoes}), a estratégia deve ser cautelosa.`);
    } else {
        insights.push("Com saúde íntegra e sem lesões relatadas, o atleta está apto a protocolos de alta intensidade.");
    }

    // Lifestyle e Histórico
    if (contexto.estilo_vida || contexto.historico_treino) {
        insights.push(`O lifestyle (${contexto.estilo_vida || 'não especificado'}) e o histórico de ${contexto.historico_treino || 'treino'} serão fundamentais para ajustar o volume de trabalho.`);
    }

    const baseMessage = `Com um score de ${score} (${scoreText}), o foco do diagnóstico será ${score >= 75 ? 'lapidar detalhes estéticos e proporções áureas' : 'construir uma base sólida de composição corporal'}.`;

    return `${baseMessage} ${insights.join(' ')} Cruzaremos estes dados com a volumetria métrica para definir o plano de ataque.`;
};

export const getScoreClassification = (score: number) => {
    if (score >= 90) return { nivel: 'ELITE / PRO', emoji: '🏆', cor: colors.semantic.success };
    if (score >= 80) return { nivel: 'AVANÇADO', emoji: '💪', cor: colors.brand.primary };
    if (score >= 70) return { nivel: 'ATLÉTICO', emoji: '⚡', cor: colors.brand.secondary || '#3B82F6' };
    if (score >= 60) return { nivel: 'INTERMEDIÁRIO', emoji: '📈', cor: '#8B5CF6' };
    return { nivel: 'INICIANTE', emoji: '🌱', cor: '#F59E0B' };
};
