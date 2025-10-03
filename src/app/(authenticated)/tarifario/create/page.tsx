'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';

const CreatableSelect = dynamic(() => import('react-select/creatable'), {
  ssr: false,
});
import * as yup from 'yup';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

interface Option {
  value: string;
  label: string;
}

interface RateTypes {
  id: string;
  type: string;
}

interface ModuleRegisterForm {
  module: string;
  moduleType: Option | null;
  month: string;
  year: string;
}

const schema = yup.object().shape({
  module: yup.string().required('Esse campo é obrigatório'),
  moduleType: yup.mixed().nullable().required('Esse campo é obrigatório'),
  month: yup.string().required('Esse campo é obrigatório'),
  year: yup.string().required('Esse campo é obrigatório'),
});

export default function CreateTariffModule() {
  const router = useRouter();
  const [allRateTypes, setAllRateTypes] = useState<Option[]>([]);
  const [moduleTypeIsLoading, setModuleTypeIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/getAllRateType');
        const formattedRateTypes = response.data.data.map(
          (rateType: RateTypes) => ({
            label: rateType.type,
            value: rateType.id,
          })
        );
        setAllRateTypes(formattedRateTypes);
      } catch (error) {
        console.error('Erro ao buscar tipos de taxa:', error);
      }
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ModuleRegisterForm>({
    mode: 'all',
    resolver: yupResolver(schema as any),
    defaultValues: {
      module: '',
      moduleType: null,
      month: '',
      year: '',
    },
  });

  const customCreateLabel = (inputValue: string) => `Criar "${inputValue}"`;

  const moduleTypeValue = watch('moduleType');

  const handleModuleTypeChange = (newValue: unknown) => {
    setValue('moduleType', newValue as Option | null);
  };

  const handleCreateModuleType = async (inputValue: string) => {
    setModuleTypeIsLoading(true);
    const createConfirm = window.confirm(
      `Você deseja criar um novo tipo de módulo: ${inputValue}`
    );
    if (createConfirm) {
      try {
        const response = await api.post('/createRateType', {
          type: inputValue,
        });
        const formattedRateTypes = {
          label: response.data.data.type,
          value: response.data.data.id,
        };
        setAllRateTypes((prev) => [...prev, formattedRateTypes]);
        setValue('moduleType', formattedRateTypes);
      } catch (error) {
        alert('Algo deu errado');
        console.log(error);
      } finally {
        setModuleTypeIsLoading(false);
      }
    } else {
      setModuleTypeIsLoading(false);
    }
  };

  const onSubmit = async (data: ModuleRegisterForm) => {
    if (data.moduleType) {
      try {
        await api.post('/createTarifModule', {
          rate_value: data.module,
          rate_types_id: data.moduleType.value,
          month: data.month,
          year: data.year,
        });
        router.push('/tarifario');
      } catch (error) {
        console.error('Erro ao criar módulo tarifário:', error);
      }
    }
  };

  const generateMonthOptions = (): Option[] => {
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
    return months.map((month, index) => ({
      value: (index + 1).toString(),
      label: month,
    }));
  };

  const generateYearOptions = (): Option[] => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2000; year--) {
      years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
  };

  const monthOptions = generateMonthOptions();
  const yearOptions = generateYearOptions();

  return (
    <div className='min-h-screen bg-background'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>
                Novo módulo tarifário
              </h1>
              <p className='text-slate-600 mt-1'>
                Preencha os campos abaixo com as informações do módulo
              </p>
            </div>
            <Button
              variant='outline'
              onClick={() => router.push('/tarifario')}
              className='border-red-500 text-red-500 hover:bg-red-50'>
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <Card className='shadow-sm border border-[var(--border)] max-w-2xl'>
          <CardHeader>
            <CardTitle>Cadastrar módulo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div>
                <Label htmlFor='module'>Valor do módulo</Label>
                <Input
                  id='module'
                  type='text'
                  {...register('module')}
                  className={errors.module ? 'border-red-500' : ''}
                />
                {errors.module && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.module.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor='moduleType'>Tipo de módulo</Label>
                <CreatableSelect
                  id='moduleType'
                  name='moduleType'
                  options={allRateTypes}
                  value={moduleTypeValue}
                  onChange={handleModuleTypeChange}
                  placeholder='Selecione ou crie um tipo'
                  formatCreateLabel={customCreateLabel}
                  isClearable
                  onCreateOption={handleCreateModuleType}
                  isDisabled={moduleTypeIsLoading}
                  isLoading={moduleTypeIsLoading}
                  className='react-select'
                />
                {errors.moduleType && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.moduleType.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='month'>Mês</Label>
                  <select
                    id='month'
                    {...register('month')}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value=''>Selecione o mês</option>
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.month && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.month.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor='year'>Ano</Label>
                  <select
                    id='year'
                    {...register('year')}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value=''>Selecione o ano</option>
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className='text-red-500 text-sm mt-1'>
                      {errors.year.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type='submit'
                disabled={!isValid}
                className='bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white disabled:opacity-50'>
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
