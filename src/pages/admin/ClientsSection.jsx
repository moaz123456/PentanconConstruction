import { useRef, useState } from 'react';
import { api, assetUrl } from '../../api/client';
import { useAdminList } from './useAdminList';
import AdminNotice from './AdminNotice';
import Button from '../../components/Button';

const empty = { name: '', description: '', websiteUrl: '' };

const load = () => api.clients();

export default function ClientsSection() {
  const { items, setItems, loading, error } = useAdminList(load);
  const [form, setForm] = useState(empty);
  const [logoFile, setLogoFile] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const logoInputRef = useRef(null);

  const update = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  function resetForm() {
    setForm(empty);
    setLogoFile(null);
    setRemoveLogo(false);
    setEditingId(null);
    setNotice(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  }

  function startEdit(item) {
    setForm({ name: item.name ?? '', description: item.description ?? '', websiteUrl: item.websiteUrl ?? '' });
    setLogoFile(null);
    setRemoveLogo(false);
    setEditingId(item.id);
    setNotice(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  }

  function buildForm() {
    const formData = new FormData();
    formData.append('Name', form.name);
    if (form.description.trim()) formData.append('Description', form.description.trim());
    if (form.websiteUrl.trim()) formData.append('WebsiteUrl', form.websiteUrl.trim());
    if (logoFile) formData.append('Logo', logoFile);
    if (removeLogo) formData.append('RemoveLogo', 'true');
    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      if (editingId) {
        const updated = await api.admin.updateClient(editingId, buildForm());
        if (updated) setItems((previous) => previous.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
        setNotice({ title: 'Client updated.' });
      } else {
        const created = await api.admin.createClient(buildForm());
        if (created) setItems((previous) => [created, ...previous]);
        setNotice({ title: 'Client created.' });
      }
      resetForm();
    } catch (err) {
      setNotice({ title: 'The client could not be saved.', text: err.message || undefined, error: true });
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete the client "${item.name}"?`)) return;
    try {
      await api.admin.deleteClient(item.id);
      setItems((previous) => previous.filter((entry) => entry.id !== item.id));
      if (editingId === item.id) resetForm();
    } catch (err) {
      setNotice({ title: 'The client could not be deleted.', text: err.message || undefined, error: true });
    }
  }

  const currentLogoUrl = editingId ? items.find((item) => item.id === editingId)?.logoUrl : null;

  return (
    <>
      <section className="admin-section">
        <h2>{editingId ? 'Edit client' : 'New client'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="client-name">Name</label>
            <input id="client-name" name="name" type="text" required maxLength={200} value={form.name} onChange={update('name')} />
          </div>
          <div className="field">
            <label htmlFor="client-description">Description</label>
            <textarea id="client-description" name="description" rows="3" maxLength={1000} value={form.description} onChange={update('description')} />
          </div>
          <div className="field">
            <label htmlFor="client-website">Website URL</label>
            <input id="client-website" name="websiteUrl" type="url" maxLength={500} value={form.websiteUrl} onChange={update('websiteUrl')} placeholder="https://..." />
          </div>
          <div className="field">
            <label htmlFor="client-logo">Logo</label>
            <input
              id="client-logo"
              name="logo"
              type="file"
              accept="image/*"
              ref={logoInputRef}
              onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
            />
            {currentLogoUrl && (
              <label className="admin-check">
                <input type="checkbox" checked={removeLogo} onChange={(event) => setRemoveLogo(event.target.checked)} />
                Remove the current logo
              </label>
            )}
          </div>
          <div className="admin-actions">
            <Button type="submit" disabled={sending}>
              {sending ? 'Saving...' : editingId ? 'Save changes' : 'Create client'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            )}
          </div>
          <AdminNotice notice={notice} />
        </form>
      </section>

      <section className="admin-section">
        <h2>Clients</h2>
        {error ? (
          <AdminNotice notice={{ title: 'Clients could not be loaded.', text: error.message, error: true }} />
        ) : loading ? (
          <div className="skeleton skeleton--quote" aria-busy="true" />
        ) : items.length === 0 ? (
          <p className="admin-who">No clients yet. Create the first one above.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li className="admin-row" key={item.id}>
                <div className="admin-row__main">
                  {assetUrl(item.logoUrl) && <img className="admin-thumb" src={assetUrl(item.logoUrl)} alt="" loading="lazy" />}
                  <div>
                    <p className="admin-row__name">{item.name}</p>
                    {item.description && <span className="admin-row__desc">{item.description}</span>}
                  </div>
                </div>
                <div className="admin-row__actions">
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