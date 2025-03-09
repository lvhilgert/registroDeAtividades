const dbPromise = require('../db/db');

async function listarAtividades(req, res) {
    const usuarioId = req.usuarioId;

    try {
        const db = await dbPromise;
        const atividades = await db.all('SELECT * FROM atividade WHERE usuarioId = ?', [usuarioId]);
        res.json(atividades);
    } catch (err) {
        console.error('Erro ao buscar atividades:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar atividades' });
    }
}

async function criarAtividade(req, res) {
    const usuarioId = req.usuarioId;
    const { nome, avaliacaoId, estado } = req.body;

    try {
        const db = await dbPromise;
        await db.run(`
            INSERT INTO atividade (nome, avaliacaoId, estado, usuarioId) 
            VALUES (?, ?, ?, ?)
        `, [nome, avaliacaoId, estado ?? 0, usuarioId]);

        res.json({ mensagem: 'Atividade criada com sucesso!' });
    } catch (err) {
        console.error('Erro ao criar atividade:', err.message);
        res.status(500).json({ erro: 'Erro ao criar atividade' });
    }
}

// Buscar atividade por ID (para edição)
async function buscarAtividadePorId(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    try {
        const db = await dbPromise;
        const atividade = await db.get('SELECT * FROM atividade WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (!atividade) {
            return res.status(404).json({ mensagem: 'Atividade não encontrada ou não pertence ao usuário' });
        }

        res.json(atividade);
    } catch (err) {
        console.error('Erro ao buscar atividade por ID:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar atividade' });
    }
}

async function atualizarEstadoAtividade(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const db = await dbPromise;
        const result = await db.run(`
            UPDATE atividade
            SET estado = ?
            WHERE id = ? AND usuarioId = ?
        `, [estado, id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Atividade não encontrada ou não pertence ao usuário' });
        }

        res.json({ mensagem: 'Estado da atividade atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar atividade:', err.message);
        res.status(500).json({ erro: 'Erro ao atualizar atividade' });
    }
}

async function atualizarAtividade(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;  // ID da atividade vem da URL
    const { nome, estado } = req.body;

    try {
        const db = await dbPromise;
        const result = await db.run(`
            UPDATE atividade
            SET nome = ?, estado = ?
            WHERE id = ? AND usuarioId = ?
        `, [nome, estado ?? 0, id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Atividade não encontrada ou não pertence ao usuário' });
        }

        res.json({ mensagem: 'Atividade atualizada com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar atividade:', err.message);
        res.status(500).json({ erro: 'Erro ao atualizar atividade' });
    }
}


async function excluirAtividade(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;  // ID da atividade

    try {
        const db = await dbPromise;

        // Verifica se a atividade pertence ao usuário logado
        const atividade = await db.get('SELECT * FROM atividade WHERE id = ? AND usuarioId = ?', [id, usuarioId]);
        if (!atividade) {
            return res.status(404).json({ mensagem: 'Atividade não encontrada ou não pertence ao usuário' });
        }

        // Exclui todas as atividadesAluno associadas a essa atividade
        await db.run('DELETE FROM atividadeAluno WHERE atividadeId = ?', [id]);

        // Exclui a atividade
        const result = await db.run('DELETE FROM atividade WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Atividade não encontrada ou já foi excluída' });
        }

        res.json({ mensagem: 'Atividade e seus registros de alunos excluídos com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir atividade e registros de alunos:', err.message);
        res.status(500).json({ erro: 'Erro ao excluir atividade' });
    }
}


module.exports = {  listarAtividades,
                    buscarAtividadePorId,
                    criarAtividade, 
                    atualizarEstadoAtividade, 
                    excluirAtividade, 
                    atualizarAtividade };
