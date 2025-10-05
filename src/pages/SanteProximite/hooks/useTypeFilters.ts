import { useState } from 'react';
import { EtablissementSante } from '@/services/santeService';

export function useTypeFilters(etablissements: EtablissementSante[]) {
  const [selectedType, setSelectedType] = useState<string>('tous');
  const [showUrgences, setShowUrgences] = useState(false);
  const [showGarde, setShowGarde] = useState(false);

  const filteredEtablissements = etablissements.filter((etab) => {
    if (selectedType !== 'tous' && etab.type !== selectedType) return false;
    if (showUrgences && !etab.urgences) return false;
    if (showGarde && !etab.garde_permanente) return false;
    return true;
  });

  const types = ['tous', ...new Set(etablissements.map(e => e.type))];

  const stats = {
    total: etablissements.length,
    urgences: etablissements.filter(e => e.urgences).length,
    garde: etablissements.filter(e => e.garde_permanente).length,
    parType: types.reduce((acc, type) => ({
      ...acc,
      [type]: etablissements.filter(e => type === 'tous' || e.type === type).length
    }), {} as Record<string, number>)
  };

  return {
    selectedType,
    setSelectedType,
    showUrgences,
    setShowUrgences,
    showGarde,
    setShowGarde,
    filteredEtablissements,
    types,
    stats
  };
}