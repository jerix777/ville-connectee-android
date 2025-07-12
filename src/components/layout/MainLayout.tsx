
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
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
          "pt-16 h-screen transition-all duration-300 overflow-y-auto",
          sidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <div className="min-h-full py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
