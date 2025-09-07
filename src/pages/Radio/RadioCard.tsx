import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { Radio } from "@/services/radioService";

// Gestionnaire global pour s'assurer qu'une seule radio joue à la fois
let globalAudio: HTMLAudioElement | null = null;
let globalSetIsPlaying: ((playing: boolean) => void) | null = null;

interface RadioCardProps {
  radio: Radio;
}

export function RadioCard({ radio }: RadioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Cleanup si une autre radio commence à jouer
  useEffect(() => {
    const currentSetIsPlaying = setIsPlaying;
    
    if (isPlaying) {
      globalSetIsPlaying = currentSetIsPlaying;
    }

    return () => {
      if (globalSetIsPlaying === currentSetIsPlaying) {
        globalSetIsPlaying = null;
      }
    };
  }, [isPlaying]);

  const handlePlay = () => {
    if (isPlaying) {
      // Arrêter la radio actuelle
      if (globalAudio) {
        globalAudio.pause();
        globalAudio = null;
      }
      setIsPlaying(false);
    } else {
      // Arrêter toute autre radio en cours
      if (globalAudio) {
        globalAudio.pause();
        globalAudio = null;
      }
      if (globalSetIsPlaying) {
        globalSetIsPlaying(false);
      }
      
      // Démarrer la nouvelle radio
      const newAudio = new Audio(radio.flux_url);
      globalAudio = newAudio;
      
      newAudio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Erreur lors de la lecture du flux radio:', error);
        globalAudio = null;
        setIsPlaying(false);
      });

      newAudio.onended = () => {
        setIsPlaying(false);
        globalAudio = null;
      };

      newAudio.onerror = () => {
        setIsPlaying(false);
        globalAudio = null;
        console.error('Erreur lors de la lecture du flux radio');
      };
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {radio.logo_url && (
            <div className="w-16 h-16 flex items-center justify-center bg-muted/20 rounded-lg overflow-hidden">
              <img 
                src={radio.logo_url} 
                alt={`Logo ${radio.nom}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {radio.nom}
            </h3>
            {radio.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {radio.description}
              </p>
            )}
            <Button
              onClick={handlePlay}
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Arrêter
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Écouter
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col items-center">
            <Volume2 className="h-5 w-5 text-muted-foreground mb-1" />
            {isPlaying && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}