import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Building,
  HeartHandshake,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
  Ban,
  Trash2,
  Check,
  X,
  Search,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { adminService, reportService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'reports'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        reportService.getAllReports(),
      ]);
      setStats(statsRes.data);
      setUsersList(usersRes.data || []);
      setReportsList(reportsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="page-wrapper container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <div className="card" style={{ maxWidth: 440, margin: '0 auto', padding: '3rem', borderRadius: 'var(--radius-2xl)' }}>
          <Shield size={48} color="#dc2626" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
            This governance section requires administrative credentials.
          </p>
        </div>
      </div>
    );
  }

  const handleToggleBan = async (userId) => {
    try {
      const res = await adminService.toggleUserBan(userId);
      setToastMessage(res.data.message);
      setUsersList(
        usersList.map((u) => (u._id === userId ? { ...u, isBanned: !u.isBanned } : u))
      );
    } catch (err) {
      setToastMessage('Failed to update user ban status');
    }
  };

  const handleToggleVerify = async (userId) => {
    try {
      const res = await adminService.toggleUserVerify(userId);
      setToastMessage(res.data.message);
      setUsersList(
        usersList.map((u) => (u._id === userId ? { ...u, isVerified: res.data.isVerified } : u))
      );
    } catch (err) {
      setToastMessage('Failed to update verification status');
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      await reportService.updateReportStatus(reportId, { status });
      setToastMessage(`Report marked as ${status}`);
      setReportsList(
        reportsList.map((r) => (r._id === reportId ? { ...r, status } : r))
      );
    } catch (err) {
      setToastMessage('Failed to update report status');
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Admin Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-amber" style={{ fontWeight: 800 }}>
              <Shield size={14} /> Administrator Console
            </span>
            <span className="badge badge-emerald">Live Governance</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.45rem' }}>Platform Governance & Moderation</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 660 }}>
            Monitor community metrics, manage verified accounts, inspect safety reports, and enforce house guidelines.
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            {/* Stat 1: Total Users */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Registered Users</span>
                <Users size={20} color="var(--primary)" />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalUsers}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Active members</span>
            </div>

            {/* Stat 2: Active Listings */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Accommodations</span>
                <Building size={20} color="var(--secondary)" />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.activeListings}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Across top metro hubs</span>
            </div>

            {/* Stat 3: Roommate Matches */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Connected Matches</span>
                <HeartHandshake size={20} color="var(--accent-purple)" />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalMatches}</p>
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>Active chats enabled</span>
            </div>

            {/* Stat 4: Pending Reports */}
            <div className="card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Safety Reports</span>
                <AlertTriangle size={20} color={stats.pendingReports > 0 ? '#ef4444' : 'var(--text-muted)'} />
              </div>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: stats.pendingReports > 0 ? '#dc2626' : 'inherit' }}>
                {stats.pendingReports}
              </p>
              <span style={{ fontSize: '0.78rem', color: stats.pendingReports > 0 ? '#dc2626' : 'var(--text-muted)', fontWeight: 600 }}>
                {stats.pendingReports > 0 ? 'Requires attention' : 'All clear'}
              </span>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
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
          }}
        >
          <button
            onClick={() => setActiveTab('users')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.925rem',
              background: activeTab === 'users' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'users' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Users size={16} /> User Accounts ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.925rem',
              background: activeTab === 'reports' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === 'reports' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <AlertTriangle size={16} /> Safety & Moderation Reports ({reportsList.length})
          </button>
        </div>

        {/* TAB 1: USERS MANAGEMENT TABLE */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '2rem', borderRadius: 'var(--radius-2xl)', background: 'var(--bg-surface)' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', marginBottom: '1.75rem', maxWidth: 420 }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', top: 14, left: 14, pointerEvents: 'none' }}
              />
              <input
                type="text"
                placeholder="Search user name, email, or city..."
                className="form-control"
                style={{ paddingLeft: '2.6rem', height: 46 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.78rem' }}>MEMBER</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.78rem' }}>ROLE</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.78rem' }}>LOCATION</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 800, fontSize: '0.78rem' }}>STATUS</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, fontSize: '0.78rem' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                          }
                          alt={u.name}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</p>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-amber' : 'badge-gray'}`} style={{ fontWeight: 700 }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{u.city}</td>
                      <td style={{ padding: '1rem' }}>
                        {u.isBanned ? (
                          <span className="badge badge-rose" style={{ fontWeight: 700 }}>Suspended</span>
                        ) : u.isVerified ? (
                          <span className="badge badge-emerald" style={{ fontWeight: 700 }}>Verified</span>
                        ) : (
                          <span className="badge badge-gray" style={{ fontWeight: 600 }}>Unverified</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {u.role !== 'admin' && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleToggleVerify(u._id)}
                              className="btn btn-outline btn-sm"
                              style={{ fontWeight: 600 }}
                            >
                              {u.isVerified ? 'Revoke Verification' : 'Verify'}
                            </button>
                            <button
                              onClick={() => handleToggleBan(u._id)}
                              className={`btn btn-sm ${u.isBanned ? 'btn-secondary' : 'btn-danger'}`}
                              style={{ fontWeight: 600 }}
                            >
                              {u.isBanned ? 'Unban User' : 'Suspend'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SAFETY REPORTS */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {reportsList.length > 0 ? (
              reportsList.map((rep) => (
                <div key={rep._id} className="card" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)', background: '#ffffff' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-rose" style={{ fontWeight: 700 }}>{rep.reason}</span>
                        <span className="badge badge-gray">Target: {rep.targetType}</span>
                        <span
                          className={`badge ${
                            rep.status === 'resolved'
                              ? 'badge-emerald'
                              : rep.status === 'dismissed'
                              ? 'badge-gray'
                              : 'badge-amber'
                          }`}
                          style={{ fontWeight: 700 }}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                        Filed by {rep.reporter?.name} ({rep.reporter?.email})
                      </h4>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p
                    style={{
                      background: 'var(--bg-main)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.925rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                      borderLeft: '3px solid var(--accent-rose)',
                    }}
                  >
                    "{rep.description}"
                  </p>

                  {rep.status === 'pending' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        onClick={() => handleUpdateReport(rep._id, 'dismissed')}
                        className="btn btn-outline btn-sm"
                        style={{ fontWeight: 600 }}
                      >
                        Dismiss Flag
                      </button>
                      <button
                        onClick={() => handleUpdateReport(rep._id, 'resolved')}
                        className="btn btn-primary btn-sm"
                        style={{ fontWeight: 700 }}
                      >
                        <Check size={16} /> Resolve & Action
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-2xl)' }}>
                <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>No pending safety reports</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.4rem' }}>
                  The community moderation queue is completely clear.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
};

export default AdminDashboardPage;
