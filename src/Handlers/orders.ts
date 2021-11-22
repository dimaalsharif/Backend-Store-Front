import express, { Request, Response } from 'express';
import { verification } from './services/dashboard';
import { Order } from '../Models/orders';
const orderObj = new Order();

const addCart = async (_req: Request, res: Response) => {
  const pID = _req.body.pid;
  const quantity = _req.body.quantity;
  const results = await orderObj.addCart(pID, quantity);
  res.json(results);
};

const removeProduct = async (_req: Request, res: Response) => {
  const pid = _req.params.pid;
  const results = await orderObj.removeProduct(Number(pid));
  res.json(results);
};

const checkout = async (_req: Request, res: Response) => {
  const results = await orderObj.checkout();
  if (results) {
    return res.json(results);
  }
  return res.json('results');
};

const orderRoutes = (app: express.Application) => {
  app.post('/cart', verification, addCart);
  app.delete('/cart/:pid', verification, removeProduct);
  app.put('/checkout', verification, checkout);
};
export default orderRoutes;
