
/**
 * Extrai a frequência semanal de treino do texto do histórico.
 * Ex: "4 vezes na semana" → 4, "4x/semana" → 4, "treina 4 dias" → 4.
 * Retorna null se não conseguir identificar no texto.
 */
export function inferirFreqTreino(contexto?: ContextoAtleta): number | null {
    const texto = (contexto?.historico_treino || '').toLowerCase();
    if (!texto) return null;
    const re1 = texto.match(/(\d+)\s*(?:vezes|dias|treinos)\s*(?:por|na)\s*semana/i);
    const re2 = texto.match(/(\d+)\s*x\s*\/\s*semana/i);
    const re3 = texto.match(/treino\s*(\d+)\s*(?:x|vezes|dias)/i);
    const re4 = texto.match(/(\d+)\s*x\s*semana/i);
    const m = re1 || re2 || re3 || re4;
    if (m) {
        const n = parseInt(m[1], 10);
        if (n >= 1 && n <= 7) return n;
    }
    return null;
}
