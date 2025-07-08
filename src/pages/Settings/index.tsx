import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, User, MapPin, Bell, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CommuneSelector } from "@/components/CommuneSelector";
import { updateUserProfile } from "@/services/authService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nom: profile?.nom || "",
    prenom: profile?.prenom || ""
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      const updated = await updateUserProfile(user.id, {
        nom: profileForm.nom,
        prenom: profileForm.prenom
      });

      if (updated) {
        await refreshProfile();
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées avec succès"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vous déconnecter",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-ville-DEFAULT" />
          <h1 className="text-xl font-bold">Paramètres</h1>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="location">
              <MapPin className="h-4 w-4 mr-2" />
              Localisation
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Apparence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil et vos préférences de compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user ? (
                  <>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={user.email || ""} disabled />
                      <p className="text-sm text-muted-foreground">
                        Votre adresse email ne peut pas être modifiée
                      </p>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="prenom">Prénom</Label>
                          <Input
                            id="prenom"
                            value={profileForm.prenom}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, prenom: e.target.value }))}
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nom">Nom</Label>
                          <Input
                            id="nom"
                            value={profileForm.nom}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, nom: e.target.value }))}
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>
                      <Button type="submit" disabled={isUpdatingProfile}>
                        {isUpdatingProfile ? "Mise à jour..." : "Mettre à jour le profil"}
                      </Button>
                    </form>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Compte</h3>
                      <Button variant="outline" onClick={handleSignOut}>
                        Se déconnecter
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Vous devez être connecté pour modifier votre profil
                    </p>
                    <Button variant="secondary" asChild>
                      <a href="/auth">Se connecter</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
                <CardDescription>
                  Sélectionnez votre commune pour personnaliser votre expérience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommuneSelector />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Gérez vos préférences de notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Les paramètres de notifications seront disponibles prochainement.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Nouvelles actualités</Label>
                      <div className="text-sm text-muted-foreground">Bientôt disponible</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Nouveaux événements</Label>
                      <div className="text-sm text-muted-foreground">Bientôt disponible</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Offres d'emploi</Label>
                      <div className="text-sm text-muted-foreground">Bientôt disponible</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Les options d'apparence seront disponibles prochainement.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Thème sombre</Label>
                      <div className="text-sm text-muted-foreground">Bientôt disponible</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Taille des polices</Label>
                      <div className="text-sm text-muted-foreground">Bientôt disponible</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}