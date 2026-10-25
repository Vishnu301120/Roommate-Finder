import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Heart, Sparkles, UserPlus, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';

const ListingCard = ({ listing, onConnect }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('roomee_favs') || '[]');
      return favs.includes(listing._id);
    } catch {
      return false;
    }
  });

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('roomee_favs') || '[]');
      let updated;
      if (favs.includes(listing._id)) {
        updated = favs.filter((id) => id !== listing._id);
        setIsFavorite(false);
      } else {
        updated = [...favs, listing._id];
        setIsFavorite(true);
      }
      localStorage.setItem('roomee_favs', JSON.stringify(updated));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const photoUrl =
    listing.photos && listing.photos.length > 0
      ? listing.photos[0].startsWith('/uploads')
        ? `http://localhost:5000${listing.photos[0]}`
        : listing.photos[0]
      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  const hostAvatar =
    listing.user?.avatar?.startsWith('/uploads')
      ? `http://localhost:5000${listing.user.avatar}`
      : listing.user?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Image Banner */}
      <div style={{ position: 'relative', height: 215, width: '100%', overflow: 'hidden' }}>
        <img
          src={photoUrl}
          alt={listing.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient shadow for text contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, transparent 40%, rgba(15, 23, 42, 0.75) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Room Type Tag */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span
            className="badge"
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <Bed size={13} /> {listing.roomType}
          </span>
        </div>

        {/* Bookmark Favorite Button */}
        <button
          onClick={toggleFavorite}
          aria-label="Save listing"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: isFavorite ? '#ffffff' : 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorite ? '#f43f5e' : '#ffffff',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={18} fill={isFavorite ? '#f43f5e' : 'none'} strokeWidth={2.4} />
        </button>

        {/* Gender Preference Badge */}
        <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
          <span
            className={`badge ${
              listing.preferredGender === 'Female'
                ? 'badge-rose'
                : listing.preferredGender === 'Male'
                ? 'badge-purple'
                : 'badge-emerald'
            }`}
            style={{
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
              fontSize: '0.72rem',
            }}
          >
            {listing.preferredGender === 'Any' ? 'Any Gender' : `${listing.preferredGender} Preferred`}
          </span>
        </div>

        {/* Rent Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.25rem',
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            ₹{listing.rent?.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)' }}>/ month</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Locality & Furnishing */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <MapPin size={14} color="var(--primary)" />
            {listing.locality}, {listing.city}
          </span>
          <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
            {listing.furnishingStatus}
          </span>
        </div>

        {/* Listing Title */}
        <Link
          to={`/listings/${listing._id}`}
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.65rem',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        >
          {listing.title}
        </Link>

        {/* Amenities Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.15rem' }}>
          {listing.amenities?.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="badge"
              style={{
                background: 'var(--bg-main)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-light)',
                fontSize: '0.72rem',
                padding: '0.2rem 0.55rem',
              }}
            >
              {amenity}
            </span>
          ))}
          {listing.amenities?.length > 3 && (
            <span
              className="badge"
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: '0.72rem',
                padding: '0.2rem 0.55rem',
                fontWeight: 700,
              }}
            >
              +{listing.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Host Info & Quick Action */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={hostAvatar}
                alt={listing.user?.name || 'Host'}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--border-light)',
                }}
              />
              {listing.user?.isVerified && (
                <CheckCircle2
                  size={13}
                  color="#ffffff"
                  fill="var(--primary)"
                  style={{ position: 'absolute', bottom: -2, right: -2 }}
                />
              )}
            </div>
            <div>
              <p
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                {listing.user?.name?.split(' ')[0] || 'Host'}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {listing.user?.occupation || 'Resident'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Link
              to={`/listings/${listing._id}`}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.4rem 0.75rem', fontWeight: 600 }}
            >
              Details <ArrowUpRight size={14} />
            </Link>
            {onConnect && (
              <button
                onClick={() => onConnect(listing)}
                className="btn btn-primary btn-sm"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <UserPlus size={14} /> Connect
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
