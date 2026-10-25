import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, Shield, User, Eye, EyeOff, Lock, Mail, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError('');
    try {
      await login(demoEmail, demoPassword);
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login with demo credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-wrapper"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - var(--nav-height))',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ maxWidth: 480, position: 'relative', zIndex: 2 }}>
        <div
          className="card"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-light)',
            background: 'var(--bg-glass-heavy)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
            >
              <Home size={24} />
            </div>
            <h1 style={{ fontSize: '1.9rem', marginBottom: '0.45rem', fontWeight: 800 }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Sign in to manage roommate match requests & live chats.
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--accent-rose-light)',
                color: 'var(--accent-rose)',
                border: '1px solid #fecdd3',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                animation: 'slideDown 0.2s ease-out',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }}
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  style={{ paddingLeft: '2.6rem', height: 46 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  color="var(--text-muted)"
                  style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem', height: 46 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 2,
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem', height: 48, fontWeight: 700 }}
              disabled={loading}
            >
              <LogIn size={18} strokeWidth={2.4} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins for Instant Testing */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
            <p
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginBottom: '0.85rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Instant 1-Click Demo Logins
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('demo@roommatefinder.com', 'Password@123')}
                className="btn btn-outline"
                style={{
                  justifyContent: 'flex-start',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                }}
                disabled={loading}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.5rem',
                    flexShrink: 0,
                  }}
                >
                  <User size={16} color="var(--primary)" />
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                  <span style={{ fontWeight: 700, display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    Rahul Sharma (Seeker & Host)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    demo@roommatefinder.com
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@roommatefinder.com', 'Admin@12345')}
                className="btn btn-outline"
                style={{
                  justifyContent: 'flex-start',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                }}
                disabled={loading}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.5rem',
                    flexShrink: 0,
                  }}
                >
                  <Shield size={16} color="#d97706" />
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                  <span style={{ fontWeight: 700, display: 'block', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    Super Admin (Platform Moderator)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    admin@roommatefinder.com
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Sign Up Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
