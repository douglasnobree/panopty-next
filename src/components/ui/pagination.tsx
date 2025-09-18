import { Button } from '@/components/ui/button';

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

  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-gray-600'>
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>
      <div className='flex gap-2'>
        <Button
          variant='outline'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          Anterior
        </Button>
        <span className='px-3 py-2 text-sm'>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant='outline'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}>
          Próxima
        </Button>
      </div>
    </div>
  );
}
