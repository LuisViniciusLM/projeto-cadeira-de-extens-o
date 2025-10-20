// backend/src/db.js
// Pool Postgres com SSL automático (Render/Neon), helpers e ping.

import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;

// Render/Neon geralmente exigem SSL. Quando a URL contém "sslmode=require",
// habilitamos SSL. Caso contrário, deixamos desabilitado localmente.
const ssl =
  connectionString && connectionString.includes("sslmode=require")
    ? true
    : process.env.PG_SSL === "true"
    ? { rejectUnauthorized: false }
    : false;

export const pool = new Pool({
  connectionString,
  ssl,
  max: Number(process.env.PG_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT || 30000),
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

// Útil para healthcheck
export async function ping() {
  const { rows } = await query("SELECT 1 AS ok");
  return rows?.[0]?.ok === 1;
}

// Opcional: aplicar schema.sql automaticamente ao subir a API
// Ative definindo RUN_MIGRATIONS=true no .env da sua máquina local.
// Em produção (Render), prefira rodar migração uma única vez manualmente.
export async function migrateIfEnabled() {
  if (process.env.RUN_MIGRATIONS === "true") {
    const fs = await import("fs/promises");
    const path = await import("path");
    const dirname = process.cwd();
    const schemaPath = path.join(dirname, "src", "..", "schema.sql");
    const fallbackPath = path.join(dirname, "schema.sql");

    let sql = "";
    try {
      sql = await fs.readFile(schemaPath, "utf8");
    } catch {
      try {
        sql = await fs.readFile(fallbackPath, "utf8");
      } catch {
        console.warn("[DB] schema.sql não encontrado — pulei migração.");
        return;
      }
    }

    console.log("[DB] Aplicando schema.sql...");
    await pool.query(sql);
    console.log("[DB] Migração concluída.");
  }
}
