import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { api, assetUrl } from '../../api/client';
import AdminNotice from './AdminNotice';
import Button from '../../components/Button';

const sortImages = (images) => [...images].sort((a, b) => a.displayOrder - b.displayOrder);

export default function ProjectImagesPanel({ projectId, projectName, onClose }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);
  const uploadRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    api.project(projectId)
      .then((project) => setImages(sortImages(project.images ?? [])))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(event) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setNotice(null);
    try {
      const result = await api.admin.uploadProjectImages(projectId, files);
      setImages(sortImages(result ?? []));
    } catch (err) {
      setNotice({ title: 'The photos could not be uploaded.', text: err.message || undefined, error: true });
    } finally {
      setUploading(false);
      if (uploadRef.current) uploadRef.current.value = '';
    }
  }

  function handleAltChange(imageId, value) {
    setImages((previous) => previous.map((image) => (image.id === imageId ? { ...image, altText: value } : image)));
  }

  async function handleAltSave(image) {
    setBusyId(image.id);
    setNotice(null);
    try {
      const updated = await api.admin.updateProjectImage(projectId, image.id, image.altText ?? null);
      setImages((previous) => previous.map((entry) => (entry.id === image.id ? { ...entry, ...updated } : entry)));
    } catch (err) {
      setNotice({ title: 'The caption could not be saved.', text: err.message || undefined, error: true });
    } finally {
      setBusyId(null);
    }
  }

  async function handleCover(image) {
    setBusyId(image.id);
    setNotice(null);
    try {
      const result = await api.admin.setProjectImageCover(projectId, image.id);
      setImages(sortImages(result ?? []));
    } catch (err) {
      setNotice({ title: 'The cover could not be changed.', text: err.message || undefined, error: true });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(image) {
    if (!window.confirm('Delete this photo?')) return;
    setBusyId(image.id);
    setNotice(null);
    try {
      await api.admin.deleteProjectImage(projectId, image.id);
      setImages((previous) => previous.filter((entry) => entry.id !== image.id));
    } catch (err) {
      setNotice({ title: 'The photo could not be deleted.', text: err.message || undefined, error: true });
    } finally {
      setBusyId(null);
    }
  }

  async function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    setNotice(null);
    try {
      const result = await api.admin.reorderProjectImages(projectId, next.map((image) => image.id));
      setImages(sortImages(result ?? []));
    } catch (err) {
      setNotice({ title: 'The order could not be saved.', text: err.message || undefined, error: true });
      load();
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel__head">
        <h3 className="admin-panel__title">Photos &mdash; {projectName}</h3>
        <button type="button" className="admin-close" onClick={onClose} aria-label="Close photos">
          <X size={20} />
        </button>
      </div>

      <div className="field">
        <label htmlFor={`project-upload-${projectId}`}>Upload photos</label>
        <input
          id={`project-upload-${projectId}`}
          name="files"
          type="file"
          accept="image/*"
          multiple
          ref={uploadRef}
          onChange={handleUpload}
          disabled={uploading}
        />
        <p className="admin-hint">The first photo becomes the cover. You can change it below.</p>
      </div>

      <AdminNotice notice={notice} />

      {loading ? (
        <div className="skeleton skeleton--quote" aria-busy="true" />
      ) : images.length === 0 ? (
        <p className="admin-who">No photos yet. Add the first one above.</p>
      ) : (
        <ul className="admin-images">
          {images.map((image, index) => (
            <li className="admin-image" key={image.id}>
              <img
                className="admin-image__thumb"
                src={assetUrl(image.imageUrl)}
                alt={image.altText ?? ''}
                loading="lazy"
              />
              <div className="admin-image__alt">
                <input
                  type="text"
                  value={image.altText ?? ''}
                  onChange={(event) => handleAltChange(image.id, event.target.value)}
                  placeholder="Caption (alt text)"
                  maxLength={200}
                />
                <Button type="button" variant="ghost" disabled={busyId === image.id} onClick={() => handleAltSave(image)}>
                  Save
                </Button>
              </div>
              <div className="admin-image__actions">
                <button type="button" className="admin-mini-btn" disabled={index === 0 || busyId === image.id} onClick={() => move(index, -1)} aria-label="Move earlier">
                  <ChevronUp size={16} />
                </button>
                <button type="button" className="admin-mini-btn" disabled={index === images.length - 1 || busyId === image.id} onClick={() => move(index, 1)} aria-label="Move later">
                  <ChevronDown size={16} />
                </button>
                {!image.isCover && (
                  <Button type="button" variant="ghost" disabled={busyId === image.id} onClick={() => handleCover(image)}>
                    Make cover
                  </Button>
                )}
                {image.isCover && <span className="admin-cover-badge">Cover</span>}
                <Button type="button" variant="ghost" disabled={busyId === image.id} onClick={() => handleDelete(image)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}