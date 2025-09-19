'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableLine } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatsCard } from '@/components/statscard/stats-card';
import { Plus, FileText, Calendar } from 'lucide-react';
import api from '@/services/api';
import type { Bill } from '@/lib/types';

interface CityLawsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CityLaws({ params }: CityLawsProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const cityId = resolvedParams.id;
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await api.post(`/getProjetoLeiCity/${cityId}`);
      setBills(response.data.data);
      setLoading(false);
    };
    fetchData();
  }, [cityId]);

  return (
    // <CHANGE> Updated layout with dashboard-style header and blue color scheme
    <div className='min-h-screen bg-background'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>
                Projetos de Lei
              </h1>
              <p className='text-slate-600 mt-1'>
                Gerencie os projetos de lei da cidade
              </p>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/municipio/${cityId}/projetos-de-lei/upload`
                )
              }
              className='bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Novo projeto de lei
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <StatsCard
            title='Total de Projetos'
            value={bills?.length || 0}
            color='blue'
            className='shadow-sm'
          />
          <StatsCard
            title='Ativos'
            value={bills?.filter((bill) => bill.status === 'ativo').length || 0}
            color='green'
            className='shadow-sm'
          />
          <StatsCard
            title='Este Ano'
            value={
              bills?.filter(
                (bill) => bill.ano === new Date().getFullYear().toString()
              ).length || 0
            }
            color='amber'
            className='shadow-sm'
          />
        </div>

        {/* Table Section */}
        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FileText className='w-5 h-5 mr-2 text-[var(--blue-9)]' />
              Lista de Projetos
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
                        Ano do projeto
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills?.map((bill, i) => (
                      <tr
                        key={i}
                        className='border-b border-[var(--border)] hover:bg-[var(--blue-1)]'>
                        <td className='py-3 px-4'>
                          <div className='flex items-center'>
                            <FileText className='w-4 h-4 mr-2 text-slate-400' />
                            <span className='font-medium text-slate-900'>
                              {bill.name}
                            </span>
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <Badge
                            variant={
                              bill.status === 'ativo' ? 'default' : 'secondary'
                            }
                            className={
                              bill.status === 'ativo'
                                ? 'bg-[#e2f5e5] text-[#15803d] border border-[#15803d]'
                                : 'bg-[var(--slate-3)] text-[var(--slate-11)]'
                            }>
                            {bill.status || 'Disponível'}
                          </Badge>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='flex items-center text-slate-600'>
                            <Calendar className='w-4 h-4 mr-1' />
                            {bill.ano}
                          </div>
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
                {(!bills || bills.length === 0) && (
                  <div className='text-center py-8 text-muted-foreground'>
                    Nenhum projeto de lei encontrado
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
