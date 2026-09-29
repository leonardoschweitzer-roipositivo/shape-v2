/**
 * PersonalOnboarding — primeiro acesso do Personal (2 passos curtos).
 *
 * 1. Identificação: nome, CREF (opcional), WhatsApp
 * 2. Atuação: cidade, UF, especialidades
 *
 * Exibido pelo App enquanto `personais.onboarding_completo = false`.
 */
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, LogOut } from 'lucide-react';
import {
    PersonalDadosForm,
    dadosProfissionaisDe,
    paraPayloadPersonal,
    validarDadosProfissionais,
    type DadosProfissionais,
    type ErrosDadosProfissionais,
} from '@/components/organisms/PersonalDadosForm';
import { personalService } from '@/services/personal.service';
import { useAuthStore } from '@/stores/authStore';
import { isMobileDevice } from '@/utils/mobileDetect';

const PASSOS: { titulo: string; subtitulo: string; campos: (keyof DadosProfissionais)[] }[] = [
    {
        titulo: 'Seus dados profissionais',
        subtitulo: 'É assim que seus alunos vão ver você no portal.',
        campos: ['nome', 'cref', 'telefone'],
    },
    {
        titulo: 'Onde e como você atua',
        subtitulo: 'Ajuda a IA a entender seu público.',
        campos: ['cidade', 'estado', 'especialidades'],
    },
];

interface PersonalOnboardingProps {
    onSair: () => void;
}

export const PersonalOnboarding: React.FC<PersonalOnboardingProps> = ({ onSair }) => {
    const personal = useAuthStore(s => s.entity.personal);
    const refreshEntity = useAuthStore(s => s.refreshEntity);

    const [passo, setPasso] = useState(0);
    const [dados, setDados] = useState<DadosProfissionais>(() => dadosProfissionaisDe(personal));
    const [erros, setErros] = useState<ErrosDadosProfissionais>({});
    const [salvando, setSalvando] = useState(false);
    const [erroGeral, setErroGeral] = useState<string | null>(null);

    const atual = PASSOS[passo];
    const ultimo = passo === PASSOS.length - 1;

    const avancar = async () => {
        const novosErros = validarDadosProfissionais(dados, atual.campos);
        setErros(novosErros);
        if (Object.keys(novosErros).length > 0) return;

        if (!ultimo) {
            setPasso(p => p + 1);
            return;
        }

        if (!personal?.id) return;
        setSalvando(true);
        setErroGeral(null);
        const { error } = await personalService.atualizarDadosProfissionais(
            personal.id,
            paraPayloadPersonal(dados),
            { concluirOnboarding: true }
        );
        if (error) {
            setErroGeral('Não foi possível salvar. Tente novamente.');
            setSalvando(false);
            return;
        }
        await refreshEntity();
        if (isMobileDevice()) window.location.replace(`/personal/${personal.id}`);
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background-dark px-4 py-10 text-white">
            <div className="w-full max-w-md space-y-8">
                <div className="space-y-3">
                    <div className="flex gap-2">
                        {PASSOS.map((_, i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= passo ? 'bg-primary' : 'bg-white/10'}`} />
                        ))}
                    </div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                        Passo {passo + 1} de {PASSOS.length}
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight">{atual.titulo}</h1>
                    <p className="text-sm text-gray-400">{atual.subtitulo}</p>
                </div>

                <PersonalDadosForm dados={dados} onChange={setDados} campos={atual.campos} erros={erros} />

                {erroGeral && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{erroGeral}</div>
                )}

                <div className="flex gap-3">
                    {passo > 0 && (
                        <button
                            type="button"
                            onClick={() => setPasso(p => p - 1)}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3.5 text-sm text-gray-300 hover:bg-white/5"
                        >
                            <ArrowLeft size={16} /> Voltar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={avancar}
                        disabled={salvando}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-black uppercase tracking-widest text-white disabled:opacity-50"
                    >
                        {salvando ? 'Salvando...' : ultimo ? (<><Check size={16} /> Concluir</>) : (<>Continuar <ArrowRight size={16} /></>)}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onSair}
                    className="mx-auto flex items-center gap-2 text-xs text-gray-600 hover:text-gray-400"
                >
                    <LogOut size={12} /> Sair
                </button>
            </div>
        </div>
    );
};
