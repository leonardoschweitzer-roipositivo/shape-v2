/**
 * Macro Estimator — Estima macros a partir de texto
 * 
 * Usa um banco local de alimentos comuns para estimar calorias e macros.
 * Processa texto livre como "200g frango, arroz e salada".
 */

export interface MacroEstimativa {
    alimento: string;
    porcaoG: number;
    calorias: number;
    proteina: number;
    carboidrato: number;
    gordura: number;
}

export interface ResultadoEstimativa {
    itens: MacroEstimativa[];
    total: {
        calorias: number;
        proteina: number;
        carboidrato: number;
        gordura: number;
    };
    textoOriginal: string;
}

// Banco de alimentos por 100g
interface AlimentoDB {
    nomes: string[];          // aliases para matching
    cal: number;              // kcal/100g
    prot: number;             // g/100g
    carb: number;             // g/100g
    gord: number;             // g/100g
    porcaoPadrao: number;     // porção padrão em gramas se não especificada
}

const ALIMENTOS: AlimentoDB[] = [
    // PROTEÍNAS
    { nomes: ['frango', 'peito de frango', 'frango grelhado'], cal: 165, prot: 31, carb: 0, gord: 3.6, porcaoPadrao: 150 },
    { nomes: ['carne', 'carne bovina', 'patinho', 'alcatra', 'filé'], cal: 198, prot: 26, carb: 0, gord: 10, porcaoPadrao: 150 },
    { nomes: ['carne moída', 'carne moida'], cal: 212, prot: 24, carb: 0, gord: 12, porcaoPadrao: 150 },
    { nomes: ['peixe', 'tilápia', 'tilapia', 'pescada'], cal: 96, prot: 20, carb: 0, gord: 1.7, porcaoPadrao: 150 },
    { nomes: ['salmão', 'salmao'], cal: 208, prot: 20, carb: 0, gord: 13, porcaoPadrao: 120 },
    { nomes: ['atum', 'atum em lata'], cal: 116, prot: 26, carb: 0, gord: 0.8, porcaoPadrao: 80 },
    { nomes: ['ovo', 'ovos', 'ovo cozido', 'ovo mexido'], cal: 155, prot: 13, carb: 1.1, gord: 11, porcaoPadrao: 50 },
    { nomes: ['whey', 'shake', 'whey protein', 'scoop'], cal: 120, prot: 25, carb: 3, gord: 1.5, porcaoPadrao: 30 },
    { nomes: ['queijo', 'queijo branco', 'queijo minas'], cal: 264, prot: 17, carb: 3, gord: 20, porcaoPadrao: 30 },
    { nomes: ['iogurte', 'iogurte grego', 'iogurte natural'], cal: 59, prot: 10, carb: 3.6, gord: 0.7, porcaoPadrao: 170 },
    { nomes: ['presunto', 'peito de peru'], cal: 105, prot: 17, carb: 1.5, gord: 3, porcaoPadrao: 30 },

    // CARBOIDRATOS
    { nomes: ['arroz', 'arroz branco', 'arroz integral'], cal: 130, prot: 2.7, carb: 28, gord: 0.3, porcaoPadrao: 150 },
    { nomes: ['macarrão', 'macarrao', 'massa', 'espaguete', 'penne'], cal: 131, prot: 5, carb: 25, gord: 1.1, porcaoPadrao: 200 },
    { nomes: ['batata doce', 'batata-doce'], cal: 86, prot: 1.6, carb: 20, gord: 0.1, porcaoPadrao: 150 },
    { nomes: ['batata', 'batata inglesa', 'purê', 'pure'], cal: 77, prot: 2, carb: 17, gord: 0.1, porcaoPadrao: 150 },
    { nomes: ['pão', 'pao', 'pão integral', 'pao integral', 'torrada'], cal: 265, prot: 9, carb: 49, gord: 3.2, porcaoPadrao: 50 },
    { nomes: ['tapioca'], cal: 130, prot: 0.1, carb: 32, gord: 0, porcaoPadrao: 50 },
    { nomes: ['aveia', 'mingau', 'mingau de aveia'], cal: 389, prot: 17, carb: 66, gord: 7, porcaoPadrao: 40 },
    { nomes: ['banana'], cal: 89, prot: 1.1, carb: 23, gord: 0.3, porcaoPadrao: 120 },
    { nomes: ['maçã', 'maca'], cal: 52, prot: 0.3, carb: 14, gord: 0.2, porcaoPadrao: 150 },
    { nomes: ['feijão', 'feijao'], cal: 127, prot: 8.7, carb: 21, gord: 0.5, porcaoPadrao: 80 },
    { nomes: ['mandioca', 'aipim'], cal: 160, prot: 1.4, carb: 38, gord: 0.3, porcaoPadrao: 100 },
    { nomes: ['granola'], cal: 471, prot: 10, carb: 64, gord: 20, porcaoPadrao: 40 },
    { nomes: ['cereal', 'sucrilhos'], cal: 357, prot: 7, carb: 84, gord: 0.8, porcaoPadrao: 30 },

    // GORDURAS
    { nomes: ['azeite', 'azeite de oliva'], cal: 884, prot: 0, carb: 0, gord: 100, porcaoPadrao: 10 },
    { nomes: ['manteiga'], cal: 717, prot: 0.9, carb: 0.1, gord: 81, porcaoPadrao: 10 },
    { nomes: ['amendoim', 'pasta de amendoim', 'amendoim pasta'], cal: 567, prot: 26, carb: 16, gord: 49, porcaoPadrao: 20 },
    { nomes: ['castanha', 'castanhas', 'nuts', 'nozes'], cal: 607, prot: 15, carb: 21, gord: 54, porcaoPadrao: 20 },
    { nomes: ['abacate'], cal: 160, prot: 2, carb: 8.5, gord: 15, porcaoPadrao: 100 },
    { nomes: ['coco', 'coco ralado'], cal: 354, prot: 3.3, carb: 15, gord: 33, porcaoPadrao: 20 },

    // VEGETAIS / SALADA
    { nomes: ['salada', 'alface', 'rúcula', 'rucula', 'folhas'], cal: 15, prot: 1.4, carb: 2, gord: 0.2, porcaoPadrao: 80 },
    { nomes: ['tomate'], cal: 18, prot: 0.9, carb: 3.9, gord: 0.2, porcaoPadrao: 80 },
    { nomes: ['brócolis', 'brocolis'], cal: 34, prot: 2.8, carb: 7, gord: 0.4, porcaoPadrao: 80 },
    { nomes: ['legumes', 'vegetais', 'verduras'], cal: 25, prot: 2, carb: 4, gord: 0.3, porcaoPadrao: 100 },
    { nomes: ['cenoura'], cal: 41, prot: 0.9, carb: 10, gord: 0.2, porcaoPadrao: 80 },

    // LATICÍNIOS / BEBIDAS
    { nomes: ['leite', 'leite integral'], cal: 61, prot: 3.2, carb: 4.8, gord: 3.3, porcaoPadrao: 200 },
    { nomes: ['leite desnatado', 'leite zero'], cal: 35, prot: 3.4, carb: 5, gord: 0.1, porcaoPadrao: 200 },
    { nomes: ['café', 'cafe', 'café com leite'], cal: 30, prot: 1.5, carb: 3, gord: 1, porcaoPadrao: 200 },
    { nomes: ['suco', 'suco de laranja', 'suco natural'], cal: 45, prot: 0.7, carb: 10, gord: 0.2, porcaoPadrao: 250 },
    { nomes: ['refrigerante', 'coca', 'coca-cola'], cal: 42, prot: 0, carb: 11, gord: 0, porcaoPadrao: 350 },

    // REFEIÇÕES PRONTAS
    { nomes: ['pizza'], cal: 266, prot: 11, carb: 33, gord: 10, porcaoPadrao: 100 },
    { nomes: ['hambúrguer', 'hamburger', 'hamburguer', 'burger'], cal: 295, prot: 17, carb: 24, gord: 14, porcaoPadrao: 200 },
    { nomes: ['açaí', 'acai'], cal: 58, prot: 1, carb: 6, gord: 3.5, porcaoPadrao: 300 },
    { nomes: ['crepioca'], cal: 150, prot: 10, carb: 15, gord: 5, porcaoPadrao: 100 },
];

/**
 * Normaliza texto removendo acentos
 */
function normalizar(texto: string): string {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

/**
 * Extrai porção em gramas do texto (ex: "200g", "2 scoops", "3 ovos")
 */
function extrairPorcao(texto: string, alimentoDB: AlimentoDB): number {
    // Busca padrão "XXXg" ou "XXX g"
    const matchG = texto.match(/(\d+)\s*g\b/i);
    if (matchG) return parseInt(matchG[1]);

    // Busca padrão "XXXml"
    const matchMl = texto.match(/(\d+)\s*ml\b/i);
    if (matchMl) return parseInt(matchMl[1]);

    // Busca quantidade numérica (ex: "2 ovos", "3 fatias")
    const matchQtd = texto.match(/(\d+)\s/);
    if (matchQtd) {
        const qtd = parseInt(matchQtd[1]);
        return qtd * alimentoDB.porcaoPadrao;
    }

    // Sem porção especificada, usa padrão
    return alimentoDB.porcaoPadrao;
}

/**
 * Encontra alimento no banco local
 */
function encontrarAlimento(textoItem: string): AlimentoDB | null {
    const normalizado = normalizar(textoItem);

    // Tentar match exato primeiro, depois parcial
    for (const alimento of ALIMENTOS) {
        for (const nome of alimento.nomes) {
            if (normalizado.includes(normalizar(nome))) {
                return alimento;
            }
        }
    }
    return null;
}

/**
 * Processa texto de refeição e estima macros
 */
export function estimarMacros(texto: string): ResultadoEstimativa {
    // Separar itens por vírgula, ponto, "e", "+"
    const itensRaw = texto
        .split(/[,;+]|\be\b/gi)
        .map(s => s.trim())
        .filter(s => s.length > 2);

    const itens: MacroEstimativa[] = [];

    for (const itemTexto of itensRaw) {
        const alimento = encontrarAlimento(itemTexto);
        if (!alimento) {
            // Item não reconhecido — pular
            continue;
        }

        const porcaoG = extrairPorcao(itemTexto, alimento);
        const fator = porcaoG / 100;

        itens.push({
            alimento: alimento.nomes[0],
            porcaoG,
            calorias: Math.round(alimento.cal * fator),
            proteina: Math.round(alimento.prot * fator * 10) / 10,
            carboidrato: Math.round(alimento.carb * fator * 10) / 10,
            gordura: Math.round(alimento.gord * fator * 10) / 10,
        });
    }

    const total = itens.reduce(
        (acc, item) => ({
            calorias: acc.calorias + item.calorias,
            proteina: acc.proteina + item.proteina,
            carboidrato: acc.carboidrato + item.carboidrato,
            gordura: acc.gordura + item.gordura,
        }),
        { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 }
    );

    // Arredondar totais
    total.proteina = Math.round(total.proteina * 10) / 10;
    total.carboidrato = Math.round(total.carboidrato * 10) / 10;
    total.gordura = Math.round(total.gordura * 10) / 10;

    return {
        itens,
        total,
        textoOriginal: texto,
    };
}
