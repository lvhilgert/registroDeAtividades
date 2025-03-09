const dbPromise = require('../db/db');

async function listarAtividadesAluno(req, res) {
    const usuarioId = req.usuarioId;

    try {
        const db = await dbPromise;
        const atividades = await db.all('SELECT * FROM atividadeAluno WHERE usuarioId = ?', [usuarioId]);
        res.json(atividades);
    } catch (err) {
        console.error('Erro ao buscar atividades do aluno:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar atividades do aluno' });
    }
}

async function criarAtividadeAluno(req, res) {
    const usuarioId = req.usuarioId;
    const { alunoId, atividadeId, nota } = req.body;

    try {
        const db = await dbPromise;
        const result = await db.run(`INSERT INTO atividadeAluno (alunoId, atividadeId, nota, usuarioId) 
                      VALUES (?, ?, ?, ?)`, [alunoId, atividadeId, nota, usuarioId]);

        res.json({ id: result.lastID, mensagem: 'Atividade do aluno registrada com sucesso!' });
    } catch (err) {
        console.error('Erro ao registrar atividade do aluno:', err.message);
        res.status(500).json({ erro: 'Erro ao registrar atividade do aluno' });
    }
}


async function atualizarAtividadeAluno(req, res) {
    const usuarioId = req.usuarioId; // ID do usuário logado
    const { id } = req.params; // ID da atividadeAluno que vem da URL
    const { nota } = req.body; // Nova nota enviada no body

    try {
        const db = await dbPromise;

        // Verifica se o registro existe e pertence ao usuário
        const atividadeAluno = await db.get(`
            SELECT aa.* 
            FROM atividadeAluno aa
            JOIN atividade a ON aa.atividadeId = a.id
            WHERE aa.id = ? AND a.usuarioId = ?
        `, [id, usuarioId]);

        if (!atividadeAluno) {
            return res.status(404).json({ mensagem: 'Registro de atividade do aluno não encontrado ou não pertence ao usuário' });
        }

        // Atualiza a nota
        const result = await db.run(`
            UPDATE atividadeAluno
            SET nota = ?
            WHERE id = ?
        `, [nota, id]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Registro de atividade do aluno não encontrado ou já atualizado' });
        }

        res.json({ mensagem: 'Nota do aluno atualizada com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar nota do aluno:', err.message);
        res.status(500).json({ erro: 'Erro ao atualizar a nota do aluno' });
    }
}

async function listarAlunosComNotas(req, res) {
    const usuarioId = req.usuarioId;
    const { atividadeId } = req.params; // Pega o ID da atividade da URL
    console.log("✅ Entrou na função listarAlunosComNotas");
    console.log("🔹 Id da atividade recebido:", atividadeId);
    console.log("🔹 Id do usuário recebido:", usuarioId);

    try {
        const db = await dbPromise;

        const alunos = await db.all(`
            SELECT 
                aluno.id AS alunoId, 
                aluno.nome AS alunoNome,
                IFNULL(atividadeAluno.nota, 0) AS nota, 
                atividadeAluno.id AS atividadeAlunoId
            FROM aluno
            JOIN turma ON aluno.turmaId = turma.id
            JOIN avaliacao ON avaliacao.turmaId = turma.id
            JOIN atividade ON atividade.avaliacaoId = avaliacao.id
            LEFT JOIN atividadeAluno ON atividadeAluno.alunoId = aluno.id 
                AND atividadeAluno.atividadeId = atividade.id
            WHERE atividade.id = ? AND atividade.usuarioId = ?
            ORDER BY aluno.nome
        `, [atividadeId, usuarioId]);
        console.log('Lista final:', alunos);
        res.json(alunos);
    } catch (err) {
        console.error('Erro ao buscar alunos e notas:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar alunos e notas' });
    }
}

async function buscarNomeAtividade(req, res) {
    const usuarioId = req.usuarioId;
    const { atividadeId } = req.params;

    try {
        const db = await dbPromise;
        const atividade = await db.get(`SELECT nome FROM atividade WHERE id = ? AND usuarioId = ?`, [atividadeId, usuarioId]);

        if (!atividade) {
            return res.status(404).json({ erro: 'Atividade não encontrada' });
        }

        res.json(atividade);
    } catch (err) {
        console.error('Erro ao buscar nome da atividade:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar nome da atividade' });
    }
}



module.exports = { listarAtividadesAluno, 
                    criarAtividadeAluno, 
                    atualizarAtividadeAluno,
                    listarAlunosComNotas,
                    buscarNomeAtividade };
