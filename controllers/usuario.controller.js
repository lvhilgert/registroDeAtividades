const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const SECRET = 'super_secreto';
const dbPromise = require('../db/db');

async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    try {
        const db = await dbPromise;  // Aguarda a conexão
        const senhaHash = await bcrypt.hash(senha, 10);

        await db.run('INSERT INTO usuario (nome, email, senha_hash) VALUES (?, ?, ?)', [nome, email, senhaHash]);

        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (erro) {
        console.error('Erro ao cadastrar usuário:', erro.message);
        res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
    }
}

async function loginUsuario(req, res) {
    const { email, senha } = req.body;

    try {
        const db = await dbPromise;
        const usuario = await db.get('SELECT * FROM usuario WHERE email = ?', [email]);

        if (!usuario || !bcrypt.compareSync(senha, usuario.senha_hash)) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: '1h' });

        res.json({ mensagem: 'Login bem-sucedido', token, usuarioId: usuario.id });
    } catch (erro) {
        console.error('Erro ao processar login:', erro.message);
        res.status(500).json({ mensagem: 'Erro ao processar login' });
    }
}

async function recuperarSenha(req, res) {
    const { email } = req.body;

    try {
        const db = await dbPromise;
        const usuario = await db.get('SELECT * FROM usuario WHERE email = ?', [email]);

        if (!usuario) {
            return res.status(200).json({ mensagem: 'Se este e-mail estiver cadastrado, você receberá as informações de acesso.' });
        }
        const novaSenha = gerarSenhaTemporaria();
        const senhaHash = await bcrypt.hash(novaSenha, 10);
        await db.run('UPDATE usuario SET senha_hash = ? WHERE email = ?', [senhaHash, email]);
        await enviarEmailRecuperacao(usuario.email, novaSenha);

        res.status(200).json({ mensagem: 'E-mail de recuperação enviado com sucesso.' });
    } catch (erro) {
        console.error('Erro ao recuperar senha:', erro.message);
        res.status(500).json({ mensagem: 'Erro ao tentar recuperar senha.' });
    }
}

function gerarSenhaTemporaria() {
    return Math.random().toString(36).slice(-8);
}

async function enviarEmailRecuperacao(email, novaSenha) {
    console.log(`✉️ Tentando enviar email para: ${email} com senha: ${novaSenha}`);
    const emailPassword = process.env.EMAIL_PASSWORD;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'r.registrodeatividades@gmail.com',
            pass: 'emailPassword'
        }
    });

    const mailOptions = {
        from: 'r.registrodeatividades@gmail.com',
        to: email,
        subject: 'Recuperação de Senha',
        text: `Olá! Sua nova senha de acesso é: ${novaSenha}\n\nRecomendamos alterá-la após o primeiro login.`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ E-mail enviado:', info.response);
    } catch (erro) {
        console.error('❌ Erro ao enviar e-mail:', erro);
        throw erro;  // Repassa o erro pra função principal capturar e retornar 500.
    }
}


module.exports = { cadastrarUsuario, loginUsuario, recuperarSenha };
