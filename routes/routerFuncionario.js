const createCrudRouter = require('./crudRouter');

module.exports = createCrudRouter({
    table: 'funcionarios',
    idField: 'id_funcionario',
    label: 'Funcionário',
    responseKey: 'funcionario',
    columns: ['nome', 'cargo', 'salario', 'telefone', 'email', 'data_admissao', 'ativo'],
    createColumns: ['id_funcionario', 'nome', 'cargo', 'salario', 'telefone', 'email', 'data_admissao', 'ativo'],
    selectColumns: ['id_funcionario', 'nome', 'cargo', 'salario', 'telefone', 'email', 'data_admissao', 'ativo', 'criado_em', 'atualizado_em'],
    requiredFields: ['id_funcionario', 'nome', 'cargo', 'salario']
});