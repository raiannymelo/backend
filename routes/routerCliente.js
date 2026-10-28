const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'clientes',
    idField: 'id_cliente',
    label: 'Cliente',
    responseKey: 'cliente',
    columns: ['nome', 'email', 'contato', 'ativo'],
    selectColumns: ['id_cliente', 'nome', 'email', 'contato', 'ativo', 'criado_em', 'atualizado_em'],
    requiredFields: ['nome', 'email']
});