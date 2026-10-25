import React from 'react';
import {
  MapPin,
  Briefcase,
  CheckCircle2,
  Moon,
  Utensils,
  Cigarette,
  Dog,
  Sparkles,
  UserPlus,
  Wine,
  PartyPopper,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';

const RoommateCard = ({ roommate, onConnect, currentUserId }) => {
  const { isUserOnline } = useSocket();
  const online = isUserOnline(roommate._id);

  const avatarUrl =
    roommate.avatar?.startsWith('/uploads')
      ? `http://localhost:5000${roommate.avatar}`
      : roommate.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  const score = roommate.compatibilityScore || 85;
  const scoreColor = score >= 85 ? '#10b981' : score >= 70 ? '#6366f1' : '#f59e0b';
  const scoreBg = score >= 85 ? '#d1fae5' : score >= 70 ? '#eef2ff' : '#fef3c7';

  return (
    <div
      className="card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Top Header: Avatar + Match Score */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1rem',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={avatarUrl}
            alt={roommate.name}
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--border-light)',
              boxShadow: 'var(--shadow-md)',
            }}
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
            }}
          />
          {/* Online Pulsing Indicator */}
          <span
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: online ? '#10b981' : '#94a3b8',
              border: '2px solid var(--bg-surface)',
              boxShadow: online ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
            }}
            title={online ? 'Online now' : 'Offline'}
          />
        </div>

        {/* Match Compatibility Meter Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: scoreBg,
            border: `1px solid ${scoreColor}40`,
            color: scoreColor,
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '0.01em',
            boxShadow: 'var(--shadow-xs)',
          }}
          title="Lifestyle compatibility score based on sleep schedule, diet, habits & budget"
        >
          <Sparkles size={14} />
          <span>{score}% Match</span>
        </div>
      </div>

      {/* Name, Verification & Location */}
      <div style={{ marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {roommate.name}
          </h3>
          {roommate.isVerified && (
            <span title="Verified Roommate">
              <CheckCircle2 size={18} color="var(--primary)" fill="var(--primary-light)" />
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.25rem',
            fontWeight: 500,
          }}
        >
          <Briefcase size={14} color="var(--primary)" />
          {roommate.occupation} • {roommate.age} yrs • {roommate.gender}
        </p>
        <p
          style={{
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.2rem',
          }}
        >
          <MapPin size={14} color="var(--primary)" />
          {roommate.locality}, {roommate.city}
        </p>
      </div>

      {/* Bio snippet */}
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.55,
          marginBottom: '1rem',
          fontStyle: 'italic',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          background: 'var(--bg-main)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '3px solid var(--primary)',
        }}
      >
        "{roommate.bio || 'Looking for a clean, friendly flatmate to share an apartment with.'}"
      </p>

      {/* Budget & Looking For Container */}
      <div
        style={{
          background: 'var(--bg-main)',
          padding: '0.75rem 0.95rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Budget Range
          </span>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
            ₹{roommate.budgetMin?.toLocaleString('en-IN')} - ₹{roommate.budgetMax?.toLocaleString('en-IN')}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase' }}>
            Looking For
          </span>
          <span
            className="badge badge-primary"
            style={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '0.75rem' }}
          >
            {roommate.lookingFor === 'both' ? 'Room or Flat' : roommate.lookingFor}
          </span>
        </div>
      </div>

      {/* Lifestyle Habits Pills */}
      {roommate.lifestyle && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          <span
            className="badge"
            style={{
              fontSize: '0.72rem',
              gap: '0.3rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
            }}
          >
            <Utensils size={12} color="var(--primary)" /> {roommate.lifestyle.foodDiet}
          </span>
          <span
            className="badge"
            style={{
              fontSize: '0.72rem',
              gap: '0.3rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
            }}
          >
            <Moon size={12} color="var(--accent-purple)" /> {roommate.lifestyle.sleepSchedule}
          </span>
          <span
            className="badge"
            style={{
              fontSize: '0.72rem',
              gap: '0.3rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
            }}
          >
            <Cigarette size={12} color="var(--text-muted)" /> Smoke: {roommate.lifestyle.smoking}
          </span>
          <span
            className="badge"
            style={{
              fontSize: '0.72rem',
              gap: '0.3rem',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
            }}
          >
            <Dog size={12} color="var(--accent-amber)" /> {roommate.lifestyle.pets}
          </span>
        </div>
      )}

      {/* Action Connect Button */}
      <div style={{ marginTop: 'auto' }}>
        {currentUserId === roommate._id ? (
          <div
            className="badge badge-gray"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            Your Profile
          </div>
        ) : (
          <button
            onClick={() => onConnect(roommate)}
            className="btn btn-primary"
            style={{
              width: '100%',
              fontSize: '0.9rem',
              padding: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
          >
            <UserPlus size={16} /> Connect with {roommate.name.split(' ')[0]}
          </button>
        )}
      </div>
    </div>
  );
};

export default RoommateCard;
