import {UUID} from "node:crypto";

export interface Medico {
    id: UUID;
    name: string;
    crm: string;
    create_at: string;
}