import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing env vars. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
    const academyEmail = 'academia@test.com';
    
    // 1. Get Academy ID
    console.log(`Buscando academia: ${academyEmail}`);
    const { data: academy, error: academyError } = await supabase
        .from('academias')
        .select('id')
        .eq('email', academyEmail)
        .single();

    if (academyError || !academy) {
        console.error('Academia não encontrada:', academyError?.message);
        return;
    }
    const academyId = academy.id;

    const personals = [
        { nome: 'Marcos Oliveira', email: 'marcos@vitru.com' },
        { nome: 'Juliana Costa', email: 'juliana@vitru.com' },
        { nome: 'Ricardo Silva', email: 'ricardo@vitru.com' }
    ];

    for (const p of personals) {
        console.log(`Criando personal: ${p.nome}`);
        const { data: personalData, error: personalError } = await supabase
            .from('personais')
            .insert({
                nome: p.nome,
                email: p.email,
                academia_id: academyId,
                status: 'ATIVO',
                plano: 'PRO'
            })
            .select('id')
            .single();

        if (personalError) {
            console.warn(`Erro ao criar personal ${p.nome}:`, personalError.message);
            continue;
        }

        const personalId = personalData.id;
        const athletes = [
            { nome: `${p.nome.split(' ')[0]} - Aluno 1`, email: `aluno1.${p.nome.split(' ')[0].toLowerCase()}@test.com` },
            { nome: `${p.nome.split(' ')[0]} - Aluno 2`, email: `aluno2.${p.nome.split(' ')[0].toLowerCase()}@test.com` }
        ];

        for (const a of athletes) {
            console.log(`  Criando aluno: ${a.nome}`);
            const { error: athleteError } = await supabase
                .from('atletas')
                .insert({
                    nome: a.nome,
                    email: a.email,
                    personal_id: personalId,
                    academia_id: academyId,
                    status: 'ATIVO'
                });
            
            if (athleteError) {
                console.warn(`  Erro ao criar aluno ${a.nome}:`, athleteError.message);
            }
        }
    }

    console.log('--- Populamento concluído ---');
}

run();
