
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface PropertyDetailsFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function PropertyDetailsFields({ form }: PropertyDetailsFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="titre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titre de l'annonce</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Appartement T3 centre-ville" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez le bien en détail..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
