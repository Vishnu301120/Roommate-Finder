import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send,
  MessageSquare,
  Check,
  CheckCheck,
  User,
  Sparkles,
  Smile,
  Shield,
  ArrowLeft,
  Circle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { chatService, matchService } from '../services/api';

const ChatPage = () => {
  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTargetUserId = searchParams.get('user');

  const [connections, setConnections] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mobile navigation state
  const [showMobileChat, setShowMobileChat] = useState(!!initialTargetUserId);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, partnerTyping]);

  // Fetch connections
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const res = await matchService.getConnections();
        const connList = res.data || [];
        setConnections(connList);

        if (initialTargetUserId) {
          const matched = connList.find(
            (c) => c.connection._id.toString() === initialTargetUserId.toString()
          );
          if (matched) {
            setActivePartner(matched.connection);
            setShowMobileChat(true);
          } else if (connList.length > 0) {
            setActivePartner(connList[0].connection);
          }
        } else if (connList.length > 0) {
          setActivePartner(connList[0].connection);
        }
      } catch (err) {
        console.error('Failed to load chat connections:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConnections();
  }, [initialTargetUserId]);

  // Fetch conversation messages when activePartner changes
  useEffect(() => {
    if (!activePartner?._id) return;

    const loadMessages = async () => {
      try {
        const res = await chatService.getMessages(activePartner._id);
        setMessages(res.data || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();
  }, [activePartner?._id]);

  // Socket.io Real-Time listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (msg) => {
      if (
        (msg.sender._id === activePartner?._id && msg.receiver._id === user?._id) ||
        (msg.sender._id === user?._id && msg.receiver._id === activePartner?._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleUserTyping = ({ userId }) => {
      if (activePartner?._id === userId) {
        setPartnerTyping(true);
      }
    };

    const handleUserStopTyping = ({ userId }) => {
      if (activePartner?._id === userId) {
        setPartnerTyping(false);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket, activePartner?._id, user?._id]);

  // Handle typing debounce
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socket && activePartner?._id) {
      socket.emit('typing', { senderId: user._id, receiverId: activePartner._id });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { senderId: user._id, receiverId: activePartner._id });
      }, 1800);
    }
  };

  const handleSendMessage = async (e, directText) => {
    if (e) e.preventDefault();
    const text = (directText || inputText).trim();
    if (!text || !activePartner?._id) return;

    setInputText('');

    if (socket) {
      socket.emit('stop_typing', { senderId: user._id, receiverId: activePartner._id });
      // Real-time emit
      socket.emit('send_message', {
        senderId: user._id,
        receiverId: activePartner._id,
        content: text,
      });
    } else {
      // REST API fallback
      try {
        const res = await chatService.sendMessage({
          receiverId: activePartner._id,
          content: text,
        });
        setMessages((prev) => [...prev, res.data]);
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    }
  };

  const quickSuggestions = [
    'When would be a good time to visit?',
    'Is the flat fully furnished?',
    'What are the quiet hours/rules?',
    'Excited to connect! Let us coordinate move-in dates.',
  ];

  return (
    <div className="page-wrapper" style={{ paddingBottom: '1.5rem' }}>
      <div className="container" style={{ maxWidth: 1140 }}>
        <div
          className="card"
          style={{
            height: 'calc(100vh - var(--nav-height) - 4.5rem)',
            minHeight: 580,
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-light)',
          }}
        >
          {/* Left Column: Connections List */}
          <div
            className={`chat-sidebar ${showMobileChat ? 'chat-sidebar-hidden' : ''}`}
            style={{
              borderRight: '1px solid var(--border-light)',
              background: 'var(--bg-main)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-light)',
                background: 'var(--bg-surface)',
              }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Messages</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {connections.length} connected flatmates
              </span>
            </div>

            {/* Conversation list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton" style={{ height: 60, borderRadius: 'var(--radius-md)' }} />
                  ))}
                </div>
              ) : connections.length > 0 ? (
                connections.map((item) => {
                  const partner = item.connection;
                  const isSelected = activePartner?._id === partner._id;
                  const online = isUserOnline(partner._id);

                  return (
                    <div
                      key={partner._id}
                      onClick={() => {
                        setActivePartner(partner);
                        setSearchParams({ user: partner._id });
                        setShowMobileChat(true);
                      }}
                      style={{
                        padding: '1.1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.95rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--bg-surface)' : 'transparent',
                        borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* Avatar with online dot */}
                      <div style={{ position: 'relative' }}>
                        <img
                          src={
                            partner.avatar?.startsWith('/uploads')
                              ? `http://localhost:5000${partner.avatar}`
                              : partner.avatar ||
                                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={partner.name}
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid var(--border-light)',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 1,
                            right: 1,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: online ? '#10b981' : '#cbd5e1',
                            border: '2px solid var(--bg-surface)',
                            boxShadow: online ? '0 0 6px rgba(16, 185, 129, 0.5)' : 'none',
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4
                            style={{
                              fontSize: '0.95rem',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {partner.name}
                          </h4>
                        </div>
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: 2,
                          }}
                        >
                          {partner.occupation} • {partner.city}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ margin: '0 auto 0.85rem auto', opacity: 0.4 }} />
                  <p style={{ fontSize: '0.925rem', fontWeight: 600 }}>No active chats yet.</p>
                  <p style={{ fontSize: '0.8rem', marginTop: 4 }}>
                    Accept match requests in Connections to chat here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Live Chat Window */}
          {activePartner ? (
            <div
              className={`chat-main ${!showMobileChat ? 'chat-main-hidden' : ''}`}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-surface)' }}
            >
              {/* Chat Window Header */}
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {/* Back button for mobile */}
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="btn-icon mobile-back-btn"
                    style={{ width: 34, height: 34, background: 'var(--bg-main)' }}
                    aria-label="Back to contacts list"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div style={{ position: 'relative' }}>
                    <img
                      src={
                        activePartner.avatar?.startsWith('/uploads')
                          ? `http://localhost:5000${activePartner.avatar}`
                          : activePartner.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={activePartner.name}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: isUserOnline(activePartner._id) ? '#10b981' : '#94a3b8',
                        border: '2px solid var(--bg-surface)',
                      }}
                    />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{activePartner.name}</h3>
                    <p
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: isUserOnline(activePartner._id) ? '#10b981' : 'var(--text-muted)',
                      }}
                    >
                      {partnerTyping ? 'typing a message...' : isUserOnline(activePartner._id) ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    <Shield size={12} /> Verified Match
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.95rem',
                  background: '#f8fafc',
                }}
              >
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isMine =
                      msg.sender._id?.toString() === user?._id?.toString() ||
                      msg.sender === user?._id;

                    return (
                      <div
                        key={msg._id || index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isMine ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '75%',
                            padding: '0.85rem 1.15rem',
                            borderRadius: '18px',
                            borderBottomRightRadius: isMine ? 4 : 18,
                            borderBottomLeftRadius: isMine ? 18 : 4,
                            background: isMine
                              ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
                              : 'var(--bg-surface)',
                            color: isMine ? '#ffffff' : 'var(--text-primary)',
                            boxShadow: isMine
                              ? '0 4px 12px rgba(79, 70, 229, 0.28)'
                              : '0 2px 6px rgba(15, 23, 42, 0.05)',
                            border: isMine ? 'none' : '1px solid var(--border-light)',
                            fontSize: '0.925rem',
                            lineHeight: 1.55,
                            wordBreak: 'break-word',
                          }}
                        >
                          {msg.content}
                        </div>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            marginTop: 4,
                            padding: '0 4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {isMine && <CheckCheck size={13} color="var(--primary)" />}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)', padding: '2rem' }}>
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem auto',
                        color: 'var(--primary)',
                      }}
                    >
                      <Sparkles size={26} />
                    </div>
                    <p style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      Start your conversation with {activePartner.name}
                    </p>
                    <p style={{ fontSize: '0.85rem', marginTop: 4, maxWidth: 360, margin: '6px auto 0 auto' }}>
                      Coordinate visits, discuss move-in availability, or ask about house preferences!
                    </p>
                  </div>
                )}

                {/* Partner is typing indicator */}
                {partnerTyping && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      background: '#ffffff',
                      padding: '0.55rem 0.95rem',
                      borderRadius: '14px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{activePartner.name} is typing</span>
                    <span style={{ display: 'inline-flex', gap: 2 }}>
                      <span className="typing-dot" />
                      <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                      <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div
                style={{
                  padding: '0.4rem 1.25rem',
                  background: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '0.45rem',
                  overflowX: 'auto',
                }}
              >
                {quickSuggestions.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(null, text)}
                    style={{
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-light)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-light)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {text}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                style={{
                  padding: '1rem 1.25rem',
                  borderTop: '1px solid var(--border-light)',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <input
                  type="text"
                  placeholder={`Write a message to ${activePartner.name}...`}
                  className="form-control"
                  value={inputText}
                  onChange={handleInputChange}
                  style={{ flex: 1, height: 46 }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!inputText.trim()}
                  style={{
                    borderRadius: 'var(--radius-md)',
                    padding: '0 1.25rem',
                    height: 46,
                    fontWeight: 700,
                  }}
                >
                  <Send size={18} strokeWidth={2.4} />
                </button>
              </form>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                color: 'var(--text-muted)',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--primary)',
                }}
              >
                <MessageSquare size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Select a match to start messaging
              </h3>
              <p style={{ fontSize: '0.9rem', maxWidth: 360, textAlign: 'center', marginTop: 8, lineHeight: 1.6 }}>
                Once you accept connect requests from roommates or flat owners, real-time messaging activates here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Typing animation & Responsive styles */}
      <style>{`
        .typing-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--primary);
          animation: typingPulse 1s infinite;
        }
        @keyframes typingPulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
        @media (max-width: 768px) {
          .chat-sidebar-hidden {
            display: none !important;
          }
          .chat-main-hidden {
            display: none !important;
          }
          .mobile-back-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-back-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
