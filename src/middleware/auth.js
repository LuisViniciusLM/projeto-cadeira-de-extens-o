import jwt from 'jsonwebtoken';
import HttpError from '../utils/HttpError.js';

export function authRequired(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, 'Token ausente'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, nome, login }
    next();
  } catch {
    next(new HttpError(401, 'Token inválido ou expirado'));
  }
}