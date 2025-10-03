'use client';

import { useEffect, useState } from 'react';
import { useDashboardLinks } from '@/hooks/useDashboardLinks';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useEffect as useEffectStyle } from 'react';
const useGlobalStyles = () => {
  useEffectStyle(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
};
import { Dashboard, City } from '@/lib/types';
import { HeaderManager } from '@/components/HeaderManager';

export default function CityManagerPage() {
  useGlobalStyles(); // Aplica os estilos globais
  const { cities, loading, error } = useDashboardLinks();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(
    null
  );

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
      if (cities[0].dashboards.length > 0) {
        setSelectedDashboard(cities[0].dashboards[0]);
      }
    }
  }, [cities, selectedCity]);

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => c.city_id === parseInt(cityId)) || null;
    setSelectedCity(city);
    if (city && city.dashboards.length > 0) {
      setSelectedDashboard(city.dashboards[0]);
    } else {
      setSelectedDashboard(null);
    }
  };

  return (
    <div className='w-full h-screen flex flex-col'>
      <div className='absolute w-full top-0 opacity-0 hover:opacity-100 transition-opacity duration-300 z-50'>
        <HeaderManager />
        <div className='absolute top-20 right-4 bg-transparent hover:bg-white/80 backdrop-blur-sm p-4 rounded-lg transition-all duration-300'>
          {!loading && !error && cities.length > 0 && (
            <div className='flex items-center gap-2'>
              <Label htmlFor='city-select' className='text-sm font-medium'>
                Cidade:
              </Label>
              <Select
                value={selectedCity?.city_id.toString()}
                onValueChange={handleCityChange}>
                <SelectTrigger className='w-[280px]'>
                  <SelectValue placeholder='Selecione uma cidade' />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem
                      key={city.city_id}
                      value={city.city_id.toString()}>
                      {city.city_name} - {city.uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 relative overflow-hidden -mt-[10px] -ml-[10px]'>
        {loading ? (
          <p className='text-center py-8'>Carregando cidades e dashboards...</p>
        ) : error ? (
          <p className='text-center text-red-500 py-8'>{error}</p>
        ) : (
          <div className='w-full h-full'>
            {selectedCity && (
              <>
                {selectedCity.dashboards.length > 0 && selectedDashboard ? (
                  <iframe
                    src={selectedDashboard.dashboard_url}
                    title={selectedDashboard.name}
                    className='w-[100%] h-[108%] border-0'
                    loading='lazy'
                    allowFullScreen
                    frameBorder='0'
                  />
                ) : (
                  <p className='text-center py-8'>
                    Não há dashboards disponíveis para {selectedCity.city_name}.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
