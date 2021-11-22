import express, { Request, Response } from 'express';
import { Product, product } from '../Models/products';
import { DashboardFunctions } from '../Models/services/dashboard';
import dashboardRoutes, { verification } from './services/dashboard';

const productObj = new Product();
const dashboardObj = new DashboardFunctions();

const getProducts = async (_req: Request, res: Response) => {
  const query = _req.query;
  if (query) {
    if (query.top5 == 'true') {
      const result = await dashboardObj.get5MostPopular();
      return res.json(result);
    } else if (query.category) {
      const result = await dashboardObj.getByCategory(String(query.category));
      return res.json(result);
    }
  }
  const result = await productObj.index();
  return res.json(result);
};

const show = async (_req: Request, res: Response) => {
  const id = _req.params.id;
  const result = await productObj.show(Number(id));
  return res.json(result);
};

const create = async (_req: Request, res: Response) => {
  const obj: product = {
    name: _req.body.name,
    price: _req.body.price,
    category: _req.body.category
  };
  const result = await productObj.create(obj);
  return res.json(result);
};

const productRoutes = (app: express.Application) => {
  app.get('/products', getProducts);
  app.get('/products/:id', show);
  app.post('/products', verification, create);
};

export default productRoutes;
