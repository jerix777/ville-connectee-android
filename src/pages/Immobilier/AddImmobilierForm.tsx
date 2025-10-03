
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { usePropertyForm } from "./hooks/usePropertyForm";
import { FormValues as PropertyFormValues } from "./types";
import { PropertyTypeSelect } from "./components/PropertyTypeSelect";
import { ListingTypeSwitch } from "./components/ListingTypeSwitch";
import { PropertyDetailsFields } from "./components/PropertyDetailsFields";
import { PropertyMetricsFields } from "./components/PropertyMetricsFields";
import { RoomsFields } from "./components/RoomsFields";
import { ContactFields } from "./components/ContactFields";
import { toast } from "@/components/ui/sonner";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddImmobilierFormProps {
  inline?: boolean;
  onClose?: () => void;
}

export function AddImmobilierForm({ inline = false, onClose }: AddImmobilierFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { form, onSubmit } = usePropertyForm();

  const handleFormSubmit = async (values: PropertyFormValues) => {
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
      if (onClose) onClose();
    }
  };

  const formContent = (
    <div className={inline ? "max-w-2xl" : "max-w-2xl max-h-[90vh] overflow-y-auto"}>
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}>
              Annuler
            </Button>
            <Button type="submit" variant="secondary">
              Publier l'annonce
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

  if (inline) return formContent;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Publier une annonce
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publier une annonce immobilière</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
