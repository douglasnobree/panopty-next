'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/components/AuthContext';
import { useCities } from '@/hooks/useCities';
import api from '@/services/api';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface City {
  id: number;
  name: string;
  uf?: string;
  state?: string;
}

interface FormData {
  name: string;
  email: string;
  cpf: string;
  city_id: string;
}

// Schema de validação com Yup
const validationSchema = yup.object().shape({
  name: yup.string().required('Campo nome é obrigatório'),
  email: yup
    .string()
    .required('Campo email é obrigatório')
    .email('Email deve ter um formato válido'),
  cpf: yup
    .string()
    .required('Campo CPF é obrigatório')
    .test('cpf-length', 'CPF deve conter 11 dígitos', (value) => {
      if (!value) return false;
      const cpfNumbers = value.replace(/\D/g, '');
      return cpfNumbers.length === 11;
    }),
  city_id: yup
    .string()
    .required('Selecione pelo menos um município')
    .test('city-selection', 'Selecione pelo menos um município', (value) => {
      return Boolean(value && value.length > 0);
    }),
});


function CreateManager() {
  const { userRole } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // Inicializar React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      cpf: '',
      city_id: '',
    },
  });

  // Watch para observar mudanças no formulário
  const watchedCityId = watch('city_id');

  // Usar o hook customizado para buscar cidades
  const {
    cities,
    loading: loadingCities,
    error: citiesError,
    searchTerm,
    pagination,
    loadPage,
    searchCities,
    clearSearch,
  } = useCities({ max: 20, autoFetch: true }); // 20 cidades por página

  // Mostrar erro de carregamento das cidades, se houver
  useEffect(() => {
    if (citiesError) {
      alert(citiesError); // Usar alert por enquanto, ou implementar toast
    }
  }, [citiesError]);

  // Atualizar selectedCities quando watchedCityId mudar
  useEffect(() => {
    if (watchedCityId) {
      const cityIds = watchedCityId.split(',').map(Number).filter(Boolean);
      setSelectedCities(cityIds);
    } else {
      setSelectedCities([]);
    }
  }, [watchedCityId]);

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const cpf = value.replace(/\D/g, '');

    // Aplica a máscara de CPF progressivamente
    if (cpf.length <= 3) {
      return cpf;
    } else if (cpf.length <= 6) {
      return cpf.replace(/(\d{3})(\d{0,3})/, '$1.$2');
    } else if (cpf.length <= 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (cpf.length <= 11) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    }

    // Se tiver mais de 11 dígitos, trunca
    return cpf
      .slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCitySelection = (cityId: number) => {
    setSelectedCities((prev) => {
      const newSelection = prev.includes(cityId)
        ? prev.filter((id) => id !== cityId)
        : [...prev, cityId];

      // Atualizar formulário com os IDs selecionados
      setValue('city_id', newSelection.join(','));

      return newSelection;
    });
  };

  const handleSearch = async () => {
    if (localSearchTerm.trim()) {
      await searchCities(localSearchTerm.trim());
    }
  };

  const handleClearSearch = async () => {
    setLocalSearchTerm('');
    await clearSearch();
  };

  const handlePageChange = async (page: number) => {
    await loadPage(page);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const dataToSend = {
        ...data,
        cpf: data.cpf,
      };

      const response = await api.post('/createManager', dataToSend);

      if (response.data.success) {
        alert('Gestor criado com sucesso!');
        // Resetar formulário
        reset();
        setSelectedCities([]);

        // Redirecionar após sucesso
        setTimeout(() => {
          router.push('/gestores');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erro ao criar gestor:', error);

      if (error.response?.status === 400) {
        const apiErrors = error.response.data;

        if (apiErrors.message) {
          alert(apiErrors.message);
        } else {
          // Tratar erros de validação do backend se necessário
          alert('Erro de validação. Verifique os dados informados.');
        }
      } else {
        alert('Erro interno do servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='container mx-auto px-4 py-8'>
        <Card className='max-w-4xl mx-auto'>
          <CardHeader>
            <CardTitle className='text-2xl font-bold'>
              Criar Novo Gestor
            </CardTitle>
            <p className='text-muted-foreground'>
              Preencha os dados abaixo para criar um novo gestor municipal
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Dados Pessoais */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Dados Pessoais</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nome Completo</Label>
                    <Input
                      id='name'
                      placeholder='Digite o nome completo'
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className='text-sm text-red-500'>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      placeholder='exemplo@email.com'
                      type='email'
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className='text-sm text-red-500'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='cpf'>CPF</Label>
                  <Controller
                    name='cpf'
                    control={control}
                    render={({ field }) => (
                      <Input
                        id='cpf'
                        placeholder='000.000.000-00'
                        value={field.value}
                        onChange={(e) => {
                          const formattedCPF = formatCPF(e.target.value);
                          field.onChange(formattedCPF);
                        }}
                        className={errors.cpf ? 'border-red-500' : ''}
                        maxLength={14}
                      />
                    )}
                  />
                  {errors.cpf && (
                    <p className='text-sm text-red-500'>{errors.cpf.message}</p>
                  )}
                </div>
              </div>

              {/* Municípios a Gerenciar */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>
                  Municípios a Gerenciar
                  {selectedCities.length > 0 && (
                    <span className='text-blue-600 text-sm font-normal ml-2'>
                      ({selectedCities.length} selecionado
                      {selectedCities.length !== 1 ? 's' : ''})
                    </span>
                  )}
                  {errors.city_id && (
                    <span className='text-red-600 text-sm font-normal ml-2'>
                      {errors.city_id.message}
                    </span>
                  )}
                </h3>

                {/* Busca */}
                <div className='flex gap-2'>
                  <Input
                    placeholder='Digite o nome do município ou estado...'
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    onClick={handleSearch}
                    disabled={loadingCities}
                    variant='outline'>
                    {loadingCities ? 'Buscando...' : 'Buscar'}
                  </Button>
                  {(localSearchTerm || searchTerm) && (
                    <Button
                      type='button'
                      onClick={handleClearSearch}
                      disabled={loadingCities}
                      variant='outline'>
                      Limpar
                    </Button>
                  )}
                </div>

                {/* Lista de Municípios */}
                <div className='border rounded-lg p-4 max-h-96 overflow-y-auto'>
                  {loadingCities ? (
                    <p>Carregando municípios...</p>
                  ) : cities.length === 0 ? (
                    <p>Nenhum município encontrado.</p>
                  ) : (
                    <>
                      {cities.map((city) => (
                        <div
                          key={city.id}
                          className='flex items-center space-x-2 py-1'>
                          <Checkbox
                            id={`city-${city.id}`}
                            checked={selectedCities.includes(city.id)}
                            onCheckedChange={() => handleCitySelection(city.id)}
                          />
                          <Label
                            htmlFor={`city-${city.id}`}
                            className='text-sm'>
                            {city.name} - {city.uf || city.state}
                          </Label>
                        </div>
                      ))}

                      {/* Paginação */}
                      {pagination && (
                        <div className='mt-4 flex items-center justify-between'>
                          <p className='text-sm text-muted-foreground'>
                            Mostrando {pagination.from} - {pagination.to} de{' '}
                            {pagination.total} municípios
                            {searchTerm && (
                              <span> | Busca: "{searchTerm}"</span>
                            )}
                          </p>
                          <div className='flex gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handlePageChange(1)}
                              disabled={
                                pagination.current_page === 1 || loadingCities
                              }>
                              Primeira
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handlePageChange(pagination.current_page - 1)
                              }
                              disabled={
                                pagination.current_page === 1 || loadingCities
                              }>
                              Anterior
                            </Button>
                            <span className='px-2 py-1 text-sm'>
                              Página {pagination.current_page} de{' '}
                              {pagination.last_page}
                            </span>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handlePageChange(pagination.current_page + 1)
                              }
                              disabled={
                                pagination.current_page ===
                                  pagination.last_page || loadingCities
                              }>
                              Próxima
                            </Button>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handlePageChange(pagination.last_page)
                              }
                              disabled={
                                pagination.current_page ===
                                  pagination.last_page || loadingCities
                              }>
                              Última
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Botões */}
              <div className='flex gap-4 justify-end'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => router.push('/gestores')}
                  disabled={loading}>
                  Cancelar
                </Button>
                <Button type='submit' disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Gestor'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default CreateManager;
