import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/api';

export default function OAuthCallback() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    if (!token) { navigate('/login'); return; }

    sessionStorage.setItem('token', token);
    getMe()
      .then(({ data }) => { login(token, data); navigate('/dashboard'); })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p style={{ color:'var(--color-text-muted)' }}>Signing you in…</p>
    </div>
  );
}
