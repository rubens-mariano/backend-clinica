import {UUID} from "node:crypto";

export interface Procedimento {
    id: UUID;
    name: string;
    medicos: UUID[];
    create_at: string;
}