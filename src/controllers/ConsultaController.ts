import { ConsultaService } from "../services/ConsultaService";
import { Request, Response } from "express-serve-static-core";
import logger from "../utils/logger";
import { AuthService } from "../services/AuthService"
import {ProcedimentoService} from "../services/ProcedimentoService";


export class ConsultaController {
    private consultaService: ConsultaService;
    private supaBaseService: AuthService
    private procedimentoService: ProcedimentoService;

    constructor() {
        this.consultaService = new ConsultaService();
        this.supaBaseService = new AuthService();
        this.procedimentoService = new ProcedimentoService();
        this.getConsultaById = this.getConsultaById.bind(this);
        this.getConsultaByUser = this.getConsultaByUser.bind(this);
        this.getAllConsultas = this.getAllConsultas.bind(this);
        this.deleteConsulta = this.deleteConsulta.bind(this);
        this.createConsulta = this.createConsulta.bind(this);
        this.updateConsulta = this.updateConsulta.bind(this);
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

    public async getConsultaById(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching consulta by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.consultaService.getById(id, token);
        this.handleResponse(res, !!data, error, data);
    }

    public async getConsultaByUser(req: Request, res: Response): Promise<void> {
        logger.info(`Fetching consultas by user id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { data, error } = await this.consultaService.getByUserId(id, token);
        this.handleResponse(res, !!data, error, data);
    }

    public async getAllConsultas(req: Request, res: Response): Promise<void> {
        logger.info('Fetching all consultas');
        const token = this.getToken(req);
        const { data, error } = await this.consultaService.getAll(token);
        this.handleResponse(res, !!data, error, data);
    }

    public async deleteConsulta(req: Request, res: Response): Promise<void> {
        logger.info(`Deleting consulta by id: ${req.params.id}`);
        const { id } = req.params;
        const token = this.getToken(req);
        const { success, error } = await this.consultaService.delete(id, token);
        this.handleResponse(res, success, error, 'Consulta deleted successfully');
    }

    public async createConsulta(req: Request, res: Response): Promise<void> {
        logger.info('Creating a new consulta');
        const token = this.getToken(req);

        // Obtém usuário a partir do token
        const user = await this.supaBaseService.getUser(token);

        // Obtém informações do procedimento
        const procedimento = await this.procedimentoService.getById(req.body.procedimento, token);

        // Sorteia um médico da lista
        if (!procedimento.data.medicos || procedimento.data.medicos.length === 0) {
            return this.handleResponse(res, false, 'Nenhum médico encontrado para o procedimento informado', null);
        }
        const randomIndex = Math.floor(Math.random() * procedimento.data.medicos.length);
        const medicoSelecionado = procedimento.data.medicos[randomIndex];

        // Monta o objeto da consulta
        const consulta = req.body;
        consulta.user = user.data.user.id;
        consulta.medico = medicoSelecionado;

        // Cria a consulta
        const { success, error } = await this.consultaService.create(consulta, token);
        this.handleResponse(res, success, error, 'Consulta created successfully');
    }


    public async updateConsulta(req: Request, res: Response): Promise<void> {
        logger.info(`Updating consulta by id: ${req.params.id}`);
        const consulta = req.body;
        consulta.id = req.params.id;
        const token = this.getToken(req);
        const { success, error } = await this.consultaService.update(consulta, token);
        this.handleResponse(res, success, error, 'Consulta updated successfully');
    }
}