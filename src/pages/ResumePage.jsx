import React from 'react';
import { Magnetic } from '../components/Magnetic';

const ResumePage = () => {
  return (
    <div className="resume-page-wrapper">
      {/* Top Section - Download Hero */}
      <div className="resume-download-hero">
        <div className="container resume-hero-content">
          <Magnetic max={12}>
            <a
              href="/resume.pdf"
              download="Nupur_Lade_Resume.pdf"
              className="btn btn-primary resume-download-btn"
              aria-label="Download PDF Resume"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Resume
            </a>
          </Magnetic>
        </div>
      </div>

      {/* PDF Embed Section */}
      <div className="resume-preview-container">
        <div className="container pdf-viewer-container">
          <iframe
            src="/resume.pdf"
            title="Nupur Lade Resume PDF"
            className="resume-pdf-iframe"
          />
          <p className="resume-fallback-text">
            having trouble viewing?{' '}
            <a href="/resume.pdf" download="Nupur_Lade_Resume.pdf" className="resume-fallback-link">
              download the PDF directly
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
