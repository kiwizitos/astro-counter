/**
 * CreateCounterModal island — dialog to create a new counter inside a group.
 */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

import { useCreateCounter } from '@/lib/queries';
import { withQueryProvider } from './QueryProvider';
import { createCounterSchema, type CreateCounterInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface CreateCounterModalProps {
  groupId: string;
  userId: string;
}

function CreateCounterModal({ groupId, userId }: CreateCounterModalProps) {
  const createCounter = useCreateCounter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCounterInput>({
    resolver: zodResolver(createCounterSchema),
    defaultValues: { unit: 'un' },
  });

  async function onSubmit(data: CreateCounterInput) {
    try {
      const goal = data.goal && data.goal !== '' ? Number(data.goal) : undefined;
      const deadline = data.deadline && data.deadline !== '' ? data.deadline : undefined;

      await createCounter.mutateAsync({
        group_id: groupId,
        created_by: userId,
        name: data.name,
        unit: data.unit,
        description: data.description || undefined,
        goal: goal ?? null,
        deadline: deadline ?? null,
      });

      toast.success('Contador criado!');
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar contador.');
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Contador
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Novo contador
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="counter-name">Nome *</Label>
            <Input
              id="counter-name"
              placeholder="Ex: Km rodados juntos"
              {...register('name')}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Unit */}
          <div className="space-y-1.5">
            <Label htmlFor="counter-unit">Unidade *</Label>
            <Input
              id="counter-unit"
              placeholder="Ex: km, cervejas, episódios…"
              {...register('unit')}
            />
            {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="counter-desc">
              Descrição <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="counter-desc"
              placeholder="Detalhes sobre o contador…"
              rows={2}
              {...register('description')}
            />
          </div>

          {/* Goal + Deadline side by side on larger screens */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="counter-goal">
                Meta <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="counter-goal"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Ex: 500"
                {...register('goal')}
              />
              {errors.goal && <p className="text-xs text-destructive">{errors.goal.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="counter-deadline">
                Prazo <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <Input
                id="counter-deadline"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('deadline')}
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={createCounter.isPending} className="w-full gap-2">
              {createCounter.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Criar contador
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default withQueryProvider(CreateCounterModal);
