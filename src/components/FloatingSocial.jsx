import SocialLinks from './SocialLinks';

// Fixed vertical social rail, visible on every page (hidden on small screens
// where the mobile drawer already offers the links).
export default function FloatingSocial() {
  return (
    <aside className="floating-social" aria-label="Social media">
      <SocialLinks />
    </aside>
  );
}