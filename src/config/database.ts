import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const dbPool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
});

dbPool.connect()
  .then(client => {
    client.release();
  })
  .catch(err => {
    console.error("❌ PostgreSQL connection failed:", err);
  });

export default dbPool;
