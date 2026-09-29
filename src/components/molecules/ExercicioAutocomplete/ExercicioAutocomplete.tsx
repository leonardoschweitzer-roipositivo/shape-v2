/**
 * ExercicioAutocomplete — campo de nome de exercício com sugestões da Biblioteca.
 *
 * - Texto livre continua valendo (exercícios fora da biblioteca).
 * - Ao escolher uma sugestão, devolve nome + bibliotecaId + urlVideo (vídeo aparece no portal do aluno).
 * - Se o texto mudar depois, o vínculo é desfeito (onChange sem bibliotecaId).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PlayCircle } from 'lucide-react';
import { carregarBiblioteca, normalizarNome } from '@/services/exercicioVinculacao.service';
import type { ExercicioBiblioteca } from '@/types/exercicio-biblioteca';

export interface EscolhaExercicio {
    nome: string;
    bibliotecaId?: string;
    urlVideo?: string;
}

interface ExercicioAutocompleteProps {
    value: string;
    bibliotecaId?: string;
    onChange: (escolha: EscolhaExercicio) => void;
    placeholder?: string;
}

const MAX_SUGESTOES = 8;

export const ExercicioAutocomplete: React.FC<ExercicioAutocompleteProps> = ({
    value,
    bibliotecaId,
    onChange,
    placeholder = 'Nome do exercício',
}) => {
    const [biblioteca, setBiblioteca] = useState<ExercicioBiblioteca[]>([]);
    const [aberto, setAberto] = useState(false);
    const [destaque, setDestaque] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ativo = true;
        carregarBiblioteca().then(lista => ativo && setBiblioteca(lista));
        return () => {
            ativo = false;
        };
    }, []);

    // Listener de "clique fora" só enquanto a lista está aberta (o editor tem dezenas de campos)
    useEffect(() => {
        if (!aberto) return;
        const fechar = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setAberto(false);
        };
        document.addEventListener('mousedown', fechar);
        return () => document.removeEventListener('mousedown', fechar);
    }, [aberto]);

    const sugestoes = useMemo(() => {
        const termo = normalizarNome(value);
        if (termo.length < 2) return [];
        return biblioteca
            .filter(ex =>
                normalizarNome(ex.nome).includes(termo) ||
                (ex.nome_alternativo ? normalizarNome(ex.nome_alternativo).includes(termo) : false)
            )
            .slice(0, MAX_SUGESTOES);
    }, [biblioteca, value]);

    const escolher = (ex: ExercicioBiblioteca) => {
        onChange({ nome: ex.nome, bibliotecaId: ex.id, urlVideo: ex.url_video ?? undefined });
        setAberto(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!aberto || sugestoes.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setDestaque(d => Math.min(d + 1, sugestoes.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setDestaque(d => Math.max(d - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            escolher(sugestoes[destaque]);
        } else if (e.key === 'Escape') {
            setAberto(false);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={e => {
                    onChange({ nome: e.target.value }); // texto livre desfaz o vínculo com a biblioteca
                    setAberto(true);
                    setDestaque(0);
                }}
                onFocus={() => setAberto(true)}
                onKeyDown={onKeyDown}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-sm font-bold text-white placeholder-gray-600 focus:outline-none focus:border-primary/50"
            />
            {bibliotecaId && (
                <PlayCircle size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-400" aria-label="Vinculado à biblioteca (com vídeo)" />
            )}
            {aberto && sugestoes.length > 0 && (
                <ul className="absolute z-30 mt-1 w-full max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-[#0E1424] shadow-2xl">
                    {sugestoes.map((ex, i) => (
                        <li key={ex.id}>
                            <button
                                type="button"
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => escolher(ex)}
                                className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between gap-2 ${i === destaque ? 'bg-primary/15 text-white' : 'text-gray-300 hover:bg-white/5'}`}
                            >
                                <span className="truncate">{ex.nome}</span>
                                <span className="shrink-0 text-[10px] uppercase tracking-wider text-gray-500">
                                    {ex.grupo_muscular}
                                    {ex.url_video ? ' · vídeo' : ''}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
