import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

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
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onValueChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center border rounded-lg transition-all duration-200 ${
          isFocused
            ? 'border-[var(--blue-9)] ring-2 ring-[var(--blue-9)]/20 shadow-lg'
            : 'border-[var(--slate-7)] hover:border-[var(--slate-8)]'
        } bg-white`}>
        <div className='pl-3 pr-2'>
          <Search
            className={`h-4 w-4 transition-colors ${
              isFocused ? 'text-[var(--blue-9)]' : 'text-[var(--slate-9)]'
            }`}
          />
        </div>
        <Input
          type='text'
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className='border-0 focus:ring-0 focus:border-0 bg-transparent placeholder:text-[var(--slate-9)]'
        />
        {value && (
          <Button
            onClick={handleClear}
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 mr-1 hover:bg-[var(--slate-4)]'>
            <X className='h-3 w-3' />
          </Button>
        )}
        <Button
          onClick={onSearch}
          className='mr-1 h-8 px-3 bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white rounded-md transition-all duration-200 hover:shadow-md'>
          <Search className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
