import client from '../database';
import { DashboardFunctions } from './services/dashboard';

export type product = {
  name: string;
  price: number;
  category: string;
  id?: number;
};

export class Product {
  async index(): Promise<product[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from products';
      const results = await conn.query(sql);
      conn.release();
      return results.rows;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async show(id: number): Promise<product> {
    try {
      const conn = await client.connect();
      const sql = 'select * from products where id=$1';
      const results = await conn.query(sql, [id]);
      conn.release();
      return results.rows[0];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(product: product): Promise<product> {
    try {
      const conn = await client.connect();
      const sql = 'insert into products values($1,$2,$3) RETURNING *';
      const results = await conn.query(sql, [
        product.name,
        product.price,
        product.category
      ]);
      conn.release();
      return results.rows[0];
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
