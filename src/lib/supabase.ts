import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for development if environment variables are missing
const createMockClient = () => {
  console.warn('Supabase environment variables are missing. Using mock client for development.');
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: null }),
      updateUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ error: null }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  };
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient();

// Types for our database tables
export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
};

export type Contract = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  status: 'draft' | 'pending' | 'completed' | 'archived';
  user_id: string;
  organization_id?: string;
  metadata?: {
    type: string;
    parties: {
      party1: {
        name: string;
        address?: string;
      };
      party2: {
        name: string;
        address?: string;
      };
    };
    terms?: string;
    risk_level?: string;
  };
};

export type Organization = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
};

// Database schema types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      contracts: {
        Row: Contract;
        Insert: Omit<Contract, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Contract, 'id' | 'created_at' | 'updated_at'>>;
      };
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Organization, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}; 