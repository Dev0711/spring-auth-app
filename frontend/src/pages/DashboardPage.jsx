import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={s.page}>
      <div style={s.card}>
        {user?.pictureUrl && (
          <img src={user.pictureUrl} alt="avatar" width={72} height={72}
            style={{ borderRadius:'50%', marginBottom:16 }} />
        )}
        <h1 style={s.heading}>Welcome, {user?.name || 'User'}! 👋</h1>
        <p style={s.sub}>{user?.email}</p>

        <div style={s.infoBox}>
          {[['ID', user?.id], ['Email', user?.email], ['Name', user?.name]].map(([k, v]) => (
            <div key={k} style={s.row}>
              <span style={s.key}>{k}</span><span>{v}</span>
            </div>
          ))}
          <div style={s.row}>
            <span style={s.key}>Auth method</span>
            <span style={s.badge}>{user?.pictureUrl ? 'Google OAuth2' : 'OTP Email'}</span>
          </div>
        </div>

        <button onClick={() => { logout(); navigate('/login'); }} style={s.logoutBtn}>
          Sign out
        </button>
      </div>
    </div>
  );
}

const s = {
  page:     { minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', padding:16 },
  card:     { background:'var(--color-surface)', borderRadius:16, boxShadow:'var(--shadow-md)', padding:'40px 36px', width:'100%', maxWidth:420, display:'flex', flexDirection:'column', alignItems:'center' },
  heading:  { fontSize:22, fontWeight:700, marginBottom:4 },
  sub:      { color:'var(--color-text-muted)', fontSize:14, marginBottom:24 },
  infoBox:  { width:'100%', border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)', overflow:'hidden', marginBottom:24 },
  row:      { display:'flex', justifyContent:'space-between', padding:'10px 14px', borderBottom:'1px solid var(--color-border)', fontSize:14 },
  key:      { color:'var(--color-text-muted)', fontWeight:600 },
  badge:    { background:'#cedcd8', color:'var(--color-primary)', padding:'2px 10px', borderRadius:999, fontSize:12, fontWeight:700 },
  logoutBtn:{ background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', padding:'11px 28px', fontWeight:700, fontSize:15, cursor:'pointer' },
};
