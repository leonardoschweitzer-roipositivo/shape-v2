import React from 'react';
import { Gavel, FileText, Activity, AlertTriangle, ShieldCheck, ArrowLeft, Scale } from 'lucide-react';

interface LegalSectionProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const LegalSection: React.FC<LegalSectionProps> = ({ icon: Icon, title, children }) => (
    <section className="mb-12 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
                <Icon size={24} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{title}</h2>
        </div>
        <div className="pl-16 space-y-4 text-gray-400 leading-relaxed font-light">
            {children}
        </div>
    </section>
);

interface TermsOfUseProps {
    onBack: () => void;
}

export const TermsOfUse: React.FC<TermsOfUseProps> = ({ onBack }) => {
    return (
        <div className="flex-1 p-4 md:p-8 pb-20 bg-[#0A0F1C]">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium uppercase tracking-widest">Voltar</span>
                </button>

                <div className="mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tighter uppercase mb-4">
                        Termos de <span className="text-primary">Uso</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-2xl">
                        Bem-vindo ao VITRU IA. Ao utilizar nossa plataforma, você concorda com os termos e condições descritos abaixo. Por favor, leia-os atentamente.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Vigente desde: 08 de Fevereiro de 2026
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-primary/20 via-white/5 to-transparent mb-16" />

                {/* Content Sections */}
                <LegalSection icon={Gavel} title="1. Aceitação dos Termos">
                    <p>
                        Ao acessar ou usar a plataforma VITRU IA, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
                    </p>
                </LegalSection>

                <LegalSection icon={Activity} title="2. Isenção de Responsabilidade Médica">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                        <p className="text-sm text-red-400 font-bold">
                            IMPORTANTE: O VITRU IA NÃO É UM DISPOSITIVO MÉDICO NEM SUBSTITUI A ORIENTAÇÃO DE PROFISSIONAIS DE SAÚDE.
                        </p>
                    </div>
                    <p>
                        As análises de IA, diagnósticos estéticos e planos de treino/dieta gerados pela plataforma são baseados em algoritmos matemáticos e estatísticos de simetria corporal. Eles devem ser interpretados apenas como <strong>orientações informativas</strong>.
                    </p>
                    <p>
                        Sempre consulte um médico antes de iniciar qualquer programa de exercícios ou mudança na dieta, especialmente se você tiver condições pré-existentes.
                    </p>
                </LegalSection>

                <LegalSection icon={FileText} title="3. Uso da Licença">
                    <p>
                        É concedida permissão para baixar temporariamente uma cópia dos materiais na plataforma VITRU IA apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título. Sob esta licença, você não pode:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Modificar ou copiar os materiais ou algoritmos de cálculo.</li>
                        <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública sem autorização.</li>
                        <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no sistema VITRU IA.</li>
                        <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
                    </ul>
                </LegalSection>

                <LegalSection icon={Scale} title="4. Precisão das Avaliações">
                    <p>
                        A precisão dos resultados gerados (Body Fat %, Shape-V, Simetria) depende inteiramente da precisão das medidas inseridas pelo usuário ou profissional. O VITRU IA não se responsabiliza por resultados imprecisos decorrentes de erros de medição antropométrica.
                    </p>
                </LegalSection>

                <LegalSection icon={ShieldCheck} title="5. Contas de Personal e Academia">
                    <p>
                        Profissionais e estabelecimentos que utilizam a plataforma para gerir alunos são responsáveis por garantir que possuem a autorização necessária de seus clientes para processar seus dados biométricos no sistema VITRU IA.
                    </p>
                </LegalSection>

                <LegalSection icon={AlertTriangle} title="6. Limitação de Responsabilidade">
                    <p>
                        Em nenhum caso o VITRU IA ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucros, ou devido a interrupção de negócios) decorrentes do uso ou da incapacidade de usar os materiais no VITRU IA.
                    </p>
                </LegalSection>

                {/* Footer info */}
                <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                    <p className="text-sm text-gray-500">
                        Estes termos podem ser atualizados periodicamente. O uso continuado da plataforma após alterações constitui aceitação dos novos termos.
                    </p>
                </div>
            </div>
        </div>
    );
};
