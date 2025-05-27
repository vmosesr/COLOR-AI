import { createClient } from '@supabase/supabase-js';
import type { User, Project } from '../../types/auth';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_ANON_KEY!
);

export class SupabaseService {
  static async createUser(user: User): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: user.provider,
          createdAt: user.createdAt,
        });
      if (error) throw error;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', userId)
        .single();
      if (error) throw error;
      return data as User;
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  static async saveProject(userId: string, project: Project): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          userId,
          createdAt: new Date().toISOString(),
        })
        .select('id')
        .single();
      if (error) throw error;
      return data.id;
    } catch (error) {
      throw new Error(`Failed to save project: ${error}`);
    }
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      if (error) throw error;
      return data as Project[];
    } catch (error) {
      throw new Error(`Failed to get projects: ${error}`);
    }
  }
}