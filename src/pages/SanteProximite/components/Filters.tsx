import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FiltersProps {
  types: string[];
  stats: {
    total: number;
    urgences: number;
    garde: number;
    parType: Record<string, number>;
  };
  selectedType: string;
  onTypeChange: (type: string) => void;
  showUrgences: boolean;
  onUrgencesChange: (checked: boolean) => void;
  showGarde: boolean;
  onGardeChange: (checked: boolean) => void;
}

const TYPE_LABELS = {
  hopital: 'Hôpitaux',
  pharmacie: 'Pharmacies',
  clinique: 'Cliniques',
  centre_sante: 'Centres de santé'
} as const;

export function Filters({
  types,
  stats,
  selectedType,
  onTypeChange,
  showUrgences,
  onUrgencesChange,
  showGarde,
  onGardeChange
}: FiltersProps) {
  return (
    <div className="space-y-4 pb-4">
      <Tabs value={selectedType} onValueChange={onTypeChange} className="w-full">
        <TabsList className="w-full justify-start">
          {types.map(type => (
            <TabsTrigger key={type} value={type} className="min-w-[100px]">
              {TYPE_LABELS[type as keyof typeof TYPE_LABELS] ?? type}
              <span className="ml-2 text-xs text-muted-foreground">
                ({stats.parType[type]})
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="urgences"
            checked={showUrgences}
            onCheckedChange={onUrgencesChange}
          />
          <Label htmlFor="urgences">
            Urgences ({stats.urgences})
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="garde"
            checked={showGarde}
            onCheckedChange={onGardeChange}
          />
          <Label htmlFor="garde">
            Garde permanente ({stats.garde})
          </Label>
        </div>
      </div>
    </div>
  );
}