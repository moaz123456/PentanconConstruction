import { Link } from 'react-router-dom';
import { useCategoryList } from '../api/hooks';
import { imageForCategory } from '../content/categories';
import { slugify } from '../utils/format';

// Slanted panels (same angle as the stem of the logo). The hovered one opens wider.
export default function CategoryPanels() {
  const { categories } = useCategoryList();

  return (
    <ul className="panels">
      {categories.map((category) => {
        const image = imageForCategory(category);
        const count = category.projectsCount;
        return (
          <li className="panels__item" key={category.id}>
            <Link className="panel" to={`/projects/category/${slugify(category.name)}`}>
              {image ? (
                <img className="panel__image" src={image} alt="" loading="lazy" />
              ) : (
                <span className="panel__image panel__image--empty" aria-hidden="true" />
              )}
              <span className="panel__shade" aria-hidden="true" />
              <span className="panel__label">
                <span className="panel__name">{category.name}</span>
                <span className="panel__count">
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
