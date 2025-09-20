'use client';

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
import { CityManager } from '@/lib/cityManager';
import { useCities } from '@/hooks/useCities';

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
    max: 200, // Carregar mais cidades para ter opções suficientes
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
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-hidden'>
        <DialogHeader>
          <DialogTitle>Editar Cidades - {manager.name}</DialogTitle>
          <DialogDescription>
            Gerencie as cidades associadas a este gestor municipal
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Barra de busca */}
          <div className='w-full max-w-md'>
            <SearchInput
              placeholder='Buscar cidades...'
              value={searchTerm}
              onValueChange={(value: string) => setSearchTerm(value)}
              onSearch={() => {}}
            />
          </div>

          {citiesLoading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='text-gray-600'>Carregando cidades...</div>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-96 overflow-hidden'>
              {/* Cidades do Gestor */}
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>
                    Cidades do Gestor ({managerCities.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 max-h-80 overflow-y-auto'>
                  {managerCities.length === 0 ? (
                    <div className='text-center py-8 text-gray-500 italic'>
                      Nenhuma cidade encontrada
                    </div>
                  ) : (
                    managerCities.map((city) => (
                      <div
                        key={city.id}
                        className='flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors'>
                        <div>
                          <div className='font-medium text-gray-900'>
                            {city.name}
                          </div>
                          <div className='text-sm text-gray-600'>{city.uf}</div>
                        </div>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => handleRemoveCity(city.id)}
                          disabled={loading}>
                          Remover
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Cidades Disponíveis */}
              <Card>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg'>Cidades Disponíveis</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 max-h-80 overflow-y-auto'>
                  {availableCities.length === 0 ? (
                    <div className='text-center py-8 text-gray-500 italic'>
                      Nenhuma cidade disponível encontrada
                    </div>
                  ) : (
                    availableCities.map((city) => (
                      <div
                        key={city.id}
                        className='flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors'>
                        <div>
                          <div className='font-medium text-gray-900'>
                            {city.name}
                          </div>
                          <div className='text-sm text-gray-600'>{city.uf}</div>
                        </div>
                        <Button
                          variant='default'
                          size='sm'
                          onClick={() => handleAddCity(city.id)}
                          disabled={loading}>
                          Adicionar
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleUpdateAllCities} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCitiesModal;
