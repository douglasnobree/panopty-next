import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface TableProps {
  tableTitle: string;
  tableHeaders: string[];
  addButtonEvent: () => void;
  addButton: string;
  loading?: boolean;
  children: React.ReactNode;
}

export function Table({
  tableTitle,
  tableHeaders,
  addButtonEvent,
  addButton,
  loading = false,
  children,
}: TableProps) {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>{tableTitle}</h2>
        {addButton && (
          <Button onClick={addButtonEvent} className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            {addButton}
          </Button>
        )}
      </div>

      {loading ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Carregando...</p>
        </div>
      ) : (
        <div className='border rounded-md'>
          <UITable>
            <TableHeader>
              <TableRow>
                {tableHeaders.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{children}</TableBody>
          </UITable>
        </div>
      )}
    </div>
  );
}

interface TableLineProps {
  data: (string | number)[];
  selected: boolean;
  onSelected: (selected: boolean) => void;
  slug: string;
  id: string;
  path: string;
}

export function TableLine({
  data,
  selected,
  onSelected,
  slug,
  id,
  path,
}: TableLineProps) {
  return (
    <TableRow>
      {data.map((item, index) => (
        <TableCell key={index}>{item}</TableCell>
      ))}
    </TableRow>
  );
}
