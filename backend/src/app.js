// backend/src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js"; // agrega suas rotas /auth, /disciplinas, etc.

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// CORS (ajuste FRONTEND_ORIGIN em produção)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ---------- Pings / Smoke tests ----------
app.get("/", (_req, res) =>
  res.json({ ok: true, message: "EduApp API root" })
);

app.get("/api", (_req, res) =>
  res.json({ ok: true, message: "EduApp API" })
);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---------- Rotas da aplicação ----------
app.use("/api", routes);

// ---------- 404 para /api/* não mapeado ----------
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ---------- Handler de erros ----------
app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err);
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

export default app;
