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

interface CreateMunicipalityModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newMunicipality: {
    cod_mun: string;
    name: string;
    uf: string;
  };
  onMunicipalityChange: (municipality: {
    cod_mun: string;
    name: string;
    uf: string;
  }) => void;
  onCreate: () => void;
  isCreating: boolean;
}

export function CreateMunicipalityModal({
  isOpen,
  onOpenChange,
  newMunicipality,
  onMunicipalityChange,
  onCreate,
  isCreating,
}: CreateMunicipalityModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Município</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo município.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='cod_mun' className='text-right'>
              Código
            </Label>
            <Input
              id='cod_mun'
              value={newMunicipality.cod_mun}
              onChange={(e) =>
                onMunicipalityChange({
                  ...newMunicipality,
                  cod_mun: e.target.value,
                })
              }
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Nome
            </Label>
            <Input
              id='name'
              value={newMunicipality.name}
              onChange={(e) =>
                onMunicipalityChange({
                  ...newMunicipality,
                  name: e.target.value,
                })
              }
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='uf' className='text-right'>
              UF
            </Label>
            <Input
              id='uf'
              value={newMunicipality.uf}
              onChange={(e) =>
                onMunicipalityChange({
                  ...newMunicipality,
                  uf: e.target.value,
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
