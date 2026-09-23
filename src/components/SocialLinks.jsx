import { site } from '../config/site';

// Simple line icons (Feather set, MIT licence).
const icons = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  )
};

const labels = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn' };

export default function SocialLinks({ className = '' }) {
  return (
    <ul className={`social ${className}`}>
      {Object.entries(site.social).map(([key, href]) => (
        <li key={key}>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${site.shortName} on ${labels[key]}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icons[key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
