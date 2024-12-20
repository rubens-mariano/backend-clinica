import { ConvenioService } from "../services/ConvenioService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";


export class ConvenioController {
    private convenioService: ConvenioService;

    constructor() {
        this.convenioService = new ConvenioService();
        this.getConvenioById = this.getConvenioById.bind(this);
        this.getAllConvenios = this.getAllConvenios.bind(this);
        this.deleteConvenio = this.deleteConvenio.bind(this);
        this.createConvenio = this.createConvenio.bind(this);
        this.updateConvenio = this.updateConvenio.bind(this);
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

    public async getConvenioById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching Convenio by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.convenioService.getById(id, token);
        this.handleResponse(res, !!data, error, data);
    }

    public async getAllConvenios(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all Convenios');
        const token = this.getToken(req);
        const { data, error } = await this.convenioService.getAll(token);
        this.handleResponse(res, !!data, error, data);
    }

    public async deleteConvenio(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting Convenio by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.convenioService.delete(id, token);
        this.handleResponse(res, success, error, 'Convenio deleted successfully');
    }

    public async createConvenio(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new Convenio');
        const token = this.getToken(req);

        const convenio = req.body;
        const { success, error } = await this.convenioService.create(convenio, token);
        this.handleResponse(res, success, error, 'Convenio created successfully');
    }


    public async updateConvenio(req: Request, res: Response): Promise<void> {
        logger.info(`Updating Convenio by id: ${req.params.id}`);
        const convenio = req.body;
        convenio.id = req.params.id;
        const token = this.getToken(req);
        const { success, error } = await this.convenioService.update(convenio, token);
        this.handleResponse(res, success, error, 'Convenio updated successfully');
    }
}