import { Product } from '../Models/products';
import supertest from 'supertest';
import { app } from '../server';
import { User } from '../Models/users';

const product = new Product();
const user = new User();
const request = supertest(app);
var authUserToken: string;
describe('The Methods of products', () => {
  it('Has an Index Method ', () => {
    expect(product.index).toBeDefined();
  });
  it('Has a show Method ', () => {
    expect(product.show).toBeDefined();
  });
  it('Has a create Method ', () => {
    expect(product.create).toBeDefined();
  });
});
describe('API Test for products', () => {
  it('get all products', async () => {
    const result = await request
      .get('/products')
      .set('Accept', 'application/json');
    expect(result.body).toEqual([
      {
        name: 'carpet',
        price: 50,
        category: 'furniture',
        id: 1
      },
      {
        name: 'iphone 7',
        price: 20,
        category: 'mobile',
        id: 2
      }
    ]);
  });
  it('get a product by id', async () => {
    const result = await request
      .get('/products/1')
      .set('Accept', 'application/json');
    expect(result.body).toEqual({
      name: 'carpet',
      price: 50,
      category: 'furniture',
      id: 1
    });
  });
  it('get product by category', async () => {
    const result = await request
      .get('/products?category=mobile')
      .set('Accept', 'application/json');
    expect(result.body).toEqual([
      {
        name: 'iphone 7',
        price: 20,
        category: 'mobile',
        id: 2
      }
    ]);
  });
  it('get top five products', async () => {
    const result = await request
      .get('/products?top5=true')
      .set('Accept', 'application/json');
    expect(result.status).toEqual(200);
  });
});
