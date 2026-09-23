import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { assetUrl } from '../api/client';

const pad = (number) => String(number).padStart(2, '0');

/** A portrait video reel card with a custom play control and on-brand editorial details. */
export default function ReelCard({ reel, index = null, showMeta = true }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }

  return (
    <figure className="reel-card">
      <div className="reel-card__media">
        <video
          ref={videoRef}
          className="reel-card__video"
          src={assetUrl(reel.reelVideoUrl)}
          playsInline
          preload="metadata"
          controls={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        <span className="reel-card__index" aria-hidden="true">{pad(index + 1)}</span>
        {!playing && (
          <button type="button" className="reel-card__play" onClick={togglePlay} aria-label={`Play reel ${reel.title ?? ''}`.trim()}>
            <Play size={18} fill="currentColor" aria-hidden="true" />
            <span>Play</span>
          </button>
        )}
      </div>
      {showMeta && (
        <figcaption className="reel-card__body">
          <p className="reel-card__eyebrow">Client reel</p>
          <h3 className="reel-card__title">{reel.title || 'Untitled reel'}</h3>
        </figcaption>
      )}
    </figure>
  );
}