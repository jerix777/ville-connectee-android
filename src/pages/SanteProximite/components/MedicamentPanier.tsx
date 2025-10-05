import { useState, useEffect } from 'react';
import { medicamentService, MedicamentPanier, RegimeType } from '@/services/medicamentService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Calculator } from 'lucide-react';

interface MedicamentPanierProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  panier: MedicamentPanier[];
  onUpdateQuantite: (id: string, quantite: number) => void;
  onRemoveFromPanier: (id: string) => void;
  regime: RegimeType;
}

export function MedicamentPanierDialog({
  open,
  onOpenChange,
  panier,
  onUpdateQuantite,
  onRemoveFromPanier,
  regime
}: MedicamentPanierProps) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (open && panier.length > 0) {
      const calculatedTotal = medicamentService.calculerTotal(panier, regime);
      setTotal(calculatedTotal);
    }
  }, [panier, regime, open]);

  const getPrixToDisplay = (medicament: MedicamentPanier) => {
    return medicamentService.getPrixByRegime(medicament, regime);
  };

  const getRegimeLabel = (regime: RegimeType) => {
    switch (regime) {
      case 'mutuelle':
        return 'Mutuelle';
      case 'indigent':
        return 'Indigent';
      case 'cmuc':
        return 'CMUC';
      default:
        return 'Public';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Mon panier - Régime {getRegimeLabel(regime)}</DialogTitle>
        </DialogHeader>

        {panier.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Votre panier est vide
          </div>
        ) : (
          <div className="space-y-4">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {panier.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.nom}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.forme}
                          {item.dosage && ` - ${item.dosage}`}
                        </p>
                        <p className="text-sm font-medium text-primary mt-1">
                          {getPrixToDisplay(item)} FCFA / unité
                        </p>
                      </div>

                      <Button
                        onClick={() => onRemoveFromPanier(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium">Quantité:</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantite}
                        onChange={(e) => onUpdateQuantite(item.id, parseInt(e.target.value) || 1)}
                        className="w-24"
                      />
                      <span className="text-sm font-semibold">
                        = {getPrixToDisplay(item) * item.quantite} FCFA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total de l'ordonnance:</span>
                <span className="text-2xl text-primary">{total.toLocaleString()} FCFA</span>
              </div>

              <div className="bg-accent/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Calculator className="inline mr-2" size={16} />
                  Prix calculés selon le régime: <span className="font-semibold">{getRegimeLabel(regime)}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
