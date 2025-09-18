import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  onSearch: () => void;
  className?: string;
}

export function SearchInput({
  placeholder,
  value,
  onValueChange,
  onSearch,
  className,
}: SearchInputProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      />
      <Button onClick={onSearch} variant='outline'>
        <Search className='h-4 w-4' />
      </Button>
    </div>
  );
}
