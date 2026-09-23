import { Link } from 'react-router-dom';
import { useClients } from '../api/hooks';
import { assetUrl } from '../api/client';
import { bundledLogoFor } from '../content/clientLogos';
import { initials } from '../utils/format';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHero from '../components/PageHero';
import StatusMessage from '../components/StatusMessage';

export default function Clients() {
  usePageTitle('Clients');
  const { data, loading, error } = useClients();
  const clients = data ?? [];

  return (
    <>
      <PageHero title="Clients" text="The companies and families we have built for." />
      <section className="section section--flush-top">
        <div className="container">
          {error ? (
            <StatusMessage tone="error" title="Clients could not be loaded." text="Check your connection and try again." />
          ) : loading ? (
            <ul className="client-grid" aria-busy="true">
              {Array.from({ length: 8 }, (_, i) => <li key={i} className="client skeleton skeleton--tile" />)}
            </ul>
          ) : clients.length === 0 ? (
            <StatusMessage title="Our client list is coming soon." />
          ) : (
            <ul className="client-grid">
              {clients.map((client) => {
                const src = assetUrl(client.logoUrl) || bundledLogoFor(client.name);
                return (
                  <li className="client" key={client.id}>
                    <Link className="client__logo" to={`/projects?client=${client.id}`} aria-label={`Projects for ${client.name}`}>
                      {src ? <img src={src} alt="" loading="lazy" /> : <span aria-hidden="true">{initials(client.name)}</span>}
                    </Link>
                    <h2 className="client__name">{client.name}</h2>
                    {client.description && <p className="client__text">{client.description}</p>}
                    <p className="client__links">
                      <Link className="link-underline" to={`/projects?client=${client.id}`}>Their projects</Link>
                      {client.websiteUrl && (
                        <a className="link-underline" href={client.websiteUrl} target="_blank" rel="noopener noreferrer">Website</a>
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
