import api from '@/services/api';
import { useState, useEffect } from 'react';

interface Dashboard {
  id: number;
  name: string;
  dashboard_url: string;
}

interface City {
  city_id: number;
  city_name: string;
  uf: string;
  dashboards: Dashboard[];
}

interface DashboardLinksResponse {
  message: string;
  data: City[];
}

export function useDashboardLinks() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardLinks() {
      try {
        setLoading(true);
        const response = await api.get<DashboardLinksResponse>(
          '/dashboardLinks'
        );
        setCities(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar links dos dashboards:', err);
        setError('Não foi possível carregar as cidades e dashboards.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardLinks();
  }, []);

  return { cities, loading, error };
}
