'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/statscard/stats-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthContext';
import { PrivateRoute } from '../private';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function GestoresPage() {
  return (
    <PrivateRoute>
      <GestoresDashboard />
    </PrivateRoute>
  );
}

function GestoresDashboard() {
  const { userRole } = useAuth();
  const router = useRouter();

  const isAdmin = userRole === 'admin';
  const isCityManager = userRole === 'cityManager';

  // Estados para as métricas do gestor municipal
  const [loading, setLoading] = useState(true);
  const [totalLaws, setTotalLaws] = useState(0);
  const [totalIPAssets, setTotalIPAssets] = useState(0);
  const [totalAnalyses, setTotalAnalyses] = useState(0);

  useEffect(() => {
    // Aqui você pode carregar os dados específicos do município do gestor
    // Por enquanto, vou deixar valores de exemplo
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // TODO: Implementar chamadas para a API para buscar dados do município
        // const response = await api.get('/city-manager/dashboard');
        // setTotalLaws(response.data.laws);
        // setTotalIPAssets(response.data.ipAssets);
        // setTotalAnalyses(response.data.analyses);

        // Valores de exemplo por enquanto
        setTotalLaws(5);
        setTotalIPAssets(12);
        setTotalAnalyses(3);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-4'>
        <div className='max-w-7xl mx-auto space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>
                {isAdmin
                  ? 'Dashboard - Administrador'
                  : 'Dashboard - Gestor Municipal'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <StatsCard
                  title='Legislações'
                  value={`${totalLaws}`}
                  color='blue'
                />
                <StatsCard
                  title='Ativos IP'
                  value={`${totalIPAssets}`}
                  color='amber'
                />
                <StatsCard
                  title='Análises'
                  value={`${totalAnalyses}`}
                  color='green'
                />
              </div>
            </CardContent>
          </Card>

          {/* Seção de ações rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {isCityManager && (
                  <>
                    <Button
                      onClick={() => router.push('/municipio/overview')}
                      variant='default'>
                      Visão Geral da Cidade
                    </Button>
                    <Button
                      onClick={() => router.push('/municipio/laws')}
                      variant='secondary'>
                      Gerenciar Legislações
                    </Button>
                    <Button
                      onClick={() => router.push('/municipio/ip-assets')}
                      variant='secondary'>
                      Gerenciar Ativos IP
                    </Button>
                    <Button
                      onClick={() => router.push('/municipio/analyses')}
                      variant='secondary'>
                      Ver Análises
                    </Button>
                  </>
                )}

                {isAdmin && (
                  <>
                    <Button
                      onClick={() => router.push('/gestores/gerenciamento')}
                      variant='default'>
                      Gerenciar Gestores
                    </Button>
                    <Button
                      onClick={() => router.push('/gestores/criar-gestor')}
                      variant='secondary'>
                      Criar Novo Gestor
                    </Button>
                    <Button
                      onClick={() => router.push('/novo-cadastro')}
                      variant='secondary'>
                      Cadastrar Município
                    </Button>
                    <Button
                      onClick={() => router.push('/diagnostico')}
                      variant='secondary'>
                      Diagnósticos
                    </Button>
                    <Button
                      onClick={() => router.push('/tarifario')}
                      variant='secondary'>
                      Módulo Tarifário
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default GestoresPage;
