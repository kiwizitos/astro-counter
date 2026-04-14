import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Loader2, Plus, TrendingUp, Target, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { c as cn, i as addAmountSchema, f as formatNumber, L as Label, I as Input, B as Button, s as supabase, k as calcProgress, l as daysRemaining, m as isExpired, C as Card, b as CardHeader, e as CardContent } from './card_ClVp_5rl.mjs';
import { o as useAddLog, D as Dialog, d as DialogContent, e as DialogHeader, f as DialogTitle, p as DialogDescription, T as Textarea, g as DialogFooter, w as withQueryProvider, q as queryKeys } from './skeleton_Dd5LUUDQ.mjs';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all duration-500 ease-out",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;

function AddAmountModal({
  open,
  onOpenChange,
  counter,
  userId,
  onSuccess
}) {
  const addLog = useAddLog();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(addAmountSchema),
    defaultValues: { amount: void 0, note: "" }
  });
  useEffect(() => {
    if (!open) {
      setTimeout(() => reset(), 200);
    }
  }, [open, reset]);
  async function onSubmit(data) {
    try {
      await addLog.mutateAsync({
        counter_id: counter.id,
        user_id: userId,
        amount: data.amount,
        note: data.note || void 0
      });
      toast.success(`+${formatNumber(data.amount, counter.unit)} adicionado!`);
      onSuccess?.(data.amount);
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao adicionar.";
      toast.error(message);
    }
  }
  const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100];
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(PlusCircle, { className: "h-5 w-5 text-primary" }),
        "Adicionar ao contador"
      ] }),
      /* @__PURE__ */ jsxs(DialogDescription, { children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: counter.name }),
        " · ",
        "Atual: ",
        formatNumber(counter.current_value, counter.unit),
        counter.goal ? ` / ${formatNumber(counter.goal, counter.unit)}` : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Valores rápidos" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: QUICK_AMOUNTS.map((val) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              const input = document.getElementById("amount");
              if (input) input.value = String(val);
              void handleSubmit(() => {
              })();
            },
            className: "rounded-md border bg-secondary px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors",
            children: [
              "+",
              val
            ]
          },
          val
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "amount", children: [
          "Quantidade ",
          /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
            "(",
            counter.unit,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "amount",
            type: "number",
            step: "0.01",
            min: "0.01",
            placeholder: "Ex: 10",
            className: "text-lg font-semibold",
            ...register("amount", { valueAsNumber: true })
          }
        ),
        errors.amount && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.amount.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxs(Label, { htmlFor: "note", children: [
          "Nota ",
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "(opcional)" })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            id: "note",
            placeholder: "Ex: Corrida matinal na praia…",
            rows: 2,
            ...register("note")
          }
        ),
        errors.note && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.note.message })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            disabled: addLog.isPending,
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: addLog.isPending, className: "gap-2", children: [
          addLog.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(PlusCircle, { className: "h-4 w-4" }),
          "Adicionar"
        ] })
      ] })
    ] })
  ] }) });
}

function CounterCard({ counter: initialCounter, userId, onNavigate }) {
  const [counter, setCounter] = useState(initialCounter);
  const [modalOpen, setModalOpen] = useState(false);
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase.channel(`counter:${counter.id}`).on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "counters",
        filter: `id=eq.${counter.id}`
      },
      (payload) => {
        const updated = payload.new;
        setCounter(updated);
        void qc.invalidateQueries({ queryKey: queryKeys.counter(counter.id) });
        void qc.invalidateQueries({ queryKey: queryKeys.logs(counter.id) });
        void qc.invalidateQueries({ queryKey: queryKeys.leaderboard(counter.id) });
        toast.info(`+${formatNumber(updated.current_value - counter.current_value, counter.unit)} adicionado!`, {
          duration: 2e3
        });
      }
    ).subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [counter.id]);
  const progressPct = counter.goal ? calcProgress(counter.current_value, counter.goal) : null;
  const days = daysRemaining(counter.deadline);
  const expired = isExpired(counter.deadline);
  const handleCardClick = useCallback(() => {
    onNavigate?.(counter.id);
  }, [counter.id, onNavigate]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Card,
      {
        className: cn(
          "relative overflow-hidden transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer select-none",
          progressPct === 100 && "ring-2 ring-primary"
        ),
        onClick: handleCardClick,
        children: [
          progressPct === 100 && /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 z-10 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground", children: "🎉 Meta!" }),
          /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-base truncate leading-tight", children: counter.name }),
              counter.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: counter.description })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "icon",
                className: "h-9 w-9 shrink-0 rounded-full shadow-sm",
                onClick: (e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                },
                "aria-label": "Adicionar ao contador",
                children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold tabular-nums leading-none", children: formatNumber(counter.current_value) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground mb-0.5", children: counter.unit }),
              counter.goal && /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground mb-0.5 ml-1", children: [
                "/ ",
                formatNumber(counter.goal)
              ] })
            ] }),
            progressPct !== null && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Progress, { value: progressPct, className: "h-2" }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(TrendingUp, { className: "h-3 w-3" }),
                  progressPct,
                  "%"
                ] }),
                counter.goal && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Target, { className: "h-3 w-3" }),
                  "Faltam ",
                  formatNumber(counter.goal - counter.current_value),
                  " ",
                  counter.unit
                ] })
              ] })
            ] }),
            counter.deadline && /* @__PURE__ */ jsxs(
              "div",
              {
                className: cn(
                  "flex items-center gap-1 text-xs",
                  expired ? "text-destructive" : days !== null && days <= 7 ? "text-orange-500" : "text-muted-foreground"
                ),
                children: [
                  expired ? /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }) : /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                  expired ? "Prazo expirado" : days !== null ? `${days} dias restantes` : null
                ]
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      AddAmountModal,
      {
        open: modalOpen,
        onOpenChange: setModalOpen,
        counter,
        userId,
        onSuccess: (addedAmount) => {
          setCounter((prev) => ({
            ...prev,
            current_value: prev.current_value + addedAmount
          }));
        }
      }
    )
  ] });
}
const CounterCard$1 = withQueryProvider(CounterCard);

export { CounterCard$1 as C };
