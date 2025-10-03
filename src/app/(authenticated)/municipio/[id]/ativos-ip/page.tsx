'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/statscard/stats-card';
import { Plus, FileText, Calendar } from 'lucide-react';
import api from '@/services/api';
import type { AllIpAssets } from '@/lib/types';

interface CityIpAssetsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CityIpAssets({ params }: CityIpAssetsProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const cityId = resolvedParams.id;
  const [loading, setLoading] = useState(true);
  const [ipAssets, setIpAssets] = useState<AllIpAssets[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.post(`/getAtivosIp/${cityId}`);
        setIpAssets(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar ativos de IP:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cityId]);

  const totalAssets = ipAssets?.length || 0;
  const activeAssets =
    ipAssets?.filter((asset) => asset.status === 'Ativo').length || 0;
  const currentYear = new Date().getFullYear();
  const currentYearAssets =
    ipAssets?.filter((asset) => asset.year === currentYear.toString()).length ||
    0;

  return (
    // <CHANGE> Updated layout with dashboard-style header and blue color scheme
    <div className='min-h-screen bg-background'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>
                Ativos de IP
              </h1>
              <p className='text-slate-600 mt-1'>
                Gerencie os ativos de propriedade intelectual
              </p>
            </div>
            <Button
              onClick={() =>
                router.push(`/municipio/${cityId}/ativos-ip/upload`)
              }
              className='bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Novo ativo de IP
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <StatsCard
            title='Total de Ativos'
            value={totalAssets}
            color='blue'
            className='shadow-sm'
          />
          <StatsCard
            title='Ativos Ativos'
            value={activeAssets}
            color='green'
            className='shadow-sm'
          />
          <StatsCard
            title={`Ativos ${currentYear}`}
            value={currentYearAssets}
            color='amber'
            className='shadow-sm'
          />
        </div>

        {/* Table Section */}
        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FileText className='w-5 h-5 mr-2 text-[var(--blue-9)]' />
              Lista de Ativos de IP
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--blue-9)]'></div>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full border rounded-md border-[var(--border)]'>
                  <thead className='bg-[var(--slate-2)]'>
                    <tr>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Arquivo
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Status
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Ano
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Mês
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipAssets?.map((ipAsset, i) => (
                      <tr
                        key={i}
                        className='border-b border-[var(--border)] hover:bg-[var(--blue-1)]'>
                        <td className='py-3 px-4'>
                          <div className='flex items-center'>
                            <FileText className='w-4 h-4 mr-2 text-slate-400' />
                            <span className='font-medium text-slate-900'>
                              {ipAsset.name}
                            </span>
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <Badge
                            variant={
                              ipAsset.status === 'Ativo'
                                ? 'default'
                                : 'secondary'
                            }
                            className={
                              ipAsset.status === 'Ativo'
                                ? 'bg-[var(--green-3)] text-[var(--green-12)] border border-[var(--green-12)]'
                                : 'bg-[var(--slate-3)] text-[var(--slate-11)]'
                            }>
                            {ipAsset.status}
                          </Badge>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='flex items-center text-slate-600'>
                            <Calendar className='w-4 h-4 mr-1' />
                            {ipAsset.year}
                          </div>
                        </td>
                        <td className='py-3 px-4 text-slate-600'>
                          {ipAsset.month}
                        </td>
                        <td className='py-3 px-4'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-[var(--blue-9)] text-[var(--blue-9)] hover:bg-[var(--blue-1)]'>
                            Ver detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!ipAssets || ipAssets.length === 0) && (
                  <div className='text-center py-8 text-muted-foreground'>
                    Nenhum ativo de IP encontrado
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
