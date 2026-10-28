const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'entradas',
    idField: 'id_entrada',
    label: 'Entrada',
    responseKey: 'entrada',
    columns: ['id_produto', 'id_fornecedor', 'quantidade', 'valor_unitario', 'data_entrada', 'observacao'],
    selectColumns: ['id_entrada', 'id_produto', 'id_fornecedor', 'quantidade', 'valor_unitario', 'data_entrada', 'observacao', 'criado_em', 'atualizado_em'],
    requiredFields: ['id_produto', 'id_fornecedor', 'quantidade', 'valor_unitario']
});