import request from 'supertest';
import app from '../src/app';
import { response } from 'express';
import Product from '../src/models/product';
import Validator from '../src/utils/validator';

let products;

beforeEach(() => {
  products = [
      new Product(
          12,
          "Macbook",
          4000,
          7000,
          ["tecnologia","computador","apple"]
      ),
      new Product(
          99,
          "Positivo",
          2000,
          3000,
          ["tecnologia", "computador","positivo"]
      )
  ];
});

describe("Testando a rota /products para criação de produtos", () => {
    test('Deve ser possível adicionar um novo produto', async () => {
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
      
        expect(responseGet.body).toHaveLength(2);
    });
});

/**
 * Requisitos: Deve ter entre 3 a 50 caracteres;
 * Caso de teste 1: Testar com 2 caracteres e deve ser negado;
 * Caso de teste 2: Testar com 3 caracteres e deve ser permitido;
 * Caso de teste 3: Testar com 50 caracteres e deve ser permitido;
 * Caso de teste 4: Testar com 51 caracteres e deve ser negado;
 */

describe("Testando as unidades da aplicação (quantidade de caracteres)", () => {
  test('Não deve ser aceita a descrição com 2 caracteres', () => {
    expect(() => {
      Validator.validProduct(new Product(
        144,
        'Pl',
        50.00,
        80.00,
        ['tecnologia', 'computador', 'gamer'],
      ));
    }).toThrow(new Error('Descrição deve estar entre 3 e 50 caracteres.'));
  });

  test('Deve ser aceito a descrição com 3 caracteres', () => {
    const product = Validator.validProduct(new Product(
      144,
      'Pro',
      50.00,
      80.00,
      ['tecnologia', 'computador', 'gamer'],
    ));
    expect(product.description).toBe('Pro');
  });

  test('Deve ser aceito a descrição com 50 caracteres', () => {
    const product = Validator.validProduct(new Product(
      144,
      'x'.repeat(50),
      50.00,
      80.00,
      ['tecnologia', 'computador', 'gamer'],
    ));
    expect(product.description).toBe('x'.repeat(50));
  });

  test.only('Não deve ser aceita a descrição com 51 caracteres', () => {
    expect(() => {
      Validator.validProduct(new Product(
        144,
        'x'.repeat(51),
        50.00,
        80.00,
        ['tecnologia', 'computador', 'gamer'],
      ));
    }).toThrow(new Error('Descrição deve estar entre 3 e 50 caracteres.'));
  });
});