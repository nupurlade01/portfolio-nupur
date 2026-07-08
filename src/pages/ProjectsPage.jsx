import React from 'react';
import { Link } from 'react-router-dom';
import Projects from '../components/Projects';
import { Magnetic } from '../components/Magnetic';

const ProjectsPage = () => {
  return (
    <div className="page-wrapper">
      <div className="container back-link-container">
        <Magnetic max={8}>
          <Link to="/" className="back-home-link" aria-label="Back to home page">
            ← back to home
          </Link>
        </Magnetic>
      </div>
      <Projects />
    </div>
  );
};

export default ProjectsPage;
