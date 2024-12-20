import {UUID} from "node:crypto";

export interface Orcamento {
    id: UUID;
    nomeSolicitante: string;
    nomePaciente: string;
    email: string;
    telefone: string;
    convenio: UUID;
    observacoes: string;
    create_at: string;
}