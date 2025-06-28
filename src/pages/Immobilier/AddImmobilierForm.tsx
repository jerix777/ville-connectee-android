
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { usePropertyForm } from "./hooks/usePropertyForm";
import { PropertyTypeSelect } from "./components/PropertyTypeSelect";
import { ListingTypeSwitch } from "./components/ListingTypeSwitch";
import { PropertyDetailsFields } from "./components/PropertyDetailsFields";
import { PropertyMetricsFields } from "./components/PropertyMetricsFields";
import { RoomsFields } from "./components/RoomsFields";
import { ContactFields } from "./components/ContactFields";
import { toast } from "@/components/ui/sonner";
import { Bell, Plus } from "lucide-react";
import { useState } from "react";

export function AddImmobilierForm() {
  const { form, onSubmit } = usePropertyForm();
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = async (values: any) => {
    const result = await onSubmit(values);
    if (result) {
      toast("Annonce publiée avec succès", {
        description: "Votre annonce immobilière est maintenant visible par tous les utilisateurs.",
        action: {
          label: "Créer une alerte",
          onClick: () => document.getElementById("alert-trigger")?.click(),
        },
      });
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Publier une annonce
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publier une annonce immobilière</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <PropertyDetailsFields form={form} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PropertyTypeSelect form={form} />
              <ListingTypeSwitch form={form} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PropertyMetricsFields form={form} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RoomsFields form={form} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContactFields form={form} />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="default">
                Publier l'annonce
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
