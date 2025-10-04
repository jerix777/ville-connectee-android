import { EtablissementSante } from '@/services/santeService';
// import { formatDistance } from '@/lib/utils';

interface EtablissementListProps {
  etablissements: EtablissementSante[];
  loading: boolean;
  onEtablissementClick?: (etablissement: EtablissementSante) => void;
}

export function EtablissementList({
  etablissements,
  loading,
  onEtablissementClick
}: EtablissementListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (etablissements.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        Aucun établissement trouvé
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {etablissements.map((etablissement) => (
        <div
          key={etablissement.id}
          className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEtablissementClick?.(etablissement)}
        >
          <h3 className="font-semibold text-lg">{etablissement.nom}</h3>
          <p className="text-gray-600 text-sm">{etablissement.type}</p>
          <p className="text-gray-500 text-sm mt-2">{etablissement.adresse}</p>
          
          {/* {etablissement.distance && (
            <p className="text-sm text-blue-600 mt-1">
              Distance : {formatDistance(etablissement.distance)}
            </p>
          )} */}

          <div className="mt-2 flex flex-wrap gap-2">
            {etablissement.urgences && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                Urgences
              </span>
            )}
            {etablissement.garde_permanente && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Garde Permanente
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}