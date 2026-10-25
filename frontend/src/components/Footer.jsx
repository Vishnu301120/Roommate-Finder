import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, Heart, Sparkles, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        background: '#090d16',
        color: '#f8fafc',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 250,
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                }}
              >
                <Home size={22} strokeWidth={2.4} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                Roomee
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              The modern roommate matching platform built for effortless flatsharing. Discover verified rooms and compatible flatmates based on lifestyle, habits, and budget.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#38bdf8', fontSize: '0.72rem' }}>
                <CheckCircle2 size={12} /> Zero Brokerage
              </span>
              <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#34d399', fontSize: '0.72rem' }}>
                <ShieldCheck size={12} /> 100% Verified
              </span>
            </div>
          </div>

          {/* Quick Discover Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Discover Flatsharing
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <Link to="/listings" style={{ transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Explore Rooms for Rent
              </Link>
              <Link to="/roommates" style={{ transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Find Compatible Roommates
              </Link>
              <Link to="/post-listing" style={{ transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Post a Room or Flat Free
              </Link>
              <Link to="/connections" style={{ transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                Match Requests & Connections
              </Link>
            </div>
          </div>

          {/* Tamil Nadu Hubs */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Tamil Nadu Cities
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <Link to="/listings?city=Chennai">Flatmates in Chennai (OMR, Velachery, Adyar)</Link>
              <Link to="/listings?city=Coimbatore">Flatmates in Coimbatore (Peelamedu, RS Puram)</Link>
              <Link to="/listings?city=Madurai">Flatmates in Madurai (KK Nagar, Anna Nagar)</Link>
              <Link to="/listings?city=Tiruchirappalli">Flatmates in Trichy (Thillai Nagar, Cantonment)</Link>
              <Link to="/listings?city=Salem">Flatmates in Salem (Fairlands, Hasthampatti)</Link>
              <Link to="/listings?city=Tirunelveli">Flatmates in Tirunelveli (Palayamkottai)</Link>
            </div>
          </div>

          {/* Safety & Trust */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Safety & Moderation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#10b981" />
                <span>Verified Resident Profiles</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#818cf8" />
                <span>Lifestyle Compatibility Match Meter</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={18} color="#38bdf8" />
                <span>End-to-End Real-Time In-App Chat</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Strict zero-tolerance policy against scams and fake listings.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: '#64748b',
            gap: '1rem',
          }}
        >
          <p>© {new Date().getFullYear()} Roomee Platform. Crafted for modern flatsharing across India.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Built with <Heart size={15} color="#f43f5e" fill="#f43f5e" /> using MERN & Real-Time Socket.io
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
