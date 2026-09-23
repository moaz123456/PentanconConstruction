import { useRef, useState } from 'react';
import { api, assetUrl } from '../../api/client';
import { useAdminList } from './useAdminList';
import AdminNotice from './AdminNotice';
import Button from '../../components/Button';

const empty = { name: '', description: '' };

const load = () => api.categories();

export default function SectorsSection() {
  const { items, setItems, loading, error } = useAdminList(load);
  const [form, setForm] = useState(empty);
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const imageInputRef = useRef(null);

  const update = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  function resetForm() {
    setForm(empty);
    setImageFile(null);
    setRemoveImage(false);
    setEditingId(null);
    setNotice(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  function startEdit(item) {
    setForm({ name: item.name ?? '', description: item.description ?? '' });
    setImageFile(null);
    setRemoveImage(false);
    setEditingId(item.id);
    setNotice(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  function buildForm() {
    const formData = new FormData();
    formData.append('Name', form.name);
    if (form.description.trim()) formData.append('Description', form.description.trim());
    if (imageFile) formData.append('Image', imageFile);
    if (removeImage) formData.append('RemoveImage', 'true');
    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      if (editingId) {
        const updated = await api.admin.updateCategory(editingId, buildForm());
        if (updated) setItems((previous) => previous.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
        setNotice({ title: 'Sector updated.' });
      } else {
        const created = await api.admin.createCategory(buildForm());
        if (created) setItems((previous) => [created, ...previous]);
        setNotice({ title: 'Sector created.' });
      }
      resetForm();
    } catch (err) {
      setNotice({ title: 'The sector could not be saved.', text: err.message || undefined, error: true });
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete the sector "${item.name}"?`)) return;
    try {
      await api.admin.deleteCategory(item.id);
      setItems((previous) => previous.filter((entry) => entry.id !== item.id));
      if (editingId === item.id) resetForm();
    } catch (err) {
      setNotice({ title: 'The sector could not be deleted.', text: err.message || undefined, error: true });
    }
  }

  const currentImageUrl = editingId ? items.find((item) => item.id === editingId)?.imageUrl : null;

  return (
    <>
      <section className="admin-section">
        <h2>{editingId ? 'Edit sector' : 'New sector'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="sector-name">Name</label>
            <input id="sector-name" name="name" type="text" required maxLength={100} value={form.name} onChange={update('name')} placeholder="e.g. Hospital" />
          </div>
          <div className="field">
            <label htmlFor="sector-description">Description</label>
            <textarea id="sector-description" name="description" rows="3" maxLength={500} value={form.description} onChange={update('description')} placeholder="Short description shown on the projects page (optional)" />
          </div>
          <div className="field">
            <label htmlFor="sector-image">Cover image</label>
            <input
              id="sector-image"
              name="image"
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            />
            {currentImageUrl && (
              <label className="admin-check">
                <input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />
                Remove the current cover image
              </label>
            )}
            <p className="admin-hint">Shown in the menu, on the home page and on the projects landing page.</p>
          </div>
          <div className="admin-actions">
            <Button type="submit" disabled={sending}>
              {sending ? 'Saving...' : editingId ? 'Save changes' : 'Create sector'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            )}
          </div>
          <AdminNotice notice={notice} />
        </form>
      </section>

      <section className="admin-section">
        <h2>Sectors</h2>
        {error ? (
          <AdminNotice notice={{ title: 'Sectors could not be loaded.', text: error.message, error: true }} />
        ) : loading ? (
          <div className="skeleton skeleton--quote" aria-busy="true" />
        ) : items.length === 0 ? (
          <p className="admin-who">No sectors yet. Create the first one above.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li className="admin-row" key={item.id}>
                <div className="admin-row__main">
                  {assetUrl(item.imageUrl) && <img className="admin-thumb admin-thumb--cover" src={assetUrl(item.imageUrl)} alt="" loading="lazy" />}
                  <div>
                    <p className="admin-row__name">{item.name}</p>
                    {item.description && <span className="admin-row__desc">{item.description}</span>}
                  </div>
                </div>
                <div className="admin-row__actions">
                  <span className="admin-row__count">
                    {item.projectsCount == null
                      ? 'No projects'
                      : item.projectsCount === 1
                        ? '1 project'
                        : `${item.projectsCount} projects`}
                  </span>
                  <Button type="button" variant="ghost" onClick={() => startEdit(item)}>Edit</Button>
                  <Button type="button" variant="ghost" onClick={() => handleDelete(item)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}