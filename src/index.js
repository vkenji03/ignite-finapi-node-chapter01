const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

// Servira como um banco de dados somente para testes
const customers = [];

// Middleware(funcoes que sao executadas entre o recebimento da request e o retorno da response)
// Todo middleware precisa receber esses tres parametros
function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find(customer => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: 'Customer not found' });
  }

  request.customer = customer; // permite que o customer seja recuperado apos a execucao desse middleware

  return next();
}

/**
 * cpf - string
 * name - string
 * id - uuid(universaly unique identifier)
 * statement(extrato) - []
 */
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);

  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists!' });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(), // ira gerar o uuid
    statement: []
  });

  return response.status(201).send();
});

// Duas formas diferentes de se usar middlewares
// app.use(verifyIfExistsAccountCPF);
app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.listen(3333);