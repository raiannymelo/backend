# API de Gestão de Loja

## Objetivo

Esta API fornece operações para consultar e administrar os principais dados de uma loja: usuários, clientes, fornecedores, funcionários, produtos, entradas de estoque, pedidos e saídas de estoque. Ela foi construída com Node.js e Express, utilizando MySQL como banco de dados.

## Tecnologias

- Node.js
- Express
- MySQL
- `bcryptjs` para hash e verificação de senhas
- `jsonwebtoken` para emissão de tokens JWT
- `dotenv` para carregar configurações de ambiente

## Como iniciar

1. Instale as dependências do projeto com `npm install`.
2. Configure as variáveis de ambiente em um arquivo `.env` na raiz do projeto:

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=raianny_loja
   JWT_SECRET=coloque_um_segredo_longo_e_aleatorio
   ```

3. Inicie o servidor em desenvolvimento com `npm run dev`, ou em execução normal com `npm start`.
4. Por padrão, o servidor usa a porta `5000`. A página inicial pode ser aberta em `http://localhost:5000/`.

## Recursos e endpoints

Todas as rotas abaixo são relativas à origem da API. Os endpoints de recursos oferecem operações de listagem, consulta por ID, criação, atualização parcial e exclusão.

| Recurso | Base | Chave primária |
| --- | --- | --- |
| Usuários | `/usuario` | `id_usu` |
| Clientes | `/cliente` | `id_cliente` |
| Fornecedores | `/fornecedor` | `id_fornecedor` |
| Funcionários | `/funcionario` | `id_funcionario` |
| Produtos | `/produto` | `id_produto` |
| Entradas de estoque | `/entrada` | `id_entrada` |
| Pedidos | `/pedido` | `id_pedido` |
| Saídas de estoque | `/saida` | `id_saida` |

Para cada recurso, estão disponíveis:

| Método | Caminho | Funcionalidade |
| --- | --- | --- |
| `GET` | `/recurso` | Lista os registros do recurso. |
| `GET` | `/recurso/:id` | Consulta um registro pela chave primária. |
| `POST` | `/recurso` | Cria um registro. |
| `PATCH` | `/recurso/:id` | Atualiza parcialmente um registro. |
| `DELETE` | `/recurso/:id` | Exclui um registro. |

### Login

`POST /usuario/login` autentica um usuário ativo pelo e-mail e senha. Envie um corpo JSON:

```json
{
  "email": "usuario@exemplo.com",
  "senha": "sua_senha"
}
```

Em caso de sucesso, a resposta inclui dados básicos do usuário e um token JWT com validade de uma hora. Senhas novas são armazenadas com hash bcrypt. Quando uma senha antiga em texto puro é validada pelo login, a API tenta convertê-la para bcrypt. O token é emitido, mas as outras rotas ainda não exigem autenticação por token.

### Exemplos de corpos JSON

Criar um cliente (`POST /cliente`):

```json
{
  "nome": "Maria da Silva",
  "email": "maria@exemplo.com",
  "contato": "63999990000",
  "ativo": 1
}
```

Criar um produto (`POST /produto`):

```json
{
  "nome": "Detergente",
  "descricao": "Detergente líquido 500 ml",
  "preco": 3.5
}
```

Criar uma entrada de estoque (`POST /entrada`):

```json
{
  "id_produto": 1,
  "id_fornecedor": 2,
  "quantidade": 20,
  "valor_unitario": 3.5,
  "data_entrada": "2026-10-28",
  "observacao": "Reposição"
}
```

## Respostas e erros

As respostas são JSON. Os códigos mais comuns incluem:

- `200`: consulta, atualização ou exclusão concluída.
- `201`: registro criado.
- `400`: campos obrigatórios ausentes ou ID inválido.
- `401`: credenciais de login inválidas ou usuário inativo.
- `404`: recurso ou registro não encontrado.
- `500`: erro interno ou falha de configuração/conexão.

## Observações sobre o banco de dados

- O esquema e os dados iniciais estão no arquivo `raianny_loja.sql`.
- A API usa nomes de tabelas e campos compatíveis com esse esquema.
- No SQL fornecido, as tabelas `funcionarios` e `saidas` não definem as respectivas chaves primárias como `AUTO_INCREMENT`; por isso, o cadastro desses recursos exige `id_funcionario` e `id_saida` no corpo da requisição.
- A tabela de pedidos contém apenas informações do pedido e do cliente; não há tabela de itens de pedido no esquema atual.

## Organização do código

- `server.js`: inicia o servidor HTTP.
- `app.js`: configura middlewares, página inicial, rotas e tratamento de erros.
- `mysql.js`: configura o pool de conexões MySQL.
- `routes/routerUser.js`: rotas de usuários e login.
- `routes/routerCliente.js`, `routerFornecedor.js`, `routerFuncionario.js`, `routerProduto.js`, `routerEntrada.js`, `routerPedido.js` e `routerSaida.js`: configurações de rota por recurso.
- `routes/crudRouter.js`: implementação compartilhada das operações CRUD.
