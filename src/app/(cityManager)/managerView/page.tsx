import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/auth';

export default function CityManagerPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <h1 className='text-4xl font-bold'>Área do Gestor Municipal</h1>
      {/* Aqui você pode adicionar o conteúdo específico do gestor municipal */}
    </div>
  );
}
