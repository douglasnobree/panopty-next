'use client';

import { usePowerBI } from '@/app/hooks/usePowerBI';
import { useParams } from 'next/navigation';

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
    <iframe
      src={dashboardLink}
      className='w-full h-full border-none'
      title='Dashboard'
    />
  );
}
