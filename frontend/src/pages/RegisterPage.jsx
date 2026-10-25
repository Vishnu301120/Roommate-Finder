import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Briefcase,
  Utensils,
  Moon,
  Cigarette,
  Dog,
  Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'Male',
    age: 24,
    city: 'Chennai',
    locality: 'Velachery',
    occupation: 'Working Professional',
    budgetMin: 8000,
    budgetMax: 20000,
    lookingFor: 'both',
    lifestyle: {
      foodDiet: 'Non-Vegetarian',
      sleepSchedule: 'Flexible',
      smoking: 'No',
      drinking: 'Socially',
      pets: 'Pet Friendly',
      partyHabits: 'Weekends Only',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(formData);
      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account');
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
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'calc(var(--nav-height) + 2rem)',
        paddingBottom: '4rem',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ maxWidth: 680, position: 'relative', zIndex: 2 }}>
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
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
            >
              <UserPlus size={24} />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.45rem', fontWeight: 800 }}>Create Your Account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Connect with lifestyle-matched flatmates and discover verified flats with zero brokerage.
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
                marginBottom: '1.5rem',
                animation: 'slideDown 0.2s ease-out',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section 1: Account Credentials */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                1. Basic Details & Credentials
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }} />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Aditi Rao"
                      style={{ paddingLeft: '2.6rem', height: 46 }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }} />
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@domain.com"
                      style={{ paddingLeft: '2.6rem', height: 46 }}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Password * (Min 6 chars)</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="Create a strong password"
                      style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem', height: 46 }}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      minLength={6}
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
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-control"
                    style={{ height: 46 }}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Role */}
            <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                2. City, Locality & Profession
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select
                    className="form-control"
                    style={{ height: 46 }}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
                    <option value="Salem">Salem</option>
                    <option value="Tirunelveli">Tirunelveli</option>
                    <option value="Erode">Erode</option>
                    <option value="Vellore">Vellore</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Locality / Area</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. OMR, Velachery, Peelamedu, KK Nagar"
                    style={{ height: 46 }}
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Occupation</label>
                  <select
                    className="form-control"
                    style={{ height: 46 }}
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  >
                    <option value="Working Professional">Working Professional</option>
                    <option value="Student">Student</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Lifestyle Habits */}
            <div style={{ marginBottom: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                3. Lifestyle Preferences (For Match Scoring)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Food & Diet</label>
                  <select
                    className="form-control"
                    style={{ height: 46 }}
                    value={formData.lifestyle.foodDiet}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lifestyle: { ...formData.lifestyle, foodDiet: e.target.value },
                      })
                    }
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Eggetarian">Eggetarian</option>
                    <option value="Vegan">Vegan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Sleep Schedule</label>
                  <select
                    className="form-control"
                    style={{ height: 46 }}
                    value={formData.lifestyle.sleepSchedule}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lifestyle: { ...formData.lifestyle, sleepSchedule: e.target.value },
                      })
                    }
                  >
                    <option value="Flexible">Flexible</option>
                    <option value="Early Bird">Early Bird (Early to bed & rise)</option>
                    <option value="Night Owl">Night Owl (Night owl routine)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', height: 50, fontWeight: 800, fontSize: '1rem' }}
              disabled={loading}
            >
              <UserPlus size={18} strokeWidth={2.4} /> {loading ? 'Creating Your Profile...' : 'Sign Up & Discover Flatmates'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
