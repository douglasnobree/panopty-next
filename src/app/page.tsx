'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { Logo } from '@/components/ui/logo';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserRole } from '@/lib/auth';

const schema = yup
  .object({
    login: yup
      .string()
      .email('Insira um email válido')
      .required('Esse campo é obrigatório'),
    password: yup.string().required('Esse campo é obrigatório'),
  })
  .required();

interface LoginForm {
  login: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    const auth = isAuthenticated();
    if (auth) {
      const role = getUserRole();
      // Redireciona com base na role
      if (role === 'cityManager') {
        router.push('/managerView');
      } else if (role === 'admin') {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    await handleLogin(data);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md flex flex-col items-center gap-6 sm:gap-12 animate-fade-in-up'>
        <div className='animate-fade-in-up' style={{ animationDelay: '0.1s' }}>
          <Logo width={150} height={87.23} type='vertical' />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-full space-y-4 animate-fade-in-up'
          style={{ animationDelay: '0.2s' }}>
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='Email'
              {...register('login')}
              className='h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500'
            />
            {errors.login && (
              <p className='text-sm text-red-500'>{errors.login.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='password'
              className='text-sm font-medium text-gray-700'>
              Senha
            </Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Senha'
                {...register('password')}
                className='h-12 pr-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
          </div>

          <p className='text-sm text-gray-600 text-left'>
            Esqueceu a senha?{' '}
            <Link
              href='/'
              className='text-orange-500 hover:text-orange-600 underline'>
              Recuperar
            </Link>
          </p>

          <Button
            type='submit'
            className='w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md'>
            Entrar
          </Button>

          {authError.type === 'error' && (
            <p className='text-sm text-red-500 text-center mt-2'>
              {authError.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
