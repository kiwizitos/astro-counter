/**
 * LogList island — paginated log history for a counter.
 */
'use client';

import { ClipboardList, User } from 'lucide-react';
import { useLogs } from '@/lib/queries';
import { withQueryProvider } from './QueryProvider';
import { formatNumber, relativeTime, getInitials } from '@/lib/utils';
import type { Counter } from '@/types/supabase';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LogListProps {
  counter: Counter;
}

function LogList({ counter }: LogListProps) {
  const { data: logs, isLoading } = useLogs(counter.id);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="h-4 w-4 text-primary" />
          Histórico
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <User className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Sem registros ainda.</p>
            <p className="text-xs text-muted-foreground">Adicione a primeira contribuição!</p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => {
              const profile = log.profiles;
              const name = profile?.full_name ?? profile?.username ?? 'Usuário';
              return (
                <li key={log.id} className="flex items-start gap-3 animate-fade-in">
                  <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarImage src={profile?.avatar_url ?? undefined} />
                    <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-sm font-medium">{name}</span>
                      <span className="text-xs text-muted-foreground">
                        {relativeTime(log.created_at)}
                      </span>
                    </div>
                    {log.note && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {log.note}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-primary tabular-nums">
                      +{formatNumber(log.amount)}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">{counter.unit}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default withQueryProvider(LogList);
