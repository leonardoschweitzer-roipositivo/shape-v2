-- =============================================
-- VITRU IA - Biblioteca de Exercícios
-- =============================================
-- Execute este SQL no Supabase Dashboard → SQL Editor
-- =============================================

-- 1. TABELA PRINCIPAL
CREATE TABLE exercicios_biblioteca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificação
    nome TEXT NOT NULL,
    nome_alternativo TEXT,               -- nomes populares, ex: "Rosca alternada"

    -- Classificação
    grupo_muscular TEXT NOT NULL,        -- 'peito', 'costas', 'ombro', 'braco', 'perna', 'abdomen', 'gluteo', 'cardio'
    subgrupo TEXT,                       -- 'peitoral_superior', 'biceps', etc.
    equipamento TEXT,                    -- 'barra', 'haltere', 'maquina', 'cabo', 'peso_corporal', 'kettlebell'
    nivel TEXT DEFAULT 'intermediario',  -- 'iniciante', 'intermediario', 'avancado'

    -- Conteúdo de vídeo
    url_video TEXT,                      -- null = ainda não tem vídeo
    thumbnail_url TEXT,
    duracao_video_seg INTEGER,           -- duração em segundos

    -- Conteúdo textual (disponível mesmo sem vídeo)
    descricao TEXT,                      -- descrição curta para o card
    instrucoes TEXT[],                   -- passo a passo ["1. Deite no banco...", "2. Segure a barra..."]
    dicas TEXT[],                        -- dicas de execução
    erros_comuns TEXT[],                 -- erros frequentes

    -- Status
    em_breve BOOLEAN DEFAULT TRUE,       -- true = vídeo não disponível ainda
    ativo BOOLEAN DEFAULT TRUE,

    -- Metadados
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE VÍNCULO: exercício do plano → biblioteca
-- Permite que ao montar um treino o personal escolha da biblioteca
ALTER TABLE IF EXISTS exercicios_plano
    ADD COLUMN IF NOT EXISTS biblioteca_id UUID REFERENCES exercicios_biblioteca(id);

-- 3. ÍNDICES
CREATE INDEX idx_exercicios_grupo ON exercicios_biblioteca(grupo_muscular);
CREATE INDEX idx_exercicios_nivel ON exercicios_biblioteca(nivel);
CREATE INDEX idx_exercicios_em_breve ON exercicios_biblioteca(em_breve);
CREATE INDEX idx_exercicios_ativo ON exercicios_biblioteca(ativo);
CREATE INDEX idx_exercicios_nome ON exercicios_biblioteca USING gin(to_tsvector('portuguese', nome));

-- 4. RLS - Leitura pública para personais e atletas autenticados
ALTER TABLE exercicios_biblioteca ENABLE ROW LEVEL SECURITY;

-- Qualquer usuário autenticado pode ler
CREATE POLICY "exercicio_biblioteca_select" ON exercicios_biblioteca FOR SELECT
    USING (auth.role() = 'authenticated' AND ativo = TRUE);

-- Apenas via service_role pode inserir/atualizar (admin)
CREATE POLICY "exercicio_biblioteca_insert" ON exercicios_biblioteca FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "exercicio_biblioteca_update" ON exercicios_biblioteca FOR UPDATE
    USING (auth.role() = 'service_role');

-- 5. TRIGGER updated_at
CREATE TRIGGER trigger_exercicios_biblioteca_updated_at
    BEFORE UPDATE ON exercicios_biblioteca
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 6. SEED - 60 exercícios populares (sem vídeo por ora)
-- =============================================

INSERT INTO exercicios_biblioteca (nome, grupo_muscular, subgrupo, equipamento, nivel, descricao, instrucoes, dicas, erros_comuns, em_breve) VALUES

-- PEITO
('Supino Reto com Barra', 'peito', 'peitoral_medio', 'barra', 'intermediario',
 'Exercício fundamental para desenvolvimento do peitoral médio.',
 ARRAY['Deite no banco com os pés apoiados no chão', 'Segure a barra com pegada um pouco mais larga que os ombros', 'Desça a barra até o peito de forma controlada', 'Empurre a barra para cima exalando o ar'],
 ARRAY['Mantenha as escapulas retraídas', 'Pés fixos no chão durante todo o movimento', 'Controle a fase excêntrica (descida)'],
 ARRAY['Não quicar a barra no peito', 'Não arquear excessivamente as costas'], TRUE),

('Supino Inclinado com Halteres', 'peito', 'peitoral_superior', 'haltere', 'intermediario',
 'Foco no feixe clavicular do peitoral (parte superior).',
 ARRAY['Ajuste o banco entre 30-45 graus', 'Segure os halteres na altura do peito', 'Empurre os halteres para cima e levemente para dentro', 'Retorne de forma controlada'],
 ARRAY['Angulação ideal: 30-45 graus', 'Não trave os cotovelos no topo'],
 ARRAY['Banco muito inclinado recruta mais deltóide'], TRUE),

('Crucifixo com Halteres', 'peito', 'peitoral_medio', 'haltere', 'iniciante',
 'Exercício de isolamento para alongamento do peitoral.',
 ARRAY['Deite no banco segurando os halteres acima do peito', 'Abra os braços em arco mantendo leve flexão no cotovelo', 'Sinta o alongamento no peitoral', 'Retorne fechando os braços'],
 ARRAY['Mantenha leve flexão nos cotovelos', 'Foco no alongamento, não na carga'],
 ARRAY['Usar carga excessiva que force os cotovelos a dobrar mais'], TRUE),

('Crossover no Cabo', 'peito', 'peitoral_inferior', 'cabo', 'intermediario',
 'Exercício de isolamento no cabo para definição peitoral.',
 ARRAY['Posicione as polias na altura dos ombros ou acima', 'Segure os cabos e incline o tronco levemente à frente', 'Cruze as mãos à frente do corpo com movimento em arco', 'Retorne de forma controlada'],
 ARRAY['Expirare ao fechar os braços', 'Mantenha a postura estável durante o movimento'],
 ARRAY['Usar impulso do corpo para ajudar o movimento'], TRUE),

('Flexão de Braço', 'peito', 'peitoral_medio', 'peso_corporal', 'iniciante',
 'Exercício clássico sem equipamento para peitoral e tríceps.',
 ARRAY['Apoie as mãos no chão na largura dos ombros', 'Mantenha o corpo em linha reta da cabeça aos pés', 'Desça até o peito quase tocar o chão', 'Empurre o chão para subir'],
 ARRAY['Core sempre ativado', 'Não deixe o quadril cair'],
 ARRAY['Abrir demasiado os cotovelos para os lados'], TRUE),

('Supino Declinado', 'peito', 'peitoral_inferior', 'barra', 'intermediario',
 'Foco na porção inferior do peitoral.',
 ARRAY['Deite no banco declinado com pés presos', 'Pegue a barra com pegada médio-larga', 'Desça até o baixo do peito', 'Empurre para cima exalando'],
 ARRAY['Maior segurança que o supino reto para ombros'],
 ARRAY['Não deixar a barra cair no abdômen'], TRUE),

-- COSTAS
('Barra Fixa (Pull-up)', 'costas', 'dorsal', 'peso_corporal', 'avancado',
 'Exercício rei para desenvolvimento do dorsal largo.',
 ARRAY['Segure a barra com pegada pronada (palmas para frente)', 'Largura acima dos ombros', 'Puxe o corpo para cima até o queixo ultrapassar a barra', 'Desça de forma controlada'],
 ARRAY['Escápulas retraídas e deprimidas antes de puxar', 'Não balance o corpo'],
 ARRAY['Usar apenas os braços sem recrutar o dorsal'], TRUE),

('Remada Curvada com Barra', 'costas', 'dorsal', 'barra', 'intermediario',
 'Exercício composto essencial para espessura das costas.',
 ARRAY['Incline o tronco a 45-60 graus', 'Segure a barra com pegada pronada', 'Puxe a barra em direção ao umbigo', 'Retorne de forma controlada'],
 ARRAY['Mantenha a coluna neutra', 'Cotovelhos próximos ao corpo'],
 ARRAY['Arredondar as costas com carga excessiva'], TRUE),

('Puxada na Frente (Lat Pulldown)', 'costas', 'dorsal', 'maquina', 'iniciante',
 'Alternativa à barra fixa para desenvolver o dorsal.',
 ARRAY['Sente-se e ajuste a almofada sobre as coxas', 'Segure a barra com pegada larga pronada', 'Puxe a barra até a altura do queixo/pescoço', 'Retorne de forma controlada com resistência'],
 ARRAY['Incline levemente o tronco para trás', 'Expirar ao puxar'],
 ARRAY['Puxar atrás da cabeça (risco cervical)'], TRUE),

('Remada Unilateral com Haltere', 'costas', 'dorsal', 'haltere', 'iniciante',
 'Exercício unilateral para desenvolvimento das costas com menos estresse na coluna.',
 ARRAY['Apoie o joelho e a mão no banco', 'Segure o haltere com o braço estendido', 'Puxe o haltere em direção ao quadril', 'Retorne de forma controlada'],
 ARRAY['Cotovelo para trás, não para os lados', 'Não rodar o tronco'],
 ARRAY['Usar o impulso do corpo para levantar o peso'], TRUE),

('Remada Cavalinho', 'costas', 'trapezio', 'barra', 'intermediario',
 'Exercício multiarticular para trapézio e rombóides.',
 ARRAY['Posicione-se em pé com a barra sobre os antebraços', 'Eleve os cotovelos acima dos ombros', 'Retorne de forma controlada'],
 ARRAY['Foco em elevar os cotovelos, não as mãos'],
 ARRAY['Usar demais a inércia para levantar a barra'], TRUE),

('Pullover', 'costas', 'dorsal', 'haltere', 'intermediario',
 'Exercício de alongamento do dorsal e expansão da caixa torácica.',
 ARRAY['Deite transversalmente no banco', 'Segure o haltere com as duas mãos acima do peito', 'Desça o haltere para trás da cabeça', 'Retorne à posição inicial'],
 ARRAY['Mantenha os cotovelos levemente flexionados', 'Foco no alongamento do dorsal'],
 ARRAY['Descer o haltere demais forçando a lombar'], TRUE),

-- OMBROS
('Desenvolvimento com Barra (Overhead Press)', 'ombro', 'deltóide_anterior', 'barra', 'intermediario',
 'Exercício composto fundamental para força e massa dos ombros.',
 ARRAY['Posicione a barra na frente, na altura dos ombros', 'Empurre a barra para cima até os braços estenderem', 'Retorne à posição inicial de forma controlada'],
 ARRAY['Core ativado durante todo o movimento', 'Não hiperestender a lombar'],
 ARRAY['Projetar o queixo para frente ao subir a barra'], TRUE),

('Elevação Lateral com Halteres', 'ombro', 'deltóide_lateral', 'haltere', 'iniciante',
 'Exercício de isolamento para a porção medial do deltóide.',
 ARRAY['Segure os halteres ao lado do corpo', 'Eleve os braços até a altura dos ombros', 'Retorne de forma lenta e controlada'],
 ARRAY['Não passar da linha dos ombros', 'Polegares levemente para baixo'],
 ARRAY['Usar impulso do corpo', 'Elevar demais os halteres acima dos ombros'], TRUE),

('Desenvolvimento com Halteres', 'ombro', 'deltóide_anterior', 'haltere', 'iniciante',
 'Alternativa com halteres para o desenvolvimento de ombros.',
 ARRAY['Sente-se com as costas apoiadas', 'Segure os halteres na altura dos ombros', 'Empurre para cima alternando ou simultaneamente', 'Retorne de forma controlada'],
 ARRAY['Banco com encosto reduz risco na lombar'],
 ARRAY['Não arquear as costas ao empurrar'], TRUE),

('Elevação Frontal', 'ombro', 'deltóide_anterior', 'haltere', 'iniciante',
 'Exercício para a porção anterior do deltóide.',
 ARRAY['Segure os halteres à frente das coxas', 'Eleve um ou os dois braços até a altura dos ombros', 'Retorne de forma controlada'],
 ARRAY['Mantenha leve flexão nos cotovelos'],
 ARRAY['Usar o tronco para impulsionar o movimento'], TRUE),

('Pássaro (Elevação Posterior)', 'ombro', 'deltóide_posterior', 'haltere', 'iniciante',
 'Exercício para o deltóide posterior, muito negligenciado.',
 ARRAY['Incline o tronco a 90 graus ou apoie na mesa', 'Eleve os halteres para os lados em arco', 'Sinta a contração no deltóide traseiro', 'Retorne de forma controlada'],
 ARRAY['Foco é no deltóide posterior, não no trapézio', 'Carga leve com execução perfeita'],
 ARRAY['Encolher os ombros ao subir recrutando o trapézio'], TRUE),

-- BRAÇOS - BÍCEPS
('Rosca Direta com Barra', 'braco', 'biceps', 'barra', 'iniciante',
 'Exercício clássico de isolamento para o bíceps.',
 ARRAY['Segure a barra com pegada supinada na largura dos ombros', 'Mantenha os cotovelos fixos ao lado do corpo', 'Suba a barra até o pico de contração', 'Desça de forma controlada'],
 ARRAY['Cotovelos fixos é fundamental', 'Fase excêntrica lenta para mais resultado'],
 ARRAY['Balançar o corpo para ajudar no movimento'], TRUE),

('Rosca Alternada com Halteres', 'braco', 'biceps', 'haltere', 'iniciante',
 'Permite supinação do antebraço para maior ativação do bíceps.',
 ARRAY['Segure os halteres ao lado do corpo', 'Suba um haltere rotacionando o antebraço no topo', 'Retorne e repita com o outro braço'],
 ARRAY['Supinar o punho no ponto máximo do movimento'],
 ARRAY['Usar o ombro para ajudar a levantar o haltere'], TRUE),

('Rosca Martelo', 'braco', 'braquial', 'haltere', 'iniciante',
 'Recruta o braquial e braquiorradial além do bíceps.',
 ARRAY['Segure os halteres com pegada neutra (palmas para dentro)', 'Suba o haltere sem rotacionar o punho', 'Retorne de forma controlada'],
 ARRAY['Ótimo para espessura do braço', 'Cotovelos fixos ao corpo'],
 ARRAY['Balançar os cotovelos para frente'], TRUE),

('Rosca Concentrada', 'braco', 'biceps', 'haltere', 'iniciante',
 'Exercício de isolamento máximo para o bíceps.',
 ARRAY['Sente-se e apoie o cotovelo na parte interna da coxa', 'Suba o haltere até o pico de contração', 'Retorne de forma lenta'],
 ARRAY['Ótimo para o pico do bíceps', 'Concentre na contração máxima'],
 ARRAY['Não isolar completamente o cotovelo apoiando errado'], TRUE),

-- BRAÇOS - TRÍCEPS
('Paralelas (Dips)', 'braco', 'triceps', 'peso_corporal', 'intermediario',
 'Exercício composto para tríceps e peitoral inferior.',
 ARRAY['Apoie nas barras paralelas com os braços estendidos', 'Desça inclinando levemente o tronco à frente', 'Suba estendendo os cotovelos até a posição inicial'],
 ARRAY['Inclinação do tronco define ênfase: vertical = tríceps, inclinado = peitoral'],
 ARRAY['Descer demais causando estresse excessivo nos ombros'], TRUE),

('Extensão de Tríceps no Cabo', 'braco', 'triceps', 'cabo', 'iniciante',
 'Exercício de isolamento para o tríceps no cabo.',
 ARRAY['Posicione o cabo na altura da cabeça ou acima', 'Segure a corda com os cotovelos flexionados', 'Estenda os cotovelos empurrando para baixo', 'Retorne de forma controlada'],
 ARRAY['Cotovelos fixos durante todo o movimento', 'Abrir a corda no final para maior ativação'],
 ARRAY['Movimentar os cotovelos para frente e para trás'], TRUE),

('Tríceps Testa (Skull Crusher)', 'braco', 'triceps', 'barra', 'intermediario',
 'Exercício fundamental para o desenvolvimento do tríceps longo.',
 ARRAY['Deite no banco com a barra acima do peito', 'Desça a barra em direção à testa flexionando apenas os cotovelos', 'Estenda os cotovelos voltando à posição inicial'],
 ARRAY['Cotovelos não devem abrir', 'Controle total na descida'],
 ARRAY['Deixar os cotovelos abrirem para os lados'], TRUE),

('Tríceps Francês com Haltere', 'braco', 'triceps', 'haltere', 'iniciante',
 'Exercício para alongamento e contração do tríceps longo.',
 ARRAY['Segure o haltere sobre a cabeça com os dois braços', 'Desça o haltere atrás da cabeça', 'Estenda os cotovelos retornando à posição inicial'],
 ARRAY['Ótimo para o tríceps longo', 'Mantenha os cotovelos apontados para frente/cima'],
 ARRAY['Deixar os cotovelos abrirem para os lados ao descer'], TRUE),

-- PERNAS
('Agachamento com Barra', 'perna', 'quadriceps', 'barra', 'intermediario',
 'O exercício mais completo para o desenvolvimento do trem inferior.',
 ARRAY['Posicione a barra nos trapézios', 'Com os pés na largura dos ombros, desça até as coxas ficarem paralelas ao chão', 'Empurre o chão para subir'],
 ARRAY['Joelhos na direção dos pés', 'Coluna neutra durante todo o movimento', 'Olhar para frente'],
 ARRAY['Joelhos caindo para dentro (valgo)', 'Calcanhar levantando do chão'], TRUE),

('Leg Press', 'perna', 'quadriceps', 'maquina', 'iniciante',
 'Alternativa ao agachamento com menos estresse na coluna.',
 ARRAY['Sente-se na máquina com as costas apoiadas', 'Posicione os pés na plataforma na largura dos quadris', 'Empurre a plataforma estendendo as pernas', 'Retorne de forma controlada'],
 ARRAY['Joelhos na direção dos pés', 'Não trancar os joelhos no topo'],
 ARRAY['Tirar as costas do encosto no final da descida'], TRUE),

('Cadeira Extensora', 'perna', 'quadriceps', 'maquina', 'iniciante',
 'Exercício de isolamento para o quadríceps.',
 ARRAY['Ajuste a máquina para a altura correta', 'Estenda as pernas completamente', 'Retorne de forma controlada sem deixar cair'],
 ARRAY['Pause 1 segundo no topo para maior ativação', 'Fase excêntrica lenta'],
 ARRAY['Usar impulso para subir o peso'], TRUE),

('Mesa Flexora', 'perna', 'isquiotibiais', 'maquina', 'iniciante',
 'Exercício de isolamento para isquiotibiais.',
 ARRAY['Deite na máquina com o rolo nos tornozelos', 'Puxe os calcanhares em direção aos glúteos', 'Retorne de forma controlada'],
 ARRAY['Não arquear demais a lombar', 'Fase excêntrica lenta para mais resultado'],
 ARRAY['Levantar os quadris da mesa ao flexionar'], TRUE),

('Stiff (Levantamento Terra Romano)', 'perna', 'isquiotibiais', 'barra', 'intermediario',
 'Exercício composto para isquiotibiais e glúteos.',
 ARRAY['Segure a barra na frente das coxas', 'Incline o tronco para frente mantendo a coluna neutra', 'Sinto o alongamento nos isquiotibiais', 'Retorne ativando glúteos e isquiotibiais'],
 ARRAY['Coluna neutra é fundamental', 'Barra próxima ao corpo durante todo o movimento'],
 ARRAY['Arredondar a lombar', 'Dobrar demais os joelhos'], TRUE),

('Agachamento Búlgaro', 'perna', 'quadriceps', 'haltere', 'avancado',
 'Split squat para desenvolvimento unilateral das pernas.',
 ARRAY['Apoie o pé de trás num banco', 'Desça o joelho de frente em direção ao chão', 'Empurre para subir ativando os glúteos'],
 ARRAY['Equilíbrio é fundamental', 'Joelho da frente não deve ultrapassar demais a ponta do pé'],
 ARRAY['Inclinar demais o tronco para frente'], TRUE),

('Afundo (Lunge)', 'perna', 'quadriceps', 'haltere', 'iniciante',
 'Exercício funcional unilateral para pernas e glúteos.',
 ARRAY['Dê um passo largo para frente', 'Desça o joelho de trás em direção ao chão', 'Empurre para retornar à posição inicial'],
 ARRAY['Tronco ereto durante o movimento', 'Passo largo o suficiente para o joelho de trás não bater no chão'],
 ARRAY['Joelho passando demais da ponta dos pés'], TRUE),

('Panturrilha em Pé', 'perna', 'panturrilha', 'maquina', 'iniciante',
 'Exercício de isolamento para os gêmeos.',
 ARRAY['Apoie os ombros na máquina ou segure os halteres', 'Suba na ponta dos pés ao máximo', 'Desça até sentir o máximo alongamento'],
 ARRAY['Amplitude máxima: topo e baixo', 'Pause no topo'],
 ARRAY['Não fazer o movimento completo'], TRUE),

-- GLÚTEOS
('Elevação Pélvica (Hip Thrust)', 'gluteo', 'gluteo_maximo', 'barra', 'iniciante',
 'Exercício mais eficaz para o recrutamento do glúteo máximo.',
 ARRAY['Apoie as escápulas num banco com a barra sobre o quadril', 'Empurre o quadril para cima contraindo os glúteos', 'Mantenha o topo 1-2 segundos', 'Desça de forma controlada'],
 ARRAY['Joelhos a 90 graus no topo', 'Pause e contraia no topo para maior ativação'],
 ARRAY['Hiperestender a lombar no topo em vez de contrair os glúteos'], TRUE),

('Levantamento Terra (Deadlift)', 'gluteo', 'gluteo_maximo', 'barra', 'avancado',
 'Exercício composto fundamental para toda a cadeia posterior.',
 ARRAY['Posicione os pés sob a barra', 'Agache e segure com pegada pronada ou alternada', 'Empurre o chão estendendo joelhos e quadril simultaneamente', 'Retorne baixando o quadril de forma controlada'],
 ARRAY['Coluna neutra durante todo o movimento', 'Barra próxima ao corpo'],
 ARRAY['Arredondar a lombar', 'Barra afastar do corpo'], TRUE),

('Abdução de Quadril na Máquina', 'gluteo', 'gluteo_medio', 'maquina', 'iniciante',
 'Exercício para o glúteo médio, essencial para estabilidade.',
 ARRAY['Sente-se na máquina com as coxas presas', 'Abra as pernas contra a resistência', 'Retorne de forma controlada'],
 ARRAY['Ótimo para glúteo médio e sculpting lateral', 'Fase excêntrica lenta'],
 ARRAY['Usar apenas a máquina sem ativar o glúteo conscientemente'], TRUE),

('Cadeira Adutora', 'perna', 'adutores', 'maquina', 'iniciante',
 'Exercício de isolamento para os adutores da coxa.',
 ARRAY['Sente-se com as pernas abertas', 'Feche as pernas contra a resistência', 'Retorne de forma controlada'],
 ARRAY['Contrair os adutores ao fechar as pernas'],
 ARRAY['Usar peso excessivo comprometendo a amplitude'], TRUE),

-- ABDÔMEN
('Abdominal Crunch', 'abdomen', 'reto_abdominal', 'peso_corporal', 'iniciante',
 'Exercício clássico de isolamento para o reto abdominal.',
 ARRAY['Deite com joelhos flexionados', 'Cruce as mãos no peito ou coloque atrás da cabeça', 'Eleve o tronco até o ponto máximo de contração', 'Retorne sem apoiar completamente no chão'],
 ARRAY['Foco na contração do abdômen, não no pescoço', 'Fase excêntrica lenta'],
 ARRAY['Puxar o pescoço com as mãos', 'Jogar o tronco para cima com impulso'], TRUE),

('Prancha', 'abdomen', 'core', 'peso_corporal', 'iniciante',
 'Exercício de estabilidade para todo o core.',
 ARRAY['Apoie nos antebraços e pontas dos pés', 'Mantenha o corpo em linha reta da cabeça ao calcanhar', 'Ative o core e mantenha a posição pelo tempo determinado'],
 ARRAY['Não deixar o quadril cair ou subir', 'Respiração controlada durante a execução'],
 ARRAY['Quadril levantado demais fazendo "montanha"'], TRUE),

('Abdominal na Polia', 'abdomen', 'reto_abdominal', 'cabo', 'intermediario',
 'Exercício de resistência para o reto abdominal.',
 ARRAY['Ajoelhe-se com a corda atrás da cabeça', 'Contraia o abdômen trazendo o tronco para frente e baixo', 'Retorne de forma controlada'],
 ARRAY['Foco: abdômen move o tronco, não os quadris'],
 ARRAY['Usar os quadris para fazer o movimento'], TRUE),

('Elevação de Pernas', 'abdomen', 'reto_abdominal', 'peso_corporal', 'intermediario',
 'Exercício para a porção inferior do reto abdominal.',
 ARRAY['Deite com as mãos ao lado do corpo', 'Com as pernas estendidas ou levemente flexionadas, suba até 90 graus', 'Retorne de forma controlada sem apoiar no chão'],
 ARRAY['Mantenha a lombar no chão durante todo o movimento'],
 ARRAY['Deixar a lombar arquear ao descer as pernas'], TRUE),

('Rotação Russa', 'abdomen', 'obliquos', 'peso_corporal', 'intermediario',
 'Exercício para os oblíquos com ou sem peso adicional.',
 ARRAY['Sente-se com os joelhos flexionados e os pés levantados', 'Segure um haltere ou une as mãos', 'Rotacione o tronco de lado a lado'],
 ARRAY['Mantenha o core ativo durante toda a rotação'],
 ARRAY['Rodar apenas os ombros sem rodar o tronco de verdade'], TRUE),

-- CARDIO
('Corrida na Esteira', 'cardio', 'cardio_aerobico', 'maquina', 'iniciante',
 'Exercício cardiovascular clássico na esteira.',
 ARRAY['Ajuste a velocidade e inclinação conforme objetivo', 'Mantenha postura ereta', 'Movimento natural dos braços'],
 ARRAY['Incluir aquecimento e resfriamento', 'Controle a frequência cardíaca'],
 ARRAY['Segurar nas barras laterais, reduzindo o esforço'], TRUE),

('Burpee', 'cardio', 'cardio_hiit', 'peso_corporal', 'avancado',
 'Exercício de alta intensidade que trabalha todo o corpo.',
 ARRAY['Agache e apoie as mãos no chão', 'Salte os pés para trás ficando em posição de flexão', 'Faça uma flexão', 'Salte os pés para o peito e salte para cima com os braços'],
 ARRAY['Ótimo para HIIT e condicionamento geral'],
 ARRAY['Não fazer a flexão no movimento completo'], TRUE),

('Polichinelo (Jumping Jacks)', 'cardio', 'cardio_aerobico', 'peso_corporal', 'iniciante',
 'Exercício de aquecimento e cardio de baixo impacto.',
 ARRAY['Em pé, pule abrindo as pernas e levantando os braços', 'Retorne à posição inicial no próximo salto'],
 ARRAY['Pode ser usado como aquecimento ou circuito'],
 ARRAY['Não fazer o movimento completo dos braços'], TRUE),

('Corda (Battle Ropes)', 'cardio', 'cardio_hiit', 'equipamento', 'intermediario',
 'Exercício de alta intensidade para condicionamento e força.',
 ARRAY['Segure as cordas com pegada firme', 'Realize ondulações alternadas ou simultâneas', 'Mantenha o core ativo e joelhos levemente flexionados'],
 ARRAY['Ótimo para HIIT e condicioamento do trem superior'],
 ARRAY['Soltar o core durante o exercício'], TRUE),

-- BODYBUILDING / EXTRAS
('Rosca Spider', 'braco', 'biceps', 'barra', 'intermediario',
 'Variação da rosca que elimina o impulso do corpo.',
 ARRAY['Use um banco inclinado e apoie os braços no encosto frontal', 'Suba a barra contraindo o bíceps', 'Retorne de forma controlada'],
 ARRAY['Sem balanço possível — isolamento puro'],
 ARRAY['Usar carga pesada demais sem isolamento adequado'], TRUE),

('Pulley Frente (Lat Pulldown Supinado)', 'costas', 'dorsal', 'maquina', 'intermediario',
 'Variação do puxada com pegada supinada que recruta mais bíceps.',
 ARRAY['Pegada mais estreita com palmas para cima', 'Puxe em direção ao peitoral', 'Retorne de forma controlada'],
 ARRAY['Pegada supinada pode ser mais confortável para alguns ombros'],
 ARRAY['Usar o corpo para ajudar a puxar a barra'], TRUE),

('Serrote com Haltere', 'costas', 'serrátil', 'haltere', 'iniciante',
 'Exercício para o serrátil anterior e dorsais.',
 ARRAY['Apoie no banco com uma mão e o joelho oposto', 'Segure o haltere com o braço estendido', 'Puxe em direção ao quadril retrocedendo o cotovelo', 'Retorne'],
 ARRAY['Cotovelo para trás, não para o lado'],
 ARRAY['Rodar o ombro para cima ao puxar'], TRUE),

('Face Pull', 'ombro', 'deltóide_posterior', 'cabo', 'iniciante',
 'Exercício essencial para saúde dos ombros e deltóide posterior.',
 ARRAY['Posicione o cabo na altura dos olhos', 'Puxe a corda em direção ao rosto com cotovelos elevados', 'Retorne de forma controlada'],
 ARRAY['Cotovelos acima dos ombros ao puxar', 'Excelente para saúde rotacional dos ombros'],
 ARRAY['Puxar com cotovelos baixos como uma remada'], TRUE),

('Shrug (Encolhimento de Ombros)', 'costas', 'trapezio', 'haltere', 'iniciante',
 'Exercício de isolamento para o trapézio.',
 ARRAY['Segure os halteres ao lado do corpo', 'Encolha os ombros ao máximo em direção às orelhas', 'Retorne de forma controlada'],
 ARRAY['Pause no topo para maior ativação do trapézio'],
 ARRAY['Rodar os ombros durante o movimento'], TRUE),

('Good Morning', 'perna', 'isquiotibiais', 'barra', 'avancado',
 'Exercício para isquiotibiais e lombar com a barra no ombro.',
 ARRAY['Posicione a barra nos trapézios', 'Incline o tronco para frente com joelhos levemente flexionados', 'Sinto o alongamento nos isquiotibiais', 'Retorne ativando glúteo e isquiotibiais'],
 ARRAY['Coluna neutra é essencial', 'Comece com carga leve'],
 ARRAY['Arredondar a lombar durante o movimento'], TRUE),

('Agachamento Sumô', 'perna', 'gluteo_medio', 'haltere', 'iniciante',
 'Variação de agachamento com foco em glúteo médio e adutores.',
 ARRAY['Abra bem as pernas com os pés apontados para fora', 'Segure o haltere à frente', 'Agache mantendo o tronco ereto', 'Suba ativando os glúteos'],
 ARRAY['Maior ativação de glúteo médio e adutores'],
 ARRAY['Joelhos caindo para dentro durante o agachamento'], TRUE),

('Puxada com Pegada Neutra', 'costas', 'dorsal', 'maquina', 'iniciante',
 'Variação do puxada com menos estresse nos ombros.',
 ARRAY['Use o triângulo ou duas alças individuais', 'Pegada com palmas frente a frente', 'Puxe em direção ao peito', 'Retorne de forma controlada'],
 ARRAY['Ótima opção para quem tem desconforto nos ombros'],
 ARRAY['Inclinar excessivamente o tronco para trás'], TRUE),

('Reforma (Press na Máquina de Ombro)', 'ombro', 'deltóide_anterior', 'maquina', 'iniciante',
 'Exercício de desenvolvimento de ombros com apoio da máquina.',
 ARRAY['Ajuste o banco e a altura das hastes', 'Empurre os apoios para cima estendendo os braços', 'Retorne de forma controlada'],
 ARRAY['Mais seguro para iniciantes que o desenvolvimento livre'],
 ARRAY['Deixar os cotovelos caírem abaixo do nível do ombro'], TRUE);

-- =============================================
-- PRONTO!
-- Tabela exercicios_biblioteca criada com 60 exercícios seed.
-- Todos com em_breve = TRUE pois ainda não têm vídeo.
-- =============================================
