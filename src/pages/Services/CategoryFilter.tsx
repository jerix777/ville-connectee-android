
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: CategoryFilterProps) {
  const categoryColorMap: Record<string, string> = {
    "alimentation": "bg-green-100 hover:bg-green-200 text-green-800 data-[active=true]:bg-green-200",
    "santé": "bg-blue-100 hover:bg-blue-200 text-blue-800 data-[active=true]:bg-blue-200",
    "beauté": "bg-pink-100 hover:bg-pink-200 text-pink-800 data-[active=true]:bg-pink-200",
    "éducation": "bg-yellow-100 hover:bg-yellow-200 text-yellow-800 data-[active=true]:bg-yellow-200",
    "transport": "bg-orange-100 hover:bg-orange-200 text-orange-800 data-[active=true]:bg-orange-200",
    "loisirs": "bg-purple-100 hover:bg-purple-200 text-purple-800 data-[active=true]:bg-purple-200",
    "administration": "bg-gray-100 hover:bg-gray-200 text-gray-800 data-[active=true]:bg-gray-200",
    "banque": "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 data-[active=true]:bg-emerald-200",
    "artisanat": "bg-amber-100 hover:bg-amber-200 text-amber-800 data-[active=true]:bg-amber-200",
    "autre": "bg-slate-100 hover:bg-slate-200 text-slate-800 data-[active=true]:bg-slate-200"
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 text-gray-500">Filtrer par catégorie:</h3>
      <div className="flex flex-wrap gap-2">
        <Badge 
          className={cn(
            "cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800",
            !selectedCategory && "bg-gray-200"
          )}
          onClick={() => onCategorySelect(null)}
          data-active={!selectedCategory}
        >
          Tous
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            className={cn(
              "cursor-pointer",
              categoryColorMap[category.toLowerCase()] || "bg-gray-100 hover:bg-gray-200 text-gray-800"
            )}
            onClick={() => onCategorySelect(category)}
            data-active={selectedCategory === category}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
