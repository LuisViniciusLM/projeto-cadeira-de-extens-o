import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParam, createRules, updateRules } from '../validators/conteudos.validators.js';
import HttpError from '../utils/HttpError.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res) => {
  const { subtopico_id, tipo, pagina = 1, limite = 20 } = req.query;
  const off = (parseInt(pagina) - 1) * parseInt(limite);

  let where = 'WHERE 1=1';
  const params = { limite: Number(limite), off };
  if (subtopico_id) { where += ' AND c.subtopico_id=:subtopico_id'; params.subtopico_id = subtopico_id; }
  if (tipo) { where += ' AND c.tipo=:tipo'; params.tipo = tipo; }

  const rows = await query(
    `SELECT c.*, s.nome AS subtopico_nome, u.nome AS criado_por_nome
     FROM conteudos c 
     JOIN subtopicos s ON s.id = c.subtopico_id
     LEFT JOIN usuarios u ON u.id = c.criado_por
     ${where}
     ORDER BY c.data_criacao DESC
     LIMIT :limite OFFSET :off`, params);

  const total = await query(`SELECT COUNT(*) as total FROM conteudos c ${where}`, params);
  res.json({ conteudos: rows, total: total[0].total });
});

router.get('/:id', validate(idParam), async (req, res, next) => {
  try {
    const rows = await query(`SELECT * FROM conteudos WHERE id=:id`, { id: req.params.id });
    if (!rows.length) throw new HttpError(404, 'Conteúdo não encontrado');
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.post('/', validate(createRules), async (req, res, next) => {
  try {
    const { titulo, tipo, descricao, arquivo_url, prazo, subtopico_id } = req.body;
    const r = await query(
      `INSERT INTO conteudos (titulo, tipo, descricao, arquivo_url, prazo, subtopico_id, criado_por)
       VALUES (:titulo,:tipo,:descricao,:arquivo_url,:prazo,:subtopico_id,:criado_por)`,
      { titulo, tipo, descricao: descricao ?? null, arquivo_url: arquivo_url ?? null, prazo: prazo ?? null, subtopico_id, criado_por: req.user.id }
    );
    res.status(201).json({ id: r.insertId, titulo, tipo, descricao, arquivo_url, prazo, subtopico_id, criado_por: req.user.id });
  } catch (e) { next(e); }
});

router.put('/:id', validate([...idParam, ...updateRules]), async (req, res, next) => {
  try {
    const { titulo, tipo, descricao, arquivo_url, prazo, subtopico_id } = req.body;
    await query(
      `UPDATE conteudos SET
        titulo=COALESCE(:titulo, titulo),
        tipo=COALESCE(:tipo, tipo),
        descricao=COALESCE(:descricao, descricao),
        arquivo_url=COALESCE(:arquivo_url, arquivo_url),
        prazo=COALESCE(:prazo, prazo),
        subtopico_id=COALESCE(:subtopico_id, subtopico_id)
       WHERE id=:id`,
      { id: req.params.id, titulo: titulo ?? null, tipo: tipo ?? null, descricao: descricao ?? null, arquivo_url: arquivo_url ?? null, prazo: prazo ?? null, subtopico_id: subtopico_id ?? null }
    );
    const rows = await query(`SELECT * FROM conteudos WHERE id=:id`, { id: req.params.id });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', validate(idParam), async (req, res, next) => {
  try {
    await query(`DELETE FROM conteudos WHERE id=:id`, { id: req.params.id });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;