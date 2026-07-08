import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTopInline from './components/BackToTopInline';
import Home from './pages/Home';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ResumePage from './pages/ResumePage';
import StatsPage from './pages/StatsPage';
import Experience from './pages/Experience';

function App() {
  return (
    <Router>
      {/* Dynamic Grid Background Overlay */}
      <div className="grid-bg"></div>

      {/* Main Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>

      {/* Centered Scroll to Top button above Footer */}
      <BackToTopInline />

      {/* Footer Branding */}
      <Footer />
    </Router>
  );
}

export default App;
