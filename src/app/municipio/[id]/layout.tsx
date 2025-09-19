'use client';

import { usePowerBI } from '@/hooks/usePowerBI';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Network, FileCheck, Monitor } from 'lucide-react';
import { Header } from '@/components/Header';

interface MunicipioLayoutProps {
  children: React.ReactNode;
}

export default function MunicipioLayout({ children }: MunicipioLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const id = params.id as string;

  const isActive = (href: string) => pathname === href;
  const isDashboardActive = pathname === `/municipio/${id}`;

  return (
    <>
    <Header />
    <div className='flex h-screen w-full'>
      {/* Menu Lateral */}
      <div className='w-64 bg-card border-r border-[var(--border)] flex flex-col shadow-sm'>
        <div className='p-4 border-b border-[var(--border)]'>
          <Link href={`/municipio/${id}`}>
            <div className='cursor-pointer hover:bg-[var(--blue-1)] p-2 rounded mb-2'>
              <h2 className='text-lg font-semibold text-[var(--slate-12)]'>
                Dashboard
              </h2>
              <p className='text-sm text-[var(--slate-11)]'>Município {id}</p>
            </div>
          </Link>
        </div>

        <Link href={`/municipio/${id}`}>
          <Button
            variant='ghost'
            className={`w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)] ${
              isDashboardActive
                ? 'bg-[var(--blue-3)] text-[var(--blue-11)]'
                : ''
            }`}>
            <FileText className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Visão Geral
          </Button>
        </Link>

        <Link href={`/municipio/${id}/analises`}>
          <Button
            variant='ghost'
            className='w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)]'
            onClick={() => console.log('Análises')}>
            <FileText className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Análises
          </Button>
        </Link>

        <Link href={`/municipio/${id}/ativos-ip`}>
          <Button
            variant='ghost'
            className={`w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)] ${
              isActive(`/municipio/${id}/ativos-ip`)
                ? 'bg-[var(--blue-3)] text-[var(--blue-11)]'
                : ''
            }`}>
            <Network className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Ativos de IP
          </Button>
        </Link>

        <Link href={`/municipio/${id}/projetos-de-lei`}>
          <Button
            variant='ghost'
            className='w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)]'
            onClick={() => console.log('Projetos de Lei')}>
            <FileCheck className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Projetos de Lei
          </Button>
        </Link>
        <Link href={`/municipio/${id}/lampadas`}>
          <Button
            variant='ghost'
            className='w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)]'
            onClick={() => console.log('Quadro de IP')}>
            <Monitor className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Quadro de IP
          </Button>
        </Link>
      </div>

      {/* Conteúdo Principal */}
      <div className='flex-1 relative'>{children}</div>
    </div>
    </>
  );
}
