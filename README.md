# API de Gestão de Loja

## Nome e objetivo da API

A API de Gestão de Loja é um backend em Node.js para controlar as operações essenciais de uma loja, incluindo cadastro de usuários, clientes, fornecedores, funcionários, produtos, entradas de estoque, pedidos e saídas de estoque.

O objetivo principal é centralizar o processamento e a persistência dos dados da operação comercial em uma interface REST, permitindo que aplicações web, mobile ou integrações externas realizem consultas, cadastros, atualizações e remoções de forma padronizada.

## Problema que a API resolve

Antes de um backend centralizado, o controle de uma loja geralmente fica espalhado em planilhas, formulários isolados e processos manuais. Essa API resolve esse problema ao oferecer um ponto único para:

- cadastrar e consultar usuários do sistema;
- gerir clientes e fornecedores;
- registrar fornecedores, funcionários e produtos;
- controlar entradas e saídas de estoque;
- registrar pedidos e movimentações relacionadas à operação comercial;
- manter os dados em um banco relacional consistente e acessível por endpoints HTTP.

## Tecnologias utilizadas no backend

- Node.js
- Express
- JavaScript / CommonJS
- Prisma ORM
- MySQL
- JWT (JSON Web Token)
- bcryptjs
- dotenv
- CORS
- Morgan
- Body Parser

## ORM utilizado e sua finalidade

O ORM utilizado é o Prisma.

Sua finalidade é abstrair a comunicação com o banco de dados, modelar as tabelas do sistema em objetos JavaScript/TypeScript, facilitar consultas e escrita de registros, além de manter a estrutura do banco em um arquivo de schema (`prisma/schema.prisma`). No projeto, o Prisma é usado para acessar os modelos `usuarios`, `clientes`, `fornecedores`, `funcionarios`, `produtos`, `entradas`, `pedidos` e `saidas`.

## Banco de dados utilizado

O banco de dados utilizado é o MySQL.

As configurações de conexão são feitas via variáveis de ambiente e a API também possui suporte ao Prisma para gerenciar o schema do banco. O arquivo `raianny_loja.sql` contém o esquema e dados iniciais do sistema.

## Estrutura do projeto

- `app.js`: configuração do Express, middlewares, rotas e tratamento de erros.
- `server.js`: inicia o servidor HTTP.
- `mysql.js`: inicializa a conexão com MySQL e o Prisma Client.
- `routes/`: arquivos específicos para cada recurso e para autenticação.
- `prisma/schema.prisma`: definição do modelo do banco com Prisma.
- `raianny_loja.sql`: script SQL com estrutura e dados iniciais.
- `index.html`: página inicial do servidor.

## Instalação e execução

1. Clone o projeto e acesse a pasta raiz.
2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo.
4. Gere o cliente Prisma, caso ainda não tenha sido gerado:

```bash
npx prisma generate
```

5. Inicie o servidor em modo de desenvolvimento:

```bash
npm run dev
```

6. Para executar em produção:

```bash
npm start
```

A API será iniciada por padrão na porta `5000`, salvo configuração diferente da variável `PORT`.

## Variáveis de ambiente necessárias

Crie um arquivo `.env` na raiz com esta estrutura, substituindo os valores de exemplo pelos dados reais do ambiente local ou da hospedagem:

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=raianny_loja
DATABASE_URL="mysql://seu_usuario:sua_senha@localhost:3306/raianny_loja"
JWT_SECRET=uma_chave_secreta_muito_segura
```

Observações:

- Nunca compartilhe valores reais de senha, token ou chaves secretas.
- `JWT_SECRET` é usado para assinar os tokens gerados no login.
- `DATABASE_URL` deve refletir a conexão do banco em uso.
- `CORS_ORIGIN` deve conter as origens autorizadas do frontend, separadas por vírgula (protocolo, domínio e porta; sem caminho). Em produção, configure o domínio real do frontend nessa variável.

## Rotas disponíveis

Todas as rotas abaixo são relativas à origem da API. Em desenvolvimento, a base mais comum é:

```text
http://localhost:5000
```

### Rota raiz

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/` | Retorna a página inicial do backend em HTML. |

### Autenticação

| Método | Rota | Finalidade |
| --- | --- | --- |
| POST | `/usuario/login` | Valida e-mail e senha e retorna um token JWT. |

### Recursos da loja

| Recurso | Base | Chave primária |
| --- | --- | --- |
| Usuários | `/usuario` | `id_usu` |
| Clientes | `/cliente` | `id_cliente` |
| Fornecedores | `/fornecedor` | `id_fornecedor` |
| Funcionários | `/funcionario` | `id_funcionario` |
| Produtos | `/produto` | `id_produto` |
| Entradas | `/entrada` | `id_entrada` |
| Pedidos | `/pedido` | `id_pedido` |
| Saídas | `/saida` | `id_saida` |

Para cada recurso, a API oferece as operações CRUD:

| Método | Caminho | Finalidade |
| --- | --- | --- |
| GET | `/recurso` | Listar todos os registros. |
| GET | `/recurso/:id` | Buscar um registro por ID. |
| POST | `/recurso` | Criar um novo registro. |
| PATCH | `/recurso/:id` | Atualizar parcialmente um registro. |
| DELETE | `/recurso/:id` | Remover um registro. |

## Formato dos dados enviados e das respostas retornadas

A API aceita e responde em JSON.

### Respostas de sucesso

#### Login

```json
{
  "mensagem": "Login realizado com sucesso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usu": 1,
    "nome": "Maria da Silva",
    "email": "maria@email.com"
  }
}
```

#### Listagem de registros

```json
{
  "usuario": [
    {
      "id_usu": 1,
      "nome": "Maria da Silva",
      "email": "maria@email.com",
      "contato": "63999990000",
      "genero": "F",
      "ativo": 1,
      "criado_em": "2026-10-30T00:00:00.000Z",
      "atualizado_em": "2026-10-30T00:00:00.000Z"
    }
  ]
}
```

#### Criação

```json
{
  "mensagem": "Usuário criado(a) com sucesso.",
  "id_usu": 1
}
```

### Respostas de erro

```json
{
  "erro": {
    "mensagem": "E-mail ou senha inválidos."
  }
}
```

Códigos HTTP comuns:

- `200`: operação concluída com sucesso.
- `201`: registro criado com sucesso.
- `400`: dados inválidos ou campos obrigatórios ausentes.
- `401`: autenticação falhou ou usuário inválido.
- `404`: recurso não encontrado.
- `500`: erro interno do servidor.

## Exemplos de payloads

### Cadastrar usuário

Endpoint: `POST /usuario`

```json
{
  "nome": "Maria da Silva",
  "email": "maria@email.com",
  "senha": "minhaSenha123",
  "contato": "63999990000",
  "genero": "F",
  "ativo": 1
}
```

### Fazer login

Endpoint: `POST /usuario/login`

```json
{
  "email": "maria@email.com",
  "senha": "minhaSenha123"
}
```

### Cadastrar cliente

```json
{
  "nome": "João Pereira",
  "email": "joao@email.com",
  "contato": "61988887777",
  "ativo": 1
}
```

### Cadastrar produto

```json
{
  "nome": "Detergente",
  "descricao": "Detergente líquido 500ml",
  "preco": 12.5
}
```

### Cadastrar entrada de estoque

```json
{
  "id_produto": 1,
  "id_fornecedor": 2,
  "quantidade": 20,
  "valor_unitario": 3.5,
  "data_entrada": "2026-10-30",
  "observacao": "Reposição do estoque"
}
```

## Cadastro de usuário e teste de login

1. Crie um usuário via `POST /usuario` com os campos `nome`, `email` e `senha` obrigatórios.
2. A senha será hasheada com `bcryptjs` antes de ser salva no banco.
3. Faça uma requisição para `POST /usuario/login` com o mesmo `email` e `senha` do usuário.
4. Se as credenciais estiverem corretas, a API devolverá um `token` JWT e os dados do usuário.
5. Copie o `token` e, se a aplicação for futuramente protegida por middleware de autenticação, envie-o no cabeçalho:

```http
Authorization: Bearer <token>
```

## Autenticação e rotas protegidas

A aplicação atualmente possui um fluxo de autenticação funcional no login:

- a rota `/usuario/login` valida as credenciais;
- se o usuário estiver ativo e a senha for válida, a API emite um JWT;
- o token tem expiração de 1 hora.

No estado atual do código, as rotas de CRUD não possuem middleware de autorização aplicado em `app.js`, ou seja, as operações de recursos ainda são públicas. Isso significa que o token é gerado e disponibilizado pela API, mas a validação do JWT não está sendo exigida em todas as rotas neste momento.

Se o projeto for evoluído para autenticação estrita, o padrão esperado será:

- enviar o token no header `Authorization`;
- verificar o JWT antes de permitir acesso aos endpoints de recursos;
- rejeitar requisições sem token ou com token inválido com `401`.

## Endereço público da API após a hospedagem

Em desenvolvimento, a API normalmente será acessada em:

```text
http://localhost:5000
```

Em produção ou hospedagem, o endereço público dependerá da plataforma escolhida. Exemplos comuns:

```text
https://nome-do-projeto.onrender.com
https://seu-dominio.com
https://api.exemplo.com
```

O valor exato deve ser ajustado conforme a infraestrutura de hospedagem utilizada (Render, Railway, Vercel, VPS, etc.).

## Observações importantes

- O arquivo `raianny_loja.sql` deve ser utilizado para criar a estrutura inicial do banco.
- O Prisma usa o schema em `prisma/schema.prisma` e a variável `DATABASE_URL` para conectar ao MySQL.
- Alguns campos de cadastro exigem valores do banco e podem não ter validação rígida no nível da API, então o cliente deve enviar os dados no formato esperado.
- O projeto ainda tem uma arquitetura de CRUD genérico compartilhada em `routes/crudRouter.js`, o que simplifica a criação e manutenção dos endpoints.

## Resumo

A API de Gestão de Loja oferece um backend completo para gerenciar o fluxo operacional de uma loja utilizando Node.js, Express, Prisma e MySQL. Ela centraliza usuários, clientes, fornecedores, funcionários, produtos, entradas, saídas e pedidos em endpoints REST, com autenticação através de login e JWT, embora a proteção de acesso por token ainda precise ser aplicada de maneira explícita nas rotas sensíveis.
