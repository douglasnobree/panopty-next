'use client';

import { Table } from '@/components/Table';
import { useRouter, useParams } from 'next/navigation';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';

const CityLamps = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  return (
    <div className='bg-background'>
      <main
        className='container mx-auto px-4 py-6 space-y-6'
        style={{ maxWidth: 'var(--max-width)' }}>
        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                onClick={() => router.back()}
                className='text-[var(--slate-12)]'>
                <ArrowLeft className='h-4 w-4' />
              </Button>
              <CardTitle className='text-xl font-semibold text-[var(--slate-12)]'>
                Cálculos de QIP
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <CardTitle className='text-xl font-semibold text-[var(--slate-12)]'>
                Lista de Cálculos
              </CardTitle>
              <Button
                onClick={() =>
                  router.push(`/dashboard/municipio/${id}/lampadas/calculo-qip`)
                }
                className='bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
                Calcular potência do QIP
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table
              tableTitle=''
              tableHeaders={[]}
              addButtonEvent={() => {}}
              addButton=''>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className='text-center py-8 text-[var(--slate-11)]'>
                    Nenhum cálculo de QIP encontrado. Clique em "Calcular
                    potência do QIP" para adicionar um novo.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CityLamps;
