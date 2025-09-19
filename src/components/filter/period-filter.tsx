import { Button } from '@/components/ui/button';
import { Calendar, Clock, TrendingUp, BarChart } from 'lucide-react';

interface PeriodFiltersProps {
  value: 'all' | '12' | '6' | '3';
  onValueChange: (value: 'all' | '12' | '6' | '3') => void;
}

export function PeriodFilters({ value, onValueChange }: PeriodFiltersProps) {
  const filters = [
    {
      key: 'all' as const,
      label: 'Todos',
      icon: BarChart,
      description: 'Dados completos',
    },
    {
      key: '12' as const,
      label: '12 meses',
      icon: Calendar,
      description: 'Último ano',
    },
    {
      key: '6' as const,
      label: '6 meses',
      icon: TrendingUp,
      description: 'Últimos 6 meses',
    },
    {
      key: '3' as const,
      label: '3 meses',
      icon: Clock,
      description: 'Últimos 3 meses',
    },
  ];

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <h3 className='text-sm font-semibold text-[var(--slate-12)]'>
          Período de Análise
        </h3>
        <div className='h-px bg-gradient-to-r from-[var(--blue-9)] to-transparent flex-1'></div>
      </div>

      <div className='flex flex-wrap gap-2'>
        {filters.map(({ key, label, icon: Icon, description }) => (
          <Button
            key={key}
            variant={value === key ? 'default' : 'outline'}
            onClick={() => onValueChange(key)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              value === key
                ? 'bg-gradient-to-r from-[var(--blue-9)] to-[var(--blue-10)] hover:from-[var(--blue-10)] hover:to-[var(--blue-9)] text-white shadow-lg hover:shadow-xl transform scale-105'
                : 'border-[var(--slate-7)] hover:border-[var(--blue-9)] hover:bg-[var(--slate-4)] hover:shadow-md'
            }`}>
            <Icon className='h-4 w-4' />
            <span className='hidden sm:inline'>{label}</span>
            <span className='sm:hidden text-xs'>{label.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      <div className='text-xs text-[var(--slate-10)]'>
        {filters.find((f) => f.key === value)?.description}
      </div>
    </div>
  );
}
