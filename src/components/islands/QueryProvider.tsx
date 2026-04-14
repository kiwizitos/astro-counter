/**
 * QueryProvider — wraps children with TanStack Query client.
 *
 * Em Astro, islands React são hidratados de forma independente.
 * Cada island que usa TanStack Query deve ser envolvido por este provider.
 *
 * Use o HOC `withQueryProvider` para islands folha, ou importe
 * `QueryProvider` e envolva manualmente.
 */
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode, type ComponentType } from 'react';

const defaultOptions = {
  queries: {
    staleTime: 30 * 1000,       // 30s
    gcTime: 5 * 60 * 1000,      // 5m
    retry: 1,
    refetchOnWindowFocus: false,
  },
} as const;

interface QueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * HOC: envolve qualquer componente com QueryClientProvider.
 * Use para islands que precisam de TanStack Query sem precisar
 * de um QueryProvider externo.
 *
 * @example
 * export default withQueryProvider(GroupList);
 */
export function withQueryProvider<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  function WrappedWithQuery(props: P) {
    const [queryClient] = useState(() => new QueryClient({ defaultOptions }));
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    );
  }
  WrappedWithQuery.displayName = `withQueryProvider(${Component.displayName ?? Component.name})`;
  return WrappedWithQuery;
}
