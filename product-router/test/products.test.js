import request from 'supertest';

import app from '../src/app';
import { response } from 'express';

let products;

beforeEach(() => {
    products = [{
        "code": 1,
        "description": "Macbook",
        "buyPrice": 4000,
        "sellPrice": 7000,
        "tags": [
            "tecnologia",
            "computador",
            "apple"
        ], 
    }, {
        "code": 2,
        "description": "Positivo",
        "buyPrice": 2000,
        "sellPrice": 3000,
        "tags": [
            "tecnologia",
            "computador",
            "positivo"
        ],
    }];
});

describe("Testando a rota /products para criação de produtos", () => {
    test.only('Deve ser possível adicionar um novo produto', async () => {
        const response = await request(app)
            .post('/products')
            .send(products[0]);

            expect(response.body).toMatchObject({
                ...products[0]
            });
    })

    test('O status code de um produto criado deverá ser 201', async () => {
        const response = await request(app)
            .post('/products')
            .send(products[0]);

            expect(response.status).toBe(201);
    });
});

describe("Testando a rota /products para atualização de produtos", () => {
    test('Deve ser possível atualizar dados de um produto', async () => {
        const response = await request(app)
          .post('/products')
          .send(products[0]);
      
        const updateProduct = {
          ...products[0],
          description: 'Dell',
        };
      
        const responseUpdate = await request(app)
          .put(`/products/${response.body.id}`)
          .send(updateProduct);
      
        expect(responseUpdate.body).toMatchObject(updateProduct);
    });

    test('Não deve ser possível atualizar um produto inexistente', async () => {
        await request(app)
        .put('/products/9198123')
        .expect(400);
    });

});

describe("Testando a rota /products para remoção de produtos", () => {
    test('Não deve ser possível remover um produto inexistente', async () => {
        await request(app)
          .delete('/products/9198123')
          .expect(400);
    });
      
    test('Deve retornar o código 204 quando um produto for removido', async () => {
        const response = await request(app)
          .post('/products')
          .send(products[0]);
      
        await request(app)
          .delete(`/products/${response.body.code}`)
          .expect(204);
    });

    test('Deve ser possível remover os produtos pelo código', async () => {
        await request(app)
          .post('/products')
          .send(products[0]);
      
        const response = await request(app)
          .post('/products')
          .send(products[0]);
      
        await request(app)
          .post('/products')
          .send(products[1]);
      
        await request(app)
          .delete(`/products/${response.body.code}`);
      
        const responseAll = await request(app)
          .get('/products');
      
        expect(responseAll.body).toHaveLength(1);
      });
});

describe("Testando a rota /products para listagem de produtos", () => {
    test('Deve ser possível listar todos os produtos', async () => {
        const response = await request(app)
          .post('/products')
          .send(products[0]);
      
        const responseGet = await request(app)
          .get('/products');
      
        expect(responseGet.body).toHaveLength(1);
    });
});