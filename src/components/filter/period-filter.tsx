import { Button } from '@/components/ui/button';

interface PeriodFiltersProps {
  value: 'all' | '12' | '6' | '3';
  onValueChange: (value: 'all' | '12' | '6' | '3') => void;
}

export function PeriodFilters({ value, onValueChange }: PeriodFiltersProps) {
  return (
    <div className='flex gap-2'>
      <Button
        variant={value === 'all' ? 'default' : 'outline'}
        onClick={() => onValueChange('all')}>
        Todos
      </Button>
      <Button
        variant={value === '12' ? 'default' : 'outline'}
        onClick={() => onValueChange('12')}>
        12 meses
      </Button>
      <Button
        variant={value === '6' ? 'default' : 'outline'}
        onClick={() => onValueChange('6')}>
        6 meses
      </Button>
      <Button
        variant={value === '3' ? 'default' : 'outline'}
        onClick={() => onValueChange('3')}>
        3 meses
      </Button>
    </div>
  );
}
