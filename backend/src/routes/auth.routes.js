import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { validate } from '../middleware/validate.js';
import { registerRules, loginRules } from '../validators/auth.validators.js';
import HttpError from '../utils/HttpError.js';

const router = Router();

router.post('/register', validate(registerRules), async (req, res, next) => {
  try {
    const { nome, login, senha, email } = req.body;
    const existe = await query('SELECT id FROM usuarios WHERE login = :login', { login });
    if (existe.length) throw new HttpError(409, 'login já cadastrado');

    const hash = await bcrypt.hash(senha, 10);
    const result = await query(
      `INSERT INTO usuarios (nome, login, senha, email) VALUES (:nome, :login, :senha, :email)`,
      { nome, login, senha: hash, email: email ?? null }
    );
    const id = result.insertId;
    const token = jwt.sign({ id, nome, login }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
    res.status(201).json({ token, user: { id, nome, login, email } });
  } catch (e) { next(e); }
});

router.post('/login', validate(loginRules), async (req, res, next) => {
  try {
    const { login, senha } = req.body;
    const rows = await query('SELECT id, nome, login, senha, email FROM usuarios WHERE login = :login', { login });
    if (!rows.length) throw new HttpError(401, 'Credenciais inválidas');
    const user = rows[0];
    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) throw new HttpError(401, 'Credenciais inválidas');

    const token = jwt.sign({ id: user.id, nome: user.nome, login: user.login }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
    res.json({ token, user: { id: user.id, nome: user.nome, login: user.login, email: user.email } });
  } catch (e) { next(e); }
});

export default router;