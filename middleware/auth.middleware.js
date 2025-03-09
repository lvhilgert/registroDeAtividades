const jwt = require('jsonwebtoken');
const SECRET = 'super_secreto';

function autenticarToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ erro: 'Token inválido' });

        req.usuarioId = decoded.id; // Adiciona o usuário logado nas requisições
        next();
    });
}

module.exports = { autenticarToken };
