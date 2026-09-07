import React, { useState, useEffect } from 'react';
import { siteData } from './data/siteData';
import { Navbar, Footer, GlobalSearch, CollaborationModal } from './components';
import {
  Home,
  About,
  Research,
  Projects,
  Experience,
  Education,
  Publications,
  Skills,
  Contact,
  Blog,
  Documents,
  Media,
  Vision,
} from './sections';
import { AdminDashboard } from './pages/admin/AdminDashboard';

export function App() {
  const { home, personal, about, research, projects, experience, education, publications, skills, contact } = siteData;
  const [currentHash, setCurrentHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace('#', '');
      setCurrentHash(hash);
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isAdminRoute = currentHash === 'admin';

  return (
    <div className="app-wrapper">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Global Application Navigation Bar */}
      <Navbar
        navigation={siteData.navigation}
        personal={personal}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCollaboration={() => setIsCollabOpen(true)}
        currentRoute={currentHash}
      />

      {/* Main View: Conditional Admin Dashboard or Full Portfolio */}
      {isAdminRoute ? (
        <main id="main-content" className="admin-main-container">
          <AdminDashboard />
        </main>
      ) : (
        <main id="main-content" className="main-content">
          <Home home={home} personal={personal} />
          <About about={about} />
          <Research research={research} />
          <Projects projects={projects} />
          <Experience experience={experience} />
          <Education education={education} />
          <Publications publications={publications} />
          <Blog />
          <Documents />
          <Media />
          <Vision />
          <Skills skills={skills} />
          <Contact contact={contact} />
        </main>
      )}

      {/* Global Application Footer */}
      <Footer personal={personal} contact={contact} />

      {/* Global Modals */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CollaborationModal isOpen={isCollabOpen} onClose={() => setIsCollabOpen(false)} />
    </div>
  );
}

export default App;

