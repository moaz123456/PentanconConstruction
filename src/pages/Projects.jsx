import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCategoryList, useClients } from '../api/hooks';
import { slugify } from '../utils/format';
import { usePageTitle } from '../hooks/usePageTitle';
import PageHero from '../components/PageHero';
import CategoryGrid from '../components/CategoryGrid';
import ProjectCard, { ProjectCardSkeleton } from '../components/ProjectCard';
import StatusMessage from '../components/StatusMessage';
import Button from '../components/Button';

const PAGE_SIZE = 9;

/** Projects inside one category, or inside one client's history. Fetches and paginates. */
function ProjectList({ categoryId, clientId, categoriesError }) {
  const [state, setState] = useState({ items: [], total: 0, page: 0, loading: true, loadingMore: false, error: null });
  const latestRequest = useRef(0);

  const load = useCallback(
    async (page) => {
      const requestId = ++latestRequest.current;
      setState((previous) =>
        page === 1
          ? { ...previous, items: [], loading: true, error: null }
          : { ...previous, loadingMore: true, error: null }
      );
      try {
        const result = await api.projects({ categoryId, clientId, page, pageSize: PAGE_SIZE });
        if (requestId !== latestRequest.current) return;
        setState((previous) => ({
          items: page === 1 ? result.items : [...previous.items, ...result.items],
          total: result.totalCount,
          page,
          loading: false,
          loadingMore: false,
          error: null
        }));
      } catch (error) {
        if (requestId !== latestRequest.current) return;
        setState((previous) => ({ ...previous, loading: false, loadingMore: false, error }));
      }
    },
    [categoryId, clientId]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const { items, total, loading, loadingMore } = state;
  // If the categories request itself failed, the API is down: say so instead of "no projects".
  const error = state.error || categoriesError;

  if (error) {
    return (
      <StatusMessage tone="error" title="Projects could not be loaded." text="Check your connection and try again.">
        <Button type="button" onClick={() => window.location.reload()}>Try again</Button>
      </StatusMessage>
    );
  }

  if (loading) {
    return (
      <div className="grid grid--projects" aria-busy="true">
        {Array.from({ length: 6 }, (_, index) => <ProjectCardSkeleton key={index} />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <StatusMessage title="No projects here yet." text="New work is added regularly. In the meantime, browse the other sectors or get in touch.">
        <Link className="link-underline" to="/projects">See all categories</Link>
      </StatusMessage>
    );
  }

  return (
    <>
      <div className="grid grid--projects">
        {items.map((project, index) => (
          <ProjectCard key={project.id} project={project} priority={index < 3} />
        ))}
      </div>
      <div className="load-more">
        <p>Showing {items.length} of {total}</p>
        {items.length < total && (
          <Button type="button" variant="ghost" onClick={() => load(state.page + 1)} disabled={loadingMore}>
            {loadingMore ? 'Loading...' : 'Load more projects'}
          </Button>
        )}
      </div>
    </>
  );
}

export default function Projects() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const clientParam = searchParams.get('client');
  const clientId = clientParam && /^\d+$/.test(clientParam) ? Number(clientParam) : undefined;

  const { categories, loading: categoriesLoading, error: categoriesError } = useCategoryList();
  const clients = useClients();

  const category = slug ? categories.find((item) => slugify(item.name) === slug) : undefined;
  // Bundled fallback categories have text ids, so only a real API category can filter the list.
  const categoryId = typeof category?.id === 'number' ? category.id : undefined;
  const waitingForCategories = Boolean(slug) && categoriesLoading;
  const categoryNotFound = Boolean(slug) && !categoriesLoading && categoryId === undefined;
  const client = clientId ? clients.data?.find((item) => item.id === clientId) : undefined;

  usePageTitle(category?.name ?? (client ? client.name : 'Projects'));

  const showLanding = !slug && !clientId;

  const heroTitle = category ? category.name : client ? `Projects for ${client.name}` : 'Projects';
  const heroText = category?.description
    ? category.description
    : category
      ? `Our ${category.name.toLowerCase()} projects.`
      : client
        ? `A selection of the work we have delivered for ${client.name}.`
        : 'Choose a sector to see the projects inside it.';

  return (
    <>
      <PageHero title={heroTitle} text={heroText} />

      <section className="section section--flush-top">
        <div className="container">
          {showLanding ? (
            categoriesError ? (
              <StatusMessage tone="error" title="Categories could not be loaded." text="Check your connection and try again.">
                <Button type="button" onClick={() => window.location.reload()}>Try again</Button>
              </StatusMessage>
            ) : categoriesLoading ? (
              <div className="category-grid" aria-busy="true">
                {Array.from({ length: 4 }, (_, index) => <div className="skeleton skeleton--tile" key={index} />)}
              </div>
            ) : (
              <CategoryGrid categories={categories} />
            )
          ) : (
            <>
              <nav className="chips" aria-label="Project sectors">
                <NavLink className="chip" to="/projects" end>All categories</NavLink>
                {categories.map((item) => (
                  <NavLink className="chip" key={item.id} to={`/projects/category/${slugify(item.name)}`}>
                    {item.name}
                  </NavLink>
                ))}
                {client && (
                  <Link className="chip chip--filter" to="/projects" aria-label={`Remove filter: ${client.name}`}>
                    Client: {client.name} &times;
                  </Link>
                )}
              </nav>

              {categoryNotFound ? (
                <StatusMessage title="This sector could not be found." text="It may have been renamed or removed.">
                  <Link className="link-underline" to="/projects">See all categories</Link>
                </StatusMessage>
              ) : waitingForCategories ? (
                <div className="grid grid--projects" aria-busy="true">
                  {Array.from({ length: 6 }, (_, index) => <ProjectCardSkeleton key={index} />)}
                </div>
              ) : (
                <ProjectList categoryId={categoryId} clientId={clientId} categoriesError={slug ? categoriesError : null} />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
