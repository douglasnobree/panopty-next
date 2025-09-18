import Image from 'next/image';

interface LogoProps {
  width: number;
  height: number;
  type: 'vertical' | 'horizontal';
}

export function Logo({ width, height, type }: LogoProps) {
  // Você pode substituir por sua logo real
  return (
    <div className='flex items-center justify-center'>
      <h1 className='text-2xl font-bold text-orange-500'>Panopty</h1>
    </div>
  );
}
