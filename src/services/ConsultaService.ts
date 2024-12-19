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
            .from('posts')
            .select()
            .eq('id', id)
            .single();

        if (error) {
            logger.error(`Error fetching post by id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getByUserId(id: string, token: string): Promise<{ data: Consulta[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .select()
            .eq('userId', id);

        if (error) {
            logger.error(`Error fetching posts by user id: ${id}, error: ${error.message}`);
        }
        return { data, error };
    }

    public async getAll(token: string): Promise<{ data: Consulta[]; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { data, error } = await supabase
            .from('posts')
            .select();

        if (error) {
            logger.error('Error fetching all posts, error: ${error.message}');
        }
        return { data, error };
    }

    public async delete(id: string, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
            logger.error(`Error deleting post by id: ${id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async create(consulta: Consulta, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('posts')
            .insert(consulta);

        if (error) {
            logger.error(`Error creating post, error: ${error.message}`);
        }
        return { success: !error, error };
    }

    public async update(consulta: Consulta, token: string): Promise<{ success: boolean; error: any }> {
        const supabase = this.createAuthenticatedClient(token);
        const { error } = await supabase
            .from('posts')
            .update(consulta)
            .eq('id', consulta.id);

        if (error) {
            logger.error(`Error updating post by id: ${consulta.id}, error: ${error.message}`);
        }
        return { success: !error, error };
    }
}