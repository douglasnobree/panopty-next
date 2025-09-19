import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setIsAuth(auth);
    setIsAuthChecked(true);

    if (!auth) {
      router.push('/login');
    }
  }, [router]);

  if (!isAuthChecked) {
    return <div>Carregando...</div>;
  }

  if (!isAuth) {
    return <div>Redirecionando...</div>;
  }

  return <>{children}</>;
}
