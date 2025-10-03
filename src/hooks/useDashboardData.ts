import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export interface CitysData {
  id: number;
  cod_mun: string;
  name: string;
  uf: string;
  bill_files_count: number;
  cip_active_files_count: number;
  diagnostico_count: number;
  analise_count: number;
  power_bi_dashboards_count: number;
}

export interface PaginationData {
  current_page: number;
  data: CitysData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  per_page: number;
  to: number;
  total: number;
}

export interface DashboardStats {
  ativosIp: number;
  projetosLei: number;
  totalMunicipios: number;
  totalEstados: number;
  analises: number;
  diagnosticos: number;
}

export const QUERY_KEYS_MUNICIPALITIES = {
  municipalities: 'municipalities',
  dashboardStats: 'dashboardStats',
};

export function useDashboardData() {
  const queryClient = useQueryClient();

  const fetchMunicipalities = async (
    search: string = '',
    page: number = 1,
    limit: number = 10
  ) => {
    try {

      const response = await api.post(
        '/municipalities',
        search ? { q: search, page, limit } : { page, limit }
      );


      const result = Array.isArray(response.data)
        ? (response.data[0] as PaginationData)
        : (response.data as PaginationData);


      if (!result || !result.data) {
        console.warn('Invalid data structure received:', result);
        return {
          current_page: 1,
          data: [],
          first_page_url: '',
          from: 0,
          last_page: 1,
          last_page_url: '',
          per_page: limit,
          to: 0,
          total: 0,
        } as PaginationData;
      }

      return result;
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      throw error;
    }
  };

  const fetchDashboardStats = async (period: string) => {
    try {
      const response = await api.post('/dashboard/admin/filterByMonthYear', {
        q: period,
      });



      const result = response.data as DashboardStats;

      // Verificação de segurança para garantir que sempre retornamos algo válido
      if (!result) {
        console.warn('Invalid dashboard stats data received:', result);
        return {
          ativosIp: 0,
          projetosLei: 0,
          totalMunicipios: 0,
          totalEstados: 0,
          analises: 0,
          diagnosticos: 0,
        } as DashboardStats;
      }

      return result;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  };

  const useMunicipalitiesQuery = (
    search: string = '',
    page: number = 1,
    limit: number = 10
  ) => {
    return useQuery({
      queryKey: [QUERY_KEYS_MUNICIPALITIES.municipalities, search, page, limit],
      queryFn: () => fetchMunicipalities(search, page, limit),
      retry: 3,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const useDashboardStatsQuery = (period: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS_MUNICIPALITIES.dashboardStats, period],
      queryFn: () => fetchDashboardStats(period),
      retry: 3,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const useSearchMunicipalitiesMutation = () => {
    return useMutation({
      mutationFn: (search: string) => fetchMunicipalities(search, 1, 10),
      onSuccess: (data, variables) => {
        // Invalidate all municipalities queries to ensure fresh data
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_MUNICIPALITIES.municipalities],
        });
        // Set the search result in cache with page 1
        queryClient.setQueryData(
          [QUERY_KEYS_MUNICIPALITIES.municipalities, variables, 1, 10],
          data
        );
      },
    });
  };

  const useUpdateMunicipalityMutation = () => {
    return useMutation({
      mutationFn: async (municipality: Partial<CitysData>) => {
        const response = await api.put(
          `/municipalities/${municipality.id}`,
          municipality
        );
        return response.data;
      },
      onSuccess: () => {
        // Invalidate municipalities queries to refresh data
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_MUNICIPALITIES.municipalities],
        });
      },
    });
  };

  const useDeleteMunicipalityMutation = () => {
    return useMutation({
      mutationFn: async (id: number) => {
        const response = await api.delete(`/municipalities/${id}`);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate municipalities queries to refresh data
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_MUNICIPALITIES.municipalities],
        });
      },
    });
  };

  const useUpdateDashboardStatsMutation = () => {
    return useMutation({
      mutationFn: async (stats: Partial<DashboardStats>) => {
        const response = await api.put('/dashboard/admin/stats', stats);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate dashboard stats queries to refresh data
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_MUNICIPALITIES.dashboardStats],
        });
      },
    });
  };

  const useCreateMunicipalityMutation = () => {
    return useMutation({
      mutationFn: async (municipality: Omit<CitysData, 'id'>) => {
        const response = await api.post('/createMuni', municipality);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate municipalities queries to refresh data
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_MUNICIPALITIES.municipalities],
        });
      },
    });
  };

  return {
    useMunicipalitiesQuery,
    useDashboardStatsQuery,
    useSearchMunicipalitiesMutation,
    useUpdateMunicipalityMutation,
    useDeleteMunicipalityMutation,
    useUpdateDashboardStatsMutation,
    useCreateMunicipalityMutation,
  };
}
