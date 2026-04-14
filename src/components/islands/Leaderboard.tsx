/**
 * Leaderboard island — shows ranked contributors for a counter.
 */
'use client';

import { Trophy, Medal } from 'lucide-react';
import { useLeaderboard } from '@/lib/queries';
import { withQueryProvider } from './QueryProvider';
import { formatNumber, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeaderboardProps {
  counterId: string;
  unit: string;
}

const RANK_COLORS = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

function Leaderboard({ counterId, unit }: LeaderboardProps) {
  const { data: entries, isLoading } = useLeaderboard(counterId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : !entries || entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Medal className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma contribuição ainda.</p>
            <p className="text-xs text-muted-foreground">Seja o primeiro!</p>
          </div>
        ) : (
          <ol className="space-y-2.5">
            {entries.map((entry, index) => (
              <li key={entry.user_id} className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-7 text-center">
                  {index < 3 ? (
                    <span className="text-lg leading-none" role="img" aria-label={`${index + 1}º lugar`}>
                      {RANK_ICONS[index]}
                    </span>
                  ) : (
                    <span className={`text-sm font-bold tabular-nums ${RANK_COLORS[0] ?? 'text-muted-foreground'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <Avatar className="h-8 w-8">
                  <AvatarImage src={entry.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(entry.full_name ?? entry.username)}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.full_name ?? entry.username ?? 'Usuário'}
                  </p>
                </div>

                {/* Total */}
                <div className="text-right">
                  <span className="text-sm font-semibold tabular-nums">
                    {formatNumber(entry.total_amount)}
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export default withQueryProvider(Leaderboard);
