
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  filterOptions?: FilterOption[];
}

export function SearchAndFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  filterValue,
  onFilterChange,
  filterPlaceholder = "Tous les types",
  filterOptions = []
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-expo-gray-400" size={18} />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {filterOptions.length > 0 && onFilterChange && (
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{filterPlaceholder}</SelectItem>
            {filterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
