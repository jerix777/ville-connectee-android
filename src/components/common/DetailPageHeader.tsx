import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DetailPageHeaderProps {
  title: string;
}

export function DetailPageHeader({ title }: DetailPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="p-2"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
}