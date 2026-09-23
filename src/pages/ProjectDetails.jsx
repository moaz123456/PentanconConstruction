import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, assetUrl } from '../api/client';
import { useProject } from '../api/hooks';
import { useQuery } from '../api/useQuery';
import { formatArea, formatDate, formatDuration, slugify, statusLabel } from '../utils/format';
import { usePageTitle } from '../hooks/usePageTitle';
import Lightbox from '../components/Lightbox';
import ProjectCard from '../components/ProjectCard';
import SectionHead from '../components/SectionHead';
import StatusMessage from '../components/StatusMessage';
import CtaBand from '../components/CtaBand';
import Button from '../components/Button';

function Specs({ project }) {
  const rows = [
    ['Location', project.location],
    ['Area', formatArea(project.area)],
    ['Duration', formatDuration(project.durationInMonths)],
    ['Completed', formatDate(project.completionDate)],
    ['Status', statusLabel(project.status)]
  ].filter(([, value]) => value);

  return (
    <dl className="specs">
      {rows.map(([label, value]) => (
        <div className="specs__row" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      {project.clientName && (
        <div className="specs__row">
          <dt>Client</dt>
          <dd>
            <Link className="link-underline" to={`/projects?client=${project.clientId}`}>{project.clientName}</Link>
          </dd>
        </div>
      )}
    </dl>
  );
}

export default function ProjectDetails() {
  const { id } = useParams();
  const { data: project, loading, error } = useProject(id);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  usePageTitle(project?.name ?? 'Project');

  const related = useQuery(
    `related:${project?.id}`,
    () => api.projects({ categoryId: project.categoryId, page: 1, pageSize: 4 }),
    { enabled: Boolean(project) }
  );

  if (loading) {
    return (
      <section className="section detail-loading" aria-busy="true">
        <div className="container"><div className="skeleton skeleton--hero" /></div>
      </section>
    );
  }

  if (error || !project) {
    const missing = error?.status === 404;
    return (
      <section className="section detail-error">
        <div className="container">
          <StatusMessage
            tone={missing ? 'neutral' : 'error'}
            title={missing ? 'This project could not be found.' : 'The project could not be loaded.'}
            text={missing ? 'It may have been removed.' : 'Check your connection and try again.'}
          >
            <Button as={Link} to="/projects">Back to projects</Button>
          </StatusMessage>
        </div>
      </section>
    );
  }

  const images = (project.images ?? []).map((image) => ({
    src: assetUrl(image.imageUrl),
    alt: image.altText || `${project.name} - photo`,
    isCover: image.isCover
  }));
  const cover = images.find((image) => image.isCover) ?? images[0];
  const paragraphs = (project.description ?? '').split(/\n{2,}/).map((text) => text.trim()).filter(Boolean);
  const relatedItems = (related.data?.items ?? []).filter((item) => item.id !== project.id).slice(0, 3);

  return (
    <>
      <section className="detail-hero">
        {cover ? (
          <img className="detail-hero__image" src={cover.src} alt={cover.alt} />
        ) : (
          <div className="detail-hero__image detail-hero__image--empty" aria-hidden="true" />
        )}
        <div className="detail-hero__shade" aria-hidden="true" />
        <div className="container detail-hero__inner">
          <Link className="detail-hero__category" to={`/projects/category/${slugify(project.categoryName)}`}>
            {project.categoryName}
          </Link>
          <h1 className="detail-hero__title">{project.name}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail">
          <div className="detail__copy">
            {paragraphs.length > 0 ? (
              paragraphs.map((text) => <p key={text}>{text}</p>)
            ) : (
              <p>More details about this project are coming soon.</p>
            )}
          </div>
          <Specs project={project} />
        </div>
      </section>

      {images.length > 1 && (
        <section className="section section--flush-top">
          <div className="container">
            <SectionHead title="Gallery" />
            <ul className="gallery">
              {images.map((image, index) => (
                <li key={image.src}>
                  <button type="button" onClick={() => setLightboxIndex(index)} aria-label={`Open photo ${index + 1} of ${images.length}`}>
                    <img src={image.src} alt={image.alt} loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {relatedItems.length > 0 && (
        <section className="section section--flush-top">
          <div className="container">
            <SectionHead title={`More ${project.categoryName.toLowerCase()} projects`} action={{ to: `/projects/category/${slugify(project.categoryName)}`, label: 'View all' }} />
            <div className="grid grid--projects">
              {relatedItems.map((item) => <ProjectCard key={item.id} project={item} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand />

      {lightboxIndex !== null && (
        <Lightbox images={images} index={lightboxIndex} onChange={setLightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  );
}
