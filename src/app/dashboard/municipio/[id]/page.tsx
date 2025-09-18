'use client';

import { usePowerBI } from '@/app/hooks/usePowerBI';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Network, FileCheck, Monitor } from 'lucide-react';

export default function DashboardBiPage() {
  const params = useParams();
  const id = params.id as string;
  const { useDashboardLinkQuery } = usePowerBI();
  const { data: dashboardLink, isLoading, error } = useDashboardLinkQuery(+id);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar o dashboard.</div>;
  }

  if (!dashboardLink) {
    return <div>Nenhum link encontrado.</div>;
  }

  return (
    <div className='flex h-screen w-full'>
      {/* Menu Lateral */}
      <div className='w-64 bg-card border-r border-[var(--border)] flex flex-col shadow-sm'>
        <div className='p-4 border-b border-[var(--border)]'>
          <h2 className='text-lg font-semibold text-[var(--slate-12)]'>
            Dashboard
          </h2>
          <p className='text-sm text-[var(--slate-11)]'>Município {id}</p>
        </div>

        <div className='flex-1 p-4 space-y-2'>
          <Button
            variant='ghost'
            className='w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)]'
            onClick={() => console.log('Análises')}>
            <FileText className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Análises
          </Button>

          <Link href={`/dashboard/municipio/${id}/ativos-ip`}>
            <Button
              variant='ghost'
              className='w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)]'>
              <Network className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
              Ativos de IP
            </Button>
          </Link>

          <Button
            variant='ghost'
            className='w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)]'
            onClick={() => console.log('Projetos de Lei')}>
            <FileCheck className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Projetos de Lei
          </Button>

          <Button
            variant='ghost'
            className='w-full justify-start h-12 px-4 hover:bg-[var(--blue-1)] text-[var(--slate-12)]'
            onClick={() => console.log('Quadro de IP')}>
            <Monitor className='mr-3 h-5 w-5 text-[var(--blue-9)]' />
            Quadro de IP
          </Button>
        </div>
      </div>

      {/* Iframe do Power BI */}
      <div className='flex-1 relative'>
        <iframe
          src={dashboardLink}
          className='w-full h-full border-none'
          title='Dashboard'
        />
      </div>
    </div>
  );
}
