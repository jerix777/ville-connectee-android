
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { usePropertyForm } from "./hooks/usePropertyForm";
import { PropertyTypeSelect } from "./components/PropertyTypeSelect";
import { ListingTypeSwitch } from "./components/ListingTypeSwitch";
import { PropertyDetailsFields } from "./components/PropertyDetailsFields";
import { PropertyMetricsFields } from "./components/PropertyMetricsFields";
import { RoomsFields } from "./components/RoomsFields";
import { ContactFields } from "./components/ContactFields";
import { toast } from "@/components/ui/sonner";
import { Bell } from "lucide-react";

export function AddImmobilierForm() {
  const { form, onSubmit } = usePropertyForm();

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
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-6">Publier une annonce immobilière</h2>
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

          <Button type="submit" variant="ville" className="w-full">
            Publier l'annonce
          </Button>
        </form>
      </Form>
    </div>
  );
}
