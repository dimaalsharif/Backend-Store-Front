import { Order } from '../Models/orders';
import { DashboardFunctions } from '../Models/services/dashboard';
import { Product } from '../Models/products';
import supertest from 'supertest';
import { app } from '../server';
import { User } from '../Models/users';
const user = new User();
const order = new Order();
const request = supertest(app);
const product = new Product();
const dashboard = new DashboardFunctions();
var authUserToken: string;

describe('The Methods of dashboard', () => {
  it('creates a user', async () => {
    const result = await user.create({
      firstname: 'hi',
      lastname: 'bye',
      username: 'omar',
      password: 'hiiiiiiii'
    });
    expect(result.username).toEqual('omar');
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
        name: 'carpet',
        price: 50,
        category: 'furniture'
      })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body).toEqual({
      name: 'carpet',
      price: 50,
      category: 'furniture',
      id: 1
    });
  });
  it('creates an order', async () => {
    const result = await request
      .post('/cart')
      .send({
        pid: 1,
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

  it('Has a get current method', () => {
    expect(dashboard.currentOrder).toBeDefined();
  });
  it('Has a 5 most popular method', () => {
    expect(dashboard.get5MostPopular).toBeDefined();
  });
  it('Has a get completed orders method', () => {
    expect(dashboard.getCompletedOrders).toBeDefined();
  });
  it('Has a get by category method', () => {
    expect(dashboard.getByCategory).toBeDefined();
  });
});

describe('API Test for dashboard', () => {
  it('get current order', async () => {
    const result = await request
      .get('/cart')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body).toEqual([
      {
        name: 'carpet',
        price: 50,
        quantity: 5
      }
    ]);
  });
  it('get 5 most popular', async () => {
    const result = await request
      .get('/products?top5=true')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.status).toEqual(200);
  });
  it('get completed orders', async () => {
    const result = await request
      .get('/cart?completed=true')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body).toEqual('no completed products for this user');
  });
  it('gets users', async () => {
    const result = await request
      .get('/users')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body[0].username).toEqual('omar');
  });
  it('gets a user', async () => {
    const result = await request
      .get('/users/1')
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${authUserToken}`);
    expect(result.body.firstname).toEqual('hi');
  });
});
