import React from 'react';
import { PageHeader } from "./PageHeader";
import { LucideIcon } from 'lucide-react';

interface PageTitleProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function PageTitle({ title, description, icon, iconClassName }: PageTitleProps) {
  return (
    <div className="bg-background border-b border-border flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
        <PageHeader
          title={title}
          description={description}
          icon={icon}
          iconClassName={iconClassName}
        />
      </div>
    </div>
  );
}