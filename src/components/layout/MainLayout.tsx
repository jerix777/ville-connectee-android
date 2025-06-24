
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
    <div className="min-h-screen bg-gradient-to-br from-expo-gray-50 via-white to-expo-light">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />
      
      {/* Overlay moderne avec blur */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-expo-DEFAULT/20 backdrop-blur-sm z-30 md:hidden transition-all duration-300" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <main 
        className={cn(
          "pt-20 min-h-screen transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "ml-0"
        )}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
