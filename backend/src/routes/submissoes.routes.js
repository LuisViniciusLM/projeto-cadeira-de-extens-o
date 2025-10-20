import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParam, createRules, corrigirRules } from '../validators/submissoes.validators.js';
import HttpError from '../utils/HttpError.js';

const router = Router();
router.use(authRequired);

router.get('/', async (req, res) => {
  const { conteudo_id, pagina = 1, limite = 20 } = req.query;
  const off = (parseInt(pagina) - 1) * parseInt(limite);
  let where = 'WHERE 1=1';
  const params = { limite: Number(limite), off };
  if (conteudo_id) { where += ' AND s.conteudo_id=:conteudo_id'; params.conteudo_id = conteudo_id; }

  const rows = await query(
    `SELECT s.*, u.nome AS aluno_nome, c.titulo AS conteudo_titulo
     FROM submissoes s 
     JOIN usuarios u ON u.id = s.usuario_id
     JOIN conteudos c ON c.id = s.conteudo_id
     ${where} 
     ORDER BY s.data_submissao DESC
     LIMIT :limite OFFSET :off`, params);
  const total = await query(`SELECT COUNT(*) as total FROM submissoes s ${where}`, params);
  res.json({ submissoes: rows, total: total[0].total });
});

router.post('/', validate(createRules), async (req, res, next) => {
  try {
    const { conteudo_id, arquivo_url } = req.body;
    const r = await query(
      `INSERT INTO submissoes (conteudo_id, usuario_id, arquivo_url) VALUES (:conteudo_id, :usuario_id, :arquivo_url)`,
      { conteudo_id, usuario_id: req.user.id, arquivo_url: arquivo_url ?? null }
    );
    const row = await query(`SELECT * FROM submissoes WHERE id=:id`, { id: r.insertId });
    res.status(201).json(row[0]);
  } catch (e) { next(e); }
});

router.put('/:id/nota', validate([...idParam, ...corrigirRules]), async (req, res, next) => {
  try {
    await query(`UPDATE submissoes SET nota=:nota WHERE id=:id`, { id: req.params.id, nota: req.body.nota });
    const row = await query(`SELECT * FROM submissoes WHERE id=:id`, { id: req.params.id });
    res.json(row[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', validate(idParam), async (req, res, next) => {
  try {
    await query(`DELETE FROM submissoes WHERE id=:id`, { id: req.params.id });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;