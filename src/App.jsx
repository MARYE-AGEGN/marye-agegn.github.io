import React from 'react';
import { siteData } from './data/siteData';
import { Navbar, Footer } from './components';
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
} from './sections';

export function App() {
  const { home, personal, about, research, projects, experience, education, publications, skills, contact } = siteData;

  return (
    <div className="app-wrapper">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Global Application Navigation Bar */}
      <Navbar navigation={siteData.navigation} personal={personal} />

      {/* Main Content Sections */}
      <main id="main-content" className="main-content">
        <Home home={home} personal={personal} />
        <About about={about} />
        <Research research={research} />
        <Projects projects={projects} />
        <Experience experience={experience} />
        <Education education={education} />
        <Publications publications={publications} />
        <Skills skills={skills} />
        <Contact contact={contact} />
      </main>

      {/* Global Application Footer */}
      <Footer personal={personal} contact={contact} />
    </div>
  );
}

export default App;
