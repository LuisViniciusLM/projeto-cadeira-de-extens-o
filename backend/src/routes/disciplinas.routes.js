import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParam, createRules, updateRules } from '../validators/disciplinas.validators.js';
import HttpError from '../utils/HttpError.js';

const router = Router();
router.use(authRequired);

router.get('/', async (_req, res) => {
  const rows = await query(`SELECT d.*, u.nome AS criado_por_nome
                            FROM disciplinas d LEFT JOIN usuarios u ON u.id = d.criado_por
                            ORDER BY d.id DESC`);
  res.json(rows);
});

router.get('/:id', validate(idParam), async (req, res, next) => {
  try {
    const rows = await query(`SELECT * FROM disciplinas WHERE id=:id`, { id: req.params.id });
    if (!rows.length) throw new HttpError(404, 'Disciplina não encontrada');
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.post('/', validate(createRules), async (req, res, next) => {
  try {
    const { nome, descricao } = req.body;
    const result = await query(`INSERT INTO disciplinas (nome, descricao, criado_por) VALUES (:nome,:descricao,:criado_por)`,
      { nome, descricao: descricao ?? null, criado_por: req.user.id });
    res.status(201).json({ id: result.insertId, nome, descricao, criado_por: req.user.id });
  } catch (e) { next(e); }
});

router.put('/:id', validate([...idParam, ...updateRules]), async (req, res, next) => {
  try {
    const { nome, descricao } = req.body;
    await query(`UPDATE disciplinas SET nome=COALESCE(:nome, nome), descricao=COALESCE(:descricao, descricao) WHERE id=:id`,
      { id: req.params.id, nome: nome ?? null, descricao: descricao ?? null });
    const rows = await query(`SELECT * FROM disciplinas WHERE id=:id`, { id: req.params.id });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', validate(idParam), async (req, res, next) => {
  try {
    await query(`DELETE FROM disciplinas WHERE id=:id`, { id: req.params.id });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;