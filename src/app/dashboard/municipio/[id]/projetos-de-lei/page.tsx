'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableLine } from '@/components/Table';
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
    <Table
      tableTitle='Projetos de lei'
      tableHeaders={['Arquivo', 'Status', 'Ano do projeto']}
      addButtonEvent={() =>
        router.push(`/dashboard/municipio/${cityId}/projetos-de-lei/upload`)
      }
      addButton='Novo projeto de lei'
      loading={loading}>
      <>
        {bills?.map((bill, i) => {
          const data = Object.entries(bill)
            .filter(
              ([key]) =>
                key !== 'id' && key !== 'cities_id' && key !== 'filePath'
            )
            .map(([, value]) => value);
          return (
            <TableLine
              key={i}
              data={data}
              selected={false}
              onSelected={(selected) => {}}
              slug={bill.name}
              id={bill.id}
              path=''
            />
          );
        })}
      </>
    </Table>
  );
}
