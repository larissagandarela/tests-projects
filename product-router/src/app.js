import express from 'express';
import cors from 'cors';
import Product from './models/product';


const app = express();

app.use(express.json());
app.use(cors());

let products = [];

app.get('/products', (request, response) => {
  response.json(products);
});

app.post('/products', (request, response) => {
  const { code, description, buyPrice, sellPrice, tags, id } = request.body;
  const product = new Product(code, description, buyPrice, sellPrice, tags, id)

  products.push(product);
  response.status(201).json(product);
});

app.put('/products/:id', (request, response) => {
  const { id } = request.params;

  const { description, buyPrice, sellPrice, tags } = request.body;
  const p = products.find((v) => v.id == id);

  if (p) {
    p.description = description;
    p.buyPrice = buyPrice;
    p.sellPrice = sellPrice;
    p.tags = tags;

    response.json(p);
  } else {
    response.status(400).send('Id não encontrado.');
  }
});

app.delete('/products/:code', (request, response) => {
  const { code } = request.params;
  const index = products.findIndex((v) => v.code == code);

  if (index == -1) {
    response.status(400).send();
  } else {
    products = products.filter((v) => v.code != code);
    response.status(204).send();
  }
});

export default app;
