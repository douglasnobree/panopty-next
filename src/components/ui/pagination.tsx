import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 py-4'>
      {/* Results info */}
      <div className='text-sm text-[var(--slate-11)] order-2 sm:order-1'>
        Mostrando{' '}
        <span className='font-medium text-[var(--slate-12)]'>{startItem}</span>{' '}
        a <span className='font-medium text-[var(--slate-12)]'>{endItem}</span>{' '}
        de{' '}
        <span className='font-medium text-[var(--slate-12)]'>{totalItems}</span>{' '}
        resultados
      </div>

      {/* Pagination controls */}
      <div className='flex items-center gap-1 order-1 sm:order-2'>
        {/* First page button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className='hidden sm:flex h-8 w-8 p-0 border-[var(--slate-7)] hover:bg-[var(--slate-4)] hover:border-[var(--blue-9)]'>
          <ChevronsLeft className='h-4 w-4' />
          <span className='sr-only'>Primeira página</span>
        </Button>

        {/* Previous page button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='h-8 w-8 p-0 border-[var(--slate-7)] hover:bg-[var(--slate-4)] hover:border-[var(--blue-9)]'>
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>Página anterior</span>
        </Button>

        {/* Page numbers */}
        <div className='flex items-center gap-1'>
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className='px-2 py-1 text-sm text-[var(--slate-11)]'>
                  ...
                </span>
              ) : (
                <Button
                  variant={currentPage === page ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => onPageChange(page as number)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === page
                      ? 'bg-[var(--blue-9)] hover:bg-[var(--blue-10)] text-white border-[var(--blue-9)]'
                      : 'border-[var(--slate-7)] hover:bg-[var(--slate-4)] hover:border-[var(--blue-9)]'
                  }`}>
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next page button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='h-8 w-8 p-0 border-[var(--slate-7)] hover:bg-[var(--slate-4)] hover:border-[var(--blue-9)]'>
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>Próxima página</span>
        </Button>

        {/* Last page button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className='hidden sm:flex h-8 w-8 p-0 border-[var(--slate-7)] hover:bg-[var(--slate-4)] hover:border-[var(--blue-9)]'>
          <ChevronsRight className='h-4 w-4' />
          <span className='sr-only'>Última página</span>
        </Button>
      </div>
    </div>
  );
}
