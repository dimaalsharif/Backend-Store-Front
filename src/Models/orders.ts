import { RSA_NO_PADDING } from 'constants';
import internal from 'stream';
import client from '../database';
import { authUser } from '../Handlers/services/dashboard';
export type order = {
  id?: number;
  status: string;
  userid: number;
};
export type cart = {
  id?: number;
  orderid: number;
  productid: number;
  quantity: number;
};
export type productDetails = {
  name: string;
  price: number;
  quantity: number;
};

// const dashboard= new DashboardFunctions()

// Current Order by user (args: user id)[token required]
// [OPTIONAL] Completed Orders by user (args: user id)[token required]
export class Order {
  status: string = 'active';
  completed: string = 'completed';
  async addCart(pID: number, quantity: number): Promise<cart> {
    try {
      var oID: number;
      const UID = Number(authUser.id);
      var sql;
      var temp;
      const conn = await client.connect();
      if ((await this.checkIfAnyOrdersActive(UID)) === false) {
        sql = 'insert into orders values($1,$2) RETURNING *';
        temp = await conn.query(sql, [this.status, UID]);
        oID = temp.rows[0].id;
        console.log('new order added!');
      } //in case its a new order
      else {
        oID = Number(await this.getActiveOrderNumber(UID));
      } //fetching active order number
      if ((await this.checkIfProductExists(oID, pID)) !== false) {
        sql =
          'select quantity from order_products where orderid=$1 and productid=$2';
        temp = await conn.query(sql, [oID, pID]);
        sql =
          'update order_products set quantity=$1 where orderid=$2 and productid=$3 RETURNING *';
        temp = await conn.query(sql, [quantity, oID, pID]);
        conn.release();
        return temp.rows[0];
      } //adding to cart, in case of product already exists
      else {
        sql =
          'insert into order_products(orderid,productid,quantity) values($1,$2,$3) RETURNING *';
        temp = await conn.query(sql, [oID, pID, quantity]);
        conn.release();
        return temp.rows[0];
      } //adding to cart, in case its a new product
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async removeProduct(pid: number): Promise<string> {
    try {
      const conn = await client.connect();
      const UID = Number(authUser.id);
      const OID = Number(await this.getActiveOrderNumber(UID));
      const sql =
        'delete from order_products where orderid=$1 and productid=$2';
      const res = await conn.query(sql, [OID, pid]);
      return 'product removed successfully';
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async checkout(): Promise<string> {
    try {
      const conn = await client.connect();
      const UID = Number(authUser.id);
      const oID = Number(await this.getActiveOrderNumber(UID));
      const sql = 'update orders set order_status=$1 where id=$2 RETURNING *';
      const temp = await conn.query(sql, [this.completed, oID]);
      conn.release();
      return 'order completed!';
    } catch (error) {
      throw new Error(error as string);
    }
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

  async checkIfProductExists(oid: number, pid: number): Promise<boolean> {
    const conn = await client.connect();
    const sql =
      'select * from order_products where orderid=$1 and productid=$2';
    const results = await conn.query(sql, [oid, pid]);
    if (results.rows.length > 0) return true;
    else return false;
  }
}
