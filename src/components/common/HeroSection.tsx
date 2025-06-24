
import { Button } from "@/components/ui/button";
import { ArrowRight, Wifi, Building2, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-expo-DEFAULT via-ville-dark to-ville-orange-900 text-white">
      {/* Background Image avec overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
          alt="Ville connectée et moderne"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-expo-DEFAULT/80 via-ville-dark/70 to-ville-orange-800/60" />
      </div>

      {/* Éléments décoratifs flottants */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-ville-orange-500/20 rounded-full blur-xl animate-pulse-soft" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-expo-accent/20 rounded-full blur-2xl animate-bounce-gentle" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-expo-success/20 rounded-full blur-xl animate-pulse-soft" />
      </div>

      <div className="relative container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Wifi className="h-4 w-4 text-ville-orange-400" />
            <span className="text-sm font-medium">Ville Connectée • Services Numériques</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Votre ville
            <span className="block text-gradient bg-gradient-to-r from-ville-orange-400 to-expo-success bg-clip-text text-transparent">
              connectée
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Découvrez tous les services, actualités et opportunités de votre commune. 
            Une plateforme moderne pour une ville d'avenir.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/actualites">
              <Button 
                size="lg" 
                className="bg-ville-orange-500 hover:bg-ville-orange-600 text-white shadow-strong hover:shadow-xl transition-all duration-300 group"
              >
                Découvrir les actualités
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/services">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Explorer les services
              </Button>
            </Link>
          </div>

          {/* Statistiques / Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-ville-orange-500/20 rounded-2xl mb-4">
                <Building2 className="h-8 w-8 text-ville-orange-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Services Publics</h3>
              <p className="text-white/70">Accédez facilement à tous vos services administratifs</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-expo-accent/20 rounded-2xl mb-4">
                <Wifi className="h-8 w-8 text-expo-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connectivité</h3>
              <p className="text-white/70">Une ville moderne et connectée pour tous</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-expo-success/20 rounded-2xl mb-4">
                <Smartphone className="h-8 w-8 text-expo-success" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Innovation</h3>
              <p className="text-white/70">Des solutions numériques pour simplifier votre quotidien</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vague décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-16">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </div>
  );
}
