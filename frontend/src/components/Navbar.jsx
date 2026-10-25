import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { matchService } from '../services/api';
import {
  Home,
  Search,
  Users,
  PlusCircle,
  MessageSquare,
  UserCheck,
  Shield,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Fetch pending connection requests for badge indicator
  useEffect(() => {
    if (!user) return;
    const fetchPending = async () => {
      try {
        const res = await matchService.getReceivedRequests();
        const pending = (res.data || []).filter((r) => r.status === 'pending');
        setPendingCount(pending.length);
      } catch (err) {
        // fail silently for badge
      }
    };
    fetchPending();
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header
        className="glass-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--nav-height)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.25s ease',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '13px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08) rotate(-4deg)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
            >
              <Home size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                    lineHeight: 1.1,
                  }}
                >
                  Room<span style={{ color: 'var(--primary)' }}>ee</span>
                </span>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                    color: '#fff',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    letterSpacing: '0.04em',
                  }}
                >
                  PRO
                </span>
              </div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--secondary)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginTop: -1,
                }}
              >
                Flatshare & Roommates
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            className="desktop-nav-items"
          >
            <Link
              to="/listings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/listings') ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive('/listings') ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive('/listings')) e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive('/listings')) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Search size={16} strokeWidth={2.2} /> Explore Rooms
            </Link>

            <Link
              to="/roommates"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/roommates') ? 'var(--primary)' : 'var(--text-secondary)',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive('/roommates') ? 'var(--primary-light)' : 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive('/roommates')) e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive('/roommates')) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Users size={16} strokeWidth={2.2} /> Find Flatmates
            </Link>

            {user && (
              <>
                <Link
                  to="/connections"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontWeight: 600,
                    fontSize: '0.925rem',
                    color: isActive('/connections') ? 'var(--primary)' : 'var(--text-secondary)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive('/connections') ? 'var(--primary-light)' : 'transparent',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/connections')) e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/connections')) e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <UserCheck size={16} strokeWidth={2.2} /> Connections
                  {pendingCount > 0 && (
                    <span
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        borderRadius: '9999px',
                        padding: '1px 6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        marginLeft: 2,
                        animation: 'pulseIndicator 2s infinite',
                      }}
                    >
                      {pendingCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/chat"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontWeight: 600,
                    fontSize: '0.925rem',
                    color: isActive('/chat') ? 'var(--primary)' : 'var(--text-secondary)',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive('/chat') ? 'var(--primary-light)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive('/chat')) e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive('/chat')) e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <MessageSquare size={16} strokeWidth={2.2} /> Live Chat
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="badge badge-amber"
                style={{
                  textDecoration: 'none',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.825rem',
                  gap: '0.4rem',
                  fontWeight: 700,
                }}
              >
                <Shield size={14} /> Admin
              </Link>
            )}
          </nav>

          {/* Right Action Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Sun / Moon Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={19} color="#f59e0b" /> : <Moon size={19} color="#6366f1" />}
            </button>

            <Link
              to="/post-listing"
              className="btn btn-primary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                borderRadius: 'var(--radius-full)',
                padding: '0.5rem 1.05rem',
              }}
            >
              <PlusCircle size={16} strokeWidth={2.2} /> Post Room
            </Link>

            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    background: 'var(--bg-surface)',
                    padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid var(--border-light)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={
                        user.avatar?.startsWith('/uploads')
                          ? `http://localhost:5000${user.avatar}`
                          : user.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={user.name}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#10b981',
                        border: '2px solid #fff',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      maxWidth: 90,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {/* Profile Popover Dropdown */}
                {profileDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '120%',
                      right: 0,
                      width: 250,
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-light)',
                      padding: '0.75rem',
                      zIndex: 200,
                      animation: 'modalScaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.65rem 0.75rem',
                        background: 'var(--bg-main)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <p style={{ fontWeight: 800, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                        {user.name}
                      </p>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.email}
                      </p>
                      <div style={{ marginTop: '0.45rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                          {user.city}
                        </span>
                        <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                          {user.occupation || 'Member'}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-light)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <User size={16} /> My Profile & Preferences
                    </Link>

                    <Link
                      to="/connections"
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-light)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <UserCheck size={16} /> Match Requests
                      </span>
                      {pendingCount > 0 && (
                        <span className="badge badge-rose" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                          {pendingCount} new
                        </span>
                      )}
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#b45309',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-amber-light)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Shield size={16} /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.4rem 0' }} />

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--accent-rose)',
                        borderRadius: 'var(--radius-sm)',
                        background: 'transparent',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-rose-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Link to="/login" className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline btn-sm"
                  style={{
                    fontWeight: 700,
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-icon mobile-menu-btn"
              aria-label="Toggle navigation menu"
              style={{
                background: menuOpen ? 'var(--primary-light)' : 'var(--bg-surface)',
                border: '1.5px solid var(--border-light)',
                color: menuOpen ? 'var(--primary)' : 'var(--text-primary)',
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 99,
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '1.5rem',
              borderBottomLeftRadius: 'var(--radius-2xl)',
              borderBottomRightRadius: 'var(--radius-2xl)',
              boxShadow: 'var(--shadow-xl)',
              borderBottom: '1px solid var(--border-light)',
              animation: 'slideDown 0.25s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {/* Theme Switcher in Mobile Drawer */}
              <button
                onClick={toggleTheme}
                className="btn btn-outline"
                style={{
                  justifyContent: 'space-between',
                  padding: '0.8rem 1rem',
                  background: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-light)',
                  color: 'var(--text-primary)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
                  <span>{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: isDark ? 'rgba(245, 158, 11, 0.15)' : 'var(--primary-light)',
                    color: isDark ? '#f59e0b' : 'var(--primary)',
                  }}
                >
                  {isDark ? '🌙 Dark Active' : '☀️ Light Active'}
                </span>
              </button>
              <Link
                to="/listings"
                className={`btn ${isActive('/listings') ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
              >
                <Search size={18} /> Explore Verified Rooms
              </Link>

              <Link
                to="/roommates"
                className={`btn ${isActive('/roommates') ? 'btn-primary' : 'btn-outline'}`}
                style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
              >
                <Users size={18} /> Find Compatible Flatmates
              </Link>

              {user ? (
                <>
                  <Link
                    to="/connections"
                    className={`btn ${isActive('/connections') ? 'btn-primary' : 'btn-outline'}`}
                    style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
                  >
                    <UserCheck size={18} /> Match Requests
                    {pendingCount > 0 && (
                      <span className="badge badge-rose" style={{ marginLeft: 'auto' }}>
                        {pendingCount} Pending
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/chat"
                    className={`btn ${isActive('/chat') ? 'btn-primary' : 'btn-outline'}`}
                    style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
                  >
                    <MessageSquare size={18} /> Live In-App Chat
                  </Link>

                  <Link
                    to="/profile"
                    className={`btn ${isActive('/profile') ? 'btn-primary' : 'btn-outline'}`}
                    style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem' }}
                  >
                    <User size={18} /> My Profile & Preferences
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="btn btn-outline"
                      style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem', borderColor: '#f59e0b', color: '#b45309' }}
                    >
                      <Shield size={18} /> Admin Management
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                    style={{ justifyContent: 'flex-start', padding: '0.8rem 1rem', marginTop: '0.5rem' }}
                  >
                    <LogOut size={18} /> Log Out ({user.name.split(' ')[0]})
                  </button>
                </>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center' }}>
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop vs Mobile Nav styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav-items {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
