import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { reviewService } from '../services/api';

const ReviewModal = ({ isOpen, onClose, targetType, targetId, targetName, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await reviewService.createReview({
        targetUserId: targetType === 'user' ? targetId : null,
        targetListingId: targetType === 'listing' ? targetId : null,
        rating,
        comment,
      });

      if (onSuccess) onSuccess('Review posted successfully! Thank you for helping the community.');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const getRatingLabel = (score) => {
    switch (score) {
      case 5:
        return '5.0 - Exceptional Experience';
      case 4:
        return '4.0 - Very Good & Recommended';
      case 3:
        return '3.0 - Average Experience';
      case 2:
        return '2.0 - Below Expectations';
      default:
        return '1.0 - Poor Experience';
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="btn-icon"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'var(--bg-main)',
            width: 36,
            height: 36,
            borderRadius: '50%',
            color: 'var(--text-muted)',
          }}
          aria-label="Close review modal"
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>
          Rate & Review {targetName}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Share authentic feedback about the flat, communication, hygiene, or living habits.
        </p>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--accent-rose-light)',
              color: 'var(--accent-rose)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star Rating Selector */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem',
              marginBottom: '1.75rem',
              padding: '1.25rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 4,
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Star
                    size={36}
                    color="#f59e0b"
                    fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
              {getRatingLabel(hoverRating || rating)}
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Your Honest Review</label>
            <textarea
              className="form-control"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What was it like interacting with the host or living in the flat? Mention cleanliness, amenities, guidelines..."
              required
              style={{ lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontWeight: 700 }}>
              {loading ? 'Submitting Review...' : 'Publish Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
