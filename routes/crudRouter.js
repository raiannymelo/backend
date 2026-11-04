const express = require('express');
const bcrypt = require('bcryptjs');
const { prisma } = require('../mysql');

function createCrudRouter(config) {
    const router = express.Router();
    const columns = config.columns;
    const model = config.modelName ? prisma[config.modelName] : prisma[config.table];

    if (!model) {
        throw new Error(`Modelo Prisma não encontrado para a tabela: ${config.table}`);
    }

    function validId(id) {
        return /^\d+$/.test(id) && Number(id) > 0;
    }

    async function findRecordById(id) {
        return model.findUnique({
            where: { [config.idField]: Number(id) }
        });
    }

    router.get('/', async (req, res, next) => {
        try {
            const rows = await model.findMany({
                select: Object.fromEntries(config.selectColumns.map((field) => [field, true]))
            });
            return res.status(200).json({ [config.responseKey]: rows });
        } catch (error) {
            return next(error);
        }
    });

    router.get('/:id', async (req, res, next) => {
        if (!validId(req.params.id)) {
            return res.status(400).json({ erro: { mensagem: 'ID inválido.' } });
        }

        try {
            const item = await findRecordById(req.params.id);
            if (!item) {
                return res.status(404).json({ erro: { mensagem: `${config.label} não encontrado(a).` } });
            }
            return res.status(200).json({ [config.responseKey]: item });
        } catch (error) {
            return next(error);
        }
    });

    router.post('/', async (req, res, next) => {
        const body = req.body || {};
        const missing = config.requiredFields.filter((field) => body[field] === undefined || body[field] === null);
        if (missing.length > 0) {
            return res.status(400).json({
                erro: { mensagem: `Campos obrigatórios: ${missing.join(', ')}.` }
            });
        }

        try {
            const createColumns = config.createColumns || columns;
            const fields = createColumns.filter((field) => body[field] !== undefined);
            const data = Object.fromEntries(fields.map((field) => [field, body[field]]));

            if (config.passwordField && typeof body[config.passwordField] === 'string') {
                data[config.passwordField] = await bcrypt.hash(body[config.passwordField], 10);
            }

            const created = await model.create({ data });
            return res.status(201).json({
                mensagem: `${config.label} criado(a) com sucesso.`,
                [config.idField]: created[config.idField] || body[config.idField]
            });
        } catch (error) {
            return next(error);
        }
    });

    router.patch('/:id', async (req, res, next) => {
        if (!validId(req.params.id)) {
            return res.status(400).json({ erro: { mensagem: 'ID inválido.' } });
        }

        const body = req.body || {};
        const fields = columns.filter((field) => body[field] !== undefined);
        if (fields.length === 0) {
            return res.status(400).json({ erro: { mensagem: 'Informe ao menos um campo válido para atualizar.' } });
        }

        try {
            const existing = await findRecordById(req.params.id);
            if (!existing) {
                return res.status(404).json({ erro: { mensagem: `${config.label} não encontrado(a).` } });
            }

            const data = Object.fromEntries(fields.map((field) => [field, body[field]]));

            if (config.passwordField && typeof body[config.passwordField] === 'string') {
                data[config.passwordField] = await bcrypt.hash(body[config.passwordField], 10);
            }

            await model.update({
                where: { [config.idField]: Number(req.params.id) },
                data
            });

            return res.status(200).json({ mensagem: `${config.label} atualizado(a) com sucesso.` });
        } catch (error) {
            return next(error);
        }
    });

    router.delete('/:id', async (req, res, next) => {
        if (!validId(req.params.id)) {
            return res.status(400).json({ erro: { mensagem: 'ID inválido.' } });
        }

        try {
            const existing = await findRecordById(req.params.id);
            if (!existing) {
                return res.status(404).json({ erro: { mensagem: `${config.label} não encontrado(a).` } });
            }

            await model.delete({
                where: { [config.idField]: Number(req.params.id) }
            });

            return res.status(200).json({ mensagem: `${config.label} removido(a) com sucesso.` });
        } catch (error) {
            return next(error);
        }
    });

    return router;
}

module.exports = createCrudRouter;