import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const {
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  ENV,
  POSTGRES_DB_TEST
} = process.env;

const client = new Pool({
  host: POSTGRES_HOST,
  database: ENV === 'test' ? POSTGRES_DB_TEST : POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

export default client;
