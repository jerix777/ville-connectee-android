import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function PageHeader({ title, description, icon: Icon, iconClassName }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold flex items-center">
        <Icon className={`mr-2 ${iconClassName || ''}`} />
        {title}
      </h1>
      <p className="text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  );
}