import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Lightbox({ images, index, onClose, onChange }) {
  const closeRef = useRef(null);
  const count = images.length;
  const image = images[index];

  const go = (step) => onChange((index + step + count) % count);

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') go(1);
      if (event.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count]);

  if (!image) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Project photos" onClick={onClose}>
      <button ref={closeRef} className="lightbox__close" onClick={onClose} aria-label="Close photos" type="button">
        <X size={26} />
      </button>

      {count > 1 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={(event) => { event.stopPropagation(); go(-1); }}
          aria-label="Previous photo"
          type="button"
        >
          <ChevronLeft size={30} />
        </button>
      )}

      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        <img src={image.src} alt={image.alt} />
        <figcaption>{index + 1} of {count}</figcaption>
      </figure>

      {count > 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={(event) => { event.stopPropagation(); go(1); }}
          aria-label="Next photo"
          type="button"
        >
          <ChevronRight size={30} />
        </button>
      )}
    </div>
  );
}
