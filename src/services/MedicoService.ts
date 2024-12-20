import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Medico } from "../interfaces/MedicoInterface";
import logger from "../utils/logger";

export class MedicoService {

    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async getById(id: string, token: string): Promise<{ data: Medico; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('medicos')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching medico by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getAll(token: string): Promise<{ data: Medico[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('medicos')
            .select();

        if (error) {
            logger.error('Error fetching all medicos, error: ${error.message}');
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.from('medicos').delete().eq('id', id);
        if (error) {
            logger.error(`Error deleting medicos by id: ${id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async create(medicos: Medico, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('medicos')
            .insert(medicos);

        if (error) {
            logger.error(`Error creating medicos, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async update(medicos: Medico, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('medicos')
            .update(medicos)
            .eq('id', medicos.id);

        if (error) {
            logger.error(`Error updating medicos by id: ${medicos.id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }
}