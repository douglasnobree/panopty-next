import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    blue: 'border-l-4 border-l-[var(--blue-9)] bg-[var(--blue-1)] hover:bg-[var(--blue-2)]',
    amber:
      'border-l-4 border-l-[var(--amber-10)] bg-[var(--amber-3)] hover:bg-[var(--amber-3)]',
    green:
      'border-l-4 border-l-[var(--chart-1)] bg-[var(--green-3)] hover:bg-[var(--green-3)]',
  };

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        colorClasses[color],
        className
      )}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground uppercase tracking-wide'>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-foreground'>{value}</div>
      </CardContent>
    </Card>
  );
}
