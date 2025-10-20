import { body, param, query } from 'express-validator';
export const idParam = [param('id').isInt().toInt()];
export const createRules = [body('mensagem').notEmpty()];
export const listRules = [
  query('pagina').optional().isInt({ min:1 }).toInt(),
  query('limite').optional().isInt({ min:1, max:100 }).toInt()
];