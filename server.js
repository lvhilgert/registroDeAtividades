const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Controllers

// Usuários
const { cadastrarUsuario, 
        loginUsuario, 
        recuperarSenha } = require('./controllers/usuario.controller');
// Alunos
const { listarAlunos, 
        criarAluno,
        criarAlunosEmLote, 
        atualizarAluno, 
        excluirAluno, 
        buscarAlunoPorId,
        listarAlunosPorAnoETurma,
        buscarAlunoPorNomeETurma } = require('./controllers/aluno.controller');
// Turmas
const { listarTurmas, 
        criarTurma, 
        atualizarTurma, 
        excluirTurma, 
        listarTurmasPorAno, 
        buscarTurmaPorId } = require('./controllers/turma.controller');
// Avaliações
const { listarAvaliacoes,
        criarAvaliacao,
        atualizarAvaliacao,
        excluirAvaliacao,
        buscarAvaliacaoPorId,
        listarAvaliacoesPorAnoETurma,
        listarAvaliacoesComAtividades } = require('./controllers/avaliacao.controller');
// Atividades
const { listarAtividades,
        buscarAtividadePorId, 
        criarAtividade, 
        atualizarEstadoAtividade, 
        excluirAtividade, 
        atualizarAtividade } = require('./controllers/atividade.controller');
// Atividade x Aluno
const { listarAtividadesAluno, 
        criarAtividadeAluno, 
        atualizarAtividadeAluno,
        listarAlunosComNotas,
        buscarNomeAtividade } = require('./controllers/atividadeAluno.controller');

// Nota
const { calcularNotasPorAvaliacao } = require('./controllers/nota.controller');

// Middleware
const { autenticarToken } = require('./middleware/auth.middleware');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Rotas Abertas (Sem Login) ---
app.post('/api/usuarios/cadastrar-usuario', cadastrarUsuario);
app.post('/api/usuarios/login', loginUsuario);
app.post('/api/usuarios/recuperar-senha', recuperarSenha);

// --- Rotas Protegidas (Com Login) ---

// Alunos
app.get('/api/alunos', autenticarToken, listarAlunos);
app.get('/api/alunos/:id', autenticarToken, buscarAlunoPorId);
app.get('/api/alunos-ano-turma', autenticarToken, listarAlunosPorAnoETurma);
app.get('/api/alunos-verificar', autenticarToken, buscarAlunoPorNomeETurma);
app.post('/api/alunos', autenticarToken, criarAluno);
app.post('/api/alunos-lote', autenticarToken, criarAlunosEmLote);
app.put('/api/alunos/:id', autenticarToken, atualizarAluno);
app.delete('/api/alunos/:id', autenticarToken, excluirAluno);


// Turmas
app.get('/api/turmas', autenticarToken, listarTurmas);
app.get('/api/turmas-por-ano', autenticarToken, listarTurmasPorAno);
app.get('/api/turmas/:id', autenticarToken, buscarTurmaPorId);
app.put('/api/turmas/:id', autenticarToken, atualizarTurma);
app.post('/api/turmas', autenticarToken, criarTurma);
app.delete('/api/turmas/:id', autenticarToken, excluirTurma);

// Avaliações
app.get('/api/avaliacoes', autenticarToken, listarAvaliacoes);
app.post('/api/avaliacoes', autenticarToken, criarAvaliacao);
app.put('/api/avaliacoes/:id', autenticarToken, atualizarAvaliacao);
app.delete('/api/avaliacoes/:id', autenticarToken, excluirAvaliacao);
app.get('/api/avaliacoes/:id', autenticarToken, buscarAvaliacaoPorId);
app.get('/api/avaliacoes-ano-turma', autenticarToken, listarAvaliacoesPorAnoETurma);
app.get('/api/avaliacoes-com-atividades', autenticarToken, listarAvaliacoesComAtividades);

// Atividades
app.get('/api/atividades', autenticarToken, listarAtividades);
app.get('/api/atividades/:id', autenticarToken, buscarAtividadePorId);
app.post('/api/atividades', autenticarToken, criarAtividade);
app.put('/api/atividades/:id', autenticarToken, atualizarAtividade);
app.delete('/api/atividades/:id', autenticarToken, excluirAtividade);

// Atividades do Aluno (atividadeAluno)
app.get('/api/atividade-aluno', autenticarToken, listarAtividadesAluno);
app.get('/api/atividade-aluno/nome/:atividadeId', autenticarToken, buscarNomeAtividade);
app.get('/api/atividade-aluno/:atividadeId', autenticarToken, listarAlunosComNotas);
app.post('/api/atividade-aluno', autenticarToken, criarAtividadeAluno);
app.put('/api/atividade-aluno/:id', autenticarToken, atualizarAtividadeAluno);
// DELETE de atividadeAluno não é necessário, pois é apagado em cascata nas exclusões de aluno/atividade.

// Nota
app.get('/nota/:avaliacaoId', autenticarToken, calcularNotasPorAvaliacao);

app.listen(3000, () => {
    console.log('API rodando em http://localhost:3000');
});
