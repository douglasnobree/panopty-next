import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { CityManager, CityManagersApiResponse } from '@/lib/cityManager';

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface CityManagersResponse {
  data: CityManager[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface UseCityManagersOptions {
  autoFetch?: boolean;
  initialSearch?: string;
  initialPage?: number;
}

interface FetchCityManagersParams {
  search?: string;
  page?: number;
}

interface UseCityManagersReturn {
  cityManagers: CityManager[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  searchTerm: string;
  currentPage: number;
  setSearchTerm: (term: string) => void;
  searchCityManagers: (term: string) => void;
  loadPage: (page: number) => void;
  refreshCityManagers: () => void;
  clearSearch: () => void;
  isRefetching: boolean;
  deleteCityManager: (
    id: number
  ) => Promise<{ success: boolean; error?: string }>;
  updateCityManagerStatus: (
    id: number,
    status: string
  ) => Promise<{ success: boolean; error?: string }>;
  updateCityManagerCities: (
    id: number,
    cityIds: number[]
  ) => Promise<{ success: boolean; error?: string }>;
  addCityManagerCities: (
    id: number,
    cityIds: number[]
  ) => Promise<{ success: boolean; error?: string }>;
  removeCityManagerCities: (
    id: number,
    cityIds: number[]
  ) => Promise<{ success: boolean; error?: string }>;
}

const fetchCityManagers = async (
  params: FetchCityManagersParams
): Promise<CityManagersResponse> => {
  const requestParams: any = {};

  if (params.search && params.search.trim()) {
    requestParams.q = params.search.trim();
  }

  if (params.page && params.page > 1) {
    requestParams.page = params.page;
  }

  const response = await api.post<CityManagersApiResponse>(
    '/cityManagers',
    requestParams
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message || 'Erro ao carregar gestores municipais'
    );
  }

  return response.data.data;
};

export const useCityManagers = (
  options: UseCityManagersOptions = {}
): UseCityManagersReturn => {
  const { autoFetch = true, initialSearch = '', initialPage = 1 } = options;

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const queryKey = ['cityManagers', { search: searchTerm, page: currentPage }];

  const {
    data: cityManagersData,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => fetchCityManagers({ search: searchTerm, page: currentPage }),
    enabled: autoFetch,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const cityManagers = cityManagersData?.data || [];
  const pagination: PaginationInfo | null = cityManagersData
    ? {
        current_page: cityManagersData.current_page,
        last_page: cityManagersData.last_page,
        per_page: cityManagersData.per_page,
        total: cityManagersData.total,
        from: cityManagersData.from,
        to: cityManagersData.to,
      }
    : null;

  // Processar erro para exibição
  const processedError = (() => {
    if (!error) return null;

    const apiError = error as any;

    if (apiError.response?.status === 401) {
      return 'Não autorizado para acessar a lista de gestores municipais';
    } else if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    } else {
      return 'Erro ao carregar lista de gestores municipais';
    }
  })();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cityManagers/${id}`);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cityManagers'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await api.patch(`/cityManagers/${id}/status`, { status });
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cityManagers'] });
    },
  });

  const updateCitiesMutation = useMutation({
    mutationFn: async ({ id, cityIds }: { id: number; cityIds: number[] }) => {
      await api.put(`/cityManagers/${id}/cities`, { city_ids: cityIds });
      return { id, cityIds };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cityManagers'] });
    },
  });

  const addCitiesMutation = useMutation({
    mutationFn: async ({ id, cityIds }: { id: number; cityIds: number[] }) => {
      await api.post(`/cityManagers/${id}/cities/add`, { city_ids: cityIds });
      return { id, cityIds };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cityManagers'] });
    },
  });

  const removeCitiesMutation = useMutation({
    mutationFn: async ({ id, cityIds }: { id: number; cityIds: number[] }) => {
      await api.delete(`/cityManagers/${id}/cities/remove`, {
        data: { city_ids: cityIds },
      });
      return { id, cityIds };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cityManagers'] });
    },
  });

  const searchCityManagers = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const loadPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshCityManagers = () => {
    refetch();
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const deleteCityManager = async (
    id: number
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erro ao excluir gestor municipal';
      console.error('Erro ao excluir gestor municipal:', err);
      return { success: false, error: errorMessage };
    }
  };

  const updateCityManagerStatus = async (
    id: number,
    status: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Erro ao atualizar status do gestor municipal';
      console.error('Erro ao atualizar status:', err);
      return { success: false, error: errorMessage };
    }
  };

  const updateCityManagerCities = async (
    id: number,
    cityIds: number[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await updateCitiesMutation.mutateAsync({ id, cityIds });
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Erro ao atualizar cidades do gestor municipal';
      console.error('Erro ao atualizar cidades:', err);
      return { success: false, error: errorMessage };
    }
  };

  const addCityManagerCities = async (
    id: number,
    cityIds: number[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await addCitiesMutation.mutateAsync({ id, cityIds });
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Erro ao adicionar cidades ao gestor municipal';
      console.error('Erro ao adicionar cidades:', err);
      return { success: false, error: errorMessage };
    }
  };

  const removeCityManagerCities = async (
    id: number,
    cityIds: number[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await removeCitiesMutation.mutateAsync({ id, cityIds });
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Erro ao remover cidades do gestor municipal';
      console.error('Erro ao remover cidades:', err);
      return { success: false, error: errorMessage };
    }
  };

  return {
    cityManagers,
    loading: isLoading,
    error: processedError,
    pagination,
    searchTerm,
    currentPage,
    setSearchTerm,
    searchCityManagers,
    loadPage,
    refreshCityManagers,
    clearSearch,
    isRefetching,
    deleteCityManager,
    updateCityManagerStatus,
    updateCityManagerCities,
    addCityManagerCities,
    removeCityManagerCities,
  };
};
