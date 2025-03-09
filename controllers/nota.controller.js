const dbPromise = require('../db/db');

async function calcularNotasPorAvaliacao(req, res) {
    const usuarioId = req.usuarioId;
    const { avaliacaoId } = req.params;
    console.log("Calculando notas da avaliação ID:", avaliacaoId, usuarioId);

    try {
        const db = await dbPromise;

        const alunos = await db.all(`
            SELECT 
                aluno.id AS alunoId,
                aluno.nome AS nomeAluno,
                avaliacao.nome AS nomeAvaliacao,
                COUNT(DISTINCT atividade.id) AS totalAtividades,
                COALESCE(SUM(
                    CASE 
                        WHEN atividadeAluno.nota = 1 THEN 5 
                        WHEN atividadeAluno.nota = 2 THEN 10 
                        ELSE 0 
                    END
                ), 0) AS somaNotas
            FROM aluno
            JOIN turma ON aluno.turmaId = turma.id
            JOIN avaliacao ON avaliacao.turmaId = turma.id
            LEFT JOIN atividade ON atividade.avaliacaoId = avaliacao.id
            LEFT JOIN atividadeAluno ON atividadeAluno.atividadeId = atividade.id AND atividadeAluno.alunoId = aluno.id
            WHERE avaliacao.id = ? AND avaliacao.usuarioId = ?
            GROUP BY aluno.id, aluno.nome, avaliacao.nome
            ORDER BY aluno.nome;

        `, [avaliacaoId, usuarioId]);

        // Calcula a média das notas
        alunos.forEach(aluno => {
            aluno.notaFinal = aluno.totalAtividades > 0 ? (aluno.somaNotas / aluno.totalAtividades) : 0;
        });

        console.log('Notas calculadas:', alunos);
        res.json(alunos);
    } catch (err) {
        console.error('Erro ao calcular notas:', err.message);
        res.status(500).json({ erro: 'Erro ao calcular notas' });
    }
}

module.exports = { calcularNotasPorAvaliacao };
