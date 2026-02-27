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
    Trash2,
    Phone,
    Settings
} from 'lucide-react';
import { PersonalAthlete } from '@/mocks/personal';
import { Button } from '@/components/atoms/Button/Button';
import { HeroCard } from '@/components/organisms/HeroCard';
import { HeroContent } from '@/features/dashboard/types';
import { useDataStore } from '@/stores/dataStore';
import { atletaService } from '@/services/atleta.service';
import { medidasService } from '@/services/medidas.service';

interface AthleteDetailsViewProps {
    athlete: PersonalAthlete;
    onBack: () => void;
    onNewAssessment: () => void;
    onConsultAssessment: (assessmentId: string) => void;
    hideStatusControl?: boolean;
    onDeleteAthlete?: (athleteId: string) => void;
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

const MeasurementItem = ({ label, value, unit, isEditing, onChange }: { label: string, value: number, unit: string, isEditing?: boolean, onChange?: (val: number) => void }) => (
    <div className="bg-[#0A0F1C]/50 p-3 rounded-lg border border-white/5 flex justify-between items-center group hover:bg-[#0A0F1C] transition-all">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</span>
        {isEditing ? (
            <div className="flex items-center gap-1">
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange?.(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-transparent text-right text-white font-mono font-bold outline-none border-b border-primary/50 focus:border-primary px-1"
                />
                <span className="text-[10px] text-gray-500 font-normal">{unit}</span>
            </div>
        ) : (
            <span className="text-white font-mono font-bold">
                {value} <span className="text-[10px] text-gray-500 font-normal">{unit}</span>
            </span>
        )}
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

const calculateAge = (birthDateStr?: string): number | null => {
    if (!birthDateStr) return null;
    const birth = new Date(birthDateStr);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const AthleteDetailsView: React.FC<AthleteDetailsViewProps> = ({ athlete, onBack, onNewAssessment, onConsultAssessment, hideStatusControl = false, onDeleteAthlete }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { updateAthlete } = useDataStore();
    const [openAccordion, setOpenAccordion] = useState<string | null>('basics');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initial draft from the athlete
    const [draftAthlete, setDraftAthlete] = useState<PersonalAthlete>(athlete);

    // Sync if athlete changes externally
    React.useEffect(() => {
        setDraftAthlete(athlete);
    }, [athlete]);

    if (!draftAthlete) return null;

    const latestAssessment = draftAthlete.assessments?.[0];

    const updateMeasurement = (field: any, value: number) => {
        if (!latestAssessment) return;
        setDraftAthlete(prev => {
            const newAssessments = [...prev.assessments];
            newAssessments[0] = {
                ...newAssessments[0],
                measurements: { ...newAssessments[0].measurements, [field]: value }
            };
            return { ...prev, assessments: newAssessments };
        });
    };

    const updateSkinfold = (field: any, value: number) => {
        if (!latestAssessment) return;
        setDraftAthlete(prev => {
            const newAssessments = [...prev.assessments];
            newAssessments[0] = {
                ...newAssessments[0],
                skinfolds: { ...newAssessments[0].skinfolds, [field]: value }
            };
            return { ...prev, assessments: newAssessments };
        });
    };

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

    const handleSave = async () => {
        setIsSaving(true);
        // Atualiza localmente o zustand store para reatividade imediata
        updateAthlete(draftAthlete);

        try {
            // 1. Informações Básicas do Atleta
            await atletaService.atualizar(draftAthlete.id, {
                nome: draftAthlete.name,
                email: draftAthlete.email,
                telefone: draftAthlete.phone || null,
                status: draftAthlete.status === 'inactive' ? 'INATIVO' : 'ATIVO',
            });

            // 2. Ficha do Atleta (Gênero e medidas fixas)
            await atletaService.atualizarFicha(draftAthlete.id, {
                sexo: draftAthlete.gender === 'FEMALE' ? 'F' : 'M',
                data_nascimento: draftAthlete.birthDate || null,
                ...(latestAssessment ? {
                    altura: latestAssessment.measurements.height,
                    pelve: latestAssessment.measurements.pelvis,
                    punho: latestAssessment.measurements.wristRight,
                    tornozelo: latestAssessment.measurements.ankleRight,
                    joelho: latestAssessment.measurements.kneeRight,
                } : {})
            });

            // 3. Atualizar as Medidas Correntes e Dobras Cutâneas
            if (latestAssessment) {
                await medidasService.atualizar(latestAssessment.id, {
                    peso: latestAssessment.measurements.weight,
                    pescoco: latestAssessment.measurements.neck,
                    ombros: latestAssessment.measurements.shoulders,
                    peitoral: latestAssessment.measurements.chest,
                    cintura: latestAssessment.measurements.waist,
                    quadril: latestAssessment.measurements.hips,
                    braco_direito: latestAssessment.measurements.armRight,
                    braco_esquerdo: latestAssessment.measurements.armLeft,
                    antebraco_direito: latestAssessment.measurements.forearmRight,
                    antebraco_esquerdo: latestAssessment.measurements.forearmLeft,
                    coxa_direita: latestAssessment.measurements.thighRight,
                    coxa_esquerda: latestAssessment.measurements.thighLeft,
                    panturrilha_direita: latestAssessment.measurements.calfRight,
                    panturrilha_esquerda: latestAssessment.measurements.calfLeft,
                    dobra_tricipital: latestAssessment.skinfolds.tricep,
                    dobra_subescapular: latestAssessment.skinfolds.subscapular,
                    dobra_peitoral: latestAssessment.skinfolds.chest,
                    dobra_axilar_media: latestAssessment.skinfolds.axillary,
                    dobra_suprailiaca: latestAssessment.skinfolds.suprailiac,
                    dobra_abdominal: latestAssessment.skinfolds.abdominal,
                    dobra_coxa: latestAssessment.skinfolds.thigh,
                });
            }
        } catch (error) {
            console.error('Falha ao atualizar dados do atleta no banco:', error);
        } finally {
            setIsSaving(false);
            setIsEditing(false);
        }
    };

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
                                    {draftAthlete.name}
                                </h1>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${draftAthlete.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]' :
                                    draftAthlete.status === 'attention' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                                        draftAthlete.status === 'archived' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                                            'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                    }`}>
                                    {draftAthlete.status === 'active' ? 'ATIVO' : draftAthlete.status === 'attention' ? 'ATENÇÃO' : draftAthlete.status === 'archived' ? 'ARQUIVADO' : 'INATIVO'}
                                </span>
                            </div>
                            <p className="text-gray-400 mt-2 font-light flex items-center gap-2">
                                <Activity size={14} className="text-primary/50" />
                                Visualização detalhada do perfil e histórico do atleta.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {draftAthlete.status === 'archived' && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                                <Archive size={16} />
                                Perfil Arquivado
                            </div>
                        )}
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
                                    <button
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                        disabled={isSaving}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isEditing
                                            ? 'bg-primary text-background-dark border-primary shadow-[0_0_15px_rgba(0,201,167,0.3)]'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
                                        {isEditing ? (isSaving ? 'Salvando...' : 'Salvar') : 'Editar'}
                                    </button>
                                    {!hideStatusControl && (
                                        <StatusSelector
                                            status={draftAthlete.status}
                                            onChange={(s) => setDraftAthlete({ ...draftAthlete, status: s as any })}
                                        />
                                    )}
                                    {onDeleteAthlete && (
                                        <button
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-xs font-bold uppercase tracking-widest"
                                        >
                                            <Trash2 size={16} />
                                            Excluir
                                        </button>
                                    )}
                                </div>
                            }
                        />
                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    {/* Linha 1: Nome, Email, Telefone */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Nome Completo</label>
                                            <input
                                                value={draftAthlete.name}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, name: e.target.value })}
                                                className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
                                            />
                                        </div>
                                        <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Email para Contato</label>
                                            <input
                                                type="email"
                                                value={draftAthlete.email}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, email: e.target.value })}
                                                className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
                                            />
                                        </div>
                                        <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Telefone</label>
                                            <input
                                                type="tel"
                                                value={draftAthlete.phone || ''}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, phone: e.target.value })}
                                                placeholder="(00) 00000-0000"
                                                className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1 placeholder-gray-600"
                                            />
                                        </div>
                                    </div>
                                    {/* Linha 2: Gênero, Data de Nascimento, Vinculado desde */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Gênero</label>
                                            <select
                                                className="bg-transparent text-white font-semibold outline-none cursor-pointer py-1"
                                                value={draftAthlete.gender}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, gender: e.target.value as any })}
                                            >
                                                <option value="MALE" className="bg-[#131B2C]">Masculino</option>
                                                <option value="FEMALE" className="bg-[#131B2C]">Feminino</option>
                                                <option value="OTHER" className="bg-[#131B2C]">Outro</option>
                                            </select>
                                        </div>
                                        <div className="bg-[#0A0F1C] p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Data de Nascimento</label>
                                            <input
                                                type="date"
                                                value={draftAthlete.birthDate || ''}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, birthDate: e.target.value })}
                                                className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1 [color-scheme:dark]"
                                            />
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
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Linha 1: Nome, Email, Telefone */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InfoCard icon={User} label="Nome Completo" value={draftAthlete.name} />
                                        <InfoCard icon={Mail} label="Email para Contato" value={draftAthlete.email} />
                                        <InfoCard icon={Phone} label="Telefone" value={draftAthlete.phone || 'Não informado'} />
                                    </div>
                                    {/* Linha 2: Gênero, Data de Nascimento, Vinculado desde */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <InfoCard icon={User} label="Gênero" value={draftAthlete.gender === 'MALE' ? 'Masculino' : draftAthlete.gender === 'FEMALE' ? 'Feminino' : 'Outro'} />
                                        <InfoCard icon={Calendar} label="Data de Nascimento" value={draftAthlete.birthDate ? new Date(draftAthlete.birthDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Não informada'} />
                                        <InfoCard icon={Calendar} label="Vinculado desde" value={new Date(draftAthlete.linkedSince).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
                                    </div>
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
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <MeasurementItem label="Peso" value={latestAssessment.measurements.weight} unit="kg" isEditing={isEditing} onChange={(v) => updateMeasurement('weight', v)} />
                                        <MeasurementItem label="Altura" value={latestAssessment.measurements.height} unit="cm" isEditing={isEditing} onChange={(v) => updateMeasurement('height', v)} />
                                        <MeasurementItem
                                            label="Idade"
                                            value={calculateAge(draftAthlete.birthDate) ?? 0}
                                            unit="anos"
                                        />
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
                                                    <MeasurementItem label="Pescoço" value={latestAssessment.measurements.neck} unit="cm" isEditing={isEditing} onChange={(v) => updateMeasurement('neck', v)} />
                                                    <MeasurementItem label="Ombros" value={latestAssessment.measurements.shoulders} unit="cm" isEditing={isEditing} onChange={(v) => updateMeasurement('shoulders', v)} />
                                                    <MeasurementItem label="Peitoral" value={latestAssessment.measurements.chest} unit="cm" isEditing={isEditing} onChange={(v) => updateMeasurement('chest', v)} />
                                                    <MeasurementItem label="Pelve" value={latestAssessment.measurements.pelvis} unit="cm" isEditing={isEditing} onChange={(v) => updateMeasurement('pelvis', v)} />
                                                    <MeasurementItem label="Cintura" value={latestAssessment.measurements.waist} unit="cm" isEditing={isEditing} onChange={(v) => updateMeasurement('waist', v)} />
                                                    <MeasurementItem label="Quadril" value={latestAssessment.measurements.hips} unit="cm" isEditing={isEditing} onChange={(v) => updateMeasurement('hips', v)} />
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
                                                        { label: 'Braço', left: latestAssessment.measurements.armLeft, right: latestAssessment.measurements.armRight, kLeft: 'armLeft', kRight: 'armRight' },
                                                        { label: 'Antebraço', left: latestAssessment.measurements.forearmLeft, right: latestAssessment.measurements.forearmRight, kLeft: 'forearmLeft', kRight: 'forearmRight' },
                                                        { label: 'Pulso', left: latestAssessment.measurements.wristLeft, right: latestAssessment.measurements.wristRight, kLeft: 'wristLeft', kRight: 'wristRight' },
                                                        { label: 'Coxa', left: latestAssessment.measurements.thighLeft, right: latestAssessment.measurements.thighRight, kLeft: 'thighLeft', kRight: 'thighRight' },
                                                        { label: 'Joelho', left: latestAssessment.measurements.kneeLeft, right: latestAssessment.measurements.kneeRight, kLeft: 'kneeLeft', kRight: 'kneeRight' },
                                                        { label: 'Panturrilha', left: latestAssessment.measurements.calfLeft, right: latestAssessment.measurements.calfRight, kLeft: 'calfLeft', kRight: 'calfRight' },
                                                        { label: 'Tornozelo', left: latestAssessment.measurements.ankleLeft, right: latestAssessment.measurements.ankleRight, kLeft: 'ankleLeft', kRight: 'ankleRight' },
                                                    ].map((item, idx) => (
                                                        <div key={idx} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                                            <div className="bg-white/5 px-2 py-1 rounded text-right text-white font-mono text-sm">
                                                                {isEditing ? (
                                                                    <input type="number" value={item.left || ''} onChange={(e) => updateMeasurement(item.kLeft as any, parseFloat(e.target.value) || 0)} className="w-16 bg-transparent text-right outline-none border-b border-primary/50 focus:border-primary px-1" />
                                                                ) : item.left}
                                                            </div>
                                                            <div className="text-[10px] font-medium text-gray-400 w-24 text-center">{item.label}</div>
                                                            <div className="bg-white/5 px-2 py-1 rounded text-left text-white font-mono text-sm">
                                                                {isEditing ? (
                                                                    <input type="number" value={item.right || ''} onChange={(e) => updateMeasurement(item.kRight as any, parseFloat(e.target.value) || 0)} className="w-16 bg-transparent text-left outline-none border-b border-primary/50 focus:border-primary px-1" />
                                                                ) : item.right}
                                                            </div>
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
                                        <MeasurementItem label="Tríceps" value={latestAssessment.skinfolds.tricep} unit="mm" isEditing={isEditing} onChange={(v) => updateSkinfold('tricep', v)} />
                                        <MeasurementItem label="Subscap." value={latestAssessment.skinfolds.subscapular} unit="mm" isEditing={isEditing} onChange={(v) => updateSkinfold('subscapular', v)} />
                                        <MeasurementItem label="Peitoral" value={latestAssessment.skinfolds.chest} unit="mm" isEditing={isEditing} onChange={(v) => updateSkinfold('chest', v)} />
                                        <MeasurementItem label="Axilar M." value={latestAssessment.skinfolds.axillary} unit="mm" isEditing={isEditing} onChange={(v) => updateSkinfold('axillary', v)} />
                                        <MeasurementItem label="Supra-il." value={latestAssessment.skinfolds.suprailiac} unit="mm" isEditing={isEditing} onChange={(v) => updateSkinfold('suprailiac', v)} />
                                        <MeasurementItem label="Abdom." value={latestAssessment.skinfolds.abdominal} unit="mm" isEditing={isEditing} onChange={(v) => updateSkinfold('abdominal', v)} />
                                        <MeasurementItem label="Coxa" value={latestAssessment.skinfolds.thigh} unit="mm" isEditing={isEditing} onChange={(v) => updateSkinfold('thigh', v)} />
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
                                                    <span className="text-primary font-bold">{typeof (ass.score ?? athlete.score) === 'number' ? Math.round((ass.score ?? athlete.score ?? 0) * 10) / 10 : 0}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-white font-mono text-xs">{typeof (ass.ratio ?? athlete.ratio) === 'number' ? Math.round((ass.ratio ?? athlete.ratio ?? 0) * 100) / 100 : 0}</span>
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

                    {/* Ações do Atleta */}
                    <div className="pt-6">
                        <SectionHeader
                            icon={Settings}
                            title="O que você quer fazer?"
                            subtitle="Gerencie avaliações e configurações do perfil"
                        />
                        <div className="h-px w-full bg-white/10 mb-6" />
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => { }}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/30 transition-all text-xs font-bold uppercase tracking-wider"
                                >
                                    <Clock size={16} />
                                    Agendar Avaliação
                                </button>
                                <button
                                    onClick={onNewAssessment}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl text-primary hover:bg-primary/20 hover:border-primary/50 transition-all text-xs font-bold uppercase tracking-wider"
                                >
                                    <Activity size={16} />
                                    Nova Avaliação IA
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                    disabled={isSaving}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-bold text-xs uppercase tracking-wider ${isEditing
                                        ? 'bg-primary text-background-dark border-primary shadow-[0_0_15px_rgba(0,201,167,0.3)]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                                        } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isEditing ? <Check size={16} /> : <Edit3 size={16} />}
                                    {isEditing ? (isSaving ? 'Salvando...' : 'Salvar') : 'Editar'}
                                </button>
                                {!hideStatusControl && (
                                    <StatusSelector
                                        status={draftAthlete.status}
                                        onChange={(s) => setDraftAthlete({ ...draftAthlete, status: s as any })}
                                    />
                                )}
                                {onDeleteAthlete && (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all text-xs font-bold uppercase tracking-widest"
                                    >
                                        <Trash2 size={16} />
                                        Excluir
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#131B2C] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="text-red-400" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-wide">Excluir Aluno</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Tem certeza que deseja excluir <span className="text-white font-bold">{draftAthlete.name}</span>?
                                <br />
                                <span className="text-red-400 font-medium">Esta ação não pode ser desfeita.</span>
                            </p>
                            <div className="flex items-center gap-3 w-full mt-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={async () => {
                                        setIsDeleting(true);
                                        try {
                                            await onDeleteAthlete?.(draftAthlete.id);
                                        } finally {
                                            setIsDeleting(false);
                                            setShowDeleteConfirm(false);
                                        }
                                    }}
                                    disabled={isDeleting}
                                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
