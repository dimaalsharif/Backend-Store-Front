import { User, user, userSignIn } from '../Models/users';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verification } from './services/dashboard';
import { DashboardFunctions } from '../Models/services/dashboard';

const userObj = new User();
const dashboardObj = new DashboardFunctions();
var userCredentials: userSignIn;
const { TOKEN_SECRET } = process.env;

const index = async (_req: Request, res: Response) => {
  const result = await userObj.index();
  return res.json(result);
};

const show = async (_req: Request, res: Response) => {
  const id = _req.params.id;
  const result = await userObj.show(Number(id));
  return res.json(result);
};

const create = async (_req: Request, res: Response) => {
  const userTemp: user = {
    firstname: _req.body.firstname,
    lastname: _req.body.lastname,
    username: _req.body.username,
    password: _req.body.password
  };
  const result = await userObj.create(userTemp);
  if (result) {
    var token = jwt.sign(userTemp, String(TOKEN_SECRET));
    return res.json({
      userInfo: result,
      tokenId: token
    });
  }
  return res.json('invalid');
};

const authenticate = async (_req: Request, res: Response) => {
  userCredentials = {
    username: _req.body.username,
    password: _req.body.password
  };
  const result = await userObj.authenticate(userCredentials);
  if (result) {
    var token = jwt.sign(result, String(TOKEN_SECRET));
    return res.json({
      userInfo: result,
      tokenId: token
    });
  }
  return res.json('invalid authenticate');
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verification, index);
  app.get('/users/:id', verification, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
};

export default userRoutes;
