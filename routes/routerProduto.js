const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'produtos',
    idField: 'id_produto',
    label: 'Produto',
    responseKey: 'produto',
    columns: ['nome', 'descricao', 'preco'],
    selectColumns: ['id_produto', 'nome', 'descricao', 'preco', 'criado_em', 'atualizado_em'],
    requiredFields: ['descricao', 'preco']
});