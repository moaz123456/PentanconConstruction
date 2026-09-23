import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import Button from '../components/Button';

export default function NotFound() {
  usePageTitle('Page not found');

  return (
    <section className="section not-found">
      <div className="container">
        <h1 className="not-found__title">This page does not exist.</h1>
        <p>The link may be old, or the address may have a typo.</p>
        <Button as={Link} to="/">Go to the home page</Button>
      </div>
    </section>
  );
}
