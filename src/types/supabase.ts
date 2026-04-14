// ============================================================
// Supabase Database Types (auto-generated shape)
// Run `supabase gen types typescript --project-id <ref>` to regenerate
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  // Required by @supabase/supabase-js >= 2.47 for typed queries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  public: {
    PostgrestVersion: '12';
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          invite_code: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          invite_code?: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          invite_code?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: 'owner' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: 'owner' | 'member';
          joined_at?: string;
        };
        Update: {
          role?: 'owner' | 'member';
        };
        Relationships: [];
      };
      counters: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          unit: string;
          description: string | null;
          goal: number | null;
          deadline: string | null;
          current_value: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          unit?: string;
          description?: string | null;
          goal?: number | null;
          deadline?: string | null;
          current_value?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          unit?: string;
          description?: string | null;
          goal?: number | null;
          deadline?: string | null;
          current_value?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      counter_logs: {
        Row: {
          id: string;
          counter_id: string;
          user_id: string;
          amount: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          counter_id: string;
          user_id: string;
          amount: number;
          note?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      member_role: 'owner' | 'member';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ─── Convenience aliases ──────────────────────────────────────
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// ─── Domain types ─────────────────────────────────────────────
export type Profile = Tables<'profiles'>;
export type Group = Tables<'groups'>;
export type GroupMember = Tables<'group_members'>;
export type Counter = Tables<'counters'>;
export type CounterLog = Tables<'counter_logs'>;

export type GroupMemberWithProfile = GroupMember & {
  profiles: Profile;
};

export type CounterWithGroup = Counter & {
  groups: Pick<Group, 'id' | 'name'>;
};

export type CounterLogWithProfile = CounterLog & {
  profiles: Pick<Profile, 'id' | 'full_name' | 'username' | 'avatar_url'>;
};

export type LeaderboardEntry = {
  user_id: string;
  counter_id: string;
  total_amount: number;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
};
