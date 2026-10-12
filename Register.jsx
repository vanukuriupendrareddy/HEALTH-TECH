import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { Alert, Field } from '../components/ui.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', phone: '', village: '', role: 'farmer' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(f);
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
        <h1>Create your account</h1>
        <Alert>{error}</Alert>
        <form className="form" onSubmit={submit}>
          <Field label="Full name"><input required value={f.name} onChange={set('name')} /></Field>
          <Field label="Email"><input type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></Field>
          <Field label="Password" hint="At least 6 characters"><input type="password" required minLength={6} autoComplete="new-password" value={f.password} onChange={set('password')} /></Field>
          <div className="form-grid">
            <Field label="Phone"><input value={f.phone} onChange={set('phone')} /></Field>
            <Field label="Village / town"><input value={f.village} onChange={set('village')} /></Field>
          </div>
          <Field label="I am a">
            <select value={f.role} onChange={set('role')}>
              <option value="farmer">Farmer / livestock owner</option>
              <option value="veterinarian">Veterinary professional</option>
            </select>
          </Field>
          <button className="btn" disabled={busy}>{busy ? 'Creating…' : 'Sign up'}</button>
        </form>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
