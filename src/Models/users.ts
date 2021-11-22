import client from '../database';
import bcrypt from 'bcrypt';

const { SALT, PASSWORD_SECRET } = process.env;
export type user = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  id?: number;
};
export type userSignIn = {
  username: string;
  password: string;
};

export class User {
  async index(): Promise<user[]> {
    try {
      const conn = await client.connect();
      const sql = 'select * from users';
      const results = await conn.query(sql);
      conn.release();
      return results.rows;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async show(id: number): Promise<user | string> {
    try {
      const conn = await client.connect();
      const sql = 'select * from users where id=$1';
      const results = await conn.query(sql, [id]);
      conn.release();
      if (results.rows.length) return results.rows[0];
      else return `couldnt find user with id ${id}`;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async create(user: user): Promise<user> {
    try {
      const conn = await client.connect();
      const sql = 'insert into users values ($1,$2,$3,$4) RETURNING *';
      const encrypted = bcrypt.hashSync(
        user.password + PASSWORD_SECRET,
        parseInt(SALT!)
      );
      const result = await conn.query(sql, [
        user.firstname,
        user.lastname,
        user.username,
        encrypted
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async authenticate(userSignIn: userSignIn): Promise<user | null> {
    try {
      const conn = await client.connect();
      var sql = 'select * from users where username=$1';
      const userPassword = await conn.query(sql, [userSignIn.username]);
      if (userPassword.rows.length) {
        if (
          bcrypt.compareSync(
            userSignIn.password + PASSWORD_SECRET,
            userPassword.rows[0].password_digest
          )
        ) {
          try {
            sql = 'select * from users where username=$1';
            const userInfo = await conn.query(sql, [userSignIn.username]);
            conn.release();
            return userInfo.rows[0];
          } catch (error) {
            throw new Error(error as string);
          }
        } else return null;
      } else return null;
    } catch (error) {
      throw new Error();
    }
  }
}
