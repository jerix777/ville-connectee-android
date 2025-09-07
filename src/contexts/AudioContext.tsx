import React, { createContext, useContext, useState, useCallback } from 'react';
import { Radio } from "@/services/radioService";

interface AudioContextType {
  currentRadio: Radio | null;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  playRadio: (radio: Radio) => Promise<void>;
  pauseRadio: () => void;
  togglePlayback: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRadio, setCurrentRadio] = useState<Radio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const pauseRadio = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const playRadio = useCallback(async (radio: Radio) => {
    // Arrêter l'audio actuel s'il existe
    if (audio) {
      audio.pause();
      setAudio(null);
    }

    try {
      const newAudio = new Audio(radio.flux_url);
      setAudio(newAudio);
      setCurrentRadio(radio);

      newAudio.onended = () => {
        setIsPlaying(false);
        setCurrentRadio(null);
        setAudio(null);
      };

      newAudio.onerror = () => {
        setIsPlaying(false);
        setCurrentRadio(null);
        setAudio(null);
        console.error('Erreur lors de la lecture du flux radio');
      };

      await newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Erreur lors de la lecture du flux radio:', error);
      setIsPlaying(false);
      setCurrentRadio(null);
      setAudio(null);
    }
  }, [audio]);

  const togglePlayback = useCallback(() => {
    if (!audio || !currentRadio) return;

    if (isPlaying) {
      pauseRadio();
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Erreur lors de la lecture:', error);
        setIsPlaying(false);
      });
    }
  }, [audio, currentRadio, isPlaying, pauseRadio]);

  const value: AudioContextType = {
    currentRadio,
    isPlaying,
    audio,
    playRadio,
    pauseRadio,
    togglePlayback,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};