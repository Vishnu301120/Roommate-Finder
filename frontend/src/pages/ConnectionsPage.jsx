import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Check,
  X,
  MessageSquare,
  Clock,
  ArrowRight,
  Sparkles,
  UserPlus,
  Send,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { matchService } from '../services/api';
import Toast from '../components/Toast';

const ConnectionsPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent' | 'connections'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes, connRes] = await Promise.all([
        matchService.getReceivedRequests(),
        matchService.getSentRequests(),
        matchService.getConnections(),
      ]);
      setReceivedRequests(recRes.data || []);
      setSentRequests(sentRes.data || []);
      setConnections(connRes.data || []);
    } catch (err) {
      console.error('Error fetching connections data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await matchService.updateStatus(requestId, status);
      setToastMessage(`Request ${status === 'accepted' ? 'accepted! You can now chat in real time.' : 'declined.'}`);
      fetchAllData();
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 980 }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">
              <UserCheck size={14} /> Roommate Matching Hub
            </span>
            <span className="badge badge-emerald">Real-Time Messaging</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.45rem' }}>Connections & Match Requests</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 660 }}>
            Review incoming flatmate requests, manage your active roommate connections, and start direct chats.
          </p>
        </div>

        {/* Tab Headers with Modern Pill Styling */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
            background: 'var(--bg-main)',
            padding: '6px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-light)',
            width: 'fit-content',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveTab('received')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeTab === 'received' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'received' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'received' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Inbox size={16} /> Received Requests
            {pendingReceivedCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '1px 7px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginLeft: 4,
                }}
              >
                {pendingReceivedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('connections')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeTab === 'connections' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'connections' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'connections' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Sparkles size={16} /> Mutual Matches ({connections.length})
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: activeTab === 'sent' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'sent' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'sent' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Send size={16} /> Sent Requests ({sentRequests.length})
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card skeleton" style={{ height: 140, borderRadius: 'var(--radius-xl)' }} />
            ))}
          </div>
        ) : (
          <div>
            {/* TAB 1: RECEIVED REQUESTS */}
            {activeTab === 'received' && (
              <div>
                {receivedRequests.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {receivedRequests.map((req) => (
                      <div
                        key={req._id}
                        className="card"
                        style={{
                          padding: '1.75rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1.5rem',
                          borderRadius: 'var(--radius-xl)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.15rem', flex: '1 1 380px' }}>
                          <img
                            src={
                              req.sender?.avatar?.startsWith('/uploads')
                                ? `http://localhost:5000${req.sender.avatar}`
                                : req.sender?.avatar ||
                                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={req.sender?.name}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid #ffffff',
                              boxShadow: 'var(--shadow-md)',
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{req.sender?.name}</h3>
                              <span className="badge badge-gray">{req.sender?.occupation}</span>
                              <span className="badge badge-primary">{req.sender?.city}</span>
                            </div>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                              Budget: ₹{req.sender?.budgetMin?.toLocaleString('en-IN')} - ₹{req.sender?.budgetMax?.toLocaleString('en-IN')}
                            </p>
                            {req.listing && (
                              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Inquiring regarding: {req.listing.title}
                              </p>
                            )}
                            <p
                              style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)',
                                background: 'var(--bg-main)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                fontStyle: 'italic',
                                borderLeft: '3px solid var(--primary)',
                                lineHeight: 1.5,
                              }}
                            >
                              "{req.message}"
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          {req.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '0.65rem' }}>
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                className="btn btn-danger btn-sm"
                                style={{ fontWeight: 600 }}
                              >
                                <X size={16} /> Decline
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(req._id, 'accepted')}
                                className="btn btn-emerald btn-sm"
                                style={{ fontWeight: 700 }}
                              >
                                <Check size={16} strokeWidth={2.4} /> Accept & Match
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <span
                                className={`badge ${
                                  req.status === 'accepted' ? 'badge-emerald' : 'badge-rose'
                                }`}
                                style={{ fontWeight: 700, padding: '0.4rem 0.85rem' }}
                              >
                                {req.status === 'accepted' ? 'Connected' : 'Declined'}
                              </span>
                              {req.status === 'accepted' && (
                                <button
                                  onClick={() => navigate(`/chat?user=${req.sender._id}`)}
                                  className="btn btn-primary btn-sm"
                                  style={{ fontWeight: 700 }}
                                >
                                  <MessageSquare size={15} /> Chat
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#ffffff' }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Inbox size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                      No incoming requests right now
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: 420, margin: '0 auto' }}>
                      When someone wants to match with you or asks about your accommodation, it will show up here.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MUTUAL CONNECTIONS */}
            {activeTab === 'connections' && (
              <div>
                {connections.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {connections.map((item, idx) => (
                      <div
                        key={idx}
                        className="card"
                        style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-xl)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', marginBottom: '1rem' }}>
                          <img
                            src={
                              item.connection?.avatar?.startsWith('/uploads')
                                ? `http://localhost:5000${item.connection.avatar}`
                                : item.connection?.avatar ||
                                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={item.connection?.name}
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              boxShadow: 'var(--shadow-sm)',
                            }}
                          />
                          <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{item.connection?.name}</h3>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                              {item.connection?.occupation} • {item.connection?.city}
                            </p>
                            <span className="badge badge-emerald" style={{ marginTop: '0.3rem', fontSize: '0.72rem' }}>
                              <ShieldCheck size={12} /> Active Match
                            </span>
                          </div>
                        </div>

                        {item.connection?.bio && (
                          <p
                            style={{
                              fontSize: '0.85rem',
                              color: 'var(--text-secondary)',
                              fontStyle: 'italic',
                              marginBottom: '1.25rem',
                              background: 'var(--bg-main)',
                              padding: '0.65rem 0.85rem',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            "{item.connection.bio}"
                          </p>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                          <button
                            onClick={() => navigate(`/chat?user=${item.connection._id}`)}
                            className="btn btn-primary"
                            style={{ width: '100%', fontSize: '0.9rem', fontWeight: 700 }}
                          >
                            <MessageSquare size={16} /> Open Real-Time Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#ffffff' }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto',
                        color: 'var(--primary)',
                      }}
                    >
                      <Sparkles size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                      No active connections yet
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: '0 auto 1.75rem auto', maxWidth: 420 }}>
                      Discover compatible flatmates or explore room listings to send connect requests!
                    </p>
                    <button onClick={() => navigate('/roommates')} className="btn btn-primary">
                      Discover Compatible Flatmates
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SENT REQUESTS */}
            {activeTab === 'sent' && (
              <div>
                {sentRequests.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sentRequests.map((req) => (
                      <div
                        key={req._id}
                        className="card"
                        style={{
                          padding: '1.5rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderRadius: 'var(--radius-xl)',
                          flexWrap: 'wrap',
                          gap: '1rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img
                            src={
                              req.receiver?.avatar?.startsWith('/uploads')
                                ? `http://localhost:5000${req.receiver.avatar}`
                                : req.receiver?.avatar ||
                                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={req.receiver?.name}
                            style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Request to {req.receiver?.name}</h4>
                            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                              Sent: {new Date(req.createdAt).toLocaleDateString()} {req.listing ? `• For "${req.listing.title}"` : ''}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span
                            className={`badge ${
                              req.status === 'accepted'
                                ? 'badge-emerald'
                                : req.status === 'pending'
                                ? 'badge-amber'
                                : 'badge-rose'
                            }`}
                            style={{ fontWeight: 700, padding: '0.35rem 0.8rem' }}
                          >
                            {req.status === 'pending'
                              ? 'Pending Response'
                              : req.status === 'accepted'
                              ? 'Connected!'
                              : 'Declined'}
                          </span>
                          {req.status === 'accepted' && (
                            <button
                              onClick={() => navigate(`/chat?user=${req.receiver._id}`)}
                              className="btn btn-primary btn-sm"
                              style={{ fontWeight: 700 }}
                            >
                              <MessageSquare size={15} /> Chat
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#ffffff' }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'var(--bg-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem auto',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Clock size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                      No sent requests
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', margin: '0 auto 1.75rem auto', maxWidth: 420 }}>
                      Browse room listings or roommate profiles and click "Connect" to send your first request.
                    </p>
                    <button onClick={() => navigate('/listings')} className="btn btn-primary">
                      Explore Rooms
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default ConnectionsPage;
