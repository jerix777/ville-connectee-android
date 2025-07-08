import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ProfessionalProfileForm } from './ProfessionalProfileForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProfilePage() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/annuaire')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'annuaire
          </Button>
          <h1 className="text-3xl font-bold text-dark-purple">Mon Profil Professionnel</h1>
          <p className="text-gray-600 mt-2">
            Gérez votre présence dans l'annuaire des professionnels
          </p>
        </div>
        
        <ProfessionalProfileForm />
      </div>
    </MainLayout>
  );
}