import React from 'react';
import { Link } from 'react-router-dom';
import Skills from '../components/Skills';
import { Magnetic } from '../components/Magnetic';

const SkillsPage = () => {
  return (
    <div className="page-wrapper">
      <div className="container back-link-container">
        <Magnetic max={8}>
          <Link to="/" className="back-home-link" aria-label="Back to home page">
            ← back to home
          </Link>
        </Magnetic>
      </div>
      <Skills />
    </div>
  );
};

export default SkillsPage;
