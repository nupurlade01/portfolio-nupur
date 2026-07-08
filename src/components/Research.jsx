import { Magnetic } from './Magnetic';

const Research = () => {
  const papersList = [
    {
      title: 'TatvAI — Multimodal AI News Analysis Platform',
      conference: 'ETLTC-ICETM 2026',
      status: 'Accepted',
      shortDesc: 'Real-time multimodal AI system for news summarization, analysis and verification.',
      abstractSnippet: 'The increasing popularity of digital news and multimedia content has further accentuated the problems of information overload, misinformation, and multilingual support.This paper introduces TatvAI, a real- time multimodal AI - powered news intelligence system that aims to summarize, analyze, and verify multimedia news content.',
      fullAbstract: 'The increasing popularity of digital news and multimedia content has further accentuated the problems of information overload, misinformation, and multilingual support.This paper introduces TatvAI, a real- time multimodal AI - powered news intelligence system that aims to summarize, analyze, and verify multimedia news content.The proposed system combines speech recognition using Whisper, multimodal summarization using transformer - based models(BART and LLaMA - 2), and a fine - tuned BERT classifier for misinformation detection.Additionally, a lightweight transformer - based temporal prediction model is integrated to predict possible developments in ongoing news stories.The system also enables multilingual summary generation in Hindi and Marathi using neural machine translation.Experimental results, performed on more than 300 multimedia news samples, yielded a ROUGE - L score of 0.92 for summarization, an F1 - score of 0.87 for fake news detection, and a Word Error Rate (WER) of 8.2 % for speech transcription.The average processing time for a 5 - minute video was 6.5 seconds, indicating near real - time processing.The experimental results confirm the efficacy, robustness, and scalability of the proposed multimodal system for real - world news intelligence task',
      link: 'tatvai_rp.pdf'
    },
    {
      title: 'FlowWave-AI — Adaptive Traffic Signal Optimization Framework',
      conference: 'ETLTC-ICETM 2026',
      status: 'Accepted',
      shortDesc: 'Adaptive AI framework for intelligent traffic signal optimization in smart cities.',
      abstractSnippet: 'Urban traffic congestion and delays faced by emergency vehicles pose critical challenges to modern cities. Conventional Traffic Management Systems (TMS) are typically static, unscalable, and lack real-time, multi-stakeholder data synchronization.',
      fullAbstract: 'Urban traffic congestion and delays faced by emergency vehicles pose critical challenges to modern cities. Conventional Traffic Management Systems (TMS) are typically static, unscalable, and lack real-time, multi-stakeholder data synchronization. This paper introduces FlowWave-AI, a cloud-native Intelligent Traffic Management System (ITMS) designed on a modern web architecture. The system employs React for its responsive frontend and Supabase as a backend-as-a-service (BaaS), offering a scalable PostgreSQL database, real-time data streaming, and serverless edge functions. These functions execute the core control logic, including a novel physics- informed Green Signal Time (GST) calculation formula that dynamically adapts signal durations based on real-time traffic and emergency vehicle conditions. The system’s primary innovation lies in its multi-role, three-dashboard framework: (1) an Authority Dashboard for centralized monitoring and manual control; (2) an Emergency Dashboard that enables drivers to request a “Dynamic Green Corridor” automatically prioritizing signals along their route; and (3) a Citizen Dashboard that enhances public transparency. The control logic was validated using SUMO simulations, demonstrating substantial performance improvements over conventional fixed-time controllers. FlowWave-AI provides a scalable, data-driven, and practical platform integrating real-time mapping with cloud-based intelligence to reduce emergency response times and enhance urban mobility..',
      link: 'flowWave_RP.pdf'
    }
  ];

  return (
    <section id="research" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">research</h2>
        </div>

        <div className="research-grid">
          {papersList.map((paper, index) => (
            <PaperCard key={index} paper={paper} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PaperCard = ({ paper }) => {
  return (
    <div className="research-card card-hover-glow">
      {/* Header and status info */}
      <div className="research-card-header">
        <div className="research-meta">
          <span className="status-badge status-accepted">
            {paper.status.toLowerCase()}
          </span>
          <span className="research-duration">// {paper.conference}</span>
        </div>
        <h3 className="research-title">{paper.title}</h3>
      </div>

      <p className="card-short-desc">{paper.shortDesc}</p>

      {/* Action Buttons */}
      <div className="research-links card-btn-row">
        <Magnetic max={8}>
          <a
            href={paper.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '12px', height: '12px' }}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            View Paper
          </a>
        </Magnetic>
      </div>
    </div>
  );
};

export default Research;
