import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { medicamentService, Medicament, RegimeType } from '@/services/medicamentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface MedicamentSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPanierOpen: () => void;
  panier: Medicament[];
  onAddToPanier: (medicament: Medicament) => void;
  regime: RegimeType;
  onRegimeChange: (regime: RegimeType) => void;
}

export function MedicamentSearch({
  open,
  onOpenChange,
  onPanierOpen,
  panier,
  onAddToPanier,
  regime,
  onRegimeChange
}: MedicamentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: medicaments = [], isLoading } = useQuery({
    queryKey: ['medicaments', searchQuery],
    queryFn: () => searchQuery ? medicamentService.searchMedicaments(searchQuery) : medicamentService.getAllMedicaments(),
    enabled: open,
  });

  const handleAddToPanier = (medicament: Medicament) => {
    onAddToPanier(medicament);
    toast.success('Médicament ajouté au panier');
  };

  const getPrixToDisplay = (medicament: Medicament) => {
    return medicamentService.getPrixByRegime(medicament, regime);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Rechercher des médicaments</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Rechercher un médicament..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={regime} onValueChange={(value) => onRegimeChange(value as RegimeType)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="indigent">Social</SelectItem>
                <SelectItem value="cmuc">CMU</SelectItem>
                <SelectItem value="mutuelle">MUGEFCI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {/* {medicaments.length} médicament(s) trouvé(s) */}
            </p>
            {panier.length > 0 && (
              <Button
                onClick={onPanierOpen}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <ShoppingCart size={16} />
                Voir l'ordonnance ({panier.length})
              </Button>
            )}
          </div>

          <ScrollArea className="h-[500px] pr-4">
            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : medicaments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun médicament trouvé
              </div>
            ) : (
              <div className="space-y-2">
                {medicaments.map((medicament) => (
                  <div
                    key={medicament.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          <h4 className="font-semibold">{medicament.nom}</h4>
                          {medicament.prescription_requise && (
                            <Badge variant="outline" className="text-xs">
                              Sur ordonnance
                            </Badge>
                          )}
                        </div>
                        
                        {medicament.dci && (
                          <p className="text-sm text-muted-foreground">DCI: {medicament.dci}</p>
                        )}
                        
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {medicament.forme}
                            {medicament.dosage && ` - ${medicament.dosage}`}
                          </span>
                          {medicament.laboratoire && (
                            <span className="text-muted-foreground">
                              {medicament.laboratoire}
                            </span>
                          )}
                        </div>

                        {medicament.description && (
                          <p className="text-sm text-muted-foreground">{medicament.description}</p>
                        )}

                        <div className="font-semibold text-primary">
                          {getPrixToDisplay(medicament)} FCFA
                        </div>
                      </div>

                      <Button
                        onClick={() => handleAddToPanier(medicament)}
                        size="sm"
                        className="gap-2"
                        disabled={panier.some(p => p.id === medicament.id)}
                      >
                        <Plus size={16} />
                        {panier.some(p => p.id === medicament.id) ? 'Ajouté' : 'Ajouter'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
