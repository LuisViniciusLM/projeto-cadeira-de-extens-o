import { validationResult } from 'express-validator';
import HttpError from '../utils/HttpError.js';

export function validate(rules) {
  return [
    ...rules,
    (req, _res, next) => {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(new HttpError(400, result.array().map(e => e.msg).join('; ')));
      }
      next();
    }
  ];
}