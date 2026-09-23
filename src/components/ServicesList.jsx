import { Building2, Hammer, HardHat, KeyRound, PaintRoller, Wrench, Zap } from 'lucide-react';
import { services } from '../content/siteContent';

// Only the icons listed here are bundled. To use another icon, import it and add it to this map,
// then use its name as "icon" in src/content/siteContent.js.
const icons = { HardHat, PaintRoller, Building2, Zap, KeyRound, Hammer };

export default function ServicesList({ limit }) {
  const items = limit ? services.slice(0, limit) : services;

  return (
    <ul className="services">
      {items.map((service) => {
        const Icon = icons[service.icon] ?? Wrench;
        return (
          <li className="service" key={service.id}>
            <span className="service__icon" aria-hidden="true">
              <Icon size={28} strokeWidth={1.6} />
            </span>
            <div className="service__body">
              <h3 className="service__title">{service.title}</h3>
              <p className="service__summary">{service.summary}</p>
              {!limit && (
                <ul className="service__points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
