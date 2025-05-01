
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../types";

interface ListingTypeSwitchProps {
  form: UseFormReturn<FormValues>;
}

export function ListingTypeSwitch({ form }: ListingTypeSwitchProps) {
  return (
    <FormField
      control={form.control}
      name="is_for_sale"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Type d'annonce</FormLabel>
            <div className="text-sm text-muted-foreground">
              {field.value ? "À vendre" : "À louer"}
            </div>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
