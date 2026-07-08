import React from 'react';
import { Magnetic } from './Magnetic';

const Projects = () => {
  const projectsList = [
    {
      title: 'Edulytics',
      duration: 'Jun 2026 - Present',
      description: 'A full-stack AI-driven answer sheet evaluation system that extracts text from scanned papers, grades responses using rubric-based assessment, and provides analytics for teachers through an intuitive dashboard.',
      techStack: ['Node.js', 'Express.js', 'Gemini AI', 'Chart.js'],
      githubLink: 'https://github.com/nupurlade01/Edulytics',
      image: 'edulytics.jpeg',
      isPlaceholder: false
    },
    {
      title: 'Plantguard AI',
      duration: 'Feb 2026 – Apr 2026',
      description: 'AI-powered plant disease detection system that analyzes leaf images using CNNs and transfer learning to identify diseases and provide treatment recommendations.',
      techStack: ['Python', 'TensorFlow', 'CNN', 'ResNet50'],
      githubLink: 'https://github.com/nupurlade/',
      image: 'plantguard.jpeg',
      isPlaceholder: false
    },
    {
      title: 'TatvAI',
      duration: 'Sept - Dec 2025',
      description: 'AI-driven news analysis platform that summarizes content, identifies trends, and generates predictive insights from real-time information.',
      techStack: ['Node.js', 'Express.js', 'Python', 'Flask'],
      githubLink: 'https://github.com/nupurlade01/TATV-AI',
      image: 'tatvai.jpeg',
      isPlaceholder: false
    },
    {
      title: 'Resource Monitoring System',
      duration: 'Mar - Apr 2026',
      description: 'System monitoring dashboard that provides real-time insights into CPU, memory, disk, and process performance through native system integration and intelligent analytics.',
      techStack: ['Java', 'JavaFX', 'C (JNI)', 'Windows API'],
      githubLink: 'https://github.com/nupurlade01/Resource-Monitoring-System',
      image: 'resource_monitoring.jpeg',
      isPlaceholder: false
    },
    {
      title: 'SkillXchange',
      duration: 'Oct - Nov 2025',
      description: 'A collaborative platform that enables students to exchange skills, discover teammates, and connect for projects, hackathons, and peer learning opportunities.',
      techStack: ['Python', 'Flask', 'HTML', 'CSS', 'MySQL'],
      githubLink: 'https://github.com/nupurlade01/Skill-Swap',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      isPlaceholder: false
    },
    {
      title: 'FlowWave-Ai',
      duration: 'Feb - Mar 2024',
      description: 'AI-driven traffic management system that analyzes traffic patterns and optimizes traffic signal timings to reduce congestion and improve traffic flow.',
      techStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite'],
      githubLink: 'https://github.com/nupurlade01/FlowWave-Ai',
      image: 'traffic.jpeg',
      isPlaceholder: false
    },

  ];

  return (
    <section id="projects" className="section">
      <style>{`
        #projects .container {
          max-width: 1200px;
        }
        #projects .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          max-width: 100%;
        }
        @media (min-width: 768px) {
          #projects .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          #projects .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        #projects .project-card {
          padding: 2rem;
          border-radius: 12px;
          max-width: none;
        }
      `}</style>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">projects</h2>
        </div>

        <div className="projects-grid">
          {projectsList.map((project, index) => (
            <div key={index} className="project-card card-hover-glow">
              {/* Laptop Mockup Visual */}
              <div className="laptop-mockup">
                <div className="laptop-screen">
                  {project.isPlaceholder ? (
                    <div className="placeholder-screen">
                      <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                        <line x1="12" y1="4" x2="12" y2="20"></line>
                      </svg>
                    </div>
                  ) : project.image ? (
                    <img src={project.image} alt={`${project.title} screenshot`} className="laptop-display-image" loading="lazy" />
                  ) : (
                    <div className="placeholder-screen">
                      <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                        <line x1="10" y1="21" x2="14" y2="3"></line>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="laptop-keyboard-base"></div>
              </div>

              {/* Title & Comment Metadata */}
              <div className="project-card-header">
                <div className="project-title-group">
                  <h3 className="project-title">{project.title}</h3>
                  {project.duration && (
                    <span className="project-duration">// {project.duration}</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="project-desc">{project.description}</p>

              {/* Outlined Tech Tags */}
              <div className="project-tags">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="project-tag">{tech}</span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="project-links">
                <Magnetic max={8}>
                  <a
                    href={project.isPlaceholder ? undefined : project.githubLink}
                    target={project.isPlaceholder ? undefined : "_blank"}
                    rel={project.isPlaceholder ? undefined : "noopener noreferrer"}
                    className={`btn-pill ${project.isPlaceholder ? 'disabled' : ''}`}
                    onClick={project.isPlaceholder ? (e) => e.preventDefault() : undefined}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    Source Code
                  </a>
                </Magnetic>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
