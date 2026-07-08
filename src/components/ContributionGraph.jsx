import React, { useState, useEffect } from 'react';

const ContributionGraph = ({ username }) => {
  const [submissionMap, setSubmissionMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'light'
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    localStorage.removeItem(`leetcode_calendar_${username}`);
    localStorage.removeItem(`leetcode_calendar_${username}_timestamp`);
    setRefreshTrigger(prev => prev + 1);
  };

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

  // Generate grid cells dynamically based on a 365-day calendar from oneYearAgo to today.
  // Pad the first week with empty cells if oneYearAgo does not fall on Sunday.
  // Pad the last week with empty cells if today does not fall on Saturday.
  const generateGridCells = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setHours(0, 0, 0, 0);

    const dateList = [];
    const tempDate = new Date(oneYearAgo);
    while (tempDate <= today) {
      dateList.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }

    const cells = [];
    const startDay = dateList[0].getDay(); // 0 (Sun) to 6 (Sat)
    for (let i = 0; i < startDay; i++) {
      cells.push({
        isPadded: true,
        isFuture: false,
        dateStr: '',
        date: null
      });
    }
    dateList.forEach((date) => {
      cells.push({
        isPadded: false,
        isFuture: false,
        date,
        dateStr: formatDateString(date)
      });
    });
    const endDay = dateList[dateList.length - 1].getDay();
    for (let i = endDay + 1; i <= 6; i++) {
      cells.push({
        isPadded: true,
        isFuture: false,
        dateStr: '',
        date: null
      });
    }
    return cells;
  };

  const cells = generateGridCells();
  const numCols = Math.ceil(cells.length / 7);

  // Load calendar data from the alfa-leetcode-api Render proxy
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      const CACHE_KEY = `leetcode_calendar_${username}`;
      const TIMESTAMP_KEY = `leetcode_calendar_${username}_timestamp`;
      const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      const cachedData = localStorage.getItem(CACHE_KEY);
      const cachedTimestamp = localStorage.getItem(TIMESTAMP_KEY);
      const now = Date.now();

      // If we have valid cached data (< 24 hours), use it directly
      if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp, 10) < ONE_DAY)) {
        try {
          const map = JSON.parse(cachedData);
          setSubmissionMap(map);
          setLoading(false);
          return;
        } catch (e) {
          console.warn('Failed to parse cached calendar data, fetching fresh...', e);
        }
      }

      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`);
        if (!response.ok) {
          throw new Error('LeetCode API unavailable');
        }
        const json = await response.json();

        if (!active) return;

        let calendar = {};
        if (json.submissionCalendar && json.submissionCalendar !== '{}') {
          try {
            // Safely parse stringified JSON or use direct object if already parsed
            if (typeof json.submissionCalendar === 'string') {
              calendar = JSON.parse(json.submissionCalendar);
            } else {
              calendar = json.submissionCalendar;
            }
          } catch (e) {
            console.warn('Failed to parse submissionCalendar', e);
          }
        }

        const map = {};
        if (calendar) {
          Object.entries(calendar).forEach(([timestampStr, count]) => {
            const timestamp = parseInt(timestampStr, 10);
            if (!isNaN(timestamp)) {
              const date = new Date(timestamp * 1000);
              const dateKey = formatDateString(date);
              map[dateKey] = (map[dateKey] || 0) + count;
            }
          });
        }

        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(map));
        localStorage.setItem(TIMESTAMP_KEY, now.toString());

        setSubmissionMap(map);
        setLoading(false);
      } catch (err) {
        console.error('LeetCode Heatmap API error:', err);
        if (active) {
          // Attempt to load from expired cache as fallback
          if (cachedData) {
            try {
              const map = JSON.parse(cachedData);
              setSubmissionMap(map);
              setLoading(false);
              return;
            } catch (e) {
              console.warn('Failed to load expired calendar cache', e);
            }
          }
          setError('Could not load contribution data — LeetCode API unavailable');
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [username, refreshTrigger]);

  // Map submission count to level color
  const getContributionLevel = (count) => {
    if (count <= 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const getLevelColor = (level) => {
    const isDark = theme === 'dark';
    if (isDark) {
      switch (level) {
        case 1: return '#0e4429';
        case 2: return '#006d32';
        case 3: return '#26a641';
        case 4: return '#39d353';
        case 0:
        default:
          return '#1e2a1e';
      }
    } else {
      switch (level) {
        case 1: return '#9be9a8';
        case 2: return '#40c463';
        case 3: return '#30a14e';
        case 4: return '#216e39';
        case 0:
        default:
          return '#ebedf0';
      }
    }
  };

  // Rearrange cell array from column-major to row-major for CSS Grid layout
  const getRowMajorCells = () => {
    const rowMajor = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < numCols; c++) {
        const colMajorIndex = c * 7 + r;
        rowMajor.push(cells[colMajorIndex] || { isPadded: true });
      }
    }
    return rowMajor;
  };

  const rowMajorCells = getRowMajorCells();

  // Get date of column
  const getColumnDate = (col) => {
    for (let r = 0; r < 7; r++) {
      const cell = cells[col * 7 + r];
      if (cell && !cell.isPadded && cell.date) {
        return cell.date;
      }
    }
    return null;
  };

  // Generate unique Month labels positioned at correct grid-column starts
  const getMonthLabels = () => {
    const labels = [];
    let lastMonth = -1;
    for (let col = 0; col < numCols; col++) {
      const colDate = getColumnDate(col);
      if (colDate) {
        const currentMonth = colDate.getMonth();
        // Ensure we don't put labels too close (within 3 columns)
        if (currentMonth !== lastMonth && (labels.length === 0 || col - labels[labels.length - 1].colIndex >= 3)) {
          const monthName = colDate.toLocaleString('default', { month: 'short' });
          labels.push({ text: monthName, colIndex: col });
          lastMonth = currentMonth;
        }
      }
    }
    return labels;
  };

  const monthLabels = getMonthLabels();

  // Statistics calculation
  const getStats = () => {
    let totalSubmissions = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeCells = cells.filter((c) => !c.isPadded && c.date <= today);

    activeCells.forEach((c) => {
      const count = submissionMap[c.dateStr] || 0;
      totalSubmissions += count;

      if (count > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) {
          maxStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    // Calculate current streak backwards from today
    let currentStreak = 0;
    const checkDate = new Date(today);
    const todayCount = submissionMap[formatDateString(checkDate)] || 0;

    if (todayCount === 0) {
      // Check if yesterday is active
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayCount = submissionMap[formatDateString(checkDate)] || 0;
      if (yesterdayCount > 0) {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
        while (true) {
          const count = submissionMap[formatDateString(checkDate)] || 0;
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
        const count = submissionMap[formatDateString(checkDate)] || 0;
        if (count > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return { totalSubmissions, maxStreak, currentStreak };
  };

  const stats = getStats();

  const handleMouseEnter = (e, cell, count) => {
    const cellEl = e.currentTarget;
    const rect = cellEl.getBoundingClientRect();
    const containerEl = cellEl.closest('.contribution-graph-container');
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
  const skeletonCells = Array.from({ length: numCols * 7 }).map((_, i) => ({
    id: i,
    delay: `${(i % 13) * 0.08}s`,
  }));

  return (
    <div className="contribution-graph-container heatmap-wrap">
      <style>{`
        .contribution-graph-container {
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 100%;
          margin: 2rem auto;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .heatmap-wrap {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #0f172a;
        }

        html[data-theme="dark"] .heatmap-wrap {
          background: #111827;
          border: 1px solid #1e293b;
          color: #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .graph-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0;
          text-align: left;
          color: inherit;
          font-family: var(--font-heading), sans-serif;
          text-transform: lowercase;
        }

        .graph-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .lc-refresh-btn {
          background: transparent;
          border: none;
          color: var(--text-muted, #64748b);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .lc-refresh-btn:hover {
          background-color: var(--border-color, #f1f5f9);
          color: #ffa116;
        }

        html[data-theme="dark"] .lc-refresh-btn:hover {
          background-color: #1e293b;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spinning {
          animation: spin 1s linear infinite;
        }
        
        .graph-scroll-wrapper {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border-color, #374151) transparent;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          -webkit-overflow-scrolling: touch;
        }

        .graph-scroll-wrapper::-webkit-scrollbar {
          height: 6px;
        }

        .graph-scroll-wrapper::-webkit-scrollbar-track {
          background: transparent;
        }

        .graph-scroll-wrapper::-webkit-scrollbar-thumb {
          background: var(--border-color, #374151);
          border-radius: 3px;
        }

        .graph-main-layout {
          min-width: 670px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .months-row {
          display: grid;
          gap: var(--cell-gap, 2px);
          margin-bottom: 6px;
          margin-left: 32px; /* aligns with days labels offset */
        }

        .month-label {
          font-size: 9px;
          text-align: left;
          user-select: none;
          font-family: var(--font-mono), monospace;
        }

        .grid-and-days-wrapper {
          display: flex;
          align-items: flex-start;
        }

        .days-column {
          display: grid;
          grid-template-rows: repeat(7, var(--cell-size, 10px));
          gap: var(--cell-gap, 2px);
          width: 26px;
          margin-right: 6px;
          text-align: right;
          user-select: none;
        }

        .day-label {
          font-size: 9px;
          line-height: var(--cell-size, 10px);
          font-family: var(--font-mono), monospace;
        }

        .heatmap-label {
          color: #94a3b8;
        }

        html[data-theme="dark"] .heatmap-label {
          color: #475569;
        }

        .cells-grid {
          display: grid;
          grid-template-rows: repeat(7, var(--cell-size, 10px));
          gap: var(--cell-gap, 2px);
        }

        .contribution-cell {
          width: var(--cell-size, 10px);
          height: var(--cell-size, 10px);
          border-radius: 2px;
          transition: opacity 0.2s ease, transform 0.15s ease;
        }

        .contribution-cell.active-cell:hover {
          opacity: 0.75;
          transform: scale(1.2);
          z-index: 5;
        }

        .contribution-cell.future-cell {
          opacity: 0.15;
          cursor: not-allowed;
        }

        /* Tooltip style */
        .graph-tooltip {
          position: absolute;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-family: var(--font-main), sans-serif;
          white-space: nowrap;
          z-index: 100;
          pointer-events: none;
          animation: tooltipFade 0.15s ease-out;
        }

        .heatmap-tooltip {
          background: #f1f5f9;
          color: #0f172a;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }

        html[data-theme="dark"] .heatmap-tooltip {
          background: #1e293b;
          color: #e2e8f0;
          border: 1px solid #2d3748;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        }

        @keyframes tooltipFade {
          from { opacity: 0; transform: translate(-50%, 4px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Pulse animation for loading state */
        @keyframes pulseCell {
          0% { background-color: var(--border-color); }
          50% { background-color: var(--bg-secondary); }
          100% { background-color: var(--border-color); }
        }

        .skeleton-cell {
          width: var(--cell-size, 10px);
          height: var(--cell-size, 10px);
          border-radius: 2px;
          animation: pulseCell 1.6s infinite ease-in-out;
        }

        .error-message {
          text-align: center;
          padding: 2rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-family: var(--font-main), sans-serif;
          border: 1px dashed var(--border-color);
          border-radius: 8px;
          background-color: var(--bg-secondary);
        }

        /* Stats summary row styling */
        .stats-summary-row {
          display: flex;
          justify-content: space-around;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-color);
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .stat-summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          min-width: 100px;
        }

        .stat-summary-val {
          font-size: 1.35rem;
          font-weight: 700;
          color: #216e39;
          font-family: var(--font-heading), sans-serif;
        }

        html[data-theme="dark"] .stat-summary-val {
          color: #39d353;
        }

        .stat-summary-lbl {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: lowercase;
          margin-top: 0.25rem;
          font-family: var(--font-main), sans-serif;
          letter-spacing: 0.02em;
        }

        .heatmap-footer {
          color: #94a3b8;
          text-align: center;
          font-size: 11px;
          font-family: monospace;
          margin-top: 1.25rem;
          user-select: none;
        }

        html[data-theme="dark"] .heatmap-footer {
          color: #2d3748;
        }

        :root {
          --cell-size: 10px;
          --cell-gap: 2px;
        }

        @media (max-width: 768px) {
          :root {
            --cell-size: 9px;
            --cell-gap: 1.5px;
          }
          .contribution-graph-container {
            padding: 1.25rem;
          }
        }
      `}</style>

      <div className="graph-header-row">
        <h3 className="graph-title">leetcode contributions</h3>
        <button className="lc-refresh-btn" onClick={handleRefresh} aria-label="Refresh contributions" title="Refresh contributions">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`refresh-icon ${loading ? 'spinning' : ''}`} style={{ width: '13px', height: '13px', display: 'block' }}>
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="graph-scroll-wrapper">
            <div className="graph-main-layout">
              {/* Month Labels Header */}
              <div className="months-row" style={{ gridTemplateColumns: `repeat(${numCols}, var(--cell-size, 10px))` }}>
                {monthLabels.map((label, idx) => (
                  <span
                    key={idx}
                    className="month-label heatmap-label"
                    style={{ gridColumnStart: label.colIndex + 1 }}
                  >
                    {label.text}
                  </span>
                ))}
              </div>

              <div className="grid-and-days-wrapper">
                {/* Day Labels Column */}
                <div className="days-column">
                  <span className="day-label heatmap-label" style={{ gridRowStart: 2 }}>Mon</span>
                  <span className="day-label heatmap-label" style={{ gridRowStart: 4 }}>Wed</span>
                  <span className="day-label heatmap-label" style={{ gridRowStart: 6 }}>Fri</span>
                </div>

                {/* Cells Grid */}
                <div className="cells-grid" style={{ gridTemplateColumns: `repeat(${numCols}, var(--cell-size, 10px))` }}>
                  {loading
                    ? skeletonCells.map((cell) => (
                        <div
                          key={cell.id}
                          className="skeleton-cell"
                          style={{ animationDelay: cell.delay }}
                        />
                      ))
                    : rowMajorCells.map((cell, idx) => {
                        if (cell.isPadded) {
                          return (
                            <div
                              key={idx}
                              className="contribution-cell padded-cell"
                              style={{ backgroundColor: 'transparent' }}
                            />
                          );
                        }

                        const count = submissionMap[cell.dateStr] || 0;
                        const level = getContributionLevel(count);
                        const cellColor = getLevelColor(level);

                        return (
                          <div
                            key={idx}
                            className="contribution-cell active-cell"
                            style={{ backgroundColor: cellColor }}
                            onMouseEnter={(e) => handleMouseEnter(e, cell, count)}
                            onMouseLeave={handleMouseLeave}
                          />
                        );
                      })}
                </div>
              </div>
            </div>
          </div>

          {/* Hover Tooltip */}
          {hoveredCell && (
            <div
              className="graph-tooltip heatmap-tooltip"
              style={{
                left: hoveredCell.x,
                top: hoveredCell.y - 32,
                transform: 'translateX(-50%)',
              }}
            >
              {hoveredCell.count} submissions on{' '}
              {hoveredCell.date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          )}

          {/* Stats Summary Row */}
          {!loading && (
            <>
              <div className="stats-summary-row">
                <div className="stat-summary-item">
                  <span className="stat-summary-val">{stats.totalSubmissions}</span>
                  <span className="stat-summary-lbl">submissions past year</span>
                </div>
                <div className="stat-summary-item">
                  <span className="stat-summary-val">{stats.maxStreak} days</span>
                  <span className="stat-summary-lbl">longest streak</span>
                </div>
                <div className="stat-summary-item">
                  <span className="stat-summary-val">{stats.currentStreak} days</span>
                  <span className="stat-summary-lbl">current streak</span>
                </div>
              </div>
              <div className="heatmap-footer">
                Last updated: just now
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ContributionGraph;
