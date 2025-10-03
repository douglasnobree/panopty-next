export default function Loading() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--slate-1)] via-background to-[var(--slate-2)] animate-fade-in-up'>
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
        Carregando módulo tarifário...
      </p>
      <p className='text-[var(--slate-10)] text-sm mt-1'>
        Aguarde enquanto preparamos os dados
      </p>
    </div>
  );
}
