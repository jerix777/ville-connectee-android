-- Corriger la fonction pour avoir un search_path sécurisé
CREATE OR REPLACE FUNCTION update_association_membre_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.associations 
    SET nombre_membres = (
      SELECT COUNT(*) FROM public.association_membres 
      WHERE association_id = NEW.association_id
    )
    WHERE id = NEW.association_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.associations 
    SET nombre_membres = (
      SELECT COUNT(*) FROM public.association_membres 
      WHERE association_id = OLD.association_id
    )
    WHERE id = OLD.association_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;