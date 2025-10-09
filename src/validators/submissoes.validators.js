import { body, param } from 'express-validator';
export const idParam = [param('id').isInt().toInt()];
export const createRules = [
  body('conteudo_id').isInt(),
  body('arquivo_url').optional().isString()
];
export const corrigirRules = [
  body('nota').isFloat({ min: 0, max: 100 }).withMessage('nota 0-100')
];