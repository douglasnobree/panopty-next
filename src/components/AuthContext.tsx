'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import api from '../services/api';
import { UserRole } from '../lib/auth';

interface DecodedToken {
  exp: number;
  iss: string;
  role: UserRole;
}

interface LoginForm {
  login: string;
  password: string;
}

interface AuthError {
  type: string;
  message: string;
}

interface AuthContextInterface {
  authenticated: boolean;
  loading: boolean;
  handleLogin: (loginData: LoginForm) => Promise<void>;
  handleLogout: () => void;
  authError: AuthError;
  userRole: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextInterface>(
  {} as AuthContextInterface
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [authError, setAuthError] = useState<AuthError>({
    type: 'undefined',
    message: '',
  });

  const router = useRouter();

  const expectedBaseUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_PANOPTY_BASE_URL_DEV
      : process.env.NEXT_PUBLIC_PANOPTY_BASE_URL_PRO;

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies['panopty-token'];
    const role = cookies['panopty-role'];

    if (token) {
      // O interceptor da API já cuidará de adicionar o token automaticamente
      setAuthenticated(true);
      if (role) {
        setUserRole(role);
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = useCallback(
    async (loginData: LoginForm) => {
      try {
        const { login, password } = loginData;

        const response = await api.post('/login', {
          email: login,
          password: password,
        });

        const token = response.data.access_token;

        if (!token) {
          throw new Error('Erro interno');
        }

        const decodedToken = jwtDecode(token) as DecodedToken;
        const { role } = decodedToken;

        setCookie(undefined, 'panopty-role', role, {
          maxAge: 60 * 60 * 24, // 24 hours
        });
        setUserRole(role);

        setCookie(undefined, 'panopty-token', token, {
          maxAge: 60 * 60 * 24, // 24 hours
        });

        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        setAuthenticated(true);

        if (decodedToken.exp < Date.now() / 1000) {
          throw new Error('Token expirado');
        }

        if (decodedToken.iss !== expectedBaseUrl + 'api/login') {
          throw new Error('Token inválido');
        }

        if (response.data.status !== 'ativo') {
          throw new Error('Usuário inativo');
        }

        if (
          response.data.type === 'admin' ||
          response.data.type === 'cityManager'
        ) {
          setCookie(undefined, 'panopty-token', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });

          setCookie(undefined, 'panopty-id', response.data.id, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });

          setCookie(undefined, 'panopty-role', response.data.type, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          });

          // O interceptor da API já cuidará de adicionar o token automaticamente

          setAuthenticated(true);
          setUserRole(response.data.type);

          // Redireciona com base na role
          if (response.data.type === 'cityManager') {
            router.push('/managerView');
          } else if (response.data.type === 'admin') {
            router.push('/dashboard');
          }
        } else {
          throw new Error('Tipo de usuário não autorizado');
        }
      } catch (err) {
        const error = err as any;
        if (error.response) {
          setAuthError({ type: 'error', message: error.response.data.message });
        } else if (error instanceof Error) {
          setAuthError({ type: 'error', message: error.message });
        } else {
          setAuthError({
            type: 'error',
            message: 'Ocorreu um erro inesperado',
          });
          console.error('Erro inesperado:', err);
        }
      }
    },
    [expectedBaseUrl, router]
  );

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    setUserRole('');

    // Não precisamos mais limpar manualmente o header, o interceptor cuidará disso

    destroyCookie(undefined, 'panopty-token', { path: '/' });
    destroyCookie(undefined, 'panopty-id', { path: '/' });
    destroyCookie(undefined, 'panopty-role', { path: '/' });

    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        handleLogin,
        handleLogout,
        authError,
        userRole,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextInterface {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
