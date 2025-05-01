
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

interface RoomsFieldsProps {
  form: UseFormReturn<FormValues>;
}

export function RoomsFields({ form }: RoomsFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="pieces"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Nombre de pièces (optionnel)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                value={value === undefined ? "" : value}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val ? parseInt(val) : undefined);
                }}
                {...fieldProps}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chambres"
        render={({ field: { value, onChange, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Nombre de chambres (optionnel)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                value={value === undefined ? "" : value}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange(val ? parseInt(val) : undefined);
                }}
                {...fieldProps}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
