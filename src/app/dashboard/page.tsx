'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PeriodFilters } from '@/components/filter/period-filter';
import { SearchInput } from '@/components/search/search-input';
import { PrivateRoute } from '../private';
import { useDashboardData } from '../hooks/useDashboardData';
import { usePowerBI } from '../hooks/usePowerBI';
import type { CitysData } from '../hooks/useDashboardData';
import { MunicipalitiesTable } from '../../components/dashboard/MunicipalitiesTable';
import { CreateMunicipalityModal } from '../../components/dashboard/CreateMunicipalityModal';
import { CreateDashboardModal } from '../../components/dashboard/CreateDashboardModal';
import { DashboardStatsCards } from '../../components/dashboard/DashboardStatsCards';
import { Pagination } from '../../components/ui/pagination';
import { isAuthenticated } from '@/lib/auth';

function DashboardPage() {
  return (
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  );
}

function Dashboard() {
  const {
    useMunicipalitiesQuery,
    useDashboardStatsQuery,
    useSearchMunicipalitiesMutation,
    useCreateMunicipalityMutation,
  } = useDashboardData();

  const { useCreateDashboard_PowerBI_Mutation } = usePowerBI();
  const [period, setPeriod] = useState<'all' | '12' | '6' | '3'>('all');
  const [searchValue, setSearchValue] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMunicipality, setNewMunicipality] = useState({
    cod_mun: '',
    name: '',
    uf: '',
  });
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CitysData | null>(null);
  const [newDashboard, setNewDashboard] = useState({
    name: '',
    dashboard_url: '',
  });

  const { data: paginationData, isLoading: isCountiesLoading } =
    useMunicipalitiesQuery(searchValue, currentPage, itemsPerPage);

  console.log('Dashboard - paginationData:', paginationData);
  console.log('Dashboard - isCountiesLoading:', isCountiesLoading);

  const cities = paginationData?.data || [];
  const totalPages = paginationData?.last_page || 1;
  const totalItems = paginationData?.total || 0;

  console.log('Dashboard - cities extracted:', cities);
  console.log('Dashboard - cities length:', cities.length);

  const { data: dashboardStats, isLoading: isStatsLoading } =
    useDashboardStatsQuery(period);

  const { mutate: searchMunicipalities, isPending: isSearching } =
    useSearchMunicipalitiesMutation();

  const { mutate: createMunicipality, isPending: isCreating } =
    useCreateMunicipalityMutation();

  const { mutate: createDashboard, isPending: isCreatingDashboard } =
    useCreateDashboard_PowerBI_Mutation();

  const handleSearch = () => {
    searchMunicipalities(searchValue);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePeriodChange = (value: 'all' | '12' | '6' | '3') => {
    setPeriod(value);
    setCurrentPage(1); // Reset to first page when period changes
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleCreateMunicipality = () => {
    createMunicipality({
      cod_mun: newMunicipality.cod_mun,
      name: newMunicipality.name,
      uf: newMunicipality.uf,
      bill_files_count: 0,
      cip_active_files_count: 0,
      diagnostico_count: 0,
      analise_count: 0,
      power_bi_dashboards_count: 0,
    });
    setIsModalOpen(false);
    setNewMunicipality({ cod_mun: '', name: '', uf: '' });
  };

  const handleCadastrarDashboard = (city: CitysData) => {
    setSelectedCity(city);
    setIsDashboardModalOpen(true);
  };

  const handleCreateDashboard = () => {
    if (selectedCity) {
      createDashboard({
        name: newDashboard.name,
        city_id: selectedCity.id,
        dashboard_url: newDashboard.dashboard_url,
      });
      setIsDashboardModalOpen(false);
      setNewDashboard({ name: '', dashboard_url: '' });
      setSelectedCity(null);
    }
  };

  const stats = {
    municipalitiesServed: dashboardStats?.totalMunicipios || 0,
    statesServed: dashboardStats?.totalEstados || 0,
    analyzesGenerated: dashboardStats?.analises || 0,
  };

  const loading = isCountiesLoading || isStatsLoading || isSearching;

  return (
    <div className='min-h-screen bg-background'>
      <main
        className='container mx-auto px-4 py-6 space-y-6'
        style={{ maxWidth: 'var(--max-width)' }}>
        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold text-[var(--slate-12)]'>
              Painel de controle
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <PeriodFilters value={period} onValueChange={handlePeriodChange} />

            <DashboardStatsCards
              municipalitiesServed={stats.municipalitiesServed}
              statesServed={stats.statesServed}
              analyzesGenerated={stats.analyzesGenerated}
            />
          </CardContent>
        </Card>

        <Card className='shadow-sm border border-[var(--border)]'>
          <CardHeader>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <CardTitle className='text-xl font-semibold text-[var(--slate-12)]'>
                Municípios
              </CardTitle>
              <div className='flex flex-col sm:flex-row gap-2'>
                <SearchInput
                  placeholder='Buscar por um município'
                  value={searchValue}
                  onValueChange={setSearchValue}
                  onSearch={handleSearch}
                  className='sm:w-64'
                />
                <Button
                  onClick={handleAddNew}
                  className='flex items-center gap-2 bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white'>
                  <Plus className='h-4 w-4' />
                  Novo município
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--blue-9)]'></div>
              </div>
            ) : (
              <MunicipalitiesTable
                cities={cities}
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                onCadastrarDashboard={handleCadastrarDashboard}
              />
            )}

            {/* Pagination */}
            {cities && cities.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <CreateMunicipalityModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        newMunicipality={newMunicipality}
        onMunicipalityChange={setNewMunicipality}
        onCreate={handleCreateMunicipality}
        isCreating={isCreating}
      />

      <CreateDashboardModal
        isOpen={isDashboardModalOpen}
        onOpenChange={setIsDashboardModalOpen}
        selectedCity={selectedCity}
        newDashboard={newDashboard}
        onDashboardChange={setNewDashboard}
        onCreate={handleCreateDashboard}
        isCreating={isCreatingDashboard}
      />
    </div>
  );
}

export default DashboardPage;
