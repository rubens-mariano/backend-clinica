import { OrcamentoService } from "../services/OrcamentoService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";


export class OrcamentoController {
    private orcamentoService: OrcamentoService;

    constructor() {
        this.orcamentoService = new OrcamentoService();
        this.getOrcamentoById = this.getOrcamentoById.bind(this);
        this.getAllOrcamentos = this.getAllOrcamentos.bind(this);
        this.deleteOrcamento = this.deleteOrcamento.bind(this);
        this.createOrcamento = this.createOrcamento.bind(this);
        this.updateOrcamento = this.updateOrcamento.bind(this);
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

    public async getOrcamentoById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching Orcamento by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.orcamentoService.getById(id, token);
        this.handleResponse(res, !!data, error, data);
    }

    public async getAllOrcamentos(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all Orcamentos');
        const token = this.getToken(req);
        const { data, error } = await this.orcamentoService.getAll(token);
        this.handleResponse(res, !!data, error, data);
    }

    public async deleteOrcamento(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting Orcamento by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.orcamentoService.delete(id, token);
        this.handleResponse(res, success, error, 'Orcamento deleted successfully');
    }

    public async createOrcamento(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new Orcamento');
        const token = this.getToken(req);

        const post = req.body;
        const { success, error } = await this.orcamentoService.create(post, token);
        this.handleResponse(res, success, error, 'Orcamento created successfully');
    }


    public async updateOrcamento(req: Request, res: Response): Promise<void> {
        logger.info(`Updating Orcamento by id: ${req.params.id}`);
        const post = req.body;
        post.id = req.params.id;
        const token = this.getToken(req);
        const { success, error } = await this.orcamentoService.update(post, token);
        this.handleResponse(res, success, error, 'Orcamento updated successfully');
    }
}