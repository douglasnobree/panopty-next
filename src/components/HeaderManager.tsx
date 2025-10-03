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

const navigationItems = [{ name: 'Visão Geral', href: '/managerView' }];

export function HeaderManager() {
  const { handleLogout, userRole } = useAuth();
  const pathname = usePathname();

  return (
    <header className='w-full px-4 sm:px-6 py-4 transition-all duration-300 bg-transparent hover:bg-background'>
      <div className='flex items-center justify-between'>
        {/* Logo and Navigation */}
        <div className='flex items-center gap-4 sm:gap-8'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <Link href='/managerView'>
              <Logo />
            </Link>
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
                      ? 'text-foreground border-primary'
                      : 'text-muted-foreground border-transparent hover:text-foreground'
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
            <Bell size={20} className='text-muted-foreground' />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center gap-2 text-foreground'>
                Gestor Municipal
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
