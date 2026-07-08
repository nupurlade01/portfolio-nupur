import React from 'react';
import { Magnetic } from './Magnetic';

const BackToTopInline = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="back-to-top-inline-container">
      <Magnetic max={12}>
        <button 
          onClick={handleScrollToTop} 
          className="back-to-top-inline-btn"
          aria-label="Scroll back to top"
          title="Scroll to top"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </button>
      </Magnetic>
    </div>
  );
};

export default BackToTopInline;
