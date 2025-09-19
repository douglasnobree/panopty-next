'use client';

import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/statscard/stats-card';
import { Plus, FileText, Calculator, ArrowLeft } from 'lucide-react';

const CityLamps = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  // Mock data for stats - replace with actual data when available
  const totalCalculations = 0;
  const completedCalculations = 0;
  const currentYear = new Date().getFullYear();
  const currentYearCalculations = 0;

  return (
    // <CHANGE> Updated layout with dashboard-style header and blue color scheme
    <div className='min-h-screen bg-background'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                onClick={() => router.back()}
                className='text-[var(--slate-12)]'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>Lâmpadas</h1>
                <p className='text-slate-600 mt-1'>
                  Gerencie os cálculos de potência do QIP
                </p>
              </div>
            </div>
            <Button
              onClick={() =>
                router.push(`/dashboard/municipio/${id}/lampadas/calculo-qip`)
              }
              className='bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
              <Plus className='w-4 h-4 mr-2' />
              Calcular potência do QIP
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <StatsCard
            title='Total de Cálculos'
            value={totalCalculations}
            color='blue'
            className='shadow-sm'
          />
          <StatsCard
            title='Cálculos Concluídos'
            value={completedCalculations}
            color='green'
            className='shadow-sm'
          />
          <StatsCard
            title={`Cálculos ${currentYear}`}
            value={currentYearCalculations}
            color='amber'
            className='shadow-sm'
          />
        </div>

        {/* Table Section */}
        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Calculator className='w-5 h-5 mr-2 text-[var(--blue-9)]' />
              Lista de Cálculos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full border rounded-md border-[var(--border)]'>
                <thead className='bg-[var(--slate-2)]'>
                  <tr>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Nome do Cálculo
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Status
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Data
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Placeholder row for empty state */}
                  <tr className='border-b border-[var(--border)]'>
                    <td
                      colSpan={4}
                      className='py-8 px-4 text-center text-muted-foreground'>
                      Nenhum cálculo de QIP encontrado. Clique em "Calcular
                      potência do QIP" para adicionar um novo.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CityLamps;
