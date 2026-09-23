import { about } from '../content/siteContent';
import { categoryImages } from '../content/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import FactsBand from '../components/FactsBand';
import CtaBand from '../components/CtaBand';

export default function About() {
  usePageTitle('About us');

  return (
    <>
      <PageHero title="About us" image={categoryImages.coastal} />

      <section className="section">
        <div className="container about">
          <p className="about__statement">{about.statement}</p>
          <div className="about__copy">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <FactsBand />

      <section className="section">
        <div className="container">
          <SectionHead title="How we work" />
          <ul className="values">
            {about.values.map((value) => (
              <li className="values__item" key={value.title}>
                <h3 className="values__title">{value.title}</h3>
                <p>{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
