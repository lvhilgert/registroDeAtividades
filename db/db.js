const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db;

async function initDb() {
    if (!db) {
        db = await open({
            filename: './banco.sqlite',
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS usuario (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS turma (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuarioId INTEGER NOT NULL,
                nome TEXT NOT NULL,
                serie TEXT NOT NULL,
                anoVigente INTEGER NOT NULL,
                ativo BOOLEAN NOT NULL DEFAULT 1,
                FOREIGN KEY (usuarioId) REFERENCES usuario(id)
            );

            CREATE TABLE IF NOT EXISTS avaliacao (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuarioId INTEGER NOT NULL,
                nome TEXT NOT NULL,
                anoVigente INTEGER NOT NULL,
                turmaId INTEGER NOT NULL,
                ativo BOOLEAN NOT NULL DEFAULT 1,
                estado INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (turmaId) REFERENCES turma(id),
                FOREIGN KEY (usuarioId) REFERENCES usuario(id)
            );

            CREATE TABLE IF NOT EXISTS atividade (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuarioId INTEGER NOT NULL,
                nome TEXT NOT NULL,
                avaliacaoId INTEGER NOT NULL,
                estado INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (avaliacaoId) REFERENCES avaliacao(id),
                FOREIGN KEY (usuarioId) REFERENCES usuario(id)
            );

            CREATE TABLE IF NOT EXISTS aluno (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuarioId INTEGER NOT NULL,
                nome TEXT NOT NULL,
                turmaId INTEGER NOT NULL,
                anoVigente INTEGER NOT NULL,
                ativo BOOLEAN NOT NULL DEFAULT 1,
                FOREIGN KEY (turmaId) REFERENCES turma(id),
                FOREIGN KEY (usuarioId) REFERENCES usuario(id)
            );

            CREATE TABLE IF NOT EXISTS atividadeAluno (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuarioId INTEGER NOT NULL,
                alunoId INTEGER NOT NULL,
                atividadeId INTEGER NOT NULL,
                nota INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (alunoId) REFERENCES aluno(id),
                FOREIGN KEY (atividadeId) REFERENCES atividade(id),
                FOREIGN KEY (usuarioId) REFERENCES usuario(id)
            );
        `);
    }

    return db;
}

module.exports = initDb();
