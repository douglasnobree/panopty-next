import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { CitysData } from '@/hooks/useDashboardData'; 

interface MunicipalitiesTableProps {
  cities: CitysData[];
  selectedItems: string[];
  onSelectItem: (itemId: string, checked: boolean) => void;
  onCadastrarDashboard: (city: CitysData) => void;
}

export function MunicipalitiesTable({
  cities,
  selectedItems,
  onSelectItem,
  onCadastrarDashboard,
}: MunicipalitiesTableProps) {
  const router = useRouter();

  console.log('MunicipalitiesTable - cities:', cities);
  console.log('MunicipalitiesTable - cities length:', cities?.length || 0);

  // Se não há dados, mostrar mensagem
  if (!cities || cities.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <p>Nenhum município encontrado.</p>
      </div>
    );
  }

  return (
    <Table className='border rounded-md border-[var(--border)]'>
      <TableHeader className='bg-[var(--slate-2)]'>
        <TableRow>
          <TableHead className='w-12'></TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Arquivos de Conta</TableHead>
          <TableHead>Ativos de IP</TableHead>
          <TableHead>Diagnósticos</TableHead>
          <TableHead>Análises</TableHead>
          <TableHead>Dashboard</TableHead>
          <TableHead className='w-12'></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cities.map((city) => (
          <TableRow
            key={city.id}
            className='cursor-pointer hover:bg-[var(--blue-1)]'
            onClick={() => router.push(`/municipio/${city.id}`)}>
            <TableCell>
              <Checkbox
                checked={selectedItems.includes(city.id.toString())}
                onCheckedChange={(checked) =>
                  onSelectItem(city.id.toString(), checked as boolean)
                }
                onClick={(e) => e.stopPropagation()}
              />
            </TableCell>
            <TableCell className='font-mono text-sm'>{city.cod_mun}</TableCell>
            <TableCell className='font-medium'>{city.name}</TableCell>
            <TableCell>{city.uf}</TableCell>
            <TableCell className='font-medium text-[var(--blue-9)]'>
              {city.bill_files_count || 0}
            </TableCell>
            <TableCell className='font-medium text-[var(--blue-9)]'>
              {city.cip_active_files_count || 0}
            </TableCell>
            <TableCell className='font-medium text-[var(--chart-1)]'>
              {city.diagnostico_count || 0}
            </TableCell>
            <TableCell className='font-medium text-[var(--chart-1)]'>
              {city.analise_count || 0}
            </TableCell>
            <TableCell>
              {city.power_bi_dashboards_count > 0 ? (
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--green-3)] text-[var(--green-12)] border border-[var(--green-12)]'>
                  Disponível
                </span>
              ) : (
                <Button
                  size='sm'
                  variant='outline'
                  className='text-xs h-7 px-2 py-0 border-[var(--blue-9)] text-[var(--blue-9)] hover:bg-[var(--blue-1)]'
                  onClick={(e) => {
                    e.stopPropagation();
                    onCadastrarDashboard(city);
                  }}>
                  Cadastrar
                </Button>
              )}
            </TableCell>
            <TableCell>
              <ChevronRight className='h-4 w-4 text-muted-foreground' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
