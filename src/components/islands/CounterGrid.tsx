/**
 * CounterGrid island — grid of CounterCard components with real-time subscription.
 */
'use client';

import { BarChart3 } from 'lucide-react';
import { useCounters } from '@/lib/queries';
import { Skeleton } from '@/components/ui/skeleton';
import CounterCard from './CounterCard';
import { withQueryProvider } from './QueryProvider';

interface CounterGridProps {
  groupId: string;
  userId: string;
}

function CounterGrid({ groupId, userId }: CounterGridProps) {
  const { data: counters, isLoading } = useCounters(groupId);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!counters || counters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <BarChart3 className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <p className="font-medium">Nenhum contador ainda</p>
        <p className="text-sm text-muted-foreground mt-1">
          Crie o primeiro contador do grupo!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {counters.map((counter) => (
        <CounterCard
          key={counter.id}
          counter={counter}
          userId={userId}
          onNavigate={(id) => {
            window.location.href = `/groups/${groupId}/counter/${id}`;
          }}
        />
      ))}
    </div>
  );
}

export default withQueryProvider(CounterGrid);
