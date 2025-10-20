// backend/src/middleware/auth.js
import dotenv from "dotenv";
dotenv.config();

/**
 * MVP sem JWT:
 * - Se existir process.env.API_KEY: exige header x-api-key igual à API_KEY.
 * - Se NÃO existir API_KEY: permite tudo (dev).
 */

export function authRequired(req, res, next) {
  const API_KEY = process.env.API_KEY;

  if (API_KEY) {
    const provided = req.header("x-api-key");
    if (!provided || provided !== API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  return next();
}

// Alias para compatibilidade com routes/index.js
export const requireAuth = authRequired;

// Útil para logs; no futuro pode anexar usuário real (via JWT)
export function attachUser(req, _res, next) {
  req.user = req.user || { role: "guest" };
  next();
}
