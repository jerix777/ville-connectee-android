import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { Radio } from "@/services/radioService";

interface RadioCardProps {
  radio: Radio;
}

export function RadioCard({ radio }: RadioCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlay = () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      setAudio(null);
    } else {
      // Stop any other playing audio
      const allAudio = document.querySelectorAll('audio');
      allAudio.forEach(a => a.pause());
      
      const newAudio = new Audio(radio.flux_url);
      newAudio.play();
      setAudio(newAudio);
      setIsPlaying(true);

      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
      };

      newAudio.onerror = () => {
        setIsPlaying(false);
        setAudio(null);
        console.error('Erreur lors de la lecture du flux radio');
      };
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {radio.logo_url && (
            <img 
              src={radio.logo_url} 
              alt={`Logo ${radio.nom}`}
              className="w-16 h-16 object-cover rounded-lg"
            />
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