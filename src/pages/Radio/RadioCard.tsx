import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { Radio } from "@/services/radioService";
import { useAudio } from "@/contexts/AudioContext";

interface RadioCardProps {
  radio: Radio;
}

export function RadioCard({ radio }: RadioCardProps) {
  const { currentRadio, isPlaying, playRadio, pauseRadio } = useAudio();
  
  const isCurrentRadio = currentRadio?.id === radio.id;
  const isCurrentlyPlaying = isCurrentRadio && isPlaying;

  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      pauseRadio();
    } else {
      playRadio(radio);
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
              variant={isCurrentlyPlaying ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2"
            >
              {isCurrentlyPlaying ? (
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
            {isCurrentlyPlaying && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}