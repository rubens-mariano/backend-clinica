import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Orcamento } from "../interfaces/OrcamentoInterface";
import logger from "../utils/logger";

export class OrcamentoService {

    private createAuthenticatedClient(token: string): SupabaseClient {
        return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }

    public async getById(id: string, token: string): Promise<{ data: Orcamento; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('orcamentos')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching orcamento by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getAll(token: string): Promise<{ data: Orcamento[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('orcamentos')
            .select('*, convenio:convenios(*)');

        if (error) {
            logger.error('Error fetching all orcamentos, error: ${error.message}');
        }
        console.log(data);
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.from('orcamentos').delete().eq('id', id);
        if (error) {
            logger.error(`Error deleting orcamento by id: ${id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async create(orcamento: Orcamento, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('orcamentos')
            .insert(orcamento);

        if (error) {
            logger.error(`Error creating orcamento, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async update(orcamento: Orcamento, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('orcamentos')
            .update(orcamento)
            .eq('id', orcamento.id);

        if (error) {
            logger.error(`Error updating orcamento by id: ${orcamento.id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }
}