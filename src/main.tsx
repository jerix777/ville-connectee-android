
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDefaultData } from './services/setupService.ts';
import { APP_CONFIG } from './config/constants.ts';

// Initialiser les données par défaut
initDefaultData();

// Log de démarrage de l'application
console.log(`🚀 ${APP_CONFIG.name} v${APP_CONFIG.version} démarré`);

createRoot(document.getElementById("root")!).render(<App />);
