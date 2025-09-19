'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableLine } from '@/components/Table';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import type { TariffModule } from '@/lib/types';

export default function Tarifario() {
  const router = useRouter();
  const [tariffModules, setTariffModules] = useState<TariffModule[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.post('/getAllTarifModule');
        setTariffModules(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar módulos tarifários:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  function getNameMonth(month: string): string {
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const monthIndex = parseInt(month, 10) - 1;
    return months[monthIndex];
  }

  const handleAddNew = () => {
    router.push('/tarifario/create');
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-slate-900'>
              Módulo tarifário
            </h1>
            <p className='text-slate-600 mt-1'>
              Gerencie os módulos tarifários dos municípios
            </p>
          </div>
        </div>

        {/* Table Section */}
        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <CardTitle>Módulos tarifários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              tableTitle='Módulos'
              tableHeaders={['Valor do módulo', 'Ano', 'Mês', 'Tipo']}
              addButtonEvent={handleAddNew}
              addButton='Novo módulo tarifário'
              loading={loading}>
              <>
                {tariffModules?.map((tariffModule, i) => {
                  const data = [
                    tariffModule.rate_value,
                    tariffModule.year,
                    getNameMonth(tariffModule.month),
                    tariffModule.rate_type.type,
                  ];
                  return (
                    <TableLine
                      key={i}
                      data={data}
                      selected={false}
                      onSelected={() => {}}
                      slug={`${tariffModule.id}`}
                      id={tariffModule.id}
                      path='/tarifario/modulo/slug'
                    />
                  );
                })}
              </>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
