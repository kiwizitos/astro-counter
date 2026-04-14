/**
 * CounterCard island — displays a single counter with real-time updates.
 * Uses Supabase Realtime to subscribe to changes.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Target, Calendar, TrendingUp, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/queries';
import { cn, formatNumber, calcProgress, daysRemaining, isExpired } from '@/lib/utils';
import type { Counter } from '@/types/supabase';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import AddAmountModal from './AddAmountModal';
import { withQueryProvider } from './QueryProvider';

interface CounterCardProps {
  counter: Counter;
  userId: string;
  /** Called when user clicks card (navigate to detail) */
  onNavigate?: (counterId: string) => void;
}

function CounterCard({ counter: initialCounter, userId, onNavigate }: CounterCardProps) {
  const [counter, setCounter] = useState<Counter>(initialCounter);
  const [modalOpen, setModalOpen] = useState(false);
  const qc = useQueryClient();

  // ── Realtime subscription ─────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel(`counter:${counter.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'counters',
          filter: `id=eq.${counter.id}`,
        },
        (payload) => {
          const updated = payload.new as Counter;
          setCounter(updated);
          // Invalidate related queries so logs/leaderboard stay fresh
          void qc.invalidateQueries({ queryKey: queryKeys.counter(counter.id) });
          void qc.invalidateQueries({ queryKey: queryKeys.logs(counter.id) });
          void qc.invalidateQueries({ queryKey: queryKeys.leaderboard(counter.id) });

          // Show a subtle toast when someone else updates
          toast.info(`+${formatNumber(updated.current_value - counter.current_value, counter.unit)} adicionado!`, {
            duration: 2000,
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter.id]);

  const progressPct = counter.goal ? calcProgress(counter.current_value, counter.goal) : null;
  const days = daysRemaining(counter.deadline);
  const expired = isExpired(counter.deadline);

  const handleCardClick = useCallback(() => {
    onNavigate?.(counter.id);
  }, [counter.id, onNavigate]);

  return (
    <>
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer select-none',
          progressPct === 100 && 'ring-2 ring-primary'
        )}
        onClick={handleCardClick}
      >
        {/* Completion badge */}
        {progressPct === 100 && (
          <div className="absolute top-2 right-2 z-10 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            🎉 Meta!
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate leading-tight">{counter.name}</h3>
              {counter.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {counter.description}
                </p>
              )}
            </div>

            {/* Add button — stops propagation so card click doesn't fire */}
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              aria-label="Adicionar ao contador"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Current value */}
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold tabular-nums leading-none">
              {formatNumber(counter.current_value)}
            </span>
            <span className="text-sm text-muted-foreground mb-0.5">{counter.unit}</span>
            {counter.goal && (
              <span className="text-sm text-muted-foreground mb-0.5 ml-1">
                / {formatNumber(counter.goal)}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {progressPct !== null && (
            <div className="space-y-1">
              <Progress value={progressPct} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {progressPct}%
                </span>
                {counter.goal && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Faltam {formatNumber(counter.goal - counter.current_value)} {counter.unit}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Deadline */}
          {counter.deadline && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs',
                expired ? 'text-destructive' : days !== null && days <= 7 ? 'text-orange-500' : 'text-muted-foreground'
              )}
            >
              {expired ? (
                <Clock className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              {expired
                ? 'Prazo expirado'
                : days !== null
                ? `${days} dias restantes`
                : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Amount Modal */}
      <AddAmountModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        counter={counter}
        userId={userId}
        onSuccess={(addedAmount) => {
          // Optimistic UI update — Realtime will confirm later
          setCounter((prev) => ({
            ...prev,
            current_value: prev.current_value + addedAmount,
          }));
        }}
      />
    </>
  );
}

export default withQueryProvider(CounterCard);
