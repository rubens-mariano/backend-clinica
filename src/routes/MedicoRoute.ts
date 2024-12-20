import { Router } from 'express';
import { MedicoController } from '../controllers/MedicoController';

const medicoRouter = Router();
const medicoController = new MedicoController();

medicoRouter.get('/', medicoController.getAllMedicos);
medicoRouter.get('/:id', medicoController.getMedicoById);
medicoRouter.post('/', medicoController.createMedico);
medicoRouter.patch('/:id', medicoController.updateMedico);
medicoRouter.delete('/:id', medicoController.deleteMedico);

export default medicoRouter;