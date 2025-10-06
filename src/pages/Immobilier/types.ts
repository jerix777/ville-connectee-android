
import { z } from "zod";

export const formSchema = z.object({
  titre: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  type: z.string().min(1, "Veuillez sélectionner un type"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  prix: z.coerce.number().positive("Le prix doit être positif"),
  surface: z.coerce.number().positive("La surface doit être positive"),
  pieces: z.coerce.number().int().min(0).optional(),
  chambres: z.coerce.number().int().min(0).optional(),
  adresse: z.string().min(3, "L'adresse est requise"),
  contact: z.string().min(8, "Le contact doit contenir au moins 8 caractères"),
  contact2: z.string().optional(),
  is_for_sale: z.boolean().default(true),
  vendeur: z.string().min(2, "Le nom du vendeur est requis")
});

export type FormValues = z.infer<typeof formSchema>;
