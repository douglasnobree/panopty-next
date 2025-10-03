'use client';

import { useEffect, useState } from 'react';
import { useDashboardLinks } from '@/hooks/useDashboardLinks';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUserRole } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Dashboard, City } from '@/lib/types';

export default function CityManagerPage() {
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
      <div className='flex justify-end items-center p-2 bg-white/80 backdrop-blur-sm absolute top-0 right-0 z-10'>
        {!loading && !error && cities.length > 0 && (
          <div className='flex items-center gap-2'>
            <Label htmlFor='city-select' className='text-sm'>
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

      <div className='flex-1 relative'>
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
                    className='w-full h-full border-0'
                    loading='lazy'
                    allowFullScreen
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
