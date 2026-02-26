import React, { useState } from 'react';
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    ChevronDown,
    ChevronUp,
    Scale,
    Activity,
    Ruler,
    Layers,
    GitCommit,
    Eye,
    ExternalLink,
    Clock,
    Edit3,
    Check,
    X,
    Archive,
    Trash2
} from 'lucide-react';
import { PersonalAthlete } from '@/mocks/personal';
import { Button } from '@/components/atoms/Button/Button';
import { HeroCard } from '@/components/organisms/HeroCard';
import { HeroContent } from '@/features/dashboard/types';

interface AthleteDetailsViewProps {
    athlete: PersonalAthlete;
    onBack: () => void;
    onNewAssessment: () => void;
    onConsultAssessment: (assessmentId: string) => void;
    hideStatusControl?: boolean;
}

const SectionHeader = ({ icon: Icon, title, subtitle, rightElement }: { icon: any, title: string, subtitle: string, rightElement?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-8 group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all shadow-lg backdrop-blur-sm">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight leading-none mb-1">{title}</h2>
                <p className="text-gray-500 text-sm font-medium">{subtitle}</p>
            </div>
        </div>
        {rightElement}
    </div>
);

const InfoCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-white/5 flex items-center gap-4 group hover:border-primary/30 transition-all">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
            <p className="text-white font-semibold">{value}</p>
        </div>
    </div>
);

const MeasurementItem = ({ label, value, unit }: { label: string, value: number, unit: string }) => (
    <div className="bg-[#0A0F1C]/50 p-3 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-[#0A0F1C] transition-all">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</span>
        <span className="text-white font-mono font-bold">
            {value} <span className="text-[10px] text-gray-500 font-normal">{unit}</span>
        </span>
    </div>
);

const Accordion = ({ title, icon: Icon, children, isOpen, onToggle }: { title: string, icon: any, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#131B2C] shadow-lg transition-all">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg transition-all ${isOpen ? 'bg-primary text-[#0A0F1C]' : 'bg-white/5 text-gray-400'}`}>
                    <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h3>
            </div>
            {isOpen ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-500 group-hover:text-white" />}
        </button>
        {isOpen && (
            <div className="p-6 pt-0 border-t border-white/5 animate-fade-in">
                {children}
            </div>
        )}
    </div>
);

const StatusSelector = ({ status, onChange }: { status: string, onChange: (s: string) => void }) => (
    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
        {[
            { id: 'active', label: 'Ativo', icon: Check, color: 'text-green-500' },
            { id: 'inactive', label: 'Inativo', icon: X, color: 'text-gray-400' },
            { id: 'archived', label: 'Arquivar', icon: Archive, color: 'text-amber-500' }
        ].map((s) => (
            <button
                key={s.id}
                onClick={() => onChange(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${status === s.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
            >
                <s.icon size={12} className={status === s.id ? s.color : ''} />
                {s.label}
            </button>
        ))}
    </div>
);

export const AthleteDetailsView: React.FC<AthleteDetailsViewProps> = ({ athlete, onBack, onNewAssessment, onConsultAssessment, hideStatusControl = false }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>('basics');
    const [isEditing, setIsEditing] = useState(false);
    const [athleteStatus, setAthleteStatus] = useState(athlete.status);

    const latestAssessment = athlete.assessments?.[0];

    const heroContent: HeroContent = {
        badge: { label: 'FICHA TÉCNICA', variant: 'primary' },
        date: new Date(),
        title: 'MANTENHA SEUS \n DADOS ATUALIZADOS',
        description: 'Seus registros de medidas e fotos são a base para o uso da Inteligência Artificial. Acompanhe sua evolução e alcance seus objetivos com precisão.',
        cta: {
            label: 'Nova Avaliação IA',
            href: '#',
            onClick: onNewAssessment
        },
        image: {
            src: '/images/athlete-measurement-hero.png',
            alt: 'Hero Banner',
            position: 'background'
        }
    };

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    if (!athlete) return null;

    return (
        <div className="flex-1 p-4 md:p-8 flex flex-col w-full h-full overflow-y-auto custom-scrollbar animate-fade-in bg-background-dark">
            <div className="max-w-7xl mx-auto flex flex-col gap-10 pb-20 w-full font-sans">

                {/* Header da Página */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={onBack}
                            className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-primary/50 transition-all group"
                        >
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
                                    {athlete.name}
                                </h1>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${athleteStatus === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                                    athleteStatus === 'attention' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                                        athleteStatus === 'archived' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                                            'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                    }`}>
                                    {athleteStatus === 'active' ? 'ATIVO' : athleteStatus === 'attention' ? 'ATENÇÃO' : athleteStatus === 'archived' ? 'ARQUIVADO' : 'INATIVO'}
                                </span>
                            </div>
                            <p className="text-gray-400 mt-2 font-light flex items-center gap-2">
                                <Activity size={14} className="text-primary/50" />
                                Visualização detalhada do perfil e histórico do atleta.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {athleteStatus === 'archived' && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                                <Archive size={16} />
                                Perfil Arquivado
                            </div>
                        )}
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-white/10 hover:border-white/20 px-6"
                            onClick={() => {
                                setIsEditing(!isEditing);
                            }}
                        >
                            <Edit3 size={18} />
                            <span className="font-bold uppercase tracking-wider text-xs">
                                {isEditing ? 'SALVAR ATLETA' : 'EDITAR ATLETA'}
                            </span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-white/10 hover:border-white/20 px-6"
                            onClick={() => { }}
                        >
                            <Clock size={18} />
                            <span className="font-bold uppercase tracking-wider text-xs">AGENDAR AVALIAÇÃO</span>
                        </Button>
                        <Button
                            variant="primary"
                            className="flex items-center gap-2 bg-primary text-background-dark hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,201,167,0.3)] px-6"
                            onClick={onNewAssessment}
                        >
                            <Activity size={18} />
                            <span className="font-bold uppercase tracking-wider text-xs">NOVA AVALIAÇÃO IA</span>
                        </Button>
                    </div>
                </div>

                <div className="h-px w-full bg-white/10" />

                {/* Hero Banner Section */}
                <HeroCard content={heroContent} />

                <div className="space-y-12">

                    {/* Section 1: Dados Básicos */}
                    <div className="pt-4">
                        <SectionHeader
                            icon={User}
                            title="Dados Básicos"
                            subtitle="Informações fundamentais de identificação do atleta"
                            rightElement={
                                <div className="flex items-center gap-3">
                                    {!hideStatusControl && (
                                        <StatusSelector
                                            status={athleteStatus}
                                            onChange={(s) => setAthleteStatus(s as any)}
                                        />
                                    )}
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isEditing
                                            ? 'bg-primary text-background-dark border-primary shadow-[0_0_15px_rgba(0,201,167,0.3)]'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                                            }`}
                                    >
                                        {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
                                        {isEditing ? 'Salvar' : 'Editar'}
                                    </button>
                                </div>
                            }
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {isEditing ? (
                                <>
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Nome Completo</label>
                                        <input
                                            defaultValue={athlete.name}
                                            className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
                                        />
                                    </div>
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Email para Contato</label>
                                        <input
                                            defaultValue={athlete.email}
                                            className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
                                        />
                                    </div>
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Gênero</label>
                                        <select className="bg-transparent text-white font-semibold outline-none cursor-pointer py-1">
                                            <option value="MALE" className="bg-[#131B2C]">Masculino</option>
                                            <option value="FEMALE" className="bg-[#131B2C]">Feminino</option>
                                            <option value="OTHER" className="bg-[#131B2C]">Outro</option>
                                        </select>
                                    </div>
                                    <div className="bg-[#0A0F1C] p-4 rounded-xl border border-white/5 opacity-50 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vinculado desde</p>
                                            <p className="text-white/60 font-semibold">{new Date(athlete.linkedSince).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <InfoCard icon={User} label="Nome Completo" value={athlete.name} />
                                    <InfoCard icon={Mail} label="Email para Contato" value={athlete.email} />
                                    <InfoCard icon={User} label="Gênero" value={athlete.gender === 'MALE' ? 'Masculino' : athlete.gender === 'FEMALE' ? 'Feminino' : 'Outro'} />
                                    <InfoCard icon={Calendar} label="Vinculado desde" value={new Date(athlete.linkedSince).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Últimas Medidas (Accordions) */}
                    <div className="pt-6">
                        <SectionHeader
                            icon={Activity}
                            title="Últimas Medidas"
                            subtitle="Registros antropométricos mais recentes capturados"
                        />

                        <div className="space-y-4">
                            {/* Accordion 1: Medidas Básicas */}
                            <Accordion
                                title="Medidas Básicas"
                                icon={Scale}
                                isOpen={openAccordion === 'basics'}
                                onToggle={() => toggleAccordion('basics')}
                            >
                                {latestAssessment ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <MeasurementItem label="Peso" value={latestAssessment.measurements.weight} unit="kg" />
                                        <MeasurementItem label="Altura" value={latestAssessment.measurements.height} unit="cm" />
                                        <MeasurementItem
                                            label="Idade"
                                            value={athlete.name === 'Leonardo Schiwetzer' ? 48 : 25}
                                            unit="anos"
                                        />
                                        <MeasurementItem label="Score Atual" value={athlete.score} unit="pts" />
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">Nenhuma avaliação realizada ainda.</p>
                                )}
                            </Accordion>

                            {/* Accordion 2: Medidas Lineares */}
                            <Accordion
                                title="Medidas Lineares"
                                icon={Ruler}
                                isOpen={openAccordion === 'lineares'}
                                onToggle={() => toggleAccordion('lineares')}
                            >
                                {latestAssessment ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                            {/* Tronco */}
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Layers size={12} /> Tronco
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <MeasurementItem label="Pescoço" value={latestAssessment.measurements.neck} unit="cm" />
                                                    <MeasurementItem label="Ombros" value={latestAssessment.measurements.shoulders} unit="cm" />
                                                    <MeasurementItem label="Peitoral" value={latestAssessment.measurements.chest} unit="cm" />
                                                    <MeasurementItem label="Pelve" value={latestAssessment.measurements.pelvis} unit="cm" />
                                                    <MeasurementItem label="Cintura" value={latestAssessment.measurements.waist} unit="cm" />
                                                    <MeasurementItem label="Quadril" value={latestAssessment.measurements.hips} unit="cm" />
                                                </div>
                                            </div>

                                            {/* Simetria */}
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <GitCommit size={12} /> Simetria de Membros
                                                </h4>
                                                <div className="bg-[#0A0F1C] rounded-xl border border-white/5 p-4 space-y-3">
                                                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-2">
                                                        <span className="text-[8px] font-bold text-primary uppercase text-right">Esq (cm)</span>
                                                        <span className="text-[8px] font-bold text-gray-600 uppercase text-center w-24">Região</span>
                                                        <span className="text-[8px] font-bold text-primary uppercase text-left">Dir (cm)</span>
                                                    </div>
                                                    {[
                                                        { label: 'Braço', left: latestAssessment.measurements.armLeft, right: latestAssessment.measurements.armRight },
                                                        { label: 'Antebraço', left: latestAssessment.measurements.forearmLeft, right: latestAssessment.measurements.forearmRight },
                                                        { label: 'Pulso', left: latestAssessment.measurements.wristLeft, right: latestAssessment.measurements.wristRight },
                                                        { label: 'Coxa', left: latestAssessment.measurements.thighLeft, right: latestAssessment.measurements.thighRight },
                                                        { label: 'Joelho', left: latestAssessment.measurements.kneeLeft, right: latestAssessment.measurements.kneeRight },
                                                        { label: 'Panturrilha', left: latestAssessment.measurements.calfLeft, right: latestAssessment.measurements.calfRight },
                                                        { label: 'Tornozelo', left: latestAssessment.measurements.ankleLeft, right: latestAssessment.measurements.ankleRight },
                                                    ].map((item, idx) => (
                                                        <div key={idx} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                                            <div className="bg-white/5 px-2 py-1 rounded text-right text-white font-mono text-sm">{item.left}</div>
                                                            <div className="text-[10px] font-medium text-gray-400 w-24 text-center">{item.label}</div>
                                                            <div className="bg-white/5 px-2 py-1 rounded text-left text-white font-mono text-sm">{item.right}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">Nenhuma avaliação realizada ainda.</p>
                                )}
                            </Accordion>

                            {/* Accordion 3: Dobras Cutâneas */}
                            <Accordion
                                title="Dobras Cutâneas"
                                icon={Activity}
                                isOpen={openAccordion === 'dobras'}
                                onToggle={() => toggleAccordion('dobras')}
                            >
                                {latestAssessment ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                        <MeasurementItem label="Tríceps" value={latestAssessment.skinfolds.tricep} unit="mm" />
                                        <MeasurementItem label="Subscap." value={latestAssessment.skinfolds.subscapular} unit="mm" />
                                        <MeasurementItem label="Peitoral" value={latestAssessment.skinfolds.chest} unit="mm" />
                                        <MeasurementItem label="Axilar M." value={latestAssessment.skinfolds.axillary} unit="mm" />
                                        <MeasurementItem label="Supra-il." value={latestAssessment.skinfolds.suprailiac} unit="mm" />
                                        <MeasurementItem label="Abdom." value={latestAssessment.skinfolds.abdominal} unit="mm" />
                                        <MeasurementItem label="Coxa" value={latestAssessment.skinfolds.thigh} unit="mm" />
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">Nenhuma avaliação realizada ainda.</p>
                                )}
                            </Accordion>
                        </div>
                    </div>

                    {/* Section 3: Lista de Avaliações */}
                    <div className="pt-6">
                        <SectionHeader
                            icon={Clock}
                            title="Histórico de Avaliações"
                            subtitle="Linha do tempo de todas as medições realizadas"
                            rightElement={
                                <span className="text-gray-500 text-sm font-medium">
                                    {athlete.assessments?.length || 0} registros encontrados
                                </span>
                            }
                        />

                        <div className="bg-[#131B2C] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10">
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data da Avaliação</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Score IA</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Ratio</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Peso</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {athlete.assessments?.map((ass, idx) => (
                                            <tr key={ass.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded bg-white/5 text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-all">
                                                            <Calendar size={14} />
                                                        </div>
                                                        <span className="text-sm font-medium text-white">
                                                            {new Date(ass.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-primary font-bold">{ass.score || athlete.score}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-white font-mono text-xs">{ass.ratio || athlete.ratio}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-300">
                                                    {ass.measurements.weight}kg
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => onConsultAssessment(ass.id)}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase ml-auto"
                                                    >
                                                        <Eye size={16} />
                                                        <span className="hidden md:inline">Consultar</span>
                                                        <ExternalLink size={12} className="opacity-50" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
