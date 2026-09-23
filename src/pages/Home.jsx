import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { hero, intro } from '../content/siteContent';
import { useClients, useLatestProjects, useTestimonials } from '../api/hooks';
import { assetUrl } from '../api/client';
import { bundledLogoFor } from '../content/clientLogos';
import { initials } from '../utils/format';
import { usePageTitle } from '../hooks/usePageTitle';
import Button from '../components/Button';
import SectionHead from '../components/SectionHead';
import CategoryPanels from '../components/CategoryPanels';
import ProjectCard, { ProjectCardSkeleton } from '../components/ProjectCard';
import ServicesList from '../components/ServicesList';
import FactsBand from '../components/FactsBand';
import TestimonialSlider from '../components/TestimonialSlider';
import StatusMessage from '../components/StatusMessage';
import CtaBand from '../components/CtaBand';

function Hero() {
  const videoRef = useRef(null);

  // Respect "reduce motion": keep the poster frame instead of a moving background.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause();
  }, []);

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/videos/hero-poster.jpg"
        aria-hidden="true"
        disablePictureInPicture
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero__shade" aria-hidden="true" />

      <div className="container hero__content">
        <h1 className="hero__title">
          {hero.title.map((line) => (
            <span className="hero__line" key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero__text">{hero.text}</p>
        <div className="hero__actions">
          <Button as={Link} to="/projects">View projects</Button>
          <Button as={Link} to="/contact" variant="ghost">Contact us</Button>
        </div>
      </div>
    </section>
  );
}

function RecentWork() {
  const { data, loading, error } = useLatestProjects(6);
  const items = data?.items ?? [];

  if (!loading && !error && items.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <SectionHead title="Recent work" action={{ to: '/projects', label: 'View all projects' }} />
        {error ? (
          <StatusMessage tone="error" title="Projects could not be loaded." text="Please refresh the page in a moment." />
        ) : (
          <div className="grid grid--projects">
            {loading
              ? Array.from({ length: 3 }, (_, i) => <ProjectCardSkeleton key={i} />)
              : items.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function ClientsPreview() {
  const { data } = useClients();
  const clients = (data ?? []).slice(0, 12);
  if (clients.length === 0) return null;

  return (
    <section className="section section--tight">
      <div className="container">
        <SectionHead title="Our clients" action={{ to: '/clients', label: 'View all clients' }} />
        <ul className="logo-wall">
          {clients.map((client) => {
            const src = assetUrl(client.logoUrl) || bundledLogoFor(client.name);
            return (
              <li className="logo-wall__item" key={client.id}>
                <Link to={`/projects?client=${client.id}`} title={client.name}>
                  {src ? <img src={src} alt={client.name} loading="lazy" /> : <span>{initials(client.name)}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function TestimonialsPreview() {
  const { data } = useTestimonials();
  const testimonials = data ?? [];
  if (testimonials.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <SectionHead title="Client reels" action={{ to: '/testimonials', label: 'Watch all' }} />
        <TestimonialSlider testimonials={testimonials} />
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle('');

  return (
    <>
      <Hero />

      <section className="section intro">
        <div className="container intro__inner">
          <p className="intro__statement">{intro.statement}</p>
          <Link className="link-underline" to={intro.link.to}>{intro.link.label}</Link>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="container container--wide">
          <SectionHead title="Our projects" text="Choose a sector to see the work." />
        </div>
        <CategoryPanels />
      </section>

      <RecentWork />

      <section className="section">
        <div className="container">
          <SectionHead title="What we do" action={{ to: '/services', label: 'All services' }} />
          <ServicesList limit={6} />
        </div>
      </section>

      <FactsBand />
      <ClientsPreview />
      <TestimonialsPreview />
      <CtaBand />
    </>
  );
}
