/**
 * GroupList island — shows all groups, and forms for create/join.
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Users, ArrowRight, Loader2, Hash } from 'lucide-react';
import { toast } from 'sonner';

import { useGroups, useCreateGroup, useJoinGroup } from '@/lib/queries';
import { createGroupSchema, joinGroupSchema, type CreateGroupInput, type JoinGroupInput } from '@/lib/schemas';
import { withQueryProvider } from './QueryProvider';
import { parseError } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface GroupListProps {
  userId: string;
}

function GroupList({ userId }: GroupListProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: groups, isLoading } = useGroups(userId);
  const createGroup = useCreateGroup();
  const joinGroup = useJoinGroup();

  const createForm = useForm<CreateGroupInput>({ resolver: zodResolver(createGroupSchema) });
  const joinForm = useForm<JoinGroupInput>({ resolver: zodResolver(joinGroupSchema) });

  async function onCreateSubmit(data: CreateGroupInput) {
    try {
      const group = await createGroup.mutateAsync({ ...data, userId });
      toast.success(`Grupo "${group.name}" criado!`);
      setCreateOpen(false);
      createForm.reset();
    } catch (err) {
      toast.error(parseError(err));
    }
  }

  async function onJoinSubmit(data: JoinGroupInput) {
    try {
      const group = await joinGroup.mutateAsync({ inviteCode: data.inviteCode, userId });
      toast.success(`Entrou no grupo "${group.name}"!`);
      setCreateOpen(false);
      joinForm.reset();
    } catch (err) {
      toast.error(parseError(err));
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Meus Grupos</h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Novo
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar ou entrar em grupo</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="create">
              <TabsList className="w-full">
                <TabsTrigger value="create" className="flex-1">Criar grupo</TabsTrigger>
                <TabsTrigger value="join" className="flex-1">Entrar com código</TabsTrigger>
              </TabsList>

              {/* Create tab */}
              <TabsContent value="create">
                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="group-name">Nome do grupo</Label>
                    <Input
                      id="group-name"
                      placeholder="Ex: Turma da corrida 🏃"
                      {...createForm.register('name')}
                    />
                    {createForm.formState.errors.name && (
                      <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="group-desc">
                      Descrição <span className="text-muted-foreground">(opcional)</span>
                    </Label>
                    <Textarea
                      id="group-desc"
                      placeholder="Do que se trata o grupo…"
                      rows={2}
                      {...createForm.register('description')}
                    />
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={createGroup.isPending} className="w-full gap-2">
                      {createGroup.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Criar grupo
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>

              {/* Join tab */}
              <TabsContent value="join">
                <form onSubmit={joinForm.handleSubmit(onJoinSubmit)} className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="invite-code">Código de convite</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="invite-code"
                        placeholder="ABC123"
                        maxLength={6}
                        className="pl-9 uppercase font-mono text-lg tracking-widest"
                        {...joinForm.register('inviteCode')}
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase();
                          void joinForm.register('inviteCode').onChange(e);
                        }}
                      />
                    </div>
                    {joinForm.formState.errors.inviteCode && (
                      <p className="text-xs text-destructive">{joinForm.formState.errors.inviteCode.message}</p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={joinGroup.isPending} className="w-full gap-2">
                      {joinGroup.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      Entrar no grupo
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groups grid */}
      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : !groups || groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="font-medium">Nenhum grupo ainda</p>
          <p className="text-sm text-muted-foreground mt-1">
            Crie um grupo ou entre com um código de convite.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map((group) => (
            <a
              key={group.id}
              href={`/groups/${group.id}`}
              className="group block rounded-xl border bg-card p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{group.name}</h3>
                  {group.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {group.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Hash className="h-3 w-3" />
                    {group.invite_code}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors mt-0.5" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default withQueryProvider(GroupList);
