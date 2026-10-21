import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../../components/common/ThemeToggle';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  // Clear any corrupt or stale tokens on login page mount
  useEffect(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const userRole = result.user?.role;
      let targetPath = '/employee/dashboard';

      if (userRole === 'ADMIN' || userRole === 'MANAGER') {
        targetPath = '/admin/dashboard';
      } else if (userRole === 'HR') {
        targetPath = '/hr/dashboard';
      }

      if (from && typeof from === 'string') {
        const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';
        const isHR = userRole === 'HR';
        const isEmp = userRole === 'EMPLOYEE';

        if (isAdmin && (from.startsWith('/admin') || from.startsWith('/calendar'))) {
          targetPath = from;
        } else if (isHR && (from.startsWith('/hr') || from.startsWith('/calendar'))) {
          targetPath = from;
        } else if (isEmp && (from.startsWith('/employee') || from.startsWith('/calendar'))) {
          targetPath = from;
        }
      }

      navigate(targetPath, { replace: true });
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '1rem',
      position: 'relative',
      background: 'radial-gradient(circle at 50% 10%, rgba(15, 118, 110, 0.12) 0%, transparent 65%)'
    }}>
      {/* Theme Switcher Button */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
        <ThemeToggle compact={true} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', margin: 'auto' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.875rem',
          }}>
            <img
              src="/logo.png"
              alt="Vaidimi Consulting Logo"
              style={{
                height: 'auto',
                maxHeight: '68px',
                maxWidth: '260px',
                objectFit: 'contain',
                backgroundColor: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
              }}
            />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.25rem', color: 'var(--text-main)' }}>
            Enterprise Workspace Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
            Secure ERP &amp; Workforce Management Login
          </p>
        </div>

        {/* Login Form Card */}
        <div className="card" style={{ padding: '1.75rem 1.5rem' }}>
          {errorMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email or Employee ID Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Email Address or Employee ID
              </label>
              <input
                type="text"
                placeholder="gargi@vidimiconsulting.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)'
                }}
                required
                autoFocus
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)'
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', fontWeight: '600' }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Corporate Security Footer */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-color)',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}>
            <span>🔒</span>
            <span>256-Bit Encrypted Corporate Workspace</span>
          </div>
        </div>

        {/* Footer info */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
          marginTop: '1.5rem'
        }}>
          Vaidimi Consulting &bull; Secure Enterprise Portal &bull;{' '}
          <a
            href="mailto:info@vaidimiconsulting.in"
            style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
          >
            info@vaidimiconsulting.in
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
