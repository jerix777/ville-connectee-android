
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDefaultData } from './services/setupService.ts';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

// Configuration de la barre d'état pour mobile
const setupMobile = async () => {
  if (Capacitor.isNativePlatform()) {
    // Configuration de la barre d'état
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
    await StatusBar.setOverlaysWebView({ overlay: true });
    
    // Masquer le splash screen
    await SplashScreen.hide();
  }
};

// Initialiser les données par défaut
const initializeApp = async () => {
  await setupMobile();
  await initDefaultData();
  createRoot(document.getElementById("root")!).render(<App />);
};

initializeApp();
