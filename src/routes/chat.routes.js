import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { listRules, createRules, idParam } from '../validators/chat.validators.js';

const router = Router();
router.use(authRequired);

router.get('/', validate(listRules), async (req, res) => {
  const pagina = Number(req.query.pagina || 1);
  const limite = Number(req.query.limite || 30);
  const off = (pagina - 1) * limite;

  const msgs = await query(
    `SELECT m.id, m.mensagem, m.timestamp, u.id as usuario_id, u.nome as usuario_nome
     FROM chat_mensagens m JOIN usuarios u ON u.id = m.usuario_id
     ORDER BY m.id DESC
     LIMIT :limite OFFSET :off`, { limite, off });

  const total = await query(`SELECT COUNT(*) as total FROM chat_mensagens`);
  res.json({ mensagens: msgs, total: total[0].total, pagina, limite });
});

router.post('/', validate(createRules), async (req, res, next) => {
  try {
    const r = await query(
      `INSERT INTO chat_mensagens (usuario_id, mensagem) VALUES (:usuario_id, :mensagem)`,
      { usuario_id: req.user.id, mensagem: req.body.mensagem }
    );
    const row = await query(
      `SELECT m.id, m.mensagem, m.timestamp, u.id as usuario_id, u.nome as usuario_nome
       FROM chat_mensagens m JOIN usuarios u ON u.id=m.usuario_id
       WHERE m.id=:id`, { id: r.insertId });
    res.status(201).json(row[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', validate(idParam), async (req, res, next) => {
  try {
    await query(`DELETE FROM chat_mensagens WHERE id=:id`, { id: req.params.id });
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;