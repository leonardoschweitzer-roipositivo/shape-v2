/**
 * Date Utilities — Funções para manipulação de datas no Portal
 *
 * Centraliza a lógica de data para evitar bugs de timezone.
 * O uso de `new Date().toISOString().split('T')[0]` retorna data em UTC,
 * o que causa erros após 21h BRT (UTC-3), pois o dia UTC já é o "dia seguinte".
 */

/**
 * Retorna a data de HOJE no fuso local (não UTC) no formato YYYY-MM-DD.
 * Evita o bug de usar toISOString() que converte para UTC.
 */
export function getHojeLocal(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
