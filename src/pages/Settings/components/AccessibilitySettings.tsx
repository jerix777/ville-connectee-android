import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Module } from '@/pages/Settings/types/Module';
import { getModulesVisibility, updateModuleVisibility } from '@/services/moduleVisibilityService';
import { useToast } from '@/hooks/use-toast';

const AccessibilitySettings = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await getModulesVisibility();
        setModules(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les modules.",
          variant: "destructive",
        });
      }
    };

    fetchModules();
  }, [toast]);

  const handleToggle = async (id: string, is_public: boolean) => {
    try {
      await updateModuleVisibility(id, is_public);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === id ? { ...module, is_public } : module
        )
      );
      toast({
        title: "Succès",
        description: "La visibilité du module a été mise à jour.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la visibilité du module.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion de l'accessibilité des modules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {modules.map((module) => (
            <div key={module.id} className="flex items-center justify-between">
              <Label htmlFor={`module-${module.id}`}>{module.name}</Label>
              <Switch
                id={`module-${module.id}`}
                checked={module.is_public}
                onCheckedChange={(checked) => handleToggle(module.id, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
