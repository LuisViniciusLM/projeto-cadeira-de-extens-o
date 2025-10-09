import { body, param } from 'express-validator';
export const idParam = [param('id').isInt().toInt()];
export const createRules = [
  body('nome').notEmpty(),
  body('disciplina_id').isInt().withMessage('disciplina_id inválido'),
  body('descricao').optional()
];
export const updateRules = [
  body('nome').optional().notEmpty(),
  body('disciplina_id').optional().isInt(),
  body('descricao').optional()
];