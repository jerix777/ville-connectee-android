import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Module } from '@/pages/Settings/types/Module';
import { getModulesVisibility } from '@/services/moduleVisibilityService';

interface ModuleVisibilityContextType {
  modules: Module[];
  loading: boolean;
}

const ModuleVisibilityContext = createContext<ModuleVisibilityContextType | undefined>(undefined);

export const ModuleVisibilityProvider = ({ children }: { children: ReactNode }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModulesVisibility();
        setModules(data);
      } catch (error) {
        console.error('Failed to fetch module visibility:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <ModuleVisibilityContext.Provider value={{ modules, loading }}>
      {children}
    </ModuleVisibilityContext.Provider>
  );
};

export const useModuleVisibility = () => {
  const context = useContext(ModuleVisibilityContext);
  if (context === undefined) {
    throw new Error('useModuleVisibility must be used within a ModuleVisibilityProvider');
  }
  return context;
};
