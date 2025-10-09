import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import HttpError from './utils/HttpError.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api', routes);

app.use((_req, _res, next) => next(new HttpError(404, 'Rota não encontrada')));

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Erro interno' });
});

export default app;