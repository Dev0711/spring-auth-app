import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isGoogle = user?.provider === 'GOOGLE' || user?.pictureUrl;

  return (
    <div style={styles.page}>
      {/* ── Top Nav ── */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#01696f"/>
            <path d="M7 14C7 10.134 10.134 7 14 7s7 3.134 7 7-3.134 7-7 7-7-3.134-7-7z"
              fill="none" stroke="white" strokeWidth="2"/>
            <path d="M14 10v4l2.5 2.5" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={styles.navBrandText}>AuthApp</span>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </nav>

      {/* ── Main Content ── */}
      <main style={styles.main}>

        {/* Profile Card */}
        <div style={styles.profileCard}>
          <div style={styles.avatarWrap}>
            {user?.pictureUrl ? (
              <img src={user.pictureUrl} alt={user.name}
                style={styles.avatar} referrerPolicy="no-referrer" />
            ) : (
              <div style={styles.avatarFallback}>
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div style={styles.onlineDot} />
          </div>

          <div style={styles.profileInfo}>
            <h1 style={styles.profileName}>
              {user?.name || 'Welcome!'}
            </h1>
            <p style={styles.profileEmail}>{user?.email}</p>
            <span style={{
              ...styles.badge,
              background: isGoogle ? '#e8f5e9' : '#e3f2fd',
              color: isGoogle ? '#2e7d32' : '#1565c0',
            }}>
              {isGoogle ? '🔑 Google Login' : '📧 OTP Login'}
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div>
              <div style={styles.statLabel}>Email Verified</div>
              <div style={styles.statValue}>{user?.emailVerified !== false ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🔐</div>
            <div>
              <div style={styles.statLabel}>Auth Method</div>
              <div style={styles.statValue}>{isGoogle ? 'OAuth2 / Google' : 'OTP Email'}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🪪</div>
            <div>
              <div style={styles.statLabel}>User ID</div>
              <div style={styles.statValue}>#{user?.id || '—'}</div>
            </div>
          </div>
        </div>

        {/* JWT Token Card */}
        <div style={styles.tokenCard}>
          <div style={styles.tokenHeader}>
            <span style={styles.tokenTitle}>🔒 Your JWT Token</span>
            <button onClick={copyToken} style={styles.copyBtn}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p style={styles.tokenNote}>
            This token is sent automatically in the <code>Authorization: Bearer</code> header
            for every protected API request. It expires in 24 hours.
          </p>
          <div style={styles.tokenBox}>
            <code style={styles.tokenText}>
              {token ? `${token.substring(0, 60)}...` : 'No token'}
            </code>
          </div>
          <div style={styles.tokenParts}>
            {token && token.split('.').map((part, i) => (
              <div key={i} style={{
                ...styles.tokenPart,
                background: ['#fff3e0','#e8f5e9','#fce4ec'][i],
                color: ['#e65100','#1b5e20','#880e4f'][i],
              }}>
                <span style={styles.tokenPartLabel}>
                  {['Header','Payload','Signature'][i]}
                </span>
                <code style={styles.tokenPartValue}>
                  {part.substring(0, 30)}{part.length > 30 ? '...' : ''}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* API Quick Test */}
        <div style={styles.apiCard}>
          <h2 style={styles.sectionTitle}>🚀 Quick API Reference</h2>
          <div style={styles.apiList}>
            {[
              { method: 'POST', path: '/auth/send-otp',   auth: false, desc: 'Send OTP to email' },
              { method: 'POST', path: '/auth/verify-otp', auth: false, desc: 'Verify OTP → get JWT' },
              { method: 'GET',  path: '/auth/me',         auth: true,  desc: 'Get logged-in user profile' },
              { method: 'GET',  path: '/oauth2/authorization/google', auth: false, desc: 'Start Google OAuth2 flow' },
            ].map((api, i) => (
              <div key={i} style={styles.apiRow}>
                <span style={{
                  ...styles.methodBadge,
                  background: api.method === 'GET' ? '#e3f2fd' : '#e8f5e9',
                  color: api.method === 'GET' ? '#1565c0' : '#2e7d32',
                }}>{api.method}</span>
                <code style={styles.apiPath}>{api.path}</code>
                <span style={styles.apiDesc}>{api.desc}</span>
                <span style={{
                  ...styles.authBadge,
                  background: api.auth ? '#fff3e0' : '#f3e5f5',
                  color: api.auth ? '#e65100' : '#6a1b9a',
                }}>
                  {api.auth ? '🔐 JWT required' : '🌐 Public'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f7f6f2',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 2rem', height: '60px',
    background: '#fff', borderBottom: '1px solid #e0e0e0',
    position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  navBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  navBrandText: { fontWeight: 700, fontSize: '1.1rem', color: '#1a1a1a' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', borderRadius: '8px', border: '1px solid #e0e0e0',
    background: '#fff', color: '#c62828', fontWeight: 600, cursor: 'pointer',
    fontSize: '0.875rem', transition: 'all 0.15s',
  },
  main: {
    maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '1.25rem',
  },
  profileCard: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    border: '1px solid #f0f0f0',
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover',
    border: '3px solid #e0f2f1' },
  avatarFallback: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #01696f, #4caf50)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '2rem', fontWeight: 700, color: '#fff',
  },
  onlineDot: {
    position: 'absolute', bottom: '4px', right: '4px',
    width: '14px', height: '14px', borderRadius: '50%',
    background: '#4caf50', border: '2px solid #fff',
  },
  profileInfo: { flex: 1 },
  profileName: { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' },
  profileEmail: { margin: '4px 0 10px', color: '#666', fontSize: '0.95rem' },
  badge: {
    display: 'inline-block', padding: '4px 12px', borderRadius: '999px',
    fontSize: '0.8rem', fontWeight: 600,
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem',
  },
  statCard: {
    background: '#fff', borderRadius: '12px', padding: '1.25rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0',
  },
  statIcon: { fontSize: '1.75rem' },
  statLabel: { fontSize: '0.75rem', color: '#888', textTransform: 'uppercase',
    letterSpacing: '0.05em', fontWeight: 600 },
  statValue: { fontSize: '1rem', fontWeight: 700, color: '#1a1a1a', marginTop: '2px' },
  tokenCard: {
    background: '#fff', borderRadius: '16px', padding: '1.75rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0',
  },
  tokenHeader: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '0.75rem' },
  tokenTitle: { fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' },
  copyBtn: {
    padding: '6px 14px', borderRadius: '8px', border: '1px solid #e0e0e0',
    background: '#f5f5f5', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
    color: '#333',
  },
  tokenNote: { fontSize: '0.85rem', color: '#666', marginBottom: '1rem', lineHeight: 1.5 },
  tokenBox: {
    background: '#1e1e1e', borderRadius: '10px', padding: '1rem',
    overflowX: 'auto', marginBottom: '1rem',
  },
  tokenText: { color: '#a5d6a7', fontSize: '0.8rem', wordBreak: 'break-all', fontFamily: 'monospace' },
  tokenParts: { display: 'flex', flexDirection: 'column', gap: '6px' },
  tokenPart: { borderRadius: '8px', padding: '10px 14px' },
  tokenPartLabel: { fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.06em', display: 'block', marginBottom: '4px' },
  tokenPartValue: { fontSize: '0.78rem', fontFamily: 'monospace', wordBreak: 'break-all' },
  apiCard: {
    background: '#fff', borderRadius: '16px', padding: '1.75rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0',
  },
  sectionTitle: { margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' },
  apiList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  apiRow: {
    display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
    padding: '10px 14px', borderRadius: '10px', background: '#fafafa',
    border: '1px solid #f0f0f0',
  },
  methodBadge: {
    padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem',
    fontWeight: 700, fontFamily: 'monospace',
  },
  apiPath: { fontSize: '0.85rem', fontFamily: 'monospace', color: '#333', flex: 1 },
  apiDesc: { fontSize: '0.82rem', color: '#666' },
  authBadge: { padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 },
};
