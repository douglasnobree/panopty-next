'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { MicrosoftExcelLogo, X } from 'phosphor-react';
import api from '@/services/api';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import { parseCookies } from 'nookies';

interface RegisterIPProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RegisterIP({ params }: RegisterIPProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const cityId = parseInt(resolvedParams.id);

  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies['panopty-token'];

    Dropzone.autoDiscover = false;
    const dropzone = new Dropzone('#dropzone', {
      url: api.defaults.baseURL + '/insertCipFiles',
      chunking: true,
      chunkSize: 1024 * 1024, // 1MB
      retryChunks: true,
      retryChunksLimit: 3,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      acceptedFiles: '.xlsx,.xls',
      maxFiles: 1,
      maxFilesize: 80, // 80MB
      // @ts-ignore
      init: function () {
        // @ts-ignore
        this.on('success', function (file, response) {
          setUploadComplete(true);
        });
        // @ts-ignore
        this.on('error', function (file, error) {
          alert('Erro no upload: ' + error);
        });
      },
    });

    return () => {
      dropzone.destroy();
    };
  }, []);

  const handleRegisterData = async () => {
    if (!cityId) return;

    setLoading(true);
    try {
      // Aqui você pode adicionar lógica para registrar dados adicionais se necessário
      // Por exemplo, criar município ou registrar lei, baseado no código antigo

      // Simular registro
      await api.post('/createMuni', { city_id: cityId });

      // Reset states
      setUploadComplete(false);

      // Navegar de volta
      router.back();
    } catch (error) {
      console.error('Erro ao registrar dados:', error);
      alert('Erro ao finalizar cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle className='text-2xl font-bold'>Ativos de IP</CardTitle>
              <p className='text-gray-600 mt-2'>
                Insira abaixo o arquivo Excel dos ativos de IP.
              </p>
            </div>
            <Button variant='ghost' size='icon' onClick={() => router.back()}>
              <X className='h-6 w-6' />
            </Button>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div
              id='dropzone'
              className='dropzone border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-gray-400'>
              <MicrosoftExcelLogo className='mx-auto h-16 w-16 text-gray-400 mb-4' />
              <p className='text-lg text-gray-600'>
                Clique ou arraste um arquivo Excel (.xlsx ou .xls) para aqui
              </p>
            </div>

            <Button
              onClick={handleRegisterData}
              disabled={!uploadComplete || loading}
              className='w-full'>
              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Carregando...
                </div>
              ) : (
                'Finalizar cadastro'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
