import React from 'react';
import {
    ESPECIALIDADES_PERSONAL,
    UFS,
    mascararTelefone,
    type DadosProfissionais,
    type ErrosDadosProfissionais,
} from './personalDados';

interface PersonalDadosFormProps {
    dados: DadosProfissionais;
    onChange: (dados: DadosProfissionais) => void;
    /** Campos exibidos, na ordem. */
    campos: (keyof DadosProfissionais)[];
    erros?: ErrosDadosProfissionais;
}

const inputClass =
    'w-full bg-[#0E1424] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-all text-sm';

const Campo: React.FC<{ label: string; erro?: string; opcional?: boolean; children: React.ReactNode }> = ({
    label,
    erro,
    opcional,
    children,
}) => (
    <div>
        <label className="text-xs text-gray-400 font-medium ml-1 mb-1.5 block">
            {label}
            {opcional && <span className="text-gray-600"> (opcional)</span>}
        </label>
        {children}
        {erro && <p className="text-xs text-red-400 mt-1 ml-1">{erro}</p>}
    </div>
);

/**
 * Campos de dados profissionais do Personal (nome, CREF, WhatsApp, cidade/UF,
 * especialidades, bio). Controlado — o pai guarda o estado e salva.
 */
export const PersonalDadosForm: React.FC<PersonalDadosFormProps> = ({ dados, onChange, campos, erros = {} }) => {
    const set = <K extends keyof DadosProfissionais>(campo: K, valor: DadosProfissionais[K]) =>
        onChange({ ...dados, [campo]: valor });

    const toggleEspecialidade = (esp: string) =>
        set(
            'especialidades',
            dados.especialidades.includes(esp)
                ? dados.especialidades.filter(e => e !== esp)
                : [...dados.especialidades, esp]
        );

    const render = (campo: keyof DadosProfissionais) => {
        switch (campo) {
            case 'nome':
                return (
                    <Campo key={campo} label="Nome completo" erro={erros.nome}>
                        <input className={inputClass} value={dados.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome" />
                    </Campo>
                );
            case 'cref':
                return (
                    <Campo key={campo} label="CREF" erro={erros.cref} opcional>
                        <input
                            className={inputClass}
                            value={dados.cref}
                            onChange={e => set('cref', e.target.value.toUpperCase())}
                            placeholder="123456-G/SP"
                        />
                    </Campo>
                );
            case 'telefone':
                return (
                    <Campo key={campo} label="WhatsApp" erro={erros.telefone}>
                        <input
                            className={inputClass}
                            inputMode="tel"
                            value={dados.telefone}
                            onChange={e => set('telefone', mascararTelefone(e.target.value))}
                            placeholder="(11) 91234-5678"
                        />
                    </Campo>
                );
            case 'cidade':
                return (
                    <Campo key={campo} label="Cidade" erro={erros.cidade}>
                        <input className={inputClass} value={dados.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Sua cidade" />
                    </Campo>
                );
            case 'estado':
                return (
                    <Campo key={campo} label="UF" erro={erros.estado}>
                        <select className={inputClass} value={dados.estado} onChange={e => set('estado', e.target.value)}>
                            <option value="">Selecione</option>
                            {UFS.map(uf => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </Campo>
                );
            case 'especialidades':
                return (
                    <Campo key={campo} label="Especialidades" opcional>
                        <div className="flex flex-wrap gap-2">
                            {ESPECIALIDADES_PERSONAL.map(esp => {
                                const ativo = dados.especialidades.includes(esp);
                                return (
                                    <button
                                        key={esp}
                                        type="button"
                                        onClick={() => toggleEspecialidade(esp)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${ativo
                                            ? 'bg-primary/15 border-primary/40 text-primary'
                                            : 'border-white/10 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        {esp}
                                    </button>
                                );
                            })}
                        </div>
                    </Campo>
                );
            case 'bio':
                return (
                    <Campo key={campo} label="Biografia" opcional>
                        <textarea
                            className={`${inputClass} min-h-[96px] resize-y`}
                            value={dados.bio}
                            maxLength={500}
                            onChange={e => set('bio', e.target.value)}
                            placeholder="Conte em poucas linhas como você trabalha."
                        />
                    </Campo>
                );
        }
    };

    return <div className="flex flex-col gap-4">{campos.map(render)}</div>;
};
