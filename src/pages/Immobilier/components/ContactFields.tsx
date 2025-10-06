
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

interface ContactFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function ContactFields({ form }: ContactFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 77 12 34 56" {...field} />
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
            <FormLabel>Contact 2 (optionnel)</FormLabel>
            <FormControl>
              <Input placeholder="Ex: 77 98 76 54" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vendeur"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vendeur / Agence</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Agence Immovilla" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
