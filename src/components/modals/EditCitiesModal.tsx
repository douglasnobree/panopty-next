'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/search/search-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCityManagers } from '@/hooks/useCityManagers';
import type { CityManager } from '@/lib/cityManager';
import { useCities } from '@/hooks/useCities';
import { MapPin, Plus, X, Search, Building2 } from 'lucide-react';

interface City {
  id: number;
  name: string;
  uf: string;
}

interface EditCitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  manager: CityManager;
  onSuccess: () => void;
}

const EditCitiesModal: React.FC<EditCitiesModalProps> = ({
  isOpen,
  onClose,
  manager,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>([]);

  const {
    addCityManagerCities,
    removeCityManagerCities,
    updateCityManagerCities,
  } = useCityManagers({
    autoFetch: false,
  });

  const {
    cities: allCities,
    loading: citiesLoading,
    searchTerm,
    setSearchTerm,
  } = useCities({
    autoFetch: isOpen,
    max: 200,
  });

  // Inicializar cidades selecionadas
  useEffect(() => {
    if (manager && isOpen) {
      // Garantir que estamos pegando os IDs corretos das cidades do manager
      const cityIds =
        manager.cities
          ?.map((city: any) => {
            // Tentar diferentes formatos de ID
            return city.id || city.city_id || city.municipality_id;
          })
          .filter(Boolean) || [];

      setSelectedCityIds(cityIds);
      setSearchTerm(''); // Reset search when modal opens
    }
  }, [manager, isOpen, setSearchTerm]);

  // Filtrar cidades baseado na busca (o hook já filtra na API)
  const filteredCities = allCities;

  // Separar cidades em grupos baseado nas cidades já selecionadas do gestor
  const managerCities = allCities.filter((city) =>
    selectedCityIds.includes(city.id)
  );

  const availableCities = allCities.filter(
    (city) => !selectedCityIds.includes(city.id)
  );

  const handleAddCity = async (cityId: number) => {
    setLoading(true);
    const result = await addCityManagerCities(manager.id, [cityId]);

    if (result.success) {
      setSelectedCityIds((prev) => [...prev, cityId]);
      console.log('Cidade adicionada com sucesso!');
      onSuccess();
    } else {
      console.error(result.error || 'Erro ao adicionar cidade');
    }

    setLoading(false);
  };

  const handleRemoveCity = async (cityId: number) => {
    setLoading(true);
    const result = await removeCityManagerCities(manager.id, [cityId]);

    if (result.success) {
      setSelectedCityIds((prev) => prev.filter((id) => id !== cityId));
      console.log('Cidade removida com sucesso!');
      onSuccess();
    } else {
      console.error(result.error || 'Erro ao remover cidade');
    }

    setLoading(false);
  };

  const handleUpdateAllCities = async () => {
    setLoading(true);
    const result = await updateCityManagerCities(manager.id, selectedCityIds);

    if (result.success) {
      console.log('Cidades atualizadas com sucesso!');
      onSuccess();
      onClose();
    } else {
      console.error(result.error || 'Erro ao atualizar cidades');
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='!max-w-none w-[90vw] max-h-[90vh] overflow-hidden'>
        <DialogHeader className='space-y-3 pb-6'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-[var(--blue-3)] rounded-lg'>
              <Building2 className='h-5 w-5 text-[var(--blue-9)]' />
            </div>
            <div>
              <DialogTitle className='text-xl font-semibold'>
                Gerenciar Cidades
              </DialogTitle>
              <DialogDescription className='text-base'>
                {manager.name} • Adicione ou remova cidades da gestão
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Barra de busca */}
          <div className='p-4 bg-gray-50 rounded-xl border'>
            <SearchInput
              placeholder='Buscar cidades por nome ou estado...'
              value={searchTerm}
              onValueChange={(value: string) => setSearchTerm(value)}
              onSearch={() => {}}
              className='border-0 bg-transparent focus:ring-0 shadow-none'
            />
          </div>

          {citiesLoading ? (
            <div className='flex flex-col items-center justify-center py-16 space-y-3'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--blue-9)]'></div>
              <div className='text-gray-600 font-medium'>
                Carregando cidades...
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
              {/* Cidades do Gestor */}
              <Card className='border-2 border-[var(--blue-7)] bg-[var(--blue-1)]/30'>
                <CardHeader className='pb-4 bg-gradient-to-r from-[var(--blue-9)] to-[var(--blue-10)] text-white rounded-t-lg px-6  -mt-6 mb-0'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                      <MapPin className='h-5 w-5' />
                      Cidades Gerenciadas
                    </CardTitle>
                    <Badge
                      variant='secondary'
                      className='bg-white/20 text-white border-white/30'>
                      {managerCities.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='max-h-80 overflow-y-auto'>
                    {managerCities.length === 0 ? (
                      <div className='flex flex-col items-center justify-center py-12 px-6 text-center'>
                        <MapPin className='h-12 w-12 text-gray-300 mb-3' />
                        <div className='text-gray-500 font-medium'>
                          Nenhuma cidade gerenciada
                        </div>
                        <div className='text-sm text-gray-400 mt-1'>
                          Adicione cidades da lista ao lado
                        </div>
                      </div>
                    ) : (
                      <div className='space-y-1 p-1'>
                        {managerCities.map((city) => (
                          <div
                            key={city.id}
                            className='flex items-center justify-between p-4 mx-2 my-1 bg-white border border-blue-100 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200 group'>
                            <div className='flex items-center gap-3'>
                              <div className='p-2 bg-[var(--blue-3)] rounded-lg group-hover:bg-[var(--blue-4)] transition-colors'>
                                <MapPin className='h-4 w-4 text-[var(--blue-9)]' />
                              </div>
                              <div>
                                <div className='font-semibold text-gray-900'>
                                  {city.name}
                                </div>
                                <div className='text-sm text-gray-500 font-medium'>
                                  {city.uf}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleRemoveCity(city.id)}
                              disabled={loading}
                              className='border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700'>
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cidades Disponíveis */}
              <Card className='border-2 border-[var(--green-3)] bg-[var(--green-3)]/30'>
                <CardHeader className='pb-4 bg-gradient-to-r from-[var(--green-12)] to-[var(--green-12)] text-white rounded-t-lg px-6  -mt-6 mb-0'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                      <Plus className='h-5 w-5' />
                      Cidades Disponíveis
                    </CardTitle>
                    <Badge
                      variant='secondary'
                      className='bg-white/20 text-white border-white/30'>
                      {availableCities.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='max-h-80 overflow-y-auto'>
                    {availableCities.length === 0 ? (
                      <div className='flex flex-col items-center justify-center py-12 px-6 text-center'>
                        <Search className='h-12 w-12 text-gray-300 mb-3' />
                        <div className='text-gray-500 font-medium'>
                          Nenhuma cidade encontrada
                        </div>
                        <div className='text-sm text-gray-400 mt-1'>
                          Tente ajustar sua busca
                        </div>
                      </div>
                    ) : (
                      <div className='space-y-1 p-1'>
                        {availableCities.map((city) => (
                          <div
                            key={city.id}
                            className='flex items-center justify-between p-4 mx-2 my-1 bg-white border border-green-100 rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200 group'>
                            <div className='flex items-center gap-3'>
                              <div className='p-2 bg-[var(--green-3)] rounded-lg group-hover:bg-green-200 transition-colors'>
                                <MapPin className='h-4 w-4 text-[var(--green-12)]' />
                              </div>
                              <div>
                                <div className='font-semibold text-gray-900'>
                                  {city.name}
                                </div>
                                <div className='text-sm text-gray-500 font-medium'>
                                  {city.uf}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleAddCity(city.id)}
                              disabled={loading}
                              className='border-[var(--green-12)] text-[var(--green-12)] hover:bg-[var(--green-3)] hover:border-[var(--green-12)] hover:text-[var(--green-12)]'>
                              <Plus className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className='pt-6 border-t bg-gray-50/50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg'>
          <div className='flex gap-3 w-full sm:w-auto'>
            <Button
              variant='outline'
              onClick={onClose}
              disabled={loading}
              className='flex-1 sm:flex-none'>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateAllCities}
              disabled={loading}
              className='flex-1 sm:flex-none bg-[var(--blue-9)] hover:bg-[var(--blue-10)]'>
              {loading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCitiesModal;
