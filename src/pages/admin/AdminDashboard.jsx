import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { clearSession, getSession, isAuthenticated } from '../../utils/auth';
import { usePageTitle } from '../../hooks/usePageTitle';
import Button from '../../components/Button';
import logo from '../../assets/logo.png';
import SectorsSection from './SectorsSection';
import ProjectsSection from './ProjectsSection';
import ClientsSection from './ClientsSection';
import TestimonialsSection from './TestimonialsSection';

const tabs = [
  { id: 'sectors', label: 'Sectors' },
  { id: 'projects', label: 'Projects' },
  { id: 'clients', label: 'Clients' },
  { id: 'testimonials', label: 'Testimonials' }
];

export default function AdminDashboard() {
  usePageTitle('Admin dashboard');
  const navigate = useNavigate();
  const session = getSession();
  const [tab, setTab] = useState('sectors');

  // Any admin request that comes back 401 ends the session and returns to the login page.
  useEffect(() => {
    const onUnauthorized = () => {
      clearSession();
      navigate('/admin/login', { replace: true });
    };
    window.addEventListener('pentacon:unauthorized', onUnauthorized);
    return () => window.removeEventListener('pentacon:unauthorized', onUnauthorized);
  }, [navigate]);

  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />;

  function handleLogout() {
    clearSession();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="admin-page">
      <div className="admin-bar">
        <Link className="admin-bar__brand" to="/" aria-label="Pentacon Construction - site">
          <img src={logo} alt="" width="200" height="48" />
        </Link>
        <div className="admin-bar__actions">
          {session?.fullName && <span className="admin-who">Signed in as {session.fullName}</span>}
          <Link className="admin-link" to="/">Back to site</Link>
          <Button type="button" variant="ghost" className="admin-bar__logout" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>

      <div className="admin-shell">
        <h1>
          <span className="slash slash--lg" aria-hidden="true" />
          Site admin
        </h1>
        <p className="admin-who">Manage the sectors, projects, clients and testimonials that appear on the site. Changes are published immediately.</p>

        <div className="admin-tabs" role="tablist" aria-label="Admin sections">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`chip admin-tab ${tab === item.id ? 'active' : ''}`.trim()}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'sectors' && <SectorsSection />}
        {tab === 'projects' && <ProjectsSection />}
        {tab === 'clients' && <ClientsSection />}
        {tab === 'testimonials' && <TestimonialsSection />}
      </div>
    </div>
  );
}