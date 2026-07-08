import React from 'react';

const About = () => {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">about me</h2>
        </div>

        <div className="about-grid">
          <div className="about-tabs-container card-hover-glow">
            <p className="about-text" style={{ marginBottom: '1rem' }}>
              I am a B.Tech CSE (AI & ML) student at Vishwakarma Institute of Technology, Pune, with a CGPA of 9.33. I have a strong interest in machine learning, deep learning, and intelligent systems. I enjoy exploring new ideas and turning them into functional solutions through research, experimentation, and software development.            </p>
            <p className="about-text">
              My research includes two accepted conference papers, TatvAI and FlowWave-AI, at ETLTC-ICETM 2026, reflecting my passion for applying artificial intelligence to solve meaningful problems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
