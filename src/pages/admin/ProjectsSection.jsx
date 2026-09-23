import { useEffect, useState } from 'react';
import { api, assetUrl } from '../../api/client';
import { useAdminList } from './useAdminList';
import { statusLabel } from '../../utils/format';
import AdminNotice from './AdminNotice';
import ProjectImagesPanel from './ProjectImagesPanel';
import Button from '../../components/Button';

const empty = {
  name: '',
  categoryId: '',
  clientId: '',
  status: 'Planned',
  location: '',
  area: '',
  durationInMonths: '',
  completionDate: '',
  description: ''
};

const STATUSES = ['Planned', 'InProgress', 'Completed'];

const loadProjects = () => api.projects({ page: 1, pageSize: 100 }).then((result) => result.items ?? []);

export default function ProjectsSection() {
  const { items, setItems, loading, error } = useAdminList(loadProjects);
  const [options, setOptions] = useState({ categories: [], clients: [] });
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const [openImages, setOpenImages] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.categories(), api.clients()])
      .then(([categories, clients]) => {
        if (!cancelled) setOptions({ categories, clients });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const update = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  function resetForm() {
    setForm(empty);
    setEditingId(null);
    setNotice(null);
  }

  async function startEdit(project) {
    resetForm();
    setEditingId(project.id);
    setNotice(null);
    try {
      const full = await api.project(project.id);
      setForm({
        name: full.name ?? '',
        categoryId: full.categoryId ? String(full.categoryId) : '',
        clientId: full.clientId ? String(full.clientId) : '',
        status: full.status ?? 'Planned',
        location: full.location ?? '',
        area: full.area != null ? String(full.area) : '',
        durationInMonths: full.durationInMonths != null ? String(full.durationInMonths) : '',
        completionDate: full.completionDate ?? '',
        description: full.description ?? ''
      });
    } catch (err) {
      setNotice({ title: 'The project could not be loaded for editing.', text: err.message || undefined, error: true });
    }
  }

  function buildPayload() {
    return {
      name: form.name.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      area: form.area === '' ? null : Number(form.area),
      durationInMonths: form.durationInMonths === '' ? null : Number(form.durationInMonths),
      completionDate: form.completionDate || null,
      status: form.status,
      categoryId: Number(form.categoryId),
      clientId: form.clientId === '' ? null : Number(form.clientId)
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.categoryId) {
      setNotice({ title: 'Choose a sector for the project.', error: true });
      return;
    }
    setSending(true);
    setNotice(null);
    try {
      if (editingId) {
        const updated = await api.admin.updateProject(editingId, buildPayload());
        if (updated) setItems((previous) => previous.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
        setNotice({ title: 'Project updated.' });
      } else {
        const created = await api.admin.createProject(buildPayload());
        if (created) setItems((previous) => [created, ...previous]);
        setNotice({ title: 'Project created.' });
      }
      resetForm();
    } catch (err) {
      setNotice({ title: 'The project could not be saved.', text: err.message || undefined, error: true });
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete the project "${project.name}"? Its photos will be removed too.`)) return;
    try {
      await api.admin.deleteProject(project.id);
      setItems((previous) => previous.filter((entry) => entry.id !== project.id));
      if (editingId === project.id) resetForm();
    } catch (err) {
      setNotice({ title: 'The project could not be deleted.', text: err.message || undefined, error: true });
    }
  }

  return (
    <>
      <section className="admin-section">
        <h2>{editingId ? 'Edit project' : 'New project'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="project-name">Name</label>
            <input id="project-name" name="name" type="text" required maxLength={200} value={form.name} onChange={update('name')} />
          </div>

          <div className="field">
            <label htmlFor="project-category">Sector</label>
            <select id="project-category" name="categoryId" required value={form.categoryId} onChange={update('categoryId')}>
              <option value="" disabled>Choose a sector...</option>
              {options.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="project-client">Client</label>
            <select id="project-client" name="clientId" value={form.clientId} onChange={update('clientId')}>
              <option value="">No client</option>
              {options.clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="project-status">Status</label>
            <select id="project-status" name="status" value={form.status} onChange={update('status')}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>{statusLabel(status)}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="project-location">Location</label>
            <input id="project-location" name="location" type="text" maxLength={200} value={form.location} onChange={update('location')} />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="project-area">Area (m²)</label>
              <input id="project-area" name="area" type="number" min="0.01" step="any" value={form.area} onChange={update('area')} />
            </div>
            <div className="field">
              <label htmlFor="project-duration">Duration (months)</label>
              <input id="project-duration" name="durationInMonths" type="number" min="1" value={form.durationInMonths} onChange={update('durationInMonths')} />
            </div>
          </div>

          <div className="field">
            <label htmlFor="project-completion">Completion date</label>
            <input id="project-completion" name="completionDate" type="date" value={form.completionDate} onChange={update('completionDate')} />
          </div>

          <div className="field">
            <label htmlFor="project-description">Description</label>
            <textarea id="project-description" name="description" rows="6" maxLength={4000} value={form.description} onChange={update('description')} />
          </div>

          <div className="admin-actions">
            <Button type="submit" disabled={sending}>
              {sending ? 'Saving...' : editingId ? 'Save changes' : 'Create project'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            )}
          </div>
          <AdminNotice notice={notice} />
        </form>
      </section>

      <section className="admin-section">
        <h2>Projects</h2>
        {error ? (
          <AdminNotice notice={{ title: 'Projects could not be loaded.', text: error.message, error: true }} />
        ) : loading ? (
          <div className="skeleton skeleton--quote" aria-busy="true" />
        ) : items.length === 0 ? (
          <p className="admin-who">No projects yet. Create the first one above.</p>
        ) : (
          <ul>
            {items.map((project) => (
              <li className="admin-row" key={project.id}>
                <div className="admin-row__main">
                  {assetUrl(project.coverImageUrl) && <img className="admin-thumb" src={assetUrl(project.coverImageUrl)} alt="" loading="lazy" />}
                  <div>
                    <p className="admin-row__name">{project.name}</p>
                    <span className="admin-row__desc">
                      {project.categoryName}
                      {project.location ? ` / ${project.location}` : ''} / {statusLabel(project.status)}
                    </span>
                  </div>
                </div>
                <div className="admin-row__actions">
                  <Button type="button" variant="ghost" onClick={() => startEdit(project)}>Edit</Button>
                  <Button type="button" variant="ghost" onClick={() => setOpenImages({ id: project.id, name: project.name })}>Photos</Button>
                  <Button type="button" variant="ghost" onClick={() => handleDelete(project)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {openImages && (
        <ProjectImagesPanel
          projectId={openImages.id}
          projectName={openImages.name}
          onClose={() => setOpenImages(null)}
        />
      )}
    </>
  );
}