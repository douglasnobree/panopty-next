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
import { Logo } from '@/components/ui/logo';

export default function CityManagerPage() {
  useGlobalStyles(); // Aplica os estilos globais
  const { cities, loading, error } = useDashboardLinks();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(
    null
  );
  const [showIframe, setShowIframe] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (cities.length > 0 && !selectedCity) {
      setSelectedCity(cities[0]);
      if (cities[0].dashboards.length > 0) {
        setSelectedDashboard(cities[0].dashboards[0]);
      }
    }
  }, [cities, selectedCity]);

  // Efeito para controlar o loading do iframe
  useEffect(() => {
    if (selectedDashboard) {
      setShowIframe(false);
      const timer = setTimeout(() => {
        setShowIframe(true);
      }, 5500);

      return () => clearTimeout(timer);
    }
  }, [selectedDashboard]);

  const handleCityChange = (cityId: string) => {
    const city = cities.find((c) => c.city_id === parseInt(cityId)) || null;
    setSelectedCity(city);
    if (city && city.dashboards.length > 0) {
      setSelectedDashboard(city.dashboards[0]);
    } else {
      setSelectedDashboard(null);
    }
  };

  const handleIndicatorClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleIndicatorMouseEnter = () => {
    const timer = setTimeout(() => {
      setMenuOpen(true);
    }, 300);
    setHoverTimer(timer);
  };

  const handleIndicatorMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  const handleMenuMouseLeave = () => {
    setMenuOpen(false);
  };

  return (
    <div className='w-full h-screen flex flex-col'>
      {/* Indicador centralizado no topo */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 z-50'>
        <div
          className='cursor-pointer opacity-0 animate-fade-in-delayed hover:opacity-100 transition-opacity duration-300'
          onClick={handleIndicatorClick}
          onMouseEnter={handleIndicatorMouseEnter}
          onMouseLeave={handleIndicatorMouseLeave}>
          <div className='flex flex-col items-center gap-1 pt-2'>
            {/* Linha sutil indicando para baixo */}
            <div className='w-0.5 h-3 bg-gradient-to-b from-transparent via-slate-300 to-transparent'></div>
            {/* Ícone de menu minimalista com indicador de progresso */}
            <div className='relative bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-slate-200/70 hover:bg-white hover:shadow-lg transition-all duration-200'>
              {/* Círculo de progresso - aparece durante hover */}
              {hoverTimer && (
                <svg
                  className='absolute inset-0 w-full h-full -rotate-90'
                  viewBox='0 0 40 40'>
                  <circle
                    cx='20'
                    cy='20'
                    r='18'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    className='text-primary/30'
                  />
                  <circle
                    cx='20'
                    cy='20'
                    r='18'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeDasharray='113'
                    strokeDashoffset='0'
                    className='text-primary animate-progress-circle'
                  />
                </svg>
              )}
              <svg
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 relative z-10 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Menu dropdown - largura total no topo */}
      <div
        className={`absolute top-0 left-0 right-0 z-40 transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onMouseLeave={handleMenuMouseLeave}>
        <HeaderManager />
        <div className='w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200'>
          <div className='max-w-7xl mx-auto px-4 py-4'>
            {!loading && !error && cities.length > 0 && (
              <div className='flex items-center justify-end gap-2'>
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
      </div>

      <div className='flex-1 relative overflow-hidden -mt-[10px] -ml-[10px]'>
        {loading ? (
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-white to-slate-50'>
            <div className='flex flex-col items-center gap-6'>
              <div className='animate-pulse-slow'>
                <Logo width={300} height={60} type='normal' />
              </div>
              <div className='flex flex-col items-center gap-2'>
                <div className='flex gap-1.5'>
                  <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                  <div className='w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                  <div className='w-2 h-2 bg-primary rounded-full animate-bounce'></div>
                </div>
                <p className='text-sm text-muted-foreground font-medium'>
                  Carregando cidades e dashboards...
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className='w-full h-full flex items-center justify-center'>
            <div className='flex flex-col items-center gap-4 max-w-md p-8'>
              <div className='w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-destructive'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='text-center space-y-2'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Erro ao carregar
                </h3>
                <p className='text-sm text-destructive'>{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='w-full h-full relative'>
            {selectedCity && (
              <>
                {selectedCity.dashboards.length > 0 && selectedDashboard ? (
                  <>
                    {/* Loading overlay com logo pulsando */}
                    <div
                      className={`absolute inset-0 bg-white z-10 flex items-center justify-center transition-opacity duration-500 ${
                        showIframe
                          ? 'opacity-0 pointer-events-none'
                          : 'opacity-100'
                      }`}>
                      <div className='animate-pulse-slow'>
                        <Logo width={300} height={60} type='normal' />
                      </div>
                    </div>

                    {/* Iframe carregando em segundo plano */}
                    <iframe
                      src={selectedDashboard.dashboard_url}
                      title={selectedDashboard.name}
                      className='w-[100%] h-[108%] border-0'
                      loading='lazy'
                      allowFullScreen
                      frameBorder='0'
                    />
                  </>
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
