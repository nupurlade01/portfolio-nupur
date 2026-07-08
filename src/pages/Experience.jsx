import React from 'react';
import { Link } from 'react-router-dom';
import { Magnetic } from '../components/Magnetic';
import './Experience.css';

const Experience = () => {
  return (
    <div className="page-wrapper">
      <div className="container back-link-container">
        <Magnetic max={8}>
          <Link to="/" className="back-home-link" aria-label="Back to home page">
            ← back to home
          </Link>
        </Magnetic>
      </div>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ width: '100%' }}>
            <div className="section-header">
              <h2 className="section-title">experience</h2>
              <p className="page-subtitle">Where I've worked</p>
            </div>

            <div className="exp-timeline">
              <div className="exp-card" style={{ position: 'relative' }}>
                <div className="exp-dot"></div>
                <div className="exp-card-header">
                  <div>
                    <h3 className="exp-role">Research Intern</h3>
                    <p className="exp-org">IEEE CIS Pune Chapter &amp; IEEE YP Pune Section</p>
                  </div>
                  <div>
                    <div className="exp-date">Jun 2026 – Jul 2026</div>
                    <div className="exp-location">Pune, India (Virtual)</div>
                  </div>
                </div>

                <ul className="exp-bullets">
                  <li>Built a full stack AI powered answer sheet evaluation system using Node.js & Express.js, reducing manual grading effort by automating rubric based keyword scoring and feedback generation</li>
                  <li>Engineered a dual mode evaluation engine supporting both handwritten answer sheets (OCR + rubric matching) and OMR bubble sheets with configurable negative marking</li>
                  <li>Designed and integrated a real time analytics dashboard using Chart.js to surface class wide grade distributions and top keyword gaps across evaluated papers</li>
                </ul>

                <div className="exp-tags">
                  {["Node.js", "Express.js", "JavaScript", "REST API", "Chart.js"].map(tag => (
                    <span key={tag} className="exp-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
