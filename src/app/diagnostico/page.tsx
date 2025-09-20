'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/search/search-input';
import { Download, X, FileText } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import type { SingleValue } from 'react-select';
const Select = dynamic(() => import('react-select'), { ssr: false });
import * as yup from 'yup';
import api, { getArqui } from '@/services/api';
import type { CitysData } from '@/lib/types';

interface Option {
  value: string;
  label: string;
}

interface Diagnostics {
  receitas: string;
  mediaMensalReceita: string;
  despesas: string;
  mediaMensalDespesa: string;
  saldo: string;
  saldoMes: string;
  ilumPublica: { data: string; valor: string }[];
  totalCompanhiaEner: string;
  mediaMensal: string;
  informacoesManutencao: {
    totalManutencao: string;
    mediaManutencao?: string;
  };
}

interface AllDiagnostics {
  data: {
    id: string;
    name: string;
    year: string;
    created_at: string;
  }[];
}

interface diagnosticsForm {
  year: Option | null;
  codMun: Option | null;
  cpf_cnpj: string;
}

const schema = yup.object().shape({
  year: yup.mixed().nullable().required('Esse campo é obrigatório'),
  codMun: yup.mixed().nullable().required('Esse campo é obrigatório'),
  cpf_cnpj: yup.string(),
}) as any;

export default function Diagnostics() {
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosticMessage, setDiagnosticMessage] = useState<string | null>(
    null
  );
  const [searchDiagnostics, setSearchDiagnostics] = useState('');
  const [munOptions, setMunOptions] = useState<Option[] | null>(null);
  const [diagnosticHistory, setDiagnosticHistory] =
    useState<AllDiagnostics | null>(null);

  const generateYearOptions = (startYear: number): Option[] => {
    const currentYear = new Date().getFullYear();
    const yearOptions: Option[] = [];
    for (let year = currentYear; year >= startYear; year--) {
      yearOptions.push({ value: year.toString(), label: year.toString() });
    }
    return yearOptions;
  };

  const yearOptions = generateYearOptions(2000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/municipiosCe');
        const formattedResponse = response.data.map((mun: CitysData) => ({
          value: mun.cod_mun,
          label: mun.name,
        }));
        setMunOptions(formattedResponse);
        const response2 = await api.post('/getAllDiagnostico');
        setDiagnosticHistory(response2.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<diagnosticsForm>({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      year: null,
      codMun: null,
    },
  });

  const yearValue = watch('year');
  const codMunValue = watch('codMun');

  const handleYearChange = (option: unknown) => {
    setValue('year', option as Option | null);
  };

  const handleCodMunChange = (option: unknown) => {
    setValue('codMun', option as Option | null);
  };

  const [data, setData] = useState<diagnosticsForm | null>(null);

  const onSubmit = async (data: diagnosticsForm) => {
    let cpf_cnpj = data.cpf_cnpj !== '' ? data.cpf_cnpj : undefined;
    if (cpf_cnpj !== undefined) {
      cpf_cnpj = cpf_cnpj
        .replaceAll('/', '')
        .replaceAll('.', '')
        .replaceAll(',', '')
        .replaceAll('-', '')
        .replaceAll(' ', '')
        .replaceAll('\\', '')
        .replaceAll('_', '')
        .replaceAll(`'`, '')
        .replaceAll('"', '')
        .replaceAll('(', '')
        .replaceAll(')', '')
        .replaceAll('~', '');
    }
    if (data.year && data.codMun) {
      setLoading(true);
      setData(data);
      try {
        const response = await api.post('/analiseDiagnostico', {
          year: data.year.value,
          codMun: data.codMun.value,
          cpf_cnpj: cpf_cnpj,
        });
        setDiagnostics(response.data);
        const now = new Date();
        const date = now.toLocaleDateString('pt-BR');
        const time = now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const extractionMessage = `Dados extraídos em ${date} às ${time}`;
        setDiagnosticMessage(extractionMessage);
      } catch (error) {
        console.error('Erro ao gerar diagnóstico:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const savePDF = async () => {
    if (data) {
      try {
        const response = await api.post('/diagnosticoPdf', {
          year: data.year?.value,
          codMun: data.codMun?.value,
          cpf_cnpj: data.cpf_cnpj !== '' ? data.cpf_cnpj : undefined,
        });
        window.location.href = getArqui(response.data.data.filePath);
      } catch (error) {
        console.error('Erro ao salvar PDF:', error);
      }
    }
  };

  const filteredHistory =
    diagnosticHistory?.data.filter(
      (diag: any) =>
        diag.name.toLowerCase().includes(searchDiagnostics.toLowerCase()) ||
        diag.year.toString().includes(searchDiagnostics)
    ) || [];

  return (
    <div className='min-h-screen bg-background'>
      <div className='p-6'>
        {/* Header Section */}
        <div className='mb-8 animate-fade-in-up'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>
                Painel de diagnósticos
              </h1>
              <p className='text-slate-600 mt-1'>
                Gere e visualize diagnósticos financeiros dos municípios
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <Card
          className='shadow-sm border border-[var(--border)] mb-8 animate-fade-in-up'
          style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Gerar diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit((data) =>
                onSubmit(data as diagnosticsForm)
              )}
              className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <Select
                    id='codMun'
                    name='codMun'
                    options={munOptions || []}
                    value={codMunValue}
                    onChange={handleCodMunChange}
                    placeholder='Município'
                    className='react-select'
                  />
                  {errors.codMun && (
                    <p className='text-red-500 text-sm'>
                      {errors.codMun.message}
                    </p>
                  )}
                </div>
                <div>
                  <Select
                    id='year'
                    name='year'
                    options={yearOptions}
                    value={yearValue}
                    onChange={handleYearChange}
                    placeholder='Ano'
                    className='react-select'
                  />
                  {errors.year && (
                    <p className='text-red-500 text-sm'>
                      {errors.year.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder='CPF/CNPJ da manutenção'
                    type='text'
                    {...register('cpf_cnpj')}
                  />
                </div>
              </div>
              <Button
                type='submit'
                className='bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
                Gerar diagnóstico
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && (
          <div className='flex flex-col items-center justify-center py-16 animate-pulse-slow'>
            <div className='relative'>
              <div className='animate-spin rounded-full h-16 w-16 border-4 border-[var(--blue-9)] border-t-transparent'></div>
              <div
                className='absolute inset-0 rounded-full border-4 border-[var(--blue-10)] border-t-transparent animate-spin'
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1.5s',
                }}></div>
            </div>
            <p className='text-[var(--slate-11)] font-medium mt-4'>
              Gerando diagnóstico...
            </p>
            <p className='text-[var(--slate-10)] text-sm mt-1'>
              Aguarde enquanto processamos os dados
            </p>
          </div>
        )}

        {diagnostics && !loading && (
          <div className='space-y-8'>
            {/* Header with actions */}
            <Card
              className='shadow-sm border border-[var(--border)] animate-fade-in-up'
              style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center'>
                    <FileText className='w-5 h-5 mr-2 text-[var(--blue-9)]' />
                    Diagnóstico gerado
                  </CardTitle>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      onClick={savePDF}
                      className='border-[var(--blue-9)] text-[var(--blue-9)] hover:bg-[var(--blue-1)]'>
                      <Download className='w-4 h-4 mr-2' />
                      Salvar PDF
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setDiagnostics(null)}
                      className='border-red-500 text-red-500 hover:bg-red-50'>
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Arrecadação CIP */}
            <Card
              className='shadow-sm border border-[var(--border)] animate-fade-in-up'
              style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle>Extrato de arrecadação CIP</CardTitle>
              </CardHeader>
              <CardContent>
                <table className='w-full border rounded-md border-[var(--border)]'>
                  <thead className='bg-[var(--slate-2)]'>
                    <tr>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'></th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Valor total
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Média mensal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='border-b border-[var(--border)]'>
                      <td className='py-3 px-4 font-medium'>Receitas</td>
                      <td className='py-3 px-4'>R$ {diagnostics.receitas}</td>
                      <td className='py-3 px-4'>
                        R$ {diagnostics.mediaMensalReceita}
                      </td>
                    </tr>
                    <tr className='border-b border-[var(--border)]'>
                      <td className='py-3 px-4 font-medium'>Despesas</td>
                      <td className='py-3 px-4'>R$ {diagnostics.despesas}</td>
                      <td className='py-3 px-4'>
                        R$ {diagnostics.mediaMensalDespesa}
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3 px-4 font-medium'>Saldo total</td>
                      <td className='py-3 px-4'>R$ {diagnostics.saldo}</td>
                      <td className='py-3 px-4'></td>
                    </tr>
                    <tr>
                      <td className='py-3 px-4 font-medium'>Saldo mensal</td>
                      <td className='py-3 px-4'>R$ {diagnostics.saldoMes}</td>
                      <td className='py-3 px-4'></td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Pagamentos Iluminação Pública */}
            <Card
              className='shadow-sm border border-[var(--border)] animate-fade-in-up'
              style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Pagamentos da Iluminação Pública</CardTitle>
              </CardHeader>
              <CardContent>
                <table className='w-full border rounded-md border-[var(--border)]'>
                  <thead className='bg-[var(--slate-2)]'>
                    <tr>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Mês/Ano
                      </th>
                      <th className='text-left py-3 px-4 font-medium text-slate-700'>
                        Valor (R$)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnostics.ilumPublica.map((item: any, i: number) => (
                      <tr key={i} className='border-b border-[var(--border)]'>
                        <td className='py-3 px-4'>{item.data}</td>
                        <td className='py-3 px-4'>R$ {item.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Companhia Energética */}
            <Card
              className='shadow-sm border border-[var(--border)] animate-fade-in-up'
              style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle>
                  Pagamentos efetuados para companhia energética
                </CardTitle>
              </CardHeader>
              <CardContent>
                <table className='w-full border rounded-md border-[var(--border)]'>
                  <tbody>
                    <tr className='border-b border-[var(--border)]'>
                      <td className='py-3 px-4 font-medium'>Valor total</td>
                      <td className='py-3 px-4'>
                        R$ {diagnostics.totalCompanhiaEner}
                      </td>
                    </tr>
                    <tr>
                      <td className='py-3 px-4 font-medium'>Valor mensal</td>
                      <td className='py-3 px-4'>
                        R$ {diagnostics.mediaMensal}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Manutenção */}
            {diagnostics.informacoesManutencao.mediaManutencao !==
              undefined && (
              <Card
                className='shadow-sm border border-[var(--border)] animate-fade-in-up'
                style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                  <CardTitle>
                    Pagamentos efetuados para empresa de manutenção da
                    Iluminação Pública
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <table className='w-full border rounded-md border-[var(--border)]'>
                    <tbody>
                      <tr className='border-b border-[var(--border)]'>
                        <td className='py-3 px-4 font-medium'>Valor total</td>
                        <td className='py-3 px-4'>
                          R$ {diagnostics.informacoesManutencao.totalManutencao}
                        </td>
                      </tr>
                      <tr>
                        <td className='py-3 px-4 font-medium'>Valor mensal</td>
                        <td className='py-3 px-4'>
                          R$ {diagnostics.informacoesManutencao.mediaManutencao}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* Message */}
            {diagnosticMessage && (
              <Card
                className='shadow-sm border border-[var(--border)] animate-fade-in-up'
                style={{ animationDelay: '0.7s' }}>
                <CardContent className='py-4'>
                  <p className='text-slate-600'>{diagnosticMessage}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!diagnostics && (
          <Card
            className='shadow-sm border border-[var(--border)] animate-fade-in-up'
            style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='flex items-center'>
                  <FileText className='w-5 h-5 mr-2 text-[var(--blue-9)]' />
                  Histórico de diagnósticos
                </CardTitle>
                <SearchInput
                  placeholder='Busque por um diagnóstico'
                  value={searchDiagnostics}
                  onValueChange={setSearchDiagnostics}
                  onSearch={() => {}}
                />
              </div>
            </CardHeader>
            <CardContent>
              <table className='w-full border rounded-md border-[var(--border)]'>
                <thead className='bg-[var(--slate-2)]'>
                  <tr>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Município
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Ano
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Data que foi gerado
                    </th>
                    <th className='text-left py-3 px-4 font-medium text-slate-700'>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((diag: any, i: number) => (
                    <tr
                      key={i}
                      className='border-b border-[var(--border)] hover:bg-[var(--blue-1)]'>
                      <td className='py-3 px-4'>{diag.name}</td>
                      <td className='py-3 px-4'>{diag.year}</td>
                      <td className='py-3 px-4'>{diag.created_at}</td>
                      <td className='py-3 px-4'>
                        <Button variant='outline' size='sm'>
                          Ver detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredHistory.length === 0 && (
                <div className='text-center py-8 text-muted-foreground'>
                  Nenhum diagnóstico encontrado
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
