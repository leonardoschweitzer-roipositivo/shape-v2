/**
 * Utilitários de data para o VITRU IA
 */

/**
 * Calcula a idade com base na data de nascimento
 * @param birthDate Data de nascimento no formato YYYY-MM-DD ou objeto Date
 * @returns Idade em anos ou 0 se inválido
 */
export const calculateAge = (birthDate: string | Date | undefined | null): number => {
    if (!birthDate) return 0;

    try {
        const birth = new Date(birthDate);
        if (isNaN(birth.getTime())) return 0;

        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    } catch (e) {
        console.error('[DateUtils] Erro ao calcular idade:', e);
        return 0;
    }
};
