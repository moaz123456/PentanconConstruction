import { categoryImages } from '../content/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHero from '../components/PageHero';
import ServicesList from '../components/ServicesList';
import CtaBand from '../components/CtaBand';

export default function Services() {
  usePageTitle('Services');

  return (
    <>
      <PageHero
        title="Services"
        text="From the first foundation to the final coat of paint, everything is handled by one accountable team."
        image={categoryImages.residential}
      />
      <section className="section">
        <div className="container">
          <ServicesList />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
