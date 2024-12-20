import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import authRoute from './AuthRoute';
import userRouter from './UserRoute';
import orcamentoRouter from './OrcamentoRoute';
import consultaRouter from './ConsultaRoute';
import procedimentoRouter from "./ProcedimentoRoute";
import medicoRoute from "./MedicoRoute";
import {join} from "node:path";

const router = Router();
const authController = new AuthController();

router.use('/auth', authRoute);
router.use('/orcamentos', orcamentoRouter);
router.use('/consultas', consultaRouter);
router.use('/procedimentos', procedimentoRouter);
router.use('/medicos', medicoRoute);

// Verifica se o usuário está autenticado
router.use(authController.checkAuthMiddleware);
router.use('/user', userRouter);

export default router;