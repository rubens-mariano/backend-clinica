import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Procedimento } from "../interfaces/ProcedimentoInterface";
import logger from "../utils/logger";

export class ProcedimentoService {

    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async getById(id: string, token: string): Promise<{ data: Procedimento; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('procedimentos')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching procedimento by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getAll(token: string): Promise<{ data: Procedimento[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('procedimentos')
            .select();

        if (error) {
            logger.error('Error fetching all procedimentos, error: ${error.message}');
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.from('procedimentos').delete().eq('id', id);
        if (error) {
            logger.error(`Error deleting procedimentos by id: ${id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async create(procedimentos: Procedimento, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('procedimentos')
            .insert(procedimentos);

        if (error) {
            logger.error(`Error creating procedimentos, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async update(procedimentos: Procedimento, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('procedimentos')
            .update(procedimentos)
            .eq('id', procedimentos.id);

        if (error) {
            logger.error(`Error updating procedimentos by id: ${procedimentos.id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }
}