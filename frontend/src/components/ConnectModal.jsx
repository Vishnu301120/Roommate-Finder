import React, { useState } from 'react';
import { X, Send, Sparkles, ShieldCheck } from 'lucide-react';
import { matchService } from '../services/api';

const ConnectModal = ({ isOpen, onClose, target, onSuccess }) => {
  const [message, setMessage] = useState(
    target?.title
      ? `Hi! I came across your listing "${target.title}" and would love to connect to discuss details and move-in availability.`
      : `Hi ${target?.name || 'there'}! I checked out your profile and feel our lifestyle habits and budget align well. Would love to connect and chat about flatsharing!`
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !target) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Determine if target is listing or user
      const receiverId = target.user?._id || target._id;
      const listingId = target.rent ? target._id : null;

      await matchService.sendRequest({
        receiverId,
        listingId,
        message,
      });

      if (onSuccess) onSuccess('Connection request sent successfully! Once accepted, direct chat will unlock.');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send connect request');
    } finally {
      setLoading(false);
    }
  };

  const recipientName = target.user?.name || target.name;
  const recipientAvatar =
    target.user?.avatar ||
    target.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
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
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <img
            src={
              recipientAvatar.startsWith('/uploads')
                ? `http://localhost:5000${recipientAvatar}`
                : recipientAvatar
            }
            alt={recipientName}
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Connect with {recipientName}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {target.title ? `Regarding: ${target.title}` : `${target.city || 'Verified User'}`}
            </p>
          </div>
        </div>

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
              border: '1px solid #fecdd3',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <span>Personalized Introduction Message</span>
              <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={11} /> 80% higher acceptance
              </span>
            </label>
            <textarea
              className="form-control"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself, your move-in timeline, occupation, or routine..."
              required
              style={{ lineHeight: 1.6 }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Tip: Mention your move-in date and daily schedule for faster response.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ fontWeight: 700 }}>
              {loading ? (
                'Sending Request...'
              ) : (
                <>
                  <Send size={16} strokeWidth={2.4} /> Send Connection Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectModal;
