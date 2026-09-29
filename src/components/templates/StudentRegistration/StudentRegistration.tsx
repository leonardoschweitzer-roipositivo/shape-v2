import React from 'react';
import { ArrowLeft, Check, Sparkles, UserPlus, Activity, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { useCadastroAluno } from '@/hooks/useCadastroAluno';
import { AcessoAlunoCard } from '@/components/organisms/AcessoAlunoCard';

interface StudentRegistrationProps {
    onBack: () => void;
    onComplete: (atletaId?: string) => void;
}

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onBack, onComplete }) => {
    const { entity } = useAuthStore();
    const { loadFromSupabase } = useDataStore();

    const { form, atualizar, enviar, enviando, erro, erroValidacao, resultado } = useCadastroAluno(async () => {
        const personalId = entity.personal?.id;
        if (personalId) await loadFromSupabase(personalId);
    });

    const createdAtletaId = resultado?.atletaId ?? null;

    // ===== SUCCESS SCREEN =====
    if (createdAtletaId) {
        return (
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark animate-fade-in">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/5 bg-background-dark/50 sticky top-0 z-20 backdrop-blur-md">
                    <div className="max-w-3xl mx-auto flex items-center gap-4 w-full">
                        <button
                            onClick={() => onComplete()}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Cadastro Realizado</h1>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-3xl mx-auto p-6 md:p-8">
                        <div className="bg-surface border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl space-y-8">
                            {/* Success Icon */}
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto animate-fade-in-up">
                                    <Check className="text-emerald-400" size={36} strokeWidth={3} />
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wide">
                                    Aluno Cadastrado!
                                </h2>
                                <p className="text-gray-400 text-sm max-w-md mx-auto">
                                    <span className="text-white font-bold">{form.nome}</span> foi cadastrado(a) com sucesso.
                                    Agora você pode realizar a primeira avaliação IA.
                                </p>
                            </div>

                            {resultado?.acesso && (
                                <AcessoAlunoCard nomeAluno={form.nome} acesso={resultado.acesso} />
                            )}
                            {resultado?.erroAcesso && (
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3 text-sm text-amber-300">
                                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                    <p>O aluno foi cadastrado, mas o link de acesso não foi gerado: {resultado.erroAcesso} Você pode gerar depois na ficha do aluno.</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={() => onComplete(createdAtletaId)}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]"
                                >
                                    <Activity size={18} strokeWidth={2.5} />
                                    Realizar Avaliação IA
                                </button>

                                <button
                                    onClick={() => onComplete()}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
                                >
                                    Voltar para Meus Alunos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ===== REGISTRATION FORM =====
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark animate-fade-in">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 bg-background-dark/50 sticky top-0 z-20 backdrop-blur-md">
                <div className="max-w-3xl mx-auto flex items-center gap-4 w-full">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Cadastro Rápido de Aluno</h1>
                        <p className="text-gray-400 text-sm">Registre os dados básicos. As medidas serão coletadas na Avaliação IA.</p>
                    </div>
                </div>
            </div>

            {/* Main scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto p-6 md:p-8">
                    <div className="bg-surface border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">

                        {/* Section: Dados Pessoais */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                                <UserPlus className="text-primary" size={20} />
                                <h2 className="text-xl font-bold text-white uppercase tracking-wide">Dados do Aluno</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nome */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Nome Completo *</label>
                                    <input
                                        type="text"
                                        className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                        placeholder="Ex: Maria Oliveira Santos"
                                        value={form.nome}
                                        onChange={(e) => atualizar('nome', e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                {/* Gênero */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Gênero *</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm uppercase tracking-wide ${form.sexo === 'M'
                                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                                : 'bg-background-dark border-white/10 text-gray-500 hover:bg-white/5'
                                                }`}
                                            onClick={() => atualizar('sexo', 'M')}
                                        >
                                            ♂ Masculino
                                        </button>
                                        <button
                                            type="button"
                                            className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all font-bold text-sm uppercase tracking-wide ${form.sexo === 'F'
                                                ? 'bg-pink-500/20 border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                                                : 'bg-background-dark border-white/10 text-gray-500 hover:bg-white/5'
                                                }`}
                                            onClick={() => atualizar('sexo', 'F')}
                                        >
                                            ♀ Feminino
                                        </button>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Email</label>
                                    <input
                                        type="email"
                                        className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                        placeholder="atleta@dominio.com"
                                        value={form.email}
                                        onChange={(e) => atualizar('email', e.target.value)}
                                    />
                                </div>

                                {/* Telefone */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-300 uppercase tracking-widest">Telefone / WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-700"
                                        placeholder="(00) 00000-0000"
                                        value={form.telefone}
                                        onChange={(e) => atualizar('telefone', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Invite Toggle */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <label
                                className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all ${form.gerarAcesso
                                    ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                    : 'bg-background-dark border-white/10 hover:bg-white/5'
                                    }`}
                                onClick={() => atualizar('gerarAcesso', !form.gerarAcesso)}
                            >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.gerarAcesso ? 'border-primary bg-primary text-white' : 'border-gray-700'
                                    }`}>
                                    {form.gerarAcesso && <Check size={12} strokeWidth={3} />}
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-white font-bold block text-sm uppercase tracking-wider">Criar Acesso ao Portal</span>
                                    <span className="text-gray-500 text-xs">Gera um link para o aluno criar a própria senha (válido por 24h). Requer e-mail.</span>
                                </div>
                            </label>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-3">
                            <Sparkles className="text-primary mt-0.5" size={16} />
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Após o cadastro, você poderá realizar a <span className="text-primary font-bold">Avaliação IA</span> para coletar as medidas corporais e gerar o Score do atleta.
                            </p>
                        </div>

                        {/* Error Display */}
                        {erro && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                ❌ {erro}
                            </div>
                        )}

                        {/* Submit Button */}
                        {!erro && form.nome.trim().length >= 2 && erroValidacao && (
                            <p className="mt-6 text-xs text-amber-400 text-right">{erroValidacao}</p>
                        )}
                        <div className="mt-10 flex items-center justify-end">
                            <button
                                onClick={enviar}
                                disabled={enviando || !!erroValidacao}
                                title={erroValidacao ?? undefined}
                                className={`flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] ${enviando || !!erroValidacao
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02]'
                                    }`}
                            >
                                {enviando ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} strokeWidth={2.5} />
                                        Cadastrar Aluno
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
