import express, { Response, Request } from 'express';
import { DashboardFunctions } from '../../Models/services/dashboard';
import jwt from 'jsonwebtoken';
export var authUser: any = {};
export const verification = (req: Request, res: Response, next: () => void) => {
  const { TOKEN_SECRET } = process.env;
  try {
    const auth = req.headers.authorization;
    const token = auth?.split(' ')[1];
    jwt.verify(String(token), String(TOKEN_SECRET), function (err, decoded) {
      if (decoded) {
        authUser = decoded;
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  } catch (err) {
    return res.json('Auth faild2');
  }
};
const dashboardObj = new DashboardFunctions();

const getOrder = async (_req: Request, res: Response) => {
  if (_req.query.completed == 'true') {
    const results = await dashboardObj.getCompletedOrders(authUser.id);
    res.json(results);
  } else {
    const results = await dashboardObj.currentOrder(authUser.id);
    res.json(results);
  }
};

const dashboardRoutes = (app: express.Application) => {
  app.get('/cart', verification, getOrder);
};
export default dashboardRoutes;
