import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { isAuthenticated, saveSession } from '../../utils/auth';
import { usePageTitle } from '../../hooks/usePageTitle';
import Button from '../../components/Button';
import logo from '../../assets/logo.png';

export default function AdminLogin() {
  usePageTitle('Admin login');
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  if (isAuthenticated()) return <Navigate to="/admin" replace />;

  const update = (field) => (event) => setValues((previous) => ({ ...previous, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      const session = await api.auth.login(values.email, values.password);
      saveSession(session);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-bar">
        <Link className="admin-bar__brand" to="/" aria-label="Pentacon Construction - site">
          <img src={logo} alt="" width="200" height="48" />
        </Link>
        <Link className="admin-link" to="/">Back to site</Link>
      </div>

      <div className="admin-shell">
        <h1>
          <span className="slash slash--lg" aria-hidden="true" />
          Admin login
        </h1>
        <p className="admin-who">Sign in with your site administrator account.</p>

        <section className="admin-section">
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={values.email}
                onChange={update('email')}
              />
            </div>
            <div className="field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={values.password}
                onChange={update('password')}
              />
            </div>

            <Button type="submit" disabled={sending}>
              {sending ? 'Signing in...' : 'Sign in'}
            </Button>

            {error && (
              <p className="admin-notice admin-notice--error" role="alert">{error}</p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}