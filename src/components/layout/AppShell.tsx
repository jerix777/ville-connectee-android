
import { ReactNode } from "react";
import { MainLayout } from "./MainLayout";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
  showSidebar?: boolean;
}

export function AppShell({ 
  children, 
  title, 
  description,
  showHeader = true,
  showSidebar = true 
}: AppShellProps) {
  return (
    <MainLayout>
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-expo-DEFAULT mb-2">{title}</h1>
          {description && (
            <p className="text-expo-gray-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </MainLayout>
  );
}
