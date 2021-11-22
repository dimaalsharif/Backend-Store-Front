import { Order } from '../Models/orders';
import supertest from 'supertest';
import { app } from '../server';
import { Product } from '../Models/products';
import { User } from '../Models/users';
const user = new User();
const order = new Order();
const request = supertest(app);
const product = new Product();
var authUserToken: string;

describe('The Methods of order', () => {
  it('Has an add to cart Method ', () => {
    expect(order.addCart).toBeDefined();
  });
  it('Has a remove product Method ', () => {
    expect(order.removeProduct).toBeDefined();
  });
  it('Has a checkout Method ', () => {
    expect(order.checkout).toBeDefined();
  });

  it('authenticates a user', async () => {
    const result = await request
      .post('/users/authenticate')
      .send({
        username: 'omar',
        password: 'hiiiiiiii'
      })
      .set('Accept', 'application/json');
    expect(result.body.userInfo.firstname).toEqual('hi');
    authUserToken = result.body.tokenId;
  });

  it('create a product for an order', async () => {
    const result = await request
      .post('/products')
      .send({
        name: 'iphone 7',
        price: 20,
        category: 'mobile'
      })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body).toEqual({
      name: 'iphone 7',
      price: 20,
      category: 'mobile',
      id: 2
    });
  });
});

describe('API Test for order', () => {
  it('creates an order', async () => {
    const result = await request
      .post('/cart')
      .send({
        pid: '1',
        quantity: 5
      })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body).toEqual({
      id: 1,
      orderid: '1',
      productid: '1',
      quantity: 5
    });
  });
  it('removes product from order', async () => {
    const result = await request
      .delete('/cart/2')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body).toEqual('product removed successfully');
  });
  it('checkout', async () => {
    const result = await request
      .put('/checkout')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body).toEqual('order completed!');
  });
});
