
require('dotenv').config();

//1. Dependências e Middlewares
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const routerUser = require('./routes/routerUser');
const routerCliente = require('./routes/routerCliente');
const routerFornecedor = require('./routes/routerFornecedor');
const routerFuncionario = require('./routes/routerFuncionario');
const routerProduto = require('./routes/routerProduto');
const routerEntrada = require('./routes/routerEntrada');
const routerPedido = require('./routes/routerPedido');
const routerSaida = require('./routes/routerSaida');
//2. Controle de CORS (Headers & OPTIONS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));


//3. Definição de Rotas 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/usuario', routerUser);
app.use('/cliente', routerCliente);
app.use('/fornecedor', routerFornecedor);
app.use('/funcionario', routerFuncionario);
app.use('/produto', routerProduto);
app.use('/entrada', routerEntrada);
app.use('/pedido', routerPedido);
app.use('/saida', routerSaida);


//4. Tratamento de Erros (Fallback & Handler)



app.use((req,res,next)=>{
      const erro = new Error("Não encontrado!");
      erro.status = 404;
      next(erro);
});

app.use((error,req,res,next)=>{
    const status = Number.isInteger(error.status) ? error.status : 500;
  console.error(error);
    res.status(status);
        return res.json({
            erro:{
         mensagem: status === 500 ? 'Erro interno do servidor' : error.message
            }
        })
})

module.exports = app