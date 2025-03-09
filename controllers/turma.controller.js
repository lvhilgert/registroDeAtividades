const dbPromise = require('../db/db');

async function listarTurmas(req, res) {
    const usuarioId = req.usuarioId;
    try {
        const db = await dbPromise;
        const rows = await db.all('SELECT * FROM turma WHERE usuarioId = ?', [usuarioId]);
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar turmas:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar turmas' });
    }
}

async function listarTurmasPorAno(req, res) {

    const { ano } = req.query;
    const usuarioId = req.usuarioId;

    try {
        const db = await dbPromise;

        const query = ano 
            ? 'SELECT * FROM turma WHERE usuarioId = ? AND anoVigente = ?' 
            : 'SELECT * FROM turma WHERE usuarioId = ?';

        const params = ano ? [usuarioId, ano] : [usuarioId];
        const turmas = await db.all(query, params);
        res.json(turmas);  // Devolve para o Angular
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar turmas' });
    }
}

async function buscarTurmaPorId(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    try {
        const db = await dbPromise;
        const turma = await db.get('SELECT * FROM turma WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (!turma) {
            return res.status(404).json({ mensagem: 'Turma não encontrada ou não pertence ao usuário' });
        }

        res.json(turma);
    } catch (err) {
        console.error('Erro ao buscar turma por ID:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar turma' });
    }
}


async function criarTurma(req, res) {
    const usuarioId = req.usuarioId;
    const { nome, serie, anoVigente, ativo } = req.body;

    try {
        const db = await dbPromise;
        await db.run('INSERT INTO turma (nome, serie, anoVigente, ativo, usuarioId) VALUES (?, ?, ?, ?, ?)',
            [nome, serie, anoVigente, ativo ?? 1, usuarioId]);
        res.json({ mensagem: 'Turma criada com sucesso!' });
    } catch (err) {
        console.error('Erro ao criar turma:', err.message);
        res.status(500).json({ erro: 'Erro ao criar turma' });
    }
}

async function atualizarTurma(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    const { nome, serie, anoVigente, ativo } = req.body;

    try {
        const db = await dbPromise;
        const result = await db.run(`
            UPDATE turma
            SET nome = ?, serie = ?, anoVigente = ?, ativo = ?
            WHERE id = ? AND usuarioId = ?
        `, [nome, serie, anoVigente, ativo ?? 1, id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Turma não encontrada ou não pertence ao usuário' });
        }

        res.json({ mensagem: 'Turma atualizada com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar turma:', err.message);
        res.status(500).json({ erro: 'Erro ao atualizar turma' });
    }
}

async function excluirTurma(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    try {
        const db = await dbPromise;

        const turma = await db.get('SELECT * FROM turma WHERE id = ? AND usuarioId = ?', [id, usuarioId]);
        if (!turma) {
            return res.status(404).json({ mensagem: 'Turma não encontrada ou não pertence ao usuário' });
        }

        const alunosVinculados = await db.get('SELECT COUNT(*) AS total FROM aluno WHERE turmaId = ? AND usuarioId = ?', [id, usuarioId]);

        if (alunosVinculados.total > 0) {
            return res.status(400).json({ mensagem: 'Não é possível excluir, pois existem alunos nesta turma. Primeiro exclua os alunos.' });
        }

        const result = await db.run('DELETE FROM turma WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Turma não encontrada ou já foi excluída' });
        }

        res.json({ mensagem: 'Turma excluída com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir turma:', err.message);
        res.status(500).json({ erro: 'Erro ao excluir turma' });
    }
}

module.exports = { listarTurmas, criarTurma, atualizarTurma, excluirTurma, listarTurmasPorAno, buscarTurmaPorId };
