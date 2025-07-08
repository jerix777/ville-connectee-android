import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

export const MessageHeader: React.FC = () => {
  return (
    <div className="p-4 border-b bg-background">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <div className="w-full h-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-semibold">J</span>
          </div>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">Jacquie.orange</h3>
          <p className="text-sm text-muted-foreground">+225 07 09 56 5823</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <span className="text-xl">📞</span>
          </Button>
          <Button variant="ghost" size="sm">
            <span className="text-xl">ℹ️</span>
          </Button>
        </div>
      </div>
    </div>
  );
};