import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Padrões conhecidos de secrets (API Keys, tokens, etc.)
const SECRET_PATTERNS = [
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z\-_]{35}/ },
    { name: 'OpenAI API Key', regex: /sk-[0-9a-zA-Z]{48}/ },
    { name: 'GitHub Token', regex: /(ghp|gho|ghu|ghs|ghr)_[0-9a-zA-Z]{36}/ },
    { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/ },
];

function checkFile(filePath) {
    // Ignora arquivos que são explicitamente exemplos ou configurações permitidas
    if (filePath.includes('.example') || filePath.includes('detect-secrets') || filePath.endsWith('.json') && filePath.includes('package')) {
        return false;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        for (const pattern of SECRET_PATTERNS) {
            if (pattern.regex.test(content)) {
                console.error(`\x1b[31m[ERRO DE SEGURANÇA] Possível secret exposta encontrada no arquivo: ${filePath}\x1b[0m`);
                console.error(`\x1b[33m[DETALHE] Tipo detectado: ${pattern.name}\x1b[0m`);
                console.error(`\x1b[31mPara evitar o vazamento de chaves (como aconteceu anteriormente), o push/commit foi bloqueado.\x1b[0m`);
                console.error(`Por favor, altere seu código para usar variáveis de ambiente (ex: import.meta.env.SUA_CHAVE) e inclua as chaves no arquivo '.env.local'.\n`);
                return true;
            }
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.warn(`Aviso: não foi possível ler o arquivo ${filePath}`);
        }
    }
    return false;
}

try {
    // Obter a lista de arquivos alterados que estão em "staged" no git
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' })
        .split('\n')
        .filter(Boolean);

    let hasSecrets = false;

    for (const file of stagedFiles) {
        // Ignorar se não existir (ex: foi deletado, mas filter ACM normalmente impede isso)
        if (fs.existsSync(file)) {
            if (checkFile(file)) {
                hasSecrets = true;
            }
        }
    }

    if (hasSecrets) {
        process.exit(1);
    }

    console.log('\x1b[32m[SEGURANÇA] Verificação de secrets concluída com sucesso. Nenhuma chave estática encontrada.\x1b[0m');
    process.exit(0);
} catch (error) {
    console.error('Erro ao executar o detector de secrets:', error);
    process.exit(1);
}
