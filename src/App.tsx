import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AudioProvider } from './contexts/AudioContext';
import { ModuleVisibilityProvider } from './contexts/ModuleVisibilityContext';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import MaterielsGratuits from './pages/MaterielsGratuits';
import DemandeDetailPage from './pages/MaterielsGratuits/DemandeDetailPage';
import MaterielsGestion from './pages/Admin/MaterielsGestion';

// Import other pages...
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Materiels Gratuits */}
            <Route path="/materiels-gratuits" element={<MaterielsGratuits />} />
            <Route path="/materiels-gratuits/demande/:id" element={<DemandeDetailPage />} />

            {/* Admin */}
            <Route path="/admin/materiels" element={<MaterielsGestion />} />

            {/* Other routes... */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
