import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../auth/ChangePasswordModal';

function Sidebar({ isOpen = false, onClose }) {
  const { user, isAdmin, isHR, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate('/login');
  };

  const adminNav = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Company Chat', path: '/admin/chat', icon: '💬' },
    { label: 'Branches', path: '/admin/branches', icon: '🏢' },
    { label: 'Employees', path: '/admin/employees', icon: '👥' },
    { label: 'Interns', path: '/admin/interns', icon: '🎓' },
    { label: 'Projects', path: '/admin/projects', icon: '💼' },
    { label: 'Tasks', path: '/admin/tasks', icon: '✅' },
    { label: 'Attendance', path: '/admin/attendance', icon: '⏱️' },
    { label: 'Leaves', path: '/admin/leaves', icon: '🏖️' },
    { label: 'Payroll & Salary', path: '/admin/payroll', icon: '💰' },
    { label: 'Corporate Calendar', path: '/admin/calendar', icon: '📅' },
    { label: 'Holidays & Festivals', path: '/admin/holidays', icon: '🎉' },
    { label: 'Reports', path: '/admin/reports', icon: '📈' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const hrNav = [
    { label: 'HR Dashboard', path: '/hr/dashboard', icon: '📊' },
    { label: 'Company Chat', path: '/hr/chat', icon: '💬' },
    { label: 'Branches', path: '/hr/branches', icon: '🏢' },
    { label: 'Employees', path: '/hr/employees', icon: '👥' },
    { label: 'Interns', path: '/hr/interns', icon: '🎓' },
    { label: 'Projects', path: '/hr/projects', icon: '💼' },
    { label: 'Tasks', path: '/hr/tasks', icon: '✅' },
    { label: 'Attendance', path: '/hr/attendance', icon: '⏱️' },
    { label: 'Leaves', path: '/hr/leaves', icon: '🏖️' },
    { label: 'My Salary', path: '/hr/salary', icon: '💰' },
    { label: 'Corporate Calendar', path: '/hr/calendar', icon: '📅' },
    { label: 'Holidays & Festivals', path: '/hr/holidays', icon: '🎉' },
    { label: 'Reports', path: '/hr/reports', icon: '📈' },
    { label: 'Settings', path: '/hr/settings', icon: '⚙️' },
  ];



  const employeeNav = [
    { label: 'Dashboard', path: '/employee/dashboard', icon: '📊' },
    { label: 'Company Chat', path: '/employee/chat', icon: '💬' },
    { label: 'My Profile', path: '/employee/profile', icon: '👤' },
    { label: 'My Projects', path: '/employee/projects', icon: '💼' },
    { label: 'My Tasks', path: '/employee/tasks', icon: '✅' },
    { label: 'My Attendance', path: '/employee/attendance', icon: '⏱️' },
    { label: 'My Leaves', path: '/employee/leaves', icon: '🏖️' },
    { label: 'My Salary', path: '/employee/salary', icon: '💰' },
    { label: 'Corporate Calendar', path: '/employee/calendar', icon: '📅' },
    { label: 'Holidays & Festivals', path: '/employee/holidays', icon: '🎉' },
    { label: 'Settings', path: '/employee/settings', icon: '⚙️' },
  ];

  let navItems = employeeNav;
  if (isAdmin) navItems = adminNav;
  else if (isHR) navItems = hrNav;
  const fullName = user?.employeeProfile
    ? `${user.employeeProfile.first_name} ${user.employeeProfile.last_name}`
    : isAdmin
    ? 'Gargi Singh'
    : isHR
    ? 'Vinit Kumar'
    : user?.email?.split('@')[0] || 'Associate';

  const initials = user?.employeeProfile
    ? `${user.employeeProfile.first_name[0]}${user.employeeProfile.last_name[0]}`.toUpperCase()
    : isAdmin
    ? 'GS'
    : isHR
    ? 'VK'
    : 'VA';

  return (
    <aside
      className={`sidebar-container ${isOpen ? 'mobile-open' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.25rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        position: 'relative',
      }}>
        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mobile-only"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}

        <NavLink
          to={isAdmin ? '/admin/dashboard' : isHR ? '/hr/dashboard' : '/employee/dashboard'}
          style={{ textDecoration: 'none', display: 'block' }}
          title="Vaidimi Consulting ERP"
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src="/logo.png"
              alt="Vaidimi Consulting - Guidance Growth Success"
              style={{
                height: '44px',
                width: 'auto',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </div>
        </NavLink>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.5rem',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.6875rem',
          color: '#a7f3d0',
          fontWeight: '700',
          letterSpacing: '0.02em',
        }}>
          <span>🏛️</span>
          <span>Corporate Head Office: Varanasi</span>
        </div>
        <a
          href="mailto:info@vaidimiconsulting.in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.5rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.6875rem',
            color: '#cbd5e1',
            textDecoration: 'none',
            fontWeight: '500',
            marginTop: '0.15rem'
          }}
          title="Official Company Email"
        >
          <span>✉️</span>
          <span>info@vaidimiconsulting.in</span>
        </a>
      </div>

      {/* User Info Capsule */}
      <div style={{
        padding: '1rem 1.25rem',
        margin: '0.75rem 1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '0.875rem'
        }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#f8fafc'
          }}>
            {fullName}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.125rem' }}>
            <span style={{
              fontSize: '0.6875rem',
              padding: '0.125rem 0.375rem',
              borderRadius: '4px',
              backgroundColor: isAdmin
                ? 'rgba(15, 118, 110, 0.4)'
                : isHR
                ? 'rgba(139, 92, 246, 0.35)'
                : 'rgba(2, 132, 199, 0.3)',
              color: isAdmin
                ? '#5eead4'
                : isHR
                ? '#c4b5fd'
                : '#7dd3fc',
              fontWeight: '700'
            }}>
              {isHR ? 'HR ADMIN' : user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '0.5rem 1rem', overflowY: 'auto' }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          color: '#64748b',
          letterSpacing: '0.05em',
          padding: '0.5rem 0.5rem 0.25rem 0.5rem'
        }}>
          Navigation
        </div>

        {navItems.map((item) => (
          item.upcoming ? (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                color: '#64748b',
                fontSize: '0.875rem',
                marginBottom: '0.25rem',
                cursor: 'not-allowed'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1rem', opacity: 0.6 }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span style={{ fontSize: '0.6875rem', color: '#475569', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>
                Next
              </span>
            </div>
          ) : (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => onClose && onClose()}
              style={({ isActive }) => {
                const isCalendar = item.path.includes('calendar') && location.pathname.includes('calendar');
                const isChat = item.path.includes('chat') && location.pathname.includes('chat');
                const isSettings = item.path.includes('settings') && location.pathname.includes('settings');
                const active = isActive || isCalendar || isChat || isSettings;
                return {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  color: active ? '#ffffff' : '#94a3b8',
                  backgroundColor: active ? 'var(--primary)' : 'transparent',
                  fontSize: '0.875rem',
                  fontWeight: active ? '600' : '500',
                  marginBottom: '0.25rem',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)'
                };
              }}
            >
              <span style={{ fontSize: '1rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        ))}
      </nav>

      {/* Footer / Account Actions */}
      <div style={{
        padding: '0.875rem 1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.55rem 0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-sm)',
            color: '#cbd5e1',
            fontSize: '0.8125rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '0.5rem',
            transition: 'all var(--transition-fast)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.09)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          <span>🔑</span>
          <span>Change Password</span>
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.55rem 0.75rem',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-sm)',
            color: '#f87171',
            fontSize: '0.8125rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background var(--transition-fast)'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </aside>
  );
}

export default Sidebar;
