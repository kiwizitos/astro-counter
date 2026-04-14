import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with locale-aware separators */
export function formatNumber(value: number, unit?: string): string {
  const formatted = new Intl.NumberFormat('pt-BR').format(value);
  return unit ? `${formatted} ${unit}` : formatted;
}

/** Return progress percentage clamped 0–100 */
export function calcProgress(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

/** Generate a random 6-char invite code */
export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/** Format relative time (e.g. "2 hours ago") */
export function relativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'agora mesmo';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min atrás`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} h atrás`;
  if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} dias atrás`;

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/** Format deadline as a readable date */
export function formatDeadline(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/** Returns true if deadline is past */
export function isExpired(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

/** Returns days remaining until deadline */
export function daysRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

/** Get user initials for avatar fallback */
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

/**
 * Extract a human-readable message from any error, including Supabase
 * PostgrestError objects which have `message`, `details`, `hint`, and `code`.
 */
export function parseError(err: unknown): string {
  if (!err) return 'Erro desconhecido.';
  if (typeof err === 'string') return err;
  if (typeof err === 'object') {
    const e = err as Record<string, unknown>;
    // Supabase PostgrestError shape
    const parts: string[] = [];
    if (typeof e['message'] === 'string' && e['message']) parts.push(e['message']);
    if (typeof e['details'] === 'string' && e['details']) parts.push(`Detalhes: ${e['details']}`);
    if (typeof e['hint'] === 'string' && e['hint']) parts.push(`Dica: ${e['hint']}`);
    if (typeof e['code'] === 'string' && e['code']) parts.push(`[${e['code']}]`);
    if (parts.length) return parts.join(' — ');
  }
  return 'Erro desconhecido.';
}
