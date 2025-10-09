import { body, param } from 'express-validator';
export const idParam = [param('id').isInt().toInt()];
export const createRules = [body('nome').notEmpty(), body('descricao').optional()];
export const updateRules = [body('nome').optional().notEmpty(), body('descricao').optional()];