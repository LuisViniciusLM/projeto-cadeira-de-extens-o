import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usuariosRoutes from './usuarios.routes.js';
import disciplinasRoutes from './disciplinas.routes.js';
import subtopicosRoutes from './subtopicos.routes.js';
import conteudosRoutes from './conteudos.routes.js';
import submissoesRoutes from './submissoes.routes.js';
import chatRoutes from './chat.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/disciplinas', disciplinasRoutes);
router.use('/subtopicos', subtopicosRoutes);
router.use('/conteudos', conteudosRoutes);
router.use('/submissoes', submissoesRoutes);
router.use('/chat', chatRoutes);

export default router;