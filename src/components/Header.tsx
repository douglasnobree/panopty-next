'use client';
import { Bell, ChevronDown, Menu } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
    <header className='w-full bg-background border-b border-border px-4 sm:px-6 py-4'>
      <div className='flex items-center justify-between'>
        {/* Logo and Navigation */}
        <div className='flex items-center gap-4 sm:gap-8'>
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <Link href='/dashboard'>
              <Logo />
            </Link>
          </div>

          {/* Menu Mobile */}
          <div className='sm:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='sm' className='p-2'>
                  <Menu size={24} className='text-muted-foreground' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
                <SheetTitle>Menu de Navegação</SheetTitle>
                <nav className='flex flex-col gap-4 mt-8'>
                  {navigationItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        href={item.href}
                        key={item.name}
                        className={`text-base font-medium p-2 rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}>
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Navigation Desktop */}
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
