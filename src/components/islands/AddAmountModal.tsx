/**
 * AddAmountModal island — dialog to add an amount to a counter.
 * Validates input with Zod + React Hook Form.
 */
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useAddLog } from '@/lib/queries';
import { addAmountSchema, type AddAmountInput } from '@/lib/schemas';
import { formatNumber } from '@/lib/utils';
import type { Counter } from '@/types/supabase';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddAmountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  counter: Counter;
  userId: string;
  onSuccess?: (amount: number) => void;
}

export default function AddAmountModal({
  open,
  onOpenChange,
  counter,
  userId,
  onSuccess,
}: AddAmountModalProps) {
  const addLog = useAddLog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddAmountInput>({
    resolver: zodResolver(addAmountSchema),
    defaultValues: { amount: undefined, note: '' },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => reset(), 200);
    }
  }, [open, reset]);

  async function onSubmit(data: AddAmountInput) {
    try {
      await addLog.mutateAsync({
        counter_id: counter.id,
        user_id: userId,
        amount: data.amount,
        note: data.note || undefined,
      });

      toast.success(`+${formatNumber(data.amount, counter.unit)} adicionado!`);
      onSuccess?.(data.amount);
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao adicionar.';
      toast.error(message);
    }
  }

  // Preset quick-add values
  const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Adicionar ao contador
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{counter.name}</span>
            {' · '}Atual: {formatNumber(counter.current_value, counter.unit)}
            {counter.goal ? ` / ${formatNumber(counter.goal, counter.unit)}` : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Quick presets */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Valores rápidos</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('amount') as HTMLInputElement;
                    if (input) input.value = String(val);
                    // Trigger React Hook Form update
                    void handleSubmit(() => {})();
                  }}
                  className="rounded-md border bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">
              Quantidade <span className="text-muted-foreground">({counter.unit})</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Ex: 10"
              className="text-lg font-semibold"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <Label htmlFor="note">
              Nota <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="note"
              placeholder="Ex: Corrida matinal na praia…"
              rows={2}
              {...register('note')}
            />
            {errors.note && (
              <p className="text-xs text-destructive">{errors.note.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addLog.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={addLog.isPending} className="gap-2">
              {addLog.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
