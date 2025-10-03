import { supabase as originalSupabase } from './client';

// Wrapper pour contourner les types Supabase cassés
export const supabaseClient = new Proxy(originalSupabase, {
  get(target, prop) {
    const value = (target as any)[prop];
    
    if (prop === 'from') {
      return (tableName: string) => {
        const table = (target as any).from(tableName);
        // Retourne le client de table sans validation de type stricte
        return new Proxy(table, {
          get(tableTarget, tableProp) {
            return (tableTarget as any)[tableProp];
          }
        });
      };
    }
    
    return value;
  }
});

export { supabase } from './client';
