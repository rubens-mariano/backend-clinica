import { MedicoService } from "../services/MedicoService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";


export class MedicoController {
    private medicoService: MedicoService;

    constructor() {
        this.medicoService = new MedicoService();
        this.getMedicoById = this.getMedicoById.bind(this);
        this.getAllMedicos = this.getAllMedicos.bind(this);
        this.deleteMedico = this.deleteMedico.bind(this);
        this.createMedico = this.createMedico.bind(this);
        this.updateMedico = this.updateMedico.bind(this);
    }

    private handleResponse(res: Response, success: boolean, error: any, successMessage: any): void {
        if (error) {
            logger.error(`Error: ${error.message}`);
            res.status(400).json({ error: error.message });
        } else if (!success) {
            logger.warn(`${successMessage} not found`);
            res.status(404).json({ error: `${successMessage} not found` });
        } else {
            logger.info(successMessage);
            res.status(200).json({ message: successMessage });
        }
    }

    private getToken(req: Request): string {
        const authorization = req.headers.authorization;
        if (!authorization) {
            logger.error("Authorization header is missing");
            throw new Error("Authorization header is missing");
        }
        return authorization.split(' ')[1];
    }

    public async getMedicoById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching Medico by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.medicoService.getById(id, token);
        this.handleResponse(res, !!data, error, data);
    }

    public async getAllMedicos(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all Medicos');
        const token = this.getToken(req);
        const { data, error } = await this.medicoService.getAll(token);
        this.handleResponse(res, !!data, error, data);
    }

    public async deleteMedico(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting Medico by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.medicoService.delete(id, token);
        this.handleResponse(res, success, error, 'Medico deleted successfully');
    }

    public async createMedico(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new Medico');
        const token = this.getToken(req);

        const medico = req.body;
        const { success, error } = await this.medicoService.create(medico, token);
        this.handleResponse(res, success, error, 'Medico created successfully');
    }


    public async updateMedico(req: Request, res: Response): Promise<void> {
        logger.info(`Updating Medico by id: ${req.params.id}`);
        const medico = req.body;
        medico.id = req.params.id;
        const token = this.getToken(req);
        const { success, error } = await this.medicoService.update(medico, token);
        this.handleResponse(res, success, error, 'Medico updated successfully');
    }
}