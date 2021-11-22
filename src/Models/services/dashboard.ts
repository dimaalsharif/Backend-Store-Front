import client from '../../database';
import { product } from '../products';
import { authUser } from '../../Handlers/services/dashboard';

export type productDetails = {
  name: string;
  price: number;
  quantity: number;
};

export class DashboardFunctions {
  status: string = 'active';
  completed: string = 'completed';
  async getByCategory(category: string): Promise<product[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from products where category=$1';
      const results = await conn.query(sql, [category]);
      conn.release();
      return results.rows;
    } catch (error) {
      throw new Error(error as string);
    }
  }
  async get5MostPopular(): Promise<product[]> {
    try {
      const conn = await client.connect();
      const sql =
        'select products.name,products.price,products.category,products.id,sum (order_products.quantity) as quantity from order_products inner join products on (products.id=order_products.productid) group by products.name,products.price,products.category,products.id order by sum(order_products.quantity) desc limit 5;';
      const res = await conn.query(sql);
      return res.rows;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getCompletedOrders(UID:number): Promise<any[] | string> {
    try {
      const conn = await client.connect();
      var sql = 'select id from orders where order_status=$1 and userid=$2';
      sql ='select order_products.orderid, products.name,products.price,order_products.quantity from order_products inner join products on order_products.productid= products.id where order_products.orderid in (select id from orders where userid =$1 and order_status=$2);';
      var temp = await conn.query(sql, [UID, this.completed]);
      if (temp.rows.length > 0) return temp.rows;
      else return 'no completed products for this user';
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async currentOrder(uID:number): Promise<productDetails[] | string> {
    try {
      const conn = await client.connect();
      if (await this.checkIfAnyOrdersActive(uID)) {
        const oID = Number(await this.getActiveOrderNumber(uID));
        const sql =
          'select products.name,products.price,order_products.quantity from order_products inner join products on order_products.productid= products.id where order_products.orderid=$1';
        const productsRes = await conn.query(sql, [oID]);
        conn.release();
        return productsRes.rows;
      }
      conn.release();
      return 'user has no active order';
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async checkIfProductExists(oid: number, pid: number): Promise<boolean> {
    const conn = await client.connect();
    const sql =
      'select * from order_products where orderid=$1 and productid=$2';
    const results = await conn.query(sql, [oid, pid]);
    if (results.rows.length > 0) return true;
    else return false;
  }

  async checkIfAnyOrdersActive(userid: number): Promise<boolean> {
    const conn = await client.connect();
    const sql = 'select id from orders where order_status=$1 and userid=$2';
    const result = await conn.query(sql, [this.status, userid]);
    conn.release();
    if (result.rows.length > 0) {
      return true;
    }
    return false;
  }

  async getActiveOrderNumber(userid: number): Promise<number> {
    const conn = await client.connect();
    var sql = 'select id from orders where userid=$1 and order_status=$2';
    var temp = await conn.query(sql, [userid, this.status]);
    var oID = temp.rows[0].id;
    return oID;
  }

  async getAuthUserID(): Promise<number> {
    const username = authUser.username;
    const conn = await client.connect();
    var sql = 'select id from users where username=$1';
    var temp = await conn.query(sql, [username]);
    const UID = temp.rows[0].id;
    return Number(UID);
  }
}
