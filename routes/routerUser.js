const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../mysql');
const createCrudRouter = require('./crudRouter');

const router = express.Router();

router.post('/login', async (req, res, next) => {
   console.log('Login request body:', req.body); // Log the request body for debugging
    const { email, senha } = req.body || {};
    if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
        return res.status(400).json({ erro: { mensagem: 'Informe e-mail e senha.' } });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ erro: { mensagem: 'Autenticação não configurada no servidor.' } });
    }

    try {
        const user = await prisma.usuarios.findFirst({
            where: { email: email.trim() }
        });

        if (!user || !user.ativo) {
            return res.status(401).json({ erro: { mensagem: 'E-mail ou senha inválidos.' } });
        }

        const storedPassword = String(user.senha);
        const isBcryptHash = /^\$2[aby]\$/.test(storedPassword);

        const issueToken = () => {
            const token = jwt.sign(
                { sub: String(user.id_usu), email: user.email },
                jwtSecret,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                mensagem: 'Login realizado com sucesso.',
                token,
                usuario: { id_usu: user.id_usu, nome: user.nome, email: user.email }
            });
        };

        const loginFailed = () => res.status(401).json({ erro: { mensagem: 'E-mail ou senha inválidos.' } });

        if (isBcryptHash) {
            const matches = await bcrypt.compare(senha, storedPassword);
            if (!matches) return loginFailed();
            return issueToken();
        }

        if (senha !== storedPassword) return loginFailed();

        const hash = await bcrypt.hash(senha, 10);
        await prisma.usuarios.update({
            where: { id_usu: user.id_usu },
            data: { senha: hash }
        });

        return issueToken();
    } catch (error) {
        return next(error);
    }
});

router.use('/', createCrudRouter({
    table: 'usuarios',
    idField: 'id_usu',
    label: 'Usuário',
    responseKey: 'usuario',
    columns: ['nome', 'email', 'senha', 'contato', 'genero', 'ativo'],
    selectColumns: ['id_usu', 'nome', 'email', 'contato', 'genero', 'ativo', 'criado_em', 'atualizado_em'],
    requiredFields: ['nome', 'email', 'senha'],
    passwordField: 'senha'
}));

module.exports = router;