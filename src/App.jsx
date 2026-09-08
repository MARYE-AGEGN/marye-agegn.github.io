import React, { useState, useEffect } from 'react';
import { siteData } from './data/siteData';
import { Navbar, Footer, GlobalSearch, CollaborationModal, ChatAssistant } from './components';
import {
  Home,
  About,
  Services,
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
  const [collabContext, setCollabContext] = useState({
    requestType: 'Professional service',
    service: null,
    project: null,
  });

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace('#', '');
      setCurrentHash(hash);
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isAdminRoute = currentHash === 'admin';

  const handleOpenGeneralContact = (category = 'General inquiry') => {
    setCollabContext({
      requestType: category,
      service: null,
      project: null,
    });
    setIsCollabOpen(true);
  };

  const handleOpenServiceRequest = (serviceTitle) => {
    setCollabContext({
      requestType: 'Professional service',
      service: serviceTitle,
      project: null,
    });
    setIsCollabOpen(true);
  };

  const handleOpenResearchCollaboration = (requestType, projectTitle) => {
    setCollabContext({
      requestType: requestType || 'Academic research collaboration',
      service: null,
      project: projectTitle,
    });
    setIsCollabOpen(true);
  };

  const handleOpenBhnApplication = () => {
    setCollabContext({
      requestType: 'BHN membership',
      service: null,
      project: null,
    });
    setIsCollabOpen(true);
  };

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
        onOpenCollaboration={() => handleOpenGeneralContact('General inquiry')}
        currentRoute={currentHash}
      />

      {/* Main View: Conditional Admin Dashboard or Full Portfolio */}
      {isAdminRoute ? (
        <main id="main-content" className="admin-main-container">
          <AdminDashboard />
        </main>
      ) : (
        <main id="main-content" className="main-content">
          <Home
            home={home}
            personal={personal}
            onOpenContact={() => handleOpenGeneralContact('General inquiry')}
          />
          <About about={about} />
          <Services onSelectService={handleOpenServiceRequest} />
          <Research onSelectCollaboration={handleOpenResearchCollaboration} />
          <Projects projects={projects} onDiscussProject={(title) => handleOpenResearchCollaboration('Medical technology project', title)} />
          <Experience experience={experience} />
          <Education education={education} />
          <Publications publications={publications} />
          <Blog />
          <Documents />
          <Media />
          <Vision onOpenBhnApplication={handleOpenBhnApplication} />
          <Skills skills={skills} />
          <Contact contact={contact} onOpenCollaboration={handleOpenGeneralContact} />
        </main>
      )}

      {/* Global Application Footer */}
      <Footer personal={personal} contact={contact} />

      {/* Floating Controlled Knowledge Assistant (Public Views Only) */}
      {!isAdminRoute && (
        <ChatAssistant
          onOpenCollaboration={handleOpenGeneralContact}
          onOpenServiceRequest={handleOpenServiceRequest}
          onOpenBhnApplication={handleOpenBhnApplication}
        />
      )}

      {/* Global Modals */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CollaborationModal
        isOpen={isCollabOpen}
        onClose={() => setIsCollabOpen(false)}
        initialRequestType={collabContext.requestType}
        initialService={collabContext.service}
        initialProject={collabContext.project}
      />
    </div>
  );
}

export default App;
