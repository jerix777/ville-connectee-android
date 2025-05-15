
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Tribune {
  id: string;
  titre: string;
  contenu: string;
  auteur: string;
  image_url?: string;
  quartier_id?: string;
  approuve: boolean;
  created_at: string;
  quartiers?: {
    nom: string;
  };
}

export interface TribuneInput {
  titre: string;
  contenu: string;
  auteur: string;
  image_url?: string;
  quartier_id?: string;
}

export async function fetchTribunes(): Promise<Tribune[]> {
  try {
    const { data, error } = await supabase
      .from("tribune")
      .select("*, quartiers(nom)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des tribunes:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les tribunes",
        variant: "destructive",
      });
      return [];
    }

    return data as Tribune[];
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

export async function addTribune(tribune: TribuneInput): Promise<boolean> {
  try {
    const { error } = await supabase.from("tribune").insert([tribune]);

    if (error) {
      console.error("Erreur lors de l'ajout de la tribune:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tribune",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Succès",
      description: "La tribune a été ajoutée avec succès",
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

export async function uploadTribuneImage(file: File): Promise<string | null> {
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
