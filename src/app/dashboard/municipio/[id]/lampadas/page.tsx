'use client';

import { Table } from '@/components/Table';
import { useRouter, useSearchParams } from 'next/navigation';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

const CityLamps = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <Table
      tableTitle='Calculos de QIP'
      tableHeaders={[]}
      addButtonEvent={() =>
        router.push(`/dashboard/municipio/${id}/lampadas/calculo-qip`)
      }
      addButton='Calcular potência do QIP'>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className='text-center py-8 text-gray-500'>
            Nenhum cálculo de QIP encontrado. Clique em "Calcular potência do
            QIP" para adicionar um novo.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CityLamps;
