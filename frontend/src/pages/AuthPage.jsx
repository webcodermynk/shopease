import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isSignup) await signup(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>
        <p className="muted">
          {isSignup ? 'Sign up to start shopping.' : 'Log in to see your cart and orders.'}
        </p>

        {isSignup && (
          <>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" value={form.name} onChange={set('name')} required />
          </>
        )}

        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" className="input" value={form.email} onChange={set('email')} required />

        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="input"
          minLength={6}
          value={form.password}
          onChange={set('password')}
          required
        />

        {error && <div className="alert error">{error}</div>}

        <button className="btn btn-primary btn-lg block" disabled={busy}>
          {busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>

        <p className="switch">
          {isSignup ? (
            <>Already have an account? <Link to="/login" state={location.state}>Log in</Link></>
          ) : (
            <>New here? <Link to="/signup" state={location.state}>Create an account</Link></>
          )}
        </p>
      </form>
    </div>
  );
}
