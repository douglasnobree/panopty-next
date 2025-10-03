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
      card: 'border-l-4 border-l-primary bg-gradient-to-br from-accent to-card hover:from-card hover:to-muted',
      icon: 'text-primary',
      value: 'text-foreground',
    },
    amber: {
      card: 'border-l-4 border-l-[#F59E0B] bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] hover:from-[#FDE68A] hover:to-[#FCD34D]',
      icon: 'text-[#B45309]',
      value: 'text-[#92400E]',
    },
    green: {
      card: 'border-l-4 border-l-[#059669] bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] hover:from-[#A7F3D0] hover:to-[#6EE7B7]',
      icon: 'text-[#065F46]',
      value: 'text-[#064E3B]',
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
          <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wide group-hover:text-foreground transition-colors'>
            {title}
          </CardTitle>
          <div
            className={cn(
              'p-2 rounded-full bg-background/50 backdrop-blur-sm transition-all group-hover:scale-110',
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
        <div className='mt-1 text-xs text-muted-foreground font-medium'>
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
