import {UUID} from "node:crypto";

export interface Medico {
    id: UUID;
    name: string;
    crm: string;
    user: UUID;
    create_at: string;
}