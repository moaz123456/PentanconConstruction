import coastal from '../assets/categories/coastal.jpg';
import residential from '../assets/categories/residential.jpg';
import commercial from '../assets/categories/commercial.jpg';
import corporate from '../assets/categories/corporate.jpg';
import { assetUrl } from '../api/client';
import { slugify } from '../utils/format';

// Bundled cover images, matched to categories by name (case-insensitive). These are only a stand-in:
// once a category has its own image (uploaded through the API, see admin docs), that image is used
// instead - see imageForCategory below. Keep this for categories you haven't photographed yet.
export const categoryImages = { coastal, residential, commercial, corporate };

export const categoryImageFor = (name) => categoryImages[slugify(name)] ?? null;

/** The image to show for a category: the one stored in the API, else the bundled fallback by name. */
export const imageForCategory = (category) => assetUrl(category?.imageUrl) || categoryImageFor(category?.name);

// Shown in the menu and on the home page only while the API has no categories yet (or is unreachable).
export const fallbackCategories = Object.keys(categoryImages).map((slug) => ({
  id: `static-${slug}`,
  name: slug.charAt(0).toUpperCase() + slug.slice(1),
  description: null,
  imageUrl: null,
  projectsCount: null
}));
