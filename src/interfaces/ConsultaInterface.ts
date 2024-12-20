import {UUID} from "node:crypto";

export interface Consulta {
    id: UUID;
    user: UUID;
    medico: string;
    procedimento: UUID;
    data: string;
    hora: string;
    create_at: string;
}