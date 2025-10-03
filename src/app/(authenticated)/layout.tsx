'use client';

import { Header } from '@/components/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole, isAuthenticated } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificação imediata antes de qualquer renderização
  if (typeof window !== 'undefined') {
    const auth = isAuthenticated();
    const role = getUserRole();

    // Se não estiver autenticado ou não for admin, redireciona imediatamente
    if (!auth || role !== 'admin') {
      if (!auth) {
        router.replace('/');
      } else if (role === 'cityManager') {
        router.replace('/managerView');
      } else {
        router.replace('/');
      }

      // Retorna o loading state enquanto o redirecionamento acontece
      return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--slate-1)] via-background to-[var(--slate-2)] animate-fade-in-up'>
          <div className='relative'>
            <div className='animate-spin rounded-full h-16 w-16 border-4 border-[var(--blue-9)] border-t-transparent'></div>
            <div
              className='absolute inset-0 rounded-full border-4 border-[var(--blue-10)] border-t-transparent animate-spin'
              style={{
                animationDirection: 'reverse',
                animationDuration: '1.5s',
              }}></div>
          </div>
          <p className='text-[var(--slate-11)] font-medium mt-4'>
            Verificando permissões...
          </p>
          <p className='text-[var(--slate-10)] text-sm mt-1'>
            Você será redirecionado para a área apropriada
          </p>
        </div>
      );
    }
  }

  useEffect(() => {
    const auth = isAuthenticated();
    const role = getUserRole();
    setIsAuth(auth && role === 'admin');
    setIsAuthChecked(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading || !isAuthChecked) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--slate-1)] via-background to-[var(--slate-2)] animate-fade-in-up'>
        <div className='relative'>
          <div className='animate-spin rounded-full h-16 w-16 border-4 border-[var(--blue-9)] border-t-transparent'></div>
          <div
            className='absolute inset-0 rounded-full border-4 border-[var(--blue-10)] border-t-transparent animate-spin'
            style={{
              animationDirection: 'reverse',
              animationDuration: '1.5s',
            }}></div>
        </div>
        <p className='text-[var(--slate-11)] font-medium mt-4'>
          Verificando permissões...
        </p>
        <p className='text-[var(--slate-10)] text-sm mt-1'>
          Aguarde enquanto validamos seu acesso
        </p>
      </div>
    );
  }

  // Se não estiver autenticado como admin, não renderiza nada (o redirecionamento já foi iniciado)
  if (!isAuth) {
    return null;
  }

  // Só renderiza o conteúdo se for um admin autenticado
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <main className='flex-1 h-full'>{children}</main>
    </div>
  );
}
