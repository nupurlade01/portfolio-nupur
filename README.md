# Nupur Lade — Personal Portfolio

A sleek, premium, and fully responsive personal portfolio website showcasing AI/ML projects, research papers, technical skills etc.

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel Deployed](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## 🔗 Live Demo

You can explore the live deployment of the website here:
👉 **[https://your-portfolio.vercel.app](https://portfolio-nupur.vercel.app)**  


---

## 📖 About the Project

This personal portfolio is a web application designed to present a comprehensive overview of academic and professional achievements. It serves as a modern, interactive digital CV tailored for showcasing complex machine learning models, research papers, data engineering pipelines, certifications, and technical skills. Built with a focus on rich aesthetics and micro-interactions, it provides recruiters and collaborators with an engaging browsing experience.

---

## ✨ Features

- **Multi-Page Routing**: Powered by React Router for swift, seamless transitions between sections without full page reloads.
- **Dark/Light Mode Toggle**: Dynamic theme switching that adapts fluidly to user preference with smooth CSS transitions.
- **Letter-Scramble Hover Effect**: A clean, premium micro-animation on the navigation links that scrambles characters on hover.
- **Interactive Project Cards**: Card grids featuring a "View Details" drawer that slides out to present comprehensive project descriptions, key challenges, and code repositories.
- **PDF Resume Embed & Download**: Integrates a responsive PDF viewer to review the resume directly in the browser, along with a quick download link.
- **Centrally Placed Back to Top Button**: A subtle, inline utility button above the footer to quickly return users to the top of the page.
- **Fully Responsive Layout**: Hand-crafted CSS using flexbox, grid systems, and custom media queries for a seamless look on mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

| Category | Technologies / Libraries Used |
| :--- | :--- |
| **Frontend** | [React 19](https://react.dev/), [Vite](https://vite.dev/), [React Router v7](https://reactrouter.com/) |
| **Styling** | Vanilla CSS (CSS Variables, Flexbox, CSS Grid) |
| **Icons & Brand Logos** | [React Icons](https://react-icons.github.io/react-icons/) & [Devicons](https://vorillaz.github.io/devicons/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

Below is the directory tree highlighting the key assets, components, pages, and entry points of the repository:

```text
portfolio-nupur/
├── public/
│   ├── favicon.svg             # Website favicon
│   ├── resume.pdf              # Real PDF Resume (Embedded on the Resume page)
│   ├── edulytics.jpeg          # Project / Research thumbnails
│   ├── plantguard.png
│   └── ...
├── src/
│   ├── assets/                 # Local image and media assets
│   ├── components/             # Reusable UI components
│   │   ├── BackToTopInline.jsx # Centered return-to-top button
│   │   ├── ContributionGraph.jsx
│   │   ├── GitHubStats.jsx     # Dynamic github details
│   │   ├── Hero.jsx            # Home banner content
│   │   ├── Navbar.jsx          # Header navigation with scramble effect
│   │   ├── Projects.jsx
│   │   ├── Research.jsx
│   │   └── Skills.jsx
│   ├── pages/                  # Full-page views
│   │   ├── Experience.jsx      # Work & education history timeline
│   │   ├── Home.jsx            # Landing page
│   │   ├── ProjectsPage.jsx    # Projects overview
│   │   ├── ResumePage.jsx      # Resume embedding & viewing page
│   │   ├── SkillsPage.jsx      # Detailed technical competencies page
│   │   └── StatsPage.jsx       # Custom analytics and contribution metrics
│   ├── App.jsx                 # Application entry point & router config
│   ├── index.css               # Global variables, base typography, and themes
│   └── main.jsx                # DOM mounting entry point
├── eslint.config.js            # Linter configuration
├── index.html                  # HTML template
├── package.json                # Project dependencies and script runner
└── vite.config.js              # Vite bundler configuration
