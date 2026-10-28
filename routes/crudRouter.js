const express = require('express');
const pool = require('../mysql').pool;
const bcrypt = require('bcryptjs');

function createCrudRouter(config) {
    const router = express.Router();
    const columns = config.columns;

    function validId(id) {
        return /^\d+$/.test(id) && Number(id) > 0;
    }

    function hashPassword(body, callback) {
        if (!config.passwordField || typeof body[config.passwordField] !== 'string') {
            return callback(null);
        }
        bcrypt.hash(body[config.passwordField], 10, (error, hash) => {
            if (error) return callback(error);
            body[config.passwordField] = hash;
            return callback(null);
        });
    }

    router.get('/', (req, res, next) => {
        const selectedColumns = config.selectColumns.join(', ');
        pool.query(`SELECT ${selectedColumns} FROM ${config.table}`, (error, results) => {
            if (error) return next(error);
            return res.status(200).json({ [config.responseKey]: results });
        });
    });

    router.get('/:id', (req, res, next) => {
        if (!validId(req.params.id)) {
            return res.status(400).json({ erro: { mensagem: 'ID inválido.' } });
        }

        pool.query(
            `SELECT ${config.selectColumns.join(', ')} FROM ${config.table} WHERE ${config.idField} = ?`,
            [Number(req.params.id)],
            (error, results) => {
                if (error) return next(error);
                if (results.length === 0) {
                    return res.status(404).json({ erro: { mensagem: `${config.label} não encontrado(a).` } });
                }
                return res.status(200).json({ [config.responseKey]: results[0] });
            }
        );
    });

    router.post('/', (req, res, next) => {
        const body = req.body || {};
        const missing = config.requiredFields.filter((field) => body[field] === undefined || body[field] === null);
        if (missing.length > 0) {
            return res.status(400).json({
                erro: { mensagem: `Campos obrigatórios: ${missing.join(', ')}.` }
            });
        }

        const createColumns = config.createColumns || columns;
        const fields = createColumns.filter((field) => body[field] !== undefined);
        const placeholders = fields.map(() => '?').join(', ');

        hashPassword(body, (hashError) => {
            if (hashError) return next(hashError);
            const insertValues = fields.map((field) => body[field]);
            pool.query(
                `INSERT INTO ${config.table} (${fields.join(', ')}) VALUES (${placeholders})`,
                insertValues,
                (error, result) => {
                    if (error) return next(error);
                    return res.status(201).json({
                        mensagem: `${config.label} criado(a) com sucesso.`,
                        [config.idField]: result.insertId || body[config.idField]
                    });
                }
            );
        });
    });

    router.patch('/:id', (req, res, next) => {
        if (!validId(req.params.id)) {
            return res.status(400).json({ erro: { mensagem: 'ID inválido.' } });
        }

        const body = req.body || {};
        const fields = columns.filter((field) => body[field] !== undefined);
        if (fields.length === 0) {
            return res.status(400).json({ erro: { mensagem: 'Informe ao menos um campo válido para atualizar.' } });
        }

        const assignments = fields.map((field) => `${field} = ?`).join(', ');
        hashPassword(body, (hashError) => {
            if (hashError) return next(hashError);
            const values = fields.map((field) => body[field]);
            values.push(Number(req.params.id));

            pool.query(
                `UPDATE ${config.table} SET ${assignments} WHERE ${config.idField} = ?`,
                values,
                (error, result) => {
                    if (error) return next(error);
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ erro: { mensagem: `${config.label} não encontrado(a).` } });
                    }
                    return res.status(200).json({ mensagem: `${config.label} atualizado(a) com sucesso.` });
                }
            );
        });
    });

    router.delete('/:id', (req, res, next) => {
        if (!validId(req.params.id)) {
            return res.status(400).json({ erro: { mensagem: 'ID inválido.' } });
        }

        pool.query(
            `DELETE FROM ${config.table} WHERE ${config.idField} = ?`,
            [Number(req.params.id)],
            (error, result) => {
                if (error) return next(error);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ erro: { mensagem: `${config.label} não encontrado(a).` } });
                }
                return res.status(200).json({ mensagem: `${config.label} removido(a) com sucesso.` });
            }
        );
    });

    return router;
}

module.exports = createCrudRouter;