import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Consulta } from "../interfaces/ConsultaInterface";
import logger from "../utils/logger";

export class ConsultaService {

    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async getById(id: string, token: string): Promise<{ data: Consulta; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('consultas')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching consulta by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getByUserId(id: string, token: string): Promise<{ data: any[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);

        // Consulta com joins para retornar dados relacionados
        const { data, error } = await supabase
            .from('consultas')
            .select(`*, user:users(*), medico:medicos(*), procedimento:procedimentos(*)`)
            .eq('user', id);

        // Tratamento de erro
        if (error) {
            logger.error(`Error fetching consulta by user id: ${id}, error: ${error.message}`);
        }

        console.log(data);
        return { data, error };
    }

    public async getAll(token: string): Promise<{ data: Consulta[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('consultas')
            .select();

        if (error) {
            logger.error('Error fetching all consulta, error: ${error.message}');
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.from('consultas').delete().eq('id', id);
        if (error) {
            logger.error(`Error deleting consulta by id: ${id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async create(consulta: Consulta, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('consultas')
            .insert(consulta);

        if (error) {
            logger.error(`Error creating consulta, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async update(consulta: Consulta, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('consultas')
            .update(consulta)
            .eq('id', consulta.id);

        if (error) {
            logger.error(`Error updating consulta by id: ${consulta.id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

}