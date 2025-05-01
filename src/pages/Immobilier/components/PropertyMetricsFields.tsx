
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface PropertyMetricsFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function PropertyMetricsFields({ form }: PropertyMetricsFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="prix"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prix {!form.getValues("is_for_sale") && "(mensuel)"}</FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="surface"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Surface (m²)</FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="adresse"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse / Localisation</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Centre-ville" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
