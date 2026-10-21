import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

function Navbar({ apiStatus }) {
  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Logo & Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="Vaidimi Consulting Logo"
            style={{
              height: '46px',
              maxWidth: '240px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Link>

        {/* Corporate Status & Workspace */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="desktop-only" style={{
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: '600',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)'
          }}>
            <span>🏢</span>
            <span>Vaidimi Corporate Suite &bull; Head Office</span>
          </div>

          <div className="desktop-only" style={{
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: '500',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)'
          }}>
            <span>📅</span>
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <ThemeToggle />
          <span className="badge badge-info">Enterprise Edition</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
