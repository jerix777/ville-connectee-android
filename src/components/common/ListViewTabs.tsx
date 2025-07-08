import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ListViewTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function ListViewTabs({ value, onValueChange, className }: ListViewTabsProps) {
  return (
    <Tabs 
      value={value} 
      onValueChange={onValueChange}
      className={`w-full md:w-auto ${className || ''}`}
    >
      <TabsList className="grid w-full md:w-auto grid-cols-2">
        <TabsTrigger value="liste">Liste</TabsTrigger>
        <TabsTrigger value="ajouter">Ajouter</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}