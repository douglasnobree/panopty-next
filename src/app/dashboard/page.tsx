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
    <div className='min-h-screen bg-gradient-to-br from-[var(--slate-1)] via-background to-[var(--slate-2)]'>
      <main
        className='container mx-auto px-4 py-8 space-y-8'
        style={{ maxWidth: 'var(--max-width)' }}>
        <Card
          className='shadow-lg border-0 bg-gradient-to-r from-white to-[var(--slate-1)] backdrop-blur-sm animate-fade-in-up'
          style={{ animationDelay: '0.1s' }}>
          <CardHeader className='pb-4'>
            <CardTitle className='text-xl font-semibold text-[var(--slate-12)] flex items-center gap-2'>
              Estatísticas Gerais
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

        {/* Municipalities Section */}
        <Card
          className='shadow-lg border-0 bg-gradient-to-r from-white to-[var(--slate-1)] backdrop-blur-sm animate-fade-in-up'
          style={{ animationDelay: '0.2s' }}>
          <CardHeader className='border-b border-[var(--slate-4)] bg-gradient-to-r from-[var(--slate-1)] to-transparent'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
              <div>
                <CardTitle className='text-2xl font-bold text-[var(--slate-12)] mb-1'>
                  Municípios Cadastrados
                </CardTitle>
                <p className='text-[var(--slate-11)]'>
                  Gerencie e monitore todos os municípios do sistema
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-3'>
                <SearchInput
                  placeholder='Buscar município...'
                  value={searchValue}
                  onValueChange={setSearchValue}
                  onSearch={handleSearch}
                  className='sm:w-80'
                />
                <Button
                  onClick={handleAddNew}
                  className='flex items-center gap-2 bg-gradient-to-r from-[var(--blue-9)] to-[var(--blue-10)] hover:from-[var(--blue-10)] hover:to-[var(--blue-9)] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
                  <Plus className='h-4 w-4' />
                  Novo Município
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-6'>
            {loading ? (
              <div className='flex flex-col items-center justify-center py-16 animate-pulse-slow'>
                <div className='relative'>
                  <div className='animate-spin rounded-full h-16 w-16 border-4 border-[var(--blue-9)] border-t-transparent'></div>
                  <div
                    className='absolute inset-0 rounded-full border-4 border-[var(--blue-10)] border-t-transparent animate-spin'
                    style={{
                      animationDirection: 'reverse',
                      animationDuration: '1.5s',
                    }}></div>
                </div>
                <p className='text-[var(--slate-11)] font-medium mt-4'>
                  Carregando dados...
                </p>
                <p className='text-[var(--slate-10)] text-sm mt-1'>
                  Aguarde enquanto processamos as informações
                </p>
              </div>
            ) : cities.length === 0 ? (
              <div className='text-center py-16'>
                <div className='text-6xl mb-4'>🏙️</div>
                <h3 className='text-xl font-semibold text-[var(--slate-12)] mb-2'>
                  Nenhum município encontrado
                </h3>
                <p className='text-[var(--slate-11)] mb-6'>
                  Comece cadastrando seu primeiro município para acessar todas
                  as funcionalidades.
                </p>
                <Button
                  onClick={handleAddNew}
                  className='bg-gradient-to-r from-[var(--blue-9)] to-[var(--blue-10)] hover:from-[var(--blue-10)] hover:to-[var(--blue-9)] text-white shadow-lg hover:shadow-xl transition-all duration-300'>
                  <Plus className='h-4 w-4 mr-2' />
                  Cadastrar Primeiro Município
                </Button>
              </div>
            ) : (
              <>
                <div className='rounded-lg border border-[var(--slate-4)] overflow-hidden bg-white shadow-sm'>
                  <MunicipalitiesTable
                    cities={cities}
                    selectedItems={selectedItems}
                    onSelectItem={handleSelectItem}
                    onCadastrarDashboard={handleCadastrarDashboard}
                  />
                </div>

                {/* Enhanced Pagination */}
                {cities && cities.length > 0 && (
                  <div className='mt-8 border-t border-[var(--slate-4)] pt-6'>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
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
