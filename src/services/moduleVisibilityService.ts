import { supabase } from '@/integrations/supabase/client';
import { Module } from '@/pages/Settings/types/Module';

export const getModulesVisibility = async (): Promise<Module[]> => {
  const { data, error } = await supabase
    .from('module_visibility')
    .select('*');
  if (error) throw new Error(error.message);
  return data || [];
};

export const updateModuleVisibility = async (id: string, is_public: boolean) => {
  const { data, error } = await supabase
    .from('module_visibility')
    .update({ is_public })
    .eq('id', id);
  if (error) throw new Error(error.message);
  return data;
};
