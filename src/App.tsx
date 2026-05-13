import React from 'react';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { useAppStore } from './store/appStore';
import { AnimatePresence } from 'framer-motion';
import { AuthModal } from './components/ui/AuthModal';

function App() {
  const { uploadedFile } = useAppStore();

  return (
    <div className="min-h-screen selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="glow-mesh" />
      <Header />
      <AuthModal />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {uploadedFile ? (
            <WorkspacePage key="workspace" />
          ) : (
            <LandingPage key="landing" />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
