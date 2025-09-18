import { parseCookies } from 'nookies';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'admin' | 'cityManager';

interface DecodedToken {
  exp: number;
  iss: string;
  // Adicione outras propriedades do token se necessário
}

export const isAuthenticated = (): boolean => {
  try {
    const cookies = parseCookies();
    const token = cookies['panopty-token'];

    if (!token) {
      return false;
    }

    const decodedToken = jwtDecode(token) as DecodedToken;
    const isExpired = decodedToken.exp < Date.now() / 1000;

    if (isExpired) {
      return false;
    }

    const expectedBaseUrl =
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_PANOPTY_BASE_URL_DEV
        : process.env.NEXT_PUBLIC_PANOPTY_BASE_URL_PRO;

    if (decodedToken.iss !== expectedBaseUrl + 'api/login') {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};
