'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/search/search-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCityManagers } from '@/hooks/useCityManagers';
import { CityManager } from '@/lib/cityManager';
import { PrivateRoute } from '../../private';
import { useAuth } from '@/components/AuthContext';
import { Pagination } from '@/components/ui/pagination';
import EditCitiesModal from '@/components/EditCitiesModal';

function GerenciamentoPage() {
  return (
    <PrivateRoute>
      <CityManagersList />
    </PrivateRoute>
  );
}

function CityManagersList() {
  const router = useRouter();
  const { userRole } = useAuth();
  const {
    cityManagers,
    loading,
    error,
    pagination,
    searchTerm,
    setSearchTerm,
    deleteCityManager,
    updateCityManagerStatus,
    refreshCityManagers,
    loadPage,
  } = useCityManagers();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Estados para o modal de edição de cidades
  const [editCitiesModalOpen, setEditCitiesModalOpen] = useState(false);
  const [managerToEditCities, setManagerToEditCities] =
    useState<CityManager | null>(null);

  const handleDeleteManager = async (id: number) => {
    setManagerToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!managerToDelete) return;

    setActionLoading(managerToDelete);
    const result = await deleteCityManager(managerToDelete);

    if (result.success) {
      console.log('Gestor municipal excluído com sucesso!');
    } else {
      console.error(result.error || 'Erro ao excluir gestor municipal');
    }

    setActionLoading(null);
    setDeleteModalOpen(false);
    setManagerToDelete(null);
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';

    setActionLoading(id);
    const result = await updateCityManagerStatus(id, newStatus);

    if (result.success) {
      console.log(`Status atualizado para ${newStatus}!`);
    } else {
      console.error(result.error || 'Erro ao atualizar status');
    }

    setActionLoading(null);
  };

  const handleEditCities = (manager: CityManager) => {
    setManagerToEditCities(manager);
    setEditCitiesModalOpen(true);
  };

  const handleEditCitiesSuccess = () => {
    refreshCityManagers();
  };

  if (userRole !== 'admin') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Acesso Negado
          </h1>
          <p className='text-gray-600'>
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-4'>
        <div className='max-w-7xl mx-auto space-y-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Gestores Municipais
            </h1>
            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
              <div className='w-full sm:w-80'>
                <SearchInput
                  placeholder='Buscar gestores...'
                  value={searchTerm}
                  onValueChange={(value: string) => setSearchTerm(value)}
                  onSearch={() => {}}
                />
              </div>
              <Button
                onClick={() => router.push('/gestores/criar-gestor')}
                className='w-full sm:w-auto'>
                Criar Novo Gestor
              </Button>
            </div>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-4'>
              <p className='text-red-800'>{error}</p>
            </div>
          )}

          {loading ? (
            <div className='flex justify-center items-center py-12'>
              <div className='text-gray-600'>
                Carregando gestores municipais...
              </div>
            </div>
          ) : cityManagers.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-gray-600'>
                {searchTerm
                  ? 'Nenhum gestor encontrado para o termo pesquisado.'
                  : 'Nenhum gestor municipal cadastrado.'}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {cityManagers.map((manager) => (
                <Card
                  key={manager.id}
                  className='hover:shadow-lg transition-shadow'>
                  <CardHeader className='pb-3'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle className='text-lg'>
                          {manager.name}
                        </CardTitle>
                        <p className='text-sm text-gray-600 mt-1'>
                          {manager.email}
                        </p>
                        <p className='text-sm text-gray-500'>
                          CPF: {manager.cpf}
                        </p>
                      </div>
                      <Badge
                        variant={
                          manager.status === 'ativo' ? 'default' : 'secondary'
                        }
                        className={
                          manager.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }>
                        {manager.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    {manager.cities.length > 0 && (
                      <div>
                        <h4 className='text-sm font-medium text-gray-900 mb-2'>
                          Cidades ({manager.cities.length})
                        </h4>
                        <div className='flex flex-wrap gap-2'>
                          {manager.cities.map((city) => (
                            <Badge
                              key={city.id}
                              variant='outline'
                              className='text-xs'>
                              {city.name} - {city.uf}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className='flex flex-wrap gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                          router.push(`/gestores/${manager.id}/editar`)
                        }
                        disabled={actionLoading === manager.id}
                        className='flex-1'>
                        Editar
                      </Button>

                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditCities(manager)}
                        disabled={actionLoading === manager.id}
                        className='flex-1'>
                        Editar Cidades
                      </Button>

                      <Button
                        variant={
                          manager.status === 'ativo' ? 'destructive' : 'default'
                        }
                        size='sm'
                        onClick={() =>
                          handleToggleStatus(manager.id, manager.status)
                        }
                        disabled={actionLoading === manager.id}
                        className='flex-1'>
                        {actionLoading === manager.id
                          ? 'Atualizando...'
                          : manager.status === 'ativo'
                          ? 'Desativar'
                          : 'Ativar'}
                      </Button>

                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteManager(manager.id)}
                        disabled={actionLoading === manager.id}
                        className='flex-1'>
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Paginação */}
          {pagination && pagination.last_page > 1 && (
            <div className='mt-8'>
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={loadPage}
                totalItems={pagination.total}
                itemsPerPage={pagination.per_page}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este gestor municipal? Esta ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant='destructive'
              onClick={confirmDelete}
              disabled={actionLoading !== null}>
              {actionLoading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edição de cidades */}
      {managerToEditCities && (
        <EditCitiesModal
          isOpen={editCitiesModalOpen}
          onClose={() => {
            setEditCitiesModalOpen(false);
            setManagerToEditCities(null);
          }}
          manager={managerToEditCities}
          onSuccess={handleEditCitiesSuccess}
        />
      )}
    </>
  );
}

export default GerenciamentoPage;
