
import { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { TermsOfServicePage } from './pages/legal/TermsOfServicePage';
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { SecurityArchitecturePage } from './pages/legal/SecurityArchitecturePage';
import { SystemStatusPage } from './pages/legal/SystemStatusPage';
import { EnterprisePricingPage } from './pages/legal/EnterprisePricingPage';
import { CookiePreferencesPage } from './pages/legal/CookiePreferencesPage';
import { HelpCenterPage } from './pages/legal/HelpCenterPage';
import { useAppStore } from './store/appStore';
import { AnimatePresence } from 'framer-motion';
import { AuthModal } from './components/ui/AuthModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { SessionHistorySidebar } from './components/sessions/SessionHistorySidebar';
import { getCurrentUser } from './services/api';

import { Footer } from './components/layout/Footer';

function App() {
  const { uploadedFiles, token, setUser, loadPastSessions, setShowApiDocs } = useAppStore();
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    setShowApiDocs(pathname === '/docs');
  }, [pathname, setShowApiDocs]);

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

  const routePage = (() => {
    switch (pathname) {
      case '/terms':
        return <TermsOfServicePage key="terms" />;
      case '/privacy':
        return <PrivacyPolicyPage key="privacy" />;
      case '/security':
        return <SecurityArchitecturePage key="security" />;
      case '/status':
        return <SystemStatusPage key="status" />;
      case '/docs':
        return <ApiDocsPage key="apidocs" />;
      case '/pricing':
        return <EnterprisePricingPage key="pricing" />;
      case '/cookies':
        return <CookiePreferencesPage key="cookies" />;
      case '/help':
        return <HelpCenterPage key="help" />;
      default:
        return uploadedFiles.length > 0 ? <WorkspacePage key="workspace" /> : <LandingPage key="landing" />;
    }
  })();

  return (
    <div className="min-h-screen selection:bg-emerald-500/30 overflow-x-hidden flex flex-col">
      <div className="glow-mesh" />
      <Header />
      <AuthModal />
      <AdminPanel />
      <SessionHistorySidebar />
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          {routePage}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
