import { body, param } from 'express-validator';

export const idParam = [param('id').isInt().toInt()];

export const createUserRules = [
  body('nome').notEmpty(),
  body('login').notEmpty(),
  body('senha').isLength({ min: 6 }),
  body('email').optional().isEmail()
];

export const updateUserRules = [
  body('nome').optional().notEmpty(),
  body('email').optional().isEmail()
];