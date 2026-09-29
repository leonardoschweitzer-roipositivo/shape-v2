/** Resultado padronizado de serviços: nunca lança; `erro` já vem em português para a UI. */
export type Resultado<T> = { ok: true; data: T } | { ok: false; erro: string; codigo: string };
