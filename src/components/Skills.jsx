
const Skills = () => {
  // Definition map of all 23 skills with icons
  const skillDefinitions = {
    // Languages
    'Python': { iconClass: 'devicon-python-plain colored' },
    'C': { iconClass: 'devicon-c-plain colored' },
    'C++': { iconClass: 'devicon-cplusplus-plain colored' },
    'Java': { iconClass: 'devicon-java-plain colored' },
    'JavaScript': { iconClass: 'devicon-javascript-plain colored' },
    'OpenCV': { iconClass: 'fas fa-eye' },


    // Backend
    'Node.js': { iconClass: 'devicon-nodejs-plain colored' },
    'Express.js': { iconClass: 'devicon-express-original' },
    'Flask': { iconClass: 'devicon-flask-original colored' },
    'REST APIs': { iconClass: 'ti ti-api', isTabler: true },

    // Frontend
    'HTML5': { iconClass: 'devicon-html5-plain colored' },
    'CSS3': { iconClass: 'devicon-css3-plain colored' },
    'Bootstrap': { iconClass: 'devicon-bootstrap-plain colored' },
    'React.js': { iconClass: 'devicon-react-original colored' },

    // AI / ML
    'TensorFlow': { iconClass: 'devicon-tensorflow-original colored' },
    'PyTorch': { iconClass: 'devicon-pytorch-original colored' },
    'Scikit-learn': { isCustomSvg: 'scikitlearn' },
    'Pandas': { isCustomSvg: 'pandas' },
    'NumPy': { isCustomSvg: 'numpy' },
    'Matplotlib': { isCustomSvg: 'matplotlib' },
    'HuggingFace': { isCustomSvg: 'huggingface' },
    'Keras': { iconClass: 'devicon-keras-original colored' },



    // Databases
    'MongoDB': { iconClass: 'devicon-mongodb-plain colored' },
    'MySQL': { iconClass: 'devicon-mysql-plain colored' },

    // Tools
    'Git': { iconClass: 'devicon-git-plain colored' },
    'GitHub': { iconClass: 'devicon-github-original' },
    'VS Code': { iconClass: 'devicon-vscode-plain colored' },
    'Jupyter Notebook': { iconClass: 'devicon-jupyter-plain colored' },
    'Google Colab': { iconClass: 'devicon-googlecolab-plain colored' },
    'Vercel': { iconClass: 'devicon-vercel-original colored' },
  };

  // Grouped Categories
  const categories = [
    {
      title: 'LANGUAGES',
      skills: ['Python', 'C', 'C++', 'Java', 'JavaScript']
    },
    {
      title: 'FRONTEND',
      skills: ['HTML5', 'CSS3', 'Bootstrap', 'React.js']
    },
    {
      title: 'BACKEND',
      skills: ['Node.js', 'Flask', 'REST APIs']
    },

    {
      title: 'DATABASES',
      skills: ['MongoDB', 'MySQL']
    },
    {
      title: 'AI / ML',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'HuggingFace']
    },

    {
      title: 'TOOLS',
      skills: ['Git', 'GitHub', 'Jupyter Notebook', 'Google Colab', 'Vercel']
    }
  ];

  const familiarSkills = [
    { name: 'Linux', iconClass: 'devicon-linux-plain' },
    { name: 'NumPy', isCustomSvg: 'numpy' },
    { name: 'Pandas', isCustomSvg: 'pandas' },
    { name: 'Matplotlib', isCustomSvg: 'matplotlib' },
    { name: 'OpenCV', isCustomSvg: 'opencv' }

  ];

  // Render method for custom inline SVGs matching official brand layouts
  const renderCustomSvg = (type) => {
    switch (type) {
      case 'scikitlearn':
        return (
          <span className="custom-svg-icon" title="scikit-learn">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Polar scatter graph lines */}
              <line x1="8" y1="12" x2="16" y2="7.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
              <line x1="8" y1="12" x2="15.5" y2="16.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
              <line x1="16" y1="7.5" x2="15.5" y2="16.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
              {/* Overlapping clustered nodes using scikit-learn official color schema */}
              <circle cx="8" cy="12" r="5.5" fill="#F7931E" />
              <circle cx="16" cy="7.5" r="4.2" fill="#29ABE2" />
              <circle cx="15.5" cy="16.5" r="4.5" fill="#8CAE3E" />
            </svg>
          </span>
        );
      case 'numpy':
        return (
          <span className="custom-svg-icon has-bg" title="NumPy">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="24" height="24" rx="4" fill="#013243" />
              {/* Grid cell details in brand hues */}
              <rect x="2.2" y="2.2" width="8.8" height="8.8" rx="1.5" fill="#4D77CF" opacity="0.9" />
              <rect x="13" y="2.2" width="8.8" height="8.8" rx="1.5" fill="#76ADDE" opacity="0.9" />
              <rect x="2.2" y="13" width="8.8" height="8.8" rx="1.5" fill="#1A365D" opacity="0.9" />
              <rect x="13" y="13" width="8.8" height="8.8" rx="1.5" fill="#4D77CF" opacity="0.9" />
              {/* Bold white N brand character centered */}
              <text x="12" y="17.5" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="900" fontSize="16" fill="#ffffff" textAnchor="middle">N</text>
            </svg>
          </span>
        );
      case 'pandas':
        return (
          <span className="custom-svg-icon has-bg" title="Pandas">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="24" height="24" rx="4" fill="#150458" />
              {/* Official brand layout pink/yellow bar indicators */}
              <rect x="4.5" y="5" width="4" height="14" rx="1.5" fill="#E70488" />
              <rect x="10" y="9" width="4" height="10" rx="1.5" fill="#FF8A00" />
              <rect x="15.5" y="12" width="4" height="7" rx="1.5" fill="#FFCA00" />
            </svg>
          </span>
        );
      case 'matplotlib':
        return (
          <span className="custom-svg-icon" title="Matplotlib">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Polar Plot concentric gridlines */}
              <circle cx="12" cy="12" r="10" stroke="#4b5563" strokeWidth="0.8" opacity="0.35" />
              <circle cx="12" cy="12" r="6.5" stroke="#4b5563" strokeWidth="0.8" opacity="0.35" />
              <circle cx="12" cy="12" r="3" stroke="#4b5563" strokeWidth="0.8" opacity="0.35" />
              {/* Spider axes lines */}
              <line x1="12" y1="2" x2="12" y2="22" stroke="#4b5563" strokeWidth="0.8" opacity="0.35" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="#4b5563" strokeWidth="0.8" opacity="0.35" />
              {/* Polygon chart representation and brand nodes */}
              <polygon points="12,5 18.5,8.5 16.5,16.5 12,18 6,15 5.5,10" fill="#11557c" fillOpacity="0.45" stroke="#11557c" strokeWidth="1.8" />
              <circle cx="12" cy="5" r="1.3" fill="#f89939" />
              <circle cx="18.5" cy="8.5" r="1.3" fill="#f89939" />
              <circle cx="16.5" cy="16.5" r="1.3" fill="#f89939" />
              <circle cx="12" cy="18" r="1.3" fill="#f89939" />
              <circle cx="6" cy="15" r="1.3" fill="#f89939" />
              <circle cx="5.5" cy="10" r="1.3" fill="#f89939" />
            </svg>
          </span>
        );
      case 'huggingface':
        return (
          <span className="custom-svg-icon" title="Hugging Face">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Happy emoji layout face shape */}
              <circle cx="12" cy="11" r="8.5" fill="#FFD043" stroke="#e0a800" strokeWidth="0.5" />
              <circle cx="7" cy="12.5" r="1.8" fill="#FF8A8A" opacity="0.65" />
              <circle cx="17" cy="12.5" r="1.8" fill="#FF8A8A" opacity="0.65" />
              {/* Face details: Eyes and mouth */}
              <path d="M7.5 9.5C8 8.8 9 8.8 9.5 9.5" stroke="#4A3400" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14.5 9.5C15 8.8 16 8.8 16.5 9.5" stroke="#4A3400" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9.5 13.2C10.5 14.8 13.5 14.8 14.5 13.2" stroke="#4A3400" strokeWidth="1.5" strokeLinecap="round" />
              {/* Hugging hands outspread */}
              <path d="M1.5 12.5C1 13.5 1.5 14.5 2.5 15.5C3.5 16 4.5 15 4 14C3.5 13 2 12 1.5 12.5Z" fill="#FFA000" stroke="#4A3400" strokeWidth="1" strokeLinejoin="round" />
              <path d="M22.5 12.5C23 13.5 22.5 14.5 21.5 15.5C20.5 16 19.5 15 20 14C20.5 13 22 12 22.5 12.5Z" fill="#FFA000" stroke="#4A3400" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - var(--nav-height) - 150px)' }}>
      {/* Self-contained styling for the redesigned unified layout */}
      <style>{`
        .page-subtitle {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          color: #94a3b8;
          margin-top: 4px;
          margin-bottom: 2rem;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        [data-theme="dark"] .page-subtitle {
          color: #475569;
        }

        .skills-category-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          align-items: stretch;
          margin-top: 2rem;
          width: 100%;
        }

        /* Card container - Grows vertically, left-aligned, Notion-style styling */
        .skill-card {
          background-color: #ffffff;
          border: 1px solid #e8ecf0;
          border-radius: 14px;
          padding: 1.25rem;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          height: auto;
          opacity: 0;
          animation: skillCardFadeIn 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        @keyframes skillCardFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html[data-theme='dark'] .skill-card {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
        }

        .skill-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          border-color: #d1d9e0;
        }

        html[data-theme='dark'] .skill-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
          border-color: #475569;
        }

        /* Card header style */
        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .category-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #94a3b8;
        }

        html[data-theme='dark'] .category-dot {
          background-color: #64748b;
        }

        .category-title {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.12em;
        }

        html[data-theme='dark'] .category-title {
          color: var(--text-muted);
        }

        /* Pill Grid Container */
        .skill-pill-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 100%;
        }

        /* Base Pill Style - Notion/Linear monochrome look */
        .skill-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          box-sizing: border-box;
          height: 40px;
          width: 100%;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #1e293b;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          transition: background-color 0.15s ease, border-color 0.15s ease;
          cursor: default;
        }

        html[data-theme='dark'] .skill-pill {
          background-color: #1e293b;
          border: 1px solid #334155;
          color: #e2e8f0;
        }

        .skill-pill:hover {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
        }

        html[data-theme='dark'] .skill-pill:hover {
          background-color: #334155;
          border-color: #475569;
        }

        /* Spans 2 columns if last and odd */
        .skill-pill:last-child:nth-child(odd) {
          grid-column: span 2;
        }

        /* Icon standard sizing and centering */
        .skill-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          vertical-align: middle;
          transition: filter 0.25s cubic-bezier(0.25, 1, 0.5, 1),
                      opacity 0.25s cubic-bezier(0.25, 1, 0.5, 1),
                      color 0.25s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Devicons start with saturation/brightness visual pop filter */
        .skill-icon:not(.tabler-icon-tint):not(.custom-svg-icon) {
          filter: saturate(2) brightness(1.3);
          opacity: 0.9;
        }

        /* Tabler outline icons tinted neutrally */
        .skill-icon.tabler-icon-tint {
          color: currentColor;
          opacity: 0.8;
        }

        /* Custom SVG Icon Container & Styling */
        .custom-svg-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1),
                      filter 0.25s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .custom-svg-icon svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .custom-svg-icon.has-bg {
          border-radius: 4px;
          overflow: hidden;
        }

        /* Responsive Columns */
        @media (max-width: 900px) {
          .skills-category-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .skills-category-grid {
            grid-template-columns: 1fr;
          }
        }

        :root {
          --color-background-secondary: var(--bg-secondary);
          --color-border-tertiary: var(--border-color);
          --color-text-primary: var(--text-primary);
          --color-text-secondary: var(--text-secondary);
          --color-background-tertiary: var(--bg-card-hover);
          --color-border-secondary: var(--border-hover);
        }

        .familiar-divider {
          width: 100%;
          height: 1px;
          background: var(--color-border-tertiary);
          margin: 2.5rem 0 2rem;
        }

        .familiar-label {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          letter-spacing: .18em;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .familiar-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .fam-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 12px;
          height: 32px;
          background: var(--color-background-secondary);
          border: 0.5px solid var(--color-border-tertiary);
          border-radius: 8px;
          cursor: default;
          transition: all 0.15s ease;
        }

        .fam-badge:hover {
          background: var(--color-background-tertiary);
          border-color: var(--color-border-secondary);
        }

        .fam-badge i {
          font-size: 16px;
          color: var(--color-text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
        }

        .fam-badge .icon-svg {
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .fam-badge .custom-svg-icon {
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .fam-name {
          font-size: 13px;
          font-weight: 400;
          color: var(--color-text-primary);
          font-family: 'Courier New', monospace;
          text-align: center;
          white-space: nowrap;
        }
      `}</style>

      <div className="container">
        <div style={{ width: '100%' }}>
          {/* Main skills page section header */}
          <div className="section-header">
            <h2 className="section-title">skills</h2>
            <p className="page-subtitle">everything i work with.</p>
          </div>

          {/* Staggered card grid layout for grouped category cards */}
          <div className="skills-category-grid">
            {categories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="skill-card card-hover-glow"
                style={{
                  animationDelay: `${categoryIndex * 80}ms`
                }}
              >
                <div className="card-header">
                  <div className="category-dot" />
                  <span className="category-title">{category.title}</span>
                </div>
                <div className="skill-pill-container">
                  {category.skills.map((skillName, skillIndex) => {
                    const def = skillDefinitions[skillName];
                    if (!def) return null;
                    return (
                      <div
                        key={skillIndex}
                        className="skill-pill"
                      >
                        {def.isCustomSvg ? (
                          renderCustomSvg(def.isCustomSvg)
                        ) : (
                          <i className={`${def.iconClass} skill-icon ${def.isTabler ? 'tabler-icon-tint' : ''}`} aria-hidden="true"></i>
                        )}
                        <span>{skillName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="familiar-divider"></div>
          <p className="familiar-label">// also familiar with</p>
          <div className="familiar-grid">
            {familiarSkills.map((skill, index) => (
              <div key={index} className="fam-badge">
                {skill.isCustomSvg ? (
                  <span className="icon-svg">{renderCustomSvg(skill.isCustomSvg)}</span>
                ) : (
                  <i className={skill.iconClass} aria-hidden="true" />
                )}
                <span className="fam-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
