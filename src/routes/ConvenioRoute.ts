import { Router } from 'express';
import { ConvenioController } from '../controllers/ConvenioController';

const convenioRouter = Router();
const convenioController = new ConvenioController();

convenioRouter.get('/', convenioController.getAllConvenios);
convenioRouter.get('/:id', convenioController.getConvenioById);
convenioRouter.post('/', convenioController.createConvenio);
convenioRouter.patch('/:id', convenioController.updateConvenio);
convenioRouter.delete('/:id', convenioController.deleteConvenio);

export default convenioRouter;