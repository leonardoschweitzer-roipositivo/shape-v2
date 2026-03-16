// supabase/functions/get_avaliacao_completa/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { validarAcessoAtleta, jsonResponse, errorResponse, badRequestResponse } from '../_shared/auth_helper.ts'

Deno.serve(async (req) => {
    try {
        // 1. Receber os parâmetros enviados pelo Vitruvius Phidias
        const { auth_user_id, role, atleta_id } = await req.json()

        if (!auth_user_id || !role) {
            return badRequestResponse("Parâmetros 'auth_user_id' e 'role' são obrigatórios.")
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        )

        // 2. Validação de Segurança (O Muro)
        // O auth_helper garante que um Personal só acede aos seus próprios alunos.
        const target_id = role === 'ATLETA' ? auth_user_id : atleta_id;
        const acesso = await validarAcessoAtleta(supabase, auth_user_id, role, target_id)

        if (!acesso.permitido) {
            return errorResponse(403, "Acesso negado. Não tem permissão para visualizar a avaliação deste atleta.")
        }

        const id_busca = acesso.atleta_id || target_id;

        // 3. Buscar os dados mais recentes do atleta
        const { data: atleta, error: erroAtleta } = await supabase
            .from('atletas')
            .select(`
        id, 
        altura,
        peso_atual,
        sexo,
        medidas (
          peso,
          gordura_percentual,
          ombros,
          cintura,
          braco_dir,
          braco_esq,
          coxa_dir,
          coxa_esq
        )
      `)
            .eq('id', id_busca)
            .order('created_at', { referencedTable: 'medidas', ascending: false })
            .limit(1, { referencedTable: 'medidas' })
            .single()

        if (erroAtleta || !atleta) {
            return errorResponse(404, "Atleta não encontrado ou sem medidas registadas.")
        }

        const ultimaMedida = atleta.medidas?.[0]
        if (!ultimaMedida) {
            return errorResponse(404, "Não existem medidas registadas para este atleta para calcular os scores.")
        }

        // 4. O CÉREBRO MATEMÁTICO (Cálculos de Phidias)

        // Altura em metros para o FFMI
        const alturaM = atleta.altura / 100
        const peso = ultimaMedida.peso || atleta.peso_atual
        const gordura = ultimaMedida.gordura_percentual || 15 // Valor default caso não tenha

        // Cálculo da Massa Magra e FFMI (Fat-Free Mass Index)
        const massaMagra = peso * (1 - (gordura / 100))
        const ffmi = alturaM > 0 ? (massaMagra / (alturaM * alturaM)) : 0

        // Cálculos de Proporção Áurea (Phi ≈ 1.618) e V-Shape
        const ombros = ultimaMedida.ombros || 0
        const cintura = ultimaMedida.cintura || 0
        const proporcao_ombro_cintura = cintura > 0 ? ombros / cintura : 0
        const ideal_phi = 1.618

        // Quão perto está de Phi? (Percentagem do V-Shape)
        let v_shape_pct = 0;
        if (proporcao_ombro_cintura > 0) {
            v_shape_pct = proporcao_ombro_cintura >= ideal_phi
                ? 100
                : (proporcao_ombro_cintura / ideal_phi) * 100;
        }

        // Simetria Bilateral (Diferença absoluta em cm)
        const diff_bracos = Math.abs((ultimaMedida.braco_dir || 0) - (ultimaMedida.braco_esq || 0))
        const diff_coxas = Math.abs((ultimaMedida.coxa_dir || 0) - (ultimaMedida.coxa_esq || 0))

        // Score de Simetria (Perde pontos por cada cm de diferença)
        let score_simetria = 100 - (diff_bracos * 2.5) - (diff_coxas * 2.0)
        score_simetria = Math.max(0, Math.min(100, score_simetria)) // Manter entre 0 e 100

        // Score Geral Fictício/Ponderado (Pode ajustar os pesos conforme a sua lógica real)
        const score_geral = (v_shape_pct * 0.5) + (score_simetria * 0.3) + (ffmi > 20 ? 20 : 10)

        // 5. Retornar os dados respeitando o contrato YAML
        return jsonResponse({
            composicao_corporal: {
                peso_kg: Number(peso.toFixed(1)),
                gordura_percentual: Number(gordura.toFixed(1)),
                ffmi: Number(ffmi.toFixed(2))
            },
            proporcoes_aureas: {
                ombros_cintura: Number(proporcao_ombro_cintura.toFixed(3)),
                score_proporcoes: Number(v_shape_pct.toFixed(1)),
                v_shape_percentual: Number(v_shape_pct.toFixed(1))
            },
            simetria: {
                bracos_diff_cm: Number(diff_bracos.toFixed(1)),
                coxas_diff_cm: Number(diff_coxas.toFixed(1)),
                score_simetria: Number(score_simetria.toFixed(1))
            },
            score_geral: Number(Math.min(100, score_geral).toFixed(1))
        })

    } catch (err) {
        console.error("Erro em get_avaliacao_completa:", err)
        return errorResponse(500, "Erro interno ao calcular a avaliação.")
    }
})