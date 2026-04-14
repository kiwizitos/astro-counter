/**
 * AuthForm island — handles login, registration, and Google OAuth.
 * Used on /login page.
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Mode = 'login' | 'register';

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const currentForm = mode === 'login' ? loginForm : registerForm;

  async function handleLogin(data: LoginInput) {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
        toast.error('Email ou senha incorretos.');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Confirme seu email antes de entrar. Verifique sua caixa de entrada.');
      } else {
        toast.error(error.message ?? 'Erro ao fazer login.');
      }
      return;
    }

    toast.success('Login realizado! Redirecionando...');
    window.location.href = '/dashboard';
  }

  async function handleRegister(data: RegisterInput) {
    setIsLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    setIsLoading(false);

    if (error) {
      // Traduz erros comuns do Supabase
      if (error.message.includes('User already registered')) {
        toast.error('Este email já está cadastrado. Tente fazer login.');
      } else if (error.message.includes('Password should be')) {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
      } else if (error.message.includes('Invalid email')) {
        toast.error('Email inválido.');
      } else {
        toast.error(error.message ?? 'Erro ao criar conta.');
      }
      return;
    }

    // Se confirmação de email está desabilitada no Supabase, o usuário já está logado
    if (authData.session) {
      toast.success('Conta criada com sucesso! Redirecionando...');
      window.location.href = '/dashboard';
      return;
    }

    // Confirmação de email está habilitada
    toast.success(
      'Conta criada! Verifique seu email para confirmar o cadastro antes de entrar.',
      { duration: 8000 }
    );
    // Muda para tela de login para o usuário entrar após confirmar
    setMode('login');
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  function onSubmit(data: LoginInput | RegisterInput) {
    if (mode === 'login') {
      void handleLogin(data as LoginInput);
    } else {
      void handleRegister(data as RegisterInput);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl animate-fade-in">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="text-2xl">🔢</span>
        </div>
        <CardTitle className="text-2xl font-bold">
          {mode === 'login' ? 'Bem-vindo de volta!' : 'Criar conta'}
        </CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'Entre para acessar seus grupos e contadores'
            : 'Comece a contar junto com seus amigos'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Google OAuth */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continuar com Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form
          onSubmit={
            mode === 'login'
              ? loginForm.handleSubmit((d) => onSubmit(d))
              : registerForm.handleSubmit((d) => onSubmit(d))
          }
          className="space-y-3"
        >
          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="full_name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  placeholder="Seu nome"
                  className="pl-9"
                  {...registerForm.register('full_name')}
                />
              </div>
              {registerForm.formState.errors.full_name && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.full_name.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-9"
                {...currentForm.register('email')}
              />
            </div>
            {currentForm.formState.errors.email && (
              <p className="text-xs text-destructive">
                {(currentForm.formState.errors.email as { message?: string }).message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-9 pr-9"
                {...currentForm.register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {currentForm.formState.errors.password && (
              <p className="text-xs text-destructive">
                {(currentForm.formState.errors.password as { message?: string }).message}
              </p>
            )}
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-9"
                  {...registerForm.register('confirmPassword')}
                />
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === 'login' ? (
              'Entrar'
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-primary hover:underline font-medium"
          >
            {mode === 'login' ? 'Criar conta' : 'Fazer login'}
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
