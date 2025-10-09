import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { pool } from './db.js';

const PORT = process.env.PORT || 3001;

(async () => {
  await pool.query('SELECT 1');
  app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
})();