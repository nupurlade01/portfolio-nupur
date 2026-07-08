import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Magnetic } from '../components/Magnetic';
import ContributionGraph from '../components/ContributionGraph';
import GitHubStats from '../components/GitHubStats';

// Configure your LeetCode username and join date here
const LEETCODE_USERNAME = 'nupurlade01';
const LEETCODE_JOIN_DATE = '2023-11-15'; // Source of truth: YYYY-MM-DD

const StatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState('leetcode'); // 'leetcode' or 'github'

  // Calculate days since joining LeetCode
  const getDaysSinceJoining = () => {
    const joinDate = stats?.joinTimestamp
      ? new Date(Number(stats.joinTimestamp) * 1000)
      : new Date(LEETCODE_JOIN_DATE);
    const today = new Date();
    const diffTime = Math.max(0, today - joinDate);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysSinceJoining = getDaysSinceJoining();

  const fetchLeetCodeStats = () => {
    setLoading(true);
    setError(false);
    const now = Date.now();
    const CACHE_KEY = `leetcode_stats_${LEETCODE_USERNAME}`;
    const TIMESTAMP_KEY = `leetcode_stats_${LEETCODE_USERNAME}_timestamp`;

    Promise.all([
      fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}`).then((r) => {
        if (!r.ok) throw new Error('Basic profile fetch failed');
        return r.json();
      }),
      fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/profile`).then((r) => {
        if (!r.ok) throw new Error('Detailed profile fetch failed');
        return r.json();
      }),
      fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/badges`).then((r) => {
        if (!r.ok) throw new Error('Badges fetch failed');
        return r.json();
      })
    ])
      .then(([basic, profile, badges]) => {
        const combinedData = {
          username: basic.username || LEETCODE_USERNAME,
          name: basic.name || 'Nupur Lade',
          avatar: basic.avatar,
          ranking: basic.ranking || profile.ranking,
          totalSolved: profile.totalSolved,
          totalQuestions: profile.totalQuestions,
          easySolved: profile.easySolved,
          totalEasy: profile.totalEasy,
          mediumSolved: profile.mediumSolved,
          totalMedium: profile.totalMedium,
          hardSolved: profile.hardSolved,
          totalHard: profile.totalHard,
          totalSubmissions: profile.totalSubmissions,
          matchedUserStats: profile.matchedUserStats,
          badges: badges.badges || [],
          joinTimestamp: basic.joinTimestamp || profile.joinTimestamp || Math.floor(new Date(LEETCODE_JOIN_DATE).getTime() / 1000),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(combinedData));
        localStorage.setItem(TIMESTAMP_KEY, now.toString());
        setStats(combinedData);
        setLastUpdated(new Date(now).toLocaleDateString());
        setError(false);
      })
      .catch((err) => {
        console.error('Error fetching LeetCode stats:', err);
        setError(true);
        // Attempt to load from expired cache as fallback
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
        if (cachedData) {
          setStats(JSON.parse(cachedData));
          if (cachedTimestamp) {
            setLastUpdated(new Date(parseInt(cachedTimestamp, 10)).toLocaleDateString() + ' (cached fallback)');
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const CACHE_KEY = `leetcode_stats_${LEETCODE_USERNAME}`;
    const TIMESTAMP_KEY = `leetcode_stats_${LEETCODE_USERNAME}_timestamp`;
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
    const now = Date.now();

    if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp, 10) < ONE_DAY)) {
      setStats(JSON.parse(cachedData));
      setLastUpdated(new Date(parseInt(cachedTimestamp, 10)).toLocaleDateString());
      setLoading(false);
    } else {
      fetchLeetCodeStats();
    }
  }, []);

  const renderLeetCodeContent = () => {
    if (loading) {
      return (
        <div className="lc-profile-container">
          {/* Profile Header Skeleton */}
          <div className="lc-card skeleton-pulse" style={{ height: '90px', border: '1px solid var(--lc-card-border)' }} />

          {/* Solved Stats Grid Skeleton */}
          <div className="lc-solved-grid">
            <div className="lc-card skeleton-pulse" style={{ height: '240px', border: '1px solid var(--lc-card-border)' }} />
            <div className="lc-card skeleton-pulse" style={{ height: '240px', border: '1px solid var(--lc-card-border)' }} />
          </div>

          {/* Badges Section Skeleton */}
          <div className="lc-badges-section">
            <div className="skeleton-pulse" style={{ height: '20px', width: '80px', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ display: 'flex', gap: '12px', overflowX: 'hidden' }}>
              <div className="lc-card skeleton-pulse" style={{ height: '110px', width: '110px', flexShrink: 0, border: '1px solid var(--lc-card-border)' }} />
              <div className="lc-card skeleton-pulse" style={{ height: '110px', width: '110px', flexShrink: 0, border: '1px solid var(--lc-card-border)' }} />
              <div className="lc-card skeleton-pulse" style={{ height: '110px', width: '110px', flexShrink: 0, border: '1px solid var(--lc-card-border)' }} />
            </div>
          </div>
        </div>
      );
    }

    if (error && !stats) {
      return (
        <div className="lc-card lc-error-container">
          <p style={{ color: 'var(--lc-text-primary)', fontWeight: '600' }}>Could not load LeetCode statistics.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--lc-text-muted)', marginBottom: '0.5rem' }}>The API wrapper appears to be offline or returned an error.</p>
          <button className="lc-retry-btn" onClick={fetchLeetCodeStats}>Retry</button>
        </div>
      );
    }

    // Normal rendering
    const totalSolved = stats?.totalSolved ?? 89;
    const totalQuestions = stats?.totalQuestions ?? 3977;
    const easySolved = stats?.easySolved ?? 52;
    const totalEasy = stats?.totalEasy ?? 951;
    const mediumSolved = stats?.mediumSolved ?? 35;
    const totalMedium = stats?.totalMedium ?? 2077;
    const hardSolved = stats?.hardSolved ?? 2;
    const totalHard = stats?.totalHard ?? 949;

    const circumference = 2 * Math.PI * 45;
    const easyDash = totalQuestions > 0 ? (easySolved / totalQuestions) * circumference : 0;
    const mediumDash = totalQuestions > 0 ? (mediumSolved / totalQuestions) * circumference : 0;
    const hardDash = totalQuestions > 0 ? (hardSolved / totalQuestions) * circumference : 0;

    const acSubmissions = stats?.matchedUserStats?.acSubmissionNum?.[0]?.submissions ?? stats?.acSubmissionNum?.[0]?.submissions ?? 138;
    const totalSubmissions = stats?.matchedUserStats?.totalSubmissionNum?.[0]?.submissions ?? stats?.totalSubmissions?.[0]?.submissions ?? 160;
    const acceptanceRate = totalSubmissions > 0 ? ((acSubmissions / totalSubmissions) * 100).toFixed(1) : "62.4";

    const easyPercentage = totalEasy > 0 ? (easySolved / totalEasy) * 100 : 0;
    const mediumPercentage = totalMedium > 0 ? (mediumSolved / totalMedium) * 100 : 0;
    const hardPercentage = totalHard > 0 ? (hardSolved / totalHard) * 100 : 0;

    const badges = stats?.badges ?? [];

    return (
      <div className="lc-profile-container">
        {/* Profile Header Card */}
        <div className="lc-card lc-profile-header">
          <div className="lc-profile-avatar-container">
            {stats?.avatar && stats.avatar !== 'https://assets.leetcode.com/users/default_avatar.jpg' ? (
              <img src={stats.avatar} alt="Avatar" className="lc-profile-avatar" />
            ) : (
              <div className="lc-profile-avatar-placeholder">NL</div>
            )}
          </div>
          <div className="lc-profile-info">
            <div className="lc-profile-name">{stats?.name && stats.name !== 'nupurlade01' ? stats.name : 'Nupur Lade'}</div>
            <div className="lc-profile-username">@{stats?.username ?? LEETCODE_USERNAME}</div>
            <div className="lc-profile-meta">
              <span className="lc-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginRight: '4px', display: 'inline', verticalAlign: 'middle', color: '#ffa116' }}>
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4a7 7 0 0 0-7-7z" />
                </svg>
                ranking: #{stats?.ranking ? stats.ranking.toLocaleString() : '1,716,614'}
              </span>
              <span className="lc-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginRight: '4px', display: 'inline', verticalAlign: 'middle', color: 'var(--text-muted)' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {daysSinceJoining} days active
              </span>
            </div>
          </div>
        </div>

        {/* Solved Stats (2-column) */}
        <div className="lc-solved-grid">
          {/* Left: Donut Chart Card */}
          <div className="lc-card lc-donut-card">
            <div className="lc-donut-title">solved problems</div>
            <div className="lc-donut-chart-container">
              <svg width="120" height="120">
                <circle cx="60" cy="60" r="45" fill="transparent" stroke="var(--lc-bar-track)" strokeWidth="8" />
                <circle cx="60" cy="60" r="45" fill="transparent" stroke="#00b8a3" strokeWidth="8" strokeDasharray={`${easyDash} ${circumference}`} strokeDashoffset="0" transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="transparent" stroke="#ffa116" strokeWidth="8" strokeDasharray={`${mediumDash} ${circumference}`} strokeDashoffset={-easyDash} transform="rotate(-90 60 60)" />
                <circle cx="60" cy="60" r="45" fill="transparent" stroke="#ef4743" strokeWidth="8" strokeDasharray={`${hardDash} ${circumference}`} strokeDashoffset={-(easyDash + mediumDash)} transform="rotate(-90 60 60)" />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--lc-text-primary)' }}>{totalSolved}</span>
                <span style={{ fontSize: '10px', color: 'var(--lc-text-muted)', textTransform: 'lowercase', letterSpacing: '0.05em', marginTop: '-2px' }}>solved</span>
              </div>
            </div>

            <div className="lc-donut-chips">
              <div className="lc-chip lc-chip-easy">easy {easySolved}/{totalEasy}</div>
              <div className="lc-chip lc-chip-medium">med {mediumSolved}/{totalMedium}</div>
              <div className="lc-chip lc-chip-hard">hard {hardSolved}/{totalHard}</div>
            </div>
          </div>

          {/* Right: Difficulty Progress Bars Card */}
          <div className="lc-card lc-bars-card">
            <div className="lc-bar-row">
              <div className="lc-bar-labels">
                <span className="lc-bar-label-easy">easy</span>
                <span className="lc-bar-value">{easySolved}<span style={{ color: 'var(--lc-text-muted)', fontWeight: '400', fontSize: '0.8rem' }}>/{totalEasy}</span></span>
              </div>
              <div className="lc-bar-track">
                <div className="lc-bar-fill lc-bar-fill-easy" style={{ width: `${easyPercentage}%` }} />
              </div>
            </div>

            <div className="lc-bar-row">
              <div className="lc-bar-labels">
                <span className="lc-bar-label-medium">medium</span>
                <span className="lc-bar-value">{mediumSolved}<span style={{ color: 'var(--lc-text-muted)', fontWeight: '400', fontSize: '0.8rem' }}>/{totalMedium}</span></span>
              </div>
              <div className="lc-bar-track">
                <div className="lc-bar-fill lc-bar-fill-medium" style={{ width: `${mediumPercentage}%` }} />
              </div>
            </div>

            <div className="lc-bar-row">
              <div className="lc-bar-labels">
                <span className="lc-bar-label-hard">hard</span>
                <span className="lc-bar-value">{hardSolved}<span style={{ color: 'var(--lc-text-muted)', fontWeight: '400', fontSize: '0.8rem' }}>/{totalHard}</span></span>
              </div>
              <div className="lc-bar-track">
                <div className="lc-bar-fill lc-bar-fill-hard" style={{ width: `${hardPercentage}%` }} />
              </div>
            </div>

            <div className="lc-acceptance">
              acceptance rate: <span style={{ fontWeight: '600', color: 'var(--lc-text-primary)' }}>{acceptanceRate}%</span>
            </div>
          </div>
        </div>

        {/* Section 3 — Badges */}
        {badges.length > 0 && (
          <div className="lc-badges-section">
            <div className="lc-badges-title">🏅 badges</div>
            <div className="lc-badges-row">
              {badges.map((badge, idx) => (
                <div key={idx} className="lc-badge-card">
                  <img src={badge.icon} alt={badge.displayName} className="lc-badge-icon" />
                  <span className="lc-badge-name">{badge.displayName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      {/* Self-contained tabs and LeetCode styles */}
      <style>{`
        :root {
          --lc-card-bg: #ffffff;
          --lc-card-border: #e2e8f0;
          --lc-text-primary: #0f172a;
          --lc-text-muted: #64748b;
          --lc-bar-track: #f1f5f9;
        }

        html[data-theme="dark"] {
          --lc-card-bg: #111827;
          --lc-card-border: #1e293b;
          --lc-text-primary: #e2e8f0;
          --lc-text-muted: #475569;
          --lc-bar-track: #1e293b;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s infinite ease-in-out;
          background-color: var(--lc-bar-track) !important;
          border-color: var(--lc-card-border) !important;
        }

        .lc-profile-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        .lc-card {
          background-color: var(--lc-card-bg);
          border: 1px solid var(--lc-card-border);
          border-radius: 12px;
          padding: 1.5rem;
          color: var(--lc-text-primary);
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
        }

        .lc-profile-header {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .lc-profile-avatar-container {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
        }

        .lc-profile-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffa116;
        }

        .lc-profile-avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #ffa116;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          border: 2px solid #ffa116;
        }

        .lc-profile-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .lc-profile-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--lc-text-primary);
        }

        .lc-profile-username {
          font-size: 0.85rem;
          color: var(--lc-text-muted);
        }

        .lc-profile-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.25rem;
          font-size: 0.8rem;
          color: var(--lc-text-muted);
        }

        .lc-meta-item {
          display: flex;
          align-items: center;
        }

        .lc-solved-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .lc-solved-grid {
            grid-template-columns: 1fr 1.5fr;
          }
        }

        .lc-donut-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1.25rem;
        }

        .lc-donut-title {
          align-self: flex-start;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--lc-text-primary);
          text-transform: lowercase;
        }

        .lc-donut-chart-container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .lc-donut-chips {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          width: 100%;
        }

        .lc-chip {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-weight: 600;
          text-transform: lowercase;
        }

        .lc-chip-easy {
          background-color: rgba(0, 184, 163, 0.1);
          color: #00b8a3;
        }

        .lc-chip-medium {
          background-color: rgba(255, 161, 22, 0.1);
          color: #ffa116;
        }

        .lc-chip-hard {
          background-color: rgba(239, 71, 67, 0.1);
          color: #ef4743;
        }

        .lc-bars-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          justify-content: center;
        }

        .lc-bar-row {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .lc-bar-labels {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.85rem;
          text-transform: lowercase;
        }

        .lc-bar-label-easy {
          color: #00b8a3;
          font-weight: 600;
        }

        .lc-bar-label-medium {
          color: #ffa116;
          font-weight: 600;
        }

        .lc-bar-label-hard {
          color: #ef4743;
          font-weight: 600;
        }

        .lc-bar-value {
          font-family: var(--font-mono);
          font-weight: 600;
        }

        .lc-bar-track {
          width: 100%;
          height: 8px;
          background-color: var(--lc-bar-track);
          border-radius: 999px;
          overflow: hidden;
        }

        .lc-bar-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.5s ease-out;
        }

        .lc-bar-fill-easy {
          background-color: #00b8a3;
        }

        .lc-bar-fill-medium {
          background-color: #ffa116;
        }

        .lc-bar-fill-hard {
          background-color: #ef4743;
        }

        .lc-acceptance {
          font-size: 0.8rem;
          color: var(--lc-text-muted);
          margin-top: auto;
          border-top: 1px solid var(--lc-card-border);
          padding-top: 0.75rem;
          text-transform: lowercase;
        }

        .lc-badges-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .lc-badges-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--lc-text-primary);
          text-transform: lowercase;
        }

        .lc-badges-row {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .lc-badge-card {
          flex: 0 0 auto;
          width: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
          background-color: var(--lc-card-bg);
          border: 1px solid var(--lc-card-border);
          border-radius: 12px;
          padding: 12px;
          transition: border-color var(--transition-fast);
        }

        .lc-badge-card:hover {
          border-color: #ffa116;
        }

        .lc-badge-icon {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }

        .lc-badge-name {
          font-size: 11px;
          color: var(--lc-text-muted);
          line-height: 1.2;
        }

        .lc-error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
          text-align: center;
        }

        .lc-retry-btn {
          background-color: #ffa116;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: opacity 0.15s ease;
        }

        .lc-retry-btn:hover {
          opacity: 0.9;
        }

        .stats-tab-selector {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.1rem;
        }
        .stats-tab-button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          padding-bottom: 0.5rem;
          position: relative;
          text-transform: lowercase;
          transition: color var(--transition-fast);
        }
        .stats-tab-button:hover {
          color: var(--text-primary);
        }
        .stats-tab-button.active {
          color: var(--clr-accent);
        }
        .stats-tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--clr-accent);
        }
      `}</style>

      <div className="container back-link-container">
        <Magnetic max={8}>
          <Link to="/" className="back-home-link" aria-label="Back to home page">
            ← back to home
          </Link>
        </Magnetic>
      </div>

      <section className="section" style={{ background: 'var(--bg-secondary)', minHeight: 'calc(100vh - var(--nav-height) - 150px)' }}>
        <div className="container">
          <div style={{ width: '100%' }}>
            {/* Page Header */}
            <div className="section-header">
              <h2 className="section-title">stats</h2>
            </div>

            {/* Tab Selector */}
            <div className="stats-tab-selector">
              <button
                className={`stats-tab-button ${activeTab === 'leetcode' ? 'active' : ''}`}
                onClick={() => setActiveTab('leetcode')}
              >
                leetcode stats
              </button>
              <button
                className={`stats-tab-button ${activeTab === 'github' ? 'active' : ''}`}
                onClick={() => setActiveTab('github')}
              >
                github stats
              </button>
            </div>

            {activeTab === 'leetcode' ? (
              <>
                {renderLeetCodeContent()}

                {/* DO NOT MODIFY ANYTHING BELOW THIS LINE */}
                <ContributionGraph username="nupurlade01" />
                {/* DO NOT MODIFY ANYTHING ABOVE THIS LINE */}

                {/* Footer with Username Link & Last Updated */}
                <div className="stats-footer">
                  <p style={{ marginBottom: '0.5rem' }}>
                    profile:{' '}
                    <a
                      href={`https://leetcode.com/u/${LEETCODE_USERNAME}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stats-link"
                    >
                      leetcode.com/{LEETCODE_USERNAME}
                    </a>
                  </p>
                  {lastUpdated && (
                    <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      last updated: {lastUpdated}
                    </p>
                  )}
                  {error && !stats && (
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>
                      notice: live statistics are temporarily unavailable. showing calculated days counter only.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <GitHubStats username="nupurlade01" />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatsPage;
