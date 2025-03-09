const dbPromise = require('../db/db');

// Listar todos os alunos do usuário
async function listarAlunos(req, res) {
    const usuarioId = req.usuarioId;
    //console.log('chegou aqui na de listar!!');

    try {
        const db = await dbPromise;
        const alunos = await db.all('SELECT * FROM aluno WHERE usuarioId = ?', [usuarioId]);
        res.json(alunos);
    } catch (err) {
        console.error('Erro ao buscar alunos:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
}

// Criar novo aluno (com anoVigente)
async function criarAluno(req, res) {
    const usuarioId = req.usuarioId;
    const { nome, turmaId, anoVigente, ativo } = req.body;

    if (!anoVigente) {
        return res.status(400).json({ erro: "O campo anoVigente é obrigatório!" });
    }

    try {
        const db = await dbPromise;
        await db.run(`
            INSERT INTO aluno (nome, turmaId, anoVigente, ativo, usuarioId) 
            VALUES (?, ?, ?, ?, ?)
        `, [nome, turmaId, anoVigente, ativo ?? 1, usuarioId]);

        res.json({ mensagem: 'Aluno criado com sucesso!' });
    } catch (err) {
        console.error('Erro ao criar aluno:', err.message);
        res.status(500).json({ erro: 'Erro ao criar aluno' });
    }
}


// Atualizar aluno existente (com anoVigente)
async function atualizarAluno(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;
    const { nome, turmaId, anoVigente, ativo } = req.body;

    try {
        const db = await dbPromise;
        const result = await db.run(`
            UPDATE aluno
            SET nome = ?, turmaId = ?, anoVigente = ?, ativo = ?
            WHERE id = ? AND usuarioId = ?
        `, [nome, turmaId, anoVigente, ativo ?? 1, id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado ou não pertence ao usuário' });
        }

        res.json({ mensagem: 'Aluno atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar aluno:', err.message);
        res.status(500).json({ erro: 'Erro ao atualizar aluno' });
    }
}

// Excluir aluno e suas atividades vinculadas
async function excluirAluno(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    try {
        const db = await dbPromise;

        // Verifica se o aluno pertence ao usuário
        const aluno = await db.get('SELECT * FROM aluno WHERE id = ? AND usuarioId = ?', [id, usuarioId]);
        if (!aluno) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado ou não pertence ao usuário' });
        }

        // Excluir atividades vinculadas
        await db.run('DELETE FROM atividadeAluno WHERE alunoId = ?', [id]);

        // Excluir o aluno
        const result = await db.run('DELETE FROM aluno WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (result.changes === 0) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado ou já foi excluído' });
        }

        res.json({ mensagem: 'Aluno e suas atividades excluídos com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir aluno:', err.message);
        res.status(500).json({ erro: 'Erro ao excluir aluno' });
    }
}

// Buscar aluno por ID (para tela de edição)
async function buscarAlunoPorId(req, res) {
    const usuarioId = req.usuarioId;
    const { id } = req.params;

    //console.log('chegou aqui na de buscar id!');

    try {
        const db = await dbPromise;
        const aluno = await db.get('SELECT * FROM aluno WHERE id = ? AND usuarioId = ?', [id, usuarioId]);

        if (!aluno) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado ou não pertence ao usuário' });
        }

        res.json(aluno);
    } catch (err) {
        console.error('Erro ao buscar aluno por ID:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar aluno' });
    }
}

async function listarAlunosPorAnoETurma(req, res) {
    const usuarioId = req.usuarioId;
    const { anoVigente, turmaId } = req.query;
    //console.log('Ano:', anoVigente, 'Turma:', turmaId);
    try {
        const db = await dbPromise;

        let query = `
            SELECT aluno.id, aluno.nome, aluno.anoVigente, aluno.ativo
            FROM aluno
            WHERE aluno.usuarioId = ? 
            AND aluno.anoVigente = ?
        `;
        const params = [usuarioId, anoVigente];

        if (turmaId) {
            query += ' AND aluno.turmaId = ?';
            params.push(turmaId);
        }

        query += ' ORDER BY aluno.nome';
        const alunos = await db.all(query, params);
        /*console.log('Alunos ordenados:', alunos.map(a => a.nome));  log da query */
        res.json(alunos);
    } catch (err) {
        console.error('Erro ao buscar alunos:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
}

async function buscarAlunoPorNomeETurma(req, res) {
    const usuarioId = req.usuarioId;
    const { nome, turmaId } = req.query;

    try {
        const db = await dbPromise;
        const aluno = await db.get(`
            SELECT * FROM aluno 
            WHERE usuarioId = ? AND turmaId = ? AND nome = ?
        `, [usuarioId, turmaId, nome]);

        if (aluno) {
            return res.json({ existe: true });
        } else {
            return res.json({ existe: false });
        }
    } catch (err) {
        console.error('Erro ao buscar aluno por nome e turma:', err.message);
        res.status(500).json({ erro: 'Erro ao buscar aluno' });
    }
}

async function criarAlunosEmLote(req, res) {
    const usuarioId = req.usuarioId;
    const { alunos } = req.body;

    if (!Array.isArray(alunos) || alunos.length === 0) {
        return res.status(400).json({ erro: 'Nenhum aluno válido foi enviado.' });
    }

    try {
        const db = await dbPromise;
        const stmt = await db.prepare(`
            INSERT INTO aluno (nome, turmaId, anoVigente, ativo, usuarioId) 
            VALUES (?, ?, ?, ?, ?)
        `);

        for (let aluno of alunos) {
            if (!aluno.anoVigente) {
                return res.status(400).json({ erro: `O campo anoVigente é obrigatório para todos os alunos!` });
            }
            await stmt.run(aluno.nome, aluno.turmaId, aluno.anoVigente, aluno.ativo ?? 1, usuarioId);
        }

        await stmt.finalize();
        res.json({ mensagem: `${alunos.length} aluno(s) criado(s) com sucesso!` });
    } catch (err) {
        console.error('Erro ao criar alunos em lote:', err.message);
        res.status(500).json({ erro: 'Erro ao criar alunos' });
    }
}





module.exports = {
    listarAlunos,
    criarAluno,
    atualizarAluno,
    excluirAluno,
    buscarAlunoPorId,
    listarAlunosPorAnoETurma,
    buscarAlunoPorNomeETurma,
    criarAlunosEmLote
};
