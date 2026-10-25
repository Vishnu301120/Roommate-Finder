import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.9rem 1.4rem',
        background: isSuccess
          ? 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
          : 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22), 0 0 20px rgba(16, 185, 129, 0.3)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        fontSize: '0.925rem',
        fontWeight: 600,
        maxWidth: 420,
        border: '1px solid rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {isSuccess ? (
        <CheckCircle2 size={22} color="#34d399" strokeWidth={2.4} />
      ) : (
        <AlertCircle size={22} color="#fca5a5" strokeWidth={2.4} />
      )}
      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          color: '#fff',
          borderRadius: '50%',
          width: 26,
          height: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
};

export default Toast;
