/**
 * Zod validation schemas for all forms in the app.
 */
import { z } from 'zod';

// ─── Auth ─────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = loginSchema
  .extend({
    full_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

// ─── Group ────────────────────────────────────────────────────
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome do grupo deve ter pelo menos 2 caracteres')
    .max(60, 'Nome muito longo'),
  description: z.string().max(200, 'Descrição muito longa').optional(),
});

export const joinGroupSchema = z.object({
  inviteCode: z
    .string()
    .length(6, 'Código de convite deve ter 6 caracteres')
    .toUpperCase(),
});

// ─── Counter ──────────────────────────────────────────────────
export const createCounterSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(80, 'Nome muito longo'),
  unit: z
    .string()
    .min(1, 'Unidade é obrigatória')
    .max(20, 'Unidade muito longa')
    .default('un'),
  description: z.string().max(200).optional(),
  goal: z.coerce
    .number({ invalid_type_error: 'Meta deve ser um número' })
    .positive('Meta deve ser positiva')
    .optional()
    .or(z.literal('')),
  deadline: z.string().optional().or(z.literal('')),
});

// ─── Add Amount ───────────────────────────────────────────────
export const addAmountSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Informe um número' })
    .positive('Deve ser maior que 0')
    .multipleOf(0.01, 'Máximo 2 casas decimais'),
  note: z.string().max(200, 'Nota muito longa').optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type JoinGroupInput = z.infer<typeof joinGroupSchema>;
export type CreateCounterInput = z.infer<typeof createCounterSchema>;
export type AddAmountInput = z.infer<typeof addAmountSchema>;
