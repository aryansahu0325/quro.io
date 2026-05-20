
import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { useAppStore } from './store/appStore';
import { AnimatePresence } from 'framer-motion';
import { AuthModal } from './components/ui/AuthModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { SessionHistorySidebar } from './components/sessions/SessionHistorySidebar';
import { getCurrentUser } from './services/api';

import { Footer } from './components/layout/Footer';

function App() {
  const { uploadedFile, showApiDocs, token, setUser, loadPastSessions } = useAppStore();

  useEffect(() => {
    if (token) {
      getCurrentUser().then((u) => {
        if (u) {
          setUser(u);
          loadPastSessions();
          // Direct admin link routing
          if (window.location.pathname === '/admin' && u.is_admin) {
             useAppStore.getState().setShowAdminPanel(true);
             window.history.replaceState({}, '', '/');
          }
        } else {
          useAppStore.getState().logout();
        }
      });
    } else {
      // If no token but accessing /admin, open login modal
      if (window.location.pathname === '/admin') {
         useAppStore.getState().setIsModalOpen(true);
      }
    }
  }, [token]);

  return (
    <div className="min-h-screen selection:bg-emerald-500/30 overflow-x-hidden flex flex-col">
      <div className="glow-mesh" />
      <Header />
      <AuthModal />
      <AdminPanel />
      <SessionHistorySidebar />
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {showApiDocs ? (
            <ApiDocsPage key="apidocs" />
          ) : uploadedFile ? (
            <WorkspacePage key="workspace" />
          ) : (
            <LandingPage key="landing" />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
