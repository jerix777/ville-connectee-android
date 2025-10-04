import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RadioCategory } from '@/services/radioService';

interface CategorySelectorProps {
  categories: RadioCategory[];
  value?: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export const CategorySelector = ({
  categories,
  value,
  onChange,
  isLoading
}: CategorySelectorProps) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger>
      <SelectValue
        placeholder={isLoading ? "Chargement..." : "Toutes les catégories"}
      />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Toutes les catégories</SelectItem>
      {categories.map((category) => (
        <SelectItem key={category.id} value={category.id}>
          {category.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);