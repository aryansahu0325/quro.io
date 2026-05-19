
import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { useAppStore } from './store/appStore';
import { AnimatePresence } from 'framer-motion';
import { AuthModal } from './components/ui/AuthModal';
import { SessionHistorySidebar } from './components/sessions/SessionHistorySidebar';
import { getCurrentUser } from './services/api';

function App() {
  const { uploadedFile, showApiDocs, token, setUser, loadPastSessions } = useAppStore();

  useEffect(() => {
    if (token) {
      getCurrentUser().then((u) => {
        if (u) {
          setUser(u);
          loadPastSessions();
        } else {
          useAppStore.getState().logout();
        }
      });
    }
  }, [token]);

  return (
    <div className="min-h-screen selection:bg-emerald-500/30 overflow-x-hidden">
      <div className="glow-mesh" />
      <Header />
      <AuthModal />
      <SessionHistorySidebar />
      <main className="relative z-10">
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
    </div>
  );
}

export default App;
