import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api'; 

const QUERY_KEYS = {
  dashboardLink: 'dashboardLink',
};

const QUERY_KEYS_MUNICIPALITIES = {
  municipalities: 'municipalities',
  dashboardStats: 'dashboardStats',
};
export function usePowerBI() {
  const queryClient = useQueryClient();

  const fetchDashboardLink = async (cityId: number) => {
    try {
      const response = await api.get(`/dashboardLinks/${cityId}`);

      const dashboardData = response.data.data;

      if (dashboardData.dashboards && dashboardData.dashboards.length > 0) {
        return dashboardData.dashboards[0].dashboard_url;
      } else {
        throw new Error('Nenhum dashboard encontrado para esta cidade');
      }
    } catch (error) {
      throw error;
    }
  };

  const useDashboardLinkQuery = (cityId: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.dashboardLink, cityId],
      queryFn: () => fetchDashboardLink(cityId),
      enabled: !!cityId,
    });
  };

  const useCreateDashboard_PowerBI_Mutation = () => {
    return useMutation({
      mutationFn: async (dashboard: {
        name: string;
        city_id: number;
        dashboard_url: string;
      }) => {
        const response = await api.post('/powerbi', dashboard);
        return response.data;
      },
      onSuccess: () => {
        // Invalidate dashboard links for all cities
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.dashboardLink],
        });

        // Invalidate municipalities queries to update dashboard counts
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_MUNICIPALITIES.municipalities],
        });

        // Invalidate dashboard stats to update counts
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS_MUNICIPALITIES.dashboardStats],
        });
      },
    });
  };

  return {
    useDashboardLinkQuery,
    useCreateDashboard_PowerBI_Mutation,
  };
}
