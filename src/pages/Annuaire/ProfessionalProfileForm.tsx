import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getMetiers, 
  getMyProfessionalProfile, 
  createMyProfessionalProfile,
  requestProfessionalVerification,
  type Metier, 
  type Professional 
} from '@/services/professionalService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, User, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProfessionalVerification } from './ProfessionalVerification';

const formSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  surnom: z.string().optional(),
  metier_id: z.string().min(1, 'Veuillez sélectionner un métier'),
  base: z.string().min(2, 'La base doit contenir au moins 2 caractères'),
  contact1: z.string().min(8, 'Le contact principal est requis'),
  contact2: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().min(8, 'Numéro de téléphone invalide').optional().or(z.literal('')),
}).refine((data) => data.email || data.phone, {
  message: "Vous devez fournir soit un email, soit un numéro de téléphone",
  path: ["email"],
});

type FormValues = z.infer<typeof formSchema>;

export const ProfessionalProfileForm: React.FC = () => {
  const { user } = useAuth();
  const [showVerification, setShowVerification] = useState(false);
  const queryClient = useQueryClient();

  const { data: metiers = [] } = useQuery({
    queryKey: ['metiers'],
    queryFn: getMetiers
  });

  const { data: myProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['my-professional-profile'],
    queryFn: getMyProfessionalProfile,
    enabled: !!user
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      surnom: '',
      metier_id: '',
      base: '',
      contact1: '',
      contact2: '',
      email: '',
      phone: '',
    },
  });

  // Remplir le formulaire si un profil existe déjà
  useEffect(() => {
    if (myProfile) {
      form.reset({
        nom: myProfile.nom || '',
        surnom: myProfile.surnom || '',
        metier_id: myProfile.metier_id || '',
        base: myProfile.base || '',
        contact1: myProfile.contact1 || '',
        contact2: myProfile.contact2 || '',
        email: myProfile.email || '',
        phone: myProfile.phone || '',
      });
    }
  }, [myProfile, form]);

  const createProfileMutation = useMutation({
    mutationFn: createMyProfessionalProfile,
    onSuccess: () => {
      toast({
        title: "Profil créé",
        description: "Votre profil professionnel a été créé avec succès. Vous pouvez maintenant le faire vérifier."
      });
      queryClient.invalidateQueries({ queryKey: ['my-professional-profile'] });
      setShowVerification(true);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le profil professionnel",
        variant: "destructive"
      });
    }
  });

  const requestVerificationMutation = useMutation({
    mutationFn: ({ method }: { method: 'email' | 'phone' }) => 
      requestProfessionalVerification(myProfile!.id, method),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Code envoyé",
          description: `Un code de vérification a été envoyé par ${data.verificationCode ? 'email/SMS' : 'email/SMS'}`
        });
        setShowVerification(true);
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Impossible d'envoyer le code de vérification",
          variant: "destructive"
        });
      }
    }
  });

  const handleSubmit = (values: FormValues) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un profil",
        variant: "destructive"
      });
      return;
    }

    // Convertir les valeurs en format approprié
    const profileData = {
      nom: values.nom || '',
      surnom: values.surnom || undefined,
      metier_id: values.metier_id || '',
      base: values.base || '',
      contact1: values.contact1 || '',
      contact2: values.contact2 || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
    };

    createProfileMutation.mutate(profileData);
  };

  const handleRequestVerification = (method: 'email' | 'phone') => {
    if (!myProfile) return;
    requestVerificationMutation.mutate({ method });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Vous devez être connecté pour créer un profil professionnel.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Chargement du profil...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showVerification && myProfile) {
    return (
      <ProfessionalVerification 
        profile={myProfile} 
        onVerified={() => {
          setShowVerification(false);
          queryClient.invalidateQueries({ queryKey: ['my-professional-profile'] });
        }}
        onBack={() => setShowVerification(false)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle>
            {myProfile ? 'Mon Profil Professionnel' : 'Créer mon Profil Professionnel'}
          </CardTitle>
        </div>
        <CardDescription>
          {myProfile 
            ? 'Gérez votre profil dans l\'annuaire des professionnels'
            : 'Créez votre profil pour apparaître dans l\'annuaire des professionnels'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {myProfile && (
          <div className="mb-4 flex items-center space-x-2">
            <Badge variant={myProfile.is_verified ? "default" : "secondary"}>
              {myProfile.is_verified ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Vérifié
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Non vérifié
                </>
              )}
            </Badge>
            {!myProfile.is_verified && (
              <div className="flex space-x-2">
                {myProfile.email && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRequestVerification('email')}
                    disabled={requestVerificationMutation.isPending}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Vérifier par email
                  </Button>
                )}
                {myProfile.phone && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRequestVerification('phone')}
                    disabled={requestVerificationMutation.isPending}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Vérifier par SMS
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!myProfile} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surnom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surnom</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!myProfile} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="metier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Métier *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!!myProfile}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre métier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {metiers.map((metier) => (
                        <SelectItem key={metier.id} value={metier.id}>
                          {metier.nom}
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
              name="base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base/Localisation *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!myProfile} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact principal *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!myProfile} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact secondaire</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!myProfile} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (pour vérification)</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={!!myProfile} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (pour vérification)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!myProfile} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!myProfile && (
              <Button 
                type="submit" 
                className="w-full"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer mon profil professionnel'
                )}
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};