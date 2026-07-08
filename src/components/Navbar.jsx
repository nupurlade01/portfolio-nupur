import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Magnetic } from './Magnetic';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const location = useLocation();

  const navLinks = [
    { name: 'skills', to: '/skills', id: 'skills' },
    { name: 'projects', to: '/projects', id: 'projects' },
    { name: 'experience', to: '/experience', id: 'experience' },
    { name: 'stats', to: '/stats', id: 'stats' },
    { name: 'resume', to: '/resume', id: 'resume' },
  ];

  // Initialize theme from local storage or system preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Click logo jumps back to home/top instantly */}
        <Magnetic max={10}>
          <Link 
            to="/" 
            className="nav-logo" 
            onClick={() => {
              setIsOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            nupur<span>.</span>
          </Link>
        </Magnetic>

        {/* Desktop Navigation Links */}
        <ul className="nav-menu">
          {navLinks.map((link) => (
            <li key={link.id}>
              <Link
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                <span className="slide-text-container">
                  <span className="slide-text-wrapper">
                    <span className="slide-text-item">{link.name}</span>
                    <span className="slide-text-item" aria-hidden="true">{link.name}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Header Actions (Theme Toggle & CTA) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {/* Theme Switcher Button */}
          <Magnetic max={10}>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                // Sun Icon for Dark Theme (switches to light)
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                // Moon Icon for Light Theme (switches to dark)
                <svg viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </Magnetic>

          {/* Hamburger Menu Toggle for Mobile */}
          <button
            className={`nav-toggle ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <ul className={`nav-mobile ${isOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <Link
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                <span className="slide-text-container">
                  <span className="slide-text-wrapper">
                    <span className="slide-text-item">{link.name}</span>
                    <span className="slide-text-item" aria-hidden="true">{link.name}</span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
