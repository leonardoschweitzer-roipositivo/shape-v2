/**
 * PortalLanding — HOME do Portal do Atleta v2.0
 * 
 * Exibida quando o atleta acessa via link de convite (?token=XXX)
 * Foco: Engajamento, Gamificação e Retenção
 * 
 * Layout v2:
 *   1. Header (Identidade)
 *   2. Card Personal (Vínculo)
 *   3. Card Score + Meta (Progresso)
 *   4. Card Ranking (Competição)
 *   5. Card Foco da Semana (Direção)
 *   6. Ações Rápidas (Secundárias)
 *   7. Footer (Última medição)
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
    Shield,
    Loader2,
    Play,
    Bell
} from 'lucide-react';
import { portalService, PortalAthleteData } from '@/services/portalService';
import { buscarDadosConsistencia, type DadosConsistencia } from '@/services/consistencia.service';
import { portalNotificacaoService } from '@/services/portal/portalNotificacaoService';
import { type DiagnosticoDados } from '@/services/calculations/diagnostico';
import { SelfMeasurements } from './SelfMeasurements';
import { OnboardingWizard } from './OnboardingWizard';
import { ContextoFormPublico } from './ContextoFormPublico';
import { AthletePortal } from '../AthletePortal';
import { VirtualAssessmentWizard } from '../../components/organisms/VirtualAssessmentWizard';
import { BottomNavigation } from '../../components/organisms/BottomNavigation/BottomNavigation';
import { AthletePortalTab } from '../../types/athlete-portal';
import {
    HeaderIdentidade,
    CardScoreMeta,
    CardMetasTrimestre,
    CardConsistencia,
    FooterUltimaMedicao,
    CardIndicadorProgresso
} from './components';

interface PortalLandingProps {
    token?: string;
    atletaId?: string;
    onClose?: () => void;
}

type PortalView = 'home' | 'measurements' | 'virtual-assessment' | 'portal' | 'contexto' | 'onboarding';

// ---- Helpers de classificação ----
const CLASSIFICACOES = [
    { min: 0, max: 30, nome: 'INICIANDO' },
    { min: 30, max: 50, nome: 'COMEÇANDO' },
    { min: 50, max: 65, nome: 'EVOLUINDO' },
    { min: 65, max: 80, nome: 'AVANÇADO' },
    { min: 80, max: 95, nome: 'ATLETA' },
    { min: 95, max: 101, nome: 'ELITE' },
];

function getClassificacao(score: number): string {
    return CLASSIFICACOES.find(c => score >= c.min && score < c.max)?.nome || 'INICIANDO';
}

function getProximaClassificacao(score: number): { nome: string; min: number } {
    const idx = CLASSIFICACOES.findIndex(c => score >= c.min && score < c.max);
    if (idx >= 0 && idx < CLASSIFICACOES.length - 1) {
        return CLASSIFICACOES[idx + 1];
    }
    return CLASSIFICACOES[CLASSIFICACOES.length - 1];
}

export function PortalLanding({ token, atletaId, onClose }: PortalLandingProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [athleteData, setAthleteData] = useState<PortalAthleteData | null>(null);
    const [dadosConsistencia, setDadosConsistencia] = useState<DadosConsistencia | null>(null);
    const [view, setView] = useState<PortalView>('home');
    const [portalTab, setPortalTab] = useState<AthletePortalTab>('hoje');
    const [notificacoesBadge, setNotificacoesBadge] = useState(0);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                let data: PortalAthleteData | null = null;
                if (token) {
                    data = await portalService.validateToken(token);
                } else if (atletaId) {
                    data = await portalService.getAthleteDataById(atletaId);
                }

                if (!data) {
                    setError('Acesso inválido ou expirado. Tente fazer login novamente.');
                } else {
                    setAthleteData(data);
                    // Consistência carrega em background (não bloqueia a HOME)
                    buscarDadosConsistencia(data.id).then(setDadosConsistencia).catch(console.error);
                    // Badge de notificações
                    portalNotificacaoService.contarNaoLidas(data.id).then(setNotificacoesBadge).catch(console.error);
                }
            } catch (err) {
                setError('Erro ao carregar dados. Tente novamente.');
            }
            setLoading(false);
        }
        loadData();
    }, [token, atletaId]);

    // ---- Loading ----
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="text-indigo-400 mx-auto animate-spin" size={40} />
                    <p className="text-zinc-500 text-sm font-medium">Carregando seu portal...</p>
                </div>
            </div>
        );
    }

    // ---- Error ----
    if (error || !athleteData) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="text-red-400" size={36} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-black text-white">ACESSO NEGADO</h1>
                        <p className="text-zinc-400 text-sm">{error || 'Token inválido.'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    // ---- Sub-views ----
    if (view === 'portal') {
        return (
            <AthletePortal
                atletaId={athleteData.id}
                atletaNome={athleteData.nome}
                initialTab={portalTab}
                onGoToHome={() => setView('home')}
            />
        );
    }

    if (view === 'contexto') {
        return (
            <ContextoFormPublico
                atletaId={athleteData.id}
                atletaNome={athleteData.nome}
                onBack={() => setView('home')}
            />
        );
    }

    if (view === 'measurements') {
        return (
            <SelfMeasurements
                atletaId={athleteData.id}
                atletaNome={athleteData.nome}
                sexo={athleteData.ficha?.sexo || 'M'}
                onSave={async (measurements) => {
                    const result = await portalService.saveMeasurements(athleteData.id, measurements);
                    if (result.success) {
                        let updated: PortalAthleteData | null = null;
                        if (token) {
                            updated = await portalService.validateToken(token);
                        } else if (atletaId) {
                            updated = await portalService.getAthleteDataById(atletaId);
                        }
                        if (updated) setAthleteData(updated);
                        setView('contexto');
                    }
                    return result.success;
                }}
                onBack={() => setView('home')}
            />
        );
    }

    if (view === 'virtual-assessment') {
        return (
            <VirtualAssessmentWizard
                atletaId={athleteData.id}
                sexo={(athleteData.ficha?.sexo as 'M' | 'F') || 'M'}
                altura={athleteData.ficha?.altura || 170}
                pesoInicial={athleteData.medidas?.[0]?.peso ?? undefined}
                dataNascimentoInicial={athleteData.ficha?.data_nascimento || ''}
                onComplete={async () => {
                    let updated: PortalAthleteData | null = null;
                    if (token) {
                        updated = await portalService.validateToken(token);
                    } else if (atletaId) {
                        updated = await portalService.getAthleteDataById(atletaId);
                    }
                    if (updated) setAthleteData(updated);
                    setView('contexto');
                }}
                onClose={() => setView('home')}
            />
        );
    }

    // ---- Onboarding: Wizard de Primeira Vez ----
    const temAvaliacaoGlobal = !!(athleteData.avaliacoes?.length) || !!(athleteData.medidas?.length);

    // Se escolheu 'BASICO' mas não tem medidas, forçar a voltar para o onboarding (ex: erro de salvamento)
    const onboardingParcialBasico = athleteData.ficha?.metodo_medidas === 'BASICO' && !temAvaliacaoGlobal;
    const onboardingCompletoGlobal = !!athleteData.ficha?.onboarding_completo && !onboardingParcialBasico;

    if (!temAvaliacaoGlobal && !onboardingCompletoGlobal) {
        return (
            <OnboardingWizard
                atletaId={athleteData.id}
                atletaNome={athleteData.nome}
                sexo={(athleteData.ficha?.sexo as 'M' | 'F') || 'M'}
                onComplete={async () => {
                    let updated: PortalAthleteData | null = null;
                    if (token) {
                        updated = await portalService.validateToken(token);
                    } else if (atletaId) {
                        updated = await portalService.getAthleteDataById(atletaId);
                    }
                    if (updated) setAthleteData(updated);
                    setView('home');
                }}
                onGoToVirtualAssessment={() => setView('virtual-assessment')}
                onLogout={onClose}
            />
        );
    }

    // ===========================================================
    //  HOME v2.0 — Layout baseado na SPEC
    // ===========================================================
    return (
        <HomeAtletaV2
            athleteData={athleteData}
            dadosConsistencia={dadosConsistencia}
            onGoToPortal={(tab) => {
                setPortalTab(tab);
                setView('portal');
            }}
            onGoToMeasurements={() => setView('measurements')}
            onGoToVirtualAssessment={() => setView('virtual-assessment')}
            onGoToContexto={() => setView('contexto')}
            onLogout={onClose || (() => { })}
            notificacoesBadge={notificacoesBadge}
        />
    );
}

// ===========================================================
//  Componente interno: HomeAtletaV2
// ===========================================================
interface HomeAtletaV2Props {
    athleteData: PortalAthleteData;
    dadosConsistencia: DadosConsistencia | null;
    onGoToPortal: (tab: AthletePortalTab) => void;
    onGoToMeasurements: () => void;
    onGoToVirtualAssessment: () => void;
    onGoToContexto: () => void;
    onLogout: () => void;
    notificacoesBadge?: number;
}

function HomeAtletaV2({ athleteData, dadosConsistencia, onGoToPortal, onGoToMeasurements, onGoToVirtualAssessment, onGoToContexto, onLogout, notificacoesBadge = 0 }: HomeAtletaV2Props) {

    const lastAval = athleteData.avaliacoes?.[0];
    const lastMedida = athleteData.medidas?.[0];
    const sexoLabel = athleteData.ficha?.sexo === 'F' ? 'FEMININO' : 'MASCULINO';

    // Priorizar peso da avaliação ou diagnóstico sobre a tabela de medidas
    const measurements = lastAval?.measurements as Record<string, Record<string, unknown>> | undefined;
    const peso = Number(measurements?.linear?.weight)
        || lastMedida?.peso
        || undefined;

    const altura = athleteData.ficha?.altura ?? 0;

    // ---- Score & Meta (dados do Diagnóstico / Fallback) ----
    const scoreAtual = lastAval?.score_geral ?? 0;
    const classificacaoAtual = getClassificacao(scoreAtual);
    const dataUltimaAvaliacao = lastAval ? new Date(lastAval.data) : new Date();

    // Pull goals from diagnostico
    const diag = athleteData.diagnostico?.dados as Record<string, Record<string, unknown>> | undefined;
    const analiseEstetica = diag?.analiseEstetica as Record<string, unknown> | undefined;
    const scoreMeta = Number(analiseEstetica?.scoreMeta12M) || 65;
    const classificacaoMeta = analiseEstetica?.scoreMeta12M ? getClassificacao(scoreMeta) : 'ATLETA';

    const firstMedida = athleteData.medidas?.[athleteData.medidas.length - 1] || lastMedida;

    // Medidas Atuais: Priorizar Avaliação IA -> Diagnóstico -> Tabela Medidas
    const medidasDiag = diag?._medidas as Record<string, unknown> | undefined;
    const ombrosAtual = Number(measurements?.linear?.shoulders)
        || Number(medidasDiag?.ombros)
        || lastMedida?.ombros
        || 0;

    const cinturaAtual = Number(measurements?.linear?.waist)
        || Number(medidasDiag?.cintura)
        || lastMedida?.cintura
        || 1;

    const primaryGroupName = athleteData.ficha?.sexo === 'F' ? 'Ampulheta' : 'Shape-V';
    const metasProporcoes = diag?.metasProporcoes as { grupo: string; meta12M: number }[] | undefined;
    const itemPrincipal = metasProporcoes?.find(p => p.grupo === primaryGroupName);

    const ratioAtual = Number(analiseEstetica?.scoreAtual) // Score para Ampulheta
        || (ombrosAtual > 0 && cinturaAtual > 0 ? ombrosAtual / cinturaAtual : 0);

    // Se não tiver o item no diagnóstico, simulamos a progressão linear para 3, 6, 9 meses
    const fallbackIdeal = athleteData.ficha?.sexo === 'F' ? 100 : 1.618;
    const ratioMeta12M = Number(itemPrincipal?.meta12M) || fallbackIdeal;

    // Medida Ombros cm (para impressionar mais como solicitado)
    // Cálculo reverso da meta em CM para 12 meses
    const ombrosMeta12M = Math.round((ratioMeta12M * cinturaAtual) * 10) / 10;
    const ombrosBasal = firstMedida?.ombros || ombrosAtual - (ombrosAtual * 0.1);

    // Medida Cintura cm (Redução)
    const pelvisAtual = athleteData.ficha?.pelve || 0;
    // Meta de 0.86 * pélvis (conforme spec Golden Ratio)
    const cinturaMeta12M = pelvisAtual > 0 ? Math.round((0.86 * pelvisAtual) * 10) / 10 : Math.round((cinturaAtual * 0.95) * 10) / 10;
    const cinturaBasal = firstMedida?.cintura || cinturaAtual + (cinturaAtual * 0.1);

    // Percentual de Gordura
    const bfAtual = lastAval?.gordura || 0;
    const metasComposicao = diag?.metasComposicao as Record<string, unknown> | undefined;
    const bfMeta = Number(metasComposicao?.gordura12Meses) || 12;
    const firstAval = athleteData.avaliacoes?.[athleteData.avaliacoes.length - 1] || lastAval;
    const bfBasal = firstAval?.gordura || bfAtual + 5;

    // Diagnóstico tipado para o CardMetasTrimestre
    const diagTyped = diag as unknown as DiagnosticoDados | undefined;

    // Medidas atuais para conversão ratio→cm no CardMetasTrimestre
    const medidasParaCard = {
        ombros: ombrosAtual || undefined,
        cintura: cinturaAtual || undefined,
        braco: (
            (Number(measurements?.linear?.arm_right) + Number(measurements?.linear?.arm_left)) / 2
            || (Number(medidasDiag?.bracoD) + Number(medidasDiag?.bracoE)) / 2
            || ((lastMedida?.braco_direito ?? 0) + (lastMedida?.braco_esquerdo ?? 0)) / 2
        ) || undefined,
        antebraco: (
            (Number(measurements?.linear?.forearm_right) + Number(measurements?.linear?.forearm_left)) / 2
            || (Number(medidasDiag?.antebracoD) + Number(medidasDiag?.antebracoE)) / 2
            || ((lastMedida?.antebraco_direito ?? 0) + (lastMedida?.antebraco_esquerdo ?? 0)) / 2
        ) || undefined,
        coxa: (
            (Number(measurements?.linear?.thigh_right) + Number(measurements?.linear?.thigh_left)) / 2
            || (Number(medidasDiag?.coxaD) + Number(medidasDiag?.coxaE)) / 2
            || ((lastMedida?.coxa_direita ?? 0) + (lastMedida?.coxa_esquerda ?? 0)) / 2
        ) || undefined,
        panturrilha: (
            (Number(measurements?.linear?.calf_right) + Number(measurements?.linear?.calf_left)) / 2
            || (Number(medidasDiag?.panturrilhaD) + Number(medidasDiag?.panturrilhaE)) / 2
            || ((lastMedida?.panturrilha_direita ?? 0) + (lastMedida?.panturrilha_esquerda ?? 0)) / 2
        ) || undefined,
        peitoral: Number(measurements?.linear?.chest) || Number(medidasDiag?.peitoral) || lastMedida?.peitoral || undefined,
        punho: athleteData.ficha?.punho ?? undefined,
        joelho: athleteData.ficha?.joelho ?? undefined,
        tornozelo: athleteData.ficha?.tornozelo ?? undefined,
    };

    const prazoMeta = 12;

    // Cálculo do Score: Baseado no Gap (Distância entre Primeira Avaliação e Meta)
    const scoreBasal = firstAval?.score_geral || 0;
    const gapScoreTotal = Math.max(0, scoreMeta - scoreBasal);
    const progressoScorePercorrido = Math.max(0, scoreAtual - scoreBasal);

    let percentualMeta = gapScoreTotal > 0 ? (progressoScorePercorrido / gapScoreTotal) * 100 : 0;

    // Travar entre 0 e 100
    if (scoreAtual < scoreBasal) percentualMeta = 0;
    if (scoreAtual >= scoreMeta) percentualMeta = 100;

    percentualMeta = Math.max(0, Math.min(100, Math.round(percentualMeta)));

    const pontosRestantes = Math.max(0, scoreMeta - scoreAtual);

    // Evolução: se tem 2+ avaliações, calcular
    const evolucaoMes = useMemo(() => {
        if (athleteData.avaliacoes && athleteData.avaliacoes.length >= 2) {
            return Number(((athleteData.avaliacoes[0]?.score_geral ?? 0) - (athleteData.avaliacoes[1]?.score_geral ?? 0)).toFixed(1));
        }
        return 0;
    }, [athleteData.avaliacoes]);

    // ---- Footer: última medição ----
    const diasDesdeUltima = useMemo(() => {
        if (!lastMedida) return 999;
        const diff = Date.now() - new Date(lastMedida.data).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }, [lastMedida]);

    const statusMedicao = diasDesdeUltima <= 7 ? 'em_dia' as const
        : diasDesdeUltima <= 14 ? 'atencao' as const
            : 'atrasado' as const;

    // ---- Ações Rápidas ----

    // ---- Estado: Sem medidas (Primeiro acesso) ----
    const temAvaliacao = !!lastAval || !!lastMedida;

    // Se onboarding completo mas sem medidas reais, mostrar CTA
    const onboardingCompleto = !!athleteData.ficha?.onboarding_completo;
    if (!temAvaliacao && onboardingCompleto) {
        return (
            <div className="min-h-screen bg-background-dark text-white">
                <HeaderIdentidade
                    nome={athleteData.nome}
                    sexo={sexoLabel}
                    altura={altura}
                    peso={peso}
                    fotoUrl={undefined}
                    personalNome={athleteData.personalNome}
                />

                {/* CTA: Medições pendentes */}
                <div className="mx-4 mt-8 bg-gradient-to-br from-surface-deep to-background-dark rounded-2xl p-8 border border-white/5 text-center shadow-xl">
                    <div className="text-5xl mb-4">📊</div>
                    <h2 className="text-white font-black text-lg uppercase tracking-widest mb-3">
                        AGUARDANDO MEDIDAS
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                        {athleteData.ficha?.metodo_medidas === 'PERSONAL'
                            ? 'Seu personal entrará em contato para realizar suas medidas presencialmente.'
                            : 'Você pode registrar suas medidas a qualquer momento usando as opções abaixo.'}
                    </p>

                    {athleteData.ficha?.metodo_medidas !== 'PERSONAL' && (
                        <>
                            <button
                                onClick={onGoToMeasurements}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all active:scale-95 shadow-lg shadow-indigo-500/20 mb-3"
                            >
                                📏 COM FITA MÉTRICA
                            </button>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1 h-px bg-white/5" />
                                <span className="text-[10px] text-gray-600 font-bold uppercase">ou</span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>
                            <button
                                onClick={onGoToVirtualAssessment}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-white py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all active:scale-95"
                            >
                                📸 COM FOTOS (IA)
                            </button>
                        </>
                    )}
                </div>

                {/* Sair da conta */}
                <div className="mt-8 pb-10 text-center opacity-30 hover:opacity-100 transition-opacity">
                    <button
                        onClick={onLogout}
                        className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                    >
                        Sair da conta
                    </button>
                </div>
            </div>
        );
    }

    // ---- Estado: Com avaliação — HOME COMPLETA v2.0 ----
    return (
        <div className="min-h-screen bg-background-dark text-white pb-4">
            {/* Floating notification bell — top right */}
            <button
                onClick={() => onGoToPortal('notificacoes')}
                className="fixed top-8 right-4 z-40 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-90 hover:bg-white/10"
                aria-label="Notificações"
            >
                <Bell size={18} className="text-gray-400" />
                {notificacoesBadge > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-500 flex items-center justify-center px-1 shadow-lg shadow-rose-500/30">
                        <span className="text-[9px] font-black text-white leading-none">
                            {notificacoesBadge > 9 ? '9+' : notificacoesBadge}
                        </span>
                    </div>
                )}
            </button>

            {/* 1. Header Integrado com Personal */}
            <HeaderIdentidade
                nome={athleteData.nome}
                sexo={sexoLabel}
                altura={altura}
                peso={peso}
                fotoUrl={undefined}
                personalNome={athleteData.personalNome}
                personalRanking={3}
            />

            {/* Card de Consistência */}
            {dadosConsistencia && (
                <CardConsistencia dados={dadosConsistencia} />
            )}

            {/* Botão "VER TREINO DE HOJE" (Centralizado, estilo Primário) */}
            <div className="max-w-2xl mx-auto px-6 mt-6 mb-6">
                <button
                    onClick={() => onGoToPortal('hoje')}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    <Play size={18} fill="white" />
                    VER TREINO DE HOJE
                </button>
            </div>

            {/* 3. Card Score + Meta */}
            <CardScoreMeta
                scoreAtual={scoreAtual}
                classificacaoAtual={classificacaoAtual}
                dataUltimaAvaliacao={dataUltimaAvaliacao}
                scoreMeta={scoreMeta}
                classificacaoMeta={classificacaoMeta}
                prazoMeta={prazoMeta}
                evolucaoMes={evolucaoMes}
                evolucaoMesAnterior={0}
                melhorMesHistorico={Math.abs(evolucaoMes)}
                percentualMeta={percentualMeta}
                pontosRestantes={pontosRestantes}
            />

            {/* 4. Card Metas do Trimestre (baseado no Diagnóstico IA) */}
            {diagTyped && (
                <CardMetasTrimestre
                    diagnosticoDados={diagTyped}
                    sexo={athleteData.ficha?.sexo as 'M' | 'F' || 'M'}
                    composicaoAtual={{
                        peso: peso || 0,
                        gorduraPct: bfAtual,
                    }}
                    medidas={medidasParaCard}
                />
            )}

            {/* Botão Preencher Contexto */}
            <div className="max-w-2xl mx-auto px-6 mb-6">
                <button
                    onClick={onGoToContexto}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                    📝 Preencher meu contexto
                </button>
            </div>

            {/* 7. Footer */}
            <FooterUltimaMedicao
                dataUltimaMedida={lastMedida ? new Date(lastMedida.data) : new Date()}
                diasDesdeUltima={diasDesdeUltima}
                statusMedicao={statusMedicao}
            />

            {/* Discreet Logout */}
            <div className="py-8 text-center opacity-30 hover:opacity-100 transition-opacity">
                <button
                    onClick={onLogout}
                    className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium"
                >
                    Sair da conta
                </button>
            </div>

            {/* Espaço para o menu não sobrepor o footer */}
            <div className="h-20" />

            {/* Menu Inferior */}
            <BottomNavigation
                activeTab="home"
                onTabChange={(tab) => {
                    if (tab !== 'home') {
                        onGoToPortal(tab);
                    }
                }}
                notificacoesBadge={notificacoesBadge}
            />
        </div>
    );
}
