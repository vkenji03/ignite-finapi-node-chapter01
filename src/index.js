const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

// servira como um banco de dados somente para testes
const customers = [];

/**
 * cpf - string
 * name - string
 * id - uuid(universaly unique identifier)
 * statement(extrato) - []
 */
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const id = uuidv4(); // ira gerar o uuid

  customers.push({
    cpf,
    name,
    id,
    statement: []
  });

  return response.status(201).send();
});

app.listen(3333);