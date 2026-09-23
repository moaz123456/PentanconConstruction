import { Link } from 'react-router-dom';

export default function SectionHead({ title, text, action, as: Heading = 'h2' }) {
  return (
    <header className="section-head">
      <div className="section-head__main">
        <Heading className="section-head__title">
          <span className="slash" aria-hidden="true" />
          {title}
        </Heading>
        {text && <p className="section-head__text">{text}</p>}
      </div>
      {action && (
        <Link className="link-underline" to={action.to}>
          {action.label}
        </Link>
      )}
    </header>
  );
}
