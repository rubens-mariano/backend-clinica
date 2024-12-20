import { ProcedimentoService } from "../services/ProcedimentoService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";


export class ProcedimentoController {
    private procedimentoService: ProcedimentoService;

    constructor() {
        this.procedimentoService = new ProcedimentoService();
        this.getProcedimentoById = this.getProcedimentoById.bind(this);
        this.getAllProcedimentos = this.getAllProcedimentos.bind(this);
        this.deleteProcedimento = this.deleteProcedimento.bind(this);
        this.createProcedimento = this.createProcedimento.bind(this);
        this.updateProcedimento = this.updateProcedimento.bind(this);
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

    public async getProcedimentoById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching Procedimento by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.procedimentoService.getById(id, token);
        this.handleResponse(res, !!data, error, data);
    }

    public async getAllProcedimentos(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all Procedimentos');
        const token = this.getToken(req);
        const { data, error } = await this.procedimentoService.getAll(token);
        this.handleResponse(res, !!data, error, data);
    }

    public async deleteProcedimento(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting Procedimento by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.procedimentoService.delete(id, token);
        this.handleResponse(res, success, error, 'Procedimento deleted successfully');
    }

    public async createProcedimento(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new Procedimento');
        const token = this.getToken(req);

        const procedimento = req.body;
        const { success, error } = await this.procedimentoService.create(procedimento, token);
        this.handleResponse(res, success, error, 'Procedimento created successfully');
    }


    public async updateProcedimento(req: Request, res: Response): Promise<void> {
        logger.info(`Updating Procedimento by id: ${req.params.id}`);
        const procedimento = req.body;
        procedimento.id = req.params.id;
        const token = this.getToken(req);
        const { success, error } = await this.procedimentoService.update(procedimento, token);
        this.handleResponse(res, success, error, 'Procedimento updated successfully');
    }
}