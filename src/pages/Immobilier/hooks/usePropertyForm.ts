
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormValues } from "../types";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { addImmobilier, Immobilier } from "@/services/immobilierService";

export function usePropertyForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      type: "",
      description: "",
      prix: 0,
      surface: 0,
      pieces: undefined,
      chambres: undefined,
      adresse: "",
      contact: "",
      is_for_sale: true,
      vendeur: ""
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Cast the form values to the expected type to ensure all required fields are present
      const immobilierData: Omit<Immobilier, "id" | "created_at"> = {
        titre: values.titre,
        type: values.type,
        description: values.description,
        prix: values.prix,
        surface: values.surface,
        pieces: values.pieces,
        chambres: values.chambres,
        adresse: values.adresse,
        contact: values.contact,
        is_for_sale: values.is_for_sale,
        vendeur: values.vendeur
      };

      const response = await addImmobilier(immobilierData);

      if (response) {
        // Réinitialiser le formulaire
        form.reset();

        // Rafraîchir les données dans la page
        queryClient.invalidateQueries({ queryKey: ["immobilier"] });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter l'annonce immobilière."
        });
        return false;
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de l'annonce."
      });
      console.error("Erreur lors de l'ajout:", err);
      return false;
    }
  };

  return {
    form,
    onSubmit
  };
}
