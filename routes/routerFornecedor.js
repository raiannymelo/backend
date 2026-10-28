const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'fornecedores',
    idField: 'id_fornecedor',
    label: 'Fornecedor',
    responseKey: 'fornecedor',
    columns: ['nome', 'empresa', 'email', 'telefone', 'cidade', 'estado', 'ativo'],
    selectColumns: ['id_fornecedor', 'nome', 'empresa', 'email', 'telefone', 'cidade', 'estado', 'ativo', 'criado_em', 'atualizado_em'],
    requiredFields: ['nome']
});