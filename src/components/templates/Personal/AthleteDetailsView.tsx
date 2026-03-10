// @ts-nocheck
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
    Settings,
    ClipboardList,
    History,
    Sparkles,
    Dumbbell,
    UtensilsCrossed,
    Loader2,
    Link2,
    Copy,
    Share2,
    CheckCircle,
    Smartphone,
} from 'lucide-react';
import { PersonalAthlete } from '@/mocks/personal';
import { Button } from '@/components/atoms/Button/Button';
import { HeroCard } from '@/components/organisms/HeroCard';
import { HeroContent } from '@/features/dashboard/types';
import { useDataStore } from '@/stores/dataStore';
import { atletaService } from '@/services/atleta.service';
import { medidasService } from '@/services/medidas.service';
import { supabase } from '@/services/supabase';
import { portalService } from '@/services/portalService';
import { AthleteContextSection } from './AthleteContextSection';
import type { ContextoAtleta } from './AthleteContextSection';
import { DEFAULT_ATHLETE_PASSWORD } from '@/components/templates/StudentRegistration/StudentRegistration';

interface AthleteDetailsViewProps {
    athlete: PersonalAthlete;
    onBack: () => void;
    onNewAssessment: () => void;
    onConsultAssessment: (assessmentId: string) => void;
    hideStatusControl?: boolean;
    onDeleteAthlete?: (athleteId: string) => void;
    onViewPlan?: (plano: Record<string, unknown>) => void;
}


// ═══════════════════════════════════════════════════════════
// EXTRACTED SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════
import { SectionHeader, InfoCard, MeasurementItem, Accordion, StatusSelector, calculateAge } from './athlete-details/AthleteDetailsSections';


export const AthleteDetailsView: React.FC<AthleteDetailsViewProps> = ({ athlete, onBack, onNewAssessment, onConsultAssessment, hideStatusControl = false, onDeleteAthlete, onViewPlan }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { updateAthlete } = useDataStore();
    const [openAccordion, setOpenAccordion] = useState<string | null>('basics');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [evolutionPlans, setEvolutionPlans] = useState<Record<string, unknown>[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(false);

    // Portal do Aluno
    const [showPortalModal, setShowPortalModal] = useState(false);
    const [portalLoading, setPortalLoading] = useState(false);
    const [portalLink, setPortalLink] = useState<string | null>(null);
    const [portalCopied, setPortalCopied] = useState(false);
    const [portalError, setPortalError] = useState<string | null>(null);

    // Fetch evolution plans (diagnosticos + relacionados)
    const fetchPlans = React.useCallback(async () => {
        setLoadingPlans(true);
        try {
            const { data: diagnosticos, error } = await supabase
                .from('diagnosticos')
                .select(`
                    *,
                    planos_treino (id, status, created_at, dados),
                    planos_dieta (id, status, created_at, dados)
                `)
                .eq('atleta_id', athlete.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEvolutionPlans(diagnosticos || []);
        } catch (err) {
            console.error('Erro ao buscar planos de evolução:', err);
        } finally {
            setLoadingPlans(false);
        }
    }, [athlete.id]);

    React.useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleGeneratePortalAccess = async () => {
        setPortalLoading(true);
        setPortalError(null);
        setPortalLink(null);
        setPortalCopied(false);

        try {
            const baseUrl = window.location.origin;
            let finalLink = '';

            if (athlete.auth_user_id) {
                // Aluno já tem Auth ID: fornecer o link direto
                finalLink = `${baseUrl}/atleta`;
            } else {
                // Sessão swap para criar conta Auth para aluno antigo
                console.info('[AthleteDetails] Criando conta Auth para aluno antigo...');
                const athleteEmailTrimmed = athlete.email?.trim() || '';

                if (!athleteEmailTrimmed) {
                    throw new Error('Aluno sem email cadastrado! Edite os dados primeiro.');
                }

                const { data: { session: personalSession } } = await supabase.auth.getSession();

                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: athleteEmailTrimmed,
                    password: DEFAULT_ATHLETE_PASSWORD,
                    options: {
                        data: {
                            full_name: athlete.name.trim(),
                            role: 'ATLETA',
                        },
                    },
                });

                // Restaurar sessão
                if (personalSession) {
                    await supabase.auth.setSession({
                        access_token: personalSession.access_token,
                        refresh_token: personalSession.refresh_token,
                    });
                }

                if (signUpError) {
                    // Tratar erro comum onde conta já existe mas auth_user_id não está no bd local
                    if (signUpError.message.includes('already registered')) {
                        throw new Error('Este email já está registrado. Verifique o cadastro no banco ou no Supabase.');
                    }
                    throw new Error(signUpError.message);
                }

                if (signUpData?.user) {
                    await supabase
                        .from('atletas')
                        .update({ auth_user_id: signUpData.user.id } as Record<string, unknown>)
                        .eq('id', athlete.id);

                    // Update store locally
                    // Type bypass simply to attach auth_user_id easily
                    updateAthlete({ ...athlete, auth_user_id: signUpData.user.id } as any);
                    setDraftAthlete(prev => ({ ...prev, auth_user_id: signUpData.user.id } as any));

                    finalLink = `${baseUrl}/atleta?email=${encodeURIComponent(athleteEmailTrimmed)}&p=${encodeURIComponent(DEFAULT_ATHLETE_PASSWORD)}`;
                } else {
                    throw new Error('Falha na criação da conta.');
                }
            }

            setPortalLink(finalLink);
        } catch (err: any) {
            console.error('[AthleteDetails] Erro ao gerar acesso:', err);
            setPortalError(err.message || 'Erro ao gerar acesso.');
        } finally {
            setPortalLoading(false);
        }
    };

    const handleDeleteAssessment = async (assessmentId: string, source?: string) => {
        if (!confirm('Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.')) return;

        try {
            console.info('[AthleteDetails] 🗑️ Excluindo avaliação:', assessmentId, 'source:', source);

            if (source === 'medidas') {
                // Assessment virtual gerado a partir de medidas brutas.
                // NÃO excluímos a medida pois ela é dado base do atleta.
                alert('Esta avaliação foi gerada automaticamente a partir das medidas do atleta e não pode ser excluída individualmente. Para removê-la, exclua as medidas correspondentes na ficha do atleta.');
                return;
            }

            // Validar se o ID é um UUID real do Supabase.
            // IDs locais gerados pelo store têm formato "assessment-{timestamp}" e não são UUIDs válidos.
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(assessmentId)) {
                console.warn('[AthleteDetails] ⚠️ ID não é UUID válido (possível ID local):', assessmentId);

                // Tentar recarregar do Supabase para sincronizar IDs reais
                const { loadFromSupabase } = useDataStore.getState();
                const personalId = athlete.personalId;
                if (personalId) {
                    await loadFromSupabase(personalId);
                }

                alert('Os dados foram sincronizados. Por favor, tente excluir novamente.');
                return;
            }

            // Excluir APENAS o registro da tabela assessments.
            // As medidas (tabela medidas) são dados base do atleta e NÃO devem ser excluídas junto.
            const { error, count } = await supabase
                .from('assessments')
                .delete({ count: 'exact' })
                .eq('id', assessmentId);

            if (error) throw error;

            if (count === 0) {
                console.warn('[AthleteDetails] ⚠️ Nenhum registro deletado — ID não encontrado em assessments:', assessmentId);
                alert('Avaliação não encontrada. Pode já ter sido excluída.');
                return;
            }

            console.info('[AthleteDetails] ✅ Avaliação excluída com sucesso:', assessmentId);

            // Recarregar dados do store para refletir a exclusão
            // NOTA: Excluímos APENAS da tabela 'assessments'.
            // A tabela 'medidas' NÃO é afetada — as medidas do atleta permanecem intactas.
            const { loadFromSupabase } = useDataStore.getState();
            const personalId = athlete.personalId;
            if (personalId) {
                await loadFromSupabase(personalId);
            }
        } catch (err) {
            console.error('[AthleteDetails] ❌ Erro ao excluir avaliação:', err);
            alert('Erro ao excluir a avaliação.');
        }
    };

    const handleDeletePlano = async (planoId: string) => {
        if (!confirm('Tem certeza que deseja excluir este Plano de Evolução e todos os dados relacionados?')) return;

        try {
            // Os planos_treino e planos_dieta são salvos com atleta_id (e opcionalmente diagnostico_id).
            // O buscarPlanoTreino/buscarPlanoDieta busca por atleta_id, então é assim que existem no DB.
            // Estratégia: excluir por múltiplas vias para garantir que todos sejam removidos.

            // Buscar o plano local para pegar IDs dos filhos (se disponíveis via join)
            const plano = evolutionPlans.find(p => p.id === planoId);
            const deletePromises: Promise<unknown>[] = [];

            // 1. Delete por ID direto (dos filhos encontrados no join)
            if (plano?.planos_treino?.length > 0) {
                for (const pt of plano.planos_treino) {
                    deletePromises.push(supabase.from('planos_treino').delete().eq('id', pt.id));
                }
            }
            if (plano?.planos_dieta?.length > 0) {
                for (const pd of plano.planos_dieta) {
                    deletePromises.push(supabase.from('planos_dieta').delete().eq('id', pd.id));
                }
            }

            // 2. Delete por atleta_id (garante que registros sem diagnostico_id também sejam removidos)
            deletePromises.push(
                supabase.from('planos_treino').delete().eq('atleta_id', athlete.id)
            );
            deletePromises.push(
                supabase.from('planos_dieta').delete().eq('atleta_id', athlete.id)
            );

            // 3. Fallback: tentar por diagnostico_id
            deletePromises.push(
                supabase.from('planos_treino').delete().eq('diagnostico_id' as string, planoId)
            );
            deletePromises.push(
                supabase.from('planos_dieta').delete().eq('diagnostico_id' as string, planoId)
            );

            // Executar tudo em paralelo (allSettled = não bloqueia se um falhar)
            await Promise.allSettled(deletePromises);

            // 4. Por último, excluir o diagnóstico pai
            const { error } = await supabase.from('diagnosticos').delete().eq('id', planoId);
            if (error) throw error;

            console.info('[AthleteDetails] ✅ Plano de evolução excluído completamente:', planoId);
            fetchPlans();
        } catch (err) {
            console.error('Erro ao excluir plano:', err);
            alert('Erro ao excluir o plano.');
        }
    };

    // Initial draft from the athlete
    const [draftAthlete, setDraftAthlete] = useState<PersonalAthlete>(athlete);

    // Sync if athlete changes externally
    React.useEffect(() => {
        setDraftAthlete(athlete);
    }, [athlete]);

    if (!draftAthlete) return null;

    const latestAssessment = draftAthlete.assessments?.[0];

    const updateMeasurement = (field: string, value: number) => {
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

    const updateSkinfold = (field: string, value: number) => {
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
                contexto: draftAthlete.contexto as Record<string, unknown>,
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
                if (latestAssessment._source === 'medidas') {
                    // Atualiza registro na tabela 'medidas' (medidas brutas)
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
                } else if (latestAssessment._source === 'assessments') {
                    // Atualiza registro na tabela 'assessments' (IA Assessment)
                    // Note: Update weight and internal measurements JSONB
                    await supabase
                        .from('assessments')
                        .update({
                            weight: latestAssessment.measurements.weight,
                            height: latestAssessment.measurements.height,
                            measurements: {
                                linear: latestAssessment.measurements,
                                skinfolds: latestAssessment.skinfolds,
                            }
                        })
                        .eq('id', latestAssessment.id);
                }
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
                            className="flex items-center gap-2 border-white/10 hover:border-primary/30 hover:bg-primary/5 px-5"
                            onClick={() => {
                                setShowPortalModal(true);
                                handleGeneratePortalAccess();
                            }}
                        >
                            <Smartphone size={18} />
                            <span className="font-bold uppercase tracking-wider text-xs">Portal do Aluno</span>
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
                                            onChange={(s) => setDraftAthlete({ ...draftAthlete, status: s as string })}
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
                                        <div className="bg-background-dark p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Nome Completo</label>
                                            <input
                                                value={draftAthlete.name}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, name: e.target.value })}
                                                className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
                                            />
                                        </div>
                                        <div className="bg-background-dark p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Email para Contato</label>
                                            <input
                                                type="email"
                                                value={draftAthlete.email}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, email: e.target.value })}
                                                className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1"
                                            />
                                        </div>
                                        <div className="bg-background-dark p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
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
                                        <div className="bg-background-dark p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Gênero</label>
                                            <select
                                                className="bg-transparent text-white font-semibold outline-none cursor-pointer py-1"
                                                value={draftAthlete.gender}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, gender: e.target.value as string })}
                                            >
                                                <option value="MALE" className="bg-surface">Masculino</option>
                                                <option value="FEMALE" className="bg-surface">Feminino</option>
                                                <option value="OTHER" className="bg-surface">Outro</option>
                                            </select>
                                        </div>
                                        <div className="bg-background-dark p-4 rounded-xl border border-primary/30 flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Data de Nascimento</label>
                                            <input
                                                type="date"
                                                value={draftAthlete.birthDate || ''}
                                                onChange={e => setDraftAthlete({ ...draftAthlete, birthDate: e.target.value })}
                                                className="bg-transparent text-white font-semibold outline-none border-b border-white/10 focus:border-primary transition-colors py-1 [color-scheme:dark]"
                                            />
                                        </div>
                                        <div className="bg-background-dark p-4 rounded-xl border border-white/5 opacity-50 flex items-center gap-4">
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

                    {/* Section 1.5: Contexto do Atleta */}
                    <Accordion
                        title="Contexto"
                        icon={ClipboardList}
                        isOpen={openAccordion === 'context'}
                        onToggle={() => toggleAccordion('context')}
                    >
                        <AthleteContextSection
                            athleteId={draftAthlete.id}
                            contexto={draftAthlete.contexto || null}
                            isInsideAccordion
                            globalIsEditing={isEditing}
                            onDraftChange={(draft) => setDraftAthlete(prev => ({ ...prev, contexto: draft }))}
                            onContextoUpdated={(updatedContexto: ContextoAtleta) => {
                                setDraftAthlete(prev => ({ ...prev, contexto: updatedContexto }));
                                updateAthlete({ ...draftAthlete, contexto: updatedContexto });
                            }}
                        />
                    </Accordion>

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
                                                <div className="bg-background-dark rounded-xl border border-white/5 p-4 space-y-3">
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
                                                                    <input type="number" value={item.left || ''} onChange={(e) => updateMeasurement(item.kLeft as string, parseFloat(e.target.value) || 0)} className="w-16 bg-transparent text-right outline-none border-b border-primary/50 focus:border-primary px-1" />
                                                                ) : item.left}
                                                            </div>
                                                            <div className="text-[10px] font-medium text-gray-400 w-24 text-center">{item.label}</div>
                                                            <div className="bg-white/5 px-2 py-1 rounded text-left text-white font-mono text-sm">
                                                                {isEditing ? (
                                                                    <input type="number" value={item.right || ''} onChange={(e) => updateMeasurement(item.kRight as string, parseFloat(e.target.value) || 0)} className="w-16 bg-transparent text-left outline-none border-b border-primary/50 focus:border-primary px-1" />
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

                        <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
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
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => onConsultAssessment(ass.id)}
                                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold uppercase"
                                                        >
                                                            <Eye size={16} />
                                                            Consultar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAssessment(ass.id, (ass as Record<string, unknown>)._source)}
                                                            className="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all flex items-center gap-2 text-[10px] font-bold uppercase"
                                                        >
                                                            <Trash2 size={16} />
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Histórico de Planos de Evolução */}
                    <div className="pt-6">
                        <SectionHeader
                            icon={History}
                            title="Histórico de Planos de Evolução"
                            subtitle="Estratégias de treino e dieta geradas pelo Vitrúvio IA"
                            rightElement={
                                <span className="text-gray-500 text-sm font-medium">
                                    {evolutionPlans.length} planos encontrados
                                </span>
                            }
                        />

                        {loadingPlans ? (
                            <div className="flex items-center justify-center p-12 bg-surface border border-white/10 rounded-2xl">
                                <Loader2 className="text-primary animate-spin" size={24} />
                            </div>
                        ) : evolutionPlans.length > 0 ? (
                            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10">
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data de Criação</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Diagnóstico (ID)</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Componentes</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {evolutionPlans.map((plano) => (
                                            <tr key={plano.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-medium text-white">
                                                        {new Date(plano.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs text-gray-500 font-mono">#{plano.id.split('-')[0]}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                                                        {plano.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {plano.planos_treino?.length > 0 && (
                                                            <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-500/20 text-blue-400" title="Possui Plano de Treino">
                                                                <Dumbbell size={12} />
                                                            </div>
                                                        )}
                                                        {plano.planos_dieta?.length > 0 && (
                                                            <div className="w-6 h-6 rounded flex items-center justify-center bg-amber-500/20 text-amber-400" title="Possui Plano de Dieta">
                                                                <UtensilsCrossed size={12} />
                                                            </div>
                                                        )}
                                                        <div className="w-6 h-6 rounded flex items-center justify-center bg-primary/20 text-primary" title="Plano IA">
                                                            <Sparkles size={12} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => onViewPlan?.(plano)}
                                                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold uppercase"
                                                        >
                                                            <Eye size={16} />
                                                            Visualizar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePlano(plano.id)}
                                                            className="p-2 hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-400 transition-all flex items-center gap-2 text-[10px] font-bold uppercase"
                                                        >
                                                            <Trash2 size={16} />
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-surface border border-dashed border-white/10 rounded-2xl p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-gray-600">
                                    <History size={32} />
                                </div>
                                <h4 className="text-white font-bold uppercase tracking-wider mb-2">Nenhum Plano de Evolução</h4>
                                <p className="text-gray-500 text-sm max-w-xs mx-auto">Você ainda não gerou nenhum plano de evolução para este atleta usando a IA.</p>
                            </div>
                        )}
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
                                        onChange={(s) => setDraftAthlete({ ...draftAthlete, status: s as string })}
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
                    <div className="bg-surface border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
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
            {/* Modal: Portal do Aluno */}
            {showPortalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Smartphone size={22} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Portal do Aluno</h3>
                                    <p className="text-xs text-gray-500">Gerar link de acesso para {draftAthlete.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPortalModal(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 space-y-5">
                            {portalLoading ? (
                                <div className="text-center py-8">
                                    <Loader2 size={32} className="text-primary mx-auto animate-spin mb-3" />
                                    <p className="text-gray-400 text-sm">Gerando link de acesso...</p>
                                </div>
                            ) : portalError ? (
                                <div className="text-center py-6 space-y-3">
                                    <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                        <X size={24} className="text-red-400" />
                                    </div>
                                    <p className="text-red-400 text-sm font-bold">{portalError}</p>
                                    <button
                                        onClick={handleGeneratePortalAccess}
                                        className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
                                    >
                                        Tentar novamente
                                    </button>
                                </div>
                            ) : portalLink ? (
                                <>
                                    {athlete.auth_user_id ? (
                                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center mb-4">
                                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <User size={20} className="text-primary" />
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium mb-1">
                                                O aluno já possui acesso ativo com o email
                                            </p>
                                            <p className="text-base text-white font-bold">{athlete.email}</p>
                                        </div>
                                    ) : (
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Novo Acesso Gerado!</p>
                                            <p className="text-sm text-gray-300">
                                                Foi criada uma conta para <strong className="text-white">{athlete.email}</strong> com a senha <strong className="text-primary font-mono bg-white/5 px-2 py-0.5 rounded">{DEFAULT_ATHLETE_PASSWORD}</strong>.
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Envie o link abaixo para ele. A credencial já está anexada no link para login automático inicial.
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Link de Acesso</p>
                                        <div className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                                            <Link2 size={16} className="text-primary shrink-0" />
                                            <span className="text-sm text-gray-300 font-mono truncate flex-1">{portalLink}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await navigator.clipboard.writeText(portalLink);
                                                    setPortalCopied(true);
                                                    setTimeout(() => setPortalCopied(false), 3000);
                                                } catch {
                                                    // Fallback para browsers que não suportam clipboard API
                                                    const textarea = document.createElement('textarea');
                                                    textarea.value = portalLink;
                                                    document.body.appendChild(textarea);
                                                    textarea.select();
                                                    document.execCommand('copy');
                                                    document.body.removeChild(textarea);
                                                    setPortalCopied(true);
                                                    setTimeout(() => setPortalCopied(false), 3000);
                                                }
                                            }}
                                            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${portalCopied
                                                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                                                : 'bg-primary text-background-dark hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(0,201,167,0.3)]'
                                                }`}
                                        >
                                            {portalCopied ? (
                                                <>
                                                    <CheckCircle size={16} />
                                                    Link Copiado!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    Copiar Link
                                                </>
                                            )}
                                        </button>

                                        {typeof navigator.share === 'function' && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await navigator.share({
                                                            title: `Portal do Aluno - ${draftAthlete.name}`,
                                                            text: `Acesse seu Portal do Aluno Shape-V:`,
                                                            url: portalLink,
                                                        });
                                                    } catch (err) {
                                                        // Usuário cancelou o share — ok
                                                    }
                                                }}
                                                className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest"
                                            >
                                                <Share2 size={16} />
                                                Enviar
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest font-bold pt-1">
                                        <Clock size={10} />
                                        Link válido por 30 dias
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
