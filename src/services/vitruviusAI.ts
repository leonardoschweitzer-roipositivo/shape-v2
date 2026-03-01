/**
 * Vitruvius AI Service
 *
 * Serviço central de IA usando Google Gemini.
 * Usado pelo Chat do Coach e pelos 4 processos core (Diagnóstico, Treino, Dieta, Avaliação).
 */

import { GoogleGenerativeAI, type GenerativeModel, type ChatSession } from '@google/generative-ai'

// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI: GoogleGenerativeAI | null = null
let model: GenerativeModel | null = null

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
                maxOutputTokens: 4096,
                responseMimeType: 'application/json',
            },
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
 *
 * @param prompt - Prompt completo (system + contexto + instrução)
 * @returns JSON parseado ou null se falhar
 */
export async function gerarConteudoIA<T = any>(prompt: string): Promise<T | null> {
    const aiModel = getGenerateModel()

    if (!aiModel) {
        console.warn('[VitruviusAI] Modelo não disponível — usando fallback determinístico')
        return null
    }

    try {
        console.info('[VitruviusAI] Gerando conteúdo IA...')
        const result = await aiModel.generateContent(prompt)
        const text = result.response.text()

        if (!text) {
            console.warn('[VitruviusAI] Resposta vazia do Gemini')
            return null
        }

        // Limpar possíveis markdown code fences
        const cleaned = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()

        const parsed = JSON.parse(cleaned) as T
        console.info('[VitruviusAI] ✅ Conteúdo IA gerado com sucesso')
        return parsed
    } catch (error) {
        console.error('[VitruviusAI] Erro na geração:', error)
        return null
    }
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
}

function buildSystemPrompt(ctx: AtletaContextoIA): string {
    return `Você é o **Vitrúvio**, coach de IA do aplicativo VITRU IA — uma plataforma de avaliação física baseada nas Proporções Áureas de Vitrúvio.

## Sua Personalidade
- Motivador mas realista
- Linguagem direta, clara, sem enrolação
- Use emojis com moderação (1-2 por mensagem)
- Responda em português brasileiro
- Seja conciso (máximo 3-4 parágrafos)
- Nunca invente dados que não tem — diga "não tenho essa informação" se necessário

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

## Regras Importantes
1. Você NÃO substitui o Personal Trainer. Se o atleta perguntar algo que dependede do Personal, diga "Converse com seu Personal ${ctx.personalNome || ''} sobre isso".
2. Para dores SEVERAS, sempre recomende procurar um profissional de saúde.
3. Não prescreva medicamentos ou suplementos com dosagens específicas.
4. Sempre incentive consistência acima de intensidade.
5. Use os dados do atleta para contextualizar suas respostas.
6. Quando o atleta reportar uma refeição (ex: "comi 200g de frango"), reconheça e dê feedback sobre os macros.
7. Quando perguntar sobre treino, use os dados reais do plano dele.`
}

// ==========================================
// CHAT SESSION MANAGEMENT
// ==========================================

// Cache de sessões de chat por atleta
const chatSessions = new Map<string, ChatSession>()

/**
 * Envia mensagem para o Vitrúvio e recebe resposta
 */
export async function enviarMensagemIA(
    atletaId: string,
    mensagem: string,
    contexto: AtletaContextoIA,
    historicoMensagens?: Array<{ role: 'user' | 'model'; content: string }>
): Promise<string> {
    const aiModel = getModel()

    if (!aiModel) {
        return gerarRespostaFallback(mensagem, contexto)
    }

    try {
        // Criar ou reutilizar chat session
        let chat = chatSessions.get(atletaId)

        if (!chat) {
            const systemPrompt = buildSystemPrompt(contexto)

            // Montar histórico para a sessão
            const history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []

            // Adicionar mensagem de sistema como primeiro turno
            history.push({
                role: 'user',
                parts: [{ text: `[SISTEMA] ${systemPrompt}` }],
            })
            history.push({
                role: 'model',
                parts: [{ text: `Entendido! Sou o Vitrúvio, coach de IA do ${contexto.nome}. Estou pronto para ajudar! 💪` }],
            })

            // Adicionar histórico de mensagens anteriores (se houver)
            if (historicoMensagens && historicoMensagens.length > 0) {
                // Pegar últimas 20 mensagens para contexto
                const ultimas = historicoMensagens.slice(-20)
                for (const msg of ultimas) {
                    history.push({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }],
                    })
                }
            }

            chat = aiModel.startChat({ history })
            chatSessions.set(atletaId, chat)
        }

        // Enviar mensagem
        const result = await chat.sendMessage(mensagem)
        const response = result.response.text()

        return response || 'Desculpe, não consegui processar sua mensagem. Tente novamente!'

    } catch (error) {
        console.error('[VitruviusAI] Erro na chamada:', error)

        // Limpar sessão com erro para recriar na próxima
        chatSessions.delete(atletaId)

        return gerarRespostaFallback(mensagem, contexto)
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
 * Usa session key separada para não conflitar com o chat do atleta.
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
    const aiModel = getModel()
    const sessionKey = `plano-${tipo}-${atletaId}`

    if (!aiModel) {
        return `No momento estou offline, mas posso ajudar quando a conexão for restabelecida. Enquanto isso, analise o plano e anote suas dúvidas! 📝`
    }

    try {
        let chat = chatSessions.get(sessionKey)

        if (!chat) {
            const systemPrompt = buildPlanoReviewPrompt(tipo, nomeAtleta, planoTexto, perfilTexto, fontesCientificas)

            const history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = []

            history.push({
                role: 'user',
                parts: [{ text: `[SISTEMA] ${systemPrompt}` }],
            })
            history.push({
                role: 'model',
                parts: [{ text: `Entendido! Estou pronto para debater o ${tipo === 'diagnostico' ? 'diagnóstico' : 'plano de ' + (tipo === 'treino' ? 'treino' : 'dieta')} do(a) ${nomeAtleta} com você. Pode questionar qualquer aspecto! 💪` }],
            })

            if (historicoMensagens && historicoMensagens.length > 0) {
                const ultimas = historicoMensagens.slice(-20)
                for (const msg of ultimas) {
                    history.push({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }],
                    })
                }
            }

            chat = aiModel.startChat({ history })
            chatSessions.set(sessionKey, chat)
        }

        const result = await chat.sendMessage(mensagem)
        const response = result.response.text()

        return response || 'Desculpe, não consegui processar sua mensagem. Tente novamente!'

    } catch (error) {
        console.error('[VitruviusAI] Erro no chat de revisão:', error)
        chatSessions.delete(sessionKey)
        return 'Ocorreu um erro na comunicação com a IA. Tente novamente em instantes.'
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
