import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, MapPin, BarChart3 } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  color?: 'blue' | 'amber' | 'green';
  className?: string;
}

export function StatsCard({
  title,
  value,
  color = 'blue',
  className,
}: StatsCardProps) {
  const colorClasses = {
    blue: {
      card: 'border-l-4 border-l-[var(--blue-9)] bg-gradient-to-br from-[var(--blue-1)] to-[var(--blue-2)] hover:from-[var(--blue-2)] hover:to-[var(--blue-3)]',
      icon: 'text-[var(--blue-9)]',
      value: 'text-[var(--blue-12)]',
    },
    amber: {
      card: 'border-l-4 border-l-[var(--amber-10)] bg-gradient-to-br from-[var(--amber-3)] to-[var(--amber-4)] hover:from-[var(--amber-4)] hover:to-[var(--amber-5)]',
      icon: 'text-[var(--amber-12)]',
      value: 'text-[var(--amber-12)]',
    },
    green: {
      card: 'border-l-4 border-l-[var(--green-12)] bg-gradient-to-br from-[var(--green-3)] to-[var(--green-4)] hover:from-[var(--green-4)] hover:to-[var(--green-5)]',
      icon: 'text-[var(--green-12)]',
      value: 'text-[var(--green-12)]',
    },
  };

  const getIcon = () => {
    switch (color) {
      case 'blue':
        return <MapPin className='h-5 w-5' />;
      case 'amber':
        return <TrendingUp className='h-5 w-5' />;
      case 'green':
        return <BarChart3 className='h-5 w-5' />;
      default:
        return <BarChart3 className='h-5 w-5' />;
    }
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group',
        colorClasses[color].card,
        className
      )}>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-sm font-semibold text-[var(--slate-11)] uppercase tracking-wide group-hover:text-[var(--slate-12)] transition-colors'>
            {title}
          </CardTitle>
          <div
            className={cn(
              'p-2 rounded-full bg-white/50 backdrop-blur-sm transition-all group-hover:scale-110',
              colorClasses[color].icon
            )}>
            {getIcon()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-3xl font-bold transition-all group-hover:scale-105',
            colorClasses[color].value
          )}>
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
        </div>
        <div className='mt-1 text-xs text-[var(--slate-10)] font-medium'>
          Total registrado
        </div>
      </CardContent>

      {/* Decorative element */}
      <div className='absolute top-0 right-0 w-16 h-16 opacity-5'>
        <div className='w-full h-full rounded-full bg-current transform translate-x-8 -translate-y-8'></div>
      </div>
    </Card>
  );
}
