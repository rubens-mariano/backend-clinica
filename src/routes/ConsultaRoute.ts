import { Router } from 'express';
import { ConsultaController } from '../controllers/ConsultaController';

const consultaRouter = Router();
const consultaController = new ConsultaController();

consultaRouter.get('/', consultaController.getAllConsultas);
consultaRouter.get('/:id', consultaController.getConsultaById);
consultaRouter.get('/user/:id', consultaController.getConsultaById);
consultaRouter.post('/agendar', consultaController.createConsulta);
consultaRouter.patch('/:id', consultaController.updateConsulta);
consultaRouter.delete('/:id', consultaController.deleteConsulta);

export default consultaRouter;