// A quantidade vendida pode ser de 1 ou mais unidades

import Product from '../src/model/product'
import sellProduct from '../src/service/sellProduct'

test('must validate stock write-off from the sale of a unit', () => {
    let item = new Product('cellphone', 500.00, 900.00, 10);
    sellProduct(item, 1);
    expect(item.stock).toBe(9);
})

test('must accept the sale of more than one unit', () => {
    let item = new Product('Cellphone', 500.00, 900.00, 10)
    sellProduct(item, 3);
    expect(item.stock).toBe(7);
})