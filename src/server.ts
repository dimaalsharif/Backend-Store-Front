import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './Handlers/users';
import productRoutes from './Handlers/products';
import orderRoutes from './Handlers/orders';
import dashboardRoutes from './Handlers/services/dashboard';
import cors from 'cors'
export const app: express.Application = express();
app.use(bodyParser.json(),cors());
app.get('/', function (req: Request, res: Response) {
  return res.send('hi');
});

orderRoutes(app);
productRoutes(app);
userRoutes(app);
dashboardRoutes(app);
app.listen(3000, () => {
  console.log('Starting app');
});
