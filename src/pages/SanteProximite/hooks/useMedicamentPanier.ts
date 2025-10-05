import { useState } from 'react';
import { Medicament, MedicamentPanier, RegimeType } from '@/services/medicamentService';

export function useMedicamentPanier() {
  const [panier, setPanier] = useState<MedicamentPanier[]>([]);
  const [regime, setRegime] = useState<RegimeType>('public');
  const [medicamentSearchOpen, setMedicamentSearchOpen] = useState(false);
  const [panierOpen, setPanierOpen] = useState(false);

  const handleAddToPanier = (medicament: Medicament) => {
    setPanier(prev => {
      const exists = prev.find(p => p.id === medicament.id);
      if (exists) return prev;
      return [...prev, { ...medicament, quantite: 1 }];
    });
  };

  const handleUpdateQuantite = (id: string, quantite: number) => {
    setPanier(prev => prev.map(item => 
      item.id === id ? { ...item, quantite: Math.max(1, quantite) } : item
    ));
  };

  const handleRemoveFromPanier = (id: string) => {
    setPanier(prev => prev.filter(item => item.id !== id));
  };

  const handleOpenPanier = () => {
    setMedicamentSearchOpen(false);
    setPanierOpen(true);
  };

  return {
    panier,
    regime,
    medicamentSearchOpen,
    panierOpen,
    setRegime,
    setMedicamentSearchOpen,
    setPanierOpen,
    handleAddToPanier,
    handleUpdateQuantite,
    handleRemoveFromPanier,
    handleOpenPanier
  };
}