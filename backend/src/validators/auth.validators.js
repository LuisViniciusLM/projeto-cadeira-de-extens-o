import { body } from 'express-validator';

export const registerRules = [
  body('nome').trim().notEmpty().withMessage('nome é obrigatório'),
  body('login').trim().notEmpty().withMessage('login é obrigatório'),
  body('senha').isLength({ min: 6 }).withMessage('senha mínima de 6 caracteres'),
  body('email').optional().isEmail().withMessage('email inválido')
];

export const loginRules = [
  body('login').notEmpty().withMessage('login é obrigatório'),
  body('senha').notEmpty().withMessage('senha é obrigatória')
];