import { Link } from 'react-router-dom';
import Button from './Button';

export default function CtaBand({ title = 'Planning a build or a fit-out?', text = 'Tell us about your site, your timeline and your budget. We will come back with a clear plan.' }) {
  return (
    <section className="cta-band">
      <img className="cta-band__image" src="/videos/hero-poster.jpg" alt="" loading="lazy" />
      <div className="container cta-band__inner">
        <h2 className="cta-band__title">{title}</h2>
        <p className="cta-band__text">{text}</p>
        <Button as={Link} to="/contact">Contact us</Button>
      </div>
    </section>
  );
}
