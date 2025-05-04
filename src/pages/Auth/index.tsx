
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { CommuneSelector } from "@/components/CommuneSelector";
import { UserCircle, Lock, Home } from "lucide-react";

export default function AuthPage() {
  const { user, communeId } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>
            
            <Card>
              <TabsContent value="login" className="mt-0">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-ville-DEFAULT" />
                    <CardTitle>Connexion</CardTitle>
                  </div>
                  <CardDescription>
                    Connectez-vous à votre compte pour accéder à toutes les fonctionnalités.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LoginForm onSuccess={() => {}} />
                </CardContent>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-0">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <UserCircle className="h-5 w-5 text-ville-DEFAULT" />
                    <CardTitle>Inscription</CardTitle>
                  </div>
                  <CardDescription>
                    Créez un nouveau compte pour accéder à toutes les fonctionnalités.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignupForm onSuccess={() => setActiveTab("login")} />
                </CardContent>
              </TabsContent>
            </Card>
          </Tabs>
          
          {!communeId && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-ville-DEFAULT" />
                  <CardTitle>Sélectionnez votre commune</CardTitle>
                </div>
                <CardDescription>
                  Choisissez votre commune pour personnaliser l'application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CommuneSelector />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
