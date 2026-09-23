import { api } from './client';
import { useQuery } from './useQuery';
import { fallbackCategories } from '../content/categories';

export const useCategories = () => useQuery('categories', api.categories);
export const useClients = () => useQuery('clients', api.clients);
export const useTestimonials = () => useQuery('testimonials', api.testimonials);

export const useProject = (id) => useQuery(`project:${id}`, () => api.project(id));

export const useLatestProjects = (count = 6) =>
  useQuery(`projects:latest:${count}`, () => api.projects({ page: 1, pageSize: count }));

/** Categories from the API, or the bundled four (Coastal, Residential, ...) until the API has some. */
export function useCategoryList() {
  const { data, loading, error } = useCategories();
  const usingFallback = !loading && (!data || data.length === 0);
  return {
    categories: usingFallback ? fallbackCategories : data ?? [],
    loading,
    error,
    usingFallback
  };
}

/** Numbers for the "Facts and figures" band - all of them come from the API. */
export function useFacts() {
  const total = useQuery('facts:total', () => api.projects({ page: 1, pageSize: 1 }));
  const completed = useQuery('facts:completed', () => api.projects({ status: 'Completed', page: 1, pageSize: 1 }));
  const clients = useClients();
  const categories = useCategories();

  const loading = total.loading || completed.loading || clients.loading || categories.loading;
  return {
    loading,
    totalProjects: total.data?.totalCount ?? 0,
    completedProjects: completed.data?.totalCount ?? 0,
    clients: clients.data?.length ?? 0,
    categories: categories.data?.length ?? 0
  };
}
