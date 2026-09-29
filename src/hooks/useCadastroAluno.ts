/**
 * useCadastroAluno — estado + validação + envio do cadastro de aluno.
 * Compartilhado entre o cadastro desktop (StudentRegistration) e o mobile (NovoAlunoScreen).
 */
import { useState } from 'react';
import { alunoService, type ResultadoCadastroAluno, type SexoAluno } from '@/services/aluno.service';

export interface FormCadastroAluno {
    nome: string;
    email: string;
    telefone: string;
    sexo: SexoAluno;
    gerarAcesso: boolean;
}

const FORM_INICIAL: FormCadastroAluno = { nome: '', email: '', telefone: '', sexo: 'M', gerarAcesso: true };

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validarCadastroAluno(form: FormCadastroAluno): string | null {
    if (form.nome.trim().length < 2) return 'Informe o nome do aluno (mínimo 2 letras).';
    const email = form.email.trim();
    if (email && !EMAIL_REGEX.test(email)) return 'Informe um e-mail válido.';
    if (form.gerarAcesso && !email) return 'Para criar o acesso ao portal, informe o e-mail do aluno.';
    return null;
}

export function useCadastroAluno(onCadastrado?: (resultado: ResultadoCadastroAluno) => void | Promise<void>) {
    const [form, setForm] = useState<FormCadastroAluno>(FORM_INICIAL);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [resultado, setResultado] = useState<ResultadoCadastroAluno | null>(null);

    const atualizar = <K extends keyof FormCadastroAluno>(campo: K, valor: FormCadastroAluno[K]) =>
        setForm(f => ({ ...f, [campo]: valor }));

    const erroValidacao = validarCadastroAluno(form);

    const enviar = async () => {
        if (enviando) return;
        if (erroValidacao) {
            setErro(erroValidacao);
            return;
        }
        setEnviando(true);
        setErro(null);
        const r = await alunoService.cadastrarAluno({
            nome: form.nome,
            sexo: form.sexo,
            email: form.email,
            telefone: form.telefone,
            gerarAcesso: form.gerarAcesso,
        });
        if (!r.ok) {
            setErro(r.erro);
            setEnviando(false);
            return;
        }
        setResultado(r.data);
        await onCadastrado?.(r.data);
        setEnviando(false);
    };

    const reiniciar = () => {
        setForm(FORM_INICIAL);
        setResultado(null);
        setErro(null);
    };

    return { form, atualizar, enviar, enviando, erro, erroValidacao, resultado, reiniciar };
}
