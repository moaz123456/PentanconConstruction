import { Mail } from 'lucide-react';
import { site } from '../config/site';
import { categoryImages } from '../content/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHero from '../components/PageHero';
import SocialLinks from '../components/SocialLinks';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { gmailLink, whatsappLink } from '../utils/links';

export default function Contact() {
  usePageTitle('Contact');
  const { email, whatsapp } = site.contact;

  return (
    <>
      <PageHero
        title="Contact"
        text="Tell us about your project. We reply to every message."
        image={categoryImages.corporate}
      />

      <section className="section section--flush-top">
        <div className="container contact">
          <header className="contact__intro">
            <p className="contact__lead">Talk to us directly.</p>
            <p className="contact__text">
              The fastest way to reach the team is WhatsApp or email. Send us your site, your
              timeline and your budget and we will come back with a clear plan.
            </p>
          </header>

          <div className="contact-card-grid">
            {email && (
              <a className="contact-card" href={gmailLink(email, 'Website enquiry')} target="_blank" rel="noopener noreferrer">
                <span className="contact-card__icon contact-card__icon--email" aria-hidden="true">
                  <Mail size={26} />
                </span>
                <span className="contact-card__body">
                  <span className="contact-card__label">Email us on Gmail</span>
                  <span className="contact-card__value">{email}</span>
                </span>
              </a>
            )}

            {whatsapp && (
              <a className="contact-card" href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer">
                <span className="contact-card__icon" aria-hidden="true">
                  <WhatsAppIcon size={28} />
                </span>
                <span className="contact-card__body">
                  <span className="contact-card__label">Message us on WhatsApp</span>
                  <span className="contact-card__value">{whatsapp}</span>
                </span>
              </a>
            )}
          </div>

          <div className="contact__social">
            <p className="contact__social-label">Or follow our work</p>
            <SocialLinks />
          </div>
        </div>
      </section>
    </>
  );
}