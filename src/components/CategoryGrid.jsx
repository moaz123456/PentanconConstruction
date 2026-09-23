import { Link } from 'react-router-dom';
import { imageForCategory } from '../content/categories';
import { slugify } from '../utils/format';

// The landing view of the Projects page: pick a sector, then see the projects inside it.
export default function CategoryGrid({ categories }) {
  return (
    <ul className="category-grid">
      {categories.map((category) => {
        const image = imageForCategory(category);
        const count = category.projectsCount;
        return (
          <li key={category.id}>
            <Link className="category-card" to={`/projects/category/${slugify(category.name)}`}>
              <span className="category-card__media">
                {image ? (
                  <img src={image} alt="" loading="lazy" />
                ) : (
                  <span className="category-card__placeholder" aria-hidden="true" />
                )}
              </span>
              <span className="category-card__label">
                <span className="category-card__name">{category.name}</span>
                <span className="category-card__count">
                  {count == null ? 'View projects' : count === 1 ? '1 project' : `${count} projects`}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
