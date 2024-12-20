import {UUID} from "node:crypto";

export interface Convenio {
    id: UUID;
    name: string;
    create_at: string;
}