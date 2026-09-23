import { useRef, useState } from 'react';
import { api, assetUrl } from '../../api/client';
import { useAdminList } from './useAdminList';
import AdminNotice from './AdminNotice';
import Button from '../../components/Button';

const empty = { title: '' };

const load = () => api.testimonials();

export default function TestimonialsSection() {
  const { items, setItems, loading, error } = useAdminList(load);
  const [form, setForm] = useState(empty);
  const [videoFile, setVideoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const videoInputRef = useRef(null);

  const update = (field) => (event) => setForm((previous) => ({ ...previous, [field]: event.target.value }));

  function resetForm() {
    setForm(empty);
    setVideoFile(null);
    setEditingId(null);
    setNotice(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  }

  function startEdit(item) {
    setForm({ title: item.title ?? '' });
    setVideoFile(null);
    setEditingId(item.id);
    setNotice(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  }

  function buildForm() {
    const formData = new FormData();
    formData.append('Title', form.title);
    if (videoFile) formData.append('ReelVideo', videoFile);
    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      if (editingId) {
        const updated = await api.admin.updateTestimonial(editingId, buildForm());
        if (updated) setItems((previous) => previous.map((item) => (item.id === editingId ? { ...item, ...updated } : item)));
        setNotice({ title: 'Testimonial updated.' });
      } else {
        const created = await api.admin.createTestimonial(buildForm());
        if (created) setItems((previous) => [created, ...previous]);
        setNotice({ title: 'Testimonial created.' });
      }
      resetForm();
    } catch (err) {
      setNotice({ title: 'The testimonial could not be saved.', text: err.message || undefined, error: true });
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete the reel "${item.title || 'Untitled'}"?`)) return;
    try {
      await api.admin.deleteTestimonial(item.id);
      setItems((previous) => previous.filter((entry) => entry.id !== item.id));
      if (editingId === item.id) resetForm();
    } catch (err) {
      setNotice({ title: 'The testimonial could not be deleted.', text: err.message || undefined, error: true });
    }
  }

  const currentVideoUrl = editingId ? items.find((item) => item.id === editingId)?.reelVideoUrl : null;

  return (
    <>
      <section className="admin-section">
        <h2>{editingId ? 'Edit reel' : 'New reel'}</h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="testimonial-title">Title</label>
            <input id="testimonial-title" name="title" type="text" required maxLength={150} value={form.title} onChange={update('title')} placeholder="e.g. Client work highlights" />
          </div>
          <div className="field">
            <label htmlFor="testimonial-video">Reel video</label>
            <input
              id="testimonial-video"
              name="reelVideo"
              type="file"
              accept="video/*"
              ref={videoInputRef}
              onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
              required={!editingId}
            />
            {currentVideoUrl && (
              <p className="admin-hint">Leave empty to keep the current video.</p>
            )}
            <p className="admin-hint">Portrait videos (9:16) such as WhatsApp statuses or Instagram reels look best.</p>
          </div>
          <div className="admin-actions">
            <Button type="submit" disabled={sending}>
              {sending ? 'Saving...' : editingId ? 'Save changes' : 'Create reel'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            )}
          </div>
          <AdminNotice notice={notice} />
        </form>
      </section>

      <section className="admin-section">
        <h2>Testimonials</h2>
        {error ? (
          <AdminNotice notice={{ title: 'Testimonials could not be loaded.', text: error.message, error: true }} />
        ) : loading ? (
          <div className="skeleton skeleton--quote" aria-busy="true" />
        ) : items.length === 0 ? (
          <p className="admin-who">No reels yet. Create the first one above.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li className="admin-row" key={item.id}>
                <div className="admin-row__main">
                  {assetUrl(item.reelVideoUrl) ? (
                    <video className="admin-thumb admin-thumb--video" src={assetUrl(item.reelVideoUrl)} muted playsInline preload="metadata" />
                  ) : (
                    <span className="admin-thumb admin-thumb--video admin-thumb--empty" aria-hidden="true" />
                  )}
                  <div>
                    <p className="admin-row__name">{item.title || 'Untitled'}</p>
                    {item.reelVideoUrl && <span className="admin-row__desc">Reel video</span>}
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