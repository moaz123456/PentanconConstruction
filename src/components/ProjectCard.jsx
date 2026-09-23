import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { assetUrl } from '../api/client';
import { statusLabel } from '../utils/format';

export default function ProjectCard({ project, priority = false }) {
  const cover = assetUrl(project.coverImageUrl);

  return (
    <article className="project-card">
      <Link className="project-card__link" to={`/project/${project.id}`}>
        <div className="project-card__media">
          {cover ? (
            <img src={cover} alt="" loading={priority ? 'eager' : 'lazy'} decoding="async" />
          ) : (
            <div className="project-card__placeholder" aria-hidden="true" />
          )}
          {project.status && project.status !== 'Completed' && (
            <span className="project-card__badge">{statusLabel(project.status)}</span>
          )}
        </div>
        <div className="project-card__body">
          <p className="project-card__category">{project.categoryName}</p>
          <h3 className="project-card__title">{project.name}</h3>
          {project.location && (
            <p className="project-card__meta">
              <MapPin size={15} aria-hidden="true" />
              {project.location}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="project-card project-card--skeleton" aria-hidden="true">
      <div className="project-card__media skeleton" />
      <div className="project-card__body">
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--line skeleton--wide" />
      </div>
    </div>
  );
}
