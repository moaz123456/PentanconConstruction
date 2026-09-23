import { useTestimonials } from '../api/hooks';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHero from '../components/PageHero';
import SectionHead from '../components/SectionHead';
import ReelCard from '../components/ReelCard';
import StatusMessage from '../components/StatusMessage';
import CtaBand from '../components/CtaBand';

export default function Testimonials() {
  usePageTitle('Testimonials');
  const { data, loading, error } = useTestimonials();
  const reels = (data ?? []).filter((item) => item.reelVideoUrl);

  return (
    <>
      <PageHero title="Testimonials" text="Watch our clients talk about working with us." />
      <section className="section section--flush-top">
        <div className="container">
          <SectionHead
            title="Client reels"
            text="Short, first-person videos from the people we build and finish for. Press play or skim the captions above each film."
          />
          {error ? (
            <StatusMessage tone="error" title="Testimonials could not be loaded." text="Check your connection and try again." />
          ) : loading ? (
            <div className="reel-grid" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => <div className="skeleton skeleton--reel" key={i} />)}
            </div>
          ) : reels.length === 0 ? (
            <StatusMessage title="Client testimonials are coming soon." />
          ) : (
            <ul className="reel-grid">
              {reels.map((reel, index) => (
                <li key={reel.id}>
                  <ReelCard reel={reel} index={index} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}