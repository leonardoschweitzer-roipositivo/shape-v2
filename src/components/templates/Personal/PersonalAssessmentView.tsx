import React, { useState, useEffect } from 'react';
import { Activity, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AssessmentForm } from '@/components/organisms/AssessmentForm';
import { PersonalAthleteSelector } from './PersonalAthleteSelector';
import { PersonalAthlete, MeasurementHistory } from '@/mocks/personal';
import { calculateAge } from '@/utils/dateUtils';
import { supabase } from '@/services/supabase';

interface PersonalAssessmentViewProps {
    onConfirm: (data: {
        studentId: string;
        gender: 'male' | 'female';
        studentName: string;
        measurements: any;
        skinfolds: any;
        age?: number;
    }) => void;
    initialAthlete?: PersonalAthlete | null;
}

export const PersonalAssessmentView: React.FC<PersonalAssessmentViewProps> = ({ onConfirm, initialAthlete }) => {
    const [selectedAthlete, setSelectedAthlete] = useState<PersonalAthlete | null>(initialAthlete || null);
    const [freshBirthDate, setFreshBirthDate] = useState<string | undefined>(undefined);

    // Busca birthDate atualizado direto do Supabase (ficha pode ter sido preenchida
    // pelo próprio aluno no onboarding depois que o store do trainer foi carregado).
    useEffect(() => {
        setFreshBirthDate(undefined);
        if (!selectedAthlete) return;
        (async () => {
            const { data } = await supabase
                .from('fichas')
                .select('data_nascimento')
                .eq('atleta_id', selectedAthlete.id)
                .single();
            const dn = (data as { data_nascimento?: string } | null)?.data_nascimento;
            if (dn) setFreshBirthDate(dn);
        })();
    }, [selectedAthlete?.id]);

    const handleConfirm = (formData: { measurements: any; skinfolds: any; age?: number }) => {
        if (!selectedAthlete) return;

        const gender: 'male' | 'female' = selectedAthlete.gender === 'FEMALE' ? 'female' : 'male';

        onConfirm({
            studentId: selectedAthlete.id,
            studentName: selectedAthlete.name,
            gender: gender,
            measurements: formData.measurements,
            skinfolds: formData.skinfolds,
            age: formData.age || athleteAge
        });
    };

    const birthDateEfetivo = freshBirthDate || selectedAthlete?.birthDate;
    const athleteAge = birthDateEfetivo ? calculateAge(birthDateEfetivo) : undefined;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar flex flex-col">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-10 flex-1 w-full">
                {/* Page Title */}
                <div className="flex flex-col animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">REALIZAR AVALIAÇÃO</h2>
                    <p className="text-gray-400 mt-2 font-light">Selecione o aluno e insira os dados métricos para uma análise completa.</p>
                </div>

                <div className="h-px w-full bg-white/10" />

                {!selectedAthlete ? (
                    /* Step 1: Select Athlete */
                    <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 animate-fade-in-up">
                        <div className="mb-10 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <User className="text-primary" size={20} />
                                    <h2 className="text-xl font-bold text-white tracking-wide uppercase">SELECIONAR ALUNO</h2>
                                </div>
                                <p className="text-sm text-gray-400">Escolha para qual aluno deseja realizar a avaliação agora.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase">
                                    PASSO 1 DE 2
                                </span>
                            </div>
                        </div>

                        <PersonalAthleteSelector onSelect={setSelectedAthlete} />
                    </div>
                ) : (
                    /* Step 2: Assessment Form */
                    <AssessmentFormStep
                        athlete={selectedAthlete}
                        athleteAge={athleteAge}
                        onBack={() => setSelectedAthlete(null)}
                        onConfirm={handleConfirm}
                    />
                )}
            </div>
        </div>
    );
};

// ─── Sub-componente: Step 2 com lógica de importação ───────────────────────

interface AssessmentFormStepProps {
    athlete: PersonalAthlete;
    athleteAge: number | undefined;
    onBack: () => void;
    onConfirm: (data: { measurements: any; skinfolds: any; age?: number }) => void;
}

type ImportState = 'prompt' | 'imported' | 'blank';

type FreshData = {
    measurements: Partial<MeasurementHistory['measurements']>;
    skinfolds?: Partial<MeasurementHistory['skinfolds']>;
    source: 'assessment-completo' | 'onboarding' | 'none';
    sourceDate: string | null;
};

const AssessmentFormStep: React.FC<AssessmentFormStepProps> = ({ athlete, athleteAge, onBack, onConfirm }) => {
    // Busca ficha + última medida DIRETO do Supabase para garantir dados atualizados
    // (o dataStore do Personal pode estar stale se o aluno preencheu o onboarding depois).
    const [fresh, setFresh] = useState<FreshData | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const [{ data: ficha }, { data: medidas }] = await Promise.all([
                supabase
                    .from('fichas')
                    .select('altura, punho, joelho, tornozelo, pelve')
                    .eq('atleta_id', athlete.id)
                    .single(),
                supabase
                    .from('medidas')
                    .select('*')
                    .eq('atleta_id', athlete.id)
                    .order('data', { ascending: false })
                    .order('created_at', { ascending: false })
                    .limit(1),
            ]);
            if (cancelled) return;

            const f = ficha as Record<string, number | null> | null;
            const m = (medidas as Record<string, unknown>[] | null)?.[0] || null;
            const lastAssessment = athlete.assessments?.[0];
            const assessmentTemPeso = !!(lastAssessment?.measurements?.weight && lastAssessment.measurements.weight > 0);

            // Prioridade: avaliação completa anterior > medidas do onboarding > só ficha estrutural
            let source: FreshData['source'] = 'none';
            let measurementsMerged: Partial<MeasurementHistory['measurements']> = {};
            let skinfoldsMerged: Partial<MeasurementHistory['skinfolds']> | undefined = undefined;
            let sourceDate: string | null = null;

            // Dados estruturais da ficha (punho, joelho, tornozelo, altura)
            let alturaCm = Number(f?.altura) || 0;
            if (alturaCm > 0 && alturaCm < 3) alturaCm = Math.round(alturaCm * 100);
            const fichaBase: Partial<MeasurementHistory['measurements']> = {
                height: alturaCm || undefined,
                wristRight: Number(f?.punho) || undefined,
                wristLeft: Number(f?.punho) || undefined,
                kneeRight: Number(f?.joelho) || undefined,
                kneeLeft: Number(f?.joelho) || undefined,
                ankleRight: Number(f?.tornozelo) || undefined,
                ankleLeft: Number(f?.tornozelo) || undefined,
                pelvis: Number(f?.pelve) || undefined,
            };

            if (assessmentTemPeso && lastAssessment) {
                measurementsMerged = { ...fichaBase, ...lastAssessment.measurements };
                skinfoldsMerged = lastAssessment.skinfolds;
                source = 'assessment-completo';
                sourceDate = lastAssessment.date;
            } else if (m) {
                measurementsMerged = {
                    ...fichaBase,
                    weight: Number(m.peso) || undefined,
                    neck: Number(m.pescoco) || undefined,
                    shoulders: Number(m.ombros) || undefined,
                    chest: Number(m.peitoral) || undefined,
                    waist: Number(m.cintura) || undefined,
                    hips: Number(m.quadril) || undefined,
                    armRight: Number(m.braco_direito) || undefined,
                    armLeft: Number(m.braco_esquerdo) || undefined,
                    forearmRight: Number(m.antebraco_direito) || undefined,
                    forearmLeft: Number(m.antebraco_esquerdo) || undefined,
                    thighRight: Number(m.coxa_direita) || undefined,
                    thighLeft: Number(m.coxa_esquerda) || undefined,
                    calfRight: Number(m.panturrilha_direita) || undefined,
                    calfLeft: Number(m.panturrilha_esquerda) || undefined,
                };
                skinfoldsMerged = {
                    tricep: Number(m.dobra_tricipital) || undefined,
                    subscapular: Number(m.dobra_subescapular) || undefined,
                    chest: Number(m.dobra_peitoral) || undefined,
                    axillary: Number(m.dobra_axilar_media) || undefined,
                    suprailiac: Number(m.dobra_suprailiaca) || undefined,
                    abdominal: Number(m.dobra_abdominal) || undefined,
                    thigh: Number(m.dobra_coxa) || undefined,
                };
                source = 'onboarding';
                sourceDate = (m.data as string) || null;
            } else if (Object.values(fichaBase).some(v => v)) {
                measurementsMerged = fichaBase;
                source = 'onboarding';
            }

            setFresh({
                measurements: measurementsMerged,
                skinfolds: skinfoldsMerged,
                source,
                sourceDate,
            });
        })();
        return () => { cancelled = true; };
    }, [athlete.id]);

    const hasFullAssessment = fresh?.source === 'assessment-completo';
    const hasOnboardingData = fresh?.source === 'onboarding';

    // Auto-importa se há dados do onboarding (aluno já preencheu — trainer não precisa redigitar).
    // Mostra prompt apenas quando há avaliação COMPLETA anterior (trainer pode querer começar em branco).
    const [importState, setImportState] = useState<ImportState>('blank');

    useEffect(() => {
        if (!fresh) return;
        if (hasFullAssessment) setImportState('prompt');
        else if (hasOnboardingData) setImportState('imported');
        else setImportState('blank');
    }, [fresh, hasFullAssessment, hasOnboardingData]);

    const lastDate = fresh?.sourceDate
        ? new Date(fresh.sourceDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : null;

    const importedData = importState === 'imported' && fresh ? {
        measurements: fresh.measurements,
        skinfolds: fresh.skinfolds,
    } : undefined;

    return (
        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10 animate-fade-in-up">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Activity className="text-primary" size={20} />
                            <h2 className="text-xl font-bold text-white tracking-wide uppercase">DADOS DE {athlete.name}</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400">Preencha as medidas corporais coletadas para análise de simetria.</p>
                            <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-primary uppercase tracking-widest">
                                {athlete.gender === 'FEMALE' ? 'Sexo: Feminino' : 'Sexo: Masculino'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium">
                        <CheckCircle2 size={14} />
                        ALUNO SELECIONADO
                    </div>
                    <span className="px-3 py-1 rounded border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase">
                        PASSO 2 DE 2
                    </span>
                </div>
            </div>

            {/* Banner de Importação de Dados — só aparece quando há avaliação completa anterior */}
            {importState === 'prompt' && hasFullAssessment && (
                <ImportDataBanner
                    hasFullData={true}
                    lastDate={lastDate}
                    onImport={() => setImportState('imported')}
                    onBlank={() => setImportState('blank')}
                />
            )}

            {/* Badge indicando estado atual */}
            {importState !== 'prompt' && (
                <div className={`mb-6 flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-medium ${importState === 'imported'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                    <span>
                        {importState === 'imported'
                            ? hasOnboardingData
                                ? `📋 Dados pré-preenchidos do onboarding do aluno${lastDate ? ` (${lastDate})` : ''} — confira e ajuste o que for necessário`
                                : `📋 Dados importados da avaliação de ${lastDate} — edite o que mudou e clique em Avaliar`
                            : '📝 Formulário em branco — insira as novas medidas coletadas'}
                    </span>
                    {(hasFullAssessment || hasOnboardingData) && (
                        <button
                            onClick={() => setImportState(importState === 'imported' ? 'blank' : 'imported')}
                            className="text-[10px] uppercase tracking-widest underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity ml-4 shrink-0"
                        >
                            {importState === 'imported' ? 'Começar em branco' : 'Usar dados do aluno'}
                        </button>
                    )}
                </div>
            )}

            {/* Formulário — só renderiza após decisão */}
            {importState !== 'prompt' && (
                <AssessmentForm
                    onConfirm={onConfirm}
                    isModal={false}
                    initialData={importedData}
                    initialAge={athleteAge}
                />
            )}
        </div>
    );
};

// ─── Banner de escolha de importação ───────────────────────────────────────

interface ImportDataBannerProps {
    hasFullData: boolean;
    lastDate: string | null;
    onImport: () => void;
    onBlank: () => void;
}

const ImportDataBanner: React.FC<ImportDataBannerProps> = ({ hasFullData, lastDate, onImport, onBlank }) => (
    <div className="mb-8 relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-6 animate-fade-in-up">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
            {/* Icon + Text */}
            <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/20 shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                    </svg>
                </div>
                <div>
                    <p className="text-white font-semibold text-sm mb-1">
                        {hasFullData
                            ? `Avaliação anterior encontrada${lastDate ? ` — ${lastDate}` : ''}`
                            : 'Dados da ficha encontrados'}
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        {hasFullData
                            ? 'Este aluno já possui uma avaliação salva. Importe os dados como base e edite apenas o que mudou — economize tempo sem redigitar tudo.'
                            : 'A ficha deste aluno possui dados estruturais (altura, punho, joelho, tornozelo). Importe como ponto de partida e complete o restante.'}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                    onClick={onImport}
                    className="group flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="8 17 12 21 16 17" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
                    </svg>
                    Importar Dados
                </button>
                <button
                    onClick={onBlank}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                    </svg>
                    Começar do Zero
                </button>
            </div>
        </div>
    </div>
);
