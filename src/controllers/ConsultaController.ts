import { ConsultaService } from "../services/ConsultaService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";


export class ConsultaController {
    private consultaService: ConsultaService;

    constructor() {
        this.consultaService = new ConsultaService();
        this.getConsultaById = this.getConsultaById.bind(this);
        this.getConsultaByUser = this.getConsultaByUser.bind(this);
        this.getAllConsultas = this.getAllConsultas.bind(this);
        this.deleteConsulta = this.deleteConsulta.bind(this);
        this.createConsulta = this.createConsulta.bind(this);
        this.updateConsulta = this.updateConsulta.bind(this);
    }

    private handleResponse(res: Response, success: boolean, error: any, successMessage: string): void {
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

    public async getConsultaById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching post by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.consultaService.getById(id, token);
        this.handleResponse(res, !!data, error, 'Post');
    }

    public async getConsultaByUser(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching posts by user id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.consultaService.getByUserId(id, token);
        this.handleResponse(res, !!data, error, 'Posts by User');
    }

    public async getAllConsultas(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all posts');
        const token = this.getToken(req);
        const { data, error } = await this.consultaService.getAll(token);
        this.handleResponse(res, !!data, error, 'Posts');
    }

    public async deleteConsulta(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting post by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.consultaService.delete(id, token);
        this.handleResponse(res, success, error, 'Post deleted successfully');
    }

    public async createConsulta(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new post');
        const token = this.getToken(req);

        const post = req.body;
        const { success, error } = await this.consultaService.create(post, token);
        this.handleResponse(res, success, error, 'Post created successfully');
    }


    public async updateConsulta(req: Request, res: Response): Promise<void> {
        logger.info(`Updating post by id: ${req.params.id}`);
        const post = req.body;
        post.id = req.params.id;
        const token = this.getToken(req);
        const { success, error } = await this.consultaService.update(post, token);
        this.handleResponse(res, success, error, 'Post updated successfully');
    }
}