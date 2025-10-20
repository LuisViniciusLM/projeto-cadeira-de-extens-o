import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParam, createUserRules, updateUserRules } from '../validators/usuarios.validators.js';
import bcrypt from 'bcryptjs';
import HttpError from '../utils/HttpError.js';

const router = Router();
router.use(authRequired);

router.get('/', async (_req, res) => {
  const rows = await query(`SELECT id, nome, login, email, data_cadastro FROM usuarios ORDER BY id DESC`);
  res.json(rows);
});

router.get('/:id', validate(idParam), async (req, res, next) => {
  try {
    const rows = await query(`SELECT id, nome, login, email, data_cadastro FROM usuarios WHERE id=:id`, { id: req.params.id });
    if (!rows.length) throw new HttpError(404, 'Usuário não encontrado');
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.post('/', validate(createUserRules), async (req, res, next) => {
  try {
    const { nome, login, senha, email } = req.body;
    const existe = await query('SELECT id FROM usuarios WHERE login=:login', { login });
    if (existe.length) throw new HttpError(409, 'login já cadastrado');
    const hash = await bcrypt.hash(senha, 10);
    const result = await query(
      `INSERT INTO usuarios (nome, login, senha, email) VALUES (:nome, :login, :senha, :email)`,
      { nome, login, senha: hash, email: email ?? null }
    );
    res.status(201).json({ id: result.insertId, nome, login, email });
  } catch (e) { next(e); }
});

router.put('/:id', validate([...idParam, ...updateUserRules]), async (req, res, next) => {
  try {
    const { nome, email } = req.body;
    await query(`UPDATE usuarios SET nome=COALESCE(:nome, nome), email=COALESCE(:email, email) WHERE id=:id`,
      { id: req.params.id, nome: nome ?? null, email: email ?? null });
    const rows = await query(`SELECT id, nome, login, email, data_cadastro FROM usuarios WHERE id=:id`, { id: req.params.id });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', validate(idParam), async (req, res, next) => {
  try {
    await query(`DELETE FROM usuarios WHERE id=:id`, { id: req.params.id });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;