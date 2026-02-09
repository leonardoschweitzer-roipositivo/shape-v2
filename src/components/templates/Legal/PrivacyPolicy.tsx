import React from 'react';
import { Shield, Lock, Eye, Server, UserCheck, ArrowLeft } from 'lucide-react';

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

interface PrivacyPolicyProps {
    onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
                        Política de <span className="text-primary">Privacidade</span>
                    </h1>
                    <p className="text-gray-500 font-light max-w-2xl">
                        Sua privacidade é nossa prioridade fundamental. Esta política detalha como coletamos, usamos e protegemos seus dados biométricos e pessoais no VITRU IA.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs text-gray-600 font-mono uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Última atualização: 08 de Fevereiro de 2026
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-primary/20 via-white/5 to-transparent mb-16" />

                {/* Content Sections */}
                <LegalSection icon={Shield} title="Compromisso com Seus Dados">
                    <p>
                        No VITRU IA, entendemos que seus dados biométricos são extremamente pessoais e sensíveis. Nosso compromisso é tratar cada centímetro, cada percentual de gordura e cada métrica de simetria com o maior nível de segurança e discrição possível.
                    </p>
                    <p>
                        Trabalhamos em total conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados)</strong>, garantindo que você tenha controle total sobre suas informações a qualquer momento.
                    </p>
                </LegalSection>

                <LegalSection icon={Eye} title="Coleta de Informações">
                    <p>
                        Coletamos apenas as informações estritamente necessárias para realizar a avaliação estética inteligente:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Dados Antropométricos:</strong> Medidas de circunferências (ombro, cintura, braço, etc.), altura, peso e dobras cutâneas.</li>
                        <li><strong>Informações de Perfil:</strong> Nome, idade, gênero e objetivos estéticos.</li>
                        <li><strong>Dados de Uso:</strong> Interações com o Coach IA e evolução temporal das suas métricas.</li>
                    </ul>
                </LegalSection>

                <LegalSection icon={Server} title="Uso e Processamento">
                    <p>
                        Seus dados são processados por nossos algoritmos de Inteligência Artificial para:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Calcular seu <strong>Índice Shape-V</strong> e pontuação de simetria.</li>
                        <li>Gerar diagnósticos estéticos personalizados e recomendações de treino/dieta.</li>
                        <li>Monitorar sua evolução em direção ao <strong>Golden Ratio</strong> ou outros padrões de referência selecionados.</li>
                    </ul>
                </LegalSection>

                <LegalSection icon={Lock} title="Segurança e Armazenamento">
                    <p>
                        Utilizamos criptografia de ponta a ponta (AES-256) para armazenar suas medidas. Seus dados são isolados e nunca são compartilhados com terceiros sem sua autorização explícita.
                    </p>
                    <p>
                        Se você estiver vinculado a um Personal Trainer ou Academia, eles terão acesso apenas aos dados necessários para o acompanhamento do seu progresso, conforme configurado em suas <strong>Configurações de Privacidade</strong>.
                    </p>
                </LegalSection>

                <LegalSection icon={UserCheck} title="Seus Direitos">
                    <p>
                        Você é o dono dos seus dados. A qualquer momento, você pode:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Solicitar a exportação completa de todos os seus dados em formato JSON ou CSV.</li>
                        <li>Solicitar a exclusão permanente de sua conta e de todo o histórico de medidas.</li>
                        <li>Revogar o acesso de um Personal ou Academia aos seus dados.</li>
                    </ul>
                </LegalSection>

                {/* Footer info */}
                <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                    <p className="text-sm text-gray-500">
                        Dúvidas sobre como tratamos seus dados?
                        <br />
                        Entre em contato com nosso DPO em <span className="text-primary hover:underline cursor-pointer">privacy@vitruia.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
};
