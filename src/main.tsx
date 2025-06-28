
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDefaultData } from './services/setupService.ts';

// Initialiser les données par défaut
initDefaultData();

createRoot(document.getElementById("root")!).render(<App />);
