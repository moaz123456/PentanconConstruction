import { useFacts } from '../api/hooks';

// Every number here is read from the API, so it always matches what the admin has published.
export default function FactsBand() {
  const facts = useFacts();
  const items = [
    { value: facts.totalProjects, label: 'Projects in our portfolio' },
    { value: facts.completedProjects, label: 'Projects completed' },
    { value: facts.clients, label: 'Clients' },
    { value: facts.categories, label: 'Sectors' }
  ].filter((item) => item.value > 0);

  if (facts.loading || items.length === 0) return null;

  return (
    <section className="facts" aria-label="Facts and figures">
      <dl className="container facts__list">
        {items.map((item) => (
          <div className="facts__item" key={item.label}>
            <dt className="facts__label">{item.label}</dt>
            <dd className="facts__value">{item.value.toLocaleString('en-US')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
