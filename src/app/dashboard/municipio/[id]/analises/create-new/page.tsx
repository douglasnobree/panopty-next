'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import type {
  Option,
  AllAnalyses,
  CountieInfo,
  AllBills,
  TariffModule,
  AllIpAssets,
} from '@/lib/types';

interface CreateAnalysisForm {
  ipFile: Option | null;
  bill: Option | null;
  tariffModule: Option | null;
}

const CreateAnalysis = () => {
  const router = useRouter();
  const { id } = useParams();

  const [allIpFile, setAllIpFile] = useState<Option[]>([]);
  const [allBills, setAllBills] = useState<Option[]>([]);
  const [allTariffModules, setAllTariffModules] = useState<Option[]>([]);
  const [countie, setCountie] = useState<null | CountieInfo>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [ipAssets, bills, tariffModules, city] = await Promise.all([
        api.post(`/getAtivosIp/${id}`),
        api.post(`/getProjetoLeiCity/${id}`),
        api.post('/getAllTarifModule'),
        api.get(`/showMunicipalities/${id}`),
      ]);
      const formattedIpFIle = ipAssets.data.data.map((ipFile: AllIpAssets) => ({
        label: `${ipFile.name} - ${ipFile.month}/${ipFile.year}`,
        value: ipFile.id,
      }));
      const formattedBills = bills.data.data.map((bill: AllBills) => ({
        label: `${bill.name} - ${bill.year}`,
        value: bill.id,
      }));
      const formattedTariffModules = tariffModules.data.data.map(
        (tariff: TariffModule) => ({
          label: `${tariff.rate_value} - ${tariff.rate_type.type} (${tariff.month}/${tariff.year})`,
          value: tariff.id,
        })
      );
      setCountie(city.data.data);

      setAllIpFile(formattedIpFIle);
      setAllBills(formattedBills);
      setAllTariffModules(formattedTariffModules);
    };
    fetchData();
  }, [id]);

  const { handleSubmit, setValue, watch } = useForm<CreateAnalysisForm>({
    mode: 'all',
    defaultValues: {
      ipFile: null,
      bill: null,
      tariffModule: null,
    },
  });

  const ipValue = watch('ipFile');
  const billValue = watch('bill');
  const tariffValue = watch('tariffModule');

  const handleIpChange = (option: Option | null) => {
    setValue('ipFile', option);
  };
  const handleBillChange = (option: Option | null) => {
    setValue('bill', option);
  };
  const handleTariffChange = (option: Option | null) => {
    setValue('tariffModule', option);
  };

  const onSubmit = async (data: CreateAnalysisForm) => {
    if (countie && data && data.tariffModule && data.ipFile) {
      await api.post('/todasAnalises', {
        arquivo_id: data.bill?.value,
        excel_file_id: data.ipFile?.value,
        tarif_modules_id: data.tariffModule?.value,
      });

      router.push('/analise');
    }
  };

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
                  Criar nova análise
                </CardTitle>
              </div>
              <Button
                onClick={handleSubmit(onSubmit)}
                className='flex items-center gap-2 bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
                Gerar análise
              </Button>
            </div>
            {countie && (
              <p className='text-[var(--slate-11)] mt-2'>{countie?.name}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p className='text-[var(--slate-11)]'>
                Selecione os dados para gerar as análises
              </p>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-2 text-[var(--slate-12)]'>
                    Ativo de IP
                  </label>
                  <Select
                    id='ipFile'
                    name='ipFile'
                    options={allIpFile}
                    value={ipValue}
                    onChange={handleIpChange}
                    placeholder='Selecione o ativo de IP'
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: 'var(--border)',
                        '&:hover': {
                          borderColor: 'var(--blue-9)',
                        },
                      }),
                    }}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2 text-[var(--slate-12)]'>
                    Projeto de lei
                  </label>
                  <Select
                    id='bill'
                    name='bill'
                    options={allBills}
                    value={billValue}
                    onChange={handleBillChange}
                    placeholder='Selecione o projeto de lei'
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: 'var(--border)',
                        '&:hover': {
                          borderColor: 'var(--blue-9)',
                        },
                      }),
                    }}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2 text-[var(--slate-12)]'>
                    Módulo tarifário
                  </label>
                  <Select
                    id='tariffModule'
                    name='tariffModule'
                    options={allTariffModules}
                    value={tariffValue}
                    onChange={handleTariffChange}
                    placeholder='Selecione o módulo tarifário'
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: 'var(--border)',
                        '&:hover': {
                          borderColor: 'var(--blue-9)',
                        },
                      }),
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateAnalysis;
