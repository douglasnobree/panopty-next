'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableLine } from '@/components/Table';
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

  return (
    <div className='p-6'>
      <Table
        tableTitle='Ativos de IP'
        tableHeaders={['Arquivo', 'Status', 'Ano', 'Mês']}
        addButtonEvent={() =>
          router.push(`/dashboard/municipio/${cityId}/ativos-ip/upload`)
        }
        addButton='Novo ativo de IP'
        loading={loading}>
        <>
          {ipAssets?.map((ipAsset, i) => {
            const data = Object.entries(ipAsset)
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
                slug={ipAsset.name}
                id={ipAsset.id}
                path=''
              />
            );
          })}
        </>
      </Table>
    </div>
  );
}
