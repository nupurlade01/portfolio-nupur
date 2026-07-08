import { Magnetic } from './Magnetic';
import HeroBackground from './HeroBackground';

const Hero = () => {
  const handleDownloadResumeFallback = () => {
    const resumeText = `
========================================
NUPUR LADE - COMPUTER ENGINEERING RESUME
========================================
Email: nupurlade0@gmail.com
GitHub: github.com/nupurlade
LinkedIn: linkedin.com/in/nupurlade

SUMMARY:
Passionate Computer Engineering student with hands-on skills in building modern,
responsive, and fast web applications. Skilled in React, JavaScript (ES6+), and CSS design.

EDUCATION:
- B.E. in Computer Engineering | 2023 - Present | CGPA: 9.33/10
- Higher Secondary Education | 2021 - 2023

SKILLS:
- Frontend Developer Intern | InnovateTech Solutions (Summer 2025)
- Open Source Contributor | GitHub / Hacktoberfest (2024 - Present)
- Department Lead | Student Tech Club (2024 - 2025)

TECHNICAL SKILLS:
- Languages: JavaScript, C++, SQL, HTML5, CSS3
- Frameworks & Libraries: React, Node.js, Express
- Tools: Git, GitHub, VS Code, Figma
========================================
    `.trim();

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Nupur_Lade_Resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResumeClick = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/resume.pdf', { method: 'HEAD' });
      if (response.ok) {
        window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
      } else {
        throw new Error('PDF not found');
      }
    } catch (error) {
      console.warn('PDF resume not available, falling back to text format...', error);
      alert('The PDF resume is currently unavailable. A text version has been downloaded for you.');
      handleDownloadResumeFallback();
    }
  };

  return (
    <section id="home" className="hero-wrapper section" style={{ position: 'relative', overflow: 'hidden' }}>
      <HeroBackground />
      {/* Visual Anchor Glow Blob */}
      <div className="hero-glow-blob"></div>

      <div className="container hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-content">
          <span className="hero-pretitle">hi there👋, I'm</span>
          <h1 className="hero-title">
            <span className="hero-title-accent">Nupur Lade</span>
          </h1>
          <p className="hero-tagline">
            Building high-performance, intelligent systems and scalable web applications.
          </p>

          <div className="hero-stats-row">
            <span className="hero-stat-pill" title="Cumulative Grade Point Average">
              <span className="stat-emoji">🎓</span> CGPA: 9.33 / 10
            </span>
          </div>

          <div className="hero-ctas">
            <Magnetic max={12}>
              <a
                href="/resume.pdf"
                onClick={handleResumeClick}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume
              </a>
            </Magnetic>

            <div className="hero-socials">
              <Magnetic max={10}>
                <a
                  href="https://github.com/nupurlade01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px', gap: '5px', lineHeight: 1 }}
                  aria-label="GitHub Profile"
                  title="GitHub"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </Magnetic>
              <Magnetic max={10}>
                <a
                  href="https://linkedin.com/in/nupurlade01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px', gap: '5px', lineHeight: 1 }}
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </Magnetic>
              {/* Get in Touch Button (placed immediately inline after LinkedIn) */}
              <Magnetic max={10}>
                <a
                  href="mailto:nupurlade0@gmail.com"
                  className="hero-social-link"
                  style={{ fontFamily: 'var(--font-mono)', padding: '6px 14px', fontSize: '12px', borderRadius: '6px', gap: '5px', lineHeight: 1 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>get in touch</span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
