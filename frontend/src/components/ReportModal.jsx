import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { reportService } from '../services/api';

const ReportModal = ({ isOpen, onClose, targetType, targetId, targetName, onSuccess }) => {
  const [reason, setReason] = useState('Fake Profile or Listing');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await reportService.createReport({
        targetType,
        targetUserId: targetType === 'user' ? targetId : null,
        targetListingId: targetType === 'listing' ? targetId : null,
        reason,
        description,
      });

      if (onSuccess) onSuccess('Report submitted for admin review. Thank you for keeping Roomee safe.');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
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
          aria-label="Close report modal"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              backgroundColor: 'var(--accent-rose-light)',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Report {targetName || 'Content'}</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Help maintain our community safety guidelines</p>
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
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Reason for reporting</label>
            <select
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            >
              <option value="Fake Profile or Listing">Fake Profile or Listing</option>
              <option value="Scam or Fraudulent Activity">Scam or Fraudulent Activity</option>
              <option value="Harassment or Offensive Behavior">Harassment or Offensive Behavior</option>
              <option value="Inappropriate Photos or Content">Inappropriate Photos or Content</option>
              <option value="Incorrect Pricing or Location">Incorrect Pricing or Location</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Provide more details</label>
            <textarea
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the violation clearly so our safety moderators can investigate promptly..."
              required
              style={{ lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger" disabled={loading} style={{ fontWeight: 700 }}>
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
