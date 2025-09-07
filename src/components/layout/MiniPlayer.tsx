import { Play, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/contexts/AudioContext";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  const { currentRadio, isPlaying, togglePlayback, pauseRadio } = useAudio();

  if (!currentRadio) {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center gap-2 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-1.5 shadow-sm",
      "absolute left-1/2 transform -translate-x-1/2"
    )}>
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlayback}
        className="h-6 w-6 p-0"
      >
        {isPlaying ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>
      
      <span className="text-xs font-medium text-foreground max-w-32 truncate">
        {currentRadio.nom}
      </span>
      
      {isPlaying && (
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={pauseRadio}
        className="h-6 w-6 p-0 ml-1"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}