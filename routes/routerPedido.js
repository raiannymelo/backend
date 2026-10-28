const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'pedidos',
    idField: 'id_pedido',
    label: 'Pedido',
    responseKey: 'pedido',
    columns: ['status', 'data_pedido', 'id_cliente'],
    selectColumns: ['id_pedido', 'status', 'data_pedido', 'id_cliente', 'criado_em', 'atualizado_em'],
    requiredFields: []
});