import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/api';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const errorParam = params.get('error');

    if (errorParam) {
      setError('Google login failed: ' + errorParam);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!token) {
      setError('No token received. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
      return;
    }

    // Token received — fetch user profile then redirect to dashboard
    getMe(token)
      .then(({ data }) => {
        login(token, data);
        navigate('/dashboard', { replace: true });
      })
      .catch((err) => {
        console.error('Failed to fetch user after OAuth2:', err);
        setError('Authentication succeeded but failed to load profile. Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
      });
  }, []);

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Something went wrong</h2>
          <p style={styles.errorMsg}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.spinner} />
        <h2 style={styles.title}>Signing you in...</h2>
        <p style={styles.sub}>Completing Google authentication, please wait.</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: '#f7f6f2',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: '#fff', borderRadius: '20px', padding: '3rem 2.5rem',
    textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
    minWidth: '320px',
  },
  spinner: {
    width: '48px', height: '48px', margin: '0 auto 1.5rem',
    border: '4px solid #e0f2f1', borderTop: '4px solid #01696f',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  title: { margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700, color: '#1a1a1a' },
  sub: { color: '#777', fontSize: '0.9rem', margin: 0 },
  errorIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  errorTitle: { margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700, color: '#c62828' },
  errorMsg: { color: '#666', fontSize: '0.9rem', margin: 0 },
};
