const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../mysql').pool;
const createCrudRouter = require('./crudRouter');

const router = express.Router();

router.post('/login', (req, res, next) => {
    const { email, senha } = req.body || {};
    if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha) {
        return res.status(400).json({ erro: { mensagem: 'Informe e-mail e senha.' } });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ erro: { mensagem: 'Autenticação não configurada no servidor.' } });
    }

    pool.query(
        'SELECT id_usu, nome, email, senha, ativo FROM usuarios WHERE email = ? LIMIT 1',
        [email.trim()],
        (error, results) => {
            if (error) return next(error);
            const user = results[0];
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
                const bcryptHash = storedPassword.replace(/^\$2y\$/, '$2b$');
                return bcrypt.compare(senha, bcryptHash, (compareError, matches) => {
                    if (compareError) return next(compareError);
                    if (!matches) return loginFailed();
                    return issueToken();
                });
            }

            // Compatibilidade temporária com senhas antigas em texto puro: migra para bcrypt após login válido.
            if (senha !== storedPassword) return loginFailed();
            bcrypt.hash(senha, 10, (hashError, hash) => {
                if (hashError) return next(hashError);
                pool.query(
                    'UPDATE usuarios SET senha = ? WHERE id_usu = ?',
                    [hash, user.id_usu],
                    (updateError) => {
                        if (updateError) return next(updateError);
                        return issueToken();
                    }
                );
            });
        }
    );
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