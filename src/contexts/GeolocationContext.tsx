import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface GeolocationContextType {
  geolocationEnabled: boolean;
  setGeolocationEnabled: (enabled: boolean) => Promise<void>;
  isLoading: boolean;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [geolocationEnabled, setGeolocationEnabledState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setGeolocationEnabledState(profile.geolocation_enabled ?? true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [profile]);

  const setGeolocationEnabled = async (enabled: boolean) => {
    if (!user) return;

    setGeolocationEnabledState(enabled);

    const { error } = await supabase
      .from('users_profiles')
      .update({ geolocation_enabled: enabled })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating geolocation preference:', error);
      setGeolocationEnabledState(!enabled);
      throw error;
    }
  };

  return (
    <GeolocationContext.Provider
      value={{
        geolocationEnabled,
        setGeolocationEnabled,
        isLoading,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocationPreference() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocationPreference must be used within a GeolocationProvider');
  }
  return context;
}
