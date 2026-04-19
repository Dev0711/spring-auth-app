import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [step, setStep]       = useState('email');
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSendOtp(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await sendOtp(email); setStep('otp'); }
    catch (err) { setError(err.response?.data?.message || 'Failed to send OTP'); }
    finally { setLoading(false); }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const { data } = await verifyOtp(email, otp);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Invalid or expired OTP'); }
    finally { setLoading(false); }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-label="AuthApp logo">
            <rect width="36" height="36" rx="10" fill="var(--color-primary)"/>
            <path d="M18 8L26 13V23L18 28L10 23V13L18 8Z" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="18" cy="18" r="4" fill="white"/>
          </svg>
          <span style={s.logoText}>AuthApp</span>
        </div>

        <h1 style={s.heading}>Sign in to your account</h1>
        <p style={s.sub}>Use Google or OTP email login</p>

        <a href="/oauth2/authorization/google" style={s.googleBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 10 }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0', color:'var(--color-text-muted)', fontSize:13 }}>
          <div style={{ flex:1, borderTop:'1px solid var(--color-border)' }}/>
          <span>or</span>
          <div style={{ flex:1, borderTop:'1px solid var(--color-border)' }}/>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} style={s.form}>
            <label style={s.label}>Email address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" style={s.input} />
            {error && <p style={s.error}>{error}</p>}
            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={s.form}>
            <label style={s.label}>Enter OTP sent to {email}</label>
            <input type="text" required value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="123456" maxLength={6}
              style={{ ...s.input, letterSpacing:'0.25em', fontSize:22, textAlign:'center' }} />
            {error && <p style={s.error}>{error}</p>}
            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => { setStep('email'); setOtp(''); setError(''); }} style={s.ghostBtn}>
              ← Change email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const s = {
  page:     { minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', padding:16 },
  card:     { background:'var(--color-surface)', borderRadius:16, boxShadow:'var(--shadow-md)', padding:'40px 36px', width:'100%', maxWidth:420 },
  logo:     { display:'flex', alignItems:'center', gap:10, marginBottom:24 },
  logoText: { fontSize:20, fontWeight:700, color:'var(--color-primary)' },
  heading:  { fontSize:22, fontWeight:700, marginBottom:6 },
  sub:      { color:'var(--color-text-muted)', fontSize:14, marginBottom:24 },
  googleBtn:{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%', padding:'11px 16px', border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)', background:'#fff', color:'#28251d', fontWeight:600, fontSize:15, cursor:'pointer', textDecoration:'none' },
  form:     { display:'flex', flexDirection:'column', gap:12 },
  label:    { fontSize:13, fontWeight:600, color:'var(--color-text-muted)' },
  input:    { padding:'11px 14px', border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)', fontSize:15, outline:'none', width:'100%' },
  btn:      { background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'12px', fontWeight:700, fontSize:15, cursor:'pointer', marginTop:4 },
  ghostBtn: { background:'none', border:'none', color:'var(--color-text-muted)', fontSize:13, cursor:'pointer', textAlign:'center' },
  error:    { color:'var(--color-error)', fontSize:13 },
};
