import { Header } from '@/components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <Header />
      <main className='flex-1 h-full'>{children}</main>
    </div>
  );
}
