'use client';

import React, { ChangeEvent, DragEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { X, FolderNotchOpen, Files } from 'phosphor-react';
import api from '@/services/api';

export default function RegisterLaw() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cityId = searchParams.get('registre') || '';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert('Por favor, selecione um arquivo JSON válido!');
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert('Por favor, selecione um arquivo JSON válido!');
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  const onSubmit = async () => {
    if (selectedFile != null) {
      if (cityId) {
        await api
          .post(
            '/uploadJson',
            {
              arquivo: selectedFile,
              city_id: cityId,
            },
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )
          .then((response) => {
            router.back();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        alert('Cidade não especificada');
      }
    } else {
      alert('Por favor, selecione um arquivo JSON');
    }
  };

  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <div className='flex-1 p-4'>
          <div className='max-w-2xl mx-auto'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <h1 className='text-2xl font-bold'>Projeto de lei</h1>
                <p className='text-gray-600'>
                  Insira abaixo o arquivo JSON do projeto de lei.
                </p>
              </div>
              <Button variant='ghost' onClick={() => router.back()}>
                <X size={24} />
              </Button>
            </div>
            <div
              className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'
              onDrop={handleDrop}
              onDragOver={handleDragOver}>
              <FolderNotchOpen size={64} className='mx-auto mb-4' />
              <div>
                <Button asChild>
                  <label>
                    Abrir arquivos
                    <input
                      type='file'
                      accept='application/json'
                      onChange={handleFileInputChange}
                      className='hidden'
                    />
                  </label>
                </Button>
                <p className='mt-2 text-gray-600'>
                  Ou arraste um arquivo para aqui
                </p>
                {selectedFile && (
                  <div className='mt-4 flex items-center justify-center'>
                    <Files size={24} className='mr-2' />
                    {selectedFile.name}
                  </div>
                )}
              </div>
            </div>
            <div className='mt-4 text-center'>
              <Button disabled={!selectedFile} onClick={onSubmit}>
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
