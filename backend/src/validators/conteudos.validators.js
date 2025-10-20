import { body, param } from 'express-validator';
export const idParam = [param('id').isInt().toInt()];
export const createRules = [
  body('titulo').notEmpty(),
  body('tipo').isIn(['materia','trabalho','atividade','prova']),
  body('descricao').optional(),
  body('arquivo_url').optional().isString(),
  body('prazo').optional().isISO8601().toDate(),
  body('subtopico_id').isInt()
];
export const updateRules = [
  body('titulo').optional().notEmpty(),
  body('tipo').optional().isIn(['materia','trabalho','atividade','prova']),
  body('descricao').optional(),
  body('arquivo_url').optional().isString(),
  body('prazo').optional().isISO8601().toDate(),
  body('subtopico_id').optional().isInt()
];