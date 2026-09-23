import { assetUrl } from '../api/client';
import { bundledLogoFor } from '../content/clientLogos';
import { initials } from '../utils/format';

/** Client photo/logo: the image from the API, else a bundled logo for known clients, else initials. */
export default function Avatar({ name, imageUrl, className = '' }) {
  const src = assetUrl(imageUrl) || bundledLogoFor(name);
  return (
    <span className={`avatar ${className}`.trim()}>
      {src ? <img src={src} alt="" loading="lazy" /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}
