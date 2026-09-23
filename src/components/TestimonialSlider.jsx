import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { assetUrl } from '../api/client';
import ReelCard from './ReelCard';

const pad = (number) => String(number).padStart(2, '0');

export default function TestimonialSlider({ testimonials }) {
  const [index, setIndex] = useState(0);
  const reels = testimonials.filter((item) => item.reelVideoUrl);
  const count = reels.length;
  if (count === 0) return null;

  const current = reels[index % count];
  const go = (step) => setIndex((index + step + count) % count);
  const goTo = (position) => setIndex(position);

  return (
    <div className="reel-show">
      <div className="reel-show__stage">
        {count > 1 && (
          <button
            type="button"
            className="reel-show__arrow reel-show__arrow--prev"
            onClick={() => go(-1)}
            aria-label="Previous reel"
          >
            <ChevronLeft size={26} />
          </button>
        )}

        <div className="reel-show__frame">
          <ReelCard reel={current} index={index % count} />
          <p className="reel-show__meta" aria-live="polite">
            {pad((index % count) + 1)} — {pad(count)}
          </p>
        </div>

        {count > 1 && (
          <button
            type="button"
            className="reel-show__arrow reel-show__arrow--next"
            onClick={() => go(1)}
            aria-label="Next reel"
          >
            <ChevronRight size={26} />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="reel-show__rail" role="tablist" aria-label="All reels">
          {reels.map((reel, position) => {
            const active = position === index % count;
            return (
              <button
                key={reel.id}
                type="button"
                className={`reel-show__rail-item ${active ? 'is-active' : ''}`.trim()}
                onClick={() => goTo(position)}
                role="tab"
                aria-selected={active}
                aria-label={`Reel ${reel.title ?? position + 1}`}
              >
                <video src={assetUrl(reel.reelVideoUrl)} muted playsInline preload="metadata" loading="lazy" />
                <span className="reel-show__rail-num" aria-hidden="true">{pad(position + 1)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}