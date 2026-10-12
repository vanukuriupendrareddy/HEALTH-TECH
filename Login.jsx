import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { Alert, Field } from '../components/ui.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="brand"><span className="brand-mark">+</span> HEALTH TECH</div>
        <h1>Welcome back</h1>
        <p className="muted">Livestock health monitoring and disease prevention.</p>
        <Alert>{error}</Alert>
        <form className="form" onSubmit={submit}>
          <Field label="Email"><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Password"><input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</button>
        </form>
        <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      </div>
    </div>
  );
}
