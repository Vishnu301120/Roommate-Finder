import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Home,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle,
  Clock,
  HeartHandshake,
  Check,
  Zap,
  Building,
  Shield,
  Star,
  Sliders,
} from 'lucide-react';
import { listingService, userService } from '../services/api';
import ListingCard from '../components/ListingCard';
import RoommateCard from '../components/RoommateCard';
import ConnectModal from '../components/ConnectModal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'roommates'
  const [searchCity, setSearchCity] = useState('Chennai');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [featuredListings, setFeaturedListings] = useState([]);
  const [featuredRoommates, setFeaturedRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Connect Modal state
  const [connectTarget, setConnectTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, roommateRes] = await Promise.all([
          listingService.getListings({ limit: 4 }),
          userService.getRoommates({ limit: 4 }),
        ]);
        setFeaturedListings(listingRes.data.listings || []);
        setFeaturedRoommates(roommateRes.data.users || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'rooms') {
      navigate(`/listings?city=${encodeURIComponent(searchCity)}&keyword=${encodeURIComponent(searchKeyword)}`);
    } else {
      navigate(`/roommates?city=${encodeURIComponent(searchCity)}&keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  const cities = [
    { name: 'Chennai', rooms: '420+ Rooms', badge: 'Capital & IT Hub', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80' },
    { name: 'Coimbatore', rooms: '280+ Rooms', badge: 'Smart IT & Textile Hub', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80' },
    { name: 'Madurai', rooms: '190+ Rooms', badge: 'Cultural Capital', img: '/cities/madurai.jpg' },
    { name: 'Tiruchirappalli', rooms: '160+ Rooms', badge: 'Central TN Hub', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Salem', rooms: '130+ Rooms', badge: 'Steel & Textile City', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Tirunelveli', rooms: '110+ Rooms', badge: 'South Education Hub', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          background: 'var(--hero-bg)',
          paddingTop: 'calc(var(--nav-height) + 2.5rem)',
          paddingBottom: '5.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Glowing Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            right: '-10%',
            width: 550,
            height: 550,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '-10%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 800,
              maxWidth: 900,
              margin: '0 auto 1.5rem auto',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            Find a Roommate who shares your{' '}
            <span className="text-gradient">
              lifestyle & vibe.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: 680,
              margin: '0 auto 2.75rem auto',
              lineHeight: 1.6,
            }}
          >
            Match by sleep schedule, diet, budget, cleanliness, and chat in real-time. Zero brokerage, verified profiles, and seamless flatsharing across Tamil Nadu.
          </p>

          {/* Dual Search Box Card */}
          <div
            className="glass-panel"
            style={{
              maxWidth: 860,
              margin: '0 auto',
              borderRadius: 'var(--radius-2xl)',
              padding: '1.5rem 1.75rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
            }}
          >
            {/* Tab switchers */}
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--bg-main)',
                padding: '4px',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1.5rem',
                border: '1px solid var(--border-light)',
              }}
            >
              <button
                onClick={() => setActiveTab('rooms')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  background: activeTab === 'rooms' ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === 'rooms' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'rooms' ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Home size={17} strokeWidth={2.2} /> Find a Room
              </button>
              <button
                onClick={() => setActiveTab('roommates')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  background: activeTab === 'roommates' ? 'var(--bg-surface)' : 'transparent',
                  color: activeTab === 'roommates' ? 'var(--primary)' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'roommates' ? 'var(--shadow-md)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Users size={17} strokeWidth={2.2} /> Find a Flatmate
              </button>
            </div>

            {/* Search Input Controls */}
            <form
              onSubmit={handleSearch}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              {/* City select */}
              <div style={{ flex: '1 1 200px', textAlign: 'left' }}>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: 6,
                    letterSpacing: '0.04em',
                  }}
                >
                  TARGET CITY
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={18}
                    color="var(--primary)"
                    style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }}
                  />
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="form-control"
                    style={{
                      paddingLeft: '2.6rem',
                      fontWeight: 700,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                    }}
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
              </div>

              {/* Keyword / Locality search */}
              <div style={{ flex: '2 1 280px', textAlign: 'left' }}>
                <label
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: 6,
                    letterSpacing: '0.04em',
                  }}
                >
                  LOCALITY / LANDMARK / KEYWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }}
                  />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder={
                      activeTab === 'rooms'
                        ? 'e.g. OMR, Velachery, Peelamedu, Thillai Nagar...'
                        : 'e.g. Software Engineer, Vegetarian, Pet friendly...'
                    }
                    className="form-control"
                    style={{
                      paddingLeft: '2.6rem',
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                    }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ flex: '0 0 auto', alignSelf: 'flex-end', paddingTop: '1.4rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    height: 48,
                    padding: '0 2rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Search size={18} strokeWidth={2.4} /> Search
                </button>
              </div>
            </form>

            {/* Quick city pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '1.25rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Quick search:</span>
              {['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore'].map((city) => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setSearchCity(city)}
                  style={{
                    background: searchCity === city ? 'var(--primary-light)' : 'var(--bg-surface)',
                    border: `1px solid ${searchCity === city ? 'var(--primary)' : 'var(--border-light)'}`,
                    color: searchCity === city ? 'var(--primary)' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              maxWidth: 860,
              margin: '3.5rem auto 0 auto',
              padding: '1.5rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                12,000+
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Verified Rooms Listed
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-display)' }}>
                98.4%
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Match Compatibility Rate
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', fontFamily: 'var(--font-display)' }}>
                Zero
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Brokerage or Hidden Fees
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-purple)', fontFamily: 'var(--font-display)' }}>
                Real-time
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Instant In-App Chat
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Metro Cities Section */}
      <section style={{ padding: '4.5rem 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>
                <Building size={14} /> Prime Tamil Nadu Co-Living Hubs
              </span>
              <h2 style={{ fontSize: '2.2rem' }}>Explore Shared Living across Tamil Nadu</h2>
            </div>
            <button
              onClick={() => navigate('/listings')}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              View all listings <ArrowRight size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {cities.map((city, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/listings?city=${city.name}`)}
                className="card"
                style={{
                  position: 'relative',
                  height: 260,
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <img
                  src={city.img}
                  alt={city.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/cities/madurai.jpg';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                  }}
                >
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {city.badge}
                  </span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem',
                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 100%)',
                    color: '#ffffff',
                  }}
                >
                  <h3 style={{ color: '#fff', fontSize: '1.35rem', fontWeight: 800, marginBottom: 2 }}>{city.name}</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 500 }}>{city.rooms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Rooms Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                <ShieldCheck size={14} /> 100% Verified Accommodation
              </span>
              <h2 style={{ fontSize: '2.2rem' }}>Featured Rooms Available Now</h2>
            </div>
            <button
              onClick={() => navigate('/listings')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              See All Rooms <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="grid-listings">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card skeleton" style={{ height: 360 }} />
              ))}
            </div>
          ) : (
            <div className="grid-listings">
              {featuredListings.map((listing) => (
                <ListingCard
                  key={listing._id}
                  listing={listing}
                  onConnect={(item) => setConnectTarget(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lifestyle Match Spotlight Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.75rem' }}>
                <Sparkles size={14} /> The Compatibility Algorithm
              </span>
              <h2 style={{ fontSize: '2.4rem', marginBottom: '1.25rem', lineHeight: 1.2 }}>
                Never Have an Awkward Flatmate Experience Again.
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                Roomee's lifestyle scoring compares your personal preferences against potential roommates before you exchange a single message.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Sleep Schedule Matching</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Night owls match with night owls; early birds sleep in peace.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#d1fae5',
                      color: '#065f46',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Dietary & Kitchen Compatibility</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Strict vegetarian? Non-veg foodie? Align kitchen cooking habits upfront.
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#fef3c7',
                      color: '#92400e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Pet & Party Preferences</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Check pet friendliness, weekend gatherings, and quiet hours.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-2xl)',
                padding: '2rem',
                border: '2px solid rgba(79, 70, 229, 0.15)',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span className="badge badge-emerald" style={{ fontWeight: 800 }}>
                  <Zap size={14} /> 94% COMPATIBILITY MATCH
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Algorithm Preview</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Sneha"
                  style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Sneha Reddy</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Product Designer • Peelamedu, Coimbatore</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <span>Diet Alignment</span>
                  <strong style={{ color: '#10b981' }}>100% Match (Vegetarian)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <span>Sleep Schedule</span>
                  <strong style={{ color: '#10b981' }}>Early Bird (Aligned)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <span>Pet Friendly</span>
                  <strong style={{ color: '#10b981' }}>Both Love Dogs</strong>
                </div>
              </div>

              <button
                onClick={() => navigate('/roommates')}
                className="btn btn-primary"
                style={{ width: '100%', fontWeight: 700 }}
              >
                Find Roommates with Your Match Score
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Roommates Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '0.5rem' }}>
                <Users size={14} /> Lifestyle Matched
              </span>
              <h2 style={{ fontSize: '2.2rem' }}>Flatmate Seekers Near You</h2>
            </div>
            <button
              onClick={() => navigate('/roommates')}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
            >
              Browse All Flatmates <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="grid-roommates">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card skeleton" style={{ height: 360 }} />
              ))}
            </div>
          ) : (
            <div className="grid-roommates">
              {featuredRoommates.map((rm) => (
                <RoommateCard
                  key={rm._id}
                  roommate={rm}
                  onConnect={(target) => setConnectTarget(target)}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works - 3 Step Visual Guide */}
      <section style={{ padding: '5.5rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            <Compass size={14} /> Effortless Discovery
          </span>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '3.5rem' }}>How Roomee Works in 3 Steps</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.25rem',
            }}
          >
            {/* Step 1 */}
            <div
              className="card"
              style={{
                padding: '2.25rem 2rem',
                textAlign: 'left',
                position: 'relative',
                borderTop: '4px solid var(--primary)',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '16px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <Search size={26} strokeWidth={2.4} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>1. Set Filters & Budget</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                Filter listings and flatmate seekers by locality, rent range, room type, dietary preferences, and lifestyle habits.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card"
              style={{
                padding: '2.25rem 2rem',
                textAlign: 'left',
                position: 'relative',
                borderTop: '4px solid var(--secondary)',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '16px',
                  background: 'var(--secondary-light)',
                  color: 'var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <HeartHandshake size={26} strokeWidth={2.4} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>2. Connect & Live Chat</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                Send a personalized connection request. Once accepted, start instant real-time messaging on our secure in-app platform.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card"
              style={{
                padding: '2.25rem 2rem',
                textAlign: 'left',
                position: 'relative',
                borderTop: '4px solid var(--accent-emerald)',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '16px',
                  background: '#d1fae5',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <CheckCircle size={26} strokeWidth={2.4} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.65rem' }}>3. Visit & Move In</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                Tour the flat in person, align on house guidelines, split security deposits, and move into your dream home stress-free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* High-Converting Bottom Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: '#ffffff',
          padding: '5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.25) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.25rem' }}>
            Have an Extra Room or Looking for Flatmates?
          </h2>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '1.15rem',
              maxWidth: 620,
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            Join thousands of professionals and students finding verified, lifestyle-matched flatmates across Tamil Nadu's top cities.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/post-listing')}
              className="btn btn-primary btn-lg"
              style={{
                background: '#ffffff',
                color: 'var(--primary)',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              }}
            >
              Post Your Room Free
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-outline btn-lg"
              style={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Connect Modal */}
      {connectTarget && (
        <ConnectModal
          isOpen={!!connectTarget}
          onClose={() => setConnectTarget(null)}
          target={connectTarget}
          onSuccess={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default HomePage;
