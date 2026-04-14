/**
 * GroupHeader island — displays group info, invite code, and member count.
 */
'use client';

import { useState } from 'react';
import { Users, Copy, Check, Settings } from 'lucide-react';
import { toast } from 'sonner';

import { useGroupMembers } from '@/lib/queries';
import { withQueryProvider } from './QueryProvider';
import type { Group } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface GroupHeaderProps {
  group: Group;
  userId: string;
}

function GroupHeader({ group, userId }: GroupHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { data: members } = useGroupMembers(group.id);

  async function copyInviteCode() {
    await navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  }

  const isOwner = group.owner_id === userId;

  return (
    <div className="space-y-3">
      {/* Group title */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold truncate">{group.name}</h1>
          {group.description && (
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {group.description}
            </p>
          )}
        </div>
        {isOwner && (
          <Button size="icon" variant="ghost" aria-label="Configurações do grupo">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Members + invite code */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Member avatars */}
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-2">
            {(members ?? []).slice(0, 5).map((m) => (
              <Avatar key={m.id} className="h-7 w-7 border-2 border-background">
                <AvatarImage src={m.profiles?.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(m.profiles?.full_name ?? m.profiles?.username)}
                </AvatarFallback>
              </Avatar>
            ))}
            {(members?.length ?? 0) > 5 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                +{(members?.length ?? 0) - 5}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {members?.length ?? 0} membros
          </span>
        </div>

        {/* Invite code */}
        <button
          onClick={copyInviteCode}
          className="flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1 text-xs font-mono font-medium hover:bg-accent transition-colors"
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {group.invite_code}
        </button>
      </div>
    </div>
  );
}

export default withQueryProvider(GroupHeader);
