'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableLine } from '@/components/Table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    // <CHANGE> Updated layout with dashboard-style header and orange color scheme
    <div className='min-h-screen bg-gray-50'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                Projetos de Lei
              </h1>
              <p className='text-gray-600 mt-1'>
                Gerencie os projetos de lei da cidade
              </p>
            </div>
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/municipio/${cityId}/projetos-de-lei/upload`
                )
              }
              className='bg-orange-500 hover:bg-orange-600 text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Novo projeto de lei
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <Card className='border-l-4 border-l-orange-primary'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Total de Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900'>
                {bills?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className='border-l-4 border-l-green-500'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {bills?.filter((bill) => bill.status === 'ativo').length || 0}
              </div>
            </CardContent>
          </Card>

          <Card className='border-l-4 border-l-blue-500'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600'>
                Este Ano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-blue-600'>
                {bills?.filter(
                  (bill) => bill.ano === new Date().getFullYear().toString()
                ).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <FileText className='w-5 h-5 mr-2 text-orange-primary' />
              Lista de Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex items-center justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-orange-primary'></div>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-gray-200'>
                      <th className='text-left py-3 px-4 font-medium text-gray-600'>
                        Arquivo
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-gray-600'>
                        Status
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-gray-600'>
                        Ano do projeto
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-gray-600'>
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills?.map((bill, i) => (
                      <tr
                        key={i}
                        className='border-b border-gray-100 hover:bg-gray-50'>
                        <td className='py-3 px-4'>
                          <div className='flex items-center'>
                            <FileText className='w-4 h-4 mr-2 text-gray-400' />
                            <span className='font-medium text-gray-900'>
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
                                ? 'bg-green-success text-white'
                                : ''
                            }>
                            {bill.status || 'Disponível'}
                          </Badge>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='flex items-center text-gray-600'>
                            <Calendar className='w-4 h-4 mr-1' />
                            {bill.ano}
                          </div>
                        </td>
                        <td className='py-3 px-4'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-orange-primary text-orange-primary hover:bg-orange-light'>
                            Ver detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!bills || bills.length === 0) && (
                  <div className='text-center py-8 text-gray-500'>
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
