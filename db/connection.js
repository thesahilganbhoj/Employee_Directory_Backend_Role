// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || 'manager',
//   database: process.env.DB_NAME || 'employees',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });
// // '127.0.0.1'
// export default pool;

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sheetDB = axios.create({
  baseURL: `https://sheetdb.io/api/v1/${process.env.SHEETDB_ID}`,
  headers: {
    "Content-Type": "application/json"
  }
});

export default sheetDB;
