import soilSpaces from '../assets/clients/soil-spaces.jpg';

// Logos bundled with the site. Used when the API has no image for a client/testimonial whose name
// contains the keyword. Images uploaded through the API always win.
const bundled = [{ keyword: 'soil', image: soilSpaces }];

export const bundledLogoFor = (name = '') => {
  const lower = name.toLowerCase();
  return bundled.find((b) => lower.includes(b.keyword))?.image ?? null;
};
