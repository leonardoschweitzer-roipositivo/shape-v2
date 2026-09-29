/**
 * Dados profissionais do Personal — tipo, opções e validação.
 * Compartilhado entre o onboarding e a página de perfil.
 */
import type { Personal } from '@/lib/database.types';

export interface DadosProfissionais {
    nome: string;
    cref: string;
    telefone: string;
    cidade: string;
    estado: string;
    especialidades: string[];
    bio: string;
}

export const ESPECIALIDADES_PERSONAL = [
    'Hipertrofia',
    'Emagrecimento',
    'Funcional',
    'Reabilitação',
    'Idosos',
    'Gestantes',
    'Performance',
    'Fisiculturismo',
] as const;

export const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

/** CREF no formato 123456-G/SP (G = graduado, P = provisionado). */
const CREF_REGEX = /^\d{6}-[GP]\/[A-Z]{2}$/;

export function dadosProfissionaisDe(personal: Personal | null | undefined): DadosProfissionais {
    return {
        nome: personal?.nome ?? '',
        cref: personal?.cref ?? '',
        telefone: personal?.telefone ?? '',
        cidade: personal?.cidade ?? '',
        estado: personal?.estado ?? '',
        especialidades: personal?.especialidades ?? [],
        bio: personal?.bio ?? '',
    };
}

/** Máscara (00) 00000-0000 — aceita fixo (8 dígitos) e celular (9 dígitos). */
export function mascararTelefone(valor: string): string {
    const d = valor.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export type ErrosDadosProfissionais = Partial<Record<keyof DadosProfissionais, string>>;

export function validarDadosProfissionais(
    dados: DadosProfissionais,
    campos: (keyof DadosProfissionais)[]
): ErrosDadosProfissionais {
    const erros: ErrosDadosProfissionais = {};
    if (campos.includes('nome') && dados.nome.trim().length < 2) erros.nome = 'Informe seu nome.';
    if (campos.includes('cref') && dados.cref.trim() && !CREF_REGEX.test(dados.cref.trim().toUpperCase())) {
        erros.cref = 'Formato esperado: 123456-G/SP';
    }
    if (campos.includes('telefone')) {
        const digitos = dados.telefone.replace(/\D/g, '');
        if (digitos.length < 10) erros.telefone = 'Informe um WhatsApp com DDD.';
    }
    if (campos.includes('cidade') && !dados.cidade.trim()) erros.cidade = 'Informe sua cidade.';
    if (campos.includes('estado') && !UFS.includes(dados.estado as (typeof UFS)[number])) erros.estado = 'Selecione a UF.';
    return erros;
}

/** Converte o formulário no payload de `personais` (normalizado). */
export function paraPayloadPersonal(dados: DadosProfissionais) {
    return {
        nome: dados.nome.trim(),
        cref: dados.cref.trim() ? dados.cref.trim().toUpperCase() : null,
        telefone: dados.telefone.trim() || null,
        cidade: dados.cidade.trim() || null,
        estado: dados.estado || null,
        especialidades: dados.especialidades,
        bio: dados.bio.trim() || null,
    };
}
