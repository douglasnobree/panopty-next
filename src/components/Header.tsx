'use client';
import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/ui/logo';
import { useAuth } from './AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Diagnóstico', href: '/diagnostico' },
  { name: 'Gestores', href: '/gestores' },
  { name: 'Módulo tarifário', href: '/tarifario' },
];

export function Header() {
  const { handleLogout, userRole } = useAuth();
  const pathname = usePathname();

  return (
    <header className='w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Logo and Navigation */}
        <div className='flex items-center gap-4 sm:gap-8'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <Logo />
          </div>

          {/* Navigation */}
          <nav className='hidden sm:flex items-center gap-4 sm:gap-8'>
            {navigationItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  href={item.href}
                  key={item.name}
                  className={`text-sm font-medium pb-4 border-b-2 transition-colors ${
                    isActive
                      ? 'text-gray-900 border-orange-500'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side - Notification and User */}
        <div className='flex items-center gap-2 sm:gap-4'>
          {/* Notification Bell */}
          <Button variant='ghost' size='sm' className='p-2'>
            <Bell size={20} className='text-gray-600' />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center gap-2 text-gray-700'>
                {userRole === 'admin' ? 'Administrador' : 'Gestor'}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
