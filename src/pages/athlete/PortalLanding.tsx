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
    Play
} from 'lucide-react';
import { portalService, PortalAthleteData } from '@/services/portalService';
import { buscarDadosConsistencia, type DadosConsistencia } from '@/services/consistencia.service';
import { SelfMeasurements } from './SelfMeasurements';
import { AthletePortal } from '../AthletePortal';
import { BottomNavigation } from '../../components/organisms/BottomNavigation/BottomNavigation';
import { AthletePortalTab } from '../../types/athlete-portal';
import {
    HeaderIdentidade,
    CardScoreMeta,
    CardRanking,
    CardConsistencia,
    AcoesRapidas,
    FooterUltimaMedicao,
    CardIndicadorProgresso
} from './components';

interface PortalLandingProps {
    token: string;
    onClose: () => void;
}

type PortalView = 'home' | 'measurements' | 'portal';

// ---- Helpers de classificação ----
const CLASSIFICACOES = [
    { min: 0, max: 30, nome: 'INICIANDO' },
    { min: 30, max: 50, nome: 'COMEÇANDO' },
    { min: 50, max: 65, nome: 'EVOLUINDO' },
    { min: 65, max: 80, nome: 'ATLETA' },
    { min: 80, max: 90, nome: 'AVANÇADO' },
    { min: 90, max: 95, nome: 'ELITE' },
    { min: 95, max: 100, nome: 'DEUS GREGO' },
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

export function PortalLanding({ token, onClose }: PortalLandingProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [athleteData, setAthleteData] = useState<PortalAthleteData | null>(null);
    const [dadosConsistencia, setDadosConsistencia] = useState<DadosConsistencia | null>(null);
    const [view, setView] = useState<PortalView>('home');
    const [portalTab, setPortalTab] = useState<AthletePortalTab>('hoje');

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await portalService.validateToken(token);
                if (!data) {
                    setError('Link inválido ou expirado. Peça um novo link ao seu Personal.');
                } else {
                    setAthleteData(data);
                    // Consistência carrega em background (não bloqueia a HOME)
                    buscarDadosConsistencia(data.id).then(setDadosConsistencia).catch(console.error);
                }
            } catch (err) {
                setError('Erro ao carregar dados. Tente novamente.');
            }
            setLoading(false);
        }
        loadData();
    }, [token]);

    // ---- Loading ----
    if (loading) {
        return (
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
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
            <div className="min-h-screen bg-[#060B18] flex items-center justify-center p-6">
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

    if (view === 'measurements') {
        return (
            <SelfMeasurements
                atletaId={athleteData.id}
                atletaNome={athleteData.nome}
                sexo={athleteData.ficha?.sexo || 'M'}
                onSave={async (measurements) => {
                    const result = await portalService.saveMeasurements(athleteData.id, measurements);
                    if (result.success) {
                        const updated = await portalService.validateToken(token);
                        if (updated) setAthleteData(updated);
                    }
                    return result.success;
                }}
                onBack={() => setView('home')}
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
}

function HomeAtletaV2({ athleteData, dadosConsistencia, onGoToPortal, onGoToMeasurements }: HomeAtletaV2Props) {

    const lastAval = athleteData.avaliacoes?.[0];
    const lastMedida = athleteData.medidas?.[0];
    const sexoLabel = athleteData.ficha?.sexo === 'F' ? 'FEMININO' : 'MASCULINO';
    const peso = lastMedida?.peso ?? undefined;
    const altura = athleteData.ficha?.altura ?? 0;

    // ---- Score & Meta (dados do Diagnóstico / Fallback) ----
    const scoreAtual = lastAval?.score_geral ?? 0;
    const classificacaoAtual = lastAval?.classificacao_geral || getClassificacao(scoreAtual);
    const dataUltimaAvaliacao = lastAval ? new Date(lastAval.data) : new Date();

    // Pull goals from diagnostico
    const diag = athleteData.diagnostico?.dados;
    const scoreMeta = diag?.analiseEstetica?.scoreMeta6M ?? 65;
    const classificacaoMeta = diag?.analiseEstetica?.scoreMeta12M ? (scoreMeta >= 80 ? 'ATLETA' : 'EVOLUINDO') : 'ATLETA'; // Simplificação

    const firstMedida = athleteData.medidas?.[athleteData.medidas.length - 1] || lastMedida; // A última do array é a mais antiga/primeira

    // Proporção Shape-V (Ombros/Cintura)
    const ratioAtual = lastAval?.results?.classificacao?.ratios?.['Shape-V'] || (lastMedida?.ombros && lastMedida.cintura ? lastMedida.ombros / lastMedida.cintura : 0);
    const itemShapeV = diag?.metasProporcoes?.find((p: any) => p.grupo === 'Shape-V');
    const ratioMeta = itemShapeV?.meta6M || 1.618;
    const ratioMeta12M = itemShapeV?.meta12M || 1.618;

    // Medida Ombros cm (para impressionar mais como solicitado)
    const ombrosAtual = lastMedida?.ombros || 0;
    const cinturaAtual = lastMedida?.cintura || 1;
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
    const bfMeta = diag?.metasComposicao?.gordura6Meses || 12;
    const firstAval = athleteData.avaliacoes?.[athleteData.avaliacoes.length - 1] || lastAval;
    const bfBasal = firstAval?.gordura || bfAtual + 5;

    const prazoMeta = 6;

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
    const acoes = [
        {
            id: 'medir',
            icone: '📏',
            label: 'MEDIR',
            rota: '/atleta/medidas/nova',
            onClick: onGoToMeasurements,
        },
        {
            id: 'coach',
            icone: '🤖',
            label: 'COACH IA',
            rota: '/atleta/coach',
            onClick: onGoToPortal,
        },
        {
            id: 'evolucao',
            icone: '📊',
            label: 'EVOLUÇÃO',
            rota: '/atleta/evolucao',
            onClick: onGoToPortal,
        },
    ];

    // ---- Estado: Sem medidas (Primeiro acesso) ----
    const temAvaliacao = !!lastAval;

    if (!temAvaliacao) {
        return (
            <div className="min-h-screen bg-[#060B18] text-white">
                <HeaderIdentidade
                    nome={athleteData.nome}
                    sexo={sexoLabel}
                    altura={altura}
                    peso={peso}
                    fotoUrl={undefined}
                    personalNome={athleteData.personalNome}
                />

                {/* CTA Primeiro Acesso */}
                <div className="mx-4 mt-8 bg-gradient-to-br from-[#0C1220] to-[#0A0F1C] rounded-2xl p-8 border border-white/5 text-center shadow-xl">
                    <div className="text-5xl mb-4">🎯</div>
                    <h2 className="text-white font-black text-lg uppercase tracking-widest mb-3">
                        COMECE SUA JORNADA
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto mb-6">
                        Registre suas medidas para descobrir seu <strong className="text-white">Score Shape-V</strong> e
                        receber seu plano personalizado de evolução.
                    </p>
                    <button
                        onClick={onGoToMeasurements}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                    >
                        📏 REGISTRAR MINHAS MEDIDAS
                    </button>
                    <p className="text-gray-600 text-xs mt-4 font-medium">
                        ⏱️ Leva apenas 5 minutos
                    </p>
                </div>

                <div className="mt-12 text-center">
                    <span className="text-zinc-700 font-black text-[10px] tracking-widest uppercase">
                        ✨ POWERED BY VITRU IA
                    </span>
                </div>
            </div>
        );
    }

    // ---- Estado: Com avaliação — HOME COMPLETA v2.0 ----
    return (
        <div className="min-h-screen bg-[#060B18] text-white pb-4">
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

            {/* Card de Consistência */}
            {dadosConsistencia && (
                <CardConsistencia dados={dadosConsistencia} />
            )}

            {/* 3.3 Botão "VER TREINO DE HOJE" (Centralizado, estilo Primário) */}
            <div className="max-w-2xl mx-auto px-6 mt-6 mb-6">
                <button
                    onClick={() => onGoToPortal('hoje')}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-4 rounded-xl font-black tracking-widest text-sm uppercase transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    <Play size={18} fill="white" />
                    VER TREINO DE HOJE
                </button>
            </div>

            {/* 3.1 Proporção Principal: Shape-V */}
            {ombrosAtual > 0 && (
                <CardIndicadorProgresso
                    label="Largura de Ombros"
                    valorAtual={ombrosAtual}
                    valorMeta={ombrosMeta12M}
                    valorBasal={ombrosBasal}
                    unidade="cm"
                    cor="#8B5CF6"
                />
            )}

            {/* 3.1.2 Medida: Cintura (Redução) */}
            {cinturaAtual > 0 && (
                <CardIndicadorProgresso
                    label="Circunferência de Cintura"
                    valorAtual={cinturaAtual}
                    valorMeta={cinturaMeta12M}
                    valorBasal={cinturaBasal}
                    unidade="cm"
                    isInverse={true}
                    cor="#F59E0B"
                />
            )}

            {/* 3.2 Percentual de Gordura */}
            {bfAtual > 0 && (
                <CardIndicadorProgresso
                    label="Percentual de Gordura"
                    valorAtual={bfAtual}
                    valorMeta={bfMeta}
                    valorBasal={bfBasal}
                    unidade="%"
                    isInverse={true}
                    cor="#F59E0B"
                />
            )}

            {/* 4. Card Ranking (Hall dos Deuses) */}
            <CardRanking
                contexto="academia"
                nomeContexto="ACADEMIA"
                posicaoGeral={47}
                totalParticipantes={312}
                percentilGeral={15}
                posicaoEvolucao={12}
                percentilEvolucao={4}
                movimentoGeral={5}
                movimentoEvolucao={-2}
                atletaParticipa={true}
            />

            {/* 6. Ações Rápidas */}
            <AcoesRapidas acoes={acoes} />

            {/* 7. Footer */}
            <FooterUltimaMedicao
                dataUltimaMedida={lastMedida ? new Date(lastMedida.data) : new Date()}
                diasDesdeUltima={diasDesdeUltima}
                statusMedicao={statusMedicao}
            />

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
            />
        </div>
    );
}
