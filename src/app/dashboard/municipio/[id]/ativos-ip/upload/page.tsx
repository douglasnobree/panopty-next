'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileSpreadsheet,
  X,
  Upload,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import api from '@/services/api';
import { parseCookies } from 'nookies';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';

interface RegisterIPProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RegisterIP({ params }: RegisterIPProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const cityId = Number.parseInt(resolvedParams.id);

  const [uploadComplete, setUploadComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
      init: function () {
        this.on('success', function (file, response) {
          setUploadComplete(true);
          setLoading(false);
        });
        this.on('error', function (file, error) {
          console.error('Erro no upload:', error);
          setError('Erro ao fazer upload do arquivo. Tente novamente.');
          setLoading(false);
        });
        this.on('uploadprogress', function (file, progress) {
          setUploadProgress(Math.round(progress));
        });
        this.on('sending', function (file, xhr, formData) {
          setLoading(true);
          setError(null);
          formData.append('city_id', cityId.toString());
        });
      },
    });

    return () => {
      dropzone.destroy();
    };
  }, [cityId]);

  const handleRegisterData = async () => {
    if (!cityId) return;

    setLoading(true);
    try {
      await api.post('/createMuni', { city_id: cityId });
      setUploadComplete(false);
      router.push(`/dashboard/municipio/${cityId}/ativos-ip`);
    } catch (error) {
      console.error('Erro ao registrar dados:', error);
      setError('Erro ao finalizar cadastro');
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
              <CardTitle className='text-2xl font-bold text-gray-900'>
                Upload de Ativos de IP
              </CardTitle>
              <p className='text-gray-600 mt-2'>
                Insira abaixo o arquivo Excel dos ativos de propriedade
                intelectual.
              </p>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() =>
                router.push(`/dashboard/municipio/${cityId}/ativos-ip`)
              }>
              <X className='h-6 w-6' />
            </Button>
          </CardHeader>
          <CardContent className='space-y-6'>
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadComplete && (
              <Alert className='border-green-200 bg-green-50'>
                <CheckCircle className='h-4 w-4 text-green-600' />
                <AlertDescription className='text-green-800'>
                  Arquivo enviado com sucesso! Clique em "Finalizar cadastro"
                  para processar os dados.
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Area */}
            <div className='relative'>
              <div
                id='dropzone'
                className={`
                  block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                  ${
                    uploadComplete
                      ? 'border-green-300 bg-green-50'
                      : loading
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                  }
                  ${loading || uploadComplete ? 'pointer-events-none' : ''}
                `}>
                {uploadComplete ? (
                  <>
                    <CheckCircle className='mx-auto h-16 w-16 text-green-500 mb-4' />
                    <p className='text-lg text-green-700 font-medium'>
                      Arquivo enviado com sucesso!
                    </p>
                    <p className='text-sm text-green-600 mt-1'>
                      Pronto para processar os dados
                    </p>
                  </>
                ) : loading ? (
                  <>
                    <Upload className='mx-auto h-16 w-16 text-orange-500 mb-4' />
                    <p className='text-lg text-orange-700 font-medium'>
                      Enviando arquivo...
                    </p>
                    <div className='w-full bg-gray-200 rounded-full h-2 mt-4'>
                      <div
                        className='bg-orange-500 h-2 rounded-full transition-all duration-300'
                        style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <p className='text-sm text-orange-600 mt-2'>
                      {uploadProgress}% concluído
                    </p>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className='mx-auto h-16 w-16 text-gray-400 mb-4' />
                    <p className='text-lg text-gray-700 font-medium'>
                      Clique ou arraste um arquivo Excel para aqui
                    </p>
                    <p className='text-sm text-gray-500 mt-2'>
                      Formatos aceitos: .xlsx, .xls (máximo 80MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleRegisterData}
              disabled={!uploadComplete || loading}
              className='w-full bg-orange-500 hover:bg-orange-600 text-white disabled:bg-gray-300'>
              {loading ? (
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  Processando...
                </div>
              ) : (
                <>
                  <CheckCircle className='h-4 w-4 mr-2' />
                  Finalizar cadastro
                </>
              )}
            </Button>

            {/* Help Text */}
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <h4 className='font-medium text-blue-900 mb-2'>Instruções:</h4>
              <ul className='text-sm text-blue-800 space-y-1'>
                <li>• O arquivo deve estar no formato Excel (.xlsx ou .xls)</li>
                <li>• Tamanho máximo: 80MB</li>
                <li>
                  • Certifique-se de que os dados estão organizados corretamente
                </li>
                <li>
                  • Após o upload, clique em "Finalizar cadastro" para processar
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
