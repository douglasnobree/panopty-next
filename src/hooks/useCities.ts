import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

interface City {
  id: number;
  name: string;
  uf: string;
  state?: string;
  bill_files_count?: number;
  cip_active_files_count?: number;
  diagnostico_count?: number;
  analise_count?: number;
  power_bi_dashboards_count?: number;
}

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface CitiesResponse {
  data: City[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface UseCitiesOptions {
  max?: number;
  autoFetch?: boolean;
  initialSearch?: string;
  initialPage?: number;
}

interface FetchCitiesParams {
  search?: string;
  max?: number;
  page?: number;
}

interface UseCitiesReturn {
  cities: City[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  searchTerm: string;
  currentPage: number;
  setSearchTerm: (term: string) => void;
  searchCities: (term: string) => void;
  loadPage: (page: number) => void;
  refreshCities: () => void;
  clearSearch: () => void;
  isRefetching: boolean;
}

// Função para fazer fetch das cidades
const fetchCities = async (
  params: FetchCitiesParams
): Promise<CitiesResponse> => {
  const requestParams: any = {
    max: params.max || 50,
  };

  if (params.search && params.search.trim()) {
    requestParams.q = params.search.trim();
  }

  if (params.page && params.page > 1) {
    requestParams.page = params.page;
  }

  const response = await api.post('/municipalities', requestParams);

  // Tentar diferentes formatos de resposta da API
  let cityData: CitiesResponse;

  if (Array.isArray(response.data) && response.data.length > 0) {
    // Formato: [{ data: [...], ... }]
    cityData = response.data[0];
  } else if (
    response.data &&
    typeof response.data === 'object' &&
    response.data.data
  ) {
    // Formato: { data: [...], ... }
    cityData = response.data;
  } else {
    throw new Error('Formato de resposta inválido do servidor');
  }

  if (!cityData || !cityData.data) {
    throw new Error('Formato de resposta inválido do servidor');
  }

  return cityData;
};

export const useCities = (options: UseCitiesOptions = {}): UseCitiesReturn => {
  const {
    max = 50,
    autoFetch = true,
    initialSearch = '',
    initialPage = 1,
  } = options;

  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Query key que inclui os parâmetros de busca
  const queryKey = ['cities', { search: searchTerm, max, page: currentPage }];

  // Query principal usando useQuery
  const {
    data: citiesData,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery<CitiesResponse>({
    queryKey,
    queryFn: () => fetchCities({ search: searchTerm, max, page: currentPage }),
    enabled: autoFetch,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error: unknown) => {
      // Não fazer retry em caso de erro 401 (não autorizado)
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response &&
        error.response.status === 401
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Mutation para invalidar cache quando necessário
  const invalidateMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
  });

  // Extrair dados da resposta
  const cities = citiesData?.data || [];
  const pagination: PaginationInfo | null =
    citiesData && typeof citiesData === 'object' && 'current_page' in citiesData
      ? {
          current_page: (citiesData as CitiesResponse).current_page,
          last_page: (citiesData as CitiesResponse).last_page || 1,
          per_page: (citiesData as CitiesResponse).per_page || 50,
          total: (citiesData as CitiesResponse).total || 0,
          from: (citiesData as CitiesResponse).from || 0,
          to: (citiesData as CitiesResponse).to || 0,
        }
      : null;

  // Processar erro para exibição
  const processedError = (() => {
    if (!error) return null;

    const apiError = error as any;

    if (apiError.response?.status === 401) {
      return 'Não autorizado para acessar a lista de municípios';
    } else if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    } else {
      return 'Erro ao carregar lista de municípios';
    }
  })();

  // Função para buscar cidades com termo específico
  const searchCities = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset para primeira página ao fazer nova busca
  };

  // Função para carregar página específica
  const loadPage = (page: number) => {
    setCurrentPage(page);
  };

  // Função para atualizar dados
  const refreshCities = () => {
    refetch();
  };

  // Função para limpar busca
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  return {
    cities,
    loading: isLoading,
    error: processedError,
    pagination,
    searchTerm,
    currentPage,
    setSearchTerm,
    searchCities,
    loadPage,
    refreshCities,
    clearSearch,
    isRefetching,
  };
};
