
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ServiceCommerce {
  id: string;
  nom: string;
  categorie: string;
  description: string;
  adresse: string;
  contact: string;
  horaires?: string;
  image_url?: string;
  quartier_id?: string;
  created_at: string;
  updated_at: string;
  quartiers?: {
    nom: string;
  };
}

export interface ServiceCommerceInput {
  nom: string;
  categorie: string;
  description: string;
  adresse: string;
  contact: string;
  horaires?: string;
  image_url?: string;
  quartier_id?: string;
}

export async function fetchServicesCommerces(): Promise<ServiceCommerce[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("services_commerces")
      .select("*, quartiers(nom)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des services et commerces:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les services et commerces",
        variant: "destructive",
      });
      return [];
    }

    return data as any;
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

export async function fetchServicesByCategory(categorie: string): Promise<ServiceCommerce[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("services_commerces")
      .select("*, quartiers(nom)")
      .eq("categorie", categorie)
      .order("nom", { ascending: true });

    if (error) {
      console.error("Erreur lors de la récupération des services:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les services par catégorie",
        variant: "destructive",
      });
      return [];
    }

    return data as any;
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

export async function addServiceCommerce(service: ServiceCommerceInput): Promise<boolean> {
  try {
    const { error } = await (supabase as any).from("services_commerces").insert([service] as any);

    if (error) {
      console.error("Erreur lors de l'ajout du service:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le service ou commerce",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Succès",
      description: "Le service ou commerce a été ajouté avec succès",
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

export async function uploadServiceImage(file: File): Promise<string | null> {
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
