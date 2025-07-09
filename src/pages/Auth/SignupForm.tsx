
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { signUp, updateUserProfile } from "@/services/authService";
import { setUserRole, UserRoleType, ROLE_LABELS, SUB_ROLE_OPTIONS } from "@/services/userRoleService";
import { addAutoriteZone, addProfessionnelCompetence, NIVEAUX_COMPETENCE, TYPES_ZONES_AUTORITE } from "@/services/profileService";
import { getVillages } from "@/services/villageService";
import { Loader2, Plus, X } from "lucide-react";

const formSchema = z.object({
  // Informations de connexion
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  
  // Informations personnelles obligatoires
  nom: z.string().min(1, "Le nom est obligatoire"),
  prenom: z.string().min(1, "Le prénom est obligatoire"),
  date_naissance: z.string().min(1, "La date de naissance est obligatoire"),
  lieu_naissance: z.string().min(1, "Le lieu de naissance est obligatoire"),
  lieu_residence: z.string().min(1, "Le lieu de résidence est obligatoire"),
  contact_telephone: z.string().min(1, "Le contact téléphonique est obligatoire"),
  village_origine_id: z.string().min(1, "Le village d'origine est obligatoire"),
  
  // Statut et rôle
  role: z.enum(['autorite_administrative', 'autorite_villageoise', 'administre'] as const, {
    required_error: "Veuillez sélectionner votre statut"
  }),
  subRole: z.string().optional(),
  
  // Champs conditionnels pour les autorités
  zone_autorite_type: z.string().optional(),
  zone_autorite_nom: z.string().optional(),
  zone_autorite_description: z.string().optional(),
  
  // Champs conditionnels pour les professionnels
  domaines_competence: z.array(z.object({
    domaine: z.string(),
    niveau: z.string().optional(),
    experience: z.number().optional(),
    description: z.string().optional()
  })).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
}).refine((data) => {
  // Validation conditionnelle pour les autorités
  if ((data.role === 'autorite_administrative' || data.role === 'autorite_villageoise') && data.subRole) {
    return data.zone_autorite_type && data.zone_autorite_nom;
  }
  return true;
}, {
  message: "Les informations de zone d'autorité sont requises pour les autorités",
  path: ["zone_autorite_type"],
}).refine((data) => {
  // Validation conditionnelle pour les professionnels
  if (data.role === 'administre' && data.subRole === 'Professionnel') {
    return data.domaines_competence && data.domaines_competence.length > 0;
  }
  return true;
}, {
  message: "Au moins un domaine de compétence est requis pour les professionnels",
  path: ["domaines_competence"],
});

type FormValues = z.infer<typeof formSchema>;

interface Village {
  id: string;
  nom: string;
}

interface SignupFormProps {
  onSuccess: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRoleType | undefined>();
  const [villages, setVillages] = useState<Village[]>([]);
  const [competences, setCompetences] = useState([{ domaine: '', niveau: '', experience: 0, description: '' }]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      nom: "",
      prenom: "",
      date_naissance: "",
      lieu_naissance: "",
      lieu_residence: "",
      contact_telephone: "",
      village_origine_id: "",
      role: "administre",
      subRole: "",
      zone_autorite_type: "",
      zone_autorite_nom: "",
      zone_autorite_description: "",
      domaines_competence: [],
    },
  });

  // Charger les villages au montage du composant
  useEffect(() => {
    const loadVillages = async () => {
      const villagesData = await getVillages();
      setVillages(villagesData);
    };
    loadVillages();
  }, []);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Créer le compte utilisateur
      const { success, error } = await signUp(values.email, values.password);
      
      if (!success) {
        toast({
          title: "Erreur d'inscription",
          description: error || "Impossible de créer votre compte.",
          variant: "destructive",
        });
        return;
      }

      // Note: Le profil de base et le rôle sont créés automatiquement par le trigger
      // Il faudra mettre à jour le profil une fois que l'utilisateur sera connecté
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Connectez-vous pour finaliser votre profil.",
      });
      onSuccess();
      
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCompetence = () => {
    setCompetences([...competences, { domaine: '', niveau: '', experience: 0, description: '' }]);
  };

  const removeCompetence = (index: number) => {
    setCompetences(competences.filter((_, i) => i !== index));
  };

  const updateCompetence = (index: number, field: string, value: any) => {
    const newCompetences = [...competences];
    newCompetences[index] = { ...newCompetences[index], [field]: value };
    setCompetences(newCompetences);
    form.setValue('domaines_competence', newCompetences);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto px-2">
        
        {/* Section: Informations de connexion */}
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-semibold">Informations de connexion</h3>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="votre@email.com" {...field} disabled={isSubmitting} autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isSubmitting} autoComplete="new-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isSubmitting} autoComplete="new-password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section: Informations personnelles */}
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-semibold">Informations personnelles</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="date_naissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de naissance</FormLabel>
                <FormControl>
                  <Input type="date" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lieu_naissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de naissance</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lieu_residence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de résidence</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact_telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact téléphonique</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="village_origine_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Village d'origine</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre village d'origine" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {villages.map((village) => (
                      <SelectItem key={village.id} value={village.id}>
                        {village.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Section: Statut et rôle */}
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-semibold">Statut dans la commune</h3>
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedRole(value as UserRoleType);
                    form.setValue("subRole", "");
                  }} 
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedRole && SUB_ROLE_OPTIONS[selectedRole] && (
            <FormField
              control={form.control}
              name="subRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonction spécifique</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre fonction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUB_ROLE_OPTIONS[selectedRole].map((subRole) => (
                        <SelectItem key={subRole} value={subRole}>
                          {subRole}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Section: Zone d'autorité (pour les autorités) */}
        {((selectedRole === 'autorite_administrative' || selectedRole === 'autorite_villageoise') && form.watch("subRole")) && (
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-semibold">Zone d'influence</h3>
            
            <FormField
              control={form.control}
              name="zone_autorite_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de zone d'autorité</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de zone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TYPES_ZONES_AUTORITE.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zone_autorite_nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la zone d'autorité</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} placeholder="Ex: Commune de Douala, Village de Bangangté..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zone_autorite_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isSubmitting} placeholder="Description de votre zone d'influence..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Section: Compétences professionnelles (pour les professionnels) */}
        {(selectedRole === 'administre' && form.watch("subRole") === 'Professionnel') && (
          <div className="space-y-4 border-b pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Domaines de compétence</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCompetence}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            
            {competences.map((competence, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Compétence {index + 1}</h4>
                  {competences.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCompetence(index)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Domaine</label>
                    <Input
                      value={competence.domaine}
                      onChange={(e) => updateCompetence(index, 'domaine', e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Ex: Plomberie, Électricité..."
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Niveau</label>
                    <Select
                      value={competence.niveau}
                      onValueChange={(value) => updateCompetence(index, 'niveau', value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {NIVEAUX_COMPETENCE.map((niveau) => (
                          <SelectItem key={niveau} value={niveau}>
                            {niveau}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Années d'expérience</label>
                  <Input
                    type="number"
                    value={competence.experience}
                    onChange={(e) => updateCompetence(index, 'experience', parseInt(e.target.value) || 0)}
                    disabled={isSubmitting}
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={competence.description}
                    onChange={(e) => updateCompetence(index, 'description', e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Décrivez vos compétences dans ce domaine..."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={isSubmitting} variant="secondary">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inscription...
            </>
          ) : (
            "S'inscrire"
          )}
        </Button>
      </form>
    </Form>
  );
}
