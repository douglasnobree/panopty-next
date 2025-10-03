'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table } from '@/components/Table';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const CityAnalyzes = () => {
  const router = useRouter();
  const params = useParams();
  const cityId = params.id as string;

  return (
    <div className='bg-background'>
      <main
        className='container mx-auto px-4 py-6 space-y-6'
        style={{ maxWidth: 'var(--max-width)' }}>
        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-center gap-4'>
                <Button
                  variant='ghost'
                  onClick={() => router.back()}
                  className='text-[var(--slate-12)]'>
                  <ArrowLeft className='h-4 w-4' />
                </Button>
                <CardTitle className='text-xl font-semibold text-[var(--slate-12)]'>
                  Análises
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table
              tableTitle=''
              tableHeaders={[]}
              addButtonEvent={() =>
                router.push(
                  `/municipio/${cityId}/analises/create-new`
                )
              }
              addButton='Nova análise'>
              <></>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CityAnalyzes;
