import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const {Pool}=pg;

const pool=new Pool({
    connectionString: process.env.Database_URL,
    ssl: {rejectUnauthorized: false}
});

export default pool;