import CommunalFindRide from './components/CommunalFindRide';
import { BecomeCommunalDriverForm } from './components/BecomeCommunalDriverForm';
import { useState } from 'react';

const TaxiCommunal: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center mb-4">
        <span className="material-icons mr-2">local_taxi</span>
        Taxis Communaux
      </h1>
      <div className="mb-6 flex justify-end">
        <button
          className="bg-pink-300 hover:bg-pink-400 text-white font-bold px-4 py-2 rounded"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Fermer' : 'Devenir chauffeur communal'}
        </button>
      </div>
      {showForm && (
        <div className="mb-6">
          <BecomeCommunalDriverForm onSuccess={() => setShowForm(false)} />
        </div>
      )}
      <CommunalFindRide />
    </div>
  );
};

export default TaxiCommunal;
