const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'saidas',
    idField: 'id_saida',
    label: 'Saída',
    responseKey: 'saida',
    columns: ['id_produto', 'id_funcionario', 'quantidade', 'valor_unitario', 'data_saida', 'destino'],
    createColumns: ['id_saida', 'id_produto', 'id_funcionario', 'quantidade', 'valor_unitario', 'data_saida', 'destino'],
    selectColumns: ['id_saida', 'id_produto', 'id_funcionario', 'quantidade', 'valor_unitario', 'data_saida', 'destino', 'criado_em', 'atualizado_em'],
    requiredFields: ['id_saida', 'id_produto', 'id_funcionario', 'quantidade', 'valor_unitario']
});