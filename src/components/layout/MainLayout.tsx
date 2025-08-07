
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { Capacitor } from '@capacitor/core';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    // Ajouter un padding top pour la barre d'état sur mobile
    if (Capacitor.isNativePlatform()) {
      setStatusBarHeight(24); // Hauteur approximative de la barre d'état
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div 
      className="min-h-screen bg-background"
      style={{ paddingTop: statusBarHeight }}
    >
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <main 
        className={cn(
          "pt-16 h-screen transition-all duration-300 overflow-hidden flex flex-col",
          sidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
