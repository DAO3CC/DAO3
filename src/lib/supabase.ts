import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Using mock data mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库表类型
export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          url: string;
          category: string;
          tags?: string[];
          hot?: boolean;
          featured?: boolean;
          chain?: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tools']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tools']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon?: string;
          description?: string;
          order: number;
          visible?: boolean;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      airdrops: {
        Row: {
          id: string;
          title: string;
          description: string;
          image_url: string;
          link: string;
          status: 'active' | 'ended' | 'upcoming';
          deadline?: string;
          chain?: string;
          reward_type?: 'token' | 'nft' | 'whitelist' | 'points' | 'other';
          reward?: string;
          participants?: string;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['airdrops']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['airdrops']['Insert']>;
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image?: string;
          category: string;
          tags?: string[];
          author?: string;
          published_at: string;
          updated_at: string;
          order: number;
          featured?: boolean;
        };
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'published_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
      article_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon?: string;
          order: number;
        };
        Insert: Omit<Database['public']['Tables']['article_categories']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['article_categories']['Insert']>;
      };
    };
  };
}
