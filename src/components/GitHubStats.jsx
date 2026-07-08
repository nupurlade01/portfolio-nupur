import React, { useState, useEffect } from 'react';

// Count-up helper component for animating numbers
const CountUp = ({ value, duration = 800 }) => {
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (typeof value !== 'number') {
      setCurrentVal(value);
      return;
    }

    let start = 0;
    const end = value;
    if (start === end) {
      setCurrentVal(end);
      return;
    }

    const totalMiliseconds = duration;
    const incrementTime = 16; // roughly 60fps
    const totalSteps = totalMiliseconds / incrementTime;
    const stepValue = (end - start) / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        setCurrentVal(end);
        clearInterval(timer);
      } else {
        setCurrentVal(Math.floor(start + stepValue * currentStep));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  if (typeof value === 'number') {
    return <span>{currentVal.toLocaleString()}</span>;
  }
  return <span>{value}</span>;
};

// Official GitHub language color palette
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  'Jupyter Notebook': '#da5b0b',
  Go: '#00add8',
  Rust: '#dea584',
  PHP: '#4f5d95',
  Ruby: '#701516',
  Dart: '#00b4ab',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Vue: '#41b883',
  SQL: '#e38c00'
};

const DEFAULT_LANG_COLOR = '#858585';

const GitHubStats = ({ username = 'nupurlade01' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Helper: Format Date object to YYYY-MM-DD
  const formatDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Live timestamp timer ticker
  useEffect(() => {
    if (!lastUpdated) return;
    const updateTime = () => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated) / 1000));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  // Generate 53-week grid cells ending on today's day-of-week (Sun-Sat rows)
  const generateGridCells = () => {
    const cells = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDayOfWeek = today.getDay();
    const totalCells = 53 * 7;
    const todayGridIndex = (52 * 7) + todayDayOfWeek;

    for (let i = 0; i < totalCells; i++) {
      const daysDiff = i - todayGridIndex;
      const date = new Date(today);
      date.setDate(today.getDate() + daysDiff);
      cells.push({
        date,
        isFuture: date > today,
        dateStr: formatDateString(date),
      });
    }
    return cells;
  };

  const cells = generateGridCells();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    const CACHE_KEY = `github_stats_${username}`;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { timestamp, data: cachedData } = JSON.parse(cached);
        const FIVE_MINUTES = 5 * 60 * 1000;
        if (Date.now() - timestamp < FIVE_MINUTES) {
          setData(cachedData);
          setLastUpdated(timestamp);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Failed parsing cached stats, fetching fresh data...', e);
      }
    }

    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;

      if (token) {
        // 1. GraphQL API Fetch (Highly detailed and single-request)
        try {
          const gqlQuery = `
            query($username: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $username) {
                avatarUrl
                bio
                createdAt
                followers {
                  totalCount
                }
                following {
                  totalCount
                }
                repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
                  nodes {
                    name
                    stargazerCount
                    forkCount
                    languages(first: 10) {
                      edges {
                        size
                        node {
                          name
                          color
                        }
                      }
                    }
                  }
                }
                contributionsCollection(from: $from, to: $to) {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                        color
                      }
                    }
                  }
                }
              }
            }
          `;

          const toDate = new Date();
          const fromDate = new Date();
          fromDate.setFullYear(fromDate.getFullYear() - 1);

          const variables = {
            username,
            to: toDate.toISOString(),
            from: fromDate.toISOString()
          };

          const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `bearer ${token}`
            },
            body: JSON.stringify({ query: gqlQuery, variables })
          });

          if (!response.ok) throw new Error('GraphQL fetch failed');
          const json = await response.json();
          if (json.errors) throw new Error(json.errors[0].message);

          const user = json.data?.user;
          if (user) {
            // Process languages
            const langMap = {};
            let totalLangSize = 0;
            user.repositories.nodes.forEach(repo => {
              repo.languages.edges.forEach(edge => {
                const name = edge.node.name;
                const size = edge.size;
                langMap[name] = (langMap[name] || 0) + size;
                totalLangSize += size;
              });
            });

            // Process calendar
            const submissionMap = {};
            user.contributionsCollection.contributionCalendar.weeks.forEach(week => {
              week.contributionDays.forEach(day => {
                submissionMap[day.date] = day.contributionCount;
              });
            });

            // Sum stars and forks
            let totalStars = 0;
            let totalForks = 0;
            user.repositories.nodes.forEach(repo => {
              totalStars += repo.stargazerCount;
              totalForks += repo.forkCount;
            });

            const parsedData = {
              avatarUrl: user.avatarUrl,
              bio: user.bio,
              createdAt: user.createdAt,
              followers: user.followers.totalCount,
              following: user.following.totalCount,
              publicRepos: user.repositories.nodes.length,
              totalStars,
              totalForks,
              totalCommits: user.contributionsCollection.contributionCalendar.totalContributions,
              languages: langMap,
              totalLangSize,
              submissionMap
            };

            const now = Date.now();
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, data: parsedData }));
            setData(parsedData);
            setLastUpdated(now);
            setLoading(false);
            return;
          }
        } catch (gqlErr) {
          console.warn('GraphQL query failed. Falling back to REST API endpoints...', gqlErr);
        }
      }

      // 2. REST API Fallback Fetch
      // Step A: Paginate all repositories
      const fetchAllRepos = async () => {
        let allRepos = [];
        let page = 1;
        while (true) {
          const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
          if (!res.ok) {
            if (res.status === 403 || res.status === 429) throw new Error('GitHub API rate limit exceeded. Please check back later.');
            throw new Error('Failed to fetch repositories.');
          }
          const data = await res.json();
          if (data.length === 0) break;
          allRepos = allRepos.concat(data);
          if (data.length < 100) break;
          page++;
        }
        return allRepos;
      };

      const [profileRes, reposRes, calendarRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`).then(r => {
          if (!r.ok) {
            if (r.status === 403 || r.status === 429) throw new Error('GitHub API rate limit exceeded. Please check back later.');
            throw new Error('Failed to fetch profile info.');
          }
          return r.json();
        }),
        fetchAllRepos(),
        fetch(`https://github-contributions-api.jogruber.de/v4/${username}`).then(r => {
          if (!r.ok) throw new Error('Failed to fetch contributions data.');
          return r.json();
        }).catch(err => {
          console.warn('Contributions scraper failed, fallback calendar initialized', err);
          return { contributions: [] };
        })
      ]);

      // Process repository stats and languages
      const langMap = {};
      let totalLangSize = 0;
      let totalStars = 0;
      let totalForks = 0;

      reposRes.forEach(repo => {
        totalStars += repo.stargazers_count;
        totalForks += repo.forks_count;
        if (repo.language) {
          // Use repo size as a rough proxy for language code volume
          const size = repo.size || 1;
          langMap[repo.language] = (langMap[repo.language] || 0) + size;
          totalLangSize += size;
        }
      });

      // Process calendar data
      const submissionMap = {};
      let totalCommits = 0;
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      if (calendarRes.contributions && calendarRes.contributions.length > 0) {
        calendarRes.contributions.forEach(day => {
          submissionMap[day.date] = day.count;
          const dayDate = new Date(day.date);
          if (dayDate >= oneYearAgo && dayDate <= today) {
            totalCommits += day.count;
          }
        });
      }

      const parsedData = {
        avatarUrl: profileRes.avatar_url,
        bio: profileRes.bio,
        createdAt: profileRes.created_at,
        followers: profileRes.followers,
        following: profileRes.following,
        publicRepos: reposRes.length,
        totalStars,
        totalForks,
        totalCommits,
        languages: langMap,
        totalLangSize,
        submissionMap
      };

      const now = Date.now();
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: now, data: parsedData }));
      setData(parsedData);
      setLastUpdated(now);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while loading GitHub stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [username]);

  // Streak calculators (reusing logic from ContributionGraph)
  const getStreaks = () => {
    if (!data || !data.submissionMap) return { currentStreak: 0, longestStreak: 0 };

    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeCells = cells.filter((c) => c.date <= today);

    activeCells.forEach((c) => {
      const count = data.submissionMap[c.dateStr] || 0;
      if (count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    // Calculate current streak backwards from today
    let currentStreak = 0;
    const checkDate = new Date(today);
    const todayCount = data.submissionMap[formatDateString(checkDate)] || 0;

    if (todayCount === 0) {
      // Check if yesterday is active
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayCount = data.submissionMap[formatDateString(checkDate)] || 0;
      if (yesterdayCount > 0) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const count = data.submissionMap[formatDateString(checkDate)] || 0;
          if (count > 0) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    } else {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
      while (true) {
        const count = data.submissionMap[formatDateString(checkDate)] || 0;
        if (count > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return { currentStreak, longestStreak };
  };

  const { currentStreak, longestStreak } = getStreaks();

  // Language percentage segment generator
  const getLanguageSegments = () => {
    if (!data || !data.languages || data.totalLangSize === 0) return [];
    const sorted = Object.entries(data.languages)
      .map(([name, size]) => ({
        name,
        size,
        percentage: (size / data.totalLangSize) * 100
      }))
      .sort((a, b) => b.size - a.size);

    if (sorted.length <= 5) return sorted;

    const top = sorted.slice(0, 5);
    const otherSize = sorted.slice(5).reduce((sum, item) => sum + item.size, 0);
    const otherPercent = (otherSize / data.totalLangSize) * 100;
    top.push({
      name: 'Other',
      size: otherSize,
      percentage: otherPercent
    });
    return top;
  };

  const languageSegments = getLanguageSegments();

  // Heatmap colors for GitHub Theme
  const getGitHubLevelColor = (count) => {
    const isDark = theme === 'dark';
    if (isDark) {
      if (count <= 0) return '#161b22';
      if (count <= 2) return '#0e4429';
      if (count <= 5) return '#006d32';
      if (count <= 9) return '#26a641';
      return '#39d353';
    } else {
      if (count <= 0) return '#ebedf0';
      if (count <= 2) return '#9be9a8';
      if (count <= 5) return '#40c463';
      if (count <= 9) return '#30a14e';
      return '#216e39';
    }
  };

  // Rearrange cell array from column-major to row-major for CSS Grid layout
  const getRowMajorCells = () => {
    const rowMajor = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 53; c++) {
        const colMajorIndex = c * 7 + r;
        rowMajor.push(cells[colMajorIndex]);
      }
    }
    return rowMajor;
  };

  const rowMajorCells = getRowMajorCells();

  // Unique Month labels positioned at correct grid-column starts
  const getMonthLabels = () => {
    const labels = [];
    let lastMonth = -1;
    for (let col = 0; col < 53; col++) {
      const cellIndex = col * 7;
      const cellDate = cells[cellIndex].date;
      const currentMonth = cellDate.getMonth();
      if (currentMonth !== lastMonth && (labels.length === 0 || col - labels[labels.length - 1].colIndex >= 3)) {
        const monthName = cellDate.toLocaleString('default', { month: 'short' });
        labels.push({ text: monthName, colIndex: col });
        lastMonth = currentMonth;
      }
    }
    return labels;
  };

  const monthLabels = getMonthLabels();

  const handleMouseEnter = (e, cell, count) => {
    const cellEl = e.currentTarget;
    const rect = cellEl.getBoundingClientRect();
    const containerEl = cellEl.closest('.github-stats-wrapper');
    if (!containerEl) return;
    const containerRect = containerEl.getBoundingClientRect();

    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top;

    setHoveredCell({
      date: cell.date,
      count,
      x,
      y,
    });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  // Skeleton cell definitions for loading pulse
  const skeletonCells = Array.from({ length: 53 * 7 }).map((_, i) => ({
    id: i,
    delay: `${(i % 13) * 0.08}s`,
  }));

  if (loading) {
    return (
      <div className="github-stats-wrapper loading">
        <style>{`
          .github-stats-wrapper {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 1.5rem;
            border-radius: 12px;
            color: #0f172a;
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            width: 100%;
            transition: background-color var(--transition-fast), border-color var(--transition-fast);
          }
          html[data-theme="dark"] .github-stats-wrapper {
            background-color: #0d1117;
            border: 1px solid #1e293b;
            color: #ffffff;
          }
          .skeleton-pulse {
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: skeletonLoading 1.5s infinite;
          }
          html[data-theme="dark"] .skeleton-pulse {
            background: linear-gradient(90deg, #161b22 25%, #21262d 50%, #161b22 75%);
          }
          @keyframes skeletonLoading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .skeleton-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          @media (max-width: 768px) {
            .skeleton-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 480px) {
            .skeleton-grid {
              grid-template-columns: 1fr;
            }
          }
          .skeleton-card {
            height: 110px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          }
          html[data-theme="dark"] .skeleton-card {
            border: 1px solid #1e293b;
          }
          .skeleton-streaks {
            height: 48px;
            width: 320px;
            border-radius: 8px;
            margin-bottom: 1.5rem;
          }
          .skeleton-languages {
            height: 40px;
            width: 100%;
            border-radius: 8px;
            margin-bottom: 2rem;
          }
          .skeleton-calendar {
            height: 120px;
            width: 100%;
            border-radius: 8px;
          }
        `}</style>
        <div className="skeleton-grid">
          <div className="skeleton-card skeleton-pulse" />
          <div className="skeleton-card skeleton-pulse" />
          <div className="skeleton-card skeleton-pulse" />
          <div className="skeleton-card skeleton-pulse" />
        </div>
        <div className="skeleton-streaks skeleton-pulse" />
        <div className="skeleton-languages skeleton-pulse" />
        <div className="skeleton-calendar skeleton-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-stats-wrapper error">
        <style>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 3rem 1.5rem;
            border: 1px dashed #ef4444;
            border-radius: 12px;
            background-color: rgba(239, 68, 68, 0.03);
          }
          .error-icon {
            font-size: 2rem;
            color: #ef4444;
            margin-bottom: 1rem;
          }
          .error-text {
            font-size: 0.95rem;
            color: #d1d5db;
            margin-bottom: 1.5rem;
            max-width: 480px;
          }
          .retry-btn {
            background-color: #ef4444;
            color: #ffffff;
            border: none;
            padding: 0.5rem 1.25rem;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.85rem;
            cursor: pointer;
            transition: opacity 0.2s ease;
          }
          .retry-btn:hover {
            opacity: 0.9;
          }
        `}</style>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={fetchStats}>
            Retry Fetching Stats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="github-stats-wrapper">
      <style>{`
        .github-stats-wrapper {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          color: #0f172a;
          margin-top: 2rem;
          font-family: var(--font-main), sans-serif;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-stats-wrapper {
          background-color: #0d1117;
          border: 1px solid #1e293b;
          color: #ffffff;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        /* User Header Details */
        .github-user-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          transition: border-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-user-header {
          border-bottom: 1px solid #21262d;
        }

        .github-avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          border: 2px solid #4ade80;
        }

        .github-user-info {
          display: flex;
          flex-direction: column;
        }

        .github-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          font-family: var(--font-heading), sans-serif;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-name {
          color: #e2e8f0;
        }

        .github-bio {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.15rem;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-bio {
          color: #8b949e;
        }

        .github-join-date {
          font-size: 0.7rem;
          color: #64748b;
          font-family: var(--font-mono), monospace;
          margin-top: 0.1rem;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-join-date {
          color: #475569;
        }

        /* Metric Cards Grid */
        .github-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .github-metric-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .github-metric-grid {
            grid-template-columns: 1fr;
          }
        }

        .github-metric-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1.25rem 1rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: background-color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
        }

        html[data-theme="dark"] .github-metric-card {
          background-color: #111827;
          border: 1px solid #1e293b;
        }

        .github-metric-card:hover {
          border-color: #4ade80;
          box-shadow: 0 4px 16px rgba(74, 222, 128, 0.08);
        }

        .github-card-icon {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.2rem;
          color: #4ade80;
          opacity: 0.8;
        }

        .github-metric-val {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          font-family: var(--font-heading), sans-serif;
          line-height: 1.2;
          margin-top: 0.25rem;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-metric-val {
          color: #e2e8f0;
        }

        .github-metric-lbl {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
          text-transform: lowercase;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-metric-lbl {
          color: #475569;
        }

        /* Streaks Row */
        .github-streaks-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .github-streak-chip {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem 1rem;
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-streak-chip {
          background-color: #111827;
          border: 1px solid #1e293b;
        }

        .github-streak-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f172a;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-streak-val {
          color: #e2e8f0;
        }

        .github-streak-lbl {
          font-size: 0.75rem;
          color: #475569;
          text-transform: lowercase;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-streak-lbl {
          color: #64748b;
        }

        /* Segmented Languages Bar */
        .github-languages-section {
          margin-bottom: 2rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1.25rem;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-languages-section {
          background-color: #111827;
          border: 1px solid #1e293b;
        }

        .github-languages-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          text-transform: lowercase;
          margin-bottom: 0.85rem;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-languages-title {
          color: #8b949e;
        }

        .github-lang-bar {
          display: flex;
          height: 8px;
          border-radius: 9999px;
          overflow: hidden;
          width: 100%;
          background-color: #f1f5f9;
          margin-bottom: 1rem;
          transition: background-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-lang-bar {
          background-color: #1e293b;
        }

        .github-lang-seg {
          height: 100%;
        }

        .github-lang-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .github-legend-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #64748b;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-legend-item {
          color: #8b949e;
        }

        .github-legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        /* Heatmap Graph styling */
        .github-heatmap-section {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1.25rem;
          max-width: 100%;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-heatmap-section {
          background-color: #111827;
          border: 1px solid #1e293b;
        }

        .github-heatmap-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          text-transform: lowercase;
          margin-bottom: 0.85rem;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-heatmap-title {
          color: #8b949e;
        }

        .github-heatmap-scroll {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
          padding-bottom: 0.5rem;
          -webkit-overflow-scrolling: touch;
          transition: scrollbar-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-heatmap-scroll {
          scrollbar-color: #1e293b transparent;
        }

        .github-heatmap-scroll::-webkit-scrollbar {
          height: 5px;
        }

        .github-heatmap-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .github-heatmap-scroll::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 2px;
          transition: background-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-heatmap-scroll::-webkit-scrollbar-thumb {
          background: #1e293b;
        }

        .github-heatmap-layout {
          min-width: 650px;
          display: flex;
          flex-direction: column;
        }

        .github-months-row {
          display: grid;
          grid-template-columns: repeat(53, 10px);
          gap: 2px;
          margin-bottom: 4px;
          margin-left: 28px;
        }

        .github-month-lbl {
          font-size: 8px;
          color: #64748b;
          text-align: left;
          font-family: var(--font-mono), monospace;
          user-select: none;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-month-lbl {
          color: #8b949e;
        }

        .github-grid-days {
          display: flex;
          align-items: flex-start;
        }

        .github-days-col {
          display: grid;
          grid-template-rows: repeat(7, 10px);
          gap: 2px;
          width: 22px;
          margin-right: 6px;
          text-align: right;
          user-select: none;
        }

        .github-day-lbl {
          font-size: 8px;
          color: #64748b;
          line-height: 10px;
          font-family: var(--font-mono), monospace;
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-day-lbl {
          color: #8b949e;
        }

        .github-cells-grid {
          display: grid;
          grid-template-columns: repeat(53, 10px);
          grid-template-rows: repeat(7, 10px);
          gap: 2px;
        }

        .github-cell {
          width: 10px;
          height: 10px;
          border-radius: 1.5px;
          transition: opacity 0.15s ease, transform 0.1s ease;
        }

        .github-cell.active:hover {
          opacity: 0.8;
          transform: scale(1.15);
          z-index: 10;
        }

        .github-cell.future {
          opacity: 0.1;
          cursor: not-allowed;
        }

        .github-cell.future-themed {
          background-color: #ebedf0;
          transition: background-color var(--transition-fast);
        }

        html[data-theme="dark"] .github-cell.future-themed {
          background-color: #161b22;
        }

        /* Tooltip */
        .github-tooltip {
          position: absolute;
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #0f172a;
          padding: 5px 8px;
          border-radius: 4px;
          font-size: 9px;
          white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          z-index: 100;
          pointer-events: none;
          animation: githubTooltipFade 0.15s ease-out;
          transition: background-color var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
        }

        html[data-theme="dark"] .github-tooltip {
          background-color: #0d1117;
          border: 1px solid #30363d;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }

        @keyframes githubTooltipFade {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .github-last-updated-footer {
          text-align: center;
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 1.25rem;
          font-family: var(--font-mono);
          transition: color var(--transition-fast);
        }

        html[data-theme="dark"] .github-last-updated-footer {
          color: #475569;
        }
      `}</style>

      {/* User Header Details */}
      <div className="github-user-header">
        <img src={data.avatarUrl} alt={`${username} avatar`} className="github-avatar" />
        <div className="github-user-info">
          <span className="github-name">{username}</span>
          {data.bio && <span className="github-bio">{data.bio}</span>}
          <span className="github-join-date">joined: {new Date(data.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="github-metric-grid">
        <div className="github-metric-card">
          <i className="ti ti-git-branch github-card-icon"></i>
          <span className="github-metric-lbl">public repositories</span>
          <span className="github-metric-val">
            <CountUp value={data.publicRepos} />
          </span>
        </div>
        <div className="github-metric-card">
          <i className="ti ti-star github-card-icon"></i>
          <span className="github-metric-lbl">total stars</span>
          <span className="github-metric-val">
            <CountUp value={data.totalStars} />
          </span>
        </div>
        <div className="github-metric-card">
          <i className="ti ti-git-commit github-card-icon"></i>
          <span className="github-metric-lbl">commits past year</span>
          <span className="github-metric-val">
            <CountUp value={data.totalCommits} />
          </span>
        </div>
        <div className="github-metric-card">
          <i className="ti ti-users github-card-icon"></i>
          <span className="github-metric-lbl">followers count</span>
          <span className="github-metric-val">
            <CountUp value={data.followers} />
          </span>
        </div>
      </div>

      {/* Streaks Row */}
      <div className="github-streaks-row">
        <div className="github-streak-chip">
          <span className="github-streak-emoji">🔥</span>
          <span className="github-streak-val">{currentStreak} days</span>
          <span className="github-streak-lbl">current streak</span>
        </div>
        <div className="github-streak-chip">
          <span className="github-streak-emoji">⚡</span>
          <span className="github-streak-val">{longestStreak} days</span>
          <span className="github-streak-lbl">longest streak</span>
        </div>
      </div>

      {/* Segmented Languages Bar */}
      {languageSegments.length > 0 && (
        <div className="github-languages-section">
          <h4 className="github-languages-title">top languages</h4>
          <div className="github-lang-bar">
            {languageSegments.map((seg, idx) => (
              <div
                key={idx}
                className="github-lang-seg"
                style={{
                  width: `${seg.percentage}%`,
                  backgroundColor: LANGUAGE_COLORS[seg.name] || DEFAULT_LANG_COLOR
                }}
                title={`${seg.name}: ${seg.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="github-lang-legend">
            {languageSegments.map((seg, idx) => (
              <div key={idx} className="github-legend-item">
                <span
                  className="github-legend-dot"
                  style={{ backgroundColor: LANGUAGE_COLORS[seg.name] || DEFAULT_LANG_COLOR }}
                />
                <span>{seg.name}</span>
                <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>
                  {seg.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap Contribution Section */}
      <div className="github-heatmap-section">
        <h4 className="github-heatmap-title">github contributions</h4>
        <div className="github-heatmap-scroll">
          <div className="github-heatmap-layout">
            <div className="github-months-row">
              {monthLabels.map((lbl, idx) => (
                <span
                  key={idx}
                  className="github-month-lbl"
                  style={{ gridColumnStart: lbl.colIndex + 1 }}
                >
                  {lbl.text}
                </span>
              ))}
            </div>

            <div className="github-grid-days">
              <div className="github-days-col">
                <span className="github-day-lbl" style={{ gridRowStart: 2 }}>Mon</span>
                <span className="github-day-lbl" style={{ gridRowStart: 4 }}>Wed</span>
                <span className="github-day-lbl" style={{ gridRowStart: 6 }}>Fri</span>
              </div>

              <div className="github-cells-grid">
                {rowMajorCells.map((cell, idx) => {
                  const count = data.submissionMap[cell.dateStr] || 0;
                  const color = getGitHubLevelColor(count);

                  if (cell.isFuture) {
                    return (
                      <div
                        key={idx}
                        className="github-cell future future-themed"
                      />
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="github-cell active"
                      style={{ backgroundColor: color }}
                      onMouseEnter={(e) => handleMouseEnter(e, cell, count)}
                      onMouseLeave={handleMouseLeave}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Timestamp */}
      {lastUpdated && (
        <div className="github-last-updated-footer">
          last updated: {secondsAgo < 60 ? `${secondsAgo} seconds ago` : `${Math.floor(secondsAgo / 60)} minutes ago`}
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredCell && (
        <div
          className="github-tooltip"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 30,
            transform: 'translateX(-50%)',
          }}
        >
          {hoveredCell.count === 0 ? 'No' : hoveredCell.count} contributions on{' '}
          {hoveredCell.date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )}
    </div>
  );
};

export default GitHubStats;
