/**
 * Mock Profile Data
 */

import { DadosBasicos, MeuPersonal } from '../types/athlete-portal'

export const mockDadosBasicos: DadosBasicos = {
    altura: 178,
    idade: 31,
    objetivo: 'Hipertrofia e Definição',
    categoria: 'Intermediário'
}

export const mockMeuPersonal: MeuPersonal = {
    id: 'personal-1',
    nome: 'Carlos Mendes',
    fotoUrl: undefined,
    cref: '123456-G/SP',
    telefone: '(11) 98765-4321',
    email: 'carlos.mendes@vitru.com'
}

export const mockProfileData = {
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    fotoUrl: undefined
}
