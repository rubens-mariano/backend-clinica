import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Convenio } from "../interfaces/ConvenioInterface";
import logger from "../utils/logger";

export class ConvenioService {

    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async getById(id: string, token: string): Promise<{ data: Convenio; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('convenios')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching convenio by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getAll(token: string): Promise<{ data: Convenio[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('convenios')
            .select();

        if (error) {
            logger.error('Error fetching all convenios, error: ${error.message}');
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.from('convenios').delete().eq('id', id);
        if (error) {
            logger.error(`Error deleting convenio by id: ${id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async create(convenio: Convenio, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('convenios')
            .insert(convenio);

        if (error) {
            logger.error(`Error creating convenio, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async update(convenio: Convenio, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('convenios')
            .update(convenio)
            .eq('id', convenio.id);

        if (error) {
            logger.error(`Error updating convenio by id: ${convenio.id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }
}