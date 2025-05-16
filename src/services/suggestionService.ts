
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Suggestion {
  id: string;
  titre: string;
  contenu: string;
  auteur: string;
  status: 'en attente' | 'approuvée' | 'refusée' | 'en cours';
  reponse?: string;
  image_url?: string;
  quartier_id?: string;
  created_at: string;
  updated_at: string;
  quartiers?: {
    nom: string;
  };
}

export interface SuggestionInput {
  titre: string;
  contenu: string;
  auteur: string;
  image_url?: string;
  quartier_id?: string;
}

export async function fetchSuggestions(): Promise<Suggestion[]> {
  try {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*, quartiers(nom)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des suggestions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les suggestions",
        variant: "destructive",
      });
      return [];
    }

    return data as Suggestion[];
  } catch (error) {
    console.error("Erreur:", error);
    toast({
      title: "Erreur",
      description: "Une erreur s'est produite",
      variant: "destructive",
    });
    return [];
  }
}

export async function addSuggestion(suggestion: SuggestionInput): Promise<boolean> {
  try {
    const { error } = await supabase.from("suggestions").insert([suggestion]);

    if (error) {
      console.error("Erreur lors de l'ajout de la suggestion:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la suggestion",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Succès",
      description: "Votre suggestion a été ajoutée avec succès",
    });
    return true;
  } catch (error) {
    console.error("Erreur:", error);
    toast({
      title: "Erreur",
      description: "Une erreur s'est produite",
      variant: "destructive",
    });
    return false;
  }
}

export async function uploadSuggestionImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("souvenirs")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Erreur lors de l'upload de l'image:", uploadError);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      });
      return null;
    }

    const { data } = supabase.storage.from("souvenirs").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Erreur:", error);
    toast({
      title: "Erreur",
      description: "Une erreur s'est produite lors de l'upload",
      variant: "destructive",
    });
    return null;
  }
}
