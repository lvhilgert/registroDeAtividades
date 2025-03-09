const dbPromise = require('../db/db');

// Listar todas as avaliações do usuário
async function listarAvaliacoes(req, res) {
    const usuarioId = req.usuarioId;
    try {
        const db = await dbPromise;
        const avaliacoes = await db.all('SELECT * FROM avaliacao WHERE usuarioId = ?', [usuarioId]);
        res.json(avaliacoes);
    } catch (err) {
        console.error('Erro ao buscar avaliações:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar avaliações' });
    }
}

// Criar nova avaliação
async function criarAvaliacao(req, res) {
    const usuarioId = req.usuarioId;
    const { nome, anoVigente, turmaId, ativo, estado } = req.body;

    try {
        const db = await dbPromise;
        await db.run(`
            INSERT INTO avaliacao (nome, anoVigente, turmaId, ativo, estado, usuarioId) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [nome, anoVigente, turmaId, ativo ?? 1, estado ?? 0, usuarioId]);

        res.json({ mensagem: 'Avaliação criada com sucesso!' });
    } catch (err) {
        console.error('Erro ao criar avaliação:', err.message);
        res.status(500).json({ erro: 'Erro ao criar avaliação' });
    }
}

// Atualizar avaliação existente
async function atualizarAvaliacao(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    const { nome, anoVigente, turmaId, ativo, estado } = req.body;

    try {
        const db = await dbPromise;
        const result = await db.run(`
            UPDATE avaliacao
            SET nome = ?, anoVigente = ?, turmaId = ?, ativo = ?, estado = ?
            WHERE id = ? AND usuarioId = ?
        `, [nome, anoVigente, turmaId, ativo ?? 1, estado ?? 0, id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Avaliação não encontrada ou não pertence ao usuário' });
        }

        res.json({ mensagem: 'Avaliação atualizada com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar avaliação:', err.message);
        res.status(500).json({ erro: 'Erro ao atualizar avaliação' });
    }
}

// Excluir avaliação e suas atividades vinculadas
async function excluirAvaliacao(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    try {
        const db = await dbPromise;

        // Verifica se a avaliação pertence ao usuário
        const avaliacao = await db.get('SELECT * FROM avaliacao WHERE id = ? AND usuarioId = ?', [id, usuarioId]);
        if (!avaliacao) {
            return res.status(404).json({ mensagem: 'Avaliação não encontrada ou não pertence ao usuário' });
        }

        // Excluir atividades vinculadas
        await db.run('DELETE FROM atividadeAluno WHERE atividadeId IN (SELECT id FROM atividade WHERE avaliacaoId = ? AND usuarioId = ?)', [id, usuarioId]);
        await db.run('DELETE FROM atividade WHERE avaliacaoId = ? AND usuarioId = ?', [id, usuarioId]);

        // Excluir a avaliação
        const result = await db.run('DELETE FROM avaliacao WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Avaliação não encontrada ou já foi excluída' });
        }

        res.json({ mensagem: 'Avaliação e suas atividades excluídas com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir avaliação:', err.message);
        res.status(500).json({ erro: 'Erro ao excluir avaliação' });
    }
}

// Buscar avaliação por ID (para edição)
async function buscarAvaliacaoPorId(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    try {
        const db = await dbPromise;
        const avaliacao = await db.get('SELECT * FROM avaliacao WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (!avaliacao) {
            return res.status(404).json({ mensagem: 'Avaliação não encontrada ou não pertence ao usuário' });
        }

        res.json(avaliacao);
    } catch (err) {
        console.error('Erro ao buscar avaliação por ID:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar avaliação' });
    }
}

// Listar avaliações por ano e turma
async function listarAvaliacoesPorAnoETurma(req, res) {
    const usuarioId = req.usuarioId;
    const { anoVigente, turmaId } = req.query;
    console.log ("Chegou aqui?");

    try {
        const db = await dbPromise;

        let query = `
            SELECT avaliacao.id, avaliacao.nome, avaliacao.anoVigente, avaliacao.ativo, 
                   turma.nome AS turmaNome, turma.serie AS turmaSerie
            FROM avaliacao
            INNER JOIN turma ON avaliacao.turmaId = turma.id
            WHERE avaliacao.usuarioId = ? 
            AND avaliacao.anoVigente = ?
        `;

        const params = [usuarioId, anoVigente];

        if (turmaId) {
            query += ' AND avaliacao.turmaId = ?';
            params.push(turmaId);
        }

        query += ' ORDER BY avaliacao.nome';

        const avaliacoes = await db.all(query, params);
        res.json(avaliacoes);
    } catch (err) {
        console.error('Erro ao buscar avaliações:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar avaliações' });
    }
}

// Avaliações + Atividaides
async function listarAvaliacoesComAtividades(req, res) {
    const usuarioId = req.usuarioId;
    const { anoVigente, turmaId } = req.query;
    try {
        const db = await dbPromise;

        let query = `
            SELECT a.*, t.nome AS turmaNome
            FROM avaliacao a
            JOIN turma t ON a.turmaId = t.id
            WHERE a.usuarioId = ? AND a.anoVigente = ?
        `;
        const params = [usuarioId, anoVigente];

        if (turmaId) {
            query += ' AND a.turmaId = ?';
            params.push(turmaId);
        }

        const avaliacoes = await db.all(query, params);
        //console.log('Avaliações carregadas:', avaliacoes);

        // Buscar atividades relacionadas às avaliações encontradas
        for (let avaliacao of avaliacoes) {
            //console.log(`Buscando atividades para Avaliação ID: ${avaliacao.id} (tipo: ${typeof avaliacao.id})`);

            const atividades = await db.all(
                `SELECT * FROM atividade WHERE CAST(avaliacaoId AS INTEGER) = ?`, 
                [avaliacao.id]
            );

            //console.log(`Atividades encontradas para Avaliação ${avaliacao.id}:`, atividades);
            avaliacao.atividades = atividades; // Adiciona as atividades dentro da avaliação
        }

        //console.log('Lista final (com atividades):', avaliacoes);
        res.json(avaliacoes);
    } catch (err) {
        console.error('Erro ao buscar avaliações:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar avaliações' });
    }
}



module.exports = {
    listarAvaliacoes,
    criarAvaliacao,
    atualizarAvaliacao,
    excluirAvaliacao,
    buscarAvaliacaoPorId,
    listarAvaliacoesPorAnoETurma,
    listarAvaliacoesComAtividades 
};
