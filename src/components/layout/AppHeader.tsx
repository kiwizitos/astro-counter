/**
 * AppHeader island — top navigation bar with user menu + bottom mobile nav.
 */
'use client';

import { useState, useEffect } from 'react';
import { LogOut, User, ChevronDown, LayoutDashboard, Users } from 'lucide-react';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AppHeaderProps {
  userEmail: string | null;
  userName: string | null;
  userAvatar: string | null;
}

export default function AppHeader({ userEmail, userName, userAvatar }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Must run client-side only to avoid SSR/hydration mismatch
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao sair.');
      setSigningOut(false);
      return;
    }
    window.location.href = '/login';
  }

  return (
    <>
      {/* ── Top header ── */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-2xl px-4 flex h-14 items-center justify-between">
          {/* Logo */}
          <a href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl" role="img" aria-label="contador">🔢</span>
            <span className="hidden sm:inline">Contador Coletivo</span>
          </a>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-accent transition-colors"
              aria-label="Menu do usuário"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={userAvatar ?? undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(userName ?? userEmail)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                {userName ?? userEmail}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {menuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border bg-popover shadow-lg p-1">
                  <div className="px-3 py-2 border-b mb-1">
                    <p className="text-xs font-medium truncate">{userName ?? 'Usuário'}</p>
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  </div>

                  <a
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Perfil
                  </a>

                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {signingOut ? 'Saindo…' : 'Sair'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Bottom mobile nav ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-bottom">
        <div className="flex h-16 items-center justify-around max-w-2xl mx-auto px-4">
          <a
            href="/dashboard"
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs transition-colors ${
              currentPath === '/dashboard'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a
            href="/groups"
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs transition-colors ${
              currentPath.startsWith('/groups')
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Grupos</span>
          </a>
        </div>
      </nav>
    </>
  );
}

