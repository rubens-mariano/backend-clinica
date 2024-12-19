import { Router } from 'express';
import { OrcamentoController } from '../controllers/OrcamentoController';

const orcamentoRouter = Router();
const orcamentoController = new OrcamentoController();

orcamentoRouter.get('/', orcamentoController.getAllOrcamentos);
orcamentoRouter.get('/:id', orcamentoController.getOrcamentoById);
orcamentoRouter.post('/solicitar', orcamentoController.createOrcamento);
orcamentoRouter.patch('/:id', orcamentoController.updateOrcamento);
orcamentoRouter.delete('/:id', orcamentoController.deleteOrcamento);

export default orcamentoRouter;