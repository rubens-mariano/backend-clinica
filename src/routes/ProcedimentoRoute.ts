import { Router } from 'express';
import { ProcedimentoController } from '../controllers/ProcedimentoController';

const procedimentoRouter = Router();
const procedimentoController = new ProcedimentoController();

procedimentoRouter.get('/', procedimentoController.getAllProcedimentos);
procedimentoRouter.get('/:id', procedimentoController.getProcedimentoById);
procedimentoRouter.post('/', procedimentoController.createProcedimento);
procedimentoRouter.patch('/:id', procedimentoController.updateProcedimento);
procedimentoRouter.delete('/:id', procedimentoController.deleteProcedimento);

export default procedimentoRouter;