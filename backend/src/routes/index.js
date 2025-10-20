import { Router } from "express";
import { requireAuth, attachUser } from "../middleware/auth.js";
import authRoutes from "./auth.routes.js";
import disciplinasRoutes from "./disciplinas.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import conteudosRoutes from "./conteudos.routes.js";
import submissoesRoutes from "./submissoes.routes.js";
import chatRoutes from "./chat.routes.js";
import subtopicosRoutes from "./subtopicos.routes.js";

const router = Router();

// opcional: anexa user (guest) para logs
router.use(attachUser);

// rotas públicas (login/cadastro, se existirem)
router.use("/auth", authRoutes);

// rotas protegidas (MVP: por API_KEY se definida; senão, liberadas)
router.use("/disciplinas", requireAuth, disciplinasRoutes);
router.use("/usuarios", requireAuth, usuariosRoutes);
router.use("/conteudos", requireAuth, conteudosRoutes);
router.use("/submissoes", requireAuth, submissoesRoutes);
router.use("/chat", requireAuth, chatRoutes);
router.use("/subtopicos", requireAuth, subtopicosRoutes);

export default router;
