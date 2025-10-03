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
    const checkUserRole = async () => {
      const role = await getUserRole();
      if (role !== 'cityManager') {
        redirect('/');
      }
    };
    checkUserRole();
  }, []);

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
    <div className='container mx-auto p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Painel do Gestor Municipal</h1>

        {!loading && !error && cities.length > 0 && (
          <div className='flex items-center gap-4'>
            <Label htmlFor='city-select'>Selecione uma cidade:</Label>
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

      <Card className='p-4'>
        {loading ? (
          <p className='text-center py-8'>Carregando cidades e dashboards...</p>
        ) : error ? (
          <p className='text-center text-red-500 py-8'>{error}</p>
        ) : (
          <div className='min-h-[600px] relative'>
            {selectedCity && (
              <>
                {selectedCity.dashboards.length > 0 && selectedDashboard ? (
                  <div className='w-full h-full absolute'>
                    <iframe
                      src={selectedDashboard.dashboard_url}
                      title={selectedDashboard.name}
                      className='w-full h-full border-0'
                      loading='lazy'
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <p className='text-center py-8'>
                    Não há dashboards disponíveis para {selectedCity.city_name}.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
