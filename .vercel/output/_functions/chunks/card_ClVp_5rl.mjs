import { createBrowserClient } from '@supabase/ssr';
import { z } from 'zod';
import { jsx } from 'react/jsx-runtime';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as LabelPrimitive from '@radix-ui/react-label';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const supabaseUrl = "https://rnnhdzsktrbbopodlqis.supabase.co";
const supabaseAnonKey = "sb_publishable_9lx0iiKAc0HSuqs4ghevZQ_vo4ceOV1";
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatNumber(value, unit) {
  const formatted = new Intl.NumberFormat("pt-BR").format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}
function calcProgress(current, goal) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round(current / goal * 100));
}
function relativeTime(dateString) {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1e3);
  if (diffSec < 60) return "agora mesmo";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min atrás`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} h atrás`;
  if (diffSec < 2592e3) return `${Math.floor(diffSec / 86400)} dias atrás`;
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
function isExpired(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < /* @__PURE__ */ new Date();
}
function daysRemaining(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / 864e5);
}
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
function parseError(err) {
  if (!err) return "Erro desconhecido.";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err;
    const parts = [];
    if (typeof e["message"] === "string" && e["message"]) parts.push(e["message"]);
    if (typeof e["details"] === "string" && e["details"]) parts.push(`Detalhes: ${e["details"]}`);
    if (typeof e["hint"] === "string" && e["hint"]) parts.push(`Dica: ${e["hint"]}`);
    if (typeof e["code"] === "string" && e["code"]) parts.push(`[${e["code"]}]`);
    if (parts.length) return parts.join(" — ");
  }
  return "Erro desconhecido.";
}

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});
const registerSchema = loginSchema.extend({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  confirmPassword: z.string().min(6)
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"]
});
const createGroupSchema = z.object({
  name: z.string().min(2, "Nome do grupo deve ter pelo menos 2 caracteres").max(60, "Nome muito longo"),
  description: z.string().max(200, "Descrição muito longa").optional()
});
const joinGroupSchema = z.object({
  inviteCode: z.string().length(6, "Código de convite deve ter 6 caracteres").toUpperCase()
});
const createCounterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(80, "Nome muito longo"),
  unit: z.string().min(1, "Unidade é obrigatória").max(20, "Unidade muito longa").default("un"),
  description: z.string().max(200).optional(),
  goal: z.coerce.number({ invalid_type_error: "Meta deve ser um número" }).positive("Meta deve ser positiva").optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal(""))
});
const addAmountSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: "Informe um número" }).positive("Deve ser maior que 0").multipleOf(0.01, "Máximo 2 casas decimais"),
  note: z.string().max(200, "Nota muito longa").optional()
});

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;

const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-lg border bg-card text-card-foreground shadow-sm", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "h3",
    {
      ref,
      className: cn("text-2xl font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("p", { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";

export { Button as B, Card as C, Input as I, Label as L, createGroupSchema as a, CardHeader as b, cn as c, CardTitle as d, CardContent as e, formatNumber as f, getInitials as g, createCounterSchema as h, addAmountSchema as i, joinGroupSchema as j, calcProgress as k, daysRemaining as l, isExpired as m, loginSchema as n, registerSchema as o, parseError as p, CardDescription as q, relativeTime as r, supabase as s };
