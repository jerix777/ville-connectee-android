import { RadioCard } from './RadioCard';
import type { Radio } from '@/services/radioService';

interface RadioListProps {
  radios: Radio[];
}

export const RadioList = ({ radios }: RadioListProps) => (
  <div className="space-y-4">
    {radios.map((radio) => (
      <RadioCard key={radio.id} radio={radio} />
    ))}
  </div>
);