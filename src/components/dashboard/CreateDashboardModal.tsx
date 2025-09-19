import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CitysData } from '@/hooks/useDashboardData';  

interface CreateDashboardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCity: CitysData | null;
  newDashboard: {
    name: string;
    dashboard_url: string;
  };
  onDashboardChange: (dashboard: {
    name: string;
    dashboard_url: string;
  }) => void;
  onCreate: () => void;
  isCreating: boolean;
}

export function CreateDashboardModal({
  isOpen,
  onOpenChange,
  selectedCity,
  newDashboard,
  onDashboardChange,
  onCreate,
  isCreating,
}: CreateDashboardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Cadastrar Dashboard</DialogTitle>
          <DialogDescription>
            Preencha as informações da nova dashboard para {selectedCity?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='dashboard_name' className='text-right'>
              Nome
            </Label>
            <Input
              id='dashboard_name'
              value={newDashboard.name}
              onChange={(e) =>
                onDashboardChange({
                  ...newDashboard,
                  name: e.target.value,
                })
              }
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='dashboard_url' className='text-right'>
              URL
            </Label>
            <Input
              id='dashboard_url'
              value={newDashboard.dashboard_url}
              onChange={(e) =>
                onDashboardChange({
                  ...newDashboard,
                  dashboard_url: e.target.value,
                })
              }
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={onCreate} disabled={isCreating}>
            {isCreating ? 'Criando...' : 'Cadastrar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
