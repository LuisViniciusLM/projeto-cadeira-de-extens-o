// backend/src/server.js
import app from "./app.js";
import dotenv from "dotenv";
import { migrateIfEnabled, ping } from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await migrateIfEnabled();
    await ping();
    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};

start();
