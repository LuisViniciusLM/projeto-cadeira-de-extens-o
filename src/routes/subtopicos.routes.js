import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParam, createRules, updateRules } from '../validators/subtopicos.validators.js';
import HttpError from '../utils/HttpError.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res) => {
  const { disciplina_id } = req.query;
  let sql = `SELECT s.*, d.nome AS disciplina_nome, u.nome AS criado_por_nome
             FROM subtopicos s 
             JOIN disciplinas d ON d.id = s.disciplina_id
             LEFT JOIN usuarios u ON u.id = s.criado_por`;
  const params = {};
  if (disciplina_id) {
    sql += ` WHERE s.disciplina_id=:disciplina_id`;
    params.disciplina_id = disciplina_id;
  }
  sql += ` ORDER BY s.id DESC`;
  const rows = await query(sql, params);
  res.json(rows);
});

router.get('/:id', validate(idParam), async (req, res, next) => {
  try {
    const rows = await query(`SELECT * FROM subtopicos WHERE id=:id`, { id: req.params.id });
    if (!rows.length) throw new HttpError(404, 'Subtópico não encontrado');
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.post('/', validate(createRules), async (req, res, next) => {
  try {
    const { nome, disciplina_id, descricao } = req.body;
    const r = await query(
      `INSERT INTO subtopicos (nome, disciplina_id, descricao, criado_por) VALUES (:nome,:disciplina_id,:descricao,:criado_por)`,
      { nome, disciplina_id, descricao: descricao ?? null, criado_por: req.user.id }
    );
    res.status(201).json({ id: r.insertId, nome, disciplina_id, descricao, criado_por: req.user.id });
  } catch (e) { next(e); }
});

router.put('/:id', validate([...idParam, ...updateRules]), async (req, res, next) => {
  try {
    const { nome, disciplina_id, descricao } = req.body;
    await query(
      `UPDATE subtopicos 
       SET nome=COALESCE(:nome, nome),
           disciplina_id=COALESCE(:disciplina_id, disciplina_id),
           descricao=COALESCE(:descricao, descricao)
       WHERE id=:id`,
      { id: req.params.id, nome: nome ?? null, disciplina_id: disciplina_id ?? null, descricao: descricao ?? null }
    );
    const rows = await query(`SELECT * FROM subtopicos WHERE id=:id`, { id: req.params.id });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', validate(idParam), async (req, res, next) => {
  try {
    await query(`DELETE FROM subtopicos WHERE id=:id`, { id: req.params.id });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;