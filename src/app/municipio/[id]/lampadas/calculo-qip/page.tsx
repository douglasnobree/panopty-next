'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, X, Plus } from 'lucide-react';
import api, { getArqui } from '@/services/api';
import { useRouter, useParams } from 'next/navigation';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { type ChangeEvent, useEffect, useState } from 'react';

type LampAuxType = number | 0;
type LampType = {
  descricao: string;
  quantidade: LampAuxType;
  potencia: LampAuxType;
  perdas: LampAuxType;
  potenciaTotal: number;
  consumoMes: number;
};

interface DescriptionRegisterForm {
  descricao: string;
  descricaoType: { label: string; value: string } | null;
}

const PowerCalculation = () => {
  const router = useRouter();
  const params = useParams();
  const cityId = params.id as string;
  const [countie, setCountie] = useState<any>(null);
  const [days, setDays] = useState<number | null>(null);
  const [allTariffModules, setAllTariffModules] = useState<
    { label: string; value: string }[]
  >([]);
  const [tariffValue, setTariffValue] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [lamps, setLamps] = useState<LampType[]>([
    {
      descricao: '',
      quantidade: 0,
      potencia: 0,
      perdas: 0,
      potenciaTotal: 0,
      consumoMes: 0,
    },
  ]);
  const [allDescription, setAllDescription] = useState<
    { label: string; value: string }[]
  >([]);
  const [moduleTypeIsLoading, setModuleTypeIsLoading] = useState(false);

  const handleTariffChange = (
    option: { label: string; value: string } | null
  ) => {
    if (option?.label) {
      const date = extractMonthYear(option.label);
      if (date) {
        setDays(getDaysInMonth(date[0], date[1]));
      }
    }
    setTariffValue(option);
  };

  const schema = yup.object({
    descricao: yup.string().required('Esse campo é obrigatório'),
    descricaoType: yup
      .object()
      .nullable()
      .shape({
        label: yup.string(),
        value: yup.string(),
      })
      .required('Esse campo é obrigatório'),
  });

  const extractMonthYear = (label: string): [number, number] | undefined => {
    const match = label.match(/(\d{2})\/(\d{4})/);
    if (match) {
      const month = Number.parseInt(match[1], 10);
      const year = Number.parseInt(match[2], 10);
      return [month, year];
    }
    return undefined;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleDescricaoChange = (
    option: { label: string; value: string } | null,
    index: number
  ) => {
    const updatedLamps = [...lamps];
    updatedLamps[index].descricao = option?.label || '';
    setLamps(updatedLamps);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [tariffModules, city, allDescription] = await Promise.all([
        api.post('/getAllTarifModule'),
        api.get(`/showMunicipalities/${cityId}`),
        api.post('/getAllLampsDesc'),
      ]);
      const formattedTariffModules = tariffModules.data.data.map(
        (tariff: any) => ({
          label: `${tariff.rate_value} - ${tariff.rate_type.type} (${tariff.month}/${tariff.year})`,
          value: tariff.id.toString(),
        })
      );
      const formattedDescription = allDescription.data.map(
        (description: any) => ({
          label: description.description,
          value: description.id.toString(),
        })
      );
      setAllDescription(formattedDescription);
      setCountie(city.data.data);
      setAllTariffModules(formattedTariffModules);
    };
    fetchData();
  }, [cityId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<DescriptionRegisterForm>({
    mode: 'all',
    defaultValues: {
      descricao: '',
      descricaoType: null,
    },
  });

  const descricaoeValue = watch('descricaoType');

  const addLamp = () => {
    setLamps([
      ...lamps,
      {
        descricao: '',
        quantidade: 0,
        potencia: 0,
        perdas: 0,
        potenciaTotal: 0,
        consumoMes: 0,
      },
    ]);
  };

  const t = async () => {
    const formattedLamps = lamps.map((lamp) => ({
      descricao: lamp.descricao,
      potencia: lamp.potencia,
      perdas: lamp.perdas.toFixed(2).replace('.', ','),
      qtd: lamp.quantidade.toString(),
      potenciaTotal: lamp.potenciaTotal.toFixed(2).replace('.', ','),
      consumoMes: lamp.consumoMes.toLocaleString(),
    }));

    const dataToSend = {
      lampadas: formattedLamps,
      city_id: cityId,
      tarif_modules_id: tariffValue?.value,
    };

    if (dataToSend) {
      const response = await api.post('/gerarPdfLamps', {
        lampadas: dataToSend.lampadas,
        city_id: dataToSend.city_id,
        tarif_modules_id: dataToSend.tarif_modules_id,
      });
      window.location.href = getArqui(response.data.data.filePath);
    }
  };

  const handleCreateDescricao = async (inputValue: string) => {
    setModuleTypeIsLoading(true);
    const createConfirm = window.confirm(
      `Você deseja criar uma nova Descrição: ${inputValue}`
    );
    if (createConfirm) {
      await api
        .post('/createLampspDes', {
          descricao: inputValue,
        })
        .then((response) => {
          const formattedRateTypes = {
            label: response.data.descricao,
            value: response.data.data.id.toString(),
          };
          setAllDescription((prev) => [...prev, formattedRateTypes]);
          setValue('descricaoType', formattedRateTypes);
        })
        .catch((error) => {
          alert('Algo deu errado');
          console.log(error);
        })
        .finally(() => {
          setModuleTypeIsLoading(false);
        });
    } else {
      setModuleTypeIsLoading(false);
    }
  };

  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
    field: 'descricao' | 'quantidade' | 'potencia' | 'perdas'
  ) => {
    const updatedLamps = [...lamps];
    if (field === 'descricao') {
      updatedLamps[index][field] = event.target.value || '';
    } else {
      updatedLamps[index][field] = Number(event.target.value);
    }
    const qnt =
      typeof updatedLamps[index].quantidade === 'number'
        ? updatedLamps[index].quantidade
        : 0;
    const pwr =
      typeof updatedLamps[index].potencia === 'number'
        ? updatedLamps[index].potencia
        : 0;
    const losses =
      typeof updatedLamps[index].perdas === 'number'
        ? updatedLamps[index].perdas
        : 0;
    updatedLamps[index].potenciaTotal = (qnt * (pwr - losses)) / 1000;
    updatedLamps[index].consumoMes = Math.round(
      updatedLamps[index].potenciaTotal * 12 * (days || 0)
    );
    setLamps(updatedLamps);
  };

  const removeLamp = (index: number) => {
    const updatedLamps = lamps.filter((_, i) => i !== index);
    setLamps(updatedLamps);
  };

  const customCreateLabel = (inputValue: string) => `Criar "${inputValue}"`;

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
                  Cálculo de QIP
                </CardTitle>
              </div>
              <Button
                onClick={t}
                className='flex items-center gap-2 bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
                <Download className='h-4 w-4' />
                Calcular
              </Button>
            </div>
            {countie && (
              <p className='text-[var(--slate-11)] mt-2'>
                {countie?.name} - {countie?.uf}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-2 text-[var(--slate-12)]'>
                  Módulo tarifário
                </label>
                <Select
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
          </CardContent>
        </Card>

        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-[var(--slate-12)]'>
              Configuração das Lâmpadas
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <UITable>
              <TableHeader>
                <TableRow className='border-b border-[var(--border)]'>
                  <TableHead className='text-[var(--slate-12)]'></TableHead>
                  <TableHead className='text-[var(--slate-12)]'>
                    DESCRIÇÃO
                  </TableHead>
                  <TableHead className='text-[var(--slate-12)]'>
                    QUANTIDADE
                  </TableHead>
                  <TableHead className='text-[var(--slate-12)]'>
                    POTÊNCIA UNIT.
                  </TableHead>
                  <TableHead className='text-[var(--slate-12)]'>
                    PERDAS
                  </TableHead>
                  <TableHead className='text-[var(--slate-12)]'>
                    POTÊNCIA TOTAL (KW)
                  </TableHead>
                  <TableHead className='text-[var(--slate-12)]'>
                    CONSUMO (kWh/mês)
                  </TableHead>
                  <TableHead className='text-[var(--slate-12)]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lamps.map((lamp, i) => {
                  const qnt =
                    typeof lamp.quantidade === 'undefined'
                      ? 0
                      : lamp.quantidade;
                  const pwr =
                    typeof lamp.potencia === 'undefined' ? 0 : lamp.potencia;
                  const losses =
                    typeof lamp.perdas === 'undefined' ? 0 : lamp.perdas;
                  const totalPower = (qnt * (pwr - losses)) / 1000;
                  const totalPowerFormatted = Number.parseFloat(
                    totalPower.toFixed(2)
                  );
                  const consumoMes = Math.round(totalPower * 12 * (days || 0));
                  return (
                    <TableRow
                      key={i}
                      className='border-b border-[var(--border)]'>
                      <TableCell className='text-[var(--slate-12)]'>
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <CreatableSelect
                          options={allDescription}
                          value={
                            lamp.descricao
                              ? {
                                  label: lamp.descricao,
                                  value: lamp.descricao,
                                }
                              : null
                          }
                          onChange={(option) =>
                            handleDescricaoChange(option, i)
                          }
                          placeholder='Descrição'
                          formatCreateLabel={customCreateLabel}
                          isClearable
                          onCreateOption={handleCreateDescricao}
                          isDisabled={moduleTypeIsLoading}
                          isLoading={moduleTypeIsLoading}
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
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          value={lamp.quantidade}
                          onChange={(e) =>
                            handleInputChange(i, e, 'quantidade')
                          }
                          placeholder='Nº de lâmpadas'
                          className='border-[var(--border)]'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          value={lamp.potencia}
                          onChange={(e) => handleInputChange(i, e, 'potencia')}
                          placeholder='Potência'
                          className='border-[var(--border)]'
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          value={lamp.perdas}
                          onChange={(e) => handleInputChange(i, e, 'perdas')}
                          placeholder='Perdas'
                          className='border-[var(--border)]'
                        />
                      </TableCell>
                      <TableCell className='text-[var(--slate-12)]'>
                        {totalPowerFormatted}
                      </TableCell>
                      <TableCell className='text-[var(--slate-12)]'>
                        {consumoMes}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='ghost'
                          onClick={() => removeLamp(i)}
                          className='text-red-600 hover:text-red-700 hover:bg-red-50'>
                          <X className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </UITable>
          </CardContent>
        </Card>

        <Card className='shadow-sm border border-[var(--border)]'>
          <CardContent className='pt-6'>
            <Button
              onClick={addLamp}
              className='w-full bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Nova Lâmpada
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PowerCalculation;
