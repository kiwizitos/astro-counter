/**
 * TanStack Query hooks for all Supabase data fetching.
 * Import these inside React island components only.
 */
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { supabase } from './supabase';
import { parseError } from './utils';
import type {
  Counter,
  CounterLog,
  CounterLogWithProfile,
  Group,
  GroupMemberWithProfile,
  LeaderboardEntry,
  Profile,
  TablesInsert,
} from '@/types/supabase';

// ─── Query Keys ───────────────────────────────────────────────
export const queryKeys = {
  profile: (userId: string) => ['profile', userId] as const,
  groups: (userId: string) => ['groups', userId] as const,
  group: (groupId: string) => ['group', groupId] as const,
  groupMembers: (groupId: string) => ['groupMembers', groupId] as const,
  counters: (groupId: string) => ['counters', groupId] as const,
  counter: (counterId: string) => ['counter', counterId] as const,
  logs: (counterId: string) => ['logs', counterId] as const,
  leaderboard: (counterId: string) => ['leaderboard', counterId] as const,
};

// ─── Profile ──────────────────────────────────────────────────
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? queryKeys.profile(userId) : ['profile', 'none'],
    enabled: !!userId,
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

// ─── Groups ───────────────────────────────────────────────────
export function useGroups(userId: string | undefined) {
  return useQuery({
    queryKey: userId ? queryKeys.groups(userId) : ['groups', 'none'],
    enabled: !!userId,
    queryFn: async (): Promise<Group[]> => {
      const { data, error } = await supabase
        .from('group_members')
        .select('groups(*)')
        .eq('user_id', userId!);
      if (error) throw error;
      return (data ?? []).map((m) => m.groups as unknown as Group);
    },
  });
}

export function useGroup(groupId: string | undefined) {
  return useQuery({
    queryKey: groupId ? queryKeys.group(groupId) : ['group', 'none'],
    enabled: !!groupId,
    queryFn: async (): Promise<Group> => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useGroupMembers(groupId: string | undefined) {
  return useQuery({
    queryKey: groupId ? queryKeys.groupMembers(groupId) : ['groupMembers', 'none'],
    enabled: !!groupId,
    queryFn: async (): Promise<GroupMemberWithProfile[]> => {
      const { data, error } = await supabase
        .from('group_members')
        .select('*, profiles(*)')
        .eq('group_id', groupId!);
      if (error) throw error;
      return (data ?? []) as GroupMemberWithProfile[];
    },
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      description?: string;
      userId: string;
    }) => {
      // Ensure the profile row exists (FK guard — the trigger may have missed it)
      const { data: sessionData } = await supabase.auth.getUser();
      const authUser = sessionData?.user;
      if (!authUser) throw new Error('Você precisa estar autenticado para criar um grupo.');

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: input.userId,
            full_name: (authUser.user_metadata?.full_name as string | undefined) ?? null,
            avatar_url: (authUser.user_metadata?.avatar_url as string | undefined) ?? null,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      if (profileError) throw new Error(`Erro ao sincronizar perfil: ${parseError(profileError)}`);

      // Let the DB generate the invite_code via its DEFAULT expression
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({ name: input.name, description: input.description, owner_id: input.userId })
        .select()
        .single();
      if (groupError) throw new Error(`Erro ao criar grupo: ${parseError(groupError)}`);

      // Add owner as member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: input.userId, role: 'owner' });
      if (memberError) throw new Error(`Erro ao adicionar membro: ${parseError(memberError)}`);

      return group as Group;
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: queryKeys.groups(variables.userId) });
    },
  });
}

export function useJoinGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { inviteCode: string; userId: string }) => {
      const { data: group, error: findError } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', input.inviteCode.toUpperCase())
        .single();
      if (findError) throw new Error('Código de convite inválido.');

      // Check if already a member
      const { data: existing } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', input.userId)
        .maybeSingle();
      if (existing) throw new Error('Você já é membro deste grupo.');

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: input.userId, role: 'member' });
      if (joinError) throw joinError;
      return group as Group;
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: queryKeys.groups(variables.userId) });
    },
  });
}

// ─── Counters ─────────────────────────────────────────────────
export function useCounters(groupId: string | undefined) {
  return useQuery({
    queryKey: groupId ? queryKeys.counters(groupId) : ['counters', 'none'],
    enabled: !!groupId,
    queryFn: async (): Promise<Counter[]> => {
      const { data, error } = await supabase
        .from('counters')
        .select('*')
        .eq('group_id', groupId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCounter(counterId: string | undefined) {
  return useQuery({
    queryKey: counterId ? queryKeys.counter(counterId) : ['counter', 'none'],
    enabled: !!counterId,
    queryFn: async (): Promise<Counter> => {
      const { data, error } = await supabase
        .from('counters')
        .select('*')
        .eq('id', counterId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateCounter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TablesInsert<'counters'>) => {
      const { data, error } = await supabase
        .from('counters')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as Counter;
    },
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.counters(data.group_id) });
    },
  });
}

// ─── Counter Logs ─────────────────────────────────────────────
export function useLogs(counterId: string | undefined) {
  return useQuery({
    queryKey: counterId ? queryKeys.logs(counterId) : ['logs', 'none'],
    enabled: !!counterId,
    queryFn: async (): Promise<CounterLogWithProfile[]> => {
      const { data, error } = await supabase
        .from('counter_logs')
        .select('*, profiles(id, full_name, username, avatar_url)')
        .eq('counter_id', counterId!)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as CounterLogWithProfile[];
    },
  });
}

export function useAddLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      counter_id: string;
      user_id: string;
      amount: number;
      note?: string;
    }) => {
      const { data, error } = await supabase
        .from('counter_logs')
        .insert({
          counter_id: input.counter_id,
          user_id: input.user_id,
          amount: input.amount,
          note: input.note ?? null,
        })
        .select()
        .single();
      if (error) throw error;
      return data as CounterLog;
    },
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.logs(data.counter_id) });
      void qc.invalidateQueries({ queryKey: queryKeys.counter(data.counter_id) });
      void qc.invalidateQueries({ queryKey: queryKeys.leaderboard(data.counter_id) });
    },
  });
}

// ─── Leaderboard ──────────────────────────────────────────────
export function useLeaderboard(counterId: string | undefined) {
  return useQuery({
    queryKey: counterId ? queryKeys.leaderboard(counterId) : ['leaderboard', 'none'],
    enabled: !!counterId,
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const { data, error } = await supabase
        .from('counter_logs')
        .select('user_id, amount, profiles(full_name, username, avatar_url)')
        .eq('counter_id', counterId!);
      if (error) throw error;

      // Aggregate by user_id
      const map = new Map<string, LeaderboardEntry>();
      for (const row of data ?? []) {
        const uid = row.user_id;
        const profile = row.profiles as unknown as {
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
        } | null;
        const existing = map.get(uid);
        if (existing) {
          existing.total_amount += row.amount;
        } else {
          map.set(uid, {
            user_id: uid,
            counter_id: counterId!,
            total_amount: row.amount,
            full_name: profile?.full_name ?? null,
            username: profile?.username ?? null,
            avatar_url: profile?.avatar_url ?? null,
          });
        }
      }
      return Array.from(map.values()).sort((a, b) => b.total_amount - a.total_amount);
    },
  });
}
