/**
 * Vitruvius AI Service
 *
 * Serviço central de IA usando Google Gemini.
 * Usado pelo Chat do Coach e pelos 4 processos core (Diagnóstico, Treino, Dieta, Avaliação).
 */

import { GoogleGenerativeAI, type GenerativeModel, type ChatSession, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import type { DiagnosticoDados } from './calculations/diagnostico'
import type { PlanoTreino } from './calculations/treino'
import type { PlanoDieta } from './calculations/dieta'
import { diagnosticoParaTexto, treinoParaTexto, dietaParaTexto, getFontesCientificas } from './vitruviusContext'
import { supabase } from './supabase'
import { useAuthStore } from '@/stores/authStore'

// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY // Removido fallback hardcoded para segurança

let genAI: GoogleGenerativeAI | null = null
let model: GenerativeModel | null = null

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

function getModel(): GenerativeModel | null {
    if (!API_KEY) {
        console.warn('[VitruviusAI] VITE_GEMINI_API_KEY não configurada')
        return null
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(API_KEY)
    }

    if (!model) {
        model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 1024,
            },
            safetySettings,
        })
    }

    return model
}

// Modelo com configuração otimizada para geração estruturada (JSON)
let generateModel: GenerativeModel | null = null

function getGenerateModel(): GenerativeModel | null {
    if (!API_KEY) {
        console.warn('[VitruviusAI] VITE_GEMINI_API_KEY não configurada')
        return null
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(API_KEY)
    }

    if (!generateModel) {
        generateModel = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.4,
                topP: 0.85,
                maxOutputTokens: 8192,
                responseMimeType: 'application/json',
            },
            safetySettings,
        })
    }

    return generateModel
}

// ==========================================
// GERAÇÃO ESTRUTURADA (DIAGNÓSTICO, TREINO, DIETA, AVALIAÇÃO)
// ==========================================

/**
 * Gera conteúdo estruturado (JSON) via Gemini.
 * Usado pelos 4 processos core para gerar partes narrativas/qualitativas.
 * Inclui retry automático (1 tentativa) para erros transientes.
 *
 * @param prompt - Prompt completo (system + contexto + instrução)
 * @returns JSON parseado ou null se falhar
 */
export async function gerarConteudoIA<T = unknown>(prompt: string): Promise<T | null> {
    const aiModel = getGenerateModel()

    if (!aiModel) {
        console.warn('[VitruviusAI] ❌ Modelo não disponível (API Key faltando ou erro na inicialização). Insights IA NÃO serão gerados — fallback ativado.')
        return null
    }

    const MAX_RETRIES = 1;
    let lastError: unknown = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            if (attempt > 0) {
                console.info(`[VitruviusAI] 🔄 Retry #${attempt}...`);
                await new Promise(r => setTimeout(r, 2000 * attempt)); // backoff
            }

            const modelName = aiModel.model
            console.info(`[VitruviusAI] 🚀 Gerando conteúdo IA com ${modelName}... Prompt: ${prompt.length} chars (attempt ${attempt + 1}/${MAX_RETRIES + 1})`)
            const result = await aiModel.generateContent(prompt)
            const response = result.response
            const text = response.text()

            if (!text) {
                console.warn('[VitruviusAI] Resposta vazia do Gemini')
                lastError = new Error('Empty response');
                continue; // retry
            }

            console.debug('[VitruviusAI] Raw response length:', text.length)

            // Limpeza robusta: tenta encontrar o primeiro { e o último }
            let jsonContent = text.trim()
            const firstBrace = jsonContent.indexOf('{')
            const lastBrace = jsonContent.lastIndexOf('}')

            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                jsonContent = jsonContent.substring(firstBrace, lastBrace + 1)
            } else {
                jsonContent = jsonContent
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim()
            }

            try {
                const parsed = JSON.parse(jsonContent) as T
                console.info('[VitruviusAI] ✅ Conteúdo IA gerado e parseado com sucesso')
                return parsed
            } catch (parseError) {
                console.error('[VitruviusAI] ❌ Erro ao parsear JSON:', parseError)
                console.error('[VitruviusAI] Conteúdo que falhou (primeiros 500 chars):', jsonContent.substring(0, 500))
                lastError = parseError;
                continue; // retry
            }
        } catch (error: unknown) {
            lastError = error;
            const errMsg = error instanceof Error ? error.message : String(error);

            if (errMsg.includes('SAFETY')) {
                console.error('[VitruviusAI] ⚠️ Bloqueado por filtro de segurança — sem retry')
                break; // no retry for safety
            } else if (errMsg.includes('429') || errMsg.includes('QUOTA') || errMsg.includes('RESOURCE_EXHAUSTED')) {
                console.error('[VitruviusAI] ⚠️ Limite de cota atingido (429/QUOTA) — fallback será usado')
                // retry might help after backoff
                continue;
            } else {
                console.error(`[VitruviusAI] ❌ Erro na geração (attempt ${attempt + 1}):`, errMsg)
                continue; // retry
            }
        }
    }

    console.warn('[VitruviusAI] ❌ Todas as tentativas falharam — FALLBACK será usado (textos instantâneos)', lastError);
    return null
}

// ==========================================
// CONTEXTO DO ATLETA (SYSTEM PROMPT)
// ==========================================

export interface AtletaContextoIA {
    nome: string
    sexo?: string
    idade?: number
    altura?: number
    peso?: number
    gorduraPct?: number
    score?: number
    classificacao?: string
    objetivo?: string
    // Dados do dia
    treinoHoje?: string
    treinoStatus?: string
    caloriasConsumidas?: number
    caloriasMeta?: number
    proteinaConsumida?: number
    proteinaMeta?: number
    aguaLitros?: number
    sonoHoras?: number
    dorLocal?: string
    // Personal
    personalNome?: string
    // Plano de Evolução completo
    diagnostico?: DiagnosticoDados | null
    planoTreino?: PlanoTreino | null
    planoDieta?: PlanoDieta | null
}

function buildSystemPrompt(ctx: AtletaContextoIA): string {
    // === Bloco: Plano de Evolução ===
    let planoEvolucaoTexto = ''

    if (ctx.diagnostico) {
        planoEvolucaoTexto += `\n\n## 📋 DIAGNÓSTICO DO ATLETA (Plano de Evolução — Etapa 1)\n${diagnosticoParaTexto(ctx.diagnostico)}`
    }

    if (ctx.planoTreino) {
        planoEvolucaoTexto += `\n\n## 🏋️ PLANO DE TREINO (Plano de Evolução — Etapa 2)\n`
        planoEvolucaoTexto += `Objetivo: ${ctx.planoTreino.objetivo}\n`
        planoEvolucaoTexto += treinoParaTexto(ctx.planoTreino)
        if (ctx.planoTreino.observacoes) {
            planoEvolucaoTexto += `\n\n### Observações do Plano\n${ctx.planoTreino.observacoes.resumo}`
            if (ctx.planoTreino.observacoes.pontosAtencao?.length) {
                planoEvolucaoTexto += `\n\n### Pontos de Atenção\n${ctx.planoTreino.observacoes.pontosAtencao.map(p => `- ${p}`).join('\n')}`
            }
        }
    }

    if (ctx.planoDieta) {
        planoEvolucaoTexto += `\n\n## 🥗 PLANO DE DIETA (Plano de Evolução — Etapa 3)\n`
        planoEvolucaoTexto += dietaParaTexto(ctx.planoDieta)
        if (ctx.planoDieta.estrategiaPrincipal) {
            planoEvolucaoTexto += `\n\n### Estratégia Principal\n${ctx.planoDieta.estrategiaPrincipal}`
        }
        if (ctx.planoDieta.contextoConsiderado?.length) {
            planoEvolucaoTexto += `\n\n### Contexto Considerado\n${ctx.planoDieta.contextoConsiderado.map(c => `- ${c}`).join('\n')}`
        }
    }

    // === Bloco: Fontes Científicas ===
    const fontesCientificas = [
        getFontesCientificas('diagnostico'),
        getFontesCientificas('treino'),
        getFontesCientificas('dieta'),
    ].filter(Boolean).join('\n\n')

    const temPlanoEvolucao = !!(ctx.diagnostico || ctx.planoTreino || ctx.planoDieta)

    return `Você é o **Vitrúvio**, coach de IA do aplicativo VITRU IA — uma plataforma de avaliação física baseada nas Proporções Áureas de Vitrúvio.

## Sua Personalidade
- Motivador mas realista
- Linguagem direta, clara, sem enrolação
- Use emojis com moderação (1-2 por mensagem)
- Responda em português brasileiro
- Seja conciso (máximo 3-4 parágrafos)
- Nunca invente dados que não tem — diga "não tenho essa informação" se necessário
- ${temPlanoEvolucao ? 'SEMPRE se baseie nos dados reais do Plano de Evolução do atleta (diagnóstico, treino e dieta) fornecidos abaixo.' : 'O atleta ainda não tem um Plano de Evolução gerado. Responda de forma geral e incentive a criação do plano.'}
- Quando citar dados científicos, baseie-se EXCLUSIVAMENTE na biblioteca científica fornecida abaixo.

## Sobre o Atleta
- Nome: ${ctx.nome}
${ctx.sexo ? `- Sexo: ${ctx.sexo}` : ''}
${ctx.idade ? `- Idade: ${ctx.idade} anos` : ''}
${ctx.altura ? `- Altura: ${ctx.altura} cm` : ''}
${ctx.peso ? `- Peso: ${ctx.peso} kg` : ''}
${ctx.gorduraPct ? `- Gordura corporal: ${ctx.gorduraPct}%` : ''}
${ctx.score ? `- Score Vitrúvio: ${ctx.score}/100 (${ctx.classificacao || 'N/A'})` : ''}
${ctx.objetivo ? `- Objetivo: ${ctx.objetivo}` : ''}
${ctx.personalNome ? `- Personal Trainer: ${ctx.personalNome}` : ''}

## Dados de Hoje
${ctx.treinoHoje ? `- Treino: ${ctx.treinoHoje} (status: ${ctx.treinoStatus || 'pendente'})` : '- Sem treino definido para hoje'}
${ctx.caloriasMeta ? `- Calorias: ${ctx.caloriasConsumidas || 0} / ${ctx.caloriasMeta} kcal` : ''}
${ctx.proteinaMeta ? `- Proteína: ${ctx.proteinaConsumida || 0}g / ${ctx.proteinaMeta}g` : ''}
${ctx.aguaLitros !== undefined ? `- Água: ${ctx.aguaLitros}L` : ''}
${ctx.sonoHoras ? `- Sono: ${ctx.sonoHoras}h` : ''}
${ctx.dorLocal ? `- ⚠️ Reportou dor: ${ctx.dorLocal}` : ''}
${planoEvolucaoTexto}

## 📚 BIBLIOTECA CIENTÍFICA (Use como base para fundamentar suas respostas)
${fontesCientificas}

## Regras Importantes
1. Você NÃO substitui o Personal Trainer. Se o atleta perguntar algo que depende do Personal, diga "Converse com seu Personal ${ctx.personalNome || ''} sobre isso".
2. Para dores SEVERAS, sempre recomende procurar um profissional de saúde.
3. Não prescreva medicamentos ou suplementos com dosagens específicas.
4. Sempre incentive consistência acima de intensidade.
5. Use os dados do atleta para contextualizar suas respostas — especialmente o Plano de Evolução.
6. Quando o atleta reportar uma refeição (ex: "comi 200g de frango"), reconheça e dê feedback sobre os macros baseado no plano de dieta dele.
7. Quando perguntar sobre treino, use os dados reais do plano dele (exercícios, séries, divisão, prioridades).
8. Quando perguntar sobre proporções, metas ou prioridades, use os dados do diagnóstico.
9. Fundamente recomendações na biblioteca científica quando possível (cite autores/estudos).
10. Se o atleta perguntar algo fora do escopo do plano, responda com base no conhecimento geral mas mantenha alinhamento com o objetivo dele.`
}


// ==========================================
// CHAT SESSION MANAGEMENT
// ==========================================

// Cache de sessões de chat por atleta
const chatSessions = new Map<string, ChatSession>()

/**
 * Envia mensagem para o Vitrúvio e recebe resposta
 * Agora via Supabase Edge Function para integração com Google Cloud Agent
 */
export async function enviarMensagemIA(
    atletaId: string,
    mensagem: string,
    contexto: AtletaContextoIA, // Mantido por compatibilidade de assinatura, mas a função busca novos dados
    historicoMensagens?: Array<{ role: 'user' | 'model'; content: string }>,
    sessionId?: string,
    authUserId?: string
): Promise<string> {
    try {
        console.info(`[VitruviusAI] 🚀 Enviando mensagem para o agente via Edge Function...`);
        
        // Prioridade para o ID passado explicitamente (blindagem contra mixing)
        const finalAuthId = authUserId || useAuthStore.getState().user?.id;
        const role = useAuthStore.getState().profile?.role?.toUpperCase() || 'ATLETA';
        
        const payload = {
            atletaId,
            mensagem,
            vitru_auth_user_id: finalAuthId, // UUID blindado contra colisões
            role: role,
            historico: historicoMensagens?.slice(-10),
            sessionId // ID da conversa (lixeira)
        };

        console.info('[VitruviusAI] 🟢 PAYLOAD FINAL PARA EDGE FUNCTION:', {
            atletaId: payload.atletaId,
            auth_user_id: payload.auth_user_id,
            sessionId: payload.sessionId,
            role: payload.role
        });
        
        const { data, error } = await supabase.functions.invoke('vitruvius-agent', {
            body: payload
        });

        if (error) {
            console.error('[VitruviusAI] Erro retornado pela Edge Function:', error);
            throw error;
        }
        
        return data.response || 'Desculpe, tive um problema ao processar sua mensagem.';

    } catch (error) {
        console.error('[VitruviusAI] Erro na chamada via Edge Function:', error);
        
        // Se a Edge Function falhar, ainda tentamos o fallback local para não deixar o usuário no vácuo
        return gerarRespostaFallback(mensagem, contexto);
    }
}

// ==========================================
// CHAT PARA REVISÃO DE PLANO (PERSONAL ↔ VITRÚVIO)
// ==========================================

function buildPlanoReviewPrompt(
    tipo: 'treino' | 'dieta' | 'diagnostico',
    nomeAtleta: string,
    planoTexto: string,
    perfilTexto: string,
    fontesCientificas: string,
): string {
    const tipoLabel = tipo === 'treino' ? 'Treino' : tipo === 'dieta' ? 'Dieta' : 'Diagnóstico'
    return `Você é o **Vitrúvio IA**, consultor científico de treinamento e nutrição esportiva do app VITRU IA.

## Contexto desta Conversa
Você está conversando com o **Personal Trainer** responsável pelo atleta. Essa é uma conversa entre profissionais.
O Personal acabou de receber o ${tipo === 'diagnostico' ? 'Diagnóstico' : 'Plano de ' + tipoLabel} que você gerou e pode querer debater, ajustar ou questionar qualquer aspecto.

## Sua Postura Profissional
- Trate o Personal como **colega profissional** — linguagem técnica é bem-vinda
- Sempre **fundamente** recomendações com evidências científicas quando possível
- Se o Personal discordar, apresente **alternativas válidas** com prós/contras
- Nunca diga "você deveria fazer", diga "a evidência sugere que..." ou "uma alternativa seria..."
- Respeite que o Personal conhece o aluno pessoalmente — ele tem informações que você não tem
- Seja conciso mas completo — máximo 3-4 parágrafos por resposta
- Use formatação com **negrito** para dados importantes
- Responda em português brasileiro
- Use emojis com moderação (1-2 por mensagem)

## Perfil do Atleta
${perfilTexto}

## ${tipo === 'diagnostico' ? 'Diagnóstico' : 'Plano de ' + tipoLabel} Gerado
${planoTexto}

## Fontes Científicas Disponíveis
${fontesCientificas}

## Regras
1. NÃO prescreva medicamentos ou dosagens de suplementos
2. Para dores severas, recomende avaliação de profissional de saúde
3. Se não tiver certeza, diga "essa decisão é melhor com o Personal que conhece o aluno"
4. Quando sugerir trocas de exercício, sempre explique a razão biomecânica
5. Quando discutir macros/calorias, cite as faixas aceitas na literatura`
}

/**
 * Envia mensagem para o Vitrúvio no contexto de revisão de plano (Personal ↔ IA)
 * Também migrado para a Edge Function
 */
export async function enviarMensagemPlanoReview(
    atletaId: string,
    tipo: 'treino' | 'dieta' | 'diagnostico',
    mensagem: string,
    nomeAtleta: string,
    planoTexto: string,
    perfilTexto: string,
    fontesCientificas: string,
    historicoMensagens?: Array<{ role: 'user' | 'model'; content: string }>
): Promise<string> {
    try {
        const authStore = useAuthStore.getState();
        const { data, error } = await supabase.functions.invoke('vitruvius-agent', {
            body: {
                atletaId,
                mensagem: `[REVISÃO DE ${tipo.toUpperCase()}] ${mensagem}`,
                auth_user_id: authStore.user?.id,
                role: authStore.profile?.role?.toUpperCase() || 'ATLETA',
                historico: historicoMensagens,
                metadata: {
                    tipo_revisao: tipo,
                    plano_texto: planoTexto,
                    perfil_texto: perfilTexto
                }
            }
        });

        if (error) throw error;
        
        return data.response || 'Ocorreu um erro na comunicação com a IA.';

    } catch (error) {
        console.error('[VitruviusAI] Erro no chat de revisão via Edge Function:', error);
        return 'Ocorreu um erro na comunicação com a IA. Tente novamente em instantes.';
    }
}

/**
 * Limpa sessão de chat (ex: ao trocar de aba ou recarregar)
 */
export function limparSessaoChat(atletaId: string) {
    chatSessions.delete(atletaId)
    // Também limpar sessões de revisão de plano
    chatSessions.delete(`plano-treino-${atletaId}`)
    chatSessions.delete(`plano-dieta-${atletaId}`)
    chatSessions.delete(`plano-diagnostico-${atletaId}`)
}

/**
 * Extrai as diretrizes conversadas com o IA para aplicar no plano
 */
export async function extrairDiretrizesDoChat(
    atletaId: string,
    tipo: 'treino' | 'dieta' | 'diagnostico'
): Promise<string> {
    const aiModel = getModel();
    const sessionKey = `plano-${tipo}-${atletaId}`;
    let chat = chatSessions.get(sessionKey);

    if (!aiModel || !chat) {
        return '';
    }

    try {
        const result = await chat.sendMessage(
            "RESUMO DE DIRETRIZES: Por favor, analise a nossa conversa acima e extraia um resumo claro, direto e objetivo de TODAS AS ALTERAÇÕES que combinamos de fazer no plano. Não inclua texto explicativo, responda apenas com a lista de diretrizes (ex: 'Substituir exercício X por Y', 'Adicionar alimento Z'). Se não combinamos nenhuma alteração estrutural, explique brevemente que não houve mudanças."
        );
        return result.response.text();
    } catch (error) {
        console.error('[VitruviusAI] Erro ao extrair diretrizes:', error);
        return '';
    }
}

/**
 * Verifica se a IA está configurada
 */
export function isIAConfigurada(): boolean {
    return !!API_KEY
}

// ==========================================
// FALLBACK (sem API key ou erro)
// ==========================================

function gerarRespostaFallback(mensagem: string, ctx: AtletaContextoIA): string {
    const lower = mensagem.toLowerCase()

    if (lower.includes('refeição') || lower.includes('comer') || lower.includes('comi')) {
        return `Ótimo, ${ctx.nome}! Registrar refeições é essencial para acompanhar seus macros. ${ctx.proteinaMeta ? `Sua meta de proteína hoje é ${ctx.proteinaMeta}g — você já consumiu ${ctx.proteinaConsumida || 0}g.` : ''} Use o botão "Registrar Refeição" na tela principal para registrar! 🍽️`
    }

    if (lower.includes('treino') || lower.includes('treinar')) {
        if (ctx.treinoHoje) {
            return `Hoje seu treino é **${ctx.treinoHoje}** (${ctx.treinoStatus || 'pendente'}). Foco total! 💪`
        }
        return 'Hoje é dia de descanso! Aproveite para se recuperar. Boa alimentação e sono de qualidade fazem mágica. 😴'
    }

    if (lower.includes('água') || lower.includes('agua') || lower.includes('bebi')) {
        const agua = ctx.aguaLitros || 0
        return `Você está em ${agua}L de água hoje. ${agua < 2 ? 'Beba mais! A meta mínima é 2-3L por dia.' : 'Ótima hidratação!'} 💧`
    }

    if (lower.includes('dor') || lower.includes('machuc') || lower.includes('lesão')) {
        return `Vou registrar isso, ${ctx.nome}. 🤕\n\nSe a dor for intensa ou persistente, converse com seu Personal${ctx.personalNome ? ` ${ctx.personalNome}` : ''} antes do próximo treino. Segurança primeiro!`
    }

    if (lower.includes('proteína') || lower.includes('proteina') || lower.includes('macro')) {
        if (ctx.proteinaMeta) {
            const pct = ctx.proteinaMeta > 0 ? Math.round(((ctx.proteinaConsumida || 0) / ctx.proteinaMeta) * 100) : 0
            return `📊 Seus macros hoje:\n\n• Proteína: ${ctx.proteinaConsumida || 0}g / ${ctx.proteinaMeta}g (${pct}%)\n• Calorias: ${ctx.caloriasConsumidas || 0} / ${ctx.caloriasMeta || '?'} kcal\n\n${pct < 50 ? 'Ainda falta bastante! Que tal um shake ou peito de frango?' : 'Bom progresso!'}`
        }
        return 'Seu Personal ainda não gerou um plano de dieta. Peça a ele para criar pelo Vitrúvio IA!'
    }

    if (lower.includes('sono') || lower.includes('dormi')) {
        return `O sono é fundamental para recuperação muscular e produção hormonal. ${ctx.sonoHoras ? `Você dormiu ${ctx.sonoHoras}h. ${ctx.sonoHoras >= 7 ? 'Boa noite de sono!' : 'Tente dormir pelo menos 7-8h.'}` : 'Registre suas horas de sono no tracker rápido!'} 😴`
    }

    if (lower.includes('motivação') || lower.includes('desanimado') || lower.includes('cansado')) {
        return `${ctx.nome}, entendo que bate o cansaço, mas lembre-se: **consistência supera intensidade**! 🔥\n\n${ctx.score ? `Seu score Vitrúvio é ${ctx.score}. Cada dia de treino e dieta certinha te aproxima do próximo nível!` : 'Cada dia conta. Pequenos progressos diários = grandes resultados!'} 💪`
    }

    // Default
    return `${ctx.nome}, estou aqui para te ajudar! 💪\n\nPosso te ajudar com:\n• 🍽️ Registrar refeições\n• 🏋️ Dúvidas sobre treino\n• 💧 Hidratação\n• 📊 Macros e nutrição\n• 💪 Motivação\n\nO que precisa?`
}
